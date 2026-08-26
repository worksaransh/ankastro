import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, RotateCcw, 
  Ruler, Flame, Gift, Star, Zap, CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ShopNavbar from '@/components/ShopNavbar';
import ShopFooter from '@/components/ShopFooter';
import SEO from '@/components/SEO';

const PRODUCTS_DATA: Record<string, {
  name: string;
  mulank: number;
  planet: string;
  price: number;
  mrp: number;
  images: string[];
  description: string;
  features: string[];
  stockWarning: string;
}> = {
  'mulank-1-luxury-tshirt': {
    name: 'The Sovereign Pioneer — Mulank 1 Luxury T-Shirt',
    mulank: 1,
    planet: 'Sun (Surya)',
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
    stockWarning: 'Only 7 left in Size L!'
  },
  'mulank-2-luxury-tshirt': {
    name: 'The Intuitive Diplomat — Mulank 2 Luxury T-Shirt',
    mulank: 2,
    planet: 'Moon (Chandra)',
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
    stockWarning: 'High demand — 5 units left in warehouse!'
  }
};

// Fallback generator for other Mulanks 3-9
const getProductBySlug = (slug: string) => {
  if (PRODUCTS_DATA[slug]) return PRODUCTS_DATA[slug];

  const match = slug?.match(/mulank-(\d)/);
  const num = match ? parseInt(match[1]) : 1;

  const names: Record<number, { title: string; planet: string }> = {
    1: { title: 'The Sovereign Pioneer', planet: 'Sun (Surya)' },
    2: { title: 'The Intuitive Diplomat', planet: 'Moon (Chandra)' },
    3: { title: 'The Creative Visionary', planet: 'Jupiter (Guru)' },
    4: { title: 'The Master Builder', planet: 'Rahu (North Node)' },
    5: { title: 'The Dynamic Alchemist', planet: 'Mercury (Budh)' },
    6: { title: 'The Harmonious Guardian', planet: 'Venus (Shukra)' },
    7: { title: 'The Mystic Philosopher', planet: 'Ketu (South Node)' },
    8: { title: 'The Sovereign Strategist', planet: 'Saturn (Shani)' },
    9: { title: 'The Universal Humanitarian', planet: 'Mars (Mangal)' },
  };

  const item = names[num] || names[1];

  return {
    name: `${item.title} — Mulank ${num} Luxury T-Shirt`,
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
    stockWarning: 'Fast Selling — Order before stock runs out!'
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
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
      category: 'Mulank T-Shirts',
    });
    toast.success(`Added ${product.name} (Size: ${selectedSize}) to your bag!`);
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
        canonical={`/products/${slug}`}
      />

      {/* Header */}
      <ShopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Breadcrumb / Back Link */}
        <Link to="/shop" className="inline-flex items-center text-xs sm:text-sm text-slate-400 hover:text-amber-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Atelier Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Images Gallery (Left Column) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-[#121216] border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
              <img
                src={product.images[activeImgIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs px-3 py-1">
                  Mulank {product.mulank} Frequency
                </Badge>
              </div>
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
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Planetary Energy Series
                </Badge>
                <span className="text-xs text-slate-400">Ruling: <strong className="text-white">{product.planet}</strong></span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                {product.name}
              </h1>

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
                  Complete 5-Pillar Master Kundli & Numerology Report (Worth ₹999). Delivered instantly via PDF download!
                </p>
              </div>
            </div>

            {/* Color Option */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-300">Color: <strong className="text-white">{selectedColor}</strong></Label>
              <div className="flex gap-2">
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

            {/* Size Selector (S, M, L, XL, XXL) with Size Guide */}
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

            {/* Product Feature Bullets */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Craftsmanship & Fabric Specifications</h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <ShopFooter />
    </div>
  );
}
