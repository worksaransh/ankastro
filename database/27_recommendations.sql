-- =====================================================================
-- 27_recommendations.sql — User Recommendation Engine Tracking Table
-- Additive update to track dismissal and clicks of dashboard recommendations.
-- Safe to rerun (idempotent).
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_key text NOT NULL,
  reason text NOT NULL,
  score float DEFAULT 0.5,
  clicked_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.recommendations(user_id);

-- Enable RLS
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Select policy
DROP POLICY IF EXISTS "recommendations select own" ON public.recommendations;
CREATE POLICY "recommendations select own" ON public.recommendations 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Insert policy
DROP POLICY IF EXISTS "recommendations insert own" ON public.recommendations;
CREATE POLICY "recommendations insert own" ON public.recommendations 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Update policy
DROP POLICY IF EXISTS "recommendations update own" ON public.recommendations;
CREATE POLICY "recommendations update own" ON public.recommendations 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.recommendations TO authenticated;
