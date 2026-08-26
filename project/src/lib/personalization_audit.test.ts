import { describe, it, expect } from 'vitest';
import { calculateVedicProfile } from './vedicNumerology';
import { calculateFullProfile } from './numerology';

interface Persona {
  name: string;
  dob: string; // DD/MM/YYYY
  profession: string;
  goals: string;
  expectedMulank: number;
  expectedBhagyank: number;
}

const personas: Persona[] = [
  { name: 'Aarav Patel', dob: '12/03/2005', profession: 'B.Tech Student', goals: 'Career clarity', expectedMulank: 3, expectedBhagyank: 4 },
  { name: 'Priya Sharma', dob: '24/08/1995', profession: 'Software Engineer', goals: 'Promotion', expectedMulank: 6, expectedBhagyank: 11 },
  { name: 'Rajeev Gupta', dob: '05/11/1980', profession: 'Retail Trader', goals: 'Business growth', expectedMulank: 5, expectedBhagyank: 7 },
  { name: 'Amit Verma', dob: '17/09/1988', profession: 'Project Manager', goals: 'Marital harmony', expectedMulank: 8, expectedBhagyank: 7 },
  { name: 'Neha Nair', dob: '30/01/1992', profession: 'HR Manager', goals: 'Self-discovery', expectedMulank: 3, expectedBhagyank: 7 },
  { name: 'Ramesh Iyer', dob: '21/06/1960', profession: 'Retired Banker', goals: 'Spiritual growth', expectedMulank: 3, expectedBhagyank: 7 },
  { name: 'Sunita Devi', dob: '14/05/1985', profession: 'Homemaker', goals: 'Family peace', expectedMulank: 5, expectedBhagyank: 33 },
  { name: 'Vikram Adani', dob: '09/02/1998', profession: 'Tech Founder', goals: 'Fundraising', expectedMulank: 9, expectedBhagyank: 11 },
  { name: 'Meera Bai', dob: '03/10/1975', profession: 'Yoga Teacher', goals: 'Inner peace', expectedMulank: 3, expectedBhagyank: 8 },
  { name: 'Sanjay Rao', dob: '18/12/1982', profession: 'Venture Capitalist', goals: 'Wealth legacy', expectedMulank: 9, expectedBhagyank: 5 }
];

describe('10-Persona Personalization Audit', () => {
  it('calculates expected Mulank and Bhagyank numbers correctly for all personas', () => {
    personas.forEach(p => {
      const fullProfile = calculateFullProfile(p.name, p.dob);
      const vedicProfile = calculateVedicProfile(p.dob, fullProfile.personalYear);
      
      expect(vedicProfile.mulank).toBe(p.expectedMulank);
      expect(vedicProfile.bhagyank).toBe(p.expectedBhagyank);
    });
  });

  it('proves that Mulank 3 users born on different days (3, 12, 21, 30) get distinct personalized titles and behaviors', () => {
    // Mulank 3 users:
    // Meera Bai (born on 3rd)
    // Aarav Patel (born on 12th)
    // Ramesh Iyer (born on 21st)
    // Neha Nair (born on 30th)
    
    const p3 = personas.find(p => p.name === 'Meera Bai')!;
    const p12 = personas.find(p => p.name === 'Aarav Patel')!;
    const p21 = personas.find(p => p.name === 'Ramesh Iyer')!;
    const p30 = personas.find(p => p.name === 'Neha Nair')!;

    const prof3 = calculateVedicProfile(p3.dob, 2026);
    const prof12 = calculateVedicProfile(p12.dob, 2026);
    const prof21 = calculateVedicProfile(p21.dob, 2026);
    const prof30 = calculateVedicProfile(p30.dob, 2026);

    // Verify day values are calculated differently
    expect(prof3.mulankMeaning.title).not.toEqual(prof12.mulankMeaning.title);
    expect(prof12.mulankMeaning.title).not.toEqual(prof21.mulankMeaning.title);
    expect(prof21.mulankMeaning.title).not.toEqual(prof30.mulankMeaning.title);

    expect(prof3.mulankMeaning.naturalBehavior).not.toEqual(prof12.mulankMeaning.naturalBehavior);
    expect(prof12.mulankMeaning.naturalBehavior).not.toEqual(prof21.mulankMeaning.naturalBehavior);
    expect(prof21.mulankMeaning.naturalBehavior).not.toEqual(prof30.mulankMeaning.naturalBehavior);

    console.log('Meera Bai (3):', prof3.mulankMeaning.title);
    console.log('Aarav Patel (12):', prof12.mulankMeaning.title);
    console.log('Ramesh Iyer (21):', prof21.mulankMeaning.title);
    console.log('Neha Nair (30):', prof30.mulankMeaning.title);
  });
});
