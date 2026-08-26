import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/, "Phone must be E.164"),
  purpose: z.enum(["login", "signup", "recovery"]).default("login"),
});

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

type Provider = { id: string; name: string; config: Record<string, any>; is_test: boolean };

async function sendViaProvider(p: Provider, phone: string, otp: string): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  try {
    if (p.is_test) return { ok: true, messageId: `test-${Date.now()}` };
    if (p.name === "msg91") {
      const key = Deno.env.get("MSG91_AUTH_KEY");
      if (!key) return { ok: false, error: "PROVIDER_NOT_CONFIGURED" };
      const r = await fetch("https://control.msg91.com/api/v5/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", authkey: key },
        body: JSON.stringify({
          template_id: p.config.template_id,
          mobile: phone.replace(/^\+/, ""),
          otp,
          sender: p.config.sender_id,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.type === "error") return { ok: false, error: j.message || `HTTP ${r.status}` };
      return { ok: true, messageId: j.request_id };
    }
    if (p.name === "twilio") {
      const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const token = Deno.env.get("TWILIO_AUTH_TOKEN");
      const from = Deno.env.get("TWILIO_FROM") || p.config.from;
      if (!sid || !token || !from) return { ok: false, error: "PROVIDER_NOT_CONFIGURED" };
      const auth = btoa(`${sid}:${token}`);
      const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ To: phone, From: from, Body: `Your Ankjyotish OTP: ${otp}` }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return { ok: false, error: j.message || `HTTP ${r.status}` };
      return { ok: true, messageId: j.sid };
    }
    if (p.name === "fast2sms") {
      const key = Deno.env.get("FAST2SMS_API_KEY");
      if (!key) return { ok: false, error: "PROVIDER_NOT_CONFIGURED" };
      const r = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: { authorization: key, "Content-Type": "application/json" },
        body: JSON.stringify({
          variables_values: otp,
          route: "otp",
          numbers: phone.replace(/^\+91/, "").replace(/^\+/, ""),
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.return === false) return { ok: false, error: j.message || `HTTP ${r.status}` };
      return { ok: true, messageId: j.request_id };
    }
    if (p.name === "custom") {
      const url = p.config.webhook_url;
      if (!url) return { ok: false, error: "PROVIDER_NOT_CONFIGURED" };
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
      return { ok: true };
    }
    return { ok: false, error: "UNKNOWN_PROVIDER" };
  } catch (e: any) {
    return { ok: false, error: e.message || "send failed" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "INVALID_INPUT", details: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { phone, purpose } = parsed.data;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // rate limit: max 3 sends per phone per 10 min
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("otp_verifications")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", tenMinAgo);
    if ((count || 0) >= 3) {
      return new Response(JSON.stringify({ error: "RATE_LIMITED" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await sha256(otp);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { data: providers } = await supabase
      .from("otp_providers")
      .select("id,name,config,is_test")
      .eq("enabled", true)
      .order("priority", { ascending: true });

    if (!providers || providers.length === 0) {
      return new Response(JSON.stringify({ error: "NO_PROVIDER_ENABLED" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let lastError = "send failed";
    let usedProvider: string | null = null;
    let attempt = 0;
    for (const p of providers as Provider[]) {
      attempt++;
      const r = await sendViaProvider(p, phone, otp);
      await supabase.from("otp_delivery_log").insert({
        phone,
        provider: p.name,
        status: r.ok ? "sent" : "failed",
        provider_message_id: r.messageId,
        error_message: r.error,
        attempt,
      });
      if (r.ok) { usedProvider = p.name; break; }
      lastError = r.error || lastError;
    }

    if (!usedProvider) {
      return new Response(JSON.stringify({ error: "ALL_PROVIDERS_FAILED", details: lastError }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("otp_verifications").insert({
      phone,
      otp_code: "", // legacy column not used
      otp_hash,
      expires_at,
      purpose,
      provider: usedProvider,
    });

    return new Response(JSON.stringify({ ok: true, provider: usedProvider, expires_at }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
