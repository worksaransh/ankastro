import { supabase } from '@/integrations/supabase/client';
import { calculateLifePath, reduceToSingleDigit, calculatePersonalYear, calculatePersonalMonth, type NumerologyProfile } from './numerology';
import { calculatePsychologicalBaseline, type PsychologicalBaseline } from './psychology';
import { getRemediesForNumber } from './remedies';
import { calculateHealthVitality, detectKarmicDebts, calculatePinnaclesAndChallenges, calculateLoshuPlanes, calculateGemstoneRudrakshaPrescription } from './enterpriseNumerologyEngine';

export interface PersonalizedReportSection {
  partNumber: number;
  partTitle: string;
  sectionKey: string;
  sectionTitle: string;
  personalizedTitle: string;
  vibrationScore: number;
  personalizedContent: {
    headline: string;
    summary: string;
    detailedAnalysis: string;
    userContextHighlight: string;
    strengths: string[];
    riskWarnings: string[];
    goalAlignment: string;
    prescribedRemedies: {
      title: string;
      instructions: string;
      reason: string;
    }[];
    actionSteps: string[];
    aiPrompts: string[];
  };
}

export interface PersonalizedReportPackage {
  reportKey: string;
  userProfile: Partial<NumerologyProfile> & Record<string, any>;
  psychology: PsychologicalBaseline;
  personalYear: number;
  personalMonth: number;
  overallVibrationScore: number;
  parts: {
    partNumber: number;
    partTitle: string;
    sections: PersonalizedReportSection[];
  }[];
}

const SECTION_TEMPLATES: Record<string, { partNumber: number; partTitle: string; sectionKey: string; sectionTitle: string }[]> = {
  career_wealth: [
    { partNumber: 1, partTitle: 'PART 1: Core Personality & Soul Blueprint', sectionKey: 'core_archetype', sectionTitle: 'Mulank & Bhagyank Professional Blueprint' },
    { partNumber: 1, partTitle: 'PART 1: Core Personality & Soul Blueprint', sectionKey: 'psychological_style', sectionTitle: 'Leadership & Decision Making Psychology' },
    { partNumber: 2, partTitle: 'PART 2: Career & Wealth Expansion Strategy', sectionKey: 'career_channels', sectionTitle: 'Aligned Career & Industry Sectors' },
    { partNumber: 2, partTitle: 'PART 2: Career & Wealth Expansion Strategy', sectionKey: 'wealth_potential', sectionTitle: 'Wealth Retention & Financial Vulnerability' },
    { partNumber: 3, partTitle: 'PART 3: Predictive Timing & Goal Matrix', sectionKey: 'cycle_forecast', sectionTitle: 'Current Personal Year & Personal Month Growth Roadmap' },
    { partNumber: 3, partTitle: 'PART 3: Predictive Timing & Goal Matrix', sectionKey: 'favorable_timing', sectionTitle: 'High-Impact Execution Months' },
    { partNumber: 4, partTitle: 'PART 4: Custom Wealth Remedies & AI Action Plan', sectionKey: 'actionable_remedies', sectionTitle: 'Tailored Wealth Remedies & Gemstone Prescriptions' },
    { partNumber: 4, partTitle: 'PART 4: Custom Wealth Remedies & AI Action Plan', sectionKey: 'ai_consultation', sectionTitle: 'Smart AI Assistant Guidance Prompts' },
  ],
  name_correction: [
    { partNumber: 1, partTitle: 'PART 1: Name Vibration Identity', sectionKey: 'name_vibration_root', sectionTitle: 'Current Name vs Driver & Conductor Harmony' },
    { partNumber: 1, partTitle: 'PART 1: Name Vibration Identity', sectionKey: 'signature_energy', sectionTitle: 'Signature Energy & Flow Dynamics' },
    { partNumber: 2, partTitle: 'PART 2: Recommended Name Variations', sectionKey: 'suggested_spellings', sectionTitle: 'Optimum Numerological Spelling Alternatives' },
    { partNumber: 2, partTitle: 'PART 2: Recommended Name Variations', sectionKey: 'life_impact', sectionTitle: 'Impact on Career, Health & Relationships' },
    { partNumber: 3, partTitle: 'PART 3: Implementation Timeline', sectionKey: 'activation_timing', sectionTitle: 'Best Personal Month for Name Change Activation' },
    { partNumber: 4, partTitle: 'PART 4: Name Remedial Action Plan', sectionKey: 'signature_rules', sectionTitle: 'Signature Alignment Rules & Daily Writing Rituals' },
  ],
  relationship: [
    { partNumber: 1, partTitle: 'PART 1: Romantic & Emotional Blueprint', sectionKey: 'love_psychology', sectionTitle: 'Emotional Communication & Love Needs' },
    { partNumber: 2, partTitle: 'PART 2: Partner Compatibility Matrix', sectionKey: 'compatibility_verdict', sectionTitle: 'Core Number Synergy & Harmony Score' },
    { partNumber: 2, partTitle: 'PART 2: Partner Compatibility Matrix', sectionKey: 'rel_challenges', sectionTitle: 'Potential Friction Points & Conflict Triggers' },
    { partNumber: 3, partTitle: 'PART 3: Relationship Timing Roadmap', sectionKey: 'harmony_cycles', sectionTitle: 'Favorable Months for Relationship Milestones' },
    { partNumber: 4, partTitle: 'PART 4: Relationship Harmony Remedies', sectionKey: 'love_remedies', sectionTitle: 'Vibrational Space & Color Remedies for Unity' },
  ],
  business_numerology: [
    { partNumber: 1, partTitle: 'PART 1: Business Brand Identity', sectionKey: 'brand_vibration', sectionTitle: 'Brand Name Compound Vibration Analysis' },
    { partNumber: 2, partTitle: 'PART 2: Financial & Market Alignment', sectionKey: 'market_fit', sectionTitle: 'Owner Mulank & Brand Synergy Score' },
    { partNumber: 3, partTitle: 'PART 3: Business Timing Matrix', sectionKey: 'expansion_timing', sectionTitle: 'Favorable Product Launch & Contract Timing' },
    { partNumber: 4, partTitle: 'PART 4: Brand Remedies & Tweaks', sectionKey: 'brand_remedies', sectionTitle: 'Logo, Tagline & Business Spellings Optimization' },
  ],
  mobile_numerology: [
    { partNumber: 1, partTitle: 'PART 1: Mobile Frequency Analysis', sectionKey: 'mobile_root', sectionTitle: 'Mobile Number Total & Driver Compatibility' },
    { partNumber: 2, partTitle: 'PART 2: Life Impact Matrix', sectionKey: 'communication_impact', sectionTitle: 'Impact on Wealth, Client Calls & Deals' },
    { partNumber: 3, partTitle: 'PART 3: Selection Timing', sectionKey: 'number_change_timing', sectionTitle: 'Best Timing for Changing Primary Contact Number' },
    { partNumber: 4, partTitle: 'PART 4: Mobile Energy Balancing', sectionKey: 'wallpaper_remedy', sectionTitle: 'Vibrational Mobile Wallpaper & Digit Remedies' },
  ],
  default: [
    { partNumber: 1, partTitle: 'PART 1: Core Personal Blueprint', sectionKey: 'core_overview', sectionTitle: 'Life Path & Soul Urge Blueprint' },
    { partNumber: 2, partTitle: 'PART 2: Comprehensive Life Analysis', sectionKey: 'pillar_breakdown', sectionTitle: '5-Pillar Vibrational Analysis' },
    { partNumber: 3, partTitle: 'PART 3: Personal Yearly Horizon', sectionKey: 'yearly_horizon', sectionTitle: 'Predictive Energy Roadmap' },
    { partNumber: 4, partTitle: 'PART 4: Tailored Remedial Blueprint', sectionKey: 'remedial_blueprint', sectionTitle: 'Daily Habits & Energy Balancing Remedies' },
  ]
};

export async function generatePersonalizedReport(params: {
  userId?: string;
  reportKey: string;
  profile: Partial<NumerologyProfile> & Record<string, any>;
  language?: 'en' | 'hi' | 'hinglish';
}): Promise<PersonalizedReportPackage> {
  const lang = params.language || 'hinglish';
  const reportKey = params.reportKey || 'career_wealth';

  const mulank = params.profile.mulank || (params.profile.dob ? getMulankFromDob(params.profile.dob) : 1);
  const bhagyank = params.profile.bhagyank || (params.profile.dob ? getBhagyankFromDob(params.profile.dob) : 1);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const personalYear = calculatePersonalYear(params.profile.dob || '1990-01-01', currentYear);
  const personalMonth = calculatePersonalMonth(personalYear, currentMonth);

  const psychology = calculatePsychologicalBaseline({
    mulank,
    bhagyank,
    profession: params.profile.profession,
    isBusinessOwner: params.profile.is_business_owner,
  });

  const professionText = params.profile.profession ? `as a ${params.profile.profession}` : 'in your professional career';
  const lifeStageText = params.profile.life_stage ? `during your ${params.profile.life_stage} stage` : 'in your current life phase';
  const maritalText = params.profile.marital_status ? `(Marital Status: ${params.profile.marital_status})` : '';

  const templates = SECTION_TEMPLATES[reportKey] || SECTION_TEMPLATES.default;

  const sections: PersonalizedReportSection[] = templates.map((tpl) => {
    let headline = '';
    let summary = '';
    let detailedAnalysis = '';
    let userContextHighlight = '';
    let strengths: string[] = [];
    let riskWarnings: string[] = [];
    let goalAlignment = '';
    let prescribedRemedies: { title: string; instructions: string; reason: string }[] = [];
    let actionSteps: string[] = [];
    let aiPrompts: string[] = [];
    let vibrationScore = 75;

    if (tpl.sectionKey === 'core_archetype' || tpl.sectionKey === 'core_overview' || tpl.sectionKey === 'name_vibration_root') {
      vibrationScore = 85;
      headline = `Mulank ${mulank} & Bhagyank ${bhagyank} Synergistic Blueprint for ${params.profile.name || 'User'}`;
      summary = `Your core driver number ${mulank} gives you ${psychology.leadershipStyle.toLowerCase()}, while your destiny conductor number ${bhagyank} steers your long-term success ${lifeStageText}.`;
      detailedAnalysis = `Operating ${professionText}, your Mulank ${mulank} provides immediate tactical direction. You thrive when using a ${psychology.communicationStyle} approach. Your decision style is ${psychology.decisionStyle}, which gives you a strong competitive edge when aligned with your natural risk tolerance level of ${psychology.riskLevel}/10.`;
      userContextHighlight = `Tailored Context: Profession: ${params.profile.profession || 'Professional'} | Life Stage: ${params.profile.life_stage || 'Active Growth'} | Risk Rating: ${psychology.riskLevel}/10`;
      strengths = psychology.motivationDrivers.map(m => `Driven by ${m}`);
      riskWarnings = psychology.stressTriggers.map(s => `Vulnerable to stress when facing ${s}`);
      goalAlignment = `Your primary goals match high-vibration windows in Personal Year ${personalYear}.`;
      actionSteps = [
        `Align daily morning routine with Mulank ${mulank} peak hours (07:00 AM - 09:00 AM).`,
        `Focus your key leadership decisions around your ${psychology.decisionStyle} strengths.`
      ];
      aiPrompts = [
        `How can I leverage my Mulank ${mulank} and Bhagyank ${bhagyank} combo to achieve faster growth ${professionText}?`,
        `What strategic adjustments should I make considering my risk tolerance level of ${psychology.riskLevel}/10?`
      ];
    } else if (tpl.sectionKey === 'psychological_style' || tpl.sectionKey === 'love_psychology' || tpl.sectionKey === 'signature_energy') {
      vibrationScore = 80;
      headline = `Psychological Profile: ${psychology.personalityType}`;
      summary = `Your decision engine operates via ${psychology.decisionStyle}. You express leadership as ${psychology.leadershipStyle}.`;
      detailedAnalysis = `For someone working ${professionText} ${maritalText}, managing stress triggers like ${psychology.stressTriggers.join(', ')} is critical. Your communication style (${psychology.communicationStyle}) allows you to win trust when authentic.`;
      userContextHighlight = `Psychology Baseline: ${psychology.personalityType} (${psychology.leadershipStyle})`;
      strengths = ['High strategic insight', 'Authentic leadership', 'Resilient under clear direction'];
      riskWarnings = ['Avoid impulsive actions during high stress', 'Prevent burnout from over-commitment'];
      goalAlignment = `Matches your decision style of ${psychology.decisionStyle}.`;
      actionSteps = [
        `Practice a 5-minute grounding routine before major client or team meetings.`,
        `Keep signature tilted upwards at 15-30 degrees to boost confidence vibration.`
      ];
      aiPrompts = [
        `What are the best negotiation strategies for someone with ${psychology.communicationStyle}?`
      ];
    } else if (tpl.sectionKey === 'cycle_forecast' || tpl.sectionKey === 'activation_timing' || tpl.sectionKey === 'expansion_timing' || tpl.sectionKey === 'yearly_horizon') {
      vibrationScore = 70 + (personalYear * 3);
      headline = `Personal Year ${personalYear} & Personal Month ${personalMonth} Roadmap`;
      summary = `You are currently in a Personal Year ${personalYear} cycle. This year emphasizes strategic development, new initiatives, and structural expansion.`;
      detailedAnalysis = `In Personal Year ${personalYear}, month ${personalMonth} brings intense focus on ${personalYear % 2 === 0 ? 'building relationships and systems' : 'taking bold actions and launching new projects'}. For your profession ${professionText}, this is a prime opportunity to align high-priority goals.`;
      userContextHighlight = `Current Energy Cycle: Personal Year ${personalYear} | Personal Month ${personalMonth}`;
      strengths = ['Favorable energy for launching aligned initiatives', 'Clear clarity on upcoming financial cycles'];
      riskWarnings = ['Do not push contracts on conflict days', 'Avoid major uncalculated risks during month shifts'];
      goalAlignment = `Target active goals during Personal Month ${personalMonth} for maximum push.`;
      actionSteps = [
        `Schedule important contract signings or launches in the 1st half of Personal Month ${personalMonth}.`,
        `Review monthly targets every Sunday evening.`
      ];
      aiPrompts = [
        `What specific actions should I take in Personal Year ${personalYear} for maximum financial growth?`
      ];
    } else {
      vibrationScore = 82;
      headline = `${tpl.sectionTitle} for ${params.profile.name || 'User'}`;
      summary = `Tailored dynamic section analysis derived from your unique numerology matrix and active profile settings.`;
      detailedAnalysis = `Analyzing your profile ${professionText} ${lifeStageText}, this section provides targeted insights to ensure high alignment with your core vibration numbers ${mulank} and ${bhagyank}.`;
      userContextHighlight = `Domain Alignment: High Vibrational Synergy (${vibrationScore}%)`;
      strengths = ['Optimized energy alignment', 'Custom action plan included'];
      riskWarnings = ['Keep awareness of unfavorable color/digit vibrations'];
      goalAlignment = `Directly supports your overall personal growth trajectory.`;
      const remediesData = getRemediesForNumber(mulank);
      const healthProfile = calculateHealthVitality(mulank, bhagyank);
      const karmicDebts = detectKarmicDebts(params.profile.dob || '', params.profile.name || '');
      const loshuPlanes = calculateLoshuPlanes(params.profile.dob || '');
      const gemPrescription = calculateGemstoneRudrakshaPrescription(mulank, 70);

      if (loshuPlanes.hasGoldenYog) {
        strengths.push('Raj Yog (Golden Plane 4-5-6): Exceptional potential for wealth, luxury, and public recognition.');
      }
      if (loshuPlanes.hasSilverYog) {
        strengths.push('Property Yog (Silver Plane 2-5-8): High stability for real estate acquisition and land assets.');
      }

      riskWarnings.push(`Health Vulnerability: Sensitive organs include ${healthProfile.vulnerableOrgans.join(', ')}.`);
      if (karmicDebts.length > 0) {
        riskWarnings.push(`Karmic Lesson: ${karmicDebts[0].description}`);
      }

      prescribedRemedies = [
        {
          title: `Gemstone Prescription (${gemPrescription.primaryGemstone} - ${gemPrescription.recommendedRatti} Ratti)`,
          instructions: `Wear ${gemPrescription.primaryGemstone} (${gemPrescription.recommendedRatti} Ratti) in ${gemPrescription.metalType} on ${gemPrescription.wearFinger} during ${gemPrescription.wearDayTime}.`,
          reason: `Balances Mulank ${mulank} driver frequency and enhances financial clarity.`
        },
        {
          title: `Rudraksha & Beej Mantra Alignment (${gemPrescription.rudrakshaMukhi})`,
          instructions: `Wear ${gemPrescription.rudrakshaMukhi}. Chant Beej Mantra: ${gemPrescription.beejMantra}.`,
          reason: `Protects against stress triggers and aligns chakra energy.`
        },
        {
          title: `Vastu & Yantra Geometry (${gemPrescription.yantraDirection})`,
          instructions: `Place Yantra on ${gemPrescription.yantraDirection}. Favorable colors: ${remediesData.colors?.join(', ') || 'Yellow, White'}.`,
          reason: `Harmonizes living/working aura and promotes growth.`
        },
        {
          title: `Health & Vitality Routine (${healthProfile.chakraFocus})`,
          instructions: `${healthProfile.stressReliefRoutine} Diet advice: ${healthProfile.ayurvedicDietTips.join('; ')}.`,
          reason: `Balances ${healthProfile.elementDeficiency} for longevity and high daily energy.`
        }
      ];

      actionSteps = [
        `Adopt prescribed color therapy on key meeting days.`,
        `Chant daily mantra 108 times during morning routine.`,
        `Follow ${healthProfile.chakraFocus} chakra stress relief routine before sleep.`
      ];
      aiPrompts = [
        `How can I integrate these remedies into my daily busy schedule?`,
        `What specific diet changes will improve my aura based on my ${healthProfile.elementDeficiency}?`
      ];
    }


    return {
      partNumber: tpl.partNumber,
      partTitle: tpl.partTitle,
      sectionKey: tpl.sectionKey,
      sectionTitle: tpl.sectionTitle,
      personalizedTitle: headline,
      vibrationScore,
      personalizedContent: {
        headline,
        summary,
        detailedAnalysis,
        userContextHighlight,
        strengths,
        riskWarnings,
        goalAlignment,
        prescribedRemedies,
        actionSteps,
        aiPrompts,
      }
    };
  });

  // Group sections by parts
  const partNumbers = Array.from(new Set(sections.map(s => s.partNumber)));
  const parts = partNumbers.map(pNum => {
    const partSections = sections.filter(s => s.partNumber === pNum);
    return {
      partNumber: pNum,
      partTitle: partSections[0]?.partTitle || `PART ${pNum}`,
      sections: partSections,
    };
  });

  const resultPackage: PersonalizedReportPackage = {
    reportKey,
    userProfile: params.profile,
    psychology,
    personalYear,
    personalMonth,
    overallVibrationScore: Math.round(sections.reduce((acc, s) => acc + s.vibrationScore, 0) / sections.length),
    parts,
  };

  // Asynchronously attempt to persist to DB user_report_sections if userId is provided
  if (params.userId) {
    try {
      const recordsToInsert = sections.map(s => ({
        user_id: params.userId,
        report_key: reportKey,
        part_number: s.partNumber,
        section_key: s.sectionKey,
        personalized_title: s.personalizedTitle,
        personalized_content: s.personalizedContent,
        vibration_score: s.vibrationScore,
        generated_at: new Date().toISOString(),
      }));

      await supabase.from('user_report_sections').upsert(recordsToInsert, {
        onConflict: 'user_id,report_key,section_key'
      });
    } catch (e) {
      console.warn('user_report_sections cache persistence notice:', e);
    }
  }

  return resultPackage;
}

function getMulankFromDob(dob: string): number {
  if (!dob) return 1;
  const clean = dob.replace(/[-\/]/g, '/');
  const parts = clean.split('/');
  let day = 1;
  if (parts[0] && parts[0].length === 4) {
    day = Number(parts[2]);
  } else {
    day = Number(parts[0]);
  }
  if (day === 11 || day === 22) return day;
  const sumDigits = (n: number) => String(n).split('').reduce((acc, char) => acc + (Number(char) || 0), 0);
  const reduce = (n: number): number => (n <= 9 ? n : reduce(sumDigits(n)));
  return reduce(day);
}

function getBhagyankFromDob(dob: string): number {
  if (!dob) return 1;
  const clean = dob.replace(/[^0-9]/g, '');
  if (!clean) return 1;
  const sumDigits = (n: string) => n.split('').reduce((acc, char) => acc + (Number(char) || 0), 0);
  let total = sumDigits(clean);
  while (total > 9 && total !== 11 && total !== 22) {
    total = sumDigits(String(total));
  }
  return total;
}
