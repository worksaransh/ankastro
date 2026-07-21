-- =====================================================================
-- 28_psychology_and_goals.sql — User Psychological Profiling & Goal Tracking
-- Additive update to support psychological baseline and structured user goals.
-- Safe to rerun (idempotent).
-- =====================================================================

-- 1. Table A: user_psychology
CREATE TABLE IF NOT EXISTS public.user_psychology (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  personality_type text,       -- e.g. "The Visionary Leader"
  leadership_style text,       -- e.g. "Authoritative & Independent"
  communication_style text,    -- e.g. "Direct, Expressive"
  decision_style text,         -- e.g. "Intuitive & Strategic"
  risk_level int CHECK (risk_level BETWEEN 1 AND 10),
  motivation_drivers text[],
  stress_triggers text[],
  calculated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_psychology ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "psychology select own" ON public.user_psychology;
CREATE POLICY "psychology select own" ON public.user_psychology 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "psychology insert own" ON public.user_psychology;
CREATE POLICY "psychology insert own" ON public.user_psychology 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "psychology update own" ON public.user_psychology;
CREATE POLICY "psychology update own" ON public.user_psychology 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_psychology TO authenticated;

-- 2. Table B: user_goals
CREATE TABLE IF NOT EXISTS public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_category text NOT NULL, -- e.g. 'career', 'finance', 'relationship', 'health'
  title text NOT NULL,
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  aligned_favorable_month text, -- e.g. "October (Personal Month 1)"
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_goals_user ON public.user_goals(user_id);

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "goals select own" ON public.user_goals;
CREATE POLICY "goals select own" ON public.user_goals 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals insert own" ON public.user_goals;
CREATE POLICY "goals insert own" ON public.user_goals 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals update own" ON public.user_goals;
CREATE POLICY "goals update own" ON public.user_goals 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals delete own" ON public.user_goals;
CREATE POLICY "goals delete own" ON public.user_goals 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_goals TO authenticated;

-- 3. Extend profiles with intelligence fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_birth_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mulank int;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bhagyank int;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dob date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_time text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_place text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS life_stage text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pain_points text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS income_range text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_business_owner boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS personalization_score int DEFAULT 0;
