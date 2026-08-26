import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import { calculateNameVibration } from "@/lib/nameVibration";
import { calculateMobileVibration, validateMobileNumber } from "@/lib/mobileVibration";
import { calculateBusinessVibration } from "@/lib/businessNameVibration";
import { analyzeVehicle, analyzeHouse } from "@/lib/vehicleHouseVibration";
import { correctName } from "@/lib/nameCorrection";
import { analyzeSignature, analyzeEmail, analyzeDomain, analyzeSocialHandle } from "@/lib/vibrationExtensions";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { calculateFullProfile } from "@/lib/numerology";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, User, Smartphone, Building2, AlertCircle, Lock, TrendingUp, Heart, DollarSign, ChevronRight, Car, Home, Wand2, FileSignature, Mail, Globe, AtSign, ArrowLeft } from "lucide-react";

const translations = {
  en: {
    proTitle: "Unlock Pro Analysis",
    proSubtitle: "Get personalized compatibility, suggestions & deeper insights",
    cta: "Get Full Report — ₹499",
    features: [
      "Name alignment score vs your birth numbers",
      "Spelling tweaks for stronger vibration",
      "Mobile compatibility verdict & alternatives",
      "Brand industry fit & archetype insights",
      "Partner merge mode & relationship synergy",
    ],
  },
  hi: {
    proTitle: "प्रो विश्लेषण अनलॉक करें",
    proSubtitle: "व्यक्तिगत अनुकूलता, सुझाव और गहरी अंतर्दृष्टि प्राप्त करें",
    cta: "पूरी रिपोर्ट प्राप्त करें — ₹499",
    features: [
      "आपके जन्म अंकों के साथ नाम अलाइनमेंट स्कोर",
      "मज़बूत कंपन के लिए स्पेलिंग ट्वीक",
      "मोबाइल अनुकूलता फ़ैसला और विकल्प",
      "ब्रांड इंडस्ट्री फिट और आर्कटाइप अंतर्दृष्टि",
      "पार्टनर मर्ज मोड और रिश्ता सिनर्जी",
    ],
  },
  hinglish: {
    proTitle: "Pro Analysis Unlock Karein",
    proSubtitle: "Personalized compatibility, suggestions aur deeper insights paayein",
    cta: "Full Report Lein — ₹499",
    features: [
      "Birth numbers ke saath name alignment score",
      "Stronger vibration ke liye spelling tweaks",
      "Mobile compatibility verdict aur alternatives",
      "Brand industry fit aur archetype insights",
      "Partner merge mode aur relationship synergy",
    ],
  },
};

const COPY_TOOLS = {
  en: {
    title: "Free Vibration Calculator",
    subtitle: "Quick numerology check for any name, mobile number, or brand.",
    back: "Back",
    nameTab: "Name",
    mobileTab: "Mobile",
    brandTab: "Brand",
    vehicleTab: "Vehicle",
    houseTab: "House",
    sigTab: "Sig",
    emailTab: "Email",
    domainTab: "Domain",
    socialTab: "Handle",
    fixTab: "Fix",
    nameVibe: "Name Vibration",
    fullName: "Full name",
    yourName: "Your name",
    mobileVibe: "Mobile Vibration",
    mobileNo: "Mobile number",
    brandVibe: "Brand Vibration",
    brandName: "Brand name",
    vehicleVibe: "Vehicle Number Vibration",
    vehicleNo: "Vehicle / plate number",
    houseVibe: "House Number Vibration",
    houseNo: "House / flat number",
    sigVibe: "Signature Vibration",
    sigLabel: "Your Signature (Type the letters of your sign)",
    emailVibe: "Email Vibration",
    emailLabel: "Email Address (local username part analyzed)",
    domainVibe: "Domain Vibration",
    domainLabel: "Domain Name (primary domain prefix analyzed)",
    socialVibe: "Social Handle Vibration",
    socialLabel: "Social Handle (username excluding @ symbol)",
    nameFix: "Name Correction Engine",
    mulankLabel: "Your Mulank (1-9)",
    mulankHelp: "Mulank = sum of your birth date digits reduced to 1-9. Don't know it? Use the full report.",
    friendlyRoots: "Friendly Roots",
    originalRoot: "Current Root",
    alreadyGood: "✓ Your name already vibrates at a friendly number for your Mulank. No correction needed!",
    tweakSuggestions: "Suggested spellings:",
    noSimpleTweak: "No simple spelling tweak found. A small addition (extra vowel/letter) may help — try the full consultation.",
  },
  hi: {
    title: "मुफ़्त कंपन कैलकुलेटर",
    subtitle: "किसी भी नाम, मोबाइल नंबर, या ब्रांड के लिए त्वरित अंक शास्त्र जांच।",
    back: "पीछे",
    nameTab: "नाम",
    mobileTab: "मोबाइल",
    brandTab: "ब्रांड",
    vehicleTab: "वाहन",
    houseTab: "घर",
    sigTab: "हस्ताक्षर",
    emailTab: "ईमेल",
    domainTab: "डोमेन",
    socialTab: "हैंडल",
    fixTab: "सुधार",
    nameVibe: "नाम कंपन",
    fullName: "पूरा नाम",
    yourName: "आपका नाम",
    mobileVibe: "मोबाइल कंपन",
    mobileNo: "मोबाइल नंबर",
    brandVibe: "ब्रांड कंपन",
    brandName: "ब्रांड का नाम",
    vehicleVibe: "वाहन नंबर कंपन",
    vehicleNo: "वाहन / प्लेट नंबर",
    houseVibe: "घर का नंबर कंपन",
    houseNo: "घर / फ्लैट नंबर",
    sigVibe: "हस्ताक्षर कंपन",
    sigLabel: "आपका हस्ताक्षर (हस्ताक्षर के अक्षर टाइप करें)",
    emailVibe: "ईमेल कंपन",
    emailLabel: "ईमेल पता (केवल स्थानीय उपयोगकर्ता नाम भाग का विश्लेषण)",
    domainVibe: "डोमेन कंपन",
    domainLabel: "डोमेन नाम (केवल प्राथमिक डोमेन उपसर्ग का विश्लेषण)",
    socialVibe: "सोशल हैंडल कंपन",
    socialLabel: "सोशल हैंडल (@ प्रतीक को छोड़कर उपयोगकर्ता नाम)",
    nameFix: "नाम सुधार इंजन",
    mulankLabel: "आपका मूलांक (1-9)",
    mulankHelp: "मूलांक = आपकी जन्म तिथि के अंकों का कुल योग 1-9 तक घटाया गया। नहीं जानते? पूर्ण रिपोर्ट का उपयोग करें।",
    friendlyRoots: "अनुकूल मूलांक",
    originalRoot: "वर्तमान मूल",
    alreadyGood: "✓ आपका नाम पहले से ही आपके मूलांक के लिए एक अनुकूल संख्या पर स्पंदित होता है। कोई सुधार आवश्यक नहीं है!",
    tweakSuggestions: "सुझाए गए वर्तनी विकल्प:",
    noSimpleTweak: "कोई सरल स्पेलिंग सुधार नहीं मिला। एक छोटा सा अक्षर जोड़ने से मदद मिल सकती है - पूरी रिपोर्ट देखें।",
  },
  hinglish: {
    title: "Free Vibration Calculator",
    subtitle: "Kisi bhi naam, mobile number, ya brand ke liye quick numerology check.",
    back: "Back",
    nameTab: "Name",
    mobileTab: "Mobile",
    brandTab: "Brand",
    vehicleTab: "Vehicle",
    houseTab: "House",
    sigTab: "Sig",
    emailTab: "Email",
    domainTab: "Domain",
    socialTab: "Handle",
    fixTab: "Fix",
    nameVibe: "Name Vibration",
    fullName: "Full name",
    yourName: "Your name",
    mobileVibe: "Mobile Vibration",
    mobileNo: "Mobile number",
    brandVibe: "Brand Vibration",
    brandName: "Brand name",
    vehicleVibe: "Vehicle Number Vibration",
    vehicleNo: "Vehicle / plate number",
    houseVibe: "House Number Vibration",
    houseNo: "House / flat number",
    sigVibe: "Signature Vibration",
    sigLabel: "Your Signature (Type the letters of your sign)",
    emailVibe: "Email Vibration",
    emailLabel: "Email Address (local username part analyzed)",
    domainVibe: "Domain Vibration",
    domainLabel: "Domain Name (primary domain prefix analyzed)",
    socialVibe: "Social Handle Vibration",
    socialLabel: "Social Handle (username excluding @ symbol)",
    nameFix: "Name Correction Engine",
    mulankLabel: "Your Mulank (1-9)",
    mulankHelp: "Mulank = birth date digits ka sum reduced to 1-9. Nahi pata? Full report use karein.",
    friendlyRoots: "Friendly Roots",
    originalRoot: "Current Root",
    alreadyGood: "✓ Aapka naam pehle se hi aapke Mulank ke sath ek friendly number par vibrate karta hai. No correction needed!",
    tweakSuggestions: "Suggested spellings:",
    noSimpleTweak: "No simple spelling tweak found. A small addition (extra vowel/letter) may help — try the full consultation.",
  }
};

const ToolsVibrationPage = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const tc = COPY_TOOLS[language as keyof typeof COPY_TOOLS] || COPY_TOOLS.en;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [brand, setBrand] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [house, setHouse] = useState("");
  const [signature, setSignature] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [fixName, setFixName] = useState("");
  const [fixMulank, setFixMulank] = useState("");

  const mobileValidation = mobile ? validateMobileNumber(mobile) : null;
  const mobileValid = mobileValidation?.valid ?? false;

  const nv = name ? calculateNameVibration(name) : null;
  const mv = mobileValid ? calculateMobileVibration(mobile) : null;
  const bv = brand ? calculateBusinessVibration(brand) : null;
  const veh = vehicle ? analyzeVehicle(vehicle) : null;
  const hou = house ? analyzeHouse(house) : null;
  const sig = signature ? analyzeSignature(signature) : null;
  const eml = email ? analyzeEmail(email) : null;
  const dom = domain ? analyzeDomain(domain) : null;
  const soc = socialHandle ? analyzeSocialHandle(socialHandle) : null;
  const fixMulankNum = Number(fixMulank);
  const correction = fixName && fixMulankNum >= 1 && fixMulankNum <= 9 ? correctName(fixName, fixMulankNum) : null;

  const hasAnyResult = !!(nv || mv || bv || veh || hou || sig || eml || dom || soc || correction);

  useEffect(() => {
    const loadProfile = async () => {
      // 1. Try local storage
      const raw = localStorage.getItem('numerologyFormData');
      if (raw) {
        try {
          const fd = JSON.parse(raw);
          if (fd.fullBirthName) {
            setName(fd.fullBirthName);
            setFixName(fd.fullBirthName);
          }
          if (fd.dateOfBirth) {
            const calculatedProfile = calculateFullProfile(fd.fullBirthName || "", fd.dateOfBirth);
            setFixMulank(String(calculatedProfile.lifePath));
          }
          return;
        } catch {}
      }

      // 2. Try Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, dob')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (profile) {
          if (profile.full_name) {
            setName(profile.full_name);
            setFixName(profile.full_name);
          }
          if (profile.dob) {
            const calculatedProfile = calculateFullProfile(profile.full_name || "", profile.dob.split('-').reverse().join('/'));
            setFixMulank(String(calculatedProfile.lifePath));
          }
        }
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <SEO
        title="Free Vibration Calculator | Ankjyotish AI"
        description="Free numerology vibration calculator for your name, mobile number, or brand. Instant Pythagorean & Chaldean roots."
      />
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />{tc.back}</Button></Link>
            <Logo size="md" />
          </div>
          <LanguageToggle />
        </div>
      </header>

      <div className="container max-w-3xl mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <Sparkles className="w-10 h-10 mx-auto text-primary mb-3" />
          <h1 className="text-3xl md:text-4xl font-display font-bold">{tc.title}</h1>
          <p className="text-muted-foreground mt-2">{tc.subtitle}</p>
        </header>

        <Tabs defaultValue="name">
          <TabsList className="grid grid-cols-5 md:grid-cols-10 w-full mb-4">
            <TabsTrigger value="name" className="gap-1 text-xs"><User className="w-3.5 h-3.5" /> {tc.nameTab}</TabsTrigger>
            <TabsTrigger value="mobile" className="gap-1 text-xs"><Smartphone className="w-3.5 h-3.5" /> {tc.mobileTab}</TabsTrigger>
            <TabsTrigger value="brand" className="gap-1 text-xs"><Building2 className="w-3.5 h-3.5" /> {tc.brandTab}</TabsTrigger>
            <TabsTrigger value="vehicle" className="gap-1 text-xs"><Car className="w-3.5 h-3.5" /> {tc.vehicleTab}</TabsTrigger>
            <TabsTrigger value="house" className="gap-1 text-xs"><Home className="w-3.5 h-3.5" /> {tc.houseTab}</TabsTrigger>
            <TabsTrigger value="signature" className="gap-1 text-xs"><FileSignature className="w-3.5 h-3.5" /> {tc.sigTab}</TabsTrigger>
            <TabsTrigger value="email" className="gap-1 text-xs"><Mail className="w-3.5 h-3.5" /> {tc.emailTab}</TabsTrigger>
            <TabsTrigger value="domain" className="gap-1 text-xs"><Globe className="w-3.5 h-3.5" /> {tc.domainTab}</TabsTrigger>
            <TabsTrigger value="social" className="gap-1 text-xs"><AtSign className="w-3.5 h-3.5" /> {tc.socialTab}</TabsTrigger>
            <TabsTrigger value="namefix" className="gap-1 text-xs"><Wand2 className="w-3.5 h-3.5" /> {tc.fixTab}</TabsTrigger>
          </TabsList>

          <TabsContent value="name">
            <Card>
              <CardHeader><CardTitle>{tc.nameVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.fullName}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={tc.yourName} />
                {nv && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <Stat label="Pythagorean" value={nv.pythagoreanTotal} />
                    <Stat label="Chaldean" value={nv.chaldeanTotal} />
                    <Stat label="Root" value={nv.root} highlight />
                    <Stat label="Master?" value={nv.isMaster ? "Yes" : "No"} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile">
            <Card>
              <CardHeader><CardTitle>{tc.mobileVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.mobileNo}</Label>
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  inputMode="tel"
                  placeholder="9876543210"
                  className={mobileValidation && !mobileValidation.valid ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {mobileValidation && !mobileValidation.valid && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {mobileValidation.error}
                  </p>
                )}
                {mv && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    <Stat label="Sum" value={mv.digitSum} />
                    <Stat label="Root" value={mv.root} highlight />
                    <Stat label="Last-4" value={mv.last4Root} />
                    <Stat label="Missing" value={mv.missingDigits.join(", ") || "none"} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brand">
            <Card>
              <CardHeader><CardTitle>{tc.brandVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.brandName}</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Aurora Wellness" />
                {bv && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <Stat label="Root" value={bv.brand.root} highlight />
                      <Stat label="Archetype" value={bv.archetype.name} />
                      <Stat label="Compound" value={bv.brand.compound} />
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg">{bv.archetype.tagline}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicle">
            <Card>
              <CardHeader><CardTitle>{tc.vehicleVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.vehicleNo}</Label>
                <Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="e.g. DL3CAB1234" />
                {veh && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Stat label="Total" value={veh.total} />
                      <Stat label="Root" value={veh.root} highlight />
                      <Stat label="Digits Root" value={veh.digitsRoot} />
                      <Stat label="Score" value={`${veh.score}%`} />
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg">{veh.meaning[language as keyof typeof veh.meaning] || veh.meaning.en}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Stat label="Safety" value={`${veh.energy.safety}%`} />
                      <Stat label="Luck" value={`${veh.energy.luck}%`} />
                      <Stat label="Harmony" value={`${veh.energy.harmony}%`} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="house">
            <Card>
              <CardHeader><CardTitle>{tc.houseVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.houseNo}</Label>
                <Input value={house} onChange={(e) => setHouse(e.target.value)} placeholder="e.g. 204 or A-12" />
                {hou && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Stat label="Total" value={hou.total} />
                      <Stat label="Root" value={hou.root} highlight />
                      <Stat label="Score" value={`${hou.score}%`} />
                      <Stat label="Peace" value={`${hou.energy.peace}%`} />
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg">{hou.meaning[language as keyof typeof hou.meaning] || hou.meaning.en}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Stat label="Prosperity" value={`${hou.energy.prosperity}%`} />
                      <Stat label="Relationships" value={`${hou.energy.relationships}%`} />
                      <Stat label="Health" value={`${hou.energy.health}%`} />
                      <Stat label="Peace" value={`${hou.energy.peace}%`} />
                    </div>
                    <p className="text-sm bg-primary/5 border border-primary/20 p-3 rounded-lg">
                      <strong className="text-primary">Remedy:</strong> {hou.remedy[language as keyof typeof hou.remedy] || hou.remedy.en}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signature">
            <Card>
              <CardHeader><CardTitle>{tc.sigVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.sigLabel}</Label>
                <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="e.g. John Doe" />
                {sig && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Stat label="Total" value={sig.total} />
                      <Stat label="Root" value={sig.root} highlight />
                      <Stat label="Vibe Score" value={`${sig.score}%`} />
                      <Stat label="Verdict" value={sig.vsMulank === "friendly" ? "Friendly ✓" : "Neutral"} />
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg">
                      {sig.meaning[language as keyof typeof sig.meaning] || sig.meaning.en}
                    </p>
                    <p className="text-sm bg-primary/5 border border-primary/20 p-3 rounded-lg">
                      <strong className="text-primary">Remedy/Tip:</strong> {sig.remedy[language as keyof typeof sig.remedy] || sig.remedy.en}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader><CardTitle>{tc.emailVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.emailLabel}</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. rahul.sharma@example.com" />
                {eml && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Stat label="Total" value={eml.total} />
                      <Stat label="Root" value={eml.root} highlight />
                      <Stat label="Vibe Score" value={`${eml.score}%`} />
                      <Stat label="Match" value={eml.vsMulank === "friendly" ? "Friendly ✓" : "Neutral"} />
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg">
                      {eml.meaning[language as keyof typeof eml.meaning] || eml.meaning.en}
                    </p>
                    <p className="text-xs text-muted-foreground italic p-1">
                      {eml.verdict[language as keyof typeof eml.verdict] || eml.verdict.en}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domain">
            <Card>
              <CardHeader><CardTitle>{tc.domainVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.domainLabel}</Label>
                <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. aurora.com" />
                {dom && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Stat label="Total" value={dom.total} />
                      <Stat label="Root" value={dom.root} highlight />
                      <Stat label="Vibe Score" value={`${dom.score}%`} />
                      <Stat label="Match" value={dom.vsMulank === "friendly" ? "Friendly ✓" : "Neutral"} />
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg">
                      {dom.meaning[language as keyof typeof dom.meaning] || dom.meaning.en}
                    </p>
                    <p className="text-xs text-muted-foreground italic p-1">
                      {dom.verdict[language as keyof typeof dom.verdict] || dom.verdict.en}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader><CardTitle>{tc.socialVibe}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.socialLabel}</Label>
                <Input value={socialHandle} onChange={(e) => setSocialHandle(e.target.value)} placeholder="e.g. rahul_creations" />
                {soc && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Stat label="Total" value={soc.total} />
                      <Stat label="Root" value={soc.root} highlight />
                      <Stat label="Vibe Score" value={`${soc.score}%`} />
                      <Stat label="Match" value={soc.vsMulank === "friendly" ? "Friendly ✓" : "Neutral"} />
                    </div>
                    <p className="text-sm bg-muted/40 p-3 rounded-lg">
                      {soc.meaning[language as keyof typeof soc.meaning] || soc.meaning.en}
                    </p>
                    <p className="text-xs text-muted-foreground italic p-1">
                      {soc.verdict[language as keyof typeof soc.verdict] || soc.verdict.en}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="namefix">
            <Card>
              <CardHeader><CardTitle>{tc.nameFix}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Label>{tc.fullName}</Label>
                <Input value={fixName} onChange={(e) => setFixName(e.target.value)} placeholder={tc.yourName} />
                <Label>{tc.mulankLabel}</Label>
                <Input value={fixMulank} onChange={(e) => setFixMulank(e.target.value)} inputMode="numeric" placeholder="e.g. 5" />
                <p className="text-xs text-muted-foreground">{tc.mulankHelp}</p>
                {correction && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <Stat label={tc.originalRoot} value={correction.originalRoot} />
                      <Stat label={tc.friendlyRoots} value={correction.targetRoots.join(", ")} highlight />
                    </div>
                    {correction.alreadyGood ? (
                      <p className="text-sm bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-green-700 dark:text-green-400">
                        {tc.alreadyGood}
                      </p>
                    ) : correction.suggestions.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{tc.tweakSuggestions}</p>
                        {correction.suggestions.map((s, i) => (
                          <div key={i} className="p-3 bg-muted/40 rounded-lg flex items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-base text-primary">{s.spelling}</p>
                              <p className="text-xs text-muted-foreground mt-1">{s.reason[language as keyof typeof s.reason] || s.reason.en}</p>
                            </div>
                            <Badge variant="secondary" className="shrink-0">Root {s.root}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm bg-muted/40 p-3 rounded-lg">{tc.noSimpleTweak}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {hasAnyResult && (
          <Card className="mt-6 relative overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/5 to-divine/5">
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="gap-1 text-[10px] uppercase tracking-wider">
                <Lock className="w-3 h-3" /> Pro
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-display">
                <Sparkles className="w-5 h-5 text-primary" />
                {t.proTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t.proSubtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-2">
                {t.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {i === 0 ? <Heart className="w-3 h-3 text-primary" /> :
                       i === 1 ? <TrendingUp className="w-3 h-3 text-primary" /> :
                       i === 2 ? <Smartphone className="w-3 h-3 text-primary" /> :
                       i === 3 ? <Building2 className="w-3 h-3 text-primary" /> :
                       <DollarSign className="w-3 h-3 text-primary" />}
                    </div>
                    <span className="text-sm text-foreground">{feat}</span>
                  </div>
                ))}
              </div>
              <Link to="/payment?tier=pro&returnUrl=/tools/vibration">
                <Button className="w-full gap-2 bg-gradient-to-r from-primary to-divine hover:from-primary/90 hover:to-divine/90">
                  {t.cta}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!hasAnyResult && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-3">
              {language === 'hi' ? 'अनुकूलता, उपचार और भविष्यवाणी के साथ पूर्ण व्यक्तिगत विश्लेषण चाहते हैं?' :
               language === 'hinglish' ? 'Compatibility, remedies aur predictions ke saath full personalized analysis chahiye?' :
               'Want a full personalized analysis with compatibility, remedies & predictions?'}
            </p>
            <Link to="/form">
              <Button size="lg">
                {language === 'hi' ? 'मेरी पूरी रिपोर्ट प्राप्त करें' :
                 language === 'hinglish' ? 'Meri Full Report Lein' :
                 'Get My Full Report'}
              </Button>
            </Link>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {language === 'hi' ? 'और मुफ़्त टूल:' : language === 'hinglish' ? 'Aur free tools:' : 'More free tools:'}
              </span>
              <Link to="/moolank-calculator" className="text-primary hover:underline">Moolank/Bhagyank</Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/naamank-calculator" className="text-primary hover:underline">Naamank</Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/baby-name" className="text-primary hover:underline">
                {language === 'hi' ? 'शिशु नाम' : 'Baby Names'}
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/ai-chat" className="text-primary hover:underline">AI Chat</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) => (
  <div className={`p-3 rounded-lg ${highlight ? "bg-primary/10" : "bg-muted/40"}`}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-display font-semibold">{value}</p>
  </div>
);

export default ToolsVibrationPage;
