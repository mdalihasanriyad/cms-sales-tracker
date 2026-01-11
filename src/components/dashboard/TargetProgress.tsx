import { useState } from 'react';
import { Edit2, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DashboardStats } from '@/types';
import { toast } from '@/hooks/use-toast';

interface TargetProgressProps {
  stats: DashboardStats;
  teamTarget?: number;
  teamProgress?: number;
  onUpdateTarget?: (target: number) => void;
}

const TargetProgress = ({ stats, teamTarget = 150000, teamProgress = 65.5, onUpdateTarget }: TargetProgressProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newTarget, setNewTarget] = useState(stats.monthlyTarget.toString());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleUpdateTarget = () => {
    const target = parseFloat(newTarget);
    if (isNaN(target) || target <= 0) {
      toast({
        title: 'Invalid Target',
        description: 'Please enter a valid target amount',
        variant: 'destructive',
      });
      return;
    }

    onUpdateTarget?.(target);
    toast({
      title: 'Target Updated!',
      description: `Your monthly target is now ${formatCurrency(target)}`,
    });
    setIsEditOpen(false);
  };

  return (
    <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl">Target Progress</CardTitle>
          </div>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Target
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl gradient-text">
                  Update Monthly Target
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Target (USD)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter target amount"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleUpdateTarget}>
                  Update Target
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Individual Target */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Target</p>
              <p className="text-2xl font-bold font-display">{formatCurrency(stats.monthlyTarget)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Achieved</p>
              <p className="text-2xl font-bold gradient-text">{stats.targetProgress.toFixed(1)}%</p>
            </div>
          </div>
          <Progress value={stats.targetProgress} variant="gradient" className="h-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(stats.totalSales)} earned</span>
            <span>{formatCurrency(Math.max(0, stats.monthlyTarget - stats.totalSales))} to go</span>
          </div>
        </div>

        {/* Team Target */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Target</p>
              <p className="text-2xl font-bold font-display">{formatCurrency(teamTarget)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Team Progress</p>
              <p className="text-2xl font-bold text-cms-blue">{teamProgress.toFixed(1)}%</p>
            </div>
          </div>
          <Progress value={teamProgress} variant="blue" className="h-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(teamTarget * (teamProgress / 100))} team total</span>
            <span>{formatCurrency(teamTarget * ((100 - teamProgress) / 100))} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TargetProgress;
