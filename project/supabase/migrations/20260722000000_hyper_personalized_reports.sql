-- =====================================================================
-- 29_hyper_personalized_reports_schema.sql — Hyper-Personalized Reports Engine Schema
-- Adds 5 new tables to support context-driven personalized content across all reports, parts, and sections.
-- Safe to re-run (idempotent).
-- =====================================================================

-- 1. Table: report_section_templates (Configurable report structure)
CREATE TABLE IF NOT EXISTS public.report_section_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_key text NOT NULL,             -- e.g. 'career_wealth', 'name_correction', 'life_path'
  part_number int NOT NULL,             -- 1, 2, 3, 4
  part_title text NOT NULL,             -- e.g. "PART 1: Core Personality & Soul Blueprint"
  section_key text NOT NULL,            -- e.g. 'work_style_matrix'
  section_title text NOT NULL,          -- e.g. "Your Dynamic Work & Financial Style"
  section_order int NOT NULL,
  required_inputs text[] DEFAULT '{}'::text[],
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT report_section_templates_unique_key UNIQUE(report_key, section_key)
);

CREATE INDEX IF NOT EXISTS idx_rst_report_key ON public.report_section_templates(report_key);

ALTER TABLE public.report_section_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rst_select_all" ON public.report_section_templates;
CREATE POLICY "rst_select_all" ON public.report_section_templates FOR SELECT USING (true);

GRANT SELECT ON public.report_section_templates TO anon, authenticated;
GRANT ALL ON public.report_section_templates TO authenticated;


-- 2. Table: personalized_content_library (Contextual interpretations matrix)
CREATE TABLE IF NOT EXISTS public.personalized_content_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number_type text NOT NULL,            -- 'mulank', 'bhagyank', 'karmic_debt', 'personal_year'
  number_val int NOT NULL,              -- 1-9, 11, 22, 13, 14, 16, 19
  life_stage text DEFAULT 'ALL',        -- 'student', 'working', 'business', 'retired', 'ALL'
  profession_category text DEFAULT 'ALL',-- 'tech', 'finance', 'creative', 'management', 'ALL'
  pillar_key text NOT NULL,             -- 'career', 'love', 'money', 'health', 'remedies'
  lang text DEFAULT 'hinglish',         -- 'en', 'hi', 'hinglish'
  headline text NOT NULL,
  detailed_analysis text NOT NULL,
  opportunities text[] DEFAULT '{}'::text[],
  warning_signals text[] DEFAULT '{}'::text[],
  actionable_tip text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pcl_lookup ON public.personalized_content_library(number_type, number_val, pillar_key, lang);

ALTER TABLE public.personalized_content_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pcl_select_all" ON public.personalized_content_library;
CREATE POLICY "pcl_select_all" ON public.personalized_content_library FOR SELECT USING (true);

GRANT SELECT ON public.personalized_content_library TO anon, authenticated;
GRANT ALL ON public.personalized_content_library TO authenticated;


-- 3. Table: user_report_sections (Generated dynamic user section content)
CREATE TABLE IF NOT EXISTS public.user_report_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_key text NOT NULL,
  part_number int NOT NULL,
  section_key text NOT NULL,
  personalized_title text NOT NULL,
  personalized_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  vibration_score int CHECK (vibration_score BETWEEN 0 AND 100),
  generated_at timestamptz DEFAULT now(),
  CONSTRAINT user_report_sections_unique UNIQUE(user_id, report_key, section_key)
);

CREATE INDEX IF NOT EXISTS idx_urs_user_report ON public.user_report_sections(user_id, report_key);

ALTER TABLE public.user_report_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "urs_select_own" ON public.user_report_sections;
CREATE POLICY "urs_select_own" ON public.user_report_sections
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "urs_insert_own" ON public.user_report_sections;
CREATE POLICY "urs_insert_own" ON public.user_report_sections
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "urs_update_own" ON public.user_report_sections;
CREATE POLICY "urs_update_own" ON public.user_report_sections
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_report_sections TO authenticated;


-- 4. Table: user_personalized_remedies (Custom user prescribed remedies)
CREATE TABLE IF NOT EXISTS public.user_personalized_remedies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  remedy_type text NOT NULL,            -- 'gemstone', 'mantra', 'color', 'yantra', 'charity', 'signature'
  remedy_title text NOT NULL,
  target_pillar text NOT NULL,          -- 'career', 'health', 'relationship', 'finance'
  prescription_reason text NOT NULL,
  instructions text NOT NULL,
  priority_level text DEFAULT 'high',   -- 'critical', 'high', 'medium'
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_upr_user ON public.user_personalized_remedies(user_id);

ALTER TABLE public.user_personalized_remedies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "upr_select_own" ON public.user_personalized_remedies;
CREATE POLICY "upr_select_own" ON public.user_personalized_remedies
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "upr_insert_own" ON public.user_personalized_remedies;
CREATE POLICY "upr_insert_own" ON public.user_personalized_remedies
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "upr_update_own" ON public.user_personalized_remedies;
CREATE POLICY "upr_update_own" ON public.user_personalized_remedies
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_personalized_remedies TO authenticated;


-- 5. Table: user_personalized_cycles (Personalized time matrix)
CREATE TABLE IF NOT EXISTS public.user_personalized_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  year int NOT NULL,
  month int,                            -- NULL for yearly summary, 1-12 for monthly
  personal_year int NOT NULL,
  personal_month int,
  key_theme text NOT NULL,
  growth_score int CHECK (growth_score BETWEEN 0 AND 100),
  aligned_goals jsonb DEFAULT '[]'::jsonb,
  favorable_days text[] DEFAULT '{}'::text[],
  caution_days text[] DEFAULT '{}'::text[],
  action_plan text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT user_personalized_cycles_unique UNIQUE(user_id, year, month)
);

CREATE INDEX IF NOT EXISTS idx_upc_user ON public.user_personalized_cycles(user_id);

ALTER TABLE public.user_personalized_cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "upc_select_own" ON public.user_personalized_cycles;
CREATE POLICY "upc_select_own" ON public.user_personalized_cycles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "upc_insert_own" ON public.user_personalized_cycles;
CREATE POLICY "upc_insert_own" ON public.user_personalized_cycles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "upc_update_own" ON public.user_personalized_cycles;
CREATE POLICY "upc_update_own" ON public.user_personalized_cycles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_personalized_cycles TO authenticated;
