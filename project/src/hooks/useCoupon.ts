import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CouponResult {
  valid: boolean;
  discount_type?: string;
  discount_value?: number;
  finalPrice?: number;
  message: string;
  couponId?: string;
}

export const useCoupon = (basePrice: number) => {
  const [couponCode, setCouponCode] = useState('');
  const [result, setResult] = useState<CouponResult | null>(null);
  const [checking, setChecking] = useState(false);

  const validateCoupon = async (code: string) => {
    if (!code.trim()) { setResult(null); return; }
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .eq('active', true)
        .single();

      if (error || !data) {
        setResult({ valid: false, message: 'Invalid coupon code' });
        return;
      }

      // Check expiry
      if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        setResult({ valid: false, message: 'Coupon has expired' });
        return;
      }

      // Check usage limit
      if (data.usage_limit > 0 && data.used_count >= data.usage_limit) {
        setResult({ valid: false, message: 'Coupon usage limit reached' });
        return;
      }

      let finalPrice = basePrice;
      if (data.discount_type === 'free') {
        finalPrice = 0;
      } else if (data.discount_type === 'percentage') {
        finalPrice = Math.max(0, basePrice - (basePrice * data.discount_value / 100));
      } else if (data.discount_type === 'flat') {
        finalPrice = Math.max(0, basePrice - data.discount_value);
      }

      const roundedFinalPrice = Math.round(finalPrice);
      setResult({
        valid: true,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        finalPrice: roundedFinalPrice,
        message: roundedFinalPrice === 0 ? '🎉 Free report unlocked!' : `₹${Math.round(basePrice - finalPrice)} off applied!`,
        couponId: data.id,
      });
    } catch {
      setResult({ valid: false, message: 'Error validating coupon' });
    } finally {
      setChecking(false);
    }
  };

  const applyCoupon = () => validateCoupon(couponCode);

  // Wrap setter so editing/clearing the input clears any previously-applied result.
  // Prevents stale "free unlocked" state from persisting after the user changes the field.
  const updateCouponCode = (next: string) => {
    setCouponCode(next);
    if (result) setResult(null);
  };

  return { couponCode, setCouponCode: updateCouponCode, result, checking, applyCoupon };
};
