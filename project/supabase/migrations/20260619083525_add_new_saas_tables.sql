-- =====================================================================
-- 24_new_saas_tables.sql — Advanced SaaS Schema Extensions
-- Additive updates to support Baby Names, AI chat memory, Extended Profiles,
-- Life Milestones, Ratings & Reviews, Daily Guidance, and Referral Program.
-- Safe to rerun (idempotent).
-- =====================================================================

-- 1. Table A: baby_names
CREATE TABLE IF NOT EXISTS public.baby_names (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('boy', 'girl', 'unisex')),
  first_letter text NOT NULL,
  name_root int NOT NULL,            -- Chaldean reduced root 1-9
  ruling_planet text,
  meaning text,
  origin text DEFAULT 'Indian',
  language text DEFAULT 'hi',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_baby_root ON public.baby_names(name_root);
CREATE INDEX IF NOT EXISTS idx_baby_gender ON public.baby_names(gender);
CREATE INDEX IF NOT EXISTS idx_baby_letter ON public.baby_names(first_letter);

ALTER TABLE public.baby_names ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "baby_names read" ON public.baby_names;
CREATE POLICY "baby_names read" ON public.baby_names FOR SELECT USING (true);
GRANT SELECT ON public.baby_names TO anon, authenticated;


-- 2. Table B: ai_chat_history
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  numerology_context jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_user_session ON public.ai_chat_history(user_id, session_id);

ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "chat read own" ON public.ai_chat_history;
CREATE POLICY "chat read own" ON public.ai_chat_history FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "chat insert own" ON public.ai_chat_history;
CREATE POLICY "chat insert own" ON public.ai_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
GRANT SELECT, INSERT ON public.ai_chat_history TO authenticated;
GRANT INSERT ON public.ai_chat_history TO anon;


-- 3. Table C: user_profiles_extended
CREATE TABLE IF NOT EXISTS public.user_profiles_extended (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_birth_name text,
  display_name text,
  dob date,
  gender text,
  birth_time time,
  birth_place text,
  goals text[],
  mulank int,
  bhagyank int,
  personalization_score int DEFAULT 0 CHECK (personalization_score BETWEEN 0 AND 100),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_profiles_extended ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profile own" ON public.user_profiles_extended;
CREATE POLICY "profile own" ON public.user_profiles_extended FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles_extended TO authenticated;


-- 4. Table D: life_milestones
CREATE TABLE IF NOT EXISTS public.life_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_date date,
  notes text,
  confirmed boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_milestone_user ON public.life_milestones(user_id);

ALTER TABLE public.life_milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "milestone own" ON public.life_milestones;
CREATE POLICY "milestone own" ON public.life_milestones FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.life_milestones TO authenticated;


-- 5. Table E: report_reviews
CREATE TABLE IF NOT EXISTS public.report_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  report_key text NOT NULL,
  order_id uuid REFERENCES public.report_orders(id) ON DELETE SET NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_report_key ON public.report_reviews(report_key);

ALTER TABLE public.report_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "review read approved" ON public.report_reviews;
CREATE POLICY "review read approved" ON public.report_reviews FOR SELECT USING (approved = true);
DROP POLICY IF EXISTS "review insert own" ON public.report_reviews;
CREATE POLICY "review insert own" ON public.report_reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
GRANT SELECT ON public.report_reviews TO anon, authenticated;
GRANT INSERT ON public.report_reviews TO authenticated;
GRANT INSERT ON public.report_reviews TO anon;


-- 6. Table F: daily_guidance
CREATE TABLE IF NOT EXISTS public.daily_guidance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mulank int NOT NULL CHECK (mulank BETWEEN 1 AND 9),
  day_of_year int CHECK (day_of_year BETWEEN 1 AND 366),
  lucky_number int,
  lucky_color text,
  guidance_en text,
  guidance_hi text,
  guidance_hinglish text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_mulank_day UNIQUE (mulank, day_of_year)
);

CREATE INDEX IF NOT EXISTS idx_daily_mulank ON public.daily_guidance(mulank);

ALTER TABLE public.daily_guidance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "daily read" ON public.daily_guidance;
CREATE POLICY "daily read" ON public.daily_guidance FOR SELECT USING (true);
GRANT SELECT ON public.daily_guidance TO anon, authenticated;


-- 7. Table G: referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code text UNIQUE NOT NULL,
  referred_email text,
  referred_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reward_status text DEFAULT 'pending' CHECK (reward_status IN ('pending', 'successful', 'claimed')),
  reward_amount int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ref_code ON public.referrals(referral_code);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref read own" ON public.referrals;
CREATE POLICY "ref read own" ON public.referrals FOR SELECT USING (auth.uid() = referrer_user_id);
GRANT SELECT, INSERT ON public.referrals TO authenticated;
