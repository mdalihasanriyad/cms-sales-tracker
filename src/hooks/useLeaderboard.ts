import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

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

export const useLeaderboard = () => {
  const { user } = useAuth();
  const currentMonthYear = format(new Date(), 'yyyy-MM');

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', currentMonthYear],
    queryFn: async () => {
      // Get all active profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true);

      if (profilesError) throw profilesError;

      // Get current month sales
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('user_id, amount')
        .eq('month_year', currentMonthYear);

      if (salesError) throw salesError;

      // Calculate totals per user
      const salesByUser = sales.reduce((acc, sale) => {
        acc[sale.user_id] = (acc[sale.user_id] || 0) + Number(sale.amount);
        return acc;
      }, {} as Record<string, number>);

      // Build leaderboard
      const entries: LeaderboardEntry[] = profiles
        .map((profile) => {
          const totalSales = salesByUser[profile.id] || 0;
          const monthlyTarget = Number(profile.monthly_target) || 50000;
          const targetPercentage = monthlyTarget > 0 ? (totalSales / monthlyTarget) * 100 : 0;

          return {
            rank: 0,
            userId: profile.id,
            name: profile.full_name || profile.email.split('@')[0],
            email: profile.email,
            avatarUrl: profile.avatar_url,
            totalSales,
            monthlyTarget,
            targetPercentage,
          };
        })
        .sort((a, b) => b.totalSales - a.totalSales)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

      return entries;
    },
    enabled: !!user,
  });

  return { leaderboard, isLoading };
};
