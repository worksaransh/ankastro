import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, AlertTriangle, Sparkles, PiggyBank } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MoneyGuidance } from "@/lib/lifePillars";
import { AbundancePotentialChart } from "@/components/charts";

interface MoneyPillarSectionProps {
  money: MoneyGuidance;
}

export const MoneyPillarSection: React.FC<MoneyPillarSectionProps> = ({ money }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display text-lg sm:text-xl text-balance leading-tight">
            <Wallet className="w-6 h-6 text-green-600 flex-shrink-0" />
            {language === "hi" ? "💰 धन और समृद्धि" : "💰 Money & Abundance"}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "hi" 
              ? "पैसा तब आता है जब पहचान और मूल्य मेल खाते हैं।" 
              : "Money comes when identity and value match."}
          </p>
        </CardHeader>
      </Card>

      {/* Chart & Vibration */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AbundancePotentialChart
          monthlyIncomeWindow={money.monthlyIncomeWindow}
          abundanceScore={money.abundanceScore}
        />
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0" />
              {language === "hi" ? "धन स्पंदन" : "Money Vibration"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="font-semibold text-green-600">{money.moneyVibration.type}</p>
              <p className="text-sm text-muted-foreground mt-1">{money.moneyVibration.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">
                {language === "hi" ? "कमाई का रास्ता" : "Earning Path"}
              </p>
              <Badge className="bg-green-100 text-green-700 mb-2">{money.earningPath.primary}</Badge>
              <div className="flex flex-wrap gap-1 mt-2">
                {money.earningPath.strengths.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                {language === "hi" ? "निवेश शैली" : "Investment Style"}
              </p>
              <p className="text-sm font-medium">{money.investmentStyle}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Patterns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-primary" />
            {language === "hi" ? "वित्तीय पैटर्न" : "Financial Patterns"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                {language === "hi" ? "बचत पैटर्न" : "Saving Pattern"}
              </p>
              <p className="text-sm font-medium">{money.financialPatterns.saving}</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                {language === "hi" ? "खर्च पैटर्न" : "Spending Pattern"}
              </p>
              <p className="text-sm font-medium">{money.financialPatterns.spending}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                {language === "hi" ? "धन अपराधबोध" : "Money Guilt"}
              </p>
              <p className="text-sm font-medium">{money.financialPatterns.guilt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prosperity Block */}
      <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg text-amber-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {language === "hi" ? "समृद्धि ब्लॉक" : "Prosperity Block"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant="outline" className="bg-amber-100 text-amber-700">{money.prosperityBlock.type}</Badge>
          <p className="text-sm text-muted-foreground">{money.prosperityBlock.description}</p>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              {language === "hi" ? "उपचार" : "Healing"}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {money.prosperityBlock.healing}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warning Signs & Magnet Habits */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-red-600">
              {language === "hi" ? "चेतावनी संकेत" : "Warning Signs"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {money.warningSign.map((sign, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-red-500">⚠</span>
                  <span className="text-muted-foreground">{sign}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-green-600">
              {language === "hi" ? "धन चुंबक आदतें" : "Money Magnet Habits"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {money.magnetHabits.map((habit, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground">{habit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Career-Money Link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {language === "hi" ? "करियर-धन संबंध" : "Career-Money Link"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {language === "hi" ? "क्यों पैसा धीमा या तेज़ आएगा" : "Why money flows slow or fast"}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{money.careerMoneyLink}</p>
        </CardContent>
      </Card>

      {/* Risk Tolerance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            {language === "hi" ? "जोखिम सहनशीलता" : "Risk Tolerance"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-amber-500 transition-all"
                style={{ width: `${money.riskTolerance}%` }}
              />
            </div>
            <span className="font-bold text-lg">{money.riskTolerance}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {money.riskTolerance < 40 
              ? (language === "hi" ? "रूढ़िवादी - सुरक्षित निवेश पसंद" : "Conservative - Prefers safe investments")
              : money.riskTolerance < 70 
              ? (language === "hi" ? "संतुलित - मिश्रित दृष्टिकोण" : "Balanced - Mixed approach")
              : (language === "hi" ? "आक्रामक - उच्च जोखिम, उच्च इनाम" : "Aggressive - High risk, high reward")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
