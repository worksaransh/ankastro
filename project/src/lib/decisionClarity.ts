// Decision Clarity Engine — Yes/No/Not now probability scores
// Pure functional logic; uses existing numerology + vedic profile vibrations.

import type { NumerologyProfile } from './numerology';
import type { VedicProfile } from './vedicNumerology';

export type Verdict = 'yes' | 'not_now' | 'no';

export interface DecisionResult {
  verdict: Verdict;
  yesScore: number; // 0-100
  notNowScore: number;
  noScore: number;
  reasoning: { en: string; hi: string; hinglish: string };
  bestWindow: string;
}

export interface DecisionQuestion {
  id: string;
  label: { en: string; hi: string; hinglish: string };
}

export const DECISION_QUESTIONS: DecisionQuestion[] = [
  {
    id: 'job_vs_business',
    label: {
      en: 'Should I switch from Job to Business?',
      hi: 'क्या मुझे नौकरी छोड़कर व्यवसाय शुरू करना चाहिए?',
      hinglish: 'Job chhodke business start karun?',
    },
  },
  {
    id: 'stay_vs_leave_job',
    label: {
      en: 'Should I leave my current job?',
      hi: 'क्या मुझे अपनी वर्तमान नौकरी छोड़नी चाहिए?',
      hinglish: 'Apni current job chhod dun?',
    },
  },
  {
    id: 'relocate_city',
    label: {
      en: 'Should I relocate to a new city?',
      hi: 'क्या मुझे नए शहर में स्थानांतरित होना चाहिए?',
      hinglish: 'Naye city me shift karun?',
    },
  },
  {
    id: 'marriage_now',
    label: {
      en: 'Is this the right time for marriage?',
      hi: 'क्या यह विवाह का सही समय है?',
      hinglish: 'Kya yeh shaadi ka sahi time hai?',
    },
  },
  {
    id: 'big_investment',
    label: {
      en: 'Should I make a big investment now?',
      hi: 'क्या मुझे बड़ा निवेश करना चाहिए?',
      hinglish: 'Bada investment karun abhi?',
    },
  },
  {
    id: 'new_partnership',
    label: {
      en: 'Should I enter a new business partnership?',
      hi: 'क्या मुझे नई व्यावसायिक साझेदारी करनी चाहिए?',
      hinglish: 'Nayi business partnership karun?',
    },
  },
];

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

/**
 * Compute Yes/No/Not-now probability based on:
 *  - Personal Year vibration (energy of the current cycle)
 *  - Mulank-Bhagyank harmony
 *  - Question-specific best/worst numbers
 */
export function computeDecision(
  questionId: string,
  profile: NumerologyProfile,
  vedicProfile: VedicProfile
): DecisionResult {
  const py = profile.personalYear;
  const harmony = vedicProfile.harmonyScore || 50;
  const mulank = vedicProfile.mulank;

  // Friendly numbers for each decision type
  const profile_map: Record<string, { friendly: number[]; cautious: number[] }> = {
    job_vs_business: { friendly: [1, 5, 8, 9], cautious: [2, 4, 7] },
    stay_vs_leave_job: { friendly: [5, 1, 9], cautious: [4, 6, 8] },
    relocate_city: { friendly: [3, 5, 9], cautious: [4, 6, 7] },
    marriage_now: { friendly: [2, 6, 9], cautious: [1, 4, 7] },
    big_investment: { friendly: [4, 8, 6], cautious: [3, 5, 9] },
    new_partnership: { friendly: [2, 6, 3], cautious: [1, 4, 8] },
  };

  const map = profile_map[questionId] || profile_map.job_vs_business;

  let yes = 40 + harmony * 0.3;
  let notNow = 30;
  let no = 30;

  if (map.friendly.includes(py)) yes += 22;
  if (map.cautious.includes(py)) no += 18;
  if (map.friendly.includes(mulank)) yes += 10;
  if (map.cautious.includes(mulank)) no += 8;

  // PY 9 = closing; not_now bias for new beginnings
  if (py === 9 && ['job_vs_business', 'big_investment', 'new_partnership'].includes(questionId)) {
    notNow += 25;
    yes -= 10;
  }
  // PY 1 = fresh start
  if (py === 1 && ['job_vs_business', 'relocate_city'].includes(questionId)) {
    yes += 15;
  }
  // PY 4/7 = consolidate, not expand
  if ((py === 4 || py === 7) && questionId === 'big_investment') {
    notNow += 15;
  }

  // Normalize to 100
  const total = yes + notNow + no;
  yes = Math.round((yes / total) * 100);
  notNow = Math.round((notNow / total) * 100);
  no = 100 - yes - notNow;

  const verdict: Verdict = yes >= notNow && yes >= no ? 'yes' : notNow >= no ? 'not_now' : 'no';

  // Best window — pick next 3 months whose number aligns with friendly set
  const now = new Date();
  const bestMonths: string[] = [];
  for (let i = 1; i <= 6 && bestMonths.length < 2; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthNum = ((d.getMonth() + 1 + d.getFullYear()) % 9) + 1;
    if (map.friendly.includes(monthNum)) {
      bestMonths.push(`${monthNames[d.getMonth()]} ${d.getFullYear()}`);
    }
  }
  const bestWindow = bestMonths.length ? bestMonths.join(' & ') : `${monthNames[(now.getMonth() + 2) % 12]}`;

  const reasoning = buildReasoning(verdict, py, harmony, questionId, bestWindow);

  return { verdict, yesScore: yes, notNowScore: notNow, noScore: no, reasoning, bestWindow };
}

function buildReasoning(v: Verdict, py: number, harmony: number, qid: string, window: string) {
  if (v === 'yes') {
    return {
      en: `Your Personal Year ${py} energy supports this decision and your core vibrations show ${harmony}% inner harmony. Move with confidence — but do your due diligence. Best alignment window: ${window}.`,
      hi: `आपके व्यक्तिगत वर्ष ${py} की ऊर्जा इस निर्णय का समर्थन करती है, और आपके मूल कंपन ${harmony}% आंतरिक सामंजस्य दिखाते हैं। आत्मविश्वास से आगे बढ़ें। सर्वोत्तम समय: ${window}।`,
      hinglish: `Aapke Personal Year ${py} ki energy is decision ko support karti hai aur core vibrations ${harmony}% inner harmony dikhate hain. Confidence se aage badhein. Best window: ${window}.`,
    };
  }
  if (v === 'not_now') {
    return {
      en: `The energy is mixed. Your Personal Year ${py} cycle suggests preparation rather than action. Use the next few months to plan, learn and build alliances. Re-evaluate around ${window}.`,
      hi: `ऊर्जा मिश्रित है। आपका व्यक्तिगत वर्ष ${py} चक्र अभी कार्य के बजाय तैयारी का सुझाव देता है। अगले कुछ महीने योजना और संबंधों के लिए प्रयोग करें। ${window} के आसपास पुनर्मूल्यांकन करें।`,
      hinglish: `Energy mixed hai. Personal Year ${py} cycle abhi action ki jagah preparation suggest karta hai. Agle kuch months planning aur learning me lagayein. ${window} ke aas-paas dobara dekhein.`,
    };
  }
  return {
    en: `Current vibrations are not in your favour for this specific decision. Personal Year ${py} energy creates resistance. Avoid forcing it — wait for the next cycle (${window}) or refine the question before acting.`,
    hi: `इस विशिष्ट निर्णय के लिए वर्तमान कंपन आपके पक्ष में नहीं हैं। व्यक्तिगत वर्ष ${py} ऊर्जा प्रतिरोध उत्पन्न करती है। ज़ोर न डालें — अगले चक्र (${window}) की प्रतीक्षा करें।`,
    hinglish: `Is specific decision ke liye current vibrations aapke favor me nahi hain. Personal Year ${py} energy resistance laati hai. Force mat karein — next cycle (${window}) ka wait karein ya question refine karein.`,
  };
}
