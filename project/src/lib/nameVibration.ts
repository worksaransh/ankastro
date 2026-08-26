// Name Vibration Analyzer (Pythagorean + Chaldean)
// Phase 3 — additive; does not modify existing numerology.ts
import { reduceToSingleDigit, calculateLifePath } from "@/lib/numerology";
import { calculateMulank, calculateBhagyank } from "@/lib/vedicNumerology";

const PYTH: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

// Chaldean: 9 is sacred (never assigned to letters); 0 used for missing
const CHALD: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export interface VibrationResult {
  input: string;
  cleaned: string;
  pythagoreanTotal: number;
  chaldeanTotal: number;
  compound: number; // pythagorean compound (sum before reduce)
  root: number; // reduced pythagorean
  chaldeanRoot: number;
  vowelTotal: number;
  consonantTotal: number;
  isMaster: boolean;
}

const clean = (s: string) => (s || "").toLowerCase().replace(/[^a-z]/g, "");

export const calculateNameVibration = (name: string): VibrationResult => {
  const cleaned = clean(name);
  const letters = cleaned.split("");
  const pythTotal = letters.reduce((s, l) => s + (PYTH[l] || 0), 0);
  const chaldTotal = letters.reduce((s, l) => s + (CHALD[l] || 0), 0);
  const vowelTotal = letters.filter((l) => VOWELS.has(l)).reduce((s, l) => s + (PYTH[l] || 0), 0);
  const consonantTotal = pythTotal - vowelTotal;
  const root = reduceToSingleDigit(pythTotal, true);
  const chaldeanRoot = reduceToSingleDigit(chaldTotal, true);
  return {
    input: name,
    cleaned,
    pythagoreanTotal: pythTotal,
    chaldeanTotal: chaldTotal,
    compound: pythTotal,
    root,
    chaldeanRoot,
    vowelTotal: reduceToSingleDigit(vowelTotal, true),
    consonantTotal: reduceToSingleDigit(consonantTotal, true),
    isMaster: [11, 22, 33].includes(root),
  };
};

// Friendly/enemy chart (compact Vedic mapping)
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

const ENEMY: Record<number, number[]> = {
  1: [2, 8],
  2: [4, 8, 9],
  3: [2, 4, 6, 7],
  4: [2, 3, 8, 9],
  5: [],
  6: [1, 2, 7, 9],
  7: [3, 6, 8, 9],
  8: [1, 2, 4, 7],
  9: [2, 4, 6, 7],
};

export type Verdict = "friendly" | "neutral" | "enemy";

const verdictBetween = (a: number, b: number): Verdict => {
  const aRed = reduceToSingleDigit(a, false);
  const bRed = reduceToSingleDigit(b, false);
  if (FRIENDLY[aRed]?.includes(bRed)) return "friendly";
  if (ENEMY[aRed]?.includes(bRed)) return "enemy";
  return "neutral";
};

export interface NameCompatibility {
  vibration: VibrationResult;
  mulank: number;
  bhagyank: number;
  lifePath: number;
  vsMulank: Verdict;
  vsBhagyank: Verdict;
  vsLifePath: Verdict;
  alignmentScore: number; // 0-100
  summary: string;
  suggestions: { name: string; root: number; reason: string }[];
}

const scoreFor = (v: Verdict) => (v === "friendly" ? 100 : v === "neutral" ? 60 : 25);

export const analyzeNameCompatibility = (
  name: string,
  dob: string,
): NameCompatibility => {
  const vibration = calculateNameVibration(name);
  const mulank = calculateMulank(dob);
  const bhagyank = calculateBhagyank(dob);
  const lifePath = calculateLifePath(dob);
  const vsMulank = verdictBetween(vibration.root, mulank);
  const vsBhagyank = verdictBetween(vibration.root, bhagyank);
  const vsLifePath = verdictBetween(vibration.root, lifePath);
  const alignmentScore = Math.round(
    (scoreFor(vsMulank) + scoreFor(vsBhagyank) + scoreFor(vsLifePath)) / 3,
  );

  const summary =
    alignmentScore >= 80
      ? "Your name vibration aligns beautifully with your core numbers."
      : alignmentScore >= 55
      ? "Your name vibration is workable, with room to amplify alignment."
      : "Your name vibration creates friction with your core numbers — small tweaks can help.";

  // Suggest spelling tweaks: try adding/removing a single vowel to land on a friendly root
  const targetRoots = FRIENDLY[reduceToSingleDigit(mulank, false)] || [1, 5];
  const suggestions: NameCompatibility["suggestions"] = [];
  const base = vibration.cleaned;
  const vowels = ["a", "e", "i", "o", "u"];
  for (const v of vowels) {
    if (suggestions.length >= 3) break;
    const candidate = base + v;
    const cand = calculateNameVibration(candidate);
    if (targetRoots.includes(cand.root) && cand.root !== vibration.root) {
      suggestions.push({
        name: candidate.charAt(0).toUpperCase() + candidate.slice(1),
        root: cand.root,
        reason: `Adds '${v}' — shifts to friendly root ${cand.root}.`,
      });
    }
  }
  if (suggestions.length < 3 && base.length > 2) {
    const trimmed = base.slice(0, -1);
    const cand = calculateNameVibration(trimmed);
    if (targetRoots.includes(cand.root)) {
      suggestions.push({
        name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
        root: cand.root,
        reason: `Drops last letter — lands on friendly root ${cand.root}.`,
      });
    }
  }

  return {
    vibration,
    mulank,
    bhagyank,
    lifePath,
    vsMulank,
    vsBhagyank,
    vsLifePath,
    alignmentScore,
    summary,
    suggestions,
  };
};
