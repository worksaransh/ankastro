-- =====================================================================
-- 15_tracking_attribution.sql — Ads tracking (admin) + UTM attribution
-- system_settings me Google Ads + Search Console keys add (Meta Pixel,
-- GA4 keys pehle se hain). Table na ho to bana deta hai (idempotent).
-- + UTM columns: kaunsi ad/campaign se lead/sale aayi.
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

-- ensure table (original project me hoti hai; na ho to ban jayegi)
CREATE TABLE IF NOT EXISTS public.system_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now()
);

GRANT SELECT ON public.system_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.system_settings TO authenticated;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ss_read ON public.system_settings;
CREATE POLICY ss_read ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS ss_admin_ins ON public.system_settings;
CREATE POLICY ss_admin_ins ON public.system_settings FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS ss_admin_upd ON public.system_settings;
CREATE POLICY ss_admin_upd ON public.system_settings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- seed tracking keys (existing wale untouched)
INSERT INTO public.system_settings (key, value) VALUES
  ('meta_pixel_id', ''),
  ('ga_id', ''),
  ('google_ads_id', ''),
  ('google_ads_purchase_label', ''),
  ('gsc_verification', '')
ON CONFLICT (key) DO NOTHING;

-- attribution: kaunsi ad se aaya (utm_source/medium/campaign + gclid/fbclid)
ALTER TABLE public.report_orders ADD COLUMN IF NOT EXISTS utm jsonb;
ALTER TABLE public.leads         ADD COLUMN IF NOT EXISTS utm jsonb;

-- Verify:
-- SELECT key, value FROM public.system_settings WHERE key LIKE '%pixel%' OR key LIKE 'g%';
