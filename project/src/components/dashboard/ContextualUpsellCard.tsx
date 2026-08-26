import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ShieldCheck, ArrowRight, Compass, ShoppingBag, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NumerologyData, KundliData } from '@/lib/unifiedSynthesisEngine';

interface ContextualUpsellCardProps {
  userState: 'free' | 'numerology_only' | 'kundli_only' | 'both_unlocked';
  numData?: NumerologyData;
  kundliData?: KundliData;
}

export default function ContextualUpsellCard({ userState, numData, kundliData }: ContextualUpsellCardProps) {
  if (userState === 'numerology_only') {
    return (
      <Card className="bg-gradient-to-r from-amber-500/15 via-violet-950/40 to-black border border-amber-500/30 overflow-hidden shadow-2xl text-left">
        <CardContent className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-black font-bold text-xs">
                Complete Your Dual-Matrix
              </Badge>
              <span className="text-xs text-amber-300 font-semibold">50% Bundle Discount</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Unlock Your <span className="text-amber-400">Vedic Janam Kundli</span> & Cross-Matrix Synergy
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Your <strong>Mulank {numData?.mulank || 1}</strong> is ruled by {numData?.mulankPlanet || 'Sun'}. Unlock your 12-House Kundli chart to discover how your 10th House Karma Lord and active Vimshottari Mahadasha intersect with your life numbers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-left sm:text-right">
              <p className="text-xs text-zinc-400 line-through">₹1,999</p>
              <p className="text-2xl font-black text-amber-400">₹499</p>
            </div>
            <Link to="/buy/career-numerology-report">
              <Button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-sm px-6 h-12 rounded-xl shadow-lg shadow-amber-500/20 w-full">
                <Compass className="w-4 h-4 mr-2" /> Unlock Kundli Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userState === 'kundli_only') {
    return (
      <Card className="bg-gradient-to-r from-violet-950/40 via-amber-500/15 to-black border border-violet-500/30 overflow-hidden shadow-2xl text-left">
        <CardContent className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-violet-500 text-white font-bold text-xs">
                Name & Number Harmony
              </Badge>
              <span className="text-xs text-violet-300 font-semibold">Vibration Balance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Unlock Your <span className="text-violet-400">Chaldean Name Correction</span> & Lo Shu Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Your Ascendant is <strong>{kundliData?.lagnaSign || 'Leo'}</strong>. Ensure your name spelling frequency resonates with your Lagna Lord to eliminate hidden obstacles and activate continuous financial growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-left sm:text-right">
              <p className="text-xs text-zinc-400 line-through">₹1,999</p>
              <p className="text-2xl font-black text-violet-400">₹499</p>
            </div>
            <Link to="/buy/name-correction-report">
              <Button className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-bold text-sm px-6 h-12 rounded-xl shadow-lg shadow-violet-500/20 w-full">
                <Sparkles className="w-4 h-4 mr-2" /> Unlock Name Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userState === 'both_unlocked') {
    return (
      <Card className="bg-gradient-to-r from-emerald-950/40 via-amber-950/20 to-black border border-emerald-500/30 overflow-hidden shadow-2xl text-left">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm flex items-center gap-2">
                VIP Master Unlocked: Complete Dual Synthesis Active
                <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px]">100% Synced</Badge>
              </p>
              <p className="text-xs text-zinc-400">
                You have full access to both Kundli Bhavas and Numerology 8-Planes. Claim ₹200 off your Mulank 24K Gold Foil T-Shirt in our store.
              </p>
            </div>
          </div>
          <Link to="/shop">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs h-9 px-4">
              <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Visit Cosmic Store
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Free Tier Card
  return (
    <Card className="bg-gradient-to-r from-amber-500/20 via-violet-900/20 to-black border border-amber-500/40 overflow-hidden shadow-2xl text-left">
      <CardContent className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <Badge className="bg-amber-500 text-black font-bold text-xs">
            Unlock Full Master Matrix
          </Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Get Your 25+ Page Unified Kundli & Numerology Life Blueprint
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300">
            Includes all 12 Kundli Bhavas, 8 Lo Shu Planes, 36-Gun Milan, 10-Year Mahadasha Roadmap, and Tailored Remedial Gemstones.
          </p>
        </div>
        <Link to="/form">
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm px-7 py-5 rounded-xl shadow-lg shadow-amber-500/25">
            <Sparkles className="w-4 h-4 mr-2" /> Unlock Everything for ₹499
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
