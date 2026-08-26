// Phase 5: Tiered pricing system
export type Tier = 'glimpse' | 'starter' | 'pro' | 'master' | 'addon';

export interface TierDef {
  id: Tier;
  price: number;
  originalPrice?: number;
  rank: number;
}

export const TIERS: Record<Tier, TierDef> = {
  glimpse: { id: 'glimpse', price: 0, rank: 0 },
  starter: { id: 'starter', price: 299, originalPrice: 599, rank: 1 },
  addon:   { id: 'addon',   price: 199, originalPrice: 499, rank: 1 },
  pro:     { id: 'pro',     price: 599, originalPrice: 1299, rank: 2 },
  master:  { id: 'master',  price: 999, originalPrice: 2499, rank: 3 },
};

export const tierRank = (t: Tier) => TIERS[t]?.rank ?? 0;
export const hasAccess = (unlocked: Tier, required: Tier) =>
  tierRank(unlocked) >= tierRank(required);

export const TIER_CONTENT = {
  en: {
    starter: {
      name: 'Starter Plan',
      tagline: 'Get clarity today',
      features: [
        '5 Life Pillars (Career, Love, Money, Health, Growth)',
        '12-month personalized forecast timeline',
        'Vedic Lucky Alignment (numbers, colors, days, directions)',
        'Core Numbers breakdown (Mulank, Bhagyank, Naamank)',
        'Interactive Decision Engine (3 questions)',
        'Shareable visual summary card',
        'Lifetime digital access on dashboard',
      ],
    },
    pro: {
      name: 'Pro Plan',
      tagline: 'Most popular',
      features: [
        'Everything in Starter Plan included',
        'Complete Lo Shu Grid Matrix (9-box audit + missing numbers)',
        'Karmic Debt identification (13, 14, 16, 19) & remedies',
        'Famous Personalities match (compare with 50+ icons)',
        'Daily & Personal Month micro-forecasts',
        'Decision Engine (unlimited questions)',
        'Instant High-Res One-Pager PDF download',
        'Full access to 10 Interactive Vibration tools',
      ],
    },
    master: {
      name: 'Master Plan',
      tagline: 'Best value',
      features: [
        'Everything in Pro Plan included',
        '4 Life Pinnacles & Challenge Cycles (4 life age phases)',
        'Maturity, Essence & Hidden Passion numbers',
        'Karmic Lessons + Subconscious Balance score',
        'Love & Marriage Compatibility report',
        '10-year life roadmap & career peak timing',
        '100+ page premium branded PDF report',
        '15 free AI Chatbot sessions (context-aware memory)',
        '1 free family report bonus (₹299 value)',
      ],
    },
  },
  hi: {
    starter: {
      name: 'स्टार्टर प्लान',
      tagline: 'आज ही स्पष्टता पाएं',
      features: [
        '5 जीवन स्तंभ विश्लेषण (करियर, प्रेम, धन, स्वास्थ्य, विकास)',
        '12-महीने का व्यक्तिगत पूर्वानुमान टाइमलाइन',
        'वैदिक लकी अलाइनमेंट (अंक, रंग, दिन, दिशाएं)',
        'मुख्य अंक विश्लेषण (मूलांक, भाग्यांक, नामांक)',
        'इंटरएक्टिव निर्णय इंजन (3 प्रश्न)',
        'शेयर करने योग्य दृश्य सारांश कार्ड',
        'डैशबोर्ड पर आजीवन डिजिटल पहुंच',
      ],
    },
    pro: {
      name: 'प्रो प्लान',
      tagline: 'सबसे लोकप्रिय',
      features: [
        'स्टार्टर प्लान की सभी सुविधाएं शामिल',
        'पूर्ण लोशू ग्रिड मैट्रिक्स (9-बॉक्स ऑडिट + अनुपस्थित अंक)',
        'कार्मिक ऋण पहचान (13, 14, 16, 19) और उपाय',
        'प्रसिद्ध व्यक्तित्व मिलान (50+ हस्तियों से तुलना)',
        'दैनिक एवं व्यक्तिगत माह सूक्ष्म-पूर्वानुमान',
        'निर्णय इंजन (असीमित प्रश्न)',
        'तत्काल हाई-रेज वन-पेजर PDF डाउनलोड',
        '10 इंटरएक्टिव वाइब्रेशन टूल्स तक पूर्ण पहुंच',
      ],
    },
    master: {
      name: 'मास्टर प्लान',
      tagline: 'सर्वश्रेष्ठ मूल्य',
      features: [
        'प्रो प्लान की सभी सुविधाएं शामिल',
        '4 पिनेकल एवं चैलेंज चक्र (4 जीवन आयु चरण)',
        'परिपक्वता, सार एवं छिपा जुनून अंक',
        'कार्मिक पाठ + अवचेतन संतुलन अंक',
        'प्रेम एवं विवाह अनुकूलता विस्तृत रिपोर्ट',
        '10-वर्षीय जीवन रोडमैप एवं करियर पीक टाइमिंग',
        '100+ पृष्ठों की प्रीमियम ब्रांडेड PDF रिपोर्ट',
        '15 निःशुल्क AI चैटबॉट सत्र (स्मृति-संचालित)',
        '1 निःशुल्क पारिवारिक रिपोर्ट बोनस (₹299 मूल्य)',
      ],
    },
  },
  hinglish: {
    starter: {
      name: 'Starter Plan',
      tagline: 'Aaj hi clarity paayein',
      features: [
        '5 Life Pillars Analysis (Career, Love, Money, Health, Growth)',
        '12-month personalized forecast timeline',
        'Vedic Lucky Alignment (numbers, colors, days, directions)',
        'Core Numbers breakdown (Mulank, Bhagyank, Naamank)',
        'Interactive Decision Engine (3 questions)',
        'Shareable visual summary card',
        'Dashboard par lifetime digital access',
      ],
    },
    pro: {
      name: 'Pro Plan',
      tagline: 'Most popular',
      features: [
        'Starter Plan ka sab kuch included',
        'Complete Lo Shu Grid Matrix (9-box audit + missing numbers)',
        'Karmic Debt identification (13, 14, 16, 19) & remedies',
        'Famous Personalities match (50+ icons se compare)',
        'Daily & Personal Month micro-forecasts',
        'Decision Engine (unlimited questions)',
        'Instant High-Res One-Pager PDF download',
        'Full access to 10 Interactive Vibration tools',
      ],
    },
    master: {
      name: 'Master Plan',
      tagline: 'Best value',
      features: [
        'Pro Plan ka sab kuch included',
        '4 Life Pinnacles & Challenge Cycles (4 life age phases)',
        'Maturity, Essence & Hidden Passion numbers',
        'Karmic Lessons + Subconscious Balance score',
        'Love & Marriage Compatibility report',
        '10-year life roadmap & career peak timing',
        '100+ page premium branded PDF report',
        '15 free AI Chatbot sessions (context memory-backed)',
        '1 free family report bonus (₹299 value)',
      ],
    },
  },
} as const;
