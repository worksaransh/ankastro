import { describe, test, expect } from 'vitest';
import { getPersonalizedRecommendations } from './recommendations';

describe('Recommendations Engine Tests', () => {
  test('returns Plus membership upsell when activePlus is false', () => {
    const profile = { dob: '1995-05-15', goals: { primary: 'career_growth' } };
    const numerology = { lifePath: 8, destiny: 8, personalYear: 5 };
    const purchased: string[] = [];

    const recs = getPersonalizedRecommendations(profile, numerology, purchased, false);
    
    // Should have plus_membership
    const plus = recs.find(r => r.key === 'plus_membership');
    expect(plus).toBeDefined();
    expect(plus?.score).toBe(0.95);
  });

  test('does not return Plus membership upsell when activePlus is true', () => {
    const profile = { dob: '1995-05-15' };
    const numerology = { lifePath: 8, destiny: 8 };
    const purchased: string[] = [];

    const recs = getPersonalizedRecommendations(profile, numerology, purchased, true);
    
    const plus = recs.find(r => r.key === 'plus_membership');
    expect(plus).toBeUndefined();
  });

  test('targets Business Advisor when user is business owner or has business goal', () => {
    const profile = { dob: '1995-05-15', is_business_owner: true };
    const numerology = { lifePath: 8, destiny: 3 };
    const purchased: string[] = [];

    const recs = getPersonalizedRecommendations(profile, numerology, purchased, true);
    
    const biz = recs.find(r => r.key === 'business_numerology');
    expect(biz).toBeDefined();
    expect(biz?.score).toBe(0.9);
  });

  test('recommends Career Prediction with higher score when goal is career growth', () => {
    const profile = { dob: '1995-05-15', goals: { primary: 'career_growth' } };
    const numerology = { lifePath: 4, destiny: 3 };
    const purchased: string[] = [];

    const recs = getPersonalizedRecommendations(profile, numerology, purchased, true);
    
    const career = recs.find(r => r.key === 'career_numerology');
    expect(career).toBeDefined();
    expect(career?.score).toBe(0.9);
  });
});
