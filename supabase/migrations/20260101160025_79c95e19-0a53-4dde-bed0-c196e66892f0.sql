-- =============================================
-- PHASE 6: DATABASE SCHEMA & CORE TABLES
-- =============================================

-- Create animals table
CREATE TABLE public.animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  species varchar NOT NULL,
  breed varchar,
  age integer,
  gender varchar,
  size varchar,
  personality_traits text[],
  medical_history jsonb DEFAULT '{}'::jsonb,
  therapy_certifications jsonb DEFAULT '[]'::jsonb,
  availability_status varchar DEFAULT 'available',
  arrival_date date,
  biography text,
  special_needs text,
  adoption_status varchar DEFAULT 'not_available',
  photos text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create programs table
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  type varchar NOT NULL CHECK (type IN ('rescue', 'rehabilitation', 'therapy', 'part-time-pets')),
  description text,
  goals text,
  process_steps jsonb DEFAULT '[]'::jsonb,
  requirements jsonb DEFAULT '{}'::jsonb,
  pricing jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  animal_id uuid REFERENCES public.animals(id) ON DELETE SET NULL,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  booking_type varchar NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration interval DEFAULT '1 hour'::interval,
  status varchar DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requirements text,
  contact_info jsonb DEFAULT '{}'::jsonb,
  confirmation_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create stories table
CREATE TABLE public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name varchar,
  category varchar NOT NULL,
  featured boolean DEFAULT false,
  media_urls text[] DEFAULT '{}',
  related_animal_ids uuid[] DEFAULT '{}',
  status varchar DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  likes_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create donations table
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  currency varchar DEFAULT 'USD',
  allocation jsonb DEFAULT '{"type": "general"}'::jsonb,
  recurring boolean DEFAULT false,
  recurring_frequency varchar CHECK (recurring_frequency IN ('monthly', 'quarterly', 'yearly', NULL)),
  payment_method varchar,
  transaction_id varchar UNIQUE,
  status varchar NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  donor_email varchar,
  donor_name varchar,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create volunteers table
CREATE TABLE public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  skills text[] DEFAULT '{}',
  availability jsonb DEFAULT '{}'::jsonb,
  hours_logged decimal(10,2) DEFAULT 0,
  background_check boolean DEFAULT false,
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  status varchar DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create story_likes junction table for proper like tracking
CREATE TABLE public.story_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(story_id, user_id)
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - ANIMALS (Public read, Admin write)
-- =============================================

CREATE POLICY "Anyone can view animals"
ON public.animals FOR SELECT
USING (true);

CREATE POLICY "Admins can insert animals"
ON public.animals FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update animals"
ON public.animals FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete animals"
ON public.animals FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - PROGRAMS (Public read, Admin write)
-- =============================================

CREATE POLICY "Anyone can view active programs"
ON public.programs FOR SELECT
USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert programs"
ON public.programs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update programs"
ON public.programs FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete programs"
ON public.programs FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - BOOKINGS (User owns their bookings)
-- =============================================

CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can cancel their own bookings"
ON public.bookings FOR DELETE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - STORIES (Public read published, User owns drafts)
-- =============================================

CREATE POLICY "Anyone can view published stories"
ON public.stories FOR SELECT
USING (status = 'published' OR auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can submit stories"
ON public.stories FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own stories"
ON public.stories FOR UPDATE
USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own stories"
ON public.stories FOR DELETE
USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - DONATIONS (User sees their own, Admin sees all)
-- =============================================

CREATE POLICY "Users can view their own donations"
ON public.donations FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create donations"
ON public.donations FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update donations"
ON public.donations FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - VOLUNTEERS (User owns their record)
-- =============================================

CREATE POLICY "Users can view their own volunteer record"
ON public.volunteers FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their volunteer application"
ON public.volunteers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their volunteer record"
ON public.volunteers FOR UPDATE
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - STORY LIKES
-- =============================================

CREATE POLICY "Users can view all likes"
ON public.story_likes FOR SELECT
USING (true);

CREATE POLICY "Users can like stories"
ON public.story_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike stories"
ON public.story_likes FOR DELETE
USING (auth.uid() = user_id);

-- =============================================
-- DATABASE FUNCTIONS
-- =============================================

-- Function to check animal availability for booking
CREATE OR REPLACE FUNCTION public.check_animal_availability(
  _animal_id uuid,
  _date date,
  _time time,
  _duration interval DEFAULT '1 hour'::interval
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conflict_count integer;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM public.bookings
  WHERE animal_id = _animal_id
    AND scheduled_date = _date
    AND status IN ('pending', 'confirmed')
    AND (
      (scheduled_time, scheduled_time + duration) OVERLAPS (_time, _time + _duration)
    );
  
  RETURN conflict_count = 0;
END;
$$;

-- Function to update story likes count
CREATE OR REPLACE FUNCTION public.update_story_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.stories SET likes_count = likes_count + 1 WHERE id = NEW.story_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.stories SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.story_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to get donation impact summary
CREATE OR REPLACE FUNCTION public.get_donation_impact()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_raised', COALESCE(SUM(amount), 0),
    'donor_count', COUNT(DISTINCT COALESCE(user_id::text, donor_email)),
    'monthly_recurring', COALESCE(SUM(CASE WHEN recurring AND recurring_frequency = 'monthly' THEN amount ELSE 0 END), 0)
  ) INTO result
  FROM public.donations
  WHERE status = 'completed';
  
  RETURN result;
END;
$$;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger for updating timestamps on animals
CREATE TRIGGER update_animals_updated_at
BEFORE UPDATE ON public.animals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating timestamps on bookings
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating timestamps on stories
CREATE TRIGGER update_stories_updated_at
BEFORE UPDATE ON public.stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating timestamps on volunteers
CREATE TRIGGER update_volunteers_updated_at
BEFORE UPDATE ON public.volunteers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for story likes count
CREATE TRIGGER update_story_likes_count_trigger
AFTER INSERT OR DELETE ON public.story_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_story_likes_count();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_animals_species ON public.animals(species);
CREATE INDEX idx_animals_availability ON public.animals(availability_status);
CREATE INDEX idx_animals_adoption ON public.animals(adoption_status);

CREATE INDEX idx_programs_type ON public.programs(type);
CREATE INDEX idx_programs_active ON public.programs(active);

CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_animal ON public.bookings(animal_id);
CREATE INDEX idx_bookings_date ON public.bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

CREATE INDEX idx_stories_category ON public.stories(category);
CREATE INDEX idx_stories_status ON public.stories(status);
CREATE INDEX idx_stories_featured ON public.stories(featured);
CREATE INDEX idx_stories_author ON public.stories(author_id);

CREATE INDEX idx_donations_user ON public.donations(user_id);
CREATE INDEX idx_donations_status ON public.donations(status);

CREATE INDEX idx_volunteers_user ON public.volunteers(user_id);
CREATE INDEX idx_volunteers_status ON public.volunteers(status);

-- =============================================
-- ENABLE REALTIME FOR KEY TABLES
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.animals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;