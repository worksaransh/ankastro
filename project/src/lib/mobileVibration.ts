// Mobile Number Vibration Analyzer
import { reduceToSingleDigit } from "@/lib/numerology";

export interface MobileValidationResult {
  valid: boolean;
  cleaned: string;
  error?: string;
  country?: string;
  digitCount: number;
}

/** Validates a mobile number with E.164-aware rules.
 *  Accepts +, spaces, dashes, parentheses — strips them for validation.
 *  Rules:
 *    – Digits only (after stripping): 7–15 digits (ITU-T E.164 max).
 *    – Indian mobile: exactly 10 digits and starts with 6/7/8/9.
 *    – International: up to 15 digits, must start with country code if prefixed with +.
 */
export function validateMobileNumber(raw: string): MobileValidationResult {
  const cleaned = (raw || "").replace(/\D/g, "");
  const digitCount = cleaned.length;

  if (!digitCount) {
    return { valid: false, cleaned, error: "Enter a mobile number.", digitCount: 0 };
  }

  // E.164 max length check
  if (digitCount < 7) {
    return { valid: false, cleaned, error: "Too short. Minimum 7 digits.", digitCount };
  }
  if (digitCount > 15) {
    return { valid: false, cleaned, error: "Too long. Maximum 15 digits (E.164).", digitCount };
  }

  // Indian domestic mobile
  if (digitCount === 10) {
    const first = cleaned[0];
    if (!["6", "7", "8", "9"].includes(first)) {
      return { valid: false, cleaned, error: "Indian mobile numbers must start with 6, 7, 8, or 9.", digitCount };
    }
    return { valid: true, cleaned, country: "IN", digitCount };
  }

  // International with + prefix in raw input => expect at least country code + number
  const hasPlus = raw.trim().startsWith("+");
  if (hasPlus && digitCount < 8) {
    return { valid: false, cleaned, error: "International number seems incomplete after country code.", digitCount };
  }

  // General international / other numbers
  if (digitCount >= 7 && digitCount <= 15) {
    return { valid: true, cleaned, country: "INTL", digitCount };
  }

  return { valid: false, cleaned, error: "Invalid mobile number format.", digitCount };
}

export interface MobileVibration {
  input: string;
  cleaned: string;
  digitSum: number;
  compound: number;
  root: number;
  last4Root: number;
  missingDigits: number[];
  repeatedDigits: { digit: number; count: number }[];
}

const cleanNum = (n: string) => (n || "").replace(/\D/g, "");

export const calculateMobileVibration = (number: string): MobileVibration => {
  const cleaned = cleanNum(number);
  const digits = cleaned.split("").map(Number);
  const digitSum = digits.reduce((s, d) => s + d, 0);
  const last4 = cleaned.slice(-4).split("").map(Number);
  const last4Sum = last4.reduce((s, d) => s + d, 0);
  const present = new Set(digits);
  const missing: number[] = [];
  for (let i = 0; i <= 9; i++) if (!present.has(i)) missing.push(i);
  const counts: Record<number, number> = {};
  digits.forEach((d) => (counts[d] = (counts[d] || 0) + 1));
  const repeated = Object.entries(counts)
    .filter(([, c]) => c >= 3)
    .map(([d, c]) => ({ digit: Number(d), count: c }))
    .sort((a, b) => b.count - a.count);

  return {
    input: number,
    cleaned,
    digitSum,
    compound: digitSum,
    root: reduceToSingleDigit(digitSum, false),
    last4Root: reduceToSingleDigit(last4Sum, false),
    missingDigits: missing,
    repeatedDigits: repeated,
  };
};

const FRIENDLY: Record<number, number[]> = {
  1: [1, 3, 5, 9],
  2: [1, 2, 5, 7],
  3: [1, 3, 5, 9],
  4: [1, 5, 6, 7],
  5: [1, 3, 5, 6, 9],
  6: [3, 5, 6, 8],
  7: [1, 2, 4, 5],
  8: [3, 5, 6, 8],
  9: [1, 3, 5, 9],
};

export interface MobileCompatibility {
  vibration: MobileVibration;
  vsMulank: "friendly" | "neutral" | "enemy";
  vsBhagyank: "friendly" | "neutral" | "enemy";
  score: number;
  verdict: string;
  alternativeEndings: { ending: string; root: number; reason: string }[];
}

const verdict = (a: number, b: number) => {
  if (FRIENDLY[a]?.includes(b)) return "friendly" as const;
  if (a === b) return "friendly" as const;
  return "neutral" as const;
};

export const analyzeMobileCompatibility = (
  number: string,
  mulank: number,
  bhagyank: number,
): MobileCompatibility => {
  const vibration = calculateMobileVibration(number);
  const root = vibration.root;
  const vsMulank = verdict(root, mulank);
  const vsBhagyank = verdict(root, bhagyank);
  const score = Math.round(
    ((vsMulank === "friendly" ? 100 : 60) + (vsBhagyank === "friendly" ? 100 : 60)) / 2,
  );

  // Generate 3 alternative last-2-digit endings hitting a friendly root
  const targets = FRIENDLY[mulank] || [1, 5, 9];
  const base = vibration.cleaned.slice(0, -2);
  const baseSum = base.split("").reduce((s, d) => s + Number(d), 0);
  const alternatives: MobileCompatibility["alternativeEndings"] = [];
  for (let a = 0; a <= 9 && alternatives.length < 3; a++) {
    for (let b = 0; b <= 9 && alternatives.length < 3; b++) {
      const newRoot = reduceToSingleDigit(baseSum + a + b, false);
      if (targets.includes(newRoot)) {
        const ending = `${a}${b}`;
        if (!alternatives.find((x) => x.ending === ending)) {
          alternatives.push({
            ending,
            root: newRoot,
            reason: `Ending …${ending} → friendly root ${newRoot}`,
          });
        }
      }
    }
  }

  const verdictText =
    score >= 80
      ? "This number supports your core energy."
      : score >= 60
      ? "This number is workable — neutral overall."
      : "This number may add friction; consider alternatives.";

  return { vibration, vsMulank, vsBhagyank, score, verdict: verdictText, alternativeEndings: alternatives };
};
