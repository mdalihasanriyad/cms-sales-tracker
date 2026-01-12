import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, getDaysInMonth, getDate } from 'date-fns';

interface DashboardStats {
  totalSales: number;
  targetProgress: number;
  monthlyTarget: number;
  salesCount: number;
  dailyRequired: number;
  daysRemaining: number;
}

export const useDashboardStats = () => {
  const { user, profile } = useAuth();
  const currentMonthYear = format(new Date(), 'yyyy-MM');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats', user?.id, currentMonthYear],
    queryFn: async (): Promise<DashboardStats> => {
      // Get user's sales for current month
      const { data: sales, error } = await supabase
        .from('sales')
        .select('amount')
        .eq('user_id', user!.id)
        .eq('month_year', currentMonthYear);

      if (error) throw error;

      const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount), 0);
      const monthlyTarget = Number(profile?.monthly_target) || 50000;
      const targetProgress = monthlyTarget > 0 ? (totalSales / monthlyTarget) * 100 : 0;

      const now = new Date();
      const daysInMonth = getDaysInMonth(now);
      const currentDay = getDate(now);
      const daysRemaining = daysInMonth - currentDay;

      const remainingAmount = Math.max(0, monthlyTarget - totalSales);
      const dailyRequired = daysRemaining > 0 ? remainingAmount / daysRemaining : 0;

      return {
        totalSales,
        targetProgress: Math.min(targetProgress, 100),
        monthlyTarget,
        salesCount: sales.length,
        dailyRequired,
        daysRemaining,
      };
    },
    enabled: !!user && !!profile,
  });

  return {
    stats: stats || {
      totalSales: 0,
      targetProgress: 0,
      monthlyTarget: 50000,
      salesCount: 0,
      dailyRequired: 0,
      daysRemaining: 0,
    },
    isLoading,
  };
};
