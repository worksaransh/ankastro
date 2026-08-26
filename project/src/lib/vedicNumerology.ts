// Vedic/Indian Numerology System
// Complete calculations for Mulank, Bhagyank, Remedies, and Predictions

import dateProfiles from '@/content/nikb_date_profiles.json';
import compoundNumbers from '@/content/nikb_compound_numbers.json';

export interface CompoundNumberProfile {
  compound: number;
  tradName: string;
  nature: string;
  coreMeaning: string;
  careerImpact: string;
  wealthImpact: string;
  relationshipImpact: string;
  businessImpact: string;
}

export interface VedicProfile {
  mulank: number;
  bhagyank: number;
  harmonyScore: number;
  harmonyLevel: 'Excellent' | 'Good' | 'Moderate' | 'Challenging';
  mulankMeaning: MulankMeaning;
  bhagyankMeaning: BhagyankMeaning;
  remedies: VedicRemedies;
  chakraAlignment: ChakraAlignment;
  predictions: Predictions;
  compoundNumberProfile?: CompoundNumberProfile;
}

export interface MulankMeaning {
  title: string;
  emotionalCore: string;
  naturalBehavior: string;
  strengths: string[];
  weaknesses: string[];
  whyThisNumber: string;
  dayInLife: string;
  famousPersonalities: string[];
}

export interface BhagyankMeaning {
  title: string;
  lifeDirection: string;
  dharmicPath: string;
  karmicPurpose: string;
  whyThisDefinesDestiny: string;
  spiritualLesson: string;
}

export interface VedicRemedies {
  luckyDirection: string;
  personalMantra: string;
  suggestedColors: string[];
  weakChakra: string;
  chakraBalancingTip: string;
  suggestedStones: string[];
  grahEnergy: string;
  grahBalancing: string;
  dosAndDonts: { dos: string[]; donts: string[] };
  manifestationChecklist: string[];
}

export interface ChakraAlignment {
  root: number;
  sacral: number;
  solarPlexus: number;
  heart: number;
  throat: number;
  thirdEye: number;
  crown: number;
  overallBalance: number;
}

export interface MonthPrediction {
  month: string;
  theme: string;
  risk: string;
  opportunity: string;
  timing: string;
  score: number;
  action: 'pause' | 'build' | 'breakthrough';
}

export interface YearPrediction {
  year: number;
  theme: string;
  growth: string;
  challenges: string;
  isTurningPoint: boolean;
  action: 'pause' | 'build' | 'breakthrough';
  score: number;
}

export interface Predictions {
  next12Months: MonthPrediction[];
  next10Years: YearPrediction[];
  turningPointYears: number[];
  currentPhase: 'pause' | 'build' | 'breakthrough';
}

export interface LifeCycleData {
  age: string;
  theme: string;
  energy: number;
  opportunities: number;
  challenges: number;
}

// Calculate Mulank (Birth Number / मूलांक / जन्मांक)
// Simply reduce the day of birth to single digit
// Example: 27 → 2+7 = 9
// Master numbers 11 and 22 are preserved if day is exactly 11 or 22
export function calculateMulank(dateOfBirth: string): number {
  const parts = dateOfBirth.split('/');
  if (parts.length !== 3) return 1;
  
  const day = parseInt(parts[0], 10);
  
  // Preserve 11 and 22 as master numbers for Mulank
  if (day === 11 || day === 22) return day;
  
  // Reduce to single digit
  let sum = day;
  while (sum > 9) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  return sum;
}

// Calculate Bhagyank (Destiny Number / भाग्यांक from full DOB)
// Same as Life Path - add all digits of DOB and reduce
// Example: 02/07/1998 → 0+2+0+7+1+9+9+8 = 36 → 3+6 = 9
// Preserve master numbers 11, 22, 33
export function calculateBhagyank(dateOfBirth: string): number {
  const parts = dateOfBirth.split('/');
  if (parts.length !== 3) return 1;
  
  const [day, month, year] = parts.map(p => parseInt(p, 10));
  
  // Add all individual digits
  const dayDigits = String(day).split('').reduce((a, d) => a + parseInt(d), 0);
  const monthDigits = String(month).split('').reduce((a, d) => a + parseInt(d), 0);
  const yearDigits = String(year).split('').reduce((a, d) => a + parseInt(d), 0);
  
  let sum = dayDigits + monthDigits + yearDigits;
  
  // Reduce but preserve master numbers 11, 22, 33
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  return sum;
}

// Calculate harmony between Mulank and Bhagyank
export function calculateHarmony(mulank: number, bhagyank: number): { score: number; level: 'Excellent' | 'Good' | 'Moderate' | 'Challenging' } {
  const harmonious: Record<number, number[]> = {
    1: [1, 2, 3, 9],
    2: [1, 2, 6, 9],
    3: [1, 3, 5, 6, 9],
    4: [4, 5, 6, 8],
    5: [1, 3, 5, 6, 7, 9],
    6: [2, 3, 4, 5, 6, 9],
    7: [5, 6, 7],
    8: [4, 5, 6, 8],
    9: [1, 2, 3, 5, 6, 9],
    11: [2, 4, 6, 11, 22],
    22: [4, 6, 8, 11, 22, 33],
    33: [3, 6, 9, 22, 33]
  };

  const m = mulank > 9 ? mulank : mulank;
  const b = bhagyank > 9 ? bhagyank : bhagyank;
  
  const isHarmonious = harmonious[m]?.includes(b) || harmonious[b]?.includes(m);
  const isSame = m === b;
  
  if (isSame) return { score: 95, level: 'Excellent' };
  if (isHarmonious) return { score: 80, level: 'Good' };
  if (Math.abs(m - b) <= 2) return { score: 65, level: 'Moderate' };
  return { score: 45, level: 'Challenging' };
}

// Mulank meanings database
const mulankMeanings: Record<number, MulankMeaning> = {
  1: {
    title: 'The Pioneer Leader',
    emotionalCore: 'You are driven by a deep need for independence and originality. Your emotions are tied to achievement and being first.',
    naturalBehavior: 'Natural leader who takes initiative. You prefer to work independently and make your own decisions. Direct in communication.',
    strengths: ['Leadership', 'Independence', 'Innovation', 'Courage', 'Determination'],
    weaknesses: ['Stubbornness', 'Impatience', 'Ego', 'Dominating nature'],
    whyThisNumber: 'Aapka janam 1, 10, 19, ya 28 tareekh ko hua hai. Yeh sankhya Sun (Surya) se judi hai, jo leadership aur aatmvishwas ka pratik hai.',
    dayInLife: 'You wake up with goals in mind. Morning is your power time. You make quick decisions and expect others to follow. You end the day reviewing what you accomplished.',
    famousPersonalities: ['Mahatma Gandhi', 'Steve Jobs', 'Martin Luther King Jr.']
  },
  2: {
    title: 'The Diplomatic Peacemaker',
    emotionalCore: 'You are deeply sensitive and intuitive. Your emotions are connected to relationships and harmony around you.',
    naturalBehavior: 'Natural mediator who seeks balance. You work well in partnerships and prefer cooperation over competition. Gentle communicator.',
    strengths: ['Diplomacy', 'Intuition', 'Cooperation', 'Sensitivity', 'Patience'],
    weaknesses: ['Over-sensitivity', 'Indecision', 'Dependency', 'Self-doubt'],
    whyThisNumber: 'Aapka janam 2, 11, 20, ya 29 tareekh ko hua hai. Yeh sankhya Moon (Chandra) se judi hai, jo emotions aur relationships ka pratik hai.',
    dayInLife: 'You start your day connecting with loved ones. You prefer calm environments. Decision-making takes time as you consider all perspectives. Evening is for nurturing relationships.',
    famousPersonalities: ['Mother Teresa', 'Princess Diana', 'Amitabh Bachchan']
  },
  3: {
    title: 'The Creative Communicator',
    emotionalCore: 'You thrive on self-expression and creativity. Your emotions are directly linked to how well you can communicate your ideas.',
    naturalBehavior: 'Natural entertainer with magnetic charm. You love social gatherings and creative pursuits. Optimistic and inspiring to others.',
    strengths: ['Creativity', 'Communication', 'Optimism', 'Charisma', 'Artistic talent'],
    weaknesses: ['Scattered energy', 'Superficiality', 'Moodiness', 'Exaggeration'],
    whyThisNumber: 'Aapka janam 3, 12, 21, ya 30 tareekh ko hua hai. Yeh sankhya Jupiter (Guru) se judi hai, jo wisdom aur expansion ka pratik hai.',
    dayInLife: 'Your mornings are creative bursts. You naturally attract people throughout the day. Work feels like play when you\'re inspired. Evenings are for art, music, or socializing.',
    famousPersonalities: ['Shah Rukh Khan', 'Jim Carrey', 'Taylor Swift']
  },
  4: {
    title: 'The Practical Builder',
    emotionalCore: 'You find security in stability and order. Your emotions are grounded in tangible achievements and reliable structures.',
    naturalBehavior: 'Systematic and hardworking. You build things to last and prefer proven methods. Reliable and detail-oriented.',
    strengths: ['Discipline', 'Reliability', 'Organization', 'Practicality', 'Determination'],
    weaknesses: ['Rigidity', 'Overwork', 'Stubbornness', 'Fear of change'],
    whyThisNumber: 'Aapka janam 4, 13, 22, ya 31 tareekh ko hua hai. Yeh sankhya Rahu se judi hai, jo foundation aur structure ka pratik hai.',
    dayInLife: 'You wake up with a plan. Every hour is accounted for. You find satisfaction in completing tasks. Evening is for reviewing progress and planning tomorrow.',
    famousPersonalities: ['Sachin Tendulkar', 'Bill Gates', 'Arnold Schwarzenegger']
  },
  5: {
    title: 'The Freedom Adventurer',
    emotionalCore: 'You crave variety and freedom. Your emotions fluctuate with your experiences - boredom is your enemy.',
    naturalBehavior: 'Natural explorer who embraces change. Versatile and adaptable. You communicate easily and love learning new things.',
    strengths: ['Adaptability', 'Versatility', 'Communication', 'Adventure', 'Quick thinking'],
    weaknesses: ['Restlessness', 'Inconsistency', 'Overindulgence', 'Fear of commitment'],
    whyThisNumber: 'Aapka janam 5, 14, ya 23 tareekh ko hua hai. Yeh sankhya Mercury (Budh) se judi hai, jo communication aur freedom ka pratik hai.',
    dayInLife: 'No two days are the same for you. You juggle multiple projects. Travel and new experiences energize you. Evening might find you in unexpected places.',
    famousPersonalities: ['Virat Kohli', 'Angelina Jolie', 'Abraham Lincoln']
  },
  6: {
    title: 'The Nurturing Harmonizer',
    emotionalCore: 'Love and family are everything to you. Your emotions are deeply tied to the wellbeing of those you care for.',
    naturalBehavior: 'Natural caregiver who creates harmony. Artistic and responsible. You take on burdens of others willingly.',
    strengths: ['Nurturing', 'Responsibility', 'Artistic sense', 'Harmony', 'Loyalty'],
    weaknesses: ['Over-giving', 'Perfectionism', 'Worry', 'Controlling tendency'],
    whyThisNumber: 'Aapka janam 6, 15, ya 24 tareekh ko hua hai. Yeh sankhya Venus (Shukra) se judi hai, jo love aur beauty ka pratik hai.',
    dayInLife: 'Your day centers around family and home. You beautify your surroundings. Work involves caring for others. Evening is for quality time with loved ones.',
    famousPersonalities: ['Deepika Padukone', 'John Lennon', 'Albert Einstein']
  },
  7: {
    title: 'The Spiritual Seeker',
    emotionalCore: 'You need solitude and depth. Your emotions are connected to your quest for truth and understanding.',
    naturalBehavior: 'Natural philosopher and analyst. You prefer quality over quantity in relationships. Introspective and intuitive.',
    strengths: ['Wisdom', 'Analysis', 'Intuition', 'Spirituality', 'Research skills'],
    weaknesses: ['Isolation', 'Overthinking', 'Aloofness', 'Skepticism'],
    whyThisNumber: 'Aapka janam 7, 16, ya 25 tareekh ko hua hai. Yeh sankhya Ketu se judi hai, jo spirituality aur inner wisdom ka pratik hai.',
    dayInLife: 'Mornings are for meditation or contemplation. You work best alone. Deep conversations energize you. Evenings are for reading, research, or spiritual practice.',
    famousPersonalities: ['A.R. Rahman', 'Princess Diana', 'Stephen Hawking']
  },
  8: {
    title: 'The Power Manifester',
    emotionalCore: 'Achievement and material success drive you. Your emotions are tied to your sense of power and accomplishment.',
    naturalBehavior: 'Natural executive with ambition. You think big and work hard. Authority comes naturally to you.',
    strengths: ['Ambition', 'Organization', 'Business acumen', 'Authority', 'Manifestation'],
    weaknesses: ['Materialism', 'Workaholism', 'Power struggles', 'Impatience'],
    whyThisNumber: 'Aapka janam 8, 17, ya 26 tareekh ko hua hai. Yeh sankhya Saturn (Shani) se judi hai, jo karma aur material mastery ka pratik hai.',
    dayInLife: 'You wake up thinking about your goals. Work consumes much of your energy. You naturally take charge in any situation. Evening is for strategizing and networking.',
    famousPersonalities: ['Narendra Modi', 'Elon Musk', 'Amitabh Bachchan']
  },
  9: {
    title: 'The Universal Humanitarian',
    emotionalCore: 'Compassion for humanity drives you. Your emotions are connected to the greater good and spiritual growth.',
    naturalBehavior: 'Natural healer and teacher. You see the big picture and work for collective benefit. Generous and wise.',
    strengths: ['Compassion', 'Wisdom', 'Generosity', 'Creativity', 'Universal love'],
    weaknesses: ['Emotional detachment', 'Scattered focus', 'Martyrdom', 'Over-idealism'],
    whyThisNumber: 'Aapka janam 9, 18, ya 27 tareekh ko hua hai. Yeh sankhya Mars (Mangal) se judi hai, jo courage aur humanitarian service ka pratik hai.',
    dayInLife: 'You start with thoughts of how to help others. Work often involves service. You attract people from all backgrounds. Evenings are for creative or spiritual pursuits.',
    famousPersonalities: ['Mahatma Gandhi', 'Akshay Kumar', 'Mother Teresa']
  },
  11: {
    title: 'The Master Intuitive',
    emotionalCore: 'You carry high spiritual voltage. Your emotions are intensely connected to intuition and higher purpose.',
    naturalBehavior: 'Visionary with heightened sensitivity. You inspire others through your insights. Bridge between material and spiritual.',
    strengths: ['Intuition', 'Inspiration', 'Spiritual insight', 'Visionary thinking', 'Healing'],
    weaknesses: ['Nervous tension', 'Impracticality', 'Self-doubt', 'Overwhelm'],
    whyThisNumber: 'Aapka janam 11 ya 29 tareekh ko hua hai. 11 Master Number hai - double Moon energy with spiritual amplification.',
    dayInLife: 'You receive insights throughout the day. Others are drawn to your wisdom. Creative and spiritual work fulfills you. Evening is for processing your intuitive downloads.',
    famousPersonalities: ['Barack Obama', 'Wolfgang Mozart', 'Lady Gaga']
  },
  22: {
    title: 'The Master Builder',
    emotionalCore: 'You feel the weight of great potential. Your emotions are tied to manifesting large-scale dreams.',
    naturalBehavior: 'Practical visionary who builds empires. Combines intuition with execution. Works for lasting impact.',
    strengths: ['Manifestation', 'Practical idealism', 'Leadership', 'Global vision', 'Discipline'],
    weaknesses: ['Overwhelm', 'Self-imposed pressure', 'Control issues', 'Overambition'],
    whyThisNumber: 'Aapka janam 22 tareekh ko hua hai. 22 Master Builder Number hai - double structure energy with spiritual power.',
    dayInLife: 'You think in terms of legacy. Work involves large projects and many people. You build structures that outlast you. Evening is for strategic planning.',
    famousPersonalities: ['Bill Gates', 'Oprah Winfrey', 'Clint Eastwood']
  },
  33: {
    title: 'The Master Healer',
    emotionalCore: 'Unconditional love is your essence. Your emotions flow as healing energy for all beings.',
    naturalBehavior: 'Channel for divine love and healing. Teacher of teachers. Your presence alone transforms others.',
    strengths: ['Healing', 'Unconditional love', 'Teaching', 'Spiritual mastery', 'Compassion'],
    weaknesses: ['Self-sacrifice', 'Overwhelm', 'Unrealistic expectations', 'Martyrdom'],
    whyThisNumber: '33 is the rarest Master Number - you carry the vibration of the cosmic teacher and healer.',
    dayInLife: 'Every interaction is an opportunity to heal. You attract those in need. Your work is spiritual service. Evening is for self-renewal and receiving.',
    famousPersonalities: ['Dalai Lama', 'Albert Einstein', 'Stephen Spielberg']
  }
};

// Bhagyank meanings database
const bhagyankMeanings: Record<number, BhagyankMeaning> = {
  1: {
    title: 'Path of Leadership',
    lifeDirection: 'Your life is meant to pioneer new paths. You are destined to lead, innovate, and inspire others through independent action.',
    dharmicPath: 'To develop strong willpower and use it to uplift others. Your dharma is to be a trailblazer.',
    karmicPurpose: 'Learning to balance ego with service. Past life patterns of either too much or too little leadership.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 1 aata hai. Iska matlab hai ki aap iss janam mein leader banne ke liye paida hue hain.',
    spiritualLesson: 'True power comes from serving the higher good, not personal glory.'
  },
  2: {
    title: 'Path of Diplomacy',
    lifeDirection: 'Your life is meant for partnership and cooperation. You are destined to bring harmony and heal relationships.',
    dharmicPath: 'To develop patience and use your sensitivity to understand others deeply. Your dharma is to be a peacemaker.',
    karmicPurpose: 'Learning to value yourself while serving others. Past life patterns of over-dependence or isolation.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 2 aata hai. Aap relationships aur harmony ke zariye apna mission poora karenge.',
    spiritualLesson: 'Your sensitivity is a gift - use it to bridge divides between people.'
  },
  3: {
    title: 'Path of Expression',
    lifeDirection: 'Your life is meant for creative expression and joy. You are destined to inspire others through your words and art.',
    dharmicPath: 'To develop your creative gifts and share them generously. Your dharma is to spread happiness.',
    karmicPurpose: 'Learning to focus creativity and avoid superficiality. Past life suppression of self-expression.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 3 aata hai. Aap creativity aur communication ke zariye duniya mein roshni laayenge.',
    spiritualLesson: 'Joy is your highest gift to the world - never let anyone dim your light.'
  },
  4: {
    title: 'Path of Foundation',
    lifeDirection: 'Your life is meant to build lasting structures. You are destined to create security and stability for others.',
    dharmicPath: 'To develop discipline and create systems that benefit many. Your dharma is to be a builder.',
    karmicPurpose: 'Learning flexibility within structure. Past life patterns of either chaos or excessive rigidity.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 4 aata hai. Aap solid foundations banane ke liye yahan hain.',
    spiritualLesson: 'True stability comes from inner peace, not just external structure.'
  },
  5: {
    title: 'Path of Freedom',
    lifeDirection: 'Your life is meant for exploration and teaching through experience. You are destined to help others embrace change.',
    dharmicPath: 'To develop adaptability and share wisdom gained through diverse experiences. Your dharma is to be a bridge between worlds.',
    karmicPurpose: 'Learning commitment while maintaining freedom. Past life patterns of either restriction or irresponsibility.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 5 aata hai. Aap freedom aur change ke messenger hain.',
    spiritualLesson: 'True freedom is internal - it comes from releasing attachments.'
  },
  6: {
    title: 'Path of Love & Service',
    lifeDirection: 'Your life is meant for nurturing and creating beauty. You are destined to heal through love and care.',
    dharmicPath: 'To develop unconditional love and create harmony. Your dharma is to be a healer of hearts.',
    karmicPurpose: 'Learning to receive as much as you give. Past life patterns of sacrifice or neglect of self.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 6 aata hai. Aap love aur service ke zariye apna purpose poora karenge.',
    spiritualLesson: 'You cannot pour from an empty cup - self-love enables greater service.'
  },
  7: {
    title: 'Path of Wisdom',
    lifeDirection: 'Your life is meant for spiritual seeking and sharing truth. You are destined to be a teacher of deep wisdom.',
    dharmicPath: 'To develop inner knowing and guide others on their spiritual journey. Your dharma is to seek and share truth.',
    karmicPurpose: 'Learning to balance solitude with connection. Past life patterns of isolation or spiritual bypassing.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 7 aata hai. Aap spiritual wisdom ke carrier hain.',
    spiritualLesson: 'Knowledge becomes wisdom only when lived and shared with compassion.'
  },
  8: {
    title: 'Path of Abundance',
    lifeDirection: 'Your life is meant for material and spiritual mastery. You are destined to achieve and help others prosper.',
    dharmicPath: 'To develop ethical power and use resources for collective good. Your dharma is to manifest abundance for all.',
    karmicPurpose: 'Learning to balance material and spiritual. Past life patterns of poverty consciousness or greed.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 8 aata hai. Aap karma aur abundance ke master hain.',
    spiritualLesson: 'True wealth is measured by what you give, not what you accumulate.'
  },
  9: {
    title: 'Path of Humanitarianism',
    lifeDirection: 'Your life is meant for universal service and completion. You are destined to work for humanity\'s evolution.',
    dharmicPath: 'To develop selfless love and complete karmic cycles. Your dharma is to be a light for the world.',
    karmicPurpose: 'Learning to let go and trust the divine plan. Past life patterns of attachment or martyrdom.',
    whyThisDefinesDestiny: 'Aapki poori date of birth ka total 9 aata hai. Aap humanitarian service ke liye paida hue hain.',
    spiritualLesson: 'In giving fully, you receive everything. In letting go, you gain all.'
  },
  11: {
    title: 'Path of Illumination',
    lifeDirection: 'Your life is meant to be a channel for higher wisdom. You are destined to inspire spiritual awakening.',
    dharmicPath: 'To develop psychic sensitivity and use it to guide others. Your dharma is to illuminate the path.',
    karmicPurpose: 'Learning to ground spiritual insights in practical reality. Master Number carries intensified karma.',
    whyThisDefinesDestiny: 'Aapka Bhagyank 11 Master Number hai. Aap spiritual leader banne ke liye chosen hain.',
    spiritualLesson: 'You are a bridge between heaven and earth - stand firmly in both worlds.'
  },
  22: {
    title: 'Path of Master Building',
    lifeDirection: 'Your life is meant to manifest great works that serve humanity. You are destined to build something lasting.',
    dharmicPath: 'To develop practical spirituality and create structures that elevate consciousness. Your dharma is to build bridges.',
    karmicPurpose: 'Learning to trust your grand vision while taking practical steps. Master Number intensifies responsibility.',
    whyThisDefinesDestiny: 'Aapka Bhagyank 22 Master Builder Number hai. Aap bade works ke liye designated hain.',
    spiritualLesson: 'Great works require great patience. Build with love and the structure will endure.'
  },
  33: {
    title: 'Path of Master Teaching',
    lifeDirection: 'Your life is meant to embody divine love and healing. You are destined to teach through presence and compassion.',
    dharmicPath: 'To develop Christ/Buddha consciousness and heal through unconditional love. Your dharma is cosmic healing.',
    karmicPurpose: 'Learning to maintain boundaries while remaining open. Master Number carries the weight of many souls.',
    whyThisDefinesDestiny: 'Aapka Bhagyank 33 hai - rarest Master Number. Aap cosmic healer hain.',
    spiritualLesson: 'Your love is medicine for the world. Take care of yourself to keep giving.'
  }
};

// Vedic Remedies generator
function generateRemedies(mulank: number, bhagyank: number): VedicRemedies {
  const directions: Record<number, string> = {
    1: 'East (Poorv) - Face the rising sun for energy',
    2: 'North-West (Vayavya) - Moon energy direction',
    3: 'North-East (Ishaan) - Jupiter\'s sacred direction',
    4: 'South-West (Nairitya) - Grounding direction',
    5: 'North (Uttar) - Mercury\'s direction for communication',
    6: 'South-East (Agneya) - Venus energy for love',
    7: 'South-West (Nairitya) - Spiritual retreat direction',
    8: 'West (Paschim) - Saturn\'s direction for discipline',
    9: 'South (Dakshin) - Mars energy for action',
    11: 'North-East (Ishaan) - Highest spiritual direction',
    22: 'All Cardinal directions equally',
    33: 'Center - You radiate in all directions'
  };

  const mantras: Record<number, string> = {
    1: 'Om Suryaya Namaha - I honor the sun within me',
    2: 'Om Chandraya Namaha - I embrace my emotional wisdom',
    3: 'Om Gurave Namaha - I expand with joy and wisdom',
    4: 'Om Shanaye Namaha - I build with patience and love',
    5: 'Om Budhaya Namaha - I communicate with clarity',
    6: 'Om Shukraya Namaha - I attract love and beauty',
    7: 'Om Ketave Namaha - I seek truth within silence',
    8: 'Om Shanaye Namaha - I master karma with wisdom',
    9: 'Om Mangalaya Namaha - I serve with courage',
    11: 'Om Namah Shivaya - I am pure consciousness',
    22: 'Om Brahma Namaha - I create with divine will',
    33: 'Om Mani Padme Hum - Compassion flows through me'
  };

  const colors: Record<number, string[]> = {
    1: ['Gold', 'Orange', 'Yellow'],
    2: ['White', 'Silver', 'Light Green'],
    3: ['Yellow', 'Purple', 'Violet'],
    4: ['Blue', 'Grey', 'Khaki'],
    5: ['Green', 'Turquoise', 'Light Blue'],
    6: ['Pink', 'Light Blue', 'White'],
    7: ['White', 'Light Yellow', 'Light Green'],
    8: ['Black', 'Dark Blue', 'Purple'],
    9: ['Red', 'Pink', 'Coral'],
    11: ['White', 'Violet', 'Silver'],
    22: ['All Earth tones', 'Gold', 'Royal Blue'],
    33: ['Rose', 'White', 'Gold']
  };

  const chakras: Record<number, { weak: string; tip: string }> = {
    1: { weak: 'Solar Plexus', tip: 'Practice breath of fire and wear yellow to strengthen personal power.' },
    2: { weak: 'Sacral', tip: 'Practice hip-opening poses and connect with water elements.' },
    3: { weak: 'Throat', tip: 'Practice singing, chanting, and speaking your truth.' },
    4: { weak: 'Root', tip: 'Practice grounding exercises and spend time in nature.' },
    5: { weak: 'Throat & Heart', tip: 'Balance communication with emotional awareness.' },
    6: { weak: 'Heart', tip: 'Practice loving-kindness meditation and self-compassion.' },
    7: { weak: 'Third Eye', tip: 'Practice meditation and trust your intuition more.' },
    8: { weak: 'Root & Solar Plexus', tip: 'Ground your power in ethical action.' },
    9: { weak: 'Crown', tip: 'Connect with higher purpose through service.' },
    11: { weak: 'Third Eye & Crown', tip: 'Balance intuition with practical grounding.' },
    22: { weak: 'All chakras need integration', tip: 'Practice full chakra balancing meditation.' },
    33: { weak: 'Heart (overactive)', tip: 'Learn to receive love as much as you give.' }
  };

  const stones: Record<number, string[]> = {
    1: ['Ruby', 'Garnet', 'Sunstone'],
    2: ['Pearl', 'Moonstone', 'Selenite'],
    3: ['Yellow Sapphire', 'Citrine', 'Amethyst'],
    4: ['Hessonite', 'Blue Sapphire', 'Smoky Quartz'],
    5: ['Emerald', 'Peridot', 'Green Tourmaline'],
    6: ['Diamond', 'White Sapphire', 'Rose Quartz'],
    7: ['Cat\'s Eye', 'Amethyst', 'Clear Quartz'],
    8: ['Blue Sapphire', 'Amethyst', 'Black Tourmaline'],
    9: ['Red Coral', 'Carnelian', 'Red Jasper'],
    11: ['Labradorite', 'Moonstone', 'Clear Quartz'],
    22: ['Master crystals - Clear Quartz', 'Moldavite'],
    33: ['Rose Quartz', 'Rhodonite', 'Kunzite']
  };

  const grah: Record<number, { energy: string; balancing: string }> = {
    1: { energy: 'Surya (Sun) - Strong ego and leadership drive', balancing: 'Practice humility and serve others to balance solar energy.' },
    2: { energy: 'Chandra (Moon) - Emotional sensitivity and intuition', balancing: 'Wear white on Mondays. Practice emotional boundaries.' },
    3: { energy: 'Guru (Jupiter) - Expansion and wisdom seeking', balancing: 'Teach what you learn. Wear yellow on Thursdays.' },
    4: { energy: 'Rahu - Shadow energy requiring grounding', balancing: 'Maintain routine. Avoid addictive behaviors. Ground daily.' },
    5: { energy: 'Budh (Mercury) - Quick mind and communication', balancing: 'Practice stillness. Wear green on Wednesdays.' },
    6: { energy: 'Shukra (Venus) - Love and beauty attraction', balancing: 'Practice receiving. Wear white/pink on Fridays.' },
    7: { energy: 'Ketu - Spiritual seeking and detachment', balancing: 'Stay connected to physical world. Ground spiritual insights.' },
    8: { energy: 'Shani (Saturn) - Karma and discipline', balancing: 'Honor commitments. Serve the elderly on Saturdays.' },
    9: { energy: 'Mangal (Mars) - Action and courage', balancing: 'Channel energy constructively. Practice non-violence.' },
    11: { energy: 'Double Chandra - Intensified intuition', balancing: 'Ground intuitive hits through journaling and action.' },
    22: { energy: 'Master Shani energy - Great responsibility', balancing: 'Take breaks. Trust the process. Delegate wisely.' },
    33: { energy: 'Universal healing energy', balancing: 'Rest deeply. Set loving boundaries. Receive more.' }
  };

  const m = mulank > 9 ? (mulank === 11 ? 11 : mulank === 22 ? 22 : 33) : mulank;
  const b = bhagyank > 9 ? (bhagyank === 11 ? 11 : bhagyank === 22 ? 22 : 33) : bhagyank;

  return {
    luckyDirection: directions[m] || directions[1],
    personalMantra: mantras[m] || mantras[1],
    suggestedColors: colors[m] || colors[1],
    weakChakra: chakras[m]?.weak || 'Solar Plexus',
    chakraBalancingTip: chakras[m]?.tip || 'Practice daily meditation.',
    suggestedStones: stones[m] || stones[1],
    grahEnergy: grah[m]?.energy || 'Universal energy',
    grahBalancing: grah[m]?.balancing || 'Practice balance in all things.',
    dosAndDonts: {
      dos: [
        `Wear ${colors[m]?.[0] || 'your lucky color'} regularly`,
        `Face ${directions[m]?.split(' ')[0] || 'East'} while working`,
        `Chant "${mantras[m]?.split(' - ')[0] || 'Om'}" daily`,
        'Practice gratitude every morning',
        'Connect with nature weekly'
      ],
      donts: [
        'Avoid making major decisions on unfavorable days',
        'Don\'t ignore your intuition',
        'Avoid toxic relationships',
        'Don\'t overwork without rest',
        'Avoid negative self-talk'
      ]
    },
    manifestationChecklist: [
      'Write your intentions during favorable moon phases',
      'Visualize goals during morning meditation',
      'Use affirmations aligned with your numbers',
      'Take inspired action daily',
      'Release attachment to outcomes',
      'Trust divine timing'
    ]
  };
}

// Chakra alignment calculator
function calculateChakraAlignment(mulank: number, bhagyank: number): ChakraAlignment {
  const baseScore = 60;
  const m = mulank > 9 ? 9 : mulank;
  const b = bhagyank > 9 ? 9 : bhagyank;
  
  // Each number influences chakras differently
  const chakraInfluence: Record<number, { strong: string[]; weak: string[] }> = {
    1: { strong: ['solarPlexus', 'crown'], weak: ['heart'] },
    2: { strong: ['sacral', 'heart'], weak: ['solarPlexus'] },
    3: { strong: ['throat', 'sacral'], weak: ['root'] },
    4: { strong: ['root'], weak: ['crown', 'thirdEye'] },
    5: { strong: ['throat'], weak: ['root'] },
    6: { strong: ['heart'], weak: ['solarPlexus'] },
    7: { strong: ['thirdEye', 'crown'], weak: ['root', 'sacral'] },
    8: { strong: ['root', 'solarPlexus'], weak: ['heart'] },
    9: { strong: ['crown', 'heart'], weak: ['sacral'] }
  };

  const influence = chakraInfluence[m] || chakraInfluence[1];
  
  let root = baseScore + (influence.strong.includes('root') ? 25 : 0) - (influence.weak.includes('root') ? 15 : 0);
  let sacral = baseScore + (influence.strong.includes('sacral') ? 25 : 0) - (influence.weak.includes('sacral') ? 15 : 0);
  let solarPlexus = baseScore + (influence.strong.includes('solarPlexus') ? 25 : 0) - (influence.weak.includes('solarPlexus') ? 15 : 0);
  let heart = baseScore + (influence.strong.includes('heart') ? 25 : 0) - (influence.weak.includes('heart') ? 15 : 0);
  let throat = baseScore + (influence.strong.includes('throat') ? 25 : 0) - (influence.weak.includes('throat') ? 15 : 0);
  let thirdEye = baseScore + (influence.strong.includes('thirdEye') ? 25 : 0) - (influence.weak.includes('thirdEye') ? 15 : 0);
  let crown = baseScore + (influence.strong.includes('crown') ? 25 : 0) - (influence.weak.includes('crown') ? 15 : 0);

  // Add some variation
  root = Math.min(100, Math.max(30, root + (b % 10)));
  sacral = Math.min(100, Math.max(30, sacral + ((b * 2) % 15)));
  solarPlexus = Math.min(100, Math.max(30, solarPlexus + ((b * 3) % 12)));
  heart = Math.min(100, Math.max(30, heart + ((m + b) % 10)));
  throat = Math.min(100, Math.max(30, throat + ((m * 2) % 15)));
  thirdEye = Math.min(100, Math.max(30, thirdEye + (m % 12)));
  crown = Math.min(100, Math.max(30, crown + ((m + b) % 8)));

  const overallBalance = Math.round((root + sacral + solarPlexus + heart + throat + thirdEye + crown) / 7);

  return { root, sacral, solarPlexus, heart, throat, thirdEye, crown, overallBalance };
}

// Generate predictions
function generatePredictions(mulank: number, bhagyank: number, personalYear: number): Predictions {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const monthThemes = [
    'New Beginnings', 'Partnership Focus', 'Creative Expression', 'Building Foundation',
    'Change & Freedom', 'Love & Responsibility', 'Inner Reflection', 'Material Focus',
    'Completion & Release', 'Fresh Start', 'Intuitive Growth', 'Spiritual Completion'
  ];

  const next12Months: MonthPrediction[] = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const monthNum = ((personalYear + i) % 9) + 1;
    const score = 50 + (Math.sin((i + mulank) * 0.5) * 30) + (bhagyank % 10);
    
    let action: 'pause' | 'build' | 'breakthrough';
    if (monthNum === 7 || monthNum === 4) action = 'pause';
    else if (monthNum === 1 || monthNum === 5 || monthNum === 9) action = 'breakthrough';
    else action = 'build';

    next12Months.push({
      month: new Date(currentYear, currentMonth + i, 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
      theme: monthThemes[monthIndex],
      risk: generateRisk(monthNum),
      opportunity: generateOpportunity(monthNum),
      timing: generateTiming(monthNum),
      score: Math.round(Math.min(100, Math.max(30, score))),
      action
    });
  }

  const next10Years: YearPrediction[] = [];
  const turningPointYears: number[] = [];
  
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const yearNum = ((personalYear + i) % 9) + 1;
    const isTurningPoint = yearNum === 1 || yearNum === 9 || i === 4 || i === 7;
    
    if (isTurningPoint) turningPointYears.push(year);

    let action: 'pause' | 'build' | 'breakthrough';
    if (yearNum === 7 || yearNum === 4) action = 'pause';
    else if (yearNum === 1 || yearNum === 9) action = 'breakthrough';
    else action = 'build';

    const score = 50 + (Math.cos(i * 0.5) * 25) + (mulank * 2) + (bhagyank % 5);

    next10Years.push({
      year,
      theme: getYearTheme(yearNum),
      growth: getYearGrowth(yearNum),
      challenges: getYearChallenges(yearNum),
      isTurningPoint,
      action,
      score: Math.round(Math.min(100, Math.max(40, score)))
    });
  }

  const pyMod = personalYear % 9;
  let currentPhase: 'pause' | 'build' | 'breakthrough';
  if (pyMod === 4 || pyMod === 7) currentPhase = 'pause';
  else if (pyMod === 1 || pyMod === 9 || pyMod === 0) currentPhase = 'breakthrough';
  else currentPhase = 'build';

  return { next12Months, next10Years, turningPointYears, currentPhase };
}

function generateRisk(monthNum: number): string {
  const risks = [
    'Overconfidence may lead to hasty decisions',
    'Emotional sensitivity could cause misunderstandings',
    'Scattered energy may reduce productivity',
    'Rigidity might block new opportunities',
    'Restlessness could lead to impulsive changes',
    'Over-giving may deplete your energy',
    'Isolation could disconnect you from support',
    'Financial focus might overshadow relationships',
    'Idealism may lead to disappointment'
  ];
  return risks[(monthNum - 1) % 9];
}

function generateOpportunity(monthNum: number): string {
  const opportunities = [
    'New ventures and leadership roles favor you',
    'Partnerships and collaborations bring success',
    'Creative projects gain recognition',
    'Solid foundations can be established',
    'Travel and networking open new doors',
    'Love and family matters flourish',
    'Spiritual insights lead to breakthroughs',
    'Financial and career gains are possible',
    'Completing old projects brings rewards'
  ];
  return opportunities[(monthNum - 1) % 9];
}

function generateTiming(monthNum: number): string {
  const timings = [
    'Best for initiating projects - first half of month',
    'Optimal for partnerships - mid-month',
    'Creative peak - throughout month',
    'Foundation work - steady progress all month',
    'Changes favored - second half',
    'Family matters - first and last week',
    'Inner work - full month focus',
    'Business moves - mid to late month',
    'Completions - end of month'
  ];
  return timings[(monthNum - 1) % 9];
}

function getYearTheme(yearNum: number): string {
  const themes = [
    'Year of New Beginnings - Fresh starts and leadership',
    'Year of Partnership - Relationships and cooperation',
    'Year of Expression - Creativity and communication',
    'Year of Foundation - Building and hard work',
    'Year of Change - Freedom and adventure',
    'Year of Responsibility - Love and family',
    'Year of Introspection - Wisdom and spirituality',
    'Year of Achievement - Power and manifestation',
    'Year of Completion - Endings and humanitarian service'
  ];
  return themes[(yearNum - 1) % 9];
}

function getYearGrowth(yearNum: number): string {
  const growth = [
    'Developing independence and self-confidence',
    'Growing through relationships and patience',
    'Expanding creative abilities and joy',
    'Building practical skills and discipline',
    'Embracing change and adaptability',
    'Deepening love and responsibility',
    'Advancing spiritual understanding',
    'Mastering material and power dynamics',
    'Evolving through service and release'
  ];
  return growth[(yearNum - 1) % 9];
}

function getYearChallenges(yearNum: number): string {
  const challenges = [
    'Balancing ego with humility',
    'Overcoming indecision and dependency',
    'Focusing scattered energy',
    'Avoiding rigidity and overwork',
    'Managing restlessness and commitment',
    'Setting healthy boundaries while caring',
    'Staying connected while seeking solitude',
    'Balancing material focus with heart',
    'Letting go of attachments and endings'
  ];
  return challenges[(yearNum - 1) % 9];
}

// Main function to calculate full Vedic profile
export function calculateVedicProfile(dateOfBirth: string, personalYear: number): VedicProfile {
  const mulank = calculateMulank(dateOfBirth);
  const bhagyank = calculateBhagyank(dateOfBirth);
  const harmony = calculateHarmony(mulank, bhagyank);
  
  const m = mulank > 9 && mulank !== 11 && mulank !== 22 && mulank !== 33 ? 9 : mulank;
  const b = bhagyank > 9 && bhagyank !== 11 && bhagyank !== 22 && bhagyank !== 33 ? 9 : bhagyank;

  const parts = dateOfBirth.split('/');
  const day = parts.length === 3 ? parseInt(parts[0], 10) : 1;

  const profileForDay = dateProfiles.find((p: any) => p.birth_date === day);

  const baseMulankMeaning = mulankMeanings[m] || mulankMeanings[1];
  const mulankMeaning = {
    ...baseMulankMeaning,
    strengths: [...baseMulankMeaning.strengths],
    weaknesses: [...baseMulankMeaning.weaknesses],
  };

  const baseRemedies = generateRemedies(mulank, bhagyank);
  const remedies = {
    ...baseRemedies,
    dosAndDonts: {
      dos: [...baseRemedies.dosAndDonts.dos],
      donts: [...baseRemedies.dosAndDonts.donts],
    },
  };

  if (profileForDay) {
    // Append date name to title
    mulankMeaning.title = `${mulankMeaning.title} (${profileForDay.date_name})`;
    
    // Prepend core vibe to naturalBehavior
    mulankMeaning.naturalBehavior = `${profileForDay.core_vibe} ${mulankMeaning.naturalBehavior}`;
    
    // Merge strengths and weaknesses (keeping unique elements)
    if (profileForDay.strengths && Array.isArray(profileForDay.strengths)) {
      mulankMeaning.strengths = Array.from(new Set([...profileForDay.strengths, ...mulankMeaning.strengths]));
    }
    if (profileForDay.challenges && Array.isArray(profileForDay.challenges)) {
      mulankMeaning.weaknesses = Array.from(new Set([...profileForDay.challenges, ...mulankMeaning.weaknesses]));
    }

    // Prepend remedy to remedies.dosAndDonts.dos
    if (profileForDay.remedy) {
      remedies.dosAndDonts.dos = [profileForDay.remedy, ...remedies.dosAndDonts.dos];
    }
  }

  let compoundNumberProfile;
  if (day > 9) {
    const cp = (compoundNumbers as any[]).find((c: any) => c.compound === day);
    if (cp) {
      compoundNumberProfile = {
        compound: cp.compound,
        tradName: cp.trad_name,
        nature: cp.nature,
        coreMeaning: cp.core_meaning,
        careerImpact: cp.career_impact,
        wealthImpact: cp.wealth_impact,
        relationshipImpact: cp.relationship_impact,
        businessImpact: cp.business_impact
      };
    }
  }

  return {
    mulank,
    bhagyank,
    harmonyScore: harmony.score,
    harmonyLevel: harmony.level,
    mulankMeaning,
    bhagyankMeaning: bhagyankMeanings[b] || bhagyankMeanings[1],
    remedies,
    chakraAlignment: calculateChakraAlignment(mulank, bhagyank),
    predictions: generatePredictions(mulank, bhagyank, personalYear),
    compoundNumberProfile
  };
}

// Generate life cycle data for charts
export function generateLifeCycleData(lifePath: number): LifeCycleData[] {
  const baseEnergy = 50 + (lifePath * 5);
  
  return [
    { age: '0-7', theme: 'Foundation', energy: Math.min(100, baseEnergy - 20), opportunities: 40, challenges: 30 },
    { age: '8-14', theme: 'Learning', energy: Math.min(100, baseEnergy - 10), opportunities: 50, challenges: 40 },
    { age: '15-21', theme: 'Identity', energy: Math.min(100, baseEnergy), opportunities: 60, challenges: 55 },
    { age: '22-28', theme: 'First Saturn Return', energy: Math.min(100, baseEnergy + 10), opportunities: 70, challenges: 65 },
    { age: '29-35', theme: 'Establishment', energy: Math.min(100, baseEnergy + 15), opportunities: 75, challenges: 50 },
    { age: '36-42', theme: 'Midlife Shift', energy: Math.min(100, baseEnergy + 5), opportunities: 80, challenges: 60 },
    { age: '43-49', theme: 'Mastery', energy: Math.min(100, baseEnergy + 20), opportunities: 85, challenges: 45 },
    { age: '50-56', theme: 'Second Saturn Return', energy: Math.min(100, baseEnergy + 10), opportunities: 80, challenges: 55 },
    { age: '57-63', theme: 'Wisdom', energy: Math.min(100, baseEnergy + 15), opportunities: 75, challenges: 40 },
    { age: '64-70', theme: 'Legacy', energy: Math.min(100, baseEnergy + 5), opportunities: 70, challenges: 35 },
    { age: '71+', theme: 'Transcendence', energy: Math.min(100, baseEnergy), opportunities: 65, challenges: 30 },
  ];
}