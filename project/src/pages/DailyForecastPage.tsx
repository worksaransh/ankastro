import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowLeft, Sparkles, ArrowRight, Star, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDailyForecast } from "@/lib/dailyForecast";
import { supabase } from "@/integrations/supabase/client";
import DobInput from "@/components/DobInput";

const COPY = {
  en: { h1: "Today's Lucky Forecast", sub: "Your personal lucky number, colour and focus for today.", dob: "Your date of birth (for a personal forecast)", luckyNo: "Lucky Number", luckyColor: "Lucky Colour", focus: "Today's Focus", tip: "Tip", rating: "Day Rating", cta: "Get your full report", back: "Back" },
  hi: { h1: "आज का शुभ राशिफल", sub: "आज के लिए आपका व्यक्तिगत शुभ अंक, रंग और फोकस।", dob: "आपकी जन्म तिथि (व्यक्तिगत राशिफल के लिए)", luckyNo: "शुभ अंक", luckyColor: "शुभ रंग", focus: "आज का फोकस", tip: "सुझाव", rating: "दिन रेटिंग", cta: "अपनी पूरी रिपोर्ट पाएँ", back: "पीछे" },
  hinglish: { h1: "Aaj Ka Lucky Forecast", sub: "Aaj ke liye aapka personal lucky number, color aur focus.", dob: "Aapki date of birth (personal forecast ke liye)", luckyNo: "Lucky Number", luckyColor: "Lucky Color", focus: "Aaj Ka Focus", tip: "Tip", rating: "Day Rating", cta: "Apni poori report paayein", back: "Back" },
};

const convertDobToInputFormat = (dobStr: string): string => {
  if (!dobStr) return "";
  const parts = dobStr.split(/[-\/]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    } else if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
  }
  return "";
};

const DailyForecastPage = () => {
  const { language } = useLanguage();
  const t = COPY[language as keyof typeof COPY] || COPY.en;
  const [dob, setDob] = useState("");
  const f = getDailyForecast(dob || undefined);
  const colorTxt = language === "hi" ? f.luckyColor.hi : f.luckyColor.en;
  const focusTxt = f.focus[language as keyof typeof f.focus] || f.focus.en;
  const tipTxt = f.tip[language as keyof typeof f.tip] || f.tip.en;

  useEffect(() => {
    const loadProfile = async () => {
      // 1. Try local storage
      const raw = localStorage.getItem('numerologyFormData');
      if (raw) {
        try {
          const fd = JSON.parse(raw);
          if (fd.dateOfBirth) {
            setDob(convertDobToInputFormat(fd.dateOfBirth));
            return;
          }
        } catch {}
      }

      // 2. Try Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('dob')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (profile?.dob) {
          setDob(profile.dob);
        }
      }
    };
    loadProfile();
  }, []);

  return (
    <>
      <SEO title="Today's Lucky Number & Forecast | Ankjyotish AI" description="Free daily numerology forecast. Get today's lucky number, lucky colour, focus area and a personal tip based on your date of birth. In Hindi, Hinglish & English." canonical="/daily-forecast" />
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />{t.back}</Button></Link>
              <Logo size="md" />
            </div>
            <LanguageToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl text-center mb-3 flex items-center justify-center gap-2">
            <Sun className="w-7 h-7 text-gold" /> {t.h1}
          </h1>
          <p className="text-center text-muted-foreground mb-2">{t.sub}</p>
          <p className="text-center text-xs text-muted-foreground mb-6">{f.date}</p>

          <Card className="mb-6">
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>{t.dob}</Label>
                <DobInput value={dob} onChange={(v) => setDob(v)} outputFormat="yyyy-mm-dd" language={language} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-primary/10 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{t.luckyNo}</p>
                  <p className="text-5xl font-display font-bold text-primary">{f.luckyNumber}</p>
                </div>
                <div className="p-5 rounded-xl bg-divine/10 text-center flex flex-col justify-center">
                  <p className="text-xs text-muted-foreground mb-1">{t.luckyColor}</p>
                  <p className="text-2xl font-display font-bold text-gold">{colorTxt}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm text-muted-foreground mr-2">{t.rating}:</span>
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`w-5 h-5 ${i <= f.rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <div className="p-4 rounded-lg bg-muted/40">
                <p className="text-sm"><strong className="text-primary">{t.focus}:</strong> {focusTxt}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm"><strong className="text-primary">{t.tip}:</strong> {tipTxt}</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/form"><Button size="lg" className="gap-2">{t.cta} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default DailyForecastPage;
