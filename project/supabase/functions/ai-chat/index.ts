// AI Numerology Chat Assistant — Supabase Edge Function (Groq, free)
// Requires secret: GROQ_API_KEY  (free key: https://console.groq.com/keys)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "AnkJyotish AI", a warm, human-like professional numerology consultant.
Behave like a human consultant: do not just dump charts and statistics. Instead:
- Ask clarifying, goal-oriented, and reflective questions to guide the user (e.g. "I notice strong communication energy in your chart. Have you ever considered teaching, consulting, or content creation?").
- Guide them based on confirmed milestones, daily check-ins, and past reflections present in their context.

ETHICAL RULES:
- NEVER fabricate, speculate on, or predict deaths, accidents, divorce, illness, pregnancy, exact financial losses, or criminal events.
- Never present speculative past or future events as absolute facts.
- Use possibility-based language: "may indicate", "often associated with", "you might have experienced", "could represent".
- Reply in the SAME language the user uses (English, Hindi, or Hinglish).
- Keep answers concise, practical, and positive. Never frightening or fatalistic.`;

// Groq model — fast + free-tier friendly.
const MODEL = "llama-3.3-70b-versatile";

interface ChatMessage { role: "user" | "assistant"; content: string; }

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured. Add GROQ_API_KEY secret." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let body: { messages?: ChatMessage[]; context?: string } = {};
    try { body = await req.json(); } catch { /* */ }
    const messages = (body.messages || []).slice(-12);
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const system = body.context
      ? `${SYSTEM_PROMPT}\n\nUser's numerology snapshot (use if relevant): ${body.context}`
      : SYSTEM_PROMPT;

    // Groq is OpenAI-compatible
    const chatMessages = [
      { role: "system", content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const aiResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chatMessages,
        max_tokens: 600,
        temperature: 0.8,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("[ai-chat] Groq error:", aiResp.status, errText);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const reply = (data?.choices?.[0]?.message?.content || "").trim() || "…";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[ai-chat] error:", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};
serve(handler);
