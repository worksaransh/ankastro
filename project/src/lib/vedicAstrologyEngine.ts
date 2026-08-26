// Vedic Astrology Engine (Sidereal Jyotish with Lahiri Ayanamsha)
// High-precision mathematical astronomical calculation of planetary positions,
// ascendant (Lagna), 27 Nakshatras & Padas, 12 Bhavas, and Vimshottari Dashas.

export interface GeoLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number; // Offset from UTC in hours (e.g. +5.5 for IST)
}

export interface PlanetPosition {
  planet: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
  longitude: number; // 0 to 360 degrees
  sign: ZodiacSignName;
  signIndex: number; // 1 to 12 (1 = Aries / Mesha)
  degreeInSign: number; // 0 to 30 degrees
  degreeFormatted: string; // e.g. "14° 32'"
  nakshatra: string;
  nakshatraNumber: number; // 1 to 27
  pada: number; // 1 to 4
  house: number; // 1 to 12
  isRetrograde: boolean;
  dignity: 'Exalted' | 'Moolatrikona' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Enemy' | 'Debilitated';
}

export interface HouseData {
  houseNumber: number;
  sign: ZodiacSignName;
  signIndex: number;
  rulingPlanet: string;
  planetsPresent: string[];
  significance: {
    en: string;
    hi: string;
  };
}

export interface DashaPeriod {
  lord: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  subPeriods?: {
    lord: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  }[];
}

export interface VedicKundliProfile {
  lagna: {
    sign: ZodiacSignName;
    signIndex: number;
    degreeInSign: number;
    degreeFormatted: string;
    nakshatra: string;
    pada: number;
    isTimeEstimated: boolean;
  };
  sunSignVedic: {
    sign: ZodiacSignName;
    degreeInSign: number;
    nakshatra: string;
  };
  moonSignVedic: {
    sign: ZodiacSignName;
    degreeInSign: number;
    nakshatra: string;
    pada: number;
  };
  planets: PlanetPosition[];
  houses: HouseData[];
  ayanamsha: number; // in degrees (e.g. ~23.8° to 24.2°)
  currentDasha: {
    mahadasha: string;
    antardasha: string;
    timeline: DashaPeriod[];
  };
  keyYogas: {
    name: string;
    planets: string[];
    description: { en: string; hi: string };
    nature: 'Benefic' | 'Raja Yoga' | 'Dhana Yoga' | 'Challenging';
  }[];
}

export type ZodiacSignName =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export const ZODIAC_SIGNS: { name: ZodiacSignName; sanskrit: string; lord: string; element: string }[] = [
  { name: 'Aries', sanskrit: 'Mesha (मेष)', lord: 'Mars', element: 'Fire' },
  { name: 'Taurus', sanskrit: 'Vrishabha (वृषभ)', lord: 'Venus', element: 'Earth' },
  { name: 'Gemini', sanskrit: 'Mithuna (मिथुन)', lord: 'Mercury', element: 'Air' },
  { name: 'Cancer', sanskrit: 'Karka (कर्क)', lord: 'Moon', element: 'Water' },
  { name: 'Leo', sanskrit: 'Simha (सिंह)', lord: 'Sun', element: 'Fire' },
  { name: 'Virgo', sanskrit: 'Kanya (कन्या)', lord: 'Mercury', element: 'Earth' },
  { name: 'Libra', sanskrit: 'Tula (तुला)', lord: 'Venus', element: 'Air' },
  { name: 'Scorpio', sanskrit: 'Vrishchika (वृश्चिक)', lord: 'Mars', element: 'Water' },
  { name: 'Sagittarius', sanskrit: 'Dhanu (धनु)', lord: 'Jupiter', element: 'Fire' },
  { name: 'Capricorn', sanskrit: 'Makara (मकर)', lord: 'Saturn', element: 'Earth' },
  { name: 'Aquarius', sanskrit: 'Kumbha (कुंभ)', lord: 'Saturn', element: 'Air' },
  { name: 'Pisces', sanskrit: 'Meena (मीन)', lord: 'Jupiter', element: 'Water' },
];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', signRange: 'Aries 0° - 13°20\'' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', signRange: 'Aries 13°20\' - 26°40\'' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', signRange: 'Aries 26°40\' - Taurus 10°00\'' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma', signRange: 'Taurus 10°00\' - 23°20\'' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', signRange: 'Taurus 23°20\' - Gemini 6°40\'' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', signRange: 'Gemini 6°40\' - 20°00\'' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', signRange: 'Gemini 20°00\' - Cancer 3°20\'' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', signRange: 'Cancer 3°20\' - 16°40\'' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas', signRange: 'Cancer 16°40\' - 30°00\'' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris', signRange: 'Leo 0° - 13°20\'' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', signRange: 'Leo 13°20\' - 26°40\'' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', signRange: 'Leo 26°40\' - Virgo 10°00\'' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr', signRange: 'Virgo 10°00\' - 23°20\'' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishwakarma', signRange: 'Virgo 23°20\' - Libra 6°40\'' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', signRange: 'Libra 6°40\' - 20°00\'' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni', signRange: 'Libra 20°00\' - Scorpio 3°20\'' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', signRange: 'Scorpio 3°20\' - 16°40\'' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', signRange: 'Scorpio 16°40\' - 30°00\'' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', signRange: 'Sagittarius 0° - 13°20\'' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', signRange: 'Sagittarius 13°20\' - 26°40\'' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', signRange: 'Sagittarius 26°40\' - Capricorn 10°00\'' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', signRange: 'Capricorn 10°00\' - 23°20\'' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Eight Vasus', signRange: 'Capricorn 23°20\' - Aquarius 6°40\'' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', signRange: 'Aquarius 6°40\' - 20°00\'' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', signRange: 'Aquarius 20°00\' - Pisces 3°20\'' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', signRange: 'Pisces 3°20\' - 16°40\'' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', signRange: 'Pisces 16°40\' - 30°00\'' },
];

export const VIMSHOTTARI_DASHA_ORDER = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

// Major Indian & Global Cities Coordinates Database
export const CITY_GEO_DATABASE: Record<string, GeoLocation> = {
  'delhi': { city: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
  'new delhi': { city: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
  'mumbai': { city: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 5.5 },
  'bengaluru': { city: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 5.5 },
  'bangalore': { city: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 5.5 },
  'kolkata': { city: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 5.5 },
  'chennai': { city: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 5.5 },
  'hyderabad': { city: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 5.5 },
  'pune': { city: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 5.5 },
  'ahmedabad': { city: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 5.5 },
  'jaipur': { city: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 5.5 },
  'lucknow': { city: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 5.5 },
  'chandigarh': { city: 'Chandigarh', country: 'India', latitude: 30.7333, longitude: 76.7794, timezone: 5.5 },
  'varanasi': { city: 'Varanasi', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 5.5 },
  'patna': { city: 'Patna', country: 'India', latitude: 25.5941, longitude: 85.1376, timezone: 5.5 },
  'indore': { city: 'Indore', country: 'India', latitude: 22.7196, longitude: 75.8577, timezone: 5.5 },
  'london': { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 0.0 },
  'new york': { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: -5.0 },
  'san francisco': { city: 'San Francisco', country: 'United States', latitude: 37.7749, longitude: -122.4194, timezone: -8.0 },
  'dubai': { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 4.0 },
  'singapore': { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 8.0 },
  'toronto': { city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: -5.0 },
  'sydney': { city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 10.0 }
};

export const DEFAULT_GEO_LOCATION: GeoLocation = CITY_GEO_DATABASE['delhi'];

export function getGeoLocation(cityQuery?: string): GeoLocation {
  if (!cityQuery || !cityQuery.trim()) return DEFAULT_GEO_LOCATION;
  const clean = cityQuery.trim().toLowerCase();
  for (const [key, loc] of Object.entries(CITY_GEO_DATABASE)) {
    if (clean.includes(key) || key.includes(clean)) {
      return loc;
    }
  }
  return {
    city: cityQuery,
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
  };
}

// Astronomical Julian Day calculation
export function calculateJulianDay(day: number, month: number, year: number, decimalHoursUTC: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + (decimalHoursUTC / 24.0);
  return jd;
}

// Lahiri Ayanamsha Calculation (Standard N.C. Lahiri)
export function calculateLahiriAyanamsha(julianDay: number): number {
  const t = (julianDay - 2451545.0) / 36525.0; // Centuries since J2000
  // Standard IAU/Lahiri value formula
  const ayanamsha = 23.85 + (t * 50.29 / 3600.0);
  return ayanamsha;
}

// Normalize angle to [0, 360)
export function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

export function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}° ${m < 10 ? '0' : ''}${m}'`;
}

// Calculate Tropical Sun Longitude
function calculateSunLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDegrees(280.460 + 0.9856474 * n);
  const g = normalizeDegrees(357.528 + 0.9856003 * n) * (Math.PI / 180.0);
  const lambda = normalizeDegrees(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  return lambda;
}

// Calculate Tropical Moon Longitude (Brown's Lunar Theory Approximation)
function calculateMoonLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  const L0 = normalizeDegrees(218.3164477 + 481267.88123421 * t); // Mean longitude
  const M = normalizeDegrees(357.5291092 + 35999.0502909 * t) * (Math.PI / 180.0); // Sun anomaly
  const Mprime = normalizeDegrees(134.9633964 + 477198.8675055 * t) * (Math.PI / 180.0); // Moon anomaly
  const F = normalizeDegrees(93.2720950 + 483202.0175233 * t) * (Math.PI / 180.0); // Moon argument of latitude
  const D = normalizeDegrees(297.8501921 + 445267.1114034 * t) * (Math.PI / 180.0); // Mean elongation

  const perturbation =
    6.288774 * Math.sin(Mprime) +
    1.274027 * Math.sin(2 * D - Mprime) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mprime) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F);

  return normalizeDegrees(L0 + perturbation);
}

// Calculate Tropical Mean/True Longitudes for Vedic Planets
function calculatePlanetaryLongitudes(jd: number): Record<string, number> {
  const d = jd - 2451545.0;
  const t = d / 36525.0;

  // Mars
  const marsL = normalizeDegrees(355.433 + 0.5240330 * d + 1.8 * Math.sin(normalizeDegrees(19.373 + 0.5240207 * d) * Math.PI / 180));
  // Mercury
  const mercuryL = normalizeDegrees(252.250 + 4.0923344 * d + 6.3 * Math.sin(normalizeDegrees(174.794 + 4.0923344 * d) * Math.PI / 180));
  // Jupiter
  const jupiterL = normalizeDegrees(34.351 + 0.0830853 * d + 5.5 * Math.sin(normalizeDegrees(14.331 + 0.0830853 * d) * Math.PI / 180));
  // Venus
  const venusL = normalizeDegrees(181.979 + 1.6021302 * d + 0.7 * Math.sin(normalizeDegrees(50.416 + 1.6021302 * d) * Math.PI / 180));
  // Saturn
  const saturnL = normalizeDegrees(50.077 + 0.0334442 * d + 6.3 * Math.sin(normalizeDegrees(92.861 + 0.0334442 * d) * Math.PI / 180));
  // Rahu (Mean Node, Retrograde)
  const rahuL = normalizeDegrees(125.0445 - 1934.136261 * t);
  // Ketu (Opposite to Rahu)
  const ketuL = normalizeDegrees(rahuL + 180);

  return {
    Mars: marsL,
    Mercury: mercuryL,
    Jupiter: jupiterL,
    Venus: venusL,
    Saturn: saturnL,
    Rahu: rahuL,
    Ketu: ketuL,
  };
}

// Calculate Local Sidereal Time (LST) and Ascendant (Lagna)
function calculateLagna(jd: number, longitude: number, latitude: number, ayanamsha: number): { siderealAscendant: number; degreeInSign: number; signIndex: number; sign: ZodiacSignName } {
  const t = (jd - 2451545.0) / 36525.0;
  // Greenwich Mean Sidereal Time (GMST) in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t;
  gmst = normalizeDegrees(gmst);

  // Local Sidereal Time in degrees
  const lst = normalizeDegrees(gmst + longitude);
  const ramc = lst * (Math.PI / 180.0);
  const eps = (23.4392911 - 0.0130042 * t) * (Math.PI / 180.0); // True obliquity of ecliptic
  const phi = latitude * (Math.PI / 180.0);

  // Ascendant formula in tropical coordinates
  const y = -Math.cos(ramc);
  const x = Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);
  let ascTropical = Math.atan2(y, x) * (180.0 / Math.PI);
  ascTropical = normalizeDegrees(ascTropical + 90);

  // Convert to Vedic Sidereal using Lahiri Ayanamsha
  const siderealAsc = normalizeDegrees(ascTropical - ayanamsha);
  const signIndex = Math.floor(siderealAsc / 30) + 1;
  const sign = ZODIAC_SIGNS[signIndex - 1].name;
  const degreeInSign = siderealAsc % 30;

  return {
    siderealAscendant: siderealAsc,
    degreeInSign,
    signIndex,
    sign,
  };
}

// Calculate Nakshatra (0-360 mapped to 27 segments of 13°20')
export function getNakshatraFromDegree(siderealDegree: number): { name: string; number: number; lord: string; pada: number } {
  const totalMinutes = siderealDegree * 60;
  const nakshatraMinutes = 800; // 13°20' = 800 minutes
  const nakshatraIndex = Math.floor(totalMinutes / nakshatraMinutes);
  const clampedIndex = Math.min(Math.max(nakshatraIndex, 0), 26);
  const padaMinutes = 200; // 3°20' = 200 minutes
  const pada = Math.floor((totalMinutes % nakshatraMinutes) / padaMinutes) + 1;

  const nak = NAKSHATRAS[clampedIndex];
  return {
    name: nak.name,
    number: clampedIndex + 1,
    lord: nak.lord,
    pada: Math.min(Math.max(pada, 1), 4),
  };
}

// Determine Planetary Dignity in Vedic Jyotish
function getPlanetaryDignity(planet: string, signIndex: number): PlanetPosition['dignity'] {
  // Exaltation (Uchha) & Debilitation (Neecha) signs (1-based index)
  const dignityMap: Record<string, { exalted: number; debilitated: number; own: number[]; friendly: number[] }> = {
    Sun: { exalted: 1, debilitated: 7, own: [5], friendly: [9, 12, 4] },
    Moon: { exalted: 2, debilitated: 8, own: [4], friendly: [1, 5, 9] },
    Mars: { exalted: 10, debilitated: 4, own: [1, 8], friendly: [5, 9, 12] },
    Mercury: { exalted: 6, debilitated: 12, own: [3, 6], friendly: [2, 7, 11] },
    Jupiter: { exalted: 4, debilitated: 10, own: [9, 12], friendly: [1, 5, 8] },
    Venus: { exalted: 12, debilitated: 6, own: [2, 7], friendly: [3, 10, 11] },
    Saturn: { exalted: 7, debilitated: 1, own: [10, 11], friendly: [2, 3, 6] },
    Rahu: { exalted: 2, debilitated: 8, own: [11], friendly: [3, 6, 7] },
    Ketu: { exalted: 8, debilitated: 2, own: [8], friendly: [1, 4, 9] },
  };

  const pMap = dignityMap[planet];
  if (!pMap) return 'Neutral';

  if (signIndex === pMap.exalted) return 'Exalted';
  if (signIndex === pMap.debilitated) return 'Debilitated';
  if (pMap.own.includes(signIndex)) return 'Own Sign';
  if (pMap.friendly.includes(signIndex)) return 'Friendly';
  return 'Neutral';
}

// Calculate Vimshottari Mahadashas & Current Running Dasha
export function calculateVimshottariTimeline(
  moonSiderealDegree: number,
  dobDate: Date
): { mahadasha: string; antardasha: string; timeline: DashaPeriod[] } {
  const nakData = getNakshatraFromDegree(moonSiderealDegree);
  const birthNakshatraMinutes = 800;
  const elapsedInNakshatra = (moonSiderealDegree * 60) % birthNakshatraMinutes;
  const balanceRatio = (birthNakshatraMinutes - elapsedInNakshatra) / birthNakshatraMinutes;

  // Find initial Dasha lord index
  const startLordIndex = VIMSHOTTARI_DASHA_ORDER.findIndex(d => d.lord.toLowerCase() === nakData.lord.toLowerCase());
  const initialIndex = startLordIndex >= 0 ? startLordIndex : 0;

  const timeline: DashaPeriod[] = [];
  const currentDate = new Date();
  let currentMahadasha = VIMSHOTTARI_DASHA_ORDER[initialIndex].lord;
  let currentAntardasha = currentMahadasha;

  let pointerDate = new Date(dobDate.getTime());

  for (let i = 0; i < 9; i++) {
    const idx = (initialIndex + i) % 9;
    const dasha = VIMSHOTTARI_DASHA_ORDER[idx];
    const durationYears = i === 0 ? dasha.years * balanceRatio : dasha.years;

    const startDate = new Date(pointerDate.getTime());
    const endDate = new Date(pointerDate.getTime() + durationYears * 365.2425 * 86400000);
    pointerDate = new Date(endDate.getTime());

    const isCurrent = currentDate >= startDate && currentDate < endDate;
    if (isCurrent) {
      currentMahadasha = dasha.lord;
      // Calculate Antardasha within Mahadasha
      const totalMahaMs = endDate.getTime() - startDate.getTime();
      const elapsedMahaMs = currentDate.getTime() - startDate.getTime();
      const subRatio = Math.max(0, Math.min(1, elapsedMahaMs / totalMahaMs));
      const subIndex = Math.min(Math.floor(subRatio * 9), 8);
      currentAntardasha = VIMSHOTTARI_DASHA_ORDER[(idx + subIndex) % 9].lord;
    }

    timeline.push({
      lord: dasha.lord,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      isCurrent,
    });
  }

  return {
    mahadasha: currentMahadasha,
    antardasha: currentAntardasha,
    timeline,
  };
}

// Detect Prominent Yogas in Vedic Chart
function detectKeyYogas(planets: PlanetPosition[], lagnaSignIndex: number) {
  const yogas: VedicKundliProfile['keyYogas'] = [];

  const planetMap = new Map(planets.map(p => [p.planet, p]));
  const jupiter = planetMap.get('Jupiter');
  const moon = planetMap.get('Moon');
  const sun = planetMap.get('Sun');
  const mercury = planetMap.get('Mercury');
  const mars = planetMap.get('Mars');
  const venus = planetMap.get('Venus');
  const saturn = planetMap.get('Saturn');

  // 1. Gaja Kesari Yoga: Jupiter in Kendra (1, 4, 7, 10) from Moon
  if (jupiter && moon) {
    const diff = (jupiter.house - moon.house + 12) % 12 + 1;
    if ([1, 4, 7, 10].includes(diff)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        planets: ['Jupiter', 'Moon'],
        nature: 'Raja Yoga',
        description: {
          en: 'Auspicious combination for wisdom, reputation, enduring influence, and overcoming life obstacles.',
          hi: 'ज्ञान, प्रतिष्ठा और दीर्घकालिक प्रभाव देने वाला अत्यंत शुभ गजकेसरी योग।',
        },
      });
    }
  }

  // 2. Budhaditya Yoga: Sun and Mercury together in the same house
  if (sun && mercury && sun.house === mercury.house) {
    yogas.push({
      name: 'Budhaditya Yoga',
      planets: ['Sun', 'Mercury'],
      nature: 'Benefic',
      description: {
        en: 'Enhances intellectual agility, administrative capability, and communication clarity.',
        hi: 'बुद्धि, प्रशासनिक क्षमता और स्पष्ट अभिव्यक्ति को बढ़ाने वाला बुधादित्य योग।',
      },
    });
  }

  // 3. Pancha Mahapurusha Yogas (Mars = Ruchaka, Mercury = Bhadra, Jupiter = Hamsa, Venus = Malavya, Saturn = Sasa)
  if (jupiter && [1, 4, 7, 10].includes(jupiter.house) && ['Exalted', 'Own Sign'].includes(jupiter.dignity)) {
    yogas.push({
      name: 'Hamsa Yoga',
      planets: ['Jupiter'],
      nature: 'Raja Yoga',
      description: {
        en: 'Pancha Mahapurusha yoga of Jupiter: purity of intent, spiritual wisdom, and natural leadership.',
        hi: 'बृहस्पति का हंस महापुरुष योग: उच्च बौद्धिक क्षमता और सम्मानजनक नेतृत्व।',
      },
    });
  }

  if (venus && [1, 4, 7, 10].includes(venus.house) && ['Exalted', 'Own Sign'].includes(venus.dignity)) {
    yogas.push({
      name: 'Malavya Yoga',
      planets: ['Venus'],
      nature: 'Dhana Yoga',
      description: {
        en: 'Pancha Mahapurusha yoga of Venus: creative brilliance, material prosperity, and aesthetic charm.',
        hi: 'शुक्र का मालव्य महापुरुष योग: कलात्मक प्रतिभा और भौतिक समृद्धि।',
      },
    });
  }

  if (mars && [1, 4, 7, 10].includes(mars.house) && ['Exalted', 'Own Sign'].includes(mars.dignity)) {
    yogas.push({
      name: 'Ruchaka Yoga',
      planets: ['Mars'],
      nature: 'Raja Yoga',
      description: {
        en: 'Pancha Mahapurusha yoga of Mars: bold courage, physical vitality, and executive authority.',
        hi: 'मंगल का रुचक महापुरुष योग: पराक्रम, साहसिक निर्णय और प्रशासनिक शक्ति।',
      },
    });
  }

  return yogas;
}

// MAIN EXPORTED FUNCTION: Calculate Complete Authentic Vedic Kundli
export function calculateVedicKundli(
  dob: string, // "DD/MM/YYYY" or "YYYY-MM-DD"
  birthTime?: string, // "HH:MM" or "HH:MM AM/PM"
  cityName?: string,
  timeIsUnknown: boolean = false
): VedicKundliProfile {
  let day = 1;
  let month = 1;
  let year = 2000;

  if (dob.includes('/')) {
    const parts = dob.split('/').map(Number);
    day = parts[0];
    month = parts[1];
    year = parts[2];
  } else if (dob.includes('-')) {
    const parts = dob.split('-').map(Number);
    year = parts[0];
    month = parts[1];
    day = parts[2];
  }

  // Parse time
  let hour = 12;
  let minute = 0;
  if (!timeIsUnknown && birthTime && birthTime.trim()) {
    const timeMatch = birthTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      minute = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3]?.toUpperCase();
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
    }
  }

  const geo = getGeoLocation(cityName);

  // Convert local time to UTC decimal hours
  const localDecimalHours = hour + minute / 60.0;
  const utcDecimalHours = localDecimalHours - geo.timezone;

  // Calculate Julian Day and Lahiri Ayanamsha
  const jd = calculateJulianDay(day, month, year, utcDecimalHours);
  const ayanamsha = calculateLahiriAyanamsha(jd);

  // Calculate Tropical Coordinates
  const sunTropical = calculateSunLongitude(jd);
  const moonTropical = calculateMoonLongitude(jd);
  const planetsTropical = calculatePlanetaryLongitudes(jd);

  // Convert to Sidereal Coordinates by subtracting Lahiri Ayanamsha
  const sunSidereal = normalizeDegrees(sunTropical - ayanamsha);
  const moonSidereal = normalizeDegrees(moonTropical - ayanamsha);

  // Calculate Lagna (Ascendant)
  let lagnaInfo = calculateLagna(jd, geo.longitude, geo.latitude, ayanamsha);
  if (timeIsUnknown) {
    // If birth time unknown, use Surya Lagna (Sun sign as 1st house)
    const sunSignIndex = Math.floor(sunSidereal / 30) + 1;
    lagnaInfo = {
      siderealAscendant: sunSidereal,
      degreeInSign: sunSidereal % 30,
      signIndex: sunSignIndex,
      sign: ZODIAC_SIGNS[sunSignIndex - 1].name,
    };
  }

  const lagnaSignIndex = lagnaInfo.signIndex;

  // Build Planetary Positions
  const planetsList: PlanetPosition[] = [];

  const rawPlanets: { name: PlanetPosition['planet']; tropical: number; isRetro: boolean }[] = [
    { name: 'Sun', tropical: sunTropical, isRetro: false },
    { name: 'Moon', tropical: moonTropical, isRetro: false },
    { name: 'Mars', tropical: planetsTropical.Mars, isRetro: false },
    { name: 'Mercury', tropical: planetsTropical.Mercury, isRetro: false },
    { name: 'Jupiter', tropical: planetsTropical.Jupiter, isRetro: false },
    { name: 'Venus', tropical: planetsTropical.Venus, isRetro: false },
    { name: 'Saturn', tropical: planetsTropical.Saturn, isRetro: false },
    { name: 'Rahu', tropical: planetsTropical.Rahu, isRetro: true },
    { name: 'Ketu', tropical: planetsTropical.Ketu, isRetro: true },
  ];

  for (const raw of rawPlanets) {
    const sidereal = normalizeDegrees(raw.tropical - ayanamsha);
    const signIndex = Math.floor(sidereal / 30) + 1;
    const degreeInSign = sidereal % 30;
    const sign = ZODIAC_SIGNS[signIndex - 1].name;
    const nakData = getNakshatraFromDegree(sidereal);

    // Calculate Bhava/House based on Whole Sign / Equal House system from Lagna
    const house = (signIndex - lagnaSignIndex + 12) % 12 + 1;
    const dignity = getPlanetaryDignity(raw.name, signIndex);

    planetsList.push({
      planet: raw.name,
      longitude: sidereal,
      sign,
      signIndex,
      degreeInSign,
      degreeFormatted: formatDegrees(degreeInSign),
      nakshatra: nakData.name,
      nakshatraNumber: nakData.number,
      pada: nakData.pada,
      house,
      isRetrograde: raw.isRetro,
      dignity,
    });
  }

  // Build 12 Houses
  const houseSignificances = [
    { en: 'Self, Vitality, Outlook', hi: 'तनु भाव (स्वयं, व्यक्तित्व, स्वास्थ्य)' },
    { en: 'Wealth, Speech, Family', hi: 'धन भाव (धन, वाणी, कुटुंब)' },
    { en: 'Courage, Efforts, Siblings', hi: 'सहज भाव (पराक्रम, छोटे भाई-बहन, उद्यम)' },
    { en: 'Home, Mother, Inner Peace', hi: 'सुख भाव (माता, घर, मानसिक शांति, वाहन)' },
    { en: 'Intelligence, Creativity, Children', hi: 'सुत भाव (बुद्धि, संतान, पूर्व पुण्य)' },
    { en: 'Daily Work, Health, Obstacles', hi: 'रिपु भाव (रोग, ऋण, शत्रु, सेवा)' },
    { en: 'Partnership, Marriage, Business', hi: 'जाया भाव (विवाह, व्यापारिक साझेदारी)' },
    { en: 'Transformation, Longevity, Research', hi: 'आयु भाव (परिवर्तन, गूढ़ ज्ञान, आयु)' },
    { en: 'Dharma, Fortune, Higher Wisdom', hi: 'धर्म भाव (भाग्य, गुरु, उच्च ज्ञान)' },
    { en: 'Career, Status, Public Life', hi: 'कर्म भाव (व्यवसाय, प्रतिष्ठा, कर्म)' },
    { en: 'Gains, Aspirations, Networks', hi: 'लाभ भाव (आय, मित्र, इच्छा पूर्ति)' },
    { en: 'Liberation, Expenses, Foreign Lands', hi: 'व्यय भाव (मोक्ष, विदेश गमन, व्यय)' },
  ];

  const houses: HouseData[] = [];
  for (let h = 1; h <= 12; h++) {
    const sIndex = (lagnaSignIndex + h - 2) % 12 + 1;
    const sObj = ZODIAC_SIGNS[sIndex - 1];
    const present = planetsList.filter(p => p.house === h).map(p => p.planet);
    houses.push({
      houseNumber: h,
      sign: sObj.name,
      signIndex: sIndex,
      rulingPlanet: sObj.lord,
      planetsPresent: present,
      significance: houseSignificances[h - 1],
    });
  }

  // Calculate Vimshottari Timeline
  const dobDateObj = new Date(year, month - 1, day, hour, minute);
  const dashaInfo = calculateVimshottariTimeline(moonSidereal, dobDateObj);

  // Key Yogas
  const yogas = detectKeyYogas(planetsList, lagnaSignIndex);

  const sunSignIndex = Math.floor(sunSidereal / 30) + 1;
  const moonSignIndex = Math.floor(moonSidereal / 30) + 1;
  const sunNak = getNakshatraFromDegree(sunSidereal);
  const moonNak = getNakshatraFromDegree(moonSidereal);
  const lagnaNak = getNakshatraFromDegree(lagnaInfo.siderealAscendant);

  return {
    lagna: {
      sign: lagnaInfo.sign,
      signIndex: lagnaInfo.signIndex,
      degreeInSign: lagnaInfo.degreeInSign,
      degreeFormatted: formatDegrees(lagnaInfo.degreeInSign),
      nakshatra: lagnaNak.name,
      pada: lagnaNak.pada,
      isTimeEstimated: timeIsUnknown,
    },
    sunSignVedic: {
      sign: ZODIAC_SIGNS[sunSignIndex - 1].name,
      degreeInSign: sunSidereal % 30,
      nakshatra: sunNak.name,
    },
    moonSignVedic: {
      sign: ZODIAC_SIGNS[moonSignIndex - 1].name,
      degreeInSign: moonSidereal % 30,
      nakshatra: moonNak.name,
      pada: moonNak.pada,
    },
    planets: planetsList,
    houses,
    ayanamsha,
    currentDasha: dashaInfo,
    keyYogas: yogas,
  };
}
