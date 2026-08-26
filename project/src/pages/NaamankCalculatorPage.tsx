import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateNameVibration } from "@/lib/nameVibration";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";

const COPY = {
  en: {
    h1: "Naamank (Name Number) Calculator — Free",
    sub: "Find your Naamank — the numerology value of your name — using both Chaldean and Pythagorean systems, instantly.",
    label: "Your full name",
    placeholder: "e.g. Rahul Sharma",
    pyth: "Pythagorean Root",
    chald: "Chaldean Root",
    compound: "Compound",
    master: "Master Number?",
    whatTitle: "What is Naamank?",
    whatBody: "Naamank is the number derived from the letters of your name. Each letter carries a vibration; their sum, reduced to a single digit, is your name number. It influences how the world perceives you, your success, and your relationships. The Chaldean system is considered more accurate for spelling, while Pythagorean is widely used.",
    cta: "Get your full personalised report",
  },
  hi: {
    h1: "नामांक (नाम संख्या) कैलकुलेटर — मुफ़्त",
    sub: "अपना नामांक जानें — अपने नाम का अंक ज्योतिष मान — कैल्डियन और पाइथागोरियन दोनों प्रणालियों से, तुरंत।",
    label: "आपका पूरा नाम",
    placeholder: "जैसे राहुल शर्मा",
    pyth: "पाइथागोरियन मूल",
    chald: "कैल्डियन मूल",
    compound: "संयुक्त",
    master: "मास्टर संख्या?",
    whatTitle: "नामांक क्या है?",
    whatBody: "नामांक आपके नाम के अक्षरों से निकली संख्या है। हर अक्षर का एक कंपन होता है; उनका योग, एक अंक में घटाकर, आपका नाम अंक है। यह प्रभावित करता है कि दुनिया आपको कैसे देखती है, आपकी सफलता और रिश्ते। कैल्डियन प्रणाली वर्तनी के लिए अधिक सटीक मानी जाती है।",
    cta: "अपनी पूरी व्यक्तिगत रिपोर्ट पाएँ",
  },
  hinglish: {
    h1: "Naamank (Name Number) Calculator — Free",
    sub: "Apna Naamank jaanein — apne naam ka numerology value — Chaldean aur Pythagorean dono systems se, turant.",
    label: "Aapka poora naam",
    placeholder: "e.g. Rahul Sharma",
    pyth: "Pythagorean Root",
    chald: "Chaldean Root",
    compound: "Compound",
    master: "Master Number?",
    whatTitle: "Naamank kya hai?",
    whatBody: "Naamank aapke naam ke letters se nikli sankhya hai. Har letter ka ek vibration hota hai; unka sum, single digit mein reduce karke, aapka name number banta hai. Ye affect karta hai ki duniya aapko kaise dekhti hai, aapki success aur relationships. Chaldean system spelling ke liye zyada accurate maani jaati hai.",
    cta: "Apni poori personalised report paayein",
  },
};

const NaamankCalculatorPage = () => {
  const { language } = useLanguage();
  const t = COPY[language as keyof typeof COPY] || COPY.en;
  const [name, setName] = useState("");

  const nv = name.trim() ? calculateNameVibration(name) : null;

  return (
    <>
      <SEO
        title="Naamank Name Number Calculator Free | Ankjyotish AI"
        description="Free Naamank (name number) calculator. Find your name's numerology value in Chaldean and Pythagorean systems. Instant results in Hindi, Hinglish & English."
        canonical="/naamank-calculator"
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
              <Logo size="md" />
            </div>
            <LanguageToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl text-center mb-3">{t.h1}</h1>
          <p className="text-center text-muted-foreground mb-8">{t.sub}</p>

          <Card className="mb-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Calculator</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.label}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.placeholder} />
              </div>
              {nv && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-primary/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      <GlossaryTooltip termKey="naamank" variant="inline">
                        {t.pyth}
                      </GlossaryTooltip>
                    </p>
                    <p className="text-3xl font-display font-bold text-primary">{nv.root}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-divine/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      <GlossaryTooltip termKey="naamank" variant="inline">
                        {t.chald}
                      </GlossaryTooltip>
                    </p>
                    <p className="text-3xl font-display font-bold text-gold">{nv.chaldeanRoot}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t.compound}</p>
                    <p className="text-3xl font-display font-bold">{nv.compound}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/40 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t.master}</p>
                    <p className="text-3xl font-display font-bold">{nv.isMaster ? "Yes" : "No"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><CardTitle>{t.whatTitle}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{t.whatBody}</p></CardContent>
          </Card>

          <div className="text-center">
            <Link to="/form">
              <Button size="lg" className="gap-2">
                {t.cta} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default NaamankCalculatorPage;
