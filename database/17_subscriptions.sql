-- =====================================================================
-- 17_subscriptions.sql — AnkJyotish Plus membership (recurring revenue)
-- Monthly membership ₹99/₹149. Existing payment flow reuse karta hai.
-- ADDITIVE — kuch delete nahi. Project: kassdsugfktqptsxzqhr.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid,                   -- nullable (guest bhi le sake)
  email              text,
  plan               text NOT NULL,          -- 'plus_monthly' / 'plus_quarterly'
  amount             numeric NOT NULL,
  status             text NOT NULL DEFAULT 'pending',  -- pending/active/expired/cancelled
  cashfree_order_id  text UNIQUE,
  started_at         timestamptz,
  expires_at         timestamptz,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sub_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_email ON public.subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_sub_order ON public.subscriptions(cashfree_order_id);

GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO anon, authenticated;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- user apni subscription dekh sake; admin sab
DROP POLICY IF EXISTS sub_read ON public.subscriptions;
CREATE POLICY sub_read ON public.subscriptions FOR SELECT USING (
  auth.uid() = user_id OR public.is_admin() OR user_id IS NULL
);
-- insert (checkout) — koi bhi apni bana sake
DROP POLICY IF EXISTS sub_insert ON public.subscriptions;
CREATE POLICY sub_insert ON public.subscriptions FOR INSERT WITH CHECK (true);
-- update — admin ya service role (webhook). User apni cancel kar sake.
DROP POLICY IF EXISTS sub_update ON public.subscriptions;
CREATE POLICY sub_update ON public.subscriptions FOR UPDATE USING (
  auth.uid() = user_id OR public.is_admin()
) WITH CHECK (true);

-- plan prices admin-editable (system_settings me — 15 SQL me table bani)
INSERT INTO public.system_settings (key, value) VALUES
  ('plus_monthly_price', '99'),
  ('plus_quarterly_price', '249')
ON CONFLICT (key) DO NOTHING;

-- Verify:
-- SELECT * FROM public.subscriptions ORDER BY created_at DESC LIMIT 5;
