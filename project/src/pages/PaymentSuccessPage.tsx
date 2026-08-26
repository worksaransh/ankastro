import { validateReturnUrl } from '@/lib/returnUrl';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Download, FileText, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import SEO from '@/components/SEO';
import { trackEvent } from '@/lib/analytics';
import { trackPurchase } from '@/lib/tracking';

const PaymentSuccessPage = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const rawReturnUrl = searchParams.get('returnUrl');
  const returnUrl = validateReturnUrl(rawReturnUrl);
  const returnUrlInvalid = !!rawReturnUrl && rawReturnUrl !== returnUrl;

  const translations = {
    en: {
      title: 'Payment Successful! 🎉',
      subtitle: 'Welcome to the Premium Experience',
      thankYou: 'Thank you for your purchase!',
      accessGranted: 'You now have lifetime access to your complete 100+ page numerology report.',
      whatNext: 'What happens next?',
      step1: 'Your advanced report is ready to view',
      step2: 'Download your personalized PDF anytime',
      step3: 'Access exclusive premium features',
      viewReport: 'View My Premium Report',
      downloadPdf: 'Download PDF Report',
      backToDashboard: 'Go to Dashboard',
      verifying: 'Verifying payment...',
      orderRef: 'Order Reference',
    },
    hi: {
      title: 'भुगतान सफल! 🎉',
      subtitle: 'प्रीमियम अनुभव में आपका स्वागत है',
      thankYou: 'आपकी खरीद के लिए धन्यवाद!',
      accessGranted: 'अब आपके पास अपनी पूर्ण 100+ पृष्ठ अंकशास्त्र रिपोर्ट तक आजीवन पहुंच है।',
      whatNext: 'आगे क्या होगा?',
      step1: 'आपकी उन्नत रिपोर्ट देखने के लिए तैयार है',
      step2: 'अपनी व्यक्तिगत PDF कभी भी डाउनलोड करें',
      step3: 'विशेष प्रीमियम सुविधाओं तक पहुंच',
      viewReport: 'मेरी प्रीमियम रिपोर्ट देखें',
      downloadPdf: 'PDF रिपोर्ट डाउनलोड करें',
      backToDashboard: 'डैशबोर्ड पर जाएं',
      verifying: 'भुगतान सत्यापित हो रहा है...',
      orderRef: 'ऑर्डर संदर्भ',
    },
    hinglish: {
      title: 'Payment Successful! 🎉',
      subtitle: 'Premium Experience mein aapka swagat hai',
      thankYou: 'Aapki purchase ke liye dhanyavaad!',
      accessGranted: 'Ab aapke paas apni complete 100+ page numerology report ka lifetime access hai.',
      whatNext: 'Aage kya hoga?',
      step1: 'Aapki advanced report dekhne ke liye ready hai',
      step2: 'Apni personalized PDF kabhi bhi download karein',
      step3: 'Exclusive premium features access karein',
      viewReport: 'Meri Premium Report Dekhein',
      downloadPdf: 'PDF Report Download Karein',
      backToDashboard: 'Dashboard Par Jaayein',
      verifying: 'Payment verify ho raha hai...',
      orderRef: 'Order Reference',
    },
  };

  const t = translations[language] || translations.en;
  const orderId = searchParams.get('order_id') || localStorage.getItem('pendingOrderId');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (orderId) {
          // Retry verify up to 4 times with backoff (handles webhook lag)
          let verified = false;
          for (let attempt = 1; attempt <= 4; attempt++) {
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: { orderId },
            });
            if (!error && data?.success) {
              verified = true;
              setPaymentVerified(true);
              // product-wise purchase event (plan = product)
              try {
                const { data: pay } = await supabase.from('payments')
                  .select('tier, amount').eq('cashfree_order_id', orderId).maybeSingle();
                const tier = (pay as any)?.tier || 'plan';
                const amt = Number((pay as any)?.amount ?? data?.orderAmount) || 0;
                trackPurchase(String(orderId), amt, [{ id: `plan_${tier}`, name: `${tier} plan`, price: amt, quantity: 1 }]);
              } catch { /* tracking optional */ }
              localStorage.setItem('premiumAccessGranted', 'true');
              localStorage.setItem('premiumGrantedAt', Date.now().toString());
              localStorage.removeItem('pendingPaymentSession');
              localStorage.removeItem('pendingOrderId');
              console.log('[payment-success] verified:', { orderId, attempt });
              break;
            }
            console.log(`[payment-success] attempt ${attempt} not yet success`, data);
            if (attempt < 4) await new Promise((r) => setTimeout(r, 2000 * attempt));
          }
          if (!verified) {
            // Last-resort: trust localStorage flag if present
            const localFlag = localStorage.getItem('premiumAccessGranted');
            if (localFlag === 'true') setPaymentVerified(true);
          }
        } else {
          // Free coupon flow — PaymentPage already inserted SUCCESS record
          const localFlag = localStorage.getItem('premiumAccessGranted');
          if (localFlag === 'true') {
            setPaymentVerified(true);
            return;
          }
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: payments } = await supabase
              .from('payments')
              .select('status')
              .eq('user_id', session.user.id)
              .in('status', ['success', 'SUCCESS', 'paid', 'PAID'])
              .limit(1);
            if (payments && payments.length > 0) {
              setPaymentVerified(true);
              localStorage.setItem('premiumAccessGranted', 'true');
              localStorage.setItem('premiumGrantedAt', Date.now().toString());
            }
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        const localFlag = localStorage.getItem('premiumAccessGranted');
        if (localFlag === 'true') setPaymentVerified(true);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();

    // Log which returnUrl destination the user landed on after upgrade
    trackEvent('upgrade_return_landed', {
      returnUrl,
      rawReturnUrl: rawReturnUrl ?? null,
      returnUrlInvalid,
      orderId: orderId ?? null,
    });

    // Trigger confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#5F4B8B', '#E6C849', '#9F7AEA'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#5F4B8B', '#E6C849', '#9F7AEA'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [orderId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background spiritual-pattern">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">{t.verifying}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Payment Successful — Access Your Premium Report" description="Your payment was successful. Your 100+ page advanced numerology report is ready." canonical="/payment-success" noindex={true} />
          <div className="min-h-screen bg-background spiritual-pattern flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg card-divine text-center">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <Logo size="md" className="mx-auto mb-4" />
          <CardTitle className="font-display text-3xl text-primary">{t.title}</CardTitle>
          <CardDescription className="text-lg">{t.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">{t.thankYou}</p>
            <p className="text-green-700 text-sm mt-1">{t.accessGranted}</p>
          </div>

          {orderId && (
            <div className="text-sm text-muted-foreground">
              {t.orderRef}: <span className="font-mono">{orderId}</span>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">{t.whatNext}</h4>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  1
                </div>
                <span className="text-sm text-muted-foreground">{t.step1}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  2
                </div>
                <span className="text-sm text-muted-foreground">{t.step2}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  3
                </div>
                <span className="text-sm text-muted-foreground">{t.step3}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Link
              to={returnUrl}
              className="block"
              onClick={() => trackEvent('upgrade_return_clicked', { returnUrl, destination: 'primary_cta', orderId: orderId ?? null })}
            >
              <Button className="w-full gap-2" size="lg">
                <FileText className="w-5 h-5" />
                {t.viewReport}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link
              to="/dashboard"
              className="block"
              onClick={() => trackEvent('upgrade_return_clicked', { returnUrl: '/dashboard', destination: 'dashboard_fallback', intendedReturnUrl: returnUrl, orderId: orderId ?? null })}
            >
              <Button variant="outline" className="w-full gap-2">
                {t.backToDashboard}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default PaymentSuccessPage;
