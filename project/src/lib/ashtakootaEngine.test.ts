import { describe, it, expect } from 'vitest';
import { calculateAshtakootaMilan } from './ashtakootaEngine';

describe('Ashtakoota Gun Milan Engine', () => {
  it('calculates perfect/high compatibility for matching pairs', () => {
    // Groom: Aries Moon (1), Ashwini (0, Deva, Horse, Adi)
    // Bride: Leo Moon (5), Magha (9, Rakshasa, Rat, Adi) -> Same Nadi
    // Test a known harmonious match: Aries Moon (Ashwini 0) & Gemini Moon (Punarvasu 6 - Deva, Cat, Adi)
    const result = calculateAshtakootaMilan(1, 0, 3, 6);
    expect(result.totalScore).toBeGreaterThan(15);
    expect(result.maxScore).toBe(36);
    expect(result.percentage).toBeGreaterThan(40);
    expect(result.kootas.varna).toBeDefined();
    expect(result.kootas.vashya).toBeDefined();
    expect(result.kootas.tara).toBeDefined();
    expect(result.kootas.yoni).toBeDefined();
    expect(result.kootas.grahaMaitri).toBeDefined();
    expect(result.kootas.gana).toBeDefined();
    expect(result.kootas.bhakoot).toBeDefined();
    expect(result.kootas.nadi).toBeDefined();
  });

  it('correctly flags Nadi Dosha when Nadis match without cancellation', () => {
    // Both Ashwini (Nakshatra 0 -> Adi) with same sign
    const result = calculateAshtakootaMilan(1, 0, 1, 0);
    expect(result.kootas.nadi.isDosha).toBe(true);
  });
});
