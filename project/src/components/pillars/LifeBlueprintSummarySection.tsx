import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Save, Briefcase, Heart, Wallet, Leaf, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LifeBlueprintSummary } from "@/lib/lifePillars";

interface LifeBlueprintSummarySectionProps {
  summary: LifeBlueprintSummary;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

export const LifeBlueprintSummarySection: React.FC<LifeBlueprintSummarySectionProps> = ({
  summary,
  onDownloadPdf,
  isGeneratingPdf,
}) => {
  const { language } = useLanguage();

  const pillars = [
    { icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100", tagline: summary.careerTagline, emoji: "💼" },
    { icon: Heart, color: "text-pink-600", bg: "bg-pink-100", tagline: summary.loveTagline, emoji: "❤️" },
    { icon: Wallet, color: "text-green-600", bg: "bg-green-100", tagline: summary.moneyTagline, emoji: "💰" },
    { icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-100", tagline: summary.healthTagline, emoji: "🌿" },
    { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100", tagline: summary.growthTagline, emoji: "✨" },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
        <CardContent className="pt-8 pb-6">
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              {language === "hi" ? "जीवन ब्लूप्रिंट सारांश" : "Life Blueprint Summary"}
            </h2>
            <p className="text-muted-foreground">
              {language === "hi" 
                ? "आपके 5 जीवन स्तंभों का संपूर्ण अवलोकन" 
                : "Complete overview of your 5 life pillars"}
            </p>
          </div>

          {/* Pillar Taglines */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="p-4 bg-background/80 rounded-lg text-center hover:scale-105 transition-transform"
              >
                <div className={`w-12 h-12 mx-auto rounded-full ${pillar.bg} flex items-center justify-center mb-3`}>
                  <span className="text-2xl">{pillar.emoji}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">"{pillar.tagline}"</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              size="lg"
              className="gap-2"
            >
              <Download className="w-5 h-5" />
              {isGeneratingPdf 
                ? (language === "hi" ? "जनरेट हो रहा है..." : "Generating...") 
                : (language === "hi" ? "100+ पेज PDF डाउनलोड करें" : "Download 100+ Page PDF")}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {/* TODO: Email functionality */}}
            >
              <Mail className="w-5 h-5" />
              {language === "hi" ? "ईमेल पर भेजें" : "Send to Email"}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {/* TODO: Save to dashboard */}}
            >
              <Save className="w-5 h-5" />
              {language === "hi" ? "डैशबोर्ड में सेव करें" : "Save to Dashboard"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Closing Quote */}
      <Card className="bg-gradient-to-br from-divine/10 to-spiritual/10">
        <CardContent className="py-8 text-center">
          <p className="font-display text-xl text-foreground mb-4">
            {language === "hi" 
              ? "\"आपकी संख्याएं आपकी ब्रह्मांडीय उंगलियों के निशान हैं। उन्हें अपनाएं।\""
              : "\"Your numbers are your cosmic fingerprint. Embrace them.\""}
          </p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {language === "hi" 
              ? "यह उन्नत रिपोर्ट प्राचीन वैदिक ज्ञान को आधुनिक अंकशास्त्र के साथ जोड़ती है।"
              : "This advanced report combines ancient Vedic wisdom with modern numerology."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
