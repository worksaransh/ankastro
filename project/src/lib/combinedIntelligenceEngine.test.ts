import { describe, it, expect } from 'vitest';
import { generateCombinedReport, LIFE_TOPICS_METADATA } from './combinedIntelligenceEngine';

describe('CombinedIntelligenceEngine', () => {
  it('has valid metadata for all core life topics', () => {
    expect(LIFE_TOPICS_METADATA.length).toBeGreaterThanOrEqual(6);
    const career = LIFE_TOPICS_METADATA.find(t => t.id === 'career');
    expect(career).toBeDefined();
    expect(career?.title.en).toBe('Career & Purpose');
  });

  it('generates combined 3-level insights for selected topic', () => {
    const report = generateCombinedReport(
      'Aarav Sharma',
      '15/08/1995',
      '14:30',
      'New Delhi',
      ['career', 'marriage']
    );

    expect(report.fullName).toBe('Aarav Sharma');
    expect(report.vedicKundli).toBeDefined();
    expect(report.numerologyProfile.mulank).toBe(6); // 15 -> 1+5 = 6
    expect(report.insights.length).toBe(2);

    const careerInsight = report.insights.find(i => i.topic === 'career');
    expect(careerInsight).toBeDefined();
    
    // Level 1: Simple Guidance
    expect(careerInsight?.level1Simple.directAnswer.en).toBeDefined();
    expect(careerInsight?.level1Simple.actionSteps.en.length).toBeGreaterThan(0);

    // Level 2: Synergy & Divergence
    expect(careerInsight?.level2Explanation.synergies.length).toBeGreaterThan(0);

    // Level 3: Technical Data
    expect(careerInsight?.level3Technical.vedicKundli.lagna.sign).toBeDefined();
    expect(careerInsight?.level3Technical.numerologyFacts.mulank).toBe(6);
  });
});
