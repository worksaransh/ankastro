import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { YearPrediction } from "@/lib/vedicNumerology";
import { useLanguage } from "@/contexts/LanguageContext";

interface YearlyMomentumChartProps {
  predictions: YearPrediction[];
  currentYear: number;
}

const getBarColor = (action: string, score: number) => {
  if (action === "breakthrough") return "hsl(142, 76%, 36%)";
  if (action === "pause") return "hsl(0, 70%, 50%)";
  if (score >= 70) return "hsl(270, 40%, 50%)";
  if (score >= 50) return "hsl(45, 80%, 55%)";
  return "hsl(270, 30%, 70%)";
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "breakthrough":
      return "🚀";
    case "pause":
      return "⏸️";
    case "build":
      return "🔨";
    default:
      return "📊";
  }
};

export const YearlyMomentumChart = ({
  predictions,
  currentYear,
}: YearlyMomentumChartProps) => {
  const { t } = useLanguage();
  
  const translateAction = (action: string) => {
    if (action === 'breakthrough') return t('chart.breakthrough');
    if (action === 'pause') return t('chart.pause');
    if (action === 'build') return t('chart.build');
    return action;
  };
  
  const data = predictions.map((year) => ({
    ...year,
    displayYear: year.year.toString().slice(-2),
    fullYear: year.year,
    color: getBarColor(year.action, year.score),
    icon: getActionIcon(year.action),
    translatedAction: translateAction(year.action),
  }));

  const turningPoints = predictions.filter((y) => y.isTurningPoint);

  return (
    <Card className="bg-gradient-to-br from-card to-aura-soft border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          {t('chart.yearlyMomentum')}
        </CardTitle>
        {turningPoints.length > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⭐ {t('predictions.turningPoint')}: {turningPoints.map((y) => y.year).join(", ")}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 80%)" opacity={0.5} />
              <XAxis
                dataKey="displayYear"
                stroke="hsl(270, 15%, 45%)"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `'${value}`}
              />
              <YAxis
                stroke="hsl(270, 15%, 45%)"
                tick={{ fontSize: 11 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(270, 25%, 98%)",
                  border: "1px solid hsl(270, 20%, 88%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 space-y-2">
                        <div className="font-display font-semibold text-foreground">
                          {data.icon} {t('chart.year') || 'Year'} {data.fullYear}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('predictions.score')}:</span>{" "}
                          <span className="font-medium">{data.score}/100</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('predictions.theme') || 'Theme'}:</span>{" "}
                          <span className="font-medium">{data.theme}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">{t('predictions.action') || 'Action'}:</span>{" "}
                          <span
                            className={`font-medium uppercase ${
                              data.action === "breakthrough"
                                ? "text-green-600"
                                : data.action === "pause"
                                ? "text-red-500"
                                : "text-primary"
                            }`}
                          >
                            {data.translatedAction}
                          </span>
                        </div>
                        {data.turningPoint && (
                          <div className="text-xs text-amber-600 font-medium">
                            ⭐ {t('predictions.turningPoint')}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                x={currentYear.toString().slice(-2)}
                stroke="hsl(270, 40%, 42%)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.isTurningPoint ? "hsl(45, 80%, 55%)" : "transparent"}
                    strokeWidth={entry.isTurningPoint ? 3 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(142, 76%, 36%)" }} />
            <span className="text-muted-foreground">🚀 {t('chart.breakthrough')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(270, 40%, 50%)" }} />
            <span className="text-muted-foreground">🔨 {t('chart.build')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(0, 70%, 50%)" }} />
            <span className="text-muted-foreground">⏸️ {t('chart.pause')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
