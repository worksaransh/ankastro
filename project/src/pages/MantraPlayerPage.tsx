import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { calculateBirthday } from '@/lib/numerology';
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
import { Sparkles, Play, Pause, RotateCcw, Volume2, ShieldCheck, Heart, Star, Music } from 'lucide-react';

interface MantraInfo {
  mulank: number;
  planet: string;
  mantraText: string;
  transliteration: string;
  meaning: string;
  recommendedCount: number;
}

const MANTRAS_DATA: Record<number, MantraInfo> = {
  1: { mulank: 1, planet: 'Surya (Sun)', mantraText: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः॥', transliteration: 'Om Hraam Hreem Hroum Sah Suryaya Namah', meaning: 'Salutations to the Sun God, source of vitality, power, and leadership.', recommendedCount: 108 },
  2: { mulank: 2, planet: 'Chandra (Moon)', mantraText: 'ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः॥', transliteration: 'Om Shraam Shreem Shroum Sah Chandramase Namah', meaning: 'Salutations to the Moon God, deity of peace, emotions, and intuition.', recommendedCount: 108 },
  3: { mulank: 3, planet: 'Guru (Jupiter)', mantraText: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः॥', transliteration: 'Om Graam Greem Groum Sah Gurave Namah', meaning: 'Salutations to Jupiter, lord of wisdom, expansion, and prosperity.', recommendedCount: 108 },
  4: { mulank: 4, planet: 'Rahu', mantraText: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः॥', transliteration: 'Om Bhraam Bhreem Bhroum Sah Rahave Namah', meaning: 'Salutations to Rahu, clearing confusion and granting breakthrough success.', recommendedCount: 108 },
  5: { mulank: 5, planet: 'Budh (Mercury)', mantraText: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः॥', transliteration: 'Om Braam Breem Broum Sah Budhaya Namah', meaning: 'Salutations to Mercury, lord of intellect, trading, and clear speech.', recommendedCount: 108 },
  6: { mulank: 6, planet: 'Shukra (Venus)', mantraText: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः॥', transliteration: 'Om Draam Dreem Droum Sah Shukraya Namah', meaning: 'Salutations to Venus, deity of luxury, love, and artistic beauty.', recommendedCount: 108 },
  7: { mulank: 7, planet: 'Ketu', mantraText: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः॥', transliteration: 'Om Sraam Sreem Sroum Sah Ketave Namah', meaning: 'Salutations to Ketu, lord of spiritual liberation and deep insight.', recommendedCount: 108 },
  8: { mulank: 8, planet: 'Shani (Saturn)', mantraText: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः॥', transliteration: 'Om Praam Preem Proum Sah Shanaishcharaya Namah', meaning: 'Salutations to Saturn, deity of justice, discipline, and endurance.', recommendedCount: 108 },
  9: { mulank: 9, planet: 'Mangal (Mars)', mantraText: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः॥', transliteration: 'Om Kraam Kreem Kroum Sah Bhaumaya Namah', meaning: 'Salutations to Mars, lord of courage, vigor, and overcoming obstacles.', recommendedCount: 108 },
};

export default function MantraPlayerPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [dob, setDob] = useState('1992-05-15');
  const [mulank, setMulank] = useState(6);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  // Audio & Counter state
  const [isPlaying, setIsPlaying] = useState(false);
  const [counter, setCounter] = useState(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (dob) {
      const cleanDob = dob.includes('-') ? dob.split('-').reverse().join('/') : dob;
      const m = calculateBirthday(cleanDob);
      setMulank(m);
      getRecommendationsForNumber(m).then((items) => setRecommendations(items.slice(0, 2)));
    }
  }, [dob]);

  const currentMantra = MANTRAS_DATA[mulank] || MANTRAS_DATA[1];

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCounter((prev) => {
          if (prev >= 108) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
            return 108;
          }
          return prev + 1;
        });
      }, 1500);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCounter(0);
  };

  return (
    <>
      <SEO
        title="Planetary Mantras & 108 Japa Mala Counter — AnkJyotish"
        description="Listen to planetary mantras personalized to your birth number (Mulank) with a built-in 108 Japa mala counter."
        canonical="/mantras"
        keywords="planetary mantras, numerology mantra 108 japa, surya mantra, shukra mantra, mulank mantras"
      />

      <div className="min-h-screen bg-[#0d0714] text-white spiritual-pattern pb-16">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0d0714]/90 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/"><Logo size="sm" /></Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button size="sm" onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90 text-white text-xs gap-1">
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1 text-xs">
              🧘 Daily Planetary Meditation
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 via-white to-amber-400 bg-clip-text text-transparent">
              {isHi ? 'ग्रह मंत्र एवं 108 जप माला' : 'Planetary Mantras & 108 Japa Counter'}
            </h1>
            <p className="text-gray-300 text-sm max-w-xl mx-auto">
              Chant or listen to the planetary mantra tuned to your birth number for peace, clarity, and obstacle removal.
            </p>
          </div>

          {/* Player Card */}
          <Card className="bg-[#150f26] border-white/10 shadow-2xl p-6 sm:p-8 rounded-3xl text-center space-y-6">
            <CardContent className="p-0 space-y-6">
              {/* DOB selector */}
              <div className="max-w-xs mx-auto space-y-2">
                <label className="text-xs font-semibold text-gray-200 block">
                  Select Your Date of Birth *
                </label>
                <DobInput
                  id="mantra-dob"
                  value={dob}
                  onChange={(val) => setDob(val)}
                  outputFormat="yyyy-mm-dd"
                  language={language}
                />
              </div>

              {/* Mantra Details */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 via-violet-500/5 to-transparent border border-amber-400/20 space-y-4">
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs px-3 py-1">
                  Ruling Planet: {currentMantra.planet} (Mulank {currentMantra.mulank})
                </Badge>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wide leading-relaxed">
                  {currentMantra.mantraText}
                </h2>

                <p className="text-xs text-gray-300 italic">
                  "{currentMantra.transliteration}"
                </p>

                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  {currentMantra.meaning}
                </p>
              </div>

              {/* Visual 108 Japa Mala Counter */}
              <div className="space-y-4 pt-2">
                <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-amber-500/20 via-violet-500/10 to-transparent border-4 border-amber-400/80 shadow-xl shadow-amber-500/10">
                  <span className="font-display text-4xl font-extrabold text-amber-300">{counter}</span>
                  <span className="text-[10px] text-gray-400">/ 108 Chants</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" size="icon" onClick={handleReset} className="border-white/10 rounded-full h-11 w-11">
                    <RotateCcw className="w-4 h-4 text-gray-400" />
                  </Button>

                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold rounded-full px-8 h-14 gap-2 shadow-lg shadow-amber-500/20"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    <span>{isPlaying ? 'Pause Japa' : 'Start 108 Japa'}</span>
                  </Button>
                </div>
              </div>

              {/* Matched Recommendation Gemstone / Yantra */}
              {recommendations.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-white/10 text-left">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Matched Gemstone & Yantra for Mulank {mulank}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {recommendations.map((item) => (
                      <RecommendationCard key={item.id} item={item} sourcePage="mantras_player" />
                    ))}
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
