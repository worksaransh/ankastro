// Daily Lucky Forecast — deterministic, date + Mulank seeded.
// Additive, no backend. Same number on the same day for the same Mulank.
import { reduceToSingleDigit, calculateLifePath } from "@/lib/numerology";
import { calculateMulank } from "@/lib/vedicNumerology";
import { parseDateToDdmmyyyy } from "@/lib/dateUtils";

const COLORS = ["Red", "Orange", "Yellow", "Green", "Turquoise", "Blue", "Indigo", "Violet", "Gold", "White"];
const COLORS_HI = ["लाल", "नारंगी", "पीला", "हरा", "फ़िरोज़ी", "नीला", "जामुनी", "बैंगनी", "सुनहरा", "सफ़ेद"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface DailyForecast {
  date: string;          // ISO date used
  mulank: number;        // person's birth number (0 if unknown)
  luckyNumber: number;   // today's lucky number for them
  luckyColor: { en: string; hi: string };
  rating: number;        // 1-5 day rating
  focus: { en: string; hi: string; hinglish: string };
  tip: { en: string; hi: string; hinglish: string };
}

const FOCUS: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: { en: "Leadership & new starts", hi: "नेतृत्व और नई शुरुआत", hinglish: "Leadership aur naye starts" },
  2: { en: "Relationships & cooperation", hi: "रिश्ते और सहयोग", hinglish: "Rishte aur cooperation" },
  3: { en: "Creativity & communication", hi: "रचनात्मकता और संवाद", hinglish: "Creativity aur communication" },
  4: { en: "Discipline & building", hi: "अनुशासन और निर्माण", hinglish: "Discipline aur building" },
  5: { en: "Change & opportunity", hi: "परिवर्तन और अवसर", hinglish: "Change aur opportunity" },
  6: { en: "Family & responsibility", hi: "परिवार और ज़िम्मेदारी", hinglish: "Family aur responsibility" },
  7: { en: "Reflection & learning", hi: "चिंतन और सीख", hinglish: "Reflection aur learning" },
  8: { en: "Money & ambition", hi: "धन और महत्वाकांक्षा", hinglish: "Paisa aur ambition" },
  9: { en: "Service & completion", hi: "सेवा और पूर्णता", hinglish: "Seva aur completion" },
};

const TIPS: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: { en: "Take initiative — start that task you've delayed.", hi: "पहल करें — टाला हुआ काम शुरू करें।", hinglish: "Initiative lo — taala hua kaam shuru karo." },
  2: { en: "Listen more than you speak today; harmony favours you.", hi: "आज बोलने से ज़्यादा सुनें; सामंजस्य आपके पक्ष में है।", hinglish: "Aaj bolne se zyada suno; harmony aapke favour mein hai." },
  3: { en: "Express yourself — write, create or connect socially.", hi: "स्वयं को व्यक्त करें — लिखें, रचें या मिलें-जुलें।", hinglish: "Express karo — likho, banao ya logon se milo." },
  4: { en: "Focus on one solid task; avoid spreading thin.", hi: "एक ठोस कार्य पर ध्यान दें; बिखरने से बचें।", hinglish: "Ek solid task par focus karo; bikharne se bacho." },
  5: { en: "Stay flexible — an unexpected chance may appear.", hi: "लचीले रहें — अप्रत्याशित अवसर आ सकता है।", hinglish: "Flexible raho — unexpected chance aa sakta hai." },
  6: { en: "Nurture a relationship; a kind gesture goes far.", hi: "किसी रिश्ते को पोषें; एक दयालु इशारा बहुत मायने रखता है।", hinglish: "Kisi rishte ko nurture karo; ek kind gesture bahut maayne rakhta hai." },
  7: { en: "Take quiet time to think; trust your intuition.", hi: "सोचने के लिए शांत समय लें; अंतर्ज्ञान पर भरोसा करें।", hinglish: "Sochne ke liye quiet time lo; intuition par trust karo." },
  8: { en: "Good day for money matters and bold decisions.", hi: "धन मामलों और साहसी निर्णयों के लिए अच्छा दिन।", hinglish: "Money matters aur bold decisions ke liye achha din." },
  9: { en: "Finish pending things; help someone in need.", hi: "लंबित काम पूरे करें; किसी ज़रूरतमंद की मदद करें।", hinglish: "Pending kaam poore karo; kisi zaruratmand ki madad karo." },
};

export const getDailyForecast = (dob?: string, isoDate?: string): DailyForecast => {
  const today = isoDate ? new Date(isoDate) : new Date();
  const iso = today.toISOString().slice(0, 10);
  const dayNum = today.getDate();
  const monthNum = today.getMonth() + 1;

  let mulank = 0;
  if (dob) {
    try {
      const ddmmyyyy = parseDateToDdmmyyyy(dob);
      if (ddmmyyyy) {
        mulank = calculateMulank(ddmmyyyy);
      }
    } catch { /* ignore */ }
  }

  // Today's universal day number + personal blend
  const universal = reduceToSingleDigit(dayNum + monthNum + today.getFullYear(), false);
  const luckyNumber = reduceToSingleDigit(universal + (mulank || universal), false);
  const colorIdx = (luckyNumber - 1 + 10) % 10;
  const rating = 3 + ((luckyNumber + dayNum) % 3); // 3..5

  return {
    date: iso,
    mulank,
    luckyNumber,
    luckyColor: { en: COLORS[colorIdx], hi: COLORS_HI[colorIdx] },
    rating,
    focus: FOCUS[luckyNumber] || FOCUS[9],
    tip: TIPS[luckyNumber] || TIPS[9],
  };
};
