import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sends the paid report download email via Resend. Idempotent (emailed_at).
const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromAddr = Deno.env.get("RESEND_FROM") || "AnkJyotish AI <onboarding@resend.dev>";
    const siteUrl = (Deno.env.get("SITE_URL") || "https://ankjyotishai.com").replace(/\/$/, "");
    const supabase = createClient(supabaseUrl, serviceKey);

    const { orderId } = await req.json();
    if (!orderId) throw new Error("orderId required");

    const { data: order } = await supabase
      .from("report_orders").select("*").eq("cashfree_order_id", orderId).maybeSingle();
    if (!order) return new Response(JSON.stringify({ success: false, error: "Order not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // only email paid orders, once, with an email present
    if (order.status !== "success" || !order.email) {
      return new Response(JSON.stringify({ success: true, skipped: "not paid or no email" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (order.emailed_at) {
      return new Response(JSON.stringify({ success: true, skipped: "already emailed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!resendKey) {
      return new Response(JSON.stringify({ success: false, error: "RESEND_API_KEY not set" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // report name + branding
    const { data: rt } = await supabase.from("report_types").select("name").eq("key", order.report_key).maybeSingle();
    const { data: brand } = await supabase.from("app_branding").select("company_name, website").eq("id", 1).maybeSingle();
    const company = brand?.company_name || "AnkJyotish AI";
    const reportName = rt?.name || "Your Numerology Report";
    const link = `${siteUrl}/order/${orderId}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#2a2238">
        <h2 style="color:#7c3aed;margin:0 0 8px">${company}</h2>
        <p style="font-size:16px;margin:0 0 16px">Aapka payment mil gaya — dhanyavaad! 🙏</p>
        <div style="background:#f6f3fb;border-radius:12px;padding:20px;text-align:center;margin:16px 0">
          <p style="margin:0 0 6px;font-size:15px"><b>${reportName}</b> ready hai</p>
          <a href="${link}" style="display:inline-block;margin-top:10px;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold">Download Your Report</a>
        </div>
        <p style="font-size:13px;color:#6e6979">Button kaam na kare to ye link kholein:<br><a href="${link}">${link}</a></p>
        <p style="font-size:12px;color:#9a95a6;margin-top:24px">Ye report aapke diye gaye janm vivaran par based hai. — ${company}</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddr,
        to: [order.email],
        subject: `${reportName} ready hai — Download karein`,
        html,
      }),
    });
    const out = await res.json();
    if (!res.ok) {
      console.error("Resend error:", out);
      return new Response(JSON.stringify({ success: false, error: out.message || "Email failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("report_orders").update({ emailed_at: new Date().toISOString() }).eq("cashfree_order_id", orderId);

    return new Response(JSON.stringify({ success: true, emailed: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("send-report-email error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message || "Failed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);
