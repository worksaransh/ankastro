import { describe, it, expect } from "vitest";
import {
  reduceToSingleDigit,
  calculateLifePath,
  calculateDestiny,
  calculateSoulUrge,
  calculatePersonality,
} from "./numerology";

describe("reduceToSingleDigit — master number preservation", () => {
  it("preserves master numbers 11, 22, 33 when preserveMaster=true", () => {
    expect(reduceToSingleDigit(11)).toBe(11);
    expect(reduceToSingleDigit(22)).toBe(22);
    expect(reduceToSingleDigit(33)).toBe(33);
  });

  it("reduces masters when preserveMaster=false", () => {
    expect(reduceToSingleDigit(11, false)).toBe(2);
    expect(reduceToSingleDigit(22, false)).toBe(4);
    expect(reduceToSingleDigit(33, false)).toBe(6);
  });

  it("reduces multi-digit numbers that pass through a master to that master", () => {
    // 29 -> 2+9 = 11 (master, preserved)
    expect(reduceToSingleDigit(29)).toBe(11);
    // 38 -> 3+8 = 11
    expect(reduceToSingleDigit(38)).toBe(11);
    // 49 -> 4+9 = 13 -> 4
    expect(reduceToSingleDigit(49)).toBe(4);
  });

  it("returns single digits unchanged", () => {
    for (let i = 0; i <= 9; i++) {
      expect(reduceToSingleDigit(i)).toBe(i);
    }
  });
});

describe("calculateLifePath — DD/MM/YYYY known samples", () => {
  const cases: Array<[string, number]> = [
    ["02/07/1998", 9], // 0+2+0+7+1+9+9+8 = 36 -> 9
    ["11/11/1911", 7], // 1+1+1+1+1+9+1+1 = 16 -> 7
    ["29/02/2000", 6], // 2+9+0+2+2+0+0+0 = 15 -> 6
    ["25/12/1990", 11], // 2+5+1+2+1+9+9+0 = 29 -> 11 (master, preserved)
    ["01/01/2000", 4],
    ["15/08/1947", 8],
  ];

  it.each(cases)("LP(%s) = %i", (dob, expected) => {
    expect(calculateLifePath(dob)).toBe(expected);
  });
});

describe("Name-based numbers — Destiny / Soul Urge / Personality", () => {
  it("Rahul Verma → Destiny 11 (master), Soul 1, Personality 1", () => {
    expect(calculateDestiny("Rahul Verma")).toBe(11);
    expect(calculateSoulUrge("Rahul Verma")).toBe(1);
    expect(calculatePersonality("Rahul Verma")).toBe(1);
  });

  it("Albert Einstein → Destiny 9, Soul 7, Personality 11 (master)", () => {
    expect(calculateDestiny("Albert Einstein")).toBe(9);
    expect(calculateSoulUrge("Albert Einstein")).toBe(7);
    expect(calculatePersonality("Albert Einstein")).toBe(11);
  });

  it("John Lennon → Destiny 4, Soul 8, Personality 5", () => {
    expect(calculateDestiny("John Lennon")).toBe(4);
    expect(calculateSoulUrge("John Lennon")).toBe(8);
    expect(calculatePersonality("John Lennon")).toBe(5);
  });

  it("Steve Jobs → Destiny 9, Soul 7, Personality 11 (master)", () => {
    expect(calculateDestiny("Steve Jobs")).toBe(9);
    expect(calculateSoulUrge("Steve Jobs")).toBe(7);
    expect(calculatePersonality("Steve Jobs")).toBe(11);
  });

  it("Mahatma Gandhi → Destiny 1, Soul 4, Personality 6", () => {
    expect(calculateDestiny("Mahatma Gandhi")).toBe(1);
    expect(calculateSoulUrge("Mahatma Gandhi")).toBe(4);
    expect(calculatePersonality("Mahatma Gandhi")).toBe(6);
  });

  it("ignores spaces, punctuation, and casing", () => {
    expect(calculateDestiny("rahul-verma")).toBe(calculateDestiny("RAHUL VERMA"));
    expect(calculateDestiny("R.A.H.U.L V.E.R.M.A")).toBe(11);
  });
});

describe("Master-number sanity across calculators", () => {
  it("Life Path keeps master 11 (DOB 25/12/1990)", () => {
    expect(calculateLifePath("25/12/1990")).toBe(11);
  });

  it("Destiny keeps master when name reduces to 11/22/33", () => {
    // Rahul Verma reduces to 47 -> 11
    expect(calculateDestiny("Rahul Verma")).toBe(11);
  });
});
