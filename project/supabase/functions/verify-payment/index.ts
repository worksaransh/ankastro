import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPaymentRequest {
  orderId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const cashfreeAppId = Deno.env.get("CASHFREE_APP_ID");
    const cashfreeSecretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    const isProduction = Deno.env.get("CASHFREE_PRODUCTION") === "true";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { orderId }: VerifyPaymentRequest = await req.json();
    
    if (!orderId) {
      throw new Error("Order ID is required");
    }
    
    // Check if payment exists in database
    const { data: existingPayment, error: fetchError } = await supabase
      .from("payments")
      .select("*")
      .eq("cashfree_order_id", orderId)
      .single();
    
    if (fetchError || !existingPayment) {
      // For mock payments during testing
      if (orderId.startsWith("ANKJ_")) {
        await supabase
          .from("payments")
          .update({ status: "success", updated_at: new Date().toISOString() })
          .eq("cashfree_order_id", orderId);

        return new Response(
          JSON.stringify({ success: true, status: "success", message: "Payment verified (test mode)" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Payment record not found");
    }

    // If already marked as success, return immediately (idempotent)
    if (existingPayment.status === "success" || existingPayment.status === "SUCCESS") {
      return new Response(
        JSON.stringify({ success: true, status: "success", message: "Payment already verified" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If Cashfree is not configured, mark as success for testing
    if (!cashfreeAppId || !cashfreeSecretKey) {
      await supabase
        .from("payments")
        .update({ status: "success", updated_at: new Date().toISOString() })
        .eq("cashfree_order_id", orderId);

      return new Response(
        JSON.stringify({ success: true, status: "success", message: "Payment verified (mock mode)" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify with Cashfree API — retry up to 3 times to handle webhook lag
    const cashfreeBaseUrl = isProduction
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

    let cashfreeData: any = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const cashfreeResponse = await fetch(`${cashfreeBaseUrl}/orders/${orderId}`, {
          method: "GET",
          headers: {
            "x-client-id": cashfreeAppId,
            "x-client-secret": cashfreeSecretKey,
            "x-api-version": "2023-08-01",
          },
        });

        cashfreeData = await cashfreeResponse.json();

        if (!cashfreeResponse.ok) {
          lastError = cashfreeData?.message || `HTTP ${cashfreeResponse.status}`;
          console.warn(`Cashfree verify attempt ${attempt} failed:`, lastError);
        } else if (cashfreeData?.order_status === "PAID") {
          break;
        } else {
          console.log(`Attempt ${attempt}: order_status=${cashfreeData?.order_status}, retrying...`);
        }
      } catch (err: any) {
        lastError = err.message;
        console.warn(`Cashfree verify attempt ${attempt} threw:`, err);
      }

      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }

    if (!cashfreeData) {
      throw new Error(lastError || "Failed to verify payment with Cashfree");
    }

    const rawStatus = cashfreeData.order_status;
    const status = rawStatus === "PAID" ? "success" : (rawStatus || "pending").toLowerCase();

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status,
        gateway_status: rawStatus || null,
        updated_at: new Date().toISOString(),
      })
      .eq("cashfree_order_id", orderId);

    if (updateError) {
      console.error("Database update error:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: status === "success",
        status,
        orderAmount: cashfreeData.order_amount,
        message: status === "success" ? "Payment verified successfully" : `Payment status: ${status}`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to verify payment" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);
