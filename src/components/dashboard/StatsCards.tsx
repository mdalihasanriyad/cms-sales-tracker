import { TrendingUp, Target, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardStats } from '@/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Sales */}
      <Card variant="stat" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <h3 className="text-3xl font-bold font-display gradient-text mt-1">
                {formatCurrency(stats.totalSales)}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{stats.targetProgress.toFixed(1)}%</span>
            </div>
            <Progress value={stats.targetProgress} variant="gradient" className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Target */}
      <Card variant="stat" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Target</p>
              <h3 className="text-3xl font-bold font-display text-cms-purple mt-1">
                {formatCurrency(stats.monthlyTarget)}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-cms-purple/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-cms-purple" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Remaining:</span>
            <span className="font-semibold text-cms-pink">
              {formatCurrency(Math.max(0, stats.monthlyTarget - stats.totalSales))}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Daily Required */}
      <Card variant="stat" className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Daily Required</p>
              <h3 className="text-3xl font-bold font-display text-cms-blue mt-1">
                {formatCurrency(stats.dailyRequired)}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-cms-blue/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-cms-blue" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{stats.daysRemaining} days remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Sales Count */}
      <Card variant="stat" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sales Count</p>
              <h3 className="text-3xl font-bold font-display text-cms-pink mt-1">
                {stats.salesCount}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-cms-pink/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-cms-pink" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>This month's transactions</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
