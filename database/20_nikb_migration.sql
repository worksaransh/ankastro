-- =====================================================================
-- 20_nikb_migration.sql — AnkJyotish AI Database Extensions
-- Additive updates to enrich profiles and introduce NIKB support tables.
-- Safe to rerun (idempotent).
-- =====================================================================

-- 1. Extend profiles table with profiling columns
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
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_business_owner boolean DEFAULT false;

-- 2. Create user_psychology table
CREATE TABLE IF NOT EXISTS public.user_psychology (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  personality_type text,
  leadership_style text,
  communication_style text,
  decision_style text,
  risk_level int CHECK (risk_level BETWEEN 1 AND 10),
  motivation_drivers text[],
  stress_triggers text[],
  calculated_at timestamptz DEFAULT now()
);

-- 3. Create user_life_events table
CREATE TABLE IF NOT EXISTS public.user_life_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_date date NOT NULL,
  notes text,
  numerology_year int,
  created_at timestamptz DEFAULT now()
);

-- 4. Create user_goals table
CREATE TABLE IF NOT EXISTS public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  category text NOT NULL, -- career/business/relationship/financial/spiritual/health
  goal_text text NOT NULL,
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  progress_notes text,
  ai_recommendations jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Create recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_key text NOT NULL,
  reason text NOT NULL,
  score float DEFAULT 0.0 CHECK (score BETWEEN 0.0 AND 1.0),
  shown_at timestamptz,
  clicked_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 6. Create ai_chat_history table
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  numerology_context jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_session ON public.ai_chat_history(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_life_events_user ON public.user_life_events(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.user_goals(user_id);

-- 7. Configure Row Level Security (RLS) policies and grants
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'user_psychology', 'user_life_events', 'user_goals', 'recommendations', 'ai_chat_history'
  ] LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    
    -- Drop old policies if they exist
    EXECUTE format('DROP POLICY IF EXISTS %I_select ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_insert ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_update ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_delete ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS %I_admin ON public.%I', t, t);
    
    -- Create policies for owner access (based on user_id)
    IF t = 'user_psychology' THEN
      EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT USING (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_update ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
    ELSE
      EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT USING (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_update ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
      EXECUTE format('CREATE POLICY %I_delete ON public.%I FOR DELETE USING (auth.uid() = user_id)', t, t);
    END IF;
    
    -- Create admin policy
    EXECUTE format('CREATE POLICY %I_admin ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
    
    -- Grants
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
  END LOOP;
END $$;
