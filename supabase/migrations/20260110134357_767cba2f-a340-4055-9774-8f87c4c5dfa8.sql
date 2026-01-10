-- Create storage bucket for website images
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-images', 'website-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for website-images bucket
CREATE POLICY "Anyone can view website images"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-images');

CREATE POLICY "Admins can upload website images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'website-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update website images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'website-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete website images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'website-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create image_history table for rollback capability
CREATE TABLE public.image_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_key VARCHAR NOT NULL,
  image_url TEXT NOT NULL,
  page_slug VARCHAR,
  section_key VARCHAR,
  replaced_by UUID REFERENCES public.image_history(id),
  is_current BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on image_history
ALTER TABLE public.image_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for image_history
CREATE POLICY "Anyone can view image history"
ON public.image_history FOR SELECT
USING (true);

CREATE POLICY "Admins can insert image history"
ON public.image_history FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update image history"
ON public.image_history FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_image_history_key ON public.image_history(image_key);
CREATE INDEX idx_image_history_current ON public.image_history(is_current) WHERE is_current = true;