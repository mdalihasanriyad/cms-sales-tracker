import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset email');
      } else {
        setIsEmailSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[hsl(var(--cms-pink))] opacity-20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[hsl(var(--cms-purple))] opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-[hsl(var(--cms-blue))] opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full animate-scale-in border-0 shadow-2xl card-elevated">
          <CardContent className="p-8 md:p-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display">
                  {isEmailSent ? 'Check Your Email' : 'Reset Password'}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {isEmailSent
                    ? 'We sent a password reset link to your email'
                    : 'Enter your email to receive a password reset link'}
                </p>
              </div>
            </div>

            {isEmailSent ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We sent an email to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEmailSent(false)}
                  >
                    Try a different email
                  </Button>
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-bg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
