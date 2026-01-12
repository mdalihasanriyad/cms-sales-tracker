import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  monthly_target: number;
  is_active: boolean;
  created_at: string;
  role: AppRole;
  total_sales: number;
}

export const useTeam = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all roles (admin can see all)
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get sales totals for each user
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('user_id, amount');

      if (salesError) throw salesError;

      // Calculate total sales per user
      const salesByUser = salesData.reduce((acc, sale) => {
        acc[sale.user_id] = (acc[sale.user_id] || 0) + Number(sale.amount);
        return acc;
      }, {} as Record<string, number>);

      // Merge data
      const members: TeamMember[] = profiles.map((profile) => {
        const userRole = roles.find((r) => r.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          monthly_target: Number(profile.monthly_target),
          is_active: profile.is_active ?? true,
          created_at: profile.created_at ?? '',
          role: userRole?.role || 'user',
          total_sales: salesByUser[profile.id] || 0,
        };
      });

      return members;
    },
    enabled: isAdmin,
  });

  const updateMemberRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      // First delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({ title: 'Role updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update role', description: error.message, variant: 'destructive' });
    },
  });

  const updateMemberTarget = useMutation({
    mutationFn: async ({ userId, monthlyTarget }: { userId: string; monthlyTarget: number }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ monthly_target: monthlyTarget })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({ title: 'Target updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update target', description: error.message, variant: 'destructive' });
    },
  });

  const updateMemberStatus = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update status', description: error.message, variant: 'destructive' });
    },
  });

  return {
    teamMembers,
    isLoading,
    updateMemberRole,
    updateMemberTarget,
    updateMemberStatus,
  };
};
