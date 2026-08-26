import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Sun, Moon, Star, Heart, Sparkles, Compass, Zap, Target, Crown, Flame,
} from 'lucide-react';
import { NumberInfographic } from './NumberInfographic';
import { useLanguage } from '@/contexts/LanguageContext';
import type { NumerologyProfile } from '@/lib/numerology';
import type { VedicProfile } from '@/lib/vedicNumerology';

interface VisualSummaryDashboardProps {
  profile: NumerologyProfile;
  vedicProfile: VedicProfile;
  fullName: string;
  variant?: 'full' | 'compact';
}

const tr = (lang: string, en: string, hi: string, hinglish: string) =>
  lang === 'hi' ? hi : lang === 'hinglish' ? hinglish : en;

export const VisualSummaryDashboard: React.FC<VisualSummaryDashboardProps> = ({
  profile,
  vedicProfile,
  fullName,
  variant = 'full',
}) => {
  const { language } = useLanguage();

  const cards = [
    {
      icon: Sun,
      label: tr(language, 'Life Path', 'जीवन पथ', 'Life Path'),
      value: profile.lifePath,
      caption: tr(language, 'Your soul mission', 'आपकी आत्मा का उद्देश्य', 'Aapki soul ka mission'),
      accent: 'gold' as const,
    },
    {
      icon: Star,
      label: tr(language, 'Destiny', 'भाग्यांक', 'Destiny'),
      value: profile.destiny,
      caption: tr(language, 'What you will achieve', 'आप क्या प्राप्त करेंगे', 'Aap kya achieve karenge'),
      accent: 'violet' as const,
    },
    {
      icon: Heart,
      label: tr(language, 'Soul Urge', 'आत्मा की इच्छा', 'Soul Urge'),
      value: profile.soulUrge,
      caption: tr(language, 'Your heart\'s desire', 'दिल की चाह', 'Dil ki chah'),
      accent: 'rose' as const,
    },
    {
      icon: Crown,
      label: tr(language, 'Personality', 'व्यक्तित्व', 'Personality'),
      value: profile.personality,
      caption: tr(language, 'How others see you', 'दूसरे आपको कैसे देखते', 'Doosre kaise dekhte hain'),
      accent: 'sky' as const,
    },
    {
      icon: Sun,
      label: tr(language, 'Mulank', 'मूलांक', 'Mulank'),
      value: vedicProfile.mulank,
      caption: tr(language, 'Vedic core', 'वैदिक मूल', 'Vedic core'),
      accent: 'primary' as const,
    },
    {
      icon: Moon,
      label: tr(language, 'Bhagyank', 'भाग्यांक', 'Bhagyank'),
      value: vedicProfile.bhagyank,
      caption: tr(language, 'Vedic destiny', 'वैदिक नियति', 'Vedic destiny'),
      accent: 'gold' as const,
    },
    {
      icon: Zap,
      label: tr(language, 'Maturity', 'परिपक्वता', 'Maturity'),
      value: profile.maturity,
      caption: tr(language, 'Your future self', 'भविष्य का स्व', 'Future self'),
      accent: 'emerald' as const,
    },
    {
      icon: Target,
      label: tr(language, 'Birthday', 'जन्म अंक', 'Birthday'),
      value: profile.birthday,
      caption: tr(language, 'Special talent', 'विशेष प्रतिभा', 'Special talent'),
      accent: 'rose' as const,
    },
  ];

  const meters = [
    {
      icon: Heart,
      label: tr(language, 'Mulank ↔ Bhagyank Harmony', 'मूलांक–भाग्यांक सामंजस्य', 'Mulank–Bhagyank Harmony'),
      value: vedicProfile.harmonyScore,
      level: vedicProfile.harmonyLevel,
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Sparkles,
      label: tr(language, 'Chakra Alignment', 'चक्र संरेखण', 'Chakra Alignment'),
      value: vedicProfile.chakraAlignment.overallBalance,
      level:
        vedicProfile.chakraAlignment.overallBalance >= 75
          ? tr(language, 'Aligned', 'संरेखित', 'Aligned')
          : vedicProfile.chakraAlignment.overallBalance >= 50
          ? tr(language, 'Balanced', 'संतुलित', 'Balanced')
          : tr(language, 'Needs Care', 'देखभाल चाहिए', 'Needs Care'),
      color: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {variant === 'full' && (
        <Card className="bg-gradient-to-br from-primary/10 via-violet-500/5 to-amber-500/10 border-primary/20 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                <Sparkles className="w-6 h-6 text-primary" />
                {tr(language, 'Your Cosmic Blueprint', 'आपका ब्रह्मांडीय खाका', 'Aapka Cosmic Blueprint')}
              </CardTitle>
              <Badge variant="outline" className="bg-background/50 text-xs">
                {fullName}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {tr(
                language,
                'Eight core numbers that form the foundation of your entire report.',
                'आठ मुख्य संख्याएं जो आपकी पूरी रिपोर्ट का आधार बनाती हैं।',
                'Aath core numbers jo aapki poori report ki foundation hain.'
              )}
            </p>
          </CardHeader>
        </Card>
      )}

      {/* Number infographics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <NumberInfographic key={i} {...c} />
        ))}
      </div>

      {/* Energy meters */}
      <div className="grid sm:grid-cols-2 gap-4">
        {meters.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={i} className="animate-fade-in">
              <CardContent className="pt-5 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{m.level}</Badge>
                </div>
                <div className="space-y-1">
                  <Progress value={m.value} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="font-bold text-foreground">{m.value}%</span>
                    <span>100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick traits chips */}
      {variant === 'full' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              {tr(language, 'Your Strongest Vibrations', 'आपकी सबसे प्रबल ऊर्जाएं', 'Aapki Strongest Vibrations')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(vedicProfile.mulankMeaning.strengths || []).slice(0, 4).map((s, i) => (
              <Badge key={`s${i}`} className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/25">
                ✦ {s}
              </Badge>
            ))}
            {(vedicProfile.bhagyankMeaning.dharmicPath ? [vedicProfile.bhagyankMeaning.dharmicPath.split(',')[0]] : []).map((s, i) => (
              <Badge key={`d${i}`} variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
                <Compass className="w-3 h-3 mr-1" /> {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualSummaryDashboard;
