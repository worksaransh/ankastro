// Numerology Glossary with trilingual support

export interface GlossaryTerm {
  term: {
    en: string;
    hi: string;
    hinglish: string;
  };
  definition: {
    en: string;
    hi: string;
    hinglish: string;
  };
  shortDef: {
    en: string;
    hi: string;
    hinglish: string;
  };
}

export const glossaryTerms: Record<string, GlossaryTerm> = {
  lifePath: {
    term: {
      en: "Life Path Number",
      hi: "जीवन पथ संख्या",
      hinglish: "Life Path Number"
    },
    definition: {
      en: "The most important number in your numerology chart. It reveals your life's purpose, the path you're meant to walk, and the lessons you'll learn along the way. Calculated from your complete date of birth.",
      hi: "आपके अंकशास्त्र चार्ट में सबसे महत्वपूर्ण संख्या। यह आपके जीवन के उद्देश्य, आपके मार्ग और रास्ते में आने वाले सबक को प्रकट करती है। आपकी पूर्ण जन्म तिथि से गणना की जाती है।",
      hinglish: "Aapki numerology chart mein sabse important number. Yeh batata hai ki aapka life purpose kya hai, aapko kis path pe chalna hai, aur kya lessons seekhne hain. Birth date se calculate hota hai."
    },
    shortDef: {
      en: "Your soul's chosen journey",
      hi: "आपकी आत्मा की चुनी हुई यात्रा",
      hinglish: "Aapki soul ka chosen journey"
    }
  },
  destiny: {
    term: {
      en: "Destiny Number",
      hi: "भाग्य संख्या",
      hinglish: "Destiny Number"
    },
    definition: {
      en: "Also known as Expression Number. It reveals what you're destined to achieve in this lifetime and the talents you were born with. Calculated from the letters in your full birth name.",
      hi: "अभिव्यक्ति संख्या के रूप में भी जाना जाता है। यह प्रकट करता है कि आप इस जीवनकाल में क्या हासिल करने के लिए नियत हैं और आप किन प्रतिभाओं के साथ पैदा हुए थे।",
      hinglish: "Expression Number bhi kehte hain. Yeh batata hai ki aap is life mein kya achieve karne ke liye destined ho aur kaunse talents leke aaye ho. Full birth name se calculate hota hai."
    },
    shortDef: {
      en: "Your purpose blueprint",
      hi: "आपका उद्देश्य ब्लूप्रिंट",
      hinglish: "Aapka purpose ka blueprint"
    }
  },
  soulUrge: {
    term: {
      en: "Soul Urge Number",
      hi: "आत्मा की इच्छा संख्या",
      hinglish: "Soul Urge Number"
    },
    definition: {
      en: "Also called Heart's Desire Number. It reveals your innermost desires, what truly motivates you, and what your soul craves. Calculated from the vowels in your name.",
      hi: "हृदय की इच्छा संख्या भी कहते हैं। यह आपकी अंतरतम इच्छाओं को प्रकट करता है, जो वास्तव में आपको प्रेरित करता है, और आपकी आत्मा क्या चाहती है।",
      hinglish: "Heart's Desire Number bhi kehte hain. Yeh batata hai ki andar se aap kya chahte ho, kya cheez aapko motivate karti hai, aur soul ko kya chahiye. Name ke vowels se calculate hota hai."
    },
    shortDef: {
      en: "Your emotional truth",
      hi: "आपकी भावनात्मक सच्चाई",
      hinglish: "Aapki emotional truth"
    }
  },
  personality: {
    term: {
      en: "Personality Number",
      hi: "व्यक्तित्व संख्या",
      hinglish: "Personality Number"
    },
    definition: {
      en: "How others perceive you - your outer personality and the first impression you make. It's the mask you wear in public. Calculated from the consonants in your name.",
      hi: "दूसरे आपको कैसे देखते हैं - आपका बाहरी व्यक्तित्व और आपकी पहली छाप। यह वह मुखौटा है जो आप सार्वजनिक रूप से पहनते हैं।",
      hinglish: "Dusre log aapko kaise dekhte hain - aapka outer personality aur first impression. Yeh woh mask hai jo aap public mein pehnte ho. Name ke consonants se calculate hota hai."
    },
    shortDef: {
      en: "Your social mask",
      hi: "आपका सामाजिक मुखौटा",
      hinglish: "Aapka social mask"
    }
  },
  mulank: {
    term: {
      en: "Mulank (Birth Number)",
      hi: "मूलांक (जन्मांक)",
      hinglish: "Mulank (Birth Number)"
    },
    definition: {
      en: "Your birth date reduced to a single digit (1-9) or master number. In Vedic numerology, this represents your core identity, natural instincts, and the energy you carry from birth.",
      hi: "आपकी जन्म तिथि को एकल अंक (1-9) या मास्टर नंबर में बदला जाता है। वैदिक अंकशास्त्र में, यह आपकी मूल पहचान, प्राकृतिक प्रवृत्ति और जन्म से आपकी ऊर्जा का प्रतिनिधित्व करता है।",
      hinglish: "Aapki birth date ko single digit (1-9) ya master number mein convert karte hain. Vedic numerology mein, yeh aapki core identity, natural instincts, aur birth se aapki energy ko represent karta hai."
    },
    shortDef: {
      en: "Your birth energy",
      hi: "आपकी जन्म ऊर्जा",
      hinglish: "Aapki birth energy"
    }
  },
  bhagyank: {
    term: {
      en: "Bhagyank (Destiny Number)",
      hi: "भाग्यांक",
      hinglish: "Bhagyank (Destiny Number)"
    },
    definition: {
      en: "The sum of your complete birth date (day + month + year) reduced to a single digit. In Vedic numerology, this reveals your life's karmic purpose and the destiny you're meant to fulfill.",
      hi: "आपकी पूर्ण जन्म तिथि (दिन + महीना + वर्ष) का योग एकल अंक में। वैदिक अंकशास्त्र में, यह आपके जीवन के कार्मिक उद्देश्य और आपकी नियति को प्रकट करता है।",
      hinglish: "Aapki complete birth date (din + month + year) ka sum single digit mein. Vedic numerology mein, yeh aapke life ka karmic purpose aur destiny batata hai jo aapko fulfill karni hai."
    },
    shortDef: {
      en: "Your destiny outcome",
      hi: "आपका भाग्य परिणाम",
      hinglish: "Aapka destiny outcome"
    }
  },
  karmicDebt: {
    term: {
      en: "Karmic Debt Numbers",
      hi: "कार्मिक ऋण संख्याएं",
      hinglish: "Karmic Debt Numbers"
    },
    definition: {
      en: "Numbers 13, 14, 16, and 19 indicate karmic debts from past lives that need to be resolved in this lifetime. They represent challenges that offer profound growth opportunities.",
      hi: "संख्या 13, 14, 16, और 19 पिछले जन्मों के कार्मिक ऋणों को इंगित करती हैं जिन्हें इस जीवनकाल में हल करने की आवश्यकता है। वे चुनौतियों का प्रतिनिधित्व करती हैं जो गहन विकास के अवसर प्रदान करती हैं।",
      hinglish: "Numbers 13, 14, 16, aur 19 past lives se karmic debts indicate karte hain jo is life mein resolve karne hain. Yeh challenges ko represent karte hain jo deep growth opportunities dete hain."
    },
    shortDef: {
      en: "Past life lessons to resolve",
      hi: "हल करने के लिए पिछले जन्म के सबक",
      hinglish: "Past life ke lessons jo resolve karne hain"
    }
  },
  karmicLessons: {
    term: {
      en: "Karmic Lessons",
      hi: "कार्मिक सबक",
      hinglish: "Karmic Lessons"
    },
    definition: {
      en: "Numbers missing from your name indicate areas where you need to develop skills or learn lessons. These are your growth edges in this lifetime.",
      hi: "आपके नाम से गायब संख्याएं उन क्षेत्रों को इंगित करती हैं जहां आपको कौशल विकसित करने या सबक सीखने की आवश्यकता है। ये इस जीवनकाल में आपके विकास के किनारे हैं।",
      hinglish: "Aapke naam mein jo numbers missing hain, woh areas batate hain jahan aapko skills develop karne hain ya lessons seekhne hain. Yeh aapke growth edges hain is life mein."
    },
    shortDef: {
      en: "Missing skills to develop",
      hi: "विकसित करने के लिए गायब कौशल",
      hinglish: "Missing skills jo develop karne hain"
    }
  },
  loshuGrid: {
    term: {
      en: "Loshu Grid",
      hi: "लोशु ग्रिड",
      hinglish: "Loshu Grid"
    },
    definition: {
      en: "An ancient Chinese 3x3 magic square used in numerology to analyze the distribution of numbers in your birth date. Missing or repeated numbers reveal personality traits, strengths, and weaknesses.",
      hi: "अंकशास्त्र में आपकी जन्म तिथि में संख्याओं के वितरण का विश्लेषण करने के लिए उपयोग किया जाने वाला एक प्राचीन चीनी 3x3 जादुई वर्ग। गायब या दोहराई गई संख्याएं व्यक्तित्व लक्षण, ताकत और कमजोरियों को प्रकट करती हैं।",
      hinglish: "Ek ancient Chinese 3x3 magic square jo numerology mein aapki birth date ke numbers ka distribution analyze karta hai. Missing ya repeated numbers personality traits, strengths, aur weaknesses batate hain."
    },
    shortDef: {
      en: "Energy distribution map",
      hi: "ऊर्जा वितरण मानचित्र",
      hinglish: "Energy distribution ka map"
    }
  },
  pinnacle: {
    term: {
      en: "Pinnacle Cycles",
      hi: "शिखर चक्र",
      hinglish: "Pinnacle Cycles"
    },
    definition: {
      en: "Four major life phases that each last several years. Each pinnacle brings specific themes, opportunities, and challenges. Understanding them helps you navigate life transitions.",
      hi: "चार प्रमुख जीवन चरण जो प्रत्येक कई वर्षों तक चलते हैं। प्रत्येक शिखर विशिष्ट विषय, अवसर और चुनौतियां लाता है। उन्हें समझने से आपको जीवन परिवर्तनों को नेविगेट करने में मदद मिलती है।",
      hinglish: "4 major life phases jo kayi saal tak chalte hain. Har pinnacle specific themes, opportunities, aur challenges lata hai. Inhe samajhne se life transitions navigate karne mein help milti hai."
    },
    shortDef: {
      en: "Life phase timeline",
      hi: "जीवन चरण समय रेखा",
      hinglish: "Life phase ki timeline"
    }
  },
  chakra: {
    term: {
      en: "Chakra",
      hi: "चक्र",
      hinglish: "Chakra"
    },
    definition: {
      en: "Energy centers in the body according to ancient traditions. In numerology, different numbers influence different chakras, affecting your energy balance and wellbeing (non-medical guidance).",
      hi: "प्राचीन परंपराओं के अनुसार शरीर में ऊर्जा केंद्र। अंकशास्त्र में, विभिन्न संख्याएं विभिन्न चक्रों को प्रभावित करती हैं, आपकी ऊर्जा संतुलन और कल्याण को प्रभावित करती हैं (गैर-चिकित्सा मार्गदर्शन)।",
      hinglish: "Ancient traditions ke according body mein energy centers. Numerology mein, alag numbers alag chakras ko influence karte hain, aapki energy balance aur wellbeing ko affect karte hain (non-medical guidance)."
    },
    shortDef: {
      en: "Energy center",
      hi: "ऊर्जा केंद्र",
      hinglish: "Energy center"
    }
  },
  masterNumber: {
    term: {
      en: "Master Numbers",
      hi: "मास्टर नंबर",
      hinglish: "Master Numbers"
    },
    definition: {
      en: "The numbers 11, 22, and 33 carry intensified spiritual energy and potential. They're not reduced to single digits because they represent higher octaves of their base numbers with greater life purposes.",
      hi: "संख्या 11, 22, और 33 तीव्र आध्यात्मिक ऊर्जा और क्षमता रखती हैं। उन्हें एकल अंकों में कम नहीं किया जाता क्योंकि वे अधिक जीवन उद्देश्यों के साथ अपने आधार संख्याओं के उच्च सप्तक का प्रतिनिधित्व करती हैं।",
      hinglish: "Numbers 11, 22, aur 33 intense spiritual energy aur potential carry karte hain. Inhe single digits mein reduce nahi karte kyunki yeh apne base numbers ke higher octaves represent karte hain with greater life purposes."
    },
    shortDef: {
      en: "High spiritual potential numbers",
      hi: "उच्च आध्यात्मिक क्षमता संख्याएं",
      hinglish: "High spiritual potential wale numbers"
    }
  },
  naamank: {
    term: {
      en: "Naamank (Name Energy)",
      hi: "नामांक (नाम संख्या)",
      hinglish: "Naamank (Name Energy)"
    },
    definition: {
      en: "Calculated from your spelling, representing your public projection, magnetic resonance with others, and how the world responds to you.",
      hi: "आपकी वर्तनी से गणना की जाती है, जो आपके सार्वजनिक प्रक्षेपण, दूसरों के साथ चुंबकीय प्रतिध्वनि और दुनिया आपके प्रति कैसी प्रतिक्रिया देती है, का प्रतिनिधित्व करता है।",
      hinglish: "Spelling se calculate hota hai. Yeh aapka public projection, magnetic resonance, aur duniya aapko kaise treat karegi, yeh represent karta hai."
    },
    shortDef: {
      en: "Your public projection energy",
      hi: "आपकी सार्वजनिक प्रक्षेपण ऊर्जा",
      hinglish: "Aapki public projection energy"
    }
  }
};

export type GlossaryKey = keyof typeof glossaryTerms;
