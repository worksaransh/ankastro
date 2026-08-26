import React, { useState } from 'react';
import { VedicKundliProfile, PlanetPosition } from '@/lib/vedicAstrologyEngine';
import { Button } from '@/components/ui/button';
import { Sparkles, Compass } from 'lucide-react';

interface KundliChartProps {
  chart?: VedicKundliProfile | any;
  title?: string;
  chartType?: 'D1' | 'D9';
}

interface NormalizedPlanet {
  name: string;
  sign: string;
  degreeFormatted: string;
  nakshatra: string;
  pada: number;
  house: number;
  isRetrograde: boolean;
  dignity: string;
}

export const KundliChart: React.FC<KundliChartProps> = ({ chart, title = 'Rashi Chart (D-1)', chartType = 'D1' }) => {
  const [style, setStyle] = useState<'north' | 'south'>('north');
  const [hoveredPlanet, setHoveredPlanet] = useState<NormalizedPlanet | null>(null);

  if (!chart || (!chart.planets && !chart.lagna && !chart.ascendant)) {
    return (
      <div className="rounded-2xl bg-[#0d071e]/90 border border-violet-900/40 p-6 text-center text-gray-400 text-xs">
        Kundli chart data is being calculated...
      </div>
    );
  }

  // Extract Lagna details safely
  const lagnaSign = chart.lagna?.sign || chart.ascendant?.rashi || 'Aries';
  const lagnaSignIndex = typeof chart.lagna?.signIndex === 'number'
    ? chart.lagna.signIndex - 1
    : (chart.ascendant?.rashiIndex ?? 0);
  const lagnaDegree = chart.lagna?.degreeFormatted || (chart.ascendant?.degree ? `${chart.ascendant.degree.toFixed(2)}°` : '0.00°');
  const lagnaNakshatra = chart.lagna?.nakshatra || chart.ascendant?.nakshatra || 'Ashwini';
  const lagnaPada = chart.lagna?.pada || chart.ascendant?.pada || 1;

  // Group normalized planets by house (1-12)
  const planetsByHouse: Record<number, NormalizedPlanet[]> = {};
  for (let i = 1; i <= 12; i++) planetsByHouse[i] = [];

  const rawPlanets: any[] = Array.isArray(chart.planets) ? chart.planets : [];

  rawPlanets.forEach((p: any) => {
    const houseNum = Number(p.house) || 1;
    const normalized: NormalizedPlanet = {
      name: p.planet || p.name || 'Grah',
      sign: p.sign || p.rashi || 'Aries',
      degreeFormatted: p.degreeFormatted || (typeof p.degreeInSign === 'number' ? `${p.degreeInSign.toFixed(1)}°` : p.degree ? `${Number(p.degree).toFixed(1)}°` : '0°'),
      nakshatra: p.nakshatra || '',
      pada: Number(p.pada) || 1,
      house: houseNum,
      isRetrograde: Boolean(p.isRetrograde),
      dignity: p.dignity || 'Neutral',
    };

    if (houseNum >= 1 && houseNum <= 12) {
      planetsByHouse[houseNum].push(normalized);
    }
  });

  // Calculate Rashi in each house based on Lagna sign number (1-12)
  const getRashiForHouse = (houseNum: number): number => {
    return ((lagnaSignIndex + houseNum - 1) % 12) + 1; // 1-12
  };

  // Helper to render planet abbreviations
  const renderPlanetBadges = (houseNum: number) => {
    const planets = planetsByHouse[houseNum] || [];
    if (planets.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[80px]">
        {planets.map((p) => {
          const isExalted = p.dignity === 'Exalted';
          const isDebilitated = p.dignity === 'Debilitated';
          const isRetrograde = p.isRetrograde;

          return (
            <span
              key={p.name}
              onMouseEnter={() => setHoveredPlanet(p)}
              onMouseLeave={() => setHoveredPlanet(null)}
              className={`cursor-pointer text-[10px] sm:text-[11px] font-bold px-1 py-0.5 rounded transition-all ${
                p.name === 'Sun' ? 'text-amber-400 bg-amber-950/40' :
                p.name === 'Moon' ? 'text-cyan-200 bg-cyan-950/40' :
                p.name === 'Mars' ? 'text-red-400 bg-red-950/40' :
                p.name === 'Mercury' ? 'text-emerald-400 bg-emerald-950/40' :
                p.name === 'Jupiter' ? 'text-yellow-300 bg-yellow-950/40' :
                p.name === 'Venus' ? 'text-pink-300 bg-pink-950/40' :
                p.name === 'Saturn' ? 'text-blue-400 bg-blue-950/40' :
                p.name === 'Rahu' ? 'text-purple-400 bg-purple-950/40' :
                p.name === 'Ketu' ? 'text-stone-300 bg-stone-900/60' :
                'text-gray-300 bg-gray-800'
              } ${isExalted ? 'ring-1 ring-emerald-400 font-extrabold' : ''} ${
                isDebilitated ? 'ring-1 ring-red-400/80 font-extrabold' : ''
              }`}
              title={`${p.name}: ${p.degreeFormatted} ${p.sign} (${p.nakshatra} P-${p.pada}) [${p.dignity}]${isRetrograde ? ' (Retrograde)' : ''}`}
            >
              {p.name.substring(0, 2)}{isRetrograde ? '(R)' : ''}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-[#0d071e]/90 border border-violet-900/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-lg font-bold text-white tracking-wide">{title}</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Lagna: <span className="text-amber-300 font-semibold">{lagnaSign} ({lagnaDegree})</span> • Nakshatra: <span className="text-violet-300 font-semibold">{lagnaNakshatra} (P-{lagnaPada})</span>
          </p>
        </div>

        {/* Style switch */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
          <Button
            size="sm"
            variant={style === 'north' ? 'default' : 'ghost'}
            onClick={() => setStyle('north')}
            className={`h-7 px-3 text-xs rounded-lg ${style === 'north' ? 'bg-amber-500 text-black font-bold hover:bg-amber-400' : 'text-gray-400 hover:text-white'}`}
          >
            North Indian
          </Button>
          <Button
            size="sm"
            variant={style === 'south' ? 'default' : 'ghost'}
            onClick={() => setStyle('south')}
            className={`h-7 px-3 text-xs rounded-lg ${style === 'south' ? 'bg-amber-500 text-black font-bold hover:bg-amber-400' : 'text-gray-400 hover:text-white'}`}
          >
            South Indian
          </Button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex flex-col items-center justify-center">
        {style === 'north' ? (
          /* NORTH INDIAN DIAMOND KUNDLI CHART */
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square select-none">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md">
              {/* Outer Square */}
              <rect x="10" y="10" width="380" height="380" fill="#090415" stroke="#f59e0b" strokeWidth="2.5" className="opacity-90" />
              
              {/* Main Diagonals */}
              <line x1="10" y1="10" x2="390" y2="390" stroke="#f59e0b" strokeWidth="1.8" />
              <line x1="390" y1="10" x2="10" y2="390" stroke="#f59e0b" strokeWidth="1.8" />
              
              {/* Inner Diamond */}
              <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#f59e0b" strokeWidth="2" />
            </svg>

            {/* House 1 (Top Center Diamond) */}
            <div className="absolute top-[8%] left-[26%] w-[48%] h-[24%] flex flex-col items-center justify-center text-center pointer-events-auto">
              <span className="text-[11px] font-extrabold text-amber-500/80 mb-0.5">{getRashiForHouse(1)}</span>
              {renderPlanetBadges(1)}
              <span className="text-[9px] text-gray-500 mt-0.5">H-1 (Lagna)</span>
            </div>

            {/* House 2 (Top Left Triangle) */}
            <div className="absolute top-[4%] left-[6%] w-[26%] h-[22%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(2)}</span>
              {renderPlanetBadges(2)}
              <span className="text-[8px] text-gray-500">H-2</span>
            </div>

            {/* House 3 (Left Top Triangle) */}
            <div className="absolute top-[26%] left-[4%] w-[22%] h-[26%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(3)}</span>
              {renderPlanetBadges(3)}
              <span className="text-[8px] text-gray-500">H-3</span>
            </div>

            {/* House 4 (Center Left Diamond) */}
            <div className="absolute top-[26%] left-[8%] w-[24%] h-[48%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(4)}</span>
              {renderPlanetBadges(4)}
              <span className="text-[8px] text-gray-500">H-4 (Sukha)</span>
            </div>

            {/* House 5 (Left Bottom Triangle) */}
            <div className="absolute top-[52%] left-[4%] w-[22%] h-[26%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(5)}</span>
              {renderPlanetBadges(5)}
              <span className="text-[8px] text-gray-500">H-5</span>
            </div>

            {/* House 6 (Bottom Left Triangle) */}
            <div className="absolute top-[74%] left-[6%] w-[26%] h-[22%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(6)}</span>
              {renderPlanetBadges(6)}
              <span className="text-[8px] text-gray-500">H-6</span>
            </div>

            {/* House 7 (Bottom Center Diamond) */}
            <div className="absolute top-[68%] left-[26%] w-[48%] h-[24%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(7)}</span>
              {renderPlanetBadges(7)}
              <span className="text-[8px] text-gray-500">H-7 (Kalatra)</span>
            </div>

            {/* House 8 (Bottom Right Triangle) */}
            <div className="absolute top-[74%] right-[6%] w-[26%] h-[22%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(8)}</span>
              {renderPlanetBadges(8)}
              <span className="text-[8px] text-gray-500">H-8</span>
            </div>

            {/* House 9 (Right Bottom Triangle) */}
            <div className="absolute top-[52%] right-[4%] w-[22%] h-[26%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(9)}</span>
              {renderPlanetBadges(9)}
              <span className="text-[8px] text-gray-500">H-9 (Dharma)</span>
            </div>

            {/* House 10 (Center Right Diamond) */}
            <div className="absolute top-[26%] right-[8%] w-[24%] h-[48%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(10)}</span>
              {renderPlanetBadges(10)}
              <span className="text-[8px] text-gray-500">H-10 (Karma)</span>
            </div>

            {/* House 11 (Right Top Triangle) */}
            <div className="absolute top-[26%] right-[4%] w-[22%] h-[26%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(11)}</span>
              {renderPlanetBadges(11)}
              <span className="text-[8px] text-gray-500">H-11 (Labha)</span>
            </div>

            {/* House 12 (Top Right Triangle) */}
            <div className="absolute top-[4%] right-[6%] w-[26%] h-[22%] flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-extrabold text-amber-500/80">{getRashiForHouse(12)}</span>
              {renderPlanetBadges(12)}
              <span className="text-[8px] text-gray-500">H-12 (Moksha)</span>
            </div>
          </div>
        ) : (
          /* SOUTH INDIAN SQUARE KUNDLI CHART */
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square select-none">
            <div className="grid grid-cols-4 grid-rows-4 w-full h-full border-2 border-amber-500/80 rounded-lg overflow-hidden bg-[#090415]">
              {/* Row 1 */}
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Pisces (12)</span>
                {renderPlanetBadges(getRashiForHouse(12))}
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Aries (1)</span>
                {renderPlanetBadges(getRashiForHouse(1))}
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Taurus (2)</span>
                {renderPlanetBadges(getRashiForHouse(2))}
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Gemini (3)</span>
                {renderPlanetBadges(getRashiForHouse(3))}
              </div>

              {/* Row 2 */}
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Aquarius (11)</span>
                {renderPlanetBadges(getRashiForHouse(11))}
              </div>
              <div className="col-span-2 row-span-2 border border-amber-500/20 bg-black/40 flex flex-col items-center justify-center p-2 text-center">
                <span className="font-display font-bold text-amber-400 text-sm">South Indian Chart</span>
                <span className="text-[11px] text-gray-400 mt-1">Lagna: {lagnaSign}</span>
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Cancer (4)</span>
                {renderPlanetBadges(getRashiForHouse(4))}
              </div>

              {/* Row 3 */}
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Capricorn (10)</span>
                {renderPlanetBadges(getRashiForHouse(10))}
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Leo (5)</span>
                {renderPlanetBadges(getRashiForHouse(5))}
              </div>

              {/* Row 4 */}
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Sagittarius (9)</span>
                {renderPlanetBadges(getRashiForHouse(9))}
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Scorpio (8)</span>
                {renderPlanetBadges(getRashiForHouse(8))}
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Libra (7)</span>
                {renderPlanetBadges(getRashiForHouse(7))}
              </div>
              <div className="border border-amber-500/40 p-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-amber-400 font-bold">Virgo (6)</span>
                {renderPlanetBadges(getRashiForHouse(6))}
              </div>
            </div>
          </div>
        )}

        {/* Hovered Planet Inspector Card */}
        {hoveredPlanet && (
          <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-amber-500/30 flex items-center gap-3 animate-fade-in text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-amber-300">{hoveredPlanet.name}</span> in{' '}
              <span className="font-semibold text-white">{hoveredPlanet.sign}</span> at{' '}
              <span className="text-amber-200">{hoveredPlanet.degreeFormatted}</span> ({hoveredPlanet.nakshatra} Pada {hoveredPlanet.pada}) •{' '}
              <span className="text-gray-300 font-medium">House {hoveredPlanet.house}</span> •{' '}
              <span className={hoveredPlanet.dignity === 'Exalted' ? 'text-emerald-400 font-bold' : hoveredPlanet.dignity === 'Debilitated' ? 'text-red-400 font-bold' : 'text-gray-400'}>
                {hoveredPlanet.dignity}
              </span>
              {hoveredPlanet.isRetrograde && <span className="text-amber-400 ml-1 font-semibold">(Retrograde)</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
