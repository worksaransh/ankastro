import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmotionalOverloadMeterProps {
  emotionalOverloadScore: number;
  balanceScore: number;
  stressPattern: string;
}

export const EmotionalOverloadMeter: React.FC<EmotionalOverloadMeterProps> = ({
  emotionalOverloadScore,
  balanceScore,
  stressPattern,
}) => {
  const { language } = useLanguage();

  const getOverloadColor = (score: number) => {
    if (score <= 30) return "bg-green-500";
    if (score <= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBalanceColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getOverloadStatus = (score: number) => {
    if (score <= 30) return language === "hi" ? "कम तनाव" : "Low Stress";
    if (score <= 60) return language === "hi" ? "मध्यम तनाव" : "Moderate Stress";
    return language === "hi" ? "उच्च तनाव" : "High Stress";
  };

  const getBalanceStatus = (score: number) => {
    if (score >= 70) return language === "hi" ? "अच्छा संतुलन" : "Well Balanced";
    if (score >= 40) return language === "hi" ? "ध्यान दें" : "Needs Attention";
    return language === "hi" ? "असंतुलित" : "Imbalanced";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Heart className="w-5 h-5 text-red-500" />
          {language === "hi" ? "भावनात्मक स्वास्थ्य मीटर" : "Emotional Health Meter"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emotional Overload */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {language === "hi" ? "भावनात्मक भार" : "Emotional Overload"}
            </span>
            <div className="flex items-center gap-2">
              {emotionalOverloadScore > 60 ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {getOverloadStatus(emotionalOverloadScore)}
              </span>
            </div>
          </div>
          <div className="relative">
            <Progress
              value={emotionalOverloadScore}
              className="h-4"
            />
            <div
              className={`absolute top-0 left-0 h-4 rounded-full transition-all ${getOverloadColor(emotionalOverloadScore)}`}
              style={{ width: `${emotionalOverloadScore}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">{emotionalOverloadScore}/100</p>
        </div>

        {/* Balance Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {language === "hi" ? "संतुलन स्कोर" : "Balance Score"}
            </span>
            <span className="text-sm text-muted-foreground">
              {getBalanceStatus(balanceScore)}
            </span>
          </div>
          <div className="relative">
            <Progress
              value={balanceScore}
              className="h-4"
            />
            <div
              className={`absolute top-0 left-0 h-4 rounded-full transition-all ${getBalanceColor(balanceScore)}`}
              style={{ width: `${balanceScore}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">{balanceScore}/100</p>
        </div>

        {/* Stress Pattern */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">
            {language === "hi" ? "तनाव पैटर्न" : "Stress Pattern"}
          </p>
          <p className="text-sm font-medium">{stressPattern}</p>
        </div>
      </CardContent>
    </Card>
  );
};
