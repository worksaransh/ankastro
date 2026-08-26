import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Standard Lo Shu magic square layout (Vedic/traditional):
// Row 1: 4 9 2
// Row 2: 3 5 7
// Row 3: 8 1 6
const LOSHU_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

const MISSING_MEANINGS: Record<number, string> = {
  1: 'Low confidence, difficulty asserting self',
  2: 'Oversensitive, trouble with partnerships',
  3: 'Difficulty with self-expression & creativity',
  4: 'Lack of discipline, poor organization',
  5: 'Restless, difficulty accepting change',
  6: 'Avoids responsibility, distant from family',
  7: 'Lacks spiritual depth, overthinks',
  8: 'Financial challenges, poor money management',
  9: 'Self-centered, lacks compassion',
};

interface LoShuMiniGridProps {
  /** Set of digits present in the user's date of birth (1-9) */
  presentDigits: Set<number>;
  language?: string;
  className?: string;
}

const LoShuMiniGrid = ({ presentDigits, language = 'en', className = '' }: LoShuMiniGridProps) => {
  return (
    <div className={`inline-grid grid-cols-3 gap-1 ${className}`}>
      {LOSHU_LAYOUT.flat().map((digit) => {
        const isPresent = presentDigits.has(digit);
        // Count how many times the digit appears
        return (
          <Tooltip key={digit}>
            <TooltipTrigger asChild>
              <div
                className={`
                  w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center
                  font-display font-bold text-sm sm:text-base
                  transition-all duration-300 cursor-default
                  ${isPresent
                    ? 'bg-primary/20 text-primary border border-primary/40 shadow-sm shadow-primary/10'
                    : 'bg-muted/50 text-muted-foreground/40 border border-border/50'
                  }
                `}
              >
                {digit}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px] text-xs">
              {isPresent ? (
                <span className="text-emerald-400">✓ Present in your chart</span>
              ) : (
                <span className="text-amber-400">Missing: {MISSING_MEANINGS[digit]}</span>
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default LoShuMiniGrid;
