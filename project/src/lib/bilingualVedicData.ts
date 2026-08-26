// Bilingual content for Vedic numerology meanings

export interface BilingualText {
  en: string;
  hi: string;
}

export interface BilingualMulankMeaning {
  title: BilingualText;
  emotionalCore: BilingualText;
  naturalBehavior: BilingualText;
  strengths: BilingualText[];
  weaknesses: BilingualText[];
  whyThisNumber: BilingualText;
  dayInLife: BilingualText;
  famousPersonalities: string[];
}

export interface BilingualBhagyankMeaning {
  title: BilingualText;
  lifeDirection: BilingualText;
  dharmicPath: BilingualText;
  karmicPurpose: BilingualText;
  whyThisDefinesDestiny: BilingualText;
  spiritualLesson: BilingualText;
}

export const bilingualMulankMeanings: Record<number, BilingualMulankMeaning> = {
  1: {
    title: { en: 'The Pioneer Leader', hi: 'अग्रणी नेता' },
    emotionalCore: {
      en: 'You are driven by a deep need for independence and originality. Your emotions are tied to achievement and being first.',
      hi: 'आप स्वतंत्रता और मौलिकता की गहरी आवश्यकता से प्रेरित हैं। आपकी भावनाएं उपलब्धि और प्रथम होने से जुड़ी हैं।'
    },
    naturalBehavior: {
      en: 'Natural leader who takes initiative. You prefer to work independently and make your own decisions. Direct in communication.',
      hi: 'पहल करने वाले स्वाभाविक नेता। आप स्वतंत्र रूप से काम करना और अपने निर्णय लेना पसंद करते हैं। संवाद में सीधे।'
    },
    strengths: [
      { en: 'Leadership', hi: 'नेतृत्व' },
      { en: 'Independence', hi: 'स्वतंत्रता' },
      { en: 'Innovation', hi: 'नवाचार' },
      { en: 'Courage', hi: 'साहस' },
      { en: 'Determination', hi: 'दृढ़ संकल्प' }
    ],
    weaknesses: [
      { en: 'Stubbornness', hi: 'हठधर्मिता' },
      { en: 'Impatience', hi: 'अधीरता' },
      { en: 'Ego', hi: 'अहंकार' },
      { en: 'Dominating nature', hi: 'दबंग स्वभाव' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 1, 10, 19, or 28. This number is connected to the Sun (Surya), symbolizing leadership and self-confidence.',
      hi: 'आपका जन्म 1, 10, 19, या 28 तारीख को हुआ है। यह संख्या सूर्य से जुड़ी है, जो नेतृत्व और आत्मविश्वास का प्रतीक है।'
    },
    dayInLife: {
      en: 'You wake up with goals in mind. Morning is your power time. You make quick decisions and expect others to follow. You end the day reviewing what you accomplished.',
      hi: 'आप लक्ष्यों के साथ जागते हैं। सुबह आपका शक्ति समय है। आप त्वरित निर्णय लेते हैं। आप दिन का अंत अपनी उपलब्धियों की समीक्षा करते हुए करते हैं।'
    },
    famousPersonalities: ['Mahatma Gandhi', 'Steve Jobs', 'Martin Luther King Jr.']
  },
  2: {
    title: { en: 'The Diplomatic Peacemaker', hi: 'कूटनीतिक शांतिदूत' },
    emotionalCore: {
      en: 'You are deeply sensitive and intuitive. Your emotions are connected to relationships and harmony around you.',
      hi: 'आप गहराई से संवेदनशील और सहज ज्ञानी हैं। आपकी भावनाएं रिश्तों और आसपास के सामंजस्य से जुड़ी हैं।'
    },
    naturalBehavior: {
      en: 'Natural mediator who seeks balance. You work well in partnerships and prefer cooperation over competition. Gentle communicator.',
      hi: 'संतुलन चाहने वाले स्वाभाविक मध्यस्थ। आप साझेदारी में अच्छा काम करते हैं और प्रतिस्पर्धा की जगह सहयोग पसंद करते हैं।'
    },
    strengths: [
      { en: 'Diplomacy', hi: 'कूटनीति' },
      { en: 'Intuition', hi: 'अंतर्ज्ञान' },
      { en: 'Cooperation', hi: 'सहयोग' },
      { en: 'Sensitivity', hi: 'संवेदनशीलता' },
      { en: 'Patience', hi: 'धैर्य' }
    ],
    weaknesses: [
      { en: 'Over-sensitivity', hi: 'अति-संवेदनशीलता' },
      { en: 'Indecision', hi: 'अनिर्णय' },
      { en: 'Dependency', hi: 'निर्भरता' },
      { en: 'Self-doubt', hi: 'आत्म-संदेह' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 2, 11, 20, or 29. This number is connected to the Moon (Chandra), symbolizing emotions and relationships.',
      hi: 'आपका जन्म 2, 11, 20, या 29 तारीख को हुआ है। यह संख्या चंद्रमा से जुड़ी है, जो भावनाओं और रिश्तों का प्रतीक है।'
    },
    dayInLife: {
      en: 'You start your day connecting with loved ones. You prefer calm environments. Decision-making takes time as you consider all perspectives. Evening is for nurturing relationships.',
      hi: 'आप अपना दिन प्रियजनों से जुड़कर शुरू करते हैं। आप शांत वातावरण पसंद करते हैं। निर्णय लेने में समय लगता है। शाम रिश्तों को पोषित करने के लिए है।'
    },
    famousPersonalities: ['Mother Teresa', 'Princess Diana', 'Amitabh Bachchan']
  },
  3: {
    title: { en: 'The Creative Communicator', hi: 'रचनात्मक संवादक' },
    emotionalCore: {
      en: 'You thrive on self-expression and creativity. Your emotions are directly linked to how well you can communicate your ideas.',
      hi: 'आप आत्म-अभिव्यक्ति और रचनात्मकता पर पनपते हैं। आपकी भावनाएं सीधे इस बात से जुड़ी हैं कि आप अपने विचार कितनी अच्छी तरह व्यक्त कर सकते हैं।'
    },
    naturalBehavior: {
      en: 'Natural entertainer with magnetic charm. You love social gatherings and creative pursuits. Optimistic and inspiring to others.',
      hi: 'चुंबकीय आकर्षण वाले स्वाभाविक मनोरंजनकर्ता। आप सामाजिक समारोहों और रचनात्मक कार्यों को पसंद करते हैं। आशावादी और दूसरों के लिए प्रेरणादायक।'
    },
    strengths: [
      { en: 'Creativity', hi: 'रचनात्मकता' },
      { en: 'Communication', hi: 'संचार' },
      { en: 'Optimism', hi: 'आशावाद' },
      { en: 'Charisma', hi: 'करिश्मा' },
      { en: 'Artistic talent', hi: 'कलात्मक प्रतिभा' }
    ],
    weaknesses: [
      { en: 'Scattered energy', hi: 'बिखरी ऊर्जा' },
      { en: 'Superficiality', hi: 'सतहीपन' },
      { en: 'Moodiness', hi: 'मिजाज़' },
      { en: 'Exaggeration', hi: 'अतिशयोक्ति' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 3, 12, 21, or 30. This number is connected to Jupiter (Guru), symbolizing wisdom and expansion.',
      hi: 'आपका जन्म 3, 12, 21, या 30 तारीख को हुआ है। यह संख्या गुरु (बृहस्पति) से जुड़ी है, जो ज्ञान और विस्तार का प्रतीक है।'
    },
    dayInLife: {
      en: 'Your mornings are creative bursts. You naturally attract people throughout the day. Work feels like play when you\'re inspired. Evenings are for art, music, or socializing.',
      hi: 'आपकी सुबह रचनात्मक विस्फोट होती हैं। आप स्वाभाविक रूप से दिनभर लोगों को आकर्षित करते हैं। प्रेरित होने पर काम खेल जैसा लगता है। शाम कला, संगीत या मेलजोल के लिए है।'
    },
    famousPersonalities: ['Shah Rukh Khan', 'Jim Carrey', 'Taylor Swift']
  },
  4: {
    title: { en: 'The Practical Builder', hi: 'व्यावहारिक निर्माता' },
    emotionalCore: {
      en: 'You find security in stability and order. Your emotions are grounded in tangible achievements and reliable structures.',
      hi: 'आप स्थिरता और व्यवस्था में सुरक्षा पाते हैं। आपकी भावनाएं ठोस उपलब्धियों और विश्वसनीय संरचनाओं पर आधारित हैं।'
    },
    naturalBehavior: {
      en: 'Systematic and hardworking. You build things to last and prefer proven methods. Reliable and detail-oriented.',
      hi: 'व्यवस्थित और मेहनती। आप टिकाऊ चीजें बनाते हैं और सिद्ध तरीके पसंद करते हैं। विश्वसनीय और विस्तार-उन्मुख।'
    },
    strengths: [
      { en: 'Discipline', hi: 'अनुशासन' },
      { en: 'Reliability', hi: 'विश्वसनीयता' },
      { en: 'Organization', hi: 'संगठन' },
      { en: 'Practicality', hi: 'व्यावहारिकता' },
      { en: 'Determination', hi: 'दृढ़ संकल्प' }
    ],
    weaknesses: [
      { en: 'Rigidity', hi: 'कठोरता' },
      { en: 'Overwork', hi: 'अधिक काम' },
      { en: 'Stubbornness', hi: 'हठधर्मिता' },
      { en: 'Fear of change', hi: 'बदलाव का डर' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 4, 13, 22, or 31. This number is connected to Rahu, symbolizing foundation and structure.',
      hi: 'आपका जन्म 4, 13, 22, या 31 तारीख को हुआ है। यह संख्या राहु से जुड़ी है, जो नींव और संरचना का प्रतीक है।'
    },
    dayInLife: {
      en: 'You wake up with a plan. Every hour is accounted for. You find satisfaction in completing tasks. Evening is for reviewing progress and planning tomorrow.',
      hi: 'आप योजना के साथ जागते हैं। हर घंटा निर्धारित है। आप कार्य पूरा करने में संतुष्टि पाते हैं। शाम प्रगति की समीक्षा और कल की योजना के लिए है।'
    },
    famousPersonalities: ['Sachin Tendulkar', 'Bill Gates', 'Arnold Schwarzenegger']
  },
  5: {
    title: { en: 'The Freedom Adventurer', hi: 'स्वतंत्रता साहसी' },
    emotionalCore: {
      en: 'You crave variety and freedom. Your emotions fluctuate with your experiences - boredom is your enemy.',
      hi: 'आप विविधता और स्वतंत्रता चाहते हैं। आपकी भावनाएं अनुभवों के साथ बदलती हैं - बोरियत आपकी दुश्मन है।'
    },
    naturalBehavior: {
      en: 'Natural explorer who embraces change. Versatile and adaptable. You communicate easily and love learning new things.',
      hi: 'बदलाव को अपनाने वाले स्वाभाविक खोजकर्ता। बहुमुखी और अनुकूलनीय। आप आसानी से संवाद करते हैं और नई चीजें सीखना पसंद करते हैं।'
    },
    strengths: [
      { en: 'Adaptability', hi: 'अनुकूलनशीलता' },
      { en: 'Versatility', hi: 'बहुमुखी प्रतिभा' },
      { en: 'Communication', hi: 'संचार' },
      { en: 'Adventure', hi: 'साहस' },
      { en: 'Quick thinking', hi: 'त्वरित सोच' }
    ],
    weaknesses: [
      { en: 'Restlessness', hi: 'बेचैनी' },
      { en: 'Inconsistency', hi: 'असंगति' },
      { en: 'Overindulgence', hi: 'अति भोग' },
      { en: 'Fear of commitment', hi: 'प्रतिबद्धता का डर' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 5, 14, or 23. This number is connected to Mercury (Budh), symbolizing communication and freedom.',
      hi: 'आपका जन्म 5, 14, या 23 तारीख को हुआ है। यह संख्या बुध से जुड़ी है, जो संचार और स्वतंत्रता का प्रतीक है।'
    },
    dayInLife: {
      en: 'No two days are the same for you. You juggle multiple projects. Travel and new experiences energize you. Evening might find you in unexpected places.',
      hi: 'आपके लिए कोई दो दिन एक जैसे नहीं होते। आप कई प्रोजेक्ट संभालते हैं। यात्रा और नए अनुभव आपको ऊर्जा देते हैं।'
    },
    famousPersonalities: ['Virat Kohli', 'Angelina Jolie', 'Abraham Lincoln']
  },
  6: {
    title: { en: 'The Nurturing Harmonizer', hi: 'पोषक संतुलनकर्ता' },
    emotionalCore: {
      en: 'Love and family are everything to you. Your emotions are deeply tied to the wellbeing of those you care for.',
      hi: 'प्यार और परिवार आपके लिए सब कुछ है। आपकी भावनाएं उनके कल्याण से गहराई से जुड़ी हैं जिनकी आप परवाह करते हैं।'
    },
    naturalBehavior: {
      en: 'Natural caregiver who creates harmony. Artistic and responsible. You take on burdens of others willingly.',
      hi: 'सामंजस्य बनाने वाले स्वाभाविक देखभालकर्ता। कलात्मक और जिम्मेदार। आप स्वेच्छा से दूसरों का बोझ उठाते हैं।'
    },
    strengths: [
      { en: 'Nurturing', hi: 'पोषण' },
      { en: 'Responsibility', hi: 'जिम्मेदारी' },
      { en: 'Artistic sense', hi: 'कलात्मक समझ' },
      { en: 'Harmony', hi: 'सामंजस्य' },
      { en: 'Loyalty', hi: 'वफादारी' }
    ],
    weaknesses: [
      { en: 'Over-giving', hi: 'अति देना' },
      { en: 'Perfectionism', hi: 'पूर्णतावाद' },
      { en: 'Worry', hi: 'चिंता' },
      { en: 'Controlling tendency', hi: 'नियंत्रण प्रवृत्ति' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 6, 15, or 24. This number is connected to Venus (Shukra), symbolizing love and beauty.',
      hi: 'आपका जन्म 6, 15, या 24 तारीख को हुआ है। यह संख्या शुक्र से जुड़ी है, जो प्रेम और सौंदर्य का प्रतीक है।'
    },
    dayInLife: {
      en: 'Your day centers around family and home. You beautify your surroundings. Work involves caring for others. Evening is for quality time with loved ones.',
      hi: 'आपका दिन परिवार और घर के इर्द-गिर्द केंद्रित है। आप अपने परिवेश को सुंदर बनाते हैं। शाम प्रियजनों के साथ गुणवत्ता समय के लिए है।'
    },
    famousPersonalities: ['Deepika Padukone', 'John Lennon', 'Albert Einstein']
  },
  7: {
    title: { en: 'The Spiritual Seeker', hi: 'आध्यात्मिक साधक' },
    emotionalCore: {
      en: 'You need solitude and depth. Your emotions are connected to your quest for truth and understanding.',
      hi: 'आपको एकांत और गहराई चाहिए। आपकी भावनाएं सत्य और समझ की खोज से जुड़ी हैं।'
    },
    naturalBehavior: {
      en: 'Natural philosopher and analyst. You prefer quality over quantity in relationships. Introspective and intuitive.',
      hi: 'स्वाभाविक दार्शनिक और विश्लेषक। आप रिश्तों में मात्रा से अधिक गुणवत्ता पसंद करते हैं। आत्मनिरीक्षण और सहज ज्ञानी।'
    },
    strengths: [
      { en: 'Wisdom', hi: 'ज्ञान' },
      { en: 'Analysis', hi: 'विश्लेषण' },
      { en: 'Intuition', hi: 'अंतर्ज्ञान' },
      { en: 'Spirituality', hi: 'आध्यात्मिकता' },
      { en: 'Research skills', hi: 'शोध कौशल' }
    ],
    weaknesses: [
      { en: 'Isolation', hi: 'अलगाव' },
      { en: 'Overthinking', hi: 'अति सोच' },
      { en: 'Aloofness', hi: 'उदासीनता' },
      { en: 'Skepticism', hi: 'संदेहवाद' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 7, 16, or 25. This number is connected to Ketu, symbolizing spirituality and inner wisdom.',
      hi: 'आपका जन्म 7, 16, या 25 तारीख को हुआ है। यह संख्या केतु से जुड़ी है, जो आध्यात्मिकता और आंतरिक ज्ञान का प्रतीक है।'
    },
    dayInLife: {
      en: 'Mornings are for meditation or contemplation. You work best alone. Deep conversations energize you. Evenings are for reading, research, or spiritual practice.',
      hi: 'सुबह ध्यान या चिंतन के लिए है। आप अकेले सबसे अच्छा काम करते हैं। गहरी बातचीत आपको ऊर्जा देती है। शाम पढ़ने या आध्यात्मिक अभ्यास के लिए है।'
    },
    famousPersonalities: ['A.R. Rahman', 'Princess Diana', 'Stephen Hawking']
  },
  8: {
    title: { en: 'The Power Manifester', hi: 'शक्ति अभिव्यक्तिकर्ता' },
    emotionalCore: {
      en: 'Achievement and material success drive you. Your emotions are tied to your sense of power and accomplishment.',
      hi: 'उपलब्धि और भौतिक सफलता आपको प्रेरित करती है। आपकी भावनाएं शक्ति और उपलब्धि की भावना से जुड़ी हैं।'
    },
    naturalBehavior: {
      en: 'Natural executive with ambition. You think big and work hard. Authority comes naturally to you.',
      hi: 'महत्वाकांक्षा वाले स्वाभाविक कार्यकारी। आप बड़ा सोचते हैं और कड़ी मेहनत करते हैं। अधिकार आपके लिए स्वाभाविक है।'
    },
    strengths: [
      { en: 'Ambition', hi: 'महत्वाकांक्षा' },
      { en: 'Organization', hi: 'संगठन' },
      { en: 'Business acumen', hi: 'व्यापार कौशल' },
      { en: 'Authority', hi: 'अधिकार' },
      { en: 'Manifestation', hi: 'अभिव्यक्ति' }
    ],
    weaknesses: [
      { en: 'Materialism', hi: 'भौतिकवाद' },
      { en: 'Workaholism', hi: 'कार्य व्यसन' },
      { en: 'Power struggles', hi: 'शक्ति संघर्ष' },
      { en: 'Impatience', hi: 'अधीरता' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 8, 17, or 26. This number is connected to Saturn (Shani), symbolizing karma and material mastery.',
      hi: 'आपका जन्म 8, 17, या 26 तारीख को हुआ है। यह संख्या शनि से जुड़ी है, जो कर्म और भौतिक महारत का प्रतीक है।'
    },
    dayInLife: {
      en: 'You wake up thinking about your goals. Work consumes much of your energy. You naturally take charge in any situation. Evening is for strategizing and networking.',
      hi: 'आप अपने लक्ष्यों के बारे में सोचते हुए जागते हैं। काम आपकी अधिकांश ऊर्जा खपत करता है। आप स्वाभाविक रूप से किसी भी स्थिति में प्रभार लेते हैं।'
    },
    famousPersonalities: ['Narendra Modi', 'Elon Musk', 'Amitabh Bachchan']
  },
  9: {
    title: { en: 'The Universal Humanitarian', hi: 'सार्वभौमिक मानवतावादी' },
    emotionalCore: {
      en: 'Compassion for humanity drives you. Your emotions are connected to the greater good and spiritual growth.',
      hi: 'मानवता के लिए करुणा आपको प्रेरित करती है। आपकी भावनाएं बड़े भले और आध्यात्मिक विकास से जुड़ी हैं।'
    },
    naturalBehavior: {
      en: 'Natural healer and teacher. You see the big picture and work for collective benefit. Generous and wise.',
      hi: 'स्वाभाविक उपचारक और शिक्षक। आप बड़ी तस्वीर देखते हैं और सामूहिक लाभ के लिए काम करते हैं। उदार और बुद्धिमान।'
    },
    strengths: [
      { en: 'Compassion', hi: 'करुणा' },
      { en: 'Wisdom', hi: 'ज्ञान' },
      { en: 'Generosity', hi: 'उदारता' },
      { en: 'Creativity', hi: 'रचनात्मकता' },
      { en: 'Universal love', hi: 'सार्वभौमिक प्रेम' }
    ],
    weaknesses: [
      { en: 'Emotional detachment', hi: 'भावनात्मक अलगाव' },
      { en: 'Scattered focus', hi: 'बिखरा ध्यान' },
      { en: 'Martyrdom', hi: 'शहादत' },
      { en: 'Over-idealism', hi: 'अति आदर्शवाद' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 9, 18, or 27. This number is connected to Mars (Mangal), symbolizing courage and humanitarian service.',
      hi: 'आपका जन्म 9, 18, या 27 तारीख को हुआ है। यह संख्या मंगल से जुड़ी है, जो साहस और मानवतावादी सेवा का प्रतीक है।'
    },
    dayInLife: {
      en: 'You start with thoughts of how to help others. Work often involves service. You attract people from all backgrounds. Evenings are for creative or spiritual pursuits.',
      hi: 'आप दूसरों की मदद के विचारों से शुरू करते हैं। काम में अक्सर सेवा शामिल होती है। आप सभी पृष्ठभूमि के लोगों को आकर्षित करते हैं।'
    },
    famousPersonalities: ['Mahatma Gandhi', 'Akshay Kumar', 'Mother Teresa']
  },
  11: {
    title: { en: 'The Master Intuitive', hi: 'मास्टर सहज ज्ञानी' },
    emotionalCore: {
      en: 'You carry high spiritual voltage. Your emotions are intensely connected to intuition and higher purpose.',
      hi: 'आप उच्च आध्यात्मिक ऊर्जा वहन करते हैं। आपकी भावनाएं तीव्रता से अंतर्ज्ञान और उच्च उद्देश्य से जुड़ी हैं।'
    },
    naturalBehavior: {
      en: 'Visionary with heightened sensitivity. You inspire others through your insights. Bridge between material and spiritual.',
      hi: 'उच्च संवेदनशीलता वाले दूरदर्शी। आप अपनी अंतर्दृष्टि से दूसरों को प्रेरित करते हैं। भौतिक और आध्यात्मिक के बीच पुल।'
    },
    strengths: [
      { en: 'Intuition', hi: 'अंतर्ज्ञान' },
      { en: 'Inspiration', hi: 'प्रेरणा' },
      { en: 'Spiritual insight', hi: 'आध्यात्मिक अंतर्दृष्टि' },
      { en: 'Visionary thinking', hi: 'दूरदर्शी सोच' },
      { en: 'Healing', hi: 'उपचार' }
    ],
    weaknesses: [
      { en: 'Nervous tension', hi: 'तंत्रिका तनाव' },
      { en: 'Impracticality', hi: 'अव्यावहारिकता' },
      { en: 'Self-doubt', hi: 'आत्म-संदेह' },
      { en: 'Overwhelm', hi: 'अभिभूत' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 11 or 29. 11 is a Master Number - double Moon energy with spiritual amplification.',
      hi: 'आपका जन्म 11 या 29 तारीख को हुआ है। 11 मास्टर नंबर है - आध्यात्मिक प्रवर्धन के साथ दोहरी चंद्र ऊर्जा।'
    },
    dayInLife: {
      en: 'You receive insights throughout the day. Others are drawn to your wisdom. Creative and spiritual work fulfills you. Evening is for processing your intuitive downloads.',
      hi: 'आप दिनभर अंतर्दृष्टि प्राप्त करते हैं। दूसरे आपके ज्ञान की ओर आकर्षित होते हैं। रचनात्मक और आध्यात्मिक काम आपको पूर्ण करता है।'
    },
    famousPersonalities: ['Barack Obama', 'Wolfgang Mozart', 'Lady Gaga']
  },
  22: {
    title: { en: 'The Master Builder', hi: 'मास्टर बिल्डर' },
    emotionalCore: {
      en: 'You feel the weight of great potential. Your emotions are tied to manifesting large-scale dreams.',
      hi: 'आप महान संभावना का भार महसूस करते हैं। आपकी भावनाएं बड़े पैमाने के सपनों को साकार करने से जुड़ी हैं।'
    },
    naturalBehavior: {
      en: 'Practical visionary who builds empires. Combines intuition with execution. Works for lasting impact.',
      hi: 'साम्राज्य बनाने वाले व्यावहारिक दूरदर्शी। अंतर्ज्ञान को निष्पादन के साथ जोड़ते हैं। स्थायी प्रभाव के लिए काम करते हैं।'
    },
    strengths: [
      { en: 'Manifestation', hi: 'अभिव्यक्ति' },
      { en: 'Practical idealism', hi: 'व्यावहारिक आदर्शवाद' },
      { en: 'Leadership', hi: 'नेतृत्व' },
      { en: 'Global vision', hi: 'वैश्विक दृष्टि' },
      { en: 'Discipline', hi: 'अनुशासन' }
    ],
    weaknesses: [
      { en: 'Overwhelm', hi: 'अभिभूत' },
      { en: 'Self-imposed pressure', hi: 'स्व-लगाया दबाव' },
      { en: 'Control issues', hi: 'नियंत्रण मुद्दे' },
      { en: 'Overambition', hi: 'अति महत्वाकांक्षा' }
    ],
    whyThisNumber: {
      en: 'Your birth is on 22. 22 is the Master Builder Number - double structure energy with spiritual power.',
      hi: 'आपका जन्म 22 तारीख को हुआ है। 22 मास्टर बिल्डर नंबर है - आध्यात्मिक शक्ति के साथ दोहरी संरचना ऊर्जा।'
    },
    dayInLife: {
      en: 'You think in terms of legacy. Work involves large projects and many people. You build structures that outlast you. Evening is for strategic planning.',
      hi: 'आप विरासत के संदर्भ में सोचते हैं। काम में बड़ी परियोजनाएं और कई लोग शामिल हैं। आप ऐसी संरचनाएं बनाते हैं जो आपसे आगे रहती हैं।'
    },
    famousPersonalities: ['Bill Gates', 'Oprah Winfrey', 'Clint Eastwood']
  },
  33: {
    title: { en: 'The Master Healer', hi: 'मास्टर उपचारक' },
    emotionalCore: {
      en: 'Unconditional love is your essence. Your emotions flow as healing energy for all beings.',
      hi: 'बिना शर्त प्यार आपका सार है। आपकी भावनाएं सभी प्राणियों के लिए उपचार ऊर्जा के रूप में बहती हैं।'
    },
    naturalBehavior: {
      en: 'Channel for divine love and healing. Teacher of teachers. Your presence alone transforms others.',
      hi: 'दैवीय प्रेम और उपचार के लिए माध्यम। शिक्षकों के शिक्षक। आपकी उपस्थिति अकेले ही दूसरों को रूपांतरित करती है।'
    },
    strengths: [
      { en: 'Healing', hi: 'उपचार' },
      { en: 'Unconditional love', hi: 'बिना शर्त प्यार' },
      { en: 'Teaching', hi: 'शिक्षण' },
      { en: 'Spiritual mastery', hi: 'आध्यात्मिक महारत' },
      { en: 'Compassion', hi: 'करुणा' }
    ],
    weaknesses: [
      { en: 'Self-sacrifice', hi: 'आत्म-बलिदान' },
      { en: 'Overwhelm', hi: 'अभिभूत' },
      { en: 'Unrealistic expectations', hi: 'अवास्तविक उम्मीदें' },
      { en: 'Martyrdom', hi: 'शहादत' }
    ],
    whyThisNumber: {
      en: '33 is the rarest Master Number - you carry the vibration of the cosmic teacher and healer.',
      hi: '33 सबसे दुर्लभ मास्टर नंबर है - आप ब्रह्मांडीय शिक्षक और उपचारक की कंपन वहन करते हैं।'
    },
    dayInLife: {
      en: 'Every interaction is an opportunity to heal. You attract those in need. Your work is spiritual service. Evening is for self-renewal and receiving.',
      hi: 'हर बातचीत उपचार का अवसर है। आप जरूरतमंदों को आकर्षित करते हैं। आपका काम आध्यात्मिक सेवा है। शाम आत्म-नवीकरण के लिए है।'
    },
    famousPersonalities: ['Dalai Lama', 'Albert Einstein', 'Stephen Spielberg']
  }
};

export const bilingualBhagyankMeanings: Record<number, BilingualBhagyankMeaning> = {
  1: {
    title: { en: 'Path of Leadership', hi: 'नेतृत्व का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant to pioneer new paths. You are destined to lead, innovate, and inspire others through independent action.',
      hi: 'आपका जीवन नए रास्ते बनाने के लिए है। आप स्वतंत्र कार्रवाई के माध्यम से नेतृत्व, नवाचार और दूसरों को प्रेरित करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop strong willpower and use it to uplift others. Your dharma is to be a trailblazer.',
      hi: 'मजबूत इच्छाशक्ति विकसित करना और इसका उपयोग दूसरों को ऊपर उठाने के लिए करना। आपका धर्म एक पथप्रदर्शक बनना है।'
    },
    karmicPurpose: {
      en: 'Learning to balance ego with service. Past life patterns of either too much or too little leadership.',
      hi: 'अहंकार को सेवा के साथ संतुलित करना सीखना। पिछले जन्म में या तो बहुत अधिक या बहुत कम नेतृत्व के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 1. This means you were born to be a leader in this lifetime.',
      hi: 'आपकी पूरी जन्म तिथि का योग 1 है। इसका मतलब है कि आप इस जन्म में नेता बनने के लिए पैदा हुए हैं।'
    },
    spiritualLesson: {
      en: 'True power comes from serving the higher good, not personal glory.',
      hi: 'सच्ची शक्ति व्यक्तिगत महिमा से नहीं, बल्कि उच्च भलाई की सेवा से आती है।'
    }
  },
  2: {
    title: { en: 'Path of Diplomacy', hi: 'कूटनीति का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant for partnership and cooperation. You are destined to bring harmony and heal relationships.',
      hi: 'आपका जीवन साझेदारी और सहयोग के लिए है। आप सामंजस्य लाने और रिश्तों को ठीक करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop patience and use your sensitivity to understand others deeply. Your dharma is to be a peacemaker.',
      hi: 'धैर्य विकसित करना और अपनी संवेदनशीलता का उपयोग दूसरों को गहराई से समझने के लिए करना। आपका धर्म शांतिदूत बनना है।'
    },
    karmicPurpose: {
      en: 'Learning to value yourself while serving others. Past life patterns of over-dependence or isolation.',
      hi: 'दूसरों की सेवा करते हुए खुद को महत्व देना सीखना। पिछले जन्म में अति-निर्भरता या अलगाव के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 2. You will fulfill your mission through relationships and harmony.',
      hi: 'आपकी पूरी जन्म तिथि का योग 2 है। आप रिश्तों और सामंजस्य के माध्यम से अपना मिशन पूरा करेंगे।'
    },
    spiritualLesson: {
      en: 'Your sensitivity is a gift - use it to bridge divides between people.',
      hi: 'आपकी संवेदनशीलता एक उपहार है - इसका उपयोग लोगों के बीच की खाई को पाटने के लिए करें।'
    }
  },
  3: {
    title: { en: 'Path of Expression', hi: 'अभिव्यक्ति का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant for creative expression and joy. You are destined to inspire others through your words and art.',
      hi: 'आपका जीवन रचनात्मक अभिव्यक्ति और आनंद के लिए है। आप अपने शब्दों और कला के माध्यम से दूसरों को प्रेरित करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop your creative gifts and share them generously. Your dharma is to spread happiness.',
      hi: 'अपने रचनात्मक उपहारों को विकसित करना और उन्हें उदारता से साझा करना। आपका धर्म खुशी फैलाना है।'
    },
    karmicPurpose: {
      en: 'Learning to focus creativity and avoid superficiality. Past life suppression of self-expression.',
      hi: 'रचनात्मकता पर ध्यान केंद्रित करना और सतहीपन से बचना सीखना। पिछले जन्म में आत्म-अभिव्यक्ति का दमन।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 3. You will bring light to the world through creativity and communication.',
      hi: 'आपकी पूरी जन्म तिथि का योग 3 है। आप रचनात्मकता और संचार के माध्यम से दुनिया में रोशनी लाएंगे।'
    },
    spiritualLesson: {
      en: 'Joy is your highest gift to the world - never let anyone dim your light.',
      hi: 'आनंद दुनिया को आपका सबसे बड़ा उपहार है - कभी किसी को अपनी रोशनी मद्धम न करने दें।'
    }
  },
  4: {
    title: { en: 'Path of Foundation', hi: 'नींव का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant to build lasting structures. You are destined to create security and stability for others.',
      hi: 'आपका जीवन स्थायी संरचनाएं बनाने के लिए है। आप दूसरों के लिए सुरक्षा और स्थिरता बनाने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop discipline and create systems that benefit many. Your dharma is to be a builder.',
      hi: 'अनुशासन विकसित करना और ऐसी प्रणालियां बनाना जो कई लोगों को लाभ पहुंचाएं। आपका धर्म निर्माता बनना है।'
    },
    karmicPurpose: {
      en: 'Learning flexibility within structure. Past life patterns of either chaos or excessive rigidity.',
      hi: 'संरचना के भीतर लचीलापन सीखना। पिछले जन्म में या तो अराजकता या अत्यधिक कठोरता के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 4. You are here to build solid foundations.',
      hi: 'आपकी पूरी जन्म तिथि का योग 4 है। आप ठोस नींव बनाने के लिए यहां हैं।'
    },
    spiritualLesson: {
      en: 'True stability comes from inner peace, not just external structure.',
      hi: 'सच्ची स्थिरता आंतरिक शांति से आती है, न कि केवल बाहरी संरचना से।'
    }
  },
  5: {
    title: { en: 'Path of Freedom', hi: 'स्वतंत्रता का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant for exploration and teaching through experience. You are destined to help others embrace change.',
      hi: 'आपका जीवन अन्वेषण और अनुभव के माध्यम से शिक्षण के लिए है। आप दूसरों को परिवर्तन अपनाने में मदद करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop adaptability and share wisdom gained through diverse experiences. Your dharma is to be a bridge between worlds.',
      hi: 'अनुकूलनशीलता विकसित करना और विविध अनुभवों से प्राप्त ज्ञान साझा करना। आपका धर्म दुनियाओं के बीच पुल बनना है।'
    },
    karmicPurpose: {
      en: 'Learning commitment while maintaining freedom. Past life patterns of either restriction or irresponsibility.',
      hi: 'स्वतंत्रता बनाए रखते हुए प्रतिबद्धता सीखना। पिछले जन्म में या तो प्रतिबंध या गैर-जिम्मेदारी के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 5. You are the messenger of freedom and change.',
      hi: 'आपकी पूरी जन्म तिथि का योग 5 है। आप स्वतंत्रता और परिवर्तन के दूत हैं।'
    },
    spiritualLesson: {
      en: 'True freedom is internal - it comes from releasing attachments.',
      hi: 'सच्ची स्वतंत्रता आंतरिक है - यह आसक्तियों को छोड़ने से आती है।'
    }
  },
  6: {
    title: { en: 'Path of Love & Service', hi: 'प्रेम और सेवा का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant for nurturing and creating beauty. You are destined to heal through love and care.',
      hi: 'आपका जीवन पोषण और सौंदर्य बनाने के लिए है। आप प्यार और देखभाल के माध्यम से ठीक करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop unconditional love and create harmony. Your dharma is to be a healer of hearts.',
      hi: 'बिना शर्त प्यार विकसित करना और सामंजस्य बनाना। आपका धर्म दिलों का उपचारक बनना है।'
    },
    karmicPurpose: {
      en: 'Learning to receive as much as you give. Past life patterns of sacrifice or neglect of self.',
      hi: 'जितना देते हैं उतना प्राप्त करना सीखना। पिछले जन्म में बलिदान या आत्म-उपेक्षा के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 6. You will fulfill your purpose through love and service.',
      hi: 'आपकी पूरी जन्म तिथि का योग 6 है। आप प्रेम और सेवा के माध्यम से अपना उद्देश्य पूरा करेंगे।'
    },
    spiritualLesson: {
      en: 'You cannot pour from an empty cup - self-love enables greater service.',
      hi: 'आप खाली कप से नहीं उंडेल सकते - आत्म-प्रेम बड़ी सेवा को सक्षम बनाता है।'
    }
  },
  7: {
    title: { en: 'Path of Wisdom', hi: 'ज्ञान का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant for spiritual seeking and sharing truth. You are destined to be a teacher of deep wisdom.',
      hi: 'आपका जीवन आध्यात्मिक खोज और सत्य साझा करने के लिए है। आप गहन ज्ञान के शिक्षक बनने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop inner knowing and guide others on their spiritual journey. Your dharma is to seek and share truth.',
      hi: 'आंतरिक ज्ञान विकसित करना और दूसरों को उनकी आध्यात्मिक यात्रा पर मार्गदर्शन करना। आपका धर्म सत्य खोजना और साझा करना है।'
    },
    karmicPurpose: {
      en: 'Learning to balance solitude with connection. Past life patterns of isolation or spiritual bypassing.',
      hi: 'एकांत को जुड़ाव के साथ संतुलित करना सीखना। पिछले जन्म में अलगाव या आध्यात्मिक बाईपास के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 7. You are a carrier of spiritual wisdom.',
      hi: 'आपकी पूरी जन्म तिथि का योग 7 है। आप आध्यात्मिक ज्ञान के वाहक हैं।'
    },
    spiritualLesson: {
      en: 'Knowledge becomes wisdom only when lived and shared with compassion.',
      hi: 'ज्ञान तभी बुद्धि बनता है जब जिया जाए और करुणा के साथ साझा किया जाए।'
    }
  },
  8: {
    title: { en: 'Path of Abundance', hi: 'समृद्धि का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant for material and spiritual mastery. You are destined to achieve and help others prosper.',
      hi: 'आपका जीवन भौतिक और आध्यात्मिक महारत के लिए है। आप उपलब्धि हासिल करने और दूसरों को समृद्ध करने में मदद करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop ethical power and use resources for collective good. Your dharma is to manifest abundance for all.',
      hi: 'नैतिक शक्ति विकसित करना और सामूहिक भलाई के लिए संसाधनों का उपयोग करना। आपका धर्म सभी के लिए प्रचुरता प्रकट करना है।'
    },
    karmicPurpose: {
      en: 'Learning to balance material and spiritual. Past life patterns of poverty consciousness or greed.',
      hi: 'भौतिक और आध्यात्मिक को संतुलित करना सीखना। पिछले जन्म में गरीबी चेतना या लालच के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 8. You are a master of karma and abundance.',
      hi: 'आपकी पूरी जन्म तिथि का योग 8 है। आप कर्म और प्रचुरता के मास्टर हैं।'
    },
    spiritualLesson: {
      en: 'True wealth is measured by what you give, not what you accumulate.',
      hi: 'सच्ची संपत्ति इस बात से मापी जाती है कि आप क्या देते हैं, न कि आप क्या जमा करते हैं।'
    }
  },
  9: {
    title: { en: 'Path of Humanitarianism', hi: 'मानवतावाद का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant for universal service and completion. You are destined to work for humanity\'s evolution.',
      hi: 'आपका जीवन सार्वभौमिक सेवा और पूर्णता के लिए है। आप मानवता के विकास के लिए काम करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop selfless love and complete karmic cycles. Your dharma is to be a light for the world.',
      hi: 'निस्वार्थ प्रेम विकसित करना और कार्मिक चक्र पूरे करना। आपका धर्म दुनिया के लिए एक प्रकाश बनना है।'
    },
    karmicPurpose: {
      en: 'Learning to let go and trust the divine plan. Past life patterns of attachment or martyrdom.',
      hi: 'जाने देना और दैवीय योजना पर भरोसा करना सीखना। पिछले जन्म में आसक्ति या शहादत के पैटर्न।'
    },
    whyThisDefinesDestiny: {
      en: 'Your full date of birth adds to 9. You were born for humanitarian service.',
      hi: 'आपकी पूरी जन्म तिथि का योग 9 है। आप मानवतावादी सेवा के लिए पैदा हुए हैं।'
    },
    spiritualLesson: {
      en: 'In giving fully, you receive everything. In letting go, you gain all.',
      hi: 'पूर्ण रूप से देने में, आप सब कुछ प्राप्त करते हैं। जाने देने में, आप सब पाते हैं।'
    }
  },
  11: {
    title: { en: 'Path of Illumination', hi: 'ज्योति का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant to be a channel for higher wisdom. You are destined to inspire spiritual awakening.',
      hi: 'आपका जीवन उच्च ज्ञान के लिए एक माध्यम होना है। आप आध्यात्मिक जागृति को प्रेरित करने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop psychic sensitivity and use it to guide others. Your dharma is to illuminate the path.',
      hi: 'मानसिक संवेदनशीलता विकसित करना और इसका उपयोग दूसरों को मार्गदर्शन करने के लिए करना। आपका धर्म मार्ग को प्रकाशित करना है।'
    },
    karmicPurpose: {
      en: 'Learning to ground spiritual insights in practical reality. Master Number carries intensified karma.',
      hi: 'आध्यात्मिक अंतर्दृष्टि को व्यावहारिक वास्तविकता में जमीन पर उतारना सीखना। मास्टर नंबर तीव्र कर्म वहन करता है।'
    },
    whyThisDefinesDestiny: {
      en: 'Your Bhagyank is 11 - a Master Number. You are chosen to be a spiritual leader.',
      hi: 'आपका भाग्यांक 11 है - एक मास्टर नंबर। आप आध्यात्मिक नेता बनने के लिए चुने गए हैं।'
    },
    spiritualLesson: {
      en: 'You are a bridge between heaven and earth - stand firmly in both worlds.',
      hi: 'आप स्वर्ग और पृथ्वी के बीच पुल हैं - दोनों दुनियाओं में मजबूती से खड़े रहें।'
    }
  },
  22: {
    title: { en: 'Path of Master Building', hi: 'मास्टर निर्माण का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant to manifest great works that serve humanity. You are destined to build something lasting.',
      hi: 'आपका जीवन महान कार्यों को प्रकट करने के लिए है जो मानवता की सेवा करते हैं। आप कुछ स्थायी बनाने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop practical spirituality and create structures that elevate consciousness. Your dharma is to build bridges.',
      hi: 'व्यावहारिक आध्यात्मिकता विकसित करना और ऐसी संरचनाएं बनाना जो चेतना को ऊपर उठाएं। आपका धर्म पुल बनाना है।'
    },
    karmicPurpose: {
      en: 'Learning to trust your grand vision while taking practical steps. Master Number intensifies responsibility.',
      hi: 'व्यावहारिक कदम उठाते हुए अपने भव्य दृष्टिकोण पर भरोसा करना सीखना। मास्टर नंबर जिम्मेदारी को तीव्र करता है।'
    },
    whyThisDefinesDestiny: {
      en: 'Your Bhagyank is 22 - the Master Builder Number. You are designated for great works.',
      hi: 'आपका भाग्यांक 22 है - मास्टर बिल्डर नंबर। आप महान कार्यों के लिए नामित हैं।'
    },
    spiritualLesson: {
      en: 'Great works require great patience. Build with love and the structure will endure.',
      hi: 'महान कार्यों के लिए महान धैर्य चाहिए। प्यार से बनाएं और संरचना टिकेगी।'
    }
  },
  33: {
    title: { en: 'Path of Master Teaching', hi: 'मास्टर शिक्षण का मार्ग' },
    lifeDirection: {
      en: 'Your life is meant to embody divine love and healing. You are destined to teach through presence and compassion.',
      hi: 'आपका जीवन दैवीय प्रेम और उपचार को मूर्त रूप देने के लिए है। आप उपस्थिति और करुणा के माध्यम से सिखाने के लिए नियत हैं।'
    },
    dharmicPath: {
      en: 'To develop Christ/Buddha consciousness and heal through unconditional love. Your dharma is cosmic healing.',
      hi: 'क्राइस्ट/बुद्ध चेतना विकसित करना और बिना शर्त प्यार के माध्यम से ठीक करना। आपका धर्म ब्रह्मांडीय उपचार है।'
    },
    karmicPurpose: {
      en: 'Learning to maintain boundaries while remaining open. Master Number carries the weight of many souls.',
      hi: 'खुले रहते हुए सीमाएं बनाए रखना सीखना। मास्टर नंबर कई आत्माओं का भार वहन करता है।'
    },
    whyThisDefinesDestiny: {
      en: 'Your Bhagyank is 33 - the rarest Master Number. You are a cosmic healer.',
      hi: 'आपका भाग्यांक 33 है - सबसे दुर्लभ मास्टर नंबर। आप एक ब्रह्मांडीय उपचारक हैं।'
    },
    spiritualLesson: {
      en: 'Your love is medicine for the world. Take care of yourself to keep giving.',
      hi: 'आपका प्यार दुनिया के लिए दवा है। देते रहने के लिए अपना ख्याल रखें।'
    }
  }
};
