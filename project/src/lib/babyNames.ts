// Baby / Lucky Name suggester dataset (additive)
// Names are curated Indian names with gender + meaning. Naamank (name number)
// is computed at runtime via calculateNameVibration, so it always matches the
// app's own numerology engine. No external data needed.
import { calculateNameVibration } from "@/lib/nameVibration";

export type Gender = "boy" | "girl" | "unisex";

export interface BabyName {
  name: string;
  gender: Gender;
  meaning: string;
}

// ~80 popular modern Indian names with short meanings.
export const BABY_NAMES: BabyName[] = [
  { name: "Aarav", gender: "boy", meaning: "Peaceful, wise" },
  { name: "Vivaan", gender: "boy", meaning: "Full of life" },
  { name: "Aditya", gender: "boy", meaning: "Sun" },
  { name: "Vihaan", gender: "boy", meaning: "Dawn, new beginning" },
  { name: "Arjun", gender: "boy", meaning: "Bright, shining" },
  { name: "Reyansh", gender: "boy", meaning: "Ray of light" },
  { name: "Krishna", gender: "boy", meaning: "Dark, divine" },
  { name: "Ishaan", gender: "boy", meaning: "Sun, lord Shiva" },
  { name: "Shaurya", gender: "boy", meaning: "Bravery" },
  { name: "Atharv", gender: "boy", meaning: "Knowledge, the first Veda" },
  { name: "Kabir", gender: "boy", meaning: "Great, noble" },
  { name: "Ayaan", gender: "boy", meaning: "Gift of God" },
  { name: "Dhruv", gender: "boy", meaning: "Pole star, constant" },
  { name: "Rudra", gender: "boy", meaning: "Lord Shiva" },
  { name: "Veer", gender: "boy", meaning: "Brave" },
  { name: "Yuvaan", gender: "boy", meaning: "Youthful" },
  { name: "Aryan", gender: "boy", meaning: "Noble" },
  { name: "Parth", gender: "boy", meaning: "Arjun, king" },
  { name: "Devansh", gender: "boy", meaning: "Part of God" },
  { name: "Samar", gender: "boy", meaning: "Battle, evening" },
  { name: "Aarush", gender: "boy", meaning: "First ray of sun" },
  { name: "Kian", gender: "boy", meaning: "Grace of God" },
  { name: "Neil", gender: "boy", meaning: "Blue, champion" },
  { name: "Ronav", gender: "boy", meaning: "Joyful" },
  { name: "Advik", gender: "boy", meaning: "Unique" },
  { name: "Hriday", gender: "boy", meaning: "Heart" },
  { name: "Aanya", gender: "girl", meaning: "Grace, gift" },
  { name: "Saanvi", gender: "girl", meaning: "Goddess Lakshmi" },
  { name: "Aadhya", gender: "girl", meaning: "First power" },
  { name: "Diya", gender: "girl", meaning: "Lamp, light" },
  { name: "Myra", gender: "girl", meaning: "Beloved, sweet" },
  { name: "Anika", gender: "girl", meaning: "Grace, goddess Durga" },
  { name: "Kiara", gender: "girl", meaning: "Dark-haired, bright" },
  { name: "Ananya", gender: "girl", meaning: "Unique, matchless" },
  { name: "Ira", gender: "girl", meaning: "Earth, goddess Saraswati" },
  { name: "Riya", gender: "girl", meaning: "Singer, graceful" },
  { name: "Navya", gender: "girl", meaning: "New, young" },
  { name: "Pari", gender: "girl", meaning: "Fairy, angel" },
  { name: "Sara", gender: "girl", meaning: "Princess, pure" },
  { name: "Avni", gender: "girl", meaning: "Earth" },
  { name: "Mahika", gender: "girl", meaning: "Earth, fragrance" },
  { name: "Tara", gender: "girl", meaning: "Star" },
  { name: "Vanya", gender: "girl", meaning: "Gracious gift of God" },
  { name: "Ishita", gender: "girl", meaning: "Desired, supreme" },
  { name: "Prisha", gender: "girl", meaning: "Beloved, gift of God" },
  { name: "Aaradhya", gender: "girl", meaning: "Worshipped" },
  { name: "Mira", gender: "girl", meaning: "Devotee, ocean" },
  { name: "Nitara", gender: "girl", meaning: "Deeply rooted" },
  { name: "Zara", gender: "girl", meaning: "Blooming flower" },
  { name: "Kyra", gender: "girl", meaning: "Light, throne" },
  { name: "Inaaya", gender: "girl", meaning: "Care, concern" },
  { name: "Larisa", gender: "girl", meaning: "Cheerful" },
  { name: "Aria", gender: "unisex", meaning: "Melody, lioness" },
  { name: "Nirvaan", gender: "unisex", meaning: "Liberation, bliss" },
  { name: "Ezra", gender: "unisex", meaning: "Helper" },
  { name: "Kavya", gender: "unisex", meaning: "Poetry" },
  { name: "Avi", gender: "unisex", meaning: "Sun, air" },
  { name: "Riaan", gender: "unisex", meaning: "Little king" },
  { name: "Shanaya", gender: "girl", meaning: "First ray of sun" },
  { name: "Tejas", gender: "boy", meaning: "Brilliance, radiance" },
  { name: "Om", gender: "boy", meaning: "Sacred sound" },
  { name: "Laksh", gender: "boy", meaning: "Aim, goal" },
  { name: "Nakul", gender: "boy", meaning: "Pandava prince" },
  { name: "Saira", gender: "girl", meaning: "Traveller, princess" },
  { name: "Mishka", gender: "girl", meaning: "Gift of love" },
  { name: "Anvi", gender: "girl", meaning: "Goddess, kind" },
  { name: "Reet", gender: "unisex", meaning: "Tradition, custom" },
  { name: "Hetal", gender: "unisex", meaning: "Friendly, loving" },
  { name: "Jiya", gender: "girl", meaning: "Heart, life" },
  { name: "Rishaan", gender: "boy", meaning: "Good human being" },
  { name: "Daksh", gender: "boy", meaning: "Capable, talented" },
  { name: "Eva", gender: "girl", meaning: "Life, living one" },
  { name: "Ayan", gender: "boy", meaning: "Gift of God, lucky" },
  { name: "Naira", gender: "girl", meaning: "Shining, bright" },
  { name: "Vedant", gender: "boy", meaning: "Knowledge of Vedas" },
  { name: "Sai", gender: "unisex", meaning: "Divine, master" },
  { name: "Anaya", gender: "girl", meaning: "Caring, protected" },
  { name: "Yug", gender: "boy", meaning: "Era, age" },
  { name: "Reva", gender: "girl", meaning: "River Narmada" },
];

export interface ScoredName extends BabyName {
  naamank: number;
}

/**
 * Suggest names whose Naamank (name root) matches the desired number.
 * Optionally filter by gender. Returns up to `limit` names.
 */
export const suggestBabyNames = (
  desiredNumber: number,
  gender: Gender | "any" = "any",
  limit = 24,
): ScoredName[] => {
  const out: ScoredName[] = [];
  for (const n of BABY_NAMES) {
    if (gender !== "any" && n.gender !== gender && n.gender !== "unisex") continue;
    const naamank = calculateNameVibration(n.name).root;
    if (naamank === desiredNumber) {
      out.push({ ...n, naamank });
    }
    if (out.length >= limit) break;
  }
  return out;
};
