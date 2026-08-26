// Advanced Numerology Calculations: Loshu Grid, Pinnacle Cycles, Challenge Numbers, Karmic Debt

import { reduceToSingleDigit } from './numerology';

// ============= LOSHU GRID =============
export interface LoshuGrid {
  grid: number[][]; // 3x3 grid with counts
  present: number[];
  missing: number[];
  overloaded: number[]; // numbers appearing 3+ times
  analysis: {
    mentalPlane: { numbers: number[]; strength: 'weak' | 'moderate' | 'strong' };
    emotionalPlane: { numbers: number[]; strength: 'weak' | 'moderate' | 'strong' };
    practicalPlane: { numbers: number[]; strength: 'weak' | 'moderate' | 'strong' };
    arrows: string[];
  };
}

// Calculate Loshu Grid from DOB (DDMMYYYY format)
// Uses ALL digits from the date, 0 is ignored
// Repeat digits count as strength
export const calculateLoshuGrid = (dob: string, fullName: string): LoshuGrid => {
  // Get all digits from DOB in DDMMYYYY format
  // Example: 27/03/1995 → 2, 7, 0, 3, 1, 9, 9, 5
  const dobDigits = dob.replace(/\D/g, '').split('').map(Number);
  
  // Count occurrences of each number 1-9 (0 is ignored in Loshu Grid)
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  
  dobDigits.forEach(d => {
    if (d >= 1 && d <= 9) counts[d]++;
  });
  
  // Build the 3x3 grid (Loshu magic square positions)
  // Traditional Loshu Grid layout:
  // 4 9 2
  // 3 5 7
  // 8 1 6
  const gridPositions = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];
  
  const grid = gridPositions.map(row => row.map(num => counts[num]));
  
  const present = Object.keys(counts).filter(k => counts[Number(k)] > 0).map(Number).sort((a, b) => a - b);
  const missing = Object.keys(counts).filter(k => counts[Number(k)] === 0).map(Number).sort((a, b) => a - b);
  const overloaded = Object.keys(counts).filter(k => counts[Number(k)] >= 3).map(Number).sort((a, b) => a - b);
  
  // Analyze planes (rows in the grid)
  const mentalPlane = [4, 9, 2]; // top row - thinking, analyzing
  const emotionalPlane = [3, 5, 7]; // middle row - feelings, intuition
  const practicalPlane = [8, 1, 6]; // bottom row - material, action
  
  const getPlaneStrength = (plane: number[]): 'weak' | 'moderate' | 'strong' => {
    const presentCount = plane.filter(n => counts[n] > 0).length;
    if (presentCount === 3) return 'strong';
    if (presentCount >= 1) return 'moderate';
    return 'weak';
  };
  
  // Check for arrows (complete lines where all 3 numbers are present)
  const arrows: string[] = [];
  
  // Horizontal arrows (rows)
  if (mentalPlane.every(n => counts[n] > 0)) arrows.push('Arrow of Intelligence (4-9-2)');
  if (emotionalPlane.every(n => counts[n] > 0)) arrows.push('Arrow of Emotional Balance (3-5-7)');
  if (practicalPlane.every(n => counts[n] > 0)) arrows.push('Arrow of Practicality (8-1-6)');
  
  // Vertical arrows (columns)
  if ([4, 3, 8].every(n => counts[n] > 0)) arrows.push('Arrow of Thought (4-3-8)');
  if ([9, 5, 1].every(n => counts[n] > 0)) arrows.push('Arrow of Will (9-5-1)');
  if ([2, 7, 6].every(n => counts[n] > 0)) arrows.push('Arrow of Action (2-7-6)');
  
  // Diagonal arrows
  if ([4, 5, 6].every(n => counts[n] > 0)) arrows.push('Arrow of Determination (4-5-6)');
  if ([2, 5, 8].every(n => counts[n] > 0)) arrows.push('Arrow of Spirituality (2-5-8)');
  
  return {
    grid,
    present,
    missing,
    overloaded,
    analysis: {
      mentalPlane: { numbers: mentalPlane, strength: getPlaneStrength(mentalPlane) },
      emotionalPlane: { numbers: emotionalPlane, strength: getPlaneStrength(emotionalPlane) },
      practicalPlane: { numbers: practicalPlane, strength: getPlaneStrength(practicalPlane) },
      arrows,
    },
  };
};

// Missing number meanings
export const missingNumberMeanings: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: {
    en: 'Lack of self-confidence and individuality. May struggle with asserting yourself.',
    hi: 'आत्मविश्वास और व्यक्तित्व की कमी। खुद को व्यक्त करने में कठिनाई।',
    hinglish: 'Self-confidence ki kami. Khud ko express karne mein problem ho sakti hai.',
  },
  2: {
    en: 'Difficulty in partnerships and cooperation. May struggle with patience.',
    hi: 'साझेदारी और सहयोग में कठिनाई। धैर्य की कमी हो सकती है।',
    hinglish: 'Partnerships mein problems. Patience ki kami ho sakti hai.',
  },
  3: {
    en: 'Creative blocks and communication challenges. May feel unexpressed.',
    hi: 'रचनात्मक अवरोध और संचार में समस्या। खुद को व्यक्त नहीं कर पाते।',
    hinglish: 'Creativity aur communication mein problems. Express karna mushkil lagta hai.',
  },
  4: {
    en: 'Lack of discipline and organization. May struggle with stability.',
    hi: 'अनुशासन और व्यवस्था की कमी। स्थिरता में समस्या।',
    hinglish: 'Discipline aur organization ki kami. Stability maintain karna mushkil.',
  },
  5: {
    en: 'Fear of change and adventure. May feel stuck in routine.',
    hi: 'परिवर्तन और साहस का डर। दिनचर्या में फंसा महसूस करना।',
    hinglish: 'Change se darr lagta hai. Routine mein stuck feel karte ho.',
  },
  6: {
    en: 'Difficulty with responsibility and family matters. May avoid commitments.',
    hi: 'जिम्मेदारी और परिवार के मामलों में कठिनाई। प्रतिबद्धता से बचना।',
    hinglish: 'Responsibility aur family matters mein problem. Commitment se bachte ho.',
  },
  7: {
    en: 'Lack of spiritual depth and introspection. May ignore inner wisdom.',
    hi: 'आध्यात्मिक गहराई और आत्मनिरीक्षण की कमी। आंतरिक ज्ञान की उपेक्षा।',
    hinglish: 'Spiritual depth ki kami. Inner wisdom ko ignore karte ho.',
  },
  8: {
    en: 'Financial challenges and power struggles. May have money blocks.',
    hi: 'वित्तीय चुनौतियां और शक्ति संघर्ष। पैसों की समस्या हो सकती है।',
    hinglish: 'Financial challenges aur power struggles. Money blocks ho sakte hain.',
  },
  9: {
    en: 'Difficulty with compassion and letting go. May hold onto past.',
    hi: 'करुणा और छोड़ने में कठिनाई। अतीत से चिपके रहना।',
    hinglish: 'Compassion aur letting go mein problem. Past se chipke rehte ho.',
  },
};

// ============= PINNACLE CYCLES =============
export interface PinnacleCycle {
  number: number;
  ages: string;
  theme: { en: string; hi: string; hinglish: string };
  opportunities: string[];
  challenges: string[];
  startAge?: number;
  duration?: number;
}

// Calculate Pinnacle Cycles
// First pinnacle: 0 to (36 - Life Path)
// Second pinnacle: next 9 years
// Third pinnacle: next 9 years
// Fourth pinnacle: remaining life
export const calculatePinnacleCycles = (dob: string): PinnacleCycle[] => {
  const [day, month, year] = dob.split('/').map(Number);
  
  // Reduce day, month, year individually (without preserving master for intermediate calcs)
  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, d) => sum + parseInt(d), 0), 
    false
  );
  
  // Calculate Life Path for determining cycle timing
  const lifePath = reduceToSingleDigit(reducedDay + reducedMonth + reducedYear, true);
  const lifePathForCalc = lifePath > 9 ? reduceToSingleDigit(lifePath, false) : lifePath;
  
  // First pinnacle ends at age 36 - lifePath
  const firstEnd = Math.max(27, 36 - lifePathForCalc); // Minimum age 27
  const secondEnd = firstEnd + 9;
  const thirdEnd = secondEnd + 9;
  
  // Calculate pinnacle numbers (preserve master numbers in results)
  const pinnacle1 = reduceToSingleDigit(reducedDay + reducedMonth, true);
  const pinnacle2 = reduceToSingleDigit(reducedDay + reducedYear, true);
  const pinnacle3 = reduceToSingleDigit(pinnacle1 + pinnacle2, true);
  const pinnacle4 = reduceToSingleDigit(reducedMonth + reducedYear, true);
  
  const pinnacleThemes: Record<number, { en: string; hi: string; hinglish: string }> = {
    1: { en: 'Independence & New Beginnings', hi: 'स्वतंत्रता और नई शुरुआत', hinglish: 'Independence aur nayi shuruaat' },
    2: { en: 'Cooperation & Relationships', hi: 'सहयोग और रिश्ते', hinglish: 'Cooperation aur relationships' },
    3: { en: 'Creative Expression & Joy', hi: 'रचनात्मक अभिव्यक्ति और खुशी', hinglish: 'Creative expression aur khushi' },
    4: { en: 'Building Foundations', hi: 'नींव बनाना', hinglish: 'Foundation building ka time' },
    5: { en: 'Change & Freedom', hi: 'परिवर्तन और स्वतंत्रता', hinglish: 'Change aur freedom ka phase' },
    6: { en: 'Family & Responsibility', hi: 'परिवार और जिम्मेदारी', hinglish: 'Family aur responsibility ka time' },
    7: { en: 'Spiritual Growth & Learning', hi: 'आध्यात्मिक विकास और सीखना', hinglish: 'Spiritual growth aur learning' },
    8: { en: 'Material Success & Power', hi: 'भौतिक सफलता और शक्ति', hinglish: 'Material success aur power' },
    9: { en: 'Completion & Humanitarianism', hi: 'पूर्णता और मानवतावाद', hinglish: 'Completion aur humanity service' },
    11: { en: 'Spiritual Illumination', hi: 'आध्यात्मिक प्रकाश', hinglish: 'Spiritual illumination ka phase' },
    22: { en: 'Master Building', hi: 'मास्टर बिल्डिंग', hinglish: 'Master building ka time' },
    33: { en: 'Master Teaching', hi: 'मास्टर टीचिंग', hinglish: 'Master teaching ka phase' },
  };
  
  const getPinnacleDetails = (num: number): { opportunities: string[]; challenges: string[] } => {
    const baseNum = num > 9 ? reduceToSingleDigit(num, false) : num;
    const details: Record<number, { opportunities: string[]; challenges: string[] }> = {
      1: { opportunities: ['Leadership roles', 'Starting new ventures', 'Self-discovery'], challenges: ['Ego conflicts', 'Impatience', 'Loneliness'] },
      2: { opportunities: ['Partnerships', 'Diplomacy', 'Emotional growth'], challenges: ['Over-sensitivity', 'Indecision', 'Dependency'] },
      3: { opportunities: ['Creative projects', 'Social connections', 'Self-expression'], challenges: ['Scattered energy', 'Superficiality', 'Mood swings'] },
      4: { opportunities: ['Career building', 'Financial stability', 'Discipline'], challenges: ['Rigidity', 'Overwork', 'Frustration'] },
      5: { opportunities: ['Travel', 'New experiences', 'Personal freedom'], challenges: ['Instability', 'Restlessness', 'Excess'] },
      6: { opportunities: ['Family harmony', 'Community service', 'Creativity'], challenges: ['Over-responsibility', 'Self-sacrifice', 'Perfectionism'] },
      7: { opportunities: ['Spiritual awakening', 'Education', 'Research'], challenges: ['Isolation', 'Skepticism', 'Depression'] },
      8: { opportunities: ['Business success', 'Recognition', 'Wealth'], challenges: ['Power struggles', 'Materialism', 'Control issues'] },
      9: { opportunities: ['Humanitarian work', 'Artistic fulfillment', 'Wisdom sharing'], challenges: ['Letting go', 'Disappointment', 'Sacrifice'] },
    };
    return details[baseNum] || details[9];
  };
  
  return [
    { number: pinnacle1, ages: `0-${firstEnd}`, startAge: 0, duration: firstEnd, theme: pinnacleThemes[pinnacle1] || pinnacleThemes[reduceToSingleDigit(pinnacle1, false)], ...getPinnacleDetails(pinnacle1) },
    { number: pinnacle2, ages: `${firstEnd + 1}-${secondEnd}`, startAge: firstEnd + 1, duration: 9, theme: pinnacleThemes[pinnacle2] || pinnacleThemes[reduceToSingleDigit(pinnacle2, false)], ...getPinnacleDetails(pinnacle2) },
    { number: pinnacle3, ages: `${secondEnd + 1}-${thirdEnd}`, startAge: secondEnd + 1, duration: 9, theme: pinnacleThemes[pinnacle3] || pinnacleThemes[reduceToSingleDigit(pinnacle3, false)], ...getPinnacleDetails(pinnacle3) },
    { number: pinnacle4, ages: `${thirdEnd + 1}+`, startAge: thirdEnd + 1, duration: 100, theme: pinnacleThemes[pinnacle4] || pinnacleThemes[reduceToSingleDigit(pinnacle4, false)], ...getPinnacleDetails(pinnacle4) },
  ];
};

// ============= CHALLENGE CYCLES =============
export interface ChallengeCycle {
  number: number;
  ages: string;
  challenge: { en: string; hi: string; hinglish: string };
  lesson: string;
}

// Calculate Challenge Cycles
// Challenge numbers are calculated using SUBTRACTION (absolute difference)
export const calculateChallengeCycles = (dob: string): ChallengeCycle[] => {
  const [day, month, year] = dob.split('/').map(Number);
  
  // Reduce day, month, year individually (no master number preservation for challenges)
  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, d) => sum + parseInt(d), 0),
    false
  );
  
  // Calculate Life Path for determining cycle timing
  const lifePath = reduceToSingleDigit(reducedDay + reducedMonth + reducedYear, true);
  const lifePathForCalc = lifePath > 9 ? reduceToSingleDigit(lifePath, false) : lifePath;
  
  const firstEnd = Math.max(27, 36 - lifePathForCalc);
  const secondEnd = firstEnd + 9;
  const thirdEnd = secondEnd + 9;
  
  // Calculate challenge numbers using ABSOLUTE DIFFERENCE
  const challenge1 = Math.abs(reducedDay - reducedMonth);
  const challenge2 = Math.abs(reducedDay - reducedYear);
  const challenge3 = Math.abs(challenge1 - challenge2); // Main life challenge
  const challenge4 = Math.abs(reducedMonth - reducedYear);
  
  const challengeMeanings: Record<number, { en: string; hi: string; hinglish: string; lesson: string }> = {
    0: { en: 'All challenges combined - master all lessons', hi: 'सभी चुनौतियां - सभी सबक सीखें', hinglish: 'Sab challenges combined - sab lessons seekho', lesson: 'Complete spiritual mastery is required' },
    1: { en: 'Developing self-confidence and independence', hi: 'आत्मविश्वास और स्वतंत्रता विकसित करना', hinglish: 'Self-confidence aur independence develop karo', lesson: 'Stand on your own and trust yourself' },
    2: { en: 'Learning patience and cooperation', hi: 'धैर्य और सहयोग सीखना', hinglish: 'Patience aur cooperation seekho', lesson: 'Balance sensitivity with strength' },
    3: { en: 'Overcoming self-doubt in expression', hi: 'अभिव्यक्ति में आत्म-संदेह पर काबू', hinglish: 'Expression mein self-doubt overcome karo', lesson: 'Express yourself without fear of judgment' },
    4: { en: 'Building discipline and organization', hi: 'अनुशासन और संगठन बनाना', hinglish: 'Discipline aur organization banao', lesson: 'Create structure without becoming rigid' },
    5: { en: 'Managing freedom responsibly', hi: 'जिम्मेदारी से स्वतंत्रता का प्रबंधन', hinglish: 'Freedom ko responsibly manage karo', lesson: 'Embrace change without losing stability' },
    6: { en: 'Balancing responsibility and self-care', hi: 'जिम्मेदारी और आत्म-देखभाल में संतुलन', hinglish: 'Responsibility aur self-care balance karo', lesson: 'Care for others without losing yourself' },
    7: { en: 'Developing faith and inner wisdom', hi: 'विश्वास और आंतरिक ज्ञान विकसित करना', hinglish: 'Faith aur inner wisdom develop karo', lesson: 'Trust intuition over pure logic' },
    8: { en: 'Mastering material and power', hi: 'भौतिक और शक्ति में महारत', hinglish: 'Material aur power master karo', lesson: 'Use power wisely and share abundance' },
  };
  
  return [
    { number: challenge1, ages: `0-${firstEnd}`, challenge: challengeMeanings[challenge1] || challengeMeanings[0], lesson: challengeMeanings[challenge1]?.lesson || 'Complete mastery' },
    { number: challenge2, ages: `${firstEnd + 1}-${secondEnd}`, challenge: challengeMeanings[challenge2] || challengeMeanings[0], lesson: challengeMeanings[challenge2]?.lesson || 'Complete mastery' },
    { number: challenge3, ages: `${secondEnd + 1}-${thirdEnd}`, challenge: challengeMeanings[challenge3] || challengeMeanings[0], lesson: challengeMeanings[challenge3]?.lesson || 'Complete mastery' },
    { number: challenge4, ages: `${thirdEnd + 1}+`, challenge: challengeMeanings[challenge4] || challengeMeanings[0], lesson: challengeMeanings[challenge4]?.lesson || 'Complete mastery' },
  ];
};

// ============= KARMIC DEBT NUMBERS =============
export interface KarmicDebt {
  number: 13 | 14 | 16 | 19;
  present: boolean;
  foundIn: string[];
  meaning: { en: string; hi: string; hinglish: string };
  lesson: string;
  remedy: string;
}

export const calculateKarmicDebts = (dob: string, fullName: string): KarmicDebt[] => {
  const [day, month, year] = dob.split('/').map(Number);
  
  // Check where karmic debt numbers appear
  const debts: KarmicDebt[] = [
    {
      number: 13,
      present: false,
      foundIn: [],
      meaning: {
        en: 'Laziness and taking shortcuts in past lives. Must work hard now.',
        hi: 'पिछले जन्मों में आलस्य और शॉर्टकट। अब मेहनत करनी होगी।',
        hinglish: 'Past life mein laziness aur shortcuts. Ab mehnat karna padega.',
      },
      lesson: 'Transform frustration into focused, disciplined work',
      remedy: 'Embrace hard work, complete tasks fully, avoid shortcuts',
    },
    {
      number: 14,
      present: false,
      foundIn: [],
      meaning: {
        en: 'Misuse of freedom in past lives. Must learn moderation.',
        hi: 'पिछले जन्मों में स्वतंत्रता का दुरुपयोग। संयम सीखना होगा।',
        hinglish: 'Past life mein freedom ka misuse. Ab moderation seekhna padega.',
      },
      lesson: 'Balance freedom with responsibility',
      remedy: 'Practice moderation, commit to relationships, stay grounded',
    },
    {
      number: 16,
      present: false,
      foundIn: [],
      meaning: {
        en: 'Ego and relationship destruction in past lives. Must rebuild with humility.',
        hi: 'पिछले जन्मों में अहंकार। विनम्रता के साथ पुनर्निर्माण करना होगा।',
        hinglish: 'Past life mein ego problems. Ab humility se rebuild karna padega.',
      },
      lesson: 'Ego death and spiritual rebirth',
      remedy: 'Practice humility, accept failures as growth, serve others',
    },
    {
      number: 19,
      present: false,
      foundIn: [],
      meaning: {
        en: 'Selfish use of power in past lives. Must learn to share and support.',
        hi: 'पिछले जन्मों में शक्ति का स्वार्थी उपयोग। साझा करना और समर्थन करना सीखना होगा।',
        hinglish: 'Past life mein power ka selfish use. Ab share aur support karna seekhna padega.',
      },
      lesson: 'Transform self-centeredness into service',
      remedy: 'Help others succeed, share knowledge, lead with compassion',
    },
  ];
  
  // Check in day
  if (day === 13 || day === 14 || day === 16 || day === 19) {
    const debt = debts.find(d => d.number === day);
    if (debt) {
      debt.present = true;
      debt.foundIn.push('Birth Day');
    }
  }
  
  // Check in full DOB sum before reduction
  const fullSum = day + month + year;
  [13, 14, 16, 19].forEach(karmicNum => {
    if (fullSum === karmicNum || String(fullSum).includes(String(karmicNum))) {
      const debt = debts.find(d => d.number === karmicNum);
      if (debt && !debt.foundIn.includes('Life Path Calculation')) {
        debt.present = true;
        debt.foundIn.push('Life Path Calculation');
      }
    }
  });
  
  return debts;
};

// ============= ELEMENTAL BALANCE =============
export interface ElementalBalance {
  fire: number; // 1, 9
  water: number; // 2, 7
  earth: number; // 4, 8
  air: number; // 3, 5
  ether: number; // 6
  dominant: string;
  weak: string;
}

export const calculateElementalBalance = (dob: string): ElementalBalance => {
  const digits = dob.replace(/\D/g, '').split('').map(Number).filter(n => n > 0);
  
  let fire = 0, water = 0, earth = 0, air = 0, ether = 0;
  
  digits.forEach(d => {
    if (d === 1 || d === 9) fire++;
    else if (d === 2 || d === 7) water++;
    else if (d === 4 || d === 8) earth++;
    else if (d === 3 || d === 5) air++;
    else if (d === 6) ether++;
  });
  
  const elements = { fire, water, earth, air, ether };
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  
  return {
    fire,
    water,
    earth,
    air,
    ether,
    dominant: sorted[0][0],
    weak: sorted[sorted.length - 1][0],
  };
};
