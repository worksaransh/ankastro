import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface IncomeWindow {
  month: string;
  score: number;
  type: 'peak' | 'stable' | 'slow';
}

interface AbundancePotentialChartProps {
  monthlyIncomeWindow: IncomeWindow[];
  abundanceScore: number;
}

const monthTranslations: Record<string, string> = {
  January: "जनवरी",
  February: "फरवरी",
  March: "मार्च",
  April: "अप्रैल",
  May: "मई",
  June: "जून",
  July: "जुलाई",
  August: "अगस्त",
  September: "सितंबर",
  October: "अक्टूबर",
  November: "नवंबर",
  December: "दिसंबर",
};

export const AbundancePotentialChart: React.FC<AbundancePotentialChartProps> = ({
  monthlyIncomeWindow,
  abundanceScore,
}) => {
  const { language } = useLanguage();

  const data = monthlyIncomeWindow.map((item) => ({
    ...item,
    monthLabel: language === "hi" ? monthTranslations[item.month] || item.month : item.month.substring(0, 3),
  }));

  const typeColors: Record<string, string> = {
    peak: "hsl(142, 76%, 36%)",
    stable: "hsl(45, 80%, 55%)",
    slow: "hsl(0, 65%, 50%)",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Wallet className="w-5 h-5 text-green-600" />
          {language === "hi" ? "धन प्रवाह पूर्वानुमान" : "Money Flow Forecast"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {language === "hi" 
            ? `समृद्धि स्कोर: ${abundanceScore}%` 
            : `Abundance Score: ${abundanceScore}%`}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="abundanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
            <XAxis
              dataKey="monthLabel"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
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
                const type = props.payload.type;
                const typeLabels = {
                  peak: language === "hi" ? "शिखर" : "Peak",
                  stable: language === "hi" ? "स्थिर" : "Stable",
                  slow: language === "hi" ? "धीमा" : "Slow",
                };
                return [
                  `${value}% (${typeLabels[type as keyof typeof typeLabels]})`,
                  language === "hi" ? "धन ऊर्जा" : "Money Energy",
                ];
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(142, 76%, 36%)"
              fill="url(#abundanceGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span>{language === "hi" ? "शिखर" : "Peak"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>{language === "hi" ? "स्थिर" : "Stable"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>{language === "hi" ? "धीमा" : "Slow"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
