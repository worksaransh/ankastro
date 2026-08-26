-- =====================================================================
-- 30_ultimate_enterprise_numerology_schema.sql — Enterprise Numerology & Personal Intelligence Architecture
-- Adds 15 new enterprise tables across 6 functional layers:
-- 1. Corporate & Business Numerology
-- 2. Karmic & Soul Blueprint Systems
-- 3. Multi-Profile Network & Relationship Tree
-- 4. Daily Vibe & Transit Journal (Habit Engine)
-- 5. Lifestyle, Asset Vibrations & Vitality Profile
-- 6. Stateful AI Memory Context
-- Safe to re-run (idempotent).
-- =====================================================================

-- LAYER 1: ADVANCED BUSINESS & CORPORATE NUMEROLOGY
-- 1. business_entities
CREATE TABLE IF NOT EXISTS public.business_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  pythagorean_sum int NOT NULL,
  chaldean_sum int NOT NULL,
  registration_date date,
  industry text,
  brand_colors text[] DEFAULT '{}'::text[],
  bank_account_number text,
  bank_sum_root int,
  address_number text,
  address_sum_root int,
  overall_synergy_score int CHECK (overall_synergy_score BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_be_owner ON public.business_entities(owner_id);
ALTER TABLE public.business_entities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "be_select_own" ON public.business_entities;
CREATE POLICY "be_select_own" ON public.business_entities FOR SELECT TO authenticated USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "be_insert_own" ON public.business_entities;
CREATE POLICY "be_insert_own" ON public.business_entities FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "be_update_own" ON public.business_entities;
CREATE POLICY "be_update_own" ON public.business_entities FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_entities TO authenticated;

-- 2. business_partner_synergy
CREATE TABLE IF NOT EXISTS public.business_partner_synergy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.business_entities(id) ON DELETE CASCADE,
  partner_name text NOT NULL,
  partner_dob date NOT NULL,
  partner_mulank int NOT NULL,
  partner_bhagyank int NOT NULL,
  equity_percentage float DEFAULT 50.0,
  synergy_score int CHECK (synergy_score BETWEEN 0 AND 100),
  friction_points text[] DEFAULT '{}'::text[],
  decision_rule text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bps_biz ON public.business_partner_synergy(business_id);
ALTER TABLE public.business_partner_synergy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bps_all_own" ON public.business_partner_synergy;
CREATE POLICY "bps_all_own" ON public.business_partner_synergy FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.business_entities be WHERE be.id = business_id AND be.owner_id = auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_partner_synergy TO authenticated;

-- 3. corporate_events_scheduler
CREATE TABLE IF NOT EXISTS public.corporate_events_scheduler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.business_entities(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'launch', 'contract_signing', 'rebranding', 'hiring', 'investment'
  proposed_date date NOT NULL,
  personal_year int,
  personal_month int,
  auspiciousness_rating text DEFAULT 'neutral', -- 'highly_auspicious', 'neutral', 'unfavorable'
  recommendation_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ces_biz ON public.corporate_events_scheduler(business_id);
ALTER TABLE public.corporate_events_scheduler ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ces_all_own" ON public.corporate_events_scheduler;
CREATE POLICY "ces_all_own" ON public.corporate_events_scheduler FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.business_entities be WHERE be.id = business_id AND be.owner_id = auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.corporate_events_scheduler TO authenticated;


-- LAYER 2: DEEP KARMIC & SOUL BLUEPRINT SYSTEMS
-- 4. karmic_debt_tracker
CREATE TABLE IF NOT EXISTS public.karmic_debt_tracker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  karmic_number int NOT NULL, -- 13, 14, 16, 19
  origin_source text NOT NULL,
  life_lesson_description text NOT NULL,
  resolution_rituals text[] DEFAULT '{}'::text[],
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kdt_user ON public.karmic_debt_tracker(user_id);
ALTER TABLE public.karmic_debt_tracker ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kdt_select_own" ON public.karmic_debt_tracker;
CREATE POLICY "kdt_select_own" ON public.karmic_debt_tracker FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "kdt_write_own" ON public.karmic_debt_tracker;
CREATE POLICY "kdt_write_own" ON public.karmic_debt_tracker FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.karmic_debt_tracker TO authenticated;

-- 5. karmic_lessons_grid
CREATE TABLE IF NOT EXISTS public.karmic_lessons_grid (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  missing_numbers int[] DEFAULT '{}'::int[],
  element_imbalances text[] DEFAULT '{}'::text[],
  balancing_remedies jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT klg_user_unique UNIQUE(user_id)
);

ALTER TABLE public.karmic_lessons_grid ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "klg_all_own" ON public.karmic_lessons_grid;
CREATE POLICY "klg_all_own" ON public.karmic_lessons_grid FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.karmic_lessons_grid TO authenticated;

-- 6. pinnacles_and_challenges
CREATE TABLE IF NOT EXISTS public.pinnacles_and_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  pinnacle_phase int CHECK (pinnacle_phase BETWEEN 1 AND 4),
  start_age int NOT NULL,
  end_age int NOT NULL,
  pinnacle_number int NOT NULL,
  challenge_number int NOT NULL,
  key_theme text NOT NULL,
  growth_objective text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT pac_user_phase_unique UNIQUE(user_id, pinnacle_phase)
);

CREATE INDEX IF NOT EXISTS idx_pac_user ON public.pinnacles_and_challenges(user_id);
ALTER TABLE public.pinnacles_and_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pac_all_own" ON public.pinnacles_and_challenges;
CREATE POLICY "pac_all_own" ON public.pinnacles_and_challenges FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pinnacles_and_challenges TO authenticated;


-- LAYER 3: MULTI-PROFILE NETWORK & RELATIONSHIP TREE
-- 7. user_contacts_network
CREATE TABLE IF NOT EXISTS public.user_contacts_network (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_name text NOT NULL,
  relationship_type text NOT NULL, -- 'spouse', 'partner', 'child', 'parent', 'friend', 'colleague'
  dob date NOT NULL,
  mulank int NOT NULL,
  bhagyank int NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ucn_user ON public.user_contacts_network(user_id);
ALTER TABLE public.user_contacts_network ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ucn_all_own" ON public.user_contacts_network;
CREATE POLICY "ucn_all_own" ON public.user_contacts_network FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_contacts_network TO authenticated;

-- 8. compatibility_matrix_cache
CREATE TABLE IF NOT EXISTS public.compatibility_matrix_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.user_contacts_network(id) ON DELETE CASCADE,
  love_score int,
  work_score int,
  trust_score int,
  communication_score int,
  overall_score int,
  relationship_advice text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT cmc_user_contact_unique UNIQUE(user_id, contact_id)
);

ALTER TABLE public.compatibility_matrix_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cmc_all_own" ON public.compatibility_matrix_cache;
CREATE POLICY "cmc_all_own" ON public.compatibility_matrix_cache FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.compatibility_matrix_cache TO authenticated;

-- 9. baby_name_shortlists
CREATE TABLE IF NOT EXISTS public.baby_name_shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  baby_name text NOT NULL,
  gender text NOT NULL,
  name_root int NOT NULL,
  destiny_root int NOT NULL,
  compatibility_score int,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bns_user ON public.baby_name_shortlists(user_id);
ALTER TABLE public.baby_name_shortlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bns_all_own" ON public.baby_name_shortlists;
CREATE POLICY "bns_all_own" ON public.baby_name_shortlists FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.baby_name_shortlists TO authenticated;


-- LAYER 4: HABIT-FORMING DAILY ENGAGEMENT & TRANSITS
-- 10. daily_vibe_journal
CREATE TABLE IF NOT EXISTS public.daily_vibe_journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  daily_personal_number int NOT NULL,
  user_mood text, -- 'great', 'neutral', 'anxious', 'productive', 'low_energy'
  energy_rating int CHECK (energy_rating BETWEEN 1 AND 5),
  events_notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT dvj_user_date_unique UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_dvj_user ON public.daily_vibe_journal(user_id);
ALTER TABLE public.daily_vibe_journal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dvj_all_own" ON public.daily_vibe_journal;
CREATE POLICY "dvj_all_own" ON public.daily_vibe_journal FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_vibe_journal TO authenticated;

-- 11. transit_notifications_queue
CREATE TABLE IF NOT EXISTS public.transit_notifications_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL, -- 'daily_vibe', 'monthly_shift', 'caution_day', 'remedy_reminder'
  scheduled_for timestamptz NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  is_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tnq_user ON public.transit_notifications_queue(user_id, is_sent);
ALTER TABLE public.transit_notifications_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tnq_all_own" ON public.transit_notifications_queue;
CREATE POLICY "tnq_all_own" ON public.transit_notifications_queue FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.transit_notifications_queue TO authenticated;

-- 12. remedy_habit_tracker
CREATE TABLE IF NOT EXISTS public.remedy_habit_tracker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  remedy_id uuid REFERENCES public.user_personalized_remedies(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  completed boolean DEFAULT false,
  streak_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT rht_user_remedy_date UNIQUE(user_id, remedy_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_rht_user ON public.remedy_habit_tracker(user_id);
ALTER TABLE public.remedy_habit_tracker ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rht_all_own" ON public.remedy_habit_tracker;
CREATE POLICY "rht_all_own" ON public.remedy_habit_tracker FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.remedy_habit_tracker TO authenticated;


-- LAYER 5: LIFESTYLE, ASSETS & VITALITY PROFILE
-- 13. user_assets_vibration
CREATE TABLE IF NOT EXISTS public.user_assets_vibration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_type text NOT NULL, -- 'vehicle', 'house', 'mobile', 'bank_account', 'passport'
  asset_identifier text NOT NULL,
  calculated_root int NOT NULL,
  compatibility_verdict text NOT NULL,
  match_score int,
  suggested_remedy text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uav_user ON public.user_assets_vibration(user_id);
ALTER TABLE public.user_assets_vibration ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uav_all_own" ON public.user_assets_vibration;
CREATE POLICY "uav_all_own" ON public.user_assets_vibration FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_assets_vibration TO authenticated;

-- 14. health_vitality_profile
CREATE TABLE IF NOT EXISTS public.health_vitality_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  vulnerable_organs text[] DEFAULT '{}'::text[],
  element_deficiency text,
  ayurvedic_diet_tips text[] DEFAULT '{}'::text[],
  chakra_focus text,
  stress_relief_routine text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT hvp_user_unique UNIQUE(user_id)
);

ALTER TABLE public.health_vitality_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hvp_all_own" ON public.health_vitality_profile;
CREATE POLICY "hvp_all_own" ON public.health_vitality_profile FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.health_vitality_profile TO authenticated;


-- LAYER 6: STATEFUL AI MEMORY CONTEXT
-- 15. ai_user_memory
CREATE TABLE IF NOT EXISTS public.ai_user_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_key text NOT NULL, -- 'top_life_goal', 'relationship_struggle', 'career_ambition', 'preferred_tone'
  memory_value text NOT NULL,
  confidence_score float DEFAULT 1.0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT aum_user_key_unique UNIQUE(user_id, memory_key)
);

CREATE INDEX IF NOT EXISTS idx_aum_user ON public.ai_user_memory(user_id);
ALTER TABLE public.ai_user_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "aum_all_own" ON public.ai_user_memory;
CREATE POLICY "aum_all_own" ON public.ai_user_memory FOR ALL TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_user_memory TO authenticated;
