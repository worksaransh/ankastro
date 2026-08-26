# Ankjyotish AI

Premium Vedic numerology web app — React + Vite + TypeScript + Tailwind + ShadCN UI, backed by Supabase (Auth, Database, Edge Functions, Storage).

Hosted on Hostinger (Apache).

---

## Quick start

```sh
# 1. Install dependencies
npm install

# 2. Start dev server (http://localhost:8080)
npm run dev

# 3. Production build
npm run build

# 4. Preview production build locally
npm run preview
```

## Available scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start Vite dev server                         |
| `npm run build`     | Production build to `dist/`                   |
| `npm run build:dev` | Development-mode build (debugging)            |
| `npm run preview`   | Serve the built `dist/` locally               |
| `npm run lint`      | Run ESLint                                    |
| `npm test`          | Run Vitest test suite once                    |
| `npm run test:watch`| Run Vitest in watch mode                      |

## Environment variables

These are required and are auto-managed by Lovable Cloud (do **not** edit `.env` manually):

| Variable                        | Purpose                                |
| ------------------------------- | -------------------------------------- |
| `VITE_SUPABASE_URL`             | Supabase project URL                   |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key (safe in frontend)     |
| `VITE_SUPABASE_PROJECT_ID`      | Project ref (used by tooling)          |

The app validates these at boot via `src/lib/envCheck.ts` and logs a clear error in the console if anything is missing.

> **Note:** Supabase URL and key are baked in at **build time** (Vite's `import.meta.env`). They cannot be changed at runtime from the Admin Panel — to swap Supabase projects, update env vars and rebuild.

## Tech stack

- **Frontend:** React 18, Vite 5, TypeScript 5
- **Styling:** Tailwind CSS v3, ShadCN UI, Radix primitives
- **Routing:** React Router v6 (BrowserRouter)
- **Data:** Supabase (Postgres + RLS), `@tanstack/react-query`
- **Forms:** `react-hook-form` + `zod`
- **Charts:** Recharts
- **PDF:** jsPDF
- **SEO:** `react-helmet-async`
- **Tests:** Vitest + Testing Library

## Deployment (Hostinger / Apache)

1. Run `npm run build` — output goes to `dist/`.
2. Upload the contents of `dist/` to your Hostinger `public_html` (or a subdirectory).
3. The included `public/.htaccess` is copied into `dist/` automatically and handles:
   - SPA fallback (deep links / page refresh → `index.html`)
   - Aggressive caching of hashed assets
   - `no-cache` for `index.html` so users always get the latest shell
   - Gzip + basic security headers

> Hostinger uses Apache, **not** Vercel. The `vercel.json` file in the repo is unused on Hostinger — `.htaccess` is the source of truth.

## Project structure

```
src/
├── components/         Reusable UI + AdminRoute guard
│   ├── admin/          Admin panel sub-managers (blog, coupons, settings, content)
│   ├── charts/         Recharts visualizations
│   ├── pillars/        5-pillar guidance sections
│   └── ui/             ShadCN primitives
├── contexts/           React contexts (LanguageContext)
├── hooks/              Custom hooks
├── integrations/       Supabase client + generated types (auto-managed)
├── lib/                Numerology engine, PDF gen, SEO helpers, env check
├── pages/              Route components
└── test/               Vitest setup
supabase/
├── functions/          Edge Functions (Cashfree payment + webhook)
└── migrations/         SQL migrations
```

## Application flow

1. User logs in (`/login`)
2. User fills birth details and generates a report (`/form` → `/summary`)
3. A `user_reports` row is created
4. User pays via Cashfree (or applies a coupon) — `/payment`
5. The Cashfree webhook updates `payments.status` to `success`
6. `/report` checks the database and unlocks the premium content accordingly

This flow is sacred — do not refactor without preserving each step.

## Admin access

Admin-only routes are wrapped in `<AdminRoute>` (see `src/components/AdminRoute.tsx`). It checks the `user_roles` table for the `admin` role and redirects unauthorized users.

## Testing

```sh
npm test           # run once
npm run test:watch # watch mode
```

Test suite lives in `src/lib/numerology.test.ts` and verifies Mulank, Bhagyank, Life Path, Destiny, Soul Urge, and Master Number (11 / 22 / 33) preservation against known sample inputs.

## License

Proprietary — © Ankjyotish AI.
