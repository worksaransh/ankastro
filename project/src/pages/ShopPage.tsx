import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Filter, Star, ShieldCheck, Zap, ArrowRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import ShopNavbar from '@/components/ShopNavbar';
import ShopFooter from '@/components/ShopFooter';
import SEO from '@/components/SEO';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: 'mulank' | 'zodiac' | 'remedy' | 'spiritual';
  number?: number;
  zodiac?: string;
  price: number;
  comparePrice: number;
  image: string;
  shortDesc: string;
  tag: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'm1',
    name: 'The Sovereign Pioneer — Mulank 1 Luxury T-Shirt',
    slug: 'mulank-1-luxury-tshirt',
    category: 'mulank',
    number: 1,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Solar leadership glyph with 24K gold foil geometric emblem on luxury 240 GSM heavy combed cotton.',
    tag: 'Mulank 1'
  },
  {
    id: 'm2',
    name: 'The Intuitive Diplomat — Mulank 2 Luxury T-Shirt',
    slug: 'mulank-2-luxury-tshirt',
    category: 'mulank',
    number: 2,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Lunar diplomacy crest with pearl-silver cosmic geometry. For empathic visionaries and peace builders.',
    tag: 'Mulank 2'
  },
  {
    id: 'm3',
    name: 'The Creative Visionary — Mulank 3 Luxury T-Shirt',
    slug: 'mulank-3-luxury-tshirt',
    category: 'mulank',
    number: 3,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Jupiter creative vortex symbol. For expressive artists, communicators, and dynamic thought leaders.',
    tag: 'Mulank 3'
  },
  {
    id: 'm4',
    name: 'The Master Builder — Mulank 4 Luxury T-Shirt',
    slug: 'mulank-4-luxury-tshirt',
    category: 'mulank',
    number: 4,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Rahu earth-foundation geometric matrix. For disciplined architects of wealth and timeless structures.',
    tag: 'Mulank 4'
  },
  {
    id: 'm5',
    name: 'The Dynamic Alchemist — Mulank 5 Luxury T-Shirt',
    slug: 'mulank-5-luxury-tshirt',
    category: 'mulank',
    number: 5,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Mercury quicksilver talisman. For free-spirited innovators, communicators, and global travelers.',
    tag: 'Mulank 5'
  },
  {
    id: 'm6',
    name: 'The Harmonious Guardian — Mulank 6 Luxury T-Shirt',
    slug: 'mulank-6-luxury-tshirt',
    category: 'mulank',
    number: 6,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Venusian sacred harmony crest. For aesthetic creators, healers, and relationship architects.',
    tag: 'Mulank 6'
  },
  {
    id: 'm7',
    name: 'The Mystic Philosopher — Mulank 7 Luxury T-Shirt',
    slug: 'mulank-7-luxury-tshirt',
    category: 'mulank',
    number: 7,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Ketu spiritual third-eye portal. For deep truth seekers, researchers, and mystics.',
    tag: 'Mulank 7'
  },
  {
    id: 'm8',
    name: 'The Sovereign Strategist — Mulank 8 Luxury T-Shirt',
    slug: 'mulank-8-luxury-tshirt',
    category: 'mulank',
    number: 8,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Saturnian infinity wealth seal. For long-term empire builders and karmic masters of execution.',
    tag: 'Mulank 8'
  },
  {
    id: 'm9',
    name: 'The Universal Humanitarian — Mulank 9 Luxury T-Shirt',
    slug: 'mulank-9-luxury-tshirt',
    category: 'mulank',
    number: 9,
    price: 999,
    comparePrice: 1999,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Mars warrior-monk insignia. For compassionate protectors, visionaries, and world transformers.',
    tag: 'Mulank 9'
  },
  {
    id: 'g1',
    name: 'Natural Certified Ruby (Manikya) Talisman',
    slug: 'ruby-gemstone-remedy',
    category: 'remedy',
    price: 4999,
    comparePrice: 8999,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Energized 3.25 Carat natural Burmese Ruby for solar radiance, leadership authority, and vital energy.',
    tag: 'Gemstone'
  },
  {
    id: 'g2',
    name: 'Vedic Brass Shri Yantra (Energized 3D Meru)',
    slug: 'energized-shri-yantra',
    category: 'spiritual',
    price: 1499,
    comparePrice: 2999,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Sacred geometric 3D Meru Prustha Sri Chakra for home and office prosperity harmonization.',
    tag: 'Yantra'
  }
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addItem } = useCart();

  const filtered = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleQuickAdd = (p: ProductItem) => {
    addItem({
      id: p.id,
      title: p.name,
      slug: p.slug,
      price: p.price,
      size: 'L',
      color: 'Obsidian Matte Black',
      image: p.image,
      category: p.category,
    });
    toast.success(`Added ${p.name} (Size: L) to your bag!`);
  };

  return (
    <div className="min-h-screen bg-[#07020f] text-white selection:bg-amber-400 selection:text-black">
      <SEO
        title="AnkJyotish Atelier — D2C Astrological Luxury Apparel & Remedies"
        description="Shop Mulank 1–9 luxury 240 GSM organic cotton t-shirts, certified gemstones, and Vedic yantras. Free All-India express shipping."
        canonical="/shop"
      />

      {/* Header */}
      <ShopNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3.5 py-1 mb-3 text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> D2C Astrological Luxury Apparel & Remedies
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white mb-3">
            The AnkJyotish Atelier
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Wear your cosmic frequency. Heavyweight 240 GSM organic cotton t-shirts infused with your Mulank number glyphs, and authentic energized remedies.
          </p>

          {/* Interactive DOB Finder Banner */}
          <div className="mt-8 bg-gradient-to-r from-amber-500/20 via-purple-950/40 to-amber-500/10 border border-amber-400/40 rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl text-left">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-400 text-black font-bold text-[11px]">EXCLUSIVE FUNNEL</Badge>
                <span className="text-amber-300 font-semibold text-sm sm:text-base">Don't Know Your Mulank Number?</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Enter your Date of Birth to reveal your psychic ruling planet and unlock a <strong className="text-white font-semibold">FREE ₹999 Master Kundli Report</strong> with your personalized T-Shirt!
              </p>
            </div>
            <Link to="/find-my-vibration" className="shrink-0 w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                Find My Mulank by DOB →
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Collections' },
            { id: 'mulank', label: 'Mulank 1–9 T-Shirts' },
            { id: 'remedy', label: 'Certified Gemstones' },
            { id: 'spiritual', label: 'Sacred Yantras' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === tab.id
                  ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => {
            const discountPercent = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);

            return (
              <div
                key={product.id}
                className="group relative bg-[#121216] border border-white/10 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs px-2.5 py-1">
                      {product.tag}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-amber-400 text-black font-bold text-[11px] px-2 py-0.5 shadow-md">
                      {discountPercent}% OFF
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors mb-1.5">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                      {product.shortDesc}
                    </p>
                  </div>

                  <div>
                    {/* Price Block: Selling Price + MRP */}
                    <div className="flex items-baseline space-x-2.5 mb-4">
                      <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-slate-500 line-through">MRP ₹{product.comparePrice.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] text-emerald-400 font-medium">Free Delivery</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Link to={`/products/${product.slug}`}>
                        <Button variant="outline" className="w-full border-white/20 text-slate-200 hover:bg-white/10 hover:text-white text-xs font-semibold h-11 rounded-xl">
                          Select Size →
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleQuickAdd(product)}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 text-xs h-11 rounded-xl"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Quick Bag
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <ShopFooter />
    </div>
  );
}
