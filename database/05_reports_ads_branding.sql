-- =====================================================================
-- DYNAMIC CMS — Phase 3/4/5: report_types, ad_slots, branding,
-- cross-linking, CRO fields. Idempotent + grants + RLS.
-- =====================================================================

-- ---- report_types: sellable reports (cross-linkable) ----
CREATE TABLE IF NOT EXISTS public.report_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,            -- e.g. name_correction
  name text NOT NULL,
  short_desc text,
  usp text,                            -- one-line unique selling point
  price int NOT NULL DEFAULT 0,
  original_price int,
  free_glimpse boolean NOT NULL DEFAULT true,
  tool_type text DEFAULT 'none',
  slug text,                           -- landing page slug to link
  related_keys text[] DEFAULT '{}',    -- cross-linked report keys
  badge text,                          -- e.g. "Bestseller", "New"
  icon text DEFAULT 'sparkles',
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---- ad_slots: admin-editable ad/promo placements ----
CREATE TABLE IF NOT EXISTS public.ad_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_key text NOT NULL UNIQUE,       -- e.g. home_top, landing_sidebar
  enabled boolean NOT NULL DEFAULT false,
  html text,                           -- raw html/script (admin paste)
  image_url text,
  link_url text,
  label text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---- landing_pages: add CRO + branding columns (safe ALTERs) ----
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS price int;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS original_price int;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 4.8;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS reviews_count int DEFAULT 0;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS related_slugs text[] DEFAULT '{}';
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS report_key text;

-- ---- grants ----
GRANT SELECT ON public.report_types, public.ad_slots TO anon, authenticated;
GRANT ALL ON public.report_types, public.ad_slots TO service_role;

-- ---- RLS ----
ALTER TABLE public.report_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

DROP POLICY IF EXISTS rt_public_read ON public.report_types;
CREATE POLICY rt_public_read ON public.report_types FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS rt_admin_write ON public.report_types;
CREATE POLICY rt_admin_write ON public.report_types FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS ad_public_read ON public.ad_slots;
CREATE POLICY ad_public_read ON public.ad_slots FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS ad_admin_write ON public.ad_slots;
CREATE POLICY ad_admin_write ON public.ad_slots FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- =====================================================================
-- SEED — 6 report types (researched USPs + market-aligned pricing)
-- =====================================================================
INSERT INTO public.report_types (key, name, short_desc, usp, price, original_price, tool_type, slug, related_keys, badge, icon, sort_order) VALUES
('name_correction','Name Correction Report','Align your name vibration with your birth number for success','The exact spelling that turns effort into results',599,1299,'name','name-correction-report','{vehicle_numerology,mobile_numerology,career_numerology}','Bestseller','wand',1),
('mobile_numerology','Mobile Number Numerology','Check if your mobile number supports or blocks your luck','Your phone number could be quietly draining your luck',299,599,'mobile','mobile-numerology-report','{name_correction,vehicle_numerology}','Popular','smartphone',2),
('vehicle_numerology','Vehicle Number Report','Lucky, safe and harmonious vehicle number analysis','Drive a number that protects and prospers you',299,599,'vehicle','vehicle-numerology-report','{name_correction,mobile_numerology}',NULL,'car',3),
('career_numerology','Career & Job Prediction','Discover the career path your numbers were built for','Stop guessing your career — let your numbers decide',699,1499,'career','career-numerology-report','{name_correction,compatibility_report}','New','briefcase',4),
('baby_name','Lucky Baby Name Report','Auspicious, numerology-aligned names for your baby','Give your child a name that carries lifelong luck',499,999,'baby','baby-name-report','{name_correction}',NULL,'baby',5),
('compatibility_report','Love & Marriage Compatibility','Deep numerology compatibility for couples','Know before you commit — numbers reveal the truth',499,999,'none','compatibility-report','{name_correction,career_numerology}','Couples','heart',6)
ON CONFLICT (key) DO NOTHING;

-- seed ad slots (disabled by default)
INSERT INTO public.ad_slots (slot_key, label) VALUES
('home_top','Homepage Top Banner'),
('home_mid','Homepage Middle'),
('landing_top','Landing Page Top'),
('landing_bottom','Landing Page Bottom')
ON CONFLICT (slot_key) DO NOTHING;

-- Verify:
-- SELECT key, name, price FROM report_types ORDER BY sort_order;
-- SELECT slot_key, enabled FROM ad_slots;
