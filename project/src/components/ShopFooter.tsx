import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Sparkles, Heart } from 'lucide-react';

export default function ShopFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07020f] text-slate-400 text-xs pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Free Express Shipping</p>
              <p className="text-slate-500 text-[11px]">All-India delivery in 3–5 days</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Cashfree & UPI Verified</p>
              <p className="text-slate-500 text-[11px]">256-Bit SSL encrypted payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">7-Day Easy Exchange</p>
              <p className="text-slate-500 text-[11px]">Hassle-free size replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">240 GSM Heavy Cotton</p>
              <p className="text-slate-500 text-[11px]">24K gold foil geometric emblems</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white font-serif font-bold text-sm">
              AnkJyotish Atelier <span className="text-amber-400 font-sans text-xs font-normal">· Luxury D2C Astrological Fashion</span>
            </p>
            <p className="text-slate-500 text-[11px] mt-1">
              © {new Date().getFullYear()} Sangeeta Creations. All Rights Reserved. Contact: <a href="mailto:care@ankjyotishai.com" className="text-amber-300 hover:underline">care@ankjyotishai.com</a>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-slate-400 text-xs">
            <Link to="/shop" className="hover:text-white transition-colors">Store Catalog</Link>
            <Link to="/find-my-vibration" className="text-amber-400 hover:text-amber-300 transition-colors">Find Mulank</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
