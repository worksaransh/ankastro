## Phase 3 — Advanced Numerology Engine (Name + Mobile + Business Vibrations)

Existing engine (`numerology.ts`, `advancedNumerology.ts`, `vedicNumerology.ts`) already covers Life Path, Destiny, Soul Urge, Personality, Birthday, Maturity, Attitude, Personal Year/Month/Day, Karmic Lessons, Hidden Passion, Compatibility, Loshu Grid, Pinnacles, Challenges, Karmic Debts, Elemental Balance, Mulank, Bhagyank. Phase 3 layers three new **vibration analyzers** on top — without touching existing flows.

### New modules (pure functions, additive)

1. `src/lib/nameVibration.ts`
   - `calculateNameVibration(name)` → Pythagorean + Chaldean totals, compound number, reduced root, vowel/consonant split, master flag.
   - `analyzeNameCompatibility(name, dob)` → checks Name # vs Mulank, Bhagyank, Life Path; returns alignment score (0-100), friendly/neutral/enemy verdict, suggested spelling tweaks (add/drop a letter to hit a friendly root).
2. `src/lib/mobileVibration.ts`
   - `calculateMobileVibration(number)` → digit sum, compound, reduced root, last-4 root, missing digits.
   - `analyzeMobileCompatibility(number, mulank, bhagyank)` → compatibility verdict + 3 suggested alternative endings.
3. `src/lib/businessNameVibration.ts`
   - `calculateBusinessVibration(brandName, founderDob?)` → name root, brand archetype, industry-fit hints (tech/finance/wellness/creative/retail).
   - `suggestBrandTweaks(brandName, targetRoot)` → 3 spelling variants reaching target root.

All three return a normalized `VibrationResult` so PDF + UI share rendering.

### UI surfaces (frontend only)

- New tab inside existing `AdvancedReportPage` → **"Vibrations"** with 3 sub-sections (Name / Mobile / Business). Tier-gated to `pro+` via existing `TierGate`.
- Mobile + Business inputs are user-editable mini-tools (free-text input → live result). Name uses report's `currentName`.
- New standalone page `/tools/vibration` (public free mini-tool, 1 calc per session, soft upsell to full report).

### Admin

- New tab in `AdminPage` → **"Vibration Meanings"** to manage root-number interpretations for name/mobile/business (uses existing `number_meanings` table with new `category` values `name_vibration`, `mobile_vibration`, `business_vibration` — no schema change).

### Database

- **No migration needed.** Reuses `number_meanings` table by adding new `category` values. Seed via admin UI later.

### Non-breaking guarantees

- No edits to existing numerology calculation files.
- No edits to existing report sections; only adds a new tab.
- No new edge functions, no new secrets.

### Rollout in this turn

1. `nameVibration.ts`, `mobileVibration.ts`, `businessNameVibration.ts` + unit tests.
2. `VibrationsSection.tsx` + 3 sub-components, mount in `AdvancedReportPage`.
3. `ToolsVibrationPage.tsx` + route in `App.tsx`.
4. Extend `NumerologyDataManager` (admin) to allow `name_vibration` / `mobile_vibration` / `business_vibration` categories.

Confirm to proceed, or trim (e.g., "skip public tool page" / "skip admin meanings tab").
