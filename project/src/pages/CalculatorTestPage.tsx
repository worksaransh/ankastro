import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Check, AlertCircle, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { CalculationProofCard } from '@/components/CalculationProofCard';
import { generateAllProofs } from '@/lib/calculationProofs';
import { 
  calculateLifePath, 
  calculateDestiny, 
  calculateSoulUrge, 
  calculatePersonality,
  calculateBirthday,
  calculateMaturity
} from '@/lib/numerology';
import { calculateMulank, calculateBhagyank } from '@/lib/vedicNumerology';
import SEO from '@/components/SEO';

const CalculatorTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [results, setResults] = useState<any>(null);
  const [proofs, setProofs] = useState<any[]>([]);

  const labels = {
    en: {
      title: 'Numerology Calculator & Verification',
      subtitle: 'Test and verify all numerology calculations with step-by-step proof',
      fullName: 'Full Birth Name',
      fullNamePlaceholder: 'Enter your full name as on birth certificate',
      dob: 'Date of Birth',
      dobPlaceholder: 'DD/MM/YYYY',
      calculate: 'Calculate All Numbers',
      results: 'Your Numbers',
      proofs: 'Calculation Proofs',
      pythagorean: 'Pythagorean Chart',
      vedic: 'Vedic Chart',
      letterChart: 'Letter to Number Chart (Pythagorean)',
      enterDetails: 'Enter your details above to see calculations',
      verifyNote: 'All calculations follow standard professional numerology formulas',
      lifePath: 'Life Path',
      destiny: 'Destiny/Expression',
      soulUrge: 'Soul Urge',
      personality: 'Personality',
      birthday: 'Birthday',
      maturity: 'Maturity',
      mulank: 'Mulank (मूलांक)',
      bhagyank: 'Bhagyank (भाग्यांक)',
      back: 'Back'
    },
    hi: {
      title: 'अंकशास्त्र कैलकुलेटर और सत्यापन',
      subtitle: 'चरण-दर-चरण प्रमाण के साथ सभी अंकशास्त्र गणनाओं का परीक्षण और सत्यापन करें',
      fullName: 'पूरा जन्म नाम',
      fullNamePlaceholder: 'जन्म प्रमाणपत्र के अनुसार पूरा नाम दर्ज करें',
      dob: 'जन्म तिथि',
      dobPlaceholder: 'DD/MM/YYYY',
      calculate: 'सभी संख्याओं की गणना करें',
      results: 'आपकी संख्याएं',
      proofs: 'गणना प्रमाण',
      pythagorean: 'पाइथागोरियन चार्ट',
      vedic: 'वैदिक चार्ट',
      letterChart: 'अक्षर से संख्या चार्ट (पाइथागोरियन)',
      enterDetails: 'गणना देखने के लिए ऊपर अपना विवरण दर्ज करें',
      verifyNote: 'सभी गणनाएं मानक पेशेवर अंकशास्त्र सूत्रों का पालन करती हैं',
      lifePath: 'जीवन पथ',
      destiny: 'नियति/अभिव्यक्ति',
      soulUrge: 'आत्मा की इच्छा',
      personality: 'व्यक्तित्व',
      birthday: 'जन्मदिन',
      maturity: 'परिपक्वता',
      mulank: 'मूलांक',
      bhagyank: 'भाग्यांक',
      back: 'वापस'
    },
    hinglish: {
      title: 'Numerology Calculator aur Verification',
      subtitle: 'Step-by-step proof ke saath sab numerology calculations test aur verify karo',
      fullName: 'Full Birth Name',
      fullNamePlaceholder: 'Birth certificate ke according full naam daalo',
      dob: 'Date of Birth',
      dobPlaceholder: 'DD/MM/YYYY',
      calculate: 'Sab Numbers Calculate Karo',
      results: 'Aapke Numbers',
      proofs: 'Calculation Proofs',
      pythagorean: 'Pythagorean Chart',
      vedic: 'Vedic Chart',
      letterChart: 'Letter to Number Chart (Pythagorean)',
      enterDetails: 'Calculations dekhne ke liye upar apni details daalo',
      verifyNote: 'Sab calculations standard professional numerology formulas follow karti hain',
      lifePath: 'Life Path',
      destiny: 'Destiny/Expression',
      soulUrge: 'Soul Urge',
      personality: 'Personality',
      birthday: 'Birthday',
      maturity: 'Maturity',
      mulank: 'Mulank (मूलांक)',
      bhagyank: 'Bhagyank (भाग्यांक)',
      back: 'Back'
    }
  };

  const t = labels[language] || labels.en;

  const handleCalculate = () => {
    if (!fullName.trim() || !dob.trim()) return;
    
    // Calculate all numbers
    const lifePath = calculateLifePath(dob);
    const destiny = calculateDestiny(fullName);
    const soulUrge = calculateSoulUrge(fullName);
    const personality = calculatePersonality(fullName);
    const birthday = calculateBirthday(dob);
    const maturity = calculateMaturity(lifePath, destiny);
    const mulank = calculateMulank(dob);
    const bhagyank = calculateBhagyank(dob);
    
    setResults({
      lifePath,
      destiny,
      soulUrge,
      personality,
      birthday,
      maturity,
      mulank,
      bhagyank
    });
    
    // Generate proofs
    const allProofs = generateAllProofs(dob, fullName);
    setProofs(allProofs);
  };

  const pythagoreanChart = [
    { letters: 'A J S', value: 1 },
    { letters: 'B K T', value: 2 },
    { letters: 'C L U', value: 3 },
    { letters: 'D M V', value: 4 },
    { letters: 'E N W', value: 5 },
    { letters: 'F O X', value: 6 },
    { letters: 'G P Y', value: 7 },
    { letters: 'H Q Z', value: 8 },
    { letters: 'I R', value: 9 },
  ];

  return (
    <>
      <SEO
        title="Free Vedic Numerology Calculator — Mulank, Bhagyank, Life Path"
        description="Free online numerology calculator. Instantly find your Mulank, Bhagyank, Life Path & Destiny number using Vedic + Pythagorean methods."
        keywords="numerology calculator, mulank calculator, bhagyank calculator, life path calculator, free numerology"
        canonical="/calculator"
      />
          <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Button>
          <LanguageToggle />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Letter Chart Reference */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t.letterChart}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
              {pythagoreanChart.map((item) => (
                <div key={item.value} className="text-center p-2 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{item.value}</div>
                  <div className="text-xs text-muted-foreground font-mono">{item.letters}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.fullName}</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">{t.dob}</Label>
                <Input
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder={t.dobPlaceholder}
                  className="text-lg font-mono"
                />
              </div>
            </div>
            <Button 
              className="w-full mt-4 gap-2" 
              size="lg"
              onClick={handleCalculate}
              disabled={!fullName.trim() || !dob.trim()}
            >
              <Calculator className="h-5 w-5" />
              {t.calculate}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results ? (
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="results" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {t.results}
              </TabsTrigger>
              <TabsTrigger value="proofs" className="gap-2">
                <Calculator className="h-4 w-4" />
                {t.proofs}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pythagorean Numbers */}
                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-background">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.pythagorean}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ResultRow label={t.lifePath} value={results.lifePath} />
                    <ResultRow label={t.destiny} value={results.destiny} />
                    <ResultRow label={t.soulUrge} value={results.soulUrge} />
                    <ResultRow label={t.personality} value={results.personality} />
                    <ResultRow label={t.birthday} value={results.birthday} />
                    <ResultRow label={t.maturity} value={results.maturity} />
                  </CardContent>
                </Card>

                {/* Vedic Numbers */}
                <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-background">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.vedic}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ResultRow label={t.mulank} value={results.mulank} />
                    <ResultRow label={t.bhagyank} value={results.bhagyank} />
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <Check className="h-4 w-4 text-green-500" />
                {t.verifyNote}
              </div>
            </TabsContent>

            <TabsContent value="proofs" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                {proofs.map((proof, idx) => (
                  <CalculationProofCard key={idx} proof={proof} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t.enterDetails}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
};

const ResultRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
    <span className="text-sm font-medium">{label}</span>
    <Badge variant="secondary" className="text-lg font-bold px-3">
      {value}
    </Badge>
  </div>
);

export default CalculatorTestPage;
