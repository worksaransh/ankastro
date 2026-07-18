-- =====================================================================
-- 00 — PERMISSIONS & GRANTS (run FIRST)
-- Bina iske report save / data read fail hota hai.
-- =====================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- user_reports RLS (user apni reports manage kare)
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ur_insert_own ON public.user_reports;
DROP POLICY IF EXISTS ur_select_own ON public.user_reports;
DROP POLICY IF EXISTS ur_update_own ON public.user_reports;
CREATE POLICY ur_insert_own ON public.user_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY ur_select_own ON public.user_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY ur_update_own ON public.user_reports FOR UPDATE TO authenticated USING (auth.uid() = user_id);
