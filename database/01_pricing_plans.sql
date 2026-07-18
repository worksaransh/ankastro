-- =====================================================================
-- DYNAMIC PRICING — pricing_plans table (admin-editable)
-- Safe & additive. Frontend + edge function DB se padhenge,
-- fail hone par hardcoded fallback (payment kabhi nahi rukega).
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tier text NOT NULL UNIQUE,          -- glimpse | starter | addon | pro | master
  price integer NOT NULL DEFAULT 0,
  original_price integer,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed current prices (idempotent)
INSERT INTO public.pricing_plans (tier, price, original_price) VALUES
  ('glimpse', 0, NULL),
  ('starter', 299, 599),
  ('addon',   199, 499),
  ('pro',     599, 1299),
  ('master',  999, 2499)
ON CONFLICT (tier) DO NOTHING;

-- Grants + RLS (public read; only admins write)
GRANT SELECT ON public.pricing_plans TO anon, authenticated;
GRANT ALL ON public.pricing_plans TO service_role;

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pp_public_read ON public.pricing_plans;
CREATE POLICY pp_public_read ON public.pricing_plans
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS pp_admin_write ON public.pricing_plans;
CREATE POLICY pp_admin_write ON public.pricing_plans
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- Verify
-- SELECT * FROM public.pricing_plans ORDER BY price;
