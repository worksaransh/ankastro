// Pythagorean numerology values for letters (CORRECT MAPPING)
// A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
// J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
// S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
const pythagoreanValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const vowels = ['a', 'e', 'i', 'o', 'u'];
const masterNumbers = [11, 22, 33];

// Reduce a number to single digit, preserving master numbers 11, 22, 33
export const reduceToSingleDigit = (num: number, preserveMaster = true): number => {
  if (isNaN(num) || typeof num !== 'number') return 0;
  // If it's already a single digit, return it
  if (num <= 9) return num;
  
  // Check for master numbers BEFORE reducing
  if (preserveMaster && masterNumbers.includes(num)) return num;
  
  // Sum all digits
  const sum = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  // Check if the result is a master number
  if (preserveMaster && masterNumbers.includes(sum)) return sum;
  
  // Continue reducing if needed
  return reduceToSingleDigit(sum, preserveMaster);
};

// Calculate Life Path Number from DOB (DD/MM/YYYY format)
// CORRECT METHOD: Add all digits of full date, then reduce
// Example: 02/07/1998 → 0+2+0+7+1+9+9+8 = 36 → 3+6 = 9
export const calculateLifePath = (dob: string): number => {
  const [day, month, year] = dob.split('/').map(Number);
  
  // Method: Add all individual digits from the full date
  const dayDigits = String(day).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const monthDigits = String(month).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const yearDigits = String(year).split('').reduce((sum, d) => sum + parseInt(d), 0);
  
  const total = dayDigits + monthDigits + yearDigits;
  
  // Reduce to single digit, preserving master numbers 11, 22, 33
  return reduceToSingleDigit(total, true);
};

// Get letter value from name
const getLetterValue = (letter: string): number => {
  return pythagoreanValues[letter.toLowerCase()] || 0;
};

// Calculate name number from string
// Preserves master numbers 11, 22, 33
const calculateNameNumber = (name: string, lettersToInclude?: 'vowels' | 'consonants'): number => {
  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  
  let filteredLetters = letters;
  if (lettersToInclude === 'vowels') {
    filteredLetters = letters.filter(l => vowels.includes(l));
  } else if (lettersToInclude === 'consonants') {
    filteredLetters = letters.filter(l => !vowels.includes(l));
  }
  
  const total = filteredLetters.reduce((sum, letter) => sum + getLetterValue(letter), 0);
  return reduceToSingleDigit(total, true); // Preserve master numbers
};

// Expression/Destiny Number - Full name (all letters)
// Example: RAHUL VERMA = R(9)+A(1)+H(8)+U(3)+L(3) + V(4)+E(5)+R(9)+M(4)+A(1) = 24+23 = 47 → 4+7 = 11 (KEEP 11)
export const calculateDestiny = (fullName: string): number => {
  return calculateNameNumber(fullName);
};

// Soul Urge / Heart Desire Number - Vowels only (A, E, I, O, U)
export const calculateSoulUrge = (fullName: string): number => {
  return calculateNameNumber(fullName, 'vowels');
};

// Personality Number - Consonants only (all letters except A, E, I, O, U)
export const calculatePersonality = (fullName: string): number => {
  return calculateNameNumber(fullName, 'consonants');
};

// Birthday Number - Day of birth reduced
// Example: 15 → 1+5 = 6, 19 → 1+9 = 10 → 1+0 = 1
export const calculateBirthday = (dob: string): number => {
  const day = parseInt(dob.split('/')[0]);
  // Birthday number does NOT preserve master numbers (only 11 and 22 are kept if day is exactly 11 or 22)
  if (day === 11 || day === 22) return day;
  return reduceToSingleDigit(day, false);
};

// Maturity Number - Life Path + Destiny
export const calculateMaturity = (lifePath: number, destiny: number): number => {
  // Use raw values for addition, then reduce preserving master numbers
  return reduceToSingleDigit(lifePath + destiny, true);
};

// Attitude Number - Day + Month (reduce each first, then sum)
export const calculateAttitude = (dob: string): number => {
  const [day, month] = dob.split('/').map(Number);
  const dayReduced = reduceToSingleDigit(day, false);
  const monthReduced = reduceToSingleDigit(month, false);
  return reduceToSingleDigit(dayReduced + monthReduced, false);
};

// Personal Year Number
export const calculatePersonalYear = (dob: string): number => {
  const [day, month] = dob.split('/').map(Number);
  const currentYear = new Date().getFullYear();
  
  // Add day + month + current year digits
  const daySum = String(day).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const monthSum = String(month).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const yearSum = String(currentYear).split('').reduce((sum, d) => sum + parseInt(d), 0);
  
  const total = daySum + monthSum + yearSum;
  return reduceToSingleDigit(total, true);
};

// Personal Month Number
export const calculatePersonalMonth = (personalYear: number): number => {
  const currentMonth = new Date().getMonth() + 1;
  return reduceToSingleDigit(personalYear + currentMonth, false);
};

// Personal Day Number
export const calculatePersonalDay = (personalMonth: number): number => {
  const currentDay = new Date().getDate();
  return reduceToSingleDigit(personalMonth + currentDay, false);
};

// Karmic Lessons - Missing numbers in name
export const calculateKarmicLessons = (fullName: string): number[] => {
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('');
  const presentNumbers = new Set(letters.map(l => getLetterValue(l)));
  
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) {
      missing.push(i);
    }
  }
  return missing;
};

// Hidden Passion - Most repeated digit in name
export const calculateHiddenPassion = (fullName: string): number => {
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '').split('');
  const digitCounts: Record<number, number> = {};
  
  letters.forEach(letter => {
    const value = getLetterValue(letter);
    digitCounts[value] = (digitCounts[value] || 0) + 1;
  });
  
  let maxCount = 0;
  let hiddenPassion = 1;
  
  Object.entries(digitCounts).forEach(([digit, count]) => {
    if (count > maxCount) {
      maxCount = count;
      hiddenPassion = parseInt(digit);
    }
  });
  
  return hiddenPassion;
};

// Compatibility calculation
export const calculateCompatibility = (lifePath1: number, lifePath2: number): {
  score: number;
  strength: string;
  challenges: string;
  compatibility: 'Excellent' | 'Good' | 'Moderate' | 'Challenging';
} => {
  const compatibilityMatrix: Record<string, number> = {
    '1-1': 70, '1-2': 65, '1-3': 85, '1-4': 55, '1-5': 90, '1-6': 60, '1-7': 75, '1-8': 80, '1-9': 85,
    '2-2': 80, '2-3': 70, '2-4': 75, '2-5': 55, '2-6': 90, '2-7': 60, '2-8': 65, '2-9': 85,
    '3-3': 75, '3-4': 50, '3-5': 90, '3-6': 85, '3-7': 65, '3-8': 55, '3-9': 80,
    '4-4': 70, '4-5': 45, '4-6': 75, '4-7': 80, '4-8': 85, '4-9': 50,
    '5-5': 60, '5-6': 55, '5-7': 85, '5-8': 70, '5-9': 90,
    '6-6': 85, '6-7': 55, '6-8': 70, '6-9': 90,
    '7-7': 75, '7-8': 60, '7-9': 70,
    '8-8': 70, '8-9': 65,
    '9-9': 80,
  };
  
  const key = lifePath1 <= lifePath2 ? `${lifePath1}-${lifePath2}` : `${lifePath2}-${lifePath1}`;
  const normalizedKey = key.replace('11', '2').replace('22', '4').replace('33', '6');
  const score = compatibilityMatrix[normalizedKey] || 70;
  
  let compatibility: 'Excellent' | 'Good' | 'Moderate' | 'Challenging';
  if (score >= 85) compatibility = 'Excellent';
  else if (score >= 70) compatibility = 'Good';
  else if (score >= 55) compatibility = 'Moderate';
  else compatibility = 'Challenging';
  
  const strengths: Record<string, string> = {
    'Excellent': 'Deep understanding, natural harmony, and shared life vision',
    'Good': 'Complementary energies that balance each other well',
    'Moderate': 'Different perspectives that can enrich the relationship with effort',
    'Challenging': 'Growth opportunities through understanding different viewpoints',
  };
  
  const challenges: Record<string, string> = {
    'Excellent': 'May become too comfortable and need to maintain individual growth',
    'Good': 'Minor communication differences that are easily overcome',
    'Moderate': 'Requires conscious effort to bridge different approaches to life',
    'Challenging': 'Need patience and willingness to understand each other\'s core needs',
  };
  
  return {
    score,
    strength: strengths[compatibility],
    challenges: challenges[compatibility],
    compatibility,
  };
};

// Life cycles
export const calculateLifeCycles = (lifePath: number): {
  first: { ages: string; theme: string };
  second: { ages: string; theme: string };
  third: { ages: string; theme: string };
} => {
  const themes: Record<number, string[]> = {
    1: ['Self-discovery and independence', 'Leadership and achievement', 'Wisdom and mentoring'],
    2: ['Cooperation and relationships', 'Diplomacy and partnership', 'Peace and spiritual growth'],
    3: ['Creative expression', 'Social connections and joy', 'Artistic mastery and teaching'],
    4: ['Building foundations', 'Hard work and stability', 'Legacy and structure'],
    5: ['Adventure and freedom', 'Change and adaptability', 'Wisdom through experience'],
    6: ['Family and responsibility', 'Service and nurturing', 'Community leadership'],
    7: ['Inner development', 'Spiritual seeking', 'Teaching and enlightenment'],
    8: ['Material success', 'Power and authority', 'Philanthropy and giving back'],
    9: ['Humanitarian service', 'Universal love', 'Spiritual completion'],
    11: ['Spiritual awakening', 'Inspiration and vision', 'Enlightened leadership'],
    22: ['Master building', 'Large-scale achievements', 'Global legacy'],
    33: ['Master teaching', 'Healing and service', 'Universal consciousness'],
  };
  
  const cycleThemes = themes[lifePath] || themes[reduceToSingleDigit(lifePath, false)];
  
  return {
    first: { ages: '0-28', theme: cycleThemes[0] },
    second: { ages: '29-56', theme: cycleThemes[1] },
    third: { ages: '56+', theme: cycleThemes[2] },
  };
};

// Lucky attributes
export const getLuckyAttributes = (lifePath: number): {
  numbers: number[];
  days: string[];
  colors: string[];
  directions: string[];
} => {
  const attributes: Record<number, { numbers: number[]; days: string[]; colors: string[]; directions: string[] }> = {
    1: { numbers: [1, 10, 19, 28], days: ['Sunday', 'Monday'], colors: ['Gold', 'Orange', 'Yellow'], directions: ['East'] },
    2: { numbers: [2, 11, 20, 29], days: ['Monday', 'Friday'], colors: ['White', 'Cream', 'Green'], directions: ['North'] },
    3: { numbers: [3, 12, 21, 30], days: ['Thursday', 'Friday'], colors: ['Yellow', 'Purple', 'Pink'], directions: ['Northeast'] },
    4: { numbers: [4, 13, 22, 31], days: ['Saturday', 'Sunday'], colors: ['Blue', 'Grey', 'Khaki'], directions: ['Southwest'] },
    5: { numbers: [5, 14, 23], days: ['Wednesday', 'Friday'], colors: ['Green', 'Turquoise', 'White'], directions: ['North'] },
    6: { numbers: [6, 15, 24], days: ['Friday', 'Wednesday'], colors: ['Blue', 'Pink', 'White'], directions: ['Northwest'] },
    7: { numbers: [7, 16, 25], days: ['Monday', 'Sunday'], colors: ['White', 'Yellow', 'Green'], directions: ['Northwest'] },
    8: { numbers: [8, 17, 26], days: ['Saturday', 'Thursday'], colors: ['Black', 'Blue', 'Grey'], directions: ['West'] },
    9: { numbers: [9, 18, 27], days: ['Tuesday', 'Thursday'], colors: ['Red', 'Crimson', 'Pink'], directions: ['South'] },
    11: { numbers: [11, 2, 20, 29], days: ['Monday', 'Friday'], colors: ['Silver', 'White', 'Violet'], directions: ['North'] },
    22: { numbers: [22, 4, 13, 31], days: ['Saturday', 'Thursday'], colors: ['Coral', 'Tan', 'Cream'], directions: ['Southwest'] },
    33: { numbers: [33, 6, 15, 24], days: ['Friday', 'Thursday'], colors: ['Turquoise', 'Pink', 'Blue'], directions: ['Northwest'] },
  };
  
  return attributes[lifePath] || attributes[reduceToSingleDigit(lifePath, false)];
};

// Number meanings
export const numberMeanings: Record<number, {
  title: string;
  purpose: string;
  strengths: string[];
  challenges: string[];
  careers: string[];
  relationships: string;
  health: string;
  spiritual: string;
}> = {
  1: {
    title: 'The Leader',
    purpose: 'You are here to pioneer new paths and lead with courage. Your soul chose this lifetime to master independence, originality, and self-determination. You are a trailblazer meant to inspire others through your bold actions.',
    strengths: ['Leadership', 'Independence', 'Creativity', 'Determination', 'Courage'],
    challenges: ['Stubbornness', 'Impatience', 'Self-centeredness'],
    careers: ['Entrepreneur', 'CEO', 'Inventor', 'Director', 'Politician'],
    relationships: 'You need a partner who respects your independence while offering emotional support. Avoid controlling dynamics.',
    health: 'Focus on head-related issues, stress management, and maintaining physical activity.',
    spiritual: 'Your spiritual path involves learning to balance ego with humility and using your leadership for collective good.',
  },
  2: {
    title: 'The Peacemaker',
    purpose: 'You are here to bring harmony and cooperation into the world. Your sensitive soul understands the subtle dynamics between people. You are meant to be the bridge that connects hearts and heals divisions.',
    strengths: ['Diplomacy', 'Intuition', 'Cooperation', 'Patience', 'Sensitivity'],
    challenges: ['Oversensitivity', 'Indecision', 'Self-doubt'],
    careers: ['Counselor', 'Mediator', 'Artist', 'Healer', 'Team Lead'],
    relationships: 'You thrive in supportive, equal partnerships. Avoid relationships where you constantly give without receiving.',
    health: 'Pay attention to nervous system, emotional balance, and getting enough rest.',
    spiritual: 'Your path is about developing inner strength while maintaining your natural empathy and intuition.',
  },
  3: {
    title: 'The Creative',
    purpose: 'You are here to express joy, creativity, and inspiration. Your vibrant energy is meant to uplift others through art, communication, and self-expression. You bring color to a sometimes grey world.',
    strengths: ['Creativity', 'Communication', 'Optimism', 'Charm', 'Artistic talent'],
    challenges: ['Scattered energy', 'Superficiality', 'Mood swings'],
    careers: ['Writer', 'Artist', 'Speaker', 'Actor', 'Designer'],
    relationships: 'You need a partner who appreciates your creativity and gives you space to express yourself fully.',
    health: 'Watch throat issues, respiratory health, and maintain emotional stability.',
    spiritual: 'Your journey involves using your gifts for meaningful expression rather than just entertainment.',
  },
  4: {
    title: 'The Builder',
    purpose: 'You are here to create lasting foundations and bring order to chaos. Your practical wisdom and dedication build structures that serve generations. You are the backbone of society.',
    strengths: ['Discipline', 'Reliability', 'Practicality', 'Hard work', 'Organization'],
    challenges: ['Rigidity', 'Stubbornness', 'Work obsession'],
    careers: ['Engineer', 'Architect', 'Manager', 'Accountant', 'Builder'],
    relationships: 'You need stability and loyalty. Avoid partners who are too spontaneous or unreliable.',
    health: 'Focus on bones, joints, and avoid overworking. Regular routines support your wellbeing.',
    spiritual: 'Learn to balance structure with flexibility and find spirituality in disciplined practice.',
  },
  5: {
    title: 'The Adventurer',
    purpose: 'You are here to experience life fully and embrace change. Your freedom-loving spirit teaches others to break free from limitations. You are meant to explore, adapt, and transform.',
    strengths: ['Adaptability', 'Freedom', 'Versatility', 'Curiosity', 'Enthusiasm'],
    challenges: ['Restlessness', 'Irresponsibility', 'Excess'],
    careers: ['Travel guide', 'Salesperson', 'Journalist', 'Pilot', 'Entrepreneur'],
    relationships: 'You need space and variety. A partner who is too possessive will feel suffocating.',
    health: 'Watch for addictions, nervous energy, and maintain grounding practices.',
    spiritual: 'Your path involves finding freedom through inner liberation rather than external escape.',
  },
  6: {
    title: 'The Nurturer',
    purpose: 'You are here to love, heal, and serve. Your compassionate heart creates harmony in families and communities. You are meant to be the pillar of support that others lean on.',
    strengths: ['Responsibility', 'Compassion', 'Nurturing', 'Artistic sense', 'Harmony'],
    challenges: ['Over-giving', 'Worry', 'Perfectionism'],
    careers: ['Teacher', 'Nurse', 'Therapist', 'Interior designer', 'Chef'],
    relationships: 'You are devoted and loving but must avoid martyrdom. Choose partners who appreciate your care.',
    health: 'Heart, circulation, and stress from over-responsibility need attention.',
    spiritual: 'Balance giving to others with self-love and setting healthy boundaries.',
  },
  7: {
    title: 'The Seeker',
    purpose: 'You are here to seek truth and wisdom. Your analytical mind and intuitive depth make you a natural philosopher. You are meant to uncover life\'s mysteries and share profound insights.',
    strengths: ['Wisdom', 'Intuition', 'Analysis', 'Spirituality', 'Inner peace'],
    challenges: ['Isolation', 'Overthinking', 'Secrecy'],
    careers: ['Researcher', 'Scientist', 'Philosopher', 'Psychologist', 'Spiritual teacher'],
    relationships: 'You need intellectual and spiritual connection. Shallow relationships feel unsatisfying.',
    health: 'Nervous system, mental health, and adequate solitude for recharging are essential.',
    spiritual: 'Trust your intuition while staying grounded. Share your wisdom rather than hoarding it.',
  },
  8: {
    title: 'The Powerhouse',
    purpose: 'You are here to master the material world and use power wisely. Your ambitious spirit can achieve great success and influence. You are meant to create abundance and share it generously.',
    strengths: ['Ambition', 'Business sense', 'Authority', 'Organization', 'Determination'],
    challenges: ['Materialism', 'Workaholism', 'Control issues'],
    careers: ['Executive', 'Banker', 'Investor', 'Lawyer', 'Real estate'],
    relationships: 'Balance power dynamics carefully. Respect and admiration matter more than romance.',
    health: 'Blood pressure, digestive system, and stress-related issues need monitoring.',
    spiritual: 'Learn that true power comes from within and use material success for greater good.',
  },
  9: {
    title: 'The Humanitarian',
    purpose: 'You are here to serve humanity and embody universal love. Your compassionate soul sees no boundaries between people. You are meant to heal, inspire, and leave the world better than you found it.',
    strengths: ['Compassion', 'Wisdom', 'Creativity', 'Idealism', 'Generosity'],
    challenges: ['Martyrdom', 'Emotional burden', 'Letting go'],
    careers: ['Doctor', 'Humanitarian worker', 'Artist', 'Teacher', 'Counselor'],
    relationships: 'You love deeply but must learn healthy detachment. Choose partners who share your values.',
    health: 'Immune system, emotional exhaustion, and boundaries need attention.',
    spiritual: 'Your path is about completing karmic cycles and preparing for spiritual mastery.',
  },
  11: {
    title: 'The Illuminator',
    purpose: 'You carry a master vibration of spiritual enlightenment. You are here to inspire and illuminate, serving as a channel for higher wisdom. Your heightened intuition guides others toward awakening.',
    strengths: ['Spiritual insight', 'Inspiration', 'Intuition', 'Sensitivity', 'Vision'],
    challenges: ['Nervous tension', 'Self-doubt', 'Overwhelm'],
    careers: ['Spiritual teacher', 'Inventor', 'Artist', 'Counselor', 'Psychic'],
    relationships: 'You need a spiritually aware partner who understands your sensitivity and mission.',
    health: 'Nervous system is highly sensitive. Grounding practices are essential.',
    spiritual: 'You are already on an advanced spiritual path. Trust your visions and share your light.',
  },
  22: {
    title: 'The Master Builder',
    purpose: 'You carry the most powerful master number - the ability to turn dreams into reality on a grand scale. You are here to build lasting legacies that benefit humanity. Think globally, act practically.',
    strengths: ['Visionary', 'Practical wisdom', 'Leadership', 'Large-scale achievement', 'Discipline'],
    challenges: ['Enormous pressure', 'Self-doubt', 'Workaholism'],
    careers: ['Architect', 'Political leader', 'Large organization head', 'Innovator', 'Builder of institutions'],
    relationships: 'You need a supportive partner who understands your big mission and can keep you grounded.',
    health: 'Manage stress from high responsibility. Physical activity and rest are crucial.',
    spiritual: 'Ground your massive spiritual potential into practical reality. Your work is your spiritual practice.',
  },
  33: {
    title: 'The Master Teacher',
    purpose: 'You carry the vibration of the master healer and teacher. You are here to serve at the highest level, teaching through unconditional love. Your presence alone uplifts others.',
    strengths: ['Unconditional love', 'Healing', 'Teaching', 'Sacrifice', 'Wisdom'],
    challenges: ['Self-sacrifice', 'Emotional burden', 'High expectations'],
    careers: ['Healer', 'Spiritual master', 'Counselor', 'Humanitarian', 'Artist'],
    relationships: 'Love is your purpose. You need partners who can match your devotion and spiritual depth.',
    health: 'Heart and emotional system need nurturing. Practice self-love as much as giving to others.',
    spiritual: 'You are here to embody Christ-consciousness and heal through your very being.',
  },
};

export interface NumerologyProfile {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  maturity: number;
  attitude: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  karmicLessons: number[];
  hiddenPassion: number;
  lifeCycles: ReturnType<typeof calculateLifeCycles>;
  luckyAttributes: ReturnType<typeof getLuckyAttributes>;
}

export const calculateFullProfile = (fullName: string, dob: string): NumerologyProfile => {
  const lifePath = calculateLifePath(dob);
  const destiny = calculateDestiny(fullName);
  const personalYear = calculatePersonalYear(dob);
  const personalMonth = calculatePersonalMonth(personalYear);
  
  return {
    lifePath,
    destiny,
    soulUrge: calculateSoulUrge(fullName),
    personality: calculatePersonality(fullName),
    birthday: calculateBirthday(dob),
    maturity: calculateMaturity(lifePath, destiny),
    attitude: calculateAttitude(dob),
    personalYear,
    personalMonth,
    personalDay: calculatePersonalDay(personalMonth),
    karmicLessons: calculateKarmicLessons(fullName),
    hiddenPassion: calculateHiddenPassion(fullName),
    lifeCycles: calculateLifeCycles(lifePath),
    luckyAttributes: getLuckyAttributes(lifePath),
  };
};
