import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useImageUpload, useImageHistory } from '@/hooks/useImageUpload';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Upload, History, RotateCcw, Image as ImageIcon, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageUploaderProps {
  imageKey: string;
  currentUrl?: string;
  pageSlug?: string;
  sectionKey?: string;
  label?: string;
  onImageChange?: (url: string) => void;
  aspectRatio?: string;
}

export function ImageUploader({
  imageKey,
  currentUrl,
  pageSlug,
  sectionKey,
  label,
  onImageChange,
  aspectRatio = '16/9',
}: ImageUploaderProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, rollbackImage, isUploading } = useImageUpload();

  const historyQuery = useImageHistory(imageKey);
  const { data: history, isLoading: historyLoading } = useQuery(historyQuery);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    const url = await uploadImage(file, imageKey, pageSlug, sectionKey);
    if (url && onImageChange) {
      onImageChange(url);
    }
    setPreviewUrl(null);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRollback = async (historyId: string) => {
    const historyItem = history?.find(h => h.id === historyId);
    if (!historyItem) return;

    const success = await rollbackImage(historyId);
    if (success && onImageChange) {
      onImageChange(historyItem.image_url);
    }
    setIsHistoryOpen(false);
  };

  const displayUrl = previewUrl || currentUrl;

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="relative bg-muted flex items-center justify-center overflow-hidden"
            style={{ aspectRatio }}
          >
            {displayUrl ? (
              <img
                src={displayUrl}
                alt={label || imageKey}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
                <span className="text-sm">No image set</span>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          {currentUrl ? 'Replace' : 'Upload'}
        </Button>

        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <History className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Image History - {label || imageKey}</DialogTitle>
            </DialogHeader>
            
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : history && history.length > 0 ? (
              <ScrollArea className="max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4 p-1">
                  {history.map((item) => (
                    <Card 
                      key={item.id}
                      className={`overflow-hidden ${item.is_current ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={item.image_url}
                          alt={`Version from ${item.created_at}`}
                          className="w-full h-full object-cover"
                        />
                        {item.is_current && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Current
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground mb-2">
                          {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                        {!item.is_current && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRollback(item.id)}
                            className="w-full"
                          >
                            <RotateCcw className="h-3 w-3 mr-2" />
                            Restore
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No image history available</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
