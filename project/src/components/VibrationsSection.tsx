import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Smartphone, Building2, User, TrendingUp, AlertCircle } from "lucide-react";
import { analyzeNameCompatibility } from "@/lib/nameVibration";
import { calculateMobileVibration, analyzeMobileCompatibility, validateMobileNumber } from "@/lib/mobileVibration";
import { calculateBusinessVibration, suggestBrandTweaks, Industry } from "@/lib/businessNameVibration";

interface Props {
  currentName: string;
  dob: string; // dd/mm/yyyy
  mulank: number;
  bhagyank: number;
  defaultMobile?: string;
}

const verdictBadge = (v: string) => {
  const cls =
    v === "friendly"
      ? "bg-green-500/15 text-green-700 dark:text-green-300"
      : v === "enemy"
      ? "bg-red-500/15 text-red-700 dark:text-red-300"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-300";
  return <Badge className={cls}>{v}</Badge>;
};

const VibrationsSection = ({ currentName, dob, mulank, bhagyank, defaultMobile = "" }: Props) => {
  const [mobile, setMobile] = useState(defaultMobile);
  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState<Industry>("tech");

  const nameAnalysis = useMemo(
    () => (currentName && dob ? analyzeNameCompatibility(currentName, dob) : null),
    [currentName, dob],
  );

  const mobileValidation = useMemo(() => {
    if (!mobile) return null;
    return validateMobileNumber(mobile);
  }, [mobile]);

  const mobileAnalysis = useMemo(() => {
    if (!mobileValidation?.valid) return null;
    return analyzeMobileCompatibility(mobile, mulank, bhagyank);
  }, [mobile, mulank, bhagyank, mobileValidation]);

  const brandAnalysis = useMemo(() => {
    if (!brand) return null;
    return calculateBusinessVibration(brand, dob, industry);
  }, [brand, dob, industry]);

  const brandTweaks = useMemo(() => {
    if (!brand || !brandAnalysis) return [];
    const target = brandAnalysis.industryFit?.recommendedRoots[0] || 5;
    return suggestBrandTweaks(brand, target);
  }, [brand, brandAnalysis]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Vibrations — Name, Mobile & Brand
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Check the energy of your name, phone number, and any brand or business name against your core numbers.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="name">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="name" className="gap-1"><User className="w-4 h-4" /> Name</TabsTrigger>
            <TabsTrigger value="mobile" className="gap-1"><Smartphone className="w-4 h-4" /> Mobile</TabsTrigger>
            <TabsTrigger value="brand" className="gap-1"><Building2 className="w-4 h-4" /> Brand</TabsTrigger>
          </TabsList>

          {/* NAME */}
          <TabsContent value="name" className="space-y-4">
            {nameAnalysis ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat label="Pythagorean" value={nameAnalysis.vibration.pythagoreanTotal} />
                  <Stat label="Chaldean" value={nameAnalysis.vibration.chaldeanTotal} />
                  <Stat label="Root" value={nameAnalysis.vibration.root} highlight />
                  <Stat label="Alignment" value={`${nameAnalysis.alignmentScore}%`} highlight />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <RowCard title={`vs Mulank (${nameAnalysis.mulank})`} verdict={nameAnalysis.vsMulank} />
                  <RowCard title={`vs Bhagyank (${nameAnalysis.bhagyank})`} verdict={nameAnalysis.vsBhagyank} />
                  <RowCard title={`vs Life Path (${nameAnalysis.lifePath})`} verdict={nameAnalysis.vsLifePath} />
                </div>
                <p className="text-sm text-foreground bg-muted/40 p-3 rounded-lg">{nameAnalysis.summary}</p>
                {nameAnalysis.suggestions.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> Spelling tweaks to explore
                    </Label>
                    <div className="space-y-2">
                      {nameAnalysis.suggestions.map((s, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-xs text-muted-foreground">{s.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Add your current name and DOB to see vibration analysis.</p>
            )}
          </TabsContent>

          {/* MOBILE */}
          <TabsContent value="mobile" className="space-y-4">
            <div>
              <Label>Your mobile number</Label>
              <Input
                placeholder="e.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                inputMode="tel"
                className={mobileValidation && !mobileValidation.valid ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {mobileValidation && !mobileValidation.valid && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {mobileValidation.error}
                </p>
              )}
            </div>
            {mobileAnalysis && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Stat label="Sum" value={mobileAnalysis.vibration.digitSum} />
                  <Stat label="Root" value={mobileAnalysis.vibration.root} highlight />
                  <Stat label="Last-4 Root" value={mobileAnalysis.vibration.last4Root} />
                  <Stat label="Score" value={`${mobileAnalysis.score}%`} highlight />
                </div>
                <p className="text-sm text-foreground bg-muted/40 p-3 rounded-lg">{mobileAnalysis.verdict}</p>
                {mobileAnalysis.alternativeEndings.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2">Alternative endings</Label>
                    <div className="flex flex-wrap gap-2">
                      {mobileAnalysis.alternativeEndings.map((a, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          …{a.ending} → root {a.root}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* BRAND */}
          <TabsContent value="brand" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Brand / Business name</Label>
                <Input placeholder="e.g. Aurora Wellness" value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div>
                <Label>Industry</Label>
                <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["tech","finance","wellness","creative","retail","education","food"] as Industry[]).map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {brandAnalysis && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Stat label="Root" value={brandAnalysis.brand.root} highlight />
                  <Stat label="Archetype" value={brandAnalysis.archetype.name} />
                  <Stat
                    label="Industry Fit"
                    value={brandAnalysis.industryFit?.isFit ? "Yes" : "Tweak suggested"}
                    highlight={brandAnalysis.industryFit?.isFit}
                  />
                </div>
                <p className="text-sm bg-muted/40 p-3 rounded-lg">
                  <strong>{brandAnalysis.archetype.name}:</strong> {brandAnalysis.archetype.tagline}
                </p>
                {brandTweaks.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2">Spelling variants for stronger fit</Label>
                    <div className="space-y-2">
                      {brandTweaks.map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                          <span className="font-medium">{t.name}</span>
                          <span className="text-xs text-muted-foreground">{t.change} → root {t.root}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Stat = ({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) => (
  <div className={`p-3 rounded-lg ${highlight ? "bg-primary/10" : "bg-muted/40"}`}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-display font-semibold">{value}</p>
  </div>
);

const RowCard = ({ title, verdict }: { title: string; verdict: string }) => (
  <div className="p-3 bg-muted/40 rounded-lg flex items-center justify-between">
    <span className="text-sm">{title}</span>
    {verdictBadge(verdict)}
  </div>
);

export default VibrationsSection;
