import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DbProgram, Program } from '@/types/database';

// Transform database program to frontend format
const transformProgram = (dbProgram: DbProgram): Program => {
  return {
    id: dbProgram.id,
    name: dbProgram.name,
    type: dbProgram.type,
    description: dbProgram.description || '',
    goals: dbProgram.goals || '',
    processSteps: dbProgram.process_steps || [],
    requirements: dbProgram.requirements || {},
    pricing: dbProgram.pricing || {},
    active: dbProgram.active,
  };
};

export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      return (data as DbProgram[]).map(transformProgram);
    },
  });
};

export const useProgram = (id: string | undefined) => {
  return useQuery({
    queryKey: ['programs', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return transformProgram(data as DbProgram);
    },
    enabled: !!id,
  });
};

export const useProgramByType = (type: 'rescue' | 'rehabilitation' | 'therapy' | 'part-time-pets' | undefined) => {
  return useQuery({
    queryKey: ['programs', 'type', type],
    queryFn: async () => {
      if (!type) return null;

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('type', type)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return transformProgram(data as DbProgram);
    },
    enabled: !!type,
  });
};
