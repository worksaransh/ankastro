import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, Calendar, User, ShoppingBag, ArrowRight, CheckCircle2, 
  Gift, ShieldCheck, Star, Award, Zap, Heart, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ShopNavbar from '@/components/ShopNavbar';
import ShopFooter from '@/components/ShopFooter';

const MULANK_DETAILS: Record<number, {
  archetype: string;
  planet: string;
  element: string;
  colors: string[];
  gemstone: string;
  affirmation: string;
  tshirtSlug: string;
  tshirtImg: string;
  tshirtTitle: string;
  traits: string[];
}> = {
  1: {
    archetype: 'The Sovereign Pioneer',
    planet: 'Sun (Surya)',
    element: 'Fire',
    colors: ['Royal Gold', 'Flame Orange', 'Solar Yellow'],
    gemstone: 'Ruby (Manikya)',
    affirmation: 'I am born to lead, pioneer new frontiers, and shine with radiant confidence.',
    tshirtSlug: 'mulank-1-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Sovereign Pioneer — Mulank 1 Luxury T-Shirt',
    traits: ['Visionary Leadership', 'Unyielding Willpower', 'Originality', 'High Ambition']
  },
  2: {
    archetype: 'The Intuitive Diplomat',
    planet: 'Moon (Chandra)',
    element: 'Water',
    colors: ['Pearl White', 'Silver', 'Aqua Blue'],
    gemstone: 'Natural Pearl (Moti)',
    affirmation: 'My intuition is my superpower. I bring peace, harmony, and magnetic attraction.',
    tshirtSlug: 'mulank-2-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Intuitive Diplomat — Mulank 2 Luxury T-Shirt',
    traits: ['Deep Intuition', 'Diplomacy', 'Artistic Sensitivity', 'Emotional Wisdom']
  },
  3: {
    archetype: 'The Creative Visionary',
    planet: 'Jupiter (Guru)',
    element: 'Ether / Fire',
    colors: ['Saffron', 'Bright Yellow', 'Warm Gold'],
    gemstone: 'Yellow Sapphire (Pukhraj)',
    affirmation: 'Creative abundance and wisdom flow effortlessly through my expression.',
    tshirtSlug: 'mulank-3-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Creative Visionary — Mulank 3 Luxury T-Shirt',
    traits: ['Expansive Wisdom', 'Creative Genius', 'Persuasive Speech', 'Optimism']
  },
  4: {
    archetype: 'The Master Builder',
    planet: 'Rahu (North Node)',
    element: 'Earth',
    colors: ['Electric Blue', 'Slate Grey', 'Deep Khaki'],
    gemstone: 'Hessonite Garnet (Gomed)',
    affirmation: 'I build timeless foundations, execute with discipline, and turn ideas into empires.',
    tshirtSlug: 'mulank-4-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Master Builder — Mulank 4 Luxury T-Shirt',
    traits: ['Strategic Execution', 'Iron Discipline', 'Structural Mind', 'Reliability']
  },
  5: {
    archetype: 'The Dynamic Alchemist',
    planet: 'Mercury (Budh)',
    element: 'Air',
    colors: ['Emerald Green', 'Turquoise', 'Mint'],
    gemstone: 'Emerald (Panna)',
    affirmation: 'I embrace change, master communication, and seize limitless global opportunities.',
    tshirtSlug: 'mulank-5-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Dynamic Alchemist — Mulank 5 Luxury T-Shirt',
    traits: ['Rapid Adaptability', 'Commercial Genius', 'Curiosity', 'Magnetic Charm']
  },
  6: {
    archetype: 'The Harmonious Guardian',
    planet: 'Venus (Shukra)',
    element: 'Water / Earth',
    colors: ['Royal White', 'Rose Pink', 'Pastel Blue'],
    gemstone: 'Diamond / White Opal',
    affirmation: 'I attract luxury, beauty, deep love, and cosmic prosperity into my sanctuary.',
    tshirtSlug: 'mulank-6-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Harmonious Guardian — Mulank 6 Luxury T-Shirt',
    traits: ['Aesthetic Elegance', 'Unconditional Care', 'Magnetism', 'Wealth Attraction']
  },
  7: {
    archetype: 'The Mystic Philosopher',
    planet: 'Ketu (South Node)',
    element: 'Water',
    colors: ['Smoky Quartz', 'Sage Green', 'Pure White'],
    gemstone: "Cat's Eye (Lehsunia)",
    affirmation: 'I pierce beyond illusions to discover hidden cosmic truths and deep mastery.',
    tshirtSlug: 'mulank-7-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Mystic Philosopher — Mulank 7 Luxury T-Shirt',
    traits: ['Deep Analytical Mind', 'Spiritual Awakening', 'Research Mastery', 'Insight']
  },
  8: {
    archetype: 'The Sovereign Strategist',
    planet: 'Saturn (Shani)',
    element: 'Earth',
    colors: ['Matte Black', 'Dark Navy', 'Charcoal'],
    gemstone: 'Blue Sapphire (Neelam)',
    affirmation: 'Through resilience and karmic integrity, I build enduring generational wealth.',
    tshirtSlug: 'mulank-8-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Sovereign Strategist — Mulank 8 Luxury T-Shirt',
    traits: ['Empire Builder', 'Karmic Resilience', 'High Authority', 'Financial Mastery']
  },
  9: {
    archetype: 'The Universal Humanitarian',
    planet: 'Mars (Mangal)',
    element: 'Fire',
    colors: ['Crimson Red', 'Ruby Rose', 'Coral'],
    gemstone: 'Red Coral (Moonga)',
    affirmation: 'I lead with warrior courage, fearless passion, and serve universal transformation.',
    tshirtSlug: 'mulank-9-luxury-tshirt',
    tshirtImg: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    tshirtTitle: 'The Universal Humanitarian — Mulank 9 Luxury T-Shirt',
    traits: ['Fearless Courage', 'Humanitarian Mission', 'Passionate Drive', 'Universal Love']
  }
};

export default function DiscoverMulankPage() {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [calculatedMulank, setCalculatedMulank] = useState<number | null>(null);
  const [calculatedBhagyank, setCalculatedBhagyank] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [isCalculating, setIsCalculating] = useState(false);

  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) {
      toast.error('Please select your Date of Birth');
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      const dateParts = dob.split('-');
      const day = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[0], 10);

      // Mulank calculation
      const reduce = (n: number) => {
        while (n > 9) {
          n = n.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        }
        return n;
      };

      const m = reduce(day);
      const b = reduce(day + month + reduce(year));

      setCalculatedMulank(m);
      setCalculatedBhagyank(b);
      setIsCalculating(false);
      toast.success(`Your Mulank is ${m} (Ruling: ${MULANK_DETAILS[m].planet})!`);
    }, 400);
  };

  const handleClaimBundle = () => {
    if (!calculatedMulank) return;
    const details = MULANK_DETAILS[calculatedMulank];

    // 1. Add Mulank T-Shirt to Cart
    addItem({
      id: `m-${calculatedMulank}`,
      title: details.tshirtTitle,
      slug: details.tshirtSlug,
      price: 999,
      image: details.tshirtImg,
      size: selectedSize,
      color: 'Matte Black',
      customName: fullName || undefined,
      category: 'Mulank T-Shirts'
    });

    toast.success('🎉 Mulank T-Shirt + FREE ₹999 Master Report added to your bag!');
    navigate('/checkout');
  };

  const details = calculatedMulank ? MULANK_DETAILS[calculatedMulank] : null;

  return (
    <div className="min-h-screen bg-[#07020f] text-slate-100 selection:bg-amber-400 selection:text-black flex flex-col justify-between">
      <SEO
        title="Find Your Mulank & Cosmic Vibration — AnkJyotish Atelier"
        description="Don't know your lucky number? Enter your Date of Birth to discover your Mulank, ruling planet, and get a FREE ₹999 Master Report with your personalized T-Shirt."
        canonical="/find-my-vibration"
      />

      {/* Unified Top Header */}
      <ShopNavbar />

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 pt-8 pb-20 max-w-4xl flex-1">
        
        {/* Banner Hero */}
        <div className="text-center space-y-3 mb-10">
          <Badge className="bg-amber-400/10 text-amber-300 border-amber-400/30 px-3.5 py-1 text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> Instant Vibration Finder & Free Gift
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Don't Know Your Lucky Mulank?
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Enter your Date of Birth below. We will calculate your ruling planetary vibration, unlock your luxury apparel design, and gift you a <span className="text-amber-300 font-semibold underline decoration-amber-400/50">FREE ₹999 Master Kundli Report</span> with your order!
          </p>
        </div>

        {/* Input Form Card */}
        <Card className="bg-[#121216] border-white/10 shadow-2xl rounded-3xl overflow-hidden mb-12">
          <CardContent className="p-6 sm:p-10">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-amber-400" /> Your Full Name (Optional)
                  </Label>
                  <Input
                    placeholder="e.g. Saransh Gulati"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500">Can be custom laser-engraved onto your t-shirt.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date of Birth *
                  </Label>
                  <Input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm focus:border-amber-400 [color-scheme:dark]"
                  />
                  <p className="text-[11px] text-slate-500">Day determines your Mulank (Psychic Vibration).</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-sm sm:text-base h-12 rounded-xl shadow-lg shadow-amber-500/20"
              >
                {isCalculating ? 'Decoding Planetary Alignment...' : 'Reveal My Mulank Vibration & Unlock Bundle →'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Calculated Results Section */}
        {details && calculatedMulank && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Vibration Reveal Header Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-purple-950/20 to-black border border-amber-400/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-serif font-black text-4xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                    {calculatedMulank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs">
                        Mulank {calculatedMulank}
                      </Badge>
                      {calculatedBhagyank && (
                        <Badge className="bg-white/10 text-slate-300 border-white/10 text-xs">
                          Bhagyank {calculatedBhagyank}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                      {details.archetype}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                      Ruling Deity / Planet: <span className="text-amber-300 font-semibold">{details.planet}</span> · Element: {details.element}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                  <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                    <span className="text-slate-400">Gemstone: </span>
                    <span className="text-amber-300 font-medium">{details.gemstone}</span>
                  </div>
                  <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                    <span className="text-slate-400">Lucky Colors: </span>
                    <span className="text-slate-200">{details.colors.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {details.traits.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 py-2 px-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive D2C Bundle Offer Card */}
            <div className="bg-[#121216] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-black font-bold text-[11px] px-4 py-1 rounded-bl-xl shadow-md uppercase tracking-wider">
                Limited Time Bundle
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Product Image */}
                <div className="w-full lg:w-72 aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 relative border border-white/10 shrink-0">
                  <img src={details.tshirtImg} alt={details.tshirtTitle} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-amber-300 font-semibold border border-amber-400/30">
                    240 GSM Luxury Cotton
                  </div>
                </div>

                {/* Bundle Details */}
                <div className="flex-1 space-y-4 text-left">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      {details.tshirtTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Infused with 24K gold foil geometric solar glyphs aligned to your Mulank {calculatedMulank} frequency.
                    </p>
                  </div>

                  {/* Free Gift Highlight */}
                  <div className="bg-amber-400/10 border border-amber-400/30 p-3.5 rounded-2xl flex items-start gap-3">
                    <Gift className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-300">FREE GIFT INCLUDED: </span>
                      <span className="text-slate-200">Complete Master 5-Pillar Kundli & Numerology Report (Value: ₹999). Instant PDF download delivered upon order!</span>
                    </div>
                  </div>

                  {/* Size Selector & Custom Name */}
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div>
                      <Label className="text-xs text-slate-400 mb-1.5 block">Select Size</Label>
                      <div className="flex gap-1.5">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            className={`w-9 h-9 rounded-lg text-xs font-semibold border transition-all ${
                              selectedSize === sz ? 'bg-amber-400 text-black border-amber-400 shadow-md' : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/30'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="ml-auto flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-white">₹999</span>
                      <span className="text-sm text-slate-500 line-through">₹1999</span>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <Button
                    onClick={handleClaimBundle}
                    className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-base h-12 rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Claim My Mulank {calculatedMulank} T-Shirt + Free ₹999 Report →
                  </Button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Unified Footer */}
      <ShopFooter />
    </div>
  );
}
