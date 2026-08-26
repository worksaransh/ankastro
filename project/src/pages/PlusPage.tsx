import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Check, Crown, Sparkles, Calendar, MessageCircle, TrendingUp, ArrowLeft, Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCoupon } from '@/hooks/useCoupon';
import SEO from '@/components/SEO';

const BENEFITS = [
  { icon: Calendar, en: 'Daily personalised lucky number, colour & timing', hi: 'रोज़ का व्यक्तिगत शुभ अंक, रंग और समय', hg: 'Roz ka personal lucky number, colour aur timing' },
  { icon: TrendingUp, en: 'Monthly personal forecast report', hi: 'मासिक व्यक्तिगत भविष्यवाणी रिपोर्ट', hg: 'Monthly personal forecast report' },
  { icon: MessageCircle, en: 'Unlimited AI numerology chat', hi: 'असीमित AI न्यूमेरोलॉजी चैट', hg: 'Unlimited AI numerology chat' },
  { icon: Sparkles, en: 'Member discount on all reports', hi: 'सभी रिपोर्ट्स पर सदस्य छूट', hg: 'Saari reports par member discount' },
];

declare global { interface Window { Cashfree?: any; } }
const loadCF = (mode: string) => new Promise<void>((resolve) => {
  if (window.Cashfree) return resolve();
  const s = document.createElement('script');
  s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
  s.onload = () => resolve();
  document.head.appendChild(s);
});

export default function PlusPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const L = (o: any) => o[language === 'hi' ? 'hi' : language === 'en' ? 'en' : 'hg'];

  const [plan, setPlan] = useState<'plus_monthly' | 'plus_quarterly'>('plus_monthly');
  const [prices, setPrices] = useState({ plus_monthly: 99, plus_quarterly: 249 });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const price = prices[plan];
  
  // Connect custom coupon hook
  const { couponCode, setCouponCode, result: couponResult, checking: couponChecking, applyCoupon } = useCoupon(price);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('system_settings').select('key, value').in('key', ['plus_monthly_price', 'plus_quarterly_price']);
        const map: any = {};
        (data || []).forEach((r: any) => { map[r.key] = Number(r.value); });
        setPrices({
          plus_monthly: map.plus_monthly_price || 99,
          plus_quarterly: map.plus_quarterly_price || 249,
        });
      } catch { /* defaults */ }
      // prefill from session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) setEmail(session.user.email);
        if (session?.user?.user_metadata?.full_name) setName(session.user.user_metadata.full_name);
        if (session?.user?.user_metadata?.phone_number) setPhone(session.user.user_metadata.phone_number);
      } catch { /* guest */ }
    })();
  }, []);

  const subscribe = async () => {
    if (!email.trim()) { toast.error(language === 'hi' ? 'ईमेल डालें' : 'Email daalein'); return; }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { 
          plan, 
          email: email.trim(), 
          name: name.trim(), 
          phone: phone.trim(), 
          userId: session?.user?.id, 
          couponCode: couponResult?.valid ? couponCode.trim() : undefined,
          returnOrigin: window.location.origin 
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed');

      if (data.mock) { window.location.href = data.redirect; return; }

      await loadCF(data.paymentMode);
      const cf = window.Cashfree({ mode: data.paymentMode === 'production' ? 'production' : 'sandbox' });
      cf.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: '_self' });
    } catch (e: any) {
      toast.error('Error: ' + (e.message || 'try again'));
      setLoading(false);
    }
  };

  const finalAmount = couponResult?.valid ? couponResult.finalPrice! : price;

  return (
    <div className="min-h-screen bg-background spiritual-pattern relative overflow-hidden pb-20">
      <SEO title="AnkJyotish Plus — Daily Numerology Membership" description="Daily lucky number, monthly forecast, unlimited AI chat. From ₹99/month." canonical="/plus" />
      
      {/* Decorative Blur elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#07020f]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5 gap-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <span className="font-display font-bold text-white text-lg tracking-wide">AnkJyotish Plus</span>
        <div className="w-20" /> {/* Spacer to center title */}
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold tracking-widest uppercase">
            <Crown className="w-3.5 h-3.5 fill-amber-400 animate-pulse" /> 
            Vedic Pass
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
            Elevate Your Journey with <span className="text-gradient-gold">Plus</span>
          </h1>
          <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base">
            {language === 'hi' ? 'रोज़ अपने नंबरों के साथ जुड़ें — सिर्फ़ ₹99/महीना से' : language === 'en' ? 'Stay connected to your numbers daily — from ₹99/month' : 'Roz apne numbers se juड़े raho — sirf ₹99/month se'}
          </p>
        </div>

        <Card className="glass-card-mystical border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-6 sm:p-10">
            {/* Features/Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 border-b border-white/5 pb-8">
              {BENEFITS.map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="p-2 rounded-xl bg-primary/15 shrink-0 border border-primary/25">
                    <b.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-sm text-gray-200 leading-snug">{L(b)}</span>
                </div>
              ))}
            </div>

            {/* Plan Picker */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold text-gray-400 tracking-wider uppercase text-left">Select Billing Period</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPlan('plus_monthly')} 
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    plan === 'plus_monthly' 
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <p className="text-xs text-gray-400 font-medium">{language === 'hi' ? 'मासिक' : 'Monthly Plan'}</p>
                  <p className="text-2xl font-bold text-white mt-1.5">
                    ₹{prices.plus_monthly}
                    <span className="text-xs font-normal text-gray-400">/mo</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">Non-recurring subscription</p>
                </button>
                <button 
                  onClick={() => setPlan('plus_quarterly')} 
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    plan === 'plus_quarterly' 
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5' 
                      : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="absolute -top-1 right-2 text-[8px] sm:text-[10px] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-0.5 rounded-b-md font-bold tracking-wider">SAVE</span>
                  <p className="text-xs text-gray-400 font-medium">{language === 'hi' ? '3 महीने' : 'Quarterly Plan'}</p>
                  <p className="text-2xl font-bold text-white mt-1.5">
                    ₹{prices.plus_quarterly}
                    <span className="text-xs font-normal text-gray-400">/3mo</span>
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">₹83/mo equivalent value</p>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold text-gray-400 tracking-wider uppercase text-left">Your Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input 
                  placeholder={language === 'hi' ? 'नाम' : 'Full Name'} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-primary/50"
                />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-primary/50"
                />
                <Input 
                  placeholder={language === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-primary/50"
                />
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2 mb-8 border-t border-white/5 pt-6 text-left">
              <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Have a Coupon Code?</p>
              <div className="flex gap-2">
                <Input 
                  placeholder={language === 'hi' ? 'कूपन कोड डालें' : 'Enter coupon code'} 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                  className="bg-white/5 border-white/10 text-white rounded-xl focus:border-primary/50 flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={applyCoupon} 
                  disabled={couponChecking || !couponCode}
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                >
                  {couponChecking ? '...' : (language === 'hi' ? 'लागू करें' : 'Apply')}
                </Button>
              </div>
              {couponResult && (
                <p className={`text-xs ${couponResult.valid ? 'text-emerald-400 font-semibold' : 'text-red-400'}`}>
                  {couponResult.message}
                </p>
              )}
            </div>

            {/* Checkout CTA */}
            <Button 
              className="w-full bg-gradient-to-r from-primary via-violet-600 to-primary text-white font-bold tracking-wide py-6 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] hover:shadow-primary/35 transition-all duration-300 flex items-center justify-center gap-2 group" 
              onClick={subscribe} 
              disabled={loading}
            >
              <Star className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
              {loading ? '...' : `${language === 'hi' ? 'सदस्य बनें' : 'Unlock Plus Membership'} — ₹${finalAmount}`}
            </Button>
            
            <div className="flex justify-center items-center gap-6 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Secure Cashfree Checkout
              </span>
              <span>•</span>
              <span>Cancel Anytime</span>
            </div>
            
            <p className="text-[10px] sm:text-xs text-gray-500 mt-4 leading-relaxed max-w-md mx-auto">
              {language === 'hi' 
                ? 'नोट: यह एक मासिक वैदिक पास सदस्यता है। सदस्यता समाप्त होने से पहले आपको नवीनीकरण का रिमाइंडर प्राप्त होगा।' 
                : 'Note: This is a manual-renewal monthly Vedic Pass membership. You will receive a renewal notification upon package expiry.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
