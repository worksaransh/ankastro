-- =====================================================================
-- 02 — ADMIN SETUP  (APNA_EMAIL ko apne login email se replace karo)
-- Pehle Dashboard -> Authentication -> Users me wo user bana lo
-- (Auto Confirm + password), phir ye chalao.
-- =====================================================================
DELETE FROM public.user_roles WHERE role = 'admin';

INSERT INTO public.user_roles (id, user_id, role, created_at)
SELECT gen_random_uuid(), id, 'admin'::public.app_role, now()
FROM auth.users WHERE email = 'APNA_EMAIL';

INSERT INTO public.profiles (id, user_id, full_name, email, created_at, updated_at)
SELECT gen_random_uuid(), id, 'Admin', email, now(), now()
FROM auth.users WHERE email = 'APNA_EMAIL'
ON CONFLICT (user_id) DO NOTHING;

-- Verify:
-- SELECT u.email, ur.role FROM public.user_roles ur JOIN auth.users u ON u.id=ur.user_id;
