-- =====================================================================
-- 26_unify_profiles_schema.sql — Unify User Intelligence Profile
-- Consolidates columns from user_profiles_extended into profiles table
-- Safe to re-run (idempotent)
-- =====================================================================

-- 1. Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_birth_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mulank int;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bhagyank int;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS personalization_score int DEFAULT 0 CHECK (personalization_score BETWEEN 0 AND 100);

-- 2. Migrate existing data from user_profiles_extended to profiles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles_extended') THEN
    UPDATE public.profiles p
    SET 
      full_birth_name = COALESCE(p.full_birth_name, upe.full_birth_name),
      display_name = COALESCE(p.display_name, upe.display_name),
      dob = COALESCE(p.dob, upe.dob),
      gender = COALESCE(p.gender, upe.gender),
      birth_time = COALESCE(p.birth_time, upe.birth_time::text),
      birth_place = COALESCE(p.birth_place, upe.birth_place),
      mulank = COALESCE(p.mulank, upe.mulank),
      bhagyank = COALESCE(p.bhagyank, upe.bhagyank),
      personalization_score = COALESCE(p.personalization_score, upe.personalization_score)
    FROM public.user_profiles_extended upe
    WHERE p.id = upe.user_id OR p.user_id = upe.user_id;
  END IF;
END $$;

-- 3. Ensure indexing for high-performance retrieval on profile dependencies
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_life_events_user_id ON public.user_life_events(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_id ON public.daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reflections_user_id ON public.user_reflections(user_id);

-- Note: user_profiles_extended can be left in schema to prevent any type checking breaking,
-- but all code reads/writes should direct to public.profiles.
