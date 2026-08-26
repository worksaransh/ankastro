import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, RotateCcw, Star, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GrowthGuidance } from "@/lib/lifePillars";
import { GrowthSpiralChart } from "@/components/charts";

interface GrowthPillarSectionProps {
  growth: GrowthGuidance;
}

export const GrowthPillarSection: React.FC<GrowthPillarSectionProps> = ({ growth }) => {
  const { language } = useLanguage();

  const archetypeEmojis: Record<string, string> = {
    Healer: "💚",
    Warrior: "⚔️",
    Teacher: "📚",
    Mystic: "🔮",
    Visionary: "👁️",
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/5 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display text-lg sm:text-xl text-balance leading-tight">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0" />
            {language === "hi" ? "✨ व्यक्तिगत विकास / आध्यात्मिक पथ" : "✨ Personal Growth / Spiritual Path"}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "hi" 
              ? "आपका रास्ता लिखा है, लेकिन आपके चुनाव स्याही हैं।" 
              : "Your path is written, but your choices are the ink."}
          </p>
        </CardHeader>
      </Card>

      {/* Chart & Archetype */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GrowthSpiralChart
          turningPointYears={growth.turningPointYears}
          identityAlignment={growth.identityPurposeAlignment.percentage}
          archetype={growth.archetype}
        />
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500 flex-shrink-0" />
              {language === "hi" ? "जीवन आर्किटाइप" : "Life Archetype"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <span className="text-4xl">{archetypeEmojis[growth.archetype]}</span>
              <p className="font-display text-xl font-bold text-purple-600 mt-2">{growth.archetype}</p>
            </div>
            <p className="text-sm text-muted-foreground">{growth.archetypeDescription}</p>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                {language === "hi" ? "पहचान-उद्देश्य संरेखण" : "Identity-Purpose Alignment"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${growth.identityPurposeAlignment.percentage}%` }}
                  />
                </div>
                <span className="font-bold">{growth.identityPurposeAlignment.percentage}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{growth.identityPurposeAlignment.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Karmic Lesson & Life Theme */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-amber-700 dark:text-amber-300">
              {language === "hi" ? "कार्मिक सबक" : "Karmic Lesson"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{growth.karmicLesson}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-blue-700 dark:text-blue-300">
              {language === "hi" ? "जीवन विषय" : "Life Theme"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{growth.lifeTheme}</p>
          </CardContent>
        </Card>
      </div>

      {/* Repeating Loops */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            {language === "hi" ? "दोहराने वाले लूप पैटर्न" : "Repeating Loop Patterns"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {language === "hi" ? "क्यों दोहराते हैं + निकास मार्ग" : "Why they repeat + exit route"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {growth.repeatingLoops.map((loop, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <p className="font-medium text-foreground mb-2">{loop.pattern}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                      {language === "hi" ? "क्यों?" : "Why?"}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">{loop.why}</p>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                      {language === "hi" ? "निकास" : "Exit"}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">{loop.exit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Soul Age Traits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            {language === "hi" ? "आत्मा-आयु व्यवहार" : "Soul-Age Traits"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {growth.soulAgeTraits.map((trait, i) => (
              <Badge key={i} variant="secondary">{trait}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Turning Point Years */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {language === "hi" ? "टर्निंग पॉइंट वर्ष" : "Turning Point Years"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {growth.turningPointYears.map((year, i) => (
              <Badge key={i} className="bg-amber-100 text-amber-700 border-amber-300">
                ⭐ {year}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 30/60/90 Day Action Plan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {language === "hi" ? "भाग्य संरेखण कार्य योजना" : "Destiny Alignment Action Plan"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">
                {language === "hi" ? "30 दिन" : "30 Days"}
              </h4>
              <ul className="space-y-2">
                {growth.actionPlan30Day.map((action, i) => (
                  <li key={i} className="text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
                    <span>✓</span> {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
                {language === "hi" ? "60 दिन" : "60 Days"}
              </h4>
              <ul className="space-y-2">
                {growth.actionPlan60Day.map((action, i) => (
                  <li key={i} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                    <span>✓</span> {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
                {language === "hi" ? "90 दिन" : "90 Days"}
              </h4>
              <ul className="space-y-2">
                {growth.actionPlan90Day.map((action, i) => (
                  <li key={i} className="text-sm text-purple-600 dark:text-purple-400 flex items-start gap-2">
                    <span>✓</span> {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rebirth Window */}
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            {language === "hi" ? "पुनर्जन्म / पुनः आरंभ विंडो" : "Rebirth / Restart Window"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="bg-purple-100 text-purple-700 mb-2">{growth.rebirthWindow.period}</Badge>
          <p className="text-sm text-muted-foreground">{growth.rebirthWindow.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};
