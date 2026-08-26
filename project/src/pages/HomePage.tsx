import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Star, Moon, Sun, Heart, TrendingUp, Users, Quote, X, 
  User as UserIcon, LayoutDashboard, LogOut, ChevronRight, ShieldCheck, 
  Zap, Calendar, HelpCircle, ArrowUpRight, CheckCircle2, ShoppingBag, 
  Compass, Flame, Shield, Award, Eye, Clock, MessageSquare, Play, 
  ChevronDown, ChevronUp, Lock, RefreshCw, Layers, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useSEOSettings } from '@/hooks/useSEOSettings';
import SEO from '@/components/SEO';
import { organizationSchema, websiteSchema, productSchema, faqSchema } from '@/lib/jsonLd';
import { supabase } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { fetchVerifiedTier } from '@/lib/verifyTier';
import { hasAccess } from '@/lib/tiers';
import { useCart } from '@/contexts/CartContext';
import { DailyPanchangWidget } from '@/components/DailyPanchangWidget';
import BlogPreview from '@/components/BlogPreview';

const I18N = {
  en: {
    navReports: 'Report Blueprints',
    navDaily: 'Daily Vibe',
    navStore: 'Cosmic Store',
    navAi: 'AI Astrologers',
    navBlog: 'Wisdom Blog',
    navLogin: 'Login',
    navDashboard: 'My Dashboard',
    navAdmin: 'Admin Portal',
    navLogout: 'Log Out',
    heroBadge: "India's #1 Unified Vedic & Numerology AI Platform",
    heroTitle1: 'Decode Your Destiny with',
    heroTitle2: 'Sacred Mathematics',
    heroSubtitle: 'Combine 5,000-year-old Vedic Janam Kundli with Pythagorean & Chaldean Numerology to discover your true life purpose, wealth cycles, and soul compatibility.',
    heroCta1: 'Unlock Complete Blueprint — ₹499',
    heroCta2: 'Calculate My Core Numbers Free',
    heroUsersRated: '4.9/5 from 25,000+ Seekers',
    calcTitle: 'Live Cosmic Resonance Calculator',
    calcTabNum: 'Numerology Triad',
    calcTabKundli: 'Vedic Janam Kundli',
    calcTabLoshu: 'Lo Shu 8-Planes',
    calcTabGun: '36-Gun Milan',
    calcNameLabel: 'Your Full Birth Name',
    calcDobLabel: 'Date of Birth',
    calcBtn: 'Calculate My Numbers Free',
    calcMulank: 'Mulank (Birth No.)',
    calcBhagyank: 'Bhagyank (Destiny No.)',
    calcNamaank: 'Namaank (Chaldean)',
    calcRuler: 'Governing Planet',
    calcInsight: 'Your Mulank drives your core character while your Bhagyank shapes your ultimate life destination.',
    calcDetailedCta: 'Get 25+ Page Deep Blueprint →',
    blueprintHeading: '10 Hyper-Specialized Report Blueprints',
    blueprintSubtitle: 'From name correction to 10-year career forecasts, each report is engineered using classical algorithms.',
    viewAllReports: 'Explore All 10 Reports →',
    panchangHeading: 'Live Vedic Panchang & Shubh Muhurat',
    panchangSubtitle: 'Daily planetary transits, Choghadiya, and Rahu Kaal computed according to your current location.',
    aiHeading: 'Consult 4 AI Vedic & Numerology Astrologers',
    aiSubtitle: 'Trained on ancient shlokas and modern life matrices for 24/7 personalized cosmic guidance.',
    chatWithAi: 'Start AI Consultation →',
    storeHeading: 'Cosmic Apparel & Energetic Remedies',
    storeSubtitle: 'Heavyweight 240 GSM tees with 24K gold foil sacred geometry, lab-certified gemstones, and energized yantras.',
    visitStore: 'Explore Cosmic Store →',
    faqHeading: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about our astrological calculation methodology.',
    footerTagline: 'Ancient Vedic Wisdom × Modern Artificial Intelligence',
    footerRights: 'All rights reserved.',
  },
  hi: {
    navReports: 'रिपोर्ट ब्लूप्रिंट्स',
    navDaily: 'दैनिक राशिफल',
    navStore: 'कॉस्मिक स्टोर',
    navAi: 'AI ज्योतिषी',
    navBlog: 'ज्ञान ब्लॉग',
    navLogin: 'लॉग इन',
    navDashboard: 'मेरा डैशबोर्ड',
    navAdmin: 'एडमिन पोर्टल',
    navLogout: 'लॉग आउट',
    heroBadge: 'भारत का #1 वैदिक ज्योतिष और अंकशास्त्र AI प्लेटफॉर्म',
    heroTitle1: 'पवित्र अंकों और ग्रहों से जानें',
    heroTitle2: 'अपना संपूर्ण भाग्य',
    heroSubtitle: '5,000 वर्ष पुराने वैदिक जन्म कुण्डली और अंकशास्त्र के संगम से जानें अपना जीवन उद्देश्य, धन योग और विवाह अनुकूलता।',
    heroCta1: 'संपूर्ण 25+ पेज रिपोर्ट अनलॉक करें — ₹499',
    heroCta2: 'निःशुल्क मूलांक व भाग्यांक निकालें',
    heroUsersRated: '25,000+ उपयोगकर्ताओं द्वारा 4.9/5 रेटिंग',
    calcTitle: 'लाइव वैदिक व अंकशास्त्र कैलकुलेटर',
    calcTabNum: 'मूलांक व भाग्यांक',
    calcTabKundli: 'जन्म कुण्डली',
    calcTabLoshu: 'लो-शू ग्रिड',
    calcTabGun: '36-गुण मिलान',
    calcNameLabel: 'आपका पूरा नाम',
    calcDobLabel: 'जन्म तिथि',
    calcBtn: 'मुफ्त में अंक निकालें',
    calcMulank: 'मूलांक (जन्म संख्या)',
    calcBhagyank: 'भाग्यांक (भाग्य संख्या)',
    calcNamaank: 'नामांक (कील्डियन)',
    calcRuler: 'स्वामी ग्रह',
    calcInsight: 'आपका मूलांक आपके स्वभाव को दर्शाता है और भाग्यांक आपके जीवन की परम दिशा तय करता है।',
    calcDetailedCta: 'विस्तृत 25+ पेज रिपोर्ट प्राप्त करें →',
    blueprintHeading: '10 विशेष वैयक्तिकृत रिपोर्ट्स',
    blueprintSubtitle: 'नाम सुधार से लेकर 10 वर्षीय करियर विश्लेषण तक, हर रिपोर्ट प्राचीन वैदिक सूत्रों पर आधारित है।',
    viewAllReports: 'सभी 10 रिपोर्ट्स देखें →',
    panchangHeading: 'दैनिक वैदिक पंचांग एवं शुभ मुहूर्त',
    panchangSubtitle: 'दैनिक तिथि, नक्षत्र, चौघड़िया और राहुकाल का सटीक समय।',
    aiHeading: '4 AI ज्योतिषी आचार्यों से परामर्श लें',
    aiSubtitle: 'प्राचीन वैदिक ज्ञान और आधुनिक जीवन मार्गदर्शन के साथ 24/7 तत्काल उत्तर।',
    chatWithAi: 'AI ज्योतिषी से बात करें →',
    storeHeading: 'मूलांक टी-शर्ट्स एवं सिद्ध रत्न भंडार',
    storeSubtitle: '240 GSM कॉटन, 24K गोल्ड फॉयल मूलांक टी-शर्ट और लैब-प्रमाणित सिद्ध रत्न।',
    visitStore: 'कॉस्मिक स्टोर देखें →',
    faqHeading: 'अक्सर पूछे जाने वाले प्रश्न',
    faqSubtitle: 'हमारी गणना पद्धति और रिपोर्ट से जुड़े सभी सवालों के जवाब।',
    footerTagline: 'प्राचीन वैदिक ज्ञान × आधुनिक आर्टिफिशियल इंटेलिजेंस',
    footerRights: 'सर्वाधिकार सुरक्षित।',
  },
  hinglish: {
    navReports: 'Report Blueprints',
    navDaily: 'Daily Vibe',
    navStore: 'Cosmic Store',
    navAi: 'AI Astrologers',
    navBlog: 'Wisdom Blog',
    navLogin: 'Login',
    navDashboard: 'Mera Dashboard',
    navAdmin: 'Admin Portal',
    navLogout: 'Log Out',
    heroBadge: "India ka #1 Unified Vedic & Numerology AI Platform",
    heroTitle1: 'Apni Destiny Decode Karo with',
    heroTitle2: 'Sacred Mathematics',
    heroSubtitle: '5,000-saal puraani Vedic Janam Kundli aur Chaldean Numerology ke combination se jaano apna career, wealth cycles aur love compatibility.',
    heroCta1: 'Complete 25+ Page Blueprint Unlock Karo — ₹499',
    heroCta2: 'Apne Numbers Free Mein Nikalo',
    heroUsersRated: '4.9/5 from 25,000+ Seekers',
    calcTitle: 'Live Cosmic Resonance Calculator',
    calcTabNum: 'Numerology Triad',
    calcTabKundli: 'Vedic Janam Kundli',
    calcTabLoshu: 'Lo Shu 8-Planes',
    calcTabGun: '36-Gun Milan',
    calcNameLabel: 'Aapka Pura Naam',
    calcDobLabel: 'Date of Birth',
    calcBtn: 'Free Mein Numbers Calculate Karo',
    calcMulank: 'Mulank (Birth No.)',
    calcBhagyank: 'Bhagyank (Destiny No.)',
    calcNamaank: 'Namaank (Chaldean)',
    calcRuler: 'Ruling Planet',
    calcInsight: 'Aapka Mulank aapka nature banata hai aur Bhagyank aapki destiny drive karta hai.',
    calcDetailedCta: '25+ Page Deep Blueprint Paayein →',
    blueprintHeading: '10 Specialized Report Blueprints',
    blueprintSubtitle: 'Name correction se lekar 10-year career forecasts tak, har report classical algorithms se bani hai.',
    viewAllReports: 'Saari 10 Reports Dekhein →',
    panchangHeading: 'Live Vedic Panchang & Shubh Muhurat',
    panchangSubtitle: 'Daily planetary transits, Choghadiya aur Rahu Kaal aapke location ke hisaab se.',
    aiHeading: '4 AI Vedic Astrologers se Consult Karo',
    aiSubtitle: 'Ancient shlokas aur modern matrices par trained for 24/7 instant guidance.',
    chatWithAi: 'AI Astrologer se Baat Karo →',
    storeHeading: 'Cosmic Apparel & Energized Remedies',
    storeSubtitle: '240 GSM heavyweight tees with 24K gold foil prints aur certified gemstones.',
    visitStore: 'Cosmic Store Explore Karo →',
    faqHeading: 'Frequently Asked Questions',
    faqSubtitle: 'Hamare astrological algorithms aur reports ke baare mein sab kuch.',
    footerTagline: 'Ancient Vedic Wisdom × Modern Artificial Intelligence',
    footerRights: 'All rights reserved.',
  }
};

export default function HomePage() {
  const { language } = useLanguage();
  const langKey = (language === 'hi' || language === 'hinglish') ? language : 'en';
  const str = I18N[langKey];

  const { get, getJson, loading } = useSiteContent();
  const { totalItems } = useCart();
  const seo = useSEOSettings();
  const navigate = useNavigate();

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  // Live Instant Calculator State on Hero
  const [calcName, setCalcName] = useState('Arjun Sharma');
  const [calcDob, setCalcDob] = useState('1994-08-19');
  const [calcActiveTab, setCalcActiveTab] = useState<'numerology' | 'kundli' | 'loshu' | 'gunmilan'>('numerology');
  
  // FAQs Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const checkTier = async () => {
      const tier = await fetchVerifiedTier();
      setIsMaster(hasAccess(tier, 'master'));
    };
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
      if (data.session) checkTier(); else setIsMaster(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
      if (session) checkTier(); else setIsMaster(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setIsMaster(false);
    navigate('/');
  };

  // Instant Live Calculator Calculation
  const calcResults = useMemo(() => {
    if (!calcDob) return { mulank: 1, bhagyank: 1, namaank: 1, planet: 'Sun ☀️' };
    const parts = calcDob.split('-');
    const day = parseInt(parts[2] || '1', 10);

    const reduceNum = (n: number): number => {
      let sum = n;
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = String(sum).split('').reduce((a, b) => a + parseInt(b, 10), 0);
      }
      return sum > 9 ? (sum % 9 === 0 ? 9 : sum % 9) : sum;
    };

    const mulank = reduceNum(day);
    const totalDigits = calcDob.replace(/\D/g, '').split('').reduce((a, b) => a + parseInt(b, 10), 0);
    const bhagyank = reduceNum(totalDigits);

    const chaldeanMap: Record<string, number> = {
      A: 1, I: 1, J: 1, Q: 1, Y: 1,
      B: 2, K: 2, R: 2,
      C: 3, G: 3, L: 3, S: 3,
      D: 4, M: 4, T: 4,
      E: 5, H: 5, N: 5, X: 5,
      U: 6, V: 6, W: 6,
      O: 7, Z: 7,
      F: 8, P: 8
    };

    let nameSum = 0;
    (calcName || 'A').toUpperCase().replace(/[^A-Z]/g, '').split('').forEach(ch => {
      nameSum += (chaldeanMap[ch] || 1);
    });
    const namaank = reduceNum(nameSum);

    const planetNames: Record<number, string> = {
      1: 'Sun (Surya) ☀️',
      2: 'Moon (Chandra) 🌙',
      3: 'Jupiter (Brihaspati) ✨',
      4: 'Rahu (North Node) ⚡',
      5: 'Mercury (Budh) 🟢',
      6: 'Venus (Shukra) 💎',
      7: 'Ketu (South Node) 🔮',
      8: 'Saturn (Shani) 🪐',
      9: 'Mars (Mangal) 🔥'
    };

    return {
      mulank,
      bhagyank,
      namaank,
      planet: planetNames[mulank] || 'Sun ☀️'
    };
  }, [calcDob, calcName]);

  const bannerActive = get('banner_active', 'false') === 'true' && !bannerDismissed;
  const bannerText = get('banner_text', '');
  const bannerLink = get('banner_link', '/payment');

  const homeSchema = [
    organizationSchema(),
    websiteSchema(),
    productSchema({ ratingValue: 4.9, reviewCount: 2450 }),
    faqSchema([
      { q: 'What makes AnkJyotish AI unique?', a: 'AnkJyotish AI combines 5,000-year-old Vedic Sidereal Astrology with Western Pythagorean and Chaldean Numerology across 100+ cosmic data points.' },
      { q: 'Can I generate my Janam Kundli and Numerology report for free?', a: 'Yes, your Core Kundli snapshot, Mulank, Bhagyank, Namaank, and Lo Shu Grid analysis are 100% free to view online instantly.' },
      { q: 'How does the 36-Gun Milan matchmaking work?', a: 'Our Vedic engine computes all 8 Ashtakootas to give a verified 36-point marital compatibility score.' },
      { q: 'Are the gemstones and energized apparel certified?', a: 'Yes, all Vedic gemstones are 100% natural and lab-certified, and our Mulank T-Shirts are crafted from 240 GSM combed cotton with 24K gold foil.' }
    ])
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#06020e] text-zinc-100 pb-28 selection:bg-amber-500/30 selection:text-white">
      <SEO
        title="AnkJyotish AI — India's Most Advanced Vedic Astrology & Numerology Platform"
        description="Decode your destiny with AI-powered Vedic Janam Kundli, Lo Shu 8-Planes, 36-Gun Milan, and Chaldean Numerology. Instant 25+ page PDF blueprints."
        keywords="ank jyotish, janam kundli, numerology calculator, mulank bhagyank, chaldean name numerology, lo shu grid, 36 gun milan, vedic astrology online"
        canonical="/"
        schema={homeSchema}
      />

      {/* Announcement Banner */}
      {bannerActive && bannerText && (
        <div className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black text-center py-2 px-4 text-xs font-bold z-30 shadow-md">
          <Link to={bannerLink} className="hover:underline flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {bannerText}
          </Link>
          <button
            onClick={() => setBannerDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#06020e]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <Logo size="sm" showText={true} />
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-zinc-300">
              <Link to="/reports" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
                {str.navReports}
              </Link>
              <Link to="/daily-forecast" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> {str.navDaily}
              </Link>
              <Link to="/shop" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> {str.navStore}
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0 ml-1">New</Badge>
              </Link>
              <Link to="/ai-chat" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" /> {str.navAi}
              </Link>
              <Link to="/blog" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
                {str.navBlog}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/shop" className="relative p-2 text-zinc-300 hover:text-amber-400 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-amber-400 text-black font-bold text-[10px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <LanguageToggle />

            {userEmail ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2 px-3 py-1.5 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                      <UserIcon className="w-3 h-3 text-amber-400" />
                    </span>
                    <span className="hidden sm:inline text-xs font-medium max-w-[120px] truncate">{userEmail}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white min-w-[180px]">
                  <DropdownMenuLabel className="text-xs text-zinc-400">Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer gap-2">
                    <LayoutDashboard className="w-4 h-4 text-amber-400" /> {str.navDashboard}
                  </DropdownMenuItem>
                  {isMaster && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" /> {str.navAdmin}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-red-400 focus:text-red-300">
                    <LogOut className="w-4 h-4" /> {str.navLogout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs text-zinc-300 hover:text-white px-3">
                    {str.navLogin}
                  </Button>
                </Link>
                <Link to="/form">
                  <Button size="sm" className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs px-4 rounded-xl shadow-lg shadow-amber-500/20">
                    Get Free Report
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 max-w-4xl mx-auto mb-12">
          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 px-3.5 py-1.5 text-xs font-semibold rounded-full gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            {str.heroBadge}
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
            {str.heroTitle1} <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              {str.heroTitle2}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {str.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/form" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold text-sm h-13 px-8 rounded-2xl shadow-xl shadow-amber-500/25">
                <Sparkles className="w-4 h-4 mr-2" /> {str.heroCta1}
              </Button>
            </Link>
            <Link to="/free-calculator" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm h-13 px-6 rounded-2xl">
                <Compass className="w-4 h-4 mr-2 text-amber-400" /> {str.heroCta2}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-zinc-400 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {str.heroUsersRated}
          </p>
        </div>

        {/* Live Interactive Hero Calculator Box */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {str.calcTitle}
              </h3>
              <p className="text-xs text-zinc-400">Instant real-time planetary calculation without page reload</p>
            </div>

            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setCalcActiveTab('numerology')}
                className={`px-3 py-1.5 rounded-lg transition-all ${calcActiveTab === 'numerology' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                {str.calcTabNum}
              </button>
              <button
                onClick={() => setCalcActiveTab('kundli')}
                className={`px-3 py-1.5 rounded-lg transition-all ${calcActiveTab === 'kundli' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                {str.calcTabKundli}
              </button>
              <button
                onClick={() => setCalcActiveTab('loshu')}
                className={`px-3 py-1.5 rounded-lg transition-all ${calcActiveTab === 'loshu' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                {str.calcTabLoshu}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-left">
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-zinc-300 font-semibold">{str.calcNameLabel}</Label>
                <Input
                  value={calcName}
                  onChange={(e) => setCalcName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  className="bg-black/50 border-white/15 text-white h-11 rounded-xl mt-1.5"
                />
              </div>

              <div>
                <Label className="text-xs text-zinc-300 font-semibold">{str.calcDobLabel}</Label>
                <Input
                  type="date"
                  value={calcDob}
                  onChange={(e) => setCalcDob(e.target.value)}
                  className="bg-black/50 border-white/15 text-white h-11 rounded-xl mt-1.5"
                />
              </div>

              <Link to="/form">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-11 rounded-xl mt-2">
                  <Sparkles className="w-4 h-4 mr-2" /> {str.calcBtn}
                </Button>
              </Link>
            </div>

            {/* Right Live Results Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/20 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">{str.calcMulank}</p>
                  <p className="text-3xl font-black text-amber-400">{calcResults.mulank}</p>
                </div>
                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">{str.calcBhagyank}</p>
                  <p className="text-3xl font-black text-violet-400">{calcResults.bhagyank}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">{str.calcNamaank}</p>
                  <p className="text-3xl font-black text-blue-400">{calcResults.namaank}</p>
                </div>
              </div>

              <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 space-y-1">
                <p className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" /> {str.calcRuler}: {calcResults.planet}
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {str.calcInsight}
                </p>
              </div>

              <Link to="/form">
                <Button variant="ghost" className="w-full text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 h-9 font-semibold justify-between">
                  <span>{str.calcDetailedCta}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Specialized Blueprint Reports Showcase */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs mb-2">
              Hyper-Specialized Astrological Intelligence
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {str.blueprintHeading}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              {str.blueprintSubtitle}
            </p>
          </div>
          <Link to="/reports">
            <Button variant="outline" className="border-white/20 text-xs text-zinc-300 hover:text-white">
              {str.viewAllReports}
            </Button>
          </Link>
        </div>

        {/* 6 Featured Blueprints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { key: 'name-correction', title: 'Chaldean Name Correction', desc: 'Align your name spelling frequency with your Mulank to remove financial blockages.', price: '₹499', icon: Sparkles, color: 'text-amber-400', link: '/buy/name-correction-report' },
            { key: 'career-numerology', title: 'Career & 10th House Karma', desc: 'Discover high-wealth professions, auspicious promotion cycles, and partnership compatibility.', price: '₹499', icon: TrendingUp, color: 'text-blue-400', link: '/buy/career-numerology-report' },
            { key: 'marriage-report', title: '36-Gun Milan & Marriage Harmony', desc: 'Ashtakoota compatibility analysis to ensure lifetime emotional and spiritual union.', price: '₹499', icon: Heart, color: 'text-rose-400', link: '/buy/marriage-report' },
            { key: 'business-numerology', title: 'Business & Brand Name Alchemy', desc: 'Calculate the numerical vibration of your company name, brand, and logo for explosive growth.', price: '₹499', icon: Shield, color: 'text-emerald-400', link: '/buy/business-numerology-report' },
            { key: 'mobile-numerology', title: 'Mobile & SIM Number Vibration', desc: 'Ensure your 10-digit SIM card generates incoming wealth rather than unexpected expenses.', price: '₹499', icon: Zap, color: 'text-violet-400', link: '/buy/mobile-numerology-report' },
            { key: 'baby-name', title: 'Vedic Baby Name Selection', desc: 'Select the most auspicious starting syllables (Nakshatra Charan) for lifelong prosperity.', price: '₹499', icon: Star, color: 'text-pink-400', link: '/buy/baby-name-report' },
          ].map((rep) => {
            const Icon = rep.icon;
            return (
              <div key={rep.key} className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-amber-500/5 group">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${rep.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{rep.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{rep.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                  <div>
                    <span className="text-xs text-zinc-500 line-through mr-1.5">₹1,999</span>
                    <span className="text-base font-black text-amber-400">{rep.price}</span>
                  </div>
                  <Link to={rep.link}>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs h-8 px-3 rounded-lg">
                      Unlock Report
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Panchang & Shubh Muhurat Widget */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <DailyPanchangWidget />
      </section>

      {/* AI Astrologers Consultation Section */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-950/40 via-amber-950/20 to-black border border-violet-800/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">
              24/7 Cosmic Intelligence
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {str.aiHeading}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {str.aiSubtitle}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="text-xs text-zinc-300 border-white/10">Acharya Vashistha (Vedic)</Badge>
              <Badge variant="outline" className="text-xs text-zinc-300 border-white/10">Dr. Maya (Numerology)</Badge>
              <Badge variant="outline" className="text-xs text-zinc-300 border-white/10">Pandit Radheshyam (Lal Kitab)</Badge>
              <Badge variant="outline" className="text-xs text-zinc-300 border-white/10">Astro Ananya (Career)</Badge>
            </div>
          </div>

          <Link to="/ai-chat">
            <Button size="lg" className="bg-gradient-to-r from-violet-500 to-amber-500 hover:from-violet-600 hover:to-amber-600 text-white font-bold text-sm px-8 h-13 rounded-2xl shadow-xl shadow-violet-500/25 shrink-0">
              <Sparkles className="w-4 h-4 mr-2" /> {str.chatWithAi}
            </Button>
          </Link>
        </div>
      </section>

      {/* D2C Cosmic Apparel Atelier */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs mb-2">
              Sacred Geometry & Remedial Fashion
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              {str.storeHeading}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              {str.storeSubtitle}
            </p>
          </div>
          <Link to="/shop">
            <Button variant="outline" className="border-white/20 text-xs text-zinc-300 hover:text-white">
              {str.visitStore}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="aspect-square rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-amber-400 p-6">
              <Sparkles className="w-16 h-16" />
            </div>
            <div>
              <Badge className="bg-amber-500/20 text-amber-300 text-[10px]">24K Gold Foil</Badge>
              <h3 className="text-lg font-bold text-white mt-1">Mulank Sacred Geometry T-Shirt</h3>
              <p className="text-xs text-zinc-400 mt-1">240 GSM heavy combed cotton tailored to your birth number (1 to 9).</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-black text-amber-400">₹999</span>
              <Link to="/shop"><Button size="sm" className="bg-amber-500 text-black font-bold text-xs">Buy Now</Button></Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="aspect-square rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-blue-400 p-6">
              <Shield className="w-16 h-16" />
            </div>
            <div>
              <Badge className="bg-blue-500/20 text-blue-300 text-[10px]">Lab Certified</Badge>
              <h3 className="text-lg font-bold text-white mt-1">Natural Vedic Gemstones</h3>
              <p className="text-xs text-zinc-400 mt-1">Untreated Blue Sapphire, Burma Ruby, Yellow Sapphire, and Emerald.</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-black text-blue-400">From ₹2,499</span>
              <Link to="/shop"><Button size="sm" className="bg-blue-500 text-white font-bold text-xs">Explore</Button></Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="aspect-square rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-emerald-400 p-6">
              <Heart className="w-16 h-16" />
            </div>
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Nepali Consecrated</Badge>
              <h3 className="text-lg font-bold text-white mt-1">Energized Rudraksha Beads</h3>
              <p className="text-xs text-zinc-400 mt-1">1 to 14 Mukhi authentic Himalayan Rudrakshas energized in Vedic rituals.</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-black text-emerald-400">From ₹799</span>
              <Link to="/shop"><Button size="sm" className="bg-emerald-500 text-black font-bold text-xs">Explore</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wisdom Blog Section */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <BlogPreview />
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto text-left">
        <div className="text-center space-y-2 mb-10">
          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs">
            Clear Answers
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            {str.faqHeading}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            {str.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          {[
            { q: 'What makes AnkJyotish AI unique?', a: 'AnkJyotish AI combines 5,000-year-old Vedic Sidereal Astrology (Lagna Kundli, 12 Bhavas, 9 Grahas, Vimshottari Mahadasha) with Western Pythagorean and Chaldean Numerology, calculating across 100+ cosmic data points.' },
            { q: 'Can I generate my Janam Kundli and Numerology report for free?', a: 'Yes, your Core Kundli snapshot, Mulank, Bhagyank, Namaank, and Lo Shu Grid analysis are 100% free to view online instantly.' },
            { q: 'How does the 36-Gun Milan matchmaking work?', a: 'Our Vedic engine computes all 8 Ashtakootas (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) to give a verified 36-point marital compatibility score.' },
            { q: 'Are the gemstones and energized apparel certified?', a: 'Yes, all Vedic gemstones are 100% natural and lab-certified, and our Mulank T-Shirts are crafted from 240 GSM combed cotton with 24K gold foil sacred geometry.' }
          ].map((faq, i) => (
            <div key={i} className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-white"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
              </button>
              {openFaq === i && (
                <p className="text-xs sm:text-sm text-zinc-300 mt-3 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-12 pb-8 px-4 sm:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800">
          <Logo size="md" showText={true} />
          <p className="text-xs text-zinc-400 text-center md:text-right">
            {str.footerTagline}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AnkJyotish AI. {str.footerRights}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-zinc-300">Terms of Service</Link>
            <Link to="/refund" className="hover:text-zinc-300">Refund Policy</Link>
            <Link to="/contact" className="hover:text-zinc-300">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
