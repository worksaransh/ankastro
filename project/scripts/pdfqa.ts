// PDF QA harness — generates the advanced PDF in node and writes to disk.
import { writeFileSync } from 'node:fs';
import jsPDF from 'jspdf';

// Monkey-patch save BEFORE importing the generator
(jsPDF.prototype as any).save = function (filename: string) {
  const buf = Buffer.from(this.output('arraybuffer'));
  const out = `/tmp/pdfqa-out.pdf`;
  writeFileSync(out, buf);
  console.log(`[pdfqa] wrote ${out} (${buf.length} bytes, pages=${this.internal.getNumberOfPages()})`);
};

// Stub localStorage / window for libs that touch them
(globalThis as any).localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const { generateAdvancedPDF } = await import('@/lib/advancedPdfGenerator');
const { calculateFullProfile } = await import('@/lib/numerology');
const { calculateVedicProfile } = await import('@/lib/vedicNumerology');
const { getPersonalityCombination } = await import('@/lib/personalityLibrary');
const { calculateLifePillars } = await import('@/lib/lifePillars');
const {
  calculateLoshuGrid,
  calculatePinnacleCycles,
  calculateChallengeCycles,
  calculateKarmicDebts,
  calculateElementalBalance,
} = await import('@/lib/advancedNumerology');

const formData: any = {
  fullBirthName: 'Aarav Kumar Sharma',
  currentName: 'Aarav Sharma',
  dateOfBirth: '1990-03-15',
  birthTime: '14:30',
  gender: 'male',
  country: 'India',
  city: 'Mumbai',
  email: 'test@example.com',
  whatsapp: '+919999999999',
  relationshipStatus: 'married',
  profession: 'Software Engineer',
  lifeFocus: ['career', 'money', 'growth'],
  biggestChallenge: 'Career stagnation despite hard work over the last 3 years.',
  mainGoal: 'Start my own SaaS business and reach 50L ARR.',
  fearOrStuck: 'Fear of leaving stable job for entrepreneurship.',
  confusedBetween: 'Job security vs starting business now.',
  destinyCallingYou: 'Building products that help millions.',
  repeatingPattern: 'Self-doubt right when opportunity arrives.',
  miracleWish: 'Financial freedom and time with family.',
  includeCompatibility: true,
  partnerName: 'Priya Sharma',
  partnerDob: '1992-07-22',
  businessPartnerName: 'Rohit Verma',
  businessPartnerDob: '1988-11-05',
};

const profile = calculateFullProfile(formData.fullBirthName, formData.dateOfBirth);
const vedic = calculateVedicProfile(formData.dateOfBirth, profile.personalYear);
const combo = getPersonalityCombination(profile.lifePath, profile.destiny, profile.soulUrge, profile.personality);
const pillars = calculateLifePillars(vedic, { lifePath: profile.lifePath, destiny: profile.destiny, personalYear: profile.personalYear }, { name: formData.partnerName, dob: formData.partnerDob });
const loshu = calculateLoshuGrid(formData.dateOfBirth, formData.fullBirthName);
const pinn = calculatePinnacleCycles(formData.dateOfBirth);
const chall = calculateChallengeCycles(formData.dateOfBirth);
const karmic = calculateKarmicDebts(formData.dateOfBirth, formData.fullBirthName);
const elem = calculateElementalBalance(formData.dateOfBirth);

await generateAdvancedPDF(formData, profile, vedic, combo, 'visual', pillars, loshu, pinn, chall, karmic, elem);
console.log('[pdfqa] done');
