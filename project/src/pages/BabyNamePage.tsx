import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowLeft, Sparkles, ArrowRight, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { suggestBabyNames, type Gender } from "@/lib/babyNames";
import { calculateMulank } from "@/lib/vedicNumerology";
import { supabase } from "@/integrations/supabase/client";
import { parseDateToDdmmyyyy } from "@/lib/dateUtils";

const COPY = {
  en: {
    h1: "Lucky Baby Name Finder by Numerology",
    sub: "Discover auspicious baby names matched to a lucky number — or to your baby's date of birth.",
    dobLabel: "Baby's date of birth (optional — sets lucky number)",
    numLabel: "Or pick a lucky number (1–9)",
    genderLabel: "Gender",
    boy: "Boy", girl: "Girl", any: "Any",
    results: "Suggested names",
    none: "No names found for this number. Try another lucky number.",
    cta: "Get a full numerology report",
    note: "Names are matched by Naamank (name number) using the same engine as your full report.",
    back: "Back",
  },
  hi: {
    h1: "अंक ज्योतिष से शुभ शिशु नाम खोजें",
    sub: "किसी शुभ अंक — या अपने शिशु की जन्म तिथि — से मेल खाते शुभ नाम पाएँ।",
    dobLabel: "शिशु की जन्म तिथि (वैकल्पिक — शुभ अंक तय करती है)",
    numLabel: "या एक शुभ अंक चुनें (1–9)",
    genderLabel: "लिंग",
    boy: "लड़का", girl: "लड़की", any: "कोई भी",
    results: "सुझाए गए नाम",
    none: "इस अंक के लिए कोई नाम नहीं मिला। दूसरा शुभ अंक आज़माएँ।",
    cta: "पूरी अंक ज्योतिष रिपोर्ट पाएँ",
    note: "नाम नामांक (नाम संख्या) से मिलाए जाते हैं — वही इंजन जो आपकी पूरी रिपोर्ट में है।",
    back: "पीछे",
  },
  hinglish: {
    h1: "Numerology Se Lucky Baby Name Finder",
    sub: "Kisi lucky number — ya apne baby ki date of birth — se match karte auspicious names paayein.",
    dobLabel: "Baby ki date of birth (optional — lucky number set karti hai)",
    numLabel: "Ya ek lucky number chunein (1–9)",
    genderLabel: "Gender",
    boy: "Boy", girl: "Girl", any: "Any",
    results: "Suggested names",
    none: "Is number ke liye koi naam nahi mila. Dusra lucky number try karein.",
    cta: "Poori numerology report paayein",
    note: "Names Naamank (name number) se match hote hain — wahi engine jo aapki full report mein hai.",
    back: "Back",
  },
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

const BabyNamePage = () => {
  const { language } = useLanguage();
  const t = COPY[language as keyof typeof COPY] || COPY.en;
  const [dob, setDob] = useState("");
  const [num, setNum] = useState<number>(1);
  const [gender, setGender] = useState<Gender | "any">("any");
  const [dbNames, setDbNames] = useState<any[] | null>(null);
  const [dbLoading, setDbLoading] = useState(false);

  // If DOB provided, derive lucky number (Mulank) and use it
  let lucky = num;
  if (dob) {
    try {
      const ddmmyyyy = parseDateToDdmmyyyy(dob);
      if (ddmmyyyy) {
        lucky = calculateMulank(ddmmyyyy);
      }
    } catch { /* ignore */ }
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
    const fetchDbNames = async () => {
      setDbLoading(true);
      try {
        let q = supabase
          .from("baby_names")
          .select("name, gender, name_root, meaning");
        
        q = q.eq("name_root", lucky);

        if (gender && gender !== "any") {
          q = q.eq("gender", gender);
        }

        const { data, error } = await q.limit(30);
        if (!cancelled) {
          if (error) {
            console.error("Database fetch failed, using static fallback:", error);
            setDbNames(null);
          } else {
            setDbNames(data || []);
          }
        }
      } catch (err) {
        console.error("Database query exception:", err);
        if (!cancelled) setDbNames(null);
      } finally {
        if (!cancelled) setDbLoading(false);
      }
    };

    fetchDbNames();
    return () => { cancelled = true; };
  }, [lucky, gender]);

  const staticResults = suggestBabyNames(lucky, gender, 30);
  const results = dbNames !== null && dbNames.length > 0
    ? dbNames.map(n => ({
        name: n.name,
        gender: n.gender as any,
        meaning: n.meaning,
        naamank: n.name_root
      }))
    : staticResults;

  return (
    <>
      <SEO
        title="Lucky Baby Name Finder by Numerology | Ankjyotish AI"
        description="Find auspicious baby names by numerology. Match names to a lucky number or your baby's date of birth. Boy & girl names with meanings, in Hindi, Hinglish & English."
        canonical="/baby-name"
      />
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
            <Baby className="w-7 h-7 text-primary" /> {t.h1}
          </h1>
          <p className="text-center text-muted-foreground mb-8">{t.sub}</p>

          <Card className="mb-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Finder</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.dobLabel}</Label>
                <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
              {!dob && (
                <div>
                  <Label>{t.numLabel}</Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[1,2,3,4,5,6,7,8,9].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNum(n)}
                        className={`w-10 h-10 rounded-full font-display font-semibold transition ${num === n ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"}`}
                      >{n}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label>{t.genderLabel}</Label>
                <div className="flex gap-2 pt-1">
                  {([["any", t.any], ["boy", t.boy], ["girl", t.girl]] as [Gender | "any", string][]).map(([g, lbl]) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`px-4 py-2 rounded-lg text-sm transition ${gender === g ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"}`}
                    >{lbl}</button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{t.note}</p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t.results} <Badge variant="secondary">Lucky #{lucky}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dbLoading ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse mr-2" />
                  <span>Loading lucky names...</span>
                </div>
              ) : results.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.none}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map((n) => (
                    <div key={n.name} className="p-3 rounded-lg bg-muted/40 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-lg">{n.name}</p>
                        <p className="text-xs text-muted-foreground">{n.meaning}</p>
                      </div>
                      <Badge className="shrink-0">{n.naamank}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/form">
              <Button size="lg" className="gap-2">{t.cta} <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default BabyNamePage;
