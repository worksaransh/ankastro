import React, { useState } from 'react';
import { 
  Sparkles, Moon, Sun, Star, Plus, Edit, Trash2, Save, 
  CheckCircle2, Compass, ShieldCheck, Layers 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AstrologyKundliManager() {
  const [activeSubTab, setActiveSubTab] = useState<'grahas' | 'yogas' | 'dashas' | 'ashtakoota'>('grahas');

  const [grahas, setGrahas] = useState([
    { id: '1', name: 'Surya (Sun)', rashi: 'Simha (Leo)', dignity: 'Exalted in Mesha (Aries)', karaka: 'Soul, Leadership, Father, Vitality', gem: 'Ruby (Manikya)', status: 'Active' },
    { id: '2', name: 'Chandra (Moon)', rashi: 'Karka (Cancer)', dignity: 'Exalted in Vrishabha (Taurus)', karaka: 'Mind, Emotions, Mother, Intuition', gem: 'Natural Pearl (Moti)', status: 'Active' },
    { id: '3', name: 'Guru (Jupiter)', rashi: 'Dhanu & Meena', dignity: 'Exalted in Karka (Cancer)', karaka: 'Wisdom, Wealth, Expansion, Guru', gem: 'Yellow Sapphire (Pukhraj)', status: 'Active' },
    { id: '4', name: 'Rahu (North Node)', rashi: 'Co-rules Kumbha', dignity: 'Exalted in Mithuna/Vrishabha', karaka: 'Innovation, Obsession, Material Maya', gem: 'Hessonite Garnet (Gomed)', status: 'Active' },
    { id: '5', name: 'Budh (Mercury)', rashi: 'Mithuna & Kanya', dignity: 'Exalted in Kanya (Virgo)', karaka: 'Intellect, Speech, Commerce, Logic', gem: 'Emerald (Panna)', status: 'Active' },
    { id: '6', name: 'Shukra (Venus)', rashi: 'Vrishabha & Tula', dignity: 'Exalted in Meena (Pisces)', karaka: 'Beauty, Luxury, Love, Refinement', gem: 'Diamond / White Opal', status: 'Active' },
    { id: '7', name: 'Ketu (South Node)', rashi: 'Co-rules Vrishchika', dignity: 'Exalted in Dhanu/Vrishchika', karaka: 'Moksha, Detachment, Research, Mysticism', gem: "Cat's Eye (Lehsunia)", status: 'Active' },
    { id: '8', name: 'Shani (Saturn)', rashi: 'Makara & Kumbha', dignity: 'Exalted in Tula (Libra)', karaka: 'Karma, Discipline, Longevity, Justice', gem: 'Blue Sapphire (Neelam)', status: 'Active' },
    { id: '9', name: 'Mangal (Mars)', rashi: 'Mesha & Vrishchika', dignity: 'Exalted in Makara (Capricorn)', karaka: 'Courage, Energy, Real Estate, Siblings', gem: 'Red Coral (Moonga)', status: 'Active' },
  ]);

  const [yogas, setYogas] = useState([
    { id: 'y1', name: 'Gajakesari Yoga', condition: 'Jupiter in Kendra (1,4,7,10) from Moon', effect: 'Confers enduring royal reputation, high intellect, and abundant institutional wealth.', status: 'Active' },
    { id: 'y2', name: 'Budhaditya Yoga', condition: 'Sun conjunct Mercury in same Bhava', effect: 'Sharp mathematical intellect, high administrative acumen, and public honor.', status: 'Active' },
    { id: 'y3', name: 'Dhana Yoga (11th Lord in 2nd)', condition: '11th Lord situated in 2nd Bhava or conjunct 2nd Lord', effect: 'Continuous flow of generational wealth and massive enterprise profits.', status: 'Active' },
    { id: 'y4', name: 'Raja Yoga (Kendra + Trikona Lord)', condition: 'Lords of Kendra and Trikona in mutual reception or conjunction', effect: 'Elevation to supreme leadership, state honors, and power over masses.', status: 'Active' },
  ]);

  const handleSaveConfigs = () => {
    toast.success('Astrology and Kundli engine parameters synchronized with database!');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            Vedic Astrology & Kundli Engine Rules
          </h2>
          <p className="text-xs text-slate-400">
            Configure 9 Grahas dignities, active Yogas, Mahadasha cycles, and 36-Guna matchmaking thresholds.
          </p>
        </div>
        <Button onClick={handleSaveConfigs} className="bg-amber-400 text-black hover:bg-amber-300 font-bold text-xs">
          <Save className="w-4 h-4 mr-1.5" /> Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeSubTab} onValueChange={(v: any) => setActiveSubTab(v)} className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="grahas" className="text-xs">
            <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> 9 Grahas & Dignities
          </TabsTrigger>
          <TabsTrigger value="yogas" className="text-xs">
            <Star className="w-3.5 h-3.5 mr-1.5 text-yellow-400" /> Active Planetary Yogas
          </TabsTrigger>
          <TabsTrigger value="ashtakoota" className="text-xs">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-pink-400" /> 36-Guna Matchmaking
          </TabsTrigger>
        </TabsList>

        {/* 9 Grahas */}
        <TabsContent value="grahas">
          <Card className="bg-[#121216] border-white/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-white/5 text-slate-400 uppercase text-xs border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Graha (Planet)</th>
                      <th className="py-3 px-4">Ruling Signs</th>
                      <th className="py-3 px-4">Dignity / Exaltation</th>
                      <th className="py-3 px-4">Karakatva (Significations)</th>
                      <th className="py-3 px-4">Gemstone Remedy</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {grahas.map((g) => (
                      <tr key={g.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-bold text-white">{g.name}</td>
                        <td className="py-3 px-4 text-slate-400">{g.rashi}</td>
                        <td className="py-3 px-4 text-amber-300">{g.dignity}</td>
                        <td className="py-3 px-4 text-slate-300 text-xs">{g.karaka}</td>
                        <td className="py-3 px-4 text-emerald-400 text-xs">{g.gem}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                            {g.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Yogas */}
        <TabsContent value="yogas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yogas.map((y) => (
              <Card key={y.id} className="bg-[#121216] border-white/10 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-amber-300">{y.name}</h3>
                  <Badge className="bg-amber-400 text-black text-[10px] font-bold">Yoga Rule</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-semibold">Mathematical Condition:</p>
                  <p className="text-xs text-slate-200 font-mono bg-black/40 p-2 rounded-lg border border-white/5">{y.condition}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-semibold">Grounded Result Interpretation:</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{y.effect}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 36-Guna Ashtakoota */}
        <TabsContent value="ashtakoota">
          <Card className="bg-[#121216] border-white/10 p-6 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Ashtakoota 36-Guna Kundli Matchmaking Weights</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[
                { name: '1. Varna Koota', max: '1 Point', desc: 'Spiritual development and ego compatibility' },
                { name: '2. Vashya Koota', max: '2 Points', desc: 'Mutual magnetic attraction and dominance' },
                { name: '3. Tara Koota', max: '3 Points', desc: 'Birth star and destiny longevity' },
                { name: '4. Yoni Koota', max: '4 Points', desc: 'Biological and intimate attraction' },
                { name: '5. Graha Maitri', max: '5 Points', desc: 'Mental and intellectual friendship' },
                { name: '6. Gana Koota', max: '6 Points', desc: 'Temperament (Deva, Manushya, Rakshasa)' },
                { name: '7. Bhakoot Koota', max: '7 Points', desc: 'Family prosperity and financial growth' },
                { name: '8. Nadi Koota', max: '8 Points', desc: 'Genetic health and physiological harmony' },
              ].map((k, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <p className="font-bold text-xs text-amber-300">{k.name}</p>
                  <p className="text-[11px] font-semibold text-white">{k.max}</p>
                  <p className="text-[10px] text-slate-400">{k.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
