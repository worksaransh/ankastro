# AnkJyotish AI — FINAL STEP-BY-STEP (Live Site Update)
### Website live hai, payment live hai. Ye steps SAFE hain — kuch delete nahi hota.
### Sab additive: naye tables IF NOT EXISTS, naye columns ADD IF NOT EXISTS.

---

## ⚠️ PEHLE PADHO (1 minute)
- **Kuch bhi delete nahi karna.** Sab purane data me ADD hota hai.
- **02, 06, 07 SQL DOBARA MAT chalao** (ye pehle chal chuke; inme admin-role reset / demo-block delete hai — payment/users safe par dobara chalane ki zaroorat nahi).
- **Sirf naye SQL (09-18) chalao** jo abhi tak nahi chalaye.
- Safety: Supabase → Database → Backups → ek manual backup le lo (optional, 1 min).

---

## STEP 1 — Konsa SQL Pehle Se Hai? (Check karo)
Supabase → SQL Editor → ye chalao:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema='public'
AND table_name IN ('report_orders','report_content','nikb_compound_numbers',
                   'nikb_mb_matrix','system_settings','subscriptions','coupons')
ORDER BY table_name;
```
- Jo table **dikhe** = already hai (us SQL ko skip ya dobara safe-run)
- Jo **na dikhe** = uski SQL chalao (neeche list)

---

## STEP 2 — SQL Chalao (sirf naye, IS ORDER me)
Har file ka **PURA CONTENT** copy karo (file ka NAAM nahi!) → SQL Editor → RUN.
`database/` folder me sab files hain.

```
09_phase1_reports.sql        ← agar report_orders table na dikhe
10_report_email.sql          ← agar pehle nahi chala
11_report_types_admin.sql
12_new_report_types.sql      ← Business/Property/Marriage
13_coupons_admin.sql         ← coupon fix
14_report_content_cms.sql    ← content CMS + 3-lang
15_tracking_attribution.sql  ← ads tracking + UTM
16_nikb_schemas.sql          ← NIKB tables (23 compounds seeded)
17_subscriptions.sql         ← Plus membership (NEW)
18_nikb_mb_matrix_seed.sql   ← 81 Mulank×Bhagyank rows (NEW)
```

**Confirm (last me):**
```sql
SELECT count(*) FROM nikb_compound_numbers;  -- 23
SELECT count(*) FROM nikb_mb_matrix;         -- 81
SELECT count(*) FROM subscriptions;          -- 0 (abhi koi sub nahi)
SELECT key, value FROM system_settings WHERE key LIKE 'plus%';  -- 2 rows (99, 249)
```

---

## STEP 3 — Secrets Check (pehle se hone chahiye)
Supabase → Edge Functions → Secrets. Ye sab honi chahiye:
```
CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_PRODUCTION=true,
GROQ_API_KEY, RESEND_API_KEY, RESEND_FROM, SITE_URL
```
(Koi nayi secret subscription ke liye NAHI chahiye — wahi Cashfree use hota hai.)

---

## STEP 4 — Functions Deploy (PowerShell, project folder me)
```powershell
cd D:\AnkJyotish_FINAL\project

# naya/updated functions:
supabase functions deploy create-subscription   --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy cashfree-webhook        --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy generate-report-ai      --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy create-report-order     --no-verify-jwt --project-ref kassdsugfktqptsxzqhr
supabase functions deploy translate-report-content --project-ref kassdsugfktqptsxzqhr
```
(Baaki functions pehle se deployed hain — agar shaq ho to sab dobara deploy kar sakte ho, safe hai.)

---

## STEP 5 — Build + Upload (live site update)
```powershell
cd D:\AnkJyotish_FINAL\project
npm install          ← pehli baar / nayi files ke baad
npm run build        ← dist/ banega
```
- `dist/` folder ka **andar ka sab content** → Hostinger → `public_html/` (purana content delete karke)
- `public/images/` bhi upload (agar nayi images)

> Site turant update ho jayegi. Purana data/payments safe.

---

## STEP 6 — Test (ek-ek karke)
```
[ ] Site khulti hai (homepage)
[ ] /reports → 9 reports
[ ] /plus → membership page khule, ₹99/₹249 plan dikhe
[ ] Plus subscribe → Cashfree → ₹ pay → /plus-success → "Welcome to Plus"
[ ] Supabase → subscriptions table → status='active', expires_at +30 days
[ ] Dashboard → login → Plus badge dikhe (ya Plus CTA agar member nahi)
[ ] Dashboard → daily lucky number + personal year widget
[ ] Ek report buy → PDF → numbered sections + AI personalised reading
[ ] AI chat → detailed numerology answer (compound, karmic context)
[ ] Admin → Coupons → naya coupon → Save (kaam kare)
```

---

## STEP 7 — Plus ko Promote Karo (revenue)
- Homepage / dashboard pe Plus CTA already laga hai
- Har report buy ke baad order-success pe Plus mention add kar sakte ho (bolo)
- WhatsApp/email me "₹99/month me roz ka bhagya" — push

---

## SUBSCRIPTION — IMPORTANT NOTE (honest)
Ye **monthly membership** hai (₹99/₹249), existing Cashfree order flow se:
- User pay karta hai → 30/92 din active → expiry par renew reminder
- **Ye TRUE auto-debit NAHI hai** (har month apne aap paisa nahi katega)
- Auto-debit (Cashfree Subscriptions/eNACH mandate) ke liye Cashfree me alag activation + mandate flow chahiye — wo baad me add ho sakta hai jab aapko volume mile

Abhi ke liye ye **deployable + recurring-revenue behavior** deta hai bina kisi extra Cashfree setup ke. 100+ members aaye to auto-debit upgrade karenge.

---

## AGAR KUCH ATKE
| Error | Fix |
|-------|-----|
| trailing junk after numeric literal | File ka NAAM paste kiya — CONTENT paste karo |
| Entrypoint path does not exist | Function folder local me missing — zip se copy |
| Edge Function non-2xx (subscribe) | 17_subscriptions.sql nahi chala |
| Plus active nahi ho raha | cashfree-webhook redeploy karo (subscription activation usme hai) |
| nikb_mb_matrix 0 rows | 18 SQL nahi chala |

---

## YE SESSION KA POORA SUMMARY
**SQL:** 09→18 (10 files, sab additive)
**Naye functions:** create-subscription
**Updated functions:** cashfree-webhook (sub activation), generate-report-ai (NIKB+pillars), create-report-order (UTM)
**Naye pages:** /plus, /plus-success
**Updated pages:** Dashboard (widgets+Plus), AiChat (NIKB context), OrderSuccess (pillars→PDF)
**NIKB:** 23 compounds + 81 Mulank×Bhagyank + 6 Lo Shu arrows seeded

Sab live site pe safely update ho jayega. 🙏
