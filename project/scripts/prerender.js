import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('Template index.html not found under dist/! Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// Load environment variables from .env
const envPath = path.join(__dirname, '../.env');
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (parts) {
      let val = parts[2] || '';
      if (val.trim().startsWith('"') && val.trim().endsWith('"')) {
        val = val.trim().slice(1, -1);
      }
      env[parts[1].trim()] = val.trim();
    }
  });
}

const REPORTS = [
  {
    key: 'name_correction', slug: 'name-correction-report', emoji: '✍️',
    title: 'Naam Correction Report — Apne Naam Ki Energy Theek Karo',
    subtitle: 'Aapka naam aapki kismat ka 30% control karta hai. Sahi spelling se career, paisa aur respect — sab badal sakta hai.',
    price: 399, originalPrice: 999, rating: 4.9, reviews: 12480,
    faqs: [
      { q: 'Kya mujhe legally naam badalna padega?', a: 'Nahi. Aap sirf spelling/signature me chhota change kar sakte ho — daily use, social media, business card par. Legal change optional hai.' },
      { q: 'Report kab milegi?', a: 'Payment ke baad turant free snapshot, aur full personalised PDF 24 ghante ke andar WhatsApp/email par.' },
      { q: 'Kya ye sach me kaam karta hai?', a: 'Numerology ek belief-based ancient science hai. Hum accurate calculation aur clear guidance dete hain; result aapke action + faith par depend karta hai.' },
    ]
  },
  {
    key: 'mobile_numerology', slug: 'mobile-numerology-report', emoji: '📱',
    title: 'Mobile Number Numerology — Kya Aapka Number Lucky Hai?',
    subtitle: 'Aapka phone number din-raat aapke saath hai. Galat number chupke-chupke aapki luck, paisa aur peace drain kar sakta hai.',
    price: 199, originalPrice: 599, rating: 4.8, reviews: 9650,
    faqs: [
      { q: 'Number badalna zaroori hai?', a: 'Nahi. Hum verdict aur suggestion dete hain; decision aapka. Bahut log secondary/business number lucky rakhte hain.' },
      { q: 'WhatsApp number bhi check hota hai?', a: 'Haan, koi bhi mobile number — primary, business ya WhatsApp.' },
      { q: 'Delivery time?', a: 'Free snapshot turant, full PDF 24 ghante me.' },
    ]
  },
  {
    key: 'vehicle_numerology', slug: 'vehicle-numerology-report', emoji: '🚗',
    title: 'Vehicle Number Report — Lucky & Safe Number Choose Karo',
    subtitle: 'Nayi gaadi le rahe ho? Galat number safety aur luck dono affect karta hai. Sahi number drive ko shubh banata hai.',
    price: 249, originalPrice: 599, rating: 4.8, reviews: 6320,
    faqs: [
      { q: 'RTO se number choose kar sakte hain?', a: 'Haan, kai RTO me VIP/choice number milta hai. Hamari report best range bata deti hai.' },
      { q: 'Purani gaadi ka kya?', a: 'Remedies dete hain jisse existing number ka asar balance ho.' },
      { q: 'Car aur bike dono?', a: 'Haan, dono ke liye applicable.' },
    ]
  },
  {
    key: 'career_numerology', slug: 'career-numerology-report', emoji: '💼',
    title: 'Career & Job Prediction — Find Your Right Path',
    subtitle: 'Job or business? Which field? When will growth come? Your numbers have clear answers.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 7890,
    faqs: [
      { q: 'Already job me hoon, faayda?', a: 'Haan — growth timing, switch ya stay, aur strength-based roles ki clarity milti hai.' },
      { q: 'Students ke liye?', a: 'Bilkul — stream/field choose karne me madad.' },
      { q: 'Kitni detailed report?', a: 'Top careers + verdict + timing + strengths — multi-section PDF.' },
    ]
  },
  {
    key: 'baby_name', slug: 'baby-name-report', emoji: '👶',
    title: 'Lucky Baby Name Report — Bachche Ko Shubh Naam Do',
    subtitle: 'Naam bachche ke saath zindagi bhar rehta hai. Numerology-aligned naam usko lifelong luck aur confidence deta hai.',
    price: 399, originalPrice: 999, rating: 4.9, reviews: 8430,
    faqs: [
      { q: 'Bachcha abhi paida nahi hua?', a: 'Expected date se bhi suggestions de sakte hain, birth ke baad finalize.' },
      { q: 'Pasand ka letter de sakte hain?', a: 'Haan, starting letter ya sound bata sakte ho, hum usi me se lucky naam denge.' },
      { q: 'Rashi ke according?', a: 'Numerology + lucky alignment dono consider karte hain.' },
    ]
  },
  {
    key: 'compatibility_report', slug: 'compatibility-report', emoji: '❤️',
    title: 'Love & Marriage Compatibility — Numbers Sach Bolte Hain',
    subtitle: 'Shaadi se pehle ya rishte me — numbers batate hain aap dono kitne compatible ho, aur kahaan dhyaan dena hai.',
    price: 449, originalPrice: 999, rating: 4.9, reviews: 10240,
    faqs: [
      { q: 'Dono ki details chahiye?', a: 'Haan — dono ke naam aur DOB se accurate compatibility nikalti hai.' },
      { q: 'Already married ho to?', a: 'Bilkul — harmony improve karne ke liye strength/risk + remedies useful hain.' },
      { q: 'Confidential hai?', a: 'Haan, aapki details private rehti hain.' },
    ]
  },
  {
    key: 'business_numerology', slug: 'business-numerology-report', emoji: '🏢',
    title: 'Business Numerology Report — Naam, Timing, Growth',
    subtitle: 'Business naam, start date aur aapke numbers — sab milke success ya struggle decide karte hain. Sahi alignment se growth tezi se aata hai.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 5120,
    faqs: [
      { q: 'Naya business shuru kar raha hoon?', a: 'Perfect time — naam aur launch timing dono shubh choose kar sakte ho.' },
      { q: 'Purani business hai?', a: 'Naam tuning + lucky factors se existing business ko boost de sakte hain.' },
      { q: 'Logo/brand bhi?', a: 'Report me naam + numbers focus hai; lucky colours brand ke liye bhi useful.' },
    ]
  },
  {
    key: 'property_numerology', slug: 'property-numerology-report', emoji: '🏠',
    title: 'Property & House Number Report — Shubh Ghar Choose Karo',
    subtitle: 'Ghar ya plot ka number aapki energy se match karta ya nahi — peace, paisa aur health par seedha asar.',
    price: 299, originalPrice: 799, rating: 4.8, reviews: 4380,
    faqs: [
      { q: 'Flat number ya building?', a: 'Dono dekh sakte hain — jo number daily use hota hai (flat) sabse zyada matter karta hai.' },
      { q: 'Number badal nahi sakta?', a: 'Remedies dete hain jo energy balance karte hain.' },
      { q: 'Rented ghar?', a: 'Haan, rented par bhi applicable.' },
    ]
  },
  {
    key: 'marriage_report', slug: 'marriage-report', emoji: '💍',
    title: 'Marriage Timing & Matching Report — Sahi Waqt, Sahi Saathi',
    subtitle: 'Shaadi kab, kaisे saathi ke saath, aur compatibility kitni — aapke numbers saaf jawab dete hain.',
    price: 449, originalPrice: 999, rating: 4.9, reviews: 7640,
    faqs: [
      { q: 'Partner ki details nahi hain?', a: 'Tab bhi marriage timing + ideal partner traits milte hain; partner details ho to full match.' },
      { q: 'Already engaged ho?', a: 'Compatibility + harmony remedies useful rahenge.' },
      { q: 'Confidential?', a: 'Haan, details private rehti hain.' },
    ]
  },
  {
    key: 'shani_sade_sati', slug: 'shani-sade-sati-report', emoji: '🪐',
    title: 'Shani Sade Sati & Dhaiya Blueprint — Protection & Timing',
    subtitle: 'Decode your 7.5-year Saturn transit phases (Rising, Peak, Setting) and unlock classical remedies.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 8420,
    faqs: [
      { q: 'Kya Sade Sati sabke liye buri hoti hai?', a: 'Nahi! Taurus, Libra, Capricorn, aur Aquarius lagna ke liye Shani Rajayoga karak ho sakte hain.' }
    ]
  },
  {
    key: 'pitra_dosh_karmic', slug: 'pitra-dosh-karmic-report', emoji: '🏛️',
    title: 'Pitra Dosh & Ancestral Karma Blueprint — Divine Blessing',
    subtitle: 'Identify 9th house afflictions, Sun-Rahu grahan yogas, and unlock ancestral blessings.',
    price: 499, originalPrice: 1499, rating: 5.0, reviews: 6310,
    faqs: [
      { q: 'Kya har amavasya par daan karna hoga?', a: 'Report me aapke horoscope ke anusaar specific daan dates aur dravya bataye jaate hain.' }
    ]
  },
  {
    key: 'wealth_yogas_kundli', slug: 'wealth-yogas-kundli-report', emoji: '💰',
    title: 'Dhana Yogas & Laxmi Prapti Blueprint — Financial Power',
    subtitle: 'Pinpoint the wealth-producing combinations (2nd, 5th, 9th, 11th Bhavas) and money cycles in your Kundli.',
    price: 499, originalPrice: 1999, rating: 4.9, reviews: 11200,
    faqs: [
      { q: 'Is it suitable for business owners?', a: 'Yes, ideal for salaried professionals, traders, and entrepreneurs alike.' }
    ]
  },
  {
    key: 'health_vitality_kundli', slug: 'health-vitality-kundli-report', emoji: '🌿',
    title: 'Medical Astrology & Vitality Blueprint — Ayurvedic Balance',
    subtitle: 'Evaluate 6th and 8th house indicators, 7 Chakras alignment, and Tridosha balance.',
    price: 399, originalPrice: 999, rating: 4.8, reviews: 4980,
    faqs: [
      { q: 'Is this medical advice?', a: 'No, this provides astrological and spiritual wellness guidance.' }
    ]
  },
  {
    key: 'foreign_settlement_travel', slug: 'foreign-settlement-travel-report', emoji: '✈️',
    title: 'Foreign Settlement & PR Immigration Report — Global Destiny',
    subtitle: 'Discover 12th, 9th, and 4th house foreign travel indicators, auspicious visa timing, and settlement yogas.',
    price: 499, originalPrice: 1499, rating: 4.9, reviews: 7890,
    faqs: [
      { q: 'Does it predict specific countries?', a: 'Yes, based on directional strengths and zodiac element compatibility.' }
    ]
  },
  {
    key: 'mangal_dosha_analysis', slug: 'mangal-dosha-analysis-report', emoji: '🔥',
    title: 'Complete Manglik Dosha & Remedies Report — Marital Peace',
    subtitle: 'Accurate evaluation of Mars placement, 28 cancellation factors (Bhanga Yogas), and remedies.',
    price: 399, originalPrice: 999, rating: 5.0, reviews: 10400,
    faqs: [
      { q: 'Can a Manglik marry a non-Manglik?', a: 'Yes, if cancellation yogas exist or if the partner has offsetting placements.' }
    ]
  }
];

const prerenderRoute = (route, seo) => {
  let html = template;
  
  html = html.replace(/<title>.*?<\/title>/, `<title>${seo.title}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${seo.description}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${seo.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${seo.description}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${seo.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${seo.description}" />`);
  
  const canonicalUrl = `https://ankjyotishai.com${route}`;
  html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`);
  // Keep div id=root clean so React mounts cleanly without showing raw unstyled text
  // html = html.replace('<div id="root"></div>', `<div id="root">${seo.body}</div>`);

  const targetDir = route === '/' ? distDir : path.join(distDir, route);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(targetDir, 'index.html'), html);
  console.log(`Pre-rendered route: ${route}`);
};

const main = async () => {
  // 1. Homepage
  prerenderRoute('/', {
    title: 'AnkJyotish AI — Expert Vedic Numerology & Reports',
    description: 'Get accurate psychic & destiny numbers, daily predictions, and advanced paid report blueprints with AnkJyotish AI.',
    body: `
      <main style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #fff; background: #0c0814;">
        <header style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 2.5rem; color: #a78bfa;">AnkJyotish AI — Advanced Vedic & Chaldean Numerology</h1>
          <p style="font-size: 1.2rem; color: #cbd5e1;">Discover your psychic & destiny path using consultant-grade intelligence.</p>
        </header>
        <section style="margin-bottom: 30px;">
          <h2 style="color: #fbbf24;">Vedic Numerology Calculator</h2>
          <p>Calculate your Mulank (Driver), Bhagyank (Destiny), and Soul Urge numbers instantly. Get personalized insights based on your birth date and full birth name.</p>
        </section>
        <section style="margin-bottom: 30px;">
          <h2 style="color: #fbbf24;">Our Paid Numerology Reports</h2>
          <ul>
            <li><strong>Lucky Baby Name Report (₹399):</strong> Choose a spelling that aligns with the baby's lucky planet.</li>
            <li><strong>Name Correction Report (₹399):</strong> Fine-tune your spelling for professional growth.</li>
            <li><strong>Relationship Compatibility (₹449):</strong> Detail match scores, strengths, and remedies.</li>
            <li><strong>Marriage Timing (₹449):</strong> Plan with a 5-year timeline.</li>
            <li><strong>Career & Job Prediction (₹499):</strong> Map your path with the NIKB matrix.</li>
          </ul>
        </section>
      </main>
    `
  });

  // 2. Reports Catalog
  prerenderRoute('/reports', {
    title: 'Numerology Reports Catalog | AnkJyotish AI',
    description: 'Choose from our suite of professional numerology reports: Baby Name, Name Correction, Relationship Compatibility, Marriage Timing, and Career.',
    body: `
      <main style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #fff; background: #0c0814;">
        <h1 style="font-size: 2rem; color: #a78bfa; text-align: center; margin-bottom: 20px;">Professional Numerology Reports</h1>
        <p style="text-align: center; margin-bottom: 40px; color: #cbd5e1;">Get premium, consultant-grade numerology PDFs generated instantly with advanced AI and NIKB database intelligence.</p>
        <div style="display: grid; gap: 20px;">
          ${REPORTS.map(r => `
            <div style="border: 1px solid #334155; padding: 20px; border-radius: 8px;">
              <h2>${r.emoji} ${r.title.split('—')[0].trim()}</h2>
              <p>${r.subtitle}</p>
              <a href="/report/${r.slug}" style="color: #a78bfa; font-weight: bold;">View Details & Buy — ₹${r.price}</a>
            </div>
          `).join('')}
        </div>
      </main>
    `
  });

  // 3. Plus Page
  prerenderRoute('/plus', {
    title: 'Plus Membership & Lifetime Moat | AnkJyotish AI',
    description: 'Unlock unlimited reports, daily guidance dashboards, and our personal AI consultant chat with AnkJyotish Plus.',
    body: `
      <main style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #fff; background: #0c0814;">
        <h1 style="font-size: 2rem; color: #a78bfa; text-align: center; margin-bottom: 20px;">AnkJyotish Plus Membership</h1>
        <p style="text-align: center; margin-bottom: 40px; color: #cbd5e1;">Unlock unlimited reports, detailed life blueprints, and personal AI guidance forever.</p>
        <section style="margin-bottom: 30px; border: 1px solid #7c3aed; padding: 20px; border-radius: 8px;">
          <h2>Choose Your Plan</h2>
          <p><strong>Monthly Pass (₹99):</strong> Get access to daily predictions and standard reports.</p>
          <p><strong>Master Plan (₹999):</strong> Get lifetime access to all 9 paid reports + personalized AI consultant chat.</p>
        </section>
      </main>
    `
  });

  // 4. About Page
  prerenderRoute('/about', {
    title: 'About AnkJyotish AI | Expert Vedic & Chaldean Numerology',
    description: 'Learn about our consultant-grade Vedic and Chaldean engine, combining ancient wisdom with AI-powered personalized insights.',
    body: `
      <main style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #fff; background: #0c0814;">
        <h1 style="font-size: 2rem; color: #a78bfa; text-align: center; margin-bottom: 20px;">About AnkJyotish AI</h1>
        <p>AnkJyotish AI is a state-of-the-art numerology platform that bridges ancient Vedic & Chaldean wisdom with modern AI technologies. Unlike simple tools that provide generic statements, our system calculates over 20 parameters including Loshu grids, pinnacle cycles, and Planes of Expression to generate consultant-grade, hyper-personalized reports.</p>
      </main>
    `
  });

  // 5. Report Landing Pages (9 pages)
  REPORTS.forEach(r => {
    prerenderRoute(`/report/${r.slug}`, {
      title: `${r.title.split('—')[0].trim()} | AnkJyotish AI`,
      description: r.subtitle,
      body: `
        <main style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #fff; background: #0c0814;">
          <header style="text-align: center; margin-bottom: 40px;">
            <span style="font-size: 3rem;">${r.emoji}</span>
            <h1 style="font-size: 2.2rem; color: #a78bfa; margin-top: 10px;">${r.title}</h1>
            <p style="font-size: 1.1rem; color: #cbd5e1; margin-top: 10px;">${r.subtitle}</p>
            <div style="font-size: 1.3rem; font-weight: bold; margin-top: 15px; color: #fbbf24;">
              Price: ₹${r.price} <span style="text-decoration: line-through; font-size: 1rem; color: #94a3b8; font-weight: normal;">₹${r.originalPrice}</span>
            </div>
          </header>
          
          <section style="margin-bottom: 30px; border-top: 1px solid #334155; padding-top: 20px;">
            <h2 style="color: #fbbf24;">Frequently Asked Questions</h2>
            <ul style="list-style: none; padding: 0;">
              ${r.faqs.map(faq => `
                <li style="margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">
                  <strong style="color: #cbd5e1; font-size: 1.1rem; display: block; margin-bottom: 5px;">Q: ${faq.q}</strong>
                  <p style="color: #94a3b8; line-height: 1.6; margin: 0;">A: ${faq.a}</p>
                </li>
              `).join('')}
            </ul>
          </section>
        </main>
      `
    });
  });

  // 6. Dynamic Blog and Blog post pages (fetched from DB)
  let posts = [];
  const supabaseUrl = env['VITE_SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const supabaseKey = env['VITE_SUPABASE_PUBLISHABLE_KEY'] || process.env['VITE_SUPABASE_PUBLISHABLE_KEY'];

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/blog_posts?status=eq.published&select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (res.ok) {
        posts = await res.json();
        console.log(`Fetched ${posts.length} published blog posts for pre-rendering.`);
      } else {
        console.error(`Failed to fetch blog posts: ${res.statusText}`);
      }
    } catch (err) {
      console.error('Failed to fetch blog posts from Supabase', err);
    }
  }

  // Blog Page Listing
  prerenderRoute('/blog', {
    title: 'Numerology Blog - Ankjyotish | Vedic Insights & Guidance',
    description: 'Read expert articles on numerology, Mulank, Bhagyank, life path, master numbers, and Vedic spiritual guidance.',
    body: `
      <main style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #fff; background: #0c0814;">
        <h1 style="font-size: 2rem; color: #a78bfa; text-align: center; margin-bottom: 20px;">Numerology Insights & Blog</h1>
        <p style="text-align: center; margin-bottom: 40px; color: #cbd5e1;">Read our latest articles on Mulank, Bhagyank, name correction, and Vedic guidance.</p>
        <div style="display: grid; gap: 20px;">
          ${posts.length === 0 ? '<p style="text-align: center; color: #94a3b8;">No blog posts available yet.</p>' : posts.map(p => `
            <div style="border: 1px solid #334155; padding: 20px; border-radius: 8px;">
              <h2>${p.title}</h2>
              <p style="color: #94a3b8; font-size: 0.95rem;">${p.meta_description || ''}</p>
              <a href="/blog/${p.slug}" style="color: #a78bfa; font-weight: bold;">Read Article →</a>
            </div>
          `).join('')}
        </div>
      </main>
    `
  });

  // Blog post pages
  posts.forEach(p => {
    prerenderRoute(`/blog/${p.slug}`, {
      title: `${p.title} | AnkJyotish Blog`,
      description: p.meta_description || p.title,
      body: `
        <main style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #fff; background: #0c0814;">
          <article>
            <header style="margin-bottom: 40px; text-align: center;">
              <h1 style="font-size: 2.5rem; color: #a78bfa; line-height: 1.2;">${p.title}</h1>
              <div style="font-size: 0.9rem; color: #94a3b8; margin-top: 10px;">
                By ${p.author || 'AnkJyotish AI'} | Published on ${p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Recent'}
              </div>
            </header>
            <section style="font-size: 1.1rem; line-height: 1.7; color: #e2e8f0; border-top: 1px solid #334155; padding-top: 25px;">
              ${p.content}
            </section>
          </article>
        </main>
      `
    });
  });

  console.log('Pre-rendering pipeline completed successfully!');
};

main().catch(err => {
  console.error('Error during pre-rendering', err);
  process.exit(1);
});
