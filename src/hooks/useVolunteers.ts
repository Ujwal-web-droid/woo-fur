import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { DbVolunteer } from '@/types/database';

export const useVolunteerStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['volunteer', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as DbVolunteer | null;
    },
    enabled: !!user,
  });
};

export const useSubmitVolunteerApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: {
      skills: string[];
      availability: Record<string, boolean>;
      emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
      };
    }) => {
      if (!user) throw new Error('Must be logged in to apply as a volunteer');

      const { data, error } = await supabase
        .from('volunteers')
        .insert({
          user_id: user.id,
          skills: application.skills,
          availability: application.availability,
          emergency_contact: application.emergencyContact || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer'] });
    },
  });
};

export const useUpdateVolunteerProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      skills?: string[];
      availability?: Record<string, boolean>;
      emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
      };
    }) => {
      if (!user) throw new Error('Must be logged in');

      const updateData: Record<string, unknown> = {};
      if (updates.skills) updateData.skills = updates.skills;
      if (updates.availability) updateData.availability = updates.availability;
      if (updates.emergencyContact) updateData.emergency_contact = updates.emergencyContact;

      const { data, error } = await supabase
        .from('volunteers')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteer'] });
    },
  });
};
