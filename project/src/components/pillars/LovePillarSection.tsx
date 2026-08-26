import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, MessageCircle, Shield, AlertTriangle, Smile, Sparkles, Calendar, TrendingUp, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoveGuidance } from "@/lib/lifePillars";
import { RelationshipPolarityChart } from "@/components/charts";
import TierGate from "@/components/TierGate";
import { hasAccess, type Tier } from "@/lib/tiers";

interface LovePillarSectionProps {
  love: LoveGuidance;
  unlockedTier?: Tier;
  reportId?: string;
}

export const LovePillarSection: React.FC<LovePillarSectionProps> = ({ love, unlockedTier = 'master', reportId }) => {
  const { language } = useLanguage();
  const partner = love.partnerCompatibility;
  const partnerUnlocked = hasAccess(unlockedTier, 'master');

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-pink-500/10 to-red-500/5 border-pink-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display text-lg sm:text-xl text-balance leading-tight">
            <Heart className="w-6 h-6 text-pink-500 flex-shrink-0" />
            {language === "hi" ? "❤️ प्रेम और रिश्ते" : "❤️ Love & Relationships"}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {partner 
              ? (language === "hi" 
                  ? `${partner.partnerName} के साथ आपका विशेष बंधन` 
                  : `Your special bond with ${partner.partnerName}`)
              : (language === "hi" 
                  ? "आपका दिल इस जीवन से परे की यादें संजोए है।" 
                  : "Your heart carries memory beyond this lifetime.")}
          </p>
        </CardHeader>
      </Card>

      {/* Partner Compatibility Section - Master tier only */}
      {partner && !partnerUnlocked && (
        <TierGate
          unlocked={unlockedTier}
          required="master"
          reportId={reportId}
          featureLabel={language === 'hi' ? 'पार्टनर अनुकूलता रिपोर्ट' : 'Partner Compatibility Report'}
        >
          <div />
        </TierGate>
      )}
      {partner && partnerUnlocked && (
        <>
          {/* Main Compatibility Score Card */}
          <Card className="bg-gradient-to-r from-pink-500/5 via-red-500/5 to-purple-500/5 border-pink-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  {language === "hi" ? `${partner.partnerName} के साथ अनुकूलता` : `Compatibility with ${partner.partnerName}`}
                </div>
                <Badge 
                  className={
                    partner.compatibilityLevel === 'Excellent' ? 'bg-green-500' :
                    partner.compatibilityLevel === 'Good' ? 'bg-blue-500' :
                    partner.compatibilityLevel === 'Moderate' ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }
                >
                  {partner.compatibilityLevel}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-display font-bold text-pink-500">
                  {partner.compatibilityScore}%
                </div>
                <div className="flex-1">
                  <Progress value={partner.compatibilityScore} className="h-3" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{language === "hi" ? "पार्टनर का मूलांक" : "Partner's Mulank"}</p>
                  <p className="text-2xl font-display font-bold text-primary">{partner.partnerMulank}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{language === "hi" ? "पार्टनर का भाग्यांक" : "Partner's Bhagyank"}</p>
                  <p className="text-2xl font-display font-bold text-primary">{partner.partnerBhagyank}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relationship Dynamics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                {language === "hi" ? "रिश्ते की गतिशीलता" : "Relationship Dynamics"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{language === "hi" ? "नेतृत्व" : "Leadership"}</p>
                  <p className="text-sm font-medium">{partner.relationshipDynamics.leadership}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{language === "hi" ? "भावनात्मक प्रवाह" : "Emotional Flow"}</p>
                  <p className="text-sm font-medium">{partner.relationshipDynamics.emotionalFlow}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{language === "hi" ? "वित्तीय सामंजस्य" : "Financial Harmony"}</p>
                  <p className="text-sm font-medium">{partner.relationshipDynamics.financialHarmony}</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{language === "hi" ? "अंतरंगता मिलान" : "Intimacy Match"}</p>
                  <p className="text-sm font-medium">{partner.relationshipDynamics.intimacyMatch}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths, Challenges & Growth */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-700">
                  💚 {language === "hi" ? "ताकतें" : "Strengths"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {partner.strengths.map((strength, i) => (
                    <li key={i} className="text-xs text-green-600">✓ {strength}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-orange-50/50 dark:bg-orange-900/10 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-orange-700">
                  ⚡ {language === "hi" ? "चुनौतियां" : "Challenges"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {partner.challenges.map((challenge, i) => (
                    <li key={i} className="text-xs text-orange-600">• {challenge}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-purple-50/50 dark:bg-purple-900/10 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-purple-700">
                  🌱 {language === "hi" ? "विकास क्षेत्र" : "Growth Areas"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {partner.growthAreas.map((area, i) => (
                    <li key={i} className="text-xs text-purple-600">→ {area}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Soul Contract & Karmic Lesson */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  {language === "hi" ? "आत्मा का अनुबंध" : "Soul Contract"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-foreground">{partner.soulContractInsight}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  {language === "hi" ? "कार्मिक सबक" : "Karmic Lesson Together"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-foreground">{partner.karmicLessonTogether}</p>
              </CardContent>
            </Card>
          </div>

          {/* Communication & Conflict Resolution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                {language === "hi" ? "संवाद शैली" : "Communication Style"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">{partner.communicationStyle}</p>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{language === "hi" ? "संघर्ष समाधान सुझाव" : "Conflict Resolution Tip"}</p>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{partner.conflictResolutionTip}</p>
              </div>
            </CardContent>
          </Card>

          {/* Best Dates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500 flex-shrink-0" />
                {language === "hi" ? "महत्वपूर्ण कार्यों के लिए शुभ तिथियां" : "Best Dates for Important Events"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {partner.bestDatesForImportantEvents.map((date, i) => (
                  <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    📅 {date}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Chart & Vibration */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RelationshipPolarityChart
          polarityScore={love.polarityScore}
          loveVibration={love.loveVibration.type}
        />
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Smile className="w-5 h-5 text-pink-500 flex-shrink-0" />
              {language === "hi" ? "प्रेम स्पंदन" : "Love Vibration"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <p className="font-semibold text-pink-600">{love.loveVibration.type}</p>
              <p className="text-sm text-muted-foreground mt-1">{love.loveVibration.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">
                {language === "hi" ? "रिश्ते की शैली" : "Relationship Style"}
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">{language === "hi" ? "लगाव:" : "Attachment:"}</span> <span className="font-medium">{love.relationshipStyle.attachment}</span></p>
                <p><span className="text-muted-foreground">{language === "hi" ? "सुरक्षा:" : "Security:"}</span> <span className="font-medium">{love.relationshipStyle.security}</span></p>
                <p><span className="text-muted-foreground">{language === "hi" ? "भावनात्मक भाषा:" : "Emotional Language:"}</span> <span className="font-medium">{love.relationshipStyle.emotionalLanguage}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attractions & Fears */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-green-600">
              {language === "hi" ? "आपको क्या आकर्षित करता है" : "What Attracts You"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {love.attractionPatterns.attracts.map((item, i) => (
                <Badge key={i} className="bg-green-100 text-green-700">💚 {item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-red-600">
              {language === "hi" ? "आपको क्या डराता है" : "What Scares You"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {love.attractionPatterns.fears.map((item, i) => (
                <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  💔 {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relationship Patterns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {language === "hi" ? "रिश्ते के पैटर्न" : "Relationship Patterns"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {love.relationshipPatterns.map((pattern, i) => (
              <Badge key={i} variant="secondary">{pattern}</Badge>
            ))}
          </div>
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {language === "hi" ? "आत्मा का सबक" : "Soul Lesson"}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">{love.soulLesson}</p>
          </div>
        </CardContent>
      </Card>

      {/* Flags Section */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700">
              🟢 {language === "hi" ? "ग्रीन फ्लैग्स (चलेगा)" : "Green Flags (Go)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {love.flags.green.map((flag, i) => (
                <li key={i} className="text-xs text-green-600">✓ {flag}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-yellow-700">
              🟡 {language === "hi" ? "येलो फ्लैग्स (धीरे)" : "Yellow Flags (Slow)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {love.flags.yellow.map((flag, i) => (
                <li key={i} className="text-xs text-yellow-600">⚡ {flag}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 dark:bg-red-900/10 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-700">
              🔴 {language === "hi" ? "रेड फ्लैग्स (बचें)" : "Red Flags (Avoid)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {love.flags.red.map((flag, i) => (
                <li key={i} className="text-xs text-red-600">✗ {flag}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Healing Statements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {language === "hi" ? "उपचार वक्तव्य" : "Healing Statements"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {love.healingStatements.map((statement, i) => (
              <div key={i} className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-lg">
                <p className="text-sm italic text-foreground">"{statement}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Scripts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {language === "hi" ? "संवाद स्क्रिप्ट" : "Communication Scripts"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {language === "hi" 
              ? "जब आप आहत / उलझे / डरे हों तो कैसे बात करें" 
              : "How to talk when hurt / confused / scared"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {love.communicationScripts.map((script, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">{script.situation}</p>
                <p className="text-sm font-medium text-primary">"{script.script}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timing Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            {language === "hi" ? "समय अंतर्दृष्टि" : "Timing Insights"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {language === "hi" ? "विवाह समय" : "Marriage Timing"}
              </p>
              <p className="font-medium">{love.timingInsights.marriageTiming}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {language === "hi" ? "भावनात्मक परिपक्वता आयु" : "Emotional Maturity Age"}
              </p>
              <p className="font-medium">{love.timingInsights.emotionalMaturityAge} {language === "hi" ? "वर्ष" : "years"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
