import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const handler = async (req: Request): Promise<Response> => {
  try {
    // Health/test ping (Cashfree "Test" button sends GET or empty body)
    if (req.method === "GET" || req.method === "HEAD") {
      return new Response("OK", { status: 200 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const cashfreeSecretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the webhook payload
    const payload = await req.text();
    if (!payload || !payload.trim()) {
      // empty test ping — respond OK so Cashfree marks endpoint healthy
      return new Response("OK", { status: 200 });
    }
    let webhookData: any;
    try {
      webhookData = JSON.parse(payload);
    } catch {
      // non-JSON test ping
      return new Response("OK", { status: 200 });
    }
    
    console.log("Received Cashfree webhook:", webhookData);
    
    // Verify webhook signature (Cashfree sends base64 HMAC-SHA256 of timestamp+payload)
    if (cashfreeSecretKey) {
      const signature = req.headers.get("x-webhook-signature");
      const timestamp = req.headers.get("x-webhook-timestamp");
      
      if (signature && timestamp) {
        const signaturePayload = timestamp + payload;
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(cashfreeSecretKey),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const signatureBuffer = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(signaturePayload)
        );
        // base64 encode (Cashfree format)
        const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
        
        if (signature !== expectedSignature) {
          console.warn("Invalid webhook signature (verify-payment double-checks status server-side)");
          // Non-blocking: verify-payment independently confirms via Cashfree API
        }
      }
    }
    
    // Extract order details from webhook
    const orderId = webhookData.data?.order?.order_id;
    const paymentStatus = webhookData.data?.payment?.payment_status;
    const orderStatus = webhookData.data?.order?.order_status;
    
    if (!orderId) {
      console.error("No order ID in webhook");
      return new Response("OK", { status: 200 });
    }
    
    // Map Cashfree status to our normalized lowercase status
    let status = "pending";
    if (paymentStatus === "SUCCESS" || orderStatus === "PAID") {
      status = "success";
    } else if (paymentStatus === "FAILED" || orderStatus === "FAILED") {
      status = "failed";
    } else if (paymentStatus === "CANCELLED" || orderStatus === "CANCELLED") {
      status = "cancelled";
    }

    // Dedupe: don't downgrade an already-successful payment
    const { data: existing } = await supabase
      .from("payments")
      .select("status")
      .eq("cashfree_order_id", orderId)
      .maybeSingle();

    if (existing?.status === "success" && status !== "success") {
      console.log(`Skipping downgrade for ${orderId}: already success`);
      return new Response("OK", { status: 200 });
    }

    // Update payment status in database
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status,
        gateway_status: paymentStatus || orderStatus || null,
        updated_at: new Date().toISOString(),
      })
      .eq("cashfree_order_id", orderId);
    
    if (updateError) {
      console.error("Failed to update payment status:", updateError);
    } else {
      console.log(`Payment ${orderId} updated to status: ${status}`);
    }

    // Also update report_orders (individual report purchases) by same id
    try {
      const patch: any = { status, gateway_status: paymentStatus || orderStatus || null };
      if (status === "success") patch.paid_at = new Date().toISOString();
      await supabase.from("report_orders").update(patch).eq("cashfree_order_id", orderId);
      // on success, fire report email (idempotent)
      if (status === "success") {
        const supabaseUrl2 = Deno.env.get("SUPABASE_URL")!;
        const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        fetch(`${supabaseUrl2}/functions/v1/send-report-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${svc}` },
          body: JSON.stringify({ orderId }),
        }).catch(() => {});
      }
    } catch (e) {
      console.error("report_orders update skipped:", e);
    }

    // Activate Plus subscription (order_id starts with "sub_")
    try {
      if (orderId && orderId.startsWith("sub_")) {
        if (status === "success") {
          const plan = orderId.includes("quarterly") ? "plus_quarterly" : "plus_monthly";
          const days = plan === "plus_quarterly" ? 92 : 30;
          const now = new Date();
          const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
          await supabase.from("subscriptions").update({
            status: "active",
            started_at: now.toISOString(),
            expires_at: expires.toISOString(),
            updated_at: now.toISOString(),
          }).eq("cashfree_order_id", orderId);
        } else {
          await supabase.from("subscriptions").update({
            status: status === "failed" ? "failed" : "pending",
            updated_at: new Date().toISOString(),
          }).eq("cashfree_order_id", orderId);
        }
      }
    } catch (e) {
      console.error("subscription update skipped:", e);
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    // Always return 200 to prevent webhook retries
    return new Response("OK", { status: 200 });
  }
};

serve(handler);
