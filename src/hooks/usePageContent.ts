import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  content: Record<string, any>;
  sort_order: number;
  is_visible: boolean;
  updated_at: string;
}

export function usePageContent(pageSlug: string) {
  const queryClient = useQueryClient();

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['page-content', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('is_visible', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as PageContent[];
    },
    staleTime: 0, // No cache - always fetch fresh data
    refetchOnWindowFocus: true,
  });

  const getSection = <T = Record<string, any>>(sectionKey: string, fallback?: T): T => {
    const section = content?.find(c => c.section_key === sectionKey);
    return (section?.content as T) ?? fallback ?? ({} as T);
  };

  const getSectionList = <T = Record<string, any>>(sectionKey: string): T[] => {
    const section = content?.find(c => c.section_key === sectionKey);
    if (Array.isArray(section?.content)) {
      return section.content as T[];
    }
    return [];
  };

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['page-content', pageSlug] });
  };

  return {
    content,
    isLoading,
    error,
    getSection,
    getSectionList,
    refetch,
  };
}

// Hook to fetch all page content for admin
export function useAllPageContent() {
  return useQuery({
    queryKey: ['admin-page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_slug')
        .order('sort_order');
      
      if (error) throw error;
      return data as PageContent[];
    },
  });
}
