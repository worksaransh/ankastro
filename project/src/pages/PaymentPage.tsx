import { validateReturnUrl } from '@/lib/returnUrl';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCoupon } from '@/hooks/useCoupon';
import { useTestimonials } from '@/hooks/useContentTables';
import SEO from '@/components/SEO';
import { TIERS, TIER_CONTENT, type Tier } from '@/lib/tiers';
import { usePricing } from '@/hooks/usePricing';
import {
  Crown, Sparkles, Check, Shield, Loader2, ArrowLeft, Lock, Quote, Clock,
} from 'lucide-react';

const SELECTABLE: Tier[] = ['starter', 'pro', 'master'];

// Loads Cashfree v3 SDK once (no npm install needed) and opens hosted checkout.
let cashfreeSdkPromise: Promise<any> | null = null;
const loadCashfreeSdk = (): Promise<any> => {
  if ((window as any).Cashfree) return Promise.resolve((window as any).Cashfree);
  if (cashfreeSdkPromise) return cashfreeSdkPromise;
  cashfreeSdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    s.onload = () => resolve((window as any).Cashfree);
    s.onerror = () => reject(new Error('Cashfree SDK load failed'));
    document.head.appendChild(s);
  });
  return cashfreeSdkPromise;
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialTier = (searchParams.get('tier') as Tier) || 'pro';
  const reportId = searchParams.get('report') || undefined;
  const isUpgrade = searchParams.get('upgrade') === '1';
  const returnUrl = validateReturnUrl(searchParams.get('returnUrl'));

  const [selectedTier, setSelectedTier] = useState<Tier>(
    SELECTABLE.includes(initialTier) ? initialTier : 'pro'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [secondsLeft, setSecondsLeft] = useState(900);

  const { priceOf } = usePricing();
  const tierDefStatic = TIERS[selectedTier];
  const dyn = priceOf(selectedTier);
  const tierDef = { ...tierDefStatic, price: dyn.price, originalPrice: dyn.originalPrice ?? tierDefStatic.originalPrice };
  const content = TIER_CONTENT[language as keyof typeof TIER_CONTENT] || TIER_CONTENT.en;
  const tierContent = content[selectedTier as 'starter' | 'pro' | 'master'];

  const { couponCode, setCouponCode, result: couponResult, checking: couponChecking, applyCoupon } = useCoupon(tierDef.price);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const tr = {
    en: {
      title: 'Choose Your Reading Depth',
      subtitle: 'Pick the tier that fits your journey. Upgrade anytime.',
      mostPopular: 'Most Popular',
      bestValue: 'Best Value',
      payNow: 'Pay Now',
      payFree: '🎉 Unlock Free',
      offerExpires: 'Special price expires in',
      offerExpired: '⏰ Offer expired — refresh for latest price',
      processing: 'Processing...',
      securePayment: 'Secure Payment',
      moneyBack: '100% Money-back Guarantee',
      loginRequired: 'Please login to continue with payment',
      login: 'Login to Continue',
      youSelected: 'You selected',
      forReport: 'For report',
      testimonialsTitle: 'What our users say',
    },
    hi: {
      title: 'अपनी रीडिंग गहराई चुनें',
      subtitle: 'अपनी यात्रा के अनुसार स्तर चुनें। कभी भी अपग्रेड करें।',
      mostPopular: 'सबसे लोकप्रिय',
      bestValue: 'सर्वश्रेष्ठ मूल्य',
      payNow: 'अभी भुगतान करें',
      payFree: '🎉 मुफ्त अनलॉक करें',
      offerExpires: 'विशेष मूल्य समाप्त होने में',
      offerExpired: '⏰ ऑफर समाप्त — रिफ्रेश करें',
      processing: 'प्रोसेसिंग...',
      securePayment: 'सुरक्षित भुगतान',
      moneyBack: '100% मनी-बैक गारंटी',
      loginRequired: 'कृपया लॉगिन करें',
      login: 'लॉगिन करें',
      youSelected: 'आपने चुना',
      forReport: 'रिपोर्ट के लिए',
      testimonialsTitle: 'उपयोगकर्ता क्या कहते हैं',
    },
    hinglish: {
      title: 'Apni Reading Depth Chunein',
      subtitle: 'Apni journey ke hisaab se tier select karein. Kabhi bhi upgrade karein.',
      mostPopular: 'Most Popular',
      bestValue: 'Best Value',
      payNow: 'Abhi Pay Karein',
      payFree: '🎉 Free Unlock Karein',
      offerExpires: 'Special price expire hone mein',
      offerExpired: '⏰ Offer expire ho gaya — refresh karein',
      processing: 'Processing...',
      securePayment: 'Secure Payment',
      moneyBack: '100% Money-back Guarantee',
      loginRequired: 'Payment ke liye please login karein',
      login: 'Login Karein',
      youSelected: 'Aapne chuna',
      forReport: 'Report ke liye',
      testimonialsTitle: 'Users kya kehte hain',
    },
  }[language] || {} as any;

  const { data: dbTestimonials } = useTestimonials();
  const testimonialsList = (dbTestimonials || []).map((t) => ({ stars: t.rating, text: t.text, name: t.name }));

  const finalAmount = couponResult?.valid ? couponResult.finalPrice! : tierDef.price;

  const handlePayment = async () => {
    if (!user) {
      toast.error(tr.loginRequired);
      navigate('/login');
      return;
    }
    setIsLoading(true);
    const requestBody = {
      currency: 'INR',
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.full_name || user.email?.split('@')[0],
      userPhone: user.user_metadata?.phone_number || '',
      tier: selectedTier,
      reportId,
      couponCode: couponCode || undefined,
      upgrade: isUpgrade,
      returnUrl,
    };
    console.groupCollapsed('[create-payment] invoke');
    console.log('request body:', requestBody);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: requestBody,
      });
      console.log('raw response data:', data);
      console.log('raw response error:', error);
      if (data && typeof data === 'object') {
        console.log('response fields:', {
          success: (data as any).success,
          error: (data as any).error,
          code: (data as any).code,
          message: (data as any).message,
          free: (data as any).free,
          orderId: (data as any).orderId,
          paymentLink: (data as any).paymentLink,
        });
      }
      if (error) {
        console.error('[create-payment] FunctionsError:', {
          name: (error as any)?.name,
          message: (error as any)?.message,
          status: (error as any)?.status,
          context: (error as any)?.context,
        });
        // Try to surface server-provided body even on non-2xx
        try {
          const ctx: any = (error as any)?.context;
          if (ctx?.body) {
            const text = typeof ctx.body === 'string' ? ctx.body : await new Response(ctx.body).text();
            console.error('[create-payment] error body text:', text);
            try {
              const parsed = JSON.parse(text);
              console.error('[create-payment] error body parsed:', parsed);
              if (parsed?.error) toast.error(parsed.error);
            } catch {}
          }
        } catch (parseErr) {
          console.error('[create-payment] failed to parse error body:', parseErr);
        }
        throw error;
      }
      if (data && data.success === false) {
        console.warn('[create-payment] business failure:', data.error, data);
        toast.error(data.error || 'Payment could not be initiated.');
        return;
      }
      if (data?.free) {
        localStorage.setItem('premiumAccessGranted', 'true');
        toast.success('🎉 Unlocked!');
        const link = data.paymentLink || '/payment-success';
        // Full URL -> hard redirect; relative path -> SPA navigate
        if (/^https?:\/\//i.test(link)) {
          window.location.href = link;
        } else {
          navigate(link);
        }
        return;
      }
      if (data?.paymentSessionId) {
        localStorage.setItem('pendingOrderId', data.orderId);
        try {
          const CF = await loadCashfreeSdk();
          const cashfree = CF({ mode: data.paymentMode === 'production' ? 'production' : 'sandbox' });
          await cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: '_self' });
          return;
        } catch (sdkErr) {
          console.error('[cashfree sdk] failed, trying paymentLink:', sdkErr);
          if (data?.paymentLink) { window.location.href = data.paymentLink; return; }
          toast.error('Payment window khul nahi paya. Dobara try karein.');
          return;
        }
      }
      if (data?.paymentLink) {
        localStorage.setItem('pendingOrderId', data.orderId);
        window.location.href = data.paymentLink;
      }
    } catch (e: any) {
      console.error('[create-payment] caught exception:', e);
      console.error('[create-payment] exception details:', {
        name: e?.name,
        message: e?.message,
        status: e?.status,
        context: e?.context,
        stack: e?.stack,
      });
      toast.error(e.message || 'Failed to initiate payment.');
    } finally {
      console.groupEnd();
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Choose Your Numerology Plan — ₹299 to ₹999" description="Pick from Starter, Pro, or Master numerology readings. One-time payment, lifetime access." canonical="/payment" noindex={true} />
      <div className="min-h-screen bg-background spiritual-pattern">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Logo size="md" />
            </div>
            <LanguageToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {tr.title}
            </h1>
            <p className="text-muted-foreground">{tr.subtitle}</p>
            {reportId && (
              <p className="text-xs text-muted-foreground mt-2">{tr.forReport}: <span className="font-mono">{reportId.slice(0, 8)}…</span></p>
            )}
            {isUpgrade && (
              <Badge className="mt-3 bg-divine text-divine-foreground">
                ⬆ Upgrade pricing — you only pay the difference
              </Badge>
            )}
          </div>

          {/* Tier picker */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {SELECTABLE.map((tierId) => {
              const def = { ...TIERS[tierId], ...priceOf(tierId) };
              const c = content[tierId as 'starter' | 'pro' | 'master'];
              const isSelected = selectedTier === tierId;
              const isPopular = tierId === 'pro';
              const isBest = tierId === 'master';
              return (
                <Card
                  key={tierId}
                  onClick={() => setSelectedTier(tierId)}
                  className={`cursor-pointer transition-all relative ${
                    isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'hover:shadow-md'
                  } ${isPopular ? 'border-primary' : ''}`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      {tr.mostPopular}
                    </Badge>
                  )}
                  {isBest && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-divine text-divine-foreground">
                      {tr.bestValue}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="font-display text-xl">{c.name}</CardTitle>
                    <CardDescription className="text-xs">{c.tagline}</CardDescription>
                    <div className="mt-3">
                      {def.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          ₹{def.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-foreground">₹{def.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {c.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground/90">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Checkout panel */}
          <Card className="card-divine max-w-2xl mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-divine to-divine-light mx-auto mb-2 flex items-center justify-center">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="font-display text-xl">
                {tr.youSelected}: {tierContent.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3">
                  {tierDef.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">₹{tierDef.originalPrice}</span>
                  )}
                  <span className="text-4xl font-bold text-foreground">
                    ₹{couponResult?.valid ? couponResult.finalPrice : tierDef.price}
                  </span>
                </div>
                {couponResult?.valid && (
                  <Badge className="mt-2 bg-green-600 text-white">{couponResult.message}</Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button variant="outline" onClick={applyCoupon} disabled={couponChecking || !couponCode}>
                  {couponChecking ? '...' : 'Apply'}
                </Button>
              </div>
              {couponResult && !couponResult.valid && (
                <p className="text-sm text-destructive text-center">{couponResult.message}</p>
              )}

              {user && (
                <p className="text-amber-600 font-medium text-sm text-center flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  {secondsLeft > 0 ? `${tr.offerExpires} ${formatTime(secondsLeft)}` : tr.offerExpired}
                </p>
              )}

              {user ? (
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className={`w-full py-6 text-lg gap-2 ${
                    finalAmount === 0 ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  size="lg"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {tr.processing}</>
                  ) : finalAmount === 0 ? (
                    <>{tr.payFree}</>
                  ) : (
                    <><Lock className="w-5 h-5" /> {tr.payNow} — ₹{finalAmount}</>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-center text-muted-foreground text-sm">{tr.loginRequired}</p>
                  <Link to="/login" className="block">
                    <Button className="w-full py-6 text-lg" size="lg">{tr.login}</Button>
                  </Link>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" /> {tr.securePayment}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" /> {tr.moneyBack}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          {testimonialsList.length > 0 && (
          <div className="mt-10 max-w-2xl mx-auto">
            <h3 className="font-display text-lg text-foreground mb-3 text-center">{tr.testimonialsTitle}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {testimonialsList.map((t, i) => (
                <Card key={i} className="border bg-background/60">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-1 mb-1 text-yellow-500 text-sm">{'★'.repeat(t.stars)}</div>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      <Quote className="inline w-3 h-3 mr-1 opacity-50" />{t.text}
                    </p>
                    <p className="text-xs font-semibold text-foreground">— {t.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          )}

          <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
            Personalized numerology report generated digitally based on your inputs (name & date of birth) and delivered instantly to your account. Sold by <span className="font-medium text-foreground">Sangeeta Creations</span>, Delhi, India.
          </p>
        </main>
      </div>
    </>
  );
};

export default PaymentPage;
