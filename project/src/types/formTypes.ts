export interface UserFormData {
  // Report context (Phase 5: multi-report)
  relation?: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'friend' | 'business' | 'other';
  displayName?: string;

  // Personal Information
  fullBirthName: string;
  currentName: string;
  dateOfBirth: string;
  birthTime?: string; // HH:MM AM/PM format - required for astrology
  birthCity?: string; // Birth city for astrology calculations
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  country: string;
  city: string;
  email: string;
  whatsappNumber?: string;

  // Personal Context
  relationshipStatus?: 'single' | 'married' | 'complicated' | '';
  profession?: string;

  // Goals & Guidance
  biggestChallenge?: string;
  mainGoal?: string;
  fearOrStuck?: string;
  confusedBetween?: string;
  destinyCallingYou?: string;
  repeatingPattern?: string;
  miracleWish?: string;

  // Compatibility
  includeCompatibility: boolean;
  partnerName?: string;
  partnerDob?: string;
  partnerBirthTime?: string; // Partner birth time for astrology
  businessPartnerName?: string;
  businessPartnerDob?: string;
}

export const defaultFormData: UserFormData = {
  relation: 'self',
  displayName: '',
  fullBirthName: '',
  currentName: '',
  dateOfBirth: '',
  birthTime: '',
  birthCity: '',
  gender: 'prefer_not_to_say',
  country: '',
  city: '',
  email: '',
  whatsappNumber: '',
  relationshipStatus: '',
  profession: '',
  biggestChallenge: '',
  mainGoal: '',
  fearOrStuck: '',
  confusedBetween: '',
  destinyCallingYou: '',
  repeatingPattern: '',
  miracleWish: '',
  includeCompatibility: false,
  partnerName: '',
  partnerDob: '',
  partnerBirthTime: '',
  businessPartnerName: '',
  businessPartnerDob: '',
};