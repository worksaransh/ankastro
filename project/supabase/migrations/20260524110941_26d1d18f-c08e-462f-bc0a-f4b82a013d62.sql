
-- otp_providers
CREATE TABLE public.otp_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  priority integer NOT NULL DEFAULT 100,
  is_test boolean NOT NULL DEFAULT false,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.otp_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage otp providers" ON public.otp_providers
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER otp_providers_updated BEFORE UPDATE ON public.otp_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_otp_providers_enabled_priority ON public.otp_providers(enabled, priority);

-- otp_delivery_log
CREATE TABLE public.otp_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  provider text NOT NULL,
  status text NOT NULL,
  provider_message_id text,
  error_code text,
  error_message text,
  attempt integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.otp_delivery_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view delivery log" ON public.otp_delivery_log
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role));
CREATE INDEX idx_otp_delivery_phone_created ON public.otp_delivery_log(phone, created_at DESC);

-- otp_verifications extensions
ALTER TABLE public.otp_verifications
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'login',
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS otp_hash text;
ALTER TABLE public.otp_verifications ALTER COLUMN email DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_otp_phone_created ON public.otp_verifications(phone, created_at DESC);

-- profiles phone validation trigger (allow null updates for backfill, but require on insert)
CREATE OR REPLACE FUNCTION public.validate_profile_phone()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.phone_number IS NULL OR length(trim(NEW.phone_number)) < 6 THEN
      -- allow nulls only for legacy backfill paths via service role; for client-driven inserts, require phone
      IF current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
        RAISE EXCEPTION 'phone_number is required';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS validate_profile_phone_trg ON public.profiles;
CREATE TRIGGER validate_profile_phone_trg BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_profile_phone();
