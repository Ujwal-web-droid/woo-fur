import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Camera, X } from 'lucide-react';

export function AvatarUpload() {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, WebP, or GIF image.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if any
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL (add timestamp to bust cache)
      const avatarUrlWithCache = `${publicUrl}?t=${Date.now()}`;
      const { error: updateError } = await updateProfile({ avatar_url: avatarUrlWithCache });

      if (updateError) throw updateError;

      toast({
        title: 'Avatar updated',
        description: 'Your profile photo has been updated.',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id || !profile?.avatar_url) return;

    setIsUploading(true);

    try {
      // Extract file path from URL
      const urlParts = profile.avatar_url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'avatars');
      if (bucketIndex !== -1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/').split('?')[0];
        await supabase.storage.from('avatars').remove([filePath]);
      }

      // Update profile to remove avatar URL
      const { error } = await updateProfile({ avatar_url: null });

      if (error) throw error;

      toast({
        title: 'Avatar removed',
        description: 'Your profile photo has been removed.',
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: 'Failed to remove',
        description: 'Failed to remove avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={profile?.avatar_url || undefined} 
            alt={profile?.full_name || 'User'} 
          />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <LoadingSpinner size="sm" />
          </div>
        )}
        
        {!isUploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Change avatar"
          >
            <Camera className="h-6 w-6 text-foreground" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4 mr-2" />
          {profile?.avatar_url ? 'Change Photo' : 'Upload Photo'}
        </Button>
        
        {profile?.avatar_url && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={isUploading}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPEG, PNG, WebP or GIF. Max 5MB.
      </p>
    </div>
  );
}
