import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'hinglish';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getText: (trilingual: { en: string; hi: string; hinglish?: string } | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary - now with Hinglish
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'common.downloadPdf': 'Download PDF',
    'common.print': 'Print',
    'common.visual': 'Visual',
    'common.basicReport': 'Basic Report',
    'common.advancedVedicReport': 'Advanced Vedic Report',
    'common.generating': 'Generating...',
    'common.calculating': 'Calculating your advanced cosmic blueprint...',
    'common.continue': 'Continue Your Destiny →',
    'common.revealPath': 'Reveal My Path',
    'common.knowCompatibility': 'Know My Compatibility',
    'common.getFullReport': 'Get My Full Report (₹499)',
    'common.whatDoesThisMean': 'What does this mean?',
    'common.unlocking': 'Unlocking your report…',
    'common.verifyingAccess': 'Verifying your access. This usually takes just a few seconds.',
    'common.upgradeToast': 'Upgrade to Premium to download your complete report!',
    
    // Brand
    'brand.name': 'Ankjyotish',
    'brand.tagline': 'Divine Numerology AI',
    'brand.footer': 'Ankjyotish • Premium Vedic Numerology',
    
    // Home
    'home.title1': 'Ank',
    'home.title2': 'jyotish',
    'home.subtitle': 'Discover the sacred numbers that shape your destiny. Uncover your life purpose, hidden talents, and the cosmic guidance written in your birth date and name.',
    'home.premiumNote': 'Premium numerology readings with 50+ personality combination insights',
    'home.cta': 'Begin Your Journey',
    'home.areasTitle': 'Areas I Guide You Through',
    'home.areasSubtitle': 'Comprehensive insights across all dimensions of life',
    
    // Tabs
    'tabs.vedic': 'Vedic',
    'tabs.charts': 'Charts',
    'tabs.predictions': 'Predictions',
    'tabs.remedies': 'Remedies',
    'tabs.actionPlan': 'Action Plan',
    
    // Summary Cards
    'summary.mulank': 'Mulank',
    'summary.bhagyank': 'Bhagyank',
    'summary.harmony': 'Harmony',
    'summary.chakraBalance': 'Chakra Balance',
    
    // Vedic Section
    'vedic.mulankTitle': 'Mulank (Birth Number)',
    'vedic.bhagyankTitle': 'Bhagyank (Destiny Number)',
    'vedic.emotionalCore': 'Emotional Core',
    'vedic.naturalBehavior': 'Natural Behavior',
    'vedic.strengths': 'Strengths',
    'vedic.weaknesses': 'Weaknesses',
    'vedic.howCalculated': 'How was it calculated?',
    'vedic.whyThisDefinesDestiny': 'Why this number defines your destiny?',
    'vedic.dayInLife': 'A Day in the Life of Mulank',
    'vedic.famousPersonalities': 'Famous Personalities with Mulank',
    'vedic.harmonyMeter': 'Mulank vs Bhagyank Harmony Meter',
    'vedic.lifeDirection': 'Life Direction',
    'vedic.dharmicPath': 'Dharmic Path',
    'vedic.karmicPurpose': 'Karmic Purpose',
    'vedic.spiritualLesson': 'Spiritual Lesson',
    'vedic.formula.mulank': 'Birth Date → Single Digit (Master numbers 11, 22, 33 preserved)',
    'vedic.formula.bhagyank': 'Full DOB (DD + MM + YYYY) → Single Digit',
    'vedic.yourBirthDate': 'Your birth date',
    'vedic.harmonyExcellent': 'Your Mulank and Bhagyank are in perfect alignment, supporting each other\'s energy.',
    'vedic.harmonyGood': 'Your numbers work well together with minor adjustments needed for optimal flow.',
    'vedic.harmonyModerate': 'Some tension exists between your numbers - awareness and balance practices will help.',
    'vedic.harmonyChallenging': 'Your numbers create dynamic tension - this can be channeled into growth with proper guidance.',
    
    // Predictions
    'predictions.next12Months': 'Next 12 Months Breakdown',
    'predictions.next10Years': '10-Year Growth Analysis',
    'predictions.turningPoint': 'Turning Point',
    'predictions.growth': 'Growth',
    'predictions.challenges': 'Challenges',
    'predictions.score': 'Score',
    'predictions.theme': 'Theme',
    'predictions.action': 'Action',
    
    // Remedies
    'remedies.luckyAttributes': 'Lucky Attributes',
    'remedies.direction': 'Direction (Vastu)',
    'remedies.suggestedColors': 'Suggested Colors',
    'remedies.suggestedStones': 'Suggested Stones',
    'remedies.chakraHealing': 'Chakra Healing',
    'remedies.weakChakra': 'Weak Chakra',
    'remedies.balancingTip': 'Balancing Tip',
    'remedies.personalMantra': 'Personal Mantra',
    'remedies.grahEnergy': 'Grah (Planetary) Energy',
    'remedies.balancingGuidance': 'Balancing Guidance',
    'remedies.dosAndDonts': 'Do\'s and Don\'ts',
    'remedies.dos': 'Do\'s',
    'remedies.donts': 'Don\'ts',
    'remedies.disclaimer': 'Disclaimer: These suggestions are for spiritual guidance only. Not medical advice.',
    
    // Action Plan
    'action.manifestationChecklist': 'Manifestation Alignment Checklist',
    'action.personalityBlueprint': 'Personality Blueprint',
    'action.coreStrengths': 'Core Strengths',
    'action.growthAreas': 'Growth Areas',
    'action.idealCareerPath': 'Ideal Career Path',
    'action.loveStyle': 'Love Style',
    
    // Closing
    'closing.quote': 'Your numbers are your cosmic fingerprint. Embrace them.',
    'closing.description': 'This advanced report combines ancient Vedic wisdom with modern numerology to guide your spiritual and practical journey.',
    'footer.brand': 'Ankjyotish • Premium Vedic Report',
    
    // Form Steps
    'form.step1': 'Personal Information',
    'form.step2': 'Life Context',
    'form.step3': 'Goals & Guidance',
    'form.step4': 'Compatibility',
    'form.next': 'Continue Your Destiny →',
    'form.prev': 'Previous',
    'form.submit': 'Reveal My Path',
    'form.stepOf': 'Step {current} of {total}',
    'form.complete': '% Complete',
    'form.progressRestored': 'Your previous progress has been restored!',
    'form.saving': 'Saving...',
    'form.autoSaved': 'Auto-saved',
    'form.optional': 'optional',
    'form.currentNameHelp': 'Leave blank if same as birth name. Used only for nickname-based readings.',
    'explainer.title': 'What is this report?',
    'explainer.body': 'This is your personal numerology blueprint based on your name and date of birth. It shows your core personality, life direction, strengths, and the themes ahead — in plain language. Use it as guidance, not prediction.',
    
    // Form Labels - Step 1
    'form.fullBirthName': 'Full Birth Name',
    'form.fullBirthNamePlaceholder': 'Enter your complete birth name',
    'form.currentName': 'Current Name (Short Name)',
    'form.currentNamePlaceholder': 'Name you go by',
    'form.dateOfBirth': 'Date of Birth (DD/MM/YYYY)',
    'form.dateOfBirthPlaceholder': '15/03/1990',
    'form.gender': 'Gender',
    'form.selectGender': 'Select gender',
    'form.male': 'Male',
    'form.female': 'Female',
    'form.other': 'Other',
    'form.preferNotToSay': 'Prefer not to say',
    'form.country': 'Country',
    'form.countryPlaceholder': 'Your country',
    'form.city': 'City',
    'form.cityPlaceholder': 'Your city',
    'form.email': 'Email (for PDF delivery)',
    'form.emailPlaceholder': 'your@email.com',
    'form.whatsapp': 'WhatsApp Number (Optional)',
    'form.whatsappPlaceholder': 'Your WhatsApp number',
    
    // Form Labels - Step 2
    'form.step2Intro': 'These details help personalize your reading (optional)',
    'form.relationshipStatus': 'Relationship Status',
    'form.selectStatus': 'Select status',
    'form.single': 'Single',
    'form.married': 'Married',
    'form.complicated': "It's Complicated",
    'form.profession': 'Profession / Business / Student',
    'form.professionPlaceholder': 'What do you do?',
    'form.lifeFocusTitle': 'Primary Life Focus',
    'form.lifeFocusSubtitle': 'What matters most right now? I will guide you across these areas.',
    'form.careerSuccess': 'Career & Success',
    'form.loveRelationships': 'Love & Relationships',
    'form.moneyAbundance': 'Money & Abundance',
    'form.healthWellbeing': 'Health & Wellbeing',
    'form.personalGrowth': 'Personal Growth',
    
    // Form Labels - Step 3
    'form.step3Title': 'Help us understand what guidance you seek',
    'form.step3Subtitle': '(optional but powerful)',
    'form.biggestChallenge': 'Biggest Challenge Right Now',
    'form.biggestChallengePlaceholder': 'What is your biggest struggle or obstacle?',
    'form.mainGoal': 'Main Goal for Next 1 Year',
    'form.mainGoalPlaceholder': 'What do you want to achieve or manifest?',
    'form.fearOrStuck': 'Something You Fear or Feel Stuck With',
    'form.fearOrStuckPlaceholder': 'Where do you feel blocked emotionally?',
    'form.confusedBetween': 'What are you confused between?',
    'form.confusedBetweenPlaceholder': 'Job vs Business, Stay vs Leave, Love vs Self-Healing?',
    'form.destinyCallingYou': 'Where do you feel destiny is calling you?',
    'form.destinyCallingYouPlaceholder': 'Career, travel, healing, restarting life, money, etc.',
    'form.repeatingPattern': 'What pattern keeps repeating in your life?',
    'form.repeatingPatternPlaceholder': 'Heartbreak, money issues, trust, family pressure?',
    'form.miracleWish': 'If one miracle could happen, what would it be?',
    'form.miracleWishPlaceholder': 'Write from your heart...',
    'form.trustQuote': 'Thank you for trusting this process. I will guide you with clarity, respect, and emotional accuracy.',
    
    // Form Labels - Step 4
    'form.includeCompatibility': 'Include Compatibility Analysis',
    'form.compatibilitySubtitle': 'Add partner or business partner details',
    'form.romanticPartner': 'Romantic Partner',
    'form.partnerName': "Partner's Name",
    'form.partnerNamePlaceholder': "Partner's full name",
    'form.partnerDob': "Partner's DOB (DD/MM/YYYY)",
    'form.businessPartner': 'Business Partner',
    'form.businessPartnerName': "Business Partner's Name",
    'form.businessPartnerNamePlaceholder': "Business partner's full name",
    'form.businessPartnerDob': "Business Partner's DOB",
    
    // Validation Messages
    'validation.enterBirthName': 'Please enter your full birth name',
    'validation.nameTooShort': 'Name must be at least 2 characters',
    'validation.nameTooLong': 'Name must be under 100 characters',
    'validation.enterCurrentName': 'Please enter your current name',
    'validation.enterValidDob': 'Please enter date as DD/MM/YYYY',
    'validation.dobInvalid': 'This date does not exist',
    'validation.dobFuture': 'Date of birth cannot be in the future',
    'validation.dobTooOld': 'Please enter a realistic date of birth',
    'validation.enterValidEmail': 'Please enter a valid email address',
    'validation.selectGender': 'Please select a gender',
    'validation.invalidWhatsapp': 'Enter a valid phone number (7–15 digits)',
    'validation.partnerNameRequired': "Partner's name is required",
    'validation.partnerDobRequired': "Partner's date of birth is required",
    'validation.fixErrorsAbove': 'Please fix the highlighted errors above',
    
    // Micro-win Messages
    'form.microWin2': '✨ Great start! Now tell me about your life context',
    'form.microWin3': '🎯 Excellent! Your goals will help me guide you better',
    'form.microWin4': '💫 Almost there! Want to check compatibility?',
    
    // Months
    'month.January': 'January',
    'month.February': 'February',
    'month.March': 'March',
    'month.April': 'April',
    'month.May': 'May',
    'month.June': 'June',
    'month.July': 'July',
    'month.August': 'August',
    'month.September': 'September',
    'month.October': 'October',
    'month.November': 'November',
    'month.December': 'December',
    
    // Chakras
    'chakra.root': 'Root',
    'chakra.sacral': 'Sacral',
    'chakra.solarPlexus': 'Solar Plexus',
    'chakra.heart': 'Heart',
    'chakra.throat': 'Throat',
    'chakra.thirdEye': 'Third Eye',
    'chakra.crown': 'Crown',
    'chakra.overallBalance': 'Overall Balance',
    'chakra.balanced': 'Well balanced',
    'chakra.needsFocus': 'Focus on strengthening',
    
    // Chart labels
    'chart.lifeTimeline': 'Life Timeline Phases',
    'chart.chakraRadar': 'Chakra Alignment Radar',
    'chart.yearlyMomentum': '10-Year Momentum Forecast',
    'chart.monthlyMomentum': '12-Month Energy Forecast',
    'chart.energy': 'Energy',
    'chart.opportunities': 'Opportunities',
    'chart.challenges': 'Challenges',
    'chart.pause': 'Pause',
    'chart.build': 'Build',
    'chart.breakthrough': 'Breakthrough',
    'chart.age': 'Age',
    'chart.year': 'Year',
  },
  hi: {
    // Common
    'common.downloadPdf': 'PDF डाउनलोड करें',
    'common.print': 'प्रिंट',
    'common.visual': 'विज़ुअल',
    'common.basicReport': 'बेसिक रिपोर्ट',
    'common.advancedVedicReport': 'एडवांस वैदिक रिपोर्ट',
    'common.generating': 'जनरेट हो रहा है...',
    'common.calculating': 'आपका कॉस्मिक ब्लूप्रिंट तैयार हो रहा है...',
    'common.continue': 'अपनी नियति जारी रखें →',
    'common.revealPath': 'मेरा पथ प्रकट करें',
    'common.knowCompatibility': 'मेरी अनुकूलता जानें',
    'common.getFullReport': 'पूर्ण रिपोर्ट प्राप्त करें (₹499)',
    'common.whatDoesThisMean': 'इसका क्या मतलब है?',
    'common.unlocking': 'आपकी रिपोर्ट अनलॉक हो रही है…',
    'common.verifyingAccess': 'आपकी पहुंच की पुष्टि की जा रही है। आमतौर पर कुछ सेकंड लगते हैं।',
    'common.upgradeToast': 'पूर्ण रिपोर्ट डाउनलोड करने के लिए प्रीमियम में अपग्रेड करें!',
    
    // Brand
    'brand.name': 'अंकज्योतिष',
    'brand.tagline': 'दिव्य अंकशास्त्र AI',
    'brand.footer': 'अंकज्योतिष • प्रीमियम वैदिक अंकशास्त्र',
    
    // Home
    'home.title1': 'अंक',
    'home.title2': 'ज्योतिष',
    'home.subtitle': 'उन पवित्र संख्याओं को खोजें जो आपकी नियति को आकार देती हैं। अपने जीवन का उद्देश्य, छिपी प्रतिभाएं, और आपकी जन्म तिथि और नाम में लिखित दिव्य मार्गदर्शन प्राप्त करें।',
    'home.premiumNote': '50+ व्यक्तित्व संयोजन अंतर्दृष्टि के साथ प्रीमियम अंकशास्त्र रीडिंग',
    'home.cta': 'अपनी यात्रा शुरू करें',
    'home.areasTitle': 'जिन क्षेत्रों में मैं आपका मार्गदर्शन करता हूं',
    'home.areasSubtitle': 'जीवन के सभी आयामों में व्यापक अंतर्दृष्टि',
    
    // Tabs
    'tabs.vedic': 'वैदिक',
    'tabs.charts': 'चार्ट्स',
    'tabs.predictions': 'भविष्यवाणी',
    'tabs.remedies': 'उपाय',
    'tabs.actionPlan': 'कार्य योजना',
    
    // Summary Cards
    'summary.mulank': 'मूलांक',
    'summary.bhagyank': 'भाग्यांक',
    'summary.harmony': 'सामंजस्य',
    'summary.chakraBalance': 'चक्र संतुलन',
    
    // Vedic Section
    'vedic.mulankTitle': 'मूलांक (जन्म संख्या)',
    'vedic.bhagyankTitle': 'भाग्यांक (भाग्य संख्या)',
    'vedic.emotionalCore': 'भावनात्मक केंद्र',
    'vedic.naturalBehavior': 'स्वाभाविक व्यवहार',
    'vedic.strengths': 'ताकतें',
    'vedic.weaknesses': 'कमजोरियां',
    'vedic.howCalculated': 'कैसे निकला?',
    'vedic.whyThisDefinesDestiny': 'यह संख्या आपकी नियति क्यों निर्धारित करती है?',
    'vedic.dayInLife': 'मूलांक की एक दिन की जिंदगी',
    'vedic.famousPersonalities': 'मूलांक वाले प्रसिद्ध व्यक्तित्व',
    'vedic.harmonyMeter': 'मूलांक vs भाग्यांक सामंजस्य मीटर',
    'vedic.lifeDirection': 'जीवन दिशा',
    'vedic.dharmicPath': 'धार्मिक पथ',
    'vedic.karmicPurpose': 'कार्मिक उद्देश्य',
    'vedic.spiritualLesson': 'आध्यात्मिक सबक',
    'vedic.formula.mulank': 'जन्म तिथि → एकल अंक (मास्टर नंबर 11, 22, 33 संरक्षित)',
    'vedic.formula.bhagyank': 'पूर्ण DOB (DD + MM + YYYY) → एकल अंक',
    'vedic.yourBirthDate': 'आपकी जन्म तिथि',
    'vedic.harmonyExcellent': 'आपका मूलांक और भाग्यांक पूर्ण सामंजस्य में हैं, एक दूसरे की ऊर्जा का समर्थन करते हैं।',
    'vedic.harmonyGood': 'आपकी संख्याएं अच्छी तरह से काम करती हैं, इष्टतम प्रवाह के लिए मामूली समायोजन की आवश्यकता है।',
    'vedic.harmonyModerate': 'आपकी संख्याओं के बीच कुछ तनाव है - जागरूकता और संतुलन अभ्यास मदद करेंगे।',
    'vedic.harmonyChallenging': 'आपकी संख्याएं गतिशील तनाव बनाती हैं - इसे उचित मार्गदर्शन से विकास में बदला जा सकता है।',
    
    // Predictions
    'predictions.next12Months': 'अगले 12 महीनों का विवरण',
    'predictions.next10Years': '10 वर्ष विकास विश्लेषण',
    'predictions.turningPoint': 'टर्निंग पॉइंट',
    'predictions.growth': 'विकास',
    'predictions.challenges': 'चुनौतियां',
    'predictions.score': 'स्कोर',
    'predictions.theme': 'थीम',
    'predictions.action': 'क्रिया',
    
    // Remedies
    'remedies.luckyAttributes': 'शुभ गुण',
    'remedies.direction': 'दिशा (वास्तु)',
    'remedies.suggestedColors': 'सुझाए गए रंग',
    'remedies.suggestedStones': 'सुझाए गए रत्न',
    'remedies.chakraHealing': 'चक्र उपचार',
    'remedies.weakChakra': 'कमजोर चक्र',
    'remedies.balancingTip': 'संतुलन टिप',
    'remedies.personalMantra': 'व्यक्तिगत मंत्र',
    'remedies.grahEnergy': 'ग्रह ऊर्जा',
    'remedies.balancingGuidance': 'संतुलन मार्गदर्शन',
    'remedies.dosAndDonts': 'क्या करें और क्या न करें',
    'remedies.dos': 'करें',
    'remedies.donts': 'न करें',
    'remedies.disclaimer': 'अस्वीकरण: ये सुझाव केवल आध्यात्मिक मार्गदर्शन के लिए हैं। चिकित्सा सलाह नहीं।',
    
    // Action Plan
    'action.manifestationChecklist': 'अभिव्यक्ति संरेखण चेकलिस्ट',
    'action.personalityBlueprint': 'व्यक्तित्व ब्लूप्रिंट',
    'action.coreStrengths': 'मुख्य ताकतें',
    'action.growthAreas': 'विकास क्षेत्र',
    'action.idealCareerPath': 'आदर्श करियर पथ',
    'action.loveStyle': 'प्रेम शैली',
    
    // Closing
    'closing.quote': 'आपकी संख्याएं आपकी कॉस्मिक पहचान हैं। उन्हें अपनाएं।',
    'closing.description': 'यह उन्नत रिपोर्ट प्राचीन वैदिक ज्ञान को आधुनिक अंकशास्त्र के साथ जोड़ती है।',
    'footer.brand': 'अंकज्योतिष • प्रीमियम वैदिक रिपोर्ट',
    
    // Form Steps
    'form.step1': 'व्यक्तिगत जानकारी',
    'form.step2': 'जीवन संदर्भ',
    'form.step3': 'लक्ष्य और मार्गदर्शन',
    'form.step4': 'अनुकूलता',
    'form.next': 'अपनी नियति जारी रखें →',
    'form.prev': 'पिछला',
    'form.submit': 'मेरा पथ प्रकट करें',
    'form.stepOf': 'चरण {current} का {total}',
    'form.complete': '% पूर्ण',
    'form.progressRestored': 'आपकी पिछली प्रगति बहाल हो गई!',
    'form.saving': 'सहेजा जा रहा है...',
    'form.autoSaved': 'ऑटो-सेव हो गया',
    'form.optional': 'वैकल्पिक',
    'form.currentNameHelp': 'अगर जन्म नाम जैसा ही है तो खाली छोड़ दें। यह केवल उपनाम आधारित रीडिंग के लिए है।',
    'explainer.title': 'यह रिपोर्ट क्या है?',
    'explainer.body': 'यह आपके नाम और जन्मतिथि पर आधारित आपकी व्यक्तिगत अंकशास्त्र रिपोर्ट है। यह आपके मूल व्यक्तित्व, जीवन की दिशा, शक्तियों और आगे आने वाले विषयों को सरल भाषा में दिखाती है। इसे मार्गदर्शन के रूप में लें, भविष्यवाणी के रूप में नहीं।',
    
    // Form Labels - Step 1
    'form.fullBirthName': 'पूर्ण जन्म नाम',
    'form.fullBirthNamePlaceholder': 'अपना पूरा जन्म नाम दर्ज करें',
    'form.currentName': 'वर्तमान नाम (छोटा नाम)',
    'form.currentNamePlaceholder': 'जिस नाम से जाने जाते हैं',
    'form.dateOfBirth': 'जन्म तिथि (DD/MM/YYYY)',
    'form.dateOfBirthPlaceholder': '15/03/1990',
    'form.gender': 'लिंग',
    'form.selectGender': 'लिंग चुनें',
    'form.male': 'पुरुष',
    'form.female': 'महिला',
    'form.other': 'अन्य',
    'form.preferNotToSay': 'बताना नहीं चाहते',
    'form.country': 'देश',
    'form.countryPlaceholder': 'आपका देश',
    'form.city': 'शहर',
    'form.cityPlaceholder': 'आपका शहर',
    'form.email': 'ईमेल (PDF के लिए)',
    'form.emailPlaceholder': 'your@email.com',
    'form.whatsapp': 'व्हाट्सएप नंबर (वैकल्पिक)',
    'form.whatsappPlaceholder': 'आपका व्हाट्सएप नंबर',
    
    // Form Labels - Step 2
    'form.step2Intro': 'ये विवरण आपकी रीडिंग को व्यक्तिगत बनाने में मदद करते हैं (वैकल्पिक)',
    'form.relationshipStatus': 'रिश्ते की स्थिति',
    'form.selectStatus': 'स्थिति चुनें',
    'form.single': 'अविवाहित',
    'form.married': 'विवाहित',
    'form.complicated': 'जटिल है',
    'form.profession': 'पेशा / व्यवसाय / छात्र',
    'form.professionPlaceholder': 'आप क्या करते हैं?',
    'form.lifeFocusTitle': 'जीवन का मुख्य फोकस',
    'form.lifeFocusSubtitle': 'अभी सबसे महत्वपूर्ण क्या है? मैं इन क्षेत्रों में आपका मार्गदर्शन करूंगा।',
    'form.careerSuccess': 'करियर और सफलता',
    'form.loveRelationships': 'प्रेम और रिश्ते',
    'form.moneyAbundance': 'धन और समृद्धि',
    'form.healthWellbeing': 'स्वास्थ्य और तंदुरुस्ती',
    'form.personalGrowth': 'व्यक्तिगत विकास',
    
    // Form Labels - Step 3
    'form.step3Title': 'मुझे बताएं आप किस मार्गदर्शन की तलाश में हैं',
    'form.step3Subtitle': '(वैकल्पिक पर शक्तिशाली)',
    'form.biggestChallenge': 'अभी सबसे बड़ी चुनौती',
    'form.biggestChallengePlaceholder': 'आपकी सबसे बड़ी समस्या या बाधा क्या है?',
    'form.mainGoal': 'अगले 1 साल का मुख्य लक्ष्य',
    'form.mainGoalPlaceholder': 'आप क्या हासिल करना या प्रकट करना चाहते हैं?',
    'form.fearOrStuck': 'जिससे आप डरते हैं या फंसा हुआ महसूस करते हैं',
    'form.fearOrStuckPlaceholder': 'आप भावनात्मक रूप से कहाँ अटके हैं?',
    'form.confusedBetween': 'आप किस बात को लेकर भ्रमित हैं?',
    'form.confusedBetweenPlaceholder': 'नौकरी vs व्यापार, रहना vs जाना, प्यार vs स्व-उपचार?',
    'form.destinyCallingYou': 'आपको नियति कहाँ बुला रही है?',
    'form.destinyCallingYouPlaceholder': 'करियर, यात्रा, उपचार, जीवन पुनः आरंभ, धन, आदि।',
    'form.repeatingPattern': 'जीवन में कौन सा पैटर्न बार-बार दोहराता है?',
    'form.repeatingPatternPlaceholder': 'दिल टूटना, पैसे की समस्या, विश्वास, पारिवारिक दबाव?',
    'form.miracleWish': 'अगर एक चमत्कार हो सकता, तो वह क्या होता?',
    'form.miracleWishPlaceholder': 'अपने दिल से लिखें...',
    'form.trustQuote': 'इस प्रक्रिया पर भरोसा करने के लिए धन्यवाद। मैं स्पष्टता, सम्मान और भावनात्मक सटीकता के साथ मार्गदर्शन करूंगा।',
    
    // Form Labels - Step 4
    'form.includeCompatibility': 'अनुकूलता विश्लेषण शामिल करें',
    'form.compatibilitySubtitle': 'साथी या व्यापार साझेदार का विवरण जोड़ें',
    'form.romanticPartner': 'रोमांटिक साथी',
    'form.partnerName': 'साथी का नाम',
    'form.partnerNamePlaceholder': 'साथी का पूरा नाम',
    'form.partnerDob': 'साथी की जन्म तिथि (DD/MM/YYYY)',
    'form.businessPartner': 'व्यापार साझेदार',
    'form.businessPartnerName': 'व्यापार साझेदार का नाम',
    'form.businessPartnerNamePlaceholder': 'व्यापार साझेदार का पूरा नाम',
    'form.businessPartnerDob': 'व्यापार साझेदार की जन्म तिथि',
    
    // Validation Messages
    'validation.enterBirthName': 'कृपया अपना पूर्ण जन्म नाम दर्ज करें',
    'validation.nameTooShort': 'नाम कम से कम 2 अक्षरों का होना चाहिए',
    'validation.nameTooLong': 'नाम 100 अक्षरों से कम होना चाहिए',
    'validation.enterCurrentName': 'कृपया अपना वर्तमान नाम दर्ज करें',
    'validation.enterValidDob': 'कृपया तिथि DD/MM/YYYY रूप में दर्ज करें',
    'validation.dobInvalid': 'यह तिथि मान्य नहीं है',
    'validation.dobFuture': 'जन्म तिथि भविष्य में नहीं हो सकती',
    'validation.dobTooOld': 'कृपया वास्तविक जन्म तिथि दर्ज करें',
    'validation.enterValidEmail': 'कृपया वैध ईमेल पता दर्ज करें',
    'validation.selectGender': 'कृपया लिंग चुनें',
    'validation.invalidWhatsapp': 'वैध फ़ोन नंबर दर्ज करें (7–15 अंक)',
    'validation.partnerNameRequired': 'साथी का नाम आवश्यक है',
    'validation.partnerDobRequired': 'साथी की जन्म तिथि आवश्यक है',
    'validation.fixErrorsAbove': 'कृपया ऊपर हाइलाइट की गई त्रुटियों को ठीक करें',
    
    // Micro-win Messages
    'form.microWin2': '✨ बढ़िया शुरुआत! अब अपने जीवन के बारे में बताएं',
    'form.microWin3': '🎯 उत्कृष्ट! आपके लक्ष्य मुझे बेहतर मार्गदर्शन करने में मदद करेंगे',
    'form.microWin4': '💫 लगभग हो गया! अनुकूलता जांचना चाहते हैं?',
    
    // Months
    'month.January': 'जनवरी',
    'month.February': 'फरवरी',
    'month.March': 'मार्च',
    'month.April': 'अप्रैल',
    'month.May': 'मई',
    'month.June': 'जून',
    'month.July': 'जुलाई',
    'month.August': 'अगस्त',
    'month.September': 'सितंबर',
    'month.October': 'अक्टूबर',
    'month.November': 'नवंबर',
    'month.December': 'दिसंबर',
    
    // Chakras
    'chakra.root': 'मूल',
    'chakra.sacral': 'स्वाधिष्ठान',
    'chakra.solarPlexus': 'मणिपुर',
    'chakra.heart': 'अनाहत',
    'chakra.throat': 'विशुद्ध',
    'chakra.thirdEye': 'आज्ञा',
    'chakra.crown': 'सहस्रार',
    'chakra.overallBalance': 'समग्र संतुलन',
    'chakra.balanced': 'संतुलित',
    'chakra.needsFocus': 'मजबूत करने पर ध्यान दें',
    
    // Chart labels
    'chart.lifeTimeline': 'जीवन समय रेखा',
    'chart.chakraRadar': 'चक्र संरेखण रडार',
    'chart.yearlyMomentum': '10 वर्ष गति पूर्वानुमान',
    'chart.monthlyMomentum': '12 महीने ऊर्जा पूर्वानुमान',
    'chart.energy': 'ऊर्जा',
    'chart.opportunities': 'अवसर',
    'chart.challenges': 'चुनौतियां',
    'chart.pause': 'रुकें',
    'chart.build': 'निर्माण',
    'chart.breakthrough': 'सफलता',
    'chart.age': 'उम्र',
    'chart.year': 'वर्ष',
  },
  hinglish: {
    // Common
    'common.downloadPdf': 'PDF Download Karo',
    'common.print': 'Print',
    'common.visual': 'Visual',
    'common.basicReport': 'Basic Report',
    'common.advancedVedicReport': 'Advanced Vedic Report',
    'common.generating': 'Generate ho raha hai...',
    'common.calculating': 'Aapka cosmic blueprint ready ho raha hai...',
    'common.continue': 'Apni Destiny Jano →',
    'common.revealPath': 'Mera Path Dikhao',
    'common.knowCompatibility': 'Compatibility Check Karo',
    'common.getFullReport': 'Full Report Lo (₹499)',
    'common.whatDoesThisMean': 'Iska matlab kya hai?',
    'common.unlocking': 'Aapki report unlock ho rahi hai…',
    'common.verifyingAccess': 'Aapka access verify kiya ja raha hai. Bas kuch seconds.',
    'common.upgradeToast': 'Full report download karne ke liye Premium me upgrade karein!',
    
    // Brand
    'brand.name': 'Ankjyotish',
    'brand.tagline': 'Divine Numerology AI',
    'brand.footer': 'Ankjyotish • Premium Vedic Numerology',
    
    // Home
    'home.title1': 'Ank',
    'home.title2': 'jyotish',
    'home.subtitle': 'Apni destiny ko shape karne wale sacred numbers discover karo. Life purpose, hidden talents, aur cosmic guidance jo aapki birth date aur naam mein likhi hai.',
    'home.premiumNote': '50+ personality combinations ke saath premium numerology readings',
    'home.cta': 'Apni Journey Shuru Karo',
    'home.areasTitle': 'Main Aapko Kin Areas Mein Guide Karta Hoon',
    'home.areasSubtitle': 'Life ke har dimension mein complete insights',
    
    // Tabs
    'tabs.vedic': 'Vedic',
    'tabs.charts': 'Charts',
    'tabs.predictions': 'Predictions',
    'tabs.remedies': 'Remedies',
    'tabs.actionPlan': 'Action Plan',
    
    // Summary Cards
    'summary.mulank': 'Mulank',
    'summary.bhagyank': 'Bhagyank',
    'summary.harmony': 'Harmony',
    'summary.chakraBalance': 'Chakra Balance',
    
    // Vedic Section
    'vedic.mulankTitle': 'Mulank (Birth Number)',
    'vedic.bhagyankTitle': 'Bhagyank (Destiny Number)',
    'vedic.emotionalCore': 'Emotional Core',
    'vedic.naturalBehavior': 'Natural Behavior',
    'vedic.strengths': 'Strengths',
    'vedic.weaknesses': 'Weaknesses',
    'vedic.howCalculated': 'Yeh kaise nikla?',
    'vedic.whyThisDefinesDestiny': 'Yeh number aapki destiny kyun define karta hai?',
    'vedic.dayInLife': 'Mulank ka ek din',
    'vedic.famousPersonalities': 'Is Mulank wale Famous Log',
    'vedic.harmonyMeter': 'Mulank vs Bhagyank Harmony Meter',
    'vedic.lifeDirection': 'Life Direction',
    'vedic.dharmicPath': 'Dharmic Path',
    'vedic.karmicPurpose': 'Karmic Purpose',
    'vedic.spiritualLesson': 'Spiritual Lesson',
    'vedic.formula.mulank': 'Birth Date → Single Digit (Master numbers 11, 22, 33 preserve hote hain)',
    'vedic.formula.bhagyank': 'Full DOB (DD + MM + YYYY) → Single Digit',
    'vedic.yourBirthDate': 'Aapki birth date',
    'vedic.harmonyExcellent': 'Aapka Mulank aur Bhagyank perfect alignment mein hai, ek dusre ki energy support karti hai.',
    'vedic.harmonyGood': 'Aapke numbers achhe se kaam karte hain, optimal flow ke liye thodi adjustments chahiye.',
    'vedic.harmonyModerate': 'Aapke numbers mein thoda tension hai - awareness aur balance practices help karengi.',
    'vedic.harmonyChallenging': 'Aapke numbers dynamic tension create karte hain - proper guidance se growth mein channel ho sakta hai.',
    
    // Predictions
    'predictions.next12Months': 'Next 12 Months ka Breakdown',
    'predictions.next10Years': '10-Year Growth Analysis',
    'predictions.turningPoint': 'Turning Point',
    'predictions.growth': 'Growth',
    'predictions.challenges': 'Challenges',
    'predictions.score': 'Score',
    'predictions.theme': 'Theme',
    'predictions.action': 'Action',
    
    // Remedies
    'remedies.luckyAttributes': 'Lucky Cheezein',
    'remedies.direction': 'Direction (Vastu)',
    'remedies.suggestedColors': 'Aapke Colours',
    'remedies.suggestedStones': 'Aapke Stones',
    'remedies.chakraHealing': 'Chakra Healing',
    'remedies.weakChakra': 'Weak Chakra',
    'remedies.balancingTip': 'Balancing Tip',
    'remedies.personalMantra': 'Aapka Personal Mantra',
    'remedies.grahEnergy': 'Grah (Planetary) Energy',
    'remedies.balancingGuidance': 'Balancing Guidance',
    'remedies.dosAndDonts': 'Kya Karo aur Kya Mat Karo',
    'remedies.dos': 'Karo',
    'remedies.donts': 'Mat Karo',
    'remedies.disclaimer': 'Disclaimer: Yeh suggestions sirf spiritual guidance ke liye hain. Medical advice nahi hai.',
    
    // Action Plan
    'action.manifestationChecklist': 'Manifestation Checklist',
    'action.personalityBlueprint': 'Personality Blueprint',
    'action.coreStrengths': 'Core Strengths',
    'action.growthAreas': 'Growth Areas',
    'action.idealCareerPath': 'Ideal Career Path',
    'action.loveStyle': 'Love Style',
    
    // Closing
    'closing.quote': 'Aapke numbers aapki cosmic fingerprint hain. Inhe embrace karo.',
    'closing.description': 'Yeh advanced report ancient Vedic wisdom ko modern numerology ke saath combine karti hai aapki spiritual aur practical journey guide karne ke liye.',
    'footer.brand': 'Ankjyotish • Premium Vedic Report',
    
    // Form Steps
    'form.step1': 'Personal Info',
    'form.step2': 'Life Context',
    'form.step3': 'Goals & Guidance',
    'form.step4': 'Compatibility',
    'form.next': 'Apni Destiny Jano →',
    'form.prev': 'Previous',
    'form.submit': 'Mera Path Dikhao',
    'form.stepOf': 'Step {current} of {total}',
    'form.complete': '% Complete',
    'form.progressRestored': 'Aapki pichli progress restore ho gayi!',
    'form.saving': 'Save ho raha hai...',
    'form.autoSaved': 'Auto-saved',
    'form.optional': 'optional',
    'form.currentNameHelp': 'Agar birth name jaisa hi hai toh blank chhod dein. Yeh sirf nickname-based reading ke liye hai.',
    'explainer.title': 'Yeh report kya hai?',
    'explainer.body': 'Yeh aapke naam aur date of birth par based personal numerology blueprint hai. Yeh aapki core personality, life direction, strengths aur aane wale themes ko simple language mein dikhati hai. Ise guidance ki tarah lein, prediction ki tarah nahi.',
    
    // Form Labels - Step 1
    'form.fullBirthName': 'Full Birth Name',
    'form.fullBirthNamePlaceholder': 'Apna complete birth name daalein',
    'form.currentName': 'Current Name (Short Name)',
    'form.currentNamePlaceholder': 'Jis naam se jaane jaate ho',
    'form.dateOfBirth': 'Date of Birth (DD/MM/YYYY)',
    'form.dateOfBirthPlaceholder': '15/03/1990',
    'form.gender': 'Gender',
    'form.selectGender': 'Gender select karo',
    'form.male': 'Male',
    'form.female': 'Female',
    'form.other': 'Other',
    'form.preferNotToSay': 'Batana nahi chahte',
    'form.country': 'Country',
    'form.countryPlaceholder': 'Aapka country',
    'form.city': 'City',
    'form.cityPlaceholder': 'Aapka city',
    'form.email': 'Email (PDF ke liye)',
    'form.emailPlaceholder': 'your@email.com',
    'form.whatsapp': 'WhatsApp Number (Optional)',
    'form.whatsappPlaceholder': 'Aapka WhatsApp number',
    
    // Form Labels - Step 2
    'form.step2Intro': 'Yeh details aapki reading ko personalize karne mein help karenge (optional)',
    'form.relationshipStatus': 'Relationship Status',
    'form.selectStatus': 'Status select karo',
    'form.single': 'Single',
    'form.married': 'Married',
    'form.complicated': "It's Complicated",
    'form.profession': 'Profession / Business / Student',
    'form.professionPlaceholder': 'Aap kya karte ho?',
    'form.lifeFocusTitle': 'Primary Life Focus',
    'form.lifeFocusSubtitle': 'Abhi sabse zyada kya matter karta hai? Main in areas mein guide karunga.',
    'form.careerSuccess': 'Career & Success',
    'form.loveRelationships': 'Love & Relationships',
    'form.moneyAbundance': 'Money & Abundance',
    'form.healthWellbeing': 'Health & Wellbeing',
    'form.personalGrowth': 'Personal Growth',
    
    // Form Labels - Step 3
    'form.step3Title': 'Batao aap kya guidance dhundh rahe ho',
    'form.step3Subtitle': '(optional but powerful)',
    'form.biggestChallenge': 'Abhi Sabse Badi Challenge',
    'form.biggestChallengePlaceholder': 'Aapki sabse badi problem ya obstacle kya hai?',
    'form.mainGoal': 'Agle 1 Saal ka Main Goal',
    'form.mainGoalPlaceholder': 'Aap kya achieve ya manifest karna chahte ho?',
    'form.fearOrStuck': 'Kisi Cheez Se Darr Ya Stuck Feel',
    'form.fearOrStuckPlaceholder': 'Emotionally kahan blocked feel karte ho?',
    'form.confusedBetween': 'Kis cheez ke beech confused ho?',
    'form.confusedBetweenPlaceholder': 'Job vs Business, Stay vs Leave, Love vs Self-Healing?',
    'form.destinyCallingYou': 'Destiny tumhe kahan bula rahi hai?',
    'form.destinyCallingYouPlaceholder': 'Career, travel, healing, life restart, money, etc.',
    'form.repeatingPattern': 'Life mein kaunsa pattern repeat hota rehta hai?',
    'form.repeatingPatternPlaceholder': 'Heartbreak, money issues, trust, family pressure?',
    'form.miracleWish': 'Agar ek miracle ho sakta, toh woh kya hota?',
    'form.miracleWishPlaceholder': 'Dil se likho...',
    'form.trustQuote': 'Is process par trust karne ke liye shukriya. Main clarity, respect, aur emotional accuracy ke saath guide karunga.',
    
    // Form Labels - Step 4
    'form.includeCompatibility': 'Compatibility Analysis Include Karo',
    'form.compatibilitySubtitle': 'Partner ya business partner ki details add karo',
    'form.romanticPartner': 'Romantic Partner',
    'form.partnerName': "Partner ka Naam",
    'form.partnerNamePlaceholder': "Partner ka full naam",
    'form.partnerDob': "Partner ki DOB (DD/MM/YYYY)",
    'form.businessPartner': 'Business Partner',
    'form.businessPartnerName': "Business Partner ka Naam",
    'form.businessPartnerNamePlaceholder': "Business partner ka full naam",
    'form.businessPartnerDob': "Business Partner ki DOB",
    
    // Validation Messages
    'validation.enterBirthName': 'Please apna full birth name daalo',
    'validation.nameTooShort': 'Naam kam se kam 2 letters ka hona chahiye',
    'validation.nameTooLong': 'Naam 100 letters se kam hona chahiye',
    'validation.enterCurrentName': 'Please apna current name daalo',
    'validation.enterValidDob': 'Please date DD/MM/YYYY format mein daalo',
    'validation.dobInvalid': 'Yeh date valid nahi hai',
    'validation.dobFuture': 'Birth date future mein nahi ho sakti',
    'validation.dobTooOld': 'Please realistic birth date daalo',
    'validation.enterValidEmail': 'Please valid email address daalo',
    'validation.selectGender': 'Please gender select karo',
    'validation.invalidWhatsapp': 'Valid phone number daalo (7–15 digits)',
    'validation.partnerNameRequired': 'Partner ka naam zaroori hai',
    'validation.partnerDobRequired': 'Partner ki birth date zaroori hai',
    'validation.fixErrorsAbove': 'Please upar highlighted errors theek karo',
    
    // Micro-win Messages
    'form.microWin2': '✨ Great start! Ab apne life ke baare mein batao',
    'form.microWin3': '🎯 Excellent! Aapke goals mujhe better guide karne mein help karenge',
    'form.microWin4': '💫 Almost done! Compatibility check karna hai?',
    
    // Months
    'month.January': 'January',
    'month.February': 'February',
    'month.March': 'March',
    'month.April': 'April',
    'month.May': 'May',
    'month.June': 'June',
    'month.July': 'July',
    'month.August': 'August',
    'month.September': 'September',
    'month.October': 'October',
    'month.November': 'November',
    'month.December': 'December',
    
    // Chakras
    'chakra.root': 'Root',
    'chakra.sacral': 'Sacral',
    'chakra.solarPlexus': 'Solar Plexus',
    'chakra.heart': 'Heart',
    'chakra.throat': 'Throat',
    'chakra.thirdEye': 'Third Eye',
    'chakra.crown': 'Crown',
    'chakra.overallBalance': 'Overall Balance',
    'chakra.balanced': 'Balanced hai',
    'chakra.needsFocus': 'Isko strengthen karo',
    
    // Chart labels
    'chart.lifeTimeline': 'Life Timeline Phases',
    'chart.chakraRadar': 'Chakra Alignment Radar',
    'chart.yearlyMomentum': '10-Year Momentum Forecast',
    'chart.monthlyMomentum': '12-Month Energy Forecast',
    'chart.energy': 'Energy',
    'chart.opportunities': 'Opportunities',
    'chart.challenges': 'Challenges',
    'chart.pause': 'Pause',
    'chart.build': 'Build',
    'chart.breakthrough': 'Breakthrough',
    'chart.age': 'Age',
    'chart.year': 'Year',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Track missing keys once per session to avoid log spam
const __missingKeys = new Set<string>();

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const stored = (localStorage.getItem('preferredLanguage') || localStorage.getItem('lang')) as Language;
    if (stored === 'en' || stored === 'hi' || stored === 'hinglish') return stored;
    return 'en';
  });

  // Sync <html lang> attribute for browser auto-translate + a11y
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlLang = language === 'en' ? 'en' : 'hi';
      document.documentElement.setAttribute('lang', htmlLang);
      document.documentElement.setAttribute('data-app-lang', language);
    }
    if (import.meta.env.DEV) {
      console.info('[i18n] active language:', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferredLanguage', lang);
      localStorage.setItem('lang', lang);
    } catch (err) {
      console.warn('[i18n] failed to persist language', err);
    }
    if (import.meta.env.DEV) {
      console.info('[i18n] language changed →', lang);
    }
  };

  const t = (key: string): string => {
    const value = translations[language]?.[key] ?? translations['en'][key];
    if (value === undefined) {
      if (import.meta.env.DEV && !__missingKeys.has(key)) {
        __missingKeys.add(key);
        console.warn('[i18n] missing translation key:', key);
      }
      return key;
    }
    return value;
  };

  const getText = (trilingual: { en: string; hi: string; hinglish?: string } | string): string => {
    if (typeof trilingual === 'string') return trilingual;
    if (language === 'hinglish') {
      return trilingual.hinglish || trilingual.en;
    }
    return trilingual[language] || trilingual.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
