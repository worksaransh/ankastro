/**
 * Unified Vedic Astrology & Deep Numerology Cross-System Synthesis Engine
 * Synthesizes Mulank, Bhagyank, Namaank, and Lo Shu Grid with Vedic Janam Kundli,
 * Lagna Lord, 10th House Karma Grahas, Vimshottari Mahadasha, and Sade Sati.
 */

export interface PlanetaryPosition {
  planet: string;
  sign: string;
  signNumber: number; // 1-12
  house: number; // 1-12
  degree: number;
  nakshatra: string;
  pada: number;
  isRetrograde: boolean;
  dignity: 'Exalted' | 'Own Sign' | 'Moolatrikona' | 'Friend' | 'Neutral' | 'Enemy' | 'Debilitated';
}

export interface KundliData {
  lagnaSign: string;
  lagnaSignNumber: number;
  lagnaLord: string;
  moonSign: string;
  moonNakshatra: string;
  sunSign: string;
  activeMahadasha: {
    lord: string;
    startDate: string;
    endDate: string;
    antardashaLord: string;
  };
  sadeSati: {
    isActive: boolean;
    phase?: 'Rising' | 'Peak' | 'Setting';
    description: string;
  };
  manglikDosha: {
    hasDosha: boolean;
    intensity: 'None' | 'Low' | 'High' | 'Cancelled';
    reason: string;
  };
  planets: PlanetaryPosition[];
}

export interface NumerologyData {
  mulank: number;
  mulankPlanet: string;
  bhagyank: number;
  bhagyankPlanet: string;
  namaank: number;
  chaldeanVibration: number;
  personalYear: number;
  loShuActivePlanes: string[];
  missingNumbers: number[];
}

export interface CrossSystemSynthesis {
  overallSynergyScore: number; // 0-100%
  rulerRelationship: {
    mulankVsLagna: 'Harmonious' | 'Neutral' | 'Challenging';
    explanation: string;
  };
  careerSynergy: {
    title: string;
    verdict: string;
    bestFields: string[];
    alignmentScore: number;
  };
  wealthAndFinancialTrajectory: {
    primaryWealthGraha: string;
    bhagyankActivationYear: number;
    financialSecret: string;
  };
  unifiedRemedialMatrix: {
    primaryGemstone: string;
    alternativeGemstone: string;
    rudrakshaMukhi: string;
    yantraDirection: string;
    beejMantra: string;
    cosmicColor: string;
    remedyExplanation: string;
  };
  crossInsights: string[];
}

// Planetary friendship lookup matrix
const PLANET_FRIENDSHIPS: Record<string, { friends: string[]; enemies: string[]; neutrals: string[] }> = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn', 'Rahu', 'Ketu'], neutrals: ['Mercury'] },
  Moon: { friends: ['Sun', 'Mercury'], enemies: ['Rahu', 'Ketu'], neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury', 'Rahu'], neutrals: ['Venus', 'Saturn'] },
  Mercury: { friends: ['Sun', 'Venus'], enemies: ['Moon'], neutrals: ['Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'], neutrals: ['Saturn', 'Rahu', 'Ketu'] },
  Venus: { friends: ['Mercury', 'Saturn', 'Rahu'], enemies: ['Sun', 'Moon'], neutrals: ['Mars', 'Jupiter'] },
  Saturn: { friends: ['Mercury', 'Venus', 'Rahu'], enemies: ['Sun', 'Moon', 'Mars'], neutrals: ['Jupiter'] },
  Rahu: { friends: ['Mercury', 'Venus', 'Saturn'], enemies: ['Sun', 'Moon', 'Mars'], neutrals: ['Jupiter'] },
  Ketu: { friends: ['Mars', 'Venus', 'Saturn'], enemies: ['Sun', 'Moon'], neutrals: ['Mercury', 'Jupiter'] }
};

const MULANK_PLANET_MAP: Record<number, string> = {
  1: 'Sun',
  2: 'Moon',
  3: 'Jupiter',
  4: 'Rahu',
  5: 'Mercury',
  6: 'Venus',
  7: 'Ketu',
  8: 'Saturn',
  9: 'Mars'
};

const ZODIAC_SIGNS = [
  'Mesha (Aries ♈)', 'Vrishabha (Taurus ♉)', 'Mithuna (Gemini ♊)', 'Karka (Cancer ♋)',
  'Simha (Leo ♌)', 'Kanya (Virgo ♍)', 'Tula (Libra ♎)', 'Vrishchika (Scorpio ♏)',
  'Dhanu (Sagittarius ♐)', 'Makara (Capricorn ♑)', 'Kumbha (Aquarius ♒)', 'Meena (Pisces ♓)'
];

const SIGN_LORDS: Record<number, string> = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon',
  5: 'Sun', 6: 'Mercury', 7: 'Venus', 8: 'Mars',
  9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
};

/**
 * Generate simulated or computed Kundli parameters from DOB & Time
 */
export function deriveKundliData(dob: string, birthTime?: string): KundliData {
  const parts = dob.split('-');
  const year = parseInt(parts[0] || '1995', 10);
  const month = parseInt(parts[1] || '1', 10);
  const day = parseInt(parts[2] || '1', 10);

  // Time-based Lagna derivation (approx 2 hours per sign)
  const timeParts = (birthTime || '12:00').split(':');
  const hour = parseInt(timeParts[0] || '12', 10);
  const lagnaIndex = ((month * 2 + Math.floor(hour / 2) + day) % 12) + 1;
  const lagnaSign = ZODIAC_SIGNS[lagnaIndex - 1];
  const lagnaLord = SIGN_LORDS[lagnaIndex] || 'Sun';

  const moonSignIndex = ((day * 2 + month) % 12) + 1;
  const moonSign = ZODIAC_SIGNS[moonSignIndex - 1];

  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];
  const moonNakshatra = nakshatras[(day + month * 2) % 27];

  const dashaLords = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus'];
  const activeDashaLord = dashaLords[(year + day) % dashaLords.length];

  const planets: PlanetaryPosition[] = [
    { planet: 'Sun (Surya)', sign: ZODIAC_SIGNS[(month + 3) % 12], signNumber: ((month + 3) % 12) + 1, house: ((month + lagnaIndex) % 12) + 1, degree: 14.5, nakshatra: nakshatras[(month * 2) % 27], pada: 2, isRetrograde: false, dignity: 'Own Sign' },
    { planet: 'Moon (Chandra)', sign: moonSign, signNumber: moonSignIndex, house: ((moonSignIndex - lagnaIndex + 12) % 12) + 1, degree: 22.1, nakshatra: moonNakshatra, pada: 1, isRetrograde: false, dignity: 'Friend' },
    { planet: 'Mars (Mangal)', sign: ZODIAC_SIGNS[(day) % 12], signNumber: (day % 12) + 1, house: ((day + lagnaIndex) % 12) + 1, degree: 8.3, nakshatra: nakshatras[day % 27], pada: 3, isRetrograde: false, dignity: 'Moolatrikona' },
    { planet: 'Mercury (Budh)', sign: ZODIAC_SIGNS[(month + 4) % 12], signNumber: ((month + 4) % 12) + 1, house: ((month + 1 + lagnaIndex) % 12) + 1, degree: 19.8, nakshatra: nakshatras[(month + 5) % 27], pada: 4, isRetrograde: true, dignity: 'Exalted' },
    { planet: 'Jupiter (Guru)', sign: ZODIAC_SIGNS[(year % 12)], signNumber: (year % 12) + 1, house: ((year + lagnaIndex) % 12) + 1, degree: 27.2, nakshatra: nakshatras[(year % 27)], pada: 1, isRetrograde: false, dignity: 'Friend' },
    { planet: 'Venus (Shukra)', sign: ZODIAC_SIGNS[(month + 2) % 12], signNumber: ((month + 2) % 12) + 1, house: ((month + 2 + lagnaIndex) % 12) + 1, degree: 11.4, nakshatra: nakshatras[(month + 2) % 27], pada: 2, isRetrograde: false, dignity: 'Own Sign' },
    { planet: 'Saturn (Shani)', sign: ZODIAC_SIGNS[((Math.floor(year / 2.5)) % 12)], signNumber: (((Math.floor(year / 2.5)) % 12)) + 1, house: (((Math.floor(year / 2.5)) + lagnaIndex) % 12) + 1, degree: 5.9, nakshatra: nakshatras[17], pada: 3, isRetrograde: false, dignity: 'Neutral' },
    { planet: 'Rahu', sign: ZODIAC_SIGNS[(year + 3) % 12], signNumber: ((year + 3) % 12) + 1, house: ((year + 3 + lagnaIndex) % 12) + 1, degree: 18.2, nakshatra: nakshatras[9], pada: 1, isRetrograde: true, dignity: 'Friend' },
    { planet: 'Ketu', sign: ZODIAC_SIGNS[(year + 9) % 12], signNumber: ((year + 9) % 12) + 1, house: ((year + 9 + lagnaIndex) % 12) + 1, degree: 18.2, nakshatra: nakshatras[22], pada: 1, isRetrograde: true, dignity: 'Neutral' }
  ];

  // Manglik Check (Mars in 1, 4, 7, 8, 12)
  const marsHouse = planets.find(p => p.planet.includes('Mars'))?.house || 1;
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

  return {
    lagnaSign,
    lagnaSignNumber: lagnaIndex,
    lagnaLord,
    moonSign,
    moonNakshatra,
    sunSign: ZODIAC_SIGNS[(month + 3) % 12],
    activeMahadasha: {
      lord: activeDashaLord,
      startDate: '2022-04-15',
      endDate: '2030-04-15',
      antardashaLord: 'Mercury'
    },
    sadeSati: {
      isActive: [10, 11, 12].includes(moonSignIndex),
      phase: moonSignIndex === 11 ? 'Peak' : moonSignIndex === 10 ? 'Rising' : 'Setting',
      description: [10, 11, 12].includes(moonSignIndex)
        ? 'Active Sade Sati phase. Diligent spiritual discipline and Saturnian focus required.'
        : 'No Sade Sati active at this time. Smooth transit for emotional stability.'
    },
    manglikDosha: {
      hasDosha: isManglik,
      intensity: isManglik ? 'Low' : 'None',
      reason: isManglik ? `Mars situated in Bhava ${marsHouse}` : 'Mars well-placed in auspicious house'
    },
    planets
  };
}

/**
 * Compute the Cross-System Synergy between Numerology & Vedic Kundli
 */
export function computeCrossSystemSynthesis(
  num: NumerologyData,
  kundli: KundliData
): CrossSystemSynthesis {
  const mulankRuler = MULANK_PLANET_MAP[num.mulank] || 'Sun';
  const lagnaLord = kundli.lagnaLord;

  const relationship = PLANET_FRIENDSHIPS[mulankRuler];
  let rulerRel: 'Harmonious' | 'Neutral' | 'Challenging' = 'Harmonious';

  if (relationship?.friends.includes(lagnaLord) || mulankRuler === lagnaLord) {
    rulerRel = 'Harmonious';
  } else if (relationship?.enemies.includes(lagnaLord)) {
    rulerRel = 'Challenging';
  } else {
    rulerRel = 'Neutral';
  }

  // Synergy Score (Base 70 + 15 if ruler harmonious + 15 if Lo Shu has active planes)
  let synergyScore = 75;
  if (rulerRel === 'Harmonious') synergyScore += 15;
  if (rulerRel === 'Challenging') synergyScore -= 10;
  if (num.loShuActivePlanes.length >= 2) synergyScore += 10;
  synergyScore = Math.min(98, Math.max(55, synergyScore));

  // Cross Insights
  const crossInsights: string[] = [
    `Psychic Driver (Mulank ${num.mulank} - ${mulankRuler}) resonates directly with your Ascendant Lord (${lagnaLord}), creating a ${rulerRel.toLowerCase()} life orientation.`,
    `Your Life Path Force (Bhagyank ${num.bhagyank}) activates the 10th Bhava (Karma Sthana) of your Kundli during personal year cycles ${num.bhagyank} and ${num.mulank}.`,
    `Active Mahadasha of ${kundli.activeMahadasha.lord} harmonizes with Chaldean Name Vibration ${num.namaank}, accelerating manifestation when names are balanced.`,
    kundli.sadeSati.isActive 
      ? `Shani Sade Sati (${kundli.sadeSati.phase} phase) demands karmic discipline aligned with Mulank ${num.mulank} perseverance remedies.`
      : `Planetary transits are clear of Saturnian afflictions, allowing rapid execution of your Lo Shu Will Plane (9-5-1).`
  ];

  // Prescriptions
  const GEMSTONE_MAP: Record<number, { primary: string; alt: string; rudraksha: string; color: string }> = {
    1: { primary: 'Certified Burma Ruby (Manikya)', alt: 'Red Garnet', rudraksha: '1 or 12 Mukhi', color: 'Imperial Crimson / Gold' },
    2: { primary: 'Natural Basra Pearl (Moti)', alt: 'Moonstone', rudraksha: '2 Mukhi', color: 'Pearl White / Silver' },
    3: { primary: 'Ceylon Yellow Sapphire (Pukhraj)', alt: 'Yellow Topaz', rudraksha: '5 Mukhi', color: 'Royal Saffron / Golden Yellow' },
    4: { primary: 'African Hessonite (Gomed)', alt: 'Honey Spessartite', rudraksha: '8 Mukhi', color: 'Smoky Grey / Electric Blue' },
    5: { primary: 'Zambian Emerald (Panna)', alt: 'Green Tourmaline', rudraksha: '4 or 10 Mukhi', color: 'Emerald Green / Quicksilver' },
    6: { primary: 'Natural Diamond / White Zircon', alt: 'White Sapphire', rudraksha: '6 or 7 Mukhi', color: 'Diamond White / Lavender' },
    7: { primary: 'Chrysoberyl Cat\'s Eye (Lehsuniya)', alt: 'Tiger Eye', rudraksha: '9 Mukhi', color: 'Smoky Ash / Turquoise' },
    8: { primary: 'Ceylon Blue Sapphire (Neelam)', alt: 'Amethyst / Iolite', rudraksha: '7 or 14 Mukhi', color: 'Obsidian Black / Midnight Navy' },
    9: { primary: 'Italian Red Coral (Moonga)', alt: 'Carnelian', rudraksha: '3 Mukhi', color: 'Mars Scarlet / Blood Red' }
  };

  const remedy = GEMSTONE_MAP[num.mulank] || GEMSTONE_MAP[1];

  return {
    overallSynergyScore: synergyScore,
    rulerRelationship: {
      mulankVsLagna: rulerRel,
      explanation: rulerRel === 'Harmonious'
        ? `Your Mulank Lord (${mulankRuler}) and Lagna Lord (${lagnaLord}) share strong planetary camaraderie, granting natural leadership and swift manifestation.`
        : rulerRel === 'Challenging'
        ? `A slight planetary tension exists between ${mulankRuler} and ${lagnaLord}. Remedial mantra japa and gemstone alignment resolve internal conflicts.`
        : `Your psychic ruler (${mulankRuler}) and bodily ruler (${lagnaLord}) maintain neutral synergy, giving balanced analytical and practical execution.`
    },
    careerSynergy: {
      title: 'High-Impact Executive & Strategic Leadership',
      verdict: 'Your 10th House Karma Lord and Bhagyank intersect in high-authority domains.',
      bestFields: [
        'Strategic Tech & Architecture',
        'Executive Management & Advisory',
        'FinTech & Enterprise Scaling',
        'Creative Media & Brand Building'
      ],
      alignmentScore: synergyScore
    },
    wealthAndFinancialTrajectory: {
      primaryWealthGraha: kundli.lagnaLord,
      bhagyankActivationYear: 28 + num.bhagyank,
      financialSecret: `Your 2nd House of Dhana and 11th House of Labha reach compounding returns in Personal Year ${num.bhagyank}.`
    },
    unifiedRemedialMatrix: {
      primaryGemstone: remedy.primary,
      alternativeGemstone: remedy.alt,
      rudrakshaMukhi: remedy.rudraksha,
      yantraDirection: num.mulank % 2 === 0 ? 'North-East (Ishanya)' : 'East (Poorva)',
      beejMantra: `Om Hreem Suryaye Namah (108 Japa)`,
      cosmicColor: remedy.color,
      remedyExplanation: `Wearing ${remedy.primary} on your auspicious day energizes your ${kundli.lagnaLord} Lagna and Mulank ${num.mulank} psychic vitality.`
    },
    crossInsights
  };
}
