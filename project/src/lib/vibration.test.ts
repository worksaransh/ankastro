import { describe, it, expect } from "vitest";
import { calculateNameVibration, analyzeNameCompatibility } from "./nameVibration";
import { calculateMobileVibration, analyzeMobileCompatibility } from "./mobileVibration";
import { calculateBusinessVibration, suggestBrandTweaks } from "./businessNameVibration";

describe("nameVibration", () => {
  it("computes pythagorean total for a known name", () => {
    const v = calculateNameVibration("Rahul Verma");
    // R(9)+A(1)+H(8)+U(3)+L(3)+V(4)+E(5)+R(9)+M(4)+A(1) = 47
    expect(v.pythagoreanTotal).toBe(47);
    expect(v.root).toBe(11); // master preserved
    expect(v.isMaster).toBe(true);
  });

  it("returns alignment score in 0-100", () => {
    const c = analyzeNameCompatibility("Rahul Verma", "02/07/1998");
    expect(c.alignmentScore).toBeGreaterThanOrEqual(0);
    expect(c.alignmentScore).toBeLessThanOrEqual(100);
  });
});

describe("mobileVibration", () => {
  it("reduces digit sum correctly", () => {
    const v = calculateMobileVibration("9876543210");
    expect(v.digitSum).toBe(45);
    expect(v.root).toBe(9);
  });
  it("scores compatibility 0-100", () => {
    const c = analyzeMobileCompatibility("9876543210", 5, 1);
    expect(c.score).toBeGreaterThanOrEqual(0);
    expect(c.score).toBeLessThanOrEqual(100);
  });
});

describe("businessNameVibration", () => {
  it("returns an archetype", () => {
    const r = calculateBusinessVibration("Nike");
    expect(r.archetype.name).toBeTruthy();
    expect(r.brand.root).toBeGreaterThan(0);
  });
  it("suggests tweaks toward target root", () => {
    const tweaks = suggestBrandTweaks("Test", 5);
    expect(Array.isArray(tweaks)).toBe(true);
  });
});
