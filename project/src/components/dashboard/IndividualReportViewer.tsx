import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, CheckCircle2, AlertCircle, Heart, Briefcase, Calendar, Check, Lock, Smartphone, Building2, Car, Home, Phone
} from 'lucide-react';
import { type ReportKey } from '@/lib/whiteLabelPdf';
import { type NumerologyProfile, calculateCompatibility, reduceToSingleDigit, calculateLifePath } from '@/lib/numerology';
import { correctName } from '@/lib/nameCorrection';
import { analyzeVehicle, analyzeHouse } from '@/lib/vehicleHouseVibration';
import { calculateBusinessVibration, suggestBrandTweaks } from '@/lib/businessNameVibration';
import { supabase } from '@/integrations/supabase/client';
import { generatePersonalizedReport, type PersonalizedReportPackage } from '@/lib/personalizedReportEngine';
import { LoShuGridVisual } from './LoShuGridVisual';
import { GemstonePrescriptionCard } from './GemstonePrescriptionCard';
import { VibrationalCycleGauge } from './VibrationalCycleGauge';



const getMulankFromDob = (dob) => {
  if (!dob) return 1;
  const clean = dob.replace(/[-\/]/g, '/');
  const parts = clean.split('/');
  let day = 1;
  if (parts[0] && parts[0].length === 4) {
    day = Number(parts[2]);
  } else {
    day = Number(parts[0]);
  }
  if (day === 11 || day === 22) return day;
  const sumDigits = (n) => String(n).split('').reduce((acc, char) => acc + (Number(char) || 0), 0);
  const reduce = (n) => (n <= 9 ? n : reduce(sumDigits(n)));
  return reduce(day);
};

interface IndividualReportViewerProps {
  reportKey: ReportKey;
  formData: any;
  profile: NumerologyProfile;
  language: 'en' | 'hi' | 'hinglish';
}

const viewerTranslations = {
  en: {
    back: 'Back to Dashboard',
    downloadPdf: 'Download PDF Report',
    downloadOffline: 'Download Offline PDF Copy',
    savePdfDesc: 'Save the calculated report as a PDF to your device.',
    currentNameVibe: 'Current Name Vibration Analysis',
    vibrationRoot: 'Vibration Root',
    status: 'Status',
    compatible: 'Compatible ✓',
    correctionNeeded: 'Correction Needed',
    recommendedSpelling: 'Recommended Spelling Variations',
    match: 'Match',
    rootNumber: 'Root Number',
    sigGuidelines: 'Signature Guidelines',
    sigSlopeTitle: '15°-30° Slope:',
    sigSlopeDesc: 'Always sign with a slight upward slope. This enhances energy of success and growth.',
    sigUnderlineTitle: 'No Backward Lines:',
    sigUnderlineDesc: 'Avoid ending your signature with a dot or drawing a line backwards underneath, as it blocks progress.',
    sigSizeTitle: 'Large Initial:',
    sigSizeDesc: 'Keep the first letter of your name large and clear. This represents high self-confidence.',
    numberRoot: 'Your Number Root',
    compatVerdict: 'Compatibility Verdict',
    bestRoots: 'Best Roots For You',
    mobileVibeTitle: 'Mobile Vibration Analysis',
    mobileFriendlyDesc: 'Your mobile number is perfectly compatible with your driver energy. It will positively support your career, relationships, and financial growth.',
    mobileUnfriendlyDesc: 'Your mobile number reduces to root {root}, which is not fully friendly with your Mulank ({lifePath}). When choosing a new number, aim for a sum that reduces to {friendlyRoots}.',
    careerMoneyImpact: 'Career & Money Impact Profile',
    plateSumRoot: 'Plate Sum Root',
    safetyScore: 'Safety Score',
    luckFactor: 'Luck Factor',
    matchStatus: 'Match Status',
    vehicleVibeTitle: 'Vehicle Energy Analysis',
    shubhNumbers: 'Auspicious numbers for Mulank {lifePath}: {roots} (plate sum should reduce to these).',
    vehicleRemedies: 'Recommended Energy Balancing Remedies',
    vehicleIdol: 'Place a small idol or symbol of Lord Ganesha or your deity on the dashboard for protection.',
    vehicleCamphor: 'Keep a small piece of natural camphor in the glovebox to clear negative vibrations.',
    vehicleCovers: 'If the number is unfavorable and reduces to 4 or 8, avoid dark black seat covers. Beige or blue is a better choice.',
    workingStyle: 'Your Professional Working Style (Mulank {lifePath})',
    careerChannels: 'Top Aligned Career Channels (Destiny {destiny})',
    careerPush: 'Your destiny path will guide you to operate in these business areas and sectors:',
    careerForecast: 'Yearly Career Energy Forecast',
    careerForecastActive: 'You are currently in the dynamic cycle of Personal Year {py}. This time is highly auspicious for business expansions, new job searches, and taking calculated risks. Act now!',
    careerForecastBuild: 'You are currently in the Personal Year {py} cycle. This is a time for building steady structure, developing skills, and keeping your strategy aligned. Next year will be better for job switching.',
    luckyBabyNameTitle: 'Lucky Baby Name Profile',
    babyDobDesc: 'Based on your baby\'s birth details, the driver/lucky root number {luckyRoot} is highly auspicious. Below is the list of matching names:',
    genderPref: 'Gender Preference',
    startingLetter: 'Starting letter',
    targetSum: 'Target Name sum',
    auspiciousNames: 'Auspicious Baby Names Suggested',
    loadingDbNames: 'Loading database names...',
    noNamesFound: 'No automatic matching baby names found for preferred letter \'{letter}\' and gender \'{gender}\'. The full list is available in the PDF copy.',
    romanticCompatBreakdown: 'Romantic Compatibility Breakdown',
    romanticCompatCalculated: 'Calculated between your Life Path {lifePath} and {partnerName}\'s Life Path {partnerLp}',
    strengthsMatch: 'Strengths of this Match',
    potentialChallenges: 'Potential Challenges',
    remediesHarmony: 'Remedies for Harmony',
    remediesHarmonyDesc: 'To strengthen relationship vibrations, use light yellow or pink decor in your home. Keep raw salt in a glass container on your bedroom counter to clear weekly dynamic disputes.',
    partnerDetailsMissing: 'Partner Details missing. Please start over and provide Partner Name & Partner DOB.',
    businessNameSum: 'Business Name sum',
    spellingQuality: 'Spelling Quality',
    bestRootsOwner: 'Best Roots For Owner',
    businessSpellingTweaks: 'Business Spelling Tweaks',
    ownerDriverAlign: 'Spelling adjustments aligned to your driver number {lifePath}:',
    houseNumberSum: 'House Number sum',
    vibeCategory: 'Vibe Category',
    matchScore: 'Match Score',
    propertyVibeTitle: 'Property Energy Description',
    propertyVibeDesc: 'Property root sum {root} represents structural growth, family bonding, and protection. {rahuSaturn} Positive solar/venusian energies highlight luck, commercial ideas, and creative focus.',
    rahuSaturnDesc: 'Rahu/Saturn vibrations are highly stable but require high maintenance and structured cleaning. Keep the entrance clear.',
    marriageTimingTitle: 'Marriage Timing timeline (5-Year Window)',
    marriageTimingDesc: 'Personal Year cycle forecast for marriage and union phases:',
    analyzedMobile: 'Analyzed Mobile Number',
    analyzedVehicle: 'Analyzed Vehicle Number',
    analyzedProperty: 'Analyzed Property/House Number',
    analyzedBusiness: 'Analyzed Business Name',
    currentName: 'Name Under Analysis',
    partnerNameLabel: 'Partner Name',
    partnerDobLabel: 'Partner DOB',
    ceremonyDates: 'Auspicious Upcoming Dates for Ceremony:',
    ceremonyDesc: 'Highly favorable alignment for the naming ceremony.',
  },
  hi: {
    back: 'डैशबोर्ड पर वापस जाएं',
    downloadPdf: 'PDF रिपोर्ट डाउनलोड करें',
    downloadOffline: 'ऑफ़लाइन PDF प्रति डाउनलोड करें',
    savePdfDesc: 'कैलकुलेट की गई रिपोर्ट को अपने डिवाइस पर PDF के रूप में सहेजें।',
    currentNameVibe: 'वर्तमान नाम कंपन विश्लेषण',
    vibrationRoot: 'कंपन मूल',
    status: 'स्थिति',
    compatible: 'अनुकूल ✓',
    correctionNeeded: 'सुधार की आवश्यकता',
    recommendedSpelling: 'अनुशंसित वर्तनी विकल्प',
    match: 'मेल',
    rootNumber: 'मूल संख्या',
    sigGuidelines: 'हस्ताक्षर दिशानिर्देश',
    sigSlopeTitle: '15°-30° ढलान:',
    sigSlopeDesc: 'अपने हस्ताक्षर को हमेशा थोड़े ऊपर की ओर (upward slope) करें। यह सफलता और विकास की ऊर्जा को बढ़ाता है।',
    sigUnderlineTitle: 'पीछे जाने वाली रेखाएं नहीं:',
    sigUnderlineDesc: 'हस्ताक्षर के नीचे पीछे जाने वाली रेखा न खींचें या अंत में बिंदु (.) न लगाएं, यह प्रगति को रोकता है।',
    sigSizeTitle: 'बड़ा पहला अक्षर:',
    sigSizeDesc: 'अपने नाम का पहला अक्षर बड़ा (capital) और स्पष्ट रखें। यह उच्च आत्मविश्वास को दर्शाता है।',
    numberRoot: 'आपका अंक मूल',
    compatVerdict: 'अनुकूलता का निर्णय',
    bestRoots: 'आपके लिए सर्वोत्तम अंक',
    mobileVibeTitle: 'मोबाइल कंपन विश्लेषण',
    mobileFriendlyDesc: 'आपका मोबाइल नंबर आपके ड्राइवर अंक के साथ पूरी तरह से अनुकूल है। यह आपके करियर, रिश्तों और वित्तीय विकास का समर्थन करेगा।',
    mobileUnfriendlyDesc: 'आपका मोबाइल नंबर मूल {root} के अंतर्गत आता है, जो आपके मूलांक ({lifePath}) के साथ पूरी तरह से अनुकूल नहीं है। नया नंबर लेते समय प्रयास करें कि कुल अंकों का योग {friendlyRoots} पर आए।',
    careerMoneyImpact: 'करियर और धन प्रभाव प्रोफ़ाइल',
    plateSumRoot: 'प्लेट योग मूल',
    safetyScore: 'सुरक्षा स्कोर',
    luckFactor: 'भाग्य कारक',
    matchStatus: 'मेल स्थिति',
    vehicleVibeTitle: 'वाहन ऊर्जा विश्लेषण',
    shubhNumbers: 'मूलांक {lifePath} के लिए शुभ अंक: {roots} (प्लेट का कुल योग इन अंकों पर होना चाहिए)।',
    vehicleRemedies: 'ऊर्जा संतुलन के लिए अनुशंसित उपाय',
    vehicleIdol: 'ऊर्जा की रक्षा के लिए डैशबोर्ड पर भगवान गणेश या अपने आराध्य देव की एक छोटी मूर्ति या प्रतीक स्थापित करें।',
    vehicleCamphor: 'नकारात्मक ऊर्जा को दूर करने के लिए ग्लोवबॉक्स या डैशबोर्ड में प्राकृतिक कपूर का एक छोटा टुकड़ा रखें।',
    vehicleCovers: 'यदि वाहन का कुल योग प्रतिकूल (4 या 8) है, तो काले सीट कवर से बचें। क्रीम या नीला रंग बेहतर है।',
    workingStyle: 'आपकी व्यावसायिक कार्यशैली (मूलांक {lifePath})',
    careerChannels: 'शीर्ष संरेखित करियर क्षेत्र (भाग्यांक {destiny})',
    careerPush: 'आपकी नियति आपको इन व्यावसायिक क्षेत्रों और सेक्टर्स में काम करने के लिए प्रेरित करेगी:',
    careerForecast: 'वार्षिक करियर ऊर्जा पूर्वानुमान',
    careerForecastActive: 'आप वर्तमान में व्यक्तिगत वर्ष {py} के गतिशील चक्र में हैं। यह समय व्यापार विस्तार, नई नौकरी की तलाश और जोखिम लेने के लिए बहुत शुभ है। तुरंत कार्य करें!',
    careerForecastBuild: 'आप वर्तमान में व्यक्तिगत वर्ष {py} चक्र में हैं। यह समय स्थिर संरचना बनाने, कौशल विकसित करने और अपनी रणनीति को संरेखित रखने का है। नौकरी बदलने के लिए अगला साल बेहतर रहेगा।',
    luckyBabyNameTitle: 'शुभ शिशु नाम प्रोफ़ाइल',
    babyDobDesc: 'आपके शिशु के जन्म विवरण के आधार पर, शिशु के लिए भाग्यशाली मूल अंक {luckyRoot} शुभ है। मिलान करने वाले नामों की सूची नीचे दी गई है:',
    genderPref: 'लिंग प्राथमिकता',
    startingLetter: 'पहला अक्षर',
    targetSum: 'लक्षित नाम योग',
    auspiciousNames: 'सुझाए गए शुभ शिशु नाम',
    loadingDbNames: 'डेटाबेस से नाम लोड हो रहे हैं...',
    noNamesFound: 'पसंदीदा अक्षर \'{letter}\' और लिंग \'{gender}\' के लिए कोई स्वचालित शिशु नाम नहीं मिले। पूरी सूची PDF प्रति में उपलब्ध है।',
    romanticCompatBreakdown: 'रोमांटिक अनुकूलता विश्लेषण',
    romanticCompatCalculated: 'आपके मूलांक {lifePath} और {partnerName} के मूलांक {partnerLp} के बीच गणना की गई',
    strengthsMatch: 'इस मेल की ताकतें',
    potentialChallenges: 'संभावित चुनौतियाँ',
    remediesHarmony: 'सामंजस्य के लिए उपाय',
    remediesHarmonyDesc: 'रिश्ते के स्पंदन को मजबूत करने के लिए अपने घर में हल्के पीले या गुलाबी रंग का उपयोग करें। बेडरूम में कांच के बर्तन में खड़ा नमक रखें, इससे साप्ताहिक विवाद दूर होते हैं।',
    partnerDetailsMissing: 'साझेदार का विवरण अनुपलब्ध है। कृपया पुन: प्रयास करें और साझेदार का नाम और जन्म तिथि प्रदान करें।',
    businessNameSum: 'व्यवसाय नाम योग',
    spellingQuality: 'वर्तनी की गुणवत्ता',
    bestRootsOwner: 'मालिक के लिए सर्वोत्तम अंक',
    businessSpellingTweaks: 'व्यवसायिक वर्तनी सुधार',
    ownerDriverAlign: 'आपके ड्राइवर अंक {lifePath} के साथ संरेखित वर्तनी सुधार:',
    houseNumberSum: 'घर का कुल अंक',
    vibeCategory: 'ऊर्जा श्रेणी',
    matchScore: 'मेल स्कोर',
    propertyVibeTitle: 'संपत्ति ऊर्जा विवरण',
    propertyVibeDesc: 'संपत्ति का मूल योग {root} संरचनात्मक विकास, पारिवारिक बंधन और सुरक्षा का प्रतिनिधित्व करता है। {rahuSaturn} सकारात्मक सौर/शुक्र ऊर्जा भाग्य, व्यावसायिक विचारों और रचनात्मकता को दर्शाती है।',
    rahuSaturnDesc: 'राहु/शनि के स्पंदन अत्यधिक स्थिर होते हैं लेकिन इसमें नियमित सफाई और रखरखाव की आवश्यकता होती है। मुख्य प्रवेश द्वार को साफ रखें।',
    marriageTimingTitle: 'विवाह मुहूर्त समयरेखा (5 वर्ष का विंडो)',
    marriageTimingDesc: 'विवाह और गठबंधन के चरणों के लिए व्यक्तिगत वर्ष चक्र का पूर्वानुमान:',
    analyzedMobile: 'विश्लेषण किया गया मोबाइल नंबर',
    analyzedVehicle: 'विश्लेषण किया गया वाहन नंबर',
    analyzedProperty: 'विश्लेषण किया गया संपत्ति/घर नंबर',
    analyzedBusiness: 'विश्लेषण किया गया व्यवसाय का नाम',
    currentName: 'विश्लेषण के तहत नाम',
    partnerNameLabel: 'साथी का नाम',
    partnerDobLabel: 'साथी की जन्म तिथि',
    ceremonyDates: 'नामकरण संस्कार के लिए शुभ आगामी तिथियां:',
    ceremonyDesc: 'नामकरण संस्कार के लिए अत्यधिक अनुकूल संरेखण।',
  },
  hinglish: {
    back: 'Dashboard par wapas jayein',
    downloadPdf: 'PDF Report Download Karein',
    downloadOffline: 'Offline PDF copy download karein',
    savePdfDesc: 'Calculated report ko apne device par PDF format me save karein.',
    currentNameVibe: 'Current Name Vibration Analysis',
    vibrationRoot: 'Vibration Root',
    status: 'Status',
    compatible: 'Compatible ✓',
    correctionNeeded: 'Correction Needed',
    recommendedSpelling: 'Recommended Spelling Variations',
    match: 'Match',
    rootNumber: 'Root Number',
    sigGuidelines: 'Signature Guidelines',
    sigSlopeTitle: '15°-30° Slope:',
    sigSlopeDesc: 'Apne signature ko humesha thoda upar ki taraf (upward slope) sign karein. Yeh success ki energy badhata hai.',
    sigUnderlineTitle: 'No Backward Lines:',
    sigUnderlineDesc: 'Signature ke niche piche jane wali line ya end me dot (.) na lagayein, yeh progress block karte hain.',
    sigSizeTitle: 'Large Initial:',
    sigSizeDesc: 'Naam ka pehla akshar bada (capital) aur clear rakhein. Yeh high self-confidence show karta.',
    numberRoot: 'Aapka Number Root',
    compatVerdict: 'Compatibility Verdict',
    bestRoots: 'Best Roots For You',
    mobileVibeTitle: 'Mobile Vibration Analysis',
    mobileFriendlyDesc: 'Aapka mobile number aapki driver energy ke sath perfectly compatible hai. Yeh aapke career, relationships aur financial growth ko support karega.',
    mobileUnfriendlyDesc: 'Aapka mobile number root {root} ke under aata hai, jo aapke Mulank ({lifePath}) ke sath fully friendly nahi hai. Naya number lete samay koshish karein ki sum root {friendlyRoots} me aaye.',
    careerMoneyImpact: 'Career & Money Impact Profile',
    plateSumRoot: 'Plate sum Root',
    safetyScore: 'Safety Score',
    luckFactor: 'Luck Factor',
    matchStatus: 'Match Status',
    vehicleVibeTitle: 'Vehicle Energy Analysis',
    shubhNumbers: 'Mulank {lifePath} ke liye shubh numbers: {roots} (plate sum inhi numbers par hona chahiye).',
    vehicleRemedies: 'Recommended Energy Balancing Remedies',
    vehicleIdol: 'Dashboard par ek choti Lord Ganesha ki murti ya symbol lagayein energy protect karne ke liye.',
    vehicleCamphor: 'Kapoor (natural camphor) ka ek chota tukda glovebox me rakhein negative vibrations hatane ke liye.',
    vehicleCovers: 'Agar number unfavourable hai aur root 4 ya 8 hai, toh dark black seat covers avoid karein. Beige ya blue choice behtar hai.',
    workingStyle: 'Your Professional Working Style (Mulank {lifePath})',
    careerChannels: 'Top Aligned Career Channels (Destiny {destiny})',
    careerPush: 'Aapka destiny path aapko in business areas aur sectors me work karne ke liye push karega:',
    careerForecast: 'Yearly Career Energy Forecast',
    careerForecastActive: 'Aap abhi Personal Year {py} ke dynamic cycle me hain. Yeh time business expansions, new job searches aur risks lene ke liye shubh hai. Decision lene me der na karein!',
    careerForecastBuild: 'Aap abhi Personal Year {py} cycle me hain. Yeh time patient structure banane, skills build karne aur strategy banaye rakhne ka hai. Agla saal job switch ke liye behtar rahega.',
    luckyBabyNameTitle: 'Lucky Baby Name Profile',
    babyDobDesc: 'Baby ki birth details ke hisab se, baby ke liye lucky root number {luckyRoot} shubh hai. Niche list fetch ki hai jo is root vibration ko match karti hai:',
    genderPref: 'Gender Preference',
    startingLetter: 'Starting letter',
    targetSum: 'Target Name sum',
    auspiciousNames: 'Auspicious Baby Names Suggested',
    loadingDbNames: 'Database names load ho rahe hain...',
    noNamesFound: 'Preferred letter \'{letter}\' aur gender \'{gender}\' ke sath koi automatic matching baby names nahi mile. General list PDF copy me available hai.',
    romanticCompatBreakdown: 'Romantic Compatibility Breakdown',
    romanticCompatCalculated: 'Aapke Life Path {lifePath} aur {partnerName} ke Life Path {partnerLp} ke beech calculate kiya gaya',
    strengthsMatch: 'Match ke Strengths',
    potentialChallenges: 'Potential Challenges',
    remediesHarmony: 'Remedies for Harmony',
    remediesHarmonyDesc: 'Relationship vibrations ko strengthen karne ke liye home boundaries me light yellow/pink items use karein. Bedroom me glass container me raw salt rakhein weekly disputes hatane ke liye.',
    partnerDetailsMissing: 'Partner Details missing. Please start over and provide Partner Name & Partner DOB.',
    businessNameSum: 'Business Name sum',
    spellingQuality: 'Spelling Quality',
    bestRootsOwner: 'Best Roots For Owner',
    businessSpellingTweaks: 'Business Spelling Tweaks',
    ownerDriverAlign: 'Owner ke driver number {lifePath} ke sath aligned spelling adjustments suggested hain:',
    houseNumberSum: 'House Number sum',
    vibeCategory: 'Vibe Category',
    matchScore: 'Match Score',
    propertyVibeTitle: 'Property Energy Description',
    propertyVibeDesc: 'Property root sum {root} structural growth, family bonding, and protection ko represent karta hai. {rahuSaturn} Positive solar/venusian energies luck, commercial ideas, and creative focus highlight karti hain.',
    rahuSaturnDesc: 'Rahu/Saturn vibrations highly stable hain par weekly cleaning aur structured maintenance chahiye. Entrance clear rakhein.',
    marriageTimingTitle: 'Marriage Timing timeline (5-Year Window)',
    marriageTimingDesc: 'Personal Year cycle forecast target for marriage and union phases:',
    analyzedMobile: 'Analyzed Mobile Number',
    analyzedVehicle: 'Analyzed Vehicle Number',
    analyzedProperty: 'Analyzed Property Number',
    analyzedBusiness: 'Analyzed Business Name',
    currentName: 'Analyzed Name',
    partnerNameLabel: 'Partner ka Name',
    partnerDobLabel: 'Partner ki DOB',
    ceremonyDates: 'Naming Ceremony ke liye auspicious dates:',
    ceremonyDesc: 'Naming ceremony ke liye highly favorable cosmic alignment.',
  }
};

const formatText = (text: string, params: Record<string, string | number>) => {
  let res = text;
  Object.entries(params).forEach(([key, value]) => {
    res = res.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  return res;
};

export const IndividualReportViewer: React.FC<IndividualReportViewerProps> = ({
  reportKey,
  formData,
  profile,
  language
}) => {
  const [babyNames, setBabyNames] = useState<any[]>([]);
  const [loadingNames, setLoadingNames] = useState(false);
  const [personalizedPackage, setPersonalizedPackage] = useState<PersonalizedReportPackage | null>(null);

  const lucky = profile.luckyAttributes;
  const who = formData.displayName || formData.fullBirthName || 'Seeker';
  const activeLang = language || 'en';
  const t = viewerTranslations[activeLang] || viewerTranslations.en;

  useEffect(() => {
    const loadPersonalized = async () => {
      const pkg = await generatePersonalizedReport({
        userId: (profile as any).user_id || (profile as any).id,
        reportKey,
        profile: {
          ...profile,
          dob: formData.dateOfBirth || (profile as any).dob || (profile as any).birthday?.toString(),
          name: who,
          profession: formData.profession || (profile as any).profession,
          life_stage: formData.lifeStage || (profile as any).life_stage,
          marital_status: formData.maritalStatus || (profile as any).marital_status,
          is_business_owner: formData.isBusinessOwner || (profile as any).is_business_owner,
        },
        language: activeLang,
      });
      setPersonalizedPackage(pkg);
    };
    loadPersonalized();
  }, [reportKey, formData, profile, activeLang]);

  // Fetch baby names if report is baby_name
  useEffect(() => {
    if (reportKey === 'baby_name') {
      const fetchNames = async () => {
        try {
          setLoadingNames(true);
          const babyGender = formData.babyGender || 'unisex';
          const preferredLetter = formData.preferredLetter || '';
          const babyDob = formData.dateOfBirth;
          
          let luckyRoot = 1;
          if (babyDob) {
            const parts = babyDob.split(/[-\/]/);
            const d = parts[0].length === 4 ? Number(parts[2]) : Number(parts[0]);
            const sumDigits = (n: number): number => String(n).split('').reduce((acc, char) => acc + (Number(char) || 0), 0);
            const reduce = (n: number): number => (n <= 9 ? n : reduce(sumDigits(n)));
            luckyRoot = reduce(sumDigits(d));
          } else {
            luckyRoot = profile.birthday || 1;
          }

          let q = supabase.from('baby_names').select('*').eq('name_root', luckyRoot);
          if (babyGender && babyGender !== 'any') {
            q = q.eq('gender', babyGender);
          }
          if (preferredLetter) {
            q = q.eq('first_letter', preferredLetter.toUpperCase());
          }
          const { data: names } = await q.limit(15);
          if (names) {
            setBabyNames(names);
          }
        } catch (err) {
          console.error('Error fetching baby names', err);
        } finally {
          setLoadingNames(false);
        }
      };
      fetchNames();
    }
  }, [reportKey, formData, profile]);

  const getReportContent = () => {
    switch (reportKey) {
      case 'name_correction':
      case 'name':
      case 'name-correction-report': {
        const res = correctName(formData.fullBirthName || who, profile.birthday);
        return (
          <div className="space-y-6">
            {/* Display Input under Analysis */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs text-gray-400 font-medium">{t.currentName}</p>
                <p className="text-xl font-bold text-white mt-0.5">{formData.fullBirthName || who}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                Driver Root: {profile.birthday}
              </Badge>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
                {t.currentNameVibe}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeLang === 'hi'
                  ? `आपके वर्तमान नाम "${formData.fullBirthName || who}" का अंकशास्त्र कंपन मूल ${res.originalRoot} है। ${
                      res.alreadyGood
                        ? "यह कंपन आपके मूलांक के साथ पूर्णतः संरेखित और अनुकूल है!"
                        : "यह कंपन आपके मूलांक के साथ पूर्णतः अनुकूल नहीं है। बेहतर अवसरों के लिए नीचे कुछ वर्तनी सुधार सुझाए गए हैं।"
                    }`
                  : activeLang === 'hinglish'
                  ? `Aapke current naam "${formData.fullBirthName || who}" ka Chaldean root number ${res.originalRoot} hai. ${
                      res.alreadyGood
                        ? "Yeh vibration aapke Driver/Life Path number ke saath fully aligned aur compatibility me hai!"
                        : "Yeh vibration aapke Life Path number ke saath 100% align nahi ho rahi hai. Kismat ko speed up karne ke liye minor spelling changes niche suggested hain."
                    }`
                  : `Your current name "${formData.fullBirthName || who}" has a Chaldean vibration root of ${res.originalRoot}. ${
                      res.alreadyGood
                        ? "This name is already fully compatible and aligned with your Driver/Life Path number!"
                        : "This vibration is not 100% compatible with your life path. We recommend minor spelling tweaks below to boost your luck."
                    }`}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className={res.alreadyGood ? "border-green-500/25 bg-green-500/5 text-green-400" : "border-amber-500/25 bg-amber-500/5 text-amber-400"}>
                  {t.vibrationRoot}: {res.originalRoot}
                </Badge>
                <Badge variant="outline" className={res.alreadyGood ? "border-green-500/25 bg-green-500/5 text-green-400" : "border-amber-500/25 bg-amber-500/5 text-amber-400"}>
                  {t.status}: {res.alreadyGood ? t.compatible : t.correctionNeeded}
                </Badge>
              </div>
            </div>

            {res.suggestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-300 tracking-wide uppercase">{t.recommendedSpelling}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {res.suggestions.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0f071f] border border-white/5 hover:border-primary/20 transition-all space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white tracking-wide">{s.spelling}</span>
                        <Badge className="bg-primary/20 text-primary border border-primary/25 text-[10px] font-bold">
                          {s.improvement}% {t.match}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-400">{t.rootNumber}: <b>{s.root}</b></p>
                      <p className="text-xs text-gray-300 leading-normal pt-1 border-t border-white/5">
                        {s.reason[activeLang] || s.reason.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.sigGuidelines}</h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><b>{t.sigSlopeTitle}</b> {t.sigSlopeDesc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><b>{t.sigUnderlineTitle}</b> {t.sigUnderlineDesc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><b>{t.sigSizeTitle}</b> {t.sigSizeDesc}</span>
                </li>
              </ul>
            </div>
          </div>
        );
      }
      case 'mobile_numerology':
      case 'mobile':
      case 'mobile-number-numerology': {
        const num = ((formData.mobileNumber || formData.whatsappNumber) || '').replace(/\D/g, '');
        const root = num ? reduceToSingleDigit(num.split('').reduce((a, d) => a + Number(d), 0), false) : profile.birthday;
        const friendly = lucky.numbers.map((n) => reduceToSingleDigit(n, false)).includes(root);

        const mobileRoots: Record<number, Record<string, string>> = {
          1: {
            en: 'Excellent for leadership, independent business owners, and corporate sales. It brings authority, public recognition, and career power.',
            hi: 'नेतृत्व, स्वतंत्र व्यापार मालिकों और कॉर्पोरेट बिक्री के लिए उत्कृष्ट। यह अधिकार, सार्वजनिक पहचान और करियर शक्ति लाता है।',
            hinglish: 'Excellent for leadership, independent business owners, aur corporate sales. It brings authority, public recognition, aur career power.'
          },
          2: {
            en: 'Very good for HR managers, creative professionals, mediators, and advisors. Promotes cooperative energy and deep intuition.',
            hi: 'एचआर प्रबंधकों, रचनात्मक पेशेवरों, मध्यस्थों और सलाहकारों के लिए बहुत अच्छा। सहकारी ऊर्जा और गहरे अंतर्ज्ञान को बढ़ावा देता है।',
            hinglish: 'Very good for HR managers, creative professionals, mediators, aur advisors. Cooperative energy aur deep intuition ko badhata hai.'
          },
          3: {
            en: 'Perfect for public speakers, consultants, teachers, and content creators. Expands communications and helps build social networks.',
            hi: 'सार्वजनिक वक्ताओं, सलाहकारों, शिक्षकों और सामग्री निर्माताओं के लिए बिल्कुल सही। संचार का विस्तार करता है और सामाजिक नेटवर्क बनाने में मदद करता है।',
            hinglish: 'Perfect for public speakers, consultants, teachers, aur content creators. Communication ko expand karta hai aur social networks build karne me madad karta hai.'
          },
          4: {
            en: 'Supports engineers, programmers, administrators, and builders. Steady energy but demands hard work and high consistency.',
            hi: 'इंजीनियरों, प्रोग्रामरों, प्रशासकों और बिल्डरों का समर्थन करता है। स्थिर ऊर्जा लेकिन कड़ी मेहनत और उच्च निरंतरता की मांग करती है।',
            hinglish: 'Engineers, programmers, administrators, aur builders ko support karta hai. Steady energy par hard work aur high consistency chahiye.'
          },
          5: {
            en: 'Highly lucky for business owners, traders, startups, and marketing directors. Brings dynamic energy and fast money flow.',
            hi: 'व्यापार मालिकों, व्यापारियों, स्टार्टअप और विपणन निदेशकों के लिए अत्यधिक भाग्यशाली। गतिशील ऊर्जा और तेज़ धन प्रवाह लाता है।',
            hinglish: 'Highly lucky for business owners, traders, startups, aur marketing directors. Dynamic energy aur fast money flow lata hai.'
          },
          6: {
            en: 'Best for luxury brands, design, wellness, and teaching. Brings peace of mind, strong relationships, and client trust.',
            hi: 'लक्जरी ब्रांडों, डिजाइन, कल्याण और शिक्षण के लिए सर्वश्रेष्ठ। मन की शांति, मजबूत रिश्ते और ग्राहक विश्वास लाता है।',
            hinglish: 'Best for luxury brands, design, wellness, aur teaching. Peace of mind, strong relationships, aur client trust lata hai.'
          },
          7: {
            en: 'Good for researchers, tech specialists, writers, and spiritual teachers. Deep reflective energy, less focused on pure commerce.',
            hi: 'शोधकर्ताओं, तकनीकी विशेषज्ञों, लेखकों और आध्यात्मिक शिक्षकों के लिए अच्छा है। गहरी चिंतनशील ऊर्जा, शुद्ध वाणिज्य पर कम केंद्रित।',
            hinglish: 'Good for researchers, tech specialists, writers, aur spiritual teachers. Deep reflective energy, commerce par thoda kam focus.'
          },
          8: {
            en: 'Extremely powerful for finance executives, real estate developers, and corporate leaders. High financial scaling potential.',
            hi: 'वित्त अधिकारियों, रियल एस्टेट डेवलपर्स और कॉर्पोरेट नेताओं के लिए अत्यंत शक्तिशाली। उच्च वित्तीय स्केलिंग क्षमता।',
            hinglish: 'Extremely powerful for finance executives, real estate developers, aur corporate leaders. High financial scaling potential.'
          },
          9: {
            en: 'Great for coaches, humanitarian leaders, and international expansion. Brings high courage and dynamic broad impact.',
            hi: 'कोच, मानवीय नेताओं और अंतर्राष्ट्रीय विस्तार के लिए बढ़िया। उच्च साहस और गतिशील व्यापक प्रभाव लाता है।',
            hinglish: 'Great for coaches, humanitarian leaders, aur international expansion. High courage aur dynamic broad impact lata hai.'
          },
        };

        const explanationParams = { root, lifePath: profile.birthday, friendlyRoots: lucky.numbers.map(n => reduceToSingleDigit(n, false)).join('/') };

        return (
          <div className="space-y-6">
            {/* Display Analyzed Number */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs text-gray-400 font-medium">{t.analyzedMobile}</p>
                <p className="text-xl font-bold text-white mt-0.5">{num || 'No Mobile Number Provided'}</p>
              </div>
              <Badge className={friendly ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}>
                {friendly ? t.compatible : t.correctionNeeded}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.vibrationRoot}</p>
                <p className="text-3xl font-display font-bold text-white mt-1">{root}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.compatVerdict}</p>
                <p className={`text-sm font-bold mt-2.5 ${friendly ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {friendly ? t.compatible : t.correctionNeeded}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.bestRoots}</p>
                <p className="text-sm font-bold text-white mt-2.5">
                  {lucky.numbers.map((n) => reduceToSingleDigit(n, false)).join(', ')}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.mobileVibeTitle}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {friendly 
                  ? t.mobileFriendlyDesc
                  : formatText(t.mobileUnfriendlyDesc, explanationParams)}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f071f] border border-white/5 space-y-3 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.careerMoneyImpact}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {mobileRoots[root]?.[activeLang] || mobileRoots[5]?.[activeLang]}
              </p>
            </div>
          </div>
        );
      }
      case 'vehicle_numerology':
      case 'vehicle':
      case 'vehicle-number-report': {
        const plate = (formData.vehicleNumber || '').toString();
        const va = analyzeVehicle(plate || 'NA', profile.birthday);
        return (
          <div className="space-y-6">
            {/* Display Analyzed Vehicle Number */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs text-gray-400 font-medium">{t.analyzedVehicle}</p>
                <p className="text-xl font-bold text-white mt-0.5">{plate || 'No Plate Provided'}</p>
              </div>
              <Badge className={va.vsMulank === 'friendly' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}>
                {va.vsMulank === 'friendly' ? t.compatible : t.correctionNeeded}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.plateSumRoot}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{va.root}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.safetyScore}</p>
                <p className="text-lg font-bold text-emerald-400 mt-2">{va.energy.safety}%</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.luckFactor}</p>
                <p className="text-lg font-bold text-amber-400 mt-2">{va.energy.luck}%</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.matchStatus}</p>
                <p className={`text-sm font-bold mt-2.5 ${va.vsMulank === 'friendly' ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {va.vsMulank === 'friendly' ? t.compatible : 'Neutral'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.vehicleVibeTitle}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {va.verdict[activeLang] || va.verdict.en}
              </p>
              <p className="text-xs text-amber-400 font-medium pt-1">
                💡 {formatText(t.shubhNumbers, { lifePath: profile.lifePath, roots: lucky.numbers.map((n) => reduceToSingleDigit(n, false)).join(', ') })}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.vehicleRemedies}</h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t.vehicleIdol}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t.vehicleCamphor}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t.vehicleCovers}</span>
                </li>
              </ul>
            </div>
          </div>
        );
      }
      case 'career_numerology':
      case 'career':
      case 'career_job':
      case 'career-job-prediction-report': {
        const mulankStyles: Record<number, Record<string, string>> = {
          1: {
            en: "Independent and authoritative, you work best as a lead decision-maker, director, or self-employed consultant.",
            hi: "स्वतंत्र और आधिकारिक, आप एक प्रमुख निर्णय निर्माता, निदेशक या स्व-नियोजित सलाहकार के रूप में सबसे अच्छा काम करते हैं।",
            hinglish: "Independent aur authoritative, aap lead decision-maker, director ya self-employed consultant ki tarah best kaam karte hain."
          },
          2: {
            en: "Collaborative, patient, and highly supportive, you thrive in partnerships, HR counselling, or mediator roles.",
            hi: "सहयोगात्मक, धैर्यवान और अत्यधिक सहायक, आप साझेदारी, मानव संसाधन परामर्श, या मध्यस्थ भूमिकाओं में फलते-फूलते हैं।",
            hinglish: "Collaborative, patient aur supportive, aap partnerships, HR counselling ya mediator roles me thrive karte hain."
          },
          3: {
            en: "Creative, expressive, and optimistic, you excel in teaching, marketing, visual communications, and public speaking.",
            hi: "रचनात्मक, अभिव्यंजक और आशावादी, आप शिक्षण, विपणन, दृश्य संचार और सार्वजनिक भाषण में उत्कृष्टता प्राप्त करते हैं।",
            hinglish: "Creative, expressive aur optimistic, aap teaching, marketing, visual communications, aur public speaking me excel karte hain."
          },
          4: {
            en: "Structured, highly disciplined, and methodical, you excel in backend operations, database execution, or administration.",
            hi: "संरचित, अत्यधिक अनुशासित और व्यवस्थित, आप बैकएंड संचालन, डेटाबेस निष्पादन, या प्रशासन में उत्कृष्टता प्राप्त करते हैं।",
            hinglish: "Structured, disciplined aur methodical, aap backend operations, database execution ya administration me excel karte hain."
          },
          5: {
            en: "Dynamic, quick-witted, and free-spirited, you thrive in corporate sales, travel trading, PR, or fast-paced startups.",
            hi: "गतिशील, त्वरित और स्वतंत्र विचारों वाले, आप कॉर्पोरेट बिक्री, यात्रा व्यापार, पीआर, या तेज़-तर्रार स्टार्टअप में फलते-फूलते हैं।",
            hinglish: "Dynamic, quick-witted aur free-spirited, aap corporate sales, travel trading, PR ya fast-paced startups me thrive karte hain."
          },
          6: {
            en: "Nurturing, responsible, and design-oriented, you excel in customer relationship management, hospitality, teaching, or art designs.",
            hi: "पोषण करने वाले, जिम्मेदार और डिजाइन-उन्मुख, आप ग्राहक संबंध प्रबंधन, आतिथ्य, शिक्षण, या कला डिजाइनों में उत्कृष्ट हैं।",
            hinglish: "Nurturing, responsible aur design-oriented, aap customer relation management, hospitality, teaching ya art designs me excel karte hain."
          },
          7: {
            en: "Analytical, introspective, and research-focused, you are best suited for software architecture, corporate strategy, or writing.",
            hi: "विश्लेषणात्मक, आत्मनिरीक्षण और अनुसंधान-केंद्रित, आप सॉफ़्टवेयर आर्किटेक्चर, कॉर्पोरेट रणनीति या लेखन के लिए सबसे उपयुक्त हैं।",
            hinglish: "Analytical, introspective aur research-focused, aap software architecture, strategy ya writing ke liye best suited hain."
          },
          8: {
            en: "Ambitious, highly practical, and executive-driven, you thrive in financial analysis, corporate hierarchy management, or law.",
            hi: "महत्वाकांक्षी, अत्यधिक व्यावहारिक और कार्यकारी-संचालित, आप वित्तीय विश्लेषण, कॉर्पोरेट पदानुक्रम प्रबंधन, या कानून में फलते-फूलते हैं।",
            hinglish: "Ambitious, practical aur executive-driven, aap financial analysis, corporate management ya law me thrive karte hain."
          },
          9: {
            en: "Humanitarian, idealistic, and courageous, you excel in public services, counseling, coaching, or global expansion projects.",
            hi: "मानवीय, आदर्शवादी और साहसी, आप सार्वजनिक सेवाओं, परामर्श, कोचिंग, या वैश्विक विस्तार परियोजनाओं में उत्कृष्टता प्राप्त करते हैं।",
            hinglish: "Humanitarian, idealistic aur courageous, aap public services, counseling, coaching ya global projects me excel karte hain."
          }
        };

        const destinyCareers: Record<number, Record<string, string>> = {
          1: { en: "Entrepreneurship, Business Administration, Project Leadership, Politics", hi: "उद्यमिता, व्यवसाय प्रशासन, परियोजना नेतृत्व, राजनीति", hinglish: "Entrepreneurship, Business Administration, Project Leadership, Politics" },
          2: { en: "Counseling, Public Relations, Medicine, Art Curation, Diplomatic Services", hi: "परामर्श, जनसंपर्क, चिकित्सा, कला क्यूरेशन, राजनयिक सेवाएं", hinglish: "Counseling, Public Relations, Medicine, Art Curation, Diplomatic Services" },
          3: { en: "Marketing Copywriting, Writing, Education, Media & Broadcasting", hi: "मार्केटिंग कॉपीराइटिंग, लेखन, शिक्षा, मीडिया और प्रसारण", hinglish: "Marketing Copywriting, Writing, Education, Media & Broadcasting" },
          4: { en: "System Engineering, Data Science, Architecture, Project Management", hi: "सिस्टम इंजीनियरिंग, डेटा साइंस, आर्किटेक्चर, प्रोजेक्ट मैनेजमेंट", hinglish: "System Engineering, Data Science, Architecture, Project Management" },
          5: { en: "International Trading, Corporate Sales, Startup Strategy, Journalism", hi: "अंतर्राष्ट्रीय व्यापार, कॉर्पोरेट बिक्री, स्टार्टअप रणनीति, पत्रकारिता", hinglish: "International Trading, Corporate Sales, Startup Strategy, Journalism" },
          6: { en: "Hospitality, Interior Design, Family Counseling, Education Management", hi: "आतिथ्य, आंतरिक सज्जा, पारिवारिक परामर्श, शिक्षा प्रबंधन", hinglish: "Hospitality, Interior Design, Family Counseling, Education Management" },
          7: { en: "Scientific Research, Corporate Strategy, IT Advisory, Astrological Sciences", hi: "वैज्ञानिक अनुसंधान, कॉर्पोरेट रणनीति, आईटी सलाहकार, ज्योतिषीय विज्ञान", hinglish: "Scientific Research, Corporate Strategy, IT Advisory, Astrological Sciences" },
          8: { en: "Real Estate Development, Investment Banking, Legal Operations, CEO Positions", hi: "रियल एस्टेट विकास, निवेश बैंकिंग, कानूनी परिचालन, सीईओ पद", hinglish: "Real Estate Development, Investment Banking, Legal Operations, CEO Positions" },
          9: { en: "NGO Management, Sports Coaching, Health Services, Global Partnerships", hi: "एनजीओ प्रबंधन, खेल कोचिंग, स्वास्थ्य सेवाएं, वैश्विक भागीदारी", hinglish: "NGO Management, Sports Coaching, Health Services, Global Partnerships" }
        };

        const workingStyleTxt = formatText(t.workingStyle, { lifePath: profile.birthday });
        const careerChannelsTxt = formatText(t.careerChannels, { destiny: profile.destiny });

        return (
          <div className="space-y-6 text-left">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-primary" />
                {workingStyleTxt}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {mulankStyles[profile.birthday]?.[activeLang] || mulankStyles[1]?.[activeLang]}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f071f] border border-white/5 space-y-2.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{careerChannelsTxt}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{t.careerPush}</p>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <p className="text-xs font-bold text-amber-400">{destinyCareers[profile.destiny]?.[activeLang] || destinyCareers[1]?.[activeLang]}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.careerForecast}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {profile.personalYear === 1 || profile.personalYear === 5 || profile.personalYear === 8 
                  ? formatText(t.careerForecastActive, { py: profile.personalYear })
                  : formatText(t.careerForecastBuild, { py: profile.personalYear })}
              </p>
            </div>
          </div>
        );
      }
      case 'baby_name':
      case 'baby':
      case 'lucky-baby-name-report': {
        const babyGender = formData.babyGender || 'unisex';
        const preferredLetter = formData.preferredLetter || '';
        
        let luckyRoot = 1;
        if (formData.dateOfBirth) {
          const parts = formData.dateOfBirth.split(/[-\/]/);
          const d = parts[0].length === 4 ? Number(parts[2]) : Number(parts[0]);
          const sumDigits = (n: number): number => String(n).split('').reduce((acc, char) => acc + (Number(char) || 0), 0);
          const reduce = (n: number): number => (n <= 9 ? n : reduce(sumDigits(n)));
          luckyRoot = reduce(sumDigits(d));
        }

        return (
          <div className="space-y-6 text-left">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
                {t.luckyBabyNameTitle}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {formatText(t.babyDobDesc, { luckyRoot })}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{t.genderPref}: {babyGender}</Badge>
                {preferredLetter && <Badge variant="outline">{t.startingLetter}: {preferredLetter}</Badge>}
                <Badge variant="outline">{t.targetSum}: {luckyRoot}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.auspiciousNames}</h3>
              {loadingNames ? (
                <p className="text-xs text-gray-400 animate-pulse italic">{t.loadingDbNames}</p>
              ) : babyNames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {babyNames.map((n, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#0f071f] border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-white">{n.name}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{n.gender} · {n.meaning || 'Auspicious'}</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                        Sum: {n.name_root}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center rounded-xl border border-white/5 text-xs text-gray-400 bg-white/[0.01]">
                  {formatText(t.noNamesFound, { letter: preferredLetter || 'A', gender: babyGender })}
                </div>
              )}
            </div>
          </div>
        );
      }
      case 'compatibility_report':
      case 'compatibility':
      case 'love-marriage-compatibility': {
        const partnerName = formData.partnerName || 'Partner';
        const partnerDob = formData.partnerDob;

        if (!partnerDob) {
          return (
            <div className="p-5 text-center text-xs text-gray-400 border border-white/5 rounded-2xl bg-white/[0.01]">
              {t.partnerDetailsMissing}
            </div>
          );
        }

        const partnerMulank = getMulankFromDob(partnerDob);
        const compat = calculateCompatibility(profile.birthday, partnerMulank);

        const calculatedTitle = formatText(t.romanticCompatCalculated, { lifePath: profile.birthday, partnerName, partnerLp: partnerMulank });

        return (
          <div className="space-y-6 text-left">
            {/* Display Partner Info */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-wrap items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs text-gray-400 font-medium">{t.partnerNameLabel}</p>
                <p className="text-base font-bold text-white mt-0.5">{partnerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{t.partnerDobLabel}</p>
                <p className="text-sm font-bold text-white mt-0.5">{partnerDob}</p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {compat.score}%
              </Badge>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-[#0f071f] to-primary/10 border border-white/5 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Heart className="w-4.5 h-4.5 text-primary fill-primary" />
                  {t.romanticCompatBreakdown}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {calculatedTitle}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-display font-bold text-amber-400">{compat.score}%</div>
                <Badge variant="outline" className="border-amber-400/30 bg-amber-400/5 text-amber-400 font-bold uppercase tracking-wider text-[11px] py-1 px-3">
                  {compat.compatibility}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/10 space-y-2">
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-4.5 h-4.5" /> {t.strengthsMatch}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeLang === 'hi' 
                    ? 'पूरक ऊर्जाएं जो एक दूसरे को अच्छी तरह से संतुलित करती हैं और आपसी समझ को बढ़ावा देती हैं।' 
                    : activeLang === 'hinglish' 
                    ? 'Complementary energies jo ek dusre ko achhe se balance karti hain aur mutual support deti hain.' 
                    : compat.strength}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-2">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-4.5 h-4.5" /> {t.potentialChallenges}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeLang === 'hi'
                    ? 'संवाद में कभी-कभी गलतफहमियां हो सकती हैं। एक-दूसरे के नजरिए को समझने के लिए धैर्य आवश्यक है।'
                    : activeLang === 'hinglish'
                    ? 'Kabhie communication differences ho sakte hain. Ek dusre ke viewpoints samajhne ke liye patience chahiye.'
                    : compat.challenges}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.remediesHarmony}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.remediesHarmonyDesc}
              </p>
            </div>
          </div>
        );
      }
      case 'business_numerology':
      case 'business':
      case 'business-numerology-report': {
        const busName = formData.businessName || 'Business';
        const bv = calculateBusinessVibration(busName, formData.dateOfBirth);
        const tweaks = suggestBrandTweaks(busName, profile.birthday);
        return (
          <div className="space-y-6 text-left">
            {/* Display Analyzed Business Name */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs text-gray-400 font-medium">{t.analyzedBusiness}</p>
                <p className="text-xl font-bold text-white mt-0.5">{busName}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border border-primary/30 font-semibold">
                Root {bv.brand.root}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.businessNameSum}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{bv.brand.root}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.spellingQuality}</p>
                <p className="text-sm font-bold text-emerald-400 mt-2.5">
                  Excellent
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.bestRootsOwner}</p>
                <p className="text-sm font-bold text-white mt-2.5">
                  {lucky.numbers.map((n) => reduceToSingleDigit(n, false)).join(', ')}
                </p>
              </div>
            </div>

            {bv.founderAlignment && (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Founder Alignment</h3>
                <p className="text-xs text-gray-300">
                  {activeLang === 'hi'
                    ? `आपका मूलांक ${profile.lifePath} इस व्यवसाय मूल ${bv.brand.root} के साथ बहुत अनुकूल है। यह ब्रांड नाम आपके व्यक्तिगत भाग्य का समर्थन करता है।`
                    : `Your life path ${profile.lifePath} aligns with the business root ${bv.brand.root} nicely. This brand name supports your personal fortune.`}
                </p>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-[#0f071f] border border-white/5 space-y-2.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.businessSpellingTweaks}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {formatText(t.ownerDriverAlign, { lifePath: profile.birthday })}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {tweaks.slice(0, 4).map((t, idx) => (
                  <div key={idx} className="p-3 bg-[#0f071f] border border-white/5 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{t.spelling}</span>
                    <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">Root {t.root} ({t.change})</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'property_numerology':
      case 'property':
      case 'property-house-number-report': {
        const propNum = formData.propertyNumber || '101';
        const pa = analyzeHouse(propNum, profile.birthday);
        return (
          <div className="space-y-6 text-left">
            {/* Display Property Number */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs text-gray-400 font-medium">{t.analyzedProperty}</p>
                <p className="text-xl font-bold text-white mt-0.5">{propNum}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                Root {pa.root}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.houseNumberSum}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{pa.root}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.vibeCategory}</p>
                <p className="text-sm font-bold text-amber-400 mt-2.5">{pa.vsMulank === 'friendly' ? t.compatible : 'Neutral'}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.matchScore}</p>
                <p className="text-sm font-bold text-emerald-400 mt-2.5">{pa.score}%</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.propertyVibeTitle}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {formatText(t.propertyVibeDesc, {
                  root: pa.root,
                  rahuSaturn: (pa.root === 4 || pa.root === 8) ? t.rahuSaturnDesc : ''
                })}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-2">
                <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[9px] text-gray-400">Prosperity</p>
                  <p className="text-xs font-bold text-white">{pa.energy.prosperity}%</p>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[9px] text-gray-400">Peace</p>
                  <p className="text-xs font-bold text-white">{pa.energy.peace}%</p>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[9px] text-gray-400">Relationships</p>
                  <p className="text-xs font-bold text-white">{pa.energy.relationships}%</p>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[9px] text-gray-400">Health</p>
                  <p className="text-xs font-bold text-white">{pa.energy.health}%</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f071f] border border-white/5 space-y-2.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.remediesHarmony}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {pa.remedy[activeLang] || pa.remedy.en}
              </p>
            </div>
          </div>
        );
      }
      case 'marriage_report':
      case 'marriage':
      case 'marriage-timing-matching-report': {
        const dob = formData.dateOfBirth;
        const marriageYears = [
          { year: '2026', py: 2, status: activeLang === 'hi' ? 'अत्यधिक अनुकूल (★★★★★)' : 'Highly Favorable (★★★★★)', desc: activeLang === 'hi' ? 'साझेदारी, रोमांस और भावनात्मक मिलन का वर्ष।' : 'Moon-ruled year of partnership, romance and emotional union. Ideal for domestic bonding.' },
          { year: '2027', py: 3, status: activeLang === 'hi' ? 'तटस्थ (★★★☆☆)' : 'Neutral (★★★☆☆)', desc: activeLang === 'hi' ? 'सामाजिक विस्तार और खुशी का वर्ष।' : 'Jupiter-ruled year of social expansion and joy. Happy but needs grounding.' },
          { year: '2028', py: 4, status: activeLang === 'hi' ? 'अनुकूल (★★★★☆)' : 'Favorable (★★★★☆)', desc: activeLang === 'hi' ? 'स्थिरता और ठोस नींव का वर्ष।' : 'Rahu-ruled year of stability and structural foundation.' },
          { year: '2029', py: 5, status: activeLang === 'hi' ? 'चुनौतीपूर्ण (★★☆☆☆)' : 'Challenging (★★☆☆☆)', desc: activeLang === 'hi' ? 'त्वरित परिवर्तन और भावनात्मक उतार-चढ़ाव का वर्ष।' : 'Mercury-ruled year of fast change. Emotional instability.' },
          { year: '2030', py: 6, status: activeLang === 'hi' ? 'अत्यधिक अनुकूल (★★★★★)' : 'Highly Favorable (★★★★★)', desc: activeLang === 'hi' ? 'घर और परिवार की जिम्मेदारी का वर्ष। विवाह के लिए सर्वश्रेष्ठ।' : 'Venus-ruled year of home and family responsibility. Absolute strongest marriage year.' },
        ];

        return (
          <div className="space-y-6 text-left">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-primary" />
                {t.marriageTimingTitle}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.marriageTimingDesc}
              </p>
            </div>

            <div className="space-y-2">
              {marriageYears.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0f071f] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white">{item.year} — Personal Year {item.py}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <span className={`text-[10px] font-bold self-start sm:self-center ${item.py === 2 || item.py === 6 ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      default:
        return <p className="text-xs text-gray-400 italic">No specific analysis available for this key.</p>;
    }
  };

  return (
    <Card className="glow-gold-card overflow-hidden text-left mb-6">
      <CardHeader className="bg-white/[0.01] border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-lg font-display text-white capitalize">
              {reportKey.replace(/_/g, ' ')} Analysis
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              {activeLang === 'hi' 
                ? `${who} के लिए इंटरैक्टिव डैशबोर्ड रिपोर्ट (जन्म तिथि: ${formData.dateOfBirth})` 
                : activeLang === 'hinglish' 
                ? `${who} ke liye Interactive Dashboard Report (DOB: ${formData.dateOfBirth})` 
                : `Interactive Dashboard Report for ${who} (DOB: ${formData.dateOfBirth})`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {getReportContent()}

        {personalizedPackage && (
          <div className="border-t border-white/10 pt-6 mt-6 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-amber-500/5 to-purple-500/10 border border-primary/20">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                  Hyper-Personalized Analysis Engine
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  100% Contextual Report for {who}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-amber-400 border-amber-400/30 text-[10px] py-0.5 px-2">
                  Personal Year {personalizedPackage.personalYear}
                </Badge>
                <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] py-0.5 px-2">
                  Alignment {personalizedPackage.overallVibrationScore}%
                </Badge>
              </div>
            </div>

            {personalizedPackage.parts.map((part) => (
              <div key={part.partNumber} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Badge variant="secondary" className="bg-white/5 text-gray-300 text-[10px]">
                    PART {part.partNumber}
                  </Badge>
                  <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                    {part.partTitle}
                  </h4>
                </div>

                {/* Inject Visual Widget for Part 1 */}
                {part.partNumber === 1 && (
                  <LoShuGridVisual dob={formData.dateOfBirth || profile.birthday?.toString() || '1990-01-01'} />
                )}

                {/* Inject Visual Widget for Part 3 */}
                {part.partNumber === 3 && (
                  <VibrationalCycleGauge
                    personalYear={personalizedPackage.personalYear}
                    personalMonth={personalizedPackage.personalMonth}
                    overallScore={personalizedPackage.overallVibrationScore}
                  />
                )}

                {/* Inject Visual Widget for Part 4 */}
                {part.partNumber === 4 && (
                  <GemstonePrescriptionCard
                    mulank={profile.mulank || 1}
                    userWeightKg={70}
                  />
                )}

                <div className="grid grid-cols-1 gap-4">

                  {part.sections.map((sec) => (
                    <div key={sec.sectionKey} className="p-4 rounded-xl bg-[#0b0518] border border-white/5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {sec.personalizedTitle}
                        </h5>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {sec.sectionTitle}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed">
                        {sec.personalizedContent.summary}
                      </p>

                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-gray-300 leading-relaxed">
                        {sec.personalizedContent.detailedAnalysis}
                      </div>

                      <div className="text-[10px] font-mono text-amber-400/90 bg-amber-400/5 px-2.5 py-1 rounded border border-amber-400/10">
                        {sec.personalizedContent.userContextHighlight}
                      </div>

                      {sec.personalizedContent.strengths.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Key Strengths & Drivers:</p>
                          <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                            {sec.personalizedContent.strengths.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.personalizedContent.riskWarnings.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Risk Signals & Friction Triggers:</p>
                          <ul className="list-disc list-inside text-xs text-gray-300 space-y-0.5">
                            {sec.personalizedContent.riskWarnings.map((rw, i) => (
                              <li key={i}>{rw}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.personalizedContent.prescribedRemedies.length > 0 && (
                        <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 space-y-2">
                          <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Prescribed Remedies & Vibrational Balancing:
                          </p>
                          {sec.personalizedContent.prescribedRemedies.map((rem, i) => (
                            <div key={i} className="text-xs text-purple-200/90 space-y-0.5">
                              <span className="font-semibold text-white">• {rem.title}:</span> {rem.instructions}
                              <p className="text-[10px] text-purple-300/70 italic pl-3">{rem.reason}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {sec.personalizedContent.aiPrompts.length > 0 && (
                        <div className="p-2.5 rounded bg-primary/5 border border-primary/10 space-y-1">
                          <p className="text-[10px] font-bold text-primary uppercase">Ask AI Consultation:</p>
                          {sec.personalizedContent.aiPrompts.map((prompt, i) => (
                            <p key={i} className="text-xs text-gray-300 italic">"{prompt}"</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

