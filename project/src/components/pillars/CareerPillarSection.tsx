import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CareerGuidance } from "@/lib/lifePillars";
import { WorkStyleRadarChart, CareerMomentumChart } from "@/components/charts";

interface CareerPillarSectionProps {
  career: CareerGuidance;
}

export const CareerPillarSection: React.FC<CareerPillarSectionProps> = ({ career }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-primary/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display text-lg sm:text-xl text-balance leading-tight">
            <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0" />
            {language === "hi" ? "💼 करियर और सफलता" : "💼 Career & Success"}
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {language === "hi" 
              ? "आपका काम वह मंच है जहां भाग्य बोलता है।" 
              : "Your work is the stage where destiny speaks."}
          </p>
        </CardHeader>
      </Card>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <WorkStyleRadarChart
          workStyleScore={career.workStyle.score}
          primaryStyle={career.workStyle.primary}
        />
        <CareerMomentumChart monthlyCareerEnergy={career.monthlyCareerEnergy} />
      </div>

      {/* Work Style & Industries */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {language === "hi" ? "कार्य शैली" : "Work Style"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="font-semibold text-primary">{career.workStyle.primary}</p>
              <p className="text-sm text-muted-foreground mt-1">{career.workStyle.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">
                {language === "hi" ? "जॉब vs बिज़नेस" : "Job vs Business"}
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {language === "hi" ? "जॉब" : "Job"}: {career.jobVsBusinessScore.job}%
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {language === "hi" ? "बिज़नेस" : "Business"}: {career.jobVsBusinessScore.business}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{career.jobVsBusinessScore.verdict}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {language === "hi" ? "उपयुक्त उद्योग" : "Suitable Industries"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {career.suitableIndustries.map((industry, i) => (
                <Badge key={i} variant="secondary">{industry}</Badge>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">
                {language === "hi" ? "विकास दिशाएं" : "Growth Directions"}
              </p>
              <ul className="space-y-1">
                {career.growthDirections.map((dir, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">→</span> {dir}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Blocks */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-green-600">
              {language === "hi" ? "कार्यस्थल ताकतें" : "Workplace Strengths"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {career.workplaceStrengths.map((strength, i) => (
                <Badge key={i} className="bg-green-100 text-green-700 hover:bg-green-200">
                  ✓ {strength}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg text-amber-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {language === "hi" ? "छिपी बाधाएं" : "Hidden Blocks"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {career.hiddenBlocks.map((block, i) => (
                <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  ⚠ {block}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biggest Challenge */}
      <Card className="border-red-200 bg-red-50/30 dark:bg-red-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg text-red-600">
            {language === "hi" ? "सबसे बड़ी चुनौती" : "Biggest Challenge"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium">{career.biggestChallenge.challenge}</p>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {language === "hi" ? "मानसिकता सुधार" : "Mindset Correction"}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {career.biggestChallenge.mindsetCorrection}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decision Triggers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            {language === "hi" ? "निर्णय ट्रिगर" : "Decision Triggers"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {career.decisionTriggers.map((trigger, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold">{i + 1}.</span>
                <span className="text-muted-foreground">{trigger}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
