import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { calculateBirthday, calculateLifePath } from '@/lib/numerology';
import { getRecommendationsForNumber, RecommendationItem } from '@/lib/recommendationHelper';
import RecommendationCard from '@/components/RecommendationCard';
import DobInput from '@/components/DobInput';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Calendar as CalendarIcon, ArrowRight, Download, CheckCircle2, Star } from 'lucide-react';

export default function MonthlyPlannerPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [dob, setDob] = useState('1992-05-15');
  const [mulank, setMulank] = useState(6);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    if (dob) {
      const cleanDob = dob.includes('-') ? dob.split('-').reverse().join('/') : dob;
      const m = calculateBirthday(cleanDob);
      setMulank(m);
      getRecommendationsForNumber(m).then((items) => setRecommendations(items.slice(0, 2)));
    }
  }, [dob]);

  // Current month days mock calculation (28-31 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const isAuspicious = (dayNum + mulank) % 3 === 0 || (dayNum + mulank) % 5 === 0;
    return {
      day: dayNum,
      isAuspicious,
      score: isAuspicious ? 'High' : 'Moderate',
    };
  });

  return (
    <>
      <SEO
        title="12-Month Auspicious Calendar & Monthly Planner — AnkJyotish"
        description="Discover your personal auspicious dates for business deals, travel, weddings, and investments based on your birth date."
        canonical="/monthly-planner"
        keywords="numerology monthly calendar, auspicious dates by birth date, personal year planner, auspicious dates 2026"
      />

      <div className="min-h-screen bg-[#0d0714] text-white spiritual-pattern pb-16">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0d0714]/90 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/"><Logo size="sm" /></Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button size="sm" onClick={() => navigate('/buy-report')} className="bg-primary hover:bg-primary/90 text-white text-xs gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Unlock 12 Months
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1 text-xs">
              📅 Personal Date Planner
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-white to-amber-400 bg-clip-text text-transparent">
              {isHi ? 'मासिक शुभ तिथि कैलेंडर' : '12-Month Auspicious Calendar'}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Preview your personal high-luck dates for meetings, contracts, investments, and ceremonies.
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-[#150f26] border-white/10 shadow-2xl p-6 sm:p-8 rounded-3xl">
            <CardContent className="p-0 space-y-6">
              <div className="max-w-xs mx-auto space-y-2 text-center">
                <label className="text-xs font-semibold text-gray-200 block">
                  Select Your Date of Birth *
                </label>
                <DobInput
                  id="planner-dob"
                  value={dob}
                  onChange={(val) => setDob(val)}
                  outputFormat="yyyy-mm-dd"
                  language={language}
                />
              </div>

              {/* Current Month Calendar Grid */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-amber-400" />
                    Current Month Preview (Birth Number {mulank})
                  </h3>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                    ⭐ Gold Dates = High Luck
                  </Badge>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="font-bold text-gray-400 py-1 uppercase text-[10px]">
                      {d}
                    </div>
                  ))}

                  {daysInMonth.map((d) => (
                    <div
                      key={d.day}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col items-center justify-center min-h-[48px] transition-all ${
                        d.isAuspicious
                          ? 'bg-gradient-to-tr from-amber-500/30 to-amber-400/10 border-amber-400/60 text-amber-200 font-bold shadow-md shadow-amber-500/10 scale-105'
                          : 'bg-white/5 border-white/5 text-gray-300'
                      }`}
                    >
                      <span>{d.day}</span>
                      {d.isAuspicious && <span className="text-[9px] text-amber-300 font-normal">Auspicious</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Matched Abundance Yantra / Gemstone
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {recommendations.map((item) => (
                      <RecommendationCard key={item.id} item={item} sourcePage="monthly_planner" />
                    ))}
                  </div>
                </div>
              )}

              {/* Download / Unlock CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-violet-950 via-[#1c1538] to-[#120d29] border border-primary/30 text-center space-y-3 shadow-xl">
                <h3 className="text-lg font-bold font-display text-white">
                  Download Full 12-Month Printable PDF Calendar
                </h3>
                <p className="text-xs text-gray-300 max-w-lg mx-auto">
                  Get auspicious dates for all 12 months ahead (365 days), customized for your personal year and destiny number.
                </p>
                <Button onClick={() => navigate('/buy-report')} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm h-11 px-8 rounded-xl gap-2 shadow-lg shadow-amber-500/20">
                  <Download className="w-4 h-4" />
                  <span>Download 12-Month PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
