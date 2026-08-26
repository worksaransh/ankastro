import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LifeTimelineChartProps {
  currentAge: number;
  lifePath: number;
  personalYear: number;
}

const generateLifeTimelineData = (currentAge: number, lifePath: number, personalYear: number) => {
  const data = [];
  const cycles = [
    { start: 0, end: 28, name: "Youth Cycle", baseEnergy: 60 },
    { start: 29, end: 56, name: "Power Cycle", baseEnergy: 80 },
    { start: 57, end: 84, name: "Wisdom Cycle", baseEnergy: 70 },
  ];

  for (let age = 0; age <= 84; age += 4) {
    const cycle = cycles.find((c) => age >= c.start && age <= c.end) || cycles[2];
    const cycleProgress = (age - cycle.start) / (cycle.end - cycle.start);
    
    // Create wave pattern based on life path number
    const waveAmplitude = 15 + (lifePath % 5) * 3;
    const waveFrequency = 0.2 + (lifePath % 3) * 0.1;
    const wave = Math.sin(age * waveFrequency) * waveAmplitude;
    
    // Add personal year influence
    const yearInfluence = ((personalYear + age) % 9) * 3;
    
    const energy = Math.round(
      cycle.baseEnergy + wave + yearInfluence * cycleProgress
    );

    const opportunity = Math.round(
      50 + Math.cos(age * 0.15) * 25 + (lifePath % 4) * 5
    );

    const challenge = Math.round(
      30 + Math.sin(age * 0.25 + Math.PI) * 20 + ((9 - lifePath) % 3) * 8
    );

    data.push({
      age,
      energy: Math.min(100, Math.max(20, energy)),
      opportunity: Math.min(100, Math.max(10, opportunity)),
      challenge: Math.min(100, Math.max(5, challenge)),
      cycle: cycle.name,
    });
  }

  return data;
};

export const LifeTimelineChart = ({
  currentAge,
  lifePath,
  personalYear,
}: LifeTimelineChartProps) => {
  const { t } = useLanguage();
  const data = generateLifeTimelineData(currentAge, lifePath, personalYear);

  return (
    <Card className="bg-gradient-to-br from-card to-aura-soft border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground">
          <TrendingUp className="w-5 h-5 text-primary" />
          {t('chart.lifeTimeline')} (0-84)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(270, 40%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(270, 40%, 50%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="opportunityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 80%, 55%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(45, 80%, 55%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="challengeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 70%, 50%)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="hsl(0, 70%, 50%)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 80%)" opacity={0.5} />
              <XAxis
                dataKey="age"
                stroke="hsl(270, 15%, 45%)"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value}y`}
              />
              <YAxis
                stroke="hsl(270, 15%, 45%)"
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(270, 25%, 98%)",
                  border: "1px solid hsl(270, 20%, 88%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number, name: string) => {
                  const translatedName = name === 'energy' ? t('chart.energy') 
                    : name === 'opportunity' ? t('chart.opportunities') 
                    : t('chart.challenges');
                  return [`${value}%`, translatedName];
                }}
                labelFormatter={(label) => `${t('chart.age') || 'Age'} ${label}`}
              />
              <ReferenceLine
                x={currentAge}
                stroke="hsl(270, 40%, 42%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: "You",
                  position: "top",
                  fill: "hsl(270, 40%, 42%)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="hsl(270, 40%, 50%)"
                strokeWidth={2}
                fill="url(#energyGradient)"
                name="energy"
              />
              <Area
                type="monotone"
                dataKey="opportunity"
                stroke="hsl(45, 80%, 55%)"
                strokeWidth={2}
                fill="url(#opportunityGradient)"
                name="opportunity"
              />
              <Area
                type="monotone"
                dataKey="challenge"
                stroke="hsl(0, 70%, 50%)"
                strokeWidth={1.5}
                fill="url(#challengeGradient)"
                name="challenge"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">{t('chart.energy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-divine" style={{ backgroundColor: "hsl(45, 80%, 55%)" }} />
            <span className="text-muted-foreground">{t('chart.opportunities')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">{t('chart.challenges')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
