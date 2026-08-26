
-- 1. Payments: remove user self-update (webhook uses service role; admins covered by existing policy)
DROP POLICY IF EXISTS "System can update payments" ON public.payments;

-- 2. OTP verifications: tighten select/update to active rows only
DROP POLICY IF EXISTS "Users can view their own OTP by email" ON public.otp_verifications;
DROP POLICY IF EXISTS "Users can update their own OTP" ON public.otp_verifications;

CREATE POLICY "Read active OTPs only"
  ON public.otp_verifications FOR SELECT
  TO anon, authenticated
  USING (verified = false AND expires_at > now() AND attempts < 5);

CREATE POLICY "Update active OTPs only"
  ON public.otp_verifications FOR UPDATE
  TO anon, authenticated
  USING (verified = false AND expires_at > now() AND attempts < 5)
  WITH CHECK (expires_at > now());

-- 3. Fix mutable search_path on trigger helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- 4. Lock down internal helper: only admin role / service role should call this
REVOKE EXECUTE ON FUNCTION public.increment_coupon_usage(uuid) FROM PUBLIC, anon, authenticated;
