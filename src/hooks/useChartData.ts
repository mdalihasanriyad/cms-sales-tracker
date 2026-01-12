import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';

export const useChartData = () => {
  const { user, isAdmin } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['chartData', user?.id, isAdmin],
    queryFn: async () => {
      // Get sales for the last 30 days
      const endDate = new Date();
      const startDate = subDays(endDate, 30);

      let query = supabase
        .from('sales')
        .select('amount, created_at, user_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (!isAdmin) {
        query = query.eq('user_id', user?.id);
      }

      const { data: sales, error } = await query;

      if (error) throw error;

      // Generate daily data
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      const dailyData = days.map((day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const daySales = sales.filter((sale) => 
          format(parseISO(sale.created_at), 'yyyy-MM-dd') === dayStr
        );
        const total = daySales.reduce((sum, sale) => sum + Number(sale.amount), 0);
        
        return {
          day: format(day, 'MMM dd'),
          sales: total,
        };
      });

      // Generate monthly data (last 6 months)
      const monthlyData: { month: string; sales: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = format(date, 'yyyy-MM');
        
        let monthQuery = supabase
          .from('sales')
          .select('amount')
          .eq('month_year', monthYear);

        if (!isAdmin) {
          monthQuery = monthQuery.eq('user_id', user?.id);
        }

        const { data: monthSales } = await monthQuery;
        const total = (monthSales || []).reduce((sum, sale) => sum + Number(sale.amount), 0);
        
        monthlyData.push({
          month: format(date, 'MMM'),
          sales: total,
        });
      }

      return {
        daily: dailyData.slice(-7), // Last 7 days for display
        monthly: monthlyData,
      };
    },
    enabled: !!user,
  });

  return {
    chartData: data || { daily: [], monthly: [] },
    isLoading,
  };
};
