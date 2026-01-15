import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp, Target, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Users', value: '100+', icon: Users },
    { label: 'Sales Tracked', value: '$2M+', icon: TrendingUp },
    { label: 'Targets Hit', value: '95%', icon: Target },
    { label: 'Top Performers', value: '25', icon: Trophy },
  ];
const currentYear = new Date().getFullYear();
  return (

    
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cms-pink/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cms-purple/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-cms-blue/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 container py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center animate-pulse-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">CMS Sales</span>
          </div>
          <Button variant="hero" onClick={() => navigate('/login')} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-cms-purple" />
            <span className="text-muted-foreground">Trusted by 100+ sales professionals</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight">
            Track Sales.{' '}
            <span className="gradient-text">Hit Targets.</span>{' '}
            <br className="hidden md:block" />
            Top the Leaderboard.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            The ultimate sales tracking platform for Fiverr teams. Monitor performance, 
            compete with teammates, and crush your monthly goals with beautiful analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="hero" size="xl" onClick={() => navigate('/login')} className="gap-3 w-full sm:w-auto">
              Start Tracking Now
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              variant="glass"
              className="text-center animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <CardContent className="p-6 space-y-3">
                <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center mx-auto">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-display gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 gradient-bg opacity-5 rounded-3xl blur-3xl" />
          <Card variant="elevated" className="relative overflow-hidden border-0 shadow-2xl max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="gradient-bg p-1">
              <div className="bg-card rounded-2xl p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-cms-pink/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-cms-pink" />
                    </div>
                    <h3 className="text-xl font-bold font-display">Real-time Analytics</h3>
                    <p className="text-muted-foreground">
                      Track your daily and monthly sales with beautiful charts and insights.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-cms-purple/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-cms-purple" />
                    </div>
                    <h3 className="text-xl font-bold font-display">Smart Targets</h3>
                    <p className="text-muted-foreground">
                      Set and track individual and team targets with progress indicators.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-cms-blue/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-cms-blue" />
                    </div>
                    <h3 className="text-xl font-bold font-display">Leaderboard</h3>
                    <p className="text-muted-foreground">
                      Compete with teammates and earn badges for top performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-20">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 justify-between">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              © {currentYear} CMS Sales. All rights reserved.
            </span>
            
          </div>
          <span className='text-sm text-muted-foreground'>Develop by <a className='text-sm gradient-text text-muted-foreground text-center animate-fade-in' href="https://ahriyad.top">AH Riyad</a></span>
          <p className="text-sm text-muted-foreground">
            Built for Fiverr sales teams
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
