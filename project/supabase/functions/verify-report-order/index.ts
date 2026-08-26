import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const cashfreeAppId = Deno.env.get("CASHFREE_APP_ID");
    const cashfreeSecretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    const isProduction = Deno.env.get("CASHFREE_PRODUCTION") === "true";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderId } = await req.json();
    if (!orderId) throw new Error("orderId required");

    // Load order
    const { data: order } = await supabase
      .from("report_orders").select("*").eq("cashfree_order_id", orderId).maybeSingle();
    if (!order) {
      return new Response(JSON.stringify({ success: false, error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let paid = order.status === "success";

    // If not yet marked paid, confirm with Cashfree (authoritative)
    if (!paid && cashfreeAppId && cashfreeSecretKey) {
      const base = isProduction ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
      const cfRes = await fetch(`${base}/orders/${orderId}`, {
        headers: {
          "x-client-id": cashfreeAppId,
          "x-client-secret": cashfreeSecretKey,
          "x-api-version": "2023-08-01",
        },
      });
      const cf = await cfRes.json();
      if (cfRes.ok && cf.order_status === "PAID") {
        paid = true;
        await supabase.from("report_orders")
          .update({ status: "success", gateway_status: "PAID", paid_at: new Date().toISOString() })
          .eq("cashfree_order_id", orderId);
        // fire-and-forget email (idempotent via emailed_at)
        try {
          fetch(`${supabaseUrl}/functions/v1/send-report-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${supabaseServiceKey}` },
            body: JSON.stringify({ orderId }),
          }).catch(() => {});
        } catch (_e) { /* ignore */ }
      }
    }
    // Mock order (no Cashfree) -> treat as paid for testing
    if (!paid && orderId.startsWith("RPT_") && !cashfreeAppId) paid = true;

    if (!paid) {
      return new Response(JSON.stringify({ success: true, paid: false, status: order.status }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Return intake for PDF generation
    const { data: rr } = await supabase
      .from("report_requests").select("report_key, input_json, profile_json")
      .eq("id", order.report_request_id).maybeSingle();

    return new Response(JSON.stringify({
      success: true, paid: true,
      reportKey: order.report_key, amount: order.amount,
      inputJson: rr?.input_json || {}, profileJson: rr?.profile_json || {},
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("verify-report-order error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message || "Failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);
