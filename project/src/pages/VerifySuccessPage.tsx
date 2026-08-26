import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

type Status = 'verifying' | 'success' | 'already' | 'error';

const copy = {
  en: {
    verifying: 'Verifying your email…',
    success: 'Email verified successfully!',
    successDesc: 'Welcome to Ankjyotish. Your spiritual journey begins now.',
    already: 'You are signed in',
    alreadyDesc: 'Your email is already verified. Redirecting you to your dashboard.',
    error: 'Verification link invalid or expired',
    errorDesc: 'Please request a new verification email by signing in again.',
    goDashboard: 'Go to Dashboard',
    goLogin: 'Back to Login',
  },
  hi: {
    verifying: 'आपका ईमेल सत्यापित हो रहा है…',
    success: 'ईमेल सफलतापूर्वक सत्यापित हो गया!',
    successDesc: 'अंकज्योतिष में आपका स्वागत है। आपकी आध्यात्मिक यात्रा शुरू होती है।',
    already: 'आप पहले से साइन इन हैं',
    alreadyDesc: 'आपका ईमेल पहले से सत्यापित है। डैशबोर्ड पर भेजा जा रहा है।',
    error: 'सत्यापन लिंक अमान्य या समाप्त',
    errorDesc: 'कृपया साइन इन करके नया सत्यापन ईमेल मांगें।',
    goDashboard: 'डैशबोर्ड पर जाएं',
    goLogin: 'लॉगिन पर वापस',
  },
  hinglish: {
    verifying: 'Aapka email verify ho raha hai…',
    success: 'Email successfully verify ho gaya!',
    successDesc: 'Ankjyotish mein aapka swagat hai. Aapki spiritual journey shuru.',
    already: 'Aap already signed in hain',
    alreadyDesc: 'Aapka email pehle se verified hai. Dashboard pe le ja rahe hain.',
    error: 'Verification link invalid ya expire ho gaya',
    errorDesc: 'Please dobara sign in karke naya verification email mangein.',
    goDashboard: 'Dashboard pe jayein',
    goLogin: 'Login pe wapas',
  },
};

const VerifySuccessPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  const [status, setStatus] = useState<Status>('verifying');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // Supabase puts tokens in the URL hash on verification redirects
        const hash = window.location.hash.startsWith('#')
          ? window.location.hash.slice(1)
          : window.location.hash;
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        const errorDesc = params.get('error_description') || params.get('error');

        if (errorDesc) {
          if (!cancelled) setStatus('error');
          return;
        }

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
          // Clean the hash from the URL
          window.history.replaceState({}, document.title, window.location.pathname);
          if (!cancelled) setStatus('success');
          setTimeout(() => navigate('/dashboard'), 2500);
          return;
        }

        // No tokens present — check if already signed in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (!cancelled) setStatus('already');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          if (!cancelled) setStatus('error');
        }
      } catch (err) {
        console.error('[VerifySuccess] failed:', err);
        if (!cancelled) setStatus('error');
      }
    };

    run();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <>
      <SEO title="Email Verified — Ankjyotish" description="Your Ankjyotish account email is verified." canonical="/verify-success" noindex />
      <div className="min-h-screen flex items-center justify-center bg-background spiritual-pattern px-4 py-8">
        <Card className="w-full max-w-md card-divine animate-in fade-in zoom-in-95 duration-500">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>

            {status === 'verifying' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
                <h1 className="font-display text-2xl">{t.verifying}</h1>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 animate-ping" />
                  </div>
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl">
                    <CheckCircle2 className="w-14 h-14 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h1 className="font-display text-2xl mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {t.success}
                  </h1>
                  <p className="text-muted-foreground">{t.successDesc}</p>
                </div>
                <Button className="w-full gap-2" onClick={() => navigate('/dashboard')}>
                  {t.goDashboard}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {status === 'already' && (
              <>
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div>
                  <h1 className="font-display text-2xl mb-2">{t.already}</h1>
                  <p className="text-muted-foreground">{t.alreadyDesc}</p>
                </div>
                <Button className="w-full gap-2" onClick={() => navigate('/dashboard')}>
                  {t.goDashboard}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                  </div>
                </div>
                <div>
                  <h1 className="font-display text-2xl mb-2">{t.error}</h1>
                  <p className="text-muted-foreground">{t.errorDesc}</p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/login">{t.goLogin}</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VerifySuccessPage;
