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
import { calculateMulank, calculateBhagyank } from "@/lib/vedicNumerology";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { parseDateToDdmmyyyy } from "@/lib/dateUtils";
import DobInput from "@/components/DobInput";

const COPY = {
  en: {
    h1: "Moolank & Bhagyank Calculator (Free)",
    sub: "Find your Moolank (birth number) and Bhagyank (destiny number) instantly — the foundation of Vedic numerology.",
    label: "Your date of birth",
    moolank: "Moolank (Birth Number)",
    bhagyank: "Bhagyank (Destiny Number)",
    whatTitle: "What is Moolank & Bhagyank?",
    whatBody: "Moolank is derived from the day of your birth, reduced to a single digit, and reflects your core nature. Bhagyank comes from your full date of birth and reveals your life's destiny and direction. Together they form the base of Vedic ank jyotish.",
    cta: "Get your full personalised report",
  },
  hi: {
    h1: "मूलांक और भाग्यांक कैलकुलेटर (मुफ़्त)",
    sub: "अपना मूलांक (जन्म संख्या) और भाग्यांक (भाग्य संख्या) तुरंत जानें — वैदिक अंक ज्योतिष का आधार।",
    label: "आपकी जन्म तिथि",
    moolank: "मूलांक (जन्म संख्या)",
    bhagyank: "भाग्यांक (भाग्य संख्या)",
    whatTitle: "मूलांक और भाग्यांक क्या है?",
    whatBody: "मूलांक आपके जन्म के दिन से निकलता है, एक अंक में घटाया जाता है, और आपके मूल स्वभाव को दर्शाता है। भाग्यांक आपकी पूरी जन्म तिथि से आता है और जीवन की दिशा बताता है। दोनों मिलकर वैदिक अंक ज्योतिष का आधार बनाते हैं।",
    cta: "अपनी पूरी व्यक्तिगत रिपोर्ट पाएँ",
  },
  hinglish: {
    h1: "Moolank & Bhagyank Calculator (Free)",
    sub: "Apna Moolank (birth number) aur Bhagyank (destiny number) turant jaanein — Vedic ank jyotish ka foundation.",
    label: "Aapki date of birth",
    moolank: "Moolank (Birth Number)",
    bhagyank: "Bhagyank (Destiny Number)",
    whatTitle: "Moolank aur Bhagyank kya hai?",
    whatBody: "Moolank aapke janm ke din se nikalta hai, single digit mein reduce hota hai, aur aapka core nature dikhata hai. Bhagyank aapki poori date of birth se aata hai aur life ki direction batata hai. Dono milke Vedic ank jyotish ka base bante hain.",
    cta: "Apni poori personalised report paayein",
  },
};

const MoolankCalculatorPage = () => {
  const { language } = useLanguage();
  const t = COPY[language as keyof typeof COPY] || COPY.en;
  const [dob, setDob] = useState("");

  let moolank: number | null = null;
  let bhagyank: number | null = null;
  if (dob) {
    try {
      const ddmmyyyy = parseDateToDdmmyyyy(dob);
      if (ddmmyyyy) {
        moolank = calculateMulank(ddmmyyyy);
        bhagyank = calculateBhagyank(ddmmyyyy);
      }
    } catch { /* ignore */ }
  }

  return (
    <>
      <SEO
        title="Moolank & Bhagyank Calculator Free | Ankjyotish AI"
        description="Free Moolank and Bhagyank calculator. Find your birth number and destiny number from your date of birth using Vedic numerology. Instant, accurate, in Hindi & English."
        canonical="/moolank-calculator"
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
                <DobInput value={dob} onChange={(v) => setDob(v)} outputFormat="yyyy-mm-dd" language={language} />
              </div>
              {moolank !== null && bhagyank !== null && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-xl bg-primary/10 text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      <GlossaryTooltip termKey="mulank" variant="inline">
                        {t.moolank}
                      </GlossaryTooltip>
                    </p>
                    <p className="text-4xl font-display font-bold text-primary">{moolank}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-divine/10 text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      <GlossaryTooltip termKey="bhagyank" variant="inline">
                        {t.bhagyank}
                      </GlossaryTooltip>
                    </p>
                    <p className="text-4xl font-display font-bold text-gold">{bhagyank}</p>
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

export default MoolankCalculatorPage;
