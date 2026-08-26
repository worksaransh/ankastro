import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberInfographicProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  caption?: string;
  accent?: 'primary' | 'gold' | 'rose' | 'emerald' | 'sky' | 'violet';
}

const accentMap: Record<string, string> = {
  primary: 'from-primary/15 to-primary/5 border-primary/20 text-primary',
  gold: 'from-amber-400/15 to-amber-200/5 border-amber-400/30 text-amber-600 dark:text-amber-400',
  rose: 'from-rose-500/15 to-pink-300/5 border-rose-500/20 text-rose-600 dark:text-rose-400',
  emerald: 'from-emerald-500/15 to-teal-300/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  sky: 'from-sky-500/15 to-blue-300/5 border-sky-500/20 text-sky-600 dark:text-sky-400',
  violet: 'from-violet-500/15 to-purple-300/5 border-violet-500/20 text-violet-600 dark:text-violet-400',
};

export const NumberInfographic: React.FC<NumberInfographicProps> = ({
  icon: Icon,
  label,
  value,
  caption,
  accent = 'primary',
}) => {
  const cls = accentMap[accent] || accentMap.primary;
  return (
    <Card className={cn('bg-gradient-to-br border animate-fade-in hover-scale transition-all', cls.split(' ').slice(0, 3).join(' '))}>
      <CardContent className="pt-5 pb-4 text-center">
        <div className={cn('w-12 h-12 mx-auto rounded-full bg-background/60 flex items-center justify-center mb-2', cls.split(' ').slice(3).join(' '))}>
          <Icon className="w-6 h-6" />
        </div>
        <p className={cn('text-3xl sm:text-4xl font-display font-bold leading-none', cls.split(' ').slice(3).join(' '))}>{value}</p>
        <p className="text-xs sm:text-sm font-medium text-foreground mt-2">{label}</p>
        {caption && <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{caption}</p>}
      </CardContent>
    </Card>
  );
};

export default NumberInfographic;
