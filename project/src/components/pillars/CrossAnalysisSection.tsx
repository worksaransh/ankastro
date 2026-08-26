import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, HelpCircle, Building } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CrossAnalysis, ConflictResolver, DecisionEngine } from "@/lib/lifePillars";

interface CrossAnalysisSectionProps {
  crossAnalysis: CrossAnalysis;
  conflictResolver: ConflictResolver;
  decisionEngine: DecisionEngine;
}

export const CrossAnalysisSection: React.FC<CrossAnalysisSectionProps> = ({
  crossAnalysis,
  conflictResolver,
  decisionEngine,
}) => {
  const { language } = useLanguage();

  const analyses = [
    { key: 'careerLoveConflict', icon: '💼❤️', label: language === "hi" ? 'करियर-प्रेम संघर्ष' : 'Career-Love Conflict', data: crossAnalysis.careerLoveConflict },
    { key: 'moneyGrowthSynergy', icon: '💰✨', label: language === "hi" ? 'धन-विकास तालमेल' : 'Money-Growth Synergy', data: crossAnalysis.moneyGrowthSynergy },
    { key: 'healthSuccessBalance', icon: '🌿💼', label: language === "hi" ? 'स्वास्थ्य-सफलता संतुलन' : 'Health-Success Balance', data: crossAnalysis.healthSuccessBalance },
    { key: 'loveAbundanceBlock', icon: '❤️💰', label: language === "hi" ? 'प्रेम-समृद्धि ब्लॉक' : 'Love-Abundance Block', data: crossAnalysis.loveAbundanceBlock },
    { key: 'destinyMulankMisalignment', icon: '🔢⭐', label: language === "hi" ? 'भाग्य-मूलांक असंरेखण' : 'Destiny-Mulank Misalignment', data: crossAnalysis.destinyMulankMisalignment },
  ];

  return (
    <div className="space-y-5">
      {/* Cross Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-xl">
            <Zap className="w-6 h-6 text-primary" />
            {language === "hi" ? "क्रॉस-पिलर विश्लेषण" : "Cross-Pillar Analysis"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {language === "hi" 
              ? "यह रिपोर्ट आपको आपसे बेहतर समझती है।" 
              : "This report understands you better than you understand yourself."}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyses.map((analysis) => (
              analysis.data?.exists && (
                <div key={analysis.key} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{analysis.icon}</span>
                    <span className="font-medium">{analysis.label}</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      {language === "hi" ? "ध्यान दें" : "Attention Needed"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(analysis.data as any).guidance || (analysis.data as any).opportunity || (analysis.data as any).advice || (analysis.data as any).logic || (analysis.data as any).correction}
                  </p>
                </div>
              )
            ))}
            {!analyses.some(a => a.data?.exists) && (
              <p className="text-center text-muted-foreground py-4">
                {language === "hi" 
                  ? "कोई महत्वपूर्ण क्रॉस-पिलर मुद्दे नहीं मिले।" 
                  : "No significant cross-pillar issues detected."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Resolver */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {language === "hi" ? "संघर्ष समाधानकर्ता" : "Conflict Resolver"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {language === "hi" 
              ? "आप भावनात्मक रूप से कैसे लड़ते / बचते / भागते / हमला करते हैं" 
              : "How you fight / avoid / run / attack emotionally"}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge className="bg-amber-100 text-amber-700">{conflictResolver.style}</Badge>
          <p className="text-sm text-muted-foreground">{conflictResolver.description}</p>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              {language === "hi" ? "सुधार" : "Improvement"}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {conflictResolver.improvement}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decision Engine */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            {language === "hi" ? "निर्णय-स्पष्टता इंजन" : "Decision-Clarity Engine"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {language === "hi" ? "हाँ / नहीं / अभी नहीं संभावना स्कोर" : "Yes / No / Not now probability score"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">{decisionEngine.yesScore}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "hi" ? "हाँ" : "Yes"}
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-600">{decisionEngine.noScore}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "hi" ? "नहीं" : "No"}
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
              <p className="text-3xl font-bold text-amber-600">{decisionEngine.waitScore}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "hi" ? "रुकें" : "Wait"}
              </p>
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">
              {language === "hi" ? "सिफारिश" : "Recommendation"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{decisionEngine.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface BusinessNameNumerologyProps {
  businessName: string;
  score: number;
  vibration: string;
  compatibility: string;
}

export const BusinessNameNumerology: React.FC<BusinessNameNumerologyProps> = ({
  businessName,
  score,
  vibration,
  compatibility,
}) => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building className="w-5 h-5 text-primary" />
          {language === "hi" ? "व्यापार नाम अंकशास्त्र" : "Business Name Numerology"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-xl font-display font-bold text-primary">{businessName}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{score}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {language === "hi" ? "स्कोर" : "Score"}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">{vibration}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {language === "hi" ? "स्पंदन" : "Vibration"}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">{compatibility}</p>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {language === "hi" ? "संगतता" : "Compatibility"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
