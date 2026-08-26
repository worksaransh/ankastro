import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check, ShieldCheck, Clock, Flame } from 'lucide-react';
import { calculateGemstoneRudrakshaPrescription, type GemstoneRudrakshaPrescription } from '@/lib/enterpriseNumerologyEngine';

interface GemstonePrescriptionCardProps {
  mulank: number;
  userWeightKg?: number;
}

export const GemstonePrescriptionCard: React.FC<GemstonePrescriptionCardProps> = ({ mulank, userWeightKg = 70 }) => {
  const [copied, setCopied] = useState(false);
  const prescription: GemstoneRudrakshaPrescription = calculateGemstoneRudrakshaPrescription(mulank, userWeightKg);

  const handleCopyMantra = () => {
    navigator.clipboard.writeText(prescription.beejMantra);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5 rounded-2xl bg-gradient-to-b from-[#140828] via-[#0d041c] to-[#06010d] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] text-left relative overflow-hidden space-y-4">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Gemstone, Rudraksha & Beej Mantra Prescription
            </h3>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Calculated for Mulank {mulank} & Body Weight ({userWeightKg} kg)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] py-0.5 px-2.5 font-bold">
            {prescription.recommendedRatti} Ratti
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] py-0.5 px-2.5 font-bold">
            {prescription.rudrakshaMukhi}
          </Badge>
        </div>
      </div>

      {/* Grid of Prescription Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gemstone Box */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> Primary Gemstone
            </span>
            <span className="text-[11px] font-bold text-amber-300">{prescription.recommendedRatti} Ratti</span>
          </div>

          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] inline-block" />
            {prescription.primaryGemstone}
          </h4>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-gray-300">
            <div>
              <span className="text-[9px] text-gray-400 uppercase">Metal:</span>
              <p className="font-semibold text-white">{prescription.metalType}</p>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase">Finger:</span>
              <p className="font-semibold text-white">{prescription.wearFinger}</p>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-1 text-[10px] text-amber-200/90 font-mono">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{prescription.wearDayTime}</span>
          </div>
        </div>

        {/* Rudraksha & Vastu Direction Box */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Rudraksha & Vastu Geometry
          </span>

          <div className="space-y-1.5 pt-1">
            <div>
              <span className="text-[10px] text-gray-400">Prescribed Rudraksha:</span>
              <p className="text-xs font-bold text-emerald-300">{prescription.rudrakshaMukhi}</p>
            </div>

            <div>
              <span className="text-[10px] text-gray-400">Yantra Direction:</span>
              <p className="text-xs font-semibold text-white">{prescription.yantraDirection}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Beej Mantra Chant Box */}
      <div className="p-4 rounded-xl bg-[#090314] border border-purple-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">
            Vibrational Beej Mantra (Repeat 108 Times Daily)
          </span>
          <button
            type="button"
            onClick={handleCopyMantra}
            className="flex items-center gap-1 text-[10px] text-purple-300 hover:text-white transition-colors bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Mantra'}
          </button>
        </div>

        <p className="text-xs font-mono text-amber-100/90 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/5 select-all">
          "{prescription.beejMantra}"
        </p>
      </div>
    </Card>
  );
};
