-- =====================================================================
-- 11_report_types_admin.sql — admin can edit report catalog
-- report_types pehle se hai (05). Ye sirf RLS/grants add karta hai taaki
-- admin price/badge/active edit kar sake, aur sab log padh saken.
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

GRANT SELECT ON public.report_types TO anon, authenticated;
GRANT UPDATE ON public.report_types TO authenticated;

ALTER TABLE public.report_types ENABLE ROW LEVEL SECURITY;

-- everyone can read (catalog/landing/buy pages)
DROP POLICY IF EXISTS rt_read ON public.report_types;
CREATE POLICY rt_read ON public.report_types FOR SELECT USING (true);

-- only admin can edit (uses existing is_admin())
DROP POLICY IF EXISTS rt_admin_update ON public.report_types;
CREATE POLICY rt_admin_update ON public.report_types
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Verify:
-- SELECT key, price, badge, active, sort_order FROM public.report_types ORDER BY sort_order;
