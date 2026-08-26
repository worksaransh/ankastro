import React, { useState, useMemo } from 'react';
import { 
  Sun, Moon, Star, Sparkles, Shield, AlertTriangle, CheckCircle2, 
  Layers, Compass, Flame, Info, Eye, Clock, Award, ChevronRight,
  Briefcase, Heart, Users, DollarSign, Baby, Crown, Landmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KundliData, PlanetaryPosition } from '@/lib/unifiedSynthesisEngine';
import { useLanguage } from '@/contexts/LanguageContext';

interface AstroDeepDashboardProps {
  kundli: KundliData;
  isUnlocked?: boolean;
  onUnlock?: () => void;
}

export type ChartType = 
  | 'D1_LAGNA' 
  | 'CHANDRA' 
  | 'SURYA' 
  | 'D9_NAVAMSHA' 
  | 'D10_DASHAMSHA' 
  | 'D2_HORA' 
  | 'D7_SAPTAMSHA' 
  | 'D12_DWADASHAMSHA';

export type ChartStyle = 'north_indian' | 'south_indian';

const CHART_METADATA: Record<ChartType, { title: string; hindiTitle: string; icon: any; purpose: string; color: string }> = {
  D1_LAGNA: {
    title: 'D1: Janma Lagna Kundli',
    hindiTitle: 'जन्म लग्न कुंडली (D1)',
    icon: Compass,
    purpose: 'The Primary Root Chart. Reflects your physical existence, health, foundational character, and entire life trajectory.',
    color: 'text-amber-400'
  },
  CHANDRA: {
    title: 'Chandra Kundli (Moon Chart)',
    hindiTitle: 'चन्द्र कुंडली (Moon Chart)',
    icon: Moon,
    purpose: 'The Mind & Emotional Mirror. Rotates the Moon to the 1st House to analyze psychological resilience and domestic bliss.',
    color: 'text-violet-300'
  },
  SURYA: {
    title: 'Surya Kundli (Sun Chart)',
    hindiTitle: 'सूर्य कुंडली (Sun Chart)',
    icon: Sun,
    purpose: 'The Soul & Authority Engine. Rotates the Sun to the 1st House to reveal divine willpower, leadership, and public influence.',
    color: 'text-amber-500'
  },
  D9_NAVAMSHA: {
    title: 'D9: Navamsha Kundli',
    hindiTitle: 'नवांश कुंडली (D9)',
    icon: Heart,
    purpose: 'The Soul Blueprint & Marriage Matrix. Determines marital harmony, spouse characteristics, and destiny post-30 years of age.',
    color: 'text-rose-400'
  },
  D10_DASHAMSHA: {
    title: 'D10: Dashamsha Kundli',
    hindiTitle: 'दशांश कुंडली (D10)',
    icon: Briefcase,
    purpose: 'The Career & Fame Accelerator. Analyzes professional milestones, promotions, corporate authority, and public legacy.',
    color: 'text-blue-400'
  },
  D2_HORA: {
    title: 'D2: Hora Kundli (Wealth Matrix)',
    hindiTitle: 'होरा कुंडली (D2 - धन)',
    icon: DollarSign,
    purpose: 'Liquid Assets & Financial Accumulation. Splits signs into Solar & Lunar horas to calculate wealth compounding capacity.',
    color: 'text-emerald-400'
  },
  D7_SAPTAMSHA: {
    title: 'D7: Saptamsha Kundli',
    hindiTitle: 'सप्तांश कुंडली (D7 - संतान)',
    icon: Baby,
    purpose: 'Progeny, Children & Creative Conception. Governs children\'s fortune, lineage continuation, and creative ventures.',
    color: 'text-pink-400'
  },
  D12_DWADASHAMSHA: {
    title: 'D12: Dwadashamsha Kundli',
    hindiTitle: 'द्वादशांश कुंडली (D12 - पितृ)',
    icon: Landmark,
    purpose: 'Ancestral Karma & Parental Heritage. Reveals karmic debts and blessings inherited from parents and ancestral lineage.',
    color: 'text-indigo-400'
  }
};

const BHAVA_NAMES: Record<number, { name: string; meaning: string; lifeAspects: string }> = {
  1: { name: 'Tanu Bhava (1st House - Ascendant)', meaning: 'Self, Personality, Vitality & Physical Body', lifeAspects: 'Head, temperament, overall life trajectory, aura' },
  2: { name: 'Dhana Bhava (2nd House - Wealth & Speech)', meaning: 'Liquid Assets, Family Lineage, Voice & Values', lifeAspects: 'Accumulated wealth, speech clarity, family bonds' },
  3: { name: 'Sahaja Bhava (3rd House - Courage & Siblings)', meaning: 'Initiative, Short Travels, Siblings & Willpower', lifeAspects: 'Communication, bravery, hands, skills' },
  4: { name: 'Sukha Bhava (4th House - Mother & Property)', meaning: 'Inner Peace, Real Estate, Vehicles & Mother', lifeAspects: 'Chest, home environment, emotional happiness' },
  5: { name: 'Putra Bhava (5th House - Intellect & Creativity)', meaning: 'Creativity, Progeny, Purva Punya & Romance', lifeAspects: 'Higher intellect, speculative gains, spiritual mantras' },
  6: { name: 'Ari / Shatru Bhava (6th House - Obstacles & Health)', meaning: 'Debts, Diseases, Litigation & Daily Work', lifeAspects: 'Immunity, overcoming competition, service' },
  7: { name: 'Kalatra Bhava (7th House - Spouse & Partnerships)', meaning: 'Marriage, Business Alliances & Public Relations', lifeAspects: 'Life partner qualities, business contracts' },
  8: { name: 'Ayur / Randhra Bhava (8th House - Transformation)', meaning: 'Longevity, Occult Secrets, Sudden Wealth & Research', lifeAspects: 'Hidden assets, spiritual initiation, regeneration' },
  9: { name: 'Bhagya Bhava (9th House - Fortune & Dharma)', meaning: 'Dharma, Fortune, Guru & Long Journeys', lifeAspects: 'Luck, divine grace, higher education, father' },
  10: { name: 'Karma Bhava (10th House - Career & Authority)', meaning: 'Profession, Social Status, Reputation & Power', lifeAspects: 'Executive status, fame, career achievements' },
  11: { name: 'Labha Bhava (11th House - Gains & Network)', meaning: 'Fulfillment of Desires, Large Profits & Friends', lifeAspects: 'Compounding returns, influential circles, elder siblings' },
  12: { name: 'Vyaya Bhava (12th House - Liberation & Subconscious)', meaning: 'Foreign Lands, Spiritual Moksha, Expenses & Sleep', lifeAspects: 'Astral dreams, international relocation, meditation' }
};

export default function AstroDeepDashboard({ kundli, isUnlocked = true, onUnlock }: AstroDeepDashboardProps) {
  const { language } = useLanguage();
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [activeChartType, setActiveChartType] = useState<ChartType>('D1_LAGNA');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north_indian');

  const meta = CHART_METADATA[activeChartType];
  const IconComponent = meta.icon;

  // Compute rotated planetary positions depending on the selected chart type
  const chartPlanets = useMemo(() => {
    if (activeChartType === 'D1_LAGNA') {
      return kundli.planets;
    }

    if (activeChartType === 'CHANDRA') {
      const moon = kundli.planets.find(p => p.planet.includes('Moon'));
      const moonHouse = moon ? moon.house : 1;
      return kundli.planets.map(p => ({
        ...p,
        house: ((p.house - moonHouse + 12) % 12) + 1
      }));
    }

    if (activeChartType === 'SURYA') {
      const sun = kundli.planets.find(p => p.planet.includes('Sun'));
      const sunHouse = sun ? sun.house : 1;
      return kundli.planets.map(p => ({
        ...p,
        house: ((p.house - sunHouse + 12) % 12) + 1
      }));
    }

    if (activeChartType === 'D9_NAVAMSHA') {
      return kundli.planets.map(p => ({
        ...p,
        house: ((p.house * 9 + p.pada) % 12) + 1
      }));
    }

    if (activeChartType === 'D10_DASHAMSHA') {
      return kundli.planets.map(p => ({
        ...p,
        house: ((p.house * 10 + 3) % 12) + 1
      }));
    }

    if (activeChartType === 'D2_HORA') {
      return kundli.planets.map(p => ({
        ...p,
        house: (p.degree > 15 ? 5 : 4) // Sun/Moon Hora
      }));
    }

    if (activeChartType === 'D7_SAPTAMSHA') {
      return kundli.planets.map(p => ({
        ...p,
        house: ((p.house * 7 + 1) % 12) + 1
      }));
    }

    if (activeChartType === 'D12_DWADASHAMSHA') {
      return kundli.planets.map(p => ({
        ...p,
        house: ((p.house * 12 + 2) % 12) + 1
      }));
    }

    return kundli.planets;
  }, [activeChartType, kundli.planets]);

  const selectedBhavaInfo = BHAVA_NAMES[selectedHouse];
  const planetsInSelectedHouse = chartPlanets.filter(p => p.house === selectedHouse);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-amber-950/20 to-black border border-violet-800/30">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
              {language === 'hi' ? 'षोडशवर्ग कुण्डली चार्ट समूह' : 'Complete Shodashvarga Chart Suite'}
            </Badge>
            <span className="text-xs text-zinc-400">Sidereal Lahiri Ayanamsha</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <IconComponent className={`w-6 h-6 ${meta.color}`} />
            {language === 'hi' ? meta.hindiTitle : meta.title}
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
            {meta.purpose}
          </p>
        </div>

        {/* Chart Style Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setChartStyle('north_indian')}
            className={`px-3 py-1.5 rounded-lg transition-all ${chartStyle === 'north_indian' ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            {language === 'hi' ? 'उत्तर भारतीय (हीरा)' : 'North Indian (Diamond)'}
          </button>
          <button
            onClick={() => setChartStyle('south_indian')}
            className={`px-3 py-1.5 rounded-lg transition-all ${chartStyle === 'south_indian' ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            {language === 'hi' ? 'दक्षिण भारतीय (बॉक्स)' : 'South Indian (Grid)'}
          </button>
        </div>
      </div>

      {/* Divisional Chart Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {(Object.keys(CHART_METADATA) as ChartType[]).map((key) => {
          const item = CHART_METADATA[key];
          const Icon = item.icon;
          const isActive = activeChartType === key;

          return (
            <button
              key={key}
              onClick={() => setActiveChartType(key)}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                isActive 
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10' 
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </div>
              <div>
                <p className="font-bold text-xs line-clamp-1">{key.replace('_', ' ')}</p>
                <p className="text-[10px] text-zinc-500 line-clamp-1">
                  {language === 'hi' ? item.hindiTitle : (item.title.split(':')[1] || item.title)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart Viewer & 12 Bhavas Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Chart (North or South Indian) */}
        <Card className="lg:col-span-6 bg-zinc-900/60 border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                {meta.hindiTitle}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Click any house number to inspect its governing Grahas & cosmic resonance
              </CardDescription>
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
              {chartStyle === 'north_indian' ? 'North Indian Diamond' : 'South Indian Box'}
            </Badge>
          </div>

          {/* North Indian Diamond Chart SVG */}
          {chartStyle === 'north_indian' ? (
            <div className="relative aspect-square max-w-md mx-auto bg-black/70 rounded-2xl border border-amber-500/30 p-2 shadow-xl overflow-hidden">
              <svg viewBox="0 0 400 400" className="w-full h-full text-amber-400/70 stroke-current stroke-1 fill-none">
                <rect x="10" y="10" width="380" height="380" strokeWidth="2" />
                <polygon points="200,10 390,200 200,390 10,200" strokeWidth="1.5" />
                <line x1="10" y1="10" x2="390" y2="390" strokeWidth="1.5" />
                <line x1="390" y1="10" x2="10" y2="390" strokeWidth="1.5" />

                {/* 12 House Labels & Dynamic Planets */}
                {/* H1 */}
                <text x="200" y="80" textAnchor="middle" className="text-[12px] fill-amber-400 font-bold font-sans">
                  H1 ({kundli.lagnaSignNumber})
                </text>
                <text x="200" y="115" textAnchor="middle" className="text-[10px] fill-emerald-300 font-sans">
                  {chartPlanets.filter(p => p.house === 1).map(p => p.planet.split(' ')[0]).join(', ') || 'Lagna'}
                </text>

                {/* H2 */}
                <text x="120" y="55" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H2</text>
                <text x="120" y="75" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 2).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H3 */}
                <text x="55" y="120" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H3</text>
                <text x="55" y="140" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 3).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H4 */}
                <text x="110" y="200" textAnchor="middle" className="text-[12px] fill-amber-400 font-bold font-sans">H4</text>
                <text x="110" y="225" textAnchor="middle" className="text-[10px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 4).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H5 */}
                <text x="55" y="280" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H5</text>
                <text x="55" y="300" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 5).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H6 */}
                <text x="120" y="345" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H6</text>
                <text x="120" y="365" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 6).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H7 */}
                <text x="200" y="320" textAnchor="middle" className="text-[12px] fill-amber-400 font-bold font-sans">H7</text>
                <text x="200" y="345" textAnchor="middle" className="text-[10px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 7).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H8 */}
                <text x="280" y="345" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H8</text>
                <text x="280" y="365" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 8).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H9 */}
                <text x="345" y="280" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H9</text>
                <text x="345" y="300" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 9).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H10 */}
                <text x="290" y="200" textAnchor="middle" className="text-[12px] fill-amber-400 font-bold font-sans">H10</text>
                <text x="290" y="225" textAnchor="middle" className="text-[10px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 10).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H11 */}
                <text x="345" y="120" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H11</text>
                <text x="345" y="140" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 11).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>

                {/* H12 */}
                <text x="280" y="55" textAnchor="middle" className="text-[11px] fill-amber-300 font-bold font-sans">H12</text>
                <text x="280" y="75" textAnchor="middle" className="text-[9px] fill-zinc-300 font-sans">
                  {chartPlanets.filter(p => p.house === 12).map(p => p.planet.split(' ')[0]).join(', ')}
                </text>
              </svg>
            </div>
          ) : (
            /* South Indian Box Grid SVG */
            <div className="relative aspect-square max-w-md mx-auto bg-black/70 rounded-2xl border border-amber-500/30 p-2 shadow-xl overflow-hidden">
              <svg viewBox="0 0 400 400" className="w-full h-full text-amber-400/70 stroke-current stroke-1 fill-none">
                <rect x="10" y="10" width="380" height="380" strokeWidth="2" />
                {/* 4x4 Grid with empty center */}
                <line x1="105" y1="10" x2="105" y2="390" strokeWidth="1" />
                <line x1="200" y1="10" x2="200" y2="390" strokeWidth="1" />
                <line x1="295" y1="10" x2="295" y2="390" strokeWidth="1" />
                <line x1="10" y1="105" x2="390" y2="105" strokeWidth="1" />
                <line x1="10" y1="200" x2="390" y2="200" strokeWidth="1" />
                <line x1="10" y1="295" x2="390" y2="295" strokeWidth="1" />
                
                {/* Center Cover Box */}
                <rect x="105" y="105" width="190" height="190" className="fill-black/90 stroke-amber-500/40" strokeWidth="1.5" />
                <text x="200" y="195" textAnchor="middle" className="text-[13px] fill-amber-400 font-bold font-sans">
                  {meta.title.split(':')[0]}
                </text>
                <text x="200" y="215" textAnchor="middle" className="text-[10px] fill-zinc-400 font-sans">
                  South Indian Grid
                </text>

                {/* Box Signs Clockwise from Pisces (Top Left) */}
                <text x="57" y="55" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Pisces (12)</text>
                <text x="152" y="55" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Aries (1)</text>
                <text x="247" y="55" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Taurus (2)</text>
                <text x="342" y="55" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Gemini (3)</text>
                <text x="342" y="152" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Cancer (4)</text>
                <text x="342" y="247" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Leo (5)</text>
                <text x="342" y="342" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Virgo (6)</text>
                <text x="247" y="342" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Libra (7)</text>
                <text x="152" y="342" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Scorpio (8)</text>
                <text x="57" y="342" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Sagittarius (9)</text>
                <text x="57" y="247" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Capricorn (10)</text>
                <text x="57" y="152" textAnchor="middle" className="text-[10px] fill-amber-300 font-bold font-sans">Aquarius (11)</text>
              </svg>
            </div>
          )}

          {/* Quick House Selector */}
          <div className="flex flex-wrap gap-1.5 justify-center pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
              <button
                key={h}
                onClick={() => setSelectedHouse(h)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedHouse === h
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                H{h}
              </button>
            ))}
          </div>
        </Card>

        {/* Right Column: Selected Bhava Deep Interpretation */}
        <Card className="lg:col-span-6 bg-zinc-900/60 border-zinc-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs">
                  House {selectedHouse} Selected in {meta.title.split(':')[0]}
                </Badge>
                <span className="text-xs text-zinc-400 font-medium">{selectedBhavaInfo.name.split('(')[0]}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5">{selectedBhavaInfo.name}</h3>
              <p className="text-xs text-amber-400 font-medium mt-0.5">{selectedBhavaInfo.meaning}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <p className="text-zinc-400 font-semibold uppercase text-[10px]">Life Aspects Governed</p>
                <p className="text-zinc-200 leading-relaxed">{selectedBhavaInfo.lifeAspects}</p>
              </div>

              {/* Occupying Planets */}
              <div className="space-y-1.5">
                <p className="text-zinc-400 font-semibold uppercase text-[10px]">
                  Planets Occupying House {selectedHouse} in {meta.title.split(':')[0]}
                </p>
                {planetsInSelectedHouse.length > 0 ? (
                  <div className="space-y-2">
                    {planetsInSelectedHouse.map((p, idx) => (
                      <div key={idx} className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/20 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-sm">{p.planet}</p>
                          <p className="text-[11px] text-zinc-400">Sign: {p.sign} | {p.degree}°</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                            {p.dignity}
                          </Badge>
                          <p className="text-[10px] text-zinc-400 mt-1">{p.nakshatra} (Pada {p.pada})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-zinc-400 text-xs">
                    No Grahas occupying this house directly in this divisional chart. Energy flows through its sign ruler.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dosha & Sade Sati Status */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-white text-xs">Manglik Check</span>
              </div>
              <p className={`text-xs font-semibold ${kundli.manglikDosha.hasDosha ? 'text-amber-400' : 'text-emerald-400'}`}>
                {kundli.manglikDosha.hasDosha ? `Manglik (${kundli.manglikDosha.intensity})` : 'Non-Manglik ✓'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                <span className="font-bold text-white text-xs">Shani Sade Sati</span>
              </div>
              <p className={`text-xs font-semibold ${kundli.sadeSati.isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                {kundli.sadeSati.isActive ? `${kundli.sadeSati.phase} Phase Active` : 'Inactive ✓'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Complete 9 Grahas Coordinates Table */}
      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader className="p-4 border-b border-zinc-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              9 Grahas Planetary Positions Matrix
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">Exact mathematical coordinates, Nakshatra Padas, and Dignities</CardDescription>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-zinc-300">
            <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-950/80 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Planet (Graha)</th>
                <th className="px-4 py-3">Sign (Rashi)</th>
                <th className="px-4 py-3">House (Bhava)</th>
                <th className="px-4 py-3">Degree</th>
                <th className="px-4 py-3">Nakshatra & Pada</th>
                <th className="px-4 py-3">Motion</th>
                <th className="px-4 py-3">Dignity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {kundli.planets.map((p, i) => (
                <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-white">{p.planet}</td>
                  <td className="px-4 py-2.5">{p.sign}</td>
                  <td className="px-4 py-2.5 font-semibold text-amber-400">House {p.house}</td>
                  <td className="px-4 py-2.5 font-mono">{p.degree}°</td>
                  <td className="px-4 py-2.5 text-zinc-300">{p.nakshatra} (Pada {p.pada})</td>
                  <td className="px-4 py-2.5">
                    {p.isRetrograde ? (
                      <Badge variant="destructive" className="text-[10px] px-1 py-0">Vakri (R)</Badge>
                    ) : (
                      <span className="text-zinc-500">Direct</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge className="bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px]">
                      {p.dignity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
