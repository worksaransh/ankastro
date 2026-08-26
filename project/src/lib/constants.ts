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
] as const;

export type IndividualReportType = (typeof INDIVIDUAL_REPORT_TYPES)[number];

/** Human-readable names for individual report types. */
export const REPORT_NAMES: Record<string, string> = {
  name_correction: 'Name Correction Report',
  mobile_numerology: 'Mobile Number Numerology',
  vehicle_numerology: 'Vehicle Number Report',
  career_numerology: 'Career & Job Prediction',
  baby_name: 'Lucky Baby Name Report',
  compatibility_report: 'Love & Marriage Compatibility',
  business_numerology: 'Business Numerology Report',
  property_numerology: 'Property & House Number Report',
  marriage_report: 'Marriage Timing & Matching Report',
  full_blueprint: 'Personal Numerology Blueprint',
};

/** Check if a report type is an individual (white-label) purchase. */
export const isIndividualReport = (reportType: string): boolean =>
  (INDIVIDUAL_REPORT_TYPES as readonly string[]).includes(reportType);
