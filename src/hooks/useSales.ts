import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Sale {
  id: string;
  user_id: string;
  amount: number;
  client_name: string;
  month_year: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

interface SaleWithProfile extends Sale {
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

export const useSales = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales', user?.id, isAdmin],
    queryFn: async () => {
      // First get sales
      let salesQuery = supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        salesQuery = salesQuery.eq('user_id', user?.id);
      }

      const { data: salesData, error: salesError } = await salesQuery;

      if (salesError) throw salesError;

      // Get unique user IDs and fetch their profiles
      const userIds = [...new Set(salesData.map(s => s.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Map profiles to sales
      const profilesMap = (profilesData || []).reduce((acc, p) => {
        acc[p.id] = { full_name: p.full_name, email: p.email };
        return acc;
      }, {} as Record<string, { full_name: string | null; email: string }>);

      return salesData.map(sale => ({
        ...sale,
        profiles: profilesMap[sale.user_id],
      })) as SaleWithProfile[];
    },
    enabled: !!user,
  });

  const addSale = useMutation({
    mutationFn: async (sale: { amount: number; client_name: string; month_year: string }) => {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          user_id: user!.id,
          ...sale,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({ title: 'Sale added successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add sale', description: error.message, variant: 'destructive' });
    },
  });

  const updateSale = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sale> & { id: string }) => {
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({ title: 'Sale updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update sale', description: error.message, variant: 'destructive' });
    },
  });

  const deleteSale = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({ title: 'Sale deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete sale', description: error.message, variant: 'destructive' });
    },
  });

  return {
    sales,
    isLoading,
    addSale,
    updateSale,
    deleteSale,
  };
};
