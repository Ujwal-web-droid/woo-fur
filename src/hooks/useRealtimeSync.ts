import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to subscribe to realtime database changes and auto-refresh queries
 * This ensures admin changes instantly reflect on the public site
 */
export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('[Realtime] Setting up realtime subscriptions...');

    // Subscribe to page_content changes
    const pageContentChannel = supabase
      .channel('page_content_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_content' },
        (payload) => {
          console.log('[Realtime] Page content changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['page-content'] });
          queryClient.invalidateQueries({ queryKey: ['admin-page-content'] });
        }
      )
      .subscribe();

    // Subscribe to animals changes
    const animalsChannel = supabase
      .channel('animals_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'animals' },
        (payload) => {
          console.log('[Realtime] Animals changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['animals'] });
          queryClient.invalidateQueries({ queryKey: ['admin-animals'] });
        }
      )
      .subscribe();

    // Subscribe to programs changes
    const programsChannel = supabase
      .channel('programs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs' },
        (payload) => {
          console.log('[Realtime] Programs changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['programs'] });
          queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
        }
      )
      .subscribe();

    // Subscribe to stories changes
    const storiesChannel = supabase
      .channel('stories_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stories' },
        (payload) => {
          console.log('[Realtime] Stories changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['stories'] });
          queryClient.invalidateQueries({ queryKey: ['featured-stories'] });
          queryClient.invalidateQueries({ queryKey: ['admin-stories'] });
        }
      )
      .subscribe();

    // Subscribe to image_history changes
    const imageHistoryChannel = supabase
      .channel('image_history_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'image_history' },
        (payload) => {
          console.log('[Realtime] Image history changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['website-images'] });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      console.log('[Realtime] Cleaning up subscriptions...');
      supabase.removeChannel(pageContentChannel);
      supabase.removeChannel(animalsChannel);
      supabase.removeChannel(programsChannel);
      supabase.removeChannel(storiesChannel);
      supabase.removeChannel(imageHistoryChannel);
    };
  }, [queryClient]);
}
