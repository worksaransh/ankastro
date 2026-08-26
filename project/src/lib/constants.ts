/**
 * Shared constants used across Dashboard, Reports, and other pages.
 * Extracted to avoid duplication and ensure consistency.
 */

/** Report types that are purchased as individual white-label reports (not tier-based). */
export const INDIVIDUAL_REPORT_TYPES = [
  'name_correction',
  'mobile_numerology',
  'vehicle_numerology',
  'career_numerology',
  'baby_name',
  'compatibility_report',
  'business_numerology',
  'property_numerology',
  'marriage_report',
  'shani_sade_sati',
  'pitra_dosh_karmic',
  'wealth_yogas_kundli',
  'health_vitality_kundli',
  'foreign_settlement_travel',
  'mangal_dosha_analysis',
] as const;

export type IndividualReportType = (typeof INDIVIDUAL_REPORT_TYPES)[number];

/** Human-readable names for individual report types. */
export const REPORT_NAMES: Record<string, string> = {
  name_correction: 'Name Correction Report',
  mobile_numerology: 'Mobile Number Numerology',
  vehicle_numerology: 'Vehicle Number Report',
  career_numerology: 'Career & 10th House Karma Report',
  baby_name: 'Lucky Baby Name Selection Report',
  compatibility_report: 'Love & Relationship Compatibility',
  business_numerology: 'Business & Brand Numerology Report',
  property_numerology: 'Property & House Number Report',
  marriage_report: 'Marriage Timing & 36-Gun Milan Report',
  shani_sade_sati: 'Shani Sade Sati & Dhaiya Remedial Blueprint',
  pitra_dosh_karmic: 'Pitra Dosh & Ancestral Karma Report',
  wealth_yogas_kundli: 'Dhana Yogas & Laxmi Prapti Blueprint',
  health_vitality_kundli: 'Medical Astrology & Vitality Blueprint',
  foreign_settlement_travel: 'Foreign Settlement & PR Immigration Report',
  mangal_dosha_analysis: 'Complete Manglik Dosha & Remedies Report',
  full_blueprint: 'Personal Numerology & Kundli Blueprint',
};

/** Check if a report type is an individual (white-label) purchase. */
export const isIndividualReport = (reportType: string): boolean =>
  (INDIVIDUAL_REPORT_TYPES as readonly string[]).includes(reportType);
