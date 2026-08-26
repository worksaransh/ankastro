import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Lock, User, Loader2, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react';
import SEO from '@/components/SEO';

const SignupPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [ageConfirm, setAgeConfirm] = useState(false);

  const translations = {
    en: {
      title: 'Create Your Account',
      subtitle: 'Begin your journey to self-discovery',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      agreeTerms: 'I agree to the Terms of Service and Privacy Policy',
      ageConfirm: 'I confirm that I am 18 years or older',
      signUp: 'Create Account',
      signingUp: 'Creating account...',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
      passwordMismatch: 'Passwords do not match',
      mustAgree: 'Please agree to terms and confirm age',
    },
    hi: {
      title: 'अपना खाता बनाएं',
      subtitle: 'आत्म-खोज की यात्रा शुरू करें',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      agreeTerms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं',
      ageConfirm: 'मैं पुष्टि करता/करती हूं कि मैं 18 वर्ष या उससे अधिक का हूं',
      signUp: 'खाता बनाएं',
      signingUp: 'खाता बना रहे हैं...',
      haveAccount: 'पहले से खाता है?',
      signIn: 'साइन इन करें',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      mustAgree: 'कृपया शर्तों से सहमत हों और आयु की पुष्टि करें',
    },
    hinglish: {
      title: 'Apna Account Banayein',
      subtitle: 'Self-discovery ki journey shuru karein',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      agreeTerms: 'Main Terms of Service aur Privacy Policy se agree karta/karti hoon',
      ageConfirm: 'Main confirm karta/karti hoon ki main 18 saal ya usse bada hoon',
      signUp: 'Account Banayein',
      signingUp: 'Account ban raha hai...',
      haveAccount: 'Pehle se account hai?',
      signIn: 'Sign in karein',
      passwordMismatch: 'Passwords match nahi kar rahe',
      mustAgree: 'Please terms agree karein aur age confirm karein',
    },
  };

  const t = translations[language] || translations.en;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneE164 = phone.trim().startsWith('+') ? phone.trim() : `+91${phone.trim().replace(/^0+/, '')}`;
    if (!/^\+[1-9]\d{7,14}$/.test(phoneE164)) {
      toast.error('Please enter a valid phone number with country code');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }
    
    if (!agreeTerms || !ageConfirm) {
      toast.error(t.mustAgree);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-success`,
          data: {
            full_name: fullName,
            phone_number: phoneE164,
          },
        },
      });
      
      if (error) throw error;
      
      // Show clear verification message
      const verifyMsg = language === 'hi'
        ? '✉️ Verification email bheja gaya hai! Apna inbox (aur Spam folder) check karein aur link par click karke account verify karein.'
        : language === 'hinglish'
        ? '✉️ Verification email bhej diya hai! Apna inbox (aur Spam folder) check karein aur link click karke account verify karein.'
        : '✉️ Verification email sent! Please check your inbox (and Spam folder) and click the link to verify your account.';
      
      toast.success(verifyMsg, { duration: 8000 });
      
      // Small delay so user can read the toast
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Free Account — Ankjyotish" description="Create your free Ankjyotish account and get your personalized Vedic numerology report." canonical="/signup" keywords="ankjyotish signup, free numerology account India" />
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
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t.fullName}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
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
              <Label htmlFor="phone">{t.phone}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
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
                  minLength={6}
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                />
                <label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  {t.agreeTerms.split('Terms of Service').map((part, i) => 
                    i === 0 ? (
                      <span key={i}>
                        {part}
                        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                        {' and '}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      </span>
                    ) : null
                  )}
                </label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="ageConfirm"
                  checked={ageConfirm}
                  onCheckedChange={(checked) => setAgeConfirm(checked === true)}
                />
                <label htmlFor="ageConfirm" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  {t.ageConfirm}
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.signingUp}
                </>
              ) : (
                <>
                  {t.signUp}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t.haveAccount} </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t.signIn}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default SignupPage;
