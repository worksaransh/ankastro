export interface Recommendation {
  key: string; // e.g. 'career_numerology', 'plus_membership', etc.
  title: { en: string; hi: string; hinglish: string };
  reason: { en: string; hi: string; hinglish: string };
  actionText: { en: string; hi: string; hinglish: string };
  actionPath: string;
  score: number; // For sorting relevance
  category: 'report' | 'membership' | 'action';
  icon: string; // Lucide icon name
}

export function getPersonalizedRecommendations(
  profile: any,
  numerology: any,
  purchasedReports: string[],
  activePlus: boolean
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const hasPurchased = (key: string) => purchasedReports.includes(key);

  const dob = profile?.dob || null;
  const isBusinessOwner = profile?.is_business_owner || false;
  const primaryGoal = profile?.goals?.primary || null;
  const currentChallenge = profile?.goals?.challenge || null;
  const maritalStatus = profile?.marital_status || 'single';
  const profession = (profile?.profession || '').toLowerCase();
  
  const lifePath = numerology?.lifePath || null;
  const destiny = numerology?.destiny || null;
  const personalYear = numerology?.personalYear || null;

  // Rule 1: Plus Membership Upsell
  if (!activePlus) {
    recommendations.push({
      key: 'plus_membership',
      title: {
        en: 'Join AnkJyotish Plus',
        hi: 'अंकज्योतिष प्लस से जुड़ें',
        hinglish: 'AnkJyotish Plus Join Karein'
      },
      reason: {
        en: 'Get daily lucky color/number, monthly forecasts, and unlimited AI guide chat.',
        hi: 'दैनिक शुभ रंग/अंक, मासिक राशिफल और असीमित AI चैट का लाभ उठाएं।',
        hinglish: 'Pao daily lucky color/number, monthly forecasts, aur unlimited AI chat support.'
      },
      actionText: {
        en: 'Join Plus — ₹99/mo',
        hi: 'प्लस से जुड़ें — ₹99/माह',
        hinglish: 'Join Plus — ₹99/mo'
      },
      actionPath: '/plus',
      score: 0.95,
      category: 'membership',
      icon: 'Crown'
    });
  }

  // Rule 2: Career & Job Prediction
  if (!hasPurchased('career_numerology')) {
    let score = 0.5;
    let reasonText = {
      en: 'Discover your optimal career periods and hidden professional blocks.',
      hi: 'अपने करियर के सर्वोत्तम समय और छिपी हुई व्यावसायिक बाधाओं को जानें।',
      hinglish: 'Jaanein career ke best periods aur hidden obstacles ke baare mein.'
    };

    if (primaryGoal === 'career_growth' || currentChallenge === 'career_stuck') {
      score = 0.9;
      reasonText = {
        en: 'Your primary goal is career growth. Align your actions with your cosmic cycles.',
        hi: 'आपका मुख्य लक्ष्य करियर में वृद्धि है। अपने कार्यों को ब्रह्मांडीय चक्रों के साथ संरेखित करें।',
        hinglish: 'Aapka main goal career growth hai. Apne actions ko cosmic cycles ke sath align karein.'
      };
    } else if (primaryGoal === 'financial_freedom' || currentChallenge === 'money_issues') {
      score = 0.85;
      reasonText = {
        en: 'Unlock wealth alignment by matching your job vibration with your Destiny number.',
        hi: 'अपनी नौकरी के कंपन को अपने भाग्य अंक से मिलाकर धन संरेखण अनलॉक करें।',
        hinglish: 'Apne job vibration ko Destiny number se match karke wealth flow unlock karein.'
      };
    } else if (hasPurchased('mobile_numerology') && personalYear === 5) {
      score = 0.8;
      reasonText = {
        en: 'Your Personal Year 5 brings major changes. Check your Career report for guidance.',
        hi: 'आपका व्यक्तिगत वर्ष 5 बड़े बदलाव लाता है। मार्गदर्शन के लिए अपनी करियर रिपोर्ट देखें।',
        hinglish: 'Aapka Personal Year 5 shifts la raha hai. Guidance ke liye Career report check karein.'
      };
    }

    recommendations.push({
      key: 'career_numerology',
      title: {
        en: 'Career & Job Report',
        hi: 'करियर एवं नौकरी रिपोर्ट',
        hinglish: 'Career & Job Report'
      },
      reason: reasonText,
      actionText: {
        en: 'Unlock Report',
        hi: 'रिपोर्ट अनलॉक करें',
        hinglish: 'Unlock Report'
      },
      actionPath: '/buy/career-numerology-report',
      score,
      category: 'report',
      icon: 'Briefcase'
    });
  }

  // Rule 3: Business Advisor Report
  if (!hasPurchased('business_numerology')) {
    const isTargeted = isBusinessOwner || primaryGoal === 'business' || lifePath === 8 || lifePath === 1 || destiny === 8 || destiny === 1;
    if (isTargeted) {
      const score = isBusinessOwner || primaryGoal === 'business' ? 0.9 : 0.75;
      let reasonText = {
        en: 'Align your business name vibration to avoid delays and attract financial growth.',
        hi: 'देरी से बचने और वित्तीय विकास को आकर्षित करने के लिए अपने व्यावसायिक नाम को संरेखित करें।',
        hinglish: 'Apne business name vibration ko align karke growth aur sales boost karein.'
      };

      if (lifePath === 8 || destiny === 8) {
        reasonText = {
          en: 'Life Path 8 has natural business energy. Optimize your business name vibration.',
          hi: 'मूलांक 8 में प्राकृतिक व्यावसायिक ऊर्जा है। अपने व्यवसाय के नाम के कंपन को अनुकूलित करें।',
          hinglish: 'Life Path 8 me natural business energy hai. Business name vibration optimize karein.'
        };
      }

      recommendations.push({
        key: 'business_numerology',
        title: {
          en: 'Business Advisor Report',
          hi: 'बिजनेस एडवाइजर रिपोर्ट',
          hinglish: 'Business Advisor Report'
        },
        reason: reasonText,
        actionText: {
          en: 'Optimize Name',
          hi: 'नाम ठीक करें',
          hinglish: 'Optimize Name'
        },
        actionPath: '/buy/business-numerology-report',
        score,
        category: 'report',
        icon: 'Building2'
      });
    }
  }

  // Rule 4: Name Correction (Core recommendation for everyone)
  if (!hasPurchased('name_correction')) {
    recommendations.push({
      key: 'name_correction',
      title: {
        en: 'Name Spelling Correction',
        hi: 'नाम वर्तनी सुधार',
        hinglish: 'Name Spelling Correction'
      },
      reason: {
        en: 'Your name is your vibration. Check if spelling tweaks can remove struggles and attract success.',
        hi: 'आपका नाम आपकी ऊर्जा है। जांचें कि क्या मामूली वर्तनी सुधार आपके जीवन से संघर्ष हटा सकते हैं।',
        hinglish: 'Aapka naam aapka vibration hai. Check karein spelling tweaks se growth kaise badhegi.'
      },
      actionText: {
        en: 'Correct Spelling',
        hi: 'वर्तनी सुधारें',
        hinglish: 'Correct Spelling'
      },
      actionPath: '/buy/name-correction-report',
      score: 0.75,
      category: 'report',
      icon: 'Wand2'
    });
  }

  // Rule 5: Love & Compatibility
  if (!hasPurchased('compatibility_report')) {
    let score = 0.4;
    let reasonText = {
      en: 'Find relationship score and trust-conflict dynamics with your partner.',
      hi: 'अपने साथी के साथ संबंध स्कोर और विश्वास-संघर्ष पैटर्न का पता लगाएं।',
      hinglish: 'Partner ke sath compatibility score aur trust-conflict patterns jaanein.'
    };

    if (primaryGoal === 'find_love' || currentChallenge === 'relationship_issues') {
      score = 0.85;
      reasonText = {
        en: 'Heal and understand your love vibration using the Compatibility Report.',
        hi: 'अनुकूलता रिपोर्ट का उपयोग करके अपने प्रेम संबंधों के कंपन को समझें और सुधारें।',
        hinglish: 'Compatibility Report se apne love life challenges ko behtar samjhein.'
      };
    } else if (maritalStatus === 'married' || maritalStatus === 'separated') {
      score = 0.7;
      reasonText = {
        en: 'Deepen your relationship bond by understanding mutual personality numbers.',
        hi: 'आपसी व्यक्तित्व अंकों को समझकर अपने रिश्ते के बंधन को गहरा करें।',
        hinglish: 'Mutual personality numbers ko samajh kar apne relationship ko majboot banayein.'
      };
    }

    recommendations.push({
      key: 'compatibility_report',
      title: {
        en: 'Love Compatibility',
        hi: 'प्रेम अनुकूलता रिपोर्ट',
        hinglish: 'Love Compatibility'
      },
      reason: reasonText,
      actionText: {
        en: 'Check Match',
        hi: 'मैच चेक करें',
        hinglish: 'Check Match'
      },
      actionPath: '/buy/compatibility-report',
      score,
      category: 'report',
      icon: 'Heart'
    });
  }

  // Rule 6: Marriage Timing
  if (!hasPurchased('marriage_report')) {
    let score = 0.4;
    let reasonText = {
      en: 'Identify the best year/month cycles for marriage and overall marital success.',
      hi: 'शादी के लिए सबसे शुभ वर्ष/महीने के चक्रों और वैवाहिक सफलता की पहचान करें।',
      hinglish: 'Shaadi ke liye sabse shubh saal/mahina cycles aur marital success jaanein.'
    };

    if (hasPurchased('compatibility_report')) {
      score = 0.8;
      reasonText = {
        en: 'You checked compatibility. Now discover the most favorable marriage timing cycle.',
        hi: 'आपने अनुकूलता जांची है। अब विवाह के लिए सबसे अनुकूल समय चक्र की खोज करें।',
        hinglish: 'Aapne compatibility check ki. Ab sabse favorable marriage timing cycle jaanein.'
      };
    } else if (primaryGoal === 'find_love' || maritalStatus === 'single') {
      score = 0.65;
      reasonText = {
        en: 'Find when your relationship houses activate for marriage union.',
        hi: 'जानें कि विवाह बंधन के लिए आपके संबंध भाव कब सक्रिय होते हैं।',
        hinglish: 'Jaanein shaadi ke liye aapka marriage union cycle kab shuru ho raha hai.'
      };
    }

    recommendations.push({
      key: 'marriage_report',
      title: {
        en: 'Marriage Timing Report',
        hi: 'विवाह समय रिपोर्ट',
        hinglish: 'Marriage Timing Report'
      },
      reason: reasonText,
      actionText: {
        en: 'Find Best Date',
        hi: 'शुभ तिथि खोजें',
        hinglish: 'Find Best Date'
      },
      actionPath: '/buy/marriage-report',
      score,
      category: 'report',
      icon: 'Calendar'
    });
  }

  // Rule 7: Mobile Vibration
  if (!hasPurchased('mobile_numerology')) {
    recommendations.push({
      key: 'mobile_numerology',
      title: {
        en: 'Mobile Number Report',
        hi: 'मोबाइल नंबर रिपोर्ट',
        hinglish: 'Mobile Number Report'
      },
      reason: {
        en: 'Is your phone number attracting opportunities or generating losses? Find its score.',
        hi: 'क्या आपका फोन नंबर अवसरों को आकर्षित कर रहा है या नुकसान? इसका कंपन स्कोर जानें।',
        hinglish: 'Check karein aapka mobile number positive vibes la raha hai ya money drain.'
      },
      actionText: {
        en: 'Check Number',
        hi: 'नंबर चेक करें',
        hinglish: 'Check Number'
      },
      actionPath: '/buy/mobile-numerology-report',
      score: 0.7,
      category: 'report',
      icon: 'Smartphone'
    });
  }

  // Rule 8: Property & House
  if (!hasPurchased('property_numerology')) {
    recommendations.push({
      key: 'property_numerology',
      title: {
        en: 'Property & House Report',
        hi: 'संपत्ति एवं घर रिपोर्ट',
        hinglish: 'Property & House Report'
      },
      reason: {
        en: 'Ensure your house address energy supports peace, abundance, and health.',
        hi: 'सुनिश्चित करें कि आपके घर के पते का कंपन शांति, प्रचुरता और स्वास्थ्य का समर्थन करता है।',
        hinglish: 'Apne ghar ke number ka vibration check karein peace, wealth aur health ke liye.'
      },
      actionText: {
        en: 'Check Property',
        hi: 'प्रॉपर्टी चेक करें',
        hinglish: 'Check Property'
      },
      actionPath: '/buy/property-numerology-report',
      score: 0.6,
      category: 'report',
      icon: 'Home'
    });
  }

  // Rule 9: Baby Name Report
  if (!hasPurchased('baby_name')) {
    recommendations.push({
      key: 'baby_name',
      title: {
        en: 'Lucky Baby Name Report',
        hi: 'भाग्यशाली शिशु नाम रिपोर्ट',
        hinglish: 'Lucky Baby Name Report'
      },
      reason: {
        en: 'Find modern, numerology-aligned names matching your child\'s birth details.',
        hi: 'अपने बच्चे के जन्म विवरण से मेल खाने वाले आधुनिक, अंक ज्योतिष-संरेखित नाम खोजें।',
        hinglish: 'Apne child ke birth details ke according lucky modern names select karein.'
      },
      actionText: {
        en: 'Find Names',
        hi: 'नाम खोजें',
        hinglish: 'Find Names'
      },
      actionPath: '/buy/baby-name-report',
      score: 0.5,
      category: 'report',
      icon: 'Baby'
    });
  }

  // Sort by score descending (most relevant first)
  return recommendations.sort((a, b) => b.score - a.score);
}
