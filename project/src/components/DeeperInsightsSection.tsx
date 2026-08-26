import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Sunrise, Calendar, Gem, Compass, AlertTriangle, Flame, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDeeperInsight, PillarKey } from "@/lib/deeperInsights";

interface Props {
  pillar: PillarKey;
  mulank: number;
  bhagyank: number;
  personalYear: number;
}

const TITLES: Record<PillarKey, { en: string; hi: string; hinglish: string }> = {
  career: { en: 'Career — Deeper Layer', hi: 'करियर — गहरी परत', hinglish: 'Career — Deeper Layer' },
  love:   { en: 'Love — Deeper Layer',   hi: 'प्रेम — गहरी परत',   hinglish: 'Love — Deeper Layer'   },
  money:  { en: 'Money — Deeper Layer',  hi: 'धन — गहरी परत',     hinglish: 'Money — Deeper Layer'  },
  health: { en: 'Health — Deeper Layer', hi: 'स्वास्थ्य — गहरी परत', hinglish: 'Health — Deeper Layer' },
};

const DeeperInsightsSection: React.FC<Props> = ({ pillar, mulank, bhagyank, personalYear }) => {
  const { language } = useLanguage();
  const langKey = (language === 'hi' ? 'hi' : language === 'hinglish' ? 'hinglish' : 'en') as 'en' | 'hi' | 'hinglish';
  const dataLang = (langKey === 'hi' ? 'hi' : 'en') as 'en' | 'hi';
  const data = getDeeperInsight(pillar, mulank, bhagyank, personalYear, dataLang);
  const t = TITLES[pillar][langKey];

  const L = (en: string, hi: string, hinglish?: string) =>
    langKey === 'hi' ? hi : langKey === 'hinglish' ? (hinglish ?? en) : en;

  return (
    <div className="space-y-5 mt-6 animate-fade-in">
      {/* Heading */}
      <Card className="bg-gradient-to-r from-primary/10 via-violet-500/5 to-transparent border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 font-display text-lg sm:text-xl leading-tight">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <span className="text-balance">{t}</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {L(
              'Emotional guidance, lucky timing, and expanded insights woven from your numbers.',
              'भावनात्मक मार्गदर्शन, शुभ समय, और आपकी संख्याओं से बुनी गहरी अंतर्दृष्टि।',
              'Emotional guidance, lucky timing, aur aapke numbers se bune deeper insights.'
            )}
          </p>
        </CardHeader>
      </Card>

      {/* Emotional guidance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 flex-shrink-0" />
            {L('Emotional Guidance', 'भावनात्मक मार्गदर्शन', 'Emotional Guidance')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{L('Core emotion', 'मूल भावना', 'Core emotion')}</p>
              <p className="font-medium text-sm leading-snug">{data.emotional.coreEmotion}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{L('Shadow feeling', 'छाया भावना', 'Shadow feeling')}</p>
              <p className="font-medium text-sm leading-snug">{data.emotional.shadowFeeling}</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
            <p className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-1">{L('What to release', 'क्या छोड़ें', 'Kya release karein')}</p>
            <p className="text-sm leading-relaxed">{data.emotional.release}</p>
          </div>
          <div className="p-3 rounded-lg border-l-4 border-primary bg-primary/5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide font-medium text-primary mb-1">
              <Quote className="w-3.5 h-3.5" />
              {L('Healing affirmation', 'उपचार पुष्टि', 'Healing affirmation')}
            </div>
            <p className="italic text-sm leading-relaxed">"{data.emotional.affirmation}"</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[11px] uppercase tracking-wide font-medium text-emerald-700 dark:text-emerald-300 mb-1">
              {L('Practice this week', 'इस सप्ताह का अभ्यास', 'Iss week ka practice')}
            </p>
            <p className="text-sm leading-relaxed">{data.emotional.practice}</p>
          </div>
        </CardContent>
      </Card>

      {/* Lucky timing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-amber-500 flex-shrink-0" />
            {L('Lucky Timing & Energies', 'शुभ समय और ऊर्जाएँ', 'Lucky Timing & Energies')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            <InfoRow icon={<Calendar className="w-4 h-4" />} label={L('Lucky weekdays', 'शुभ वार', 'Lucky weekdays')}>
              <div className="flex flex-wrap gap-1.5">
                {data.timing.luckyDays.map((d) => (<Badge key={d} variant="secondary" className="text-xs">{d}</Badge>))}
              </div>
            </InfoRow>
            <InfoRow icon={<Calendar className="w-4 h-4" />} label={L('Lucky dates', 'शुभ तिथियाँ', 'Lucky dates')}>
              <div className="flex flex-wrap gap-1.5">
                {data.timing.luckyDates.map((d) => (<Badge key={d} className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/25">{d}</Badge>))}
              </div>
            </InfoRow>
            <InfoRow icon={<Sunrise className="w-4 h-4" />} label={L('Peak hours', 'शिखर घंटे', 'Peak hours')}>
              <p className="text-sm font-medium">{data.timing.peakHours}</p>
            </InfoRow>
            <InfoRow icon={<Calendar className="w-4 h-4" />} label={L('Lucky months (this year)', 'शुभ माह (इस वर्ष)', 'Lucky months (iss saal)')}>
              <div className="flex flex-wrap gap-1.5">
                {data.timing.luckyMonths.length
                  ? data.timing.luckyMonths.map((m) => (<Badge key={m} variant="outline" className="text-xs">{m}</Badge>))
                  : <span className="text-xs text-muted-foreground">—</span>}
              </div>
            </InfoRow>
            <InfoRow icon={<Sparkles className="w-4 h-4" />} label={L('Lucky colors', 'शुभ रंग', 'Lucky colors')}>
              <div className="flex flex-wrap gap-1.5">
                {data.timing.luckyColors.map((c) => (<Badge key={c} variant="secondary" className="text-xs">{c}</Badge>))}
              </div>
            </InfoRow>
            <InfoRow icon={<Gem className="w-4 h-4" />} label={L('Gemstone', 'रत्न', 'Gemstone')}>
              <p className="text-sm font-medium">{data.timing.luckyGemstone}</p>
            </InfoRow>
            <InfoRow icon={<Compass className="w-4 h-4" />} label={L('Direction', 'दिशा', 'Direction')}>
              <p className="text-sm font-medium">{data.timing.luckyDirection}</p>
            </InfoRow>
            <InfoRow icon={<AlertTriangle className="w-4 h-4 text-amber-500" />} label={L('Dates to slow down', 'धीमी तिथियाँ', 'Dates to slow down')}>
              <div className="flex flex-wrap gap-1.5">
                {data.timing.avoidDates.map((d) => (<Badge key={d} variant="outline" className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">{d}</Badge>))}
              </div>
            </InfoRow>
          </div>
        </CardContent>
      </Card>

      {/* Expanded insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0" />
            {L('Expanded Insights', 'विस्तृत अंतर्दृष्टि', 'Expanded Insights')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {data.expanded.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">{i + 1}</span>
                <span className="text-foreground/90 pt-0.5">{line}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Micro ritual + warning */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Flame className="w-4 h-4" />
              {L('Daily micro-ritual', 'दैनिक सूक्ष्म-अनुष्ठान', 'Daily micro-ritual')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{data.microRitual}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
              {L('Gentle caution', 'कोमल चेतावनी', 'Gentle caution')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{data.warning}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="p-3 rounded-lg border bg-card/50">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground mb-2">
      {icon}{label}
    </div>
    {children}
  </div>
);

export default DeeperInsightsSection;
