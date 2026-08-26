import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
  code: z.string().regex(/^\d{6}$/),
  full_name: z.string().min(1).max(120).optional(),
});

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const syntheticEmail = (phone: string) =>
  `${phone.replace(/^\+/, "")}@phone.ankjyotish.app`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "INVALID_INPUT" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { phone, code, full_name } = parsed.data;
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const code_hash = await sha256(code);

    const { data: rows } = await admin
      .from("otp_verifications")
      .select("id, otp_hash, expires_at, attempts, verified, provider")
      .eq("phone", phone)
      .eq("verified", false)
      .gt("expires_at", new Date().toISOString())
      .lt("attempts", 5)
      .order("created_at", { ascending: false })
      .limit(1);

    const row = rows?.[0];
    if (!row) {
      return new Response(JSON.stringify({ error: "OTP_NOT_FOUND_OR_EXPIRED" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isTestBypass = row.provider === "test" && code === "123456";
    if (row.otp_hash !== code_hash && !isTestBypass) {
      await admin.from("otp_verifications").update({ attempts: (row.attempts || 0) + 1 }).eq("id", row.id);
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin.from("otp_verifications").update({ verified: true }).eq("id", row.id);

    const email = syntheticEmail(phone);

    // Find or create auth user
    let userId: string | null = null;
    let targetEmail = email;

    // 1. Look up via profiles table
    const { data: profileRows } = await admin.from("profiles").select("user_id, email").eq("phone_number", phone).limit(1);
    
    if (profileRows && profileRows.length > 0) {
      userId = profileRows[0].user_id;
      targetEmail = profileRows[0].email;
    } else {
      // 2. Create new user with synthetic email
      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email: targetEmail,
        email_confirm: true,
        password: crypto.randomUUID() + crypto.randomUUID(),
        user_metadata: { phone_number: phone, full_name: full_name || "" },
      });
      
      if (cErr) {
        if (cErr.message.includes("already been registered")) {
          // Synthetic user exists but has no profile. We can proceed with targetEmail.
        } else {
          throw cErr;
        }
      } else {
        userId = created.user!.id;
        // Ensure profile has phone
        await admin.from("profiles").upsert(
          { user_id: userId, email: targetEmail, full_name: full_name || "", phone_number: phone },
          { onConflict: "user_id" }
        );
      }
    }

    // Generate a magiclink to extract email_otp for session creation
    const { data: link, error: lErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: targetEmail,
    });
    if (lErr) throw lErr;
    const token = (link.properties as any)?.email_otp;
    if (!token) throw new Error("Failed to mint session token");

    return new Response(JSON.stringify({ ok: true, email: targetEmail, token }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ 
      error: e.message || "server error",
      stack: e.stack,
      name: e.name,
      raw: String(e)
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
