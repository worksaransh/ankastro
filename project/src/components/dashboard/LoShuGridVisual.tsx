import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Info, X } from 'lucide-react';
import { calculateLoshuPlanes, type LoshuPlanesAnalysis } from '@/lib/enterpriseNumerologyEngine';

interface LoShuGridVisualProps {
  dob: string;
}

export const LoShuGridVisual: React.FC<LoShuGridVisualProps> = ({ dob }) => {
  const [selectedMissingNum, setSelectedMissingNum] = useState<{ number: number; element: string; remedy: string } | null>(null);

  const analysis: LoshuPlanesAnalysis = calculateLoshuPlanes(dob);

  const digits = dob.replace(/[^0-9]/g, '').split('').map(Number).filter(n => n >= 1 && n <= 9);
  const digitCounts: Record<number, number> = {};
  digits.forEach(d => {
    digitCounts[d] = (digitCounts[d] || 0) + 1;
  });

  // Standard Lo Shu 3x3 positions:
  // Row 1: 4  9  2
  // Row 2: 3  5  7
  // Row 3: 8  1  6
  const gridCells = [
    { pos: 'top-left', num: 4, name: 'SE Wood' },
    { pos: 'top-center', num: 9, name: 'S Fire' },
    { pos: 'top-right', num: 2, name: 'SW Earth' },
    { pos: 'mid-left', num: 3, name: 'E Wood' },
    { pos: 'mid-center', num: 5, name: 'Center Earth' },
    { pos: 'mid-right', num: 7, name: 'W Metal' },
    { pos: 'bottom-left', num: 8, name: 'NE Earth' },
    { pos: 'bottom-center', num: 1, name: 'N Water' },
    { pos: 'bottom-right', num: 6, name: 'NW Metal' },
  ];

  return (
    <Card className="p-5 rounded-2xl bg-gradient-to-b from-[#0e071e] via-[#090314] to-[#04010a] border border-amber-500/20 shadow-[0_0_30px_rgba(234,179,8,0.05)] text-left relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase tracking-wider">
              Interactive 3x3 Lo Shu Energy Grid
            </h3>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Cosmic birth numbers matrix & active Raj Yog planes for DOB: {dob || 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {analysis.hasGoldenYog && (
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] py-0.5 px-2 font-bold animate-pulse">
              ★ Golden Raj Yog (4-5-6)
            </Badge>
          )}
          {analysis.hasSilverYog && (
            <Badge className="bg-slate-300/20 text-slate-200 border border-slate-300/40 text-[10px] py-0.5 px-2 font-bold">
              ✦ Silver Property Yog (2-5-8)
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* 3x3 Grid Display */}
        <div className="relative p-3 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
          {/* Diagonal Raj Yog Beams */}
          {analysis.hasGoldenYog && (
            <div className="absolute inset-0 pointer-events-none border-2 border-amber-400/60 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] z-10 animate-pulse" />
          )}

          <div className="grid grid-cols-3 gap-2.5">
            {gridCells.map((cell) => {
              const count = digitCounts[cell.num] || 0;
              const isPresent = count > 0;
              const remedyInfo = analysis.elementalRemedies.find(r => r.number === cell.num);

              return (
                <button
                  key={cell.num}
                  type="button"
                  onClick={() => {
                    if (!isPresent && remedyInfo) {
                      setSelectedMissingNum(remedyInfo);
                    }
                  }}
                  className={`relative p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 min-h-[75px] ${
                    isPresent
                      ? 'bg-gradient-to-b from-amber-500/20 to-purple-900/20 border-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:scale-105'
                      : 'bg-white/[0.01] border-white/5 text-gray-600 hover:border-amber-400/30 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter absolute top-1 left-1.5">
                    {cell.num}
                  </span>

                  {isPresent ? (
                    <div className="text-center mt-1">
                      <span className="text-xl font-display font-extrabold text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                        {Array(count).fill(cell.num).join('')}
                      </span>
                      <p className="text-[9px] text-amber-300/80 font-medium mt-0.5">
                        {cell.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center mt-1">
                      <span className="text-sm font-mono text-gray-500 line-through opacity-40">
                        {cell.num}
                      </span>
                      <p className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-0.5">
                        Missing <Info className="w-2.5 h-2.5 text-amber-400/70" />
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Planes Breakdown & Missing Remedies Panel */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider border-b border-white/5 pb-1">
            Active Grid Planes & Yogas
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded-lg border ${analysis.hasMentalPlane ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-white/[0.01] border-white/5 text-gray-500'}`}>
              <span className="font-bold text-[11px]">Mental (4-9-2):</span>
              <p className="text-[10px] mt-0.5">{analysis.hasMentalPlane ? 'Active ✓ (Sharp Memory)' : 'Incomplete'}</p>
            </div>

            <div className={`p-2.5 rounded-lg border ${analysis.hasEmotionalPlane ? 'bg-purple-500/10 border-purple-500/30 text-purple-200' : 'bg-white/[0.01] border-white/5 text-gray-500'}`}>
              <span className="font-bold text-[11px]">Emotional (3-5-7):</span>
              <p className="text-[10px] mt-0.5">{analysis.hasEmotionalPlane ? 'Active ✓ (High Intuition)' : 'Incomplete'}</p>
            </div>

            <div className={`p-2.5 rounded-lg border ${analysis.hasPracticalPlane ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-white/[0.01] border-white/5 text-gray-500'}`}>
              <span className="font-bold text-[11px]">Practical (8-1-6):</span>
              <p className="text-[10px] mt-0.5">{analysis.hasPracticalPlane ? 'Active ✓ (Wealth Action)' : 'Incomplete'}</p>
            </div>

            <div className={`p-2.5 rounded-lg border ${analysis.hasWillPlane ? 'bg-blue-500/10 border-blue-500/30 text-blue-200' : 'bg-white/[0.01] border-white/5 text-gray-500'}`}>
              <span className="font-bold text-[11px]">Will Power (9-5-1):</span>
              <p className="text-[10px] mt-0.5">{analysis.hasWillPlane ? 'Active ✓ (High Determination)' : 'Incomplete'}</p>
            </div>
          </div>

          {analysis.missingNumbers.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] text-gray-400 mb-1">Missing Digits Remedies (Click to view elemental fix):</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingNumbers.map(n => {
                  const rem = analysis.elementalRemedies.find(r => r.number === n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => rem && setSelectedMissingNum(rem)}
                      className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-mono hover:bg-rose-500/20 transition-colors"
                    >
                      Missing {n} ➔
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Missing Number Remedy Modal */}
      {selectedMissingNum && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 rounded-2xl bg-[#0f071f] border border-amber-500/30 shadow-[0_0_40px_rgba(234,179,8,0.2)] space-y-3 relative text-left">
            <button
              type="button"
              onClick={() => setSelectedMissingNum(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-300">
                Elemental Remedy for Missing Number {selectedMissingNum.number}
              </h4>
            </div>

            <div>
              <span className="text-[10px] font-mono text-amber-400/90 uppercase tracking-widest">
                Target Element: {selectedMissingNum.element}
              </span>
              <p className="text-xs text-gray-200 mt-2 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/5">
                {selectedMissingNum.remedy}
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedMissingNum(null)}
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
