import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Calculator, Lightbulb, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CalculationProof } from '@/lib/calculationProofs';

interface CalculationProofCardProps {
  proof: CalculationProof;
}

export const CalculationProofCard: React.FC<CalculationProofCardProps> = ({ proof }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    en: {
      howCalculated: 'How was this calculated?',
      showSteps: 'Show calculation steps',
      hideSteps: 'Hide steps',
      step: 'Step',
      whyThisNumber: 'Why this number?',
      spiritualMeaning: 'Spiritual Significance',
      yourNumber: 'Your number is'
    },
    hi: {
      howCalculated: 'यह कैसे निकला?',
      showSteps: 'गणना के चरण दिखाएं',
      hideSteps: 'चरण छुपाएं',
      step: 'चरण',
      whyThisNumber: 'यह संख्या क्यों?',
      spiritualMeaning: 'आध्यात्मिक महत्व',
      yourNumber: 'आपकी संख्या है'
    },
    hinglish: {
      howCalculated: 'Yeh kaise nikla?',
      showSteps: 'Calculation steps dikhao',
      hideSteps: 'Steps chupao',
      step: 'Step',
      whyThisNumber: 'Yeh number kyun?',
      spiritualMeaning: 'Spiritual Significance',
      yourNumber: 'Aapka number hai'
    }
  };

  const t = labels[language] || labels.en;
  const lang = language as 'en' | 'hi' | 'hinglish';

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            {proof.numberName}
          </CardTitle>
          <Badge variant="secondary" className="text-xl font-bold px-4 py-1 bg-primary/10 text-primary">
            {proof.finalValue}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Collapsible Calculation Steps */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full justify-between p-2 rounded-lg bg-primary/5 hover:bg-primary/10">
            <span className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t.howCalculated}
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-3 space-y-3">
            {proof.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="rounded-full h-6 w-6 flex items-center justify-center text-xs">
                    {step.step}
                  </Badge>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {step.description[lang] || step.description.en}
                  </p>
                  <pre className="text-sm font-mono bg-background p-2 rounded border whitespace-pre-wrap">
                    {step.calculation}
                  </pre>
                  <p className="text-sm font-semibold text-primary">
                    = {step.result}
                  </p>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Why This Number */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
            <Lightbulb className="h-4 w-4" />
            {t.whyThisNumber}
          </h4>
          <p className="text-sm text-muted-foreground">
            {proof.whyThisNumber[lang] || proof.whyThisNumber.en}
          </p>
        </div>

        {/* Spiritual Significance */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <h4 className="text-sm font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2">
            <Sparkles className="h-4 w-4" />
            {t.spiritualMeaning}
          </h4>
          <p className="text-sm text-muted-foreground">
            {proof.spiritualSignificance[lang] || proof.spiritualSignificance.en}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationProofCard;
