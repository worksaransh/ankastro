import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { analyzeVehicle as analyzeVehiclePlate, analyzeHouse as analyzeHouseNumber, VehicleAnalysis } from '@/lib/vehicleHouseVibration';
import { getRecommendationsForNumber, RecommendationItem } from '@/lib/recommendationHelper';
import RecommendationCard from '@/components/RecommendationCard';
import DobInput from '@/components/DobInput';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ArrowRight, Car, Home, ShieldCheck, Zap, Star, Calendar } from 'lucide-react';

export default function LuckyNumberCheckerPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [mode, setMode] = useState<'vehicle' | 'house'>('vehicle');
  const [dob, setDob] = useState('1992-05-15');
  const [numberInput, setNumberInput] = useState('MH 02 AK 4567');
  const [analysis, setAnalysis] = useState<VehicleAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    if (!numberInput.trim() || !dob) {
      setAnalysis(null);
      return;
    }

    const cleanDob = dob.includes('-') ? dob.split('-').reverse().join('/') : dob;
    let res: VehicleAnalysis;

    if (mode === 'vehicle') {
      res = analyzeVehiclePlate(numberInput, cleanDob);
    } else {
      res = analyzeHouseNumber(numberInput, cleanDob);
    }

    setAnalysis(res);

    getRecommendationsForNumber(res.root).then((items) => {
      setRecommendations(items.slice(0, 2));
    });
  }, [numberInput, dob, mode]);

  return (
    <>
      <SEO
        title="Vehicle & House Number Compatibility Checker — AnkJyotish"
        description="Check if your car plate digit, flat number, or house number is lucky for your Date of Birth using Vedic numerology."
        canonical="/lucky-number-checker"
        keywords="vehicle number numerology, house number numerology calculator, lucky car plate number, flat number compatibility"
      />

      <div className="min-h-screen bg-[#0d0714] text-white spiritual-pattern pb-16">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0d0714]/90 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/"><Logo size="sm" /></Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button size="sm" onClick={() => navigate('/buy-report')} className="bg-primary hover:bg-primary/90 text-white text-xs gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Special Report
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1 text-xs">
              🚗 🏠 Instant Asset Vibrations
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-white to-amber-400 bg-clip-text text-transparent">
              {isHi ? 'वाहन व मकान नंबर अनुकूलता चेकर' : 'Lucky Vehicle & House Number Checker'}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Check whether your car plate or flat number is friendly with your birth date for safety, prosperity, and peace.
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-[#150f26] border-white/10 shadow-2xl p-6 sm:p-8 rounded-3xl">
            <CardContent className="p-0 space-y-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                <TabsList className="grid grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-2xl">
                  <TabsTrigger value="vehicle" className="gap-2 text-xs sm:text-sm">
                    <Car className="w-4 h-4 text-amber-400" /> Vehicle Plate
                  </TabsTrigger>
                  <TabsTrigger value="house" className="gap-2 text-xs sm:text-sm">
                    <Home className="w-4 h-4 text-violet-400" /> House / Flat Number
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date of Birth *
                  </Label>
                  <DobInput
                    id="checker-dob"
                    value={dob}
                    onChange={(val) => setDob(val)}
                    outputFormat="yyyy-mm-dd"
                    language={language}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-200">
                    {mode === 'vehicle' ? 'Car / Vehicle Plate Number' : 'House / Flat Number'} *
                  </Label>
                  <Input
                    type="text"
                    placeholder={mode === 'vehicle' ? 'e.g. MH 02 AK 4567' : 'e.g. Flat 402, Block B'}
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                    className="h-11 bg-white/5 border-white/15 text-white placeholder-gray-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Badge Card */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-400 block mb-1">Root Vibration</span>
                      <div className="font-display text-4xl font-extrabold text-amber-300">
                        {analysis.root}
                      </div>
                      <Badge className={`mt-3 ${analysis.vsMulank === 'friendly' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                        {analysis.vsMulank === 'friendly' ? 'Highly Compatible' : 'Neutral Vibration'}
                      </Badge>
                    </div>

                    {/* Energy Ratings */}
                    <div className="sm:col-span-2 bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Energy Vibrations Breakdown
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Safety</span>
                          <span className="font-bold text-sm text-emerald-400">{analysis.energy.safety}%</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Luck</span>
                          <span className="font-bold text-sm text-amber-400">{analysis.energy.luck}%</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Harmony</span>
                          <span className="font-bold text-sm text-violet-400">{analysis.energy.harmony}%</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed pt-1">
                        {analysis.meaning[language === 'hi' ? 'hi' : 'en']}
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Protective Gemstone / Yantra for Vehicle & House
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {recommendations.map((item) => (
                          <RecommendationCard key={item.id} item={item} sourcePage="lucky_number_checker" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Soft Paywall CTA */}
                  <div className="p-6 rounded-2xl bg-gradient-to-tr from-violet-950 via-[#1c1538] to-[#120d29] border border-primary/30 text-center space-y-3 shadow-xl">
                    <h3 className="text-lg font-bold font-display text-white">
                      Need a Full Vehicle or Property Numerology Report?
                    </h3>
                    <p className="text-xs text-gray-300 max-w-lg mx-auto">
                      Get complete remedies, auspicious purchase dates, color matching, and protective mantras for your vehicle or home.
                    </p>
                    <Button onClick={() => navigate('/buy-report')} className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 text-white font-bold text-sm h-11 px-8 rounded-xl gap-2 shadow-lg shadow-primary/20">
                      <span>Get Specialized Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
