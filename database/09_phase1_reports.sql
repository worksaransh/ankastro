-- =====================================================================
-- 09_phase1_reports.sql — Individual report selling (Phase 1)
-- Adds: report_requests, report_orders, leads  + syncs report_types prices
-- Supabase project: kassdsugfktqptsxzqhr   (naya project NAHI)
-- Run AFTER 05_reports_ads_branding.sql. PURA copy karke chalao.
-- All additive — kuch delete nahi hota.
-- =====================================================================

-- 1) Intake snapshot per report (so the paid PDF is reproducible) --------
CREATE TABLE IF NOT EXISTS public.report_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_key text NOT NULL,
  email text,
  input_json jsonb NOT NULL DEFAULT '{}'::jsonb,   -- all collected fields
  profile_json jsonb NOT NULL DEFAULT '{}'::jsonb, -- computed numerology
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Orders for individual reports (guest allowed; user_id optional) -----
CREATE TABLE IF NOT EXISTS public.report_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_request_id uuid REFERENCES public.report_requests(id) ON DELETE SET NULL,
  report_key text NOT NULL,
  email text,
  user_id uuid,                          -- nullable (guest checkout)
  amount int NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',  -- pending/success/failed/cancelled
  cashfree_order_id text UNIQUE NOT NULL,
  gateway_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_report_orders_cf ON public.report_orders(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_report_orders_email ON public.report_orders(email);
CREATE INDEX IF NOT EXISTS idx_report_orders_status ON public.report_orders(status);

-- 3) Leads (free snapshot captures for remarketing) ---------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  dob text,
  report_key text,
  email text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Grants ------------------------------------------------------------
-- service_role (edge functions) gets full access automatically.
GRANT SELECT, INSERT ON public.report_requests TO anon, authenticated;
GRANT SELECT, INSERT ON public.report_orders   TO anon, authenticated;
GRANT INSERT          ON public.leads           TO anon, authenticated;

-- 5) RLS ---------------------------------------------------------------
-- Edge functions use service_role and BYPASS RLS (secure writes there).
-- Public can insert (lead capture / intake) but reads are locked; the
-- success page reads order status via the verify-report-order function
-- (service role), not direct table reads.
ALTER TABLE public.report_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads           ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rr_insert ON public.report_requests;
CREATE POLICY rr_insert ON public.report_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS ro_insert ON public.report_orders;
CREATE POLICY ro_insert ON public.report_orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS lead_insert ON public.leads;
CREATE POLICY lead_insert ON public.leads FOR INSERT WITH CHECK (true);

-- admin can read everything (uses existing is_admin())
DROP POLICY IF EXISTS ro_admin_read ON public.report_orders;
CREATE POLICY ro_admin_read ON public.report_orders FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS rr_admin_read ON public.report_requests;
CREATE POLICY rr_admin_read ON public.report_requests FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS lead_admin_read ON public.leads;
CREATE POLICY lead_admin_read ON public.leads FOR SELECT USING (public.is_admin());

-- 6) Sync report_types prices to match landing pages (₹199–499) --------
UPDATE public.report_types SET price=399, original_price=999  WHERE key='name_correction';
UPDATE public.report_types SET price=199, original_price=599  WHERE key='mobile_numerology';
UPDATE public.report_types SET price=249, original_price=599  WHERE key='vehicle_numerology';
UPDATE public.report_types SET price=499, original_price=1499 WHERE key='career_numerology';
UPDATE public.report_types SET price=399, original_price=999  WHERE key='baby_name';
UPDATE public.report_types SET price=449, original_price=999  WHERE key='compatibility_report';

-- Verify:
-- SELECT key, price, original_price FROM public.report_types ORDER BY sort_order;
-- SELECT count(*) FROM public.report_orders;
