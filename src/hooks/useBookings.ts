import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { DbBooking, Booking } from '@/types/database';
import { format } from 'date-fns';

// Transform database booking to frontend format
const transformBooking = (dbBooking: DbBooking): Booking => {
  return {
    id: dbBooking.id,
    userId: dbBooking.user_id,
    animalId: dbBooking.animal_id,
    programId: dbBooking.program_id,
    bookingType: dbBooking.booking_type,
    scheduledDate: dbBooking.scheduled_date,
    scheduledTime: dbBooking.scheduled_time,
    duration: dbBooking.duration,
    status: dbBooking.status,
    specialRequirements: dbBooking.special_requirements,
    contactInfo: dbBooking.contact_info,
    confirmationSent: dbBooking.confirmation_sent,
    createdAt: dbBooking.created_at,
  };
};

export const useUserBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return (data as unknown as DbBooking[]).map(transformBooking);
    },
    enabled: !!user,
  });
};

export const useBooking = (id: string | undefined) => {
  return useQuery({
    queryKey: ['bookings', 'single', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return transformBooking(data as unknown as DbBooking);
    },
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: {
      animalId?: string;
      programId?: string;
      bookingType: string;
      scheduledDate: Date;
      scheduledTime: string;
      specialRequirements?: string;
      contactInfo?: {
        name: string;
        email: string;
        phone: string;
      };
    }) => {
      if (!user) throw new Error('Must be logged in to create a booking');

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          animal_id: booking.animalId || null,
          program_id: booking.programId || null,
          booking_type: booking.bookingType,
          scheduled_date: format(booking.scheduledDate, 'yyyy-MM-dd'),
          scheduled_time: booking.scheduledTime,
          special_requirements: booking.specialRequirements || null,
          contact_info: booking.contactInfo || null,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
      scheduledDate?: string;
      scheduledTime?: string;
      specialRequirements?: string;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (updates.status) updateData.status = updates.status;
      if (updates.scheduledDate) updateData.scheduled_date = updates.scheduledDate;
      if (updates.scheduledTime) updateData.scheduled_time = updates.scheduledTime;
      if (updates.specialRequirements !== undefined) {
        updateData.special_requirements = updates.specialRequirements;
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useBookingsRealtime = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const subscribeToBookings = () => {
    if (!user) return () => {};

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return { subscribeToBookings };
};
