// Combined Astrology + Numerology Intelligence Engine
// Cross-System Synthesis: Integrates authentic Sidereal Vedic Astrology +
// Multi-tradition Numerology (Mulank, Bhagyank, Lo Shu, Compound)
// Rules: Highlights agreements (convergences) & acknowledges divergences with honesty.

import { calculateVedicKundli, VedicKundliProfile } from './vedicAstrologyEngine';
import {
  calculateLifePath,
  calculateDestiny,
  calculateBirthday,
  calculateSoulUrge,
  calculatePersonality,
  calculatePersonalYear,
} from './numerology';
import { calculateLoshuGrid } from './advancedNumerology';

export type LifeTopic =
  | 'career'
  | 'marriage'
  | 'wealth'
  | 'business'
  | 'education'
  | 'foreign'
  | 'health'
  | 'growth'
  | 'all';

export interface CombinedInsight {
  topic: LifeTopic;
  title: { en: string; hi: string; hinglish: string };
  // Level 1: Beginner / Simple Life Meaning
  level1Simple: {
    directAnswer: { en: string; hi: string; hinglish: string };
    whatThisMeans: { en: string; hi: string; hinglish: string };
    timingGuidance: { en: string; hi: string; hinglish: string };
    actionSteps: { en: string[]; hi: string[]; hinglish: string[] };
  };
  // Level 2: The "Why" / Factor Synergy & Divergence
  level2Explanation: {
    synergies: {
      factorAstro: string;
      factorNumero: string;
      theme: string;
      explanation: { en: string; hi: string; hinglish: string };
    }[];
    divergences: {
      factorAstro: string;
      factorNumero: string;
      theme: string;
      explanation: { en: string; hi: string; hinglish: string };
    }[];
    combinedSynthesis: { en: string; hi: string; hinglish: string };
  };
  // Level 3: Technical Structured Data
  level3Technical: {
    vedicKundli: VedicKundliProfile;
    numerologyFacts: {
      mulank: number;
      bhagyank: number;
      destinyNumber: number;
      soulUrge: number;
      personality: number;
      personalYear: number;
      loshuPresent: number[];
      loshuMissing: number[];
    };
    relevantHouses: number[];
    relevantPlanets: string[];
  };
}

export interface CombinedReportProfile {
  fullName: string;
  dob: string;
  birthTime?: string;
  cityName?: string;
  selectedTopics: LifeTopic[];
  insights: CombinedInsight[];
  vedicKundli: VedicKundliProfile;
  numerologyProfile: {
    mulank: number;
    bhagyank: number;
    destinyNumber: number;
    soulUrge: number;
    personality: number;
    personalYear: number;
    loshuGrid: ReturnType<typeof calculateLoshuGrid>;
  };
}

export const LIFE_TOPICS_METADATA: { id: LifeTopic; icon: string; title: { en: string; hi: string; hinglish: string }; subtitle: { en: string; hi: string; hinglish: string } }[] = [
  {
    id: 'career',
    icon: '💼',
    title: { en: 'Career & Purpose', hi: 'करियर और कार्यक्षेत्र', hinglish: 'Career & Purpose' },
    subtitle: { en: 'Job stability, leadership roles, promotion timing', hi: 'नौकरी में स्थिरता, पदोन्नति और सही दिशा', hinglish: 'Job stability aur promotion timing' },
  },
  {
    id: 'marriage',
    icon: '💍',
    title: { en: 'Love & Marriage', hi: 'विवाह और रिश्ते', hinglish: 'Love & Marriage' },
    subtitle: { en: 'Partner compatibility, marriage timing, harmony', hi: 'विवाह का समय, साथी की अनुकूलता और सामंजस्य', hinglish: 'Partner compatibility aur marriage timing' },
  },
  {
    id: 'wealth',
    icon: '💰',
    title: { en: 'Wealth & Money', hi: 'धन और आर्थिक स्थिति', hinglish: 'Wealth & Money' },
    subtitle: { en: 'Financial growth, debt clearance, asset creation', hi: 'धन वृद्धि, कर्ज मुक्ति और संपत्ति के योग', hinglish: 'Financial growth aur asset creation' },
  },
  {
    id: 'business',
    icon: '🏢',
    title: { en: 'Business & Ventures', hi: 'व्यापार और उद्यम', hinglish: 'Business & Ventures' },
    subtitle: { en: 'Startup suitability, partnership luck, expansion', hi: 'व्यवसाय में सफलता, साझेदारी और विस्तार', hinglish: 'Business suitability aur startup luck' },
  },
  {
    id: 'foreign',
    icon: '✈️',
    title: { en: 'Foreign & Relocation', hi: 'विदेश यात्रा और स्थान परिवर्तन', hinglish: 'Foreign & Relocation' },
    subtitle: { en: 'Abroad settlement, visa timing, distant gains', hi: 'विदेश योग, यात्रा और नए स्थान पर सफलता', hinglish: 'Abroad settlement aur visa timing' },
  },
  {
    id: 'growth',
    icon: '🌱',
    title: { en: 'Personal Growth & Health', hi: 'आत्म-विकास और स्वास्थ्य', hinglish: 'Personal Growth & Health' },
    subtitle: { en: 'Mental clarity, vitality, overcoming hurdles', hi: 'मानसिक शांति, ऊर्जा और बाधाओं से मुक्ति', hinglish: 'Mental clarity aur vitality' },
  },
  {
    id: 'all',
    icon: '🔮',
    title: { en: 'Complete Life Blueprint', hi: 'संपूर्ण जीवन ब्लूप्रिंट', hinglish: 'Complete Life Blueprint' },
    subtitle: { en: 'Comprehensive 360° Vedic + Numerology analysis', hi: 'सभी क्षेत्रों का संपूर्ण समग्र विश्लेषण', hinglish: 'Sabhi life areas ka 360° deep reading' },
  },
];

// Helper to synthesize a single life topic
function synthesizeTopic(
  topic: LifeTopic,
  vedic: VedicKundliProfile,
  numero: {
    mulank: number;
    bhagyank: number;
    destinyNumber: number;
    soulUrge: number;
    personalYear: number;
    loshu: ReturnType<typeof calculateLoshuGrid>;
  }
): CombinedInsight {
  const planetMap = new Map(vedic.planets.map(p => [p.planet, p]));
  const house10 = vedic.houses.find(h => h.houseNumber === 10);
  const house7 = vedic.houses.find(h => h.houseNumber === 7);
  const house2 = vedic.houses.find(h => h.houseNumber === 2);
  const house11 = vedic.houses.find(h => h.houseNumber === 11);
  const house12 = vedic.houses.find(h => h.houseNumber === 12);
  const saturn = planetMap.get('Saturn');
  const jupiter = planetMap.get('Jupiter');
  const venus = planetMap.get('Venus');
  const sun = planetMap.get('Sun');
  const mars = planetMap.get('Mars');
  const mercury = planetMap.get('Mercury');

  const { mulank, bhagyank, personalYear, loshu } = numero;
  const currentDashaLord = vedic.currentDasha.mahadasha;

  if (topic === 'career') {
    const isDisciplined = [8, 4].includes(mulank) || (saturn && [1, 10].includes(saturn.house));
    const isLeadership = [1, 9].includes(mulank) || (sun && [1, 10].includes(sun.house));

    return {
      topic: 'career',
      title: { en: 'Career & Professional Path', hi: 'करियर और व्यावसायिक दिशा', hinglish: 'Career & Professional Path' },
      level1Simple: {
        directAnswer: {
          en: isLeadership
            ? 'Your chart shows a natural orientation toward executive authority, independent initiative, and creating structured impact.'
            : isDisciplined
            ? 'Your career manifests through steady consistency, long-term mastery, and structured perseverance rather than sudden shortcuts.'
            : 'Your professional growth flourishes when combining intellectual versatility with strong communicative roles.',
          hi: isLeadership
            ? 'आपकी कुंडली और अंक संकेत करते हैं कि आप नेतृत्व, स्वतंत्र निर्णय और उच्च जिम्मेदारी के पदों में सर्वश्रेष्ठ प्रदर्शन करते हैं।'
            : isDisciplined
            ? 'आपका करियर निरंतर धैर्य, व्यवस्थित प्रयास और दीर्घकालिक विशेषज्ञता से मजबूत होगा।'
            : 'आपकी व्यावसायिक सफलता बौद्धिक गतिशीलता और संवाद-आधारित कार्यों में निहित है।',
          hinglish: isLeadership
            ? 'Aapka chart executive authority aur independent initiatives ke liye strong support show karta hai.'
            : isDisciplined
            ? 'Aapka career steady consistency aur long-term mastery se build hoga, shortcuts se nahi.'
            : 'Aapka professional path intellectual versatility aur strong communication me flourish karega.',
        },
        whatThisMeans: {
          en: `You are currently in a Personal Year ${personalYear} vibration under ${currentDashaLord} Mahadasha. This highlights strategic skill consolidation and targeted professional expansion.`,
          hi: `वर्तमान में आप पर्सनल ईयर ${personalYear} और ${currentDashaLord} महादशा के प्रभाव में हैं, जो कार्यक्षेत्र में नई जिम्मेदारियों और रणनीतिक विस्तार का संकेत देती है।`,
          hinglish: `Aap current Personal Year ${personalYear} aur ${currentDashaLord} Mahadasha me hain, jo strategic consolidation aur career expansion ko favor karta hai.`,
        },
        timingGuidance: {
          en: `Key career turning points align with your upcoming ${vedic.currentDasha.antardasha} sub-period and Personal Year ${(personalYear % 9) + 1}.`,
          hi: `आगामी ${vedic.currentDasha.antardasha} अंतर्दशा आपके करियर में नए अवसरों का मुख्य केंद्र बनेगी।`,
          hinglish: `Upcoming ${vedic.currentDasha.antardasha} sub-period career transitions ke liye key timing window hai.`,
        },
        actionSteps: {
          en: [
            'Consolidate core technical mastery before seeking sudden lateral shifts.',
            'Build documented credibility and visible ownership in your current role.',
            'Align major career changes with favorable dasha intervals.',
          ],
          hi: [
            'अचानक बदलाव के बजाय अपनी विशेषज्ञता को मजबूत करें।',
            'अपने कार्यक्षेत्र में स्पष्ट परिणाम और विश्वसनीयता स्थापित करें।',
            'महत्वपूर्ण निर्णयों को अनुकूल ग्रह गोचर और दशा के अनुसार आगे बढ़ाएं।',
          ],
          hinglish: [
            'Sudden shifts ki jagah core expertise consolidate karein.',
            'Current role me visible ownership aur credibility build karein.',
            'Major career moves ko favorable timing windows ke saath align karein.',
          ],
        },
      },
      level2Explanation: {
        synergies: [
          {
            factorAstro: `10th House ruled by ${house10?.rulingPlanet} with ${house10?.planetsPresent.join(', ') || 'steady aspect'}`,
            factorNumero: `Mulank ${mulank} (Psychic Driver) & Bhagyank ${bhagyank}`,
            theme: 'Professional Drive & Execution',
            explanation: {
              en: `Both systems agree that your primary professional drive works through ${isLeadership ? 'autonomous initiative' : 'disciplined method'}.`,
              hi: `दोनों प्रणालियां इस बात की पुष्टि करती हैं कि आपकी कार्यशैली ${isLeadership ? 'नेतृत्व' : 'व्यवस्थित अनुशासन'} पर आधारित है।`,
              hinglish: `Dono systems agree karte hain ki aapka core professional drive ${isLeadership ? 'leadership' : 'structured method'} pe rely karta hai.`,
            },
          },
        ],
        divergences: [
          {
            factorAstro: `${currentDashaLord} Mahadasha in 10th/11th transit`,
            factorNumero: `Personal Year ${personalYear} cycle`,
            theme: 'Pacing vs Urgency',
            explanation: {
              en: 'Numerology indicates an internal readiness for rapid progress, while your Vedic Dasha emphasizes thorough groundwork and patient timing.',
              hi: 'अंकशास्त्र त्वरित प्रगति की आंतरिक इच्छा दर्शाता है, जबकि वैदिक दशा धैर्य और ठोस तैयारी की मांग करती है।',
              hinglish: 'Numerology internal urgency suggest karta hai jabki Vedic dasha grounded patience demand karti hai.',
            },
          },
        ],
        combinedSynthesis: {
          en: 'Treat this duality as balance: maintain internal ambition while respecting the external timing cycle.',
          hi: 'इस अंतर को संतुलन के रूप में देखें: आंतरिक महत्वाकांक्षा बनाए रखें और सही समय का सम्मान करें।',
          hinglish: 'Is duality ko balance ki tarah use karein: ambition retain karein par timing cycle ka respect karein.',
        },
      },
      level3Technical: {
        vedicKundli: vedic,
        numerologyFacts: {
          mulank,
          bhagyank,
          destinyNumber: numero.destinyNumber,
          soulUrge: numero.soulUrge,
          personality: 0,
          personalYear,
          loshuPresent: loshu.presentNumbers,
          loshuMissing: loshu.missingNumbers,
        },
        relevantHouses: [1, 10, 11, 6],
        relevantPlanets: ['Sun', 'Saturn', 'Mercury', currentDashaLord],
      },
    };
  }

  if (topic === 'marriage') {
    return {
      topic: 'marriage',
      title: { en: 'Love & Relationship Dynamics', hi: 'विवाह और संबंध सामंजस्य', hinglish: 'Love & Relationship Dynamics' },
      level1Simple: {
        directAnswer: {
          en: 'Your relationship archetype values emotional depth, intellectual respect, and clear mutual loyalty.',
          hi: 'आपके संबंधों का मूल आधार भावनात्मक गहराई, बौद्धिक सम्मान और स्पष्ट निष्ठा पर निर्भर करता है।',
          hinglish: 'Aapka relationship archetype emotional depth, mutual respect aur clear loyalty pe depend karta hai.',
        },
        whatThisMeans: {
          en: `Venus and the 7th house (${house7?.sign}) indicate that harmony is built when both partners honor individual boundaries while communicating openly.`,
          hi: `शुक्र और सप्तम भाव (${house7?.sign}) स्पष्ट करते हैं कि सामंजस्य तब गहरा होता है जब दोनों साथी एक-दूसरे की सीमाओं का सम्मान करते हैं।`,
          hinglish: `Venus aur 7th house (${house7?.sign}) indicate karte hain ki communication clarity aur respect se harmony deepen hoti hai.`,
        },
        timingGuidance: {
          en: 'Relationship strengthening and commitment decisions are strongly supported during favorable Venus transits and Personal Years 2, 6, and 9.',
          hi: 'संबंधों में स्थिरता और विवाह के लिए पर्सनल ईयर 2, 6 और 9 का चक्र अत्यंत फलदायी है।',
          hinglish: 'Relationship commitment ke liye Personal Year 2, 6 aur 9 favorable windows create karte hain.',
        },
        actionSteps: {
          en: [
            'Practice active emotional validation before solving logistical differences.',
            'Clarify long-term lifestyle expectations early.',
            'Cultivate shared creative or cultural interests.',
          ],
          hi: [
            'समस्या समाधान से पहले साथी की भावनाओं को समझें और स्वीकार करें।',
            'भविष्य की प्राथमिकताओं पर खुलकर संवाद करें।',
            'साझा रचनात्मक या आध्यात्मिक रुचियों को बढ़ावा दें।',
          ],
          hinglish: [
            'Logistical issues solve karne se pehle partner ko emotional validation dein.',
            'Long-term expectations pe open dialogue rakhein.',
            'Shared creative ya wellness habits adopt karein.',
          ],
        },
      },
      level2Explanation: {
        synergies: [
          {
            factorAstro: `7th House (${house7?.sign}) ruled by ${house7?.rulingPlanet}`,
            factorNumero: `Soul Urge ${numero.soulUrge} & Mulank ${mulank}`,
            theme: 'Emotional Resonance',
            explanation: {
              en: 'Both systems emphasize that your core happiness in relationships depends on intellectual and emotional safety.',
              hi: 'दोनों प्रणालियां स्पष्ट करती हैं कि आपके संबंधों का आधार बौद्धिक और भावनात्मक सुरक्षा है।',
              hinglish: 'Dono systems agree karte hain ki emotional safety aapka prime relationship foundation hai.',
            },
          },
        ],
        divergences: [],
        combinedSynthesis: {
          en: 'Focus on quality over speed in emotional commitments.',
          hi: 'रिश्तों में जल्दबाजी के बजाय स्थिरता और गुणवत्ता को प्राथमिकता दें।',
          hinglish: 'Speed ke bajaye quality connection ko priority dein.',
        },
      },
      level3Technical: {
        vedicKundli: vedic,
        numerologyFacts: {
          mulank,
          bhagyank,
          destinyNumber: numero.destinyNumber,
          soulUrge: numero.soulUrge,
          personality: 0,
          personalYear,
          loshuPresent: loshu.presentNumbers,
          loshuMissing: loshu.missingNumbers,
        },
        relevantHouses: [7, 2, 4, 12],
        relevantPlanets: ['Venus', 'Jupiter', 'Moon'],
      },
    };
  }

  // Default General / Complete Life Blueprint
  return {
    topic: topic,
    title: { en: 'Comprehensive Life & Purpose Blueprint', hi: 'संपूर्ण जीवन ब्लूप्रिंट', hinglish: 'Comprehensive Life Blueprint' },
    level1Simple: {
      directAnswer: {
        en: `Your life blueprint is anchored by ${vedic.lagna.sign} Ascendant (Lagna) and Mulank ${mulank} with Bhagyank ${bhagyank}. You carry strong innate capabilities for purposeful growth and resilience.`,
        hi: `आपकी जन्म कुंडली में ${vedic.lagna.sign} लग्न और अंकशास्त्र में मूलांक ${mulank} व भाग्यांक ${bhagyank} का संयोग आपके जीवन में दृढ़ संकल्प और निरंतर प्रगति का मार्ग प्रशस्त करता है।`,
        hinglish: `Aapka cosmic blueprint ${vedic.lagna.sign} Lagna aur Mulank ${mulank} / Bhagyank ${bhagyank} ke powerful combination se guided hai.`,
      },
      whatThisMeans: {
        en: `Your Vedic Moon sign in ${vedic.moonSignVedic.sign} (${vedic.moonSignVedic.nakshatra} Nakshatra) guides your inner emotional compass, while your numerology Lo Shu grid reveals your core action planes.`,
        hi: `आपका चंद्र नक्षत्र ${vedic.moonSignVedic.nakshatra} आपकी आंतरिक सोच को दिशा देता है, और लो-शू ग्रिड आपकी व्यावहारिक क्षमता को उजागर करता है।`,
        hinglish: `Moon sign in ${vedic.moonSignVedic.sign} aapka emotional compass hai jabki Lo Shu grid practical execution capacity represent karta hai.`,
      },
      timingGuidance: {
        en: `Currently running ${vedic.currentDasha.mahadasha} Mahadasha and Personal Year ${personalYear}. This is a constructive cycle for long-term foundation building.`,
        hi: `वर्तमान ${vedic.currentDasha.mahadasha} महादशा और पर्सनल ईयर ${personalYear} दीर्घकालिक स्थिरता के निर्माण का काल है।`,
        hinglish: `Current ${vedic.currentDasha.mahadasha} Mahadasha aur Personal Year ${personalYear} long-term foundation create karne ka cycle hai.`,
      },
      actionSteps: {
        en: [
          'Align major life initiatives with your natural planetary and numerological cycles.',
          'Focus on balancing physical vitality with mental clarity.',
          'Review your upcoming dasha milestones for planned transformations.',
        ],
        hi: [
          'महत्वपूर्ण निर्णयों को अपनी अनुकूल समय अवधि के साथ जोड़ें।',
          'मानसिक शांति और शारीरिक ऊर्जा के संतुलन पर ध्यान दें।',
          'आगामी दशा परिवर्तनों के अनुसार अपनी रणनीतियों की योजना बनाएं।',
        ],
        hinglish: [
          'Major decisions ko apne natural cycles ke saath align karein.',
          'Mental clarity aur physical vitality ka balance banaye rakhein.',
          'Upcoming dasha transitions ko track karein.',
        ],
      },
    },
    level2Explanation: {
      synergies: [
        {
          factorAstro: `Lagna (${vedic.lagna.sign}) & Lagna Nakshatra (${vedic.lagna.nakshatra})`,
          factorNumero: `Mulank ${mulank} & Lo Shu Grid Patterns`,
          theme: 'Core Personality Integration',
          explanation: {
            en: 'Your outer presentation and inner numeric driver work in unison when you embrace structured discipline.',
            hi: 'आपका व्यक्तित्व और मूलांक तब सर्वश्रेष्ठ परिणाम देते हैं जब आप अनुशासन और एकाग्रता अपनाते हैं।',
            hinglish: 'Aapka outer personality aur inner psychic driver structured discipline me perfectly sync karte hain.',
          },
        },
      ],
      divergences: [],
      combinedSynthesis: {
        en: 'Harness the synergy of both systems to maximize your authentic potential.',
        hi: 'दोनों विधाओं के संयुक्त ज्ञान का उपयोग करके अपने जीवन को सही दिशा दें।',
        hinglish: 'Dono systems ke combined insights se apni real potential unlock karein.',
      },
    },
    level3Technical: {
      vedicKundli: vedic,
      numerologyFacts: {
        mulank,
        bhagyank,
        destinyNumber: numero.destinyNumber,
        soulUrge: numero.soulUrge,
        personality: 0,
        personalYear,
        loshuPresent: loshu.presentNumbers,
        loshuMissing: loshu.missingNumbers,
      },
      relevantHouses: [1, 5, 9, 10],
      relevantPlanets: ['Sun', 'Moon', 'Jupiter', vedic.currentDasha.mahadasha],
    },
  };
}

// MAIN EXPORTED FUNCTION: Synthesize Astrology + Numerology
export function generateCombinedReport(
  fullName: string,
  dob: string,
  birthTime?: string,
  cityName?: string,
  selectedTopics: LifeTopic[] = ['career'],
  timeIsUnknown: boolean = false
): CombinedReportProfile {
  // 1. Calculate Authentic Vedic Kundli
  const vedicKundli = calculateVedicKundli(dob, birthTime, cityName, timeIsUnknown);

  // 2. Calculate Numerology Profile
  const mulank = calculateBirthday(dob);
  const bhagyank = calculateLifePath(dob);
  const destinyNumber = calculateDestiny(fullName);
  const soulUrge = calculateSoulUrge(fullName);
  const personality = calculatePersonality(fullName);
  const personalYear = calculatePersonalYear(dob);
  const loshuGrid = calculateLoshuGrid(dob);

  const numero = {
    mulank,
    bhagyank,
    destinyNumber,
    soulUrge,
    personalYear,
    loshu: loshuGrid,
  };

  // 3. Generate Insights for each selected topic
  const insights: CombinedInsight[] = [];
  const topicsToProcess = selectedTopics.length > 0 ? selectedTopics : (['career'] as LifeTopic[]);

  for (const t of topicsToProcess) {
    insights.push(synthesizeTopic(t, vedicKundli, numero));
  }

  return {
    fullName,
    dob,
    birthTime,
    cityName,
    selectedTopics: topicsToProcess,
    insights,
    vedicKundli,
    numerologyProfile: {
      mulank,
      bhagyank,
      destinyNumber,
      soulUrge,
      personality,
      personalYear,
      loshuGrid,
    },
  };
}
