import jsPDF from 'jspdf';
import { UserFormData } from '@/types/formTypes';
import { NumerologyProfile, numberMeanings, calculateLifePath, calculateCompatibility } from './numerology';

// Personalized affirmations mapped by Life Path number
const personalizedAffirmations: Record<number, string[]> = {
  1: [
    "I am a natural leader, carving my own path with confidence and courage.",
    "I embrace new beginnings and walk fearlessly towards my goals.",
    "My independence is my power, and I trust my unique vision.",
    "I inspire others through my actions and lead by example.",
    "I have the strength and determination to turn my ideas into reality."
  ],
  2: [
    "I bring peace, harmony, and cooperative balance to all my relationships.",
    "I trust my intuition and allow it to guide my path.",
    "I am a compassionate listener and a pillar of support for others.",
    "I embrace partnerships and welcome collaboration with open arms.",
    "My gentle strength is a powerful force for healing and unity."
  ],
  3: [
    "I express my creativity and joy freely and share it with the world.",
    "My words are positive, uplifting, and inspire those around me.",
    "I welcome humor, lightheartedness, and artistic flow into my life.",
    "I communicate my truth with confidence and absolute clarity.",
    "My imagination has no limits, and I manifest through self-expression."
  ],
  4: [
    "I build stable, solid, and long-lasting foundations in my life.",
    "My discipline, order, and determination lead me to success.",
    "I am reliable, focused, and work patiently towards my dreams.",
    "I create systems that bring order, stability, and peace of mind.",
    "I am grounded, practical, and highly capable of executing any task."
  ],
  5: [
    "I embrace change, positive freedom, and constant growth.",
    "I am highly adaptable, versatile, and welcome exciting new experiences.",
    "I learn valuable lessons from every adventure life offers me.",
    "I release fear and step confidently into the unknown.",
    "My life is an exciting journey filled with freedom and expansion."
  ],
  6: [
    "I nurture my loved ones and create a beautiful, harmonious home.",
    "I balance my responsibilities with self-care and deep self-love.",
    "My heart is my compass, and I act with unconditional love and empathy.",
    "I bring healing, comfort, and peaceful resolutions to conflicts.",
    "I am worthy of receiving the same care and love that I give to others."
  ],
  7: [
    "I trust my inner wisdom and connect deeply with the mysteries of life.",
    "Solitude brings me clarity, strength, and spiritual alignment.",
    "I seek truth with an open mind and trust my deep analytical insights.",
    "My mind is peaceful, quiet, and receptive to cosmic guidance.",
    "I am guided by divine intelligence in every step of my journey."
  ],
  8: [
    "I manifest material and spiritual abundance with wisdom and ethics.",
    "My personal power is a force for good, and I lead with integrity.",
    "I attract success and wealth by aligning my actions with high purpose.",
    "I am financially secure, strong, and highly capable of handling success.",
    "I balance ambition with gratitude and share my blessings generously."
  ],
  9: [
    "I embody universal love and complete life chapters with grace.",
    "My life is dedicated to compassion, kindness, and helping humanity.",
    "I easily release the past and welcome the growth of the present.",
    "I am a source of light, wisdom, and inspiration for others.",
    "I trust that the universe always supports my higher path of service."
  ]
};

const pdfTranslations = {
  en: {
    personalNumerology: 'PERSONAL NUMEROLOGY',
    blueprint: 'BLUEPRINT',
    born: 'Born',
    lifePathNum: 'LIFE PATH NUMBER',
    toc: 'TABLE OF CONTENTS',
    tocDesc: [
      'Core Numbers Summary',
      'Life Purpose & Path',
      'Destiny & Talents',
      'Soul Urge & Emotions',
      'Outer Personality',
      'Life Cycles',
      'Lucky Attributes',
      'Compatibility (if applicable)',
      '30 Day Action Plan',
      'Daily Affirmations',
    ],
    coreNumbers: 'CORE NUMBERS SUMMARY',
    coreLabels: {
      lifePath: 'Life Path',
      destiny: 'Destiny',
      soulUrge: 'Soul Urge',
      personality: 'Personality',
      birthday: 'Birthday',
      maturity: 'Maturity',
      attitude: 'Attitude',
      personalYear: 'Personal Year',
    },
    lifePurpose: 'YOUR LIFE PURPOSE',
    strengths: 'Your Strengths:',
    growthAreas: 'Growth Areas / Challenges:',
    destinyTitle: 'YOUR TALENTS & DESTINY',
    careerPaths: 'Aligned Career Paths:',
    lifeCycles: 'MAJOR LIFE CYCLES',
    cycleLabels: ['First Cycle', 'Second Cycle', 'Third Cycle'],
    luckyAttrs: 'LUCKY ATTRIBUTES',
    luckyNumbers: 'Lucky Numbers',
    luckyDays: 'Lucky Days',
    luckyColors: 'Lucky Colors',
    luckyDirections: 'Lucky Directions',
    compatibility: 'COMPATIBILITY REPORT',
    romanticCompat: 'Romantic Compatibility with',
    businessCompat: 'Business Compatibility with',
    dailyAffirmations: 'DAILY AFFIRMATIONS',
    actionPlan: '30 DAY ACTION PLAN',
    finalNote: "You are evolving. Life isn't punishing you; it is shaping you. Your numbers show you are entering a rising chapter. Trust the process. The universe has written your story with love — and the best chapters are still ahead.",
    footer: 'Generated by AnkJyotish • ankjyotishai.com'
  },
  hi: {
    personalNumerology: 'व्यक्तिगत अंकशास्त्र',
    blueprint: 'ब्लूप्रिंट',
    born: 'जन्म तिथि',
    lifePathNum: 'मूलांक (लाइफ पाथ)',
    toc: 'विषय सूची',
    tocDesc: [
      'मुख्य अंक सारांश',
      'जीवन का उद्देश्य और पथ',
      'नियति और प्रतिभाएं',
      'आंतरिक इच्छा और भावनाएं',
      'बाहरी व्यक्तित्व',
      'मुख्य जीवन चक्र',
      'शुभ गुण और विशेषताएं',
      'अनुकूलता (यदि लागू हो)',
      '30 दिनों की कार्य योजना',
      'दैनिक प्रतिज्ञान (Affirmations)',
    ],
    coreNumbers: 'मुख्य अंकों का सारांश',
    coreLabels: {
      lifePath: 'मूलांक (Life Path)',
      destiny: 'भाग्यांक (Destiny)',
      soulUrge: 'आंतरिक इच्छा (Soul Urge)',
      personality: 'व्यक्तित्व (Personality)',
      birthday: 'जन्म अंक (Birthday)',
      maturity: 'परिपक्वता (Maturity)',
      attitude: 'दृष्टिकोण (Attitude)',
      personalYear: 'व्यक्तिगत वर्ष',
    },
    lifePurpose: 'आपके जीवन का उद्देश्य',
    strengths: 'आपकी ताकत:',
    growthAreas: 'सुधार के क्षेत्र / चुनौतियाँ:',
    destinyTitle: 'आपकी प्रतिभा और नियति',
    careerPaths: 'उपयुक्त करियर विकल्प:',
    lifeCycles: 'मुख्य जीवन चक्र',
    cycleLabels: ['प्रथम चक्र', 'द्वितीय चक्र', 'तृतीय चक्र'],
    luckyAttrs: 'शुभ गुण और विशेषताएं',
    luckyNumbers: 'भाग्यशाली अंक',
    luckyDays: 'भाग्यशाली दिन',
    luckyColors: 'भाग्यशाली रंग',
    luckyDirections: 'भाग्यशाली दिशाएं',
    compatibility: 'अनुकूलता रिपोर्ट',
    romanticCompat: 'रोमांटिक अनुकूलता:',
    businessCompat: 'व्यावसायिक अनुकूलता:',
    dailyAffirmations: 'दैनिक प्रतिज्ञान (Affirmations)',
    actionPlan: '30 दिनों की कार्य योजना',
    finalNote: "आप विकसित हो रहे हैं। जीवन आपको दंडित नहीं कर रहा है; यह आपको आकार दे रहा है। आपकी संख्याएं बताती हैं कि आप एक उभरते हुए अध्याय में प्रवेश कर रहे हैं। प्रक्रिया पर विश्वास रखें। ब्रह्मांड ने आपकी कहानी प्यार से लिखी है — और सबसे अच्छे अध्याय अभी आगे हैं।",
    footer: 'अंकज्योतिष द्वारा जनरेटेड • ankjyotishai.com'
  },
  hinglish: {
    personalNumerology: 'PERSONAL NUMEROLOGY',
    blueprint: 'BLUEPRINT',
    born: 'Born',
    lifePathNum: 'LIFE PATH NUMBER',
    toc: 'TABLE OF CONTENTS (Vishey Suchi)',
    tocDesc: [
      'Core Numbers Summary',
      'Life Purpose & Path',
      'Destiny & Talents',
      'Soul Urge & Emotions',
      'Outer Personality',
      'Life Cycles',
      'Lucky Attributes',
      'Compatibility (if applicable)',
      '30 Day Action Plan',
      'Daily Affirmations',
    ],
    coreNumbers: 'CORE NUMBERS SUMMARY',
    coreLabels: {
      lifePath: 'Life Path',
      destiny: 'Destiny',
      soulUrge: 'Soul Urge',
      personality: 'Personality',
      birthday: 'Birthday',
      maturity: 'Maturity',
      attitude: 'Attitude',
      personalYear: 'Personal Year',
    },
    lifePurpose: 'YOUR LIFE PURPOSE',
    strengths: 'Your Strengths (Aapki Takat):',
    growthAreas: 'Growth Areas (Sudhar ke Kshetra):',
    destinyTitle: 'YOUR TALENTS & DESTINY',
    careerPaths: 'Aligned Career Paths:',
    lifeCycles: 'MAJOR LIFE CYCLES',
    cycleLabels: ['First Cycle', 'Second Cycle', 'Third Cycle'],
    luckyAttrs: 'LUCKY ATTRIBUTES (Shubh Attributes)',
    luckyNumbers: 'Lucky Numbers',
    luckyDays: 'Lucky Days',
    luckyColors: 'Lucky Colors',
    luckyDirections: 'Lucky Directions',
    compatibility: 'COMPATIBILITY REPORT',
    romanticCompat: 'Romantic Compatibility with',
    businessCompat: 'Business Compatibility with',
    dailyAffirmations: 'DAILY AFFIRMATIONS',
    actionPlan: '30 DAY ACTION PLAN',
    finalNote: "Aap evolve ho rahe hain. Life aapko punish nahi kar rahi; ye aapko shape kar rahi hai. Aapke numbers dikhate hain ki aap ek rising chapter me enter kar rahe hain. Process par trust rakhein. Universe ne aapki story ko bahut pyaar se likha hai — aur sabse acche chapters aage aane baaki hain.",
    footer: 'Generated by AnkJyotish • ankjyotishai.com'
  }
};

const drawCelestialMandala = (doc: jsPDF, x: number, y: number, radius: number) => {
  doc.setDrawColor(212, 175, 55); // gold
  doc.setLineWidth(0.25);

  // Concentric circles
  for (let r = 5; r <= radius; r += 5) {
    if (r % 10 === 0) {
      doc.setLineDashPattern([1.5, 1.5], 0);
    } else {
      doc.setLineDashPattern([], 0);
    }
    doc.circle(x, y, r, 'S');
  }
  doc.setLineDashPattern([], 0);

  // Star points / radiating rays
  const points = 16;
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const xOuter = x + Math.cos(angle) * radius;
    const yOuter = y + Math.sin(angle) * radius;
    const xInner = x + Math.cos(angle) * (radius - 12);
    const yInner = y + Math.sin(angle) * (radius - 12);
    doc.setLineWidth(i % 2 === 0 ? 0.35 : 0.2);
    doc.line(xInner, yInner, xOuter, yOuter);
  }

  // Intersecting squares to make a star polygram
  doc.setLineWidth(0.15);
  const angles = [0, Math.PI / 4, Math.PI / 8, (3 * Math.PI) / 8];
  angles.forEach((offsetAngle) => {
    const sqPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = offsetAngle + (i * Math.PI) / 2;
      sqPoints.push({
        x: x + Math.cos(angle) * (radius - 4),
        y: y + Math.sin(angle) * (radius - 4)
      });
    }
    doc.line(sqPoints[0].x, sqPoints[0].y, sqPoints[1].x, sqPoints[1].y);
    doc.line(sqPoints[1].x, sqPoints[1].y, sqPoints[2].x, sqPoints[2].y);
    doc.line(sqPoints[2].x, sqPoints[2].y, sqPoints[3].x, sqPoints[3].y);
    doc.line(sqPoints[3].x, sqPoints[3].y, sqPoints[0].x, sqPoints[0].y);
  });
};

export const generatePDF = async (
  formData: UserFormData,
  profile: NumerologyProfile,
  lang: 'en' | 'hi' | 'hinglish' = 'en'
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  let pageCount = 1;

  const selectedLang = lang === 'hi' ? 'hi' : lang === 'hinglish' ? 'hinglish' : 'en';
  const t = pdfTranslations[selectedLang];

  const initPage = (titleText?: string) => {
    // Fill background: Deep Cosmic Purple
    doc.setFillColor(20, 14, 38);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Draw Gold double border lines
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setLineWidth(0.15);
    doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

    // Corner Ornaments
    const cornerLength = 4;
    const corners = [
      { x: 9.5, y: 9.5 },
      { x: pageWidth - 9.5, y: 9.5 },
      { x: 9.5, y: pageHeight - 9.5 },
      { x: pageWidth - 9.5, y: pageHeight - 9.5 }
    ];
    doc.setLineWidth(0.3);
    corners.forEach((c) => {
      doc.line(c.x - cornerLength, c.y, c.x + cornerLength, c.y);
      doc.line(c.x, c.y - cornerLength, c.x, c.y + cornerLength);
    });

    // Page Header (if past cover page)
    if (pageCount > 1) {
      doc.setFontSize(8);
      doc.setTextColor(199, 184, 230);
      doc.setFont('helvetica', 'normal');
      doc.text('ANKJYOTISH • PERSONAL BLUEPRINT', margin, 15);
      if (titleText) {
        doc.text(titleText.toUpperCase(), pageWidth - margin, 15, { align: 'right' });
      }
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.2);
      doc.line(margin, 17, pageWidth - margin, 17);
    }

    // Page Footer
    doc.setFontSize(8);
    doc.setTextColor(199, 184, 230);
    doc.setFont('helvetica', 'normal');
    doc.text('ankjyotishai.com', margin, pageHeight - 14);
    doc.text(`Page ${pageCount}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
  };

  const addPage = (titleText?: string) => {
    doc.addPage();
    pageCount++;
    initPage(titleText);
    y = margin + 5;
  };

  const addNewPageIfNeeded = (requiredSpace: number, pageTitle?: string) => {
    if (y + requiredSpace > pageHeight - margin - 15) {
      addPage(pageTitle);
      return true;
    }
    return false;
  };

  const drawDivider = () => {
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.35);
    const centerX = pageWidth / 2;
    doc.line(margin, y, centerX - 10, y);
    doc.line(centerX + 10, y, pageWidth - margin, y);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.text('✦', centerX, y + 2, { align: 'center' });
    y += 12;
  };

  const addParagraph = (text: string, indent = 0) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(243, 231, 255);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      addNewPageIfNeeded(6);
      doc.text(line, margin + indent, y);
      y += 6.5;
    });
    y += 3;
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  initPage();

  // Premium Logo / Icon Element
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55);
  doc.text('✦  A N K J Y O T I S H  ✦', pageWidth / 2, 45, { align: 'center' });

  // Title
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(t.personalNumerology, pageWidth / 2, 65, { align: 'center' });
  doc.setFontSize(22);
  doc.text(t.blueprint, pageWidth / 2, 78, { align: 'center' });

  // Decorative Line
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.line(75, 87, pageWidth - 75, 87);

  // User Name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(formData.fullBirthName.toUpperCase(), pageWidth / 2, 110, { align: 'center' });

  // Date of Birth
  doc.setFontSize(11);
  doc.setTextColor(199, 184, 230);
  doc.text(`${t.born}: ${formData.dateOfBirth}`, pageWidth / 2, 122, { align: 'center' });

  // Celestial Mandala Vector in Center
  drawCelestialMandala(doc, pageWidth / 2, 175, 30);

  // Life Path Circle in center of Mandala
  doc.setFillColor(212, 175, 55);
  doc.circle(pageWidth / 2, 175, 9, 'F');
  
  // Life Path Number text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 14, 38);
  doc.text(String(profile.lifePath), pageWidth / 2, 180.5, { align: 'center' });

  // Label below mandala
  doc.setFontSize(12);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(t.lifePathNum, pageWidth / 2, 222, { align: 'center' });

  const lifePathMeaning = numberMeanings[profile.lifePath] || numberMeanings[9];
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(243, 231, 255);
  doc.text(`"${lifePathMeaning.title}"`, pageWidth / 2, 236, { align: 'center' });

  // Cover Footer
  doc.setFontSize(9);
  doc.setTextColor(199, 184, 230);
  doc.setFont('helvetica', 'normal');
  doc.text(t.footer, pageWidth / 2, pageHeight - 25, { align: 'center' });

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS
  // ==========================================
  addPage(t.toc);
  
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(t.toc, pageWidth / 2, y + 15, { align: 'center' });
  y += 35;
  drawDivider();

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  t.tocDesc.forEach((item, i) => {
    // Row Card Background
    doc.setFillColor(32, 22, 54);
    doc.roundedRect(margin, y - 4, contentWidth, 11, 1.5, 1.5, 'F');

    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}.`, margin + 6, y + 3);
    
    doc.setTextColor(243, 231, 255);
    doc.setFont('helvetica', 'normal');
    doc.text(item, margin + 15, y + 3);
    y += 15;
  });

  // ==========================================
  // PAGE 3: CORE NUMBERS SUMMARY
  // ==========================================
  addPage(t.coreNumbers);

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.coreNumbers, pageWidth / 2, y + 10, { align: 'center' });
  y += 25;
  drawDivider();

  const coreNumbers = [
    { label: t.coreLabels.lifePath, value: profile.lifePath, desc: selectedLang === 'hi' ? 'आपकी आत्मा की यात्रा और जीवन का प्राथमिक उद्देश्य।' : 'Your soul\'s primary journey and life purpose.' },
    { label: t.coreLabels.destiny, value: profile.destiny, desc: selectedLang === 'hi' ? 'आपकी प्राकृतिक प्रतिभाएं और आप जीवन में क्या हासिल करेंगे।' : 'Your natural talents and what you are meant to achieve.' },
    { label: t.coreLabels.soulUrge, value: profile.soulUrge, desc: selectedLang === 'hi' ? 'आपके दिल की गहरी इच्छाएं और प्रेरणा का मुख्य स्रोत।' : 'Your heart\'s deepest desires and core motivations.' },
    { label: t.coreLabels.personality, value: profile.personality, desc: selectedLang === 'hi' ? 'दुनिया आपको कैसे देखती है — आपका बाहरी मुखौटा।' : 'How others perceive you — your outer mask or persona.' },
    { label: t.coreLabels.birthday, value: profile.birthday, desc: selectedLang === 'hi' ? 'आपके जन्म अंक से जुड़ा एक विशेष उपहार या हुनर।' : 'A special talent or gift from your birth date.' },
    { label: t.coreLabels.maturity, value: profile.maturity, desc: selectedLang === 'hi' ? 'उम्र के साथ आपका असली स्वरूप — 35 की उम्र के बाद प्रबल।' : 'Your true self emerging over time, active after age 35.' },
    { label: t.coreLabels.attitude, value: profile.attitude, desc: selectedLang === 'hi' ? 'किसी नई परिस्थिति पर आपकी त्वरित प्रतिक्रिया और स्वभाव।' : 'Your initial approach and reaction to new situations.' },
    { label: t.coreLabels.personalYear, value: profile.personalYear, desc: selectedLang === 'hi' ? 'इस वर्ष की ब्रह्मांडीय थीम और आपके लिए मुख्य ऊर्जा।' : 'The cosmic theme of your current year.' },
  ];

  coreNumbers.forEach((num) => {
    // Elegant Card Layout
    doc.setFillColor(32, 22, 54);
    doc.roundedRect(margin, y - 5, contentWidth, 20, 2.5, 2.5, 'F');
    
    // Left border accent
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, y - 5, 2, 20, 'F');
    
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${num.label}:`, margin + 6, y + 7);
    
    doc.setFontSize(14);
    doc.text(String(num.value), margin + 50, y + 7);
    
    doc.setTextColor(199, 184, 230);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(num.desc, contentWidth - 72);
    doc.text(descLines, margin + 66, y + 6);
    
    y += 24;
  });

  // ==========================================
  // PAGE 4: LIFE PURPOSE
  // ==========================================
  addPage(t.lifePurpose);

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.lifePurpose, pageWidth / 2, y + 10, { align: 'center' });
  y += 20;

  doc.setFontSize(14);
  doc.text(`${t.coreLabels.lifePath} ${profile.lifePath}: ${lifePathMeaning.title}`, pageWidth / 2, y, { align: 'center' });
  y += 15;
  drawDivider();

  // Life purpose description
  addParagraph(lifePathMeaning.purpose);
  y += 5;

  // Strengths
  addNewPageIfNeeded(40, t.lifePurpose);
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t.strengths, margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(243, 231, 255);
  doc.setFont('helvetica', 'normal');
  lifePathMeaning.strengths.forEach((strength) => {
    addNewPageIfNeeded(8, t.lifePurpose);
    doc.text(`• ${strength}`, margin + 5, y);
    y += 7;
  });
  y += 5;

  // Challenges
  addNewPageIfNeeded(40, t.lifePurpose);
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t.growthAreas, margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(243, 231, 255);
  doc.setFont('helvetica', 'normal');
  lifePathMeaning.challenges.forEach((challenge) => {
    addNewPageIfNeeded(8, t.lifePurpose);
    doc.text(`• ${challenge}`, margin + 5, y);
    y += 7;
  });

  // ==========================================
  // PAGE 5: DESTINY & TALENTS
  // ==========================================
  addPage(t.destinyTitle);

  const destinyMeaning = numberMeanings[profile.destiny] || numberMeanings[9];

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.destinyTitle, pageWidth / 2, y + 10, { align: 'center' });
  y += 20;

  doc.setFontSize(14);
  doc.text(`${t.coreLabels.destiny} ${profile.destiny}: ${destinyMeaning.title}`, pageWidth / 2, y, { align: 'center' });
  y += 15;
  drawDivider();

  addParagraph(destinyMeaning.purpose);
  y += 8;

  // Career Paths
  addNewPageIfNeeded(40, t.destinyTitle);
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t.careerPaths, margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(243, 231, 255);
  doc.setFont('helvetica', 'normal');
  destinyMeaning.careers.forEach((career) => {
    addNewPageIfNeeded(8, t.destinyTitle);
    doc.text(`• ${career}`, margin + 5, y);
    y += 7.5;
  });

  // ==========================================
  // PAGE 6: LIFE CYCLES & LUCKY ATTRIBUTES
  // ==========================================
  addPage(t.lifeCycles);

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.lifeCycles, pageWidth / 2, y + 10, { align: 'center' });
  y += 20;
  drawDivider();

  const cycles = [
    { ...profile.lifeCycles.first, label: t.cycleLabels[0] },
    { ...profile.lifeCycles.second, label: t.cycleLabels[1] },
    { ...profile.lifeCycles.third, label: t.cycleLabels[2] },
  ];

  cycles.forEach((cycle) => {
    doc.setFillColor(32, 22, 54);
    doc.roundedRect(margin, y - 5, contentWidth, 24, 2.5, 2.5, 'F');
    
    // Left border accent
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, y - 5, 2, 24, 'F');

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(cycle.label, margin + 6, y + 6);
    
    doc.setFontSize(10);
    doc.text(`Ages: ${cycle.ages}`, margin + 6, y + 14);
    
    doc.setTextColor(243, 231, 255);
    doc.setFont('helvetica', 'normal');
    const themeLines = doc.splitTextToSize(cycle.theme, contentWidth - 55);
    doc.text(themeLines, margin + 45, y + 6);
    
    y += 30;
  });

  y += 5;
  addNewPageIfNeeded(60, t.luckyAttrs);

  // Lucky Attributes
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(t.luckyAttrs, margin, y);
  y += 12;

  const luckyItems = [
    { label: t.luckyNumbers, val: profile.luckyAttributes.numbers.join(', ') },
    { label: t.luckyDays, val: profile.luckyAttributes.days.join(', ') },
    { label: t.luckyColors, val: profile.luckyAttributes.colors.join(', ') },
    { label: t.luckyDirections, val: profile.luckyAttributes.directions.join(', ') },
  ];

  doc.setFontSize(10);
  luckyItems.forEach((item) => {
    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}: `, margin, y);
    
    doc.setTextColor(243, 231, 255);
    doc.setFont('helvetica', 'normal');
    doc.text(item.val, margin + 42, y);
    y += 8;
  });

  // ==========================================
  // PAGE 7: COMPATIBILITY (if applicable)
  // ==========================================
  if (formData.includeCompatibility && (formData.partnerDob || formData.businessPartnerDob)) {
    addPage(t.compatibility);

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(t.compatibility, pageWidth / 2, y + 10, { align: 'center' });
    y += 25;
    drawDivider();

    if (formData.partnerDob && formData.partnerName) {
      const partnerCompatibility = calculateCompatibility(profile.lifePath, calculateLifePath(formData.partnerDob));
      
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.romanticCompat} ${formData.partnerName}`, margin, y);
      y += 12;

      // Compatibility Score Card Layout with Dynamic heights to prevent text overlaps
      const romanStrengthLines = doc.splitTextToSize(`Strengths: ${partnerCompatibility.strength}`, contentWidth - 60);
      const romanChallLines = doc.splitTextToSize(`Growth Areas: ${partnerCompatibility.challenges}`, contentWidth - 60);

      const sHeight = romanStrengthLines.length * 4.5;
      const cHeight = romanChallLines.length * 4.5;
      const cardHeight = Math.max(38, 14 + sHeight + cHeight);

      doc.setFillColor(32, 22, 54);
      doc.roundedRect(margin, y - 5, contentWidth, cardHeight, 3, 3, 'F');
      
      doc.setFontSize(26);
      doc.setTextColor(212, 175, 55);
      doc.text(`${partnerCompatibility.score}%`, margin + 10, y + 16);
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(partnerCompatibility.compatibility, margin + 45, y + 10);

      doc.setFontSize(9.5);
      doc.setTextColor(199, 184, 230);
      doc.setFont('helvetica', 'normal');
      doc.text(romanStrengthLines, margin + 45, y + 17);
      doc.text(romanChallLines, margin + 45, y + 17 + sHeight + 2);
      
      y += cardHeight + 10;
    }

    if (formData.businessPartnerDob && formData.businessPartnerName) {
      addNewPageIfNeeded(70, t.compatibility);
      const businessCompatibility = calculateCompatibility(profile.lifePath, calculateLifePath(formData.businessPartnerDob));
      
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.businessCompat} ${formData.businessPartnerName}`, margin, y);
      y += 12;

      // Score Panel with Dynamic heights to prevent text overlaps
      const bizStrengthLines = doc.splitTextToSize(`Strengths: ${businessCompatibility.strength}`, contentWidth - 60);
      const bizChallLines = doc.splitTextToSize(`Growth Areas: ${businessCompatibility.challenges}`, contentWidth - 60);

      const sHeight = bizStrengthLines.length * 4.5;
      const cHeight = bizChallLines.length * 4.5;
      const cardHeight = Math.max(38, 14 + sHeight + cHeight);

      doc.setFillColor(32, 22, 54);
      doc.roundedRect(margin, y - 5, contentWidth, cardHeight, 3, 3, 'F');
      
      doc.setFontSize(26);
      doc.setTextColor(212, 175, 55);
      doc.text(`${businessCompatibility.score}%`, margin + 10, y + 16);
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(businessCompatibility.compatibility, margin + 45, y + 10);

      doc.setFontSize(9.5);
      doc.setTextColor(199, 184, 230);
      doc.setFont('helvetica', 'normal');
      doc.text(bizStrengthLines, margin + 45, y + 17);
      doc.text(bizChallLines, margin + 45, y + 17 + sHeight + 2);
      
      y += cardHeight + 10;
    }
  }

  // ==========================================
  // PAGE 8: DAILY AFFIRMATIONS & ACTION PLAN
  // ==========================================
  addPage(t.dailyAffirmations);

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.dailyAffirmations, pageWidth / 2, y + 10, { align: 'center' });
  y += 20;
  drawDivider();

  // Get personalized affirmations based on Life Path Number
  const lpSingle = profile.lifePath > 9 ? (profile.lifePath === 11 ? 2 : profile.lifePath === 22 ? 4 : 6) : profile.lifePath;
  const affirmations = personalizedAffirmations[lpSingle] || personalizedAffirmations[1];

  doc.setTextColor(243, 231, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');

  affirmations.forEach((aff, i) => {
    // Beautiful block for each affirmation
    doc.setFillColor(32, 22, 54);
    const affLines = doc.splitTextToSize(`"${aff}"`, contentWidth - 20);
    const boxHeight = affLines.length * 6 + 10;
    
    addNewPageIfNeeded(boxHeight + 5, t.dailyAffirmations);
    doc.roundedRect(margin, y - 4, contentWidth, boxHeight, 2, 2, 'F');
    doc.text(affLines, pageWidth / 2, y + 3, { align: 'center' });
    y += boxHeight + 4;
  });

  y += 5;
  addNewPageIfNeeded(60, t.actionPlan);

  // 30 Day Action Plan Preview
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.actionPlan, margin, y);
  y += 10;

  const actions = [
    { week: 'Week 1', action: `Embrace your ${lifePathMeaning.strengths[0]} nature. Begin daily alignment.` },
    { week: 'Week 2', action: `Address current growth challenges. Exercise positive intention.` }
  ];

  doc.setFontSize(10);
  actions.forEach((act) => {
    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(`${act.week}: `, margin, y);
    
    doc.setTextColor(243, 231, 255);
    doc.setFont('helvetica', 'normal');
    doc.text(act.action, margin + 20, y);
    y += 8;
  });

  // Final Quote / Blessing
  y += 10;
  addNewPageIfNeeded(40, 'Cosmic Closing');
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(40, y, pageWidth - 40, y);
  y += 10;

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('✦  R E M E M B E R  ✦', pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setTextColor(243, 231, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'italic');
  const quoteLines = doc.splitTextToSize(t.finalNote, contentWidth - 20);
  doc.text(quoteLines, pageWidth / 2, y, { align: 'center' });

  // Save the report
  const filename = `${formData.fullBirthName.replace(/\s+/g, '_')}_Numerology_Report.pdf`;
  doc.save(filename);
};
