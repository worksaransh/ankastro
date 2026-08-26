import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { calculateNameVibration, VibrationResult } from '@/lib/nameVibration';
import { getRecommendationsForNumber, RecommendationItem } from '@/lib/recommendationHelper';
import RecommendationCard from '@/components/RecommendationCard';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Star, User, Lock, Gift, Mail } from 'lucide-react';

export default function NameAnalyzerPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [inputName, setInputName] = useState('Aarav Sharma');
  const [debouncedName, setDebouncedName] = useState(inputName);
  const [result, setResult] = useState<VibrationResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  // Lead capture state
  const [email, setEmail] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(inputName);
    }, 350);
    return () => clearTimeout(handler);
  }, [inputName]);

  useEffect(() => {
    if (!debouncedName.trim()) {
      setResult(null);
      return;
    }
    const res = calculateNameVibration(debouncedName);
    setResult(res);

    // Fetch matched recommendation
    getRecommendationsForNumber(res.chaldeanRoot || res.root).then((items) => {
      setRecommendations(items.slice(0, 2));
    });
  }, [debouncedName]);

  const handleCaptureLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setCapturing(true);
    try {
      await supabase.from('leads').insert({
        email: email.trim(),
        name: inputName.trim(),
        source: 'name_analyzer',
        computed_number: result?.chaldeanRoot || result?.root || 1,
        created_at: new Date().toISOString(),
      });
    } catch {
      /* ignore */
    }
    setCapturing(false);
    setLeadCaptured(true);
    toast.success(isHi ? 'Lead registered! Unlocking detailed breakdown...' : 'Full analysis unlocked! 🎉');
  };

  // Score calculation (0-100)
  const score = result ? Math.min(100, Math.max(45, (result.chaldeanRoot * 9 + (result.isMaster ? 20 : 0) + 30))) : 0;

  return (
    <>
      <SEO
        title="Real-Time Name Numerology Analyzer & Matcher — AnkJyotish"
        description="Check your name vibration score instantly using Chaldean and Pythagorean numerology. See if your name brings wealth, success, or harmony."
        canonical="/name-analyzer"
        keywords="name numerology analyzer, chaldean name calculator, pythagorean name score, name correction tool"
      />

      <div className="min-h-screen bg-[#0d0714] text-white spiritual-pattern pb-16">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0d0714]/90 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/"><Logo size="sm" /></Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button size="sm" onClick={() => navigate('/buy-report')} className="bg-primary hover:bg-primary/90 text-white text-xs gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Full Report
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1 text-xs">
              ⚡ Instant Free Tool
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-white to-amber-400 bg-clip-text text-transparent">
              {isHi ? 'रियल-टाइम नाम अंकज्योतिष स्कोर' : 'Real-Time Name Vibration Matcher'}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Type any name below to compute instant Chaldean & Pythagorean vibrations, overall destiny score, and matched gemstones.
            </p>
          </div>

          {/* Interactive Input Card */}
          <Card className="bg-[#150f26] border-white/10 shadow-2xl p-6 sm:p-8 rounded-3xl">
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name-input" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  {isHi ? 'अपना या व्यवसाय का नाम दर्ज करें' : 'Type Your Name or Business Name'}
                </Label>
                <Input
                  id="name-input"
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="h-14 text-lg bg-white/5 border-white/15 text-white placeholder-gray-500 rounded-2xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Dynamic Results Display */}
              {result && (
                <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
                  {/* Score Meter & Main Numbers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Visual Meter */}
                    <div className="sm:col-span-1 bg-white/5 border border-white/10 p-5 rounded-2xl text-center flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-400 block mb-1">Vibration Score</span>
                      <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500/20 to-violet-500/20 border-4 border-amber-400/80 shadow-lg shadow-amber-500/10">
                        <span className="font-display text-3xl font-extrabold text-amber-300">{score}</span>
                        <span className="text-[10px] text-gray-400 absolute bottom-2">/ 100</span>
                      </div>
                      <Badge className="mt-3 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                        {score > 75 ? 'High Harmony' : 'Moderate Energy'}
                      </Badge>
                    </div>

                    {/* Chaldean & Pythagorean Breakdown */}
                    <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                        <span className="text-[11px] text-gray-400 block">Chaldean Root</span>
                        <div className="text-2xl font-bold font-display text-amber-400">
                          {result.chaldeanRoot}
                        </div>
                        <p className="text-[11px] text-gray-300">
                          Primary destiny alignment in Vedic Numerology
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                        <span className="text-[11px] text-gray-400 block">Pythagorean Root</span>
                        <div className="text-2xl font-bold font-display text-violet-400">
                          {result.root} {result.isMaster && '(Master)'}
                        </div>
                        <p className="text-[11px] text-gray-300">
                          Western personality frequency
                        </p>
                      </div>

                      <div className="col-span-2 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>Interpretation:</strong> The name <strong>"{inputName}"</strong> carries a Chaldean vibration of <strong>{result.chaldeanRoot}</strong>, bringing strong creative drive, adaptability, and social magnetism.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lead Capture Banner */}
                  {!leadCaptured ? (
                    <form onSubmit={handleCaptureLead} className="p-4 rounded-2xl bg-gradient-to-r from-violet-900/40 via-amber-900/20 to-transparent border border-amber-400/30 flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 space-y-1 text-left">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <Gift className="w-4 h-4 text-amber-400" /> Unlock Detailed Destiny Breakdown
                        </h4>
                        <p className="text-xs text-gray-300">
                          Enter your email to receive full breakdown of Vowels, Consonants, and Lucky Gems.
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-10 bg-black/40 border-white/20 text-xs text-white"
                        />
                        <Button type="submit" size="sm" disabled={capturing} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs shrink-0">
                          {capturing ? 'Unlocking...' : 'Unlock'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full Vowel ({result.vowelTotal}) & Consonant ({result.consonantTotal}) breakdown unlocked!
                      </span>
                    </div>
                  )}

                  {/* Matched Recommendation Gemstone / Yantra */}
                  {recommendations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Matched Remedial Gemstone / Yantra
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {recommendations.map((item) => (
                          <RecommendationCard key={item.id} item={item} sourcePage="name_analyzer" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Soft Paywall CTA */}
                  <div className="p-6 rounded-2xl bg-gradient-to-tr from-violet-950 via-[#1c1538] to-[#120d29] border border-primary/30 text-center space-y-3 shadow-xl">
                    <h3 className="text-lg font-bold font-display text-white">
                      Want a 12-Page Complete Name Correction & Numerology Report?
                    </h3>
                    <p className="text-xs text-gray-300 max-w-lg mx-auto">
                      Get exact letter-by-letter corrections, signature guide, business name alignment, and personal year forecasting tailored to your DOB.
                    </p>
                    <Button onClick={() => navigate('/buy-report')} className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 text-white font-bold text-sm h-11 px-8 rounded-xl gap-2 shadow-lg shadow-primary/20">
                      <span>Get Full 12-Page Report</span>
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
