import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { supabase } from '@/integrations/supabase/client';
import { useRecoverySession } from '@/hooks/useRecoverySession';
import { toast } from 'sonner';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import SEO from '@/components/SEO';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { status, error: recoveryError } = useRecoverySession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated successfully!');
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Set New Password — Ankjyotish" description="Set your new Ankjyotish account password." canonical="/reset-password" noindex={true} />
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
            <CardTitle className="font-display text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {status === 'pending' ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying reset link...</p>
            </div>
          ) : status === 'invalid' ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-destructive">
                {recoveryError || 'Invalid or expired reset link. Please request a new one.'}
              </p>
              <Button asChild className="w-full">
                <Link to="/forgot-password">Request New Link</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
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
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default ResetPasswordPage;
