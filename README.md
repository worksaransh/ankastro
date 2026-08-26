# 🌌 AnkAstro (अंकज्योतिष AI) — Enterprise Vedic Astrology & Numerology Super-App

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![MySQL / MariaDB](https://img.shields.io/badge/MySQL-8.0%20%7C%20MariaDB-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

**AnkAstro** is an enterprise-grade, Astrotalk-class Vedic Astrology & Pythagorean/Chaldean Numerology super-application. It features real-time planetary mathematics, Shodashvarga divisional chart rendering, cross-system synthesis between Numerology Triads and 12 Kundli Bhavas, automated 25+ page PDF generation, D2C cosmic apparel e-commerce, and an intelligent AI astrologer consultation hub.

---

## 🚀 Key Platform Features

### 1. 🧭 Deep Vedic Astrology & Shodashvarga Chart Suite
- **8 Major Divisional Charts**:
  - **D1 Lagna Kundli**: Root physical constitution, vitality, and life blueprint.
  - **Chandra Kundli (Moon Chart)**: Psychological resilience, emotions, and domestic peace.
  - **Surya Kundli (Sun Chart)**: Divine authority, soul willpower, and external career fame.
  - **D9 Navamsha Kundli**: Post-30 dharma, marriage, and spouse characteristics.
  - **D10 Dashamsha Kundli**: Professional mastery, promotions, and corporate legacy.
  - **D2 Hora Kundli**: Wealth compounding capacity and financial flow.
  - **D7 Saptamsha Kundli**: Progeny fortune, children, and creative conception.
  - **D12 Dwadashamsha Kundli**: Ancestral blessings and parental karma.
- **Dual Visual Styles**: Interactive **North Indian Diamond** and **South Indian Box Grid** SVG charts with real-time house planetary occupant mappings.
- **Interactive 12 Bhavas Explorer**: Click any house to inspect governed life domains and occupying Grahas with exact degree, Nakshatra Pada, and Dignity (*Exalted, Own Sign, Moolatrikona, Friend*).
- **Vimshottari Mahadasha Timeline & Shani Sade Sati Status**: Real-time transit monitoring and Manglik Dosha severity evaluation.

---

### 2. ⚡ Unified Dual-System Cross-Synthesis Matrix
- Dynamically bridges **Pythagorean/Chaldean Numerology (Mulank & Bhagyank 1–9)** with **Vedic Astrology (Lagna Lord & 10th House Karma Lord)**.
- **Celestial Resonance Score (0–100%)**: Quantitative harmony measure between psychic numbers and planetary lords.
- **Planetary Friendship Matrix**: Evaluates camaraderie (Harmonious / Neutral / Challenging) between Mulank ruler and Ascendant lord.
- **Unified Single-Remedy Prescription**: Prescribes tailored Gemstones, Rudraksha Mukhi, Yantra placement direction, Beej Mantras, and Cosmic Aura Colors.

---

### 3. 🛍️ D2C Cosmic Apparel Atelier & E-Commerce Store
- **Mulank & Zodiac Exclusive Apparel**: Heavyweight 240 GSM oversized tees with 24K gold foil screen prints, consecrated gemstones, and energized yantras.
- **Enterprise Inventory Management**: Multi-variant matrix (Sizes: S/M/L/XL/XXL, Colors, Mukhis, Carats), SKU tracking, batch stock updates, and low-stock alerts.
- **Multi-Gateway Checkout**: **Cashfree** (Instant UPI, Cards, NetBanking) and **Cash on Delivery (COD)** with live courier tracking (AWB).

---

### 4. 🤖 AI Astrologer Consultation & Personas
- Real-time cosmic consultations with 4 specialized AI personas:
  - **Acharya Vashistha** (Classical Vedic Guru)
  - **Dr. Maya Numeros** (Modern Pythagorean Analyst)
  - **Pandit Radheshyam** (Lal Kitab & Remedial Specialist)
  - **Astro Ananya** (Modern Career & Matchmaking Guide)

---

### 5. 📱 Universal Mobile & Multi-Device Experience
- **Floating Mobile Dock Navigation (`MobileBottomNav.tsx`)**: App-like navigation on iOS/Android.
- **Responsive Admin Control Panel (`AdminPage.tsx`)**: Includes a mobile Quick-Category selector for managing all 21 administrative sections on the go.
- **Offline PWA Support**: Add to home screen on mobile and desktop devices.

---

## 🏗️ Architecture & Directory Structure

```
AnkAstro/
├── project/                     # Frontend Application (React 18 + Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # 21 Admin Modules (Inventory, Astrology, CRM, Payments)
│   │   │   ├── dashboard/       # Deep Kundli, Unified Matrix, Lo Shu, Forecasts
│   │   │   ├── charts/          # SVG / Recharts Visualizations
│   │   │   └── MobileBottomNav.tsx # App-like Mobile Navigation Dock
│   │   ├── lib/                 # Core Mathematical & Astrological Calculation Engines
│   │   │   ├── unifiedSynthesisEngine.ts # Cross-System Numerology × Astrology Matrix
│   │   │   ├── vedicAstrologyEngine.ts   # Sidereal Planetary Math & Ephemeris
│   │   │   ├── numerology.ts            # Mulank, Bhagyank, Naamank Algorithms
│   │   │   └── advancedPdfGenerator.ts  # 25+ Page White-Label PDF Engine
│   │   └── pages/               # 45+ Pre-rendered Pages with Full SEO Meta Tags
├── python/                      # Standalone High-Precision Calculation Engines
│   ├── numerology/              # Core Pythagorean & Chaldean Engines
│   ├── astrology/               # Kundli & 36-Gun Ashtakoota Milan Algorithms
│   └── tests/                   # Automated Unit Tests
├── database/                    # Database Schemas & Migrations
│   └── mysql_consolidated_database.sql # 47 MariaDB/MySQL Production Tables
├── backend/                     # Python Flask / FastAPI Integration API
├── docker/                      # Production Dockerfile & Container Setups
└── docker-compose.yml           # Multi-Service Orchestration
```

---

## 💻 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **pnpm**
- **Python**: 3.10+ (for Python engine testing)
- **MySQL / MariaDB** (Optional for local DB testing)

### 1. Clone the Repository
```bash
git clone https://github.com/worksaransh/ankastro.git
cd ankastro
```

### 2. Install Dependencies & Start Dev Server
```bash
cd project
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle with 45+ pre-rendered routes will be generated in `project/dist/`.

---

## 🗄️ Database Setup (Hostinger / cPanel / MariaDB)

1. Open **phpMyAdmin** in your hosting control panel.
2. Select your target database (or create a new one: `ankastro_db`).
3. Click **Import** and upload:
   ```
   database/mysql_consolidated_database.sql
   ```
4. All 47 tables, primary keys, and foreign keys will be created cleanly with **zero `#1071` / `#1061` / `#1064` errors**.

---

## 🌐 Hostinger & cPanel Deployment Guide

1. Run `npm run build` in the `project/` directory.
2. The `dist/` directory includes an optimized `.htaccess` file for Single Page Application (SPA) routing:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
3. Upload and extract the contents directly into your Hostinger **`public_html`** root folder.

---

## 📜 Documentation Index

- 📘 [ARCHITECTURE.md](file:///ARCHITECTURE.md) — Comprehensive System Design & Data Flow.
- ⚙️ [DEPLOYMENT_GUIDE.md](file:///DEPLOYMENT_GUIDE.md) — Production Deployment Steps for Apache, Nginx, and Docker.
- 🛍️ [ECOMMERCE.md](file:///ECOMMERCE.md) — D2C Store, Inventory & Shipping Setup.
- 🛡️ [ADMIN.md](file:///ADMIN.md) — Role-Based Access Control & Master Portal Manual.
- 🔌 [API.md](file:///API.md) — REST Endpoints & Python Engine Specification.

---

## ⚖️ License & Credits

Developed with ❤️ by **Saransh Gulati** & the **AnkJyotish Engineering Team**.
Licensed under the [MIT License](LICENSE).
