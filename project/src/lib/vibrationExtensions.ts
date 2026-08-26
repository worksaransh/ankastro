import { reduceToSingleDigit } from "@/lib/numerology";

const PYTH: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

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

const relation = (a: number, b: number): "friendly" | "neutral" => {
  if (a === b) return "friendly";
  return FRIENDLY[a]?.includes(b) ? "friendly" : "neutral";
};

/* ===================== SIGNATURE ===================== */
export interface SignatureAnalysis {
  input: string;
  cleaned: string;
  total: number;
  root: number;
  vsMulank: "friendly" | "neutral";
  score: number;
  meaning: { en: string; hi: string; hinglish: string };
  remedy: { en: string; hi: string; hinglish: string };
  verdict: { en: string; hi: string; hinglish: string };
}

const SIGNATURE_ROOT_MEANING: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: {
    en: "Vibrant and assertive. Great for leadership, branding, and setting trends.",
    hi: "जीवंत और मुखर। नेतृत्व, ब्रांडिंग और नए ट्रेंड सेट करने के लिए उत्तम।",
    hinglish: "Vibrant aur assertive. Leadership, branding, aur trends set karne ke liye best."
  },
  2: {
    en: "Gentle and cooperative. Best for advisory, artistic, and relationship-driven roles.",
    hi: "सौम्य और सहकारी। सलाहकार, कलात्मक और रिश्तों से जुड़े काम के लिए उत्तम।",
    hinglish: "Gentle aur cooperative. Advisory, artistic, aur relationship roles ke liye badhiya."
  },
  3: {
    en: "Creative and communicative. Excellent for speakers, writers, and artists.",
    hi: "रचनात्मक और संवादात्मक। वक्ताओं, लेखकों और कलाकारों के लिए उत्कृष्ट।",
    hinglish: "Creative aur communicative. Speakers, writers, aur artists ke liye excellent."
  },
  4: {
    en: "Structured and stable, but can bring sudden challenges or hard work requirements.",
    hi: "व्यवस्थित और स्थिर, लेकिन अचानक चुनौतियाँ या कड़ी मेहनत की आवश्यकता ला सकता है।",
    hinglish: "Structured aur stable, but sudden challenges aur hard work laa sakta hai."
  },
  5: {
    en: "Fast-moving, highly communicative, and commercial. Great for sales and startup founders.",
    hi: "तेजी से चलने वाला, अत्यधिक संवादात्मक और व्यावसायिक। बिक्री और स्टार्टअप संस्थापकों के लिए उत्तम।",
    hinglish: "Fast-moving, communicative, aur commercial. Sales aur startup founders ke liye best."
  },
  6: {
    en: "Harmonious and luxury-attracting. Auspicious for family life, beauty, and wealth.",
    hi: "सामंजस्यपूर्ण और विलासिता को आकर्षित करने वाला। पारिवारिक जीवन, सौंदर्य और धन के लिए शुभ।",
    hinglish: "Harmonious aur luxury-attracting. Family life, beauty, aur wealth ke liye auspicious."
  },
  7: {
    en: "Introspective and mystical. Excellent for deep research, spirituality, and consulting.",
    hi: "चिंतनशील और रहस्यमयी। गहन शोध, आध्यात्मिकता और परामर्श के लिए उत्कृष्ट।",
    hinglish: "Introspective aur mystical. Deep research, spirituality, aur consulting ke liye excellent."
  },
  8: {
    en: "Powerful status but demands strict effort and discipline. Can bring delay before success.",
    hi: "शक्तिशाली प्रतिष्ठा लेकिन कड़े प्रयास और अनुशासन की मांग करता है। सफलता से पहले देरी ला सकता है।",
    hinglish: "Powerful status but strict effort aur discipline demand karta hai. Delay laa sakta hai."
  },
  9: {
    en: "Energetic and humanitarian. Rises above challenges with courage and determination.",
    hi: "ऊर्जावान और मानवीय। साहस और दृढ़ संकल्प के साथ चुनौतियों से ऊपर उठता है।",
    hinglish: "Energetic aur humanitarian. Challenges se courage aur determination ke saath upar uthta hai."
  }
};

const SIGNATURE_REMEDY: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: { en: "Ensure your signature slants upward (15-45 degrees) to support career growth.", hi: "सुनिश्चित करें कि आपका हस्ताक्षर ऊपर की ओर झुका हो ताकि करियर में उन्नति हो।", hinglish: "Signature upward slant (15-45 degrees) mein hona chahiye career growth ke liye." },
  2: { en: "Avoid crossing out your signature. Underline with a single straight line to build stability.", hi: "हस्ताक्षर को काटने से बचें। स्थिरता के लिए नीचे एक सीधी रेखा खींचें।", hinglish: "Signature ko cut mat karo. Niche ek straight line lagao stability ke liye." },
  3: { en: "Keep a dot at the end of the signature to lock decision clarity and focus.", hi: "निर्णय स्पष्टता और ध्यान बनाए रखने के लिए हस्ताक्षर के अंत में एक बिंदु रखें।", hinglish: "Signature ke end mein ek dot rakho decision clarity aur focus ke liye." },
  4: { en: "Ensure spelling sums to a friendly root. Avoid horizontal drop lines.", hi: "सुनिश्चित करें कि स्पेलिंग का जोड़ एक अनुकूल अंक पर आए। नीचे की ओर गिरने वाली रेखाओं से बचें।", hinglish: "Spelling ka sum friendly root par aana chahiye. Downward lines avoid karo." },
  5: { en: "Always write clearly; legible signatures build quick business deals.", hi: "हमेशा स्पष्ट लिखें; पठनीय हस्ताक्षर त्वरित व्यावसायिक सौदे बनाने में मदद करते हैं।", hinglish: "Hamesha clear likho; readable signatures se deals jaldi hoti hain." },
  6: { en: "Add your initials or middle name to lift the vibration to harmony.", hi: "सामंजस्य के लिए अपने नाम के शुरुआती अक्षर या मध्य नाम जोड़कर कंपन को बढ़ाएं।", hinglish: "Harmony ke liye initials ya middle name add karke vibration improve karein." },
  7: { en: "Leave clear space between first and last names in your signature.", hi: "हस्ताक्षर में प्रथम और अंतिम नाम के बीच स्पष्ट स्थान छोड़ें।", hinglish: "First name aur last name ke beech clear space rakhein." },
  8: { en: "Never write in very small letters. Give breathing room for expansion.", hi: "बहुत छोटे अक्षरों में कभी न लिखें। विस्तार के लिए पर्याप्त स्थान दें।", hinglish: "Bahut chote letters mein signature mat karo. Space open rakho." },
  9: { en: "Underline and start the signature with a strong, clean capital letter.", hi: "हस्ताक्षर की शुरुआत एक बड़े और स्पष्ट अक्षर से करें और नीचे अंडरलाइन करें।", hinglish: "Signature ko strong capital letter se start karo aur underline karo." }
};

export const analyzeSignature = (sig: string, mulank = 0): SignatureAnalysis => {
  const cleaned = (sig || "").toUpperCase().replace(/[^A-Z]/g, "");
  const chars = cleaned.toLowerCase().split("");
  const total = chars.reduce((s, c) => s + (CHALD[c] ?? 0), 0);
  const root = reduceToSingleDigit(total, false);
  const vsMulank = mulank ? relation(root, mulank) : "neutral";
  const score = vsMulank === "friendly" ? 100 : 70;
  
  const meaning = SIGNATURE_ROOT_MEANING[root] || SIGNATURE_ROOT_MEANING[1];
  const remedy = SIGNATURE_REMEDY[root] || SIGNATURE_REMEDY[1];
  const verdict = {
    en: vsMulank === "friendly" ? `Signature root ${root} matches beautifully with your Birth Number ${mulank}.` : `Signature root ${root} is neutral. Try adjustments to target ${(FRIENDLY[mulank] || [1, 5, 9]).join(", ")}.`,
    hi: vsMulank === "friendly" ? `हस्ताक्षर मूल ${root} आपके मूलांक ${mulank} के साथ खूबसूरती से मेल खाता है।` : `हस्ताक्षर मूल ${root} तटस्थ है। ${(FRIENDLY[mulank] || [1, 5, 9]).join(", ")} प्राप्त करने का प्रयास करें।`,
    hinglish: vsMulank === "friendly" ? `Signature root ${root} aapke Mulank ${mulank} ke saath achhe se match karta hai.` : `Signature root ${root} neutral hai. ${(FRIENDLY[mulank] || [1, 5, 9]).join(", ")} target karne ki koshish karein.`
  };

  return { input: sig, cleaned, total, root, vsMulank, score, meaning, remedy, verdict };
};

/* ===================== EMAIL ===================== */
export interface EmailAnalysis {
  input: string;
  cleaned: string;
  total: number;
  root: number;
  vsMulank: "friendly" | "neutral";
  score: number;
  meaning: { en: string; hi: string; hinglish: string };
  verdict: { en: string; hi: string; hinglish: string };
}

const EMAIL_ROOT_MEANING: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: { en: "Excellent for professional status and leadership roles. Sounds authoritative.", hi: "व्यावसायिक स्थिति और नेतृत्व भूमिकाओं के लिए उत्कृष्ट। आधिकारिक लगता है।", hinglish: "Professional status aur leadership roles ke liye best. Authoritative vibration hai." },
  2: { en: "Good for customer service, diplomatic roles, and team support portals.", hi: "ग्राहक सेवा, राजनयिक भूमिकाओं और टीम समर्थन के लिए अच्छा।", hinglish: "Customer service, diplomatic roles, aur team support portals ke liye achha hai." },
  3: { en: "Highly suited for creative writing, consulting, and educational reach.", hi: "रचनात्मक लेखन, परामर्श और शैक्षिक पहुंच के लिए अत्यधिक अनुकूल।", hinglish: "Creative writing, consulting, aur educational communication ke liye best hai." },
  4: { en: "Stable and process-oriented. Can sometimes feel slow or restrictive.", hi: "स्थिर और प्रक्रिया-उन्मुख। कभी-कभी धीमा या प्रतिबंधात्मक लग सकता है।", hinglish: "Stable aur process-oriented. Thoda slow feel ho sakta hai." },
  5: { en: "Extremely dynamic. Best for quick communication, sales, tech, and marketing.", hi: "अत्यधिक गतिशील। त्वरित संचार, बिक्री, तकनीक और विपणन के लिए सर्वोत्तम।", hinglish: "Extremely dynamic. Quick communication, sales, tech, aur marketing ke liye standard." },
  6: { en: "Harmonious and family/aesthetic-friendly. Good for client hospitality.", hi: "सामंजस्यपूर्ण और पारिवारिक/सौंदर्य-अनुकूल। ग्राहक आतिथ्य के लिए अच्छा।", hinglish: "Harmonious aur aesthetic-friendly. Client relations ke liye best hai." },
  7: { en: "Great for scientific research, analysis, auditing, and clinical work.", hi: "वैज्ञानिक अनुसंधान, विश्लेषण, लेखा परीक्षा और नैदानिक कार्य के लिए बढ़िया।", hinglish: "Scientific research, analysis, auditing, aur specialist jobs ke liye best." },
  8: { en: "Good for financial corporate accounts, wealth management, and administration.", hi: "वित्तीय कॉर्पोरेट खातों, धन प्रबंधन और प्रशासन के लिए अच्छा।", hinglish: "Financial corporate accounts, wealth management, aur administration ke liye powerful." },
  9: { en: "Broad humanitarian vibration. Suitable for NGOs, public relations, and defense.", hi: "व्यापक मानवीय कंपन। गैर सरकारी संगठनों, जनसंपर्क और रक्षा के लिए उपयुक्त।", hinglish: "Broad humanitarian vibration. NGOs, PR, aur service sectors ke liye suit karta hai." }
};

export const analyzeEmail = (email: string, mulank = 0): EmailAnalysis => {
  const localPart = (email || "").split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  const chars = localPart.split("");
  const total = chars.reduce((s, c) => {
    if (/[0-9]/.test(c)) return s + Number(c);
    return s + (PYTH[c] ?? 0);
  }, 0);
  const root = reduceToSingleDigit(total, false);
  const vsMulank = mulank ? relation(root, mulank) : "neutral";
  const score = vsMulank === "friendly" ? 100 : 72;

  const meaning = EMAIL_ROOT_MEANING[root] || EMAIL_ROOT_MEANING[1];
  const verdict = {
    en: vsMulank === "friendly" ? `Email root ${root} aligns with your Birth Number ${mulank}.` : `Email root ${root} is workable. For maximum growth, try spelling changes reducing to ${(FRIENDLY[mulank] || [1, 5, 9]).join(", ")}.`,
    hi: vsMulank === "friendly" ? `ईमेल मूल ${root} आपके मूलांक ${mulank} के साथ संरेखित है।` : `ईमेल मूल ${root} काम करने योग्य है। अधिकतम लाभ के लिए ${(FRIENDLY[mulank] || [1, 5, 9]).join(", ")} प्राप्त करने का प्रयास करें।`,
    hinglish: vsMulank === "friendly" ? `Email root ${root} aapke Mulank ${mulank} ke saath aligned hai.` : `Email root ${root} workable hai. Maximum alignment ke liye ${(FRIENDLY[mulank] || [1, 5, 9]).join(", ")} check karein.`
  };

  return { input: email, cleaned: localPart, total, root, vsMulank, score, meaning, verdict };
};

/* ===================== DOMAIN ===================== */
export interface DomainAnalysis {
  input: string;
  cleaned: string;
  total: number;
  root: number;
  vsMulank: "friendly" | "neutral";
  score: number;
  meaning: { en: string; hi: string; hinglish: string };
  verdict: { en: string; hi: string; hinglish: string };
}

const DOMAIN_ROOT_MEANING: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: { en: "Pioneering brand leadership. Great for innovation, authority, and new concepts.", hi: "अग्रणी ब्रांड नेतृत्व। नवाचार, अधिकार और नए विचारों के लिए बढ़िया।", hinglish: "Pioneering brand leadership. Innovation aur authoritative startups ke liye best." },
  2: { en: "Supportive, customer-friendly portal. Great for counseling, mediation, or advice.", hi: "सहायक, ग्राहक-अनुकूल पोर्टल। परामर्श, मध्यस्थता या सलाह के लिए बढ़िया।", hinglish: "Supportive, customer-friendly portal. Counseling aur mediation brands ke liye best." },
  3: { en: "Creative, publishing, and marketing power. Ideal for educational platforms.", hi: "रचनात्मक, प्रकाशन और विपणन शक्ति। शैक्षिक प्लेटफार्मों के लिए आदर्श।", hinglish: "Creative, publishing, aur marketing hubs. Educational platforms ke liye ideal." },
  4: { en: "Process-heavy and structured. Good for logistics, engineering, or security sites.", hi: "प्रक्रिया-भारी और व्यवस्थित। रसद, इंजीनियरिंग या सुरक्षा साइटों के लिए अच्छा।", hinglish: "Process-heavy aur structured. Logistics, engineering, aur security portals ke liye suitable." },
  5: { en: "High virality, e-commerce friendly. Excellent for tech startups, sales, and retail.", hi: "उच्च वायरल क्षमता, ई-कॉमर्स अनुकूल। टेक स्टार्टअप, बिक्री और खुदरा के लिए उत्कृष्ट।", hinglish: "High virality, e-commerce friendly. Tech startups, retail, aur online sales ke liye best." },
  6: { en: "Luxury, home, and health beauty aesthetic. Ideal for premium service offerings.", hi: "विलासिता, गृह और स्वास्थ्य सौंदर्य सौंदर्यशास्त्र। प्रीमियम सेवाओं के लिए आदर्श।", hinglish: "Luxury, home decor, wellness, aur beauty brands ke liye highly auspicious." },
  7: { en: "Analytical, expert specialized niche. Suited for research, tech tools, or blogs.", hi: "विश्लेषणात्मक, विशेषज्ञ विशिष्ट आला। अनुसंधान, तकनीकी उपकरणों या ब्लॉग के लिए उपयुक्त।", hinglish: "Analytical, expert specialized niche. Tech tools, research, aur specialized blogs ke liye." },
  8: { en: "Legacy, finance, large enterprise, real estate, and corporate power portals.", hi: "विरासत, वित्त, बड़े उद्यम, रियल एस्टेट और कॉर्पोरेट पावर पोर्टल।", hinglish: "Legacy brands, finance, real estate, aur corporate power domains ke liye strong." },
  9: { en: "Global, humanitarian, or defense service scope. Good for community portals.", hi: "वैश्विक, मानवीय या रक्षा सेवा क्षेत्र। सामुदायिक पोर्टलों के लिए अच्छा।", hinglish: "Global, community projects, NGOs, aur public service domains ke liye suitable." }
};

export const analyzeDomain = (domain: string, mulank = 0): DomainAnalysis => {
  // Strip subdomains & suffixes (e.g. "www.google.com" -> "google")
  let cleanDomain = (domain || "").toLowerCase().trim();
  cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, "");
  cleanDomain = cleanDomain.split(".")[0];
  cleanDomain = cleanDomain.replace(/[^a-z0-9]/g, "");

  const chars = cleanDomain.split("");
  const total = chars.reduce((s, c) => {
    if (/[0-9]/.test(c)) return s + Number(c);
    return s + (PYTH[c] ?? 0);
  }, 0);
  const root = reduceToSingleDigit(total, false);
  const vsMulank = mulank ? relation(root, mulank) : "neutral";
  const score = vsMulank === "friendly" ? 100 : 70;

  const meaning = DOMAIN_ROOT_MEANING[root] || DOMAIN_ROOT_MEANING[1];
  const verdict = {
    en: vsMulank === "friendly" ? `Domain root ${root} is friendly with your Birth Number ${mulank}.` : `Domain root ${root} is neutral. For business growth, check if the root aligns with your industry sector.`,
    hi: vsMulank === "friendly" ? `डोमेन मूल ${root} आपके मूलांक ${mulank} के अनुकूल है।` : `डोमेन मूल ${root} तटस्थ है। व्यापार विकास के लिए, जांचें कि क्या मूल आपके उद्योग क्षेत्र से मेल खाता है।`,
    hinglish: vsMulank === "friendly" ? `Domain root ${root} aapke Mulank ${mulank} ke friendly hai.` : `Domain root ${root} neutral hai. Business sectors aur domains compatibility check karein.`
  };

  return { input: domain, cleaned: cleanDomain, total, root, vsMulank, score, meaning, verdict };
};

/* ===================== SOCIAL HANDLE ===================== */
export interface SocialHandleAnalysis {
  input: string;
  cleaned: string;
  total: number;
  root: number;
  vsMulank: "friendly" | "neutral";
  score: number;
  meaning: { en: string; hi: string; hinglish: string };
  verdict: { en: string; hi: string; hinglish: string };
}

const SOCIAL_ROOT_MEANING: Record<number, { en: string; hi: string; hinglish: string }> = {
  1: { en: "High authority and personal brand focus. Renders strong personal leadership.", hi: "उच्च अधिकार और व्यक्तिगत ब्रांड पर ध्यान। मजबूत व्यक्तिगत नेतृत्व प्रदान करता है।", hinglish: "High authority aur personal brand focus. Strong personal leadership define karta hai." },
  2: { en: "Softer approach. Good for community relationship pages and support handlers.", hi: "सौम्य दृष्टिकोण। सामुदायिक संबंध पेजों और सहायता हैंडल के लिए अच्छा।", hinglish: "Softer approach. Community relations, partnership profiles, aur support handles." },
  3: { en: "Highly viral creative energy. Perfect for influencers, artists, and creators.", hi: "अत्यधिक वायरल रचनात्मक ऊर्जा। प्रभावशाली लोगों, कलाकारों और रचनाकारों के लिए बिल्कुल सही।", hinglish: "Highly viral creative energy. Influencers, artists, content creators ke liye perfect." },
  4: { en: "Information and structure-heavy. Best for educational or data sharing handles.", hi: "सूचना और संरचना-भारी। शैक्षिक या डेटा साझाकरण हैंडल के लिए सर्वोत्तम।", hinglish: "Information aur structure-heavy. Educational, facts-sharing, aur research handles." },
  5: { en: "Mass appeal, PR-friendly, and trendy. Extremely lucky for social growth.", hi: "जन अपील, पीआर-अनुकूल और ट्रेंडी। सामाजिक विकास के लिए अत्यंत भाग्यशाली।", hinglish: "Mass appeal, PR-friendly, aur trend-setting. Social growth aur virality ke liye lucky." },
  6: { en: "Lifestyle, aesthetic beauty, fashion, and luxury. Highly engaging visuals.", hi: "जीवन शैली, सौंदर्य, फैशन और विलासिता। अत्यधिक आकर्षक दृश्य।", hinglish: "Lifestyle, aesthetics, fashion, aur luxury. Highly engaging visual vibe." },
  7: { en: "Niche, deep concepts, mystery, or tech knowledge. High quality followers.", hi: "विशिष्ट, गहरे विचार, रहस्य, या तकनीकी ज्ञान। उच्च गुणवत्ता वाले अनुयायी।", hinglish: "Niche content, tech insights, ya spiritual focus. High quality dedicated followers." },
  8: { en: "Professional business status, corporate news, or financial insights.", hi: "व्यावसायिक व्यावसायिक स्थिति, कॉर्पोरेट समाचार, या वित्तीय अंतर्दृष्टि।", hinglish: "Professional business status, corporate news, ya financial growth insights." },
  9: { en: "Intense, public awareness, sports, or motivational handles. Inspires action.", hi: "तीव्र, जन जागरूकता, खेल, या प्रेरक हैंडल। कार्रवाई को प्रेरित करता है।", hinglish: "Intense, public awareness, sports, ya motivational handles. Active followers base." }
};

export const analyzeSocialHandle = (handle: string, mulank = 0): SocialHandleAnalysis => {
  const cleaned = (handle || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const chars = cleaned.split("");
  const total = chars.reduce((s, c) => {
    if (/[0-9]/.test(c)) return s + Number(c);
    return s + (PYTH[c] ?? 0);
  }, 0);
  const root = reduceToSingleDigit(total, false);
  const vsMulank = mulank ? relation(root, mulank) : "neutral";
  const score = vsMulank === "friendly" ? 100 : 70;

  const meaning = SOCIAL_ROOT_MEANING[root] || SOCIAL_ROOT_MEANING[1];
  const verdict = {
    en: vsMulank === "friendly" ? `Social handle root ${root} matches with your Birth Number ${mulank}.` : `Social handle root ${root} is neutral. Roots 3 and 5 are generally the most viral options.`,
    hi: vsMulank === "friendly" ? `सोशल हैंडल मूल ${root} आपके मूलांक ${mulank} से मेल खाता है।` : `सोशल हैंडल मूल ${root} तटस्थ है। आमतौर पर 3 और 5 अंक सबसे अधिक वायरल होते हैं।`,
    hinglish: vsMulank === "friendly" ? `Social handle root ${root} aapke Mulank ${mulank} ke friendly hai.` : `Social handle root ${root} neutral hai. Handles ke liye root 3 ya 5 sabse viral hote hain.`
  };

  return { input: handle, cleaned, total, root, vsMulank, score, meaning, verdict };
};
