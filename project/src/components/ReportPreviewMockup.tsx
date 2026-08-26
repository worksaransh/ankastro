import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Check, Info, Calendar, User, FileText } from 'lucide-react';
import { useBranding } from '@/hooks/useBranding';

interface ReportPreviewMockupProps {
  reportKey: string;
  language: string;
}

export const ReportPreviewMockup: React.FC<ReportPreviewMockupProps> = ({ reportKey, language }) => {
  const { data: b } = useBranding();
  const companyName = b?.company_name || 'AnkJyotish AI';
  const website = b?.website || 'ankjyotishai.com';
  const brandColor = b?.brand_color || '#1d0e3a';
  const accentColor = b?.accent_color || '#f0a500';

  // Content helper based on language
  const t = (en: string, hi: string, hinglish: string) => {
    if (language === 'hi') return hi;
    if (language === 'hinglish') return hinglish;
    return en;
  };

  const getReportTitle = () => {
    switch (reportKey) {
      case 'name_correction':
        return t('Name Correction & Destiny Report', 'नाम सुधार एवं भाग्य रिपोर्ट', 'Name Correction & Destiny Report');
      case 'mobile_numerology':
        return t('Mobile Number Numerology Report', 'मोबाइल नंबर न्यूमरोलॉजी रिपोर्ट', 'Mobile Number Numerology Report');
      case 'vehicle_numerology':
        return t('Vehicle Number & Safety Report', 'वाहन नंबर एवं सुरक्षा रिपोर्ट', 'Vehicle Number & Safety Report');
      case 'career_numerology':
        return t('Career Growth & Job Prediction', 'करियर ग्रोथ एवं नौकरी भविष्यवाणी', 'Career Growth & Job Prediction');
      case 'baby_name':
        return t('Lucky Baby Name Report', 'शुभ शिशु नाम रिपोर्ट', 'Lucky Baby Name Report');
      case 'compatibility_report':
        return t('Love & Relationship Compatibility', 'प्रेम और संबंध अनुकूलता रिपोर्ट', 'Love & Relationship Compatibility');
      case 'business_numerology':
        return t('Business Name & Brand Numerology', 'व्यवसाय नाम और ब्रांड न्यूमरोलॉजी', 'Business Name & Brand Numerology');
      case 'property_numerology':
        return t('Property & House Number Report', 'संपत्ति और घर का नंबर रिपोर्ट', 'Property & House Number Report');
      case 'marriage_report':
        return t('Marriage Timing & Matching Report', 'विवाह समय और मिलान रिपोर्ट', 'Marriage Timing & Matching Report');
      default:
        return t('Premium Numerology Analysis', 'प्रीमियम अंकशास्त्र विश्लेषण', 'Premium Numerology Analysis');
    }
  };

  const getReportSub = () => {
    switch (reportKey) {
      case 'name_correction':
        return t('Spelling vibration analysis & lucky spelling options', 'वर्तनी कंपन विश्लेषण और भाग्यशाली वर्तनी विकल्प', 'Spelling vibration analysis & lucky spelling options');
      case 'mobile_numerology':
        return t('Vibration analysis of current digits & lucky combinations', 'वर्तमान अंकों का कंपन विश्लेषण और शुभ संयोजन', 'Vibration analysis of current digits & lucky combinations');
      case 'vehicle_numerology':
        return t('Safety score, hazard indicators & lucky plate numbers', 'सुरक्षा स्कोर, खतरा संकेतक और शुभ प्लेट नंबर', 'Safety score, hazard indicators & lucky plate numbers');
      case 'career_numerology':
        return t('Destiny path, key timelines & favorable sectors', 'भाग्य पथ, महत्वपूर्ण समय-सीमा और अनुकूल क्षेत्र', 'Destiny path, key timelines & favorable sectors');
      case 'baby_name':
        return t('Vedic & Pythagorean name calculation for newborns', 'नवजात शिशुओं के लिए वैदिक और पाइथागोरस नाम गणना', 'Vedic & Pythagorean name calculation for newborns');
      case 'compatibility_report':
        return t('Inter-personal grid matching & relationship harmony', 'आपसी ग्रिड मिलान और संबंध सामंजस्य', 'Inter-personal grid matching & relationship harmony');
      case 'business_numerology':
        return t('Lucky names for brands, logos & commercial entities', 'ब्रांड, लोगो और व्यावसायिक संस्थाओं के लिए शुभ नाम', 'Lucky names for brands, logos & commercial entities');
      case 'property_numerology':
        return t('House number vibes, energy alignment & address remedies', 'घर के नंबर के वाइब्स, ऊर्जा संरेखण और पता उपचार', 'House number vibes, energy alignment & address remedies');
      case 'marriage_report':
        return t('Marriage suitability calculation & timing windows', 'विवाह उपयुक्तता गणना और अनुकूल समय अवधि', 'Marriage suitability calculation & timing windows');
      default:
        return t('Vedic & Pythagorean Numerology report details', 'वैदिक और पाइथागोरस अंकशास्त्र रिपोर्ट विवरण', 'Vedic & Pythagorean Numerology report details');
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        
        {/* PAGE 1: COVER PAGE */}
        <Card className="bg-[#fcfbfe] text-slate-800 border-slate-200/60 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[1/1.41] rounded-2xl glow-ring-gold">
          {/* Header Band */}
          <div className="h-10 px-4 flex items-center justify-between text-white" style={{ backgroundColor: brandColor }}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-xs font-bold tracking-wide">{companyName}</span>
            </div>
            <span className="text-[10px] opacity-90">{website}</span>
          </div>

          {/* Cover Body */}
          <div className="flex-1 p-5 flex flex-col justify-between items-center text-center">
            {/* Elegant Border Details */}
            <div className="w-full h-full border border-slate-200/50 p-4 rounded-xl flex flex-col justify-between relative">
              <div className="absolute top-2 left-2 text-gold font-serif text-lg">✦</div>
              <div className="absolute top-2 right-2 text-gold font-serif text-lg">✦</div>
              <div className="absolute bottom-2 left-2 text-gold font-serif text-lg">✦</div>
              <div className="absolute bottom-2 right-2 text-gold font-serif text-lg">✦</div>

              {/* Title Block */}
              <div className="mt-8 space-y-3">
                <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
                  {t('PERSONALIZED VEDIC REPORT', 'व्यक्तिगत वैदिक रिपोर्ट', 'PERSONALIZED VEDIC REPORT')}
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">
                  {getReportTitle()}
                </h3>
                <p className="text-[11px] text-slate-500 max-w-[180px] mx-auto italic mt-1">
                  {getReportSub()}
                </p>
              </div>

              {/* Prepared Exclusively For */}
              <div className="my-6 border-y border-slate-100 py-3 space-y-1">
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  {t('PREPARED EXCLUSIVELY FOR', 'विशेष रूप से तैयार', 'PREPARED EXCLUSIVELY FOR')}
                </p>
                <p className="font-display text-sm font-bold text-slate-800">
                  {t('Priya Sharma', 'प्रिया शर्मा', 'Priya Sharma')}
                </p>
                <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 mt-1">
                  <span>DOB: 12-04-1994</span>
                  <span>•</span>
                  <span>Time: 14:30</span>
                </div>
              </div>

              {/* Cover Footer */}
              <div className="mb-4 space-y-2">
                {/* Core values strip */}
                <div className="flex justify-center gap-3 bg-slate-50 border border-slate-100 p-1.5 rounded-lg">
                  <div className="text-center px-2">
                    <p className="text-[8px] text-slate-400 font-bold uppercase leading-none">Mulank</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5" style={{ color: brandColor }}>3</p>
                  </div>
                  <div className="text-center px-2 border-x border-slate-200">
                    <p className="text-[8px] text-slate-400 font-bold uppercase leading-none">Bhagyank</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5" style={{ color: brandColor }}>5</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[8px] text-slate-400 font-bold uppercase leading-none">Naamank</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5" style={{ color: brandColor }}>1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Band */}
          <div className="h-6 px-4 flex items-center justify-between text-[8px] border-t border-slate-100 bg-slate-50 text-slate-400">
            <span>{t('CONFIDENTIAL & PERSONAL', 'गोपनीय एवं व्यक्तिगत', 'CONFIDENTIAL & PERSONAL')}</span>
            <span>Page 1</span>
          </div>
        </Card>

        {/* PAGE 2: DETAILED ANALYSIS & SUGGESTIONS */}
        <Card className="bg-[#fcfbfe] text-slate-800 border-slate-200/60 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[1/1.41] rounded-2xl">
          {/* Header Band */}
          <div className="h-10 px-4 flex items-center justify-between text-white" style={{ backgroundColor: brandColor }}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-xs font-bold tracking-wide">{companyName}</span>
            </div>
            <span className="text-[10px] opacity-90">{website}</span>
          </div>

          {/* Report calculations mockup based on type */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                  {t('SECTION II: CORE COMPUTATIONS', 'भाग २: मुख्य गणनाएँ', 'SECTION II: CORE COMPUTATIONS')}
                </span>
              </div>

              {/* Specific Content per Report Key */}
              {reportKey === 'name_correction' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {t('Spelling Suggestions & Destiny Match Grid:', 'वर्तनी सुझाव और भाग्य मिलान ग्रिड:', 'Spelling Suggestions & Destiny Match Grid:')}
                  </p>
                  
                  {/* Spelling Table Mockup */}
                  <div className="border border-slate-100 rounded-lg overflow-hidden text-[10px]">
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100 p-2 font-semibold text-slate-600">
                      <span>{t('Spelling', 'वर्तनी', 'Spelling')}</span>
                      <span className="text-center">Root</span>
                      <span className="text-right">Match %</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 border-b border-slate-50 text-slate-500">
                      <span className="line-through">PRIYA SHARMA</span>
                      <span className="text-center">4</span>
                      <span className="text-right text-rose-500 font-bold">42% (Unfavorable)</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 border-b border-slate-50 text-slate-800 font-semibold bg-emerald-50/35">
                      <span>PRIIYA SHARMA</span>
                      <span className="text-center">5</span>
                      <span className="text-right text-emerald-600 font-bold">96% (Excellent)</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 text-slate-800 bg-emerald-50/10">
                      <span>PRIYAA SHARMA</span>
                      <span className="text-center">6</span>
                      <span className="text-right text-emerald-500 font-bold">88% (Favorable)</span>
                    </div>
                  </div>
                </div>
              )}

              {reportKey === 'mobile_numerology' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {t('Mobile Number Root Vibrations:', 'मोबाइल नंबर रूट कंपन:', 'Mobile Number Root Vibrations:')}
                  </p>
                  
                  <div className="border border-slate-100 rounded-lg overflow-hidden text-[10px]">
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100 p-2 font-semibold text-slate-600">
                      <span>{t('Phone Number', 'फ़ोन नंबर', 'Phone Number')}</span>
                      <span className="text-center">Root</span>
                      <span className="text-right">Verdict</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 border-b border-slate-50 text-slate-500">
                      <span>9876543210</span>
                      <span className="text-center">8</span>
                      <span className="text-right text-rose-500 font-bold">Draining</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 text-slate-800 font-semibold bg-emerald-50/35">
                      <span>9876543257</span>
                      <span className="text-center">1</span>
                      <span className="text-right text-emerald-600 font-bold">Highly Lucky</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback for other report types */}
              {reportKey !== 'name_correction' && reportKey !== 'mobile_numerology' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {t('Vibration Harmonization Grid:', 'कंपन सामंजस्य ग्रिड:', 'Vibration Harmonization Grid:')}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                      <p className="text-slate-400 font-bold uppercase leading-none">Vibe Compatibility</p>
                      <p className="text-slate-700 font-semibold">92% Match</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                      <p className="text-slate-400 font-bold uppercase leading-none">Chakra Alignment</p>
                      <p className="text-slate-700 font-semibold">Anahata (Heart)</p>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1 col-span-2">
                      <p className="text-slate-400 font-bold uppercase leading-none">Auspicious Root Number</p>
                      <p className="text-slate-700 font-semibold">Combination 3, 5, 9</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanatory description block */}
              <div className="space-y-2 mt-4">
                <div className="flex gap-1.5 items-start text-[10px] text-slate-500 leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <p>
                    {t('Spelling is aligned with your driver/conductor destiny parameters.', 'स्पेलिंग आपके ड्राइवर/कंडक्टर भाग्य मापदंडों के साथ संरेखित है।', 'Spelling is aligned with your driver/conductor destiny parameters.')}
                  </p>
                </div>
                <div className="flex gap-1.5 items-start text-[10px] text-slate-500 leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <p>
                    {t('Resolves structural delays and aligns career progress timelines.', 'संरचनात्मक देरी को हल करता है और करियर प्रगति की समय-सीमा को संरेखित करता है।', 'Resolves structural delays and aligns career progress timelines.')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100/50 rounded-lg p-2 text-[9px] text-slate-400 mt-4 leading-relaxed">
              <Info className="w-3.5 h-3.5 inline mr-1 text-slate-400 shrink-0" />
              {t('Spelling updates do not require legal name change. Simply start signing or using social profiles.', 'वर्तनी परिवर्तन के लिए कानूनी नाम बदलने की आवश्यकता नहीं है। बस हस्ताक्षर करना या सोशल मीडिया पर उपयोग करना शुरू करें।', 'Spelling updates do not require legal name change. Simply start signing or using social profiles.')}
            </div>
          </div>

          {/* Footer Band */}
          <div className="h-6 px-4 flex items-center justify-between text-[8px] border-t border-slate-100 bg-slate-50 text-slate-400">
            <span>{t('CONFIDENTIAL & PERSONAL', 'गोपनीय एवं व्यक्तिगत', 'CONFIDENTIAL & PERSONAL')}</span>
            <span>Page 2</span>
          </div>
        </Card>

        {/* PAGE 3: REMEDIES & LUCKY ATTRIBUTES */}
        <Card className="bg-[#fcfbfe] text-slate-800 border-slate-200/60 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-[1/1.41] rounded-2xl">
          {/* Header Band */}
          <div className="h-10 px-4 flex items-center justify-between text-white" style={{ backgroundColor: brandColor }}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-xs font-bold tracking-wide">{companyName}</span>
            </div>
            <span className="text-[10px] opacity-90">{website}</span>
          </div>

          {/* Core remedies parameters mockup */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                  {t('SECTION III: REMEDIES & ATTRIBUTES', 'भाग ३: उपाय और शुभ गुण', 'SECTION III: REMEDIES & ATTRIBUTES')}
                </span>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-2 text-[10px] mt-2">
                <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg space-y-0.5">
                  <p className="text-[8px] text-slate-400 font-bold uppercase leading-none">{t('Lucky Day', 'शुभ दिन', 'Lucky Day')}</p>
                  <p className="text-slate-800 font-bold">{t('Wednesday, Friday', 'बुधवार, शुक्रवार', 'Wednesday, Friday')}</p>
                </div>
                <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg space-y-0.5">
                  <p className="text-[8px] text-slate-400 font-bold uppercase leading-none">{t('Lucky Colors', 'शुभ रंग', 'Lucky Colors')}</p>
                  <p className="text-slate-800 font-bold">{t('Light Purple, Gold', 'हल्का बैंगनी, सुनहरा', 'Light Purple, Gold')}</p>
                </div>
                <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg space-y-0.5">
                  <p className="text-[8px] text-slate-400 font-bold uppercase leading-none">{t('Lucky Gemstone', 'शुभ रत्न', 'Lucky Gemstone')}</p>
                  <p className="text-slate-800 font-bold">{t('Emerald (Panna)', 'पन्ना', 'Emerald (Panna)')}</p>
                </div>
                <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg space-y-0.5">
                  <p className="text-[8px] text-slate-400 font-bold uppercase leading-none">{t('Lucky Directions', 'शुभ दिशा', 'Lucky Directions')}</p>
                  <p className="text-slate-800 font-bold">{t('North-East', 'उत्तर-पूर्व', 'North-East')}</p>
                </div>
              </div>

              {/* Custom remedies details */}
              <div className="space-y-3 mt-4">
                <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                  {t('Vedic Remedies & Daily Actions:', 'वैदिक उपाय और दैनिक क्रियाएं:', 'Vedic Remedies & Daily Actions:')}
                </p>
                <div className="border border-slate-100 p-3 bg-[#fdfcff] rounded-lg text-[10px] space-y-2 text-slate-600 border-l-2" style={{ borderLeftColor: accentColor }}>
                  <p className="font-semibold text-slate-800">1. {t('Mercury Mantras', 'बुध मंत्र', 'Mercury Mantras')}</p>
                  <p>{t('Chant "Om Bum Budhaya Namah" 108 times on Wednesday mornings facing North.', 'बुधवार की सुबह उत्तर दिशा की ओर मुख करके 108 बार "ओम बुं बुधाय नमः" का जाप करें।', 'Chant "Om Bum Budhaya Namah" 108 times on Wednesday mornings facing North.')}</p>
                  <p className="font-semibold text-slate-800 pt-1">2. {t('Signature Tuning', 'हस्ताक्षर सुधार', 'Signature Tuning')}</p>
                  <p>{t('Use your newly suggestions for signature. Make sure signature slopes upwards at 15 degrees.', 'हस्ताक्षर के लिए अपने नए सुझावों का उपयोग करें। सुनिश्चित करें कि हस्ताक्षर 15 डिग्री ऊपर की ओर झुका हो।', 'Use your newly suggestions for signature. Make sure signature slopes upwards at 15 degrees.')}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[8px] text-slate-400 text-center">
              {t('AnkJyotish AI Certified Report - Powered by Vedic Analytics', 'अंकज्योतिष एआई प्रमाणित रिपोर्ट - वैदिक एनालिटिक्स द्वारा संचालित', 'AnkJyotish AI Certified Report - Powered by Vedic Analytics')}
            </div>
          </div>

          {/* Footer Band */}
          <div className="h-6 px-4 flex items-center justify-between text-[8px] border-t border-slate-100 bg-slate-50 text-slate-400">
            <span>{t('CONFIDENTIAL & PERSONAL', 'गोपनीय एवं व्यक्तिगत', 'CONFIDENTIAL & PERSONAL')}</span>
            <span>Page 3</span>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ReportPreviewMockup;
