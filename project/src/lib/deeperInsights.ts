// Phase 4c — Deeper pillar content: emotional guidance, lucky timing,
// expanded compat / health / career insights. Frontend-only derivations
// from existing numerology values (mulank, bhagyank, lifePath, personalYear).

export type PillarKey = 'career' | 'love' | 'money' | 'health';

export interface EmotionalGuidance {
  coreEmotion: string;
  shadowFeeling: string;
  release: string;
  affirmation: string;
  practice: string;
}

export interface LuckyTiming {
  luckyDays: string[];        // weekdays
  luckyDates: number[];        // dates of month
  peakHours: string;           // window of day
  luckyMonths: string[];       // best months this year
  luckyColors: string[];
  luckyGemstone: string;
  luckyDirection: string;
  avoidDates: number[];
}

export interface DeeperInsight {
  emotional: EmotionalGuidance;
  timing: LuckyTiming;
  expanded: string[];          // 4-6 deeper bullets specific to pillar
  warning: string;             // gentle caution
  microRitual: string;         // 1-line daily ritual
}

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_HI = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];

// Pythagorean: each number tied to planet/day/color/gem/direction
const NUMBER_PROFILE: Record<number, {
  weekdays: number[]; hours: string; colors: { en: string[]; hi: string[] };
  gem: { en: string; hi: string }; direction: { en: string; hi: string };
}> = {
  1: { weekdays:[0,1], hours:'6 AM – 11 AM', colors:{en:['Golden','Royal Yellow','Bronze'],hi:['सुनहरा','शाही पीला','कांस्य']}, gem:{en:'Ruby',hi:'माणिक'}, direction:{en:'East',hi:'पूर्व'} },
  2: { weekdays:[1,5], hours:'5 PM – 9 PM',  colors:{en:['Silver','Cream','Soft White'],hi:['चांदी','क्रीम','कोमल सफेद']}, gem:{en:'Pearl',hi:'मोती'}, direction:{en:'North-West',hi:'उत्तर-पश्चिम'} },
  3: { weekdays:[4],   hours:'9 AM – 12 PM', colors:{en:['Yellow','Saffron','Gold'],hi:['पीला','केसरिया','सुनहरा']}, gem:{en:'Yellow Sapphire',hi:'पुखराज'}, direction:{en:'North-East',hi:'उत्तर-पूर्व'} },
  4: { weekdays:[0,3], hours:'4 PM – 7 PM',  colors:{en:['Sky Blue','Grey','Khaki'],hi:['आसमानी','धूसर','खाकी']}, gem:{en:'Hessonite',hi:'गोमेद'}, direction:{en:'North',hi:'उत्तर'} },
  5: { weekdays:[3],   hours:'10 AM – 1 PM', colors:{en:['Green','Pista','Turquoise'],hi:['हरा','पिस्ता','फ़िरोज़ा']}, gem:{en:'Emerald',hi:'पन्ना'}, direction:{en:'North',hi:'उत्तर'} },
  6: { weekdays:[5],   hours:'5 PM – 8 PM',  colors:{en:['Pink','Rose','Pastel Blue'],hi:['गुलाबी','रोज़','पेस्टल नीला']}, gem:{en:'Diamond',hi:'हीरा'}, direction:{en:'South-East',hi:'दक्षिण-पूर्व'} },
  7: { weekdays:[1,0], hours:'Pre-dawn 4 AM – 6 AM', colors:{en:['Sea Green','Lavender','Off-white'],hi:['समुद्री हरा','लैवेंडर','हल्का सफेद']}, gem:{en:'Cat\'s Eye',hi:'लहसुनिया'}, direction:{en:'West',hi:'पश्चिम'} },
  8: { weekdays:[6],   hours:'7 PM – 10 PM', colors:{en:['Deep Blue','Black','Maroon'],hi:['गहरा नीला','काला','मरून']}, gem:{en:'Blue Sapphire',hi:'नीलम'}, direction:{en:'South',hi:'दक्षिण'} },
  9: { weekdays:[2],   hours:'11 AM – 2 PM', colors:{en:['Red','Crimson','Coral'],hi:['लाल','सिंदूरी','मूंगा']}, gem:{en:'Red Coral',hi:'मूंगा'}, direction:{en:'South',hi:'दक्षिण'} },
};
// fix typo entry for 6 (closing brace)
(NUMBER_PROFILE as any)[6].colors = { en:['Pink','Rose','Pastel Blue'], hi:['गुलाबी','रोज़','पेस्टल नीला'] };

function reduce(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) n = String(n).split('').reduce((s, d) => s + Number(d), 0);
  return n;
}
function singleDigit(n: number): number {
  let r = reduce(n);
  if (r > 9) r = String(r).split('').reduce((s, d) => s + Number(d), 0);
  return r || 1;
}

function luckyDates(mulank: number): number[] {
  const base = singleDigit(mulank);
  const set = new Set<number>();
  for (let d = base; d <= 31; d += 9) set.add(d);
  // also add same single-digit dates
  for (let d = 1; d <= 31; d++) if (singleDigit(d) === base) set.add(d);
  return Array.from(set).sort((a, b) => a - b).slice(0, 6);
}

function avoidDates(mulank: number): number[] {
  // Numerologically clashing single digit
  const enemyMap: Record<number, number[]> = {
    1:[4,8], 2:[5,9], 3:[6,8], 4:[1,5], 5:[2,4], 6:[3,7], 7:[6,8], 8:[1,3,7], 9:[2,5]
  };
  const enemies = enemyMap[singleDigit(mulank)] || [];
  const set = new Set<number>();
  for (let d = 1; d <= 31; d++) if (enemies.includes(singleDigit(d))) set.add(d);
  return Array.from(set).slice(0, 4);
}

function luckyMonths(personalYear: number, lang: 'en' | 'hi'): string[] {
  const months = lang === 'hi' ? MONTHS_HI : MONTHS_EN;
  // months whose personal-month resonance matches personal year (1, 5, 9 typically)
  const resonant = [1, 5, 9];
  const out: string[] = [];
  for (let i = 0; i < 12; i++) {
    const pm = singleDigit(personalYear + i + 1);
    if (resonant.includes(pm)) out.push(months[i]);
  }
  return out.slice(0, 4);
}

// =====================================================
// EMOTIONAL GUIDANCE per pillar × mulank
// =====================================================
const EMOTIONAL: Record<PillarKey, Record<number, { en: EmotionalGuidance; hi: EmotionalGuidance }>> = {
  career: {
    1: {
      en: { coreEmotion: 'Drive to lead', shadowFeeling: 'Fear of being unseen', release: 'Release the urge to prove yourself to those who never asked.', affirmation: 'I lead from inner clarity, not external approval.', practice: 'Each Monday, write one decision you will own this week — fully.' },
      hi: { coreEmotion: 'नेतृत्व की चाह', shadowFeeling: 'अनदेखे रह जाने का डर', release: 'जिनसे प्रमाण नहीं मांगा गया, उन्हें सिद्ध करने की चाह छोड़ें।', affirmation: 'मैं भीतर की स्पष्टता से नेतृत्व करता/करती हूँ।', practice: 'हर सोमवार एक निर्णय लिखें जिसे आप पूरी तरह अपनाएँगे।' },
    },
    2: {
      en: { coreEmotion: 'Desire to support', shadowFeeling: 'Fear of confrontation', release: 'Release the belief that your worth is measured by how easy you are to work with.', affirmation: 'My quiet strength shapes outcomes.', practice: 'Speak one honest opinion in every meeting this week.' },
      hi: { coreEmotion: 'सहयोग की भावना', shadowFeeling: 'टकराव का डर', release: 'यह मान्यता छोड़ें कि सहज होना ही आपका मूल्य है।', affirmation: 'मेरी शांत शक्ति परिणाम बनाती है।', practice: 'इस सप्ताह हर बैठक में एक ईमानदार राय रखें।' },
    },
    3: {
      en: { coreEmotion: 'Joy of expression', shadowFeeling: 'Restlessness when work feels dull', release: 'Release the pattern of starting many projects to avoid finishing one.', affirmation: 'My voice carries weight when I follow through.', practice: 'Pick one creative project and ship it within 30 days.' },
      hi: { coreEmotion: 'अभिव्यक्ति का आनंद', shadowFeeling: 'नीरस काम में बेचैनी', release: 'एक काम पूरा न करने के लिए कई शुरू करने की आदत छोड़ें।', affirmation: 'जब मैं पूर्ण करता/करती हूँ, मेरी आवाज़ का असर होता है।', practice: '30 दिनों में एक रचनात्मक कार्य पूरा करें।' },
    },
    4: {
      en: { coreEmotion: 'Need for stability', shadowFeeling: 'Anxiety when systems break', release: 'Release the idea that working harder always proves your value.', affirmation: 'I build foundations that breathe and adapt.', practice: 'Once a week, leave work 30 minutes early — guilt-free.' },
      hi: { coreEmotion: 'स्थिरता की चाह', shadowFeeling: 'व्यवस्था टूटने पर बेचैनी', release: 'यह सोच छोड़ें कि अधिक मेहनत ही आपकी कीमत साबित करती है।', affirmation: 'मैं ऐसी नींव बनाता/बनाती हूँ जो साँस लेती है।', practice: 'सप्ताह में एक बार 30 मिनट पहले काम छोड़ें — बिना अपराध।' },
    },
    5: {
      en: { coreEmotion: 'Hunger for freedom', shadowFeeling: 'Fear of being trapped', release: 'Release the belief that commitment kills creativity.', affirmation: 'Depth gives me wings, not chains.', practice: 'Choose one focus area and stay with it for 90 days.' },
      hi: { coreEmotion: 'स्वतंत्रता की भूख', shadowFeeling: 'बंधे होने का डर', release: 'यह मान्यता छोड़ें कि प्रतिबद्धता रचनात्मकता मारती है।', affirmation: 'गहराई मुझे पंख देती है, बेड़ियाँ नहीं।', practice: 'एक केंद्र चुनें और 90 दिन उसी पर टिकें।' },
    },
    6: {
      en: { coreEmotion: 'Care for the team', shadowFeeling: 'Resentment when over-giving', release: 'Release the role of family-fixer in your workplace.', affirmation: 'Caring for myself is not abandoning others.', practice: 'Decline one extra task this week without explaining.' },
      hi: { coreEmotion: 'टीम की देखभाल', shadowFeeling: 'अधिक देने पर नाराज़गी', release: 'कार्यस्थल पर परिवार-संभालने की भूमिका छोड़ें।', affirmation: 'अपनी देखभाल दूसरों को छोड़ना नहीं है।', practice: 'इस सप्ताह एक अतिरिक्त काम बिना सफाई दिए मना करें।' },
    },
    7: {
      en: { coreEmotion: 'Need for depth', shadowFeeling: 'Withdrawal when misunderstood', release: 'Release the assumption that explaining is beneath you.', affirmation: 'My insight reaches more people when I translate it.', practice: 'Share one idea publicly each week — even imperfect.' },
      hi: { coreEmotion: 'गहराई की आवश्यकता', shadowFeeling: 'गलत समझे जाने पर पीछे हटना', release: 'यह मान्यता छोड़ें कि समझाना आपके स्तर से नीचे है।', affirmation: 'अनुवादित ज्ञान अधिक लोगों तक पहुँचता है।', practice: 'हर सप्ताह एक विचार सार्वजनिक करें — अधूरा भी ठीक है।' },
    },
    8: {
      en: { coreEmotion: 'Hunger for impact', shadowFeeling: 'Fear of losing control', release: 'Release the equation: power = winning. Power is also building.', affirmation: 'I scale with integrity, not force.', practice: 'Each month, mentor one person without expecting return.' },
      hi: { coreEmotion: 'प्रभाव की भूख', shadowFeeling: 'नियंत्रण खोने का डर', release: 'यह छोड़ें: शक्ति = जीतना। शक्ति निर्माण भी है।', affirmation: 'मैं ईमानदारी से बढ़ता/बढ़ती हूँ, बल से नहीं।', practice: 'हर माह एक व्यक्ति का बिना अपेक्षा मार्गदर्शन करें।' },
    },
    9: {
      en: { coreEmotion: 'Vision for the world', shadowFeeling: 'Burnout from over-giving', release: 'Release the belief that small steps are not enough.', affirmation: 'My daily craft is my greatest contribution.', practice: 'Block 2 protected hours daily for deep work — no exceptions.' },
      hi: { coreEmotion: 'विश्व-दृष्टि', shadowFeeling: 'अधिक देने से थकान', release: 'यह मान्यता छोड़ें कि छोटे कदम काफी नहीं।', affirmation: 'मेरा दैनिक श्रम ही मेरा सबसे बड़ा योगदान है।', practice: 'रोज़ 2 घंटे गहरे कार्य के लिए सुरक्षित रखें।' },
    },
  },
  love: {
    1: { en:{ coreEmotion:'Desire to be admired', shadowFeeling:'Loneliness behind strength', release:'Release needing to always be the strong one.', affirmation:'Being held does not make me weak.', practice:'Let your partner decide one thing this week — fully.' }, hi:{ coreEmotion:'प्रशंसा की चाह', shadowFeeling:'शक्ति के पीछे का अकेलापन', release:'हमेशा मजबूत होने की आवश्यकता छोड़ें।', affirmation:'सहारा लेने से मैं कमज़ोर नहीं होता/होती।', practice:'इस सप्ताह एक निर्णय पूरी तरह अपने साथी पर छोड़ें।' } },
    2: { en:{ coreEmotion:'Longing for closeness', shadowFeeling:'Fear of abandonment', release:'Release reading silence as rejection.', affirmation:'Love can be steady without being loud.', practice:'Each evening name one feeling without softening it.' }, hi:{ coreEmotion:'निकटता की लालसा', shadowFeeling:'त्याग का डर', release:'मौन को अस्वीकृति समझना छोड़ें।', affirmation:'प्रेम शांत होकर भी स्थिर हो सकता है।', practice:'हर शाम एक भावना नाम दें — बिना नरम किए।' } },
    3: { en:{ coreEmotion:'Joy and play', shadowFeeling:'Avoiding hard conversations', release:'Release using humor to dodge depth.', affirmation:'My partner deserves my truth, not just my charm.', practice:'Have one 20-min conversation without phones, weekly.' }, hi:{ coreEmotion:'आनंद और खेल', shadowFeeling:'कठिन बातचीत से बचाव', release:'गहराई से बचने के लिए हँसी का प्रयोग छोड़ें।', affirmation:'साथी को आकर्षण नहीं, सच चाहिए।', practice:'सप्ताह में एक 20-मिनट की बात बिना फ़ोन के करें।' } },
    4: { en:{ coreEmotion:'Loyal and steady', shadowFeeling:'Rigidity in expectations', release:'Release scoring your relationship like a project plan.', affirmation:'Love grows where I let things be imperfect.', practice:'Plan one unscheduled act of affection weekly.' }, hi:{ coreEmotion:'निष्ठा और स्थिरता', shadowFeeling:'अपेक्षाओं में कठोरता', release:'रिश्ते को परियोजना की तरह आँकना छोड़ें।', affirmation:'प्रेम वहीं बढ़ता है जहाँ मैं अपूर्णता को जगह देता/देती हूँ।', practice:'सप्ताह में एक अनियोजित स्नेह क्रिया करें।' } },
    5: { en:{ coreEmotion:'Need for excitement', shadowFeeling:'Restlessness in routine', release:'Release equating boredom with wrong partner.', affirmation:'Real intimacy is the deepest adventure.', practice:'Weekly: try one new ritual together — small counts.' }, hi:{ coreEmotion:'उत्साह की आवश्यकता', shadowFeeling:'दिनचर्या में बेचैनी', release:'ऊब को गलत साथी समझना छोड़ें।', affirmation:'सच्ची निकटता ही सबसे गहरा रोमांच है।', practice:'सप्ताह में एक नई छोटी रीत साथ निभाएँ।' } },
    6: { en:{ coreEmotion:'Devotion and care', shadowFeeling:'Mothering instead of partnering', release:'Release the role of fixer in your relationship.', affirmation:'My partner is whole — I am beside, not above.', practice:'Once a week, ask for help instead of giving it.' }, hi:{ coreEmotion:'समर्पण और देखभाल', shadowFeeling:'पालक बनना, साथी नहीं', release:'रिश्ते में सुधारक की भूमिका छोड़ें।', affirmation:'मेरा साथी पूर्ण है — मैं साथ हूँ, ऊपर नहीं।', practice:'सप्ताह में एक बार मदद माँगें, देने के बजाय।' } },
    7: { en:{ coreEmotion:'Soulful connection', shadowFeeling:'Withdrawing into your inner world', release:'Release expecting partners to read your silence.', affirmation:'Naming what I feel is the highest intimacy.', practice:'Share one inner thought aloud each day.' }, hi:{ coreEmotion:'आत्मीय जुड़ाव', shadowFeeling:'भीतर की दुनिया में सिमटना', release:'अपेक्षा छोड़ें कि साथी आपका मौन पढ़ ले।', affirmation:'भावना नाम देना सबसे ऊँची निकटता है।', practice:'रोज़ एक भीतरी विचार ज़ोर से साझा करें।' } },
    8: { en:{ coreEmotion:'Strong protector', shadowFeeling:'Control disguised as care', release:'Release the need to manage your partner\'s choices.', affirmation:'Trust is the truest power I can offer.', practice:'This month, don\'t correct your partner once.' }, hi:{ coreEmotion:'सशक्त रक्षक', shadowFeeling:'देखभाल के नाम पर नियंत्रण', release:'साथी के निर्णयों को प्रबंधित करने की चाह छोड़ें।', affirmation:'विश्वास ही सबसे सच्ची शक्ति है।', practice:'इस माह साथी को एक बार भी न सुधारें।' } },
    9: { en:{ coreEmotion:'Universal love', shadowFeeling:'Sacrificing self in love', release:'Release rescuing a partner instead of choosing one.', affirmation:'I love best when I am also full.', practice:'Schedule one solo joy hour weekly — non-negotiable.' }, hi:{ coreEmotion:'सर्वव्यापी प्रेम', shadowFeeling:'प्रेम में स्वयं का त्याग', release:'साथी को बचाने के बजाय चुनना सीखें।', affirmation:'जब मैं भरा/भरी हूँ, तब प्रेम सबसे सुंदर है।', practice:'सप्ताह में एक एकांत आनंद घंटा रखें।' } },
  },
  money: {
    1: { en:{ coreEmotion:'Pride in earning', shadowFeeling:'Self-worth tied to income', release:'Release measuring yourself in numbers.', affirmation:'My worth precedes my wealth.', practice:'Track one win this week that wasn\'t monetary.' }, hi:{ coreEmotion:'कमाई पर गर्व', shadowFeeling:'आय से आत्म-मूल्य जोड़ना', release:'स्वयं को संख्याओं में मापना छोड़ें।', affirmation:'मेरा मूल्य धन से पहले है।', practice:'सप्ताह में एक गैर-आर्थिक जीत लिखें।' } },
    2: { en:{ coreEmotion:'Care with money', shadowFeeling:'Fear of asking for more', release:'Release feeling rude about charging your worth.', affirmation:'Receiving is service too.', practice:'Raise one rate or ask for one upgrade this quarter.' }, hi:{ coreEmotion:'धन के साथ संवेदना', shadowFeeling:'अधिक माँगने का डर', release:'मूल्य माँगने पर असभ्य महसूस करना छोड़ें।', affirmation:'स्वीकार करना भी सेवा है।', practice:'इस तिमाही एक दर बढ़ाएँ या वृद्धि माँगें।' } },
    3: { en:{ coreEmotion:'Money as fun', shadowFeeling:'Impulse to splurge socially', release:'Release buying presence with generosity.', affirmation:'I am loved without the bill.', practice:'Skip one social spend this week — observe what arises.' }, hi:{ coreEmotion:'धन खेल जैसा', shadowFeeling:'सामाजिक खर्च की हड़बड़ी', release:'उदारता से उपस्थिति खरीदना छोड़ें।', affirmation:'बिल चुकाए बिना भी मैं प्रिय हूँ।', practice:'इस सप्ताह एक सामाजिक खर्च छोड़कर देखें।' } },
    4: { en:{ coreEmotion:'Security focus', shadowFeeling:'Scarcity even in abundance', release:'Release saving as a form of fear.', affirmation:'My foundation is built — I can also bloom.', practice:'Spend one planned amount on joy each month.' }, hi:{ coreEmotion:'सुरक्षा केंद्र', shadowFeeling:'समृद्धि में भी अभाव', release:'भय से बचत करना छोड़ें।', affirmation:'मेरी नींव बनी है — मैं खिल भी सकता/सकती हूँ।', practice:'हर माह एक नियोजित राशि आनंद पर खर्च करें।' } },
    5: { en:{ coreEmotion:'Money as freedom', shadowFeeling:'Spending to escape', release:'Release using money to silence restlessness.', affirmation:'Stillness is also wealth.', practice:'Sit 10 min before any non-essential purchase.' }, hi:{ coreEmotion:'धन = स्वतंत्रता', shadowFeeling:'भागने के लिए खर्च', release:'बेचैनी शांत करने के लिए खर्च करना छोड़ें।', affirmation:'शांति भी संपत्ति है।', practice:'किसी अनावश्यक खरीद से पहले 10 मिनट बैठें।' } },
    6: { en:{ coreEmotion:'Provider energy', shadowFeeling:'Guilt around personal spending', release:'Release earning only for others.', affirmation:'Spending on myself is also dharma.', practice:'Each month, set aside a "me-only" expense.' }, hi:{ coreEmotion:'पालक ऊर्जा', shadowFeeling:'स्वयं पर खर्च का अपराध', release:'केवल दूसरों के लिए कमाना छोड़ें।', affirmation:'अपने पर खर्च भी धर्म है।', practice:'हर माह एक "केवल मेरे लिए" खर्च रखें।' } },
    7: { en:{ coreEmotion:'Money discomfort', shadowFeeling:'Avoiding money conversations', release:'Release seeing money as impure or beneath you.', affirmation:'Money is energy that frees my work.', practice:'Review your finances on a fixed weekly slot.' }, hi:{ coreEmotion:'धन से असहजता', shadowFeeling:'धन वार्ता से बचाव', release:'धन को अशुद्ध समझना छोड़ें।', affirmation:'धन ऊर्जा है जो मेरे कार्य को मुक्त करती है।', practice:'हर सप्ताह एक तय समय पर वित्त देखें।' } },
    8: { en:{ coreEmotion:'Powerful with money', shadowFeeling:'Wealth mistaken for safety', release:'Release the belief that more is always better.', affirmation:'Enough is the most underrated wealth.', practice:'Define your "enough number" this month.' }, hi:{ coreEmotion:'धन में शक्ति', shadowFeeling:'धन को सुरक्षा समझना', release:'यह छोड़ें कि अधिक हमेशा बेहतर है।', affirmation:'"पर्याप्त" सबसे कम महत्व दी गई संपदा है।', practice:'इस माह अपना "पर्याप्त अंक" तय करें।' } },
    9: { en:{ coreEmotion:'Generous spirit', shadowFeeling:'Giving from emptiness', release:'Release the belief that wanting wealth is selfish.', affirmation:'I receive so I can give bigger.', practice:'Pay yourself 10% before any donation.' }, hi:{ coreEmotion:'उदार आत्मा', shadowFeeling:'खालीपन से देना', release:'यह छोड़ें कि धन की चाह स्वार्थ है।', affirmation:'मैं स्वीकार करता/करती हूँ ताकि बड़ा दे सकूँ।', practice:'किसी भी दान से पहले स्वयं को 10% दें।' } },
  },
  health: {
    1: { en:{ coreEmotion:'Strong willpower', shadowFeeling:'Pushing past body signals', release:'Release equating rest with weakness.', affirmation:'Recovery is also performance.', practice:'One full no-screen evening per week.' }, hi:{ coreEmotion:'दृढ़ इच्छाशक्ति', shadowFeeling:'शरीर के संकेतों को नज़रअंदाज़', release:'विश्राम को कमज़ोरी समझना छोड़ें।', affirmation:'विश्राम भी प्रदर्शन है।', practice:'सप्ताह में एक शाम बिना स्क्रीन।' } },
    2: { en:{ coreEmotion:'Sensitive system', shadowFeeling:'Absorbing others\' moods', release:'Release feeling responsible for everyone\'s vibe.', affirmation:'My energy is mine to guard.', practice:'Daily 10-min silence — phone elsewhere.' }, hi:{ coreEmotion:'संवेदनशील तंत्र', shadowFeeling:'दूसरों के मूड सोखना', release:'सबके मूड की ज़िम्मेदारी छोड़ें।', affirmation:'मेरी ऊर्जा मेरी अपनी है।', practice:'रोज़ 10 मिनट मौन — फ़ोन दूर।' } },
    3: { en:{ coreEmotion:'Vibrant energy', shadowFeeling:'Sugar/snack swings', release:'Release using food for emotional spikes.', affirmation:'My body deserves stable fuel.', practice:'Replace one snack daily with a fruit + water.' }, hi:{ coreEmotion:'जीवंत ऊर्जा', shadowFeeling:'शक्कर/नाश्ते का उतार-चढ़ाव', release:'भावनात्मक उछाल के लिए भोजन छोड़ें।', affirmation:'मेरे शरीर को स्थिर ईंधन चाहिए।', practice:'रोज़ एक नाश्ता फल + पानी से बदलें।' } },
    4: { en:{ coreEmotion:'Disciplined body', shadowFeeling:'Stiffness from over-routine', release:'Release the rigidity in your wellness rituals.', affirmation:'Flexibility is strength.', practice:'5 min of stretching — every working day.' }, hi:{ coreEmotion:'अनुशासित शरीर', shadowFeeling:'अति-दिनचर्या से जकड़न', release:'स्वास्थ्य अनुष्ठानों की कठोरता छोड़ें।', affirmation:'लचीलापन ही शक्ति है।', practice:'हर कार्यदिवस 5 मिनट खिंचाव।' } },
    5: { en:{ coreEmotion:'Restless body', shadowFeeling:'Nervous system overload', release:'Release multitasking from morning to night.', affirmation:'My nervous system needs single-tasking love.', practice:'30-min walk daily — no phone, no podcast.' }, hi:{ coreEmotion:'चंचल शरीर', shadowFeeling:'तंत्रिका तंत्र पर बोझ', release:'सुबह से रात तक मल्टीटास्किंग छोड़ें।', affirmation:'मेरे तंत्र को एकल-कार्य प्रेम चाहिए।', practice:'रोज़ 30 मिनट सैर — बिना फ़ोन, बिना पॉडकास्ट।' } },
    6: { en:{ coreEmotion:'Caring heart', shadowFeeling:'Heart/throat tension', release:'Release swallowing your truth to keep the peace.', affirmation:'Speaking is also healing.', practice:'Each Sunday, voice one unsaid thing kindly.' }, hi:{ coreEmotion:'पालक हृदय', shadowFeeling:'हृदय/गले में तनाव', release:'शांति के लिए सच निगलना छोड़ें।', affirmation:'बोलना भी उपचार है।', practice:'हर रविवार एक अनकही बात स्नेह से कहें।' } },
    7: { en:{ coreEmotion:'Inner-tuned mind', shadowFeeling:'Mental fatigue, head heaviness', release:'Release thinking your way through emotions.', affirmation:'Feeling is the missing medicine.', practice:'Daily 5 min journal — write what you feel, not think.' }, hi:{ coreEmotion:'अंतर्मुखी मन', shadowFeeling:'मानसिक थकान, सिर भारीपन', release:'भावनाओं को सोचकर हल करना छोड़ें।', affirmation:'महसूसना ही छूटी हुई दवा है।', practice:'रोज़ 5 मिनट लिखें — जो महसूस हो, जो सोचें नहीं।' } },
    8: { en:{ coreEmotion:'Strong constitution', shadowFeeling:'Burnout from overdrive', release:'Release working through warning signs.', affirmation:'Pacing is power.', practice:'One sacred 24-hour rest day per week.' }, hi:{ coreEmotion:'मजबूत संरचना', shadowFeeling:'अति-कार्य से थकान', release:'चेतावनी संकेतों के बावजूद काम करना छोड़ें।', affirmation:'गति-नियंत्रण ही शक्ति है।', practice:'सप्ताह में एक पवित्र 24-घंटे विश्राम।' } },
    9: { en:{ coreEmotion:'Compassion fatigue', shadowFeeling:'Inflammation from over-giving', release:'Release carrying the weight of others\' pain.', affirmation:'I am allowed to set down what isn\'t mine.', practice:'Daily evening: name 3 things you did NOT carry.' }, hi:{ coreEmotion:'करुणा-थकान', shadowFeeling:'अधिक देने से सूजन', release:'दूसरों के दुख का बोझ उठाना छोड़ें।', affirmation:'जो मेरा नहीं उसे रखने की अनुमति है।', practice:'रोज़ शाम 3 चीज़ें लिखें जो आपने नहीं उठाईं।' } },
  },
};

// =====================================================
// EXPANDED INSIGHTS per pillar × number (deeper bullets)
// =====================================================
const EXPANDED: Record<PillarKey, Record<number, { en: string[]; hi: string[] }>> = {
  career: {
    1: { en:['You are wired to start, not maintain — partner with operators.','Public credit fuels you more than you admit; ask for it openly.','You scale by deciding faster, not working harder.','Your blind spot: dismissing slower thinkers as unambitious.'], hi:['आप शुरू करने के लिए बने हैं, बनाए रखने के लिए नहीं — संचालकों के साथ जुड़ें।','सार्वजनिक श्रेय आपको ईंधन देता है; खुलकर माँगें।','तेज़ निर्णय से आप बढ़ते हैं, अधिक काम से नहीं।','धीमे सोचने वालों को कम महत्वाकांक्षी समझना आपकी कमज़ोरी है।'] },
    2: { en:['You read rooms others miss; this is a senior skill, not a junior one.','You shine in second-chair roles where your influence is invisible.','Burnout signal: when you start over-explaining your decisions.','Negotiate by silence — your pause is louder than their pitch.'], hi:['आप वो पढ़ लेते हैं जो दूसरे चूकते हैं; यह वरिष्ठ कौशल है।','अदृश्य प्रभाव वाली दूसरी भूमिकाओं में आप चमकते हैं।','बर्नआउट संकेत: जब आप निर्णय अधिक समझाने लगें।','मौन से सौदा करें — आपका विराम उनके वादे से तेज़ है।'] },
    3: { en:['Your career grows when you teach what you have done.','Energy peaks mid-morning — schedule big calls then.','Avoid open-ended retainers; price by outcome.','Your biggest leverage: writing — start it.'], hi:['जब आप सिखाते हैं कि आपने क्या किया, तब करियर बढ़ता है।','दोपहर से पहले ऊर्जा शिखर — बड़ी कॉल तब रखें।','खुले रिटेनर से बचें; परिणाम के अनुसार दाम लगाएँ।','सबसे बड़ा लाभ: लेखन — शुरू करें।'] },
    4: { en:['You build what others promise — own that as a brand.','Your underpricing comes from over-delivering invisibly.','Document your process; it is your asset.','Allow one experimental project per quarter, by design.'], hi:['जो दूसरे वादा करते हैं, आप बनाते हैं — इसे अपनी पहचान बनाएँ।','आप अदृश्य अधिक-देने से कम मूल्य लेते हैं।','अपनी प्रक्रिया लिखें; यही आपकी संपत्ति है।','हर तिमाही एक प्रायोगिक परियोजना नियोजित करें।'] },
    5: { en:['You learn fastest in motion — choose careers with travel or change.','Pivot every 3–4 years to avoid stagnation.','Your edge: pattern-matching across fields.','Anchor with one accountability partner, not a boss.'], hi:['गतिशीलता में आप सबसे तेज़ सीखते हैं — यात्रा/परिवर्तन वाले करियर चुनें।','हर 3-4 साल में पिवट करें।','आपकी धार: क्षेत्रों में पैटर्न पहचान।','बॉस नहीं, एक जवाबदेही साथी रखें।'] },
    6: { en:['You are a culture-builder; pick teams who value warmth.','Beware mothering colleagues — it dilutes your authority.','Your healing services / wellness products will outperform.','Salary jumps come when you charge for outcomes, not hours.'], hi:['आप संस्कृति-निर्माता हैं; गर्मजोशी वाली टीम चुनें।','सहकर्मियों की पालक भूमिका से बचें।','आपकी हीलिंग/वेलनेस सेवाएँ बेहतर चलेंगी।','घंटे नहीं, परिणाम पर शुल्क लगाने से वेतन बढ़ता है।'] },
    7: { en:['You scale by writing/research — not by managing teams.','Solo expert positioning beats agency model for you.','Periodic retreats are not luxury — they are productivity.','Avoid corporate politics; choose mission-driven orgs.'], hi:['आप टीम नहीं, लेखन/शोध से बढ़ते हैं।','एकल विशेषज्ञ ब्रांडिंग आपके लिए बेहतर।','समय-समय पर एकांत यात्रा विलासिता नहीं — उत्पादकता है।','कॉर्पोरेट राजनीति से बचें।'] },
    8: { en:['You think in systems and scale; build, don\'t just run.','Mentorship is your secret compounding asset.','Beware mistaking control for leadership.','Long-term equity > short-term salary — always.'], hi:['आप तंत्र और विस्तार में सोचते हैं; निर्माण करें, सिर्फ चलाएँ नहीं।','मार्गदर्शन आपकी गुप्त संपदा है।','नियंत्रण को नेतृत्व समझने से बचें।','दीर्घ-कालिक हिस्सेदारी > अल्प-कालिक वेतन।'] },
    9: { en:['Mission-led work multiplies your luck.','You attract collaborations through generosity, not pitching.','Beware burning out for "the cause" — pace yourself.','Your story is your strongest asset; tell it publicly.'], hi:['उद्देश्य-केंद्रित कार्य आपकी किस्मत बढ़ाते हैं।','आप उदारता से सहयोग खींचते हैं, बिक्री से नहीं।','"कारण" के लिए जलने से बचें।','आपकी कहानी सबसे बड़ी संपत्ति है; सार्वजनिक करें।'] },
  },
  love: {
    1: { en:['You attract independent partners; insecure ones drain you.','Express affection in clear words, not just actions.','Apologise faster than your ego wants.','Annual partner-led trip rebalances the dynamic.'], hi:['आप स्वतंत्र साथी आकर्षित करते हैं; असुरक्षित आपको थकाते हैं।','स्नेह स्पष्ट शब्दों में दिखाएँ, सिर्फ कार्यों में नहीं।','अहंकार से तेज़ माफी माँगें।','वार्षिक "साथी द्वारा नियोजित" यात्रा संतुलन देती है।'] },
    2: { en:['Soft love is your superpower — do not apologise for tenderness.','Choose partners who name their needs, not guess yours.','You bond through small daily rituals more than grand gestures.','Anxiety spikes near silence; ask, do not assume.'], hi:['कोमल प्रेम आपकी शक्ति है — कोमलता पर खेद न करें।','ऐसे साथी चुनें जो अपनी ज़रूरतें कहें।','छोटे दैनिक अनुष्ठानों से आप अधिक जुड़ते हैं।','मौन में चिंता बढ़ती है; पूछें, मानें नहीं।'] },
    3: { en:['Laughter is your love language — but pair it with depth.','Long-distance phases need scheduled, not spontaneous, calls.','Compliments age your relationship like good wine.','Avoid using social media to test partner\'s love.'], hi:['हँसी आपकी प्रेम-भाषा है — गहराई जोड़ें।','दूर रहते समय निर्धारित कॉल करें।','तारीफ़ रिश्ते को मधुर बनाती है।','सोशल मीडिया से साथी का प्रेम न परखें।'] },
    4: { en:['You love through reliability — say it out loud sometimes.','Vacation in nature heals more than gifts.','Routine intimacy beats grand gestures, weekly.','Ask for affection — assuming it is breaking you.'], hi:['आप विश्वसनीयता से प्रेम करते हैं — कभी ज़ोर से कहें।','प्रकृति में छुट्टी उपहार से अधिक हीलिंग देती है।','दिनचर्या में अंतरंगता बेहतर है।','स्नेह माँगें — अपेक्षा आपको तोड़ रही है।'] },
    5: { en:['Variety in shared experiences is your love nutrition.','Beware confusing distance with freedom.','Travel together once a year — different place, no work.','Speak boredom early — it is fixable.'], hi:['साझा अनुभवों में विविधता आपका पोषण है।','दूरी को स्वतंत्रता समझने से बचें।','साल में एक बार साथ नई जगह यात्रा करें।','ऊब को जल्दी बोलें — यह सुधर सकती है।'] },
    6: { en:['Home is your love temple — keep it sacred, not perfect.','Cook together as a sacred ritual.','Stop solving — just sit with your partner sometimes.','Yearly couples retreat = relationship vitamin.'], hi:['घर आपका प्रेम-मंदिर है — पवित्र रखें, पूर्ण नहीं।','साथ खाना बनाना एक पवित्र अनुष्ठान बने।','हल न करें — कभी बस साथी के साथ बैठें।','वार्षिक युगल यात्रा = रिश्ते का विटामिन।'] },
    7: { en:['You need a partner with their own inner world.','Schedule "deep talks" — they don\'t happen by accident.','Quiet weekends restore you faster than parties.','Touch and silence together heal more than words.'], hi:['ऐसा साथी चुनें जिसकी अपनी भीतरी दुनिया हो।','गहरी बातचीत निर्धारित करें — संयोग से नहीं होती।','शांत सप्ताहांत पार्टियों से तेज़ हीलिंग देते हैं।','मौन और स्पर्श साथ — सबसे गहरा उपचार।'] },
    8: { en:['Power dynamics make or break your love.','Share finances transparently — secrets corrode you.','Stop coaching your partner — let them lead sometimes.','Power is sexy; control is corrosive — know the line.'], hi:['प्रेम में शक्ति-संतुलन बहुत मायने रखता है।','वित्त पारदर्शी रखें — रहस्य आपको कमज़ोर करते हैं।','साथी को कोचिंग देना छोड़ें।','शक्ति आकर्षक है; नियंत्रण विषैला — सीमा जानें।'] },
    9: { en:['You love at depth — choose partners who go there too.','Avoid rescuer-saved dynamics; they always end heavy.','One annual solo retreat strengthens your couple bond.','Healing past relationships is your real preparation for love.'], hi:['आप गहराई से प्रेम करते हैं — गहरे साथी चुनें।','बचाने-बचाए जाने वाली गतिकी से बचें।','वार्षिक एकांत यात्रा युगल बंधन मज़बूत करती है।','पुराने रिश्तों का उपचार ही नई प्रेम की तैयारी है।'] },
  },
  money: {
    1: { en:['Your income jumps when you own the work, not just do it.','Avoid 50/50 partnerships — you pull more weight.','First quarter of every year is your launch window.','Saving alone won\'t scale you — invest in skills.'], hi:['जब आप काम के मालिक बनते हैं तब आय बढ़ती है।','50/50 साझेदारी से बचें।','हर साल पहली तिमाही आपकी लॉन्च खिड़की है।','केवल बचत से नहीं — कौशल में निवेश से वृद्धि होगी।'] },
    2: { en:['You earn safely; calculated risks unlock your next level.','Joint accounts work for you — solo investments stress you.','Recurring revenue suits your nervous system.','Stop discounting; your softness already adds value.'], hi:['आप सुरक्षित कमाते हैं; नियोजित जोखिम अगला स्तर खोलते हैं।','साझा खाते आपके लिए ठीक हैं।','पुनरावर्ती आय आपके तंत्र के लिए अच्छी।','छूट देना बंद करें; आपकी कोमलता पहले से मूल्य जोड़ती है।'] },
    3: { en:['Money flows through visibility — show your work weekly.','Audit subscriptions monthly — small leaks add up.','Creative income > salary income for you, long term.','Pay tax on time; chaos here drains your luck.'], hi:['प्रकटता से धन बहता है — हर सप्ताह काम दिखाएँ।','हर माह सब्सक्रिप्शन देखें — छोटे रिसाव बड़े हो जाते हैं।','दीर्घ काल में रचनात्मक आय > वेतन।','कर समय पर दें; अव्यवस्था यहाँ किस्मत खाती है।'] },
    4: { en:['You build wealth slowly and deeply — trust the curve.','Property and SIPs suit your temperament.','Avoid get-rich-fast schemes — they are not for you.','Once a year, allow one "luxury" expense for joy.'], hi:['आप धीरे और गहरे धन बनाते हैं — वक्र पर विश्वास रखें।','संपत्ति और SIP आपके स्वभाव के लिए अच्छे।','जल्दी अमीर बनने की योजनाओं से बचें।','साल में एक "विलास" खर्च आनंद के लिए करें।'] },
    5: { en:['Multiple income streams suit you — not one big salary.','Track impulse buys for 30 days; the pattern will shock you.','Travel for business often pays more than at-desk work.','Liquid savings give you the courage to be bold.'], hi:['कई आय स्रोत आपके लिए सही — एक बड़ा वेतन नहीं।','30 दिन तक इम्पल्स खरीद देखें; पैटर्न चौंकाएगा।','व्यावसायिक यात्रा अक्सर अधिक देती है।','तरल बचत आपको साहस देती है।'] },
    6: { en:['Family-aligned businesses thrive in your hands.','Set a "self-only" wallet that no one else touches.','Charge for emotional labor; you have under-billed it.','Real estate rooted in family land grows your wealth.'], hi:['परिवार-संरेखित व्यवसाय आपके हाथों में फलते हैं।','एक "केवल स्वयं" वॉलेट रखें।','भावनात्मक श्रम पर शुल्क लगाएँ।','पारिवारिक भूमि पर अचल संपत्ति आपकी संपदा बढ़ाती है।'] },
    7: { en:['Knowledge products and IP are your wealth path.','Hire a financial advisor — your detachment costs you.','Quiet investments outperform showy ones for you.','Spiritual giving (anonymous) returns multiplied.'], hi:['ज्ञान-उत्पाद और IP आपका धन-पथ है।','वित्तीय सलाहकार रखें — आपकी अनासक्ति महँगी है।','शांत निवेश आपके लिए बेहतर।','गुप्त आध्यात्मिक दान कई गुना लौटता है।'] },
    8: { en:['You think in millions — let your daily habits match.','Real estate, equity, large deals are your zones.','Beware partners with weaker money discipline.','Tithe / give intentionally — it unblocks bigger flows.'], hi:['आप करोड़ों में सोचते हैं — दैनिक आदतें भी वैसी हों।','अचल संपत्ति, इक्विटी, बड़े सौदे आपके क्षेत्र।','कमज़ोर वित्त-अनुशासन वाले साथियों से बचें।','सचेत दान बड़े प्रवाह खोलता है।'] },
    9: { en:['Mission-aligned wealth multiplies for you.','Take 10% off the top for yourself before any cause.','Avoid emotional lending — turn it into structured help.','International work and impact deals fit you.'], hi:['उद्देश्य-संरेखित धन आपके लिए कई गुना होता है।','किसी कारण से पहले 10% स्वयं के लिए रखें।','भावनात्मक उधार से बचें — संरचित मदद बनाएँ।','अंतरराष्ट्रीय कार्य और प्रभाव-सौदे आपके लिए।'] },
  },
  health: {
    1: { en:['Heart and BP are your watch zones — track yearly.','Morning sunlight stabilises your hormones.','Lift weights, not just cardio — strength is your medicine.','Sleep before 11 PM — your body asks even when mind argues.'], hi:['हृदय और BP आपके निगरानी क्षेत्र — वार्षिक जाँच।','सुबह की धूप आपके हार्मोन स्थिर करती है।','केवल कार्डियो नहीं — वज़न उठाना भी ज़रूरी।','11 बजे से पहले सोएँ।'] },
    2: { en:['Stomach and digestion mirror your emotions — eat slowly.','Cold weather drains you — layer up early.','Walking near water restores you fastest.','Limit time with negative people — you absorb deeply.'], hi:['पेट और पाचन भावनाओं का दर्पण — धीरे खाएँ।','ठंडा मौसम थकाता है — पहले से कपड़े पहनें।','पानी के पास चलना सबसे तेज़ हीलिंग।','नकारात्मक लोगों के साथ समय सीमित करें।'] },
    3: { en:['Throat, voice, and skin reflect your emotional release.','Sing or speak daily — silenced creativity becomes illness.','Sugar is your weak link — replace, don\'t resist.','Move daily — sitting too long drops your mood.'], hi:['गला, आवाज़, त्वचा भावनात्मक रिलीज़ का प्रतिबिंब।','रोज़ गाएँ या बोलें।','चीनी आपकी कमज़ोरी — बदलें, रोकें नहीं।','रोज़ हिलें — लंबे बैठने से मनोदशा गिरती है।'] },
    4: { en:['Joints, back, and posture need weekly stretching.','Routine works for you — but variety prevents stiffness.','Cold/heat compresses are underrated remedies for you.','Prioritise sleep quality, not just duration.'], hi:['जोड़, पीठ, मुद्रा को हर सप्ताह खिंचाव चाहिए।','दिनचर्या ठीक — विविधता जकड़न रोकती है।','ठंडे/गर्म सेक आपके लिए अच्छे।','नींद की गुणवत्ता पर ध्यान।'] },
    5: { en:['Nervous system is your fragile gold — protect screens, sleep, caffeine.','Daily walks > intense gym for you.','Travel restores you, but extreme schedules wreck you.','Breathwork for 5 min daily — non-negotiable.'], hi:['तंत्रिका तंत्र आपका नाज़ुक स्वर्ण — स्क्रीन, नींद, कैफीन सम्भालें।','तीव्र जिम से रोज़ की सैर बेहतर।','यात्रा हीलिंग — कठोर शेड्यूल हानिकारक।','रोज़ 5 मिनट प्राणायाम।'] },
    6: { en:['Heart, throat, reproductive zones need attention.','Hugs literally heal you — give and receive daily.','Cooking your own food regulates everything.','Avoid carrying others\' grief; it lodges in your chest.'], hi:['हृदय, गला, प्रजनन क्षेत्र पर ध्यान।','गले लगना सच में हीलिंग देता है — रोज़।','अपना भोजन पकाना सब संतुलित करता है।','दूसरों का दुख न उठाएँ; यह छाती में रहता है।'] },
    7: { en:['Headaches are signals, not the problem itself.','Long sun exposure tires you — choose shade, mornings.','Hydrate more than you think; you under-drink.','Solitude is medicine — 30 min daily, undiluted.'], hi:['सिरदर्द संकेत हैं, समस्या नहीं।','लंबी धूप थकाती है — सुबह/छाया चुनें।','सोचे से अधिक पानी पिएँ।','एकांत दवा है — रोज़ 30 मिनट।'] },
    8: { en:['Bones, knees, BP need lifelong attention.','Slow down deliberately — your body keeps the score.','Strength training + walking is your formula.','Yearly preventive checkups — non-negotiable.'], hi:['हड्डियाँ, घुटने, BP जीवनभर ध्यान।','जानबूझकर धीमे हों।','वज़न + सैर आपका सूत्र।','वार्षिक जाँच ज़रूरी।'] },
    9: { en:['Inflammation and emotional fatigue are linked for you.','Anti-inflammatory diet (greens, ginger, turmeric) suits you.','Cry when needed — withholding hurts your body.','Service work in moderation — over-giving inflames you.'], hi:['सूजन और भावनात्मक थकान जुड़ी हैं।','सूजन-रोधी भोजन (हरी, अदरक, हल्दी) उपयुक्त।','ज़रूरत पर रोएँ — रोकना शरीर को कष्ट देता है।','सेवा संतुलित रखें — अति देना सूजन देता है।'] },
  },
};

const WARNINGS_EN: Record<PillarKey, string> = {
  career: 'Avoid making big career moves on weeks where your personal-day reduces to your enemy number.',
  love: 'Do not have hard relationship talks during your low-energy hours; the same words land differently in your peak hours.',
  money: 'Avoid signing financial commitments on a date that reduces to your enemy number.',
  health: 'Avoid skipping rest just because you feel fine — your number\'s shadow is silent until it isn\'t.',
};
const WARNINGS_HI: Record<PillarKey, string> = {
  career: 'जिन सप्ताहों में आपका व्यक्तिगत-दिन शत्रु अंक तक घटता है, उनमें बड़े करियर निर्णय न लें।',
  love: 'कम-ऊर्जा घंटों में कठिन रिश्ते की बातें न करें; वही शब्द शिखर घंटों में अलग असर करते हैं।',
  money: 'जो तारीख आपके शत्रु अंक तक घटती हो, उस पर वित्तीय अनुबंध न करें।',
  health: 'अच्छा महसूस होने पर भी विश्राम न छोड़ें — संख्या की छाया चुप होती है, फिर अचानक बोलती है।',
};

const RITUALS_EN: Record<PillarKey, Record<number, string>> = {
  career:  { 1:'Stand 1 min in sunlight before opening your laptop.', 2:'Write 3 priorities before answering any message.', 3:'Voice-record one idea every morning.', 4:'Make tomorrow\'s top-3 list before sleep.', 5:'15 min walk before any major call.', 6:'Light a candle on your desk Monday morning.', 7:'5 min silence before opening email.', 8:'Review one big metric before lunch.', 9:'End each day with one sentence: "what mattered today?"' },
  love:    { 1:'A 6-second hug before leaving the house.', 2:'Send one appreciative line at noon.', 3:'Voice note instead of text — daily.', 4:'Eat one meal together, phone-free.', 5:'Ask "what was new today?" each evening.', 6:'Cook one shared dish weekly.', 7:'10 min eye contact, no words, weekly.', 8:'Praise without correcting — once daily.', 9:'A weekly walk together — no agenda.' },
  money:   { 1:'Open your bank app daily, even briefly.', 2:'Track every expense for 7 days, then breathe.', 3:'Pay yourself first — 10% on payday.', 4:'Review investments monthly, on the 4th.', 5:'No purchases for 24h after a "want" hits.', 6:'Set a sacred household budget on Fridays.', 7:'Donate anonymously every month.', 8:'Write your "enough number" on your wallet.', 9:'Tithe / give consciously each pay cycle.' },
  health:  { 1:'5 sun salutations before phone.', 2:'2 glasses of warm water on waking.', 3:'5 min stretching + humming.', 4:'10 min walk after every meal.', 5:'4-7-8 breath: 3 rounds, twice daily.', 6:'Self-massage with oil, 2x weekly.', 7:'10 min meditation before bed.', 8:'No screens 1 hr before sleep.', 9:'Anti-inflammatory tea: ginger + turmeric daily.' },
};
const RITUALS_HI: Record<PillarKey, Record<number, string>> = {
  career:  { 1:'लैपटॉप खोलने से पहले 1 मिनट धूप में खड़े हों।', 2:'किसी संदेश का उत्तर देने से पहले 3 प्राथमिकताएँ लिखें।', 3:'हर सुबह एक विचार आवाज़ में रिकॉर्ड करें।', 4:'सोने से पहले कल की शीर्ष-3 सूची बनाएँ।', 5:'किसी भी बड़ी कॉल से पहले 15 मिनट सैर।', 6:'सोमवार सुबह डेस्क पर दीप जलाएँ।', 7:'ईमेल खोलने से पहले 5 मिनट मौन।', 8:'दोपहर से पहले एक बड़ा मीट्रिक देखें।', 9:'हर दिन एक वाक्य: "आज क्या मायने रखा?"' },
  love:    { 1:'घर निकलने से पहले 6-सेकंड का आलिंगन।', 2:'दोपहर एक सराहना संदेश भेजें।', 3:'टेक्स्ट के बजाय वॉइस नोट — रोज़।', 4:'एक भोजन साथ, फोन-मुक्त।', 5:'हर शाम पूछें "आज नया क्या था?"', 6:'सप्ताह में एक साझा व्यंजन पकाएँ।', 7:'सप्ताह में 10 मिनट बिना शब्द आँख-संपर्क।', 8:'सुधार किए बिना तारीफ़ — रोज़ एक बार।', 9:'सप्ताह में एक साथ सैर — बिना एजेंडा।' },
  money:   { 1:'रोज़ बैंक ऐप एक बार देखें, संक्षेप में भी।', 2:'7 दिन हर खर्च लिखें, फिर साँस लें।', 3:'वेतन मिलने पर पहले स्वयं को 10% दें।', 4:'हर माह 4 तारीख को निवेश देखें।', 5:'किसी "चाह" के बाद 24 घंटे कोई खरीद नहीं।', 6:'शुक्रवार को घरेलू बजट तय करें।', 7:'हर माह गुप्त दान करें।', 8:'अपना "पर्याप्त अंक" वॉलेट पर लिखें।', 9:'हर वेतन-चक्र में सचेत दान करें।' },
  health:  { 1:'फ़ोन से पहले 5 सूर्य नमस्कार।', 2:'जागते ही 2 गिलास गर्म पानी।', 3:'5 मिनट खिंचाव + भ्रामरी।', 4:'हर भोजन के बाद 10 मिनट सैर।', 5:'4-7-8 श्वास: 3 चक्र, दिन में दो बार।', 6:'सप्ताह में 2 बार स्व-तेल मालिश।', 7:'सोने से पहले 10 मिनट ध्यान।', 8:'सोने से 1 घंटे पहले स्क्रीन बंद।', 9:'सूजन-रोधी चाय: अदरक + हल्दी रोज़।' },
};

export function getDeeperInsight(
  pillar: PillarKey,
  mulank: number,
  bhagyank: number,
  personalYear: number,
  language: 'en' | 'hi' = 'en'
): DeeperInsight {
  const m = singleDigit(mulank);
  const profile = NUMBER_PROFILE[m] || NUMBER_PROFILE[1];
  const weekdays = (language === 'hi' ? WEEKDAYS_HI : WEEKDAYS_EN);

  const emotional = (EMOTIONAL[pillar][m] || EMOTIONAL[pillar][1])[language];
  const expanded  = (EXPANDED[pillar][m]  || EXPANDED[pillar][1])[language];

  return {
    emotional,
    timing: {
      luckyDays: profile.weekdays.map(i => weekdays[i]),
      luckyDates: luckyDates(m),
      peakHours: profile.hours,
      luckyMonths: luckyMonths(personalYear, language),
      luckyColors: profile.colors[language],
      luckyGemstone: profile.gem[language],
      luckyDirection: profile.direction[language],
      avoidDates: avoidDates(m),
    },
    expanded,
    warning: (language === 'hi' ? WARNINGS_HI : WARNINGS_EN)[pillar],
    microRitual: (language === 'hi' ? RITUALS_HI : RITUALS_EN)[pillar][m] || '',
  };
}
