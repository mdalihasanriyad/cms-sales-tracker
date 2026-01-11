import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chrome, ArrowRight, Shield, TrendingUp, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate login delay - will be replaced with actual Google OAuth
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Track Sales',
      description: 'Monitor your daily and monthly sales performance in real-time',
    },
    {
      icon: Users,
      title: 'Team Leaderboard',
      description: 'Compete with your team and climb the rankings',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cms-pink/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cms-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-cms-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-8 text-center lg:text-left animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center animate-pulse-glow shadow-lg">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text">
                  CMS Sales
                </h1>
                <p className="text-muted-foreground">Sales Tracking Platform</p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0">
              Track your performance, hit your targets, and become the top seller on your team.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="glass"
                className="animate-fade-in"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cms-pink/10 via-cms-purple/10 to-cms-blue/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-cms-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-display">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card
          variant="elevated"
          className="w-full max-w-md mx-auto animate-scale-in border-0 shadow-2xl"
        >
          <CardContent className="p-8 md:p-10 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in with your Google account to continue
              </p>
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full gap-3"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Chrome className="h-5 w-5" />
                  Continue with Google
                  <ArrowRight className="h-5 w-5 ml-auto" />
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">
                  Secure authentication
                </span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Protected by Google OAuth</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
