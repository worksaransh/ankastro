// Astrology Lite Engine - Sun/Moon/Rising Sign Calculations
// Based on DOB + Birth Time + Birth Location

export interface AstrologyProfile {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  planetaryInfluences: PlanetaryInfluence[];
  astroCompatibility?: AstroCompatibility;
}

export interface ZodiacSign {
  sign: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  rulingPlanet: string;
  description: {
    en: string;
    hi: string;
    hinglish: string;
  };
  traits: {
    en: string[];
    hi: string[];
    hinglish: string[];
  };
  challenge: {
    challenge: { en: string; hi: string; hinglish: string };
    reason: { en: string; hi: string; hinglish: string };
    solution: { en: string; hi: string; hinglish: string };
  };
}

export interface PlanetaryInfluence {
  planet: string;
  symbol: string;
  theme: { en: string; hi: string; hinglish: string };
  influence: { en: string; hi: string; hinglish: string };
  guidance: { en: string; hi: string; hinglish: string };
}

export interface AstroCompatibility {
  partnerSunSign: ZodiacSign;
  partnerMoonSign: ZodiacSign;
  sunSynergy: number; // 0-100
  moonSynergy: number; // 0-100
  overallScore: number;
  strengths: { en: string[]; hi: string[]; hinglish: string[] };
  challenges: { en: string[]; hi: string[]; hinglish: string[] };
  communicationBridge: { en: string; hi: string; hinglish: string };
}

// Zodiac Signs Data
const zodiacSigns: Record<string, Omit<ZodiacSign, 'challenge'>> = {
  aries: {
    sign: 'Aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    description: {
      en: 'The pioneer and warrior. Bold, energetic, and always ready to lead.',
      hi: 'अग्रदूत और योद्धा। साहसी, ऊर्जावान, और हमेशा नेतृत्व करने को तैयार।',
      hinglish: 'Pioneer aur warrior. Bold, energetic, aur hamesha lead karne ko ready.'
    },
    traits: {
      en: ['Courageous', 'Confident', 'Enthusiastic', 'Impulsive', 'Competitive'],
      hi: ['साहसी', 'आत्मविश्वासी', 'उत्साही', 'आवेगी', 'प्रतिस्पर्धी'],
      hinglish: ['Courageous', 'Confident', 'Enthusiastic', 'Impulsive', 'Competitive']
    }
  },
  taurus: {
    sign: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    description: {
      en: 'The builder and stabilizer. Patient, reliable, and devoted to comfort.',
      hi: 'निर्माता और स्थिरता देने वाला। धैर्यवान, विश्वसनीय, और आराम के प्रति समर्पित।',
      hinglish: 'Builder aur stabilizer. Patient, reliable, aur comfort ke prati devoted.'
    },
    traits: {
      en: ['Patient', 'Reliable', 'Practical', 'Stubborn', 'Sensual'],
      hi: ['धैर्यवान', 'विश्वसनीय', 'व्यावहारिक', 'जिद्दी', 'संवेदनशील'],
      hinglish: ['Patient', 'Reliable', 'Practical', 'Stubborn', 'Sensual']
    }
  },
  gemini: {
    sign: 'Gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    description: {
      en: 'The communicator and learner. Curious, adaptable, and intellectually agile.',
      hi: 'संवादक और सीखने वाला। जिज्ञासु, अनुकूलनशील, और बौद्धिक रूप से तेज।',
      hinglish: 'Communicator aur learner. Curious, adaptable, aur intellectually agile.'
    },
    traits: {
      en: ['Curious', 'Adaptable', 'Witty', 'Restless', 'Expressive'],
      hi: ['जिज्ञासु', 'अनुकूलनशील', 'हाजिरजवाब', 'बेचैन', 'अभिव्यक्तिशील'],
      hinglish: ['Curious', 'Adaptable', 'Witty', 'Restless', 'Expressive']
    }
  },
  cancer: {
    sign: 'Cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    description: {
      en: 'The nurturer and protector. Emotional, intuitive, and deeply caring.',
      hi: 'पालनकर्ता और रक्षक। भावनात्मक, अंतर्ज्ञानी, और गहरी देखभाल करने वाला।',
      hinglish: 'Nurturer aur protector. Emotional, intuitive, aur deeply caring.'
    },
    traits: {
      en: ['Nurturing', 'Intuitive', 'Protective', 'Moody', 'Sentimental'],
      hi: ['पालनकारी', 'अंतर्ज्ञानी', 'सुरक्षात्मक', 'मूडी', 'भावुक'],
      hinglish: ['Nurturing', 'Intuitive', 'Protective', 'Moody', 'Sentimental']
    }
  },
  leo: {
    sign: 'Leo',
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    description: {
      en: 'The king and performer. Generous, creative, and naturally charismatic.',
      hi: 'राजा और कलाकार। उदार, रचनात्मक, और स्वाभाविक रूप से करिश्माई।',
      hinglish: 'King aur performer. Generous, creative, aur naturally charismatic.'
    },
    traits: {
      en: ['Generous', 'Creative', 'Charismatic', 'Dramatic', 'Proud'],
      hi: ['उदार', 'रचनात्मक', 'करिश्माई', 'नाटकीय', 'गर्वीला'],
      hinglish: ['Generous', 'Creative', 'Charismatic', 'Dramatic', 'Proud']
    }
  },
  virgo: {
    sign: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    description: {
      en: 'The analyst and healer. Detail-oriented, practical, and service-driven.',
      hi: 'विश्लेषक और उपचारक। विस्तार-उन्मुख, व्यावहारिक, और सेवा-संचालित।',
      hinglish: 'Analyst aur healer. Detail-oriented, practical, aur service-driven.'
    },
    traits: {
      en: ['Analytical', 'Practical', 'Helpful', 'Critical', 'Perfectionist'],
      hi: ['विश्लेषणात्मक', 'व्यावहारिक', 'सहायक', 'आलोचनात्मक', 'पूर्णतावादी'],
      hinglish: ['Analytical', 'Practical', 'Helpful', 'Critical', 'Perfectionist']
    }
  },
  libra: {
    sign: 'Libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    description: {
      en: 'The diplomat and harmonizer. Fair-minded, social, and aesthetically driven.',
      hi: 'राजनयिक और सामंजस्यकर्ता। निष्पक्ष, सामाजिक, और सौंदर्य प्रेमी।',
      hinglish: 'Diplomat aur harmonizer. Fair-minded, social, aur aesthetically driven.'
    },
    traits: {
      en: ['Diplomatic', 'Fair', 'Social', 'Indecisive', 'Romantic'],
      hi: ['कूटनीतिक', 'निष्पक्ष', 'सामाजिक', 'अनिर्णायक', 'रोमांटिक'],
      hinglish: ['Diplomatic', 'Fair', 'Social', 'Indecisive', 'Romantic']
    }
  },
  scorpio: {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto/Mars',
    description: {
      en: 'The transformer and detective. Intense, passionate, and deeply perceptive.',
      hi: 'परिवर्तनकर्ता और जासूस। तीव्र, जुनूनी, और गहरी समझ वाला।',
      hinglish: 'Transformer aur detective. Intense, passionate, aur deeply perceptive.'
    },
    traits: {
      en: ['Intense', 'Passionate', 'Resourceful', 'Secretive', 'Determined'],
      hi: ['तीव्र', 'जुनूनी', 'संसाधनशील', 'गोपनीय', 'दृढ़निश्चयी'],
      hinglish: ['Intense', 'Passionate', 'Resourceful', 'Secretive', 'Determined']
    }
  },
  sagittarius: {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    description: {
      en: 'The explorer and philosopher. Optimistic, adventurous, and truth-seeking.',
      hi: 'खोजकर्ता और दार्शनिक। आशावादी, साहसी, और सत्य की खोज करने वाला।',
      hinglish: 'Explorer aur philosopher. Optimistic, adventurous, aur truth-seeking.'
    },
    traits: {
      en: ['Optimistic', 'Adventurous', 'Philosophical', 'Blunt', 'Freedom-loving'],
      hi: ['आशावादी', 'साहसी', 'दार्शनिक', 'स्पष्टवादी', 'स्वतंत्रता-प्रेमी'],
      hinglish: ['Optimistic', 'Adventurous', 'Philosophical', 'Blunt', 'Freedom-loving']
    }
  },
  capricorn: {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    description: {
      en: 'The achiever and master. Disciplined, ambitious, and goal-oriented.',
      hi: 'उपलब्धि प्राप्तकर्ता और मास्टर। अनुशासित, महत्वाकांक्षी, और लक्ष्य-उन्मुख।',
      hinglish: 'Achiever aur master. Disciplined, ambitious, aur goal-oriented.'
    },
    traits: {
      en: ['Disciplined', 'Ambitious', 'Practical', 'Reserved', 'Patient'],
      hi: ['अनुशासित', 'महत्वाकांक्षी', 'व्यावहारिक', 'संयमित', 'धैर्यवान'],
      hinglish: ['Disciplined', 'Ambitious', 'Practical', 'Reserved', 'Patient']
    }
  },
  aquarius: {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus/Saturn',
    description: {
      en: 'The innovator and humanitarian. Progressive, independent, and visionary.',
      hi: 'नवप्रवर्तक और मानवतावादी। प्रगतिशील, स्वतंत्र, और दूरदर्शी।',
      hinglish: 'Innovator aur humanitarian. Progressive, independent, aur visionary.'
    },
    traits: {
      en: ['Progressive', 'Independent', 'Humanitarian', 'Detached', 'Original'],
      hi: ['प्रगतिशील', 'स्वतंत्र', 'मानवतावादी', 'तटस्थ', 'मौलिक'],
      hinglish: ['Progressive', 'Independent', 'Humanitarian', 'Detached', 'Original']
    }
  },
  pisces: {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune/Jupiter',
    description: {
      en: 'The dreamer and mystic. Compassionate, artistic, and spiritually attuned.',
      hi: 'स्वप्नद्रष्टा और रहस्यवादी। दयालु, कलात्मक, और आध्यात्मिक रूप से जुड़ा।',
      hinglish: 'Dreamer aur mystic. Compassionate, artistic, aur spiritually attuned.'
    },
    traits: {
      en: ['Compassionate', 'Artistic', 'Intuitive', 'Escapist', 'Dreamy'],
      hi: ['दयालु', 'कलात्मक', 'अंतर्ज्ञानी', 'पलायनवादी', 'स्वप्निल'],
      hinglish: ['Compassionate', 'Artistic', 'Intuitive', 'Escapist', 'Dreamy']
    }
  }
};

// Sign challenges with reason and solution
const signChallenges: Record<string, ZodiacSign['challenge']> = {
  aries: {
    challenge: {
      en: 'Impulsive decisions and impatience with slow progress',
      hi: 'आवेगपूर्ण निर्णय और धीमी प्रगति के साथ अधीरता',
      hinglish: 'Impulsive decisions aur slow progress ke saath impatience'
    },
    reason: {
      en: 'Mars energy creates urgency - you feel everything must happen NOW',
      hi: 'मंगल ऊर्जा तात्कालिकता पैदा करती है - आप महसूस करते हैं कि सब कुछ अभी होना चाहिए',
      hinglish: 'Mars energy urgency create karti hai - aap feel karte ho sab kuch NOW hona chahiye'
    },
    solution: {
      en: 'Practice the 24-hour rule before major decisions. Channel energy into physical activity.',
      hi: 'बड़े निर्णयों से पहले 24 घंटे के नियम का पालन करें। ऊर्जा को शारीरिक गतिविधि में लगाएं।',
      hinglish: 'Major decisions se pehle 24-hour rule practice karo. Energy ko physical activity mein channel karo.'
    }
  },
  taurus: {
    challenge: {
      en: 'Resistance to change and attachment to comfort zones',
      hi: 'परिवर्तन के प्रति प्रतिरोध और आराम क्षेत्रों से लगाव',
      hinglish: 'Change ke prati resistance aur comfort zones se attachment'
    },
    reason: {
      en: 'Venus seeks security - your nervous system interprets change as threat',
      hi: 'शुक्र सुरक्षा चाहता है - आपका तंत्रिका तंत्र परिवर्तन को खतरे के रूप में देखता है',
      hinglish: 'Venus security chahta hai - aapka nervous system change ko threat interpret karta hai'
    },
    solution: {
      en: 'Make one small change daily. Build flexibility through routine micro-adjustments.',
      hi: 'प्रतिदिन एक छोटा परिवर्तन करें। नियमित सूक्ष्म समायोजन से लचीलापन बनाएं।',
      hinglish: 'Daily ek chhota change karo. Routine micro-adjustments se flexibility build karo.'
    }
  },
  gemini: {
    challenge: {
      en: 'Scattered focus and difficulty completing long-term projects',
      hi: 'बिखरा हुआ ध्यान और दीर्घकालिक परियोजनाओं को पूरा करने में कठिनाई',
      hinglish: 'Scattered focus aur long-term projects complete karne mein difficulty'
    },
    reason: {
      en: 'Mercury craves new information - your mind races faster than time allows',
      hi: 'बुध नई जानकारी चाहता है - आपका दिमाग समय की अनुमति से तेज दौड़ता है',
      hinglish: 'Mercury new information crave karta hai - aapka mind time se zyada fast race karta hai'
    },
    solution: {
      en: 'Use Pomodoro technique. Write down ideas to free mental space for current tasks.',
      hi: 'पोमोडोरो तकनीक का उपयोग करें। वर्तमान कार्यों के लिए मानसिक स्थान खाली करने हेतु विचार लिखें।',
      hinglish: 'Pomodoro technique use karo. Ideas likh lo taaki current tasks ke liye mental space free ho.'
    }
  },
  cancer: {
    challenge: {
      en: 'Emotional overwhelm and over-protecting loved ones',
      hi: 'भावनात्मक अभिभूतता और प्रियजनों की अति-सुरक्षा',
      hinglish: 'Emotional overwhelm aur loved ones ki over-protection'
    },
    reason: {
      en: 'Moon amplifies emotions - you feel others\' pain as deeply as your own',
      hi: 'चंद्रमा भावनाओं को बढ़ाता है - आप दूसरों का दर्द अपने जितना गहरा महसूस करते हैं',
      hinglish: 'Moon emotions ko amplify karta hai - aap dusron ka pain apna jitna deeply feel karte ho'
    },
    solution: {
      en: 'Set emotional boundaries. Practice distinguishing your feelings from others.',
      hi: 'भावनात्मक सीमाएं निर्धारित करें। अपनी भावनाओं को दूसरों से अलग करने का अभ्यास करें।',
      hinglish: 'Emotional boundaries set karo. Apni feelings ko dusron se distinguish karna practice karo.'
    }
  },
  leo: {
    challenge: {
      en: 'Need for validation and difficulty accepting criticism',
      hi: 'मान्यता की आवश्यकता और आलोचना स्वीकार करने में कठिनाई',
      hinglish: 'Validation ki need aur criticism accept karne mein difficulty'
    },
    reason: {
      en: 'Sun energy requires recognition - your light wants to be seen and acknowledged',
      hi: 'सूर्य ऊर्जा को पहचान की आवश्यकता है - आपकी रोशनी देखी और स्वीकार की जानी चाहती है',
      hinglish: 'Sun energy recognition require karti hai - aapki light seen aur acknowledged hona chahti hai'
    },
    solution: {
      en: 'Practice self-validation. Transform criticism into growth fuel, not identity attack.',
      hi: 'आत्म-मान्यता का अभ्यास करें। आलोचना को विकास ईंधन में बदलें, पहचान पर हमला नहीं।',
      hinglish: 'Self-validation practice karo. Criticism ko growth fuel mein transform karo, identity attack nahi.'
    }
  },
  virgo: {
    challenge: {
      en: 'Perfectionism paralysis and harsh self-criticism',
      hi: 'पूर्णतावाद पक्षाघात और कठोर आत्म-आलोचना',
      hinglish: 'Perfectionism paralysis aur harsh self-criticism'
    },
    reason: {
      en: 'Mercury in earth sees every flaw - your standards are impossibly high',
      hi: 'पृथ्वी में बुध हर दोष देखता है - आपके मानक असंभव रूप से उच्च हैं',
      hinglish: 'Earth mein Mercury har flaw dekhta hai - aapke standards impossibly high hain'
    },
    solution: {
      en: 'Adopt "good enough" mindset. Celebrate progress over perfection daily.',
      hi: '"पर्याप्त अच्छा" मानसिकता अपनाएं। प्रतिदिन पूर्णता पर प्रगति का जश्न मनाएं।',
      hinglish: '"Good enough" mindset adopt karo. Daily perfection se zyada progress celebrate karo.'
    }
  },
  libra: {
    challenge: {
      en: 'Indecisiveness and people-pleasing at own expense',
      hi: 'अनिर्णय और अपने खर्च पर दूसरों को खुश करना',
      hinglish: 'Indecisiveness aur apne expense pe people-pleasing'
    },
    reason: {
      en: 'Venus sees all sides - you fear making the "wrong" choice and losing harmony',
      hi: 'शुक्र सभी पक्ष देखता है - आप "गलत" चुनाव और सामंजस्य खोने से डरते हैं',
      hinglish: 'Venus sab sides dekhta hai - aap "wrong" choice aur harmony lose karne se darte ho'
    },
    solution: {
      en: 'Set decision deadlines. Practice saying "no" in low-stakes situations first.',
      hi: 'निर्णय की समय सीमा निर्धारित करें। पहले कम जोखिम वाली स्थितियों में "नहीं" कहने का अभ्यास करें।',
      hinglish: 'Decision deadlines set karo. Low-stakes situations mein pehle "no" bolna practice karo.'
    }
  },
  scorpio: {
    challenge: {
      en: 'Difficulty trusting and letting go of past hurts',
      hi: 'विश्वास करने और पुरानी पीड़ाओं को छोड़ने में कठिनाई',
      hinglish: 'Trust karne aur past hurts ko let go karne mein difficulty'
    },
    reason: {
      en: 'Pluto remembers everything - betrayal echoes in your cells as survival instinct',
      hi: 'प्लूटो सब कुछ याद रखता है - विश्वासघात आपकी कोशिकाओं में जीवन वृत्ति के रूप में गूंजता है',
      hinglish: 'Pluto sab kuch yaad rakhta hai - betrayal aapki cells mein survival instinct ke roop mein echo karta hai'
    },
    solution: {
      en: 'Distinguish past from present. Practice incremental trust with safe people.',
      hi: 'अतीत को वर्तमान से अलग करें। सुरक्षित लोगों के साथ क्रमिक विश्वास का अभ्यास करें।',
      hinglish: 'Past ko present se distinguish karo. Safe logon ke saath incremental trust practice karo.'
    }
  },
  sagittarius: {
    challenge: {
      en: 'Commitment avoidance and over-promising',
      hi: 'प्रतिबद्धता से बचाव और अधिक वादे करना',
      hinglish: 'Commitment avoidance aur over-promising'
    },
    reason: {
      en: 'Jupiter expands endlessly - boundaries feel like cages to your free spirit',
      hi: 'बृहस्पति अंतहीन रूप से फैलता है - सीमाएं आपकी मुक्त आत्मा के लिए पिंजरे जैसी लगती हैं',
      hinglish: 'Jupiter endlessly expand karta hai - boundaries aapki free spirit ke liye cages lagti hain'
    },
    solution: {
      en: 'Under-promise, over-deliver. Find freedom WITHIN commitments, not outside them.',
      hi: 'कम वादा करें, ज्यादा पूरा करें। प्रतिबद्धताओं के भीतर स्वतंत्रता खोजें, बाहर नहीं।',
      hinglish: 'Under-promise, over-deliver. Commitments ke WITHIN freedom khojo, bahar nahi.'
    }
  },
  capricorn: {
    challenge: {
      en: 'Workaholic tendencies and difficulty enjoying present',
      hi: 'वर्कहोलिक प्रवृत्तियां और वर्तमान का आनंद लेने में कठिनाई',
      hinglish: 'Workaholic tendencies aur present enjoy karne mein difficulty'
    },
    reason: {
      en: 'Saturn demands achievement - rest feels like falling behind in your inner race',
      hi: 'शनि उपलब्धि की मांग करता है - आराम आपकी आंतरिक दौड़ में पीछे रहने जैसा लगता है',
      hinglish: 'Saturn achievement demand karta hai - rest aapki inner race mein peeche rehne jaisa lagta hai'
    },
    solution: {
      en: 'Schedule rest like meetings. Celebrate small wins, not just big achievements.',
      hi: 'बैठकों की तरह आराम का समय निर्धारित करें। बड़ी उपलब्धियों के अलावा छोटी जीत भी मनाएं।',
      hinglish: 'Meetings ki tarah rest schedule karo. Sirf badi achievements nahi, small wins bhi celebrate karo.'
    }
  },
  aquarius: {
    challenge: {
      en: 'Emotional detachment and difficulty with intimacy',
      hi: 'भावनात्मक अलगाव और अंतरंगता में कठिनाई',
      hinglish: 'Emotional detachment aur intimacy mein difficulty'
    },
    reason: {
      en: 'Uranus values intellect - emotions feel messy and unpredictable to your logical mind',
      hi: 'यूरेनस बुद्धि को महत्व देता है - भावनाएं आपके तार्किक दिमाग के लिए गड़बड़ और अप्रत्याशित लगती हैं',
      hinglish: 'Uranus intellect ko value karta hai - emotions aapke logical mind ke liye messy aur unpredictable lagti hain'
    },
    solution: {
      en: 'Name emotions daily. Practice vulnerability in safe, small doses.',
      hi: 'प्रतिदिन भावनाओं का नाम रखें। सुरक्षित, छोटी खुराक में असुरक्षा का अभ्यास करें।',
      hinglish: 'Daily emotions ko naam do. Safe, small doses mein vulnerability practice karo.'
    }
  },
  pisces: {
    challenge: {
      en: 'Escapism and difficulty with practical responsibilities',
      hi: 'पलायनवाद और व्यावहारिक जिम्मेदारियों में कठिनाई',
      hinglish: 'Escapism aur practical responsibilities mein difficulty'
    },
    reason: {
      en: 'Neptune dissolves boundaries - harsh reality feels too sharp for your sensitive soul',
      hi: 'नेप्च्यून सीमाओं को घोलता है - कठोर वास्तविकता आपकी संवेदनशील आत्मा के लिए बहुत तीखी लगती है',
      hinglish: 'Neptune boundaries dissolve karta hai - harsh reality aapki sensitive soul ke liye bahut sharp lagti hai'
    },
    solution: {
      en: 'Create structured creative time. Ground yourself before escaping into fantasy.',
      hi: 'संरचित रचनात्मक समय बनाएं। कल्पना में जाने से पहले खुद को स्थिर करें।',
      hinglish: 'Structured creative time create karo. Fantasy mein escape karne se pehle ground yourself.'
    }
  }
};

// Planetary influences
const planetaryData: PlanetaryInfluence[] = [
  {
    planet: 'Sun',
    symbol: '☉',
    theme: { en: 'Identity & Ego', hi: 'पहचान और अहंकार', hinglish: 'Identity aur Ego' },
    influence: { en: 'Core self, willpower, vitality', hi: 'मूल स्व, इच्छाशक्ति, जीवन शक्ति', hinglish: 'Core self, willpower, vitality' },
    guidance: { en: 'Embrace your authentic self without apology', hi: 'बिना माफी के अपने असली स्व को अपनाएं', hinglish: 'Bina apology ke apne authentic self ko embrace karo' }
  },
  {
    planet: 'Moon',
    symbol: '☽',
    theme: { en: 'Emotional Need', hi: 'भावनात्मक आवश्यकता', hinglish: 'Emotional Need' },
    influence: { en: 'Emotions, instincts, inner world', hi: 'भावनाएं, वृत्ति, आंतरिक दुनिया', hinglish: 'Emotions, instincts, inner world' },
    guidance: { en: 'Honor your emotional rhythms and needs', hi: 'अपनी भावनात्मक लय और जरूरतों का सम्मान करें', hinglish: 'Apni emotional rhythms aur needs ko honor karo' }
  },
  {
    planet: 'Mars',
    symbol: '♂',
    theme: { en: 'Action & Drive', hi: 'क्रिया और प्रेरणा', hinglish: 'Action aur Drive' },
    influence: { en: 'Energy, assertion, desire', hi: 'ऊर्जा, दावा, इच्छा', hinglish: 'Energy, assertion, desire' },
    guidance: { en: 'Channel your fire into constructive pursuits', hi: 'अपनी आग को रचनात्मक प्रयासों में लगाएं', hinglish: 'Apni fire ko constructive pursuits mein channel karo' }
  },
  {
    planet: 'Venus',
    symbol: '♀',
    theme: { en: 'Love & Partnership', hi: 'प्रेम और साझेदारी', hinglish: 'Love aur Partnership' },
    influence: { en: 'Love, beauty, values, harmony', hi: 'प्रेम, सौंदर्य, मूल्य, सामंजस्य', hinglish: 'Love, beauty, values, harmony' },
    guidance: { en: 'Attract through authentic self-worth', hi: 'प्रामाणिक आत्म-मूल्य से आकर्षित करें', hinglish: 'Authentic self-worth se attract karo' }
  },
  {
    planet: 'Mercury',
    symbol: '☿',
    theme: { en: 'Communication', hi: 'संचार', hinglish: 'Communication' },
    influence: { en: 'Mind, speech, learning, analysis', hi: 'मन, वाणी, सीखना, विश्लेषण', hinglish: 'Mind, speech, learning, analysis' },
    guidance: { en: 'Speak your truth with clarity and kindness', hi: 'अपनी सच्चाई स्पष्टता और दयालुता से बोलें', hinglish: 'Apni truth clarity aur kindness se bolo' }
  },
  {
    planet: 'Jupiter',
    symbol: '♃',
    theme: { en: 'Wisdom & Growth', hi: 'ज्ञान और विकास', hinglish: 'Wisdom aur Growth' },
    influence: { en: 'Expansion, luck, philosophy, abundance', hi: 'विस्तार, भाग्य, दर्शन, प्रचुरता', hinglish: 'Expansion, luck, philosophy, abundance' },
    guidance: { en: 'Expand through learning and generosity', hi: 'सीखने और उदारता से विस्तार करें', hinglish: 'Learning aur generosity se expand karo' }
  },
  {
    planet: 'Saturn',
    symbol: '♄',
    theme: { en: 'Responsibility & Lessons', hi: 'जिम्मेदारी और सबक', hinglish: 'Responsibility aur Lessons' },
    influence: { en: 'Structure, discipline, karma, maturity', hi: 'संरचना, अनुशासन, कर्म, परिपक्वता', hinglish: 'Structure, discipline, karma, maturity' },
    guidance: { en: 'Embrace challenges as growth catalysts', hi: 'चुनौतियों को विकास उत्प्रेरक के रूप में अपनाएं', hinglish: 'Challenges ko growth catalysts ke roop mein embrace karo' }
  }
];

// Sun sign calculation based on date
function getSunSign(day: number, month: number): string {
  const signs: Array<[string, number, number]> = [
    ['capricorn', 1, 19],
    ['aquarius', 2, 18],
    ['pisces', 3, 20],
    ['aries', 4, 19],
    ['taurus', 5, 20],
    ['gemini', 6, 20],
    ['cancer', 7, 22],
    ['leo', 8, 22],
    ['virgo', 9, 22],
    ['libra', 10, 22],
    ['scorpio', 11, 21],
    ['sagittarius', 12, 21],
    ['capricorn', 12, 31]
  ];

  for (let i = 0; i < signs.length; i++) {
    const [sign, signMonth, endDay] = signs[i];
    if (month === signMonth && day <= endDay) {
      return sign;
    }
    if (i > 0 && month === signs[i - 1][1] && day > signs[i - 1][2]) {
      return sign;
    }
  }
  
  // Default handling
  if (month === 12 && day > 21) return 'capricorn';
  if (month === 1 && day <= 19) return 'capricorn';
  
  return 'aries';
}

// Moon sign approximation based on birth time
function getMoonSign(day: number, month: number, hour: number): string {
  const signOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                     'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  // Moon changes sign roughly every 2.5 days
  const dayOfYear = (month - 1) * 30 + day;
  const moonCycle = Math.floor(dayOfYear / 2.5) + Math.floor(hour / 12);
  
  return signOrder[moonCycle % 12];
}

// Rising sign approximation based on birth time
function getRisingSign(hour: number, minute: number): string {
  const signOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                     'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  
  // Rising sign changes every ~2 hours
  const totalMinutes = hour * 60 + minute;
  const signIndex = Math.floor(totalMinutes / 120) % 12;
  
  return signOrder[signIndex];
}

// Get full zodiac sign data
function getZodiacSign(signKey: string): ZodiacSign {
  const baseSign = zodiacSigns[signKey] || zodiacSigns.aries;
  const challenge = signChallenges[signKey] || signChallenges.aries;
  
  return { ...baseSign, challenge };
}

// Element compatibility scoring
function getElementCompatibility(element1: string, element2: string): number {
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    Fire: { Fire: 85, Air: 90, Earth: 55, Water: 45 },
    Earth: { Fire: 55, Air: 65, Earth: 80, Water: 90 },
    Air: { Fire: 90, Air: 75, Earth: 65, Water: 60 },
    Water: { Fire: 45, Air: 60, Earth: 90, Water: 85 }
  };
  
  return compatibilityMatrix[element1]?.[element2] || 60;
}

// Main calculation function
export function calculateAstrologyProfile(
  dob: string,
  birthTime?: string,
  partnerDob?: string,
  partnerBirthTime?: string
): AstrologyProfile {
  // Parse DOB
  const [day, month, year] = dob.split('/').map(Number);
  
  // Parse birth time (default to 12:00 if not provided)
  let hour = 12;
  let minute = 0;
  if (birthTime) {
    const timeMatch = birthTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
      minute = parseInt(timeMatch[2]);
      if (timeMatch[3]?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (timeMatch[3]?.toUpperCase() === 'AM' && hour === 12) hour = 0;
    }
  }

  // Calculate signs
  const sunSignKey = getSunSign(day, month);
  const moonSignKey = getMoonSign(day, month, hour);
  const risingSignKey = getRisingSign(hour, minute);

  const sunSign = getZodiacSign(sunSignKey);
  const moonSign = getZodiacSign(moonSignKey);
  const risingSign = getZodiacSign(risingSignKey);

  // Calculate partner compatibility if provided
  let astroCompatibility: AstroCompatibility | undefined;
  if (partnerDob) {
    const [pDay, pMonth] = partnerDob.split('/').map(Number);
    let pHour = 12;
    if (partnerBirthTime) {
      const pTimeMatch = partnerBirthTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (pTimeMatch) {
        pHour = parseInt(pTimeMatch[1]);
        if (pTimeMatch[3]?.toUpperCase() === 'PM' && pHour !== 12) pHour += 12;
      }
    }

    const partnerSunSignKey = getSunSign(pDay, pMonth);
    const partnerMoonSignKey = getMoonSign(pDay, pMonth, pHour);
    const partnerSunSign = getZodiacSign(partnerSunSignKey);
    const partnerMoonSign = getZodiacSign(partnerMoonSignKey);

    const sunSynergy = getElementCompatibility(sunSign.element, partnerSunSign.element);
    const moonSynergy = getElementCompatibility(moonSign.element, partnerMoonSign.element);
    const overallScore = Math.round((sunSynergy * 0.4 + moonSynergy * 0.6));

    astroCompatibility = {
      partnerSunSign,
      partnerMoonSign,
      sunSynergy,
      moonSynergy,
      overallScore,
      strengths: getCompatibilityStrengths(sunSign.element, partnerSunSign.element),
      challenges: getCompatibilityChallenges(sunSign.element, partnerSunSign.element),
      communicationBridge: getCommBridge(moonSign.element, partnerMoonSign.element)
    };
  }

  return {
    sunSign,
    moonSign,
    risingSign,
    planetaryInfluences: planetaryData,
    astroCompatibility
  };
}

function getCompatibilityStrengths(e1: string, e2: string): { en: string[]; hi: string[]; hinglish: string[] } {
  if ((e1 === 'Fire' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Fire')) {
    return {
      en: ['Exciting and dynamic energy together', 'Inspire each other to grow', 'Great communication flow'],
      hi: ['साथ में रोमांचक और गतिशील ऊर्जा', 'एक दूसरे को बढ़ने के लिए प्रेरित करें', 'बेहतरीन संवाद प्रवाह'],
      hinglish: ['Exciting aur dynamic energy together', 'Ek dusre ko grow karne ke liye inspire karo', 'Great communication flow']
    };
  }
  if ((e1 === 'Earth' && e2 === 'Water') || (e1 === 'Water' && e2 === 'Earth')) {
    return {
      en: ['Deep emotional security', 'Nurturing and stable foundation', 'Long-term commitment potential'],
      hi: ['गहरी भावनात्मक सुरक्षा', 'पालन-पोषण और स्थिर नींव', 'दीर्घकालिक प्रतिबद्धता क्षमता'],
      hinglish: ['Deep emotional security', 'Nurturing aur stable foundation', 'Long-term commitment potential']
    };
  }
  return {
    en: ['Balance through differences', 'Opportunity for growth', 'Learning from each other'],
    hi: ['अंतर के माध्यम से संतुलन', 'विकास का अवसर', 'एक दूसरे से सीखना'],
    hinglish: ['Differences ke through balance', 'Growth ka opportunity', 'Ek dusre se learning']
  };
}

function getCompatibilityChallenges(e1: string, e2: string): { en: string[]; hi: string[]; hinglish: string[] } {
  if ((e1 === 'Fire' && e2 === 'Water') || (e1 === 'Water' && e2 === 'Fire')) {
    return {
      en: ['Emotional vs action-oriented conflicts', 'Different paces of life', 'Need for patience and understanding'],
      hi: ['भावनात्मक बनाम कार्य-उन्मुख संघर्ष', 'जीवन की अलग गति', 'धैर्य और समझ की आवश्यकता'],
      hinglish: ['Emotional vs action-oriented conflicts', 'Life ki different pace', 'Patience aur understanding ki zarurat']
    };
  }
  if ((e1 === 'Earth' && e2 === 'Air') || (e1 === 'Air' && e2 === 'Earth')) {
    return {
      en: ['Practical vs idealistic tensions', 'Different communication styles', 'Grounding vs flying energy'],
      hi: ['व्यावहारिक बनाम आदर्शवादी तनाव', 'अलग संवाद शैली', 'स्थिर बनाम उड़ान ऊर्जा'],
      hinglish: ['Practical vs idealistic tensions', 'Different communication styles', 'Grounding vs flying energy']
    };
  }
  return {
    en: ['Finding middle ground', 'Respecting different needs', 'Balancing independence and togetherness'],
    hi: ['मध्य मार्ग खोजना', 'अलग जरूरतों का सम्मान', 'स्वतंत्रता और एकता का संतुलन'],
    hinglish: ['Middle ground dhundhna', 'Different needs ka respect', 'Independence aur togetherness ka balance']
  };
}

function getCommBridge(e1: string, e2: string): { en: string; hi: string; hinglish: string } {
  return {
    en: 'Focus on emotional validation before problem-solving. Listen with heart first, respond with mind second.',
    hi: 'समस्या-समाधान से पहले भावनात्मक मान्यता पर ध्यान दें। पहले दिल से सुनें, फिर दिमाग से जवाब दें।',
    hinglish: 'Problem-solving se pehle emotional validation pe focus karo. Pehle dil se suno, phir mind se respond karo.'
  };
}

export default calculateAstrologyProfile;
