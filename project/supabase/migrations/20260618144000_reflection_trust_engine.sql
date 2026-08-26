-- 1. Extend profiles table with completeness_score
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS completeness_score int DEFAULT 0 CHECK (completeness_score BETWEEN 0 AND 100);

-- 2. Create user_reflections table
CREATE TABLE IF NOT EXISTS public.user_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  reflection_text text NOT NULL,
  age_range text,
  time_period text,
  accuracy_rating text CHECK (accuracy_rating IN ('very_accurate', 'mostly_accurate', 'partially_accurate', 'not_accurate')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_reflection UNIQUE (user_id, age_range, time_period)
);

-- 3. Create user_feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('reflection', 'report', 'recommendation')),
  target_id uuid, -- Reference to target row UUID
  rating text NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- 4. Create daily_checkins table
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood text NOT NULL CHECK (mood IN ('great', 'good', 'neutral', 'stressed')),
  focus_area text NOT NULL CHECK (focus_area IN ('career', 'business', 'love', 'money', 'health', 'family')),
  created_at timestamptz DEFAULT now()
);

-- 5. Create adaptive_questions table
CREATE TABLE IF NOT EXISTS public.adaptive_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  category text NOT NULL CHECK (category IN ('career', 'relationships', 'finance', 'education', 'lifestyle')),
  answer_text text,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_question UNIQUE (user_id, question_text)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_reflections_user ON public.user_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user ON public.user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user ON public.daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_questions_user ON public.adaptive_questions(user_id);

-- 6. Configure Row Level Security (RLS) policies and grants
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'user_reflections', 'user_feedback', 'daily_checkins', 'adaptive_questions'
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
    EXECUTE format('CREATE POLICY %I_select ON public.%I FOR SELECT USING (auth.uid() = user_id)', t, t);
    EXECUTE format('CREATE POLICY %I_insert ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
    EXECUTE format('CREATE POLICY %I_update ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
    EXECUTE format('CREATE POLICY %I_delete ON public.%I FOR DELETE USING (auth.uid() = user_id)', t, t);
    
    -- Create admin policy
    EXECUTE format('CREATE POLICY %I_admin ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
    
    -- Grants
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
  END LOOP;
END $$;
