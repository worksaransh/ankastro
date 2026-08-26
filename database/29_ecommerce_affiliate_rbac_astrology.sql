-- =====================================================================
-- 29_ecommerce_affiliate_rbac_astrology.sql
-- AnkJyotish AI — Commerce, Affiliate, Multi-Role RBAC, Astrology & AI Systems
-- =====================================================================

-- 1. EXTENDED ROLES & RBAC
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ank_app_role') THEN
    CREATE TYPE public.ank_app_role AS ENUM (
      'super_admin',
      'admin',
      'astrology_admin',
      'numerology_admin',
      'ai_admin',
      'content_admin',
      'ecommerce_admin',
      'affiliate_admin',
      'marketing_admin',
      'support_admin',
      'analytics_admin',
      'editor',
      'user'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed predefined roles
INSERT INTO public.roles (name, display_name, description, permissions) VALUES
  ('super_admin', 'Super Administrator', 'Full platform access to all modules and configurations', '["*"]'::jsonb),
  ('admin', 'General Administrator', 'Operational management of users, reports, orders, and content', '["users.read","users.write","reports.manage","orders.manage","content.manage"]'::jsonb),
  ('astrology_admin', 'Astrology Administrator', 'Manage astrology engines, planetary formulas, dashas, and interpretation rules', '["astrology.manage","rules.astrology"]'::jsonb),
  ('numerology_admin', 'Numerology Administrator', 'Manage NIKB tables, Mulank/Bhagyank rules, compound numbers, and matrix', '["numerology.manage","nikb.manage"]'::jsonb),
  ('ai_admin', 'AI Administrator', 'Manage AI prompts, model configurations, token quotas, and audit logs', '["ai.manage","prompts.manage","logs.ai"]'::jsonb),
  ('content_admin', 'Content & CMS Admin', 'Manage blogs, static pages, FAQs, testimonials, and SEO metadata', '["content.manage","blog.manage","seo.manage"]'::jsonb),
  ('ecommerce_admin', 'E-Commerce Admin', 'Manage T-Shirts, apparel catalog, inventory, variants, coupons, and orders', '["products.manage","inventory.manage","orders.manage"]'::jsonb),
  ('affiliate_admin', 'Affiliate Admin', 'Manage affiliate networks, merchant links, tracking pixels, and commissions', '["affiliate.manage","commissions.manage"]'::jsonb),
  ('marketing_admin', 'Marketing Admin', 'Manage campaigns, UTM tracking, landing pages, and promotional banners', '["marketing.manage","campaigns.manage"]'::jsonb),
  ('support_admin', 'Customer Support Admin', 'Manage support tickets, refunds, customer queries, and report delivery issues', '["support.manage","refunds.manage"]'::jsonb),
  ('analytics_admin', 'Analytics Admin', 'View real-time event logs, conversion funnels, revenue attribution, and cohort metrics', '["analytics.view","reports.metrics"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. D2C E-COMMERCE & PERSONALIZED T-SHIRTS
CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
  ('Mulank T-Shirts', 'mulank-t-shirts', 'Personalized graphic t-shirts infused with your Mulank number vibrations', 1),
  ('Zodiac & Planetary Apparel', 'zodiac-apparel', 'Luxury cotton apparel featuring minimalist Vedic zodiac & planetary glyphs', 2),
  ('Remedy Yantras & Gemstones', 'remedy-gemstones', 'Astrological yantras, sacred gemstones, and cosmic energized remedies', 3),
  ('Spiritual Merchandise', 'spiritual-merch', 'Energy crystals, sacred geometry journals, and cosmic affirmation accessories', 4)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.product_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  short_description text,
  base_price numeric(10, 2) NOT NULL DEFAULT 0,
  compare_price numeric(10, 2),
  is_personalized boolean DEFAULT false,
  personalization_type text, -- 'mulank', 'zodiac', 'bhagyank', 'custom_name'
  associated_number integer, -- 1-9
  associated_zodiac text, -- 'Aries', 'Taurus', etc.
  images text[] DEFAULT '{}'::text[],
  featured_image text,
  tags text[] DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text NOT NULL UNIQUE,
  title text NOT NULL, -- e.g. "Matte Black / L"
  size text,           -- 'S', 'M', 'L', 'XL', 'XXL'
  color text,          -- 'Matte Black', 'Cosmic Ivory', 'Royal Navy'
  color_hex text,      -- '#0a0a0c', '#f8f8f6', '#1a2035'
  price numeric(10, 2) NOT NULL,
  compare_price numeric(10, 2),
  stock_quantity integer NOT NULL DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  billing_address jsonb DEFAULT '{}'::jsonb,
  subtotal numeric(10, 2) NOT NULL,
  discount numeric(10, 2) DEFAULT 0,
  coupon_code text,
  shipping_fee numeric(10, 2) DEFAULT 0,
  total_amount numeric(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  payment_status text NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  fulfillment_status text NOT NULL DEFAULT 'unfulfilled', -- unfulfilled, processing, shipped, delivered, cancelled
  payment_gateway text DEFAULT 'cashfree',
  payment_id text,
  tracking_number text,
  courier_partner text,
  personalization_details jsonb DEFAULT '{}'::jsonb,
  utm_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ecommerce_order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.ecommerce_orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  variant_title text,
  sku text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10, 2) NOT NULL,
  total_price numeric(10, 2) NOT NULL,
  customization jsonb DEFAULT '{}'::jsonb, -- e.g. {"printed_name": "SARANSH", "mulank": 1}
  created_at timestamptz DEFAULT now()
);

-- Seed Starter Mulank 1-9 T-Shirts
DO $$
DECLARE
  cat_id uuid;
  p_id uuid;
  i int;
  titles text[] := ARRAY[
    'The Sovereign Pioneer (Mulank 1)',
    'The Intuitive Diplomat (Mulank 2)',
    'The Creative Visionary (Mulank 3)',
    'The Master Builder (Mulank 4)',
    'The Dynamic Alchemist (Mulank 5)',
    'The Harmonious Guardian (Mulank 6)',
    'The Mystic Philosopher (Mulank 7)',
    'The Sovereign Strategist (Mulank 8)',
    'The Universal Humanitarian (Mulank 9)'
  ];
  meanings text[] := ARRAY[
    'Solar leadership glyph with 24K gold foil aesthetic. For natural-born leaders who illuminate paths.',
    'Lunar diplomacy emblem with pearl-silver geometric art. For empathic visionaries and harmonizers.',
    'Jupiter creative vortex symbol. For expressive artists, communicators, and dynamic thought leaders.',
    'Rahu earth-foundation geometric matrix. For disciplined architects of wealth and timeless structures.',
    'Mercury quicksilver talisman. For free-spirited adventurers, communicators, and innovators.',
    'Venusian sacred harmony crest. For aesthetic creators, healers, and relationship architects.',
    'Ketu spiritual third-eye portal. For deep truth seekers, researchers, and mystics.',
    'Saturnian infinity wealth seal. For long-term empire builders and karmic masters of execution.',
    'Mars warrior-monk insignia. For compassionate protectors, visionaries, and world transformers.'
  ];
BEGIN
  SELECT id INTO cat_id FROM public.product_categories WHERE slug = 'mulank-t-shirts' LIMIT 1;
  IF cat_id IS NOT NULL THEN
    FOR i IN 1..9 LOOP
      INSERT INTO public.products (
        category_id, name, slug, description, short_description, base_price, compare_price,
        is_personalized, personalization_type, associated_number, images, featured_image, tags, is_featured
      ) VALUES (
        cat_id,
        titles[i],
        'mulank-' || i || '-luxury-tshirt',
        meanings[i] || ' Crafted from 240 GSM heavy combed luxury cotton, pre-shrunk with gold metallic accents.',
        'Luxury Mulank ' || i || ' Graphic T-Shirt in Matte Black & Gold Foil',
        999.00,
        1999.00,
        true,
        'mulank',
        i,
        ARRAY['/images/tshirts/mulank_' || i || '_front.webp', '/images/tshirts/mulank_' || i || '_back.webp'],
        '/images/tshirts/mulank_' || i || '_front.webp',
        ARRAY['tshirt', 'mulank-' || i, 'luxury', 'astrology-merch'],
        true
      )
      ON CONFLICT (slug) DO UPDATE SET base_price = 999.00
      RETURNING id INTO p_id;

      -- Add variants for sizes
      INSERT INTO public.product_variants (product_id, sku, title, size, color, color_hex, price, compare_price, stock_quantity)
      VALUES
        (p_id, 'TSHIRT-M' || i || '-BLK-S', 'Matte Black / S', 'S', 'Matte Black', '#0a0a0c', 999.00, 1999.00, 50),
        (p_id, 'TSHIRT-M' || i || '-BLK-M', 'Matte Black / M', 'M', 'Matte Black', '#0a0a0c', 999.00, 1999.00, 50),
        (p_id, 'TSHIRT-M' || i || '-BLK-L', 'Matte Black / L', 'L', 'Matte Black', '#0a0a0c', 999.00, 1999.00, 50),
        (p_id, 'TSHIRT-M' || i || '-BLK-XL', 'Matte Black / XL', 'XL', 'Matte Black', '#0a0a0c', 999.00, 1999.00, 50),
        (p_id, 'TSHIRT-M' || i || '-BLK-XXL', 'Matte Black / XXL', 'XXL', 'Matte Black', '#0a0a0c', 999.00, 1999.00, 30)
      ON CONFLICT (sku) DO NOTHING;
    END LOOP;
  END IF;
END$$;

-- 3. COMPLETE AFFILIATE ENGINE
CREATE TABLE IF NOT EXISTS public.affiliate_networks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  website text,
  api_key text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.affiliate_networks (name, slug, website) VALUES
  ('Amazon Associates', 'amazon-associates', 'https://affiliate-program.amazon.in'),
  ('AstroSage Partners', 'astrosage-partners', 'https://astrosage.com'),
  ('GemPundit Certified Affiliates', 'gempundit-affiliate', 'https://gempundit.com'),
  ('Internal Creator Network', 'ankjyotish-creator', 'https://ankjyotishai.com')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.affiliate_merchants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  network_id uuid REFERENCES public.affiliate_networks(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  contact_email text,
  commission_rate numeric(5, 2) DEFAULT 10.00, -- e.g. 10.00%
  cookie_duration_days integer DEFAULT 30,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.affiliate_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id uuid REFERENCES public.affiliate_merchants(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL, -- 'gemstones', 'rudraksha', 'yantras', 'books', 'consultations'
  description text,
  target_url text NOT NULL,
  base_affiliate_link text NOT NULL,
  price numeric(10, 2),
  commission_amount numeric(10, 2),
  currency text DEFAULT 'INR',
  associated_planets text[] DEFAULT '{}'::text[],
  associated_numbers integer[] DEFAULT '{}'::integer[],
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_product_id uuid REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  referrer_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_address text,
  user_agent text,
  clicked_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.affiliate_conversions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  click_id uuid REFERENCES public.affiliate_clicks(id) ON DELETE SET NULL,
  affiliate_product_id uuid REFERENCES public.affiliate_products(id) ON DELETE SET NULL,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  transaction_id text,
  sale_amount numeric(10, 2) NOT NULL,
  commission_earned numeric(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending', -- pending, approved, paid, rejected
  converted_at timestamptz DEFAULT now()
);

-- 4. ASTROLOGY SYSTEMS & CONFIGURATION
CREATE TABLE IF NOT EXISTS public.astrology_systems (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE, -- 'vedic', 'western', 'kp', 'jaimini'
  display_name text NOT NULL,
  ayanamsa text NOT NULL DEFAULT 'lahiri', -- 'lahiri', 'raman', 'kp', 'tropical'
  house_system text NOT NULL DEFAULT 'equal', -- 'equal', 'placidus', 'shripati'
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.astrology_systems (name, display_name, ayanamsa, house_system, is_active, is_default) VALUES
  ('vedic', 'Vedic Astrology (Parashara System)', 'lahiri', 'equal', true, true),
  ('kp', 'KP Astrology (Krishnamurti Paddhati)', 'kp', 'placidus', true, false),
  ('western', 'Western Tropical Astrology', 'tropical', 'placidus', true, false)
ON CONFLICT (name) DO NOTHING;

-- 5. AI PROMPT REGISTRY & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.ai_prompt_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_key text NOT NULL UNIQUE, -- 'astrology_interpretation', 'numerology_synthesis', 'chat_assistant', 'remedy_recommendation'
  title text NOT NULL,
  system_prompt text NOT NULL,
  user_prompt_template text NOT NULL,
  model_provider text NOT NULL DEFAULT 'groq', -- 'groq', 'gemini', 'openai', 'anthropic'
  model_name text NOT NULL DEFAULT 'llama-3.3-70b-versatile',
  temperature numeric(3, 2) DEFAULT 0.4,
  max_tokens integer DEFAULT 2048,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.ai_prompt_templates (prompt_key, title, system_prompt, user_prompt_template, model_provider, model_name, temperature) VALUES
(
  'chat_assistant',
  'AnkJyotish AI Conversational Guide',
  'You are AnkJyotish AI, an elite, consultant-grade Astrological & Numerological Intelligence Companion. You ground all explanations in verified birth parameters (Mulank, Bhagyank, Loshu Grid, planetary placements). NEVER hallucinate raw numbers. Offer warm, editorial, actionable wisdom.',
  'User Profile: {{profile_context}}\n\nUser Question: {{user_message}}\n\nProvide an insightful, personalized response:',
  'groq',
  'llama-3.3-70b-versatile',
  0.5
),
(
  'report_synthesis',
  'Universal Report Synthesizer',
  'You are the AnkJyotish AI Master Report Synthesizer. Ground all insights strictly on the verified mathematical calculation output and NIKB knowledge base matrix. Write with editorial luxury, clarity, and constructive life strategy.',
  'Calculated Core: {{calculation_json}}\n\nReport Pillar: {{pillar_name}}\n\nSynthesize personalized, high-precision guidance:',
  'groq',
  'llama-3.3-70b-versatile',
  0.3
)
ON CONFLICT (prompt_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  prompt_key text,
  model_name text NOT NULL,
  input_tokens integer DEFAULT 0,
  output_tokens integer DEFAULT 0,
  total_tokens integer DEFAULT 0,
  latency_ms integer DEFAULT 0,
  status text NOT NULL DEFAULT 'success',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS and grants
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
