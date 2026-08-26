import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, CheckCircle2, Clock, XCircle, Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import { DECISION_QUESTIONS, computeDecision, type DecisionResult, type Verdict } from '@/lib/decisionClarity';
import type { NumerologyProfile } from '@/lib/numerology';
import type { VedicProfile } from '@/lib/vedicNumerology';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { hasAccess, type Tier } from '@/lib/tiers';

interface Props {
  profile: NumerologyProfile;
  vedicProfile: VedicProfile;
  unlockedTier?: Tier;
  reportId?: string;
}

const FREE_QUESTION_LIMIT = 3;

const titles = {
  en: {
    heading: 'Decision Clarity Engine',
    subtitle: 'Get a Yes / Not now / No probability score for major life choices, computed from your current numerological vibrations.',
    pickQ: 'Choose a decision to evaluate',
    customQ: 'Or ask your own question',
    customPlaceholder: 'e.g., Should I start a YouTube channel this year?',
    evaluate: 'Evaluate',
    yes: 'Go for it',
    notNow: 'Not now',
    no: 'Hold off',
    bestWindow: 'Best alignment window',
    why: 'Why this score',
    disclaimer: 'Guidance only — combine with practical judgement and trusted advice.',
  },
  hi: {
    heading: 'निर्णय स्पष्टता इंजन',
    subtitle: 'जीवन के बड़े निर्णयों के लिए हाँ / अभी नहीं / नहीं की संभावना देखें — आपके वर्तमान अंक कंपनों से गणना।',
    pickQ: 'मूल्यांकन के लिए निर्णय चुनें',
    customQ: 'या अपना प्रश्न पूछें',
    customPlaceholder: 'उदा., क्या मुझे इस वर्ष YouTube चैनल शुरू करना चाहिए?',
    evaluate: 'मूल्यांकन करें',
    yes: 'आगे बढ़ें',
    notNow: 'अभी नहीं',
    no: 'रुकें',
    bestWindow: 'सर्वोत्तम समय',
    why: 'यह स्कोर क्यों',
    disclaimer: 'केवल मार्गदर्शन — व्यावहारिक विवेक के साथ संयोजन करें।',
  },
  hinglish: {
    heading: 'Decision Clarity Engine',
    subtitle: 'Bade life decisions ke liye Yes / Not now / No probability score — aapke current numerology vibrations se calculate.',
    pickQ: 'Evaluate karne ke liye decision chunein',
    customQ: 'Ya apna khud ka question poochhein',
    customPlaceholder: 'jaise, Kya is saal YouTube channel start karun?',
    evaluate: 'Evaluate',
    yes: 'Aage badhein',
    notNow: 'Abhi nahi',
    no: 'Rukein',
    bestWindow: 'Best window',
    why: 'Yeh score kyun',
    disclaimer: 'Sirf guidance — practical judgement ke saath combine karein.',
  },
} as const;

const verdictMeta: Record<Verdict, { color: string; icon: any; bg: string }> = {
  yes: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  not_now: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  no: { color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', icon: XCircle },
};

export const DecisionClarityEngine = ({ profile, vedicProfile, unlockedTier = 'glimpse', reportId }: Props) => {
  const { language } = useLanguage();
  const L = titles[language as keyof typeof titles] || titles.en;
  const [selectedId, setSelectedId] = useState<string>(DECISION_QUESTIONS[0].id);
  const [customQ, setCustomQ] = useState('');
  const [result, setResult] = useState<DecisionResult | null>(null);

  const evaluate = (id: string) => {
    const r = computeDecision(id, profile, vedicProfile);
    setResult(r);
    trackEvent('decision_clarity_evaluated', { questionId: id, verdict: r.verdict });
  };

  const verdictLabel = useMemo(() => {
    if (!result) return '';
    return result.verdict === 'yes' ? L.yes : result.verdict === 'not_now' ? L.notNow : L.no;
  }, [result, L]);

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <Compass className="w-5 h-5 text-primary" />
          {L.heading}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">
        <p className="text-sm text-muted-foreground">{L.subtitle}</p>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{L.pickQ}</p>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const unlimited = hasAccess(unlockedTier, 'pro');
              const visible = unlimited ? DECISION_QUESTIONS : DECISION_QUESTIONS.slice(0, FREE_QUESTION_LIMIT);
              const lockedCount = DECISION_QUESTIONS.length - visible.length;
              return (
                <>
                  {visible.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => { setSelectedId(q.id); evaluate(q.id); }}
                      className={`text-xs sm:text-sm px-3 py-2 rounded-full border transition ${
                        selectedId === q.id && result
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/50 hover:bg-muted border-border'
                      }`}
                    >
                      {q.label[language as 'en' | 'hi' | 'hinglish'] || q.label.en}
                    </button>
                  ))}
                  {lockedCount > 0 && (
                    <Link
                      to={`/payment?tier=pro${reportId ? `&report=${reportId}` : ''}`}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm px-3 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary/15 transition"
                    >
                      <Lock className="w-3 h-3" />
                      +{lockedCount} more — Unlock Pro
                    </Link>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className={`rounded-xl border p-4 ${verdictMeta[result.verdict].bg}`}>
              <div className="flex items-center gap-3">
                {(() => { const Icon = verdictMeta[result.verdict].icon; return <Icon className={`w-7 h-7 ${verdictMeta[result.verdict].color}`} />; })()}
                <div>
                  <p className={`font-display text-xl font-semibold ${verdictMeta[result.verdict].color}`}>{verdictLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {L.bestWindow}: <span className="font-medium text-foreground">{result.bestWindow}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ScoreBar label={L.yes} value={result.yesScore} color="bg-emerald-500" />
              <ScoreBar label={L.notNow} value={result.notNowScore} color="bg-amber-500" />
              <ScoreBar label={L.no} value={result.noScore} color="bg-rose-500" />
            </div>

            <div className="rounded-lg bg-muted/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-xs uppercase tracking-wide font-semibold text-primary">{L.why}</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {result.reasoning[language as 'en' | 'hi' | 'hinglish'] || result.reasoning.en}
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground italic">{L.disclaimer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Badge variant="secondary" className="text-[11px]">{value}%</Badge>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default DecisionClarityEngine;
