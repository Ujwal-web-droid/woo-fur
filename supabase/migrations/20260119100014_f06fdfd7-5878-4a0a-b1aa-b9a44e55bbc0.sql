-- Enable realtime for remaining tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.programs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.image_history;