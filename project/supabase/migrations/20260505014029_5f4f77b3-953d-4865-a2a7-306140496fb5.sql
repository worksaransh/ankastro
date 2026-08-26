
-- Feature flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can read feature flags" ON public.feature_flags FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage feature flags" ON public.feature_flags FOR ALL TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin settings (KV)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Admins manage admin settings" ON public.admin_settings FOR ALL TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Analytics events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  user_id UUID,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins view analytics events" ON public.analytics_events FOR SELECT TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Content blocks (multilingual)
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(key, lang)
);
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can read content blocks" ON public.content_blocks FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage content blocks" ON public.content_blocks FOR ALL TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  text TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Anyone can read active testimonials" ON public.testimonials FOR SELECT USING (active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Additive columns on user_reports
ALTER TABLE public.user_reports
  ADD COLUMN IF NOT EXISTS life_path INT,
  ADD COLUMN IF NOT EXISTS mulank INT,
  ADD COLUMN IF NOT EXISTS bhagyank INT,
  ADD COLUMN IF NOT EXISTS name_number INT,
  ADD COLUMN IF NOT EXISTS risk_score INT,
  ADD COLUMN IF NOT EXISTS language TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT;

-- Additive columns on payments
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS gateway_status TEXT;

-- Seed default feature flags (off by default)
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('advanced_numerology', false, 'Compute name/soul urge/personality/destiny numbers'),
  ('phone_numerology', false, 'Compute numerology from phone number'),
  ('advanced_report_mode', false, 'Enable 30% preview + locked advanced report'),
  ('analytics_logging', true, 'Log analytics events to analytics_events table')
ON CONFLICT (key) DO NOTHING;

-- Seed admin settings placeholders (values managed via admin UI; secrets remain in edge function env)
INSERT INTO public.admin_settings (key, value) VALUES
  ('cashfree_mode', 'TEST'),
  ('payment_amount_inr', '499')
ON CONFLICT (key) DO NOTHING;
