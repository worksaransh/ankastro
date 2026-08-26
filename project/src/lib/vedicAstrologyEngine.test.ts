import { describe, it, expect } from 'vitest';
import {
  calculateVedicKundli,
  getGeoLocation,
  calculateJulianDay,
  calculateLahiriAyanamsha,
  getNakshatraFromDegree,
} from './vedicAstrologyEngine';

describe('VedicAstrologyEngine', () => {
  it('correctly resolves geographic coordinates for Indian cities', () => {
    const delhi = getGeoLocation('New Delhi');
    expect(delhi.latitude).toBeCloseTo(28.6139, 2);
    expect(delhi.longitude).toBeCloseTo(77.2090, 2);
    expect(delhi.timezone).toBe(5.5);

    const mumbai = getGeoLocation('mumbai');
    expect(mumbai.latitude).toBeCloseTo(19.0760, 2);
  });

  it('calculates Julian Day and Lahiri Ayanamsha accurately', () => {
    // 1 Jan 2000 12:00 UTC -> JD = 2451545.0
    const jd = calculateJulianDay(1, 1, 2000, 12.0);
    expect(jd).toBe(2451545.0);

    const ayanamsha = calculateLahiriAyanamsha(jd);
    expect(ayanamsha).toBeCloseTo(23.85, 1);
  });

  it('accurately computes 27 Nakshatras and Padas', () => {
    // 0 deg -> Ashwini Pada 1
    const n1 = getNakshatraFromDegree(0.0);
    expect(n1.name).toBe('Ashwini');
    expect(n1.number).toBe(1);
    expect(n1.pada).toBe(1);

    // 15 deg -> Bharani Pada 1 (13°20' to 26°40')
    const n2 = getNakshatraFromDegree(15.0);
    expect(n2.name).toBe('Bharani');
    expect(n2.number).toBe(2);

    // 359 deg -> Revati Pada 4 (last pada)
    const nRevati = getNakshatraFromDegree(359.0);
    expect(nRevati.name).toBe('Revati');
    expect(nRevati.number).toBe(27);
    expect(nRevati.pada).toBe(4);
  });

  it('generates a complete authentic Vedic Kundli for a user DOB', () => {
    const kundli = calculateVedicKundli('15/08/1995', '14:30', 'New Delhi');
    
    expect(kundli).toBeDefined();
    expect(kundli.lagna.sign).toBeDefined();
    expect(kundli.lagna.degreeFormatted).toMatch(/\d+°\s\d+'/);
    expect(kundli.planets.length).toBe(9);
    expect(kundli.houses.length).toBe(12);
    expect(kundli.currentDasha.mahadasha).toBeDefined();
    expect(kundli.currentDasha.antardasha).toBeDefined();
    expect(kundli.currentDasha.timeline.length).toBe(9);
  });

  it('handles unknown birth time gracefully with Surya Lagna fallback', () => {
    const kundliUnknown = calculateVedicKundli('15/08/1995', undefined, 'New Delhi', true);
    expect(kundliUnknown.lagna.isTimeEstimated).toBe(true);
    expect(kundliUnknown.lagna.sign).toBe(kundliUnknown.sunSignVedic.sign);
  });
});
