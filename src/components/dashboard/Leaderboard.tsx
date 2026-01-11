import { Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardEntry } from '@/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const Leaderboard = ({ entries, currentUserId }: LeaderboardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-medium">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge variant="gold">🥇 1st</Badge>;
      case 2:
        return <Badge variant="silver">🥈 2nd</Badge>;
      case 3:
        return <Badge variant="bronze">🥉 3rd</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Monthly Leaderboard</CardTitle>
            <p className="text-sm text-muted-foreground">January 2025</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry, index) => {
            const isCurrentUser = entry.user.id === currentUserId;
            return (
              <div
                key={entry.user.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-cms-purple/10 to-cms-pink/10 border border-cms-purple/20'
                    : 'hover:bg-muted/50'
                } ${entry.rank <= 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center justify-center w-10">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="h-10 w-10 border-2 border-background shadow-md">
                  <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                  <AvatarFallback className="gradient-bg text-primary-foreground text-sm">
                    {entry.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{entry.user.name}</p>
                    {isCurrentUser && <Badge variant="purple" className="text-xs">You</Badge>}
                    {getRankBadge(entry.rank)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.targetPercentage.toFixed(1)}% of target
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg gradient-text">
                    {formatCurrency(entry.totalSales)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
