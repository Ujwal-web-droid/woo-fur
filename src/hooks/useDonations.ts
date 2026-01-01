import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { DbDonation } from '@/types/database';

export interface DonationImpact {
  total_raised: number;
  donor_count: number;
  monthly_recurring: number;
}

export const useDonationImpact = () => {
  return useQuery({
    queryKey: ['donation-impact'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_donation_impact');

      if (error) throw error;
      return data as unknown as DonationImpact;
    },
  });
};

export const useUserDonations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['donations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DbDonation[];
    },
    enabled: !!user,
  });
};

export const useCreateDonation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (donation: {
      amount: number;
      allocation?: { type: string; id?: string };
      recurring?: boolean;
      recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
      paymentMethod?: string;
      transactionId?: string;
      donorEmail?: string;
      donorName?: string;
    }) => {
      const { data, error } = await supabase
        .from('donations')
        .insert({
          user_id: user?.id || null,
          amount: donation.amount,
          allocation: donation.allocation || { type: 'general' },
          recurring: donation.recurring || false,
          recurring_frequency: donation.recurringFrequency || null,
          payment_method: donation.paymentMethod || null,
          transaction_id: donation.transactionId || null,
          donor_email: donation.donorEmail || user?.email || null,
          donor_name: donation.donorName || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donation-impact'] });
    },
  });
};

export const useDonationsRealtime = () => {
  const queryClient = useQueryClient();

  const subscribeToDonations = () => {
    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donations' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['donation-impact'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return { subscribeToDonations };
};
