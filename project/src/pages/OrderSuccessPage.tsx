import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Truck, Gift, Download, Sparkles, ShieldCheck, 
  ShoppingBag, ArrowRight, MessageSquare, AlertCircle, Calendar, Star, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShopNavbar from '@/components/ShopNavbar';
import ShopFooter from '@/components/ShopFooter';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const orderNumber = id || 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formattedExpiry = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success('Your 100+ Page Master Kundli & Numerology PDF is ready and downloading!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07020f] text-slate-100 selection:bg-amber-400 selection:text-black flex flex-col justify-between">
      <SEO
        title={`Order Confirmation #${orderNumber} — AnkJyotish Atelier`}
        description="Your order has been confirmed and shipped. You have unlocked 1 Month of Free Premium Vedic Reports access!"
        canonical={`/order/${orderNumber}`}
      />

      {/* Header */}
      <ShopNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full flex-1">
        
        {/* Success Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-black stroke-[2.5]" />
          </div>
          
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1 text-xs uppercase font-bold tracking-wider">
            Payment & Order Confirmed
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Thank You For Your Order!
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Order Reference: <strong className="text-amber-300 font-mono">#{orderNumber}</strong>. A confirmation SMS and email have been dispatched.
          </p>
        </div>

        {/* Shipping & Dispatch Status Card */}
        <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Fulfillment Status</p>
                <p className="text-base font-bold text-white flex items-center gap-2">
                  Preparing for Courier Dispatch
                  <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase">
                    Express Air
                  </Badge>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-400">Estimated Delivery</p>
              <p className="text-sm font-semibold text-emerald-400">3–5 Business Days (BlueDart / Delhivery)</p>
            </div>
          </div>

          {/* Tracking Step Progress */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-400 text-black font-bold text-xs flex items-center justify-center mx-auto">✓</div>
              <p className="text-xs font-semibold text-white">Order Placed</p>
              <p className="text-[10px] text-slate-500">Verified</p>
            </div>
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-black font-bold text-xs flex items-center justify-center mx-auto animate-pulse">2</div>
              <p className="text-xs font-semibold text-amber-300">Packaging & QC</p>
              <p className="text-[10px] text-slate-400">In Progress</p>
            </div>
            <div className="space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-white/10 text-slate-400 text-xs flex items-center justify-center mx-auto">3</div>
              <p className="text-xs font-medium text-slate-400">Out for Delivery</p>
              <p className="text-[10px] text-slate-500">Upcoming</p>
            </div>
          </div>
        </div>

        {/* 1-Month Free Premium Report Entitlement Card */}
        <div className="bg-gradient-to-br from-amber-500/15 via-purple-950/30 to-black border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 bg-amber-400 text-black font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-md">
            Bonus Reward Active
          </div>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-black flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
              <Gift className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  1-Month FREE Premium Report Access Unlocked!
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Valid until <strong className="text-amber-300 font-semibold">{formattedExpiry}</strong>. You can view, generate, and download all your personalized 100+ page Master Vedic Numerology & Kundli Reports for free.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full 100+ Page Master Kundli & Numerology PDF</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Career, Relationship & Name Vibration Analysis</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Daily Panchang & Auspicious Timing Forecasts</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Loshu Grid 3×3 Strength & Remedy Matrix</span>
            </div>
          </div>

          {/* Explicit AI Chat Clarification Alert */}
          <div className="bg-black/50 border border-amber-400/30 p-4 rounded-2xl flex items-start gap-3 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Access Scope: </strong>
              Your 1-Month Free Access includes all **Paid PDF Reports, Kundli Blueprints, and Daily Forecasts**. 
              *(Note: Unlimited 1-on-1 AI Consultation Chat is exclusive to Plus Members and is not included in this free report pass).*
            </div>
          </div>

          {/* Download & View Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleDownloadReport}
              disabled={downloading}
              className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-sm h-12 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Preparing 100+ Page PDF...' : 'Download My Free 100+ Page Master Report (PDF) →'}
            </Button>

            <Link to="/reports" className="flex-1">
              <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold text-sm h-12 rounded-xl flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                View All Unlocked Reports Catalog
              </Button>
            </Link>
          </div>
        </div>

        {/* Continue Shopping Action */}
        <div className="text-center pt-4">
          <Link to="/shop">
            <Button variant="ghost" className="text-slate-400 hover:text-white text-xs sm:text-sm">
              <ShoppingBag className="w-4 h-4 mr-1.5" /> Continue Browsing Atelier Store →
            </Button>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <ShopFooter />
    </div>
  );
}
