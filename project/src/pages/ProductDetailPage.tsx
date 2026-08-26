import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, RotateCcw, 
  Ruler, Flame, Gift, Star, Zap, CreditCard, Heart, MessageSquare, 
  Award, Compass, Shield, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ShopNavbar from '@/components/ShopNavbar';
import ShopFooter from '@/components/ShopFooter';
import SEO from '@/components/SEO';

interface ProductItem {
  name: string;
  category: 'T-Shirts' | 'Gemstones' | 'Rudraksha' | 'Yantras';
  mulank?: number;
  planet: string;
  price: number;
  mrp: number;
  images: string[];
  description: string;
  features: string[];
  mantra: string;
  ritual: string;
  stockWarning: string;
  rating: number;
  reviewCount: number;
}

const PRODUCTS_CATALOG: Record<string, ProductItem> = {
  // Mulank T-Shirts
  'mulank-1-luxury-tshirt': {
    name: 'The Sovereign Pioneer — Mulank 1 Luxury T-Shirt',
    category: 'T-Shirts',
    mulank: 1,
    planet: 'Sun (Surya) ☀️',
    price: 999,
    mrp: 1999,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Imbued with the solar leadership frequency of Mulank 1. Heavyweight 240 GSM organic French Terry cotton featuring metallic 24K gold foil geometric sun glyphs.',
    features: [
      '240 GSM 100% Super-Combed Bio-Washed French Terry Cotton',
      '24K Metallic Gold Foil Sacred Solar Geometry Glyph',
      'Boxy Streetwear Fit with Ribbed Neckline (Pre-shrunk)',
      'Free ₹999 Master Kundli & Numerology Report PDF Included'
    ],
    mantra: 'Om Hram Hreem Hroum Sah Suryaya Namah (ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः)',
    ritual: 'Consecrated during Ravi Pushya Nakshatra with 108 Surya Gayatri Japas.',
    stockWarning: 'Only 7 left in Size L!',
    rating: 4.9,
    reviewCount: 142
  },
  'mulank-2-luxury-tshirt': {
    name: 'The Intuitive Diplomat — Mulank 2 Luxury T-Shirt',
    category: 'T-Shirts',
    mulank: 2,
    planet: 'Moon (Chandra) 🌙',
    price: 999,
    mrp: 1999,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Imbued with lunar intuition and diplomatic harmony of Mulank 2. Pearl-silver metallic cosmic symbols on luxury heavy cotton.',
    features: [
      '240 GSM Heavy Cotton for effortless streetwear drape',
      'Pearl-Silver Metallic Cosmic Moon Crest',
      'Bio-washed and anti-pilling fabric finish',
      'Free ₹999 Master Kundli & Numerology Report PDF Included'
    ],
    mantra: 'Om Shram Shreem Shroum Sah Chandraya Namah (ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः)',
    ritual: 'Energized on Shukla Paksha Purnima under cooling moonlight.',
    stockWarning: 'High demand — 5 units left in warehouse!',
    rating: 4.8,
    reviewCount: 98
  },

  // Gemstones
  'natural-burma-ruby': {
    name: 'Manikya (Natural Burma Ruby) — 100% Certified',
    category: 'Gemstones',
    planet: 'Sun (Surya) ☀️',
    price: 4999,
    mrp: 9999,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Untreated, unheated Pigeon Blood Red Burma Ruby. Enhances executive charisma, leadership authority, and heart chakra vitality.',
    features: [
      'Govt. Lab Certified 100% Natural Ruby (IGI / GJEPC Standard)',
      'High Optical Clarity & Intense Pigeon Blood Radiance',
      'Suitable for Copper or Gold Ring Setting',
      'Pran Pratishtha Energization Report by Vedic Brahmin Included'
    ],
    mantra: 'Om Ghrini Suryaya Namah (ॐ घृणि सूर्याय नमः)',
    ritual: 'Pran Pratishtha ritual performed at sunrise with red sandalwood and saffron.',
    stockWarning: 'Only 3 certified stones remaining!',
    rating: 5.0,
    reviewCount: 64
  },
  'natural-blue-sapphire-neelam': {
    name: 'Neelam (Natural Ceylon Blue Sapphire) — Certified',
    category: 'Gemstones',
    planet: 'Saturn (Shani) 🪐',
    price: 6999,
    mrp: 14999,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Royal Cornflower Blue Ceylon Sapphire. Bestows rapid career breakthroughs, massive discipline, and protection from Saturnian malefic transits.',
    features: [
      'Authentic Sri Lankan Ceylon Blue Sapphire',
      'Laboratory Tested & Certified with QR Card',
      'Pran Pratishtha on Shani Amavasya included',
      'Includes Trial Period Guidance Leaflet'
    ],
    mantra: 'Om Sham Shanaishcharaya Namah (ॐ शं शनैश्चराय नमः)',
    ritual: 'Consecrated during Saturn Hora with mustard oil and black sesame.',
    stockWarning: 'Only 2 pieces left in stock!',
    rating: 4.9,
    reviewCount: 88
  },

  // Rudrakshas
  '1-mukhi-rudraksha-himalayan': {
    name: 'Ek Mukhi Kaju Rudraksha (Himalayan Consecrated)',
    category: 'Rudraksha',
    planet: 'Sun / Shiva Supreme Consciousness 🔱',
    price: 2499,
    mrp: 4999,
    images: [
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The King of All Rudrakshas. Represents Lord Shiva himself and the Sun God. Illuminates supreme consciousness and mental clarity.',
    features: [
      'Authentic Himalayan Natural Ek Mukhi Bead with Silver Capping',
      'Certified by Gemological Research Laboratory',
      'Energized with Rudra Abhishekam at Kashi Vishwanath',
      'Free Red Silk Thread & Storage Box Included'
    ],
    mantra: 'Om Hreem Namah (ॐ ह्रीं नमः)',
    ritual: 'Blessed during Pradosh Vrat with Gangajal, Bilva leaves, and Panchamrit.',
    stockWarning: 'Rare harvest — 4 beads remaining!',
    rating: 5.0,
    reviewCount: 210
  }
};

// Dynamic Generator for other products
const getProductBySlug = (slug: string): ProductItem => {
  if (PRODUCTS_CATALOG[slug]) return PRODUCTS_CATALOG[slug];

  const match = slug?.match(/mulank-(\d)/);
  const num = match ? parseInt(match[1]) : 1;

  const names: Record<number, { title: string; planet: string; mantra: string }> = {
    1: { title: 'The Sovereign Pioneer', planet: 'Sun (Surya) ☀️', mantra: 'Om Suryaya Namah' },
    2: { title: 'The Intuitive Diplomat', planet: 'Moon (Chandra) 🌙', mantra: 'Om Chandraya Namah' },
    3: { title: 'The Creative Visionary', planet: 'Jupiter (Guru) ✨', mantra: 'Om Gurave Namah' },
    4: { title: 'The Master Builder', planet: 'Rahu (North Node) ⚡', mantra: 'Om Rahave Namah' },
    5: { title: 'The Dynamic Alchemist', planet: 'Mercury (Budh) 🟢', mantra: 'Om Budhaya Namah' },
    6: { title: 'The Harmonious Guardian', planet: 'Venus (Shukra) 💎', mantra: 'Om Shukraya Namah' },
    7: { title: 'The Mystic Philosopher', planet: 'Ketu (South Node) 🔮', mantra: 'Om Ketave Namah' },
    8: { title: 'The Sovereign Strategist', planet: 'Saturn (Shani) 🪐', mantra: 'Om Shanaye Namah' },
    9: { title: 'The Universal Humanitarian', planet: 'Mars (Mangal) 🔥', mantra: 'Om Angarakaya Namah' },
  };

  const item = names[num] || names[1];

  return {
    name: `${item.title} — Mulank ${num} Luxury T-Shirt`,
    category: 'T-Shirts',
    mulank: num,
    planet: item.planet,
    price: 999,
    mrp: 1999,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    ],
    description: `Aligned to the planetary vibration of ${item.planet} (Mulank ${num}). Crafted from heavyweight 240 GSM combed cotton with 24K gold foil sacred geometry.`,
    features: [
      '240 GSM 100% Super-Combed French Terry Cotton',
      '24K Metallic Gold Foil Sacred Planetary Emblem',
      'Boxy Streetwear Fit with Reinforced Collar',
      'Free ₹999 Master Kundli & Numerology Report PDF Included'
    ],
    mantra: item.mantra,
    ritual: 'Pran Pratishtha energized in classical Vedic homam.',
    stockWarning: 'Fast Selling — Order before stock runs out!',
    rating: 4.9,
    reviewCount: 75
  };
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Obsidian Matte Black');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  const product = getProductBySlug(slug || 'mulank-1-luxury-tshirt');
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = () => {
    addItem({
      id: slug || `m-${product.mulank}`,
      title: product.name,
      slug: slug || 'mulank-1-luxury-tshirt',
      price: product.price,
      quantity,
      size: product.category === 'T-Shirts' ? selectedSize : undefined,
      color: product.category === 'T-Shirts' ? selectedColor : undefined,
      image: product.images[0],
      category: product.category,
    });
    toast.success(`Added ${product.name} to your bag!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#07020f] text-slate-100 selection:bg-amber-400 selection:text-black">
      <SEO
        title={`${product.name} — AnkJyotish Atelier`}
        description={product.description}
        canonical={`/shop/product/${slug}`}
      />

      {/* Header */}
      <ShopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 text-left">
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/shop" className="inline-flex items-center text-xs sm:text-sm text-slate-400 hover:text-amber-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Atelier Catalog
          </Link>
          <Badge className="bg-white/5 text-zinc-300 border-white/10 text-xs">
            {product.category}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Images Gallery (Left Column) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-[#121216] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
              <img
                src={product.images[activeImgIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.mulank && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs px-3 py-1">
                    Mulank {product.mulank} Vibration
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className="bg-amber-400 text-black font-bold text-xs px-2.5 py-1 uppercase tracking-wider shadow-lg">
                  {discountPercent}% OFF
                </Badge>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImgIndex === idx ? 'border-amber-400 shadow-md shadow-amber-400/20' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details & Size Configurator (Right Column) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" /> Vedic Energized Product
                </Badge>
                <span className="text-xs text-slate-400">Ruler: <strong className="text-white">{product.planet}</strong></span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewCount} Verified Seekers)</span>
              </div>

              {/* Price Block: Selling Price + MRP */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl sm:text-4xl font-bold text-amber-300 font-serif">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-slate-500 line-through">
                  MRP ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-2 py-0.5">
                  Save ₹{(product.mrp - product.price).toLocaleString('en-IN')} ({discountPercent}% OFF)
                </Badge>
              </div>

              <p className="text-[11px] text-slate-400 mt-1">
                Inclusive of all taxes · <span className="text-emerald-400 font-medium">Free All-India Express Shipping</span>
              </p>
            </div>

            {/* Free Gift Offer Box */}
            <div className="bg-gradient-to-r from-amber-500/15 via-purple-950/30 to-black border border-amber-400/30 rounded-2xl p-4 flex items-start gap-3.5 shadow-lg">
              <Gift className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-amber-300">FREE GIFT WITH THIS ORDER:</p>
                <p className="text-slate-300 mt-0.5">
                  Complete 25+ Page Master Kundli & Numerology Report (Worth ₹999). Delivered instantly via PDF download!
                </p>
              </div>
            </div>

            {/* Color Option for T-Shirts */}
            {product.category === 'T-Shirts' && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-300">Color: <strong className="text-white">{selectedColor}</strong></Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Obsidian Matte Black', hex: '#0e0e11' },
                    { name: 'Solar Gold Edition', hex: '#d4af37' },
                    { name: 'Lunar Pearl White', hex: '#e8e8ea' },
                  ].map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedColor === col.name ? 'border-amber-400 bg-white/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector for T-Shirts */}
            {product.category === 'T-Shirts' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-300">
                    Select Size: <strong className="text-amber-300">{selectedSize}</strong>
                  </Label>

                  {/* Size Chart Modal */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium">
                        <Ruler className="w-3.5 h-3.5" /> Size Chart
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#121216] border-white/10 text-white max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-lg text-amber-300">Unisex Streetwear T-Shirt Size Guide (Inches)</DialogTitle>
                      </DialogHeader>
                      <div className="overflow-x-auto pt-2">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-white/5 text-amber-300 border-b border-white/10">
                            <tr>
                              <th className="p-2.5">Size</th>
                              <th className="p-2.5">Chest (Inches)</th>
                              <th className="p-2.5">Length (Inches)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            <tr><td className="p-2.5 font-bold text-white">S</td><td className="p-2.5">38"</td><td className="p-2.5">27"</td></tr>
                            <tr><td className="p-2.5 font-bold text-white">M</td><td className="p-2.5">40"</td><td className="p-2.5">28"</td></tr>
                            <tr><td className="p-2.5 font-bold text-white">L (Standard)</td><td className="p-2.5">42"</td><td className="p-2.5">29"</td></tr>
                            <tr><td className="p-2.5 font-bold text-white">XL</td><td className="p-2.5">44"</td><td className="p-2.5">30"</td></tr>
                            <tr><td className="p-2.5 font-bold text-white">XXL</td><td className="p-2.5">46"</td><td className="p-2.5">31"</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Size Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                        selectedSize === sz
                          ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20 scale-[1.02]'
                          : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-amber-400/80 font-medium">⚡ {product.stockWarning}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <Label className="text-xs text-slate-300 font-medium">Quantity:</Label>
              <div className="flex items-center border border-white/10 rounded-xl bg-black/40">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white text-sm"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-white min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-300 hover:text-white text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-base h-13 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Instant Checkout via Cashfree / UPI (₹{(product.price * quantity).toLocaleString('en-IN')}) →
              </Button>

              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold text-sm h-12 rounded-2xl flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                Add to Cosmic Bag
              </Button>
            </div>

            {/* Trust & Guarantee Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-white">Free Express Shipping</p>
                <p className="text-[9px] text-slate-500">3-5 Days Delivery</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-white">Cashfree PG Verified</p>
                <p className="text-[9px] text-slate-500">100% Secure Checkout</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <RotateCcw className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <p className="text-[11px] font-semibold text-white">7-Day Size Exchange</p>
                <p className="text-[9px] text-slate-500">Hassle-Free</p>
              </div>
            </div>

          </div>
        </div>

        {/* Deep Product Information Tabs */}
        <div className="mt-16 border-t border-white/10 pt-10">
          <Tabs defaultValue="features" className="space-y-6">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
              <TabsTrigger value="features" className="text-xs sm:text-sm font-semibold">Specifications & Fabric</TabsTrigger>
              <TabsTrigger value="energy" className="text-xs sm:text-sm font-semibold">Vedic Astrological Energy</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm font-semibold">Customer Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-white">Material & Craftsmanship Details</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-black/40 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="energy" className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Planetary Consecration & Pran Pratishtha
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-amber-400 font-bold uppercase text-[10px]">Energizing Beej Mantra</p>
                  <p className="text-white font-serif text-sm">{product.mantra}</p>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-violet-400 font-bold uppercase text-[10px]">Consecration Ritual</p>
                  <p className="text-zinc-300">{product.ritual}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Seeker Experiences</h3>
                  <p className="text-xs text-zinc-400">100% verified orders from across India</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-amber-400">{product.rating} / 5</p>
                  <p className="text-[10px] text-zinc-400">Based on {product.reviewCount} reviews</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { author: 'Vikramaditya S., Mumbai', text: 'The 240 GSM quality is unbelievable. Heavy streetwear drape with sharp gold foil that does not fade after washes.', rating: 5, date: '2 days ago' },
                  { author: 'Pooja Nair, Bangalore', text: 'Wore it for my business pitch as per my Mulank 1 calculation. Felt immensely confident and grounded!', rating: 5, date: '1 week ago' },
                ].map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, r) => (
                          <Star key={r} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500">{rev.date}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">"{rev.text}"</p>
                    <p className="font-bold text-white text-[11px]">— {rev.author}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <ShopFooter />
    </div>
  );
}
