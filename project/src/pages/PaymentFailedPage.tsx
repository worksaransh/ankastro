import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { XCircle, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';

const PaymentFailedPage = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  const translations = {
    en: {
      title: 'Payment Failed',
      subtitle: "Don't worry, no amount was deducted",
      reason: 'This could happen due to:',
      reasons: [
        'Insufficient funds in your account',
        'Bank server timeout or network issue',
        'Payment declined by your bank',
        'Session expired during payment',
      ],
      tryAgain: 'Try Again',
      contactSupport: 'Email Us for Help',
      backToHome: 'Back to Home',
      needHelp: 'Need help? Email us at care@ankjyotishai.com',
    },
    hi: {
      title: 'भुगतान विफल',
      subtitle: 'चिंता न करें, कोई राशि नहीं कटी',
      reason: 'यह निम्न कारणों से हो सकता है:',
      reasons: [
        'आपके खाते में अपर्याप्त धनराशि',
        'बैंक सर्वर टाइमआउट या नेटवर्क समस्या',
        'आपके बैंक द्वारा भुगतान अस्वीकृत',
        'भुगतान के दौरान सेशन समाप्त',
      ],
      tryAgain: 'फिर से प्रयास करें',
      contactSupport: 'ईमेल से सहायता लें',
      backToHome: 'होम पर वापस जाएं',
      needHelp: 'मदद चाहिए? care@ankjyotishai.com पर ईमेल करें',
    },
    hinglish: {
      title: 'Payment Fail Ho Gaya',
      subtitle: 'Tension mat lo, koi amount nahi kata',
      reason: 'Yeh in reasons se ho sakta hai:',
      reasons: [
        'Account mein insufficient funds',
        'Bank server timeout ya network issue',
        'Bank ne payment decline kiya',
        'Payment ke dauran session expire ho gaya',
      ],
      tryAgain: 'Phir Se Try Karein',
      contactSupport: 'Email Karein Help Ke Liye',
      backToHome: 'Home Par Wapas Jaayein',
      needHelp: 'Help chahiye? care@ankjyotishai.com par email karein',
    },
  };

  const t = translations[language] || translations.en;
  const errorMessage = searchParams.get('error');
  const orderId = searchParams.get('order_id');

  const supportMailto = `mailto:care@ankjyotishai.com?subject=${encodeURIComponent(
    'Payment Failed - Help Needed'
  )}&body=${encodeURIComponent(
    `Hi, I faced an issue with payment on Ankjyotish.\nOrder ID: ${orderId || 'N/A'}\nPlease help.`
  )}`;

  return (
    <>
      <SEO title="Payment Failed — Please Try Again" description="Your payment could not be processed. Please try again or contact care@ankjyotishai.com" canonical="/payment-failed" noindex={true} />
          <div className="min-h-screen bg-background spiritual-pattern flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg card-divine text-center">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <Logo size="md" className="mx-auto mb-4" />
          <CardTitle className="font-display text-3xl text-destructive">{t.title}</CardTitle>
          <CardDescription className="text-lg">{t.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMessage && (
            <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-destructive text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="text-left">
            <p className="font-medium text-foreground mb-3">{t.reason}</p>
            <ul className="space-y-2">
              {t.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-4">
            <Link to="/payment" className="block">
              <Button className="w-full gap-2" size="lg">
                <RefreshCw className="w-5 h-5" />
                {t.tryAgain}
              </Button>
            </Link>

            <a href={supportMailto} className="block">
              <Button variant="outline" className="w-full gap-2">
                <Mail className="w-5 h-5" />
                {t.contactSupport}
              </Button>
            </a>

            <Link to="/" className="block">
              <Button variant="ghost" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.backToHome}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">{t.needHelp}</p>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default PaymentFailedPage;
