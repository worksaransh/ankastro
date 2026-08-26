import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Moon, Sparkles, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HealthGuidance } from "@/lib/lifePillars";
import { ChakraRadarChart, EmotionalOverloadMeter } from "@/components/charts";
import { ChakraAlignment } from "@/lib/vedicNumerology";

interface HealthPillarSectionProps {
  health: HealthGuidance;
  chakraAlignment: ChakraAlignment;
}

export const HealthPillarSection: React.FC<HealthPillarSectionProps> = ({ health, chakraAlignment }) => {
  const { language } = useLanguage();

  const getChakraStatusColor = (status: string) => {
    switch (status) {
      case 'balanced': return 'bg-green-100 text-green-700 border-green-200';
      case 'underactive': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'overactive': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const statusLabels: Record<string, { en: string; hi: string }> = {
    balanced: { en: 'Balanced', hi: 'संतुलित' },
    underactive: { en: 'Underactive', hi: 'निष्क्रिय' },
    overactive: { en: 'Overactive', hi: 'अतिसक्रिय' },
  };

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display text-lg sm:text-xl text-balance leading-tight">
            <Leaf className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            {language === "hi" ? "🌿 स्वास्थ्य और कल्याण" : "🌿 Health & Wellbeing"}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "hi" 
              ? "आपका शरीर वह सुनता है जो आपकी आत्मा बोलने से इनकार करती है।" 
              : "Your body listens to what your soul refuses to speak."}
          </p>
        </CardHeader>
      </Card>

      <p className="text-xs text-center text-muted-foreground bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
        ⚠️ {language === "hi" 
          ? "अस्वीकरण: यह केवल आध्यात्मिक और भावनात्मक मार्गदर्शन है। चिकित्सा सलाह नहीं।" 
          : "Disclaimer: This is spiritual and emotional guidance only. Not medical advice."}
      </p>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChakraRadarChart chakraAlignment={chakraAlignment} />
        <EmotionalOverloadMeter
          emotionalOverloadScore={health.emotionalOverloadScore}
          balanceScore={health.balanceScore}
          stressPattern={health.stressPattern}
        />
      </div>

      {/* Stress & Exhaustion */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 flex-shrink-0" />
              {language === "hi" ? "थकान मार्कर" : "Exhaustion Markers"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {health.exhaustionMarkers.map((marker, i) => (
                <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {marker}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-500 flex-shrink-0" />
              {language === "hi" ? "तंत्रिका तंत्र प्रवृत्ति" : "Nervous System Tendency"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{health.nervousSystemTendency}</p>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                {language === "hi" ? "नींद/बर्नआउट चक्र" : "Sleep/Burnout Cycle"}
              </p>
              <p className="text-sm font-medium">{health.sleepBurnoutCycle}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Body Sensitivity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            {language === "hi" ? "शरीर-ऊर्जा संवेदनशीलता" : "Body-Energy Sensitivity"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{health.bodySensitivity}</p>
        </CardContent>
      </Card>

      {/* Chakra Imbalances */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />
            {language === "hi" ? "चक्र असंतुलन संकेतक" : "Chakra Imbalance Indicators"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {health.chakraImbalances.map((chakra, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{chakra.chakra}</span>
                  <Badge variant="outline" className={getChakraStatusColor(chakra.status)}>
                    {statusLabels[chakra.status]?.[language] || chakra.status}
                  </Badge>
                </div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{chakra.guidance}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grounding Practices */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
            {language === "hi" ? "5 दैनिक ग्राउंडिंग अभ्यास" : "5 Daily Grounding Practices"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {health.groundingPractices.map((practice, i) => (
              <div key={i} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-2">
                <span className="text-green-600 font-bold">{i + 1}.</span>
                <span className="text-sm text-green-700 dark:text-green-300">{practice}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Affirmations */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            {language === "hi" ? "संरेखण के लिए पुष्टि" : "Affirmations for Alignment"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {health.affirmations.map((affirmation, i) => (
              <div key={i} className="p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                <p className="text-sm italic text-foreground">"{affirmation}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
