// Daily Vedic Panchang & Muhurta Calculation Engine
// 100% Free, Open-Source & Native TypeScript

export interface DailyPanchang {
  date: string;
  dayOfWeek: string;
  dayLord: string;
  tithi: {
    number: number;
    name: string;
    paksha: 'Shukla (Waxing)' | 'Krishna (Waning)';
    percentageRemaining: number;
  };
  nakshatra: {
    index: number;
    name: string;
    pada: number;
    ruler: string;
  };
  yoga: {
    index: number;
    name: string;
    nature: 'Auspicious' | 'Moderate' | 'Inauspicious';
  };
  karana: {
    index: number;
    name: string;
  };
  sunTimes: {
    sunrise: string;
    sunset: string;
  };
  muhurtas: {
    abhijit: { start: string; end: string; isAuspicious: true };
    rahuKaal: { start: string; end: string; isAuspicious: false };
    gulikaKaal: { start: string; end: string; isAuspicious: false };
    yamaganda: { start: string; end: string; isAuspicious: false };
  };
  auspiciousSummary: string;
}

const TITHI_NAMES = [
  'Pratipada (1st)', 'Dwitiya (2nd)', 'Tritiya (3rd)', 'Chaturthi (4th)', 'Panchami (5th)',
  'Shashthi (6th)', 'Saptami (7th)', 'Ashtami (8th)', 'Navami (9th)', 'Dashami (10th)',
  'Ekadashi (11th)', 'Dwadashi (12th)', 'Trayodashi (13th)', 'Chaturdashi (14th)', 'Purnima / Amavasya (15th)',
];

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
  'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];

const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna',
];

const DAY_LORDS = ['Sun (Sunday)', 'Moon (Monday)', 'Mars (Tuesday)', 'Mercury (Wednesday)', 'Jupiter (Thursday)', 'Venus (Friday)', 'Saturn (Saturday)'];

// Rahu Kaal 1.5-hr segments (out of 8 segments between sunrise and sunset) for each day of week (0=Sunday ... 6=Saturday)
const RAHU_KAAL_SEGMENT = [8, 2, 7, 5, 6, 4, 3]; // 1-indexed segments
const YAMAGANDA_SEGMENT = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SEGMENT = [7, 6, 5, 4, 3, 2, 1];

/**
 * Calculates Vedic Panchang elements for a specific date and time.
 */
export function calculatePanchang(dateInput: Date = new Date(), latitude: number = 28.6139, longitude: number = 77.2090): DailyPanchang {
  const dayOfWeekIdx = dateInput.getDay();
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeekIdx];
  const dayLord = DAY_LORDS[dayOfWeekIdx];

  // Julian Day Calculation
  const year = dateInput.getFullYear();
  const month = dateInput.getMonth() + 1;
  const day = dateInput.getDate();
  const hour = dateInput.getHours() + dateInput.getMinutes() / 60;

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + (hour - 12) / 24;

  const d = jd - 2451545.0;

  // Approximate Sun longitude (Sidereal with Lahiri ~23.85 + precession)
  const ayanamsha = 23.85 + (year - 2000) * (50.29 / 3600);
  const sunMeanLong = (280.460 + 0.9856474 * d) % 360;
  const sunMeanAnomaly = (357.528 + 0.9856003 * d) * (Math.PI / 180);
  const sunEclipticLong = (sunMeanLong + 1.915 * Math.sin(sunMeanAnomaly) + 0.020 * Math.sin(2 * sunMeanAnomaly) + 360) % 360;
  const sunSidereal = (sunEclipticLong - ayanamsha + 360) % 360;

  // Approximate Moon longitude
  const moonMeanLong = (218.316 + 13.176396 * d) % 360;
  const moonMeanAnomaly = (134.963 + 13.064993 * d) * (Math.PI / 180);
  const moonEclipticLong = (moonMeanLong + 6.289 * Math.sin(moonMeanAnomaly) + 360) % 360;
  const moonSidereal = (moonEclipticLong - ayanamsha + 360) % 360;

  // Tithi: Angular distance between Moon and Sun / 12 degrees
  const angleDiff = (moonSidereal - sunSidereal + 360) % 360;
  const tithiIndex = Math.floor(angleDiff / 12); // 0-29
  const isShukla = tithiIndex < 15;
  const tithiNum = (tithiIndex % 15) + 1;
  const tithiName = `${isShukla ? 'Shukla' : 'Krishna'} ${TITHI_NAMES[tithiNum - 1]}`;

  // Nakshatra (Moon longitude / 13°20')
  const nakshatraIndex = Math.floor(moonSidereal / (360 / 27)); // 0-26
  const nakshatraPada = Math.floor((moonSidereal % (360 / 27)) / (360 / 108)) + 1; // 1-4
  const nakshatraName = NAKSHATRA_NAMES[nakshatraIndex] || 'Ashwini';
  const nakshatraLord = NAKSHATRA_LORDS[nakshatraIndex] || 'Ketu';

  // Yoga: (Sun Longitude + Moon Longitude) / 13°20'
  const yogaAngle = (sunSidereal + moonSidereal) % 360;
  const yogaIndex = Math.floor(yogaAngle / (360 / 27)); // 0-26
  const yogaName = YOGA_NAMES[yogaIndex] || 'Vishkambha';
  const inauspiciousYogas = [0, 5, 8, 9, 12, 14, 16, 18, 26]; // Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, Vaidhriti
  const yogaNature = inauspiciousYogas.includes(yogaIndex) ? 'Inauspicious' : 'Auspicious';

  // Karana: Half of Tithi (angleDiff / 6 degrees)
  const karanaIndex = Math.floor(angleDiff / 6) % 11; // 0-10
  const karanaName = KARANA_NAMES[karanaIndex] || 'Bava';

  // Standard Solar Sunrise/Sunset (~06:00 to 18:00 localized approximation)
  const sunriseMinutes = 6 * 60 + 15; // 06:15 AM
  const sunsetMinutes = 18 * 60 + 30; // 06:30 PM
  const daylightDuration = sunsetMinutes - sunriseMinutes;
  const segmentMinutes = daylightDuration / 8;

  const formatMinutes = (totalMin: number) => {
    const hrs = Math.floor(totalMin / 60);
    const mins = Math.floor(totalMin % 60);
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const dispHrs = hrs > 12 ? hrs - 12 : hrs === 0 ? 12 : hrs;
    return `${dispHrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  // Muhurtas
  const getSegmentTime = (segmentNum: number) => {
    const startMin = sunriseMinutes + (segmentNum - 1) * segmentMinutes;
    const endMin = startMin + segmentMinutes;
    return { start: formatMinutes(startMin), end: formatMinutes(endMin) };
  };

  const rahuTimes = getSegmentTime(RAHU_KAAL_SEGMENT[dayOfWeekIdx]);
  const yamaTimes = getSegmentTime(YAMAGANDA_SEGMENT[dayOfWeekIdx]);
  const gulikaTimes = getSegmentTime(GULIKA_SEGMENT[dayOfWeekIdx]);

  // Abhijit Muhurta is the 8th of 15 muhurtas around midday (midpoint of sunrise-sunset)
  const midday = sunriseMinutes + daylightDuration / 2;
  const abhijitTimes = {
    start: formatMinutes(midday - 24),
    end: formatMinutes(midday + 24),
    isAuspicious: true as const,
  };

  return {
    date: dateInput.toISOString().split('T')[0],
    dayOfWeek,
    dayLord,
    tithi: {
      number: tithiNum,
      name: tithiName,
      paksha: isShukla ? 'Shukla (Waxing)' : 'Krishna (Waning)',
      percentageRemaining: Math.round(((12 - (angleDiff % 12)) / 12) * 100),
    },
    nakshatra: {
      index: nakshatraIndex,
      name: nakshatraName,
      pada: nakshatraPada,
      ruler: nakshatraLord,
    },
    yoga: {
      index: yogaIndex,
      name: yogaName,
      nature: yogaNature,
    },
    karana: {
      index: karanaIndex,
      name: karanaName,
    },
    sunTimes: {
      sunrise: formatMinutes(sunriseMinutes),
      sunset: formatMinutes(sunsetMinutes),
    },
    muhurtas: {
      abhijit: abhijitTimes,
      rahuKaal: { ...rahuTimes, isAuspicious: false },
      gulikaKaal: { ...gulikaTimes, isAuspicious: false },
      yamaganda: { ...yamaTimes, isAuspicious: false },
    },
    auspiciousSummary: `Today is governed by ${dayLord}. ${tithiName} active in ${nakshatraName} Nakshatra. Auspicious window: Abhijit Muhurta (${abhijitTimes.start} - ${abhijitTimes.end}). Avoid initiating major financial or spiritual ventures during Rahu Kaal (${rahuTimes.start} - ${rahuTimes.end}).`,
  };
}
