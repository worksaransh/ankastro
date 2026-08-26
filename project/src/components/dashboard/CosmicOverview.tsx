import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import LoShuMiniGrid from './LoShuMiniGrid';
import PersonalYearRing from './PersonalYearRing';

const NUMBER_LABELS: Record<string, { en: string; hi: string; icon: string }> = {
  mulank:     { en: 'Mulank',     hi: 'मूलांक',   icon: '🔢' },
  bhagyank:   { en: 'Bhagyank',   hi: 'भाग्यांक', icon: '🌟' },
  lifePath:   { en: 'Life Path',  hi: 'जीवन पथ',  icon: '🛤️' },
  destiny:    { en: 'Destiny',    hi: 'भाग्य',    icon: '✨' },
  naamank:    { en: 'Naamank',    hi: 'नामांक',   icon: '🔤' },
};

const NUMBER_HINTS: Record<string, Record<number, string>> = {
  mulank: {
    1: 'Leadership, independence, ambition',
    2: 'Cooperation, diplomacy, sensitivity',
    3: 'Creativity, expression, joy',
    4: 'Stability, hard work, practicality',
    5: 'Freedom, change, adventure',
    6: 'Nurturing, responsibility, love',
    7: 'Wisdom, introspection, spirituality',
    8: 'Power, ambition, material success',
    9: 'Compassion, service, humanitarianism',
  },
};

interface CosmicOverviewProps {
  numProfile: any;
  language: string;
  loshuDigits?: Set<number>;
}

const CosmicOverview = ({ numProfile, language, loshuDigits }: CosmicOverviewProps) => {
  if (!numProfile) return null;

  const lang = language === 'hi' ? 'hi' : 'en';

  // Build displayed stats: only show what we have
  const stats = [
    { key: 'mulank', value: numProfile.birthday },
    { key: 'bhagyank', value: numProfile.lifePath },
    { key: 'naamank', value: numProfile.destiny },
  ].filter((s) => s.value != null);

  return (
    <div className="mb-6 space-y-4">
      {/* Core Numbers Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ key, value }) => {
          const meta = NUMBER_LABELS[key] || { en: key, hi: key, icon: '🔮' };
          const hint = NUMBER_HINTS.mulank?.[value as number] || '';
          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Card className="glass-card-mystical border-white/5 hover:border-primary/30 transition-all duration-300 cursor-default group">
                  <CardContent className="pt-4 pb-4 text-center">
                    <span className="text-lg mb-1 block">{meta.icon}</span>
                    <p className="text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors animate-fade-in">
                      {value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">
                      {meta[lang]}
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <p className="text-xs">{hint || `Your ${meta.en} number reveals core personality traits.`}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Lo Shu Grid + Personal Year Ring Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {loshuDigits && (
          <Card className="glass-card-mystical border-white/5 flex-1 w-full sm:w-auto">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {language === 'hi' ? 'लो शू ग्रिड' : 'Lo Shu Grid'}
              </p>
              <LoShuMiniGrid presentDigits={loshuDigits} language={language} />
              <p className="text-[10px] text-muted-foreground">
                {language === 'hi' ? 'चमकीला = उपस्थित • धुंधला = अनुपस्थित' : 'Bright = Present • Dim = Missing'}
              </p>
            </CardContent>
          </Card>
        )}

        {numProfile.personalYear && (
          <Card className="glass-card-mystical border-white/5 flex-1 w-full sm:w-auto">
            <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {language === 'hi' ? 'व्यक्तिगत वर्ष' : 'Personal Year'}
              </p>
              <PersonalYearRing personalYear={numProfile.personalYear} language={language} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CosmicOverview;
