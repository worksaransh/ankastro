
-- Grant admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('5326b4ce-5c83-4f82-a5c3-f656542b6dd3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create increment coupon usage function
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(coupon_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$;
