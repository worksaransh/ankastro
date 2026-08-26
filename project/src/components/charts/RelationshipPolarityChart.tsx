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
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PolarityScore {
  giving: number;
  receiving: number;
  independence: number;
  intimacy: number;
}

interface RelationshipPolarityChartProps {
  polarityScore: PolarityScore;
  loveVibration: string;
}

export const RelationshipPolarityChart: React.FC<RelationshipPolarityChartProps> = ({
  polarityScore,
  loveVibration,
}) => {
  const { language } = useLanguage();

  const polarityLabels: Record<string, { en: string; hi: string }> = {
    giving: { en: "Giving", hi: "देना" },
    receiving: { en: "Receiving", hi: "लेना" },
    independence: { en: "Independence", hi: "स्वतंत्रता" },
    intimacy: { en: "Intimacy", hi: "अंतरंगता" },
  };

  const data = Object.entries(polarityScore).map(([key, value]) => ({
    aspect: polarityLabels[key]?.[language] || key,
    score: value,
    fullMark: 100,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Heart className="w-5 h-5 text-pink-500" />
          {language === "hi" ? "संबंध ध्रुवीयता" : "Relationship Polarity"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === "hi" ? `प्रेम स्पंदन: ${loveVibration}` : `Love Vibration: ${loveVibration}`}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
            <PolarAngleAxis
              dataKey="aspect"
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
              name="Polarity"
              dataKey="score"
              stroke="hsl(345, 80%, 60%)"
              fill="hsl(345, 80%, 60%)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
