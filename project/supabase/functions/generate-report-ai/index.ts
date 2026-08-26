// generate-report-ai UPGRADED — Full NIKB consultant-grade context
// Uses compound numbers, Lo Shu arrows, Mulank×Bhagyank matrix, planes of expression
// Two users with same Mulank now get completely different reports.
// Requires: GROQ_API_KEY + NIKB tables seeded (NIKB_SQL_SCHEMAS.sql run)
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const MODEL = "llama-3.3-70b-versatile";

// ---- Numerology helpers (Deno-safe, no imports needed) ----
const reduce = (n: number, preserveMaster = true): number => {
  if (preserveMaster && (n === 11 || n === 22 || n === 33)) return n;
  if (n < 10) return n;
  return reduce(n % 10 === 0 ? Math.floor(n / 10) : (n % 10) + Math.floor(n / 10), preserveMaster);
};
const sumDigits = (s: string): number => s.replace(/\D/g, '').split('').reduce((a, d) => a + Number(d), 0);
const getMulank = (dob: string): number => {
  const day = dob.split(/[-\/]/)[2] || dob.split(/[-\/]/)[0];
  return reduce(sumDigits(day));
};
const getBhagyank = (dob: string): number => reduce(sumDigits(dob.replace(/\D/g, '')));
const getCompoundDay = (dob: string): number => {
  const day = parseInt(dob.split(/[-\/]/)[2] || dob.split(/[-\/]/)[0]);
  return day; // compound is the raw day number (10-31)
};
const getPersonalYear = (dob: string): number => {
  const now = new Date();
  const parts = dob.split(/[-\/]/);
  const month = parts[1]; const day = parts[2] || parts[0];
  return reduce(sumDigits(month + day + String(now.getFullYear())));
};

// Chaldean letter values
const CHALDEAN: Record<string, number> = {
  A:1,I:1,J:1,Q:1,Y:1, B:2,K:2,R:2, C:3,G:3,L:3,S:3, D:4,M:4,T:4,
  E:5,H:5,N:5,X:5, U:6,V:6,W:6, O:7,Z:7, F:8,P:8
};
const getCompoundName = (name: string): number => {
  const n = name.toUpperCase().replace(/[^A-Z]/g,'').split('')
    .reduce((a, c) => a + (CHALDEAN[c] || 0), 0);
  return n; // raw compound (not reduced — this is the point)
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const apiKey = Deno.env.get("GROQ_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const body = await req.json().catch(() => ({}));
    const { reportKey, inputJson, profileJson, lang } = body || {};
    if (!apiKey) return json({ ok: false, error: "GROQ_API_KEY missing" });

    const sb = createClient(supabaseUrl, supabaseKey);
    const language = lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi (Devanagari)' : 'Hinglish (Hindi+English, Latin script)';

    // ---- Build consultant context ----
    const name = inputJson?.displayName || inputJson?.fullBirthName || "";
    const dob = inputJson?.dateOfBirth || profileJson?.dob || "";
    const mulank = profileJson?.lifePath || (dob ? getMulank(dob) : 0);
    const bhagyank = profileJson?.destiny || (dob ? getBhagyank(dob) : 0);
    const compoundDay = dob ? getCompoundDay(dob) : 0;
    const compoundName = name ? getCompoundName(name) : 0;
    const compoundNameRoot = compoundName ? reduce(compoundName) : 0;
    const personalYear = dob ? getPersonalYear(dob) : 0;

    // Lo Shu arrows from profileJson (already calculated by frontend)
    const loshuGrid = profileJson?.loshuGrid || {};
    const pillarsCtx = profileJson?.pillarsCtx || null;
    const advCtx = profileJson?.advCtx || null;
    const presentNumbers: number[] = loshuGrid.presentNumbers || [];
    const missingNumbers: number[] = loshuGrid.missingNumbers || [];

    // Determine arrows from present numbers
    const arrowSets = [[1,5,9],[3,5,7],[4,9,2],[8,1,6],[3,5,7],[4,5,6],[2,5,8],[2,7,6]];
    const presentArrows: string[] = [];
    const missingArrows: string[] = [];
    arrowSets.forEach(arr => {
      if (arr.every(n => presentNumbers.includes(n))) presentArrows.push(arr.join('-'));
      if (arr.every(n => missingNumbers.includes(n))) missingArrows.push(arr.join('-'));
    });

    // Fetch NIKB data concurrently
    const [compoundDayData, compoundNameData, mbMatrix, arrowsData, reasoningRules] = await Promise.all([
      compoundDay >= 10 && compoundDay <= 52
        ? sb.from('nikb_compound_numbers').select('trad_name, nature, core_meaning, career_impact, wealth_impact, relationship_impact, karmic_theme').eq('compound', compoundDay).maybeSingle()
        : Promise.resolve({ data: null }),
      compoundName >= 10
        ? sb.from('nikb_compound_numbers').select('trad_name, nature, core_meaning, career_impact').eq('compound', compoundName <= 52 ? compoundName : reduce(compoundName, false)).maybeSingle()
        : Promise.resolve({ data: null }),
      mulank && bhagyank
        ? sb.from('nikb_mb_matrix').select('personality_core, career_profile, wealth_pattern, marriage_pattern, challenges, tension_points').eq('mulank', mulank).eq('bhagyank', bhagyank).maybeSingle()
        : Promise.resolve({ data: null }),
      presentArrows.length || missingArrows.length
        ? sb.from('nikb_loshu_arrows').select('name, present_meaning, missing_meaning, remedy_missing').in('numbers', [...presentArrows.map(a => a.split('-').map(Number)), ...missingArrows.map(a => a.split('-').map(Number))].flat()).limit(6)
        : Promise.resolve({ data: [] }),
      sb.from('nikb_reasoning_rules').select('conclusion, explanation').eq('active', true).limit(50),
    ]);

    // Build context string
    const nikbContext: Record<string, any> = {
      mulank_compound: `Born ${compoundDay}th → compound ${compoundDay}${compoundDayData.data ? ` ("${compoundDayData.data.trad_name}" — ${compoundDayData.data.nature})` : ''}`,
      compound_day_meaning: compoundDayData.data?.core_meaning || null,
      compound_day_career: compoundDayData.data?.career_impact || null,
      compound_day_karmic: compoundDayData.data?.karmic_theme || null,
      name_compound: compoundName > 0 ? `${compoundName} (root ${compoundNameRoot})${compoundNameData.data ? ` — "${compoundNameData.data.trad_name}"` : ''}` : null,
      name_compound_meaning: compoundNameData.data?.core_meaning || null,
      mulank_bhagyank_profile: mbMatrix.data?.personality_core || null,
      mulank_bhagyank_career: mbMatrix.data?.career_profile || null,
      mulank_bhagyank_wealth: mbMatrix.data?.wealth_pattern || null,
      mulank_bhagyank_tension: mbMatrix.data?.tension_points || null,
      present_arrows: presentArrows.length ? presentArrows : ["none identified"],
      missing_arrows: missingArrows.length ? missingArrows : ["none identified"],
      missing_numbers_in_loshu: missingNumbers,
      personal_year: personalYear,
    };

    const reportFocus: Record<string, string> = {
      name_correction: "name vibration, Chaldean compound of current vs corrected name, how name compound aligns with birth compound",
      mobile_numerology: "mobile number vibration analysis, compound of last 4 digits, angel number patterns, lucky vs unlucky mobile sequences",
      vehicle_numerology: "vehicle number suitability, compound analysis, safety and luck vibration",
      career_numerology: "career direction from Mulank+Bhagyank matrix, Loshu arrow career indicators, best-fit role type",
      baby_name: "auspicious name selection for child's birth compound, Chaldean name values to aim for",
      compatibility_report: "Mulank×Mulank compatibility, communication style, conflict pattern, long-term stability",
      business_numerology: "business name compound (Chaldean), optimal start date, industry compatibility",
      property_numerology: "house/property number compound, suitability for Mulank, Loshu implications",
      marriage_report: "marriage timing from Personal Year cycle, partner Mulank compatibility, relationship archetype",
    };

    const systemPrompt = `You are a senior numerology consultant with 25+ years experience. You are writing a paid personalized report for ${name}.

THEIR COMPLETE NUMEROLOGY PROFILE:
- Mulank (Psychic/Driver): ${mulank}
- Bhagyank (Destiny): ${bhagyank}  
- Birth compound: ${JSON.stringify(nikbContext.mulank_compound)}
- Compound meaning: ${nikbContext.compound_day_meaning || 'standard interpretation'}
- Karmic theme: ${nikbContext.compound_day_karmic || 'none'}
- Name compound: ${nikbContext.name_compound || 'not analyzed'}
- Mulank×Bhagyank personality: ${nikbContext.mulank_bhagyank_profile || 'standard'}
- Mulank×Bhagyank career: ${nikbContext.mulank_bhagyank_career || 'standard'}
- Mulank×Bhagyank wealth: ${nikbContext.mulank_bhagyank_wealth || 'standard'}
- Tension between numbers: ${nikbContext.mulank_bhagyank_tension || 'harmonious'}
- Present Lo Shu arrows (strengths): ${JSON.stringify(nikbContext.present_arrows)}
- Missing Lo Shu arrows (lessons): ${JSON.stringify(nikbContext.missing_arrows)}
- Missing numbers in grid: ${JSON.stringify(nikbContext.missing_numbers_in_loshu)}
- Personal Year: ${personalYear}
- Life Pillars summary: ${JSON.stringify(pillarsCtx) || "calculate from numbers above"}
- Advanced context: ${JSON.stringify(advCtx) || "calculate from numbers above"}
- Additional context: ${JSON.stringify(inputJson)}

REPORT FOCUS: ${reportFocus[reportKey] || 'complete numerology reading'}

CONSULTANT RULES (mandatory):
1. NEVER say "Number 3 = creativity." Always say WHY this specific person expresses it that way.
2. Reference the COMPOUND number (birth day), not just the root. "You were born on the 12th, compound of sacrifice — different from someone born on the 3rd."
3. When a karmic number exists, explain the LESSON, not just the warning.
4. When tension exists between Mulank and Bhagyank, acknowledge it explicitly — don't smooth it over.
5. When an arrow is missing, give a specific, actionable remedy.
6. Every section must end with ONE specific action for this person.
7. Write in ${language}. Warm, direct, consultant-level. No generic platitudes.

STRUCTURE: Return STRICT JSON with these exact keys:
{
  "summary": "2-3 sentences. Reference their specific compound, not generic number meaning.",
  "strengths": ["3-4 items, each referencing which number/arrow/compound produces this strength"],
  "risks": ["2-3 items, each explaining the numerological source of this pattern"],
  "actions": ["3-4 specific, practical steps derived from their chart"],
  "luckyFocus": "Specific lucky elements with numerological reasoning",
  "timeline": "Current Personal Year ${personalYear} reading + upcoming window",
  "closingNote": "One warm, personal, specific closing sentence"
}`;

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: "Generate the personalized report now." }],
        max_tokens: 1200,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) { console.error(await resp.text()); return json({ ok: false, error: "AI failed" }); }
    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed: any = null;
    try { parsed = JSON.parse(raw); } catch { parsed = null; }
    if (!parsed?.summary) return json({ ok: false, error: "AI parse failed" });

    return json({ ok: true, content: parsed, nikbContext });
  } catch (e: any) {
    console.error("generate-report-ai error:", e);
    return json({ ok: false, error: e.message || "Failed" });
  }
});

function json(obj: unknown) {
  return new Response(JSON.stringify(obj), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
}
