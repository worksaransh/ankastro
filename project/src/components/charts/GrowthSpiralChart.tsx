import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface GrowthSpiralChartProps {
  turningPointYears: number[];
  identityAlignment: number;
  archetype: string;
}

export const GrowthSpiralChart: React.FC<GrowthSpiralChartProps> = ({
  turningPointYears,
  identityAlignment,
  archetype,
}) => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Generate growth data for next 10 years
  const data = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    const isTurningPoint = turningPointYears.includes(year);
    const baseGrowth = 50 + Math.sin(i * 0.5) * 20 + i * 3;
    const growth = isTurningPoint ? Math.min(100, baseGrowth + 25) : baseGrowth;
    
    return {
      year,
      growth: Math.round(growth),
      isTurningPoint,
    };
  });

  const archetypeLabels: Record<string, { en: string; hi: string }> = {
    Healer: { en: "Healer", hi: "चिकित्सक" },
    Warrior: { en: "Warrior", hi: "योद्धा" },
    Teacher: { en: "Teacher", hi: "शिक्षक" },
    Mystic: { en: "Mystic", hi: "रहस्यवादी" },
    Visionary: { en: "Visionary", hi: "दूरदर्शी" },
  };

  const archetypeEmojis: Record<string, string> = {
    Healer: "💚",
    Warrior: "⚔️",
    Teacher: "📚",
    Mystic: "🔮",
    Visionary: "👁️",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Sparkles className="w-5 h-5 text-purple-500" />
          {language === "hi" ? "विकास सर्पिल" : "Growth Spiral"}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {archetypeEmojis[archetype]} {archetypeLabels[archetype]?.[language] || archetype}
          </Badge>
          <Badge variant="secondary">
            {language === "hi" 
              ? `पहचान संरेखण: ${identityAlignment}%` 
              : `Identity Alignment: ${identityAlignment}%`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(280, 80%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
            <XAxis
              dataKey="year"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string, props: any) => {
                const isTurning = props.payload.isTurningPoint;
                const label = isTurning 
                  ? (language === "hi" ? "⭐ टर्निंग पॉइंट!" : "⭐ Turning Point!") 
                  : "";
                return [
                  `${value}% ${label}`,
                  language === "hi" ? "विकास क्षमता" : "Growth Potential",
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="growth"
              stroke="hsl(280, 80%, 60%)"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.isTurningPoint) {
                  return (
                    <svg x={cx - 8} y={cy - 8} width={16} height={16}>
                      <circle cx={8} cy={8} r={6} fill="hsl(45, 90%, 55%)" stroke="hsl(45, 90%, 45%)" strokeWidth={2} />
                    </svg>
                  );
                }
                return (
                  <svg x={cx - 4} y={cy - 4} width={8} height={8}>
                    <circle cx={4} cy={4} r={3} fill="hsl(280, 80%, 60%)" />
                  </svg>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>{language === "hi" ? "विकास पथ" : "Growth Path"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{language === "hi" ? "टर्निंग पॉइंट" : "Turning Point"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
