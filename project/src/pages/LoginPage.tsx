import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Phone, Lock, Loader2, ArrowRight, Eye, EyeOff, RefreshCw } from 'lucide-react';
import SEO from '@/components/SEO';

const LoginPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone login state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const translations = {
    en: {
      title: 'Welcome Back',
      subtitle: 'Sign in to access your destiny blueprint',
      emailTab: 'Email',
      phoneTab: 'Phone',
      email: 'Email Address',
      password: 'Password',
      phone: 'Phone Number',
      otp: 'Enter OTP',
      sendOtp: 'Send OTP',
      verifyOtp: 'Verify OTP',
      login: 'Sign In',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      loggingIn: 'Signing in...',
      sendingOtp: 'Sending OTP...',
      verifying: 'Verifying...',
    },
    hi: {
      title: 'वापस स्वागत है',
      subtitle: 'अपनी नियति ब्लूप्रिंट तक पहुंचने के लिए साइन इन करें',
      emailTab: 'ईमेल',
      phoneTab: 'फोन',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      phone: 'फोन नंबर',
      otp: 'OTP दर्ज करें',
      sendOtp: 'OTP भेजें',
      verifyOtp: 'OTP सत्यापित करें',
      login: 'साइन इन',
      forgotPassword: 'पासवर्ड भूल गए?',
      noAccount: 'खाता नहीं है?',
      signUp: 'साइन अप करें',
      loggingIn: 'साइन इन हो रहा है...',
      sendingOtp: 'OTP भेज रहे हैं...',
      verifying: 'सत्यापित हो रहा है...',
    },
    hinglish: {
      title: 'Welcome Back',
      subtitle: 'Apni destiny blueprint access karne ke liye sign in karein',
      emailTab: 'Email',
      phoneTab: 'Phone',
      email: 'Email Address',
      password: 'Password',
      phone: 'Phone Number',
      otp: 'OTP Enter Karein',
      sendOtp: 'OTP Bhejein',
      verifyOtp: 'OTP Verify Karein',
      login: 'Sign In',
      forgotPassword: 'Password bhool gaye?',
      noAccount: 'Account nahi hai?',
      signUp: 'Sign up karein',
      loggingIn: 'Sign in ho raha hai...',
      sendingOtp: 'OTP bhej rahe hain...',
      verifying: 'Verify ho raha hai...',
    },
  };

  const t = translations[language] || translations.en;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.message || 'Failed to login';
      if (/confirm|verif/i.test(msg)) {
        toast.error(msg, { action: { label: 'Resend email', onClick: () => handleResendVerification() } });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) { toast.error('Enter your email above first'); return; }
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${window.location.origin}/verify-success` } });
      if (error) throw error;
      toast.success('Verification email resent — check your inbox');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed');
      setIsLoading(false);
    }
  };

  const normalizePhone = (raw: string) => {
    const trimmed = raw.trim();
    return trimmed.startsWith('+') ? trimmed : `+91${trimmed.replace(/^0+/, '')}`;
  };

  const handleSendOtp = async () => {
    const e164 = normalizePhone(phone);
    if (!/^\+[1-9]\d{7,14}$/.test(e164)) {
      toast.error('Please enter a valid phone number (with country code)');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: e164, purpose: 'login' },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message || 'Failed');
      setOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (err: any) {
      const msg = err.message || 'Failed to send OTP';
      if (msg === 'NO_PROVIDER_ENABLED') toast.error('No SMS provider is configured yet. Please use email login.');
      else if (msg === 'RATE_LIMITED') toast.error('Too many attempts. Try again in a few minutes.');
      else toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const e164 = normalizePhone(phone);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone: e164, code: otp },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message || 'Invalid OTP');
      const { email: synthEmail, token } = data as any;
      const { error: vErr } = await supabase.auth.verifyOtp({ email: synthEmail, token, type: 'magiclink' });
      if (vErr) throw vErr;
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login — Ankjyotish" description="Login to your Ankjyotish account to access your numerology reports." canonical="/login" noindex={true} />
          <div className="min-h-screen flex items-center justify-center bg-background spiritual-pattern px-4 py-8">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <Card className="w-full max-w-md card-divine">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="flex justify-center">
            <Logo size="lg" />
          </Link>
          <div>
            <CardTitle className="font-display text-2xl">{t.title}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="email" className="space-y-6">

            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="w-4 h-4" />
                {t.emailTab}
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2">
                <Phone className="w-4 h-4" />
                {t.phoneTab}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t.password}</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      {t.forgotPassword}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.loggingIn}
                    </>
                  ) : (
                    <>
                      {t.login}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      disabled={otpSent}
                      required
                    />
                  </div>
                </div>
                
                {otpSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="otp">{t.otp}</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                ) : null}
                
                {otpSent ? (
                  <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.verifying}
                      </>
                    ) : (
                      <>
                        {t.verifyOtp}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleSendOtp} className="w-full gap-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.sendingOtp}
                      </>
                    ) : (
                      <>
                        {t.sendOtp}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">{t.noAccount} </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                {t.signUp}
              </Link>
            </div>
            <button type="button" onClick={handleResendVerification} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Resend verification email
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default LoginPage;
