// Name Correction Engine — Phase 4 (additive)
// Suggests spelling variants whose name-number becomes friendly with the
// person's Mulank/Bhagyank, using the same Pythagorean values as nameVibration.
import { reduceToSingleDigit } from "@/lib/numerology";
import { calculateNameVibration } from "@/lib/nameVibration";

const PYTH: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const FRIENDLY: Record<number, number[]> = {
  1: [1, 3, 5, 9], 2: [1, 2, 5, 7], 3: [1, 3, 5, 9], 4: [1, 5, 6, 7],
  5: [1, 3, 5, 6, 9], 6: [3, 5, 6, 8], 7: [1, 2, 4, 5], 8: [3, 5, 6, 8], 9: [1, 3, 5, 9],
};

// Common, natural-looking spelling tweaks Indians actually use.
const DOUBLING = ["a", "e", "i", "o", "n", "l", "t", "s", "r"];
const SILENT_ADD = ["h", "a", "e"]; // e.g. Rajan -> Rajann, Rajh, etc.

const clean = (s: string) => (s || "").toLowerCase().replace(/[^a-z]/g, "");

export interface NameSuggestion {
  spelling: string;
  root: number;
  improvement: number;     // 0-100 score vs original
  reason: { en: string; hi: string; hinglish: string };
}

export interface NameCorrectionResult {
  originalRoot: number;
  targetRoots: number[];
  alreadyGood: boolean;
  suggestions: NameSuggestion[];
}

const properCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const rootOf = (s: string) =>
  reduceToSingleDigit(clean(s).split("").reduce((sum, l) => sum + (PYTH[l] || 0), 0), true);

/**
 * Generate friendly spelling variants for a name given the person's Mulank.
 * Purely additive — does not change existing name logic.
 */
export const correctName = (name: string, mulank: number): NameCorrectionResult => {
  const base = calculateNameVibration(name);
  const targetRoots = FRIENDLY[mulank] || [1, 5, 9];
  const originalRoot = base.root;
  const alreadyGood = targetRoots.includes(originalRoot);

  const cleaned = clean(name);
  const seen = new Set<string>();
  const candidates: string[] = [];

  // 1. Double a letter at various positions
  for (const ch of DOUBLING) {
    const idx = cleaned.lastIndexOf(ch);
    if (idx >= 0) {
      const variant = cleaned.slice(0, idx + 1) + ch + cleaned.slice(idx + 1);
      candidates.push(variant);
    }
  }
  // 2. Append a soft letter
  for (const ch of SILENT_ADD) {
    candidates.push(cleaned + ch);
  }
  // 3. Add letter after first char (common stylistic change)
  for (const ch of ["a", "e", "h"]) {
    candidates.push(cleaned.slice(0, 1) + ch + cleaned.slice(1));
  }

  const suggestions: NameSuggestion[] = [];
  for (const c of candidates) {
    if (c === cleaned || seen.has(c)) continue;
    seen.add(c);
    const r = rootOf(c);
    if (targetRoots.includes(r)) {
      const improvement = r === targetRoots[0] ? 95 : 85;
      suggestions.push({
        spelling: properCase(c),
        root: r,
        improvement,
        reason: {
          en: `Spelling reduces to ${r}, which is friendly with your Mulank ${mulank} — supports luck and harmony.`,
          hi: `यह वर्तनी ${r} में घटती है, जो आपके मूलांक ${mulank} के अनुकूल है — भाग्य और सामंजस्य बढ़ाती है।`,
          hinglish: `Ye spelling ${r} mein reduce hoti hai, jo aapke Mulank ${mulank} ke friendly hai — luck aur harmony badhti hai.`,
        },
      });
    }
    if (suggestions.length >= 5) break;
  }

  return { originalRoot, targetRoots, alreadyGood, suggestions };
};
