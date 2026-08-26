# AnkJyotish AI — Affiliate Engine & Attribution

## 1. Network & Merchant Topology
- **Networks**: Amazon Associates, GemPundit Certified Affiliates, AstroSage Partners, Internal Creator Network.
- **Tracking Parameters**:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
  - `user_id`, `session_id`, `ip_address`, `clicked_at`

## 2. Recommendation Pipeline
After any free or paid report generation, the recommendation engine calculates contextual affinities (e.g. Mulank 1 -> Ruby gemstone, Mulank 8 -> Blue sapphire / Amethyst, Vastu harmonization -> Shri Yantra).
Each recommendation item contains:
- `product`: Title and image
- `reason`: Grounded explanation
- `confidence`: Mathematical score (0.00 - 1.00)
- `source_rule`: Identifiable rule key

## 3. Conversion Tracking
Conversion webhooks and postbacks log transactions in `affiliate_conversions` with status transitions (`pending` -> `approved` -> `paid`).
