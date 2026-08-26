
-- ============================================
-- 1. USER ROLES (Admin access)
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can read their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS: only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 2. NUMEROLOGY CONTENT TABLES (DB-driven content)
-- ============================================

-- Core number meanings (Life Path, Destiny, Soul Urge, etc.)
CREATE TABLE public.number_meanings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL,
  category text NOT NULL DEFAULT 'life_path',
  language text NOT NULL DEFAULT 'en',
  title text NOT NULL,
  purpose text NOT NULL,
  strengths text[] NOT NULL DEFAULT '{}',
  challenges text[] NOT NULL DEFAULT '{}',
  careers text[] NOT NULL DEFAULT '{}',
  relationships text,
  health text,
  spiritual text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(number, category, language)
);

ALTER TABLE public.number_meanings ENABLE ROW LEVEL SECURITY;

-- Public read, admin write
CREATE POLICY "Anyone can read number meanings"
ON public.number_meanings FOR SELECT USING (true);

CREATE POLICY "Admins can manage number meanings"
ON public.number_meanings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Vedic Mulank/Bhagyank meanings
CREATE TABLE public.vedic_meanings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL,
  type text NOT NULL DEFAULT 'mulank',
  language text NOT NULL DEFAULT 'en',
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(number, type, language)
);

ALTER TABLE public.vedic_meanings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vedic meanings"
ON public.vedic_meanings FOR SELECT USING (true);

CREATE POLICY "Admins can manage vedic meanings"
ON public.vedic_meanings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Compatibility matrix
CREATE TABLE public.compatibility_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number1 integer NOT NULL,
  number2 integer NOT NULL,
  score integer NOT NULL DEFAULT 70,
  language text NOT NULL DEFAULT 'en',
  strength text,
  challenges text,
  detailed_analysis text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(number1, number2, language)
);

ALTER TABLE public.compatibility_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read compatibility data"
ON public.compatibility_data FOR SELECT USING (true);

CREATE POLICY "Admins can manage compatibility data"
ON public.compatibility_data FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Affirmations
CREATE TABLE public.affirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer,
  language text NOT NULL DEFAULT 'en',
  text text NOT NULL,
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read affirmations"
ON public.affirmations FOR SELECT USING (true);

CREATE POLICY "Admins can manage affirmations"
ON public.affirmations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Lucky attributes
CREATE TABLE public.lucky_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL,
  language text NOT NULL DEFAULT 'en',
  lucky_numbers integer[] DEFAULT '{}',
  lucky_days text[] DEFAULT '{}',
  lucky_colors text[] DEFAULT '{}',
  lucky_directions text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(number, language)
);

ALTER TABLE public.lucky_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lucky attributes"
ON public.lucky_attributes FOR SELECT USING (true);

CREATE POLICY "Admins can manage lucky attributes"
ON public.lucky_attributes FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_number_meanings_updated_at BEFORE UPDATE ON public.number_meanings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vedic_meanings_updated_at BEFORE UPDATE ON public.vedic_meanings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compatibility_data_updated_at BEFORE UPDATE ON public.compatibility_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lucky_attributes_updated_at BEFORE UPDATE ON public.lucky_attributes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
