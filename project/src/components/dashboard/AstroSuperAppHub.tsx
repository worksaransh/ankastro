import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { KundliChart } from '@/components/KundliChart';
import { DailyPanchangWidget } from '@/components/DailyPanchangWidget';
import { calculateVedicKundli, VedicKundliProfile } from '@/lib/vedicAstrologyEngine';
import { calculateAshtakootaMilan, AshtakootaResult } from '@/lib/ashtakootaEngine';
import LoshuGridChart from '@/components/charts/LoshuGridChart';
import { calculateLoshuGrid } from '@/lib/advancedNumerology';
import { REMEDIES } from '@/lib/remedies';
import {
  NUMBER_ASSOCIATIONS,
  calculateChaldeanNameSum,
  calculateDigitSum,
  LOSHU_PLANES,
  calculateSadeSatiStatus,
  ANGEL_NUMBERS,
  NAKSHATRA_SYLLABLES,
} from '@/lib/masterCosmicDatabase';
import {
  Sparkles,
  Compass,
  Heart,
  Calendar,
  Sun,
  Moon,
  MessageCircle,
  Gem,
  ShieldCheck,
  Star,
  Users,
  Clock,
  ChevronRight,
  Zap,
  Activity,
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Car,
  Home,
  Briefcase,
  Layers,
  Wand2,
  Baby,
  ShieldAlert,
} from 'lucide-react';

interface AstroSuperAppHubProps {
  userProfile?: any;
  numerologyProfile?: any;
}

// 12 Zodiac Rashis for Daily Horoscope with personalized daily cosmic forecasts
const RASHIS = [
  {
    id: 'aries',
    name: { en: 'Aries', hi: 'मेष', hinglish: 'Mesh (Aries)' },
    ruler: 'Mars (मंगल)',
    element: 'Fire (अग्नि)',
    icon: '♈',
    dates: 'Mar 21 - Apr 19',
    luckyNum: 9,
    luckyColor: 'Coral Red',
    score: 88,
    love: '85%',
    career: '92%',
    health: '86%',
    forecast: {
      en: 'High energy and drive surround your career. Avoid impulsive debates in partnerships before noon.',
      hi: 'आज आपका आत्मविश्वास चरम पर रहेगा। कार्यक्षेत्र में नए अवसर मिलेंगे। दोपहर से पहले वाद-विवाद से बचें।',
      hinglish: 'Aaj energy bohot positive rahegi. Career me progress ke strong yog hain. Impulsive decisions se bachein.',
    },
    dos: { en: 'Initiate new tasks, exercise, wear red/white', hi: 'नया कार्य शुरू करें, ध्यान लगाएं, लाल/सफेद वस्त्र पहनें' },
    donts: { en: 'Lend large money today, speak harshly', hi: 'आज बड़ा उधार न दें, क्रोध में कटु वचन न बोलें' },
  },
  {
    id: 'taurus',
    name: { en: 'Taurus', hi: 'वृषभ', hinglish: 'Vrishabh (Taurus)' },
    ruler: 'Venus (शुक्र)',
    element: 'Earth (पृथ्वी)',
    icon: '♉',
    dates: 'Apr 20 - May 20',
    luckyNum: 6,
    luckyColor: 'Silvery White',
    score: 82,
    love: '90%',
    career: '78%',
    health: '84%',
    forecast: {
      en: 'Financial stability is highlighted today. A harmonious evening with family or your romantic partner brings peace.',
      hi: 'आर्थिक स्थिति में सुधार होगा। परिवार और जीवनसाथी के साथ सुखद समय व्यतीत होगा। निवेश में धैर्य रखें।',
      hinglish: 'Financial stability bani rahegi. Partner ke sath time spend karna man ko shanti dega.',
    },
    dos: { en: 'Plan luxury purchases, focus on art/music', hi: 'कला, संगीत और रचनात्मक कार्यों में समय दें' },
    donts: { en: 'Overspend on impulse, rush contracts', hi: 'बिना सोचे-समझे खर्च न करें, जल्दबाजी से बचें' },
  },
  {
    id: 'gemini',
    name: { en: 'Gemini', hi: 'मिथुन', hinglish: 'Mithun (Gemini)' },
    ruler: 'Mercury (बुध)',
    element: 'Air (वायु)',
    icon: '♊',
    dates: 'May 21 - Jun 20',
    luckyNum: 5,
    luckyColor: 'Emerald Green',
    score: 91,
    love: '88%',
    career: '95%',
    health: '90%',
    forecast: {
      en: 'Exceptional communication skills today. Key negotiations and client meetings turn out in your favor.',
      hi: 'बातचीत और नेटवर्किंग के लिए बेहतरीन दिन है। अटके हुए काम पूरे होंगे और व्यापार में लाभ के योग हैं।',
      hinglish: 'Client meetings aur communication ke liye bohot acha din hai. Business me profit ke signals hain.',
    },
    dos: { en: 'Pitch proposals, sign pending files, travel', hi: 'महत्वपूर्ण बातचीत करें, फाइलें निपटाएं' },
    donts: { en: 'Overthink minor issues, multitask excessively', hi: 'एक साथ बहुत सारे काम शुरू न करें' },
  },
  {
    id: 'cancer',
    name: { en: 'Cancer', hi: 'कर्क', hinglish: 'Kark (Cancer)' },
    ruler: 'Moon (चंद्र)',
    element: 'Water (जल)',
    icon: '♋',
    dates: 'Jun 21 - Jul 22',
    luckyNum: 2,
    luckyColor: 'Pearl Silver',
    score: 79,
    love: '92%',
    career: '74%',
    health: '80%',
    forecast: {
      en: 'Intuition is very sharp. Trust your gut feelings regarding emotional relationships and home matters.',
      hi: 'मन में आध्यात्मिक शांति का अनुभव होगा। पारिवारिक मामलों में आपकी सलाह सबको पसंद आएगी। जल का सेवन बढ़ाएं।',
      hinglish: 'Intuition bohot strong rahegi. Family matters me aapka decision sahi sabit hoga.',
    },
    dos: { en: 'Meditate near water, cook for loved ones', hi: 'भगवान शिव की आराधना करें, पर्याप्त जल पिएं' },
    donts: { en: 'Take criticism to heart, isolate yourself', hi: 'छोटी बातों पर ज्यादा भावुक न हों' },
  },
  {
    id: 'leo',
    name: { en: 'Leo', hi: 'सिंह', hinglish: 'Singh (Leo)' },
    ruler: 'Sun (सूर्य)',
    element: 'Fire (अग्नि)',
    icon: '♌',
    dates: 'Jul 23 - Aug 22',
    luckyNum: 1,
    luckyColor: 'Royal Gold',
    score: 94,
    love: '89%',
    career: '96%',
    health: '92%',
    forecast: {
      en: 'Sun blesses you with authoritative presence. Recognition from superiors and leadership opportunities arrive.',
      hi: 'सूर्य देव की कृपा से समाज और कार्यक्षेत्र में मान-सम्मान बढ़ेगा। उच्चाधिकारियों से सहयोग मिलेगा।',
      hinglish: 'Surya dev ka aashirwaad aapke sath hai. Leadership aur recognition ke zabardast yog hain.',
    },
    dos: { en: 'Take lead in big projects, offer water to Sun', hi: 'प्रातःकाल सूर्य को जल दें, बड़े फैसले आत्मविश्वास से लें' },
    donts: { en: 'Let ego dictate talks, ignore junior feedback', hi: 'अहंकार से बचें, दूसरों के विचारों का सम्मान करें' },
  },
  {
    id: 'virgo',
    name: { en: 'Virgo', hi: 'कन्या', hinglish: 'Kanya (Virgo)' },
    ruler: 'Mercury (बुध)',
    element: 'Earth (पृथ्वी)',
    icon: '♍',
    dates: 'Aug 23 - Sep 22',
    luckyNum: 5,
    luckyColor: 'Olive Green',
    score: 85,
    love: '80%',
    career: '91%',
    health: '88%',
    forecast: {
      en: 'Analytical precision is unmatched today. Great day to balance finances, audits, and health routines.',
      hi: 'बारीकी से किए गए कार्यों में सफलता मिलेगी। पुराने कागजात या वित्तीय हिसाब व्यवस्थित करने का उत्तम दिन है।',
      hinglish: 'Accounts aur financial planning ke liye perfect day. Detail-oriented tasks quickly complete honge.',
    },
    dos: { en: 'Organize schedule, eat clean greens', hi: 'हरी सब्जियों का सेवन करें, दिनचर्या को व्यवस्थित रखें' },
    donts: { en: 'Nitpick minor flaws, over-criticize partner', hi: 'दूसरों की छोटी गलतियों पर ज्यादा टोकें नहीं' },
  },
  {
    id: 'libra',
    name: { en: 'Libra', hi: 'तुला', hinglish: 'Tula (Libra)' },
    ruler: 'Venus (शुक्र)',
    element: 'Air (वायु)',
    icon: '♎',
    dates: 'Sep 23 - Oct 22',
    luckyNum: 6,
    luckyColor: 'Pastel Pink',
    score: 89,
    love: '94%',
    career: '85%',
    health: '87%',
    forecast: {
      en: 'Venus brings charisma, charm, and romantic warmth. Business partnerships and collaborative efforts flourish.',
      hi: 'आकर्षण और मधुरता बनी रहेगी। पार्टनरशिप में नया मुकाम हासिल होगा। प्रेम जीवन में खुशहाली रहेगी।',
      hinglish: 'Shukra ki kripa se love life me romance aur business partnership me harmony rahegi.',
    },
    dos: { en: 'Resolve old disputes, pamper your style', hi: 'पुराने विवाद सुलझाएं, नए वस्त्र धारण करें' },
    donts: { en: 'Delay critical decisions, people-please', hi: 'फैसलों को ज्यादा समय तक टालें नहीं' },
  },
  {
    id: 'scorpio',
    name: { en: 'Scorpio', hi: 'वृश्चिक', hinglish: 'Vrishchik (Scorpio)' },
    ruler: 'Mars & Ketu',
    element: 'Water (जल)',
    icon: '♏',
    dates: 'Oct 23 - Nov 21',
    luckyNum: 9,
    luckyColor: 'Dark Maroon',
    score: 86,
    love: '87%',
    career: '88%',
    health: '83%',
    forecast: {
      en: 'Deep transformation and focus. Secret information or hidden opportunities come into your clear sight.',
      hi: 'गहन चिंतन और अनुसंधान के लिए दिन अच्छा है। गुप्त धन या अप्रत्याशित स्रोत से लाभ संभव है।',
      hinglish: 'Deep research aur transformation ka din hai. Unexpected source se fayda ho sakta hai.',
    },
    dos: { en: 'Dig deep into strategies, practice yoga', hi: 'रणनीति पर काम करें, योग और प्राणायाम करें' },
    donts: { en: 'Hold grudges, react impulsively in anger', hi: 'पुरानी बातें दिल में न रखें, शांति बनाए रखें' },
  },
  {
    id: 'sagittarius',
    name: { en: 'Sagittarius', hi: 'धनु', hinglish: 'Dhanu (Sagittarius)' },
    ruler: 'Jupiter (गुरु)',
    element: 'Fire (अग्नि)',
    icon: '♐',
    dates: 'Nov 22 - Dec 21',
    luckyNum: 3,
    luckyColor: 'Bright Yellow',
    score: 92,
    love: '90%',
    career: '93%',
    health: '94%',
    forecast: {
      en: 'Jupiter radiates wisdom and optimism. Long-distance travel plans or higher study aspirations gain immense speed.',
      hi: 'गुरु बृहस्पति की कृपा से भाग्य का भरपूर साथ मिलेगा। आध्यात्मिक कार्यों में रुचि बढ़ेगी और यात्रा सफल होगी।',
      hinglish: 'Brihaspati dev ki blessing se luck favor karega. Long distance ya career expansion ke plans accelerate honge.',
    },
    dos: { en: 'Seek mentor guidance, apply for expansion', hi: 'गुरुजनों का आशीर्वाद लें, पीले चंदन का तिलक लगाएं' },
    donts: { en: 'Make unrealistic promises, overeat sweets', hi: 'अति-उत्साह में ऐसे वादे न करें जो पूरे न हो सकें' },
  },
  {
    id: 'capricorn',
    name: { en: 'Capricorn', hi: 'मकर', hinglish: 'Makar (Capricorn)' },
    ruler: 'Saturn (शनि)',
    element: 'Earth (पृथ्वी)',
    icon: '♑',
    dates: 'Dec 22 - Jan 19',
    luckyNum: 8,
    luckyColor: 'Charcoal Blue',
    score: 87,
    love: '78%',
    career: '95%',
    health: '89%',
    forecast: {
      en: 'Saturn rewards your disciplined hard work. Long-term foundation building in property or business pays off.',
      hi: 'शनि देव आपकी मेहनत का पूरा फल देंगे। करियर में स्थिर वृद्धि और संपत्ति संबंधी कार्य सिद्ध होंगे।',
      hinglish: 'Shani dev aapki mehnat ka reward denge. Long-term business aur property plans solidify honge.',
    },
    dos: { en: 'Stick to deadlines, help the needy/laborers', hi: 'अनुशासन बनाए रखें, जरूरतमंदों की सहायता करें' },
    donts: { en: 'Cut corners for shortcuts, neglect joint health', hi: 'शॉर्टकट से बचें, जोड़ों और हड्डियों का ध्यान रखें' },
  },
  {
    id: 'aquarius',
    name: { en: 'Aquarius', hi: 'कुंभ', hinglish: 'Kumbh (Aquarius)' },
    ruler: 'Saturn & Rahu',
    element: 'Air (वायु)',
    icon: '♒',
    dates: 'Jan 20 - Feb 18',
    luckyNum: 8,
    luckyColor: 'Electric Cyan',
    score: 90,
    love: '86%',
    career: '92%',
    health: '91%',
    forecast: {
      en: 'Innovative breakthroughs and social networking bring lucrative ideas. Connect with visionary groups.',
      hi: 'नए और अनोखे विचार मन में आएंगे। सामाजिक दायरे में मान बढ़ेगा और नई तकनीकों से लाभ होगा।',
      hinglish: 'Out-of-the-box thinking se problems solve hongi. Social circle se faydemand connection banenge.',
    },
    dos: { en: 'Embrace modern tech, brainstorm startups', hi: 'नए विचारों का स्वागत करें, टीम के साथ काम करें' },
    donts: { en: 'Alienate close friends, be overly stubborn', hi: 'अड़ियल रवैये से बचें, अपनों की बात भी सुनें' },
  },
  {
    id: 'pisces',
    name: { en: 'Pisces', hi: 'मीन', hinglish: 'Meen (Pisces)' },
    ruler: 'Jupiter (गुरु)',
    element: 'Water (जल)',
    icon: '♓',
    dates: 'Feb 19 - Mar 20',
    luckyNum: 3,
    luckyColor: 'Sea Green',
    score: 84,
    love: '93%',
    career: '81%',
    health: '85%',
    forecast: {
      en: 'Compassion, creativity, and spiritual depth peak today. Artistic ventures and foreign connections thrive.',
      hi: 'रचनात्मक और आध्यात्मिक कार्यों में मन लगेगा। विदेश से जुड़े मामलों में शुभ समाचार मिल सकता है।',
      hinglish: 'Creativity aur spiritual growth ka strong yog. Foreign ya outstation contact se positive news mil sakti hai.',
    },
    dos: { en: 'Donate to charity, practice mindfulness', hi: 'दान-पुण्य करें, ध्यान और शांत संगीत सुनें' },
    donts: { en: 'Daydream without action, escape reality', hi: 'सपनों में खोए रहने के बजाय वास्तविकता पर ध्यान दें' },
  },
];

// Curated AI Astrologers (AstroTalk Style Avatars)
const AI_ASTROLOGERS = [
  {
    id: 'acharya-ramesh',
    name: 'Acharya Ramesh Shastri',
    role: 'Vedic Kundli & Dasha Expert',
    exp: '22+ Years Exp',
    rating: '4.95 ★ (18.4k)',
    specialties: ['Kundli Analysis', 'Sade Sati', 'Career Remedies'],
    languages: 'Hindi, English',
    avatarBg: 'from-amber-600 to-orange-700',
    avatarText: '🕉️',
    online: true,
  },
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    role: 'Love & Marriage Specialist',
    exp: '16+ Years Exp',
    rating: '4.98 ★ (24.2k)',
    specialties: ['Gun Milan', 'Manglik Dosha', 'Relationship Healing'],
    languages: 'English, Hindi, Punjabi',
    avatarBg: 'from-pink-600 to-rose-700',
    avatarText: '💍',
    online: true,
  },
  {
    id: 'guru-vikram-nath',
    name: 'Guru Vikram Nath',
    role: 'Chaldean & Lo Shu Numerologist',
    exp: '19+ Years Exp',
    rating: '4.92 ★ (14.9k)',
    specialties: ['Name Correction', 'Mobile Vibration', 'Business Brand Sum'],
    languages: 'Hindi, English, Gujarati',
    avatarBg: 'from-violet-600 to-purple-800',
    avatarText: '🔢',
    online: true,
  },
  {
    id: 'swami-anand',
    name: 'Swami Anand Teerth',
    role: 'Panchang & Muhurta Guru',
    exp: '25+ Years Exp',
    rating: '4.97 ★ (31.1k)',
    specialties: ['Shubh Muhurat', 'Puja Timings', 'Kaal Sarp Dosh'],
    languages: 'Sanskrit, Hindi, English',
    avatarBg: 'from-yellow-600 to-amber-700',
    avatarText: '☀️',
    online: true,
  },
];

export const AstroSuperAppHub: React.FC<AstroSuperAppHubProps> = ({ userProfile, numerologyProfile }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kundli');
  const [selectedAngelNum, setSelectedAngelNum] = useState<string>('111');

  // Compute User's Vedic Kundli from DOB
  const storedData = useMemo(() => {
    try {
      const raw = localStorage.getItem('numerologyFormData');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const dob = userProfile?.dob
    ? userProfile.dob.split('-').reverse().join('/')
    : (storedData.dateOfBirth || '15/08/1995');
  const birthTime = userProfile?.birth_time || storedData.birthTime || '12:00';
  const birthPlace = userProfile?.birth_place || storedData.city || 'New Delhi';
  const timeUnknown = !userProfile?.birth_time && !storedData.birthTime;

  const vedicKundli = useMemo(() => {
    return calculateVedicKundli(dob, birthTime, birthPlace, timeUnknown);
  }, [dob, birthTime, birthPlace, timeUnknown]);

  // Extract User's Natural Moon Sign & Lagna
  const userMoonPlanet = useMemo(() => {
    return vedicKundli.planets.find((p) => p.planet === 'Moon');
  }, [vedicKundli]);

  const userMoonSignName = userMoonPlanet?.sign || 'Aries';
  const userMoonSignId = userMoonSignName.toLowerCase();
  const userLagnaSign = vedicKundli.lagna.sign;
  const userNakshatra = userMoonPlanet?.nakshatra || vedicKundli.lagna.nakshatra;
  const userPada = userMoonPlanet?.pada || vedicKundli.lagna.pada;

  // Compute user's Moon sign index (1 = Aries to 12 = Pisces)
  const userMoonSignIndex = useMemo(() => {
    const idx = RASHIS.findIndex((r) => r.id === userMoonSignId);
    return idx >= 0 ? idx + 1 : 1;
  }, [userMoonSignId]);

  // Calculate Shani Sade Sati Status
  const sadeSati = useMemo(() => {
    return calculateSadeSatiStatus(userMoonSignIndex);
  }, [userMoonSignIndex]);

  // Baby Name Syllables for user's Moon Nakshatra
  const nakshatraLetters = useMemo(() => {
    return NAKSHATRA_SYLLABLES[userNakshatra] || ['Chu (चू)', 'Che (चे)', 'Cho (चो)', 'La (ला)'];
  }, [userNakshatra]);

  // Selected Rashi for Horoscope (Defaults automatically to user's actual Moon Sign)
  const [selectedRashi, setSelectedRashi] = useState<string>(() => {
    return userMoonSignId || 'aries';
  });

  // Sync selected Rashi if user's moon sign loads
  useEffect(() => {
    if (userMoonSignId && RASHIS.some((r) => r.id === userMoonSignId)) {
      setSelectedRashi(userMoonSignId);
    }
  }, [userMoonSignId]);

  // Kundli Milan state
  const [groomSign, setGroomSign] = useState(1);
  const [groomNakshatra, setGroomNakshatra] = useState(0);
  const [brideSign, setBrideSign] = useState(5);
  const [brideNakshatra, setBrideNakshatra] = useState(9);
  const [milanResult, setMilanResult] = useState<AshtakootaResult | null>(null);

  // Interactive Applied Numerology Tools State
  const initialName = userProfile?.full_birth_name || userProfile?.full_name || storedData.fullName || storedData.fullBirthName || 'Devotee';
  const [testNameInput, setTestNameInput] = useState(initialName);
  const [testPhoneInput, setTestPhoneInput] = useState(userProfile?.phone_number || '9876543210');
  const [testVehicleInput, setTestVehicleInput] = useState('DL 01 AB 1234');
  const [testFlatInput, setTestFlatInput] = useState('402');

  const loshuGrid = useMemo(() => {
    return calculateLoshuGrid(dob);
  }, [dob]);

  const handleCalculateMilan = () => {
    const res = calculateAshtakootaMilan(groomSign, groomNakshatra, brideSign, brideNakshatra);
    setMilanResult(res);
  };

  const activeRashiData = RASHIS.find((r) => r.id === selectedRashi) || RASHIS[0];
  const isUserOwnSign = selectedRashi === userMoonSignId;

  // Applied Numerology Live Computations
  const nameVibration = useMemo(() => {
    return calculateChaldeanNameSum(testNameInput || 'User');
  }, [testNameInput]);

  const phoneVibration = useMemo(() => {
    return calculateDigitSum(testPhoneInput || '0');
  }, [testPhoneInput]);

  const vehicleVibration = useMemo(() => {
    return calculateDigitSum(testVehicleInput || '0');
  }, [testVehicleInput]);

  const flatVibration = useMemo(() => {
    return calculateDigitSum(testFlatInput || '0');
  }, [testFlatInput]);

  const userMulank = numerologyProfile?.lifePath || 1;
  const userBhagyank = numerologyProfile?.destiny || 1;
  const userMaturityNumber = (userMulank + userBhagyank) > 9 ? (userMulank + userBhagyank) % 9 || 9 : (userMulank + userBhagyank);

  return (
    <div className="space-y-6">
      {/* 1. ASTROTALK-STYLE TOP CATEGORIES SCROLLER / STORIES */}
      <div className="overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
        <div className="flex items-center gap-3 min-w-max">
          {[
            { id: 'kundli', label: language === 'hi' ? 'मेरी कुंडली' : 'Free Kundli', icon: '🪐', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300' },
            { id: 'rashifal', label: language === 'hi' ? 'दैनिक राशिफल' : 'Horoscope', icon: '♈', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300' },
            { id: 'milan', label: language === 'hi' ? 'कुंडली मिलान' : 'Kundli Matching', icon: '💍', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/40 text-pink-300' },
            { id: 'panchang', label: language === 'hi' ? 'आज का पंचांग' : 'Daily Panchang', icon: '🌅', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/40 text-yellow-300' },
            { id: 'tools', label: language === 'hi' ? 'अंक ज्योतिष टूल्स' : 'Applied Tools', icon: '🔮', color: 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/40 text-fuchsia-300' },
            { id: 'loshu', label: language === 'hi' ? 'लो-शू ग्रिड' : 'Lo Shu Grid', icon: '🔢', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300' },
            { id: 'astrologers', label: language === 'hi' ? 'AI ज्योतिषी चैट' : 'Chat with Astrologer', icon: '💬', color: 'from-violet-500/20 to-purple-500/20 border-violet-500/40 text-violet-300' },
            { id: 'remedies', label: language === 'hi' ? 'रत्न व उपाय' : 'Astro Remedies', icon: '💎', color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-300' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 min-w-[90px] sm:min-w-[105px] bg-gradient-to-b ${item.color} ${
                activeTab === item.id ? 'ring-2 ring-amber-400 scale-105 shadow-lg shadow-amber-500/10' : 'opacity-80 hover:opacity-100 hover:scale-102'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[11px] font-bold tracking-tight text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE SUPER-APP TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* ==================== TAB 1: KUNDLI ==================== */}
        <TabsContent value="kundli" className="space-y-6 mt-0">
          <KundliChart
            chart={vedicKundli}
            title={language === 'hi' ? 'मेरी वैदिक जन्म कुंडली (D-1 लग्न चार्ट)' : 'My Vedic Natal Kundli (D-1 Lagna Chart)'}
          />

          {/* Planetary Ephemeris Table */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                  {language === 'hi' ? 'वैदिक ग्रह स्पष्ट स्थिति (लाहिड़ी अयनांश)' : 'Vedic Planetary Ephemeris Table'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Lagna: <strong className="text-primary">{vedicKundli.lagna.sign} ({vedicKundli.lagna.degreeFormatted})</strong> • Nakshatra: <strong className="text-foreground">{vedicKundli.lagna.nakshatra} (Pada {vedicKundli.lagna.pada})</strong>
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2.5 py-1 rounded-lg">
                Ayanamsha: {vedicKundli.ayanamsha.toFixed(2)}°
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-2.5 px-3">Grah / Planet</th>
                    <th className="py-2.5 px-3">Rashi / Sign</th>
                    <th className="py-2.5 px-3">Degrees</th>
                    <th className="py-2.5 px-3">Nakshatra & Pada</th>
                    <th className="py-2.5 px-3">House</th>
                    <th className="py-2.5 px-3">Dignity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {vedicKundli.planets.map((p) => (
                    <tr key={p.planet} className="hover:bg-accent/30">
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        {p.planet} {p.isRetrograde ? <span className="text-amber-500 text-[10px]">(Vakri - R)</span> : ''}
                      </td>
                      <td className="py-2.5 px-3">{p.sign}</td>
                      <td className="py-2.5 px-3 font-mono text-primary">{p.degreeFormatted}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{p.nakshatra} (P-{p.pada})</td>
                      <td className="py-2.5 px-3 font-medium">H-{p.house}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.dignity === 'Exalted' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                          p.dignity === 'Debilitated' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                          p.dignity === 'Own Sign' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {p.dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vimshottari Mahadasha Timeline */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                {language === 'hi' ? 'विंशोत्तरी महादशा चक्र (Vimshottari Dasha)' : 'Vimshottari Mahadasha Timeline'}
              </h3>
              <Badge variant="outline" className="text-xs text-primary border-primary/30">
                Active: {vedicKundli.currentDasha.mahadasha} Mahadasha
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {vedicKundli.currentDasha.timeline.map((dasha, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    dasha.isCurrent
                      ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                      : 'border-border bg-card/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground text-sm">{dasha.lord} Mahadasha</span>
                    {dasha.isCurrent && (
                      <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5">CURRENT</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dasha.startDate} → {dasha.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== TAB 2: DAILY HOROSCOPE (PERSONALIZED FOR USER) ==================== */}
        <TabsContent value="rashifal" className="space-y-6 mt-0">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6">
            {/* User's Own Moon Sign Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-primary/15 to-violet-600/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
                  {RASHIS.find((r) => r.id === userMoonSignId)?.icon || '🌙'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                      {language === 'hi' ? 'आपकी जन्म चंद्र राशि' : 'Your Natal Moon Sign'}
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                      AUTO DETECTED
                    </Badge>
                  </div>
                  <h4 className="font-display font-bold text-lg text-foreground">
                    {userMoonSignName} ({RASHIS.find((r) => r.id === userMoonSignId)?.name.hi || userMoonSignName})
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Lagna: <strong className="text-foreground">{userLagnaSign}</strong> • Nakshatra: <strong className="text-primary">{userNakshatra} (Pada {userPada})</strong>
                  </p>
                </div>
              </div>

              {!isUserOwnSign && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRashi(userMoonSignId)}
                  className="text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10 gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'मेरी राशि पर वापस जाएं' : 'Back to My Rashi'}
                </Button>
              )}
            </div>

            {/* Main Active Rashi Daily Prediction Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-violet-500/10 to-transparent border border-amber-500/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeRashiData.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-xl text-foreground">
                        {activeRashiData.name.en} ({activeRashiData.name.hi})
                      </h3>
                      {isUserOwnSign ? (
                        <Badge className="bg-amber-500 text-black font-extrabold text-[10px]">
                          YOUR SIGN (आपकी राशि)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[10px]">
                          EXPLORING SIGN
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lord: <strong className="text-primary">{activeRashiData.ruler}</strong> • Element: {activeRashiData.element} • {activeRashiData.dates}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-black/20 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                  <span className="text-xs text-muted-foreground">Today's Cosmic Score</span>
                  <p className="text-2xl sm:text-3xl font-display font-extrabold text-amber-500">
                    {activeRashiData.score}%
                  </p>
                </div>
              </div>

              {/* Today's Planetary Guidance Paragraph */}
              <div className="p-4 rounded-xl bg-card/80 border border-border/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {language === 'hi' ? 'आज का गृह गोचर संदेश' : "Today's Planetary Transit Message"}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {language === 'hi' ? activeRashiData.forecast.hi : language === 'hinglish' ? activeRashiData.forecast.hinglish : activeRashiData.forecast.en}
                </p>
              </div>

              {/* Score breakdown metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-card border border-border shadow-sm">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">❤️ Love & Harmony</span>
                  <p className="text-base font-bold text-pink-500">{activeRashiData.love}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border shadow-sm">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">💼 Career & Growth</span>
                  <p className="text-base font-bold text-blue-500">{activeRashiData.career}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border shadow-sm">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">🌱 Health & Vitality</span>
                  <p className="text-base font-bold text-emerald-500">{activeRashiData.health}</p>
                </div>
              </div>

              {/* Do's and Don'ts for Today */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'hi' ? 'आज क्या करें (Do’s)' : "Today's Favorable Actions"}</span>
                  </div>
                  <p className="text-muted-foreground">{language === 'hi' ? activeRashiData.dos.hi : activeRashiData.dos.en}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{language === 'hi' ? 'सावधानियां (Don’ts)' : "Things to Avoid"}</span>
                  </div>
                  <p className="text-muted-foreground">{language === 'hi' ? activeRashiData.donts.hi : activeRashiData.donts.en}</p>
                </div>
              </div>

              {/* Lucky Metas */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground bg-black/30 p-3 rounded-xl border border-white/5">
                <span>Lucky Number: <strong className="text-foreground">{activeRashiData.luckyNum}</strong></span>
                <span>Lucky Color: <strong className="text-foreground">{activeRashiData.luckyColor}</strong></span>
                <span>Best Timing: <strong className="text-amber-400">Abhijit Muhurta</strong></span>
              </div>
            </div>

            {/* Check for Other Signs Scroller */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground">
                  {language === 'hi' ? 'अन्य राशियों का राशिफल देखें' : 'Check Horoscope for Other Signs'}
                </h4>
                <span className="text-xs text-muted-foreground">Select any sign below</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {RASHIS.map((r) => {
                  const isSelected = selectedRashi === r.id;
                  const isUserSign = r.id === userMoonSignId;

                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRashi(r.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 shadow-md ring-2 ring-amber-500/40 scale-102'
                          : 'border-border bg-card/60 hover:bg-accent/40'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{r.icon}</span>
                        {isUserSign && (
                          <span className="text-[9px] text-amber-400 font-extrabold bg-amber-500/20 px-1 rounded">YOU</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-foreground truncate mt-0.5">{r.name.en}</span>
                      <span className="text-[10px] text-muted-foreground">({r.name.hi})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ==================== TAB 3: KUNDLI MILAN (GUN MATCHING) ==================== */}
        <TabsContent value="milan" className="space-y-6 mt-0">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#150a2e] to-[#0a0518] border border-pink-500/30 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {language === 'hi' ? 'वैदिक 36-गुण कुंडली मिलान' : 'Vedic 36-Point Ashtakoota Gun Milan'}
                </h3>
                <p className="text-xs text-gray-400">
                  {language === 'hi' ? 'वर और वधू की चंद्र राशि व नक्षत्र से विवाह अनुकूलता जांचें' : 'Check marriage compatibility based on Groom and Bride Moon Signs & Nakshatras'}
                </p>
              </div>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Groom Details */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-blue-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤵</span>
                  <span className="font-bold text-sm text-blue-300">Groom (वर) Details</span>
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Moon Sign (चंद्र राशि)</Label>
                  <select
                    value={groomSign}
                    onChange={(e) => setGroomSign(Number(e.target.value))}
                    className="w-full mt-1 bg-black/50 border border-white/20 rounded-lg p-2 text-xs text-white"
                  >
                    {RASHIS.map((r, idx) => (
                      <option key={r.id} value={idx + 1}>{r.icon} {r.name.en} ({r.name.hi})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Nakshatra (जन्म नक्षत्र)</Label>
                  <select
                    value={groomNakshatra}
                    onChange={(e) => setGroomNakshatra(Number(e.target.value))}
                    className="w-full mt-1 bg-black/50 border border-white/20 rounded-lg p-2 text-xs text-white"
                  >
                    {[
                      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
                      'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
                    ].map((nak, idx) => (
                      <option key={nak} value={idx}>{idx + 1}. {nak}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bride Details */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-pink-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👰</span>
                  <span className="font-bold text-sm text-pink-300">Bride (वधू) Details</span>
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Moon Sign (चंद्र राशि)</Label>
                  <select
                    value={brideSign}
                    onChange={(e) => setBrideSign(Number(e.target.value))}
                    className="w-full mt-1 bg-black/50 border border-white/20 rounded-lg p-2 text-xs text-white"
                  >
                    {RASHIS.map((r, idx) => (
                      <option key={r.id} value={idx + 1}>{r.icon} {r.name.en} ({r.name.hi})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-gray-300">Nakshatra (जन्म नक्षत्र)</Label>
                  <select
                    value={brideNakshatra}
                    onChange={(e) => setBrideNakshatra(Number(e.target.value))}
                    className="w-full mt-1 bg-black/50 border border-white/20 rounded-lg p-2 text-xs text-white"
                  >
                    {[
                      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
                      'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
                      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
                    ].map((nak, idx) => (
                      <option key={nak} value={idx}>{idx + 1}. {nak}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <Button
                onClick={handleCalculateMilan}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {language === 'hi' ? '36 गुण मिलान परिणाम देखें' : 'Calculate 36 Gun Milan Score'}
              </Button>
            </div>

            {/* Results Display */}
            {milanResult && (
              <div className="space-y-4 animate-fade-in border-t border-white/10 pt-6">
                {/* Total Score Badge */}
                <div className="p-4 rounded-2xl bg-black/40 border border-pink-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-xs uppercase text-gray-400 font-bold">Total Gun Milan Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-display font-extrabold text-pink-400">
                        {milanResult.totalScore}
                      </span>
                      <span className="text-gray-400 text-sm">/ 36 Points ({milanResult.percentage}%)</span>
                    </div>
                  </div>
                  <Badge className={`text-xs px-4 py-1.5 rounded-xl font-bold ${
                    milanResult.category === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    milanResult.category === 'Good' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                    'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  }`}>
                    {milanResult.category} Match
                  </Badge>
                </div>

                {/* 8 Kootas Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="py-2 px-3">Koota (कूट)</th>
                        <th className="py-2 px-3">Max</th>
                        <th className="py-2 px-3">Obtained</th>
                        <th className="py-2 px-3">Groom Value</th>
                        <th className="py-2 px-3">Bride Value</th>
                        <th className="py-2 px-3">Analysis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {Object.values(milanResult.kootas).map((k: any) => (
                        <tr key={k.name} className="hover:bg-white/[0.02]">
                          <td className="py-2 px-3 font-semibold text-white">{k.name}</td>
                          <td className="py-2 px-3 text-gray-400">{k.max}</td>
                          <td className="py-2 px-3 font-bold text-pink-300">{k.score}</td>
                          <td className="py-2 px-3 text-blue-300">{k.groomValue}</td>
                          <td className="py-2 px-3 text-pink-300">{k.brideValue}</td>
                          <td className="py-2 px-3 text-gray-300 text-[11px]">{k.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-300 bg-pink-950/30 p-3 rounded-xl border border-pink-500/20 leading-relaxed">
                  💡 <strong>Conclusion:</strong> {milanResult.summary}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ==================== TAB 4: DAILY PANCHANG ==================== */}
        <TabsContent value="panchang" className="space-y-6 mt-0">
          <DailyPanchangWidget />
        </TabsContent>

        {/* ==================== TAB 5: APPLIED NUMEROLOGY & VIBRATION TOOLS ==================== */}
        <TabsContent value="tools" className="space-y-6 mt-0">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  {language === 'hi' ? 'व्यावहारिक अंक व ज्योतिष टूल्स (Applied Tools)' : 'Applied Numerology & Astrology Suite'}
                </h3>
                <p className="text-xs text-muted-foreground">Chaldean name correction, mobile, vehicle, flat resonance & Shani Sade Sati</p>
              </div>
              <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40 text-xs">
                CHALDEAN & VEDIC
              </Badge>
            </div>

            {/* 1. Shani Sade Sati Live Tracker */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              sadeSati.status === 'Free' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className={`w-5 h-5 ${sadeSati.status === 'Free' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span className="font-bold text-sm text-foreground">
                    {language === 'hi' ? 'शनि साढ़े साती स्थिति' : 'Saturn Sade Sati Analysis'} ({userMoonSignName})
                  </span>
                </div>
                <Badge className={sadeSati.status === 'Free' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}>
                  {sadeSati.phaseName[language as keyof typeof sadeSati.phaseName] || sadeSati.phaseName.en}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {sadeSati.description[language as keyof typeof sadeSati.description] || sadeSati.description.en}
              </p>
              <p className="text-xs text-primary pt-1">
                <strong>Remedy:</strong> {sadeSati.remedy[language as keyof typeof sadeSati.remedy] || sadeSati.remedy.en}
              </p>
            </div>

            {/* 2. User Core Identity Pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-purple-600/10 to-transparent border border-fuchsia-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Your Core Resonance: </span>
                <span className="font-bold text-foreground">Mulank {userMulank} • Bhagyank {userBhagyank}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Maturity Number (at 35+): </span>
                <span className="font-bold text-amber-400">Number {userMaturityNumber}</span>
              </div>
            </div>

            {/* 3. Name Correction Calculator */}
            <div className="p-5 rounded-2xl bg-card/60 border border-border space-y-3">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-fuchsia-400" />
                <h4 className="font-bold text-sm text-foreground">
                  {language === 'hi' ? 'नाम कंपन और वर्तनी सुधार (Name Correction)' : 'Name Vibration & Chaldean Spelling Analyzer'}
                </h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={testNameInput}
                  onChange={(e) => setTestNameInput(e.target.value)}
                  placeholder="Enter full name to test vibrations..."
                  className="flex-1 rounded-xl bg-background border-border text-xs"
                />
              </div>
              <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Chaldean Compound: </span>
                  <strong className="text-fuchsia-400 text-sm font-mono">{nameVibration.compound}</strong> → Root: <strong className="text-primary text-sm font-bold">{nameVibration.root}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Ruling Planet: </span>
                  <strong className="text-foreground">{NUMBER_ASSOCIATIONS[nameVibration.root]?.planet.en}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Harmony with Mulank {userMulank}: </span>
                  <strong className={
                    NUMBER_ASSOCIATIONS[userMulank]?.friendlyNumbers.includes(nameVibration.root)
                      ? 'text-emerald-400 font-bold'
                      : NUMBER_ASSOCIATIONS[userMulank]?.enemyNumbers.includes(nameVibration.root)
                      ? 'text-rose-400 font-bold'
                      : 'text-amber-400'
                  }>
                    {NUMBER_ASSOCIATIONS[userMulank]?.friendlyNumbers.includes(nameVibration.root) ? '✨ EXCELLENT HARMONY' : NUMBER_ASSOCIATIONS[userMulank]?.enemyNumbers.includes(nameVibration.root) ? '⚠️ NEEDS CORRECTION' : 'NEUTRAL'}
                  </strong>
                </div>
              </div>
            </div>

            {/* 4. Mobile & Vehicle & House Vibration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mobile Vibration */}
              <div className="p-4 rounded-2xl bg-card/60 border border-border space-y-2.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs text-foreground">Mobile Number</span>
                </div>
                <Input
                  value={testPhoneInput}
                  onChange={(e) => setTestPhoneInput(e.target.value)}
                  className="text-xs bg-background"
                />
                <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/60">
                  <p>Sum: <strong className="text-cyan-400 font-mono">{phoneVibration.compound}</strong> → Total: <strong className="text-foreground">{phoneVibration.root}</strong></p>
                  <p>Ruling: <strong className="text-foreground">{NUMBER_ASSOCIATIONS[phoneVibration.root]?.planet.en}</strong></p>
                </div>
              </div>

              {/* Vehicle Vibration */}
              <div className="p-4 rounded-2xl bg-card/60 border border-border space-y-2.5">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs text-foreground">Vehicle Number</span>
                </div>
                <Input
                  value={testVehicleInput}
                  onChange={(e) => setTestVehicleInput(e.target.value)}
                  className="text-xs bg-background"
                />
                <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/60">
                  <p>Sum: <strong className="text-amber-400 font-mono">{vehicleVibration.compound}</strong> → Total: <strong className="text-foreground">{vehicleVibration.root}</strong></p>
                  <p>Ruling: <strong className="text-foreground">{NUMBER_ASSOCIATIONS[vehicleVibration.root]?.planet.en}</strong></p>
                </div>
              </div>

              {/* House / Flat Vibration */}
              <div className="p-4 rounded-2xl bg-card/60 border border-border space-y-2.5">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-foreground">Flat / House Number</span>
                </div>
                <Input
                  value={testFlatInput}
                  onChange={(e) => setTestFlatInput(e.target.value)}
                  className="text-xs bg-background"
                />
                <div className="text-xs space-y-1 text-muted-foreground pt-1 border-t border-border/60">
                  <p>Sum: <strong className="text-emerald-400 font-mono">{flatVibration.compound}</strong> → Total: <strong className="text-foreground">{flatVibration.root}</strong></p>
                  <p>Ruling: <strong className="text-foreground">{NUMBER_ASSOCIATIONS[flatVibration.root]?.planet.en}</strong></p>
                </div>
              </div>
            </div>

            {/* 5. Baby Name Syllables Recommender */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
                <Baby className="w-4 h-4" />
                <span>
                  {language === 'hi' ? 'जन्म नक्षत्र अनुसार नामकरण नामाक्षर' : 'Baby Name Syllables for Your Nakshatra'} ({userNakshatra})
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {nakshatraLetters.map((syl, i) => (
                  <Badge key={i} className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs px-3 py-1 font-bold">
                    Pada {i + 1}: {syl}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 6. Angel Numbers Portal */}
            <div className="p-5 rounded-2xl bg-card/60 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-sm text-foreground">
                    {language === 'hi' ? 'एंजेल नंबर और ब्रह्मांडीय संकेत' : 'Angel Numbers & Synchronicities'}
                  </h4>
                </div>
                <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/40">
                  TAP TO DECODE
                </Badge>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {Object.keys(ANGEL_NUMBERS).map((numKey) => (
                  <button
                    key={numKey}
                    onClick={() => setSelectedAngelNum(numKey)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedAngelNum === numKey
                        ? 'border-amber-500 bg-amber-500/20 text-amber-400 scale-105'
                        : 'border-border bg-card/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {numKey}
                  </button>
                ))}
              </div>

              {ANGEL_NUMBERS[selectedAngelNum] && (
                <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 text-xs space-y-1">
                  <span className="font-bold text-amber-400">{selectedAngelNum} — {ANGEL_NUMBERS[selectedAngelNum].title}</span>
                  <p className="text-muted-foreground leading-relaxed">
                    {(ANGEL_NUMBERS[selectedAngelNum].meaning as Record<string, string>)[language] || ANGEL_NUMBERS[selectedAngelNum].meaning.en}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ==================== TAB 6: AI ASTROLOGERS (ASTROTALK STYLE) ==================== */}
        <TabsContent value="astrologers" className="space-y-6 mt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  {language === 'hi' ? 'विशेषज्ञ AI ज्योतिषी से परामर्श लें' : 'Chat with Verified AI Astrologers'}
                </h3>
                <p className="text-xs text-muted-foreground">Available 24/7 for instant personalized answers</p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs">
                ● 4 EXPERTS ONLINE
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AI_ASTROLOGERS.map((astro) => (
                <div
                  key={astro.id}
                  className="p-5 rounded-2xl bg-card border border-border shadow-lg flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${astro.avatarBg} flex items-center justify-center text-xl shadow-md shrink-0`}>
                      {astro.avatarText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-foreground truncate">{astro.name}</h4>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          ONLINE
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium">{astro.role}</p>
                      <p className="text-[11px] text-muted-foreground">{astro.exp} • {astro.rating}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {astro.specialties.map((spec) => (
                      <span key={spec} className="text-[10px] px-2 py-0.5 rounded-lg bg-secondary text-secondary-foreground">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <span className="text-[11px] text-muted-foreground">{astro.languages}</span>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/ai-chat?astrologer=${astro.id}`)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl px-4 gap-1.5 shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Chat Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ==================== TAB 7: LO SHU GRID ==================== */}
        <TabsContent value="loshu" className="space-y-6 mt-0">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6">
            <h3 className="font-display font-bold text-lg text-foreground">
              {language === 'hi' ? 'लो-शू ग्रिड और 8 तल विश्लेषण (Lo Shu 3x3 Grid & 8 Planes)' : 'Lo Shu 3x3 Magic Square & 8 Cosmic Planes'}
            </h3>
            
            <div className="max-w-md mx-auto">
              <LoshuGridChart grid={loshuGrid} />
            </div>

            {/* 8 Lo Shu Planes Grid */}
            <div className="border-t border-border pt-4 space-y-3">
              <h4 className="font-bold text-sm text-foreground">
                {language === 'hi' ? '8 लो-शू तलों का विशेष प्रभाव' : '8 Cosmic Planes of Lo Shu Grid'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {LOSHU_PLANES.map((plane) => (
                  <div key={plane.numbers.join('-')} className="p-3.5 rounded-xl bg-card/60 border border-border space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{plane.name[language as keyof typeof plane.name] || plane.name.en}</span>
                      <Badge variant="outline" className="text-[9px] px-1">{plane.direction}</Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {plane.meaning[language as keyof typeof plane.meaning] || plane.meaning.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ==================== TAB 8: ASTRO REMEDIES & GEMSTONES ==================== */}
        <TabsContent value="remedies" className="space-y-6 mt-0">
          <div className="space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-display font-bold text-lg text-foreground">
                {language === 'hi' ? 'वैदिक रत्न, यंत्र व मंत्र उपाय' : 'Vedic Gemstones, Yantra & Mantra Remedies'}
              </h3>
              <p className="text-xs text-muted-foreground">Personalized Upay and gemstones aligned with your numbers and planets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const assoc = NUMBER_ASSOCIATIONS[num];
                if (!assoc) return null;
                return (
                  <div key={num} className="p-4 rounded-2xl bg-card border border-border space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">Number {num} — {assoc.planet.en}</span>
                      <span className="text-xs text-primary font-bold">{assoc.luckyDays.en.join(', ')}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>💎 <strong>Gemstone:</strong> {assoc.gemstone[language as keyof typeof assoc.gemstone] || assoc.gemstone.en}</p>
                      <p>🎨 <strong>Lucky Colors:</strong> {assoc.luckyColors[language as keyof typeof assoc.luckyColors]?.join(', ') || assoc.luckyColors.en.join(', ')}</p>
                      <p className="font-mono text-[11px] text-primary">🕉️ {assoc.mantra}</p>
                      <p className="text-[11px] text-gray-300 pt-1">💡 {assoc.remedy[language as keyof typeof assoc.remedy] || assoc.remedy.en}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AstroSuperAppHub;
