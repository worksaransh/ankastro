import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  provider_id: z.string().uuid(),
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    if (!userRes?.user) return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", userRes.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: "FORBIDDEN" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return new Response(JSON.stringify({ error: "INVALID_INPUT" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: provider } = await admin.from("otp_providers").select("*").eq("id", parsed.data.provider_id).single();
    if (!provider) return new Response(JSON.stringify({ error: "PROVIDER_NOT_FOUND" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Reuse the send logic by invoking send-otp internally using service key? Simpler: just call same code path via HTTP.
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-otp`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}` },
      body: JSON.stringify({ phone: parsed.data.phone, purpose: "login" }),
    });
    const j = await r.json();
    return new Response(JSON.stringify({ ok: r.ok, result: j, tested_provider: provider.name }), {
      status: r.ok ? 200 : 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
