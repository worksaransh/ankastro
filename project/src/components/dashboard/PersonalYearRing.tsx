import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const YEAR_MEANINGS: Record<number, { en: string; hi: string }> = {
  1: { en: 'New Beginnings & Leadership', hi: 'नई शुरुआत और नेतृत्व' },
  2: { en: 'Partnerships & Patience', hi: 'साझेदारी और धैर्य' },
  3: { en: 'Creativity & Expression', hi: 'रचनात्मकता और अभिव्यक्ति' },
  4: { en: 'Foundation & Hard Work', hi: 'नींव और कड़ी मेहनत' },
  5: { en: 'Change & Freedom', hi: 'परिवर्तन और स्वतंत्रता' },
  6: { en: 'Family & Responsibility', hi: 'परिवार और जिम्मेदारी' },
  7: { en: 'Reflection & Spirituality', hi: 'चिंतन और आध्यात्मिकता' },
  8: { en: 'Power & Material Success', hi: 'शक्ति और भौतिक सफलता' },
  9: { en: 'Completion & Wisdom', hi: 'पूर्णता और बुद्धिमत्ता' },
};

const YEAR_COLORS: Record<number, string> = {
  1: '#f59e0b', // amber
  2: '#8b5cf6', // violet
  3: '#ec4899', // pink
  4: '#10b981', // emerald
  5: '#3b82f6', // blue
  6: '#f97316', // orange
  7: '#6366f1', // indigo
  8: '#eab308', // yellow (gold)
  9: '#ef4444', // red
};

interface PersonalYearRingProps {
  personalYear: number;
  language?: string;
  className?: string;
}

const PersonalYearRing = ({ personalYear, language = 'en', className = '' }: PersonalYearRingProps) => {
  const monthProgress = (new Date().getMonth() + 1) / 12;
  const circumference = 2 * Math.PI * 38; // radius = 38
  const strokeDashoffset = circumference * (1 - monthProgress);
  const color = YEAR_COLORS[personalYear] || '#8b5cf6';
  const meaning = YEAR_MEANINGS[personalYear];
  const lang = language === 'hi' ? 'hi' : 'en';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`relative inline-flex items-center justify-center cursor-default ${className}`}>
          <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48" cy="48" r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              className="text-muted/30"
            />
            {/* Progress arc */}
            <circle
              cx="48" cy="48" r="38"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
            />
          </svg>
          {/* Center number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-display text-2xl font-bold"
              style={{ color }}
            >
              {personalYear}
            </span>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              Year
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[220px]">
        <p className="font-semibold text-sm" style={{ color }}>
          Personal Year {personalYear}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {meaning?.[lang] || meaning?.en}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {Math.round(monthProgress * 100)}% of the year complete
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default PersonalYearRing;
