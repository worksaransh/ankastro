import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Tier = 'starter' | 'pro' | 'master' | 'addon';
const TIER_PRICES: Record<Tier, number> = { starter: 299, addon: 199, pro: 599, master: 999 };
const TIER_RANK: Record<Tier, number> = { starter: 1, addon: 1, pro: 2, master: 3 };

const ALLOWED_RETURN_PATHS = new Set([
  '/advanced-report', '/tools/vibration', '/dashboard', '/report',
  '/summary', '/decisions', '/calculator-test', '/payment',
]);
const DEFAULT_RETURN_PATH = '/advanced-report';

function validateReturnUrl(raw?: string): string {
  if (!raw || typeof raw !== 'string') return DEFAULT_RETURN_PATH;
  const t = raw.trim();
  if (/^https?:\/\//i.test(t) || /^\/\//i.test(t) || /^javascript:/i.test(t) || /^data:/i.test(t) || /[\r\n\x00-\x1f\x7f]/.test(t)) return DEFAULT_RETURN_PATH;
  const clean = t.split(/[?#]/)[0].replace(/\/$/, '') || t;
  return ALLOWED_RETURN_PATHS.has(clean) ? clean : DEFAULT_RETURN_PATH;
}

interface CreatePaymentRequest {
  currency: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  tier?: Tier;
  reportId?: string;
  couponCode?: string;
  upgrade?: boolean;
  returnUrl?: string;
}

// Return HTTP 200 with success:false so supabase-js doesn't swallow the
// message as a generic "non-2xx status code" error. The client checks
// `data.success === false` and surfaces `data.error` to the user.
function jsonError(error: string, code = 'ERROR', _status = 400) {
  return new Response(JSON.stringify({ success: false, error, code }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const cashfreeAppId = Deno.env.get("CASHFREE_APP_ID");
    const cashfreeSecretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    const isProduction = Deno.env.get("CASHFREE_PRODUCTION") === "true";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: CreatePaymentRequest = await req.json();
    const { currency, userId, userEmail, userName, userPhone, tier, reportId, couponCode, upgrade, returnUrl: rawReturnUrl } = body;
    const safeReturnUrl = validateReturnUrl(rawReturnUrl);
    const safeTier: Tier = (tier && TIER_PRICES[tier] !== undefined ? tier : 'pro');
    let basePrice = TIER_PRICES[safeTier];

    // Dynamic pricing: prefer pricing_plans table, fallback to hardcoded.
    try {
      const { data: pp } = await supabase
        .from('pricing_plans')
        .select('price, active')
        .eq('tier', safeTier)
        .maybeSingle();
      if (pp && pp.active !== false && pp.price != null && Number(pp.price) >= 0) {
        basePrice = Number(pp.price);
      }
    } catch (_e) { /* keep hardcoded fallback */ }

    // ---------------- Upgrade pricing ----------------
    let isUpgrade = false;
    let upgradedFromPaymentId: string | null = null;
    let originalTier: string | null = null;

    if (upgrade) {
      let query = supabase
        .from('payments')
        .select('id, tier, amount, status, report_id')
        .eq('user_id', userId)
        .in('status', ['success', 'SUCCESS', 'paid', 'PAID']);

      if (reportId) {
        query = query.eq('report_id', reportId);
      } else {
        query = query.is('report_id', null);
      }

      const { data: priorPayments } = await query.order('amount', { ascending: false });

      const best = (priorPayments || []).find(p => TIER_RANK[p.tier as Tier] < TIER_RANK[safeTier]);
      if (best) {
        // Check enabled upgrade path
        const { data: path } = await supabase
          .from('upgrade_paths')
          .select('*')
          .eq('from_tier', best.tier)
          .eq('to_tier', safeTier)
          .eq('enabled', true)
          .maybeSingle();
        if (!path) return jsonError('Upgrade not available for this tier combination', 'UPGRADE_DISABLED');

        const target = path.override_price != null ? Number(path.override_price) : TIER_PRICES[safeTier];
        basePrice = Math.max(0, Math.round(target - Number(best.amount)));
        isUpgrade = true;
        upgradedFromPaymentId = best.id;
        originalTier = best.tier;
      }
    }

    // ---------------- Coupon validation ----------------
    let amount = basePrice;
    let appliedCouponId: string | null = null;
    let appliedCouponCode: string | null = null;
    let discountAmount = 0;

    if (couponCode && typeof couponCode === 'string') {
      const code = couponCode.toUpperCase().trim();
      const { data: coupon } = await supabase
        .from('coupons').select('*').eq('code', code).eq('active', true).maybeSingle();

      if (!coupon) return jsonError('Invalid coupon code', 'COUPON_INVALID');
      if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date())
        return jsonError('Coupon has expired', 'COUPON_EXPIRED');
      if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit)
        return jsonError('Coupon usage limit reached', 'COUPON_USAGE_LIMIT');

      // Tier restriction
      if (Array.isArray(coupon.applicable_tiers) && coupon.applicable_tiers.length > 0
          && !coupon.applicable_tiers.includes(safeTier))
        return jsonError(`This coupon is not valid for the ${safeTier} package`, 'COUPON_WRONG_TIER');

      // Min cart value
      if (coupon.min_cart_value && basePrice < Number(coupon.min_cart_value))
        return jsonError(`Minimum order value ₹${coupon.min_cart_value} required`, 'COUPON_MIN_CART');

      // Per-user limit
      if (coupon.per_user_limit > 0) {
        const { count } = await supabase
          .from('coupon_redemptions')
          .select('*', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)
          .eq('user_id', userId);
        if ((count || 0) >= coupon.per_user_limit)
          return jsonError('You have already used this coupon', 'COUPON_USER_LIMIT');
      }

      // First-time-user
      if (coupon.first_time_user_only) {
        const { count } = await supabase
          .from('payments').select('*', { count: 'exact', head: true })
          .eq('user_id', userId).in('status', ['success', 'SUCCESS', 'paid', 'PAID']);
        if ((count || 0) > 0)
          return jsonError('Coupon is only for first-time customers', 'COUPON_FIRST_TIME_ONLY');
      }

      if (coupon.discount_type === 'free') amount = 0;
      else if (coupon.discount_type === 'percentage')
        amount = Math.max(0, Math.round(basePrice - (basePrice * Number(coupon.discount_value) / 100)));
      else if (coupon.discount_type === 'flat')
        amount = Math.max(0, Math.round(basePrice - Number(coupon.discount_value)));

      discountAmount = basePrice - amount;
      appliedCouponId = coupon.id;
      appliedCouponCode = code;
    }

    const recordRedemption = async (paymentId: string | null) => {
      if (!appliedCouponId) return;
      await supabase.from('coupon_redemptions').insert({
        coupon_id: appliedCouponId, user_id: userId, payment_id: paymentId,
        discount_amount: discountAmount, tier: safeTier,
      });
      await supabase.rpc('increment_coupon_usage', { coupon_id: appliedCouponId });
    };

    // ---------------- Free unlock ----------------
    if (amount === 0) {
      const freeOrderId = `FREE_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const { data: pmt, error: freeErr } = await supabase.from('payments').insert({
        user_id: userId, cashfree_order_id: freeOrderId, amount: 0,
        currency: currency || 'INR', status: 'success', tier: safeTier,
        report_id: reportId || null, coupon_code: appliedCouponCode,
        is_upgrade: isUpgrade, upgraded_from_payment_id: upgradedFromPaymentId, original_tier: originalTier,
      }).select('id').single();
      if (freeErr) throw new Error('Failed to record free unlock');
      await recordRedemption(pmt?.id ?? null);
      const freeParams = new URLSearchParams();
      freeParams.set('order_id', freeOrderId);
      if (safeReturnUrl !== DEFAULT_RETURN_PATH) freeParams.set('returnUrl', safeReturnUrl);
      const freeSuccessPath = `/payment-success?${freeParams.toString()}`;
      return new Response(JSON.stringify({
        success: true, orderId: freeOrderId, free: true, isUpgrade,
        paymentLink: freeSuccessPath,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const orderId = `ANKJ_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // ---------------- Mock (no Cashfree configured or local testing) ----------------
    const origin = req.headers.get("origin") || "";
    const isLocal = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
    if (!cashfreeAppId || !cashfreeSecretKey || isLocal) {
      const { data: pmt, error: dbError } = await supabase.from("payments").insert({
        user_id: userId, cashfree_order_id: orderId, amount,
        currency: currency || "INR", status: isLocal ? "success" : "pending",
        payment_session_id: `mock_session_${orderId}`, tier: safeTier,
        report_id: reportId || null, coupon_code: appliedCouponCode,
        is_upgrade: isUpgrade, upgraded_from_payment_id: upgradedFromPaymentId, original_tier: originalTier,
      }).select('id').single();
      if (dbError) throw new Error("Failed to create payment record");
      await recordRedemption(pmt?.id ?? null);
      const mockParams = new URLSearchParams();
      mockParams.set('order_id', orderId);
      if (safeReturnUrl !== DEFAULT_RETURN_PATH) mockParams.set('returnUrl', safeReturnUrl);
      const mockSuccessPath = `/payment-success?${mockParams.toString()}`;
      return new Response(JSON.stringify({
        success: true, orderId, paymentSessionId: `mock_session_${orderId}`,
        paymentLink: mockSuccessPath,
        message: "Mock payment created", isUpgrade, amount,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ---------------- Cashfree order ----------------
    const cashfreeBaseUrl = isProduction
      ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    const cashfreeReturnUrl = new URL(`${req.headers.get("origin") || ""}/payment-success`);
    cashfreeReturnUrl.searchParams.set('order_id', orderId);
    if (safeReturnUrl !== DEFAULT_RETURN_PATH) cashfreeReturnUrl.searchParams.set('returnUrl', safeReturnUrl);

    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency || "INR",
      customer_details: {
        customer_id: userId,
        customer_email: userEmail,
        customer_phone: userPhone || "9999999999",
        customer_name: userName || "Customer",
      },
      order_meta: {
        return_url: cashfreeReturnUrl.toString(),
        notify_url: `${supabaseUrl}/functions/v1/cashfree-webhook`,
      },
    };

    const cashfreeResponse = await fetch(`${cashfreeBaseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": cashfreeAppId,
        "x-client-secret": cashfreeSecretKey,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(orderPayload),
    });
    const cashfreeData = await cashfreeResponse.json();
    if (!cashfreeResponse.ok) {
      console.error("Cashfree error:", cashfreeData);
      throw new Error(cashfreeData.message || "Failed to create Cashfree order");
    }

    const { data: pmt } = await supabase.from("payments").insert({
      user_id: userId, cashfree_order_id: orderId, amount,
      currency: currency || "INR", status: "pending",
      payment_session_id: cashfreeData.payment_session_id,
      tier: safeTier, report_id: reportId || null, coupon_code: appliedCouponCode,
      is_upgrade: isUpgrade, upgraded_from_payment_id: upgradedFromPaymentId, original_tier: originalTier,
    }).select('id').single();

    await recordRedemption(pmt?.id ?? null);

    return new Response(JSON.stringify({
      success: true, orderId,
      paymentSessionId: cashfreeData.payment_session_id,
      paymentLink: cashfreeData.payment_link,
      paymentMode: isProduction ? "production" : "sandbox",
      isUpgrade, amount,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || "Failed to create payment" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
