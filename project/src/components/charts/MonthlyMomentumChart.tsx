import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { MonthPrediction } from "@/lib/vedicNumerology";
import { useLanguage } from "@/contexts/LanguageContext";

interface MonthlyMomentumChartProps {
  predictions: MonthPrediction[];
}

const getBarColor = (action: string, score: number) => {
  if (action === "breakthrough") return "hsl(142, 76%, 36%)";
  if (action === "pause") return "hsl(0, 70%, 50%)";
  if (score >= 70) return "hsl(270, 40%, 50%)";
  if (score >= 50) return "hsl(45, 80%, 55%)";
  return "hsl(270, 30%, 70%)";
};

export const MonthlyMomentumChart = ({
  predictions,
}: MonthlyMomentumChartProps) => {
  const { t } = useLanguage();
  
  const translateAction = (action: string) => {
    if (action === 'breakthrough') return t('chart.breakthrough');
    if (action === 'pause') return t('chart.pause');
    if (action === 'build') return t('chart.build');
    return action;
  };
  
  const data = predictions.map((month, index) => {
    const translatedMonth = t(`month.${month.month}`);
    return {
      ...month,
      displayMonth: translatedMonth,
      shortMonth: translatedMonth.slice(0, 3),
      monthIndex: index + 1,
      color: getBarColor(month.action, month.score),
      translatedAction: translateAction(month.action),
    };
  });

  // Calculate trend line
  const avgScore = data.reduce((sum, d) => sum + d.score, 0) / data.length;

  return (
    <Card className="bg-gradient-to-br from-card to-aura-soft border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display text-foreground">
          <TrendingUp className="w-5 h-5 text-primary" />
          {t('chart.monthlyMomentum')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('predictions.score')}: {Math.round(avgScore)}/100
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 20%, 80%)" opacity={0.5} />
              <XAxis
                dataKey="shortMonth"
                stroke="hsl(270, 15%, 45%)"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke="hsl(270, 15%, 45%)"
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
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
                      <div className="p-3 space-y-1.5 max-w-[200px]">
                        <div className="font-display font-semibold text-foreground">
                          {data.displayMonth}
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
                            className={`font-medium uppercase text-xs ${
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
                        <div className="text-xs text-muted-foreground pt-1 border-t">
                          {data.timing}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(270, 35%, 42%)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
          {data.slice(0, 3).map((month) => (
            <div
              key={month.month}
              className="p-2 rounded-lg bg-muted/50 text-center"
            >
              <div className="font-medium text-foreground">{month.shortMonth}</div>
              <div
                className={`text-xs ${
                  month.action === "breakthrough"
                    ? "text-green-600"
                    : month.action === "pause"
                    ? "text-red-500"
                    : "text-primary"
                }`}
              >
                {month.translatedAction}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
