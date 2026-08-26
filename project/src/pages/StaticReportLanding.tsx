import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMasterPrice } from '@/content/reportContent';
import { useReportContent } from '@/hooks/useReportContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateFullProfile } from '@/lib/numerology';
import { generateWhiteLabelPDF } from '@/lib/whiteLabelPdf';
import { trackLead, trackViewContent } from '@/lib/tracking';
import { fetchBranding } from '@/hooks/useBranding';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Star, Check, Shield, Clock, Lock, Sparkles, ChevronRight, Quote } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { ReportPreviewMockup } from '@/components/ReportPreviewMockup';
import { supabase } from '@/integrations/supabase/client';

const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < n ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`} />
  ))}</div>
);

// image that falls back to default if file not uploaded yet
const SmartImg = ({ src, alt, className, wrapperId, fallbackSrc }: { src: string; alt: string; className?: string; wrapperId?: string; fallbackSrc?: string }) => (
  <img src={src} alt={alt} loading="lazy" className={className}
    onError={(e) => {
      const el = e.target as HTMLImageElement;
      if (fallbackSrc && el.src !== window.location.origin + fallbackSrc && el.src !== fallbackSrc) {
        el.src = fallbackSrc;
        return;
      }
      if (wrapperId) { const w = document.getElementById(wrapperId); if (w) { w.style.display = 'none'; return; } }
      el.style.display = 'none';
    }} />
);

const BarRow = ({ label, value, tone }: { label: string; value: number; tone: 'red' | 'green' }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone === 'red' ? 'text-rose-400' : 'text-emerald-400'}>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
      <div className={`h-full rounded-full ${tone === 'red' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default function StaticReportLanding() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const report = useReportContent(slug, language);
  useEffect(() => {
    if (report) {
      const t = report.title || '';
      trackViewContent(report.key, (t.includes('—') ? t.split('—')[0] : t).trim(), report.price);
    }
    // eslint-disable-next-line
  }, [report?.key]);
  const master = getMasterPrice();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [busy, setBusy] = useState(false);
  const [entitled, setEntitled] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const checkEntitlement = async () => {
      if (!report) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      try {
        const { fetchVerifiedTier } = await import('@/lib/verifyTier');
        const tier = await fetchVerifiedTier(null, report.key);
        if (tier === 'master' || tier === 'pro') {
          setEntitled(true);

          const { data: order } = await supabase
            .from('report_orders')
            .select('cashfree_order_id')
            .eq('user_id', session.user.id)
            .eq('report_key', report.key)
            .eq('status', 'success')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (order) {
            setExistingOrderId(order.cashfree_order_id);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    };
    checkEntitlement();
  }, [report?.key]);

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg">Report not found.</p>
        <Link to="/"><Button variant="cosmic">Go Home</Button></Link>
      </div>
    );
  }

  const off = Math.round(((report.originalPrice - report.price) / report.originalPrice) * 100);
  const imgBase = `/images/reports/${report.imgFolder}`;

  const handleFreeReport = async () => {
    if (!name.trim() || !dob) { 
      toast.error(language === 'hi' ? 'नाम और जन्म तिथि भरें' : language === 'hinglish' ? 'Naam aur date of birth bharo' : 'Please fill name and date of birth'); 
      return; 
    }
    setBusy(true);
    try {
      // date input gives yyyy-mm-dd; numerology expects dd/mm/yyyy
      const [yy, mm, dd] = dob.split('-');
      const dobFmt = `${dd}/${mm}/${yy}`;
      const profile = calculateFullProfile(name.trim(), dobFmt);
      const branding = await fetchBranding();
      await generateWhiteLabelPDF(report.key, { fullBirthName: name.trim(), displayName: name.trim(), dateOfBirth: dobFmt } as any, profile, branding, {
        tier: 'free', upsellPrice: report.price, masterPrice: master,
      });
      trackLead(report.key, (report.title.includes('—') ? report.title.split('—')[0] : report.title).trim());
      toast.success(language === 'hi' ? 'मुफ़्त रिपोर्ट डाउनलोड हो गई! पूरी रिपोर्ट नीचे देखें।' : language === 'hinglish' ? 'Free report downloaded! Full report ke liye neeche dekho.' : 'Free report downloaded! Check full report below.');
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      toast.error(language === 'hi' ? 'कुछ गलत हुआ, दोबारा कोशिश करें।' : language === 'hinglish' ? 'Kuch galat hua, dobara try karo.' : 'Something went wrong, please try again.');
    } finally {
      setBusy(false);
    }
  };

  const goBuy = () => {
    if (entitled) {
      if (existingOrderId) {
        navigate(`/order/${existingOrderId}`);
      } else {
        navigate(`/buy/${report.slug}`);
      }
    } else {
      navigate(`/buy/${report.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-cosmic/5">
      <SEO title={`${report.title} | AnkJyotish AI`} description={report.subtitle} canonical={`/report/${report.slug}`} />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display text-lg text-gold">AnkJyotish<span className="text-primary">AI</span></Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-sm"><Stars n={Math.round(report.rating)} /><span className="text-muted-foreground">{report.rating}</span></span>
            <Button variant="mystical" size="sm" onClick={goBuy}>
              {entitled
                ? (language === 'hi' ? 'रिपोर्ट खोलें' : language === 'hinglish' ? 'Report Kholo' : 'Open Report')
                : (language === 'hi' ? `₹${report.price} — रिपोर्ट पाएं` : language === 'en' ? `₹${report.price} — Get Report` : `₹${report.price} — Get Report`)
              }
            </Button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-10 pb-12 grid md:grid-cols-2 gap-8 items-center animate-fade-in">
        <div>
          {report.badge && <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 mb-4">{report.emoji} {report.badge}</span>}
          <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-4">{report.title}</h1>
          <p className="text-muted-foreground text-base mb-5">{report.subtitle}</p>
          {/* Admin-uploaded hero image/video */}
          {(report as any).heroVideo ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5 border border-border">
              <iframe className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${(((report as any).heroVideo).match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/)?.[1]) || (report as any).heroVideo}`}
                title="Report video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : (report as any).heroImage ? (
            <img src={(report as any).heroImage} alt={report.title} className="w-full rounded-xl mb-5 border border-border object-cover" />
          ) : null}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gold">₹{report.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{report.originalPrice}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">{off}% OFF</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5"><Stars n={Math.round(report.rating)} /> {report.rating} ({report.reviews.toLocaleString('en-IN')})</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold" /> {report.deliveryHrs}{language === 'hi' ? ' घंटे में डिलीवरी' : 'hr delivery'}</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-gold" /> {language === 'hi' ? '100% गोपनीय' : '100% private'}</span>
          </div>
        </div>

        {/* mini form -> instant free PDF */}
        <Card className="border-gold/30 bg-card shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center mb-5">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 mb-2">{language === 'hi' ? '100% मुफ़्त' : '100% FREE'}</span>
              <p className="font-display text-2xl">
                {language === 'hi' ? 'अपना मुफ़्त स्नैपशॉट पाएं' : language === 'en' ? 'Get Your FREE Snapshot' : 'Apna FREE Snapshot Pao'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'hi' ? 'केवल 2 विवरण भरें — तुरंत PDF प्राप्त करें' : language === 'en' ? 'Fill only 2 details — get instant PDF' : 'Bas 2 cheez bharo — instant PDF milega'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="wl-name" className="block text-sm font-medium mb-1.5">
                  {language === 'hi' ? 'आपका पूरा नाम' : language === 'en' ? 'Your full name' : 'Aapka poora naam'}
                </label>
                <Input id="wl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={language === 'hi' ? 'जैसे: राहुल शर्मा' : 'e.g. Rahul Sharma'} className="h-11" />
              </div>
              <div>
                <label htmlFor="wl-dob" className="block text-sm font-medium mb-1.5">
                  {language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                </label>
                <Input id="wl-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-11" />
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'hi' ? 'अपनी जन्म तिथि चुनें' : language === 'en' ? 'Select your date of birth' : 'Apni janm tareekh chuno'}
                </p>
              </div>
            </div>

            <Button variant="cosmic" size="lg" className="w-full mt-5" onClick={handleFreeReport} disabled={busy}>
              {busy ? (language === 'hi' ? 'PDF बन रही है…' : language === 'en' ? 'Generating PDF...' : 'PDF ban rahi hai…') : (language === 'hi' ? 'मुफ़्त रिपोर्ट प्राप्त करें' : language === 'en' ? 'Get FREE Report' : 'Get FREE Report')} <Sparkles className="w-4 h-4 ml-1.5" />
            </Button>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> {language === 'hi' ? 'तुरंत PDF' : 'Instant PDF'}</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> {language === 'hi' ? '100% गोपनीय' : '100% private'}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* BANNER IMAGE (falls back to generic_banner.jpg if missing) */}
      <div id="banner-wrap" className="max-w-5xl mx-auto px-4 pb-4 animate-fade-in">
        <SmartImg src={`${imgBase}/${report.bannerImg}`} alt={`${report.title} banner`} wrapperId="banner-wrap"
          fallbackSrc="/images/reports/generic_banner.jpg"
          className="w-full rounded-2xl border border-gold/20 shadow-lg" />
      </div>

      {/* TRUST STATS */}
      <section className="bg-cosmic/10 border-y border-border/40 py-6 animate-slide-up">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[{ v: report.rating + '★', l: language === 'hi' ? 'रेटिंग' : 'Rating' }, { v: (report.reviews / 1000).toFixed(0) + 'K+', l: language === 'hi' ? 'रिपोर्ट्स' : 'Reports' }, { v: report.deliveryHrs + 'hr', l: language === 'hi' ? 'डिलीवरी' : 'Delivery' }, { v: '98%', l: language === 'hi' ? 'संतुष्ट' : 'Satisfied' }].map((s, i) => (
            <div key={i}><div className="text-2xl font-bold text-gold">{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>
          ))}
        </div>
      </section>

      {/* PAIN */}
      <section className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-6">{report.painHeadline}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {report.pains.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/15">
              <span className="text-rose-400 mt-0.5">✗</span><span className="text-sm">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROMISE */}
      <section className="max-w-3xl mx-auto px-4 pb-12 text-center animate-slide-up">
        <h2 className="font-display text-2xl mb-4 text-gold">{report.promiseHeadline}</h2>
        <p className="text-muted-foreground leading-relaxed">{report.promise}</p>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-cosmic/5 py-12 animate-slide-up">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl text-center mb-8">
            {language === 'hi' ? 'कैसे काम करता है' : language === 'en' ? 'How It Works' : 'Kaise Kaam Karta Hai'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {report.steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark text-midnight font-bold text-lg flex items-center justify-center mx-auto mb-3">{i + 1}</div>
                <p className="font-semibold mb-1">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-6">
          {language === 'hi' ? 'रिपोर्ट में क्या मिलेगा' : language === 'en' ? 'What You Will Get' : 'Report Me Kya Milega'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {report.deliverables.map((d, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /><span className="text-sm">{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="max-w-4xl mx-auto px-4 py-12 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-8">{report.beforeAfter.headline}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-rose-400/30"><CardContent className="pt-5">
            <div className="flex justify-between mb-3"><span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400">Before</span><span className="font-bold tracking-wide">{report.beforeAfter.before.name}</span></div>
            {report.beforeAfter.before.bars.map((b, i) => <BarRow key={i} {...b} tone="red" />)}
          </CardContent></Card>
          <Card className="border-emerald-400/30"><CardContent className="pt-5">
            <div className="flex justify-between mb-3"><span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">After</span><span className="font-bold tracking-wide">{report.beforeAfter.after.name}</span></div>
            {report.beforeAfter.after.bars.map((b, i) => <BarRow key={i} {...b} tone="green" />)}
          </CardContent></Card>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-cosmic/5 py-12 animate-slide-up">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-2xl text-center mb-6">{report.whyHeadline}</h2>
          <div className="space-y-3">
            {report.why.map((w, i) => (
              <div key={i} className="flex items-start gap-3"><ChevronRight className="w-5 h-5 text-gold mt-0.5 shrink-0" /><p className="text-sm text-muted-foreground">{w}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO (hides if no videoId) */}
      {report.videoId && (
        <section className="max-w-3xl mx-auto px-4 py-12 animate-slide-up">
          <h2 className="font-display text-2xl text-center mb-6">Dekhiye Kaise Kaam Karta Hai</h2>
          <div className="relative w-full rounded-2xl overflow-hidden border border-gold/20 shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${report.videoId}`} title="Report video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </section>
      )}

      {/* REPORT PREVIEW IMAGES (renders interactive mockups matching PDF output) */}
      <section id="preview-wrap" className="max-w-5xl mx-auto px-4 py-12 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-2 text-gold">
          {language === 'hi' ? 'आपकी रिपोर्ट ऐसी दिखेगी' : language === 'en' ? 'Your Report Will Look Like This' : 'Aapki Report Aisi Dikhegi'}
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          {language === 'hi' ? 'प्रोफेशनल, पर्सनलाइज्ड PDF — व्हाट्सएप/ईमेल पर' : language === 'en' ? 'Professional, personalised PDF — delivered on WhatsApp/Email' : 'Professional, personalised PDF — WhatsApp/email par'}
        </p>
        <ReportPreviewMockup reportKey={report.key} language={language} />
      </section>

      {/* PROOF / RESULTS CAROUSEL (hides each missing) */}
      <section className="max-w-4xl mx-auto px-4 pb-4 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-6">
          {language === 'hi' ? 'वास्तविक परिणाम और प्रमाण' : language === 'en' ? 'Real Results & Proof' : 'Real Results & Proof'}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x justify-start sm:justify-center">
          {report.proofImgs.map((p, i) => (
            <div key={i} className="snap-center shrink-0 w-56">
              <SmartImg src={`${imgBase}/${p}`} alt={`Proof ${i + 1}`} className="w-56 h-40 object-cover rounded-xl border border-border shadow-md" />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-4xl mx-auto px-4 py-12 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-8">
          {language === 'hi' ? 'लोगों ने क्या कहा' : language === 'en' ? 'What People Are Saying' : 'Logon Ne Kya Kaha'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {report.testimonials.map((t, i) => {
            const avatarUrl = (t as any).avatar || `/images/reports/${report.imgFolder}/avatar-${i + 1}.jpg`;
            return (
              <Card key={i} className="bg-card/50 hover:border-gold/25 transition-colors duration-350">
                <CardContent className="pt-5 flex flex-col justify-between h-full min-h-[180px]">
                  <div>
                    <Quote className="w-5 h-5 text-gold/40 mb-2" />
                    <p className="text-sm mb-4 leading-relaxed">"{t.text}"</p>
                  </div>
                  <div>
                    <Stars n={t.stars} />
                    <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-border/40">
                      <img 
                        src={avatarUrl} 
                        alt={t.name} 
                        className="w-8 h-8 rounded-full object-cover border border-gold/20 bg-gold/5 shrink-0" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-none">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-none">{t.city}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-4xl mx-auto px-4 py-12 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-8">
          {language === 'hi' ? 'अपना प्लान चुनें' : language === 'en' ? 'Choose Your Plan' : 'Apna Plan Chuno'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* this report */}
          <Card className="border-gold/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold text-midnight text-xs font-semibold px-3 py-1 rounded-bl-lg">
              {language === 'hi' ? 'इस रिपोर्ट के लिए' : language === 'en' ? 'For This Report' : 'Is Report Ke Liye'}
            </div>
            <CardContent className="pt-8">
              <p className="font-display text-xl mb-1">{report.emoji} {report.title.split('—')[0].trim()}</p>
              <div className="flex items-baseline gap-2 my-3">
                <span className="text-3xl font-bold text-gold">₹{report.price}</span>
                <span className="text-muted-foreground line-through">₹{report.originalPrice}</span>
              </div>
              <ul className="space-y-2 mb-5 text-sm">
                {report.deliverables.slice(0, 4).map((d, i) => <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{d}</li>)}
              </ul>
              <Button variant="mystical" className="w-full" onClick={goBuy}>
                {entitled
                  ? (language === 'hi' ? 'रिपोर्ट खोलें' : language === 'hinglish' ? 'Report Kholo' : 'Open Report')
                  : (language === 'hi' ? `पूरी रिपोर्ट खरीदें — ₹${report.price}` : language === 'en' ? `Buy Full Report — ₹${report.price}` : `Buy Full Report — ₹${report.price}`)
                }
              </Button>
            </CardContent>
          </Card>
          {/* master upsell */}
          <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
              {language === 'hi' ? 'सबसे मूल्यवान' : language === 'en' ? 'Best Value' : 'Best Value'}
            </div>
            <CardContent className="pt-8">
              <p className="font-display text-xl mb-1">👑 Master — Sab Kuch</p>
              <div className="flex items-baseline gap-2 my-3">
                <span className="text-3xl font-bold text-primary">₹{master}</span>
                <span className="text-xs text-muted-foreground">({language === 'hi' ? 'एक बार' : 'one-time'})</span>
              </div>
              <ul className="space-y-2 mb-5 text-sm">
                <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{language === 'hi' ? 'सभी रिपोर्ट्स (यह + 5 अन्य)' : language === 'en' ? 'All reports (this + 5 more)' : 'Saari reports (ye + 5 aur)'}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{language === 'hi' ? '100+ पन्नों का गहरा ब्लूप्रिंट' : language === 'en' ? '100+ page deep blueprint' : '100+ page deep blueprint'}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{language === 'hi' ? 'व्यक्तिगत AI अंक ज्योतिष चैट' : language === 'en' ? 'Personal AI numerology chat' : 'Personal AI numerology chat'}</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{language === 'hi' ? 'आजीवन पहुंच + अपडेट' : language === 'en' ? 'Lifetime access + updates' : 'Lifetime access + updates'}</li>
              </ul>
              <Button variant="cosmic" className="w-full" onClick={() => navigate(entitled ? '/dashboard' : '/payment?tier=master')}>
                {entitled
                  ? (language === 'hi' ? 'अनलॉक है — डैशबोर्ड पर जाएं' : language === 'hinglish' ? 'Unlocked — Dashboard pe jao' : 'Unlocked — Go to Dashboard')
                  : (language === 'hi' ? `मास्टर प्राप्त करें — ₹${master}` : language === 'en' ? `Get Master — ₹${master}` : `Get Master — ₹${master}`)
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 py-12 animate-slide-up">
        <h2 className="font-display text-2xl text-center mb-6">
          {language === 'hi' ? 'आपके सवाल' : language === 'en' ? 'Frequently Asked Questions' : 'Aapke Sawaal'}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {report.faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-3xl mx-auto px-4 py-14 text-center animate-slide-up">
        <h2 className="font-display text-3xl mb-4">{report.finalCta}</h2>
        <p className="text-muted-foreground mb-6">
          {language === 'hi' ? `मुफ़्त स्नैपशॉट अभी, पूर्ण व्यक्तिगत रिपोर्ट मात्र ₹${report.price} में।` : language === 'en' ? `Free snapshot now, full personalised report for only ₹${report.price}.` : `Free snapshot abhi, full personalised report ₹${report.price} me.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="cosmic" size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Sparkles className="w-4 h-4 mr-1" /> {language === 'hi' ? 'मुफ़्त रिपोर्ट पाएं' : language === 'en' ? 'Get Free Report' : 'Free Report Pao'}</Button>
          <Button variant="mystical" size="lg" onClick={goBuy}>
            {entitled
              ? (language === 'hi' ? 'रिपोर्ट खोलें' : language === 'hinglish' ? 'Report Kholo' : 'Open Report')
              : (language === 'hi' ? `पूरी खरीदें — ₹${report.price}` : language === 'en' ? `Buy Full — ₹${report.price}` : `Buy Full — ₹${report.price}`)
            }
          </Button>
        </div>
      </section>

      {/* sticky bottom CTA (mobile) */}
      <div className="sm:hidden sticky bottom-0 z-40 backdrop-blur-md bg-background/90 border-t border-border/50 p-3 flex items-center justify-between">
        <div><div className="text-lg font-bold text-gold">{entitled ? 'Unlocked' : `₹${report.price}`}</div><div className="text-xs text-muted-foreground line-through">{entitled ? '' : `₹${report.originalPrice}`}</div></div>
        <Button variant="mystical" onClick={goBuy}>
          {entitled
            ? (language === 'hi' ? 'रिपोर्ट खोलें' : language === 'hinglish' ? 'Report Kholo' : 'Open Report')
            : (language === 'hi' ? 'रिपोर्ट प्राप्त करें' : 'Get Report')
          }
          {!entitled && <Lock className="w-3 h-3 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
