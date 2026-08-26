import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Flame, TrendingUp } from 'lucide-react';

interface VibrationalCycleGaugeProps {
  personalYear: number;
  personalMonth: number;
  overallScore?: number;
}

export const VibrationalCycleGauge: React.FC<VibrationalCycleGaugeProps> = ({
  personalYear,
  personalMonth,
  overallScore = 82
}) => {
  // Determine season theme based on personal year
  const YEAR_THEMES: Record<number, { theme: string; desc: string }> = {
    1: { theme: 'New Beginnings & Leadership', desc: 'High momentum for starting new ventures and taking bold initiatives.' },
    2: { theme: 'Partnerships & Cooperation', desc: 'Focus on harmony, patience, building key alliances, and diplomatic growth.' },
    3: { theme: 'Creative Expansion & Expression', desc: 'Dynamic phase for social growth, self-expression, and optimism.' },
    4: { theme: 'Structure & Foundation Building', desc: 'Disciplined focus on skills, stability, systems, and long-term hard work.' },
    5: { theme: 'Pivotal Freedom & Fast Changes', desc: 'High flexibility phase for travel, adaptability, and major pivots.' },
    6: { theme: 'Family & Domestic Responsibility', desc: 'Focus on home, relationships, luxury, community, and commitment.' },
    7: { theme: 'Inner Wisdom & Self Mastery', desc: 'Deep research, spiritual introspection, and strategic planning.' },
    8: { theme: 'Wealth Mastery & Power Expansion', desc: 'Peak financial harvest, business authority, and executive achievement.' },
    9: { theme: 'Completion & Global Legacy', desc: 'Releasing outdated habits, humanitarian service, and preparing for new cycle.' },
  };

  const currentTheme = YEAR_THEMES[personalYear] || YEAR_THEMES[1];
  const strokeDashoffset = 283 - (283 * overallScore) / 100;

  return (
    <Card className="p-5 rounded-2xl bg-gradient-to-b from-[#090b1e] via-[#050614] to-[#02030a] border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.08)] text-left relative overflow-hidden space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Predictive Energy Gauge & Momentum
            </h3>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Personal Year {personalYear} • Personal Month {personalMonth} Alignment
          </p>
        </div>

        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] py-0.5 px-2.5 font-bold">
          Score {overallScore}%
        </Badge>
      </div>

      {/* Ring Gauge & Theme Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* SVG Gauge Circle */}
        <div className="flex flex-col items-center justify-center relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-white/5"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-gradient text-amber-400 transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                stroke: 'url(#blueGoldGradient)',
              }}
            />
            <defs>
              <linearGradient id="blueGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-display font-extrabold text-white">
              {overallScore}%
            </span>
            <span className="text-[9px] text-amber-400 font-mono uppercase tracking-widest">
              Vibration
            </span>
          </div>
        </div>

        {/* Theme Information */}
        <div className="sm:col-span-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Cycle Theme:</span>
          </div>

          <h4 className="text-sm font-bold text-white">
            {currentTheme.theme}
          </h4>

          <p className="text-xs text-gray-300 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
            {currentTheme.desc}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[10px] text-gray-400 font-mono">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>High execution window active in Personal Month {personalMonth}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
