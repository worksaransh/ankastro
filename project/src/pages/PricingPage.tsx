import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import {
  Crown, Star, Check, ShieldCheck, ArrowLeft, ArrowRight, HelpCircle, AlertCircle, Info, Sparkles, MessageSquare, Clock
} from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const isUpgrade = searchParams.get('upgrade') === '1';
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  
  const [user, setUser] = useState<any>(null);
  const [activeTier, setActiveTier] = useState<string>('glimpse');
  const [activeSub, setActiveSub] = useState<boolean>(false);
  const [loadingAccess, setLoadingAccess] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        try {
          // Fetch current tier and active subscription
          const { data } = await supabase.functions.invoke('get-report-tier');
          if (data) {
            setActiveTier(data.tier || 'glimpse');
            setActiveSub(data.hasPlus || false);
          }
        } catch (e) {
          console.warn('Failed to load current access tier:', e);
        }
      }
      setLoadingAccess(false);
    });
  }, []);

  const t = {
    en: {
      title: 'Choose Your Sacred Path',
      subtitle: 'Unlock ancient Vedic & Pythagorean secrets. Pick a one-time lifetime plan or join the daily Plus membership.',
      oneTimeSectionTitle: 'One-Time Lifetime Reports',
      oneTimeSectionDesc: 'Pay once, own forever. Perfect for deep self-analysis and lifetime blueprints.',
      plusSectionTitle: 'Plus Membership Passes',
      plusSectionDesc: 'Recurring passes for daily numbers, daily lucky forecasts, and unlimited AI chat.',
      starterName: 'Starter Plan',
      starterDesc: 'Perfect to understand your basic destiny numbers.',
      proName: 'Pro Plan',
      proDesc: 'Our most popular comprehensive destiny blueprint.',
      masterName: 'Master Plan',
      masterDesc: 'The ultimate cosmic key. Unlocks everything + all 9 individual reports.',
      plusMonthlyName: 'Plus Monthly',
      plusMonthlyDesc: 'Your daily spiritual companion, manual monthly renewal.',
      plusQuarterlyName: 'Plus Quarterly',
      plusQuarterlyDesc: 'Best value daily pass, save 17% equivalent.',
      bestValue: 'Best Value',
      mostPopular: 'Most Popular',
      lifetime: 'Lifetime Access',
      starterPrice: '₹299',
      proPrice: '₹599',
      masterPrice: '₹999',
      plusMonthlyPrice: '₹99',
      plusQuarterlyPrice: '₹249',
      buyNow: 'Unlock Plan',
      joinPlus: 'Join Plus',
      activePlanBadge: 'Active Plan',
      upgradeTitle: '⬆ Upgrade Pricing Active',
      upgradeDesc: 'You will only pay the difference from your prior tier.',
      faqTitle: 'Frequently Asked Questions',
      diffTitle: 'Comparison Matrix',
      backBtn: 'Back',
      featureStarter: [
        '5 Life Pillars (Career, Love, Money, Health, Growth)',
        '12-Month Personalized Forecast Timeline',
        'Vedic Lucky Matrix (numbers, colors, days, directions)',
        'Core Numbers Breakdown (Mulank, Bhagyank, Naamank)',
        'Decision Engine (3 questions)',
        'Shareable Visual Summary Card & Lifetime Access',
      ],
      featurePro: [
        'Everything in Starter Plan included',
        'Complete Lo Shu Grid Matrix & Missing Number Remedies',
        'Karmic Debt Identification (13, 14, 16, 19) & Healing',
        'Famous Personalities Match (compare with 50+ icons)',
        'Personal Day & Personal Month Micro-Forecasts',
        'Decision Engine (unlimited questions)',
        'Instant High-Res One-Pager PDF Download',
        'Full Access to 10 Interactive Vibration Tools',
      ],
      featureMaster: [
        '👑 Everything in Pro Plan included',
        '🔮 4 Life Pinnacles & Challenge Cycles (4 life age phases)',
        '✨ Maturity, Essence & Hidden Passion Numbers',
        '❤️ Love & Marriage Compatibility Report',
        '📈 10-Year Life Roadmap & Career Peak Timing',
        '📖 100+ Page Premium Branded Master PDF Report',
        '💬 15 Free AI Chatbot Sessions (Context-Aware Memory)',
        '🎁 1 Free Family / Friend Bonus Report (₹299 Value)',
      ],
      featurePlus: [
        '✨ Daily Lucky Numbers, Colors & Hourly Timings',
        '📈 Monthly Personal Forecast & Peak Energy Windows',
        '💬 Unlimited AI Numerology Chatbot Access',
        '🏷️ 50% Member Discount on all specialized reports',
        'Manual monthly renewal, zero hidden auto-debits',
      ],
    },
    hi: {
      title: 'अपना पवित्र मार्ग चुनें',
      subtitle: 'प्राचीन वैदिक और पायथागॉरियन रहस्यों को अनलॉक करें। एक बार का आजीवन प्लान चुनें या प्लस सदस्यता में शामिल हों।',
      oneTimeSectionTitle: 'एक-बार की आजीवन रिपोर्ट्स',
      oneTimeSectionDesc: 'एक बार भुगतान करें, हमेशा के लिए रखें। गहन आत्म-विश्लेषण और जीवन के ब्लूप्रिंट के लिए बिल्कुल सही।',
      plusSectionTitle: 'प्लस सदस्यता पासेस',
      plusSectionDesc: 'दैनिक अंक, दैनिक शुभ भविष्यवाणियों और असीमित AI चैट के लिए पासेस।',
      starterName: 'स्टार्टर प्लान',
      starterDesc: 'आपकी बुनियादी भाग्य संख्याओं को समझने के लिए बिल्कुल सही।',
      proName: 'प्रो प्लान',
      proDesc: 'हमारा सबसे लोकप्रिय व्यापक भाग्य ब्लूप्रिंट।',
      masterName: 'मास्टर प्लान',
      masterDesc: 'परम ब्रह्मांडीय कुंजी। सब कुछ + सभी 9 व्यक्तिगत रिपोर्ट्स अनलॉक करता है।',
      plusMonthlyName: 'प्लस मासिक',
      plusMonthlyDesc: 'आपका दैनिक आध्यात्मिक साथी, प्रति माह मैनुअल नवीनीकरण।',
      plusQuarterlyName: 'प्लस तिमाही',
      plusQuarterlyDesc: 'सर्वश्रेष्ठ मूल्य दैनिक पास, 17% की समकक्ष बचत।',
      bestValue: 'सर्वश्रेष्ठ मूल्य',
      mostPopular: 'सबसे लोकप्रिय',
      lifetime: 'आजीवन पहुंच',
      starterPrice: '₹299',
      proPrice: '₹599',
      masterPrice: '₹999',
      plusMonthlyPrice: '₹99',
      plusQuarterlyPrice: '₹249',
      buyNow: 'अनलॉक करें',
      joinPlus: 'प्लस लें',
      activePlanBadge: 'सक्रिय प्लान',
      upgradeTitle: '⬆ अपग्रेड मूल्य निर्धारण सक्रिय',
      upgradeDesc: 'आप केवल अपने पिछले स्तर से अंतर का भुगतान करेंगे।',
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      diffTitle: 'तुलना तालिका',
      backBtn: 'वापस',
      featureStarter: ['बेसिक ब्लूप्रिंट (15+ पृष्ठ)', 'मूलांक और भाग्यांक विश्लेषण', 'वास्तु भाग्यशाली दिशा-निर्देश', 'आजीवन डिजिटल पहुंच'],
      featurePro: ['बेसिक + एडवांस ब्लूप्रिंट (50+ पृष्ठ)', 'विस्तृत वार्षिक पूर्वानुमान समयरेखा', 'वैदिक चक्र संतुलन विश्लेषण', 'ग्रह ऊर्जा उपचार चेकलिस्ट', 'आजीवन डिजिटल पहुंच'],
      featureMaster: ['👑 बेसिक + एडवांस ब्लूप्रिंट शामिल', '🎁 सभी 9 व्यक्तिगत रिपोर्ट्स बिल्कुल मुफ्त (Name Correction, Compatibility, Baby Names, आदि)', '💬 15 फ्री मैसेजेस AI चैट ट्रायल', '✨ व्यक्तिगत ग्रह शांति उपाय', 'आजीवन डिजिटल पहुंच'],
      featurePlus: ['✨ दैनिक शुभ अंक, रंग और समय', '📈 मासिक व्यक्तिगत पूर्वानुमान रिपोर्ट', '💬 असीमित AI अंकज्योतिष चैट', '🏷️ सभी रिपोर्ट्स पर 50% सदस्य छूट', 'मैनुअल नवीनीकरण रिमाइंडर, कभी भी रद्द करें'],
    },
    hinglish: {
      title: 'Choose Your Sacred Path',
      subtitle: 'Unlock ancient Vedic & Pythagorean secrets. Ek baar ka lifetime plan chunein ya daily Plus membership join karein.',
      oneTimeSectionTitle: 'One-Time Lifetime Reports',
      oneTimeSectionDesc: 'Ek baar pay karein, hamesha ke liye access. Deep self-analysis aur lifetime blueprints ke liye perfect.',
      plusSectionTitle: 'Plus Membership Passes',
      plusSectionDesc: 'Daily lucky numbers, daily lucky forecasts, aur unlimited AI chat ke liye manual passes.',
      starterName: 'Starter Plan',
      starterDesc: 'Basic destiny numbers ko samajhne ke liye perfect.',
      proName: 'Pro Plan',
      proDesc: 'Aapka sabse popular comprehensive destiny blueprint.',
      masterName: 'Master Plan',
      masterDesc: 'Ultimate cosmic key. Sab kuch + saari 9 individual reports unlock karta hai.',
      plusMonthlyName: 'Plus Monthly',
      plusMonthlyDesc: 'Aapka daily spiritual companion, manual monthly renewal.',
      plusQuarterlyName: 'Plus Quarterly',
      plusQuarterlyDesc: 'Best value daily pass, save 17% equivalent.',
      bestValue: 'Best Value',
      mostPopular: 'Most Popular',
      lifetime: 'Lifetime Access',
      starterPrice: '₹299',
      proPrice: '₹599',
      masterPrice: '₹999',
      plusMonthlyPrice: '₹99',
      plusQuarterlyPrice: '₹249',
      buyNow: 'Unlock Plan',
      joinPlus: 'Join Plus',
      activePlanBadge: 'Active Plan',
      upgradeTitle: '⬆ Upgrade Pricing Active',
      upgradeDesc: 'Aapko sirf pichle plan se difference pay karna hoga.',
      faqTitle: 'Frequently Asked Questions',
      diffTitle: 'Comparison Matrix',
      backBtn: 'Back',
      featureStarter: ['Basic Blueprint (15+ pages)', 'Mulank & Bhagyank analysis', 'Vastu lucky directions', 'Lifetime digital access'],
      featurePro: ['Basic + Advanced Blueprint (50+ pages)', 'Detailed yearly forecast timeline', 'Vedic chakra balance analysis', 'Grah energy remedies checklist', 'Lifetime digital access'],
      featureMaster: ['👑 Basic + Advanced Blueprints included', '🎁 Saari 9 Individual Reports FREE (Name Correction, Compatibility, Baby Names, etc.)', '💬 15 free messages AI Chat trial', '✨ Personalised planetary remedies', 'Lifetime digital access'],
      featurePlus: ['✨ Daily lucky numbers, colors & timings', '📈 Monthly personal forecast report', '💬 Unlimited AI Numerology Chat', '🏷️ 50% Member Discount on all reports', 'Manual renewal reminder, cancel anytime'],
    }
  };

  const tr = t[language] || t.en;

  const handleSelectOneTime = (tier: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/payment?tier=${tier}${isUpgrade ? '&upgrade=1' : ''}&returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleSelectPlus = (plan: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/plus?plan=${plan}`);
  };

  return (
    <>
      <SEO
        title="Pricing Plans — Ankjyotish"
        description="Choose your numerology plan. Starter, Pro, Master lifetime plans or AnkJyotish Plus subscription for daily guidance and AI chats."
        canonical="/pricing"
        noindex={true}
      />
      <div className="min-h-screen bg-[#07020f] text-gray-100 spiritual-pattern pb-20 relative overflow-hidden">
        {/* Decorative Blur elements */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[110px] pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#07020f]/95 backdrop-blur border-b border-white/5 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/5 gap-2 rounded-xl">
                <ArrowLeft className="w-4 h-4" />
                {tr.backBtn}
              </Button>
            </Link>
            <Logo size="sm" />
          </div>
          <LanguageToggle />
        </header>

        <main className="container mx-auto px-4 py-10 max-w-6xl relative z-10 space-y-12">
          {/* Header Title */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="px-3 py-1 bg-primary/10 border-primary/20 text-primary rounded-full uppercase tracking-wider text-xs">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 animate-pulse" />
              Cosmic Offerings
            </Badge>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              {tr.title}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {tr.subtitle}
            </p>
            {isUpgrade && (
              <div className="inline-flex flex-col items-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 max-w-md mt-2 text-left">
                <p className="text-xs font-bold flex items-center gap-1.5"><Info className="w-4 h-4 shrink-0" /> {tr.upgradeTitle}</p>
                <p className="text-[11px] text-gray-300 mt-0.5">{tr.upgradeDesc}</p>
              </div>
            )}
          </div>

          {/* Pricing Sections Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Section: One-Time Lifetime Tiers */}
            <div className="lg:col-span-7 space-y-6 flex flex-col">
              <div className="space-y-1 pl-1">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  {tr.oneTimeSectionTitle}
                </h2>
                <p className="text-xs text-gray-400">{tr.oneTimeSectionDesc}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch flex-1">
                {/* Starter */}
                <Card className={`glass-card-mystical border-white/5 rounded-2xl flex flex-col justify-between overflow-hidden relative ${
                  activeTier === 'starter' ? 'ring-1 ring-primary' : ''
                }`}>
                  <CardHeader className="pb-3 text-left">
                    <CardTitle className="text-base text-white">{tr.starterName}</CardTitle>
                    <CardDescription className="text-[11px] text-gray-400 min-h-[32px] leading-tight mt-1">{tr.starterDesc}</CardDescription>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-white">{tr.starterPrice}</span>
                      <span className="text-[10px] text-gray-500 block">{tr.lifetime}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 text-left flex-1">
                    <ul className="space-y-2 mt-2">
                      {tr.featureStarter.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    {activeTier === 'starter' || activeTier === 'pro' || activeTier === 'master' ? (
                      <Button disabled className="w-full bg-white/5 border border-white/10 text-gray-400 text-xs py-5 rounded-xl">
                        {activeTier === 'starter' ? tr.activePlanBadge : 'Unlocked'}
                      </Button>
                    ) : (
                      <Button onClick={() => handleSelectOneTime('starter')} className="w-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs py-5 rounded-xl">
                        {tr.buyNow}
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Pro */}
                <Card className={`glass-card-mystical border-primary/30 rounded-2xl flex flex-col justify-between overflow-hidden relative ${
                  activeTier === 'pro' ? 'ring-1 ring-primary' : ''
                }`}>
                  <Badge className="absolute -top-0 right-4 bg-primary text-white text-[9px] px-2 py-0.5 rounded-b-md uppercase font-bold tracking-wider">
                    {tr.mostPopular}
                  </Badge>
                  <CardHeader className="pb-3 text-left">
                    <CardTitle className="text-base text-white">{tr.proName}</CardTitle>
                    <CardDescription className="text-[11px] text-gray-400 min-h-[32px] leading-tight mt-1">{tr.proDesc}</CardDescription>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-white">{tr.proPrice}</span>
                      <span className="text-[10px] text-gray-500 block">{tr.lifetime}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 text-left flex-1">
                    <ul className="space-y-2 mt-2">
                      {tr.featurePro.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    {activeTier === 'pro' || activeTier === 'master' ? (
                      <Button disabled className="w-full bg-white/5 border border-white/10 text-gray-400 text-xs py-5 rounded-xl">
                        {activeTier === 'pro' ? tr.activePlanBadge : 'Unlocked'}
                      </Button>
                    ) : (
                      <Button onClick={() => handleSelectOneTime('pro')} className="w-full bg-primary hover:bg-primary/95 text-white text-xs py-5 rounded-xl shadow-lg shadow-primary/10">
                        {tr.buyNow}
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Master */}
                <Card className={`glow-gold-card rounded-2xl flex flex-col justify-between overflow-hidden relative ${
                  activeTier === 'master' ? 'ring-2 ring-amber-400' : ''
                }`}>
                  <Badge className="absolute -top-0 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] px-2 py-0.5 rounded-b-md uppercase font-bold tracking-wider">
                    {tr.bestValue}
                  </Badge>
                  <CardHeader className="pb-3 text-left">
                    <CardTitle className="text-base text-amber-400 flex items-center gap-1">
                      <Crown className="w-4 h-4 fill-amber-400 shrink-0" />
                      {tr.masterName}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-gray-400 min-h-[32px] leading-tight mt-1">{tr.masterDesc}</CardDescription>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-white">{tr.masterPrice}</span>
                      <span className="text-[10px] text-gray-500 block">{tr.lifetime}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 text-left flex-1">
                    <ul className="space-y-2 mt-2">
                      {tr.featureMaster.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className={f.includes('FREE') ? 'text-amber-400 font-medium' : ''}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    {activeTier === 'master' ? (
                      <Button disabled className="w-full bg-white/5 border border-white/10 text-gray-400 text-xs py-5 rounded-xl">
                        {tr.activePlanBadge}
                      </Button>
                    ) : (
                      <Button onClick={() => handleSelectOneTime('master')} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs py-5 rounded-xl shadow-lg shadow-amber-500/10">
                        {tr.buyNow}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Right Section: Subscription Passes */}
            <div className="lg:col-span-5 space-y-6 flex flex-col">
              <div className="space-y-1 pl-1">
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold fill-gold" />
                  {tr.plusSectionTitle}
                </h2>
                <p className="text-xs text-gray-400">{tr.plusSectionDesc}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch flex-1">
                {/* Plus Monthly */}
                <Card className={`glass-card-mystical border-white/5 rounded-2xl flex flex-col justify-between overflow-hidden relative ${
                  activeSub ? 'ring-1 ring-gold' : ''
                }`}>
                  <CardHeader className="pb-3 text-left">
                    <CardTitle className="text-base text-white">{tr.plusMonthlyName}</CardTitle>
                    <CardDescription className="text-[11px] text-gray-400 min-h-[32px] leading-tight mt-1">{tr.plusMonthlyDesc}</CardDescription>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-white">{tr.plusMonthlyPrice}</span>
                      <span className="text-[10px] text-gray-500 block">/ 30 Days</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 text-left flex-1">
                    <ul className="space-y-2 mt-2">
                      {tr.featurePlus.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className={f.includes('Unlimited') || f.includes('50%') ? 'text-amber-400 font-medium' : ''}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    {activeSub ? (
                      <Button disabled className="w-full bg-white/5 border border-white/10 text-gray-400 text-xs py-5 rounded-xl">
                        {tr.activePlanBadge}
                      </Button>
                    ) : (
                      <Button onClick={() => handleSelectPlus('plus_monthly')} className="w-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs py-5 rounded-xl">
                        {tr.joinPlus}
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Plus Quarterly */}
                <Card className={`glass-card-mystical border-gold/40 rounded-2xl flex flex-col justify-between overflow-hidden relative ${
                  activeSub ? 'ring-1 ring-gold' : ''
                }`}>
                  <Badge className="absolute -top-0 right-4 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-b-md uppercase font-bold tracking-wider">
                    SAVE 17%
                  </Badge>
                  <CardHeader className="pb-3 text-left">
                    <CardTitle className="text-base text-gold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      {tr.plusQuarterlyName}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-gray-400 min-h-[32px] leading-tight mt-1">{tr.plusQuarterlyDesc}</CardDescription>
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-white">{tr.plusQuarterlyPrice}</span>
                      <span className="text-[10px] text-gray-500 block">/ 92 Days</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 text-left flex-1">
                    <ul className="space-y-2 mt-2">
                      {tr.featurePlus.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className={f.includes('Unlimited') || f.includes('50%') ? 'text-gold font-medium' : ''}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4">
                    {activeSub ? (
                      <Button disabled className="w-full bg-white/5 border border-white/10 text-gray-400 text-xs py-5 rounded-xl">
                        {tr.activePlanBadge}
                      </Button>
                    ) : (
                      <Button onClick={() => handleSelectPlus('plus_quarterly')} className="w-full bg-gradient-to-r from-gold via-amber-500 to-gold text-[#0f071f] font-bold text-xs py-5 rounded-xl shadow-lg shadow-gold/10">
                        {tr.joinPlus}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

          {/* Detailed Plan Comparison Section */}
          <div className="pt-8 border-t border-white/5">
            <div className="text-left mb-6">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5.5 h-5.5 text-emerald-400" />
                {tr.diffTitle}
              </h3>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.01]">
              <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-semibold">
                    <th className="p-4">Benefits & Features</th>
                    <th className="p-4">Starter (₹299)</th>
                    <th className="p-4">Pro (₹599)</th>
                    <th className="p-4 text-amber-400">Master (₹999)</th>
                    <th className="p-4 text-gold">Plus Pass (₹99/mo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="p-4 font-medium text-white">Billing Interval</td>
                    <td className="p-4 text-gray-400">One-Time</td>
                    <td className="p-4 text-gray-400">One-Time</td>
                    <td className="p-4 text-amber-400 font-medium">One-Time</td>
                    <td className="p-4 text-gold">30 / 92 Days (Manual)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Basic Report (15+ pages)</td>
                    <td className="p-4 text-emerald-400 font-bold">Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">Yes</td>
                    <td className="p-4 text-gray-500">No (Uses member discount)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Advanced Report (50+ pages)</td>
                    <td className="p-4 text-gray-500">No</td>
                    <td className="p-4 text-emerald-400 font-bold">Yes</td>
                    <td className="p-4 text-emerald-400 font-bold">Yes</td>
                    <td className="p-4 text-gray-500">No (Uses member discount)</td>
                  </tr>
                  <tr className="bg-white/[0.005]">
                    <td className="p-4 font-medium text-white flex items-center gap-1">
                      <span>9 Individual Reports</span>
                      <Badge variant="outline" className="text-[8px] border-amber-500/30 text-amber-400 px-1 py-0 scale-90">Add-ons</Badge>
                    </td>
                    <td className="p-4 text-gray-500">Full Price (₹499 each)</td>
                    <td className="p-4 text-gray-500">Full Price (₹499 each)</td>
                    <td className="p-4 text-emerald-400 font-bold">🎁 ALL 9 FREE FOREVER</td>
                    <td className="p-4 text-emerald-400 font-medium">🏷️ 50% Member Discount</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Daily Lucky forecasts & Widgets</td>
                    <td className="p-4 text-gray-500">No</td>
                    <td className="p-4 text-gray-300">Basic Only</td>
                    <td className="p-4 text-gray-300">Basic Only</td>
                    <td className="p-4 text-emerald-400 font-semibold">Yes (Full Premium)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">AI Chat Assistant</td>
                    <td className="p-4 text-gray-500">No</td>
                    <td className="p-4 text-gray-500">No</td>
                    <td className="p-4 text-amber-400">15-msg free trial</td>
                    <td className="p-4 text-emerald-400 font-bold">💬 Unlimited access</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive FAQs */}
          <div className="pt-8 border-t border-white/5 space-y-6">
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2 text-left">
              <HelpCircle className="w-5.5 h-5.5 text-primary" />
              {tr.faqTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                <h4 className="font-bold text-white text-sm">What is the difference between One-Time Reports and the Plus Membership?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  <b>One-Time Lifetime Plans</b> (Starter, Pro, Master) unlock your primary, comprehensive personality blueprint reports forever. You buy them once and download them anytime. 
                  <b>Plus Membership</b> is a manual, non-recurring subscription pass (30 or 92 days) that gives you ongoing daily luck guidance, daily numbers, and unlimited AI chatting, plus 50% discount on individual reports.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                <h4 className="font-bold text-white text-sm">Will I be charged automatically on my card after the subscription ends?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  <b>No.</b> To respect our users, AnkJyotish uses <b>non-recurring manual billing</b> via Cashfree. When your Plus Monthly or Quarterly pass expires, access will pause, and you will receive a notification to manually renew. There are zero auto-debits or hidden fees.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                <h4 className="font-bold text-white text-sm">I already bought a plan. Can I upgrade to a higher tier?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  <b>Yes.</b> Our system supports upgrade paths. If you previously purchased the Starter or Pro plan, you can upgrade to a higher plan (like Master) at any time. The system will automatically calculate your prior purchase amount and only charge you the difference!
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                <h4 className="font-bold text-white text-sm">How does the 15-message AI Chat Trial work for Master users?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  To help Master users ask questions about their reports without exposing the site to lifetime server/API costs, Master plans include a trial of 15 free AI chat messages. If you wish to continue chatting daily or use it as a personal advisor, you can subscribe to AnkJyotish Plus.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] text-gray-500 text-center max-w-2xl mx-auto pt-6 leading-relaxed">
            All reports are generated instantly via computational numerology and securely saved under your account profile. Transactions are processed securely via Cashfree PG with 256-bit SSL encryption.
          </p>
        </main>
      </div>
    </>
  );
}
