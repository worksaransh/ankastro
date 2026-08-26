import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserFormData } from '@/types/formTypes';
import { IndividualReportViewer } from '@/components/dashboard/IndividualReportViewer';
import { 
  calculateFullProfile, 
  calculateLifePath,
  calculateCompatibility,
  numberMeanings,
  NumerologyProfile
} from '@/lib/numerology';
import { calculateMulank, calculateBhagyank } from '@/lib/vedicNumerology';
import { getPersonalityCombination, PersonalityCombination } from '@/lib/personalityLibrary';
import { Download, Sparkles, Star, Heart, Briefcase, Calendar, Gem, Compass, Brain, Zap, Users, ArrowRight, Lock } from 'lucide-react';
import ReportSection from '@/components/ReportSection';
import NumberDisplay from '@/components/NumberDisplay';
import FamousPersonalityMatch from '@/components/FamousPersonalityMatch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNumberMeanings } from '@/hooks/useNumerologyContent';
import { useCompatibility } from '@/hooks/useContentTables';
import { calculateKarmicDebts } from '@/lib/advancedNumerology';
import { KARMIC_DEEP } from '@/lib/karmicContent';
import { generatePDF } from '@/lib/pdfGenerator';
import { generateWhiteLabelPDF, type ReportKey } from '@/lib/whiteLabelPdf';
import { fetchBranding } from '@/hooks/useBranding';
import { toast } from 'sonner';
import LanguageToggle from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { fetchVerifiedTier } from '@/lib/verifyTier';
import { generateCombinedReport, CombinedReportProfile } from '@/lib/combinedIntelligenceEngine';
import { ProgressiveResultView } from '@/components/ProgressiveResultView';

const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [personalityCombo, setPersonalityCombo] = useState<PersonalityCombination | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [reportKey, setReportKey] = useState<ReportKey>('full_blueprint');
  const [userReportsList, setUserReportsList] = useState<string[]>([]);

  // DB-backed category meanings (fallback to hardcoded inside hook)
  const { data: lifePathMap } = useNumberMeanings('life_path', language);
  const { data: destinyMap } = useNumberMeanings('destiny', language);
  const { data: soulUrgeMap } = useNumberMeanings('soul_urge', language);

  // DB-backed compatibility (rich analysis), enabled only when partner DOB present
  const partnerLP = formData?.partnerDob ? calculateLifePath(formData.partnerDob) : 0;
  const businessLP = formData?.businessPartnerDob ? calculateLifePath(formData.businessPartnerDob) : 0;
  const { data: partnerCompatDb } = useCompatibility(profile?.lifePath ?? 0, partnerLP, language);
  const { data: businessCompatDb } = useCompatibility(profile?.lifePath ?? 0, businessLP, language);

  // Check auth and payment status
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        const tier = await fetchVerifiedTier(null, 'full_blueprint');
        if (tier !== 'glimpse') {
          setIsPaid(true);
        }
        
        // Fetch user's other reports to interlink
        const { data: reports } = await supabase
          .from('report_orders')
          .select('report_key')
          .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
          .eq('status', 'success');
        if (reports) {
          setUserReportsList(reports.map((r: any) => r.report_key));
        }
      }
    };
    checkAccess();
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      const stored = localStorage.getItem('numerologyFormData');
      if (stored) {
        try {
          const data = JSON.parse(stored) as UserFormData;
          setFormData(data);
          const calculatedProfile = calculateFullProfile(data.fullBirthName || 'Seeker', data.dateOfBirth || '01/01/1990');
          setProfile(calculatedProfile);
          
          const combo = getPersonalityCombination(
            calculatedProfile.lifePath,
            calculatedProfile.destiny,
            calculatedProfile.soulUrge,
            calculatedProfile.personality
          );
          setPersonalityCombo(combo);
          return;
        } catch (e) {
          console.error('Failed to parse localStorage formData:', e);
        }
      }

      // Fallback: load from Supabase user session & profiles
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .or(`id.eq.${session.user.id},user_id.eq.${session.user.id}`)
          .maybeSingle();

        const name = prof?.full_name || session.user.user_metadata?.full_name || 'Seeker';
        let dob = prof?.dob || '01/01/1990';
        if (dob.includes('-')) {
          const parts = dob.split('-');
          if (parts.length === 3) dob = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }

        const fallbackData: any = {
          fullBirthName: name,
          currentName: name,
          dateOfBirth: dob,
          gender: prof?.gender || 'male',
          profession: prof?.profession || 'Professional',
          mobileNumber: prof?.phone || '',
        };

        setFormData(fallbackData);
        const calculatedProfile = calculateFullProfile(name, dob);
        setProfile(calculatedProfile);

        const combo = getPersonalityCombination(
          calculatedProfile.lifePath,
          calculatedProfile.destiny,
          calculatedProfile.soulUrge,
          calculatedProfile.personality
        );
        setPersonalityCombo(combo);
      } else {
        navigate('/form');
      }
    };

    loadProfileData();
  }, [navigate]);

  useEffect(() => {
    // Read from search query, route state, fallback to window history
    const searchParams = new URLSearchParams(location.search);
    const queryKey = searchParams.get('key') || searchParams.get('reportKey');
    const navState = (window.history.state && window.history.state.usr) || {};
    const key = queryKey || (location.state as any)?.reportKey || navState.reportKey || 'full_blueprint';
    setReportKey(key as ReportKey);
  }, [location.search, location.state]);

  if (!formData || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-gold animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Calculating your cosmic blueprint...</p>
        </div>
      </div>
    );
  }

  const lifePathMeaning = lifePathMap?.[profile.lifePath] || numberMeanings[profile.lifePath] || numberMeanings[9];
  const destinyMeaning = destinyMap?.[profile.destiny] || numberMeanings[profile.destiny] || numberMeanings[9];
  const soulUrgeMeaning = soulUrgeMap?.[profile.soulUrge] || numberMeanings[profile.soulUrge] || numberMeanings[9];
  const personalityMeaning = numberMeanings[profile.personality] || numberMeanings[9];

  const partnerCompatibility = formData.partnerDob 
    ? (() => {
        const base = calculateCompatibility(profile.lifePath, calculateLifePath(formData.partnerDob));
        return {
          ...base,
          strength: partnerCompatDb?.strength || base.strength,
          challenges: partnerCompatDb?.challenges || base.challenges,
          detailed: partnerCompatDb?.detailed_analysis || '',
        };
      })()
    : null;

  const businessCompatibility = formData.businessPartnerDob 
    ? (() => {
        const base = calculateCompatibility(profile.lifePath, calculateLifePath(formData.businessPartnerDob));
        return {
          ...base,
          strength: businessCompatDb?.strength || base.strength,
          challenges: businessCompatDb?.challenges || base.challenges,
          detailed: businessCompatDb?.detailed_analysis || '',
        };
      })()
    : null;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // Server-side authoritative tier check
      const { assertTier } = await import('@/lib/verifyTier');
      const { ok } = await assertTier('pro', null, 'full_blueprint');
      if (!ok) {
        toast.error('PDF download requires Pro (₹599) or Master (₹999) plan');
        navigate('/payment?tier=pro');
        setIsGeneratingPdf(false);
        return;
      }
      await generatePDF(formData, profile, language as 'en' | 'hi' | 'hinglish');
      toast.success('Your PDF report has been downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
      console.error(error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // White-label branded PDF (logo + per-report type). reportKey from
  // navigation state (set by landing-page report flow) else full_blueprint.
  const handleDownloadBranded = async () => {
    setIsGeneratingPdf(true);
    try {
      const { assertTier } = await import('@/lib/verifyTier');
      const { ok } = await assertTier('pro', null, reportKey);
      if (!ok) {
        toast.error('PDF download requires Pro (₹599) or Master (₹999) plan');
        navigate('/payment?tier=pro');
        setIsGeneratingPdf(false);
        return;
      }
      const branding = await fetchBranding();
      await generateWhiteLabelPDF(reportKey, formData, profile, branding);
      toast.success('Branded PDF downloaded!');
    } catch (error) {
      toast.error('Failed to generate branded PDF.');
      console.error(error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <SEO title="Your Basic Numerology Report" description="Your personalized basic numerology report. Upgrade to unlock 100+ pages of advanced Vedic insights." canonical="/report" noindex={true} />
          <div className="min-h-screen py-4 sm:py-8 px-4 relative">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageToggle />
      </div>
      <div className="absolute inset-0 stars-bg opacity-20" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gold-dark via-gold to-gold-light flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-glow-pulse">
            <Star className="w-7 sm:w-10 h-7 sm:h-10 text-midnight" />
          </div>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl text-gold mb-2">
            Your Numerology Blueprint
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">{formData.currentName}</p>
          <p className="text-xs sm:text-sm text-muted-foreground/70">Born: {formData.dateOfBirth}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4 sm:mt-6">
            {isPaid ? (
              <>
              <Button 
                variant="mystical" 
                size="lg" 
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="text-sm sm:text-base"
              >
                <Download className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                {isGeneratingPdf ? 'Generating...' : 'Download PDF Report'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleDownloadBranded}
                disabled={isGeneratingPdf}
                className="text-sm sm:text-base"
              >
                <Download className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Branded PDF
              </Button>
              </>
            ) : (
              <Link to="/payment">
                <Button variant="mystical" size="lg" className="text-sm sm:text-base gap-2 w-full">
                  <Lock className="w-4 sm:w-5 h-4 sm:h-5" />
                  Unlock Full Report - ₹499
                </Button>
              </Link>
            )}
            {isPaid ? (
              <Link to="/advanced-report">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto text-sm sm:text-base">
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                  Advanced Vedic Report
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/payment">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto text-sm sm:text-base">
                  <Lock className="w-4 h-4" />
                  Advanced Report (Premium)
                </Button>
              </Link>
            )}
          </div>
        </div>

        {reportKey !== 'full_blueprint' ? (
          <div className="space-y-6">
            <IndividualReportViewer
              reportKey={reportKey}
              formData={formData}
              profile={profile}
              language={language as 'en' | 'hi' | 'hinglish'}
            />
            
            {/* Download section for the individual report */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-white">Download Offline PDF Copy</p>
                <p className="text-[11px] text-gray-400">Save the calculated report as a PDF to your device.</p>
              </div>
              <Button variant="mystical" size="lg" onClick={handleDownloadBranded} disabled={isGeneratingPdf} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPdf ? 'Generating...' : 'Download PDF Report'}
              </Button>
            </div>
            
            <div className="flex justify-center mt-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  ← Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Modern 3-Level Progressive Disclosure Report */}
            {(() => {
              const qFlowRaw = localStorage.getItem('ankjyotish_question_flow');
              let selectedTopics = ['career'];
              let birthCity = formData.city || 'New Delhi';
              let birthTime = formData.birthTime || '12:00';
              let timeIsUnknown = false;

              if (qFlowRaw) {
                try {
                  const qFlow = JSON.parse(qFlowRaw);
                  if (qFlow.selectedTopics) selectedTopics = qFlow.selectedTopics;
                  if (qFlow.cityName) birthCity = qFlow.cityName;
                  if (qFlow.birthTime) birthTime = qFlow.birthTime;
                  if (qFlow.timeIsUnknown !== undefined) timeIsUnknown = qFlow.timeIsUnknown;
                } catch (e) {
                  console.error(e);
                }
              }

              const combinedReport = generateCombinedReport(
                formData.fullBirthName || 'Seeker',
                formData.dateOfBirth || '01/01/1990',
                birthTime,
                birthCity,
                selectedTopics as any,
                timeIsUnknown
              );

              return (
                <div className="space-y-8">
                  <ProgressiveResultView report={combinedReport} />

                  {/* Footer Actions */}
                  <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/form')} className="rounded-xl px-6">
                      {language === 'hi' ? 'नया प्रश्न पूछें' : 'Ask Another Question'}
                    </Button>
                    <Button variant="default" onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="rounded-xl px-6 gap-2">
                      <Download className="w-4 h-4" />
                      {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        <p className="text-center text-xs text-muted-foreground/50 mt-8">
          Generated by AnkJyotishAI — Authentic Vedic Astrology & Numerology Engine
        </p>
      </div>
    </div>
    </>
  );
};

export default ReportPage;
