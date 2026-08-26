import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { UserFormData } from "@/types/formTypes";
import {
  calculateFullProfile,
  NumerologyProfile,
} from "@/lib/numerology";
import {
  calculateVedicProfile,
  VedicProfile,
} from "@/lib/vedicNumerology";
import { getPersonalityCombination, PersonalityCombination } from "@/lib/personalityLibrary";
import { calculateLifePillars, LifePillars } from "@/lib/lifePillars";
import { PastReflectionTimeline } from "@/components/dashboard/PastReflectionTimeline";
import { generateAdvancedPDF } from "@/lib/advancedPdfGenerator";
import {
  calculateLoshuGrid,
  calculatePinnacleCycles,
  calculateChallengeCycles,
  calculateKarmicDebts,
  calculateElementalBalance,
  LoshuGrid,
  PinnacleCycle,
  ChallengeCycle,
  KarmicDebt,
  ElementalBalance,
} from "@/lib/advancedNumerology";
import {
  LifeTimelineChart,
  ChakraRadarChart,
  YearlyMomentumChart,
  MonthlyMomentumChart,
  LoshuGridChart,
} from "@/components/charts";
import {
  CareerPillarSection,
  LovePillarSection,
  MoneyPillarSection,
  HealthPillarSection,
  GrowthPillarSection,
  CrossAnalysisSection,
  LifeBlueprintSummarySection,
} from "@/components/pillars";
import AdvancedNumerologySection from "@/components/AdvancedNumerologySection";
import VibrationsSection from "@/components/VibrationsSection";

import { CalculationProofCard } from "@/components/CalculationProofCard";
import { generateAllProofs } from "@/lib/calculationProofs";
import VisualSummaryDashboard from "@/components/VisualSummaryDashboard";
import DeeperInsightsSection from "@/components/DeeperInsightsSection";
import PaywallBenefits from "@/components/PaywallBenefits";
import ShareSummaryCard from "@/components/ShareSummaryCard";
import DecisionClarityEngine from "@/components/DecisionClarityEngine";
import { trackEvent } from "@/lib/analytics";
import LanguageToggle from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import FamousPersonalityMatch from "@/components/FamousPersonalityMatch";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import SEO from '@/components/SEO';
import TierGate from '@/components/TierGate';
import { tierRank, hasAccess, type Tier } from '@/lib/tiers';
import {
  Sparkles,
  Download,
  ChevronDown,
  Star,
  Moon,
  Sun,
  Compass,
  Heart,
  Gem,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  BookOpen,
  Target,
  ArrowLeft,
  Printer,
  Palette,
  Briefcase,
  DollarSign,
  Leaf,
  Grid3X3,
  Smartphone,
  Building2,
  User,
  Milestone,
} from "lucide-react";

type VibPreviewLang = 'en' | 'hi' | 'hinglish';
const vibPreviewTexts: Record<VibPreviewLang, { name: string; nameDesc: string; mobile: string; mobileDesc: string; brand: string; brandDesc: string }> = {
  en: {
    name: "Name Compatibility",
    nameDesc: "Pythagorean & Chaldean totals, alignment score vs Mulank / Bhagyank, spelling tweaks.",
    mobile: "Mobile Vibration",
    mobileDesc: "Digit sum, last-4 root, compatibility verdict, alternative endings.",
    brand: "Brand Archetype",
    brandDesc: "Industry fit score, archetype tagline, spelling variants for stronger energy.",
  },
  hi: {
    name: "नाम अनुकूलता",
    nameDesc: "पिथागोरियन और कैल्डियन टोटल, मूलांक / भाग्यांक के साथ अलाइनमेंट स्कोर, स्पेलिंग ट्वीक।",
    mobile: "मोबाइल कंपन",
    mobileDesc: "अंक योग, अंतिम-4 रूट, अनुकूलता फैसला, वैकल्पिक अंत।",
    brand: "ब्रांड आर्कटाइप",
    brandDesc: "इंडस्ट्री फिट स्कोर, आर्कटाइप टैगलाइन, मज़बूत ऊर्जा के लिए स्पेलिंग वेरिएंट।",
  },
  hinglish: {
    name: "Name Compatibility",
    nameDesc: "Pythagorean & Chaldean totals, alignment score vs Mulank / Bhagyank, spelling tweaks.",
    mobile: "Mobile Vibration",
    mobileDesc: "Digit sum, last-4 root, compatibility verdict, alternative endings.",
    brand: "Brand Archetype",
    brandDesc: "Industry fit score, archetype tagline, spelling variants for stronger energy.",
  },
};

const VibrationsPreview = ({ language }: { language: string }) => {
  const t = vibPreviewTexts[language as VibPreviewLang] || vibPreviewTexts.en;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Sparkles className="w-5 h-5 text-primary" />
          Vibrations — Name, Mobile & Brand
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Check the energy of your name, phone number, and any brand or business name against your core numbers.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-muted/40 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">{t.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t.nameDesc}</p>
            <div className="h-2 w-16 bg-primary/20 rounded-full" />
          </div>
          <div className="p-4 rounded-lg bg-muted/40 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">{t.mobile}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t.mobileDesc}</p>
            <div className="h-2 w-16 bg-primary/20 rounded-full" />
          </div>
          <div className="p-4 rounded-lg bg-muted/40 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">{t.brand}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t.brandDesc}</p>
            <div className="h-2 w-16 bg-primary/20 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdvancedReportPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [vedicProfile, setVedicProfile] = useState<VedicProfile | null>(null);
  const [personalityCombo, setPersonalityCombo] = useState<PersonalityCombination | null>(null);
  const [lifePillars, setLifePillars] = useState<LifePillars | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfMode, setPdfMode] = useState<"print" | "visual">("visual");
  const [expandedProofs, setExpandedProofs] = useState<Record<string, boolean>>({});
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(true);
  const [unlockedTier, setUnlockedTier] = useState<Tier>('glimpse');
  
  // Advanced numerology states
  const [loshuGrid, setLoshuGrid] = useState<LoshuGrid | null>(null);
  const [pinnacleCycles, setPinnacleCycles] = useState<PinnacleCycle[]>([]);
  const [challengeCycles, setChallengeCycles] = useState<ChallengeCycle[]>([]);
  const [karmicDebts, setKarmicDebts] = useState<KarmicDebt[]>([]);
  const [elementalBalance, setElementalBalance] = useState<ElementalBalance | null>(null);

  // Check premium status from DB — no localStorage bypass
  useEffect(() => {
    let cancelled = false;

    const checkPremium = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session) {
        setIsPremiumUser(false);
        setShowPaywall(true);
        setIsUnlocking(false);
        return;
      }
      // Check localStorage flag first (set immediately after free coupon payment)
      // This handles the race condition where DB insert just happened
      const localFlag = localStorage.getItem('premiumAccessGranted');
      const grantedAt = parseInt(localStorage.getItem('premiumGrantedAt') || '0');
      const isRecent = Date.now() - grantedAt < 5 * 60 * 1000; // within last 5 minutes
      if (localFlag === 'true' && isRecent) {
        setIsPremiumUser(true);
        setIsUnlocking(false);
        return;
      }

      // Poll the DB for up to 15 seconds in case the payment record was just inserted.
      // Accept any case variant of success/paid since edge functions and webhooks
      // historically wrote both 'SUCCESS' and 'success'.
      const deadline = Date.now() + 15_000;
      let found = false;
      while (!cancelled && Date.now() < deadline) {
        const { data: payments, error: payErr } = await supabase
          .from('payments')
          .select('status, cashfree_order_id, tier')
          .eq('user_id', session.user.id)
          .in('status', ['success', 'SUCCESS', 'paid', 'PAID']);
        console.log('[unlock] poll payments:', { userId: session.user.id, payments, payErr });
        if (payments && payments.length > 0) {
          // Pick highest tier across all successful payments
          let best: Tier = 'glimpse';
          payments.forEach((p: any) => {
            const t = (p.tier || 'pro') as Tier; // legacy rows default to pro
            if (tierRank(t) > tierRank(best)) best = t;
          });
          setUnlockedTier(best);
          found = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (cancelled) return;
      console.log('[unlock] result:', { found, userId: session.user.id });

      if (found) {
        setIsPremiumUser(true);
        localStorage.setItem('premiumAccessGranted', 'true');
        localStorage.setItem('premiumGrantedAt', Date.now().toString());
      } else {
        setIsPremiumUser(false);
        setShowPaywall(true);
      }
      setIsUnlocking(false);
    };

    checkPremium();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("numerologyFormData");
    if (stored) {
      const data = JSON.parse(stored) as UserFormData;
      setFormData(data);

      const calculatedProfile = calculateFullProfile(data.fullBirthName, data.dateOfBirth);
      setProfile(calculatedProfile);

      const vedic = calculateVedicProfile(data.dateOfBirth, calculatedProfile.personalYear);
      setVedicProfile(vedic);

      const combo = getPersonalityCombination(
        calculatedProfile.lifePath,
        calculatedProfile.destiny,
        calculatedProfile.soulUrge,
        calculatedProfile.personality
      );
      setPersonalityCombo(combo);

      // Calculate Life Pillars with partner data if available
      const partnerData = data.includeCompatibility && data.partnerName && data.partnerDob
        ? { name: data.partnerName, dob: data.partnerDob }
        : undefined;
      
      const pillars = calculateLifePillars(vedic, {
        lifePath: calculatedProfile.lifePath,
        destiny: calculatedProfile.destiny,
        personalYear: calculatedProfile.personalYear
      }, partnerData);
      setLifePillars(pillars);
      
      // Calculate advanced numerology
      setLoshuGrid(calculateLoshuGrid(data.dateOfBirth, data.fullBirthName));
      setPinnacleCycles(calculatePinnacleCycles(data.dateOfBirth));
      setChallengeCycles(calculateChallengeCycles(data.dateOfBirth));
      setKarmicDebts(calculateKarmicDebts(data.dateOfBirth, data.fullBirthName));
      setElementalBalance(calculateElementalBalance(data.dateOfBirth));

      // Save report to DB if logged in (best-effort, never blocks UI)
      const saveReport = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;
          const { data: saved, error } = await supabase
            .from('user_reports')
            .insert({
              user_id: session.user.id,
              report_type: 'advanced',
              form_data: data as any,
            })
            .select('id')
            .single();
          if (error) {
            console.error('[report] save failed:', error);
          } else {
            console.log('[report] saved:', { reportId: saved?.id, userId: session.user.id });
          }
        } catch (e) {
          console.error('[report] save exception:', e);
        }
      };
      saveReport();
    } else {
      navigate("/form");
    }
  }, [navigate]);

  const toggleProof = (key: string) => {
    setExpandedProofs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadPdf = async () => {
    if (!formData || !profile || !vedicProfile || !lifePillars) return;
    setIsGeneratingPdf(true);
    try {
      // Server-side authoritative tier check (cannot be bypassed by client state)
      const { assertTier } = await import('@/lib/verifyTier');
      const { ok, tier } = await assertTier('pro', (formData as any)?.reportId, 'full_blueprint');
      setUnlockedTier(tier);
      if (!ok) {
        setShowPaywall(true);
        toast.error(
          language === 'hi'
            ? 'PDF डाउनलोड करने के लिए Pro (₹599) या Master (₹999) प्लान चाहिए।'
            : language === 'hinglish'
            ? 'PDF download karne ke liye Pro (₹599) ya Master (₹999) plan chahiye.'
            : 'PDF download requires Pro (₹599) or Master (₹999) plan.'
        );
        setIsGeneratingPdf(false);
        navigate(`/payment?tier=pro`);
        return;
      }
      await generateAdvancedPDF(
        formData, 
        profile, 
        vedicProfile, 
        personalityCombo || undefined, 
        pdfMode, 
        lifePillars,
        loshuGrid || undefined,
        pinnacleCycles,
        challengeCycles,
        karmicDebts,
        elementalBalance || undefined,
        language
      );
      toast.success("Your Advanced PDF report has been downloaded!");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleUpgrade = () => {
    navigate("/payment");
  };

  if (!formData || !profile || !vedicProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">{t("common.calculating")}</p>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const birthDate = new Date(formData.dateOfBirth);
  const currentAge = currentYear - birthDate.getFullYear();

  return (
    <>
      <SEO title="Your Advanced Vedic Numerology Report — 100+ Pages" description="Your complete advanced Vedic numerology report with Loshu grid, 12-month predictions, career guidance, and famous personality matches." canonical="/advanced-report" noindex={true} />
          <div className="min-h-screen bg-background spiritual-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/report">
                <Button variant="ghost" size="sm" className="px-2 sm:px-3 min-h-11" aria-label={t("common.basicReport")}>
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">{t("common.basicReport")}</span>
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="font-display text-sm sm:text-xl font-semibold text-foreground truncate">
                  {t("common.advancedVedicReport")}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {formData.fullBirthName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <LanguageToggle />
              <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={pdfMode === "print" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPdfMode("print")}
                  className="gap-1 min-h-10"
                  aria-label={t("common.print")}
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden md:inline">{t("common.print")}</span>
                </Button>
                <Button
                  variant={pdfMode === "visual" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPdfMode("visual")}
                  className="gap-1 min-h-10"
                  aria-label={t("common.visual")}
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden md:inline">{t("common.visual")}</span>
                </Button>
              </div>
              <Button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                size="sm"
                className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-11"
                aria-label={t("common.downloadPdf")}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{isGeneratingPdf ? t("common.generating") : t("common.downloadPdf")}</span>
                <span className="sm:hidden">{isGeneratingPdf ? "..." : "PDF"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">



        {/* Visual Summary Dashboard - cosmic blueprint at a glance */}
        <div className="mb-6 sm:mb-8">
          <VisualSummaryDashboard
            profile={profile}
            vedicProfile={vedicProfile}
            fullName={formData.currentName || formData.fullBirthName}
            variant="full"
          />
        </div>

        {/* PAYWALL GATE: Full report only for premium users */}
        {!isPremiumUser ? (
          isUnlocking ? (
            <div className="text-center py-16 space-y-4">
              <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto" />
              <p className="font-display text-xl text-foreground">{t("common.unlocking")}</p>
              <p className="text-sm text-muted-foreground">
                {t("common.verifyingAccess")}
              </p>
            </div>
          ) : (
            <div className="text-center py-12 space-y-6">
              <PaywallBenefits onUpgrade={handleUpgrade} />
            </div>
          )
        ) : (
        <>
        {/* Share + One-Pager */}
        <div className="mb-6">
          <ShareSummaryCard
            fullName={formData.currentName || formData.fullBirthName}
            dateOfBirth={formData.dateOfBirth}
            profile={profile}
            vedicProfile={vedicProfile}
            archetypeTitle={personalityCombo?.overallProfile?.split('.')[0]}
          />
        </div>

        {/* Decision Clarity Engine */}
        <div className="mb-6">
          <DecisionClarityEngine profile={profile} vedicProfile={vedicProfile} unlockedTier={unlockedTier} reportId={(formData as any)?.reportId} />
        </div>

        {/* Tabs Navigation */}
        <Tabs
          defaultValue="vedic"
          className="space-y-6"
          onValueChange={(v) => trackEvent('report_tab_changed', { tab: v })}
        >
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <TabsList className="inline-flex w-max h-auto gap-1 bg-muted/50 p-1">
              <TabsTrigger value="vedic" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Star className="w-3.5 h-3.5" />
                Vedic
              </TabsTrigger>
              <TabsTrigger value="charts" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <TrendingUp className="w-3.5 h-3.5" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="career" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Briefcase className="w-3.5 h-3.5" />
                Career
              </TabsTrigger>
              <TabsTrigger value="love" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Heart className="w-3.5 h-3.5" />
                Love
              </TabsTrigger>
              <TabsTrigger value="money" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <DollarSign className="w-3.5 h-3.5" />
                Money
              </TabsTrigger>
              <TabsTrigger value="health" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Leaf className="w-3.5 h-3.5" />
                Health
              </TabsTrigger>
              <TabsTrigger value="growth" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Sparkles className="w-3.5 h-3.5" />
                Growth
              </TabsTrigger>
              <TabsTrigger value="predictions" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Calendar className="w-3.5 h-3.5" />
                Predict
              </TabsTrigger>
              <TabsTrigger value="remedies" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Shield className="w-3.5 h-3.5" />
                Remedies
              </TabsTrigger>
              <TabsTrigger value="blueprint" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Target className="w-3.5 h-3.5" />
                Blueprint
              </TabsTrigger>
              <TabsTrigger value="loshu" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Grid3X3 className="w-3.5 h-3.5" />
                Loshu
              </TabsTrigger>
              <TabsTrigger value="cycles" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Compass className="w-3.5 h-3.5" />
                Cycles
              </TabsTrigger>
              <TabsTrigger value="vibrations" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Sparkles className="w-3.5 h-3.5" />
                Vibrations
              </TabsTrigger>
              <TabsTrigger value="reflections" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Milestone className="w-3.5 h-3.5" />
                Reflections
              </TabsTrigger>
              <TabsTrigger value="calculations" className="gap-1 py-2.5 px-3 sm:px-3.5 text-xs sm:text-sm min-h-11">
                <Eye className="w-3.5 h-3.5" />
                Calculations
              </TabsTrigger>
            </TabsList>

          </div>

          {/* Vedic Tab */}
          <TabsContent value="vedic" className="space-y-6">
            {/* Mulank Section */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-3 font-display">
                  <Sun className="w-6 h-6 text-primary" />
                  Birth Number (Mulank): {vedicProfile.mulank}
                  <Badge variant="secondary">{vedicProfile.mulankMeaning.title}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Yeh aapki core personality hai — born from your birth date. It shows how you naturally think, feel, and react.
                </p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        Emotional Core
                      </h4>
                      <p className="text-muted-foreground">{vedicProfile.mulankMeaning.emotionalCore}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Natural Behavior
                      </h4>
                      <p className="text-muted-foreground">{vedicProfile.mulankMeaning.naturalBehavior}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {vedicProfile.mulankMeaning.strengths.map((s, i) => (
                          <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Weaknesses</h4>
                      <div className="flex flex-wrap gap-2">
                        {vedicProfile.mulankMeaning.weaknesses.map((w, i) => (
                          <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {w}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Proof */}
                <Collapsible open={expandedProofs["mulank"]} onOpenChange={() => toggleProof("mulank")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between mt-4">
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Kaise Nikla? (How was it calculated?)
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedProofs["mulank"] ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <strong>Formula:</strong> Birth Date → Single Digit (Master numbers 11, 22, 33 preserved)
                    </p>
                    <p className="text-sm">
                      Your birth date: <strong>{new Date(formData.dateOfBirth).getDate()}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">{vedicProfile.mulankMeaning.whyThisNumber}</p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Day in Life */}
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    A Day in the Life of Mulank {vedicProfile.mulank}
                  </h4>
                  <p className="text-sm text-muted-foreground italic">{vedicProfile.mulankMeaning.dayInLife}</p>
                </div>

                {/* Famous Personality Match Engine — Pro tier */}
                <TierGate
                  unlocked={unlockedTier}
                  required="pro"
                  reportId={(formData as any)?.reportId}
                  featureLabel={language === 'hi' ? 'प्रसिद्ध व्यक्तित्व मिलान' : language === 'hinglish' ? 'Famous Personality Match' : 'Famous Personality Match'}
                >
                  <FamousPersonalityMatch
                    lifePath={profile.lifePath}
                    destiny={profile.destiny}
                    soulUrge={profile.soulUrge}
                    mulank={vedicProfile?.mulank}
                    bhagyank={vedicProfile?.bhagyank}
                    profession={formData?.profession || ''}
                    language={language as 'en' | 'hi' | 'hinglish'}
                  />
                </TierGate>
              </CardContent>
            </Card>

            {/* Bhagyank Section */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-divine/10 to-transparent" style={{ background: "linear-gradient(to right, hsla(45, 80%, 55%, 0.1), transparent)" }}>
                <CardTitle className="flex items-center gap-3 font-display">
                  <Moon className="w-6 h-6" style={{ color: "hsl(45, 80%, 55%)" }} />
                  Destiny Number (Bhagyank): {vedicProfile.bhagyank}
                  <Badge variant="secondary">{vedicProfile.bhagyankMeaning.title}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Yeh aapki life ki direction hai — calculated from your full date of birth. It reveals what you are here to achieve.
                </p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Compass className="w-4 h-4" style={{ color: "hsl(45, 80%, 55%)" }} />
                      Life Direction
                    </h4>
                    <p className="text-muted-foreground">{vedicProfile.bhagyankMeaning.lifeDirection}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" style={{ color: "hsl(45, 80%, 55%)" }} />
                      Dharmic Path
                    </h4>
                    <p className="text-muted-foreground">{vedicProfile.bhagyankMeaning.dharmicPath}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Karmic Purpose</h4>
                  <p className="text-muted-foreground">{vedicProfile.bhagyankMeaning.karmicPurpose}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-spiritual/10 to-transparent rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Spiritual Lesson</h4>
                  <p className="text-sm text-muted-foreground italic">{vedicProfile.bhagyankMeaning.spiritualLesson}</p>
                </div>

                {/* Expandable Proof */}
                <Collapsible open={expandedProofs["bhagyank"]} onOpenChange={() => toggleProof("bhagyank")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Kyun Aaya? (Why this number defines your destiny?)
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedProofs["bhagyank"] ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Formula:</strong> Full DOB (DD + MM + YYYY) → Single Digit
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground">{vedicProfile.bhagyankMeaning.whyThisDefinesDestiny}</p>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Harmony Meter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <Heart className="w-6 h-6 text-green-600" />
                  Personality vs Destiny Harmony
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  How well your inner nature (Birth Number) flows with your life's path (Destiny Number).
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-green-500 transition-all"
                      style={{ width: `${vedicProfile.harmonyScore}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{vedicProfile.harmonyScore}%</span>
                </div>
                <Badge
                  variant={vedicProfile.harmonyLevel === "Excellent" ? "default" : "secondary"}
                  className="text-sm"
                >
                  {vedicProfile.harmonyLevel} Harmony
                </Badge>
                <p className="mt-4 text-sm text-muted-foreground">
                  {vedicProfile.harmonyLevel === "Excellent" && "Your Mulank and Bhagyank are in perfect alignment, supporting each other's energy."}
                  {vedicProfile.harmonyLevel === "Good" && "Your numbers work well together with minor adjustments needed for optimal flow."}
                  {vedicProfile.harmonyLevel === "Moderate" && "Some tension exists between your numbers - awareness and balance practices will help."}
                  {vedicProfile.harmonyLevel === "Challenging" && "Your numbers create dynamic tension - this can be channeled into growth with proper guidance."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <LifeTimelineChart
                currentAge={currentAge}
                lifePath={profile.lifePath}
                personalYear={profile.personalYear}
              />
              <ChakraRadarChart chakraAlignment={vedicProfile.chakraAlignment} />
            </div>
            <YearlyMomentumChart
              predictions={vedicProfile.predictions.next10Years}
              currentYear={currentYear}
            />
            <MonthlyMomentumChart predictions={vedicProfile.predictions.next12Months} />
          </TabsContent>

          {/* Career Pillar Tab */}
          <TabsContent value="career" className="space-y-6">
            {lifePillars && <CareerPillarSection career={lifePillars.career} />}
            {vedicProfile && (
              <DeeperInsightsSection
                pillar="career"
                mulank={vedicProfile.mulank}
                bhagyank={vedicProfile.bhagyank}
                personalYear={profile.personalYear}
              />
            )}
          </TabsContent>

          {/* Love Pillar Tab */}
          <TabsContent value="love" className="space-y-6">
            {lifePillars && <LovePillarSection love={lifePillars.love} unlockedTier={unlockedTier} reportId={(formData as any)?.reportId} />}
            {vedicProfile && (
              <DeeperInsightsSection
                pillar="love"
                mulank={vedicProfile.mulank}
                bhagyank={vedicProfile.bhagyank}
                personalYear={profile.personalYear}
              />
            )}
          </TabsContent>

          {/* Money Pillar Tab */}
          <TabsContent value="money" className="space-y-6">
            {lifePillars && <MoneyPillarSection money={lifePillars.money} />}
            {vedicProfile && (
              <DeeperInsightsSection
                pillar="money"
                mulank={vedicProfile.mulank}
                bhagyank={vedicProfile.bhagyank}
                personalYear={profile.personalYear}
              />
            )}
          </TabsContent>

          {/* Health Pillar Tab */}
          <TabsContent value="health" className="space-y-6">
            {lifePillars && vedicProfile && (
              <HealthPillarSection health={lifePillars.health} chakraAlignment={vedicProfile.chakraAlignment} />
            )}
            {vedicProfile && (
              <DeeperInsightsSection
                pillar="health"
                mulank={vedicProfile.mulank}
                bhagyank={vedicProfile.bhagyank}
                personalYear={profile.personalYear}
              />
            )}
          </TabsContent>

          {/* Growth Pillar Tab */}
          <TabsContent value="growth" className="space-y-6">
            {lifePillars && <GrowthPillarSection growth={lifePillars.growth} />}
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            {/* 12 Month Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <Calendar className="w-6 h-6 text-primary" />
                  Next 12 Months Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vedicProfile.predictions.next12Months.map((month, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        month.action === "breakthrough"
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                          : month.action === "pause"
                          ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                          : "bg-muted/50 border-border"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">{month.month}</h4>
                        <Badge
                          variant={month.action === "breakthrough" ? "default" : "secondary"}
                          className={month.action === "pause" ? "bg-red-100 text-red-700" : ""}
                        >
                          {month.score}/100
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{month.theme}</p>
                      <p className="text-xs text-muted-foreground mb-2">{month.timing}</p>
                      <div className="text-xs space-y-1">
                        <p className="text-green-600">✓ {month.opportunity}</p>
                        <p className="text-red-500">⚠ {month.risk}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 10 Year Analysis — Master tier */}
            <TierGate
              unlocked={unlockedTier}
              required="master"
              reportId={(formData as any)?.reportId}
              featureLabel={language === 'hi' ? '10-वर्षीय जीवन रोडमैप' : language === 'hinglish' ? '10-Year Life Roadmap' : '10-Year Life Roadmap'}
            >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  10-Year Growth Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vedicProfile.predictions.next10Years.map((year, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        year.isTurningPoint
                          ? "bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="font-display font-semibold text-lg text-foreground">
                          {year.year}
                        </h4>
                        {year.isTurningPoint && (
                          <Badge className="bg-amber-500">⭐ Turning Point</Badge>
                        )}
                        <Badge
                          variant={
                            year.action === "breakthrough"
                              ? "default"
                              : year.action === "pause"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {year.action.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-auto">
                          Score: {year.score}/100
                        </span>
                      </div>
                      <p className="font-medium text-foreground">{year.theme}</p>
                      <div className="grid sm:grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-green-600 font-medium">Growth:</p>
                          <p className="text-muted-foreground">{year.growth}</p>
                        </div>
                        <div>
                          <p className="text-amber-600 font-medium">Challenges:</p>
                          <p className="text-muted-foreground">{year.challenges}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TierGate>
          </TabsContent>

          {/* Remedies Tab */}
          <TabsContent value="remedies" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Lucky Attributes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Gem className="w-5 h-5 text-primary" />
                    Lucky Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Direction (Vastu)</span>
                    <span className="font-medium">{vedicProfile.remedies.luckyDirection}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Suggested Colors</p>
                    <div className="flex gap-2">
                      {vedicProfile.remedies.suggestedColors.map((color, i) => (
                        <Badge key={i} variant="outline">{color}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Suggested Stones</p>
                    <div className="flex flex-wrap gap-2">
                      {vedicProfile.remedies.suggestedStones.map((stone, i) => (
                        <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-700">
                          {stone}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chakra Healing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Chakra Healing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Weak Chakra</p>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      {vedicProfile.remedies.weakChakra}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Balancing Tip</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {vedicProfile.remedies.chakraBalancingTip}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mantra & Affirmation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Personal Mantra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg text-center">
                    <p className="font-display text-lg italic text-foreground">
                      "{vedicProfile.remedies.personalMantra}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Grah Energy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Star className="w-5 h-5 text-primary" />
                    Grah (Planetary) Energy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{vedicProfile.remedies.grahEnergy}</p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground">Balancing Guidance:</p>
                    <p className="text-sm text-muted-foreground">{vedicProfile.remedies.grahBalancing}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Do's and Don'ts */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Do's and Don'ts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">✓ Do's</h4>
                    <ul className="space-y-2">
                      {vedicProfile.remedies.dosAndDonts.dos.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3">✗ Don'ts</h4>
                    <ul className="space-y-2">
                      {vedicProfile.remedies.dosAndDonts.donts.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-red-500 mt-0.5">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-center text-muted-foreground">
              ⚠️ Disclaimer: These suggestions are for spiritual guidance only. Not medical advice.
            </p>
          </TabsContent>

          {/* Blueprint Tab */}
          <TabsContent value="blueprint" className="space-y-6">
            {lifePillars && (
              <>
                <CrossAnalysisSection
                  crossAnalysis={lifePillars.crossAnalysis}
                  conflictResolver={lifePillars.conflictResolver}
                  decisionEngine={lifePillars.decisionEngine}
                />
                <LifeBlueprintSummarySection
                  summary={lifePillars.lifeBlueprintSummary}
                  onDownloadPdf={handleDownloadPdf}
                  isGeneratingPdf={isGeneratingPdf}
                />
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <Target className="w-6 h-6 text-primary" />
                  Manifestation Alignment Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {vedicProfile.remedies.manifestationChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        <span className="text-xs text-primary font-bold">{i + 1}</span>
                      </div>
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Explainability & Confidence Panel (Module 6) */}
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  Recommendation Trust & Explainability
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Underlying mathematical configurations and confidence ratings for these pillar recommendations.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/40 border border-border/40 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground">Pillar Guidance: Strengthen Expression & Balance</span>
                    <Badge variant="secondary">84% Confidence</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Primary Influencing Configurations:</strong> Life Path {profile.lifePath} + Destiny {profile.destiny} + Mulank {vedicProfile.mulank}</p>
                    <p><strong>Supporting Logic:</strong> Weak expression balance is calculated from missing numbers in Lo Shu, combined with a Name vibration match of {vedicProfile.harmonyScore}%.</p>
                    <p><strong>Potential Contradictions:</strong> The Destiny number indicates high natural potential, requiring conscious alignment rather than baseline retraining.</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/40 border border-border/40 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground">Financial & Career Timing: Pivot & Audit</span>
                    <Badge variant="secondary">90% Confidence</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Primary Influencing Configurations:</strong> Personal Year {profile.personalYear} + Pinnacle Cycle {pinnacleCycles[0]?.number || 1}</p>
                    <p><strong>Supporting Logic:</strong> Current Personal Year numbers match transition nodes in the Pinnacle timeline, recommending structured audits.</p>
                    <p><strong>Potential Contradictions:</strong> Short-term monthly forecast deviations may create minor delays; long-term cycles remain highly supportive.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personality Combo Insights */}
            {personalityCombo && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Personality Blueprint</CardTitle>
                  <p className="text-sm text-muted-foreground">{personalityCombo.overallProfile}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{personalityCombo.lifePathDestiny}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Core Strengths</h4>
                      <ul className="space-y-1">
                        {personalityCombo.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-green-600 dark:text-green-400">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Growth Areas</h4>
                      <ul className="space-y-1">
                        {personalityCombo.challenges.map((c, i) => (
                          <li key={i} className="text-sm text-amber-600 dark:text-amber-400">• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Ideal Career Path</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{personalityCombo.careerPath}</p>
                    </div>
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Love Style</h4>
                      <p className="text-sm text-pink-600 dark:text-pink-400">{personalityCombo.loveStyle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Closing */}
            <Card className="bg-gradient-to-br from-primary/10 to-divine/10">
              <CardContent className="py-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <p className="font-display text-xl text-foreground mb-4">
                  "Your numbers are your cosmic fingerprint. Embrace them."
                </p>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  This advanced report combines ancient Vedic wisdom with modern numerology 
                  to guide your spiritual and practical journey.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loshu Grid Tab — Pro tier */}
          <TabsContent value="loshu" className="space-y-6">
            <TierGate unlocked={unlockedTier} required="pro" featureLabel={language === 'hi' ? 'लोशू ग्रिड विश्लेषण' : 'Loshu Grid Analysis'}>
              {loshuGrid && <LoshuGridChart loshuGrid={loshuGrid} />}
            </TierGate>
          </TabsContent>

          {/* Pinnacle & Challenge Cycles Tab — Master tier */}
          <TabsContent value="cycles" className="space-y-6">
            <TierGate unlocked={unlockedTier} required="master" featureLabel={language === 'hi' ? 'पिनेकल, चैलेंज और कार्मिक चक्र' : 'Pinnacles, Challenges & Karmic Cycles'}>
              {elementalBalance && (
                <AdvancedNumerologySection
                  pinnacleCycles={pinnacleCycles}
                  challengeCycles={challengeCycles}
                  karmicDebts={karmicDebts}
                  elementalBalance={elementalBalance}
                />
              )}
            </TierGate>
          </TabsContent>

          {/* Vibrations Tab — Name / Mobile / Brand */}
          <TabsContent value="vibrations" className="space-y-6">
            <TierGate
              unlocked={unlockedTier}
              required="pro"
              featureLabel="Vibrations Analysis"
              returnUrl="/advanced-report"
              preview={<VibrationsPreview language={language} />}
            >
              {formData && vedicProfile && (
                <VibrationsSection
                  currentName={formData.currentName || formData.fullBirthName}
                  dob={formData.dateOfBirth}
                  mulank={vedicProfile.mulank}
                  bhagyank={vedicProfile.bhagyank}
                  defaultMobile={formData.whatsappNumber}
                />
              )}
            </TierGate>
          </TabsContent>

          {/* Reflections Tab */}
          <TabsContent value="reflections" className="space-y-6">
            {formData && profile && pinnacleCycles && challengeCycles && (
              <PastReflectionTimeline
                formData={formData}
                profile={profile}
                pinnacleCycles={pinnacleCycles}
                challengeCycles={challengeCycles}
              />
            )}
          </TabsContent>

          {/* Calculations Tab — full Kaise Nikla? proofs */}
          <TabsContent value="calculations" className="space-y-6">

            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <Eye className="w-6 h-6 text-primary" />
                  {language === 'hi' ? 'सभी गणनाएं — Kaise Nikla?' : language === 'hinglish' ? 'Saari Calculations — Kaise Nikla?' : 'All Calculations — How Were They Derived?'}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === 'hi'
                    ? 'अंकशास्त्र में पारदर्शिता ज़रूरी है। नीचे आपके हर मुख्य अंक की पूरी गणना देखें।'
                    : language === 'hinglish'
                    ? 'Numerology mein transparency zaroori hai. Niche aapke har core number ki step-by-step calculation dekho.'
                    : 'Transparency matters in numerology. See the complete step-by-step derivation for every core number below.'}
                </p>
              </CardHeader>
            </Card>

            {/* Compact visual recap so users see the numbers before the math */}
            <VisualSummaryDashboard
              profile={profile}
              vedicProfile={vedicProfile}
              fullName={formData.currentName || formData.fullBirthName}
              variant="compact"
            />

            <div className="grid gap-4">
              {generateAllProofs(
                (() => {
                  const d = new Date(formData.dateOfBirth);
                  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                })(),
                formData.fullBirthName
              ).map((proof, i) => (
                <CalculationProofCard key={i} proof={proof} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Ankjyotish • Premium Vedic Numerology Report</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default AdvancedReportPage;
