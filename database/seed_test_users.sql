-- Run this script in the Supabase SQL Editor to activate plans and profiles for test users

-- 1. Create profiles for test users
INSERT INTO public.profiles (email, full_name, dob, gender, profession, marital_status, completeness_score, is_business_owner, user_id)
SELECT 'freeuser@ankjyotish.app', 'Free Tier User', '1990-05-15', 'male', 'Consultant', 'single', 90, false, id
FROM auth.users
WHERE email = 'freeuser@ankjyotish.app'
ON CONFLICT (user_id) DO UPDATE
SET dob = '1990-05-15', gender = 'male', profession = 'Consultant', marital_status = 'single', completeness_score = 90, is_business_owner = false;

INSERT INTO public.profiles (email, full_name, dob, gender, profession, marital_status, completeness_score, is_business_owner, user_id)
SELECT 'plususer@ankjyotish.app', 'Plus Plan User', '1988-08-22', 'female', 'Designer', 'married', 90, false, id
FROM auth.users
WHERE email = 'plususer@ankjyotish.app'
ON CONFLICT (user_id) DO UPDATE
SET dob = '1988-08-22', gender = 'female', profession = 'Designer', marital_status = 'married', completeness_score = 90, is_business_owner = false;

INSERT INTO public.profiles (email, full_name, dob, gender, profession, marital_status, completeness_score, is_business_owner, user_id)
SELECT 'masteruser@ankjyotish.app', 'Master Plan User', '1995-10-15', 'male', 'Business Owner', 'single', 90, true, id
FROM auth.users
WHERE email = 'masteruser@ankjyotish.app'
ON CONFLICT (user_id) DO UPDATE
SET dob = '1995-10-15', gender = 'male', profession = 'Business Owner', marital_status = 'single', completeness_score = 90, is_business_owner = true;

-- 2. Activate Plus Plan for plususer@ankjyotish.app
INSERT INTO public.subscriptions (user_id, plan, status, expires_at, created_at, updated_at)
SELECT id, 'plus', 'active', now() + interval '1 year', now(), now()
FROM auth.users
WHERE email = 'plususer@ankjyotish.app'
ON CONFLICT (user_id) DO UPDATE 
SET plan = 'plus', status = 'active', expires_at = now() + interval '1 year', updated_at = now();

-- 3. Activate Master Plan for masteruser@ankjyotish.app
INSERT INTO public.payments (user_id, tier, amount, status, created_at, updated_at)
SELECT id, 'master', 999.00, 'success', now(), now()
FROM auth.users
WHERE email = 'masteruser@ankjyotish.app';

-- 4. Reload PostgREST schema cache to ensure all columns (like display_name) are recognized by the API client
NOTIFY pgrst, 'reload schema';
