-- =====================================================================
-- 31_deep_study_master_schema.sql — Master Deep Study Schema
-- Adds tables for Lo Shu Grid 8-Planes & Raj Yogas, Chaldean Compound Meanings, and Gemstone/Rudraksha Prescriptions.
-- Safe to re-run (idempotent).
-- =====================================================================

-- 1. Table: loshu_grid_planes
CREATE TABLE IF NOT EXISTS public.loshu_grid_planes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  has_mental_plane boolean DEFAULT false,    -- 4-9-2
  has_emotional_plane boolean DEFAULT false, -- 3-5-7
  has_practical_plane boolean DEFAULT false,  -- 8-1-6
  has_thought_plane boolean DEFAULT false,   -- 4-3-8
  has_will_plane boolean DEFAULT false,      -- 9-5-1
  has_action_plane boolean DEFAULT false,    -- 2-7-6
  has_golden_yog boolean DEFAULT false,      -- 4-5-6 (Raj Yog)
  has_silver_yog boolean DEFAULT false,      -- 2-5-8 (Property Yog)
  missing_remedies jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT lgp_user_unique UNIQUE(user_id)
);

ALTER TABLE public.loshu_grid_planes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lgp_all_own" ON public.loshu_grid_planes;
CREATE POLICY "lgp_all_own" ON public.loshu_grid_planes FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.loshu_grid_planes TO authenticated;


-- 2. Table: chaldean_compound_meanings
CREATE TABLE IF NOT EXISTS public.chaldean_compound_meanings (
  compound_number int PRIMARY KEY,
  symbol_name text NOT NULL,
  occult_meaning text NOT NULL,
  is_fortunate boolean DEFAULT true,
  actionable_guidance text NOT NULL
);

ALTER TABLE public.chaldean_compound_meanings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ccm_select_all" ON public.chaldean_compound_meanings;
CREATE POLICY "ccm_select_all" ON public.chaldean_compound_meanings FOR SELECT USING (true);

GRANT SELECT ON public.chaldean_compound_meanings TO anon, authenticated;
GRANT ALL ON public.chaldean_compound_meanings TO authenticated;


-- 3. Table: prescribed_gemstones_rudraksha
CREATE TABLE IF NOT EXISTS public.prescribed_gemstones_rudraksha (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  primary_gemstone text NOT NULL,
  recommended_ratti float NOT NULL,
  metal_type text NOT NULL,
  wear_finger text NOT NULL,
  wear_day_time text NOT NULL,
  rudraksha_mukhi text NOT NULL,
  yantra_direction text NOT NULL,
  beej_mantra text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT pgr_user_unique UNIQUE(user_id)
);

ALTER TABLE public.prescribed_gemstones_rudraksha ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pgr_all_own" ON public.prescribed_gemstones_rudraksha;
CREATE POLICY "pgr_all_own" ON public.prescribed_gemstones_rudraksha FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prescribed_gemstones_rudraksha TO authenticated;
