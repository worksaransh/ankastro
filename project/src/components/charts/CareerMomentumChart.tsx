import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MonthlyCareerEnergy {
  month: string;
  score: number;
  theme: string;
  action: string;
}

interface CareerMomentumChartProps {
  monthlyCareerEnergy: MonthlyCareerEnergy[];
}

const monthTranslations: Record<string, string> = {
  January: "जन",
  February: "फर",
  March: "मार्च",
  April: "अप्रैल",
  May: "मई",
  June: "जून",
  July: "जुला",
  August: "अग",
  September: "सित",
  October: "अक्टू",
  November: "नव",
  December: "दिस",
};

export const CareerMomentumChart: React.FC<CareerMomentumChartProps> = ({
  monthlyCareerEnergy,
}) => {
  const { language } = useLanguage();

  const data = monthlyCareerEnergy.map((item) => ({
    ...item,
    monthLabel: language === "hi" 
      ? monthTranslations[item.month] || item.month.substring(0, 3)
      : item.month.substring(0, 3),
  }));

  const getBarColor = (action: string) => {
    switch (action) {
      case 'breakthrough':
      case 'launch':
      case 'expand':
        return 'hsl(142, 76%, 36%)';
      case 'rest':
      case 'review':
        return 'hsl(0, 65%, 50%)';
      default:
        return 'hsl(var(--primary))';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === "hi" ? "12-माह करियर गति" : "12-Month Career Momentum"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
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
              formatter={(value: number, name: string, props: any) => [
                <>
                  <div>{value}%</div>
                  <div className="text-xs text-muted-foreground">{props.payload.theme}</div>
                  <div className="text-xs font-medium capitalize">{props.payload.action}</div>
                </>,
                language === "hi" ? "करियर ऊर्जा" : "Career Energy",
              ]}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.action)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span>{language === "hi" ? "सफलता" : "Breakthrough"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>{language === "hi" ? "निर्माण" : "Build"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>{language === "hi" ? "आराम" : "Rest"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
