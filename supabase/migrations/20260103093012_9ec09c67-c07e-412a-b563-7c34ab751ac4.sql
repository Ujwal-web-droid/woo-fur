-- =============================================
-- ADMIN PANEL TABLES
-- =============================================

-- Site Configuration (key-value settings)
CREATE TABLE public.site_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  category VARCHAR NOT NULL DEFAULT 'general',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feature Flags
CREATE TABLE public.feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Page Content (dynamic content blocks)
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug VARCHAR NOT NULL,
  section_key VARCHAR NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- Audit Log
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_config
CREATE POLICY "Anyone can view site_config"
  ON public.site_config FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site_config"
  ON public.site_config FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for feature_flags
CREATE POLICY "Anyone can view feature_flags"
  ON public.feature_flags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage feature_flags"
  ON public.feature_flags FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for page_content
CREATE POLICY "Anyone can view visible page_content"
  ON public.page_content FOR SELECT
  USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage page_content"
  ON public.page_content FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for audit_log
CREATE POLICY "Admins can view audit_log"
  ON public.audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit_log"
  ON public.audit_log FOR INSERT
  WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log changes
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, old_value, new_value)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Audit triggers for key tables
CREATE TRIGGER audit_site_config
  AFTER INSERT OR UPDATE OR DELETE ON public.site_config
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_feature_flags
  AFTER INSERT OR UPDATE OR DELETE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_page_content
  AFTER INSERT OR UPDATE OR DELETE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_animals
  AFTER INSERT OR UPDATE OR DELETE ON public.animals
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_programs
  AFTER INSERT OR UPDATE OR DELETE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Insert default site configuration
INSERT INTO public.site_config (key, value, category, description) VALUES
  ('site_name', '"Woo-Fur"', 'general', 'Website name'),
  ('site_tagline', '"Healing Animals, Healing Hearts"', 'general', 'Website tagline'),
  ('contact_email', '"contact@woofur.org"', 'contact', 'Primary contact email'),
  ('contact_phone', '"(555) 123-4567"', 'contact', 'Primary contact phone'),
  ('payment_enabled', 'true', 'payments', 'Enable payment processing'),
  ('booking_enabled', 'true', 'bookings', 'Enable booking system'),
  ('donation_goal', '50000', 'donations', 'Annual donation goal'),
  ('max_booking_days_ahead', '30', 'bookings', 'Maximum days ahead for bookings'),
  ('notification_email_enabled', 'true', 'notifications', 'Enable email notifications'),
  ('notification_push_enabled', 'true', 'notifications', 'Enable push notifications');

-- Insert default feature flags
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('show_adoption_program', true, 'Show adoption program section'),
  ('show_therapy_program', true, 'Show therapy program section'),
  ('show_volunteer_portal', true, 'Show volunteer portal'),
  ('show_donation_form', true, 'Show donation form'),
  ('show_story_submission', true, 'Allow story submissions'),
  ('show_booking_system', true, 'Show booking system'),
  ('show_live_chat', false, 'Show live chat widget'),
  ('maintenance_mode', false, 'Enable maintenance mode'),
  ('show_newsletter_signup', true, 'Show newsletter signup form'),
  ('enable_part_time_pets', true, 'Enable part-time pets program');