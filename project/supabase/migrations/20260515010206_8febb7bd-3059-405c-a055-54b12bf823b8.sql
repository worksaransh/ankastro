
-- Tier enum
DO $$ BEGIN
  CREATE TYPE public.report_tier AS ENUM ('glimpse', 'starter', 'pro', 'master', 'addon');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Relation enum
DO $$ BEGIN
  CREATE TYPE public.report_relation AS ENUM ('self', 'spouse', 'child', 'parent', 'sibling', 'friend', 'business', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- payments: add tier, report_id, coupon_code
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS tier public.report_tier NOT NULL DEFAULT 'pro',
  ADD COLUMN IF NOT EXISTS report_id uuid REFERENCES public.user_reports(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS coupon_code text;

CREATE INDEX IF NOT EXISTS idx_payments_report_id ON public.payments(report_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON public.payments(user_id, status);

-- user_reports: add tier_unlocked, relation, display_name, is_primary
ALTER TABLE public.user_reports
  ADD COLUMN IF NOT EXISTS tier_unlocked public.report_tier NOT NULL DEFAULT 'glimpse',
  ADD COLUMN IF NOT EXISTS relation public.report_relation NOT NULL DEFAULT 'self',
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_user_reports_user_primary ON public.user_reports(user_id, is_primary);

-- Allow users to UPDATE their own reports (needed for tier_unlocked + display_name edits)
DROP POLICY IF EXISTS "Users can update their own reports" ON public.user_reports;
CREATE POLICY "Users can update their own reports"
  ON public.user_reports FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Helper: ranked tier (higher number = more access)
CREATE OR REPLACE FUNCTION public.tier_rank(_t public.report_tier)
RETURNS integer
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE _t
    WHEN 'glimpse' THEN 0
    WHEN 'starter' THEN 1
    WHEN 'addon'   THEN 1
    WHEN 'pro'     THEN 2
    WHEN 'master'  THEN 3
  END
$$;

-- Helper: highest paid tier for a report (used by paywall + webhook)
CREATE OR REPLACE FUNCTION public.get_report_tier(_report_id uuid)
RETURNS public.report_tier
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT tier FROM public.payments
      WHERE report_id = _report_id
        AND status IN ('success','SUCCESS','paid','PAID')
      ORDER BY public.tier_rank(tier) DESC, created_at DESC
      LIMIT 1),
    'glimpse'::public.report_tier
  )
$$;
