import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface ImageHistory {
  id: string;
  image_key: string;
  image_url: string;
  page_slug: string | null;
  section_key: string | null;
  is_current: boolean;
  created_at: string;
  metadata: Record<string, any>;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadImage = async (
    file: File,
    imageKey: string,
    pageSlug?: string,
    sectionKey?: string
  ): Promise<string | null> => {
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${imageKey}-${Date.now()}.${fileExt}`;
      const filePath = `${pageSlug || 'general'}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(filePath);

      // Mark previous images as not current
      await supabase
        .from('image_history')
        .update({ is_current: false })
        .eq('image_key', imageKey);

      // Insert new image history record
      const { error: historyError } = await supabase
        .from('image_history')
        .insert({
          image_key: imageKey,
          image_url: publicUrl,
          page_slug: pageSlug,
          section_key: sectionKey,
          is_current: true,
          metadata: {
            original_name: file.name,
            size: file.size,
            type: file.type,
          },
        });

      if (historyError) throw historyError;

      queryClient.invalidateQueries({ queryKey: ['image-history'] });
      queryClient.invalidateQueries({ queryKey: ['current-images'] });
      
      toast({ title: 'Image uploaded successfully!' });
      return publicUrl;
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const rollbackImage = async (historyId: string): Promise<boolean> => {
    try {
      // Get the history record to rollback to
      const { data: targetImage, error: fetchError } = await supabase
        .from('image_history')
        .select('*')
        .eq('id', historyId)
        .single();

      if (fetchError || !targetImage) throw fetchError;

      // Mark all images with this key as not current
      await supabase
        .from('image_history')
        .update({ is_current: false })
        .eq('image_key', targetImage.image_key);

      // Mark the target image as current
      const { error: updateError } = await supabase
        .from('image_history')
        .update({ is_current: true })
        .eq('id', historyId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['image-history'] });
      queryClient.invalidateQueries({ queryKey: ['current-images'] });
      
      toast({ title: 'Image rolled back successfully!' });
      return true;
    } catch (error: any) {
      toast({
        title: 'Rollback failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploadImage,
    rollbackImage,
    isUploading,
  };
}

export function useImageHistory(imageKey?: string) {
  return {
    queryKey: imageKey ? ['image-history', imageKey] : ['image-history'],
    queryFn: async () => {
      let query = supabase
        .from('image_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (imageKey) {
        query = query.eq('image_key', imageKey);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ImageHistory[];
    },
  };
}

export function useCurrentImages() {
  return {
    queryKey: ['current-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('image_history')
        .select('*')
        .eq('is_current', true);
      
      if (error) throw error;
      
      // Create a map for easy lookup
      const imageMap: Record<string, string> = {};
      (data as ImageHistory[]).forEach(img => {
        imageMap[img.image_key] = img.image_url;
      });
      
      return imageMap;
    },
  };
}
