# AnkJyotish AI — API Reference

## 1. Internal Python Intelligence Endpoints (Protected by `X-Internal-Secret`)

### `POST /api/v1/calculate/numerology`
Calculates complete numerological parameters (Mulank, Bhagyank, Name Number, Soul Urge, Loshu Grid, Pinnacles, Challenges).

### `POST /api/v1/calculate/astrology`
Calculates deterministic Vedic planetary positions, Lagna, Nakshatras, Houses, Dignities, Yogas, and Active Dashas.

### `POST /api/v1/interpret`
Grounds calculation parameters and synthesizes editorial life guidance in EN, HI, or Hinglish.

### `POST /api/v1/recommend`
Returns scored, rule-backed merchandise, gemstone remedies, reports, and affiliate recommendations.

---

## 2. Public Application Endpoints (`/api/v1`)

### `GET /api/v1/shop/products`
Retrieves D2C merchandise catalog with Mulank and Zodiac filters.

### `POST /api/v1/shop/checkout/create-order`
Creates an e-commerce order session with Cashfree / Razorpay.

### `GET /api/v1/affiliate/redirect/{slug}`
Logs attribution parameters (UTM source, campaign, IP) and safely redirects visitor to target merchant.

### `POST /api/v1/reports/preview`
Generates real-time free calculation preview with paywall teaser for master report tiers.
