# AnkJyotish AI — Enterprise Platform Architecture

## 1. High-Level Topology

```text
                               ANKJYOTISH AI
                                     |
                      ┌──────────────┴──────────────┐
                      |                             |
                 Laravel/PHP                      Python
              Main Application              Intelligence Layer
              (Business Core)              (FastAPI Service)
                      |                             |
                      |                    ┌────────┴────────┐
                      |                    |                 |
                   Web/API          Astrology Engine     AI Engine
                      |             (Swiss Ephemeris/   (Deterministic
                      |              Vedic / KP)         Grounding)
    ┌─────────┬───────┼────────┬────────────┬──────────────┐
    |         |       |        |            |              |
  Users    Reports Commerce Affiliate   Marketing      Analytics
    |         |       |        |            |              |
    └─────────┴───────┼────────┴────────────┴──────────────┘
                      |
                  PostgreSQL (Unified Schema)
                      |
                    Redis (Queue / Cache / PubSub)
```

## 2. Core Subsystems

### A. Laravel Business Application (`backend/`)
- **Routing & Controllers**: Thin HTTP endpoints dispatching domain actions.
- **Authentication**: Laravel Sanctum tokens, OTP phone verification, OAuth.
- **D2C E-Commerce**: Product catalog (Mulank 1–9 T-Shirts, gemstones, yantras), variant stock, cart, checkout, payment webhooks.
- **Affiliate Platform**: Link tracking, click redirects, conversion webhooks, commission attribution.
- **Universal Report Engine**: Free & Paid tier report orchestration, versioning, regeneration, email distribution.
- **11-Role RBAC**: Granular permission matrix for Super Admin, Astrology Admin, Numerology Admin, AI Admin, Content Admin, Commerce Admin, Affiliate Admin, Marketing Admin, Support Admin, and Analytics Admin.

### B. Python Intelligence Layer (`python/`)
- **FastAPI Core**: Microservice providing authenticated internal IPC.
- **Astrology Engine (`python/astrology/`)**: Deterministic planetary positioning, Lagna calculations, Nakshatra padas, Vimshottari Mahadasha/Antardasha, Active Yogas, and 36-Guna Ashtakoota matchmaking.
- **Numerology Engine (`python/numerology/`)**: Chaldean & Pythagorean calculations, NIKB 5-layer consultant reasoning, 81 Mulank × Bhagyank matrix, Loshu grid arrows, Pinnacles, and Challenges.
- **Grounded AI Synthesis (`python/ai/`)**: Strict factual grounding ensuring LLMs never hallucinate numerical or astrological values.
- **Recommendation Engine (`python/recommendations/`)**: Contextual scoring for personalized apparel, gemstone remedies, reports, and affiliate items.

### C. Client & Design System (`project/`)
- **Luxury Editorial Aesthetic**: Matte Black (`#0a0a0c`), Warm Gold (`#d4af37`), Ivory (`#f8f8f6`), soft glassmorphism, responsive micro-interactions.
- **Unified Multi-Tab User Dashboard**: Overview, My Numbers, My Astrology, My Reports, My AI Assistant, My Orders, My T-Shirts, My Recommendations, Subscriptions.
