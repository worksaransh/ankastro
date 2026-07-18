# AnkJyotish AI — MASTER SETUP GUIDE
### Is session mein bana sab kuch — ek jagah, sahi order mein
### Date: June 2026 | Project: kassdsugfktqptsxzqhr

---

## QUICK STATUS: Kya-Kya Bana Is Session Mein

| # | Feature | Type | Status |
|---|---------|------|--------|
| 1 | Report Content CMS (3-lang + AI translate) | DB + Frontend + Edge fn | ✅ |
| 2 | Coupons fix (RLS + per-report) | SQL + Frontend | ✅ |
| 3 | Buy buttons + catalog page (/reports) | Frontend | ✅ |
| 4 | Admin Report Catalog (prices/visibility) | DB + Frontend | ✅ |
| 5 | 3 New reports (Business/Property/Marriage) | DB + Frontend | ✅ |
| 6 | PDF numbered sections (01 │ Title) | Frontend | ✅ |
| 7 | Report cards 3-language (en/hi/hinglish) | Frontend | ✅ |
| 8 | Upsell + Cross-sell (order success) | Frontend | ✅ |
| 9 | AI report depth (generate-report-ai) | Edge fn | ✅ |
| 10 | Ads tracking (Meta Pixel/GA4/GAds admin) | DB + Frontend | ✅ |
| 11 | Product-wise purchase events (e-com) | Frontend | ✅ |
| 12 | UTM attribution (kaunsi ad se sale) | DB + Edge fn | ✅ |
| 13 | Dashboard dynamic widgets (daily lucky, personal year, pinnacle) | Frontend | ✅ P0 |
| 14 | AI Chat NIKB context (compound + karmic + pinnacle) | Frontend | ✅ P0 |
| 15 | Paid PDF × LifePillars engine connection | Frontend + Edge fn | ✅ P0 |
| 16 | NIKB DB schemas (12 consultant-grade tables) | SQL | ✅ |
| 17 | NIKB generate-report-ai upgraded | Edge fn | ✅ |

---

## STEP 1 — SQL FILES (Supabase Dashboard → SQL Editor)

### IMPORTANT: File ka CONTENT paste karo, file ka NAAM nahi.

```
database/ folder mein ye files hain. Har ek ka PURA content copy karo → SQL Editor → RUN.
Jo pehle chal chuke hain wo safely dobara chala sakte ho (idempotent).
```

| File | Kya Karta Hai | Priority |
|------|---------------|----------|
| `00_permissions.sql` | Basic grants + RLS | Core |
| `01_pricing_plans.sql` | Tier pricing | Core |
| `02_admin_setup.sql` | Admin role (**APNA_EMAIL replace karo**) | Core |
| `03_admin_read_access.sql` | is_admin() function | Core |
| `04_landing_pages.sql` | Dynamic landing CMS | Core |
| `05_reports_ads_branding.sql` | report_types + branding | Core |
| `06_seed_landing_pages.sql` | USP pages (optional) | Optional |
| `07_premium_sections.sql` | Premium blocks (optional) | Optional |
| `08_branding.sql` | app_branding table | Core |
| `09_phase1_reports.sql` | **report_orders, report_requests, leads** | 🔴 ZAROORI |
| `10_report_email.sql` | emailed_at column | Core |
| `11_report_types_admin.sql` | Admin edit permissions | Core |
| `12_new_report_types.sql` | Business/Property/Marriage rows | 🔴 ZAROORI |
| `13_coupons_admin.sql` | **Coupon creation fix (RLS)** | 🔴 ZAROORI |
| `14_report_content_cms.sql` | **Report content CMS + 3-lang** | 🔴 ZAROORI |
| `15_tracking_attribution.sql` | Ads tracking + UTM columns | Ads ke liye |
| `16_nikb_schemas.sql` | **NIKB consultant-grade tables** | 🔴 ZAROORI |

### Verify after SQL:
```sql
-- Ye run karo confirm ke liye
SELECT key, price, active FROM report_types ORDER BY sort_order;  -- 9 rows
SELECT count(*) FROM report_orders;  -- error nahi aana chahiye
SELECT count(*) FROM nikb_compound_numbers;  -- 23 rows (seeded)
SELECT code, active FROM coupons LIMIT 5;  -- error nahi
```

---

## STEP 2 — SUPABASE SECRETS (Dashboard → Settings → Edge Functions → Secrets)

```
CASHFREE_APP_ID           = (live App ID from Cashfree dashboard)
CASHFREE_SECRET_KEY       = (live Secret Key)
CASHFREE_PRODUCTION       = true
GROQ_API_KEY              = gsk_xxxx  (from console.groq.com/keys — FREE)
RESEND_API_KEY            = re_xxxx   (from resend.com)
RESEND_FROM               = AnkJyotish AI <reports@ankjyotishai.com>
SITE_URL                  = https://ankjyotishai.com
```

---

## STEP 3 — EDGE FUNCTIONS DEPLOY

**PowerShell mein project folder (D:\AnkJyotish_FINAL\project) ke andar se:**

```powershell
# ---- WITHOUT --no-verify-jwt (user-auth required) ----
supabase functions deploy create-payment      --project-ref kassdsugfktqptsxzqhr
supabase functions deploy verify-payment      --project-ref kassdsugfktqptsxzqhr

# ---- WITH --no-verify-jwt (guest/webhook) ----
supabase functions deploy cashfree-webhook       --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy create-report-order    --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy verify-report-order    --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy send-report-email      --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy generate-report-ai     --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy translate-report-content --project-ref kassdsugfktqptsxzqhr
```

**Agar "supabase" command nahi milti:**
```powershell
npm install -g supabase
```

**Agar scripts disabled error:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Function folder missing error:**
Matlab `supabase/functions/[name]/index.ts` file nahi hai local mein.
`AnkJyotish_FINAL.zip` → extract → `project/supabase/functions/` mein sab folders hain.

---

## STEP 4 — BUILD + UPLOAD

```powershell
cd D:\AnkJyotish_FINAL\project
npm install          # pehli baar ya nayi machine pe
npm run build        # dist/ folder banega
```

**`dist/` folder ka CONTENT** → Hostinger File Manager → `public_html/` mein upload
(purana `public_html/` content pehle delete karo — index.html, assets/ etc.)

**`public/images/` bhi upload karo** (reports ki images ke liye)

---

## STEP 5 — CASHFREE DASHBOARD SETUP

1. Cashfree → Developer → Webhooks
2. URL: `https://kassdsugfktqptsxzqhr.supabase.co/functions/v1/cashfree-webhook`
3. Version: `2022-09-01`
4. Events add karo:
   - ✅ PAYMENT_SUCCESS_WEBHOOK
   - ✅ PAYMENT_FAILED_WEBHOOK
   - ✅ PAYMENT_USER_DROPPED_WEBHOOK
5. Save karo

---

## STEP 6 — RESEND DOMAIN VERIFICATION

1. resend.com → Domains → Add Domain → `ankjyotishai.com`
2. Ye 3 DNS records add karo (Hostinger → hPanel → DNS Zone):

| Type | Name | Content | Priority |
|------|------|---------|----------|
| TXT | `resend._domainkey` | (DKIM value jo Resend deta hai) | — |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |
| MX | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` | 10 |

3. Resend → Verify karo (5-30 min propagation)
4. "Enable Sending" click karo (Receiving NAHI karna)

---

## STEP 7 — ADS TRACKING SETUP (Admin se, code build nahi)

**Admin → Settings → Analytics group mein ye fields:**

| Field | Kahan Se Milega |
|-------|----------------|
| Meta Pixel ID | business.facebook.com → Events Manager → Data Sources → Pixel |
| Google Analytics ID | analytics.google.com → Admin → Data Streams → Measurement ID (G-XXXXX) |
| Google Ads ID | ads.google.com → Tools → Conversions → Tag setup (AW-XXXXX) |
| Google Ads Purchase Label | Usi conversion ka label |
| Search Console Verification | search.google.com/search-console → Add Property → HTML Tag → content="..." value |

**Ads mein URL banana:**
```
https://ankjyotishai.com/report/mobile-numerology-report?utm_source=meta&utm_medium=cpc&utm_campaign=mobile_jan
```

---

## STEP 8 — ADMIN SETUP (pehli baar)

1. `ankjyotishai.com/admin` → login karo (02_admin_setup.sql mein apna email set kiya tha)
2. **Settings tab** → Branding → Logo upload + company name/colors/footer
3. **Payments tab** → Report Catalog → 9 reports ke prices check/edit karo
4. **Pages tab** → Report Content → ek report ke liye "Import static" → "AI Translate" → Save (English + Hindi)
5. **Settings tab** → Analytics → Ads IDs daalo (Step 7)

---

## STEP 9 — NIKB SETUP (Report Intelligence)

NIKB database already seeded ho gaya (16_nikb_schemas.sql se 23 compound numbers + 6 Lo Shu arrows).

**Baaki data AI se generate karo (optional but recommended):**
- 81-row Mulank×Bhagyank matrix (nikb_mb_matrix)
- Age phase modifiers (nikb_age_phases)
- All compound numbers 10-52 deep content

Iske liye bolo — main batch SQL generate kar sakta hoon.

---

## STEP 10 — END-TO-END TEST (Money Path)

```
[ ] /reports → 9 reports dikhe (Business/Property/Marriage bhi)
[ ] /report/mobile-numerology-report → free snapshot PDF download
[ ] Buy → details bharo → Cashfree window → ₹ payment
[ ] /order/:id → "Payment Successful" → PDF auto-download
[ ] PDF mein:
    [ ] Logo/branding
    [ ] Numbered sections (01 │ ...)
    [ ] AI "Your Personalised Reading" section
    [ ] Content language correct (EN/HI/Hinglish)
[ ] Email inbox → report delivery email → link kaam kare
[ ] Dashboard → Login karo → Lucky number dikhe + personal year widget
[ ] AI Chat → poochho kuch → NIKB context ke saath detailed answer aaye
[ ] Admin → Coupons → naya coupon banao → Save (ab kaam karega)
[ ] Admin → Report Content → English select → AI Translate → Save
[ ] Meta Pixel Helper → purchase ke baad content_ids ke saath Purchase event
```

---

## TROUBLESHOOTING (Sabse common errors)

| Error | Wajah | Fix |
|-------|-------|-----|
| `trailing junk after numeric literal` | SQL Editor mein file ka NAAM paste kiya | File ka CONTENT paste karo |
| `Entrypoint path does not exist` | Local function folder missing | zip se folder copy karo |
| `Edge Function non-2xx` | DB table missing (09/12 SQL nahi chala) | 09 + 12 SQL chalao |
| `Pay Now kuch nahi karta` | Cashfree v3 SDK issue | Already fixed in latest code |
| Coupons nahi ban rahe | RLS missing | 13_coupons_admin.sql chalao |
| Dashboard mein lucky number nahi | DOB localStorage mein nahi | Ek baar /form fill karo |

---

## FILE STRUCTURE (Reference)

```
project/
├── src/
│   ├── pages/
│   │   ├── DashboardPage.tsx    ← P0: dynamic widgets (lucky, year, pinnacle)
│   │   ├── AiChatPage.tsx       ← P0: NIKB-rich context (compound, karmic, pinnacle)
│   │   ├── OrderSuccessPage.tsx ← P0: lifePillars → AI → PDF
│   │   ├── BuyReportPage.tsx    ← UTM + product events
│   │   ├── StaticReportLanding.tsx ← 3-lang + DB content
│   │   ├── ReportsCatalogPage.tsx  ← All 9 reports + pricing
│   │   └── ...
│   ├── components/admin/
│   │   ├── ReportContentManager.tsx ← CMS + AI translate
│   │   ├── ReportCatalogManager.tsx ← Price/visibility
│   │   ├── CouponManager.tsx        ← Per-report coupons
│   │   └── SystemSettingsManager.tsx ← Ads tracking IDs
│   ├── lib/
│   │   ├── whiteLabelPdf.ts     ← Numbered PDF sections
│   │   ├── tracking.ts          ← Product-wise events (e-com)
│   │   └── utm.ts               ← First-touch attribution
│   └── hooks/
│       ├── useReportContent.ts  ← DB content + 3-lang overlay
│       └── useReports.ts        ← DB price overlay
├── supabase/functions/
│   ├── generate-report-ai/      ← NIKB-upgraded (compound + pillars)
│   ├── translate-report-content/ ← AI 3-lang translation
│   ├── create-report-order/     ← UTM save
│   ├── cashfree-webhook/
│   ├── send-report-email/
│   └── verify-report-order/
└── database/
    ├── 00-08: Core setup
    ├── 09-13: Report selling + coupons
    ├── 14-15: CMS + tracking
    └── 16: NIKB schemas
```

---

## NEXT RECOMMENDED STEPS (Priority Order)

1. **Sab deploy karo + ek real sale test karo** (money path confirm)
2. **NIKB full data seed** — 81-row matrix + remaining compounds (mujhse maango)
3. **Subscription add karo** (recurring ₹99-149/mo) — LTV fix
4. **User profile enrichment** (DOB/goals on signup) — personalization unlock
5. **Recommendation engine** (rule-based) — "aapko ye report try karni chahiye"

---

**Total project: 27+ DB tables, 13 edge functions, 50+ React components, 3 languages, NIKB intelligence layer. Ek aadmi ke liye kaafi achha hai. 🙏**
