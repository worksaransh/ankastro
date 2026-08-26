import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Tier = "glimpse" | "starter" | "addon" | "pro" | "master";
const rank: Record<Tier, number> = { glimpse: 0, starter: 1, addon: 1, pro: 2, master: 3 };

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Authenticate the caller
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ tier: "glimpse", error: "unauthenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ tier: "glimpse", error: "invalid_token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    let body: { reportId?: string; reportKey?: string } = {};
    try { body = await req.json(); } catch { /* no body OK */ }
    const reportId = body.reportId;
    const reportKey = body.reportKey;

    // Service-role query bypasses RLS and gives authoritative tier
    const admin = createClient(url, serviceKey);
    
    // Fetch payments (for package levels)
    const { data: payments } = await admin
      .from("payments")
      .select("tier, report_id, status")
      .eq("user_id", userId)
      .in("status", ["success", "SUCCESS", "paid", "PAID"]);

    // Fetch report orders (for individual reports, supporting guest email link)
    const userEmail = userData.user.email;
    const { data: reportOrders } = await admin
      .from("report_orders")
      .select("id, report_key, status, cashfree_order_id")
      .or(`user_id.eq.${userId}${userEmail ? `,email.eq.${userEmail}` : ""}`)
      .in("status", ["success", "SUCCESS", "paid", "PAID"]);

    // Fetch active subscriptions (Plus membership)
    const { data: subscriptions } = await admin
      .from("subscriptions")
      .select("plan, status, expires_at")
      .eq("user_id", userId)
      .eq("status", "active")
      .gte("expires_at", new Date().toISOString());

    const hasActiveSubscription = subscriptions && subscriptions.length > 0;

    let best: Tier = "glimpse";
    let bestReport: Tier = "glimpse";

    // 1. Process account packages
    (payments || []).forEach((p: any) => {
      const t = (p.tier || "glimpse") as Tier;
      if ((rank[t] ?? 0) > (rank[best] ?? 0)) best = t;
      if (reportId && p.report_id === reportId && (rank[t] ?? 0) > (rank[bestReport] ?? 0)) {
        bestReport = t;
      }
    });

    // 2. Process Plus subscriptions - grants at least pro tier access
    if (hasActiveSubscription) {
      if ((rank["pro"] ?? 0) > (rank[best] ?? 0)) {
        best = "pro";
      }
    }

    // 3. Process individual purchased reports
    (reportOrders || []).forEach((o: any) => {
      // If we are looking for a specific report key
      if (reportKey && o.report_key === reportKey) {
        bestReport = "pro"; // Unlock as pro
      }
      // If we are looking for a specific report ID (by UUID or Cashfree Order ID)
      if (reportId && (o.id === reportId || o.cashfree_order_id === reportId)) {
        bestReport = "pro";
      }
    });

    // Determine the highest available tier from either account or report level
    const tier = rank[best] >= rank[bestReport] ? best : bestReport;

    const purchasedReportKeys = (reportOrders || []).map((o: any) => o.report_key);
    const purchasedReportsMap: Record<string, string> = {};
    (reportOrders || []).forEach((o: any) => {
      purchasedReportsMap[o.report_key] = o.cashfree_order_id || o.id;
    });

    return new Response(JSON.stringify({ 
      tier, 
      userId, 
      purchasedReportKeys,
      purchasedReportsMap,
      isMaster: rank[best] >= rank["master"],
      hasPlus: hasActiveSubscription
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("get-report-tier error:", e);
    return new Response(JSON.stringify({ tier: "glimpse", error: e.message || "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
