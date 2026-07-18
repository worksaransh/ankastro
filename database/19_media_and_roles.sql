-- =====================================================================
-- 19_media_and_roles.sql
-- (A) Public "media" storage bucket — admin se report/homepage images upload
-- (B) OPTIONAL: super_admin + editor roles (future team access)
-- ADDITIVE. Run AFTER existing files. Project: kassdsugfktqptsxzqhr.
-- =====================================================================

-- =====================================================================
-- (A) MEDIA STORAGE BUCKET (public read, admin write)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- public read
DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- authenticated upload (admin panel)
DROP POLICY IF EXISTS "media auth upload" ON storage.objects;
CREATE POLICY "media auth upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

-- authenticated update/delete
DROP POLICY IF EXISTS "media auth update" ON storage.objects;
CREATE POLICY "media auth update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media auth delete" ON storage.objects;
CREATE POLICY "media auth delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');

-- Also ensure blog-images bucket exists (used by BlogManager)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "blog public read" ON storage.objects;
CREATE POLICY "blog public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');
DROP POLICY IF EXISTS "blog auth upload" ON storage.objects;
CREATE POLICY "blog auth upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-images');


-- =====================================================================
-- (B) OPTIONAL: SUPER_ADMIN + EDITOR ROLES
-- Skip this section agar aap solo ho. Sirf tab chalao jab VA/staff
-- ko limited access dena ho.
--
-- app_role enum me naye values add karte hain (additive — purane safe).
-- =====================================================================

-- add enum values if not exist (safe — IF NOT EXISTS guards)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE 'super_admin';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'editor'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE public.app_role ADD VALUE 'editor';
  END IF;
END $$;

-- is_admin() ko update karo: super_admin bhi admin counts
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$;

-- is_super_admin() — sabse high level (user role manage kar sake)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- is_editor() — content edit kar sake (blog, reports), par payments/users nahi
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'editor')
  );
$$;

-- =====================================================================
-- APNE AAP KO super_admin banao (APNA_EMAIL replace karo):
-- =====================================================================
-- INSERT INTO public.user_roles (id, user_id, role, created_at)
-- SELECT gen_random_uuid(), id, 'super_admin'::public.app_role, now()
-- FROM auth.users WHERE email = 'APNA_EMAIL'
-- ON CONFLICT DO NOTHING;

-- VA/staff ko editor banao:
-- INSERT INTO public.user_roles (id, user_id, role, created_at)
-- SELECT gen_random_uuid(), id, 'editor'::public.app_role, now()
-- FROM auth.users WHERE email = 'STAFF_EMAIL'
-- ON CONFLICT DO NOTHING;

-- =====================================================================
-- VERIFY:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid =
--   (SELECT oid FROM pg_type WHERE typname='app_role');
-- (expect: admin, super_admin, editor — aur jo pehle the)
-- =====================================================================
