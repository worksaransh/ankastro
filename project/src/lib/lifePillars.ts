// 5-Pillar Life Guidance System
// Career, Love, Money, Health, and Personal Growth Analysis

import type { VedicProfile, ChakraAlignment } from './vedicNumerology';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface CareerGuidance {
  workStyle: {
    primary: string;
    description: string;
    score: { solo: number; team: number; leadership: number; creative: number; consultant: number };
  };
  suitableIndustries: string[];
  jobVsBusinessScore: { job: number; business: number; verdict: 'Job Preferred' | 'Business Preferred' | 'Both Viable' };
  workplaceStrengths: string[];
  hiddenBlocks: string[];
  biggestChallenge: { challenge: string; mindsetCorrection: string };
  growthDirections: string[];
  monthlyCareerEnergy: Array<{ month: string; score: number; theme: string; action: string }>;
  yearlyCareerTimeline: Array<{ year: number; theme: string; score: number; action: string }>;
  decisionTriggers: string[];
}

export interface PartnerCompatibility {
  partnerName: string;
  partnerMulank: number;
  partnerBhagyank: number;
  compatibilityScore: number;
  compatibilityLevel: 'Excellent' | 'Good' | 'Moderate' | 'Challenging';
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
  communicationStyle: string;
  conflictResolutionTip: string;
  bestDatesForImportantEvents: string[];
  relationshipDynamics: {
    leadership: string;
    emotionalFlow: string;
    financialHarmony: string;
    intimacyMatch: string;
  };
  soulContractInsight: string;
  karmicLessonTogether: string;
}

export interface LoveGuidance {
  loveVibration: { type: string; description: string };
  relationshipStyle: { attachment: string; security: string; emotionalLanguage: string };
  attractionPatterns: { attracts: string[]; fears: string[] };
  relationshipPatterns: string[];
  soulLesson: string;
  healingStatements: string[];
  flags: { green: string[]; red: string[]; yellow: string[] };
  timingInsights: { marriageTiming: string; emotionalMaturityAge: number };
  communicationScripts: Array<{ situation: string; script: string }>;
  polarityScore: { giving: number; receiving: number; independence: number; intimacy: number };
  partnerCompatibility?: PartnerCompatibility;
}

export interface MoneyGuidance {
  moneyVibration: { type: string; description: string };
  earningPath: { primary: string; strengths: string[] };
  financialPatterns: { saving: string; spending: string; guilt: string };
  prosperityBlock: { type: string; description: string; healing: string };
  warningSign: string[];
  magnetHabits: string[];
  investmentStyle: string;
  careerMoneyLink: string;
  monthlyIncomeWindow: Array<{ month: string; score: number; type: 'peak' | 'stable' | 'slow' }>;
  wealthArc: Array<{ year: number; theme: string; score: number }>;
  abundanceScore: number;
  riskTolerance: number;
}

export interface HealthGuidance {
  stressPattern: string;
  exhaustionMarkers: string[];
  nervousSystemTendency: string;
  chakraImbalances: Array<{ chakra: string; status: 'balanced' | 'underactive' | 'overactive'; guidance: string }>;
  bodySensitivity: string;
  sleepBurnoutCycle: string;
  groundingPractices: string[];
  affirmations: string[];
  emotionalOverloadScore: number;
  balanceScore: number;
}

export interface GrowthGuidance {
  identityPurposeAlignment: { percentage: number; description: string };
  karmicLesson: string;
  lifeTheme: string;
  repeatingLoops: Array<{ pattern: string; why: string; exit: string }>;
  soulAgeTraits: string[];
  turningPointYears: number[];
  actionPlan30Day: string[];
  actionPlan60Day: string[];
  actionPlan90Day: string[];
  rebirthWindow: { period: string; description: string };
  archetype: 'Healer' | 'Warrior' | 'Teacher' | 'Mystic' | 'Visionary';
  archetypeDescription: string;
}

export interface CrossAnalysis {
  careerLoveConflict?: { exists: boolean; guidance: string };
  moneyGrowthSynergy?: { exists: boolean; opportunity: string };
  healthSuccessBalance?: { exists: boolean; advice: string };
  loveAbundanceBlock?: { exists: boolean; logic: string };
  destinyMulankMisalignment?: { exists: boolean; correction: string };
}

export interface ConflictResolver {
  style: string;
  description: string;
  improvement: string;
}

export interface DecisionEngine {
  yesScore: number;
  noScore: number;
  waitScore: number;
  recommendation: string;
}

export interface LifePillars {
  career: CareerGuidance;
  love: LoveGuidance;
  money: MoneyGuidance;
  health: HealthGuidance;
  growth: GrowthGuidance;
  crossAnalysis: CrossAnalysis;
  conflictResolver: ConflictResolver;
  decisionEngine: DecisionEngine;
  lifeBlueprintSummary: LifeBlueprintSummary;
}

export interface LifeBlueprintSummary {
  careerTagline: string;
  loveTagline: string;
  moneyTagline: string;
  healthTagline: string;
  growthTagline: string;
}

// =====================================================
// CALCULATION FUNCTIONS
// =====================================================

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getArchetype(lifePath: number, destiny: number): { type: 'Healer' | 'Warrior' | 'Teacher' | 'Mystic' | 'Visionary'; description: string } {
  const sum = (lifePath + destiny) % 5;
  const archetypes = {
    0: { type: 'Healer' as const, description: 'You naturally sense and heal emotional and energetic wounds in others. Your presence alone is medicine.' },
    1: { type: 'Warrior' as const, description: 'You face challenges head-on and inspire others through your courage. Battles are won through your determination.' },
    2: { type: 'Teacher' as const, description: 'You absorb wisdom and share it in ways others can understand. Knowledge flows through you to uplift humanity.' },
    3: { type: 'Mystic' as const, description: 'You perceive beyond the veil and understand cosmic truths. The unseen world speaks to you clearly.' },
    4: { type: 'Visionary' as const, description: 'You see futures others cannot imagine. Your dreams shape reality and inspire innovation.' }
  };
  return archetypes[sum as keyof typeof archetypes];
}

function calculateCareerGuidance(mulank: number, bhagyank: number, lifePath: number, personalYear: number): CareerGuidance {
  // Work Style calculation based on numbers
  const workStyles = {
    solo: Math.min(100, 30 + (mulank === 1 || mulank === 7 ? 40 : 0) + (lifePath % 3) * 10),
    team: Math.min(100, 30 + (mulank === 2 || mulank === 6 ? 40 : 0) + (bhagyank % 4) * 10),
    leadership: Math.min(100, 30 + (mulank === 1 || mulank === 8 ? 45 : 0) + (lifePath % 2) * 15),
    creative: Math.min(100, 30 + (mulank === 3 || mulank === 5 ? 45 : 0) + (bhagyank % 3) * 10),
    consultant: Math.min(100, 30 + (mulank === 7 || mulank === 9 ? 40 : 0) + (lifePath % 5) * 8)
  };
  
  const primaryStyle = Object.entries(workStyles).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
  const styleDescriptions: Record<string, string> = {
    solo: 'You thrive when given autonomy. Independent projects and self-directed work bring out your best.',
    team: 'Collaboration energizes you. You excel when working with others and building team synergy.',
    leadership: 'You naturally take charge. Managing people and directing vision is your calling.',
    creative: 'Innovation is your strength. Creative freedom and artistic expression fuel your career.',
    consultant: 'Your wisdom helps others. Advisory roles and expertise-sharing are your path.'
  };

  // Industries based on numbers
  const industriesByNumber: Record<number, string[]> = {
    1: ['Technology', 'Entrepreneurship', 'Executive Leadership', 'Sports', 'Innovation'],
    2: ['Healthcare', 'Counseling', 'Hospitality', 'Art & Design', 'Diplomatic Services'],
    3: ['Entertainment', 'Media', 'Writing', 'Teaching', 'Public Relations'],
    4: ['Engineering', 'Architecture', 'Finance', 'Manufacturing', 'Real Estate'],
    5: ['Travel', 'Sales', 'Marketing', 'Technology', 'Adventure Sports'],
    6: ['Healthcare', 'Interior Design', 'Education', 'Food Industry', 'Beauty & Wellness'],
    7: ['Research', 'Spirituality', 'Technology', 'Academia', 'Psychology'],
    8: ['Banking', 'Corporate', 'Real Estate', 'Politics', 'Large-scale Business'],
    9: ['Non-profit', 'Teaching', 'Healing Arts', 'International Work', 'Social Justice'],
    11: ['Spiritual Teaching', 'Psychology', 'Coaching', 'Arts', 'Innovation'],
    22: ['Large Construction', 'Government', 'International Business', 'Infrastructure', 'Philanthropy'],
    33: ['Healing Arts', 'Spiritual Leadership', 'Education', 'Counseling', 'Community Service']
  };

  const m = mulank > 9 ? mulank : mulank;
  const industries = [...new Set([...industriesByNumber[m] || industriesByNumber[1], ...industriesByNumber[bhagyank] || []])].slice(0, 5);

  // Job vs Business
  const businessNumbers = [1, 3, 5, 8];
  const jobNumbers = [2, 4, 6, 7];
  const jobScore = jobNumbers.includes(mulank) ? 70 : 45 + (bhagyank % 3) * 10;
  const businessScore = businessNumbers.includes(mulank) ? 75 : 40 + (lifePath % 4) * 10;
  
  let verdict: 'Job Preferred' | 'Business Preferred' | 'Both Viable' = 'Both Viable';
  if (businessScore - jobScore > 15) verdict = 'Business Preferred';
  else if (jobScore - businessScore > 15) verdict = 'Job Preferred';

  // Strengths and blocks
  const strengthsByNumber: Record<number, string[]> = {
    1: ['Initiative', 'Decision-making', 'Vision-setting', 'Problem-solving'],
    2: ['Mediation', 'Attention to detail', 'Supportive presence', 'Patience'],
    3: ['Communication', 'Creativity', 'Networking', 'Motivation'],
    4: ['Organization', 'Reliability', 'System building', 'Persistence'],
    5: ['Adaptability', 'Sales ability', 'Quick learning', 'Versatility'],
    6: ['Team harmony', 'Service orientation', 'Aesthetic sense', 'Responsibility'],
    7: ['Analysis', 'Research', 'Strategic thinking', 'Depth'],
    8: ['Authority', 'Resource management', 'Negotiation', 'Scaling'],
    9: ['Vision', 'Inspiration', 'Global thinking', 'Completion']
  };

  const blocksByNumber: Record<number, string[]> = {
    1: ['Difficulty delegating', 'Ego clashes', 'Impatience with slow progress'],
    2: ['Indecision under pressure', 'Taking criticism personally', 'Over-accommodation'],
    3: ['Scattered focus', 'Unfinished projects', 'Superficial relationships'],
    4: ['Resistance to change', 'Overwork', 'Perfectionism paralysis'],
    5: ['Commitment issues', 'Boredom', 'Inconsistency'],
    6: ['Over-responsibility', 'Difficulty saying no', 'Neglecting self-growth'],
    7: ['Social withdrawal', 'Overthinking', 'Trust issues with colleagues'],
    8: ['Power struggles', 'Workaholic tendencies', 'Material obsession'],
    9: ['Idealistic expectations', 'Burnout from over-giving', 'Difficulty with details']
  };

  const challengesByNumber: Record<number, { challenge: string; mindsetCorrection: string }> = {
    1: { challenge: 'Learning to collaborate without losing identity', mindsetCorrection: 'See collaboration as expanding your power, not diminishing it.' },
    2: { challenge: 'Standing firm in your decisions', mindsetCorrection: 'Your sensitivity is strength. Trust your gut and communicate it clearly.' },
    3: { challenge: 'Following through on creative projects', mindsetCorrection: 'One completed project beats ten half-finished ideas. Focus on finishing.' },
    4: { challenge: 'Embracing innovation and change', mindsetCorrection: 'Stability comes from adaptability. Build systems that can evolve.' },
    5: { challenge: 'Building long-term career foundations', mindsetCorrection: 'Freedom comes from commitment. Pick one thing and master it deeply.' },
    6: { challenge: 'Pursuing personal ambitions alongside service', mindsetCorrection: 'Your growth serves everyone. Put your oxygen mask on first.' },
    7: { challenge: 'Translating insights into practical action', mindsetCorrection: 'Knowledge without action is just entertainment. Share and implement your wisdom.' },
    8: { challenge: 'Balancing ambition with ethics and relationships', mindsetCorrection: 'True power includes everyone. Success built on integrity lasts forever.' },
    9: { challenge: 'Focusing on practical progress vs big vision', mindsetCorrection: 'Change happens in small steps. Love the daily work that builds the dream.' }
  };

  // Monthly career energy
  const monthlyCareerEnergy = MONTHS.map((month, i) => {
    const monthNum = (personalYear + i + 1) % 9 || 9;
    const score = 40 + (monthNum * 5) + ((mulank + i) % 3) * 10;
    const actions = ['consolidate', 'network', 'launch', 'review', 'expand', 'learn', 'lead', 'rest', 'breakthrough'];
    return {
      month,
      score: Math.min(100, score),
      theme: getMonthlyTheme(monthNum),
      action: actions[monthNum - 1] || 'focus'
    };
  });

  // 10-year career timeline
  const currentYear = new Date().getFullYear();
  const yearlyTimeline = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    const yearNum = (lifePath + i + personalYear) % 9 || 9;
    const score = 45 + (yearNum * 4) + ((bhagyank + i) % 4) * 8;
    return {
      year,
      theme: getYearlyCareerTheme(yearNum),
      score: Math.min(100, score),
      action: yearNum >= 7 ? 'breakthrough' : yearNum >= 4 ? 'build' : 'consolidate'
    };
  });

  return {
    workStyle: {
      primary: primaryStyle.charAt(0).toUpperCase() + primaryStyle.slice(1),
      description: styleDescriptions[primaryStyle],
      score: workStyles
    },
    suitableIndustries: industries,
    jobVsBusinessScore: { job: Math.min(100, jobScore), business: Math.min(100, businessScore), verdict },
    workplaceStrengths: strengthsByNumber[mulank > 9 ? (mulank % 9 || 9) : mulank] || strengthsByNumber[1],
    hiddenBlocks: blocksByNumber[mulank > 9 ? (mulank % 9 || 9) : mulank] || blocksByNumber[1],
    biggestChallenge: challengesByNumber[mulank > 9 ? (mulank % 9 || 9) : mulank] || challengesByNumber[1],
    growthDirections: getGrowthDirections(mulank, bhagyank),
    monthlyCareerEnergy,
    yearlyCareerTimeline: yearlyTimeline,
    decisionTriggers: getDecisionTriggers(mulank, bhagyank)
  };
}

function getMonthlyTheme(num: number): string {
  const themes: Record<number, string> = {
    1: 'New Beginnings',
    2: 'Partnership Focus',
    3: 'Creative Expansion',
    4: 'Building Foundation',
    5: 'Change & Adaptation',
    6: 'Responsibility & Service',
    7: 'Reflection & Strategy',
    8: 'Power & Achievement',
    9: 'Completion & Preparation'
  };
  return themes[num] || 'Focus Period';
}

function getYearlyCareerTheme(num: number): string {
  const themes: Record<number, string> = {
    1: 'Career Launch',
    2: 'Relationship Building',
    3: 'Creative Peak',
    4: 'Solid Growth',
    5: 'Major Transition',
    6: 'Leadership Rise',
    7: 'Strategic Planning',
    8: 'Maximum Achievement',
    9: 'Legacy Building'
  };
  return themes[num] || 'Growth Period';
}

function getGrowthDirections(mulank: number, bhagyank: number): string[] {
  const directions: string[][] = [
    ['Leadership roles', 'Entrepreneurship', 'Executive coaching'],
    ['Collaborative projects', 'HR & People management', 'Mediation'],
    ['Creative industries', 'Public speaking', 'Content creation'],
    ['Technical expertise', 'Process optimization', 'Quality management'],
    ['Sales & Marketing', 'Travel industry', 'Innovation consulting'],
    ['Service leadership', 'Wellness industry', 'Educational administration'],
    ['Research & Development', 'Consulting', 'Spiritual guidance'],
    ['Financial management', 'Corporate leadership', 'Investment'],
    ['Non-profit leadership', 'Global organizations', 'Humanitarian work']
  ];
  const m = (mulank > 9 ? mulank % 9 : mulank) || 9;
  return directions[m - 1] || directions[0];
}

function getDecisionTriggers(mulank: number, bhagyank: number): string[] {
  return [
    'Move when your current role no longer challenges your growth',
    'Quit when values misalignment becomes consistent',
    'Restart when passion returns after rest period',
    'Scale when systems are stable and team is aligned',
    `Best months for major decisions: ${getDecisionMonths(mulank, bhagyank)}`
  ];
}

function getDecisionMonths(mulank: number, bhagyank: number): string {
  const favorableMonths = [(mulank % 12) + 1, (bhagyank % 12) + 1, ((mulank + bhagyank) % 12) + 1];
  return favorableMonths.map(m => MONTHS[m - 1]).join(', ');
}

function calculateLoveGuidance(mulank: number, bhagyank: number, lifePath: number): LoveGuidance {
  const vibrationTypes: Record<number, { type: string; description: string }> = {
    1: { type: 'Trust-Based', description: 'You love through respect and admiration. Trust is your love language.' },
    2: { type: 'Emotion-Based', description: 'Deep emotional connection is everything. You feel love intensely.' },
    3: { type: 'Expression-Based', description: 'Love through words, creativity, and shared joy. Communication is key.' },
    4: { type: 'Stability-Based', description: 'Security and commitment define your love. Actions speak louder than words.' },
    5: { type: 'Freedom-Based', description: 'Love with space. You need a partner who respects your independence.' },
    6: { type: 'Nurture-Based', description: 'Caring for others IS your love language. You love through service.' },
    7: { type: 'Soul-Based', description: 'Deep spiritual connection matters most. Surface love feels empty.' },
    8: { type: 'Power-Based', description: 'Mutual respect and shared goals drive your relationships.' },
    9: { type: 'Universal-Based', description: 'Expansive, inclusive love. You love humanity through your partner.' }
  };

  const m = mulank > 9 ? (mulank % 9 || 9) : mulank;
  
  const attachmentStyles: Record<number, string> = {
    1: 'Secure-Independent',
    2: 'Anxious-Preoccupied',
    3: 'Secure-Playful',
    4: 'Secure-Cautious',
    5: 'Avoidant-Independent',
    6: 'Anxious-Caregiving',
    7: 'Avoidant-Dismissive',
    8: 'Secure-Dominant',
    9: 'Secure-Compassionate'
  };

  const patterns: Record<number, string[]> = {
    1: ['Needing to be admired', 'Difficulty being vulnerable', 'Leading in relationships'],
    2: ['Over-accommodating', 'Fear of abandonment', 'Emotional over-giving'],
    3: ['Avoiding deep commitment through humor', 'Multiple interests', 'Fear of boring partner'],
    4: ['Slow to open up', 'Testing partner reliability', 'Practical over romantic'],
    5: ['Fear of being trapped', 'Keeping options open', 'Excitement-seeking'],
    6: ['Over-responsibility for partner', 'Sacrificing self', 'Perfectionism in love'],
    7: ['Emotional distance', 'Trust issues', 'Needing space'],
    8: ['Power dynamics', 'Control tendencies', 'Workaholism affecting love'],
    9: ['Idealistic expectations', 'Giving too much', 'Attracting those who need healing']
  };

  const healingStatements = [
    `I am worthy of love exactly as I am`,
    `I release past relationship patterns that no longer serve me`,
    `I attract love that matches my highest vibration`,
    `My heart is safe to open and receive`,
    `I choose partners who match my energy of growth`
  ];

  const communicationScripts = [
    { situation: 'When hurt', script: 'I felt [emotion] when [situation]. I need [specific need] from you.' },
    { situation: 'When confused', script: 'Help me understand your perspective. I want to see this through your eyes.' },
    { situation: 'When scared', script: 'I am feeling vulnerable right now. Can you reassure me that we are okay?' },
    { situation: 'When needing space', script: 'I need some time to process. This is not about you—I will return when I am ready.' }
  ];

  return {
    loveVibration: vibrationTypes[m] || vibrationTypes[1],
    relationshipStyle: {
      attachment: attachmentStyles[m] || 'Secure',
      security: m <= 4 ? 'High need for stability' : 'Moderate flexibility',
      emotionalLanguage: m % 2 === 0 ? 'Feelings-first' : 'Logic-balanced'
    },
    attractionPatterns: {
      attracts: getAttractionPatterns(m, 'attracts'),
      fears: getAttractionPatterns(m, 'fears')
    },
    relationshipPatterns: patterns[m] || patterns[1],
    soulLesson: getSoulLessonInLove(m, bhagyank),
    healingStatements,
    flags: {
      green: getRelationshipFlags(m, 'green'),
      red: getRelationshipFlags(m, 'red'),
      yellow: getRelationshipFlags(m, 'yellow')
    },
    timingInsights: {
      marriageTiming: getMarriageTiming(mulank, bhagyank),
      emotionalMaturityAge: 25 + (lifePath % 8)
    },
    communicationScripts,
    polarityScore: {
      giving: 40 + (m % 5) * 12,
      receiving: 30 + ((9 - m) % 5) * 14,
      independence: 35 + (m % 4) * 16,
      intimacy: 45 + ((m + bhagyank) % 6) * 9
    }
  };
}

function getAttractionPatterns(num: number, type: 'attracts' | 'fears'): string[] {
  if (type === 'attracts') {
    const patterns: Record<number, string[]> = {
      1: ['Confidence', 'Independence', 'Ambition'],
      2: ['Sensitivity', 'Nurturing nature', 'Emotional depth'],
      3: ['Humor', 'Creativity', 'Optimism'],
      4: ['Reliability', 'Stability', 'Practicality'],
      5: ['Adventure', 'Intelligence', 'Freedom'],
      6: ['Warmth', 'Family values', 'Beauty'],
      7: ['Depth', 'Mystery', 'Intelligence'],
      8: ['Power', 'Success', 'Authority'],
      9: ['Wisdom', 'Compassion', 'Vision']
    };
    return patterns[num] || patterns[1];
  } else {
    const fears: Record<number, string[]> = {
      1: ['Dependence', 'Weakness', 'Being controlled'],
      2: ['Abandonment', 'Conflict', 'Harsh criticism'],
      3: ['Boredom', 'Negativity', 'Restriction'],
      4: ['Chaos', 'Unpredictability', 'Betrayal'],
      5: ['Commitment', 'Routine', 'Possessiveness'],
      6: ['Imperfection', 'Rejection', 'Unbalanced love'],
      7: ['Superficiality', 'Invasion of privacy', 'Meaninglessness'],
      8: ['Powerlessness', 'Poverty', 'Disrespect'],
      9: ['Closed-mindedness', 'Selfishness', 'Small thinking']
    };
    return fears[num] || fears[1];
  }
}

function getSoulLessonInLove(mulank: number, bhagyank: number): string {
  const lessons: Record<number, string> = {
    1: 'Learning that vulnerability is not weakness—it is the doorway to true intimacy.',
    2: 'Understanding that your worth does not depend on how much you give to others.',
    3: 'Discovering that deep love requires showing your shadows, not just your light.',
    4: 'Realizing that love cannot be controlled, only trusted and nurtured.',
    5: 'Accepting that commitment does not end freedom—it creates sacred space.',
    6: 'Learning to receive love with the same grace you give it.',
    7: 'Understanding that opening your heart does not diminish your wisdom.',
    8: 'Balancing power with tenderness, achievement with presence.',
    9: 'Loving one person fully instead of humanity abstractly.'
  };
  return lessons[mulank > 9 ? (mulank % 9 || 9) : mulank] || lessons[1];
}

function getRelationshipFlags(num: number, type: 'green' | 'red' | 'yellow'): string[] {
  const flags: Record<string, Record<number, string[]>> = {
    green: {
      1: ['Respects your independence', 'Admires your ambitions', 'Matches your energy'],
      2: ['Emotionally available', 'Consistent communication', 'Patient and kind'],
      3: ['Laughs with you', 'Supports creativity', 'Positive and uplifting'],
      4: ['Reliable and punctual', 'Plans for future together', 'Follows through on promises'],
      5: ['Gives you space', 'Open to adventure', 'Non-possessive'],
      6: ['Values family', 'Shows care through actions', 'Creates harmony'],
      7: ['Respects your need for solitude', 'Intellectually stimulating', 'Spiritually curious'],
      8: ['Respects your goals', 'Equally ambitious', 'Financially responsible'],
      9: ['Big-hearted', 'Globally minded', 'Supportive of your causes']
    },
    red: {
      1: ['Controlling behavior', 'Undermines your confidence', 'Competes against you'],
      2: ['Emotionally unavailable', 'Dismissive of feelings', 'Hot and cold patterns'],
      3: ['Constant negativity', 'Kills your joy', 'Mocks your dreams'],
      4: ['Unreliable', 'Breaks promises', 'Chaotic lifestyle'],
      5: ['Possessive', 'Restricts freedom', 'Jealous without cause'],
      6: ['Takes without giving', 'Disrespects family', 'Creates drama'],
      7: ['Superficial', 'Invades privacy', 'Cannot hold depth'],
      8: ['Disrespectful of your work', 'Financially irresponsible', 'Power games'],
      9: ['Selfish', 'Narrow-minded', 'Cannot see bigger picture']
    },
    yellow: {
      1: ['Needs constant validation', 'Unsure of their path', 'Passive approach'],
      2: ['Overly independent', 'Difficulty expressing emotions', 'Avoidant when stressed'],
      3: ['Too serious', 'Pessimistic tendencies', 'Difficulty with fun'],
      4: ['Too spontaneous', 'Resistant to planning', 'Impulsive decisions'],
      5: ['Too attached too fast', 'Fear-based decisions', 'Routine-focused'],
      6: ['Perfectionist tendencies', 'Critical nature', 'Difficulty relaxing'],
      7: ['Overly social', 'Cannot sit in silence', 'Surface-level processing'],
      8: ['Underambitious', 'Fear of success', 'Victim mentality'],
      9: ['Detail-focused only', 'Cannot dream big', 'Skeptical of idealism']
    }
  };
  return flags[type][num] || flags[type][1];
}

function getMarriageTiming(mulank: number, bhagyank: number): string {
  const sum = mulank + bhagyank;
  if (sum <= 6) return 'Early-to-mid 20s may feel natural, but emotional maturity peaks late 20s';
  if (sum <= 12) return 'Late 20s to early 30s aligns best with your energy';
  return 'Take your time—33+ may be your peak relationship window';
}

function calculateMoneyGuidance(mulank: number, bhagyank: number, lifePath: number, personalYear: number): MoneyGuidance {
  const m = mulank > 9 ? (mulank % 9 || 9) : mulank;
  
  const vibrationTypes: Record<number, { type: string; description: string }> = {
    1: { type: 'Pioneer Wealth', description: 'Money comes through originality and leadership. You earn by being first.' },
    2: { type: 'Partnership Wealth', description: 'Money flows through collaboration. Joint ventures favor you.' },
    3: { type: 'Creative Wealth', description: 'Money comes through expression. Your ideas are your currency.' },
    4: { type: 'Builder Wealth', description: 'Money comes through patience. Slow, steady growth builds empires.' },
    5: { type: 'Adaptive Wealth', description: 'Money comes through change. Multiple streams serve you.' },
    6: { type: 'Service Wealth', description: 'Money comes through helping others. Value creates your income.' },
    7: { type: 'Wisdom Wealth', description: 'Money comes through expertise. Knowledge is your true asset.' },
    8: { type: 'Power Wealth', description: 'Money comes through scale. Think big, earn big.' },
    9: { type: 'Humanitarian Wealth', description: 'Money comes through service to many. Impact creates income.' }
  };

  const earningPaths: Record<number, { primary: string; strengths: string[] }> = {
    1: { primary: 'Leadership & Innovation', strengths: ['Pioneering new markets', 'Executive roles', 'Entrepreneurship'] },
    2: { primary: 'Support & Partnership', strengths: ['Client relationships', 'HR & people work', 'Collaborative projects'] },
    3: { primary: 'Creative & Communication', strengths: ['Content creation', 'Sales & marketing', 'Entertainment'] },
    4: { primary: 'Technical & Systems', strengths: ['Process optimization', 'Quality control', 'Steady employment'] },
    5: { primary: 'Sales & Versatility', strengths: ['Multiple income streams', 'Freelance work', 'Commission-based'] },
    6: { primary: 'Service & Care', strengths: ['Healthcare', 'Education', 'Hospitality'] },
    7: { primary: 'Research & Consulting', strengths: ['Specialized expertise', 'Intellectual property', 'Advisory roles'] },
    8: { primary: 'Management & Finance', strengths: ['Investment', 'Real estate', 'Corporate leadership'] },
    9: { primary: 'Teaching & Healing', strengths: ['Coaching', 'Non-profit', 'International work'] }
  };

  const prosperityBlocks: Record<number, { type: string; description: string; healing: string }> = {
    1: { type: 'Ego Block', description: 'Pride prevents asking for help or accepting opportunities', healing: 'Recognize that receiving is part of the abundance cycle' },
    2: { type: 'Worth Block', description: 'Undervaluing your contributions leads to undercharging', healing: 'Your sensitivity has immense value—price accordingly' },
    3: { type: 'Consistency Block', description: 'Scattered energy leads to incomplete money projects', healing: 'One completed offering beats ten unfinished ideas' },
    4: { type: 'Risk Block', description: 'Fear of change keeps you in low-growth situations', healing: 'Calculated risks build the foundation for greater stability' },
    5: { type: 'Commitment Block', description: 'Jumping between opportunities prevents compound growth', healing: 'Freedom comes from mastery—commit to build' },
    6: { type: 'Receiving Block', description: 'Over-giving depletes your resources', healing: 'You cannot pour from an empty cup—receive first' },
    7: { type: 'Visibility Block', description: 'Hiding your wisdom limits your earning potential', healing: 'Share your knowledge—the world needs your insights' },
    8: { type: 'Ethics Block', description: 'Power struggles or shortcuts undermine long-term wealth', healing: 'Ethical wealth multiplies—shortcuts collapse' },
    9: { type: 'Grounding Block', description: 'Too focused on giving away, not building reserves', healing: 'Your impact multiplies when you have resources' }
  };

  // Monthly income windows
  const monthlyIncome = MONTHS.map((month, i) => {
    const monthNum = (personalYear + i + 1) % 9 || 9;
    const score = 35 + (monthNum * 4) + ((mulank + i) % 4) * 12;
    let type: 'peak' | 'stable' | 'slow' = 'stable';
    if (score >= 70) type = 'peak';
    else if (score <= 45) type = 'slow';
    return { month, score: Math.min(100, score), type };
  });

  // 10-year wealth arc
  const currentYear = new Date().getFullYear();
  const wealthArc = Array.from({ length: 10 }, (_, i) => ({
    year: currentYear + i,
    theme: getWealthTheme((lifePath + i) % 9 || 9),
    score: Math.min(100, 40 + ((lifePath + bhagyank + i) % 7) * 9)
  }));

  const investmentStyles: Record<number, string> = {
    1: 'Aggressive growth—high risk, high reward suits your pioneering nature',
    2: 'Conservative balanced—steady growth with capital preservation',
    3: 'Creative ventures—invest in ideas and entertainment',
    4: 'Real estate & bonds—tangible, long-term assets',
    5: 'Diversified—multiple asset classes, stay flexible',
    6: 'Income-generating—dividend stocks, rental properties',
    7: 'Research-heavy—deep analysis before committing',
    8: 'Strategic large plays—concentrated positions in winners',
    9: 'Impact investing—returns plus social benefit'
  };

  return {
    moneyVibration: vibrationTypes[m] || vibrationTypes[1],
    earningPath: earningPaths[m] || earningPaths[1],
    financialPatterns: {
      saving: m <= 4 ? 'Natural saver—builds reserves steadily' : 'Variable—needs systems for consistent saving',
      spending: m % 2 === 0 ? 'Thoughtful spender—considers purchases carefully' : 'Impulsive tendencies—benefit from cooling-off periods',
      guilt: m === 6 || m === 9 ? 'Guilt around self-spending—feel better spending on others' : 'Minimal guilt—comfortable with personal purchases'
    },
    prosperityBlock: prosperityBlocks[m] || prosperityBlocks[1],
    warningSign: getMoneyWarnings(m),
    magnetHabits: getMoneyMagnetHabits(m),
    investmentStyle: investmentStyles[m] || investmentStyles[5],
    careerMoneyLink: getCareerMoneyLink(m, bhagyank),
    monthlyIncomeWindow: monthlyIncome,
    wealthArc,
    abundanceScore: Math.min(100, 45 + (mulank + bhagyank) * 3),
    riskTolerance: Math.min(100, 30 + (m * 7) + (bhagyank % 3) * 10)
  };
}

function getWealthTheme(num: number): string {
  const themes: Record<number, string> = {
    1: 'Investment Opportunity',
    2: 'Collaborative Gains',
    3: 'Creative Income',
    4: 'Steady Accumulation',
    5: 'Dynamic Changes',
    6: 'Service Returns',
    7: 'Strategic Growth',
    8: 'Peak Earnings',
    9: 'Abundance Overflow'
  };
  return themes[num] || 'Growth Period';
}

function getMoneyWarnings(num: number): string[] {
  const warnings: Record<number, string[]> = {
    1: ['Overconfidence in risky investments', 'Spending to impress', 'Ignoring advice'],
    2: ['Under-earning due to low confidence', 'Lending without boundaries', 'Joint account issues'],
    3: ['Impulsive purchases', 'Unfinished income projects', 'Lifestyle inflation'],
    4: ['Missing opportunities due to over-caution', 'Hoarding vs flowing', 'Underpaying self'],
    5: ['Scattered investments', 'Get-rich-quick schemes', 'Inconsistent income planning'],
    6: ['Over-giving financially', 'Family money drains', 'Guilt-based spending'],
    7: ['Analysis paralysis on investments', 'Missing practical money skills', 'Isolation from advisors'],
    8: ['Power plays with money', 'Over-leveraging', 'Work-life imbalance costs'],
    9: ['Giving away too much', 'Poor personal finance focus', 'Idealistic money views']
  };
  return warnings[num] || warnings[5];
}

function getMoneyMagnetHabits(num: number): string[] {
  return [
    'Track every rupee for 30 days—awareness creates abundance',
    'Express gratitude for money received daily',
    'Invest at least 10% before spending',
    'Review financial goals weekly',
    `Leverage your ${num <= 4 ? 'stability' : 'adaptability'} strength in money decisions`
  ];
}

function getCareerMoneyLink(mulank: number, bhagyank: number): string {
  if (mulank <= 3) return 'Your money flows fastest when you lead with creativity and initiative. Slow money = wrong role.';
  if (mulank <= 6) return 'Your money builds steadily through service and reliability. Fast money may not sustain.';
  return 'Your money comes through wisdom and expertise. Investment in knowledge pays the highest dividends.';
}

function calculateHealthGuidance(mulank: number, bhagyank: number, chakraAlignment: ChakraAlignment): HealthGuidance {
  const m = mulank > 9 ? (mulank % 9 || 9) : mulank;
  
  const stressPatterns: Record<number, string> = {
    1: 'Achievement stress—pressure from high self-expectations',
    2: 'Emotional stress—absorbing others emotions and energies',
    3: 'Expression stress—frustration when creativity is blocked',
    4: 'Control stress—anxiety when things feel chaotic',
    5: 'Freedom stress—panic when feeling restricted',
    6: 'Responsibility stress—burnout from over-caring',
    7: 'Overthinking stress—mental exhaustion from analysis',
    8: 'Power stress—pressure from work and achievements',
    9: 'Empathy stress—carrying the weight of world problems'
  };

  const nervousTendencies: Record<number, string> = {
    1: 'Adrenaline-dominant—prone to burnout cycles',
    2: 'Parasympathetic-leaning—sensitive nervous system',
    3: 'Fluctuating—energy highs and crashes',
    4: 'Steady but rigid—tension from holding too tight',
    5: 'Hyperactive—difficulty settling nervous energy',
    6: 'Caregiver fatigue—giving until depleted',
    7: 'Intellectual overload—mind exhausts body',
    8: 'High-pressure threshold—but eventual collapse',
    9: 'Emotionally permeable—absorbs environmental stress'
  };

  const bodySensitivities: Record<number, string> = {
    1: 'Head, heart, and circulatory system need attention',
    2: 'Digestive system and emotional eating patterns',
    3: 'Throat, respiratory, and nervous system sensitivity',
    4: 'Bones, joints, and structural body support',
    5: 'Nervous system, skin, and sensory organs',
    6: 'Heart, hormones, and immune balance',
    7: 'Brain, intuition organs, and sleep quality',
    8: 'Spine, circulation, and stress-related conditions',
    9: 'Blood, immune system, and energetic boundaries'
  };

  // Chakra analysis based on alignment scores
  const chakraList = [
    { name: 'Root', score: chakraAlignment.root },
    { name: 'Sacral', score: chakraAlignment.sacral },
    { name: 'Solar Plexus', score: chakraAlignment.solarPlexus },
    { name: 'Heart', score: chakraAlignment.heart },
    { name: 'Throat', score: chakraAlignment.throat },
    { name: 'Third Eye', score: chakraAlignment.thirdEye },
    { name: 'Crown', score: chakraAlignment.crown }
  ];

  const chakraImbalances = chakraList.map(c => ({
    chakra: c.name,
    status: (c.score >= 70 ? 'balanced' : c.score >= 40 ? 'underactive' : 'overactive') as 'balanced' | 'underactive' | 'overactive',
    guidance: getChakraGuidance(c.name, c.score)
  }));

  const groundingPractices = [
    'Morning barefoot walking on grass (5-10 minutes)',
    'Deep belly breathing—4 counts in, 7 hold, 8 out',
    'Cold water on wrists and neck when overwhelmed',
    'Nature immersion—trees reset your nervous system',
    'Evening digital detox—1 hour before sleep'
  ];

  const affirmations = [
    'My body is a sacred vessel—I honor it daily',
    'I release what is not mine to carry',
    'Energy flows to me and through me with ease',
    'I am grounded, centered, and at peace',
    'My health improves as I align with my purpose'
  ];

  return {
    stressPattern: stressPatterns[m] || stressPatterns[5],
    exhaustionMarkers: getExhaustionMarkers(m),
    nervousSystemTendency: nervousTendencies[m] || nervousTendencies[5],
    chakraImbalances,
    bodySensitivity: bodySensitivities[m] || bodySensitivities[5],
    sleepBurnoutCycle: getSleepBurnoutCycle(m),
    groundingPractices,
    affirmations,
    emotionalOverloadScore: Math.max(20, 100 - chakraAlignment.overallBalance),
    balanceScore: chakraAlignment.overallBalance
  };
}

function getChakraGuidance(chakra: string, score: number): string {
  if (score >= 70) return 'Well balanced. Maintain with regular practice.';
  if (score >= 40) {
    const guidance: Record<string, string> = {
      'Root': 'Ground more—walking, nature, stability practices',
      'Sacral': 'Creative expression and emotional flow work',
      'Solar Plexus': 'Build confidence through small wins',
      'Heart': 'Practice giving AND receiving love equally',
      'Throat': 'Speak your truth in safe spaces daily',
      'Third Eye': 'Trust intuition—act on your inner knowing',
      'Crown': 'Meditation and spiritual connection practices'
    };
    return guidance[chakra] || 'Focus on balancing this energy center';
  }
  return 'Needs attention—overactive energy causing imbalance. Practice calming and grounding.';
}

function getExhaustionMarkers(num: number): string[] {
  const markers: Record<number, string[]> = {
    1: ['Irritability spike', 'Isolation behavior', 'Perfectionism intensifies'],
    2: ['Emotional flooding', 'Boundary collapse', 'People-pleasing overdrive'],
    3: ['Creative block', 'Excessive talking', 'Mood swings'],
    4: ['Rigid thinking', 'Physical tension', 'Control obsession'],
    5: ['Scattered energy', 'Impulsive decisions', 'Restlessness'],
    6: ['Martyr complex', 'Physical symptoms', 'Worry spirals'],
    7: ['Complete withdrawal', 'Cynicism', 'Sleep disturbances'],
    8: ['Aggressive behavior', 'Workaholic mode', 'Health neglect'],
    9: ['Emotional overwhelm', 'Escapism', 'Boundary dissolution']
  };
  return markers[num] || markers[5];
}

function getSleepBurnoutCycle(num: number): string {
  if (num <= 3) return 'High energy depletes fast—need 7-8 hours consistently';
  if (num <= 6) return 'Moderate but steady—6-7 hours with quality matters most';
  return 'Deep rest essential—8+ hours and meditation-quality sleep';
}

function calculateGrowthGuidance(mulank: number, bhagyank: number, lifePath: number, personalYear: number): GrowthGuidance {
  const m = mulank > 9 ? (mulank % 9 || 9) : mulank;
  const archetype = getArchetype(lifePath, bhagyank);
  
  const alignmentPercentage = Math.min(100, 40 + ((mulank + bhagyank) % 5) * 12 + (lifePath % 4) * 8);
  
  const karmicLessons: Record<number, string> = {
    1: 'Learning to lead without ego—true power serves, not dominates',
    2: 'Learning self-worth independent of relationships and approval',
    3: 'Learning focus and depth—brilliance needs direction',
    4: 'Learning flexibility—the strongest structures can bend',
    5: 'Learning commitment—freedom found within dedication',
    6: 'Learning self-care—you cannot pour from empty vessels',
    7: 'Learning connection—wisdom grows through sharing',
    8: 'Learning ethical power—karma returns all we give',
    9: 'Learning boundaries—universal love includes self-love'
  };

  const lifeThemes: Record<number, string> = {
    1: 'The Hero Journey—rising through challenges to lead',
    2: 'The Relationship Mirror—growing through connection',
    3: 'The Creative Blossoming—expressing the soul through art',
    4: 'The Temple Building—creating lasting structures',
    5: 'The Adventure Quest—expanding through experience',
    6: 'The Heart Opening—loving and being loved fully',
    7: 'The Truth Seeking—discovering wisdom within',
    8: 'The Power Mastery—transforming karma to dharma',
    9: 'The World Service—healing through compassion'
  };

  const repeatingLoops = [
    { 
      pattern: 'Attracting similar relationship dynamics',
      why: 'Unhealed patterns seek resolution through repetition',
      exit: 'Conscious awareness + different response breaks the loop'
    },
    {
      pattern: 'Self-sabotage before success',
      why: 'Unconscious fear of visibility or responsibility',
      exit: 'Acknowledge fear, take action anyway, celebrate small wins'
    },
    {
      pattern: 'Burnout-recovery cycles',
      why: 'Ignoring body signals until forced to stop',
      exit: 'Preventive rest, boundaries, and sustainable pace'
    }
  ];

  const soulAgeTraits: Record<number, string[]> = {
    1: ['Pioneer spirit', 'Learning through action', 'Building ego strength'],
    2: ['Relationship learning', 'Emotional development', 'Finding balance'],
    3: ['Creative exploration', 'Joy discovery', 'Expression mastery'],
    4: ['Foundation building', 'Practical wisdom', 'Earth mastery'],
    5: ['Experience gathering', 'Freedom understanding', 'Change integration'],
    6: ['Love deepening', 'Service learning', 'Harmony creating'],
    7: ['Wisdom accumulating', 'Inner truth finding', 'Spiritual growth'],
    8: ['Power learning', 'Karma balancing', 'Manifestation mastery'],
    9: ['Completion approaching', 'Universal understanding', 'Legacy leaving']
  };

  // Calculate turning point years
  const currentYear = new Date().getFullYear();
  const turningPoints = [
    currentYear + (9 - (personalYear % 9)),
    currentYear + (9 - (personalYear % 9)) + 9,
    currentYear + (9 - (personalYear % 9)) + 18
  ].filter(y => y > currentYear && y < currentYear + 20);

  // Action plans
  const actionPlan30Day = [
    'Set one clear intention aligned with your life theme',
    'Identify and release one limiting belief',
    'Establish daily alignment practice (meditation/journaling)',
    'Connect with one person who supports your growth',
    'Complete one unfinished project from the past'
  ];

  const actionPlan60Day = [
    'Implement new habit that supports your archetype',
    'Address one major relationship pattern',
    'Create or update your life vision document',
    'Take one calculated risk toward your purpose',
    'Develop mastery in one skill aligned with destiny'
  ];

  const actionPlan90Day = [
    'Complete a major life chapter or project',
    'Establish sustainable success routines',
    'Create accountability for continued growth',
    'Plan next phase of destiny alignment',
    'Celebrate progress and recalibrate vision'
  ];

  // Rebirth window calculation
  const rebirthWindow = {
    period: `${MONTHS[(personalYear + 2) % 12]} to ${MONTHS[(personalYear + 4) % 12]} ${currentYear + 1}`,
    description: 'This window offers peak energy for major life changes, new beginnings, and identity transformation.'
  };

  return {
    identityPurposeAlignment: {
      percentage: alignmentPercentage,
      description: alignmentPercentage >= 75 
        ? 'Strong alignment—you are living close to your purpose'
        : alignmentPercentage >= 50 
          ? 'Moderate alignment—some areas need attention'
          : 'Growth opportunity—significant alignment work will transform your life'
    },
    karmicLesson: karmicLessons[m] || karmicLessons[5],
    lifeTheme: lifeThemes[m] || lifeThemes[5],
    repeatingLoops,
    soulAgeTraits: soulAgeTraits[m] || soulAgeTraits[5],
    turningPointYears: turningPoints,
    actionPlan30Day,
    actionPlan60Day,
    actionPlan90Day,
    rebirthWindow,
    archetype: archetype.type,
    archetypeDescription: archetype.description
  };
}

function calculateCrossAnalysis(
  career: CareerGuidance,
  love: LoveGuidance,
  money: MoneyGuidance,
  health: HealthGuidance,
  growth: GrowthGuidance,
  mulank: number,
  bhagyank: number
): CrossAnalysis {
  const analysis: CrossAnalysis = {};
  
  // Career vs Love conflict
  if (career.workStyle.score.leadership > 70 && love.polarityScore.giving < 40) {
    analysis.careerLoveConflict = {
      exists: true,
      guidance: 'Your leadership energy may overwhelm intimate relationships. Practice vulnerability at home—be led sometimes.'
    };
  }

  // Money supports Growth
  if (money.abundanceScore >= 60 && growth.identityPurposeAlignment.percentage >= 60) {
    analysis.moneyGrowthSynergy = {
      exists: true,
      opportunity: 'Your financial and purpose energies are aligned. This is an excellent time for purpose-driven investments and growth initiatives.'
    };
  }

  // Health vs Success balance
  if (health.emotionalOverloadScore > 60 && career.monthlyCareerEnergy.filter(m => m.score > 70).length > 6) {
    analysis.healthSuccessBalance = {
      exists: true,
      advice: 'High career momentum is straining your health. Schedule mandatory rest periods or risk burnout derailing your success.'
    };
  }

  // Love blocks Abundance
  if (love.relationshipPatterns.some(p => p.toLowerCase().includes('over-giving')) && money.prosperityBlock.type.includes('Receiving')) {
    analysis.loveAbundanceBlock = {
      exists: true,
      logic: 'Your pattern of over-giving in relationships mirrors your money block. Learning to receive in love will unlock financial flow.'
    };
  }

  // Destiny-Mulank misalignment
  const m = mulank > 9 ? (mulank % 9 || 9) : mulank;
  const b = bhagyank > 9 ? (bhagyank % 9 || 9) : bhagyank;
  if (Math.abs(m - b) > 4) {
    analysis.destinyMulankMisalignment = {
      exists: true,
      correction: 'Your birth energy (Mulank) and life path (Bhagyank) have tension. Bridge them by consciously developing traits of both numbers.'
    };
  }

  return analysis;
}

function calculateConflictResolver(mulank: number): ConflictResolver {
  const m = mulank > 9 ? (mulank % 9 || 9) : mulank;
  
  const styles: Record<number, ConflictResolver> = {
    1: { style: 'Direct Confrontation', description: 'Aap directly face karte ho—assertive but sometimes aggressive', improvement: 'Listen before responding. Victory through understanding, not domination.' },
    2: { style: 'Avoidance & Accommodation', description: 'Aap avoid karte ho conflict, peace ke liye sacrifice karte ho', improvement: 'Your needs matter too. Speak up before resentment builds.' },
    3: { style: 'Humor & Deflection', description: 'Aap jokes mein serious issues bypass kar dete ho', improvement: 'Some wounds need direct attention. Stop before you deflect.' },
    4: { style: 'Stubborn Silence', description: 'Aap silent ho jate ho aur wait karte ho dusre ke surrender ka', improvement: 'Silence is not solution. Communicate your boundaries clearly.' },
    5: { style: 'Flight Response', description: 'Aap run kar jate ho—physically or emotionally distance', improvement: 'Running delays resolution. Stay present with discomfort.' },
    6: { style: 'Over-Responsibility', description: 'Aap blame lete ho even when not yours', improvement: 'Not everything is your fault. Fair accountability, not martyrdom.' },
    7: { style: 'Analytical Withdrawal', description: 'Aap analyze karte ho but engage nahi karte', improvement: 'Thinking is not connecting. Share your analysis with the other person.' },
    8: { style: 'Power Play', description: 'Aap win karna chahte ho—conflict as competition', improvement: 'Relationships are not deals. Sometimes losing wins the relationship.' },
    9: { style: 'Compassionate Exit', description: 'Aap forgive kar ke move on kar lete ho without resolution', improvement: 'Forgiveness needs discussion. Complete before you release.' }
  };
  
  return styles[m] || styles[5];
}

function calculateDecisionEngine(mulank: number, bhagyank: number, personalYear: number): DecisionEngine {
  const m = mulank > 9 ? (mulank % 9 || 9) : mulank;
  const yearEnergy = personalYear % 9 || 9;
  
  // Decision probability based on current energy
  let yesScore = 40 + (yearEnergy * 5);
  let noScore = 30 + ((9 - yearEnergy) * 4);
  let waitScore = 30 + ((5 - Math.abs(yearEnergy - 5)) * 6);
  
  // Adjust based on mulank
  if ([1, 3, 5, 8].includes(m)) {
    yesScore += 15;
    waitScore -= 10;
  } else if ([2, 4, 6].includes(m)) {
    waitScore += 10;
    yesScore -= 5;
  }
  
  // Normalize
  const total = yesScore + noScore + waitScore;
  yesScore = Math.round((yesScore / total) * 100);
  noScore = Math.round((noScore / total) * 100);
  waitScore = Math.round((waitScore / total) * 100);
  
  let recommendation = 'Proceed with awareness';
  if (yesScore > 50) recommendation = 'Green light—energy supports action';
  else if (waitScore > 40) recommendation = 'Amber—gather more information first';
  else if (noScore > 40) recommendation = 'Red flag—reconsider or wait for better timing';
  
  return { yesScore, noScore, waitScore, recommendation };
}

// =====================================================
// MAIN CALCULATION FUNCTION
// =====================================================

// Partner Compatibility Calculation
function calculatePartnerCompatibility(
  userMulank: number,
  userBhagyank: number,
  partnerName: string,
  partnerDob: string
): PartnerCompatibility {
  // Calculate partner's numbers from DOB
  const dobParts = partnerDob.split(/[-/]/);
  let day = 0, month = 0, year = 0;
  
  if (dobParts.length === 3) {
    // Handle different formats: DD/MM/YYYY or YYYY-MM-DD
    if (dobParts[0].length === 4) {
      year = parseInt(dobParts[0]);
      month = parseInt(dobParts[1]);
      day = parseInt(dobParts[2]);
    } else {
      day = parseInt(dobParts[0]);
      month = parseInt(dobParts[1]);
      year = parseInt(dobParts[2]);
    }
  }
  
  // Calculate partner's Mulank (Birth Number)
  let partnerMulank = day;
  while (partnerMulank > 9 && partnerMulank !== 11 && partnerMulank !== 22 && partnerMulank !== 33) {
    partnerMulank = String(partnerMulank).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  // Calculate partner's Bhagyank (Destiny Number)
  let partnerBhagyank = day + month + year;
  while (partnerBhagyank > 9 && partnerBhagyank !== 11 && partnerBhagyank !== 22 && partnerBhagyank !== 33) {
    partnerBhagyank = String(partnerBhagyank).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  // Compatibility matrix
  const compatibilityMatrix: Record<string, number> = {
    '1-1': 75, '1-2': 60, '1-3': 85, '1-4': 55, '1-5': 90, '1-6': 65, '1-7': 70, '1-8': 80, '1-9': 85,
    '2-2': 80, '2-3': 70, '2-4': 75, '2-5': 55, '2-6': 90, '2-7': 60, '2-8': 65, '2-9': 85,
    '3-3': 75, '3-4': 50, '3-5': 90, '3-6': 85, '3-7': 65, '3-8': 55, '3-9': 80,
    '4-4': 70, '4-5': 45, '4-6': 75, '4-7': 80, '4-8': 85, '4-9': 50,
    '5-5': 60, '5-6': 55, '5-7': 85, '5-8': 70, '5-9': 90,
    '6-6': 85, '6-7': 55, '6-8': 70, '6-9': 90,
    '7-7': 75, '7-8': 60, '7-9': 70,
    '8-8': 70, '8-9': 65,
    '9-9': 80,
  };
  
  const um = userMulank > 9 ? (userMulank % 9 || 9) : userMulank;
  const pm = partnerMulank > 9 ? (partnerMulank % 9 || 9) : partnerMulank;
  const key = um <= pm ? `${um}-${pm}` : `${pm}-${um}`;
  
  // Calculate additional compatibility from Bhagyank
  const ub = userBhagyank > 9 ? (userBhagyank % 9 || 9) : userBhagyank;
  const pb = partnerBhagyank > 9 ? (partnerBhagyank % 9 || 9) : partnerBhagyank;
  const bhagyankKey = ub <= pb ? `${ub}-${pb}` : `${pb}-${ub}`;
  
  const mulankScore = compatibilityMatrix[key] || 70;
  const bhagyankScore = compatibilityMatrix[bhagyankKey] || 70;
  const compatibilityScore = Math.round((mulankScore * 0.6) + (bhagyankScore * 0.4));
  
  let compatibilityLevel: 'Excellent' | 'Good' | 'Moderate' | 'Challenging';
  if (compatibilityScore >= 85) compatibilityLevel = 'Excellent';
  else if (compatibilityScore >= 70) compatibilityLevel = 'Good';
  else if (compatibilityScore >= 55) compatibilityLevel = 'Moderate';
  else compatibilityLevel = 'Challenging';
  
  // Strengths based on number combinations
  const strengthsByMatch: Record<string, string[]> = {
    'Excellent': ['Deep soul understanding', 'Natural harmony', 'Shared life vision', 'Strong emotional bond'],
    'Good': ['Complementary energies', 'Mutual respect', 'Growth-oriented connection', 'Balanced give-and-take'],
    'Moderate': ['Learning opportunity', 'Different perspectives enrich', 'Patience builds depth', 'Conscious effort rewards'],
    'Challenging': ['Karmic lessons', 'Growth through friction', 'Opposite attract dynamics', 'Transformation potential']
  };
  
  const challengesByMatch: Record<string, string[]> = {
    'Excellent': ['May become too comfortable', 'Need to maintain individual growth', 'Over-dependency risk'],
    'Good': ['Minor communication gaps', 'Different priorities at times', 'Need for regular check-ins'],
    'Moderate': ['Different emotional languages', 'Conflicting approaches to life', 'Requires conscious bridge-building'],
    'Challenging': ['Fundamental value differences', 'Power struggles possible', 'Need for deep acceptance work']
  };
  
  const growthAreasByMatch: Record<string, string[]> = {
    'Excellent': ['Shared spiritual practices', 'Joint creative projects', 'Building legacy together'],
    'Good': ['Learning each other\'s love language', 'Developing shared goals', 'Balancing independence'],
    'Moderate': ['Patience and acceptance', 'Communication skills', 'Finding middle ground'],
    'Challenging': ['Unconditional acceptance', 'Releasing control', 'Embracing differences as gifts']
  };
  
  // Communication style based on both numbers
  const commStyles: Record<number, string> = {
    1: 'Direct and assertive',
    2: 'Gentle and diplomatic',
    3: 'Expressive and animated',
    4: 'Practical and measured',
    5: 'Dynamic and varied',
    6: 'Nurturing and harmonious',
    7: 'Thoughtful and introspective',
    8: 'Authoritative and clear',
    9: 'Compassionate and wise'
  };
  
  const userComm = commStyles[um] || 'Balanced';
  const partnerComm = commStyles[pm] || 'Balanced';
  const communicationStyle = `You: ${userComm} | Partner: ${partnerComm}. ${um === pm ? 'Similar styles - easy understanding' : 'Different styles - adapt for harmony'}`;
  
  // Conflict resolution tip
  const conflictTips: Record<string, string> = {
    'Excellent': 'Your natural harmony resolves most issues. Use gentle honesty for deeper topics.',
    'Good': 'Take turns leading resolution. Acknowledge differences as complementary, not opposing.',
    'Moderate': 'Pause before reacting. Write down concerns before discussing to ensure clarity.',
    'Challenging': 'Seek neutral ground. Consider a "24-hour cool down" rule before addressing heated issues.'
  };
  
  // Best dates based on combined numbers
  const combinedNum = (um + pm) % 9 || 9;
  const luckyDates = [combinedNum, combinedNum + 9, combinedNum + 18].map(d => d > 31 ? d - 31 : d);
  const bestDatesForImportantEvents = luckyDates.map(d => `${d}th of any month`);
  
  // Relationship dynamics
  const relationshipDynamics = {
    leadership: um > pm ? `You naturally lead; ${partnerName} supports` : um < pm ? `${partnerName} leads; you support` : 'Equal partnership - rotate leadership',
    emotionalFlow: um % 2 === pm % 2 ? 'Similar emotional rhythms - sync naturally' : 'Different rhythms - schedule quality time',
    financialHarmony: [4, 8].includes(um) || [4, 8].includes(pm) ? 'Strong financial synergy' : 'Discuss money openly for alignment',
    intimacyMatch: Math.abs(um - pm) <= 2 ? 'High intimacy compatibility' : 'Different intimacy needs - communicate openly'
  };
  
  // Soul contract insight
  const soulContracts: Record<number, string> = {
    1: `You and ${partnerName} are here to learn independence within togetherness.`,
    2: `Your soul contract involves deep emotional healing and partnership mastery.`,
    3: `Together you are meant to express joy and create beauty in the world.`,
    4: `Building something lasting together is your shared karmic purpose.`,
    5: `Freedom and growth through change is what you teach each other.`,
    6: `Family, service, and unconditional love are your shared lessons.`,
    7: `Spiritual depth and inner wisdom are what you seek together.`,
    8: `Power, abundance, and ethical leadership are your joint mission.`,
    9: `Humanitarian service and universal love unite your souls.`
  };
  
  const karmicLessons: Record<number, string> = {
    1: `Learn to maintain individual identity while deeply merging with ${partnerName}.`,
    2: `Master the balance of giving and receiving in this relationship.`,
    3: `Express your authentic self without fear of judgment.`,
    4: `Build trust brick by brick - patience is your teacher here.`,
    5: `Allow change without fear; growth requires letting go.`,
    6: `Love without needing to fix or control the outcome.`,
    7: `Open your heart even when your mind seeks solitude.`,
    8: `Share power gracefully; true strength is in vulnerability.`,
    9: `Love one person fully, not humanity through them.`
  };
  
  return {
    partnerName,
    partnerMulank,
    partnerBhagyank,
    compatibilityScore,
    compatibilityLevel,
    strengths: strengthsByMatch[compatibilityLevel],
    challenges: challengesByMatch[compatibilityLevel],
    growthAreas: growthAreasByMatch[compatibilityLevel],
    communicationStyle,
    conflictResolutionTip: conflictTips[compatibilityLevel],
    bestDatesForImportantEvents,
    relationshipDynamics,
    soulContractInsight: soulContracts[combinedNum] || soulContracts[5],
    karmicLessonTogether: karmicLessons[um] || karmicLessons[1]
  };
}

export function calculateLifePillars(
  vedicProfile: VedicProfile,
  numerologyProfile: { lifePath: number; destiny: number; personalYear: number },
  partnerData?: { name: string; dob: string }
): LifePillars {
  const { mulank, bhagyank, chakraAlignment } = vedicProfile;
  const { lifePath, personalYear } = numerologyProfile;

  const career = calculateCareerGuidance(mulank, bhagyank, lifePath, personalYear);
  let love = calculateLoveGuidance(mulank, bhagyank, lifePath);
  
  // Add partner compatibility if partner data provided
  if (partnerData?.name && partnerData?.dob) {
    const partnerCompatibility = calculatePartnerCompatibility(mulank, bhagyank, partnerData.name, partnerData.dob);
    love = { ...love, partnerCompatibility };
  }
  
  const money = calculateMoneyGuidance(mulank, bhagyank, lifePath, personalYear);
  const health = calculateHealthGuidance(mulank, bhagyank, chakraAlignment);
  const growth = calculateGrowthGuidance(mulank, bhagyank, lifePath, personalYear);
  
  const crossAnalysis = calculateCrossAnalysis(career, love, money, health, growth, mulank, bhagyank);
  const conflictResolver = calculateConflictResolver(mulank);
  const decisionEngine = calculateDecisionEngine(mulank, bhagyank, personalYear);

  const lifeBlueprintSummary: LifeBlueprintSummary = {
    careerTagline: 'Your work is the stage where destiny speaks.',
    loveTagline: partnerData?.name ? `Your heart found ${partnerData.name} for a reason.` : 'Your heart carries memory beyond this lifetime.',
    moneyTagline: 'Money comes when identity and value match.',
    healthTagline: 'Your body listens to what your soul refuses to speak.',
    growthTagline: 'Your path is written, but your choices are the ink.'
  };

  return {
    career,
    love,
    money,
    health,
    growth,
    crossAnalysis,
    conflictResolver,
    decisionEngine,
    lifeBlueprintSummary
  };
}

// Business Name Numerology
export function calculateBusinessNameVibration(name: string): { score: number; vibration: string; compatibility: string } {
  const letterValues: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
  };
  
  let sum = 0;
  for (const char of name.toLowerCase()) {
    if (letterValues[char]) {
      sum += letterValues[char];
    }
  }
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  
  const vibrations: Record<number, string> = {
    1: 'Leadership & Innovation',
    2: 'Partnership & Balance',
    3: 'Creativity & Expression',
    4: 'Stability & Trust',
    5: 'Change & Versatility',
    6: 'Service & Harmony',
    7: 'Wisdom & Specialization',
    8: 'Power & Abundance',
    9: 'Global & Humanitarian',
    11: 'Visionary & Inspirational',
    22: 'Master Builder',
    33: 'Master Healer'
  };
  
  const score = 60 + (sum % 4) * 10;
  
  return {
    score,
    vibration: vibrations[sum] || vibrations[5],
    compatibility: score >= 80 ? 'Excellent brand vibration' : score >= 60 ? 'Good potential with minor adjustments' : 'Consider alternative names'
  };
}
