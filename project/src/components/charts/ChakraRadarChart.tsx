import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { ChakraAlignment } from "@/lib/vedicNumerology";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChakraRadarChartProps {
  chakraAlignment: ChakraAlignment;
}

const chakraColors: Record<string, string> = {
  root: "#FF0000",
  sacral: "#FF7F00",
  solarPlexus: "#FFFF00",
  heart: "#00FF00",
  throat: "#00BFFF",
  thirdEye: "#4B0082",
  crown: "#9400D3",
};

const chakraEmojis: Record<string, string> = {
  root: "🔴",
  sacral: "🟠",
  solarPlexus: "🟡",
  heart: "💚",
  throat: "🔵",
  thirdEye: "💜",
  crown: "👑",
};

export const ChakraRadarChart = ({ chakraAlignment }: ChakraRadarChartProps) => {
  const { t } = useLanguage();
  
  // Transform individual chakra properties into array format for the chart
  const chakraKeys = ['root', 'sacral', 'solarPlexus', 'heart', 'throat', 'thirdEye', 'crown'] as const;
  
  const chakraData = chakraKeys.map((key) => ({
    key,
    name: t(`chakra.${key}`),
    alignment: chakraAlignment[key],
  }));

  const data = chakraData.map((chakra) => ({
    chakra: chakra.name,
    key: chakra.key,
    alignment: chakra.alignment,
    fullMark: 100,
    color: chakraColors[chakra.key],
    emoji: chakraEmojis[chakra.key],
    balanced: chakra.alignment >= 60,
    tip: chakra.alignment >= 60 
      ? (t('chakra.balanced') || "Well balanced") 
      : (t('chakra.needsFocus') || "Focus on strengthening"),
  }));

  return (
    <Card className="bg-gradient-to-br from-card to-aura-soft border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground">
          <Sparkles className="w-5 h-5 text-primary" />
          {t('chart.chakraRadar')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('chakra.overallBalance')}: {chakraAlignment.overallBalance}%
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="hsl(270, 20%, 80%)" />
              <PolarAngleAxis
                dataKey="chakra"
                tick={{ fill: "hsl(270, 15%, 45%)", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                stroke="hsl(270, 20%, 70%)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(270, 25%, 98%)",
                  border: "1px solid hsl(270, 20%, 88%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number, name: string, props: any) => {
                  const item = props.payload;
                  return [
                    <div key="content" className="space-y-1">
                      <div className="font-medium">{item.chakra} Chakra</div>
                      <div>Alignment: {value}%</div>
                      <div className={item.balanced ? "text-green-600" : "text-amber-600"}>
                        {item.balanced ? "✓ Balanced" : "⚠ Needs attention"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{item.tip}</div>
                    </div>,
                    "",
                  ];
                }}
              />
              <Radar
                name="Alignment"
                dataKey="alignment"
                stroke="hsl(270, 40%, 50%)"
                fill="hsl(270, 40%, 50%)"
                fillOpacity={0.4}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {chakraData.slice(0, 4).map((chakra) => (
            <div
              key={chakra.key}
              className={`p-2 rounded-lg text-center text-xs ${
                chakra.alignment >= 60
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              }`}
            >
              <span className="mr-1">{chakraEmojis[chakra.key]}</span>
              {chakra.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
