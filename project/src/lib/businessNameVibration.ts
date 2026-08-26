// Business / Brand Name Vibration Analyzer
import { calculateNameVibration, VibrationResult } from "@/lib/nameVibration";
import { reduceToSingleDigit, calculateLifePath } from "@/lib/numerology";

export type Industry = "tech" | "finance" | "wellness" | "creative" | "retail" | "education" | "food";

// Best brand roots per industry (curated)
const INDUSTRY_FIT: Record<Industry, number[]> = {
  tech: [1, 5, 8],
  finance: [4, 6, 8],
  wellness: [2, 6, 7, 9],
  creative: [3, 5, 6, 9],
  retail: [3, 6, 8],
  education: [3, 7, 9],
  food: [2, 6, 8],
};

const ARCHETYPE: Record<number, { en: string; tagline: string }> = {
  1: { en: "Pioneer", tagline: "Bold, original, market-maker." },
  2: { en: "Diplomat", tagline: "Trust-building, partnership-driven." },
  3: { en: "Creator", tagline: "Expressive, joyful, communication-led." },
  4: { en: "Builder", tagline: "Stable, systematic, dependable." },
  5: { en: "Connector", tagline: "Fast-moving, versatile, viral." },
  6: { en: "Nurturer", tagline: "Warm, family-feel, service-rich." },
  7: { en: "Sage", tagline: "Specialist, research-led, premium." },
  8: { en: "Powerhouse", tagline: "Authority, scale, wealth magnet." },
  9: { en: "Humanitarian", tagline: "Purpose-driven, broad appeal." },
};

export interface BusinessVibrationResult {
  brand: VibrationResult;
  archetype: { number: number; name: string; tagline: string };
  industryFit?: { industry: Industry; isFit: boolean; recommendedRoots: number[] };
  founderAlignment?: { lifePath: number; verdict: "aligned" | "neutral" | "mismatch" };
}

export const calculateBusinessVibration = (
  brandName: string,
  founderDob?: string,
  industry?: Industry,
): BusinessVibrationResult => {
  const brand = calculateNameVibration(brandName);
  const archetypeBase = reduceToSingleDigit(brand.root, false);
  const a = ARCHETYPE[archetypeBase] || ARCHETYPE[1];
  const result: BusinessVibrationResult = {
    brand,
    archetype: { number: archetypeBase, name: a.en, tagline: a.tagline },
  };
  if (industry) {
    const fits = INDUSTRY_FIT[industry];
    result.industryFit = {
      industry,
      isFit: fits.includes(archetypeBase),
      recommendedRoots: fits,
    };
  }
  if (founderDob) {
    let normalizedDob = founderDob;
    if (founderDob.includes('-')) {
      const parts = founderDob.split('-');
      if (parts[0].length === 4) {
        normalizedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        normalizedDob = `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
    }
    const lp = calculateLifePath(normalizedDob);
    const lpRed = reduceToSingleDigit(lp, false);
    result.founderAlignment = {
      lifePath: lp,
      verdict:
        archetypeBase === lpRed
          ? "aligned"
          : [1, 3, 5, 9].includes(Math.abs(archetypeBase - lpRed))
          ? "neutral"
          : "neutral",
    };
  }
  return result;
};

export const suggestBrandTweaks = (
  brandName: string,
  targetRoot: number,
): { name: string; root: number; change: string }[] => {
  const base = (brandName || "").toLowerCase().replace(/[^a-z]/g, "");
  const out: { name: string; root: number; change: string }[] = [];
  const vowels = ["a", "e", "i", "o", "u"];

  // Try appending a vowel
  for (const v of vowels) {
    if (out.length >= 3) break;
    const cand = base + v;
    const r = calculateNameVibration(cand).root;
    if (reduceToSingleDigit(r, false) === targetRoot) {
      out.push({
        name: cand.charAt(0).toUpperCase() + cand.slice(1),
        root: r,
        change: `Add '${v}'`,
      });
    }
  }
  // Try doubling last letter
  if (out.length < 3 && base.length > 0) {
    const cand = base + base[base.length - 1];
    const r = calculateNameVibration(cand).root;
    if (reduceToSingleDigit(r, false) === targetRoot) {
      out.push({
        name: cand.charAt(0).toUpperCase() + cand.slice(1),
        root: r,
        change: `Double last letter`,
      });
    }
  }
  // Try inserting 'y' before last letter
  if (out.length < 3 && base.length > 1) {
    const cand = base.slice(0, -1) + "y" + base.slice(-1);
    const r = calculateNameVibration(cand).root;
    if (reduceToSingleDigit(r, false) === targetRoot) {
      out.push({
        name: cand.charAt(0).toUpperCase() + cand.slice(1),
        root: r,
        change: `Insert 'y'`,
      });
    }
  }
  return out;
};
