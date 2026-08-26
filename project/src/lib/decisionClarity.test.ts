import { describe, it, expect } from 'vitest';
import { computeDecision, DECISION_QUESTIONS } from './decisionClarity';
import type { NumerologyProfile } from './numerology';
import type { VedicProfile } from './vedicNumerology';

const baseProfile = (py: number): NumerologyProfile =>
  ({ personalYear: py } as unknown as NumerologyProfile);

const baseVedic = (mulank: number, harmony = 60): VedicProfile =>
  ({ mulank, harmonyScore: harmony } as unknown as VedicProfile);

describe('computeDecision', () => {
  it('returns scores summing to 100 across all questions', () => {
    for (const q of DECISION_QUESTIONS) {
      const r = computeDecision(q.id, baseProfile(1), baseVedic(5));
      expect(r.yesScore + r.notNowScore + r.noScore).toBe(100);
      expect(['yes', 'not_now', 'no']).toContain(r.verdict);
    }
  });

  it('boosts not_now in PY 9 vs PY 1 for new beginnings', () => {
    const py9 = computeDecision('job_vs_business', baseProfile(9), baseVedic(7));
    const py1 = computeDecision('job_vs_business', baseProfile(1), baseVedic(7));
    expect(py9.notNowScore).toBeGreaterThan(py1.notNowScore);
  });

  it('returns trilingual reasoning', () => {
    const r = computeDecision('marriage_now', baseProfile(2), baseVedic(6));
    expect(r.reasoning.en).toBeTruthy();
    expect(r.reasoning.hi).toBeTruthy();
    expect(r.reasoning.hinglish).toBeTruthy();
  });

  it('falls back gracefully on unknown question id', () => {
    const r = computeDecision('unknown_q', baseProfile(1), baseVedic(5));
    expect(r.yesScore).toBeGreaterThan(0);
  });
});
