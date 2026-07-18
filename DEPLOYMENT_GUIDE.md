# 🚀 AnkJyotish AI — Final Deployment Guide

**Project (Supabase):** kassdsugfktqptsxzqhr
**Domain:** ankjyotishai.com
**Stack:** React + Vite + TypeScript + Tailwind + Supabase + Cashfree

Is zip me: poora updated project (`project/`) + saari database SQL (`database/`).
File-by-file copy karne ki zaroorat nahi — bas extract karke build.

---

## STEP 1 — DATABASE (Supabase SQL Editor)

Order me chalao (`database/` folder):

1. `00_permissions.sql`        → grants + RLS (report save ke liye zaroori)
2. `01_pricing_plans.sql`      → dynamic pricing table + current prices
3. `database/seeds/` ki 10 files (koi bhi order):
   - seed_destiny_en, seed_soul_urge_en
   - seed_destiny_soulurge_hi, seed_destiny_soulurge_hinglish
   - seed_affirmations, seed_lucky_attributes, seed_testimonials
   - seed_compatibility_en, seed_compatibility_hi, seed_compatibility_hinglish
4. `02_admin_setup.sql`        → APNA_EMAIL replace karke (admin banane ke liye)
   (Pehle Authentication -> Users me wo user bana lo: Auto Confirm + password)

Verify:
  SELECT 'compat' t, count(*) FROM compatibility_data
  UNION ALL SELECT 'meanings', count(*) FROM number_meanings
  UNION ALL SELECT 'pricing', count(*) FROM pricing_plans;

---

## STEP 2 — FRONTEND BUILD (PowerShell)

  cd project
  npm install
  npm run build

(Errors:
  - 'vite' not recognized   -> npm install dobara
  - scripts disabled        -> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned (Y), phir build)

`.env` confirm karo (project/.env):
  VITE_SUPABASE_URL="https://kassdsugfktqptsxzqhr.supabase.co"
  VITE_SUPABASE_ANON_KEY="<apna anon key>"

`dist/` ka SAARA content -> Hostinger File Manager -> public_html (purana delete karke)

---

## STEP 3 — EDGE FUNCTIONS (PowerShell, project/ ke andar)

  npm install -g supabase        # agar pehle se nahi
  supabase login
  supabase functions deploy ai-chat --project-ref kassdsugfktqptsxzqhr
  supabase functions deploy create-payment --project-ref kassdsugfktqptsxzqhr

Secrets (Dashboard -> Edge Functions -> Secrets):
  GEMINI_API_KEY  = free key from https://aistudio.google.com/apikey  (AI Chat ke liye)
  (Cashfree live ke liye baad me: CASHFREE_APP_ID, CASHFREE_SECRET_KEY)

---

## STEP 4 — AUTH SETTINGS (Dashboard -> Authentication)

URL Configuration:
  Site URL: https://ankjyotishai.com
  Redirect URLs: https://ankjyotishai.com/**

Email provider:
  Allow new users to sign up: ON
  Confirm email: OFF (testing) — live pe SMTP/OTP set karke ON karna

---

## STEP 5 — TEST CHECKLIST

[ ] Homepage -> "Free Numerology Tools" 8 cards
[ ] Login ke baad homepage -> account icon + popup
[ ] Login/Signup -> Google button nahi (sirf email/password)
[ ] /naamank-calculator, /baby-name, /daily-forecast, /remedies khulein
[ ] /tools/vibration -> 6 tabs (Vehicle, House, Name Fix)
[ ] /ai-chat -> non-master ko lock, master ko chat (GEMINI_API_KEY ke baad)
[ ] Report -> Destiny/Soul Urge sahi + Karmic + save ho
[ ] Dashboard -> exact plan (Starter/Pro/Master) + upgrade CTA
[ ] Admin /admin -> khule; Users tab me Tier/Reports/Total; Payments tab me Pricing editable
[ ] Free coupon -> /payment-success sahi (double-URL nahi)

---

## NEW IN THIS BUILD

Content: Destiny/SoulUrge fix, Compatibility (45 pairs x3 lang), Testimonials,
         Affirmations, Lucky attributes
Tools:   Vehicle, House, Name Correction, Naamank, Baby Names,
         Daily Forecast, Remedies
AI:      AI Chat (Gemini, master-only, personal context)
Auth:    Google removed, account icon+popup, dashboard plan+upgrade CTA
Admin:   Customer list (tier/reports/total), Dynamic Pricing manager
Fixes:   Payment success URL, user_reports permissions

---

## STILL PENDING (launch ke liye)

CRITICAL:
  - Cashfree LIVE keys + webhook (real payments)
  - Email/OTP delivery (SMTP ya MSG91/Fast2SMS) — real users ke liye
HIGH:
  - AI Chat rate-limiting
  - Webhook signature verify
  - .env ko .gitignore me daalo
MEDIUM:
  - Admin-editable remedies/baby-names (Feature A)
  - WhatsApp report delivery/share
  - Abandoned-cart follow-up

---

## UPDATE — Latest additions (run these too)

DATABASE (in order, after earlier ones):
  03_admin_read_access.sql   -> admin sabka data dekhe (customer list fix)
  04_landing_pages.sql       -> dynamic CMS tables + seed (name-correction-report page)

NEW DYNAMIC CMS (Phase 1):
  - Route /r/:slug  -> koi bhi landing page DB se render
  - Seeded page:  https://ankjyotishai.com/r/name-correction-report
  - Blocks: heading, paragraph, image, youtube, cta, faq, list, testimonial
  - Abhi blocks DB me hain (SQL se editable). Phase 2 me admin UI aayega
    (text/image/youtube admin se edit). YouTube/image abhi blank seeded —
    SQL se ya Phase 2 admin se bhar sakte ho.

AI CHAT — ab GROQ (free):
  Secret: GROQ_API_KEY  (free: https://console.groq.com/keys)
  Deploy: supabase functions deploy ai-chat --project-ref kassdsugfktqptsxzqhr

TEST (extra):
  [ ] /r/name-correction-report khule, blocks render ho
  [ ] (YouTube/image blocks tab dikhenge jab SQL/admin se url bharo)

---

## UPDATE — Phase 2: Admin CMS Editor

NEW FILE:
  src/components/admin/LandingPageManager.tsx  (admin Pages tab)
  src/pages/AdminPage.tsx  (Pages tab added)

KYA MILA:
  - Admin -> "Pages" tab
  - "New Page" se naya landing page (slug daalo)
  - Har page edit: title/subtitle/hero image/SEO/active
  - Blocks: add (heading/paragraph/image/youtube/cta/faq/list/testimonial),
    reorder (up/down), show/hide, delete
  - Har block ka content admin se edit: TEXT box, IMAGE url, YOUTUBE url, etc.
  - "Preview" button -> /r/slug naye tab me

DEPLOY:
  - Bas frontend files (koi nayi SQL nahi — 04_landing_pages.sql Phase 1 wali hi).
  - npm run build -> dist/ upload

TEST:
  [ ] Admin -> Pages tab -> name-correction-report Edit
  [ ] Ek paragraph ka text badlo -> Save Block -> /r/name-correction-report pe dikhe
  [ ] YouTube block me apna video URL daalo -> Save -> video chale
  [ ] Image block me image URL daalo -> Save -> image dikhe
  [ ] "New Page" banao -> blocks add karo -> live

---

## UPDATE — Phases 3-4-5: Sale Landing Pages + Reports + CRO

NEW DATABASE (run in order, after 04):
  05_reports_ads_branding.sql  -> report_types, ad_slots, page CRO/branding columns
  06_seed_landing_pages.sql    -> 6 ready USP sale pages (researched Hinglish content)

6 LANDING PAGES (auto-live after SQL):
  /r/name-correction-report     (Bestseller, ₹599)
  /r/mobile-numerology-report   (Popular, ₹299)
  /r/vehicle-numerology-report  (₹299)
  /r/career-numerology-report   (New, ₹699)
  /r/baby-name-report           (₹499)
  /r/compatibility-report       (Couples, ₹499)

NEW FRONTEND:
  src/components/ReportsShowcase.tsx  -> homepage "Personalised Reports" grid (dynamic)
  src/pages/DynamicLandingPage.tsx    -> CRO hero (badge/price/rating) + Related Reports
  src/hooks/useLandingPage.ts         -> related reports + CRO fields
  src/pages/HomePage.tsx              -> reports showcase section

KYA HUA:
  - Har landing page: badge + price + rating + cut-price (high CRO)
  - "Related Reports" cross-link (sab interlinked)
  - Homepage pe sab paid reports ka grid (auto from DB)
  - Admin "Pages" tab se har page ka text/image/youtube/price edit (Phase 2 manager)
  - Content researched (name correction, career, baby, mobile, vehicle, compatibility)

EDIT FROM ADMIN:
  Admin -> Pages -> koi bhi report page Edit -> text/image/YouTube/price badlo.
  Naye blocks add karo. Sab live turant.

TEST:
  [ ] /r/name-correction-report -> badge, ₹599, rating, blocks, related reports
  [ ] Homepage -> "Personalised Numerology Reports" grid (6 cards)
  [ ] Admin -> Pages -> ek page edit -> live change
  [ ] Related reports click -> dusra page khule (cross-link)

---

## STILL PENDING (honest — bade sub-projects)

1. WHITE-LABEL PDF per report (logo + personalised):
   - DB branding fields ready (report_types). PDF GENERATION abhi report ke liye
     alag se banana hoga (existing jsPDF report engine ko per-report-type extend karo).
   - Ye ek dedicated phase hai (Phase 6).

2. AD SLOTS admin UI:
   - ad_slots table + seed ready. Admin editor (AdSlotsManager) + frontend render
     abhi banana hai (chhota, next).

3. Calculator block embed (free tool inside landing page):
   - Block type reserve hai; live embed wiring pending (Phase 6).

4. Free-glimpse-then-pay gating per report:
   - report_types.free_glimpse flag ready; gating logic per report pending.

5. Payment gateway LIVE + email/OTP (launch criticals — pehle ki tarah).

---

## UPDATE — Premium CRO Sections (NBT-style)

NEW FRONTEND:
  src/components/PremiumSections.tsx   -> TrustStats, BeforeAfter, ImageCarousel, ReportPreview
  src/components/BlockRenderer.tsx      -> renders new block types
  src/components/admin/LandingPageManager.tsx -> admin edit for new blocks

NEW BLOCK TYPES (admin "Pages" tab se add/edit):
  - trust_stats     -> rating/count cards (4.9 / 50K+ / 24hr / 98%)
  - before_after    -> RAHUL vs RAAHUL score-bar comparison (high CRO)
  - carousel        -> celebrity/image carousel (image URL + name)
  - report_preview  -> multi-page PDF preview + "kya milega" chips

NEW DATABASE (optional demo seed):
  07_premium_sections.sql  -> name-correction page me trust_stats +
                              before_after + report_preview add karta hai

DEPLOY:
  - DB: 07_premium_sections.sql (sirf name-correction demo ke liye; baaki
    pages me admin se add karo)
  - Build + upload dist/

ADMIN USE:
  Pages -> koi page Edit -> block add karo: trust_stats / before_after /
  carousel / report_preview -> content bharo (celebrity images, report
  page images URL paste) -> Save. Reorder se position set karo.

TEST:
  [ ] /r/name-correction-report -> stats bar, before/after bars, report preview
  [ ] Admin se carousel me celebrity image URL daalo -> live dikhe
  [ ] report_preview me apni report page images daalo -> carousel chale
