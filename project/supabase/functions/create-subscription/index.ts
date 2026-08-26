// create-subscription — AnkJyotish Plus membership checkout.
// Reuses existing Cashfree order flow. order_id prefix "sub_" so webhook
// can activate the subscription on success. --no-verify-jwt (guest-friendly).
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAN_FALLBACK: Record<string, number> = { plus_monthly: 99, plus_quarterly: 249 };
const PLAN_DAYS: Record<string, number> = { plus_monthly: 30, plus_quarterly: 92 };

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const appId = Deno.env.get("CASHFREE_APP_ID");
    const secret = Deno.env.get("CASHFREE_SECRET_KEY");
    const isProd = (Deno.env.get("CASHFREE_PRODUCTION") || "").toLowerCase() === "true";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const svcKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, svcKey);

    const body = await req.json().catch(() => ({}));
    const { plan = "plus_monthly", email, name, phone, userId, couponCode, returnOrigin } = body || {};

    // 1. Determine base price
    let amount = PLAN_FALLBACK[plan] || 99;
    try {
      const key = plan === "plus_quarterly" ? "plus_quarterly_price" : "plus_monthly_price";
      const { data } = await sb.from("system_settings").select("value").eq("key", key).maybeSingle();
      if (data?.value && Number(data.value) > 0) amount = Number(data.value);
    } catch { /* fallback */ }

    const basePrice = amount;

    // 2. Validate Coupon if provided
    let appliedCouponId = null;
    let appliedCouponCode = null;
    let discountAmount = 0;

    if (couponCode && typeof couponCode === 'string') {
      const code = couponCode.toUpperCase().trim();
      const { data: coupon } = await sb
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .maybeSingle();

      if (coupon) {
        let isCouponValid = true;
        
        // Expiry
        if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
          isCouponValid = false;
        }
        // Usage limits
        if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
          isCouponValid = false;
        }
        // Applicable tiers / plan check
        if (Array.isArray(coupon.applicable_tiers) && coupon.applicable_tiers.length > 0) {
          if (!coupon.applicable_tiers.includes(plan)) {
            isCouponValid = false;
          }
        }

        if (isCouponValid) {
          if (coupon.discount_type === 'free') {
            amount = 0;
          } else if (coupon.discount_type === 'percentage') {
            amount = Math.max(0, Math.round(basePrice - (basePrice * Number(coupon.discount_value) / 100)));
          } else if (coupon.discount_type === 'flat') {
            amount = Math.max(0, Math.round(basePrice - Number(coupon.discount_value)));
          }
          discountAmount = basePrice - amount;
          appliedCouponId = coupon.id;
          appliedCouponCode = code;
        }
      }
    }

    const orderId = `sub_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const origin = returnOrigin || req.headers.get("origin") || "";

    // helper to record coupon redemption
    const recordRedemption = async (subId: string) => {
      if (!appliedCouponId || !userId) return;
      try {
        await sb.from('coupon_redemptions').insert({
          coupon_id: appliedCouponId,
          user_id: userId,
          discount_amount: discountAmount,
          tier: plan,
        });
        await sb.rpc('increment_coupon_usage', { coupon_id: appliedCouponId });
      } catch (err) {
        console.error("Failed to record redemption:", err);
      }
    };

    // 3. Mock mode if no Cashfree keys, free coupon, or local testing origin
    const isLocal = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
    if (!appId || !secret || amount === 0 || isLocal) {
      const days = PLAN_DAYS[plan] || 30;
      const now = new Date();
      const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      
      const { data: subData } = await sb.from("subscriptions").insert({
        user_id: userId || null,
        email: email || null,
        plan,
        amount,
        status: amount === 0 || (!appId || !secret) || isLocal ? "active" : "pending",
        cashfree_order_id: orderId,
        started_at: now.toISOString(),
        expires_at: expires.toISOString(),
      }).select("id").single();

      if (subData?.id) {
        await recordRedemption(subData.id);
      }

      return json({ 
        success: true, 
        mock: true, 
        orderId, 
        amount, 
        redirect: `${origin}/plus-success?order_id=${orderId}` 
      });
    }

    // 4. Record Pending Subscription (Cashfree flow)
    const { data: subData } = await sb.from("subscriptions").insert({
      user_id: userId || null,
      email: email || null,
      plan,
      amount,
      status: "pending",
      cashfree_order_id: orderId,
    }).select("id").single();

    if (subData?.id) {
      await recordRedemption(subData.id);
    }

    // 5. Create Cashfree order
    const baseUrl = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const returnUrl = `${origin}/plus-success?order_id=${orderId}`;

    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: userId || `guest_${Date.now()}`,
        customer_email: email || "guest@ankjyotishai.com",
        customer_phone: phone || "9999999999",
        customer_name: name || "Member",
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: `${supabaseUrl}/functions/v1/cashfree-webhook`,
      },
      order_note: `AnkJyotish Plus — ${plan}`,
    };

    const resp = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secret,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(orderPayload),
    });
    const cf = await resp.json();
    if (!resp.ok) { 
      console.error("Cashfree sub error:", cf); 
      throw new Error(cf.message || "Cashfree order failed"); 
    }

    return json({
      success: true, orderId, amount, plan,
      paymentSessionId: cf.payment_session_id,
      paymentMode: isProd ? "production" : "sandbox",
    });
  } catch (e: any) {
    console.error("create-subscription error:", e);
    return json({ success: false, error: e.message || "Failed" }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
