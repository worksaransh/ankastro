// 36-Point Ashtakoota Gun Milan Engine (Vedic Marriage Compatibility)
// 100% Free & Open-Source Native Implementation

export interface AshtakootaResult {
  totalScore: number;
  maxScore: 36;
  percentage: number;
  category: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
  kootas: {
    varna: { score: number; max: 1; name: string; brideValue: string; groomValue: string; explanation: string };
    vashya: { score: number; max: 2; name: string; brideValue: string; groomValue: string; explanation: string };
    tara: { score: number; max: 3; name: string; brideValue: string; groomValue: string; explanation: string };
    yoni: { score: number; max: 4; name: string; brideValue: string; groomValue: string; explanation: string };
    grahaMaitri: { score: number; max: 5; name: string; brideValue: string; groomValue: string; explanation: string };
    gana: { score: number; max: 6; name: string; brideValue: string; groomValue: string; explanation: string };
    bhakoot: { score: number; max: 7; name: string; brideValue: string; groomValue: string; isDosha: boolean; isCancelled: boolean; explanation: string };
    nadi: { score: number; max: 8; name: string; brideValue: string; groomValue: string; isDosha: boolean; isCancelled: boolean; explanation: string };
  };
  summary: string;
  doshas: string[];
}

// 1. Varna: Brahmin (4), Kshatriya (3), Vaishya (2), Shudra (1)
// Water signs (Cancer, Scorpio, Pisces) -> Brahmin (4)
// Fire signs (Aries, Leo, Sagittarius) -> Kshatriya (3)
// Earth signs (Taurus, Virgo, Capricorn) -> Vaishya (2)
// Air signs (Gemini, Libra, Aquarius) -> Shudra (1)
const SIGN_VARNA: Record<number, { name: string; rank: number }> = {
  4: { name: 'Brahmin', rank: 4 }, 8: { name: 'Brahmin', rank: 4 }, 12: { name: 'Brahmin', rank: 4 },
  1: { name: 'Kshatriya', rank: 3 }, 5: { name: 'Kshatriya', rank: 3 }, 9: { name: 'Kshatriya', rank: 3 },
  2: { name: 'Vaishya', rank: 2 }, 6: { name: 'Vaishya', rank: 2 }, 10: { name: 'Vaishya', rank: 2 },
  3: { name: 'Shudra', rank: 1 }, 7: { name: 'Shudra', rank: 1 }, 11: { name: 'Shudra', rank: 1 },
};

// 2. Vashya: Chatushpada (Quadruped), Dwipada (Human), Jalachara (Water), Vanachara (Wild), Keeta (Insect)
const SIGN_VASHYA: Record<number, string> = {
  1: 'Chatushpada', 2: 'Chatushpada', 3: 'Dwipada', 4: 'Jalachara',
  5: 'Vanachara', 6: 'Dwipada', 7: 'Dwipada', 8: 'Keeta',
  9: 'Dwipada', 10: 'Jalachara', 11: 'Dwipada', 12: 'Jalachara',
};

// 4. Yoni: 14 Animal archetypes based on 27 Nakshatras (0-26)
const NAKSHATRA_YONI = [
  'Horse', 'Elephant', 'Sheep', 'Serpent', 'Serpent', 'Dog', 'Cat', 'Sheep', 'Cat', // 0-8: Ashwini to Ashlesha
  'Rat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Buffalo', 'Tiger', 'Deer', 'Deer', // 9-17: Magha to Jyeshtha
  'Dog', 'Monkey', 'Mongoose', 'Monkey', 'Lion', 'Horse', 'Lion', 'Cow', 'Elephant', // 18-26: Mula to Revati
];

// Yoni enemy pairs
const YONI_ENEMIES: Record<string, string> = {
  'Horse': 'Buffalo', 'Buffalo': 'Horse',
  'Elephant': 'Lion', 'Lion': 'Elephant',
  'Sheep': 'Monkey', 'Monkey': 'Sheep',
  'Serpent': 'Mongoose', 'Mongoose': 'Serpent',
  'Dog': 'Deer', 'Deer': 'Dog',
  'Cat': 'Rat', 'Rat': 'Cat',
  'Cow': 'Tiger', 'Tiger': 'Cow',
};

// 6. Gana: Deva (Divine), Manushya (Human), Rakshasa (Demonic) based on 27 Nakshatras
const NAKSHATRA_GANA = [
  'Deva', 'Manushya', 'Rakshasa', 'Manushya', 'Deva', 'Manushya', 'Deva', 'Deva', 'Rakshasa', // 0-8
  'Rakshasa', 'Manushya', 'Manushya', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', 'Deva', 'Rakshasa', // 9-17
  'Rakshasa', 'Manushya', 'Deva', 'Deva', 'Rakshasa', 'Rakshasa', 'Manushya', 'Manushya', 'Deva', // 18-26
];

// 8. Nadi: Adi (Vata), Madhya (Pitta), Antya (Kapha) based on 27 Nakshatras (cycles 1-2-3-3-2-1)
const NAKSHATRA_NADI = [
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya',
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya',
  'Adi', 'Madhya', 'Antya', 'Antya', 'Madhya', 'Adi', 'Adi', 'Madhya', 'Antya',
];

// Planetary lords of 12 signs (1=Aries ... 12=Pisces)
const SIGN_LORDS: Record<number, string> = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon',
  5: 'Sun', 6: 'Mercury', 7: 'Venus', 8: 'Mars',
  9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};

// Natural friendship matrix between 7 classical planets
const PLANET_FRIENDS: Record<string, { friends: string[]; neutrals: string[]; enemies: string[] }> = {
  'Sun': { friends: ['Moon', 'Mars', 'Jupiter'], neutrals: ['Mercury'], enemies: ['Venus', 'Saturn'] },
  'Moon': { friends: ['Sun', 'Mercury'], neutrals: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  'Mars': { friends: ['Sun', 'Moon', 'Jupiter'], neutrals: ['Venus', 'Saturn'], enemies: ['Mercury'] },
  'Mercury': { friends: ['Sun', 'Venus'], neutrals: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  'Jupiter': { friends: ['Sun', 'Moon', 'Mars'], neutrals: ['Saturn'], enemies: ['Mercury', 'Venus'] },
  'Venus': { friends: ['Mercury', 'Saturn'], neutrals: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  'Saturn': { friends: ['Mercury', 'Venus'], neutrals: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] },
};

/**
 * Calculates full 36-point Ashtakoota Gun Milan between Groom and Bride.
 * @param groomMoonSign Rashi 1-12
 * @param groomNakshatraIndex Nakshatra 0-26
 * @param brideMoonSign Rashi 1-12
 * @param brideNakshatraIndex Nakshatra 0-26
 */
export function calculateAshtakootaMilan(
  groomMoonSign: number,
  groomNakshatraIndex: number,
  brideMoonSign: number,
  brideNakshatraIndex: number
): AshtakootaResult {
  // 1. Varna (1 Point): Groom rank >= Bride rank gets 1 pt, else 0
  const gVarna = SIGN_VARNA[groomMoonSign] || { name: 'Kshatriya', rank: 3 };
  const bVarna = SIGN_VARNA[brideMoonSign] || { name: 'Kshatriya', rank: 3 };
  let varnaScore = gVarna.rank >= bVarna.rank ? 1 : 0;

  // 2. Vashya (2 Points)
  const gVashya = SIGN_VASHYA[groomMoonSign] || 'Dwipada';
  const bVashya = SIGN_VASHYA[brideMoonSign] || 'Dwipada';
  let vashyaScore = 0;
  if (gVashya === bVashya) vashyaScore = 2;
  else if (
    (gVashya === 'Dwipada' && bVashya === 'Chatushpada') ||
    (gVashya === 'Chatushpada' && bVashya === 'Jalachara')
  ) {
    vashyaScore = 1;
  }

  // 3. Tara (3 Points): Count from bride to groom and groom to bride mod 9
  const taraFromBride = ((groomNakshatraIndex - brideNakshatraIndex + 27) % 9) + 1;
  const taraFromGroom = ((brideNakshatraIndex - groomNakshatraIndex + 27) % 9) + 1;
  const auspiciousTaras = [1, 2, 4, 6, 8, 9];
  const gTaraGood = auspiciousTaras.includes(taraFromBride);
  const bTaraGood = auspiciousTaras.includes(taraFromGroom);
  let taraScore = (gTaraGood ? 1.5 : 0) + (bTaraGood ? 1.5 : 0);

  // 4. Yoni (4 Points)
  const gYoni = NAKSHATRA_YONI[groomNakshatraIndex] || 'Horse';
  const bYoni = NAKSHATRA_YONI[brideNakshatraIndex] || 'Horse';
  let yoniScore = 2;
  if (gYoni === bYoni) {
    yoniScore = 4;
  } else if (YONI_ENEMIES[gYoni] === bYoni) {
    yoniScore = 0;
  } else {
    yoniScore = 2; // neutral
  }

  // 5. Graha Maitri (5 Points): Moon sign lord relationships
  const gLord = SIGN_LORDS[groomMoonSign] || 'Sun';
  const bLord = SIGN_LORDS[brideMoonSign] || 'Sun';
  let maitriScore = 0;
  if (gLord === bLord) {
    maitriScore = 5;
  } else {
    const gViewsB = PLANET_FRIENDS[gLord]?.friends.includes(bLord) ? 'F' : PLANET_FRIENDS[gLord]?.enemies.includes(bLord) ? 'E' : 'N';
    const bViewsG = PLANET_FRIENDS[bLord]?.friends.includes(gLord) ? 'F' : PLANET_FRIENDS[bLord]?.enemies.includes(gLord) ? 'E' : 'N';

    if (gViewsB === 'F' && bViewsG === 'F') maitriScore = 5;
    else if ((gViewsB === 'F' && bViewsG === 'N') || (gViewsB === 'N' && bViewsG === 'F')) maitriScore = 4;
    else if (gViewsB === 'N' && bViewsG === 'N') maitriScore = 3;
    else if ((gViewsB === 'F' && bViewsG === 'E') || (gViewsB === 'E' && bViewsG === 'F')) maitriScore = 1;
    else if ((gViewsB === 'N' && bViewsG === 'E') || (gViewsB === 'E' && bViewsG === 'N')) maitriScore = 0.5;
    else maitriScore = 0;
  }

  // 6. Gana (6 Points)
  const gGana = NAKSHATRA_GANA[groomNakshatraIndex] || 'Deva';
  const bGana = NAKSHATRA_GANA[brideNakshatraIndex] || 'Deva';
  let ganaScore = 0;
  if (gGana === bGana) {
    ganaScore = 6;
  } else if ((gGana === 'Deva' && bGana === 'Manushya') || (gGana === 'Manushya' && bGana === 'Deva')) {
    ganaScore = 5;
  } else if (gGana === 'Rakshasa' && bGana === 'Deva') {
    ganaScore = 1;
  } else {
    ganaScore = 0; // Deva/Manushya with Rakshasa
  }

  // 7. Bhakoot (7 Points): Moon sign distance. Bad combinations are 6-8 (Shadashtak), 9-5 (Navam-Pancham), 12-2 (Dwir-Dwadash)
  const signDistance = ((Math.abs(groomMoonSign - brideMoonSign) + 12) % 12) + 1;
  const isBhakootDosha = [2, 6, 8, 9, 12].includes(signDistance);
  // Cancellation: Same sign lord or same sign
  const bhakootCancelled = isBhakootDosha && (gLord === bLord || groomMoonSign === brideMoonSign);
  let bhakootScore = (!isBhakootDosha || bhakootCancelled) ? 7 : 0;

  // 8. Nadi (8 Points): Must not share the same Nadi
  const gNadi = NAKSHATRA_NADI[groomNakshatraIndex] || 'Adi';
  const bNadi = NAKSHATRA_NADI[brideNakshatraIndex] || 'Madhya';
  const isNadiDosha = gNadi === bNadi;
  // Cancellation: Same Nakshatra but different Pada, or same Rashi but different Nakshatra
  const nadiCancelled = isNadiDosha && (groomMoonSign !== brideMoonSign || groomNakshatraIndex !== brideNakshatraIndex);
  let nadiScore = (!isNadiDosha || nadiCancelled) ? 8 : 0;

  // Total Score Calculation
  const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;
  const percentage = Math.round((totalScore / 36) * 100);

  let category: AshtakootaResult['category'] = 'Good';
  if (totalScore >= 28) category = 'Excellent';
  else if (totalScore >= 18) category = 'Good';
  else if (totalScore >= 12) category = 'Average';
  else category = 'Not Recommended';

  const doshas: string[] = [];
  if (isNadiDosha && !nadiCancelled) doshas.push('Nadi Dosha (Genetic & health vulnerability)');
  if (isBhakootDosha && !bhakootCancelled) doshas.push('Bhakoot Dosha (Emotional/financial friction)');
  if (ganaScore === 0) doshas.push('Gana Dosha (Temperament clash)');

  return {
    totalScore,
    maxScore: 36,
    percentage,
    category,
    kootas: {
      varna: {
        score: varnaScore, max: 1, name: 'Varna (Spiritual Alignment)',
        brideValue: bVarna.name, groomValue: gVarna.name,
        explanation: varnaScore === 1 ? 'Harmonious spiritual and ego compatibility.' : 'Different approaches to authority and ego.',
      },
      vashya: {
        score: vashyaScore, max: 2, name: 'Vashya (Mutual Attraction)',
        brideValue: bVashya, groomValue: gVashya,
        explanation: vashyaScore === 2 ? 'Strong mutual attraction and natural chemistry.' : 'Moderate control dynamics.',
      },
      tara: {
        score: taraScore, max: 3, name: 'Tara (Health & Destiny)',
        brideValue: `Tara ${taraFromGroom}`, groomValue: `Tara ${taraFromBride}`,
        explanation: taraScore >= 2 ? 'Auspicious birth star relationship promoting longevity.' : 'Moderate planetary wave synchronization.',
      },
      yoni: {
        score: yoniScore, max: 4, name: 'Yoni (Physical & Biological Harmony)',
        brideValue: bYoni, groomValue: gYoni,
        explanation: yoniScore === 4 ? 'Perfect physical, instinctual, and biological harmony.' : yoniScore === 0 ? 'Instinctual conflict between animal symbols.' : 'Neutral biological compatibility.',
      },
      grahaMaitri: {
        score: maitriScore, max: 5, name: 'Graha Maitri (Psychological Friendship)',
        brideValue: `${bLord} (Ruler)`, groomValue: `${gLord} (Ruler)`,
        explanation: maitriScore >= 4 ? 'Excellent planetary friendship fostering deep mental rapport.' : 'Occasional differences in thought processes.',
      },
      gana: {
        score: ganaScore, max: 6, name: 'Gana (Temperament & Lifestyle)',
        brideValue: bGana, groomValue: gGana,
        explanation: ganaScore >= 5 ? 'Harmonious nature and mutual respect in daily life.' : 'Distinct temperaments requiring patience and understanding.',
      },
      bhakoot: {
        score: bhakootScore, max: 7, name: 'Bhakoot (Emotional & Financial Growth)',
        brideValue: `Sign ${brideMoonSign}`, groomValue: `Sign ${groomMoonSign}`,
        isDosha: isBhakootDosha,
        isCancelled: bhakootCancelled,
        explanation: bhakootScore === 7 ? (bhakootCancelled ? 'Bhakoot Dosha cancelled due to auspicious planetary lordship.' : 'Harmonious moon signs fostering prosperity and emotional happiness.') : 'Bhakoot dosha detected — financial and emotional alignment requires mutual care.',
      },
      nadi: {
        score: nadiScore, max: 8, name: 'Nadi (Genetic & Progeny Health)',
        brideValue: bNadi, groomValue: gNadi,
        isDosha: isNadiDosha,
        isCancelled: nadiCancelled,
        explanation: nadiScore === 8 ? (nadiCancelled ? 'Nadi Dosha cancelled due to different nakshatra padas.' : 'Different Nadis ensuring strong physical and genetic vitality.') : 'Same Nadi detected — classical remedies recommended for vitality.',
      },
    },
    summary: totalScore >= 18
      ? `Auspicious match with a Gun Milan score of ${totalScore}/36 (${percentage}%). The classical minimum threshold of 18 points is satisfied.`
      : `Gun Milan score is ${totalScore}/36 (${percentage}%). Classical guidelines recommend consulting detailed charts and remedies before finalizing.`,
    doshas,
  };
}
