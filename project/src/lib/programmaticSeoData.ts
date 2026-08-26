export interface MulankSeoData {
  mulank: number;
  planet: string;
  element: string;
  deity: string;
  title: string;
  summary: string;
  personalityTraits: string[];
  careerPaths: string[];
  luckyDays: string[];
  luckyColors: string[];
  luckyGems: string[];
  karmicChallenge: string;
  remedyText: string;
  faqs: { q: string; a: string }[];
}

export const MULANK_PSEO_DATA: Record<number, MulankSeoData> = {
  1: {
    mulank: 1,
    planet: 'Sun (Surya)',
    element: 'Fire',
    deity: 'Lord Surya',
    title: 'Mulank 1 Numerology — Leadership, Sun Vibration & Destiny Blueprint',
    summary: 'Mulank 1 is ruled by the Sun (Surya). People born on 1st, 10th, 19th, or 28th of any month are natural leaders, ambitious, independent, and creative pioneers.',
    personalityTraits: ['Natural Born Leader', 'Independent Thinker', 'High Ambition & Drive', 'Creative Pioneer', 'Protective & Authoritative'],
    careerPaths: ['Government Services & Politics', 'CEO & Entrepreneurship', 'Management & Leadership', 'Innovation & Tech Founder'],
    luckyDays: ['Sunday', 'Monday'],
    luckyColors: ['Gold', 'Orange', 'Yellow', 'Ruby Red'],
    luckyGems: ['Ruby (Manikya)', 'Red Garnet'],
    karmicChallenge: 'Ego conflicts, over-dominance, and impatience with slower team members.',
    remedyText: 'Offer Arghya (water) to the rising Sun every morning reciting Surya Beej Mantra: Om Hram Hreem Hroum Sah Suryaya Namah.',
    faqs: [
      { q: 'Which dates correspond to Mulank 1?', a: 'People born on 1st, 10th, 19th, or 28th of any month have Mulank 1.' },
      { q: 'What is the ruling planet for Mulank 1?', a: 'Mulank 1 is ruled by Lord Surya (The Sun).' },
      { q: 'Which numbers are most compatible with Mulank 1?', a: 'Mulank 1 is highly compatible with 2, 3, 5, and 9.' },
    ],
  },
  2: {
    mulank: 2,
    planet: 'Moon (Chandra)',
    element: 'Water',
    deity: 'Lord Shiva / Chandra Dev',
    title: 'Mulank 2 Numerology — Sensitivity, Moon Vibration & Intuition',
    summary: 'Mulank 2 is ruled by the Moon (Chandra). Born on 2nd, 11th, 20th, or 29th, individuals with Mulank 2 are intuitive, diplomatic, peace-loving, and deeply emotional.',
    personalityTraits: ['High Intuition & Empathy', 'Diplomatic Peacemaker', 'Artistic Sensitivity', 'Gentle & Cooperative'],
    careerPaths: ['Counseling & Psychology', 'Arts, Music & Poetry', 'Hospitality & HR', 'Diplomacy & Public Relations'],
    luckyDays: ['Monday', 'Sunday'],
    luckyColors: ['White', 'Cream', 'Silver', 'Pearl'],
    luckyGems: ['Natural Pearl (Moti)', 'Moonstone'],
    karmicChallenge: 'Mood swings, over-sensitivity, and dependence on external validation.',
    remedyText: 'Offer raw milk and water to Shivling on Mondays while chanting Om Namah Shivaya.',
    faqs: [
      { q: 'Which dates correspond to Mulank 2?', a: 'People born on 2nd, 11th, 20th, or 29th of any month have Mulank 2.' },
      { q: 'What is the ruling planet for Mulank 2?', a: 'Mulank 2 is ruled by Lord Chandra (The Moon).' },
    ],
  },
  3: {
    mulank: 3,
    planet: 'Jupiter (Guru)',
    element: 'Ether / Fire',
    deity: 'Lord Vishnu / Brihaspati',
    title: 'Mulank 3 Numerology — Wisdom, Jupiter Energy & Creative Joy',
    summary: 'Mulank 3 is ruled by Jupiter (Guru). Born on 3rd, 12th, 21st, or 30th, Mulank 3 individuals possess immense knowledge, optimism, teaching power, and spiritual wisdom.',
    personalityTraits: ['Wisdom & Knowledge Holder', 'Expressive Speaker', 'Optimistic & Cheerful', 'Spiritual Guidance Provider'],
    careerPaths: ['Teaching & Academics', 'Law & Advisory', 'Writing & Publishing', 'Spiritual Coaching & Healing'],
    luckyDays: ['Thursday', 'Friday'],
    luckyColors: ['Yellow', 'Golden', 'Saffron'],
    luckyGems: ['Yellow Sapphire (Pukhraj)', 'Topaz'],
    karmicChallenge: 'Scattering energies over too many projects, over-spending, and dogmatism.',
    remedyText: 'Apply yellow sandalwood or turmeric tilak on your forehead on Thursdays and chant Om Gram Greem Groum Sah Gurave Namah.',
    faqs: [
      { q: 'Which dates correspond to Mulank 3?', a: 'People born on 3rd, 12th, 21st, or 30th of any month have Mulank 3.' },
      { q: 'What is the ruling planet for Mulank 3?', a: 'Mulank 3 is ruled by Guru Brihaspati (Jupiter).' },
    ],
  },
  4: {
    mulank: 4,
    planet: 'Rahu',
    element: 'Air / Earth',
    deity: 'Goddess Durga',
    title: 'Mulank 4 Numerology — Rahu Vibration, Practicality & Unconventional Mind',
    summary: 'Mulank 4 is ruled by Rahu. Born on 4th, 13th, 22nd, or 31st, people with Mulank 4 are practical, hardworking, analytical, and possess unique revolutionary ideas.',
    personalityTraits: ['Analytical & Systematic', 'Hardworking & Persistent', 'Out-of-the-Box Thinker', 'Rebellious against Injustice'],
    careerPaths: ['Software Engineering & Data Science', 'Architecture & Construction', 'Accountancy & Auditing', 'Research & Technology'],
    luckyDays: ['Sunday', 'Saturday'],
    luckyColors: ['Electric Blue', 'Grey', 'Khaki'],
    luckyGems: ['Hessonite Garnet (Gomedh)'],
    karmicChallenge: 'Sudden ups and downs, skepticism, and unexpected delays in success.',
    remedyText: 'Worship Goddess Durga and feed stray dogs on Saturdays to neutralize Rahu afflictions.',
    faqs: [
      { q: 'Which dates correspond to Mulank 4?', a: 'People born on 4th, 13th, 22nd, or 31st of any month have Mulank 4.' },
      { q: 'What is the ruling planet for Mulank 4?', a: 'Mulank 4 is ruled by Rahu (North Node of the Moon).' },
    ],
  },
  5: {
    mulank: 5,
    planet: 'Mercury (Budh)',
    element: 'Earth',
    deity: 'Lord Ganesha',
    title: 'Mulank 5 Numerology — Communication, Mercury Intelligence & Business Acumen',
    summary: 'Mulank 5 is ruled by Mercury (Budh). Born on 5th, 14th, or 23rd, individuals with Mulank 5 are versatile, fast-thinking, adaptable communicators, and master traders.',
    personalityTraits: ['High Intelligence & Wit', 'Master Communicator', 'Adaptable & Versatile', 'Risk Taker & Trader'],
    careerPaths: ['Sales, Marketing & Media', 'Finance & Trading', 'Journalism & Content Creation', 'Tech Entrepreneurship'],
    luckyDays: ['Wednesday', 'Friday'],
    luckyColors: ['Green', 'Emerald Green', 'Light Blue'],
    luckyGems: ['Emerald (Panna)', 'Peridot'],
    karmicChallenge: 'Restlessness, difficulty staying committed to routine tasks, and nervous anxiety.',
    remedyText: 'Worship Lord Ganesha with green Durva grass on Wednesdays and chant Om Bum Budhaya Namah.',
    faqs: [
      { q: 'Which dates correspond to Mulank 5?', a: 'People born on 5th, 14th, or 23rd of any month have Mulank 5.' },
      { q: 'What is the ruling planet for Mulank 5?', a: 'Mulank 5 is ruled by Lord Budh (Mercury).' },
    ],
  },
  6: {
    mulank: 6,
    planet: 'Venus (Shukra)',
    element: 'Water / Earth',
    deity: 'Goddess Lakshmi / Shukracharya',
    title: 'Mulank 6 Numerology — Luxury, Venus Charm & Harmony',
    summary: 'Mulank 6 is ruled by Venus (Shukra). Born on 6th, 15th, or 24th, Mulank 6 individuals possess magnetic charisma, love for beauty, luxury, art, and nurturing family values.',
    personalityTraits: ['Magnetic Charisma', 'Love for Luxury & Comfort', 'Nurturing & Responsible', 'Artistic & Aesthetic Sensibility'],
    careerPaths: ['Fashion & Interior Design', 'Entertainment & Acting', 'Luxury Brand Management', 'Beauty, Spa & Wellness'],
    luckyDays: ['Friday', 'Tuesday'],
    luckyColors: ['White', 'Pink', 'Light Yellow', 'Sky Blue'],
    luckyGems: ['Diamond (Heera)', 'Opal', 'White Zircon'],
    karmicChallenge: 'Over-attachment to physical comfort, self-sacrifice for ungrateful people, and extravagance.',
    remedyText: 'Worship Goddess Mahalakshmi on Fridays and offer white sweets or rice pudding to young girls.',
    faqs: [
      { q: 'Which dates correspond to Mulank 6?', a: 'People born on 6th, 15th, or 24th of any month have Mulank 6.' },
      { q: 'What is the ruling planet for Mulank 6?', a: 'Mulank 6 is ruled by Shukra Dev (Venus).' },
    ],
  },
  7: {
    mulank: 7,
    planet: 'Ketu',
    element: 'Water',
    deity: 'Lord Ganesha / Lord Narasimha',
    title: 'Mulank 7 Numerology — Mysticism, Ketu Spiritual Depth & Research Mind',
    summary: 'Mulank 7 is ruled by Ketu. Born on 7th, 16th, or 25th, Mulank 7 individuals are deep thinkers, researchers, spiritual seekers, and possess uncanny psychic intuition.',
    personalityTraits: ['Deep Research Mind', 'Spiritual & Philosophical', 'Private & Introverted', 'Psychic Intuition & Insight'],
    careerPaths: ['Scientific Research & Analysis', 'Astrology & Numerology', 'Psychology & Investigation', 'Philosophy & Writing'],
    luckyDays: ['Sunday', 'Monday'],
    luckyColors: ['White', 'Light Green', 'Sky Blue'],
    luckyGems: ['Cat\'s Eye (Lahsuniya)'],
    karmicChallenge: 'Isolation, over-analyzing relationships, and sudden emotional detachments.',
    remedyText: 'Recite Hanuman Chalisa daily and feed street dogs on Saturdays to neutralize Ketu energies.',
    faqs: [
      { q: 'Which dates correspond to Mulank 7?', a: 'People born on 7th, 16th, or 25th of any month have Mulank 7.' },
      { q: 'What is the ruling planet for Mulank 7?', a: 'Mulank 7 is ruled by Ketu (South Node of the Moon).' },
    ],
  },
  8: {
    mulank: 8,
    planet: 'Saturn (Shani)',
    element: 'Earth',
    deity: 'Lord Shani / Lord Hanuman',
    title: 'Mulank 8 Numerology — Saturn Karma, Power, Resilience & Material Empire',
    summary: 'Mulank 8 is ruled by Saturn (Shani). Born on 8th, 17th, or 26th, Mulank 8 individuals endure severe struggles early in life to build massive wealth, authority, and karma.',
    personalityTraits: ['Unshakable Resilience', 'Master of Karma & Wealth', 'Deep Sense of Justice', 'High Execution Capability'],
    careerPaths: ['Real Estate & Infrastructure', 'Corporate Law & Judiciary', 'Mining, Energy & Heavy Industry', 'High Finance & Banking'],
    luckyDays: ['Saturday', 'Friday'],
    luckyColors: ['Dark Blue', 'Black', 'Navy', 'Purple'],
    luckyGems: ['Blue Sapphire (Neelam)', 'Amethyst'],
    karmicChallenge: 'Early life delays, misunderstandings by loved ones, and risk of harshness.',
    remedyText: 'Light a mustard oil lamp (Diya) under a Peepal tree on Saturday evenings and chant Om Sham Shanayscharaya Namah.',
    faqs: [
      { q: 'Which dates correspond to Mulank 8?', a: 'People born on 8th, 17th, or 26th of any month have Mulank 8.' },
      { q: 'What is the ruling planet for Mulank 8?', a: 'Mulank 8 is ruled by Shani Dev (Saturn).' },
    ],
  },
  9: {
    mulank: 9,
    planet: 'Mars (Mangal)',
    element: 'Fire',
    deity: 'Lord Hanuman / Lord Kartikeya',
    title: 'Mulank 9 Numerology — Mars Energy, Bravery, Courage & Humanitarian Power',
    summary: 'Mulank 9 is ruled by Mars (Mangal). Born on 9th, 18th, or 27th, Mulank 9 individuals possess boundless energy, courage, protective fury, and humanitarian passion.',
    personalityTraits: ['Fearless & Courageous', 'High Physical Energy', 'Protective Humanitarian', 'Quick Decision Maker'],
    careerPaths: ['Defense, Police & Military', 'Surgeons & Medical Specialists', 'Sports & Martial Arts', 'Social Reform & Activism'],
    luckyDays: ['Tuesday', 'Thursday'],
    luckyColors: ['Red', 'Maroon', 'Bright Pink'],
    luckyGems: ['Red Coral (Moonga)'],
    karmicChallenge: 'Short temper, impulsiveness, and prone to minor physical injuries.',
    remedyText: 'Chant Hanuman Chalisa every Tuesday and donate red lentils (Masoor Dal) or blood on Tuesdays.',
    faqs: [
      { q: 'Which dates correspond to Mulank 9?', a: 'People born on 9th, 18th, or 27th of any month have Mulank 9.' },
      { q: 'What is the ruling planet for Mulank 9?', a: 'Mulank 9 is ruled by Mangal Dev (Mars).' },
    ],
  },
};

export const getMulankCompatibilityScore = (m1: number, m2: number): { score: number; verdict: string; desc: string } => {
  const sum = (m1 + m2) % 9 || 9;
  const same = m1 === m2;

  if (same) return { score: 85, verdict: 'Harmonious Soul Mirror', desc: 'Deep mutual understanding with shared core planetary traits.' };

  const highPairs = ['1-2', '1-3', '1-5', '1-9', '2-7', '3-9', '5-6', '6-9'];
  const key1 = `${Math.min(m1, m2)}-${Math.max(m1, m2)}`;

  if (highPairs.includes(key1)) {
    return { score: 92, verdict: 'Highly Auspicious Match', desc: 'Complementary energies resulting in rapid spiritual and material progress.' };
  }

  return { score: 78, verdict: 'Balanced Growth Partnership', desc: 'Requires conscious communication and understanding of planetary differences.' };
};
