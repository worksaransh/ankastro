import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const cashfreeAppId = Deno.env.get("CASHFREE_APP_ID");
    const cashfreeSecretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    const isProduction = Deno.env.get("CASHFREE_PRODUCTION") === "true";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const {
      reportKey, inputJson, profileJson, utm,
      email, name, phone, userId, returnOrigin, couponCode,
    } = body || {};

    if (!reportKey) {
      return new Response(JSON.stringify({ success: false, error: "reportKey required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Server-side price (never trust client) ----------------------------
    const { data: rt, error: rtErr } = await supabase
      .from("report_types")
      .select("key, name, price")
      .eq("key", reportKey)
      .maybeSingle();
    if (rtErr || !rt) {
      return new Response(JSON.stringify({ success: false, error: "Unknown report" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const amount = Number(rt.price);
    if (!amount || amount < 1) {
      return new Response(JSON.stringify({ success: false, error: "Invalid report price" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ---------------- Entitlement check ----------------
    let isEntitled = false;
    let hasPlus = false;
    if (userId) {
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString());
      
      hasPlus = subscriptions && subscriptions.length > 0;

      const { data: payments } = await supabase
        .from("payments")
        .select("id")
        .eq("user_id", userId)
        .eq("tier", "master")
        .in("status", ["success", "SUCCESS", "paid", "PAID"]);

      const hasMaster = payments && payments.length > 0;

      if (hasMaster) {
        isEntitled = true;
      }
    }

    // Apply 50% active Plus member discount to base report price
    const basePrice = hasPlus ? Math.round(amount * 0.5) : amount;

    // ---------------- Coupon validation ----------------
    let finalAmount = isEntitled ? 0 : basePrice;
    let appliedCouponId: string | null = null;
    let appliedCouponCode: string | null = null;
    let discountAmount = 0;

    if (couponCode && typeof couponCode === 'string') {
      const code = couponCode.toUpperCase().trim();
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .maybeSingle();

      if (!coupon) {
        return new Response(JSON.stringify({ success: false, error: "Invalid coupon code" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
        return new Response(JSON.stringify({ success: false, error: "Coupon has expired" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
        return new Response(JSON.stringify({ success: false, error: "Coupon usage limit reached" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Check report key mapping
      if (coupon.report_key && coupon.report_key !== reportKey) {
        return new Response(JSON.stringify({ success: false, error: "This coupon is not valid for this report" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Check min cart value
      if (coupon.min_cart_value && basePrice < Number(coupon.min_cart_value)) {
        return new Response(JSON.stringify({ success: false, error: `Minimum order value ₹${coupon.min_cart_value} required` }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Check per-user limit
      if (coupon.per_user_limit > 0 && userId) {
        const { count } = await supabase
          .from('coupon_redemptions')
          .select('*', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)
          .eq('user_id', userId);
        if ((count || 0) >= coupon.per_user_limit) {
          return new Response(JSON.stringify({ success: false, error: "You have already used this coupon" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      if (coupon.discount_type === 'free') {
        finalAmount = 0;
      } else if (coupon.discount_type === 'percentage') {
        finalAmount = Math.max(0, Math.round(basePrice - (basePrice * Number(coupon.discount_value) / 100)));
      } else if (coupon.discount_type === 'flat') {
        finalAmount = Math.max(0, Math.round(basePrice - Number(coupon.discount_value)));
      }

      discountAmount = basePrice - finalAmount;
      appliedCouponId = coupon.id;
      appliedCouponCode = code;
    }

    const recordRedemption = async (paymentId: string | null) => {
      if (!appliedCouponId) return;
      if (userId) {
        await supabase.from('coupon_redemptions').insert({
          coupon_id: appliedCouponId,
          user_id: userId,
          payment_id: paymentId,
          discount_amount: discountAmount,
          tier: reportKey,
        });
      }
      await supabase.rpc('increment_coupon_usage', { coupon_id: appliedCouponId });
    };

    // Save intake snapshot ----------------------------------------------
    const { data: rr, error: rrErr } = await supabase
      .from("report_requests")
      .insert({ report_key: reportKey, email: email || null, input_json: inputJson || {}, profile_json: profileJson || {} })
      .select("id").single();
    if (rrErr) throw new Error("Failed to save intake: " + rrErr.message);

    const orderId = `RPT_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Capture lead (non-blocking)
    try { await supabase.from("leads").insert({ name: name || null, dob: (inputJson?.dateOfBirth) || null, report_key: reportKey, email: email || null, phone: phone || null, utm: utm || null }); } catch (_e) { /* ignore */ }

    // ---- Free unlock / 100% coupon ----
    if (finalAmount === 0) {
      await supabase.from("report_orders").insert({
        report_request_id: rr.id, report_key: reportKey, email: email || null,
        user_id: userId || null, amount: 0, status: "success", cashfree_order_id: orderId, utm: utm || null,
        paid_at: new Date().toISOString()
      });
      await recordRedemption(null);
      
      // Fire report email asynchronously
      try {
        const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        fetch(`${supabaseUrl}/functions/v1/send-report-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${svc}` },
          body: JSON.stringify({ orderId }),
        }).catch(() => {});
      } catch (_e) {}

      return new Response(JSON.stringify({
        success: true, mock: true, orderId, amount: 0, reportRequestId: rr.id,
        message: "Free report unlocked via coupon",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ---- Mock mode (no Cashfree keys or local testing) ----
    const origin = (returnOrigin || req.headers.get("origin") || "").replace(/\/$/, "");
    const isLocal = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
    if (!cashfreeAppId || !cashfreeSecretKey || isLocal) {
      await supabase.from("report_orders").insert({
        report_request_id: rr.id, report_key: reportKey, email: email || null,
        user_id: userId || null, amount: finalAmount, status: isLocal ? "success" : "pending", cashfree_order_id: orderId, utm: utm || null,
      });
      await recordRedemption(null);
      return new Response(JSON.stringify({
        success: true, mock: true, orderId, amount: finalAmount, reportRequestId: rr.id,
        message: "Mock order created",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ---- Cashfree order ----
    const base = isProduction ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const returnUrl = `${origin}/order/${orderId}`;

    const orderPayload = {
      order_id: orderId,
      order_amount: finalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: userId || `guest_${Date.now()}`,
        customer_email: email || "guest@ankjyotishai.com",
        customer_phone: phone || "9999999999",
        customer_name: name || "Customer",
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: `${supabaseUrl}/functions/v1/cashfree-webhook`,
      },
      order_tags: { type: "report", report_key: reportKey },
    };

    const cfRes = await fetch(`${base}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": cashfreeAppId,
        "x-client-secret": cashfreeSecretKey,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(orderPayload),
    });
    const cf = await cfRes.json();
    if (!cfRes.ok) {
      console.error("Cashfree error:", cf);
      throw new Error(cf.message || "Failed to create Cashfree order");
    }

    await supabase.from("report_orders").insert({
      report_request_id: rr.id, report_key: reportKey, email: email || null,
      user_id: userId || null, amount: finalAmount, status: "pending", cashfree_order_id: orderId, utm: utm || null,
    });

    await recordRedemption(null);

    return new Response(JSON.stringify({
      success: true, orderId, amount: finalAmount, reportRequestId: rr.id,
      paymentSessionId: cf.payment_session_id,
      paymentMode: isProduction ? "production" : "sandbox",
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("create-report-order error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message || "Failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

serve(handler);
