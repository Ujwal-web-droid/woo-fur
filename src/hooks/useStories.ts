import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { DbStory, Story } from '@/types/database';
import { format } from 'date-fns';

// Default placeholder image
const DEFAULT_STORY_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800';

// Transform database story to frontend format
const transformStory = (dbStory: DbStory): Story => {
  return {
    id: dbStory.id,
    title: dbStory.title,
    excerpt: dbStory.excerpt || dbStory.content.slice(0, 150) + '...',
    content: dbStory.content,
    author: dbStory.author_name || 'Anonymous',
    date: format(new Date(dbStory.created_at), 'yyyy-MM-dd'),
    category: dbStory.category,
    image: dbStory.media_urls?.[0] || DEFAULT_STORY_IMAGE,
    relatedAnimalIds: dbStory.related_animal_ids || [],
    likes: dbStory.likes_count,
    featured: dbStory.featured,
  };
};

export const useStories = (status: 'published' | 'all' = 'published') => {
  return useQuery({
    queryKey: ['stories', status],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (status === 'published') {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as DbStory[]).map(transformStory);
    },
  });
};

export const useStory = (id: string | undefined) => {
  return useQuery({
    queryKey: ['stories', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return transformStory(data as DbStory);
    },
    enabled: !!id,
  });
};

export const useFeaturedStories = () => {
  return useQuery({
    queryKey: ['stories', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as DbStory[]).map(transformStory);
    },
  });
};

export const useStoryLike = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const checkLike = useQuery({
    queryKey: ['story-likes', user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>();

      const { data, error } = await supabase
        .from('story_likes')
        .select('story_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return new Set(data.map(like => like.story_id));
    },
    enabled: !!user,
  });

  const toggleLike = useMutation({
    mutationFn: async (storyId: string) => {
      if (!user) throw new Error('Must be logged in to like stories');

      const { data: existing } = await supabase
        .from('story_likes')
        .select('id')
        .eq('story_id', storyId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from('story_likes')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'unliked', storyId };
      } else {
        // Like
        const { error } = await supabase
          .from('story_likes')
          .insert({ story_id: storyId, user_id: user.id });
        if (error) throw error;
        return { action: 'liked', storyId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['story-likes'] });
    },
  });

  return {
    likedStories: checkLike.data || new Set<string>(),
    toggleLike: toggleLike.mutate,
    isLoading: toggleLike.isPending,
  };
};

export const useSubmitStory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (story: {
      title: string;
      content: string;
      excerpt?: string;
      category: string;
      authorName?: string;
      mediaUrls?: string[];
      relatedAnimalIds?: string[];
    }) => {
      const { data, error } = await supabase
        .from('stories')
        .insert({
          title: story.title,
          content: story.content,
          excerpt: story.excerpt || story.content.slice(0, 150),
          category: story.category,
          author_id: user?.id || null,
          author_name: story.authorName || user?.email?.split('@')[0] || 'Anonymous',
          media_urls: story.mediaUrls || [],
          related_animal_ids: story.relatedAnimalIds || [],
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
};

export const useStoriesRealtime = () => {
  const queryClient = useQueryClient();

  const subscribeToStories = () => {
    const channel = supabase
      .channel('stories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stories' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['stories'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return { subscribeToStories };
};
