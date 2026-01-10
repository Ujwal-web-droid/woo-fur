import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ImageMap {
  [key: string]: string;
}

export function useWebsiteImages() {
  const { data: images = {}, isLoading, error } = useQuery({
    queryKey: ['website-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('image_history')
        .select('image_key, image_url')
        .eq('is_current', true);
      
      if (error) throw error;
      
      const imageMap: ImageMap = {};
      data?.forEach((img: { image_key: string; image_url: string }) => {
        imageMap[img.image_key] = img.image_url;
      });
      
      return imageMap;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getImage = (key: string, fallback?: string): string => {
    return images[key] || fallback || '';
  };

  return {
    images,
    getImage,
    isLoading,
    error,
  };
}
