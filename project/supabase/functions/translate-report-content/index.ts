// Translate a report content JSON (all string values) to a target language
// via Groq. Preserves JSON structure. Requires GROQ_API_KEY.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const MODEL = "llama-3.3-70b-versatile";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const apiKey = Deno.env.get("GROQ_API_KEY");
    const { content, targetLang } = await req.json().catch(() => ({}));
    if (!apiKey) return json({ ok: false, error: "GROQ_API_KEY missing" });
    if (!content) return json({ ok: false, error: "content required" });

    const langName = targetLang === "en" ? "English"
      : targetLang === "hi" ? "Hindi (in Devanagari script)"
      : "Hinglish (Hindi+English mix in Latin script)";

    const system = `You are a professional translator + marketing copywriter for an Indian numerology brand.
Translate ALL human-readable string values in the given JSON into ${langName}.
STRICT RULES:
- Keep the EXACT same JSON structure, keys, arrays and nesting. Do NOT add/remove keys.
- Translate only the VALUES (strings). Keep numbers, booleans, image filenames, slugs, ids, emojis, and keys UNCHANGED.
- Keep it warm, persuasive, India-friendly, same meaning.
- Output ONLY the translated JSON. No markdown, no commentary.`;

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: "JSON to translate:\n" + JSON.stringify(content) },
        ],
        max_tokens: 4000,
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });
    if (!resp.ok) { console.error(await resp.text()); return json({ ok: false, error: "AI failed" }); }
    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed: any = null;
    try { parsed = JSON.parse(raw); } catch { parsed = null; }
    if (!parsed) return json({ ok: false, error: "parse failed" });
    return json({ ok: true, content: parsed });
  } catch (e: any) {
    console.error("translate-report-content error:", e);
    return json({ ok: false, error: e.message || "failed" });
  }
});

function json(obj: unknown) {
  return new Response(JSON.stringify(obj), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
}
