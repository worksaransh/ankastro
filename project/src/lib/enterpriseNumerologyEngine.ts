import { supabase } from '@/integrations/supabase/client';
import { reduceToSingleDigit, calculateLifePath } from './numerology';
import { calculateBusinessVibration } from './businessNameVibration';

export interface PinnacleCycle {
  phase: number;
  startAge: number;
  endAge: number;
  pinnacleNumber: number;
  challengeNumber: number;
  keyTheme: string;
  growthObjective: string;
}

export interface KarmicDebtInfo {
  karmicNumber: number;
  source: string;
  description: string;
  rituals: string[];
}

export interface HealthVitalityProfile {
  vulnerableOrgans: string[];
  elementDeficiency: string;
  ayurvedicDietTips: string[];
  chakraFocus: string;
  stressReliefRoutine: string;
}

export interface BusinessSynergyResult {
  pythagoreanSum: number;
  chaldeanSum: number;
  companyName: string;
  overallSynergyScore: number;
  recommendations: string[];
}

// Chaldean letter values mapping
const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

export function calculateChaldeanSum(str: string): number {
  const clean = str.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    sum += CHALDEAN_MAP[clean[i]] || 0;
  }
  return sum;
}

export function calculatePinnaclesAndChallenges(dob: string): PinnacleCycle[] {
  if (!dob) return [];
  const clean = dob.replace(/[^0-9]/g, '');
  if (clean.length < 8) return [];

  // Parse day, month, year
  const parts = dob.split(/[-\/]/);
  let day = 1, month = 1, year = 1990;
  if (parts[0].length === 4) {
    year = Number(parts[0]);
    month = Number(parts[1]);
    day = Number(parts[2]);
  } else {
    day = Number(parts[0]);
    month = Number(parts[1]);
    year = Number(parts[2]);
  }

  const sumDigits = (n: number) => String(n).split('').reduce((acc, c) => acc + (Number(c) || 0), 0);
  const reduce = (n: number) => (n <= 9 ? n : reduce(sumDigits(n)));

  const dRoot = reduce(day);
  const mRoot = reduce(month);
  const yRoot = reduce(sumDigits(year));
  const lifePath = reduce(dRoot + mRoot + yRoot);

  const p1End = 36 - lifePath;
  const p2End = p1End + 9;
  const p3End = p2End + 9;

  // Pinnacles formulas:
  // P1 = Month + Day
  // P2 = Day + Year
  // P3 = P1 + P2
  // P4 = Month + Year
  const p1Num = reduce(mRoot + dRoot);
  const p2Num = reduce(dRoot + yRoot);
  const p3Num = reduce(p1Num + p2Num);
  const p4Num = reduce(mRoot + yRoot);

  // Challenges formulas:
  // C1 = |Month - Day|
  // C2 = |Day - Year|
  // C3 = |C1 - C2|
  // C4 = |Month - Year|
  const c1Num = Math.abs(mRoot - dRoot);
  const c2Num = Math.abs(dRoot - yRoot);
  const c3Num = Math.abs(c1Num - c2Num);
  const c4Num = Math.abs(mRoot - yRoot);

  return [
    {
      phase: 1,
      startAge: 0,
      endAge: p1End,
      pinnacleNumber: p1Num,
      challengeNumber: c1Num,
      keyTheme: `Formative Phase (Pinnacle ${p1Num}, Challenge ${c1Num})`,
      growthObjective: 'Establishing personal independence, baseline skill mastery, and foundation.',
    },
    {
      phase: 2,
      startAge: p1End + 1,
      endAge: p2End,
      pinnacleNumber: p2Num,
      challengeNumber: c2Num,
      keyTheme: `Productive Expansion Phase (Pinnacle ${p2Num}, Challenge ${c2Num})`,
      growthObjective: 'Career acceleration, family building, and mastering practical challenges.',
    },
    {
      phase: 3,
      startAge: p2End + 1,
      endAge: p3End,
      pinnacleNumber: p3Num,
      challengeNumber: c3Num,
      keyTheme: `Leadership & Harvest Phase (Pinnacle ${p3Num}, Challenge ${c3Num})`,
      growthObjective: 'Strategic influence, mentoring, and leveraging built assets.',
    },
    {
      phase: 4,
      startAge: p3End + 1,
      endAge: 99,
      pinnacleNumber: p4Num,
      challengeNumber: c4Num,
      keyTheme: `Wisdom & Legacy Phase (Pinnacle ${p4Num}, Challenge ${c4Num})`,
      growthObjective: 'Spiritual mastery, teaching, philanthropic legacy, and inner fulfillment.',
    },
  ];
}

export function detectKarmicDebts(dob: string, name: string = ''): KarmicDebtInfo[] {
  const debts: KarmicDebtInfo[] = [];

  // Check birth day
  if (dob) {
    const parts = dob.split(/[-\/]/);
    const day = parts[0].length === 4 ? Number(parts[2]) : Number(parts[0]);
    if ([13, 14, 16, 19].includes(day)) {
      debts.push(getKarmicDetail(day, 'Day of Birth'));
    }
  }

  // Check Chaldean or Pythagorean name sum raw compound
  if (name) {
    const cSum = calculateChaldeanSum(name);
    if ([13, 14, 16, 19].includes(cSum)) {
      debts.push(getKarmicDetail(cSum, 'Name Compound Frequency'));
    }
  }

  return debts;
}

function getKarmicDetail(num: number, source: string): KarmicDebtInfo {
  switch (num) {
    case 13:
      return {
        karmicNumber: 13,
        source,
        description: 'Karmic Debt 13/4: Represents overcoming past-life laziness or shortcuts through disciplined hard work and clear systems.',
        rituals: ['Maintain strict daily routine', 'Avoid procrastinating key decisions', 'Keep workplace clutter-free'],
      };
    case 14:
      return {
        karmicNumber: 14,
        source,
        description: 'Karmic Debt 14/5: Represents mastering freedom without falling into sensory abuse, addiction, or reckless impatience.',
        rituals: ['Practice emotional moderation', 'Commit to long-term projects', 'Daily 10-min breathwork'],
      };
    case 16:
      return {
        karmicNumber: 16,
        source,
        description: 'Karmic Debt 16/7: The Tower debt — purging false ego, vanity, and illusions to build genuine spiritual truth.',
        rituals: ['Practice humility & self-reflection', 'Study ancient wisdom texts', 'Avoid arrogance in relationships'],
      };
    case 19:
      return {
        karmicNumber: 19,
        source,
        description: 'Karmic Debt 19/1: Represents learning to use personal power and independence without being selfish or controlling.',
        rituals: ['Actively mentor others', 'Listen without interrupting', 'Engage in selfless community service'],
      };
    default:
      return {
        karmicNumber: num,
        source,
        description: 'General Karmic Vibration',
        rituals: ['Daily meditation'],
      };
  }
}

export function calculateHealthVitality(mulank: number, bhagyank: number): HealthVitalityProfile {
  const m = Math.min(Math.max(mulank || 1, 1), 9);
  
  const HEALTH_MAP: Record<number, HealthVitalityProfile> = {
    1: {
      vulnerableOrgans: ['Heart', 'Eyes', 'Blood Circulation', 'Spine'],
      elementDeficiency: 'Fire Imbalance (Excess Heat)',
      ayurvedicDietTips: ['Consume cooling herbs like coriander and amla', 'Avoid excessive red chili and fried foods'],
      chakraFocus: 'Manipura (Solar Plexus) & Anahata (Heart)',
      stressReliefRoutine: 'Morning Sun Salutations (Surya Namaskar) & 15-minute nature walks.',
    },
    2: {
      vulnerableOrgans: ['Stomach', 'Digestion', 'Lungs', 'Fluid Balance'],
      elementDeficiency: 'Water & Aura Sensitivity',
      ayurvedicDietTips: ['Eat warm cooked soups', 'Drink warm milk with turmeric before sleep'],
      chakraFocus: 'Svadhisthana (Sacral) & Ajna (Third Eye)',
      stressReliefRoutine: 'Chanting Moon Mantra (Om Som Somaya Namah) & calming pranayama.',
    },
    3: {
      vulnerableOrgans: ['Liver', 'Nervous System', 'Thighs', 'Arteries'],
      elementDeficiency: 'Space & Wood Element Expansion',
      ayurvedicDietTips: ['Include leafy greens and turmeric water', 'Avoid heavy midnight meals'],
      chakraFocus: 'Vishuddha (Throat) & Sahasrara (Crown)',
      stressReliefRoutine: 'Creative journaling, public speaking practice, and evening quiet reflection.',
    },
    4: {
      vulnerableOrgans: ['Head', 'Respiratory Track', 'Kidneys', 'Sudden Anxiety'],
      elementDeficiency: 'Air & Rahu Vibrational Fluctuations',
      ayurvedicDietTips: ['Eat grounded root vegetables (sweet potato, carrots)', 'Drink warm water with cinnamon'],
      chakraFocus: 'Muladhara (Root) & Ajna (Third Eye)',
      stressReliefRoutine: 'Strict fixed sleeping schedule & keeping camphor in bedroom.',
    },
    5: {
      vulnerableOrgans: ['Nervous System', 'Hands', 'Lungs', 'Sleep Disruption'],
      elementDeficiency: 'Air & Mercury Speed Stress',
      ayurvedicDietTips: ['Drink fresh pomegranate juice', 'Soak 5 almonds overnight and consume in morning'],
      chakraFocus: 'Vishuddha (Throat) & Anahata (Heart)',
      stressReliefRoutine: 'Digital detox after 9 PM & listening to 528Hz frequency music.',
    },
    6: {
      vulnerableOrgans: ['Throat', 'Hormones', 'Kidneys', 'Skin Sensitivity'],
      elementDeficiency: 'Water & Venusian Sensitivity',
      ayurvedicDietTips: ['Incorporate rose water, cardamoms, and coconut water', 'Limit refined sugars'],
      chakraFocus: 'Anahata (Heart) & Svadhisthana (Sacral)',
      stressReliefRoutine: 'Aromatherapy with sandalwood/rose oil & creative arts.',
    },
    7: {
      vulnerableOrgans: ['Digestive Tract', 'Skin', 'Feet', 'Psychosomatic Stress'],
      elementDeficiency: 'Ether & Ketu Inner Restlessness',
      ayurvedicDietTips: ['Eat simple sattvic vegetarian meals', 'Sip warm ginger-tulsi tea'],
      chakraFocus: 'Ajna (Third Eye) & Sahasrara (Crown)',
      stressReliefRoutine: 'Vipassana silent meditation & spending time near natural water bodies.',
    },
    8: {
      vulnerableOrgans: ['Bones', 'Joints', 'Teeth', 'Lower Back', 'Longevity'],
      elementDeficiency: 'Earth & Saturn Density',
      ayurvedicDietTips: ['Consume sesame seeds, flaxseed oil, and iron-rich foods', 'Avoid cold frozen drinks'],
      chakraFocus: 'Muladhara (Root)',
      stressReliefRoutine: 'Deep tissue massage (Abhyanga) with warm sesame oil & barefoot walking on grass.',
    },
    9: {
      vulnerableOrgans: ['Blood', 'Muscles', 'Head/Face', 'Inflammation'],
      elementDeficiency: 'Mars Fire Intensity',
      ayurvedicDietTips: ['Drink coconut water and cucumber juice', 'Avoid spicy processed food'],
      chakraFocus: 'Manipura (Solar Plexus) & Muladhara (Root)',
      stressReliefRoutine: 'High-intensity athletic workout followed by 10-min Savasana.',
    },
  };

  return HEALTH_MAP[m] || HEALTH_MAP[1];
}

export async function saveAIMemory(userId: string, memoryKey: string, memoryValue: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('ai_user_memory').upsert({
      user_id: userId,
      memory_key: memoryKey,
      memory_value: memoryValue,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,memory_key' });

    if (error) {
      console.warn('ai_user_memory upsert notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveAIMemory exception:', err);
    return false;
  }
}

export interface LoshuPlanesAnalysis {
  hasMentalPlane: boolean;    // 4,9,2
  hasEmotionalPlane: boolean; // 3,5,7
  hasPracticalPlane: boolean; // 8,1,6
  hasThoughtPlane: boolean;   // 4,3,8
  hasWillPlane: boolean;      // 9,5,1
  hasActionPlane: boolean;    // 2,7,6
  hasGoldenYog: boolean;      // 4,5,6 (Raj Yog)
  hasSilverYog: boolean;      // 2,5,8 (Property Yog)
  missingNumbers: number[];
  elementalRemedies: { number: number; element: string; remedy: string }[];
}

export function calculateLoshuPlanes(dob: string): LoshuPlanesAnalysis {
  if (!dob) {
    return {
      hasMentalPlane: false,
      hasEmotionalPlane: false,
      hasPracticalPlane: false,
      hasThoughtPlane: false,
      hasWillPlane: false,
      hasActionPlane: false,
      hasGoldenYog: false,
      hasSilverYog: false,
      missingNumbers: [1,2,3,4,5,6,7,8,9],
      elementalRemedies: [],
    };
  }

  const digits = dob.replace(/[^0-9]/g, '').split('').map(Number).filter(n => n >= 1 && n <= 9);
  const presentSet = new Set(digits);

  const hasMentalPlane = presentSet.has(4) && presentSet.has(9) && presentSet.has(2);
  const hasEmotionalPlane = presentSet.has(3) && presentSet.has(5) && presentSet.has(7);
  const hasPracticalPlane = presentSet.has(8) && presentSet.has(1) && presentSet.has(6);

  const hasThoughtPlane = presentSet.has(4) && presentSet.has(3) && presentSet.has(8);
  const hasWillPlane = presentSet.has(9) && presentSet.has(5) && presentSet.has(1);
  const hasActionPlane = presentSet.has(2) && presentSet.has(7) && presentSet.has(6);

  const hasGoldenYog = presentSet.has(4) && presentSet.has(5) && presentSet.has(6);
  const hasSilverYog = presentSet.has(2) && presentSet.has(5) && presentSet.has(8);

  const missingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !presentSet.has(n));

  const REMEDY_MAP: Record<number, { element: string; remedy: string }> = {
    1: { element: 'Water (North)', remedy: 'Place a small crystal water fountain in North zone; wear a blue wristband.' },
    2: { element: 'Earth (South-West)', remedy: 'Hang a mountain landscape painting (no water) in South-West; wear silver.' },
    3: { element: 'Wood (East)', remedy: 'Keep green indoor plants in East direction; respect teachers and elders.' },
    4: { element: 'Wood (South-East)', remedy: 'Use a green wooden pen for signing contracts; wear green Aventurine.' },
    5: { element: 'Center Earth (Brahmasthan)', remedy: 'Keep Yellow Quartz crystal in center of home; avoid center clutter.' },
    6: { element: 'Metal (North-West)', remedy: 'Hang a 6-rod brass wind chime in North-West; wear silver/white watch.' },
    7: { element: 'Metal (West)', remedy: 'Wear a silver chain or Tiger Eye crystal bracelet; practice meditation.' },
    8: { element: 'Earth (North-East)', remedy: 'Keep Clear Quartz crystal in North-East; maintain strict daily discipline.' },
    9: { element: 'Fire (South)', remedy: 'Place a red light bulb in South direction; engage in daily physical exercise.' },
  };

  const elementalRemedies = missingNumbers.map(n => ({
    number: n,
    element: REMEDY_MAP[n]?.element || 'Elemental Balance',
    remedy: REMEDY_MAP[n]?.remedy || 'General balance',
  }));

  return {
    hasMentalPlane,
    hasEmotionalPlane,
    hasPracticalPlane,
    hasThoughtPlane,
    hasWillPlane,
    hasActionPlane,
    hasGoldenYog,
    hasSilverYog,
    missingNumbers,
    elementalRemedies,
  };
}

export interface GemstoneRudrakshaPrescription {
  primaryGemstone: string;
  recommendedRatti: number;
  metalType: string;
  wearFinger: string;
  wearDayTime: string;
  rudrakshaMukhi: string;
  yantraDirection: string;
  beejMantra: string;
}

export function calculateGemstoneRudrakshaPrescription(mulank: number, bodyWeightKg: number = 70): GemstoneRudrakshaPrescription {
  const m = Math.min(Math.max(mulank || 1, 1), 9);
  const ratti = Number(((bodyWeightKg / 10) + 1).toFixed(1));

  const PRESCRIPTIONS: Record<number, Omit<GemstoneRudrakshaPrescription, 'recommendedRatti'>> = {
    1: {
      primaryGemstone: 'Ruby (Manikya)',
      metalType: 'Yellow Gold or Copper',
      wearFinger: 'Ring Finger',
      wearDayTime: 'Sunday morning during Sunrise',
      rudrakshaMukhi: '1 Mukhi or 12 Mukhi Rudraksha',
      yantraDirection: 'East Wall of Office/Home',
      beejMantra: 'Om Hram Hrim Hrom Sah Suryaya Namah (108 times)',
    },
    2: {
      primaryGemstone: 'Pearl (Moti) or Moonstone',
      metalType: 'Pure Silver',
      wearFinger: 'Little Finger',
      wearDayTime: 'Monday evening during Moonrise',
      rudrakshaMukhi: '2 Mukhi Rudraksha',
      yantraDirection: 'North-West Wall',
      beejMantra: 'Om Shram Shrim Shrom Sah Somaya Namah (108 times)',
    },
    3: {
      primaryGemstone: 'Yellow Sapphire (Pukhraj)',
      metalType: 'Yellow Gold or Brass',
      wearFinger: 'Index Finger',
      wearDayTime: 'Thursday morning during Brahma Muhurta',
      rudrakshaMukhi: '5 Mukhi Rudraksha',
      yantraDirection: 'North-East (Ishan Kone)',
      beejMantra: 'Om Gram Grim Grom Sah Gurave Namah (108 times)',
    },
    4: {
      primaryGemstone: 'Hessonite (Gomed)',
      metalType: 'Panchdhatu or Silver',
      wearFinger: 'Middle Finger',
      wearDayTime: 'Saturday evening after Sunset',
      rudrakshaMukhi: '8 Mukhi Rudraksha',
      yantraDirection: 'South-West Wall',
      beejMantra: 'Om Bhram Bhrim Bhrom Sah Rahave Namah (108 times)',
    },
    5: {
      primaryGemstone: 'Emerald (Panna)',
      metalType: 'Gold or Silver',
      wearFinger: 'Little Finger',
      wearDayTime: 'Wednesday morning',
      rudrakshaMukhi: '4 Mukhi Rudraksha',
      yantraDirection: 'North Wall of Living Room',
      beejMantra: 'Om Bram Brim Brom Sah Budhaya Namah (108 times)',
    },
    6: {
      primaryGemstone: 'Diamond (Heera) or White Zircon',
      metalType: 'Platinum or Silver',
      wearFinger: 'Middle Finger or Ring Finger',
      wearDayTime: 'Friday morning during Sunrise',
      rudrakshaMukhi: '6 Mukhi Rudraksha',
      yantraDirection: 'South-East Wall',
      beejMantra: 'Om Dram Drim Drom Sah Shukraya Namah (108 times)',
    },
    7: {
      primaryGemstone: 'Cat\'s Eye (Lehsuniya)',
      metalType: 'Panchdhatu or Silver',
      wearFinger: 'Middle Finger',
      wearDayTime: 'Tuesday late evening',
      rudrakshaMukhi: '9 Mukhi Rudraksha',
      yantraDirection: 'North-East Direction',
      beejMantra: 'Om Sram Srim Srom Sah Ketave Namah (108 times)',
    },
    8: {
      primaryGemstone: 'Blue Sapphire (Neelam) or Amethyst',
      metalType: 'Iron Ring from Horseshoe or Steel',
      wearFinger: 'Middle Finger of Right Hand',
      wearDayTime: 'Saturday evening during Twilight',
      rudrakshaMukhi: '7 Mukhi Rudraksha',
      yantraDirection: 'West Wall',
      beejMantra: 'Om Sham Shanaiscarayai Namah (108 times)',
    },
    9: {
      primaryGemstone: 'Red Coral (Moonga)',
      metalType: 'Copper or Yellow Gold',
      wearFinger: 'Ring Finger',
      wearDayTime: 'Tuesday morning during Sunrise',
      rudrakshaMukhi: '3 Mukhi Rudraksha',
      yantraDirection: 'South Wall',
      beejMantra: 'Om Kram Krim Krom Sah Bhaumaya Namah (108 times)',
    },
  };

  const base = PRESCRIPTIONS[m] || PRESCRIPTIONS[1];

  return {
    ...base,
    recommendedRatti: ratti,
  };
}

