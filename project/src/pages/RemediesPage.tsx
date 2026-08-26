import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowLeft, ArrowRight, Gem, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { REMEDIES } from "@/lib/remedies";
import { calculateMulank } from "@/lib/vedicNumerology";
import { supabase } from "@/integrations/supabase/client";
import { parseDateToDdmmyyyy } from "@/lib/dateUtils";
import DobInput from "@/components/DobInput";

const COPY = {
  en: { h1: "Numerology Remedies (Upay)", sub: "Simple, authentic remedies for each number — planet, colour, gemstone, mantra and daily upay.", dob: "Your date of birth (sets your number)", pick: "Or pick a number (1–9)", planet: "Planet", color: "Colour", day: "Lucky Day", gem: "Gemstone", mantra: "Mantra", remedies: "Daily Remedies", cta: "Get your full report", note: "Remedies are traditional guidance for self-reflection, not medical or financial advice.", back: "Back" },
  hi: { h1: "अंक ज्योतिष उपाय", sub: "हर अंक के लिए सरल, प्रामाणिक उपाय — ग्रह, रंग, रत्न, मंत्र और दैनिक उपाय।", dob: "आपकी जन्म तिथि (आपका अंक तय करती है)", pick: "या एक अंक चुनें (1–9)", planet: "ग्रह", color: "रंग", day: "शुभ दिन", gem: "रत्न", mantra: "मंत्र", remedies: "दैनिक उपाय", cta: "अपनी पूरी रिपोर्ट पाएँ", note: "उपाय आत्म-चिंतन के लिए पारंपरिक मार्गदर्शन हैं, चिकित्सा या वित्तीय सलाह नहीं।", back: "पीछे" },
  hinglish: { h1: "Numerology Remedies (Upay)", sub: "Har number ke liye simple, authentic upay — planet, color, gemstone, mantra aur daily remedy.", dob: "Aapki date of birth (aapka number set karti hai)", pick: "Ya ek number chunein (1–9)", planet: "Planet", color: "Color", day: "Lucky Day", gem: "Gemstone", mantra: "Mantra", remedies: "Daily Remedies", cta: "Apni poori report paayein", note: "Remedies traditional guidance hain self-reflection ke liye, medical ya financial advice nahi.", back: "Back" },
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

const RemediesPage = () => {
  const { language } = useLanguage();
  const t = COPY[language as keyof typeof COPY] || COPY.en;
  const [dob, setDob] = useState("");
  const [num, setNum] = useState(1);

  const [dbRemedy, setDbRemedy] = useState<any | null>(null);
  const [dbLoading, setDbLoading] = useState(false);

  let n = num;
  if (dob) {
    try {
      const ddmmyyyy = parseDateToDdmmyyyy(dob);
      if (ddmmyyyy) {
        n = calculateMulank(ddmmyyyy);
      }
    } catch { /* */ }
  }

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

  useEffect(() => {
    let cancelled = false;
    const fetchRemedy = async () => {
      setDbLoading(true);
      try {
        const { data, error } = await supabase
          .from("remedies")
          .select("*")
          .eq("number", n)
          .maybeSingle();
        
        if (!cancelled) {
          if (error || !data) {
            setDbRemedy(null);
          } else {
            setDbRemedy(data);
          }
        }
      } catch (err) {
        console.error("Database remedy query failed:", err);
        if (!cancelled) setDbRemedy(null);
      } finally {
        if (!cancelled) setDbLoading(false);
      }
    };
    fetchRemedy();
    return () => { cancelled = true; };
  }, [n]);

  const rStatic = REMEDIES[n] || REMEDIES[1];

  const r = dbRemedy ? {
    planet: language === "hi" && dbRemedy.planet_hi ? dbRemedy.planet_hi : dbRemedy.planet_en,
    colorTxt: language === "hi" && dbRemedy.color_hi ? dbRemedy.color_hi : dbRemedy.color_en,
    day: language === "hi" && dbRemedy.day_hi ? dbRemedy.day_hi : dbRemedy.day_en,
    gemTxt: language === "hi" && dbRemedy.gemstone_hi ? dbRemedy.gemstone_hi : dbRemedy.gemstone_en,
    mantra: dbRemedy.mantra,
    list: dbRemedy[`remedies_${language}`] || dbRemedy.remedies_en
  } : {
    planet: rStatic.planet,
    colorTxt: language === "hi" ? rStatic.color.hi : rStatic.color.en,
    day: rStatic.day,
    gemTxt: language === "hi" ? rStatic.gemstone.hi : rStatic.gemstone.en,
    mantra: rStatic.mantra,
    list: rStatic.remedies[language as keyof typeof rStatic.remedies] || rStatic.remedies.en
  };

  const { colorTxt, gemTxt, list } = r;

  return (
    <>
      <SEO title="Numerology Remedies & Upay by Number | Ankjyotish AI" description="Free numerology remedies (upay) for numbers 1-9: ruling planet, lucky colour, gemstone, mantra and daily remedies. In Hindi, Hinglish & English." canonical="/remedies" />
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
            <Gem className="w-7 h-7 text-primary" /> {t.h1}
          </h1>
          <p className="text-center text-muted-foreground mb-8">{t.sub}</p>

          <Card className="mb-6">
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>{t.dob}</Label>
                <DobInput value={dob} onChange={(v) => setDob(v)} outputFormat="yyyy-mm-dd" language={language} />
              </div>
              {!dob && (
                <div>
                  <Label>{t.pick}</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[1,2,3,4,5,6,7,8,9].map((x) => (
                      <button key={x} onClick={() => setNum(x)} className={`w-10 h-10 rounded-full font-display font-semibold transition ${num === x ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"}`}>{x}</button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Number {n}{" "}
                <Badge variant="secondary">{r.planet}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dbLoading ? (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse mr-2" />
                  <span>Loading remedies...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs text-muted-foreground">{t.color}</p>
                      <p className="font-medium">{colorTxt}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs text-muted-foreground">{t.day}</p>
                      <p className="font-medium">{r.day}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40">
                      <p className="text-xs text-muted-foreground">{t.gem}</p>
                      <p className="font-medium">{gemTxt}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10">
                      <p className="text-xs text-muted-foreground">{t.mantra}</p>
                      <p className="font-medium text-primary">{r.mantra}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-display text-lg mb-2">{t.remedies}</p>
                    <ul className="space-y-2">
                      {list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">✦</span>
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.note}</p>
                </>
              )}
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

export default RemediesPage;
