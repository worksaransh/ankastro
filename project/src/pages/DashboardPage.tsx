import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generatePDF } from '@/lib/pdfGenerator';
import { generateAdvancedPDF } from '@/lib/advancedPdfGenerator';
import { calculateFullProfile, calculateBirthday, calculateLifePath } from '@/lib/numerology';
import { calculatePsychologicalBaseline, saveUserPsychology } from '@/lib/psychology';
import { safeUpsertProfile } from '@/lib/profileHelper';
import { calculateVedicProfile } from '@/lib/vedicNumerology';
import { getPersonalityCombination } from '@/lib/personalityLibrary';
import { calculateLifePillars } from '@/lib/lifePillars';
import SEO from '@/components/SEO';
import PhoneBackfillModal from '@/components/PhoneBackfillModal';
import ProfileEditModal from '@/components/ProfileEditModal';
import { TIERS, tierRank, type Tier } from '@/lib/tiers';
import { REPORT_NAMES, isIndividualReport } from '@/lib/constants';
import type { ReportKey } from '@/lib/whiteLabelPdf';
import {
  calculateLoshuGrid,
  calculatePinnacleCycles,
  calculateChallengeCycles,
  calculateKarmicDebts,
  calculateElementalBalance,
} from '@/lib/advancedNumerology';
import { getDailyForecast } from '@/lib/dailyForecast';
import { useSubscription } from '@/hooks/useSubscription';
import { usePWA } from '@/hooks/usePWA';
import { useRecommendations } from '@/hooks/useRecommendations';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { calculateVedicKundli, type VedicKundliProfile } from '@/lib/vedicAstrologyEngine';
import { KundliChart } from '@/components/KundliChart';
import { DailyPanchangWidget } from '@/components/DailyPanchangWidget';
import { AstroSuperAppHub } from '@/components/dashboard/AstroSuperAppHub';
import AstroDeepDashboard from '@/components/dashboard/AstroDeepDashboard';
import ContextualUpsellCard from '@/components/dashboard/ContextualUpsellCard';
import { deriveKundliData, computeCrossSystemSynthesis, type KundliData, type CrossSystemSynthesis } from '@/lib/unifiedSynthesisEngine';

// Dashboard sub-components
import ForecastWidgets from '@/components/dashboard/ForecastWidgets';
import CosmicOverview from '@/components/dashboard/CosmicOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import ReportListItem, { type UserReport } from '@/components/dashboard/ReportListItem';
import OnboardingQuestionnaire from '@/components/OnboardingQuestionnaire';
import { TrustEngine } from '@/components/dashboard/TrustEngine';
import { DailyCheckIn } from '@/components/dashboard/DailyCheckIn';
import { LifeEventTracker } from '@/components/dashboard/LifeEventTracker';
import { BillingAudit } from '@/components/dashboard/BillingAudit';
import { SpecializedReportsHub } from '@/components/dashboard/SpecializedReportsHub';

import {
  User, FileText, Crown, Sparkles, LogOut, Plus,
  AlertCircle, Star, Download, Sun, Gem, Smartphone, Baby, Car, Wand2, Briefcase, Heart, Building2, Home, Calendar, Lock,
  Shield, Activity, Compass, Zap, Flame
} from 'lucide-react';

interface PaymentRow {
  report_id: string | null;
  tier: Tier;
  status: string;
}

const GREETING = (hour: number, lang: string): string => {
  if (lang === 'hi') {
    if (hour < 12) return 'सुप्रभात';
    if (hour < 17) return 'नमस्ते';
    return 'शुभ संध्या';
  }
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const GREETING_EMOJI = (hour: number): string => {
  if (hour < 12) return '🌅';
  if (hour < 17) return '☀️';
  return '🌙';
};

import { useUserProfile } from '@/hooks/useUserProfile';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const userProfile = useUserProfile();
  
  const {
    user,
    profile,
    numerology: numProfile,
    dailyForecast: forecast,
    loshu,
    loading: isProfileLoading,
    refetch: refetchProfile
  } = userProfile;

  const [reports, setReports] = useState<UserReport[]>([]);
  const [reportTiers, setReportTiers] = useState<Record<string, Tier>>({});
  const [accountTier, setAccountTier] = useState<Tier>('glimpse');
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [phoneModalDismissed, setPhoneModalDismissed] = useState(() => {
    return sessionStorage.getItem('phone_modal_dismissed') === 'true';
  });
  const { isInstallable, installApp } = usePWA();
  const [sub, setSub] = useState<{ active: boolean; loading: boolean; expiresAt: string | null }>({ active: false, loading: true, expiresAt: null });
  
  const purchasedReportKeys = reports.map(r => r.report_type);
  const {
    recommendations,
    dismissRecommendation,
    clickRecommendation
  } = useRecommendations(profile, numProfile, purchasedReportKeys, sub.active);
  
  // Profile edit modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [formDob, setFormDob] = useState('');
  const [formGender, setFormGender] = useState('male');
  const [formProfession, setFormProfession] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formMaritalStatus, setFormMaritalStatus] = useState('single');
  const [formIsBusinessOwner, setFormIsBusinessOwner] = useState(false);
  const [formFullBirthName, setFormFullBirthName] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formBirthTime, setFormBirthTime] = useState('');
  const [formBirthPlace, setFormBirthPlace] = useState('');
  const [formIndustry, setFormIndustry] = useState('');

  const t = {
    en: {
      title: 'Your Dashboard',
      subtitle: 'Access your numerology reports and insights',
      welcome: 'Welcome back',
      newReport: 'Generate New Report',
      yourReports: 'Your Reports',
      noReports: 'No reports generated yet',
      noReportsDesc: 'Start your journey by generating your first numerology report',
      generateFirst: 'Generate Your First Report',
      premiumStatus: 'Premium Status',
      premium: 'Premium ✓',
      free: 'Free',
      upgradeToPremium: 'Upgrade to Premium',
      viewReport: 'View Report',
      downloadPdf: 'PDF',
      createdOn: 'Created',
      logout: 'Logout',
      basicReport: 'Basic',
      advancedReport: 'Advanced',
      paid: 'Paid',
      unpaid: 'Unpaid',
      totalReports: 'Total Reports',
    },
    hi: {
      title: 'आपका डैशबोर्ड',
      subtitle: 'अपनी अंकशास्त्र रिपोर्ट और अंतर्दृष्टि तक पहुंचें',
      welcome: 'वापस स्वागत है',
      newReport: 'नई रिपोर्ट बनाएं',
      yourReports: 'आपकी रिपोर्ट्स',
      noReports: 'अभी तक कोई रिपोर्ट नहीं',
      noReportsDesc: 'अपनी पहली अंकशास्त्र रिपोर्ट बनाकर यात्रा शुरू करें',
      generateFirst: 'अपनी पहली रिपोर्ट बनाएं',
      premiumStatus: 'प्रीमियम स्थिति',
      premium: 'प्रीमियम ✓',
      free: 'फ्री',
      upgradeToPremium: 'प्रीमियम में अपग्रेड करें',
      viewReport: 'रिपोर्ट देखें',
      downloadPdf: 'PDF',
      createdOn: 'बनाया गया',
      logout: 'लॉगआउट',
      basicReport: 'बेसिक',
      advancedReport: 'एडवांस्ड',
      paid: 'भुगतान हुआ',
      unpaid: 'भुगतान नहीं',
      totalReports: 'कुल रिपोर्ट्स',
    },
    hinglish: {
      title: 'Aapka Dashboard',
      subtitle: 'Apni numerology reports aur insights access karein',
      welcome: 'Welcome back',
      newReport: 'Nayi Report Banayein',
      yourReports: 'Aapki Reports',
      noReports: 'Abhi tak koi report nahi',
      noReportsDesc: 'Apni pehli numerology report banakar journey shuru karein',
      generateFirst: 'Apni Pehli Report Banayein',
      premiumStatus: 'Premium Status',
      premium: 'Premium ✓',
      free: 'Free',
      upgradeToPremium: 'Premium mein Upgrade Karein',
      viewReport: 'Report Dekhein',
      downloadPdf: 'PDF',
      createdOn: 'Banaya gaya',
      logout: 'Logout',
      basicReport: 'Basic',
      advancedReport: 'Advanced',
      paid: 'Paid',
      unpaid: 'Unpaid',
      totalReports: 'Total Reports',
    },
  };

  const tr = t[language] || t.en;

  // Initialize edit fields when profile shifts
  useEffect(() => {
    if (profile) {
      setFormDob(profile.dob || '');
      setFormGender(profile.gender || 'male');
      setFormProfession(profile.profession || '');
      setFormGoals(profile.goals?.primary || '');
      setFormMaritalStatus(profile.marital_status || 'single');
      setFormIsBusinessOwner(profile.is_business_owner || false);
      setFormFullBirthName(profile.full_birth_name || profile.full_name || '');
      setFormDisplayName(profile.display_name || profile.full_name || '');
      setFormBirthTime(profile.birth_time || '');
      setFormBirthPlace(profile.birth_place || '');
      setFormIndustry(profile.industry || '');
    }

    if (!isProfileLoading) {
      if (!profile || !profile.dob || !profile.goals?.primary) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    }
  }, [profile, isProfileLoading]);

  useEffect(() => {
    let timer: any = null;

    const loadDashboard = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }

        setIsLoading(true);

        // Fetch user reports, transactions, and subscriptions in parallel
        const [reportsRes, paymentRes, reportOrdersRes, subRes] = await Promise.all([
          supabase.from('user_reports').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
          supabase.from('payments').select('report_id, tier, status').eq('user_id', session.user.id).eq('status', 'success'),
          supabase
            .from('report_orders')
            .select('id, created_at, report_key, amount, status, report_requests(input_json)')
            .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
            .eq('status', 'success')
            .order('created_at', { ascending: false }),
          supabase
            .from('subscriptions')
            .select('expires_at, status')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .gte('expires_at', new Date().toISOString())
            .order('expires_at', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        const standardReports = (reportsRes.data || []) as UserReport[];
        const individualReports: UserReport[] = ((reportOrdersRes.data || []) as any[]).map((o) => {
          const inputData = o.report_requests?.input_json || {};
          return {
            id: o.id,
            created_at: o.created_at,
            report_type: o.report_key,
            form_data: inputData,
            tier_unlocked: 'pro',
            relation: 'self',
            display_name: REPORT_NAMES[o.report_key] || 'Numerology Report',
          };
        });

        const allReports = [...standardReports, ...individualReports].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setReports(allReports);

        // Compute highest tier per report + account-level fallback
        const tierMap: Record<string, Tier> = {};
        let acct: Tier = 'glimpse';
        ((paymentRes.data as PaymentRow[]) || []).forEach((p) => {
          if (p.report_id) {
            const cur = tierMap[p.report_id] || 'glimpse';
            if (tierRank(p.tier) > tierRank(cur)) tierMap[p.report_id] = p.tier;
          } else if (tierRank(p.tier) > tierRank(acct)) {
            acct = p.tier;
          }
        });

        // Individual reports always have 'pro' tier access
        individualReports.forEach((r) => {
          tierMap[r.id] = 'pro';
        });

        setReportTiers(tierMap);
        setAccountTier(acct);
        setIsPremium(acct !== 'glimpse' || Object.keys(tierMap).length > 0 || individualReports.length > 0);

        // Set subscription state
        if (subRes.data) {
          setSub({
            active: true,
            loading: false,
            expiresAt: subRes.data.expires_at || null
          });
        } else {
          setSub({
            active: false,
            loading: false,
            expiresAt: null
          });
        }
      } catch (err) {
        console.error('[Dashboard] Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();

    // Safety fallback: ensure loading screen clears within 2.5 seconds
    timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      if (!user) return;

      // Calculate Mulank & Bhagyank from DOB if available
      let mulank = profile?.mulank || 1;
      let bhagyank = profile?.bhagyank || 1;
      if (formDob) {
        const parts = formDob.split('-');
        if (parts.length === 3) {
          const formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
          mulank = calculateBirthday(formattedDob);
          bhagyank = calculateLifePath(formattedDob);
        }
      }

      // Compute personalization score
      let score = 30;
      if (formDob) score += 20;
      if (formFullBirthName) score += 15;
      if (formProfession) score += 15;
      if (formGoals) score += 10;
      if (formBirthTime && formBirthPlace) score += 10;
      score = Math.min(score, 100);

      const profilePayload = {
        id: user.id,
        user_id: user.id,
        email: user.email || '',
        full_name: formDisplayName || formFullBirthName || user.user_metadata?.full_name || profile?.full_name || '',
        full_birth_name: formFullBirthName || '',
        display_name: formDisplayName || formFullBirthName || '',
        dob: formDob || null,
        gender: formGender,
        profession: formProfession,
        goals: { primary: formGoals },
        marital_status: formMaritalStatus,
        is_business_owner: formIsBusinessOwner,
        birth_time: formBirthTime || null,
        birth_place: formBirthPlace,
        industry: formIndustry,
        mulank,
        bhagyank,
        personalization_score: score,
        updated_at: new Date().toISOString(),
      };

      // Safe upsert with resilient fallback for schema cache / column mismatches
      await safeUpsertProfile(profilePayload);

      // Save baseline psychological profile
      const baseline = calculatePsychologicalBaseline({
        mulank,
        bhagyank,
        profession: formProfession,
        isBusinessOwner: formIsBusinessOwner,
        goal: formGoals,
      });
      await saveUserPsychology(user.id, baseline);

      toast.success(language === 'hi' ? 'प्रोफ़ाइल अपडेट हो गई!' : 'Profile updated successfully!');
      setProfileModalOpen(false);
      
      // Reload values using hook refresh
      await refetchProfile();
    } catch (e: any) {
      toast.error(e.message || 'Error updating profile');
    }
  };

  const handleOpenReport = (report: UserReport) => {
    localStorage.setItem('numerologyFormData', JSON.stringify(report.form_data));
    const isIndividual = isIndividualReport(report.report_type);

    if (isIndividual) {
      navigate('/report', { state: { reportKey: report.report_type } });
    } else {
      navigate(report.report_type === 'advanced' ? '/advanced-report' : '/report');
    }
  };

  const handleDownloadPdf = async (report: UserReport) => {
    setDownloadingId(report.id);
    const isIndividual = isIndividualReport(report.report_type);

    const { assertTier } = await import('@/lib/verifyTier');
    const { ok } = await assertTier('pro', report.id, isIndividual ? report.report_type : undefined);
    if (!ok) {
      toast.error('PDF download requires Pro (₹599) or Master (₹999) plan');
      navigate(`/payment?tier=pro&report=${report.id}`);
      setDownloadingId(null);
      return;
    }
    try {
      const formData = report.form_data;
      const calculatedProfile = calculateFullProfile(formData.fullBirthName, formData.dateOfBirth);

      if (isIndividual) {
        const { generateWhiteLabelPDF } = await import('@/lib/whiteLabelPdf');
        const { fetchBranding } = await import('@/hooks/useBranding');
        const branding = await fetchBranding();
        await generateWhiteLabelPDF(
          report.report_type as ReportKey,
          formData,
          calculatedProfile,
          branding,
          { tier: 'paid', language }
        );
      } else if (report.report_type === 'advanced') {
        const vedicProfile = calculateVedicProfile(formData.dateOfBirth, calculatedProfile.personalYear);
        const combo = getPersonalityCombination(calculatedProfile.lifePath, calculatedProfile.destiny, calculatedProfile.soulUrge, calculatedProfile.personality);
        const partnerData = formData.includeCompatibility && formData.partnerName && formData.partnerDob
          ? { name: formData.partnerName, dob: formData.partnerDob } : undefined;
        const pillars = calculateLifePillars(vedicProfile, {
          lifePath: calculatedProfile.lifePath, destiny: calculatedProfile.destiny, personalYear: calculatedProfile.personalYear
        }, partnerData);
        const loshuGrid = calculateLoshuGrid(formData.dateOfBirth, formData.fullBirthName);
        const pinnacleCycles = calculatePinnacleCycles(formData.dateOfBirth);
        const challengeCycles = calculateChallengeCycles(formData.dateOfBirth);
        const karmicDebts = calculateKarmicDebts(formData.dateOfBirth, formData.fullBirthName);
        const elementalBalance = calculateElementalBalance(formData.dateOfBirth);

        await generateAdvancedPDF(formData, calculatedProfile, vedicProfile, combo || undefined, 'visual', pillars, loshuGrid, pinnacleCycles, challengeCycles, karmicDebts, elementalBalance, language);
      } else {
        await generatePDF(formData, calculatedProfile, language as 'en' | 'hi' | 'hinglish');
      }
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await refetchProfile();
  };

  const loshuDigits = numProfile ? new Set(loshu?.present || []) : undefined;

  const derivedKundli = useMemo(() => {
    return deriveKundliData(profile?.dob || '1995-08-15', profile?.birth_time || '12:00');
  }, [profile?.dob, profile?.birth_time]);

  const derivedNumData = useMemo(() => {
    const mul = numProfile?.birthDayNumber || 1;
    const bhag = numProfile?.lifePathNumber || 1;
    const planets = ['Sun', 'Moon', 'Jupiter', 'Rahu', 'Mercury', 'Venus', 'Ketu', 'Saturn', 'Mars'];
    return {
      mulank: mul,
      mulankPlanet: planets[mul - 1] || 'Sun',
      bhagyank: bhag,
      bhagyankPlanet: planets[bhag - 1] || 'Sun',
      namaank: numProfile?.expressionNumber || 5,
      chaldeanVibration: 37,
      personalYear: numProfile?.personalYear || 5,
      loShuActivePlanes: ['Thought Plane (4-3-8)', 'Will Plane (9-5-1)'],
      missingNumbers: [2, 6, 7]
    };
  }, [numProfile]);

  const crossSynthesis = useMemo(() => {
    return computeCrossSystemSynthesis(derivedNumData, derivedKundli);
  }, [derivedNumData, derivedKundli]);

  const hasNumerologyAccess = reports.some(r => r.report_type?.includes('numerology') || r.report_type?.includes('name'));
  const hasKundliAccess = reports.some(r => r.report_type?.includes('career') || r.report_type?.includes('marriage') || r.report_type?.includes('kundli')) || tierRank(accountTier) >= tierRank('master');
  
  const userAccessState: 'free' | 'numerology_only' | 'kundli_only' | 'both_unlocked' = 
    (hasNumerologyAccess && hasKundliAccess) ? 'both_unlocked' :
    hasNumerologyAccess ? 'numerology_only' :
    hasKundliAccess ? 'kundli_only' : 'free';

  if (isProfileLoading || (user && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = GREETING(hour, language);
  const greetingEmoji = GREETING_EMOJI(hour);
  const displayName = profile?.display_name || profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <SEO title="My Dashboard — Ankjyotish" description="View and download your personalized numerology reports." canonical="/dashboard" noindex={true} />
      {user && profile && !profile.phone_number && !phoneModalDismissed && (
        <PhoneBackfillModal
          open={true}
          userId={user.id}
          onDone={() => {
            setPhoneModalDismissed(true);
            sessionStorage.setItem('phone_modal_dismissed', 'true');
            refetchProfile();
          }}
          onClose={() => {
            setPhoneModalDismissed(true);
            sessionStorage.setItem('phone_modal_dismissed', 'true');
          }}
        />
      )}
      <div className="min-h-screen bg-background spiritual-pattern">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <Link to="/"><Logo size="sm" /></Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageToggle />
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="gap-1 text-xs sm:text-sm border border-primary/20 hover:bg-primary/10">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{tr.logout}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          {/* ===== HERO GREETING ===== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1 animate-fade-in">
                {greeting}, {displayName} {greetingEmoji}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {numProfile?.personalYear
                  ? (language === 'hi'
                    ? `आपका व्यक्तिगत वर्ष ${numProfile.personalYear} — आज का विशेष ज्ञान प्राप्त करें`
                    : `Personal Year ${numProfile.personalYear} — discover today's special insights`)
                  : tr.subtitle}
              </p>
            </div>
            {isInstallable && (
              <Button
                onClick={installApp}
                variant="mystical"
                className="gap-2 self-start sm:self-center shadow-md animate-glow-pulse"
              >
                <Download className="w-4 h-4" />
                Install Web App
              </Button>
            )}
          </div>

          {/* ===== OPTIONAL PROFILE COMPLETION BANNER ===== */}
          {showOnboarding && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-violet-500/10 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">
                    {language === 'hi' ? 'अपनी प्रोफ़ाइल पूरी करें' : 'Complete Your Profile'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {language === 'hi'
                      ? 'सटीक दैनिक भविष्यफल और वैयक्तिकृत अंतर्दृष्टि पाने के लिए अपनी जन्म तिथि भरें।'
                      : 'Add your date of birth and life goals for 100% personalized forecasts.'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/profile')}
                size="sm"
                className="gap-1.5 shrink-0 bg-primary hover:bg-primary/90 text-white"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'hi' ? 'मेरी प्रोफ़ाइल भरें' : 'Fill My Profile'}
              </Button>
            </div>
          )}

          {/* ===== CONTEXTUAL UPSELL / MASTER STATUS CARD ===== */}
          <div className="mb-6">
            <ContextualUpsellCard 
              userState={userAccessState} 
              numData={derivedNumData} 
              kundliData={derivedKundli} 
            />
          </div>

          {/* ===== QUICK ACTIONS ===== */}
          <QuickActions language={language} hasPlusAccess={sub.active} />

          {/* ===== UNIFIED DUAL-SYSTEM CROSS-SYNTHESIS MATRIX ===== */}
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-violet-900/15 to-black border border-amber-500/30 shadow-2xl text-left space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs">
                    Maha-Kundli & AnkJyotish Unified Synthesis
                  </Badge>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {crossSynthesis.overallSynergyScore}% Celestial Resonance
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Vedic Lagna ({derivedKundli.lagnaSign}) × Mulank {derivedNumData.mulank} ({derivedNumData.mulankPlanet})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={`text-xs capitalize ${
                  crossSynthesis.rulerRelationship.mulankVsLagna === 'Harmonious' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  crossSynthesis.rulerRelationship.mulankVsLagna === 'Neutral' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {crossSynthesis.rulerRelationship.mulankVsLagna} Planetary Synergy
                </Badge>
              </div>
            </div>

            {/* Relationship Explanation & Key Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <p className="text-amber-400 font-semibold uppercase text-[10px]">Ruler Relationship</p>
                <p className="text-white font-medium text-sm">{derivedNumData.mulankPlanet} ↔ {derivedKundli.lagnaLord}</p>
                <p className="text-zinc-300 leading-relaxed">{crossSynthesis.rulerRelationship.explanation}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <p className="text-violet-400 font-semibold uppercase text-[10px]">10th House Karma Synergy</p>
                <p className="text-white font-medium text-sm">{crossSynthesis.careerSynergy.title}</p>
                <p className="text-zinc-300 leading-relaxed">{crossSynthesis.careerSynergy.verdict}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <p className="text-emerald-400 font-semibold uppercase text-[10px]">Unified Remedial Matrix</p>
                <p className="text-white font-medium text-sm">{crossSynthesis.unifiedRemedialMatrix.primaryGemstone}</p>
                <p className="text-zinc-300 leading-relaxed">
                  Rudraksha: <strong className="text-amber-300">{crossSynthesis.unifiedRemedialMatrix.rudrakshaMukhi}</strong> | Color: <strong className="text-zinc-200">{crossSynthesis.unifiedRemedialMatrix.cosmicColor}</strong>
                </p>
              </div>
            </div>

            {/* Cross-Insight Bullets */}
            <div className="p-3.5 bg-black/50 rounded-2xl border border-white/5 space-y-1.5 text-xs">
              <p className="text-zinc-400 font-semibold uppercase text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" /> Deep Dual-System Cross-Correlations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-zinc-300">
                {crossSynthesis.crossInsights.map((insight, idx) => (
                  <p key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span> {insight}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ===== DEEP VEDIC KUNDLI DASHBOARD (12 Bhavas, 9 Grahas, D9, Sade Sati) ===== */}
          <div className="mb-8">
            <AstroDeepDashboard kundli={derivedKundli} />
          </div>

          {/* ===== COSMIC OVERVIEW (Core numbers + Lo Shu + Personal Year Ring) ===== */}
          {numProfile && (
            <CosmicOverview
              numProfile={numProfile}
              language={language}
              loshuDigits={loshuDigits}
            />
          )}

          {/* ===== ASTROTALK-GRADE SUPER APP HUB (Kundli, Gun Milan, Panchang, Horoscope, AI Astrologers, Remedies) ===== */}
          <AstroSuperAppHub userProfile={profile} numerologyProfile={numProfile} />

          {/* ===== FORECAST WIDGETS ===== */}
          {forecast && (
            <ForecastWidgets
              forecast={forecast}
              numProfile={numProfile}
              language={language}
            />
          )}

          {/* ===== COSMIC RECOMMENDATIONS ===== */}
          <Recommendations
            recommendations={recommendations}
            language={language}
            onDismiss={dismissRecommendation}
            onClick={clickRecommendation}
          />

          {/* ===== TRUST ENGINE & DAILY CHECK-IN ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TrustEngine
              formData={profile ? {
                fullBirthName: profile.full_name || '',
                displayName: profile.full_name || '',
                dateOfBirth: profile.dob ? profile.dob.split('-').reverse().join('/') : '',
                profession: profile.profession || '',
                goals: profile.goals || {},
                relationshipStatus: profile.marital_status || 'single',
              } as any : null}
              onEditProfile={() => navigate('/profile')}
            />
            <DailyCheckIn
              formData={profile ? {
                dateOfBirth: profile.dob ? profile.dob.split('-').reverse().join('/') : '',
              } as any : null}
            />
          </div>

          <div className="mb-6">
            <LifeEventTracker />
          </div>

          {/* ===== PINNACLE CYCLE ALERT ===== */}
          {numProfile?.pinnacles && (() => {
            const age = new Date().getFullYear() - (numProfile.pinnacles[0]?.startAge || 0) - (numProfile.pinnacles[0]?.duration || 36) + 36;
            const current = numProfile.pinnacles.find((p: any) => age >= (p.startAge || 0) && age < ((p.startAge || 0) + (p.duration || 36)));
            return current ? (
              <Card className="mb-6 border-gold/20 bg-gold/5">
                <CardContent className="pt-4 flex items-start gap-3">
                  <Star className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {language === 'hi' ? `पिनेकल ${current.number}: सक्रिय चक्र` : `Pinnacle ${current.number}: Active Cycle`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === 'en' ? 'Your current numerology pinnacle is active. Key themes: leadership, transformation, growth.' : language === 'hi' ? 'आपका वर्तमान पिनेकल सक्रिय है।' : `Aapka current pinnacle ${current.number} active hai — is cycle ka poora faayda uthao.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null;
          })()}

          {/* ===== PLUS MEMBERSHIP BANNER ===== */}
          {!sub.loading && (
            sub.active ? (
              <Card className="mb-6 border-gold/40 bg-gradient-to-r from-gold/10 to-transparent">
                <CardContent className="pt-4 flex items-center gap-3">
                  <Crown className="w-5 h-5 text-gold shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {language === 'hi' ? 'आप Plus सदस्य हैं ✓' : language === 'en' ? "You're a Plus member ✓" : 'Aap Plus member ho ✓'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'hi' ? 'समाप्ति: ' : 'Valid till: '}{sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
                <CardContent className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {language === 'hi' ? 'AnkJyotish Plus लें' : language === 'en' ? 'Get AnkJyotish Plus' : 'AnkJyotish Plus lo'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'hi' ? 'रोज़ का भाग्य + मासिक रिपोर्ट + असीमित AI चैट — ₹99/माह' : language === 'en' ? 'Daily luck + monthly report + unlimited AI chat — ₹99/mo' : 'Roz ka bhagya + monthly report + unlimited AI chat — ₹99/mo'}
                      </p>
                    </div>
                  </div>
                  <Link to="/plus"><Button variant="mystical" size="sm" className="gap-1"><Sparkles className="w-4 h-4" /> {language === 'hi' ? 'सदस्य बनें' : 'Join Plus'}</Button></Link>
                </CardContent>
              </Card>
            )
          )}

          {/* ===== STATS ROW ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Premium Status */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{tr.premiumStatus}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground capitalize">
                      {accountTier && accountTier !== 'glimpse'
                        ? `${TIERS[accountTier] ? accountTier : 'Premium'} ✓`
                        : tr.free}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${isPremium ? 'bg-divine/20' : 'bg-muted'}`}>
                    <Crown className={`w-5 sm:w-6 h-5 sm:h-6 ${isPremium ? 'text-divine' : 'text-muted-foreground'}`} />
                  </div>
                </div>
                {tierRank(accountTier) < tierRank('master') && (
                  <Link to={accountTier === 'glimpse' ? '/pricing' : '/pricing?upgrade=1&returnUrl=/dashboard'}>
                    <Button size="sm" className="mt-3 sm:mt-4 w-full gap-2">
                      <Sparkles className="w-4 h-4" />
                      {accountTier === 'glimpse'
                        ? tr.upgradeToPremium
                        : (language === 'hi' ? 'मास्टर में अपग्रेड करें' : 'Upgrade to Master')}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Total Reports */}
            <Card className="glass-card-mystical">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{tr.totalReports}</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{reports.length}</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                    <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Report */}
            <Card className="glass-card-mystical">
              <CardContent className="pt-4 sm:pt-6">
                <Link to="/form">
                  <Button className="w-full h-full py-4 sm:py-6 gap-2">
                    <Plus className="w-5 h-5" />
                    {tr.newReport}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ===== MY NUMEROLOGY TOOLKIT ===== */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {language === 'hi' ? 'मेरा अंक ज्योतिष टूलकिट' : language === 'hinglish' ? 'Mera Numerology Toolkit' : 'My Numerology Toolkit'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <Link to="/daily-forecast" className="group">
                <Card className="h-full border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 transform group-hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-white">{language === 'hi' ? 'दैनिक राशिफल' : language === 'hinglish' ? 'Daily Forecast' : 'Daily Forecast'}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{language === 'hi' ? 'दैनिक भाग्यशाली अंक और रंग' : "Today's lucky numbers & colors"}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/remedies" className="group">
                <Card className="h-full border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 transform group-hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Gem className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-white">{language === 'hi' ? 'उपाय और रत्न' : language === 'hinglish' ? 'Remedies & Gems' : 'Remedies & Gems'}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{language === 'hi' ? 'नकारात्मक ऊर्जा दूर करने के उपाय' : 'Authentic planetary upays & stones'}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/tools/vibration" className="group">
                <Card className="h-full border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 transform group-hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-white">{language === 'hi' ? 'कंपन कैलकुलेटर' : language === 'hinglish' ? 'Vibration Calc' : 'Vibration Calc'}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{language === 'hi' ? 'नाम, मोबाइल, वाहन कंपन चेक करें' : 'Chaldean name & phone vibrations'}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/baby-name" className="group">
                <Card className="h-full border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 transform group-hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                      <Baby className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-white">{language === 'hi' ? 'शिशु नाम खोजक' : language === 'hinglish' ? 'Baby Name Finder' : 'Baby Name Finder'}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{language === 'hi' ? 'जन्म तिथि से भाग्यशाली नाम' : 'Find names matching lucky roots'}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* ===== PREMIUM SPECIALIZED REPORTS ===== */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              {language === 'hi' ? 'प्रीमियम विशिष्ट रिपोर्ट' : language === 'hinglish' ? 'Premium Specialized Reports' : 'Premium Specialized Reports'}
              {accountTier === 'master' && (
                <Badge className="bg-gold text-black font-bold uppercase tracking-wider text-[9px] hover:bg-gold px-2">
                  Master Plan Unlocked
                </Badge>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { key: 'name_correction', slug: 'name-correction-report', label: 'Name Correction', icon: Wand2, color: 'text-amber-400', bg: 'bg-amber-400/5' },
                { key: 'mobile_numerology', slug: 'mobile-numerology-report', label: 'Mobile Vibration', icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-400/5' },
                { key: 'vehicle_numerology', slug: 'vehicle-numerology-report', label: 'Vehicle Vibration', icon: Car, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
                { key: 'career_numerology', slug: 'career-numerology-report', label: 'Career Karma', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-400/5' },
                { key: 'baby_name', slug: 'baby-name-report', label: 'Lucky Baby Name', icon: Baby, color: 'text-pink-400', bg: 'bg-pink-400/5' },
                { key: 'compatibility_report', slug: 'compatibility-report', label: 'Love Match', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/5' },
                { key: 'business_numerology', slug: 'business-numerology-report', label: 'Business Advisor', icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-400/5' },
                { key: 'property_numerology', slug: 'property-numerology-report', label: 'Property Vibe', icon: Home, color: 'text-teal-400', bg: 'bg-teal-400/5' },
                { key: 'marriage_report', slug: 'marriage-report', label: 'Marriage 36-Gun', icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-400/5' },
                { key: 'shani_sade_sati', slug: 'shani-sade-sati-report', label: 'Shani Sade Sati', icon: Shield, color: 'text-violet-400', bg: 'bg-violet-400/5' },
                { key: 'pitra_dosh_karmic', slug: 'pitra-dosh-karmic-report', label: 'Pitra Dosh Karma', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/5' },
                { key: 'wealth_yogas_kundli', slug: 'wealth-yogas-kundli-report', label: 'Dhana Yogas & Laxmi', icon: Sparkles, color: 'text-amber-300', bg: 'bg-amber-300/5' },
                { key: 'health_vitality_kundli', slug: 'health-vitality-kundli-report', label: 'Medical Kundli', icon: Activity, color: 'text-emerald-300', bg: 'bg-emerald-300/5' },
                { key: 'foreign_settlement_travel', slug: 'foreign-settlement-travel-report', label: 'Foreign Travel & PR', icon: Compass, color: 'text-sky-400', bg: 'bg-sky-400/5' },
                { key: 'mangal_dosha_analysis', slug: 'mangal-dosha-analysis-report', label: 'Manglik Dosha', icon: Zap, color: 'text-red-400', bg: 'bg-red-400/5' },
              ].map((item) => {
                const matchingReport = reports.find(r => r.report_type === item.key);
                const isUnlocked = accountTier === 'master' || !!matchingReport;
                const Icon = item.icon;
                
                const cardContent = (
                  <Card className="h-full border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                    <div className="absolute top-2.5 right-2.5">
                      {isUnlocked ? (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wide border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold py-0">
                          ✓ Unlocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wide border-white/10 bg-white/5 text-gray-400 py-0 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Lock
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                      <div className={`p-2.5 rounded-xl ${item.bg} border border-primary/10 ${item.color} mt-2`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-sm text-white">{item.label}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5 capitalize">
                          {matchingReport ? 'View Report' : isUnlocked ? 'Generate Report' : 'Premium Reading'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );

                if (matchingReport) {
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleOpenReport(matchingReport)}
                      className="group text-left w-full h-full block focus:outline-none"
                    >
                      {cardContent}
                    </button>
                  );
                }

                return (
                  <Link key={item.key} to={`/buy/${item.slug}`} className="group">
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ===== SPECIALIZED REPORTS HUB (ALL 9 REPORTS WITH DETAILS & PDF DOWNLOAD) ===== */}
          <div className="my-8">
            <SpecializedReportsHub
              purchasedReports={purchasedReportKeys}
              hasMaster={accountTier === 'master'}
              hasPlus={sub.active}
              userProfileData={userProfile}
            />
          </div>

          {/* ===== REPORTS LIST ===== */}
          <Card className="glass-card-mystical">
            <CardHeader>
              <CardTitle className="font-display text-lg sm:text-xl">{tr.yourReports}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {reports.length > 0
                  ? `${reports.length} report${reports.length > 1 ? 's' : ''} generated`
                  : tr.noReportsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <FileText className="w-12 sm:w-16 h-12 sm:h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base">{tr.noReports}</p>
                  <Link to="/form">
                    <Button className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      {tr.generateFirst}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <ReportListItem
                      key={report.id}
                      report={report}
                      reportTier={reportTiers[report.id] || 'glimpse'}
                      accountTier={accountTier}
                      language={language}
                      downloadingId={downloadingId}
                      tr={tr}
                      onOpen={handleOpenReport}
                      onDownload={handleDownloadPdf}
                      onUpgrade={(reportId, nextTier) => navigate(`/payment?report=${reportId}&tier=${nextTier}&upgrade=1`)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
