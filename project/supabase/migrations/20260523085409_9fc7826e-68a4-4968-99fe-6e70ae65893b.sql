
-- Extend coupons
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS applicable_tiers text[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS min_cart_value numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS first_time_user_only boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_apply boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_stacking boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS per_user_limit integer NOT NULL DEFAULT 1;

-- Coupon redemptions
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL,
  user_id uuid NOT NULL,
  payment_id uuid,
  discount_amount numeric NOT NULL DEFAULT 0,
  tier text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user ON public.coupon_redemptions(user_id, coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON public.coupon_redemptions(coupon_id);

ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own redemptions" ON public.coupon_redemptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage redemptions" ON public.coupon_redemptions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Upgrade paths (admin-configurable)
CREATE TABLE IF NOT EXISTS public.upgrade_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_tier text NOT NULL,
  to_tier text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  override_price numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(from_tier, to_tier)
);

ALTER TABLE public.upgrade_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads enabled upgrade paths" ON public.upgrade_paths
  FOR SELECT TO public USING (enabled = true);
CREATE POLICY "Admins manage upgrade paths" ON public.upgrade_paths
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER upgrade_paths_updated
  BEFORE UPDATE ON public.upgrade_paths
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extend payments for upgrade tracking
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS is_upgrade boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS upgraded_from_payment_id uuid,
  ADD COLUMN IF NOT EXISTS original_tier text;

CREATE INDEX IF NOT EXISTS idx_payments_report_status ON public.payments(report_id, status);

-- Seed default upgrade paths
INSERT INTO public.upgrade_paths (from_tier, to_tier, enabled) VALUES
  ('starter', 'pro', true),
  ('starter', 'master', true),
  ('pro', 'master', true)
ON CONFLICT (from_tier, to_tier) DO NOTHING;
