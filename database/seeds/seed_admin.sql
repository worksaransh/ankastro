DELETE FROM auth.users WHERE email = 'qa_admin@ankjyotishai.com';
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000099', 'qa_admin@ankjyotishai.com',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(),
  '{"full_name": "QA Admin"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

INSERT INTO public.profiles (user_id, full_name, email)
VALUES ('a0000000-0000-0000-0000-000000000099', 'QA Admin', 'qa_admin@ankjyotishai.com')
ON CONFLICT (user_id) DO NOTHING;

DELETE FROM public.user_roles WHERE user_id = 'a0000000-0000-0000-0000-000000000099';
INSERT INTO public.user_roles (user_id, role)
VALUES ('a0000000-0000-0000-0000-000000000099', 'admin');
