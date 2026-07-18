-- =====================================================================
-- 23_upgrade_paths_and_vibration_expansion.sql — Upgrade Paths & Vibration Seeds
-- Additive updates to support pricing upgrade flows.
-- Safe to rerun (idempotent).
-- =====================================================================

-- 1. Create upgrade_paths table
CREATE TABLE IF NOT EXISTS public.upgrade_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_tier text NOT NULL,
  to_tier text NOT NULL,
  enabled boolean DEFAULT true,
  override_price numeric,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_upgrade_path UNIQUE (from_tier, to_tier)
);

-- 2. Configure Row Level Security (RLS) policies and grants
ALTER TABLE public.upgrade_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS upgrade_paths_read ON public.upgrade_paths;
CREATE POLICY upgrade_paths_read ON public.upgrade_paths FOR SELECT USING (true);

DROP POLICY IF EXISTS upgrade_paths_admin ON public.upgrade_paths;
CREATE POLICY upgrade_paths_admin ON public.upgrade_paths FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT SELECT ON public.upgrade_paths TO anon, authenticated;
GRANT ALL ON public.upgrade_paths TO service_role;

-- Ensure unique constraint exists even if table was created previously without it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_upgrade_path' 
          AND table_name = 'upgrade_paths'
          AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.upgrade_paths ADD CONSTRAINT unique_upgrade_path UNIQUE (from_tier, to_tier);
    END IF;
END $$;

-- 3. Seed default upgrade configurations
INSERT INTO public.upgrade_paths (from_tier, to_tier, override_price) VALUES
('starter', 'pro', 599),
('starter', 'master', 999),
('pro', 'master', 999)
ON CONFLICT ON CONSTRAINT unique_upgrade_path DO UPDATE
SET override_price = EXCLUDED.override_price, enabled = EXCLUDED.enabled;
