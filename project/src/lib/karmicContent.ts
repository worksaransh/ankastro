// Deep Karmic Debt content (13, 14, 16, 19) — additive content module.
// Pairs with existing calculateKarmicDebts() which detects presence.
export interface KarmicDeep {
  number: 13 | 14 | 16 | 19;
  title: { en: string; hi: string; hinglish: string };
  pastLife: { en: string; hi: string; hinglish: string };
  presentImpact: { en: string; hi: string; hinglish: string };
  lesson: { en: string; hi: string; hinglish: string };
  remedy: { en: string; hi: string; hinglish: string };
}

export const KARMIC_DEEP: Record<number, KarmicDeep> = {
  13: {
    number: 13,
    title: { en: "Karmic Debt 13 — The Debt of Work", hi: "कार्मिक ऋण 13 — परिश्रम का ऋण", hinglish: "Karmic Debt 13 — Mehnat Ka Karz" },
    pastLife: {
      en: "In past lives there was a tendency to avoid effort, take shortcuts, or leave work unfinished. Others may have carried your share of the load.",
      hi: "पिछले जन्मों में परिश्रम से बचने, शॉर्टकट लेने या काम अधूरा छोड़ने की प्रवृत्ति थी। दूसरों ने शायद आपका बोझ उठाया।",
      hinglish: "Past lives mein effort avoid karne, shortcuts lene ya kaam adhoora chhodne ki tendency thi. Doosron ne shayad aapka bojh uthaya.",
    },
    presentImpact: {
      en: "Now, success comes only through steady, honest, sustained effort. Quick wins tend to slip away; disciplined work brings lasting reward.",
      hi: "अब सफलता केवल निरंतर, ईमानदार परिश्रम से मिलती है। जल्दी मिली सफलता टिकती नहीं; अनुशासित मेहनत स्थायी फल देती है।",
      hinglish: "Ab success sirf steady, honest mehnat se milti hai. Quick wins tikti nahi; disciplined kaam lasting reward deta hai.",
    },
    lesson: { en: "Transform frustration into focused, disciplined work. Finish what you start.", hi: "निराशा को केंद्रित, अनुशासित कार्य में बदलें। जो शुरू करें उसे पूरा करें।", hinglish: "Frustration ko focused, disciplined kaam mein badlo. Jo shuru karo wo finish karo." },
    remedy: { en: "Keep routines, complete tasks fully, avoid shortcuts. Serve through honest labour; worship Lord Ganesha on Wednesdays.", hi: "दिनचर्या बनाए रखें, कार्य पूरे करें, शॉर्टकट से बचें। बुधवार को गणेश पूजा करें।", hinglish: "Routine rakho, tasks poore karo, shortcuts avoid karo. Wednesday ko Ganesh ji ki pooja karo." },
  },
  14: {
    number: 14,
    title: { en: "Karmic Debt 14 — The Debt of Freedom", hi: "कार्मिक ऋण 14 — स्वतंत्रता का ऋण", hinglish: "Karmic Debt 14 — Azaadi Ka Karz" },
    pastLife: {
      en: "Past misuse of freedom — over-indulgence, broken commitments, or escaping responsibility through excess.",
      hi: "पिछले जन्मों में स्वतंत्रता का दुरुपयोग — अति-भोग, टूटे वादे, या अति के ज़रिए ज़िम्मेदारी से भागना।",
      hinglish: "Past mein freedom ka misuse — over-indulgence, toote vaade, ya excess se responsibility se bhaagna.",
    },
    presentImpact: {
      en: "Life brings constant change and temptation. Without self-control, energy scatters; with moderation, you become adaptable and free in a healthy way.",
      hi: "जीवन में निरंतर परिवर्तन और प्रलोभन आते हैं। आत्म-नियंत्रण बिना ऊर्जा बिखरती है; संयम से आप स्वस्थ रूप से स्वतंत्र बनते हैं।",
      hinglish: "Life mein constant change aur temptation aati hai. Self-control ke bina energy bikharti hai; moderation se aap healthy free bante ho.",
    },
    lesson: { en: "Balance freedom with responsibility. Practise moderation in all things.", hi: "स्वतंत्रता को ज़िम्मेदारी के साथ संतुलित करें। हर चीज़ में संयम रखें।", hinglish: "Freedom ko responsibility ke saath balance karo. Har cheez mein moderation rakho." },
    remedy: { en: "Set a fixed daily routine, limit indulgences, honour commitments. Meditation and pranayama steady the restless mind.", hi: "स्थिर दिनचर्या रखें, भोग सीमित करें, वादे निभाएँ। ध्यान और प्राणायाम बेचैन मन को स्थिर करते हैं।", hinglish: "Fixed routine rakho, indulgences limit karo, commitments nibhao. Meditation aur pranayama mind ko steady karte hain." },
  },
  16: {
    number: 16,
    title: { en: "Karmic Debt 16 — The Debt of Ego", hi: "कार्मिक ऋण 16 — अहंकार का ऋण", hinglish: "Karmic Debt 16 — Ahankaar Ka Karz" },
    pastLife: {
      en: "Past pride, ego, or betrayal in love damaged relationships. Status was placed above the heart.",
      hi: "पिछले जन्मों में अहंकार या प्रेम में विश्वासघात ने रिश्ते बिगाड़े। हृदय से ऊपर प्रतिष्ठा रखी गई।",
      hinglish: "Past mein pride, ego ya love mein betrayal ne relationships damage kiye. Dil se upar status rakha gaya.",
    },
    presentImpact: {
      en: "Life may bring sudden upheavals that humble the ego — so a truer, more spiritual self can be rebuilt. Each fall is a doorway to rebirth.",
      hi: "जीवन में अचानक उथल-पुथल आ सकती है जो अहंकार को विनम्र करे — ताकि सच्चा, आध्यात्मिक स्व पुनर्निर्मित हो। हर गिरावट पुनर्जन्म का द्वार है।",
      hinglish: "Life mein sudden upheavals aa sakti hain jo ego ko humble karein — taaki sacha, spiritual self rebuild ho. Har girawat rebirth ka darwaza hai.",
    },
    lesson: { en: "Ego death and spiritual rebirth. Build on humility and truth, not image.", hi: "अहंकार का अंत और आध्यात्मिक पुनर्जन्म। छवि नहीं, विनम्रता और सत्य पर निर्माण करें।", hinglish: "Ego death aur spiritual rebirth. Image nahi, humility aur truth par build karo." },
    remedy: { en: "Practise humility, accept failures as growth, serve others quietly. Spiritual study and surrender (e.g. to a higher power) heal this debt.", hi: "विनम्रता अपनाएँ, असफलता को विकास मानें, चुपचाप सेवा करें। आध्यात्मिक अध्ययन और समर्पण इस ऋण को ठीक करते हैं।", hinglish: "Humility apnao, failures ko growth maano, chupchaap seva karo. Spiritual study aur surrender is debt ko heal karte hain." },
  },
  19: {
    number: 19,
    title: { en: "Karmic Debt 19 — The Debt of Power", hi: "कार्मिक ऋण 19 — शक्ति का ऋण", hinglish: "Karmic Debt 19 — Shakti Ka Karz" },
    pastLife: {
      en: "Past selfish use of power — taking without giving, ignoring others' needs while pursuing your own.",
      hi: "पिछले जन्मों में शक्ति का स्वार्थी उपयोग — बिना दिए लेना, अपनी चाह में दूसरों की अनदेखी।",
      hinglish: "Past mein power ka selfish use — bina diye lena, apni chaah mein doosron ko ignore karna.",
    },
    presentImpact: {
      en: "You must learn independence without isolation — to stand strong yet support others. Self-reliance is tested until it includes compassion.",
      hi: "आपको अलगाव बिना स्वतंत्रता सीखनी है — मज़बूत रहकर भी दूसरों का साथ देना। आत्मनिर्भरता तब तक परखी जाती है जब तक उसमें करुणा न आए।",
      hinglish: "Aapko isolation ke bina independence seekhni hai — strong rehkar bhi doosron ko support karna. Self-reliance tab tak test hoti hai jab tak usme compassion na aaye.",
    },
    lesson: { en: "Transform self-centeredness into service. Use strength to lift others.", hi: "स्वार्थ को सेवा में बदलें। शक्ति से दूसरों को ऊपर उठाएँ।", hinglish: "Self-centeredness ko service mein badlo. Strength se doosron ko upar uthao." },
    remedy: { en: "Help others succeed, share credit and knowledge, lead with compassion. Donate anonymously; honour the Sun (Surya) with morning light.", hi: "दूसरों की सफलता में मदद करें, श्रेय और ज्ञान बाँटें, करुणा से नेतृत्व करें। गुप्त दान करें; सूर्य को प्रातः जल अर्पित करें।", hinglish: "Doosron ki success mein madad karo, credit aur knowledge share karo, compassion se lead karo. Gupt daan karo; Surya ko subah jal arpit karo." },
  },
};
