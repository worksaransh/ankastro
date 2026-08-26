import jsPDF from 'jspdf';
import { UserFormData } from '@/types/formTypes';
import { NumerologyProfile, numberMeanings, calculateLifePath, calculateCompatibility, getLuckyAttributes, calculateKarmicLessons } from './numerology';
import { 
  VedicProfile, 
  calculateVedicProfile
} from './vedicNumerology';
import { getPersonalityCombination, PersonalityCombination } from './personalityLibrary';
import { LifePillars } from './lifePillars';
import { 
  LoshuGrid, 
  PinnacleCycle, 
  ChallengeCycle, 
  KarmicDebt, 
  ElementalBalance 
} from './advancedNumerology';
import { generateAllProofs } from './calculationProofs';
import { analyzeNameCompatibility } from './nameVibration';
import { analyzeMobileCompatibility } from './mobileVibration';
import { calculateBusinessVibration, suggestBrandTweaks } from './businessNameVibration';

// Types
type ReportMode = 'print' | 'visual';

interface PDFColors {
  royal: [number, number, number];
  royalLight: [number, number, number];
  royalDark: [number, number, number];
  gold: [number, number, number];
  goldLight: [number, number, number];
  white: [number, number, number];
  lightBg: [number, number, number];
  darkBg: [number, number, number];
  text: [number, number, number];
  textMuted: [number, number, number];
}

const visualColors: PDFColors = {
  royal: [95, 75, 139],        // #5F4B8B
  royalLight: [127, 107, 171], // lighter purple
  royalDark: [65, 45, 109],    // darker purple
  gold: [212, 175, 55],        // #D4AF37
  goldLight: [243, 231, 255],  // #F3E7FF
  white: [255, 255, 255],
  lightBg: [250, 248, 255],    // very light purple
  darkBg: [35, 25, 55],        // dark purple
  text: [45, 35, 65],
  textMuted: [120, 110, 140],
};

const printColors: PDFColors = {
  royal: [60, 60, 60],
  royalLight: [100, 100, 100],
  royalDark: [40, 40, 40],
  gold: [80, 80, 80],
  goldLight: [245, 245, 245],
  white: [255, 255, 255],
  lightBg: [250, 250, 250],
  darkBg: [30, 30, 30],
  text: [40, 40, 40],
  textMuted: [100, 100, 100],
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

export const generateAdvancedPDF = async (
  formData: UserFormData, 
  profile: NumerologyProfile,
  vedicProfile: VedicProfile,
  personalityCombo?: PersonalityCombination,
  mode: ReportMode = 'visual',
  lifePillars?: LifePillars,
  loshuGrid?: LoshuGrid,
  pinnacleCycles?: PinnacleCycle[],
  challengeCycles?: ChallengeCycle[],
  karmicDebts?: KarmicDebt[],
  elementalBalance?: ElementalBalance,
  language: string = 'en'
): Promise<void> => {
  const doc = new jsPDF();
  const colors = mode === 'visual' ? visualColors : printColors;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;
  let pageNumber = 0;

  const isHi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const tText = (en: string, hi: string, hinglish?: string) => {
    if (isHi) return hi;
    if (isHinglish && hinglish) return hinglish;
    return en;
  };

  // Helper functions
  const addHeader = () => {
    if (pageNumber > 1) {
      doc.setFontSize(8);
      doc.setTextColor(...colors.textMuted);
      doc.setFont('helvetica', 'normal');
      doc.text('DIVINE NUMEROLOGY • ADVANCED BLUEPRINT', margin, 12);
      doc.text('divinenumerology.com', pageWidth - margin, 12, { align: 'right' });
      doc.setDrawColor(...colors.royalLight);
      doc.setLineWidth(0.3);
      doc.line(margin, 15, pageWidth - margin, 15);
    }
  };

  const addFooter = () => {
    if (pageNumber > 1) {
      doc.setDrawColor(...colors.royalLight);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      doc.setFontSize(8);
      doc.setTextColor(...colors.textMuted);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by AnkJyotish AI', margin, pageHeight - 10);
      doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    } else {
      doc.setFontSize(8);
      doc.setTextColor(...colors.textMuted);
      doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  };

  const addNewPage = (withDecoration = true) => {
    doc.addPage();
    pageNumber++;
    y = margin + 5;
    if (withDecoration && mode === 'visual') {
      addPageDecoration();
    }
    addHeader();
    addPageNumber();
  };

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin - 20) {
      addNewPage();
      return true;
    }
    return false;
  };

  const addPageDecoration = () => {
    // Subtle corner decorations
    doc.setDrawColor(...colors.royalLight);
    doc.setLineWidth(0.5);
    // Top left corner
    doc.line(10, 10, 30, 10);
    doc.line(10, 10, 10, 30);
    // Top right corner
    doc.line(pageWidth - 30, 10, pageWidth - 10, 10);
    doc.line(pageWidth - 10, 10, pageWidth - 10, 30);
    // Bottom left
    doc.line(10, pageHeight - 10, 30, pageHeight - 10);
    doc.line(10, pageHeight - 30, 10, pageHeight - 10);
    // Bottom right
    doc.line(pageWidth - 30, pageHeight - 10, pageWidth - 10, pageHeight - 10);
    doc.line(pageWidth - 10, pageHeight - 30, pageWidth - 10, pageHeight - 10);
  };

  const addPageNumber = () => {
    addFooter();
  };

  const addWatermark = () => {
    if (mode === 'visual') {
      doc.setTextColor(230, 225, 240);
      doc.setFontSize(50);
      doc.setFont('helvetica', 'bold');
      doc.text('DIVINE NUMEROLOGY', pageWidth / 2, pageHeight / 2, { 
        align: 'center', 
        angle: 45 
      });
    }
  };

  const drawDivider = (fancy = false) => {
    if (fancy) {
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(1);
      doc.line(margin + 20, y, pageWidth - margin - 20, y);
      // Center ornament
      doc.circle(pageWidth / 2, y, 2, 'F');
    } else {
      doc.setDrawColor(...colors.royalLight);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
    }
    y += 10;
  };

  const addSectionTitle = (title: string, icon?: string) => {
    if (y > margin + 5) {
      addNewPage();
    }
    doc.setFillColor(...colors.royal);
    doc.roundedRect(margin, y - 5, contentWidth, 18, 3, 3, 'F');
    doc.setTextColor(...colors.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(icon ? `${icon}  ${title}` : title, margin + 10, y + 7);
    y += 25;
    doc.setTextColor(...colors.text);
  };

  const addSubsectionTitle = (title: string) => {
    addNewPageIfNeeded(25);
    doc.setTextColor(...colors.royal);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
    y += 10;
    doc.setTextColor(...colors.text);
  };

  const addParagraph = (text: string, indent = 0) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      addNewPageIfNeeded(7);
      doc.text(line, margin + indent, y);
      y += 6;
    });
    y += 4;
  };

  const addBulletPoint = (text: string) => {
    addNewPageIfNeeded(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('•', margin + 5, y);
    const lines = doc.splitTextToSize(text, contentWidth - 15);
    doc.text(lines, margin + 12, y);
    y += lines.length * 6 + 2;
  };

  const addNumberedPoint = (num: number, text: string) => {
    addNewPageIfNeeded(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.royal);
    doc.text(`${num}.`, margin + 5, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(text, contentWidth - 20);
    doc.text(lines, margin + 15, y);
    y += lines.length * 6 + 2;
  };

  const addInfoBox = (title: string, content: string, bgColor: [number, number, number] = colors.lightBg) => {
    addNewPageIfNeeded(40);
    const boxHeight = Math.max(30, doc.splitTextToSize(content, contentWidth - 20).length * 6 + 25);
    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(...colors.royal);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 10, y + 12);
    doc.setTextColor(...colors.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(content, contentWidth - 20);
    doc.text(lines, margin + 10, y + 22);
    y += boxHeight + 8;
  };

  const addNumberHighlight = (number: number | string, label: string, description: string) => {
    addNewPageIfNeeded(35);
    // Number circle
    doc.setFillColor(...colors.royal);
    doc.circle(margin + 15, y + 10, 12, 'F');
    doc.setTextColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(number), margin + 15, y + 14, { align: 'center' });
    // Label and description
    doc.setTextColor(...colors.royal);
    doc.setFontSize(12);
    doc.text(label, margin + 35, y + 8);
    doc.setTextColor(...colors.text);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(description, contentWidth - 45);
    doc.text(lines, margin + 35, y + 16);
    y += Math.max(30, lines.length * 5 + 20);
  };

  const drawSimpleBarChart = (data: { label: string; value: number }[], title: string) => {
    addNewPageIfNeeded(80);
    addSubsectionTitle(title);
    const barHeight = 12;
    const maxWidth = contentWidth - 60;
    
    data.forEach((item) => {
      addNewPageIfNeeded(18);
      doc.setFontSize(9);
      doc.setTextColor(...colors.text);
      doc.text(item.label, margin, y + 8);
      
      // Background bar
      doc.setFillColor(...colors.lightBg);
      doc.roundedRect(margin + 50, y, maxWidth, barHeight, 2, 2, 'F');
      
      // Value bar
      const width = (item.value / 100) * maxWidth;
      doc.setFillColor(...colors.royal);
      doc.roundedRect(margin + 50, y, width, barHeight, 2, 2, 'F');
      
      // Value text
      doc.setTextColor(...colors.white);
    if (width > 20) {
        doc.text(`${item.value}%`, margin + 50 + width - 15, y + 8);
      } else {
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(`${item.value}%`, margin + 50 + width + 5, y + 8);
      }
      
      y += barHeight + 6;
    });
    y += 10;
  };

  const drawRadarChartSimple = (data: { label: string; value: number }[], title: string) => {
    addNewPageIfNeeded(100);
    addSubsectionTitle(title);
    
    // Simple representation as a table
    const centerX = pageWidth / 2;
    const startY = y;
    
    data.forEach((item, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = margin + col * (contentWidth / 2);
      const itemY = startY + row * 20;
      
      if (itemY + 15 > pageHeight - margin) {
        addNewPage();
      }
      
      const bgColor = i % 2 === 0 ? colors.lightBg : [243, 238, 248] as [number, number, number];
      doc.setFillColor(...bgColor);
      doc.roundedRect(x, y + row * 20 - 3, (contentWidth / 2) - 5, 16, 2, 2, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(...colors.royal);
      doc.setFont('helvetica', 'bold');
      doc.text(item.label, x + 5, y + row * 20 + 6);
      
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.value}%`, x + (contentWidth / 2) - 25, y + row * 20 + 6);
    });
    
    y += Math.ceil(data.length / 2) * 20 + 10;
  };

  // ==========================================
  // PAGE 1-2: COVER PAGE
  // ==========================================
  pageNumber = 1;
  
  // Full cover background
  if (mode === 'visual') {
    doc.setFillColor(...colors.darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Decorative border
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(2);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
  } else {
    doc.setFillColor(...colors.lightBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  // Title
  y = 50;
  doc.setTextColor(...(mode === 'visual' ? colors.gold : colors.royal));
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('DIVINE NUMEROLOGY', pageWidth / 2, y, { align: 'center' });
  
  y += 15;
  doc.setFontSize(18);
  doc.text('ADVANCED BLUEPRINT', pageWidth / 2, y, { align: 'center' });
  
  // Decorative line
  y += 15;
  doc.setDrawColor(...colors.gold);
  doc.setLineWidth(1);
  doc.line(60, y, pageWidth - 60, y);
  
  // User name
  y += 25;
  doc.setTextColor(...(mode === 'visual' ? colors.white : colors.text));
  doc.setFontSize(24);
  doc.text(formData.fullBirthName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  
  // Birth info
  y += 15;
  doc.setFontSize(12);
  doc.setTextColor(...(mode === 'visual' ? colors.goldLight : colors.textMuted));
  doc.text(`${tText('Born', 'जन्म तिथि', 'Born')}: ${formData.dateOfBirth}`, pageWidth / 2, y, { align: 'center' });
  if (formData.city && formData.country) {
    y += 10;
    doc.text(`${formData.city}, ${formData.country}`, pageWidth / 2, y, { align: 'center' });
  }
  
  // Life Path Number (large) with Celestial Mandala
  y += 30;
  drawCelestialMandala(doc, pageWidth / 2, y + 25, 30);
  doc.setFillColor(...colors.gold);
  doc.circle(pageWidth / 2, y + 25, 9, 'F');
  doc.setTextColor(...colors.darkBg);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(String(profile.lifePath), pageWidth / 2, y + 30.5, { align: 'center' });
  
  y += 70;
  doc.setTextColor(...(mode === 'visual' ? colors.gold : colors.royal));
  doc.setFontSize(12);
  doc.text(tText('LIFE PATH NUMBER', 'मूलांक (लाइफ पाथ)', 'LIFE PATH NUMBER'), pageWidth / 2, y, { align: 'center' });
  
  const lifePathMeaning = numberMeanings[profile.lifePath] || numberMeanings[9];
  y += 12;
  doc.setFontSize(16);
  doc.text(`"${lifePathMeaning.title}"`, pageWidth / 2, y, { align: 'center' });
  
  // Vedic numbers
  y += 25;
  doc.setFontSize(11);
  doc.setTextColor(...(mode === 'visual' ? colors.white : colors.text));
  doc.text(`${tText('Mulank (Birth Number)', 'मूलांक (जन्मांक)', 'Mulank (Birth Number)')}: ${vedicProfile.mulank}  |  ${tText('Bhagyank (Destiny)', 'भाग्यांक (नियति)', 'Bhagyank (Destiny)')}: ${vedicProfile.bhagyank}`, pageWidth / 2, y, { align: 'center' });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(...(mode === 'visual' ? colors.textMuted : colors.textMuted));
  doc.text(tText('Divine Numerology Blueprint', 'दिव्य अंकज्योतिष ब्लूप्रिंट', 'Divine Numerology Blueprint'), pageWidth / 2, pageHeight - 40, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`${tText('Generated', 'उत्पन्न', 'Generated')}: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 32, { align: 'center' });
  doc.text(`${tText('Report Mode', 'रिपोर्ट मोड', 'Report Mode')}: ${mode === 'visual' ? tText('Visual Premium', 'विज़ुअल प्रीमियम', 'Visual Premium') : tText('Print Friendly', 'प्रिंट फ्रेंडली', 'Print Friendly')}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
  
  addPageNumber();

  // ==========================================
  // PAGE 3-5: TABLE OF CONTENTS
  // ==========================================
  addNewPage();
  
  doc.setTextColor(...colors.royal);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(tText('TABLE OF CONTENTS', 'विषय सूची', 'TABLE OF CONTENTS'), pageWidth / 2, y + 10, { align: 'center' });
  y += 30;
  drawDivider(true);

  const tocSections = [
    { title: tText('Part 1: Core Numbers Summary', 'भाग 1: मुख्य अंक सारांश', 'Part 1: Core Numbers Summary'), page: '6-10' },
    { title: tText('Part 2: Your Life Path Deep Dive', 'भाग 2: आपका जीवन पथ विश्लेषण', 'Part 2: Your Life Path Deep Dive'), page: '11-20' },
    { title: tText('Part 3: Vedic Numerology - Mulank', 'भाग 3: वैदिक अंकशास्त्र - मूलांक', 'Part 3: Vedic Numerology - Mulank'), page: '21-30' },
    { title: tText('Part 4: Vedic Numerology - Bhagyank', 'भाग 4: वैदिक अंकशास्त्र - भाग्यांक', 'Part 4: Vedic Numerology - Bhagyank'), page: '31-40' },
    { title: tText('Part 5: Harmony & Compatibility', 'भाग 5: सामंजस्य और अनुकूलता', 'Part 5: Harmony & Compatibility'), page: '41-45' },
    { title: tText('Part 6: Personality Combination Insights', 'भाग 6: व्यक्तित्व संयोजन अंतर्दृष्टि', 'Part 6: Personality Combination Insights'), page: '46-55' },
    { title: tText('Part 7: Personal Year & Month Guidance', 'भाग 7: व्यक्तिगत वर्ष और महीना मार्गदर्शन', 'Part 7: Personal Year & Month Guidance'), page: '56-60' },
    { title: tText('Part 8: Psychological Patterns', 'भाग 8: मनोवैज्ञानिक पैटर्न', 'Part 8: Psychological Patterns'), page: '61-70' },
    { title: tText('Part 9: Relationship Matrix', 'भाग 9: संबंध मैट्रिक्स', 'Part 9: Relationship Matrix'), page: '71-75' },
    { title: tText('Part 10: Career & Money Insights', 'भाग 10: करियर और धन अंतर्दृष्टि', 'Part 10: Career & Money Insights'), page: '76-80' },
    { title: tText('Part 11: Chakra Alignment', 'भाग 11: चक्र संरेखण', 'Part 11: Chakra Alignment'), page: '81-85' },
    { title: tText('Part 12: 12-Month Predictions', 'भाग 12: 12-महीने की भविष्यवाणियां', 'Part 12: 12-Month Predictions'), page: '86-90' },
    { title: tText('Part 13: 10-Year Forecast', 'भाग 13: 10-वर्षीय पूर्वानुमान', 'Part 13: 10-Year Forecast'), page: '91-95' },
    { title: tText('Part 14: Remedies & Alignment', 'भाग 14: उपाय और संरेखण', 'Part 14: Remedies & Alignment'), page: '96-98' },
    { title: tText('Part 15: Action Plan & Affirmations', 'भाग 15: कार्य योजना और प्रतिज्ञान', 'Part 15: Action Plan & Affirmations'), page: '99-100+' },
  ];

  doc.setFontSize(11);
  tocSections.forEach((section, i) => {
    addNewPageIfNeeded(15);
    
    // Alternating row background for TOC
    const bgColor = i % 2 === 0 ? colors.lightBg : [248, 245, 252] as [number, number, number];
    doc.setFillColor(...bgColor);
    doc.roundedRect(margin - 4, y - 8, contentWidth + 8, 12, 1.5, 1.5, 'F');
    
    doc.setTextColor(...colors.royal);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}.`, margin, y);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');
    doc.text(section.title, margin + 15, y);
    doc.setTextColor(...colors.textMuted);
    doc.text(section.page, pageWidth - margin - 20, y);
    // Dotted line
    doc.setDrawColor(...colors.royalLight);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(margin + 15 + doc.getTextWidth(section.title) + 5, y - 2, pageWidth - margin - 25, y - 2);
    doc.setLineDashPattern([], 0);
    y += 12;
  });

  // PART 1: CORE NUMBERS SUMMARY (Pages 6-10)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 1: CORE NUMBERS SUMMARY', 'भाग 1: मुख्य अंक सारांश'), '✧');
  
  addParagraph('Your numerology chart reveals the cosmic blueprint of your soul. Each number carries specific vibrations that influence different aspects of your life. Below is a comprehensive summary of your core numbers and their meanings.');
  y += 5;

  const coreNumbers = [
    { num: profile.lifePath, label: 'Life Path Number', desc: "Your soul's primary mission and the path you're meant to walk in this lifetime. This is the most significant number in your chart." },
    { num: profile.destiny, label: 'Destiny/Expression Number', desc: 'Your natural talents, abilities, and the goals you are meant to achieve. This reveals what you came here to express.' },
    { num: profile.soulUrge, label: 'Soul Urge/Heart\'s Desire', desc: 'Your innermost desires and what truly motivates you at the deepest level. This is the secret you of your heart.' },
    { num: profile.personality, label: 'Personality Number', desc: 'How others perceive you and the impression you make. This is your outer mask or persona.' },
    { num: profile.birthday, label: 'Birthday Number', desc: 'A special gift or talent that supports your life path. This is a secondary influence from your birth date.' },
    { num: profile.maturity, label: 'Maturity Number', desc: 'The person you are becoming as you age. This influence strengthens after age 35-40.' },
    { num: profile.attitude, label: 'Attitude Number', desc: 'Your initial approach to life and first impressions. This is how you naturally react to new situations.' },
    { num: profile.personalYear, label: 'Personal Year', desc: `The theme of your current year (${new Date().getFullYear()}). Understanding this helps you flow with cosmic timing.` },
  ];

  coreNumbers.forEach((item) => {
    addNumberHighlight(item.num, item.label, item.desc);
  });

  // Vedic Numbers
  addNewPage();
  addSubsectionTitle(tText('Vedic Core Numbers', 'वैदिक मुख्य अंक'));
  
  addNumberHighlight(
    vedicProfile.mulank, 
    tText('Mulank (Birth Number)', 'मूलांक (जन्मांक)'), 
    tText('Your emotional core identity based on your birth date. This reveals your natural behavior and inner emotional patterns.', 'जन्म तिथि के आधार पर आपकी भावनात्मक कोर पहचान। यह आपके स्वाभाविक व्यवहार और आंतरिक भावनात्मक पैटर्न को दर्शाता है।')
  );
  addNumberHighlight(
    vedicProfile.bhagyank, 
    tText('Bhagyank (Destiny Number)', 'भाग्यांक (नियति अंक)'), 
    tText('Your life direction and dharmic path based on your complete date of birth. This defines your spiritual destiny.', 'आपकी पूर्ण जन्म तिथि के आधार पर आपकी जीवन दिशा और धार्मिक मार्ग। यह आपके आध्यात्मिक भाग्य को परिभाषित करता है।')
  );
  
  addInfoBox(
    tText('Harmony Score', 'सामंजस्य स्कोर'), 
    tText(
      `Your Mulank-Bhagyank harmony is ${vedicProfile.harmonyScore}% (${vedicProfile.harmonyLevel}). This indicates how well your emotional nature aligns with your destiny path.`,
      `आपका मूलांक-भाग्यांक सामंजस्य ${vedicProfile.harmonyScore}% (${vedicProfile.harmonyLevel}) है। यह दर्शाता है कि आपका भावनात्मक स्वभाव आपके भाग्य पथ के साथ कितनी अच्छी तरह मेल खाता है।`
    )
  );

  // PART 2: LIFE PATH DEEP DIVE (Pages 11-20)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 2: YOUR LIFE PATH DEEP DIVE', 'भाग 2: आपका जीवन पथ विश्लेषण'), '✧');
  
  const lpMeaning = numberMeanings[profile.lifePath] || numberMeanings[9];
  
  addSubsectionTitle(`${tText('Life Path', 'जीवन पथ')} ${profile.lifePath}: ${lpMeaning.title}`);
  addParagraph(lpMeaning.purpose);
  y += 5;
  
  addSubsectionTitle(tText('Your Core Strengths', 'आपकी मुख्य ताकतें'));
  lpMeaning.strengths.forEach((s) => addBulletPoint(s));
  y += 5;
  
  addSubsectionTitle(tText('Growth Areas', 'सुधार के क्षेत्र'));
  lpMeaning.challenges.forEach((c) => addBulletPoint(c));
  y += 5;
  
  addNewPage();
  addSubsectionTitle(tText('Career & Professional Life', 'करियर और व्यावसायिक जीवन'));
  addParagraph(lpMeaning.careers.join(', '));
  addParagraph(tText('These career paths align with your natural abilities and life purpose. Consider how your current work relates to these suggestions.', 'ये करियर विकल्प आपकी प्राकृतिक क्षमताओं और जीवन के उद्देश्य के साथ मेल खाते हैं। विचार करें कि आपका वर्तमान कार्य इन सुझावों से कैसे संबंधित है।'));
  y += 5;
  
  addSubsectionTitle(tText('Relationships', 'संबंध'));
  addParagraph(lpMeaning.relationships);
  y += 5;
  
  addSubsectionTitle(tText('Health Tendencies', 'स्वास्थ्य प्रवृत्तियां'));
  addParagraph(lpMeaning.health);
  y += 5;
  
  addSubsectionTitle(tText('Spiritual Path', 'आध्यात्मिक मार्ग'));
  addParagraph(lpMeaning.spiritual);
  
  // Famous personalities and day in life
  addNewPage();
  addSubsectionTitle(tText('Famous Personalities with Your Life Path', 'आपके जीवन पथ की प्रसिद्ध हस्तियां'));
  const mulankMeaning = vedicProfile.mulankMeaning;
  if (mulankMeaning.famousPersonalities) {
    mulankMeaning.famousPersonalities.forEach((p) => addBulletPoint(p));
  }
  y += 10;
  
  addSubsectionTitle(tText('A Day in Your Life', 'आपके जीवन में एक दिन'));
  addParagraph(mulankMeaning.dayInLife);
  
  // Real-life examples
  addNewPage();
  addSubsectionTitle(tText('Understanding Your Number in Daily Life', 'दैनिक जीवन में अपने अंक को समझना'));
  
  const lifePathExamples: Record<number, string[]> = {
    1: [
      'You naturally take charge in group settings, even when not asked',
      'You feel frustrated when others move too slowly or need too much direction',
      'Your best ideas come when you work alone first, then share with others',
      'You may have started your own ventures or side projects multiple times'
    ],
    2: [
      'You often play the role of mediator in conflicts between friends or family',
      'You pick up on subtle emotional cues that others miss completely',
      'You prefer working in partnerships rather than alone',
      'You may struggle with making decisions when pressured'
    ],
    3: [
      'People often comment on your creativity or way with words',
      'You feel most alive when expressing yourself through art, writing, or speaking',
      'Your mood greatly affects your productivity',
      'You may have many unfinished creative projects'
    ],
    4: [
      'You create systems and routines that others often adopt',
      'You feel anxious when things are disorganized or unpredictable',
      'You are the reliable one friends and family count on',
      'You may struggle with flexibility when plans change'
    ],
    5: [
      'You get restless doing the same thing for too long',
      'Travel and new experiences energize you deeply',
      'You may have had many different jobs or lived in different places',
      'Routine feels like a prison to you'
    ],
    6: [
      'You naturally take care of others, sometimes before yourself',
      'Your home is usually welcoming and harmonious',
      'You may attract people who need help or guidance',
      'You struggle with saying no to requests'
    ],
    7: [
      'You need significant alone time to recharge',
      'You question everything and seek deeper meaning',
      'Small talk feels exhausting; you prefer meaningful conversations',
      'You may have unconventional spiritual or philosophical beliefs'
    ],
    8: [
      'You think about money and success more than most people',
      'You naturally attract or repel abundance in cycles',
      'Authority figures either support you strongly or oppose you',
      'You may have experienced significant financial ups and downs'
    ],
    9: [
      'You feel responsible for making the world a better place',
      'You easily see the big picture but may miss practical details',
      'You attract people from all backgrounds and walks of life',
      'You may struggle with letting go of the past'
    ]
  };
  
  const examples = lifePathExamples[profile.lifePath > 9 ? profile.lifePath % 9 || 9 : profile.lifePath] || lifePathExamples[9];
  examples.forEach((ex, i) => addNumberedPoint(i + 1, ex));

  // PART 3: VEDIC NUMEROLOGY - MULANK (Pages 21-30)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 3: VEDIC NUMEROLOGY - MULANK', 'भाग 3: वैदिक अंकशास्त्र - मूलांक'), '🕉');
  
  addInfoBox(tText('Mulank (Birth Number)', 'मूलांक (जन्मांक)'), `${tText('Your Mulank is', 'आपका मूलांक है')} ${vedicProfile.mulank}`, colors.lightBg);
  
  addSubsectionTitle(tText('Kaise Nikla? (How It Was Calculated)', 'कैसे निकला? (How It Was Calculated)'));
  const dobParts = formData.dateOfBirth.split('/');
  const birthDay = parseInt(dobParts[0], 10);
  addParagraph(tText(`Your birth date is ${birthDay}. We reduce this to a single digit (unless it's a Master Number 11, 22, or 33).`, `आपकी जन्म तिथि ${birthDay} है। हम इसे एकल अंक में बदलते हैं (जब तक कि यह मास्टर नंबर 11, 22, या 33 न हो)।`));
  addParagraph(tText(`Your complete date of birth: ${formData.dateOfBirth}`, `आपकी पूर्ण जन्म तिथि: ${formData.dateOfBirth}`));
  addParagraph(tText(`We add all digits: Day (${dobParts[0]}) + Month (${dobParts[1]}) + Year (${dobParts[2]}) and reduce to get ${vedicProfile.bhagyank}`, `हम सभी अंकों को जोड़ते हैं: दिन (${dobParts[0]}) + महीना (${dobParts[1]}) + वर्ष (${dobParts[2]}) और कम करके प्राप्त करते हैं ${vedicProfile.bhagyank}`));
  addParagraph(bhagyankMeaning.whyThisDefinesDestiny);
  y += 5;
  
  addSubsectionTitle(`${tText('Bhagyank', 'भाग्यांक')} ${vedicProfile.bhagyank}: ${bhagyankMeaning.title}`);
  
  addSubsectionTitle(tText('Life Direction', 'जीवन की दिशा'));
  addParagraph(bhagyankMeaning.lifeDirection);
  y += 5;
  
  addSubsectionTitle(tText('Dharmic Path', 'धार्मिक मार्ग'));
  addParagraph(bhagyankMeaning.dharmicPath);
  y += 5;
  
  addNewPage();
  addSubsectionTitle(tText('Karmic Purpose', 'कर्म का उद्देश्य'));
  addParagraph(bhagyankMeaning.karmicPurpose);
  y += 5;
  
  addSubsectionTitle(tText('Spiritual Lesson', 'आध्यात्मिक पाठ'));
  addParagraph(bhagyankMeaning.spiritualLesson);
  y += 5;
  
  addSubsectionTitle(tText('Kyun Aaya? (Why This Destiny)', 'क्यों आया? (Why This Destiny)'));
  addParagraph(bhagyankMeaning.whyThisDefinesDestiny);

  // PART 5: HARMONY & COMPATIBILITY (Pages 41-45)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 5: MULANK-BHAGYANK HARMONY', 'भाग 5: मूलांक-भाग्यांक सामंजस्य'), '☯');
  
  const harmonyLevelTranslated = tText(
    vedicProfile.harmonyLevel, 
    vedicProfile.harmonyLevel === 'Excellent' ? 'सर्वोत्तम' : vedicProfile.harmonyLevel === 'Good' ? 'अच्छा' : vedicProfile.harmonyLevel === 'Moderate' ? 'मध्यम' : 'चुनौतीपूर्ण'
  );
  addInfoBox(
    tText('Harmony Analysis', 'सामंजस्य विश्लेषण'), 
    `Mulank ${vedicProfile.mulank} + Bhagyank ${vedicProfile.bhagyank} = ${vedicProfile.harmonyScore}% Harmony (${harmonyLevelTranslated})`
  );
  
  const harmonyDescriptions: Record<string, string> = {
    'Excellent': tText(
      'Your emotional nature and life destiny are beautifully aligned. You likely feel a sense of flow and purpose in life. Your inner self and outer path support each other naturally.',
      'आपका भावनात्मक स्वभाव और जीवन की नियति खूबसूरती से संरेखित हैं। आप संभवतः जीवन में प्रवाह और उद्देश्य की भावना महसूस करते हैं। आपका आंतरिक स्वरूप और बाहरी मार्ग स्वाभाविक रूप से एक-दूसरे का समर्थन करते हैं।'
    ),
    'Good': tText(
      'Your emotional nature and destiny work well together with minor adjustments. You have a solid foundation for success when you consciously align your feelings with your goals.',
      'आपका भावनात्मक स्वभाव और नियति मामूली सुधारों के साथ मिलकर अच्छा काम करते हैं। जब आप होशपूर्वक अपनी भावनाओं को अपने लक्ष्यों के साथ जोड़ते हैं, तो आपके पास सफलता के लिए एक ठोस आधार होता है।'
    ),
    'Moderate': tText(
      'There is some tension between your emotional needs and your life path. This creates opportunities for growth but requires conscious effort to integrate both aspects.',
      'आपकी भावनात्मक आवश्यकताओं और आपके जीवन पथ के बीच कुछ खिंचाव है। यह विकास के अवसर पैदा करता है लेकिन दोनों पहलुओं को एकीकृत करने के लिए सचेत प्रयास की आवश्यकता होती।'
    ),
    'Challenging': tText(
      'Your emotional nature and destiny path may feel at odds. This creates powerful growth opportunities but requires significant inner work to harmonize.',
      'आपका भावनात्मक स्वभाव और नियति मार्ग एक-दूसरे के विपरीत महसूस हो सकते हैं। यह शक्तिशाली विकास के अवसर पैदा करता है लेकिन सामंजस्य स्थापित करने के लिए महत्वपूर्ण आंतरिक कार्य की आवश्यकता होती है।'
    )
  };
  
  addParagraph(harmonyDescriptions[vedicProfile.harmonyLevel]);
  y += 5;
  
  addSubsectionTitle(tText('What This Means for You', 'आपके लिए इसका क्या मतलब है'));
  if (vedicProfile.harmonyLevel === 'Excellent' || vedicProfile.harmonyLevel === 'Good') {
    addBulletPoint(tText('Your natural instincts align with your life purpose', 'आपकी स्वाभाविक प्रवृत्तियां आपके जीवन के उद्देश्य के साथ संरेखित हैं'));
    addBulletPoint(tText('Trust your gut feelings - they lead you toward destiny', 'अपने अंतर्ज्ञान पर विश्वास करें - वे आपको भाग्य की ओर ले जाते हैं'));
    addBulletPoint(tText('Success comes more naturally when you follow your heart', 'जब आप अपने दिल का अनुसरण करते हैं तो सफलता अधिक स्वाभाविक रूप से आती है'));
  } else {
    addBulletPoint(tText('You may feel internal conflict between what you want and what you are meant to do', 'आप जो चाहते हैं और जो करने के लिए बने हैं, उसके बीच आंतरिक संघर्ष महसूस हो सकता है'));
    addBulletPoint(tText('Growth comes through integrating seemingly opposite qualities', 'विकास स्पष्ट रूप से विपरीत गुणों को एकीकृत करने के माध्यम से आता है'));
    addBulletPoint(tText('Your challenge is to find the bridge between emotion and destiny', 'आपकी चुनौती भावना और नियति के बीच पुल खोजने की है'));
  }
  
  // Partner compatibility if provided
  if (formData.includeCompatibility && formData.partnerDob) {
    addNewPage();
    addSubsectionTitle(tText('Romantic Compatibility Analysis', 'रोमांटिक अनुकूलता विश्लेषण'));
    const partnerLifePath = calculateLifePath(formData.partnerDob);
    const compatibility = calculateCompatibility(profile.lifePath, partnerLifePath);
    
    addInfoBox(`${tText('Compatibility with', 'के साथ अनुकूलता')} ${formData.partnerName || 'Partner'}`, `${compatibility.score}% - ${compatibility.compatibility}`);
    addParagraph(`${tText('Strengths', 'ताकतें')}: ${compatibility.strength}`);
    addParagraph(`${tText('Growth Areas', 'सुधार के क्षेत्र')}: ${compatibility.challenges}`);
  }
  
  if (formData.includeCompatibility && formData.businessPartnerDob) {
    addSubsectionTitle(tText('Business Compatibility Analysis', 'व्यावसायिक अनुकूलता विश्लेषण'));
    const businessPartnerLifePath = calculateLifePath(formData.businessPartnerDob);
    const businessCompatibility = calculateCompatibility(profile.lifePath, businessPartnerLifePath);
    
    addInfoBox(`${tText('Business Compatibility with', 'के साथ व्यावसायिक अनुकूलता')} ${formData.businessPartnerName || 'Partner'}`, `${businessCompatibility.score}% - ${businessCompatibility.compatibility}`);
    addParagraph(`${tText('Strengths', 'ताकतें')}: ${businessCompatibility.strength}`);
    addParagraph(`${tText('Growth Areas', 'सुधार के क्षेत्र')}: ${businessCompatibility.challenges}`);
  }

  // PART 6: PERSONALITY COMBINATION (Pages 46-55)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 6: PERSONALITY COMBINATION INSIGHTS', 'भाग 6: व्यक्तित्व संयोजन अंतर्दृष्टि'), '✧');
  
  if (personalityCombo) {
    addSubsectionTitle(tText('Your Overall Personality Profile', 'आपका समग्र व्यक्तित्व प्रोफ़ाइल'));
    addParagraph(personalityCombo.overallProfile);
    y += 5;
    
    addSubsectionTitle(tText('Life Path + Destiny Combination', 'जीवन पथ + भाग्य संयोजन'));
    addParagraph(personalityCombo.lifePathDestiny);
    y += 5;
    
    addSubsectionTitle(tText('Life Path + Soul Urge Combination', 'जीवन पथ + आंतरिक इच्छा संयोजन'));
    addParagraph(personalityCombo.lifePathSoulUrge);
    y += 5;
    
    addNewPage();
    addSubsectionTitle(tText('Destiny + Personality Combination', 'भाग्य + व्यक्तित्व संयोजन'));
    addParagraph(personalityCombo.destinyPersonality);
    y += 5;
    
    addSubsectionTitle(tText('Your Unique Strengths', 'आपकी अनूठी ताकतें'));
    personalityCombo.strengths.forEach((s) => addBulletPoint(s));
    y += 5;
    
    addSubsectionTitle(tText('Challenges to Overcome', 'पार पाने योग्य चुनौतियाँ'));
    personalityCombo.challenges.forEach((c) => addBulletPoint(c));
    y += 5;
    
    addNewPage();
    addSubsectionTitle(tText('Ideal Career Path', 'आदर्श करियर पथ'));
    addParagraph(personalityCombo.careerPath);
    y += 5;
    
    addSubsectionTitle(tText('Your Love Style', 'आपकी प्रेम शैली'));
    addParagraph(personalityCombo.loveStyle);
    y += 5;
    
    addSubsectionTitle(tText('Life Advice', 'जीवन सलाह'));
    addParagraph(personalityCombo.lifeAdvice);
  } else {
    addParagraph('Personality combination data not available for this number combination.');
  }

  // PART 7: PERSONAL YEAR & MONTH (Pages 56-60)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 7: PERSONAL YEAR & MONTH GUIDANCE', 'भाग 7: व्यक्तिगत वर्ष और महीना मार्गदर्शन'), '📅');
  
  addNumberHighlight(profile.personalYear, `${tText('Personal Year', 'व्यक्तिगत वर्ष')} ${profile.personalYear}`, tText('Your theme for this entire year', 'इस पूरे वर्ष के लिए आपका मुख्य विषय'));
  addNumberHighlight(profile.personalMonth, `${tText('Personal Month', 'व्यक्तिगत महीना')} ${profile.personalMonth}`, tText('Your theme for this specific month', 'इस विशिष्ट महीने के लिए आपका मुख्य विषय'));
  addNumberHighlight(profile.personalDay, `${tText('Personal Day', 'व्यक्तिगत दिन')} ${profile.personalDay}`, tText('Your theme for today', 'आज के लिए आपका मुख्य विषय'));
  
  // const personalYearMeaning = numberMeanings[profile.personalYear] || numberMeanings[9];
  if (formData.includeCompatibility && formData.partnerDob) {
    addNewPage();
    addSubsectionTitle('Romantic Compatibility Analysis');
    const partnerLifePath = calculateLifePath(formData.partnerDob);
    const compatibility = calculateCompatibility(profile.lifePath, partnerLifePath);
    
    addInfoBox(`Compatibility with ${formData.partnerName || 'Partner'}`, `${compatibility.score}% - ${compatibility.compatibility}`);
    addParagraph(`Strengths: ${compatibility.strength}`);
    addParagraph(`Growth Areas: ${compatibility.challenges}`);
  }
  
  if (formData.includeCompatibility && formData.businessPartnerDob) {
    addSubsectionTitle('Business Compatibility Analysis');
    const businessPartnerLifePath = calculateLifePath(formData.businessPartnerDob);
    const businessCompatibility = calculateCompatibility(profile.lifePath, businessPartnerLifePath);
    
    addInfoBox(`Business Compatibility with ${formData.businessPartnerName || 'Partner'}`, `${businessCompatibility.score}% - ${businessCompatibility.compatibility}`);
    addParagraph(`Strengths: ${businessCompatibility.strength}`);
    addParagraph(`Growth Areas: ${businessCompatibility.challenges}`);
  }

  // PART 6: PERSONALITY COMBINATION (Pages 46-55)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 6: PERSONALITY COMBINATION INSIGHTS', 'भाग 6: व्यक्तित्व संयोजन अंतर्दृष्टि'), '✧');
  
  if (personalityCombo) {
    addSubsectionTitle('Your Overall Personality Profile');
    addParagraph(personalityCombo.overallProfile);
    y += 5;
    
    addSubsectionTitle('Life Path + Destiny Combination');
    addParagraph(personalityCombo.lifePathDestiny);
    y += 5;
    
    addSubsectionTitle('Life Path + Soul Urge Combination');
    addParagraph(personalityCombo.lifePathSoulUrge);
    y += 5;
    
    addNewPage();
    addSubsectionTitle('Destiny + Personality Combination');
    addParagraph(personalityCombo.destinyPersonality);
    y += 5;
    
    addSubsectionTitle('Your Unique Strengths');
    personalityCombo.strengths.forEach((s) => addBulletPoint(s));
    y += 5;
    
    addSubsectionTitle('Challenges to Overcome');
    personalityCombo.challenges.forEach((c) => addBulletPoint(c));
    y += 5;
    
    addNewPage();
    addSubsectionTitle('Ideal Career Path');
    addParagraph(personalityCombo.careerPath);
    y += 5;
    
    addSubsectionTitle('Your Love Style');
    addParagraph(personalityCombo.loveStyle);
    y += 5;
    
    addSubsectionTitle('Life Advice');
    addParagraph(personalityCombo.lifeAdvice);
  } else {
    addParagraph('Personality combination data not available for this number combination.');
  }

  // PART 7: PERSONAL YEAR & MONTH (Pages 56-60)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 7: PERSONAL YEAR & MONTH GUIDANCE', 'भाग 7: व्यक्तिगत वर्ष और महीना मार्गदर्शन'), '📅');
  
  addNumberHighlight(profile.personalYear, `Personal Year ${profile.personalYear}`, 'Your theme for this entire year');
  addNumberHighlight(profile.personalMonth, `Personal Month ${profile.personalMonth}`, 'Your theme for this specific month');
  addNumberHighlight(profile.personalDay, `Personal Day ${profile.personalDay}`, 'Your theme for today');
  
  const personalYearMeaning = numberMeanings[profile.personalYear] || numberMeanings[9];
  
  addSubsectionTitle(`Personal Year ${profile.personalYear} Guidance`);
  addParagraph(personalYearMeaning.purpose);
  y += 5;
  
  addSubsectionTitle('What to Focus On This Year');
  addBulletPoint(`Career: ${personalYearMeaning.careers[0] || 'Growth and development'}`);
  addBulletPoint(`Relationships: ${personalYearMeaning.relationships}`);
  addBulletPoint(`Health: ${personalYearMeaning.health}`);
  addBulletPoint(`Spiritual: ${personalYearMeaning.spiritual}`);

  // PART 8: PSYCHOLOGICAL PATTERNS (Pages 61-70)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 8: PSYCHOLOGICAL PATTERNS', 'भाग 8: मनोवैज्ञानिक पैटर्न'), '🧠');
  
  addSubsectionTitle('Thought Patterns That May Block Your Destiny');
  const blockingPatterns: Record<number, string[]> = {
    1: ['Fear of not being recognized', 'Tendency to dismiss others\' ideas', 'Impatience with slower processes'],
    2: ['Fear of conflict leads to suppressing true feelings', 'Waiting for others to make decisions', 'Over-accommodating at your expense'],
    3: ['Scattered attention prevents deep mastery', 'Using humor to avoid emotional depth', 'Fear of criticism stifles expression'],
    4: ['Rigid thinking blocks new opportunities', 'Fear of change causes stagnation', 'Overwork as avoidance of emotions'],
    5: ['Commitment phobia prevents lasting success', 'Restlessness mistaken for progress', 'Avoiding depth for surface variety'],
    6: ['Martyrdom pattern - giving to feel worthy', 'Perfectionism creates paralysis', 'Over-responsibility for others\' problems'],
    7: ['Isolation mistaken for spiritual growth', 'Analysis paralysis prevents action', 'Skepticism blocks intuitive guidance'],
    8: ['Material success defines self-worth', 'Control issues in relationships', 'Fear of poverty drives unhealthy behavior'],
    9: ['Inability to set boundaries', 'Holding onto past relationships/situations', 'Idealism leads to disappointment']
  };
  
  const patterns = blockingPatterns[profile.lifePath > 9 ? profile.lifePath % 9 || 9 : profile.lifePath] || blockingPatterns[9];
  patterns.forEach((p) => addBulletPoint(p));
  y += 10;
  
  addSubsectionTitle('Who You Attract & Why');
  addParagraph(`As a Life Path ${profile.lifePath}, you naturally attract:`);
  
  const attractionPatterns: Record<number, string> = {
    1: 'People who need direction and leadership. You may attract followers, but also competitors and those who challenge your authority. You are learning about healthy leadership versus ego-driven control.',
    2: 'Sensitive souls and those in conflict. You attract people who need mediation and support. Be aware of attracting those who drain your energy through constant needs.',
    3: 'Creative spirits and those seeking joy. You attract admirers of your talents and those who want to be entertained. Be mindful of superficial connections.',
    4: 'Those seeking stability and reliability. You attract people who need structure and depend on your consistency. Be aware of being taken for granted.',
    5: 'Adventurous spirits and those stuck in routines. You attract people seeking freedom and excitement. Be mindful of commitment-avoidant connections.',
    6: 'Those needing care and healing. You attract people with problems to solve and wounds to heal. Be aware of rescue dynamics.',
    7: 'Seekers and those with questions. You attract spiritual searchers and intellectuals. Be mindful of attracting those who drain your energy with endless questioning.',
    8: 'Ambitious individuals and those seeking power. You attract business opportunities and power dynamics. Be aware of users and manipulators.',
    9: 'Wounded healers and humanitarian causes. You attract those needing wisdom and completion. Be aware of martyrdom patterns.'
  };
  
  addParagraph(attractionPatterns[profile.lifePath > 9 ? profile.lifePath % 9 || 9 : profile.lifePath] || attractionPatterns[9]);
  
  addNewPage();
  addSubsectionTitle('Repeating Karmic Cycles');
  addParagraph('Based on your numbers, you may experience these recurring patterns until their lessons are learned:');
  
  const karmicLessons = calculateKarmicLessons(formData.fullBirthName);
  if (karmicLessons.length > 0) {
    addParagraph(`Your Karmic Lessons (missing numbers in your name): ${karmicLessons.join(', ')}`);
    karmicLessons.forEach((lesson) => {
      const lessonMeaning: Record<number, string> = {
        1: 'Learning independence and self-reliance',
        2: 'Learning cooperation and patience',
        3: 'Learning self-expression and joy',
        4: 'Learning discipline and hard work',
        5: 'Learning adaptability and freedom',
        6: 'Learning responsibility and love',
        7: 'Learning faith and inner wisdom',
        8: 'Learning power and abundance',
        9: 'Learning compassion and completion'
      };
      addBulletPoint(`Number ${lesson}: ${lessonMeaning[lesson] || 'Important life lesson'}`);
    });
  } else {
    addParagraph('Your name contains all numbers 1-9, indicating you have access to all fundamental energies. Focus on balancing rather than learning new lessons.');
  }
  
  addSubsectionTitle('Identity Healing Questions');
  const healingQuestions = [
    'What part of yourself do you hide from the world?',
    'What would you do if you knew you could not fail?',
    'What beliefs about yourself did you inherit from family?',
    'What recurring situation keeps appearing in your life?',
    'What are you tolerating that you should not accept?',
    'What would your wisest self advise you right now?'
  ];
  healingQuestions.forEach((q, i) => addNumberedPoint(i + 1, q));

  // PART 9: RELATIONSHIP MATRIX (Pages 71-75)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 9: RELATIONSHIP MATRIX', 'भाग 9: संबंध मैट्रिक्स'), '💫');
  
  const luckyAttrs = getLuckyAttributes(profile.lifePath);
  
  addSubsectionTitle('Your Compatibility Overview');
  
  const compatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const compatData = compatNumbers.map((num) => {
    const compat = calculateCompatibility(profile.lifePath, num);
    return { label: `Life Path ${num}`, value: compat.score };
  });
  
  drawSimpleBarChart(compatData, 'Compatibility with Different Life Paths');
  
  addSubsectionTitle('Best Matches for You');
  const bestMatches = compatData.filter((d) => d.value >= 80).map((d) => d.label);
  addParagraph(bestMatches.length > 0 ? bestMatches.join(', ') : 'You have moderate compatibility with most numbers - focus on communication and understanding.');
  
  addSubsectionTitle('Challenging Matches (Growth Opportunities)');
  const challengingMatches = compatData.filter((d) => d.value < 60).map((d) => d.label);
  addParagraph(challengingMatches.length > 0 ? challengingMatches.join(', ') : 'No significantly challenging matches - you adapt well to most people.');

  // PART 10: CAREER & MONEY (Pages 76-80)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 10: CAREER & MONEY INSIGHTS', 'भाग 10: करियर और धन अंतर्दृष्टि'), '💰');
  
  addSubsectionTitle('Ideal Career Paths');
  const careers = numberMeanings[profile.lifePath]?.careers || [];
  careers.forEach((career) => addBulletPoint(career));
  y += 5;
  
  addSubsectionTitle('Career vs Stability Index');
  const careerData = [
    { label: 'Ambition', value: Math.min(100, 50 + profile.lifePath * 5 + profile.destiny * 3) },
    { label: 'Stability Need', value: Math.min(100, 70 - profile.lifePath * 2 + vedicProfile.mulank * 5) },
    { label: 'Risk Tolerance', value: Math.min(100, 40 + profile.lifePath * 4 + profile.soulUrge * 2) },
    { label: 'Leadership', value: Math.min(100, 45 + profile.lifePath * 6) },
    { label: 'Creativity', value: Math.min(100, 50 + profile.soulUrge * 5 + profile.destiny * 2) }
  ];
  drawSimpleBarChart(careerData, 'Your Career Tendencies');
  
  addSubsectionTitle('Money Patterns');
  const moneyPatterns: Record<number, string> = {
    1: 'You earn through leadership and innovation. Self-employment often suits you best. Money flows when you follow your unique vision.',
    2: 'You earn through partnerships and service. Collaborative ventures and support roles bring income. Money flows through relationships.',
    3: 'You earn through creativity and communication. Arts, entertainment, and speaking bring income. Money flows when you express yourself.',
    4: 'You earn through hard work and reliability. Traditional careers and building bring income. Money flows through consistent effort.',
    5: 'You earn through change and variety. Sales, travel, and dynamic roles bring income. Money flows through adaptability.',
    6: 'You earn through service and care. Healing, teaching, and nurturing bring income. Money flows through helping others.',
    7: 'You earn through expertise and knowledge. Research, analysis, and specialization bring income. Money flows through wisdom.',
    8: 'You earn through power and management. Business, finance, and leadership bring income. Money flows in cycles.',
    9: 'You earn through service and inspiration. Humanitarian and creative work brings income. Money flows through giving.'
  };
  
  addParagraph(moneyPatterns[profile.lifePath > 9 ? profile.lifePath % 9 || 9 : profile.lifePath] || moneyPatterns[9]);

  // PART 11: CHAKRA ALIGNMENT (Pages 81-85)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 11: CHAKRA ALIGNMENT', 'भाग 11: चक्र संरेखण'), '🌈');
  
  const chakraData = [
    { label: 'Root (Muladhara)', value: vedicProfile.chakraAlignment.root },
    { label: 'Sacral (Svadhisthana)', value: vedicProfile.chakraAlignment.sacral },
    { label: 'Solar Plexus (Manipura)', value: vedicProfile.chakraAlignment.solarPlexus },
    { label: 'Heart (Anahata)', value: vedicProfile.chakraAlignment.heart },
    { label: 'Throat (Vishuddha)', value: vedicProfile.chakraAlignment.throat },
    { label: 'Third Eye (Ajna)', value: vedicProfile.chakraAlignment.thirdEye },
    { label: 'Crown (Sahasrara)', value: vedicProfile.chakraAlignment.crown }
  ];
  
  drawRadarChartSimple(chakraData, 'Your Chakra Energy Distribution');
  
  addInfoBox('Overall Chakra Balance', `${vedicProfile.chakraAlignment.overallBalance}% balanced`);
  
  addSubsectionTitle('Chakra Balancing Recommendations');
  addParagraph(`Your weakest chakra appears to be the ${vedicProfile.remedies.weakChakra}.`);
  addParagraph(vedicProfile.remedies.chakraBalancingTip);

  // PART 12: 12-MONTH PREDICTIONS (Pages 86-90)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 12: 12-MONTH FORECAST', 'भाग 12: 12-महीने की भविष्यवाणियां'), '📊');
  
  addParagraph(`Current Phase: ${vedicProfile.predictions.currentPhase.toUpperCase()}`);
  y += 5;
  
  vedicProfile.predictions.next12Months.forEach((month, i) => {
    addNewPageIfNeeded(45);
    
    const actionColor: [number, number, number] = month.action === 'breakthrough' ? [46, 125, 50] : month.action === 'pause' ? [198, 40, 40] : colors.royal;
    doc.setFillColor(actionColor[0], actionColor[1], actionColor[2]);
    doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(month.month, margin + 8, y + 10);
    doc.text(`Score: ${month.score}/100`, pageWidth - margin - 35, y + 10);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Theme: ${month.theme}`, margin + 8, y + 20);
    doc.text(`Action: ${month.action.toUpperCase()}`, pageWidth - margin - 50, y + 20);
    doc.text(`Timing: ${month.timing}`, margin + 8, y + 28);
    
    y += 42;
    
    if ((i + 1) % 4 === 0 && i < 11) {
      addNewPage();
    }
  });

  // PART 13: 10-YEAR FORECAST (Pages 91-95)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 13: 10-YEAR GROWTH FORECAST', 'भाग 13: 10-वर्षीय पूर्वानुमान'), '📈');
  
  addParagraph(`Turning Point Years: ${vedicProfile.predictions.turningPointYears.join(', ')}`);
  y += 5;
  
  vedicProfile.predictions.next10Years.forEach((year, i) => {
    addNewPageIfNeeded(50);
    
    const bgColor = year.isTurningPoint ? [243, 231, 255] as [number, number, number] : colors.lightBg;
    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F');
    
    if (year.isTurningPoint) {
      doc.setDrawColor(...colors.gold);
      doc.setLineWidth(1);
      doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'S');
    }
    
    doc.setTextColor(...colors.royal);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(String(year.year), margin + 10, y + 15);
    
    if (year.isTurningPoint) {
      doc.setFontSize(8);
      doc.text('★ TURNING POINT', margin + 10, y + 22);
    }
    
    doc.setTextColor(...colors.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Theme: ${year.theme}`, margin + 45, y + 12);
    doc.text(`Growth: ${year.growth}`, margin + 45, y + 22);
    doc.text(`Action: ${year.action.toUpperCase()}  |  Score: ${year.score}/100`, margin + 45, y + 32);
    
    y += 48;
    
    if ((i + 1) % 5 === 0 && i < 9) {
      addNewPage();
    }
  });

  // PART 14: REMEDIES & ALIGNMENT (Pages 96-98)
  // ==========================================
  addNewPage();
  addSectionTitle(tText('PART 14: REMEDIES & ALIGNMENT', 'भाग 14: उपाय और संरेखण'), '🌟');
  
  addParagraph('⚠️ Disclaimer: The following suggestions are for spiritual and educational purposes only. They are not medical advice and do not guarantee specific results.');
  y += 5;
  
  addSubsectionTitle('Lucky Direction (Vastu Based)');
  addParagraph(vedicProfile.remedies.luckyDirection);
  y += 5;
  
  addSubsectionTitle('Personal Mantra');
  addInfoBox('Daily Mantra', vedicProfile.remedies.personalMantra);
  
  addSubsectionTitle('Suggested Colors');
  addParagraph(vedicProfile.remedies.suggestedColors.join(', '));
  y += 5;
  
  addSubsectionTitle('Suggested Stones/Gems');
  addParagraph(vedicProfile.remedies.suggestedStones.join(', '));
  addParagraph('Note: Consult a qualified expert before wearing gemstones. This is for educational purposes only.');
  y += 5;
  
  addNewPage();
  addSubsectionTitle('Grah (Planetary) Energy');
  addParagraph(vedicProfile.remedies.grahEnergy);
  addParagraph(`Balancing: ${vedicProfile.remedies.grahBalancing}`);
  y += 5;
  
  addSubsectionTitle("Do's");
  vedicProfile.remedies.dosAndDonts.dos.forEach((d) => addBulletPoint(d));
  y += 5;
  
  addSubsectionTitle("Don'ts");
  vedicProfile.remedies.dosAndDonts.donts.forEach((d) => addBulletPoint(d));
  y += 5;
  
  addSubsectionTitle('Manifestation Checklist');
  vedicProfile.remedies.manifestationChecklist.forEach((item, i) => addNumberedPoint(i + 1, item));

  // PART 14B: VIBRATIONS — NAME, MOBILE & BRAND
  // ==========================================
  try {
    addNewPage();
    addSectionTitle(tText('VIBRATIONS — NAME, MOBILE & BRAND', 'स्पंदन — नाम, मोबाइल और ब्रांड'), '✨');
    addParagraph('A quick scan of how your name, phone number and any brand/business name resonate with your core numbers (Mulank, Bhagyank, Life Path).');

    // --- Name vibration ---
    const nameForVib = formData.currentName || formData.fullBirthName;
    if (nameForVib && formData.dateOfBirth) {
      const nv = analyzeNameCompatibility(nameForVib, formData.dateOfBirth);
      addSubsectionTitle(`Name Vibration — ${nameForVib}`);
      addInfoBox(
        `Root ${nv.vibration.root} • Alignment ${nv.alignmentScore}%`,
        `Pythagorean total: ${nv.vibration.pythagoreanTotal}  |  Chaldean total: ${nv.vibration.chaldeanTotal}\n` +
        `vs Mulank (${nv.mulank}): ${nv.vsMulank}\n` +
        `vs Bhagyank (${nv.bhagyank}): ${nv.vsBhagyank}\n` +
        `vs Life Path (${nv.lifePath}): ${nv.vsLifePath}\n\n` +
        nv.summary
      );
      if (nv.suggestions.length > 0) {
        addSubsectionTitle('Spelling Tweaks to Explore');
        nv.suggestions.forEach((s, i) => addNumberedPoint(i + 1, `${s.name} — ${s.reason}`));
      }
    }

    // --- Mobile vibration ---
    const mobile = (formData.whatsappNumber || '').replace(/\D/g, '');
    if (mobile.length >= 6) {
      const mv = analyzeMobileCompatibility(mobile, vedicProfile.mulank, vedicProfile.bhagyank);
      addSubsectionTitle('Mobile Number Vibration');
      addInfoBox(
        `Root ${mv.vibration.root} • Score ${mv.score}%`,
        `Digit sum: ${mv.vibration.digitSum}  |  Last-4 root: ${mv.vibration.last4Root}\n` +
        `vs Mulank (${vedicProfile.mulank}): ${mv.vsMulank}\n` +
        `vs Bhagyank (${vedicProfile.bhagyank}): ${mv.vsBhagyank}\n\n` +
        mv.verdict
      );
      if (mv.alternativeEndings.length > 0) {
        addSubsectionTitle('Alternative Endings');
        mv.alternativeEndings.forEach((a, i) => addNumberedPoint(i + 1, `End with …${a.ending} → friendly root ${a.root}`));
      }
    }

    // --- Brand / business vibration ---
    const brand = formData.businessPartnerName;
    if (brand) {
      const bv = calculateBusinessVibration(brand, formData.dateOfBirth);
      addSubsectionTitle(`Brand Vibration — ${brand}`);
      addInfoBox(
        `Root ${bv.brand.root} • Archetype: ${bv.archetype.name}`,
        `${bv.archetype.tagline}\n\n` +
        `Pythagorean total: ${bv.brand.pythagoreanTotal}  |  Chaldean total: ${bv.brand.chaldeanTotal}` +
        (bv.founderAlignment ? `\nFounder Life Path: ${bv.founderAlignment.lifePath} — ${bv.founderAlignment.verdict}` : '')
      );
      const tweaks = suggestBrandTweaks(brand, bv.archetype.number);
      if (tweaks.length > 0) {
        addSubsectionTitle('Brand Spelling Variants');
        tweaks.forEach((t, i) => addNumberedPoint(i + 1, `${t.name} — ${t.change} → root ${t.root}`));
      }
    }
  } catch (err) {
    console.warn('[PDF] Vibrations section skipped:', err);
  }

  // PART 15: 5-PILLAR LIFE GUIDANCE
  // ==========================================
  if (lifePillars) {
    addNewPage();
    addSectionTitle(tText('PART 15: 5-PILLAR LIFE GUIDANCE', 'भाग 15: 5-स्तंभ जीवन मार्गदर्शन'), '🌟');
    
    // Career Summary
    addInfoBox('💼 Career & Success', `Work Style: ${lifePillars.career.workStyle.primary}\nJob: ${lifePillars.career.jobVsBusinessScore.job}% | Business: ${lifePillars.career.jobVsBusinessScore.business}%\nVerdict: ${lifePillars.career.jobVsBusinessScore.verdict}`);
    
    // Love Summary
    addInfoBox('❤️ Love & Relationships', `Love Vibration: ${lifePillars.love.loveVibration.type}\nAttachment: ${lifePillars.love.relationshipStyle.attachment}\nSoul Lesson: ${lifePillars.love.soulLesson}`);
    
    // Money Summary
    addInfoBox('💰 Money & Abundance', `Money Vibration: ${lifePillars.money.moneyVibration.type}\nEarning Path: ${lifePillars.money.earningPath.primary}\nInvestment Style: ${lifePillars.money.investmentStyle}`);
    
    // Health Summary
    addInfoBox('🌿 Health & Wellbeing', `Stress Pattern: ${lifePillars.health.stressPattern}\nBalance Score: ${lifePillars.health.balanceScore}%`);
    
    // Growth Summary
    addInfoBox('✨ Personal Growth', `Archetype: ${lifePillars.growth.archetype}\nKarmic Lesson: ${lifePillars.growth.karmicLesson}\nLife Theme: ${lifePillars.growth.lifeTheme}`);
    
    // Blueprint Taglines
    addNewPage();
    addSectionTitle('LIFE BLUEPRINT SUMMARY', '🎯');
    addInfoBox('💼', lifePillars.lifeBlueprintSummary.careerTagline);
    addInfoBox('❤️', lifePillars.lifeBlueprintSummary.loveTagline);
    addInfoBox('💰', lifePillars.lifeBlueprintSummary.moneyTagline);
    addInfoBox('🌿', lifePillars.lifeBlueprintSummary.healthTagline);
    addInfoBox('✨', lifePillars.lifeBlueprintSummary.growthTagline);
  }

  // ==========================================
  // PART 16: ACTION PLAN & AFFIRMATIONS
  // ==========================================
  addNewPage();
  addSectionTitle('ACTION PLAN', '🎯');
  
  addSubsectionTitle('30-Day Focus: Foundation');
  const thirtyDayActions = [
    'Journal your current life situation honestly',
    'Identify one limiting belief to release',
    'Start a daily meditation practice (even 5 minutes)',
    'Wear your lucky colors at least 3 days a week',
    'Set one clear intention for the month',
    'Connect with a mentor or guide',
    'Review your relationships - who energizes vs drains you',
    'Create a vision board or written vision'
  ];
  thirtyDayActions.forEach((action, i) => addNumberedPoint(i + 1, action));
  
  addNewPage();
  addSubsectionTitle('60-Day Focus: Momentum');
  const sixtyDayActions = [
    'Take one significant action toward your life purpose',
    'Let go of one relationship or situation that no longer serves you',
    'Learn a new skill aligned with your destiny number',
    'Practice your personal mantra daily',
    'Face one fear that has been holding you back',
    'Create a new income stream aligned with your talents',
    'Deepen your spiritual practice',
    'Connect with people who share your life path energy'
  ];
  sixtyDayActions.forEach((action, i) => addNumberedPoint(i + 1, action));
  
  addSubsectionTitle('90-Day Focus: Transformation');
  const ninetyDayActions = [
    'Evaluate progress and adjust course',
    'Celebrate all wins, no matter how small',
    'Set new goals for the next quarter',
    'Share your wisdom with someone who needs it',
    'Make a bold decision you have been avoiding',
    'Invest in yourself (education, health, or growth)',
    'Create something lasting - art, business, or relationship',
    'Plan your next level of growth'
  ];
  ninetyDayActions.forEach((action, i) => addNumberedPoint(i + 1, action));
  
  // Affirmations Page
  addNewPage();
  addSectionTitle('DAILY AFFIRMATIONS', '✨');
  
  const affirmations = [
    "I am aligned with my soul's purpose and walk my path with confidence.",
    "My unique gifts and talents serve the world in meaningful ways.",
    "I embrace change as an opportunity for growth and transformation.",
    "I attract abundance in all areas of my life.",
    "I am connected to the wisdom of the universe.",
    "My intuition guides me toward my highest good.",
    "I release what no longer serves me with love and gratitude.",
    "I am worthy of all the blessings the universe has in store for me.",
    "Every day, I am becoming more aligned with my true self.",
    "I trust the timing of my life.",
    vedicProfile.remedies.personalMantra
  ];
  
  affirmations.forEach((aff) => {
    addNewPageIfNeeded(20);
    addInfoBox('✦', aff, colors.lightBg);
  });
  
  // ==========================================
  // LOSHU GRID ANALYSIS
  // ==========================================
  if (loshuGrid) {
    addNewPage();
    addSectionTitle('LOSHU GRID ANALYSIS', '☯');
    
    addParagraph('The Loshu Grid is an ancient 3x3 magic square used in Vedic numerology to analyze personality patterns, strengths, and missing energies based on your birth date and name.');
    
    // Draw simple grid representation
    addSubsectionTitle('Your Loshu Grid Numbers');
    
    loshuGrid.grid.forEach((row, rowIndex) => {
      addNewPageIfNeeded(25);
      const gridPositions = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
      const rowText = row.map((count, colIndex) => {
        const num = gridPositions[rowIndex][colIndex];
        return `[${num}] × ${count}`;
      }).join('    |    ');
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.text(rowText, pageWidth / 2, y, { align: 'center' });
      y += 15;
    });
    y += 10;
    
    // Present Numbers
    if (loshuGrid.present.length > 0) {
      addSubsectionTitle('Present Numbers (Your Strengths)');
      addParagraph(`Numbers present in your chart: ${loshuGrid.present.join(', ')}`);
    }
    
    // Missing Numbers
    if (loshuGrid.missing.length > 0) {
      addSubsectionTitle('Missing Numbers (Growth Areas)');
      addParagraph(`Numbers missing from your chart: ${loshuGrid.missing.join(', ')}`);
      addParagraph('These represent energies you may need to consciously develop or attract into your life.');
    }
    
    // Overloaded Numbers
    if (loshuGrid.overloaded.length > 0) {
      addSubsectionTitle('Overloaded Numbers (Intense Energies)');
      addParagraph(`Overloaded numbers (appearing 3+ times): ${loshuGrid.overloaded.join(', ')}`);
      addParagraph('These represent areas where you have intense natural abilities but may need balance.');
    }
    
    // Planes Analysis
    addNewPageIfNeeded(60);
    addSubsectionTitle('Plane Analysis');
    
    addInfoBox('Mental Plane (4-9-2)', `Strength: ${loshuGrid.analysis.mentalPlane.strength}`);
    addInfoBox('Emotional Plane (3-5-7)', `Strength: ${loshuGrid.analysis.emotionalPlane.strength}`);
    addInfoBox('Practical Plane (8-1-6)', `Strength: ${loshuGrid.analysis.practicalPlane.strength}`);
    
    // Power Arrows
    if (loshuGrid.analysis.arrows.length > 0) {
      addSubsectionTitle('Power Arrows (Complete Lines)');
      loshuGrid.analysis.arrows.forEach(arrow => {
        addBulletPoint(arrow);
      });
    }
  }
  
  // ==========================================
  // PINNACLE & CHALLENGE CYCLES
  // ==========================================
  if (pinnacleCycles && pinnacleCycles.length > 0) {
    addNewPage();
    addSectionTitle('PINNACLE CYCLES', '△');
    
    addParagraph('Pinnacle Cycles represent the major themes and opportunities during specific periods of your life. Understanding these helps you align with cosmic timing.');
    
    pinnacleCycles.forEach((cycle, index) => {
      addNewPageIfNeeded(50);
      addSubsectionTitle(`Pinnacle ${index + 1}: Ages ${cycle.ages}`);
      addNumberHighlight(cycle.number, cycle.theme.en, '');
      cycle.opportunities.forEach(opp => addBulletPoint(`Opportunity: ${opp}`));
      cycle.challenges.forEach(ch => addBulletPoint(`Challenge: ${ch}`));
      y += 5;
    });
  }
  
  if (challengeCycles && challengeCycles.length > 0) {
    addNewPage();
    addSectionTitle('CHALLENGE CYCLES', '▽');
    
    addParagraph('Challenge Cycles reveal the obstacles and lessons you need to overcome during different phases of life. These challenges are opportunities for growth.');
    
    challengeCycles.forEach((cycle, index) => {
      addNewPageIfNeeded(40);
      addSubsectionTitle(`Challenge ${index + 1}: Ages ${cycle.ages}`);
      addNumberHighlight(cycle.number, cycle.challenge.en, '');
      addBulletPoint(`Lesson: ${cycle.lesson}`);
      y += 5;
    });
  }
  
  // ==========================================
  // KARMIC DEBTS
  // ==========================================
  if (karmicDebts && karmicDebts.length > 0) {
    const activeDebts = karmicDebts.filter(d => d.present);
    if (activeDebts.length > 0) {
      addNewPage();
      addSectionTitle('KARMIC DEBT ANALYSIS', '⚖');
      
      addParagraph('Karmic Debt Numbers (13, 14, 16, 19) represent lessons carried from past lives. Understanding these helps you break patterns and evolve spiritually.');
      
      activeDebts.forEach(debt => {
        addNewPageIfNeeded(60);
        addSubsectionTitle(`Karmic Debt ${debt.number}`);
        addParagraph(debt.meaning.en);
        addInfoBox('Lesson', debt.lesson);
        addInfoBox('Remedy', debt.remedy);
        y += 5;
      });
    }
  }
  
  // ==========================================
  // ELEMENTAL BALANCE
  // ==========================================
  if (elementalBalance) {
    addNewPage();
    addSectionTitle('ELEMENTAL BALANCE', '✧');
    
    addParagraph('Your birth date reveals the balance of five elements in your cosmic makeup. Understanding this helps you identify areas to strengthen or balance.');
    
    const elementData = [
      { label: 'Fire (Agni)', value: elementalBalance.fire },
      { label: 'Water (Jal)', value: elementalBalance.water },
      { label: 'Earth (Prithvi)', value: elementalBalance.earth },
      { label: 'Air (Vayu)', value: elementalBalance.air },
      { label: 'Ether (Akash)', value: elementalBalance.ether },
    ];
    
    drawSimpleBarChart(elementData, 'Your Elemental Composition');
    
    addInfoBox('Dominant Element', `${elementalBalance.dominant} - This element strongly influences your personality and life approach.`);
    addInfoBox('Weakest Element', `${elementalBalance.weak} - Consider activities and practices that strengthen this element.`);
  }

  // ============================================================
  // ============================================================
  // Deeper Pillar Insights — emotional guidance, lucky timing,
  // expanded career/love/money/health insights
  // ============================================================
  try {
    const { getDeeperInsight } = await import('./deeperInsights');
    const pillars: Array<'career' | 'love' | 'money' | 'health'> = ['career', 'love', 'money', 'health'];
    const pillarTitles: Record<string, string> = {
      career: 'Career — Deeper Layer',
      love:   'Love — Deeper Layer',
      money:  'Money — Deeper Layer',
      health: 'Health — Deeper Layer',
    };
    addNewPage();
    addSectionTitle('Deeper Pillar Insights', '#');
    addParagraph('Emotional guidance, lucky timing, and expanded insights woven from your numbers. Each pillar (career, love, money, health) is explored on its own page for clarity.');

    pillars.forEach((p, idx) => {
      const insight = getDeeperInsight(p, vedicProfile.mulank, vedicProfile.bhagyank, profile.personalYear, 'en');
      // Start each pillar on its own page (after the first, which follows the intro)
      if (idx > 0 || y > pageHeight / 2) {
        addNewPage();
      }
      addSubsectionTitle(pillarTitles[p]);

      // Emotional guidance — grouped info boxes
      addInfoBox('Core Emotion', insight.emotional.coreEmotion);
      addInfoBox('Shadow Feeling', insight.emotional.shadowFeeling);
      addInfoBox('What to Release', insight.emotional.release);
      addInfoBox('Healing Affirmation', `"${insight.emotional.affirmation}"`, colors.goldLight);
      addInfoBox('Practice This Week', insight.emotional.practice);

      // Lucky timing — keep section heading with first bullets
      addNewPageIfNeeded(70);
      addSubsectionTitle('Lucky Timing & Energies');
      addBulletPoint(`Lucky weekdays: ${insight.timing.luckyDays.join(', ')}`);
      addBulletPoint(`Lucky dates: ${insight.timing.luckyDates.join(', ')}`);
      addBulletPoint(`Peak hours: ${insight.timing.peakHours}`);
      addBulletPoint(`Lucky months this year: ${insight.timing.luckyMonths.join(', ') || '—'}`);
      addBulletPoint(`Lucky colors: ${insight.timing.luckyColors.join(', ')}`);
      addBulletPoint(`Gemstone: ${insight.timing.luckyGemstone}`);
      addBulletPoint(`Direction: ${insight.timing.luckyDirection}`);
      addBulletPoint(`Dates to slow down: ${insight.timing.avoidDates.join(', ')}`);
      y += 4;

      // Expanded insights
      addNewPageIfNeeded(60);
      addSubsectionTitle('Expanded Insights');
      insight.expanded.forEach((line, i) => addNumberedPoint(i + 1, line));
      y += 4;

      // Closing boxes
      addNewPageIfNeeded(45);
      addInfoBox('Daily Micro-Ritual', insight.microRitual);
      addInfoBox('Gentle Caution', insight.warning, colors.lightBg);
      y += 6;
    });
  } catch (e) {
    addParagraph('Deeper insights could not be generated for this profile.');
  }

  // Calculations Section — "Kaise Nikla?" full transparency
  // ============================================================
  addNewPage();
  addSectionTitle('All Calculations — How Were They Derived?', '#');
  addParagraph('Transparency matters in numerology. Below is the complete step-by-step derivation for every core number in this report.');

  try {
    const d = new Date(formData.dateOfBirth);
    const dobStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const proofs = generateAllProofs(dobStr, formData.fullBirthName);

    proofs.forEach((proof) => {
      addNewPageIfNeeded(60);
      addSubsectionTitle(`${proof.numberName}: ${proof.finalValue}`);
      proof.steps.forEach((step) => {
        addBulletPoint(`Step ${step.step}: ${step.description.en}`);
        addParagraph(`   ${step.calculation} = ${step.result}`, 5);
      });
      addParagraph(`Why this number: ${proof.whyThisNumber.en}`);
      addParagraph(`Spiritual significance: ${proof.spiritualSignificance.en}`);
      y += 4;
    });
  } catch (e) {
    addParagraph('Calculation proofs could not be generated for this profile.');
  }

  // ==========================================
  // SUMMARY & NEXT STEPS
  // ==========================================
  addNewPage();
  addSectionTitle('SUMMARY & NEXT STEPS', '🎯');
  
  addSubsectionTitle('Your Numerological Matrix at a Glance');
  
  const summaryRow = (label: string, value: string | number, vibration: string) => {
    addNewPageIfNeeded(12);
    doc.setFillColor(...colors.lightBg);
    doc.roundedRect(margin, y - 4, contentWidth, 10, 1.5, 1.5, 'F');
    
    doc.setTextColor(...colors.royal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(label, margin + 5, y + 2.5);
    
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), margin + 65, y + 2.5);
    
    doc.setTextColor(...colors.textMuted);
    doc.setFontSize(9);
    doc.text(vibration, margin + 95, y + 2.5);
    
    y += 12;
  };

  summaryRow('Mulank (Birth Number)', vedicProfile.mulank, vedicProfile.mulankMeaning.title);
  summaryRow('Bhagyank (Destiny Number)', vedicProfile.bhagyank, vedicProfile.bhagyankMeaning.title);
  summaryRow('Life Path Number', profile.lifePath, lifePathMeaning.title);
  summaryRow('Soul Urge Number', profile.soulUrge, 'Deep Heart Desire');
  summaryRow('Personality Number', profile.personality, 'Outer Impression');
  summaryRow('Personal Year Theme', profile.personalYear, `Vibration of ${new Date().getFullYear()}`);

  y += 6;

  addSubsectionTitle('Immediate Actions & Integration');
  addBulletPoint('Review your 30-Day action plan weekly to track focus.');
  addBulletPoint('Keep your daily affirmation list visible and repeat them in the morning.');
  addBulletPoint('Leverage your lucky attributes (colors, days, and directions) for major initiatives.');
  addBulletPoint('Use the remedies suggested for planetary energy balance to maintain alignment.');

  // Closing Page
  addNewPage();
  
  if (mode === 'visual') {
    doc.setFillColor(...colors.darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  }
  
  y = 60;
  doc.setTextColor(...(mode === 'visual' ? colors.gold : colors.royal));
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CLOSING BLESSING', pageWidth / 2, y, { align: 'center' });
  
  y += 30;
  doc.setTextColor(...(mode === 'visual' ? colors.white : colors.text));
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  
  const closingMessage = `Dear ${formData.currentName || formData.fullBirthName},

You are evolving. Life isn't punishing you; it is shaping you into who you are meant to become.

Your numbers reveal a soul on a beautiful journey of awakening. The challenges you face are not obstacles but doorways to greater wisdom and power.

Your Life Path ${profile.lifePath} shows you are here to ${lifePathMeaning.title.toLowerCase()}. Your Mulank ${vedicProfile.mulank} and Bhagyank ${vedicProfile.bhagyank} work together (${vedicProfile.harmonyLevel} harmony) to guide you toward your highest destiny.

Trust the process. Trust yourself. Trust the universe.

You are entering a rising chapter. The best is yet to come.

With divine blessings,
Your Numerology Blueprint`;

  const closingLines = doc.splitTextToSize(closingMessage, contentWidth - 40);
  doc.text(closingLines, pageWidth / 2, y, { align: 'center' });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(...(mode === 'visual' ? colors.textMuted : colors.textMuted));
  doc.text('Divine Numerology Blueprint', pageWidth / 2, pageHeight - 40, { align: 'center' });
  doc.setFontSize(8);
  doc.text('www.divinenumerology.com', pageWidth / 2, pageHeight - 32, { align: 'center' });
  
  addPageNumber();

  // Save the PDF
  const fileName = `${formData.currentName.replace(/\s+/g, '_')}_Advanced_Numerology_Report_${mode}.pdf`;
  doc.save(fileName);
};
