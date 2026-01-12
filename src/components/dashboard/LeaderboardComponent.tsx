import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  totalSales: number;
  monthlyTarget: number;
  targetPercentage: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

const LeaderboardComponent = ({ entries, currentUserId }: LeaderboardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">1st</Badge>;
      case 2:
        return <Badge className="bg-gray-400/10 text-gray-500 border-gray-400/20">2nd</Badge>;
      case 3:
        return <Badge className="bg-amber-600/10 text-amber-600 border-amber-600/20">3rd</Badge>;
      default:
        return null;
    }
  };

  if (entries.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Monthly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No sales data yet this month. Be the first to make a sale!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Monthly Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.slice(0, 10).map((entry) => {
          const isCurrentUser = entry.userId === currentUserId;

          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                isCurrentUser ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
              }`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatarUrl || ''} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {entry.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{entry.name}</p>
                  {isCurrentUser && <Badge variant="secondary" className="text-xs">You</Badge>}
                  {getRankBadge(entry.rank)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(entry.totalSales)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">{entry.targetPercentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">of target</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LeaderboardComponent;
