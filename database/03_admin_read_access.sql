-- =====================================================================
-- 03 — ADMIN READ ACCESS (admin sabka data dekh sake)
-- Bina iske admin panel me customer list khaali dikhta hai.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

DROP POLICY IF EXISTS admin_read_all_profiles ON public.profiles;
CREATE POLICY admin_read_all_profiles ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_read_all_payments ON public.payments;
CREATE POLICY admin_read_all_payments ON public.payments
  FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS admin_read_all_reports ON public.user_reports;
CREATE POLICY admin_read_all_reports ON public.user_reports
  FOR SELECT TO authenticated USING (public.is_admin() OR auth.uid() = user_id);
