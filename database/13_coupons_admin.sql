-- =====================================================================
-- 13_coupons_admin.sql — admin coupons create/edit fix
-- coupons table pehle se hai. Ye RLS/grants add karta hai taaki admin
-- coupon bana/edit kar sake, aur checkout active coupon padh sake.
-- Project: kassdsugfktqptsxzqhr. PURA copy karke chalao.
-- =====================================================================

GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coupons TO authenticated;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- everyone can read active coupons (checkout validation)
DROP POLICY IF EXISTS coupons_read ON public.coupons;
CREATE POLICY coupons_read ON public.coupons FOR SELECT USING (true);

-- only admin can create/edit/delete (uses existing is_admin())
DROP POLICY IF EXISTS coupons_admin_insert ON public.coupons;
CREATE POLICY coupons_admin_insert ON public.coupons FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS coupons_admin_update ON public.coupons;
CREATE POLICY coupons_admin_update ON public.coupons FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS coupons_admin_delete ON public.coupons;
CREATE POLICY coupons_admin_delete ON public.coupons FOR DELETE USING (public.is_admin());

-- Verify:
-- SELECT code, discount_type, discount_value, active FROM public.coupons;
