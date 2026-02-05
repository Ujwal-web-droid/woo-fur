-- Fix story_likes public exposure by restricting SELECT to own likes only
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all likes" ON public.story_likes;

-- Create new policy that only allows users to see their own likes
CREATE POLICY "Users can view their own likes"
ON public.story_likes
FOR SELECT
USING (auth.uid() = user_id);

-- Allow admins to view all likes for moderation purposes
CREATE POLICY "Admins can view all likes"
ON public.story_likes
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));