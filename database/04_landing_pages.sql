-- =====================================================================
-- DYNAMIC CMS — Phase 1: landing_pages + page_blocks (TABLES ONLY)
-- Seed content 06_seed_landing_pages.sql me hai. Ye sirf structure banata hai.
-- Idempotent + grants + RLS. Dollar-quoted = quote issues nahi.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.landing_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  hero_image_url text,
  meta_title text,
  meta_description text,
  tool_type text DEFAULT 'none',
  report_type_key text,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.page_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  position int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_blocks_page ON public.page_blocks(page_id, position);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON public.landing_pages(slug);

GRANT SELECT ON public.landing_pages, public.page_blocks TO anon, authenticated;
GRANT ALL ON public.landing_pages, public.page_blocks TO service_role;

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $fn$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$fn$;

DROP POLICY IF EXISTS lp_public_read ON public.landing_pages;
CREATE POLICY lp_public_read ON public.landing_pages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS lp_admin_write ON public.landing_pages;
CREATE POLICY lp_admin_write ON public.landing_pages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS pb_public_read ON public.page_blocks;
CREATE POLICY pb_public_read ON public.page_blocks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS pb_admin_write ON public.page_blocks;
CREATE POLICY pb_admin_write ON public.page_blocks FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- NOTE: Seed content ab 06_seed_landing_pages.sql me hai (6 pages).
-- Ye file sirf tables banati hai. 04 ke baad 05, phir 06 chalao.
