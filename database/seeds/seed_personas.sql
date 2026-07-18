-- Clean up existing test accounts first to allow re-running
DELETE FROM auth.users WHERE email IN (
  'aarav@student.in', 'priya@professional.in', 'rajeev@owner.in', 'amit@couple.in', 'neha@single.in',
  'ramesh@senior.in', 'sunita@homemaker.in', 'vikram@founder.in', 'meera@seeker.in', 'sanjay@premium.in'
);

-- Insert into auth.users (instance_id is '00000000-0000-0000-0000-000000000000', aud is 'authenticated', role is 'authenticated')
-- Password is 'Password123' hashed with bcrypt: '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W'
-- We'll insert and let the trigger create public.profiles. If the trigger doesn't exist, we will manually insert into public.profiles as well.

-- User 1: Aarav Patel
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000001', 'aarav@student.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000001',
  '{"full_name": "Aarav Patel", "phone_number": "+910000000001"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 2: Priya Sharma
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000002', 'priya@professional.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000002',
  '{"full_name": "Priya Sharma", "phone_number": "+910000000002"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 3: Rajeev Gupta
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000003', 'rajeev@owner.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000003',
  '{"full_name": "Rajeev Gupta", "phone_number": "+910000000003"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 4: Amit Verma
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000004', 'amit@couple.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000004',
  '{"full_name": "Amit Verma", "phone_number": "+910000000004"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 5: Neha Nair
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000005', 'neha@single.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000005',
  '{"full_name": "Neha Nair", "phone_number": "+910000000005"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 6: Ramesh Iyer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000006', 'ramesh@senior.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000006',
  '{"full_name": "Ramesh Iyer", "phone_number": "+910000000006"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 7: Sunita Devi
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000007', 'sunita@homemaker.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000007',
  '{"full_name": "Sunita Devi", "phone_number": "+910000000007"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 8: Vikram Adani
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000008', 'vikram@founder.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000008',
  '{"full_name": "Vikram Adani", "phone_number": "+910000000008"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 9: Meera Bai
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000009', 'meera@seeker.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000009',
  '{"full_name": "Meera Bai", "phone_number": "+910000000009"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- User 10: Sanjay Rao
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, phone, raw_user_meta_data, raw_app_meta_data, instance_id, aud, role)
VALUES (
  'a0000000-0000-0000-0000-000000000010', 'sanjay@premium.in',
  '$2a$10$tZ2R8vV2tU3lB07.j36nK.2wL1pM0Lp6mB92Kj1hE1d1JvO1T2z9W', now(), '+910000000010',
  '{"full_name": "Sanjay Rao", "phone_number": "+910000000010"}', '{"provider": "email", "providers": ["email"]}',
  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'
);

-- Manually insert/upsert into public.profiles to be absolutely sure they are created
INSERT INTO public.profiles (user_id, full_name, email, phone_number, dob, gender, profession, goals, marital_status, is_business_owner)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Aarav Patel', 'aarav@student.in', '+910000000001', '2005-03-12', 'male', 'B.Tech Student', '{"primary": "Career clarity"}', 'single', false),
  ('a0000000-0000-0000-0000-000000000002', 'Priya Sharma', 'priya@professional.in', '+910000000002', '1995-08-24', 'female', 'Software Engineer', '{"primary": "Promotion"}', 'single', false),
  ('a0000000-0000-0000-0000-000000000003', 'Rajeev Gupta', 'rajeev@owner.in', '+910000000003', '1980-11-05', 'male', 'Retail Trader', '{"primary": "Business growth"}', 'married', true),
  ('a0000000-0000-0000-0000-000000000004', 'Amit Verma', 'amit@couple.in', '+910000000004', '1988-09-17', 'male', 'Project Manager', '{"primary": "Marital harmony"}', 'married', false),
  ('a0000000-0000-0000-0000-000000000005', 'Neha Nair', 'neha@single.in', '+910000000005', '1992-01-30', 'female', 'HR Manager', '{"primary": "Self-discovery"}', 'single', false),
  ('a0000000-0000-0000-0000-000000000006', 'Ramesh Iyer', 'ramesh@senior.in', '+910000000006', '1960-06-21', 'male', 'Retired Banker', '{"primary": "Spiritual growth"}', 'married', false),
  ('a0000000-0000-0000-0000-000000000007', 'Sunita Devi', 'sunita@homemaker.in', '+910000000007', '1985-05-14', 'female', 'Homemaker', '{"primary": "Family peace"}', 'married', false),
  ('a0000000-0000-0000-0000-000000000008', 'Vikram Adani', 'vikram@founder.in', '+910000000008', '1998-02-09', 'male', 'Tech Founder', '{"primary": "Fundraising"}', 'single', true),
  ('a0000000-0000-0000-0000-000000000009', 'Meera Bai', 'meera@seeker.in', '+910000000009', '1975-10-03', 'female', 'Yoga Teacher', '{"primary": "Inner peace"}', 'single', false),
  ('a0000000-0000-0000-0000-000000000010', 'Sanjay Rao', 'sanjay@premium.in', '+910000000010', '1982-12-18', 'male', 'Venture Capitalist', '{"primary": "Wealth legacy"}', 'married', true)
ON CONFLICT (user_id) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone_number = EXCLUDED.phone_number,
  dob = EXCLUDED.dob,
  gender = EXCLUDED.gender,
  profession = EXCLUDED.profession,
  goals = EXCLUDED.goals,
  marital_status = EXCLUDED.marital_status,
  is_business_owner = EXCLUDED.is_business_owner;
