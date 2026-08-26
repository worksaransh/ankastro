import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkStyleScore {
  solo: number;
  team: number;
  leadership: number;
  creative: number;
  consultant: number;
}

interface WorkStyleRadarChartProps {
  workStyleScore: WorkStyleScore;
  primaryStyle: string;
}

export const WorkStyleRadarChart: React.FC<WorkStyleRadarChartProps> = ({
  workStyleScore,
  primaryStyle,
}) => {
  const { t, language } = useLanguage();

  const styleLabels: Record<string, { en: string; hi: string }> = {
    solo: { en: "Solo", hi: "अकेले" },
    team: { en: "Team", hi: "टीम" },
    leadership: { en: "Leadership", hi: "नेतृत्व" },
    creative: { en: "Creative", hi: "रचनात्मक" },
    consultant: { en: "Consultant", hi: "सलाहकार" },
  };

  const data = Object.entries(workStyleScore).map(([key, value]) => ({
    style: styleLabels[key]?.[language] || key,
    score: value,
    fullMark: 100,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Briefcase className="w-5 h-5 text-primary" />
          {language === "hi" ? "कार्य शैली विश्लेषण" : "Work Style Analysis"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === "hi" ? `प्राथमिक: ${primaryStyle}` : `Primary: ${primaryStyle}`}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
            <PolarAngleAxis
              dataKey="style"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, language === "hi" ? "स्कोर" : "Score"]}
            />
            <Radar
              name="Work Style"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
