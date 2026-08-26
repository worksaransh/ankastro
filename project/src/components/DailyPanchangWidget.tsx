import React, { useState, useMemo } from 'react';
import { calculatePanchang, DailyPanchang } from '@/lib/panchangEngine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Sparkles, Clock, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';

export const DailyPanchangWidget: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const panchang = useMemo(() => {
    return calculatePanchang(selectedDate);
  }, [selectedDate]);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#120a28]/95 to-[#090415]/95 border border-violet-900/40 p-5 sm:p-6 shadow-2xl text-white relative overflow-hidden">
      {/* Subtle cosmic glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
              Daily Vedic Panchang & Muhurta
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 border-amber-500/30 text-amber-300">
                Live Ephemeris
              </Badge>
            </h3>
            <p className="text-xs text-gray-400">
              {panchang.dayOfWeek}, {panchang.date} • Ruler: <span className="text-amber-300 font-medium">{panchang.dayLord}</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-300 flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
          <span>🌅 {panchang.sunTimes.sunrise}</span>
          <span className="text-gray-600">•</span>
          <span>🌇 {panchang.sunTimes.sunset}</span>
        </div>
      </div>

      {/* Core 5 Panchang Elements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {/* 1. Tithi */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">1. Tithi</span>
          <p className="text-sm font-bold text-amber-300 mt-0.5 truncate">{panchang.tithi.name}</p>
          <span className="text-[10px] text-gray-400">{panchang.tithi.paksha}</span>
        </div>

        {/* 2. Nakshatra */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">2. Nakshatra</span>
          <p className="text-sm font-bold text-violet-300 mt-0.5">{panchang.nakshatra.name}</p>
          <span className="text-[10px] text-gray-400">Pada {panchang.nakshatra.pada} (Lord: {panchang.nakshatra.ruler})</span>
        </div>

        {/* 3. Yoga */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">3. Yoga</span>
          <p className="text-sm font-bold text-emerald-300 mt-0.5">{panchang.yoga.name}</p>
          <span className={`text-[10px] font-semibold ${panchang.yoga.nature === 'Auspicious' ? 'text-emerald-400' : 'text-orange-400'}`}>
            {panchang.yoga.nature}
          </span>
        </div>

        {/* 4. Karana */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">4. Karana</span>
          <p className="text-sm font-bold text-cyan-300 mt-0.5">{panchang.karana.name}</p>
          <span className="text-[10px] text-gray-400">Half of Tithi</span>
        </div>
      </div>

      {/* Muhurta Windows (Abhijit vs Rahu Kaal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Abhijit Muhurta (Auspicious) */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-300">Abhijit Muhurta (Shubh)</p>
              <p className="text-[11px] text-gray-300">Ideal for major decisions & new starts</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {panchang.muhurtas.abhijit.start} - {panchang.muhurtas.abhijit.end}
          </span>
        </div>

        {/* Rahu Kaal (Inauspicious) */}
        <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-300">Rahu Kaal (Ashubh)</p>
              <p className="text-[11px] text-gray-300">Avoid new undertakings during this window</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-red-300 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-500/20">
            {panchang.muhurtas.rahuKaal.start} - {panchang.muhurtas.rahuKaal.end}
          </span>
        </div>
      </div>

      {/* Summary Note */}
      <p className="text-[11px] text-gray-400 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
        ✨ <strong>Daily Guidance:</strong> {panchang.auspiciousSummary}
      </p>
    </div>
  );
};
