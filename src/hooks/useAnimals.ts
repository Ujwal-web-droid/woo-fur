import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DbAnimal, Animal } from '@/types/database';

// Default placeholder image
const DEFAULT_ANIMAL_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800';

// Transform database animal to frontend format
const transformAnimal = (dbAnimal: DbAnimal): Animal => {
  const certifications = dbAnimal.therapy_certifications || [];
  const hasCertifications = certifications.length > 0;
  
  let status = 'Available for Adoption';
  if (hasCertifications) {
    status = 'Therapy Certified';
  } else if (dbAnimal.availability_status === 'rehabilitation') {
    status = 'In Rehabilitation';
  } else if (dbAnimal.availability_status === 'part-time') {
    status = 'Part-time Pet';
  }

  const medicalHistory = dbAnimal.medical_history || {};
  const medicalHistoryArray = Object.entries(medicalHistory).map(
    ([key, value]) => `${key}: ${value}`
  );

  return {
    id: dbAnimal.id,
    name: dbAnimal.name,
    species: dbAnimal.species,
    breed: dbAnimal.breed || 'Unknown',
    age: dbAnimal.age ? `${dbAnimal.age} year${dbAnimal.age !== 1 ? 's' : ''}` : 'Unknown',
    ageNumber: dbAnimal.age || 0,
    gender: dbAnimal.gender || 'Unknown',
    size: (dbAnimal.size?.toLowerCase() as 'small' | 'medium' | 'large') || 'medium',
    status,
    personalityTraits: dbAnimal.personality_traits || [],
    medicalHistory: medicalHistoryArray,
    specialNeeds: dbAnimal.special_needs ? [dbAnimal.special_needs] : [],
    therapyCertifications: certifications.map((cert: Record<string, unknown>) => 
      (cert.name as string) || 'Certified'
    ),
    biography: dbAnimal.biography || '',
    arrivalDate: dbAnimal.arrival_date || '',
    image: dbAnimal.photos?.[0] || DEFAULT_ANIMAL_IMAGE,
    gallery: dbAnimal.photos?.length ? dbAnimal.photos : [DEFAULT_ANIMAL_IMAGE],
    availability: {
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: true,
      Fri: true,
      Sat: false,
      Sun: false,
    },
    adoptionStatus: dbAnimal.adoption_status || 'not_available',
  };
};

export const useAnimals = () => {
  return useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('name');

      if (error) throw error;
      return (data as DbAnimal[]).map(transformAnimal);
    },
  });
};

export const useAnimal = (id: string | undefined) => {
  return useQuery({
    queryKey: ['animals', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return transformAnimal(data as DbAnimal);
    },
    enabled: !!id,
  });
};

export const useAnimalSearch = (query: string) => {
  return useQuery({
    queryKey: ['animals', 'search', query],
    queryFn: async () => {
      if (!query.trim()) {
        const { data, error } = await supabase
          .from('animals')
          .select('*')
          .order('name');

        if (error) throw error;
        return (data as DbAnimal[]).map(transformAnimal);
      }

      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .or(`name.ilike.%${query}%,species.ilike.%${query}%,breed.ilike.%${query}%`)
        .order('name');

      if (error) throw error;
      return (data as DbAnimal[]).map(transformAnimal);
    },
    enabled: true,
  });
};

export const useAnimalsRealtime = () => {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  const subscribeToAnimals = () => {
    const channel = supabase
      .channel('animals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'animals' },
        () => {
          // Invalidate and refetch animals when changes occur
          queryClient.invalidateQueries({ queryKey: ['animals'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return { subscribeToAnimals };
};
