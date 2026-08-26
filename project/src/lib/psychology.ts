import { supabase } from '@/integrations/supabase/client';
import { lifePathDestinyCombinations } from './personalityLibrary';

export interface PsychologicalBaseline {
  personalityType: string;
  leadershipStyle: string;
  communicationStyle: string;
  decisionStyle: string;
  riskLevel: number;
  motivationDrivers: string[];
  stressTriggers: string[];
}

export const LEADERSHIP_STYLES: Record<number, string> = {
  1: 'Authoritative, Independent & Direct Pioneer',
  2: 'Diplomatic, Collaborative & Empathetic Facilitator',
  3: 'Inspirational, Expressive & Creative Visionary',
  4: 'Structured, Systematic & Methodical Executor',
  5: 'Dynamic, Adaptable & Boundary-Pushing Innovator',
  6: 'Nurturing, Responsible & Values-Driven Guardian',
  7: 'Analytical, Strategic & Deep Spiritual Guide',
  8: 'Goal-Oriented, Commanding & Results-Driven Executive',
  9: 'Humanitarian, Transformational & Purpose-Driven Mentor',
};

export const COMMUNICATION_STYLES: Record<number, string> = {
  1: 'Direct, confident, and straight to the point.',
  2: 'Diplomatic, subtle, and empathetic listener.',
  3: 'Enthusiastic, story-driven, and persuasive.',
  4: 'Clear, logical, structured, and factual.',
  5: 'Fast-paced, engaging, adaptable, and witty.',
  6: 'Warm, encouraging, protective, and considerate.',
  7: 'Thoughtful, deep, selective, and observant.',
  8: 'Authoritative, pragmatic, and outcome-focused.',
  9: 'Compassionate, inspiring, and global-minded.',
};

export const DECISION_STYLES: Record<number, string> = {
  1: 'Instinctive & fast-moving — prefers independent risk.',
  2: 'Consultative & cautious — seeks consensus and balance.',
  3: 'Creative & optimistic — guided by excitement and vision.',
  4: 'Deliberate & risk-averse — guided by facts and data.',
  5: 'Spontaneous & opportunistic — open to fast pivots.',
  6: 'Principle-driven — guided by impact on family/community.',
  7: 'Intuitive & analytical — requires research and inner reflection.',
  8: 'Strategic & ROI-focused — guided by scale and long-term leverage.',
  9: 'Idealistic & purpose-first — guided by broad humanitarian impact.',
};

export const DEFAULT_MOTIVATIONS: Record<number, string[]> = {
  1: ['Autonomy', 'Innovation', 'Leading new projects', 'Recognition'],
  2: ['Harmony', 'Deep partnerships', 'Helping others succeed', 'Emotional connection'],
  3: ['Self-expression', 'Creative freedom', 'Social impact', 'Joy and optimism'],
  4: ['Financial stability', 'Clear systems', 'Long-term security', 'Craftsmanship'],
  5: ['Freedom', 'Exploration', 'Versatility', 'Overcoming limits'],
  6: ['Family well-being', 'Community honor', 'Quality & Aesthetics', 'Nurturing growth'],
  7: ['Self-mastery', 'Uncovering truth', 'Solitude & Study', 'Wisdom'],
  8: ['Financial empire', 'Mastery over resources', 'Influence', 'High achievements'],
  9: ['Legacy', 'Global impact', 'Healing', 'Spiritual enlightenment'],
};

export const DEFAULT_STRESSORS: Record<number, string[]> = {
  1: ['Micromanagement', 'Delay in action', 'Loss of autonomy'],
  2: ['Conflict & confrontation', 'Isolation', 'Harsh criticism'],
  3: ['Monotony', 'Routine paperwork', 'Feeling unappreciated'],
  4: ['Sudden unplanned changes', 'Disorder', 'Financial unpredictability'],
  5: ['Feeling trapped or restricted', 'Rigid rules', 'Boredom'],
  6: ['Family disharmony', 'Unfairness', 'Over-commitment'],
  7: ['Noise & superficiality', 'Interruption of quiet time', 'Forced hurry'],
  8: ['Loss of control', 'Inefficiency', 'Financial setback'],
  9: ['Selfishness in environment', 'Unfinished missions', 'Cynicism'],
};

export function calculatePsychologicalBaseline(params: {
  mulank: number;
  bhagyank: number;
  profession?: string;
  isBusinessOwner?: boolean;
  goal?: string;
}): PsychologicalBaseline {
  const m = Math.min(Math.max(params.mulank || 1, 1), 9);
  const b = Math.min(Math.max(params.bhagyank || 1, 1), 9);
  
  const comboKey = `${m}-${b}`;
  const comboData = lifePathDestinyCombinations[comboKey];
  const personalityType = comboData ? comboData.title : `Type ${m}-${b} Harmonizer`;

  const leadershipStyle = LEADERSHIP_STYLES[m] || LEADERSHIP_STYLES[1];
  const communicationStyle = COMMUNICATION_STYLES[m] || COMMUNICATION_STYLES[1];
  const decisionStyle = DECISION_STYLES[b] || DECISION_STYLES[1];

  // Base risk level on Mulank + Bhagyank
  let riskLevel = Math.round((m * 0.6) + (b * 0.4));
  if (params.isBusinessOwner) riskLevel = Math.min(riskLevel + 2, 10);
  if ([1, 5, 8].includes(m)) riskLevel = Math.min(riskLevel + 1, 10);
  if ([2, 4, 7].includes(m)) riskLevel = Math.max(riskLevel - 1, 1);

  const motivationDrivers = DEFAULT_MOTIVATIONS[m] || DEFAULT_MOTIVATIONS[1];
  const stressTriggers = DEFAULT_STRESSORS[b] || DEFAULT_STRESSORS[1];

  return {
    personalityType,
    leadershipStyle,
    communicationStyle,
    decisionStyle,
    riskLevel,
    motivationDrivers,
    stressTriggers,
  };
}

export async function saveUserPsychology(userId: string, baseline: PsychologicalBaseline): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_psychology').upsert({
      user_id: userId,
      personality_type: baseline.personalityType,
      leadership_style: baseline.leadershipStyle,
      communication_style: baseline.communicationStyle,
      decision_style: baseline.decisionStyle,
      risk_level: baseline.riskLevel,
      motivation_drivers: baseline.motivationDrivers,
      stress_triggers: baseline.stressTriggers,
      calculated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) {
      console.warn('user_psychology upsert warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('saveUserPsychology exception:', err);
    return false;
  }
}
