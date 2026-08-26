import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/SEO';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password — Ankjyotish" description="Reset your Ankjyotish account password." canonical="/forgot-password" noindex={true} />
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
            <CardTitle className="font-display text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              {sent
                ? 'Check your email for the reset link'
                : 'Enter your email and we will send you a reset link'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                We sent a password reset link to <strong>{email}</strong>. Click the link in the
                email to set a new password.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/login">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default ForgotPasswordPage;
