import type { UserFormData } from '@/types/formTypes';

export type FieldErrors = Partial<Record<string, string>>;

type T = (key: string) => string;

const DOB_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s\-()]{6,19}$/;

/** Returns error key, or null if DOB is valid. */
export function validateDob(value: string, t: T): string | null {
  const v = (value || '').trim();
  if (!v) return t('validation.enterValidDob');
  const m = v.match(DOB_REGEX);
  if (!m) return t('validation.enterValidDob');
  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10);
  const year = parseInt(m[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return t('validation.dobInvalid');
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
    return t('validation.dobInvalid');
  }
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (d.getTime() > today.getTime()) return t('validation.dobFuture');
  if (year < 1900) return t('validation.dobTooOld');
  return null;
}

export function validateStep(step: number, data: UserFormData, t: T): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 1) {
    const name = (data.fullBirthName || '').trim();
    if (!name) errors.fullBirthName = t('validation.enterBirthName');
    else if (name.length < 2) errors.fullBirthName = t('validation.nameTooShort');
    else if (name.length > 100) errors.fullBirthName = t('validation.nameTooLong');

    const dobErr = validateDob(data.dateOfBirth, t);
    if (dobErr) errors.dateOfBirth = dobErr;

    if (!data.gender || data.gender === ('' as any)) {
      errors.gender = t('validation.selectGender');
    }

    const email = (data.email || '').trim();
    if (!email || !EMAIL_REGEX.test(email) || email.length > 255) {
      errors.email = t('validation.enterValidEmail');
    }

    const wa = (data.whatsappNumber || '').trim();
    if (wa && !PHONE_REGEX.test(wa)) {
      errors.whatsappNumber = t('validation.invalidWhatsapp');
    }
  }

  if (step === 4 && data.includeCompatibility) {
    const pName = (data.partnerName || '').trim();
    const pDob = (data.partnerDob || '').trim();
    const bName = (data.businessPartnerName || '').trim();
    const bDob = (data.businessPartnerDob || '').trim();

    // Romantic partner: if any field filled, both required + DOB valid
    if (pName || pDob) {
      if (!pName) errors.partnerName = t('validation.partnerNameRequired');
      const e = validateDob(pDob, t);
      if (e) errors.partnerDob = e;
    }
    // Business partner: same rule
    if (bName || bDob) {
      if (!bName) errors.businessPartnerName = t('validation.partnerNameRequired');
      const e = validateDob(bDob, t);
      if (e) errors.businessPartnerDob = e;
    }
  }

  return errors;
}
