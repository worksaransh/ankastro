import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Star,
  Users,
  Award,
  AlertCircle,
  Lock,
  Sparkles,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

interface FamousPerson {
  id: string;
  name: string;
  date_of_birth: string;
  mulank: number | null;
  bhagyank: number | null;
  life_path: number;
  destiny_number: number;
  soul_urge: number;
  personality_number: number;
  profession: string;
  field: string | null;
  country: string | null;
  nationality: string | null;
  known_for: string | null;
  short_bio: string;
}

type Lang = 'en' | 'hi' | 'hinglish';

type NumKey = 'mulank' | 'bhagyank' | 'life_path' | 'destiny_number' | 'soul_urge';

interface MatchedNumber {
  key: NumKey;
  value: number;
  weight: number;
  isMaster: boolean;
}

interface MatchResult {
  person: FamousPerson;
  matchingNumbers: MatchedNumber[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  totalScore: number;
  careerBoosted: boolean;
  careerBoostScore: number;
  masterBonus: number;
}

interface Props {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  mulank?: number;
  bhagyank?: number;
  profession?: string;
  language?: Lang;
  previewMode?: boolean;
}

const LABELS: Record<Lang, Record<string, string>> = {
  en: {
    mulank: 'Mulank',
    bhagyank: 'Bhagyank',
    life_path: 'Life Path',
    destiny_number: 'Destiny',
    soul_urge: 'Soul Urge',
    yourArchetype: 'Your Archetype',
    yourNumbers: 'Your Numbers',
    careerMatched: '🎬 Matched by Your Career Field',
    allMatches: '⭐ All Numerological Matches',
    highMatches: '🌟 High Match',
    mediumMatches: '⭐ Medium Match',
    possibleMatches: '✨ Possible Match',
    noHigh: 'No HIGH matches found for your numbers',
    noMedium: 'No MEDIUM matches found for your numbers',
    noPossible: 'No POSSIBLE matches found for your numbers',
    showMore: 'Show more',
    showLess: 'Show less',
    title: 'Famous Personality Match',
    subtitle: 'Verified matches based on exact numerological calculations.',
    loading: 'Loading verified matches...',
    empty: 'No matches found with current filters. Try adjusting the sliders or field below.',
    why: 'Why this match',
    match: 'Match',
    seeMore: 'See all matches in Premium Report',
    moreLocked: 'more matches in Premium',
    filters: 'Filters',
    fieldFilter: 'Career Field',
    allFields: 'All Fields',
    reset: 'Reset',
    breakdown: 'Confidence Breakdown',
    base: 'Base score',
    masterBonus: 'Master number bonus',
    careerBoost: 'Career field boost',
    total: 'Total',
    weight: 'wt',
    masterTag: 'Master',
  },
  hi: {
    mulank: 'मूलांक',
    bhagyank: 'भाग्यांक',
    life_path: 'जीवन पथ',
    destiny_number: 'भाग्य संख्या',
    soul_urge: 'आत्मा संख्या',
    yourArchetype: 'आपका स्वरूप',
    yourNumbers: 'आपकी संख्याएँ',
    careerMatched: '🎬 आपके करियर क्षेत्र से मेल',
    allMatches: '⭐ सभी अंकशास्त्रीय मेल',
    highMatches: '🌟 उच्च मेल',
    mediumMatches: '⭐ मध्यम मेल',
    possibleMatches: '✨ संभावित मेल',
    noHigh: 'आपकी संख्याओं के लिए कोई उच्च मेल नहीं',
    noMedium: 'आपकी संख्याओं के लिए कोई मध्यम मेल नहीं',
    noPossible: 'आपकी संख्याओं के लिए कोई संभावित मेल नहीं',
    showMore: 'और दिखाएँ',
    showLess: 'कम दिखाएँ',
    title: 'प्रसिद्ध व्यक्तित्व मिलान',
    subtitle: 'सटीक अंकशास्त्र गणनाओं पर आधारित सत्यापित मेल।',
    loading: 'मिलान लोड हो रहा है...',
    empty: 'इन फ़िल्टरों के साथ कोई मेल नहीं। स्लाइडर या क्षेत्र समायोजित करें।',
    why: 'यह मेल क्यों',
    match: 'मेल',
    seeMore: 'प्रीमियम रिपोर्ट में सभी मेल देखें',
    moreLocked: 'और मेल प्रीमियम में',
    filters: 'फ़िल्टर',
    fieldFilter: 'करियर क्षेत्र',
    allFields: 'सभी क्षेत्र',
    reset: 'रीसेट',
    breakdown: 'विश्वास विवरण',
    base: 'मूल अंक',
    masterBonus: 'मास्टर नंबर बोनस',
    careerBoost: 'करियर बूस्ट',
    total: 'कुल',
    weight: 'भार',
    masterTag: 'मास्टर',
  },
  hinglish: {
    mulank: 'Mulank',
    bhagyank: 'Bhagyank',
    life_path: 'Life Path',
    destiny_number: 'Destiny',
    soul_urge: 'Soul Urge',
    yourArchetype: 'Aapka Archetype',
    yourNumbers: 'Aapke Numbers',
    careerMatched: '🎬 Aapke Career Field se Match',
    allMatches: '⭐ Saare Numerology Matches',
    highMatches: '🌟 High Match',
    mediumMatches: '⭐ Medium Match',
    possibleMatches: '✨ Possible Match',
    noHigh: 'Aapke numbers ke liye koi HIGH match nahi mila',
    noMedium: 'Aapke numbers ke liye koi MEDIUM match nahi mila',
    noPossible: 'Aapke numbers ke liye koi POSSIBLE match nahi mila',
    showMore: 'Aur dekhein',
    showLess: 'Kam dekhein',
    title: 'Famous Personality Match',
    subtitle: 'Sahi numerology calculations par based verified matches.',
    loading: 'Matches load ho rahe hain...',
    empty: 'In filters ke saath koi match nahi mila. Sliders ya field adjust karein.',
    why: 'Yeh match kyun',
    match: 'Match',
    seeMore: 'Saare matches Premium Report mein dekhein',
    moreLocked: 'aur matches Premium mein',
    filters: 'Filters',
    fieldFilter: 'Career Field',
    allFields: 'Saare Fields',
    reset: 'Reset',
    breakdown: 'Confidence Breakdown',
    base: 'Base score',
    masterBonus: 'Master number bonus',
    careerBoost: 'Career field boost',
    total: 'Total',
    weight: 'wt',
    masterTag: 'Master',
  },
};

const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳',
  USA: '🇺🇸',
  UK: '🇬🇧',
  Argentina: '🇦🇷',
  Portugal: '🇵🇹',
  Germany: '🇩🇪',
  Pakistan: '🇵🇰',
  'South Africa': '🇿🇦',
  Serbia: '🇷🇸',
};

const archetypes: Record<number, string> = {
  1: 'The Strategic Leader',
  2: 'The Emotional Healer',
  3: 'The Creative Communicator',
  4: 'The Master Builder',
  5: 'The Adventurous Explorer',
  6: 'The Nurturing Guardian',
  7: 'The Mystic Seeker',
  8: 'The Power Achiever',
  9: 'The Compassionate Visionary',
  11: 'The Illuminated Inspirer',
  22: 'The Grand Architect',
  33: 'The Master Healer-Teacher',
};

const WEIGHTS: Record<NumKey, number> = {
  mulank: 2,
  bhagyank: 2,
  life_path: 1.5,
  destiny_number: 1.5,
  soul_urge: 1,
};

const MASTER_NUMBERS = new Set([11, 22, 33]);
const MASTER_BONUS_PER_MATCH = 0.5;
const CAREER_BOOST = 1.5;

function inferCareerFields(profession: string): string[] {
  const p = profession.toLowerCase();
  const fields: string[] = [];
  if (/(actor|actress|film|cinema|acting|movie)/.test(p)) fields.push('Bollywood', 'South Cinema', 'Hollywood');
  if (/(music|singer|composer|musician|artist)/.test(p)) fields.push('Music');
  if (/(business|entrepreneur|startup|founder|ceo|investor|finance)/.test(p)) fields.push('Business', 'Technology', 'Finance');
  if (/(tech|engineer|software|developer|it|coder|programmer)/.test(p)) fields.push('Technology');
  if (/(sport|cricket|football|tennis|athlete|player|game)/.test(p)) fields.push('Sports');
  if (/(politic|leader|minister|president|government)/.test(p)) fields.push('Politics');
  if (/(scien|research|physic|doctor|medical)/.test(p)) fields.push('Science');
  if (/(spiritual|guru|yog|teacher|coach|mentor)/.test(p)) fields.push('Spirituality');
  if (/(media|journalist|news|tv|host)/.test(p)) fields.push('Media');
  if (/(activ|social|education)/.test(p)) fields.push('Education');
  return fields;
}

function getConfidence(score: number): { label: 'HIGH' | 'MEDIUM' | 'LOW'; pct: number } {
  if (score >= 5) return { label: 'HIGH', pct: 95 };
  if (score >= 3) return { label: 'HIGH', pct: 87 };
  if (score >= 2) return { label: 'MEDIUM', pct: 76 };
  if (score >= 1.5) return { label: 'MEDIUM', pct: 65 };
  return { label: 'LOW', pct: 52 };
}

function getConfidenceColor(c: 'HIGH' | 'MEDIUM' | 'LOW') {
  if (c === 'HIGH') return 'text-green-500';
  if (c === 'MEDIUM') return 'text-yellow-500';
  return 'text-blue-400';
}

function getConfidenceBg(c: 'HIGH' | 'MEDIUM' | 'LOW') {
  if (c === 'HIGH') return 'bg-green-500/10 border-green-500/30';
  if (c === 'MEDIUM') return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-muted/30 border-border';
}

export default function FamousPersonalityMatch({
  lifePath,
  destiny,
  soulUrge,
  mulank,
  bhagyank,
  profession = '',
  language = 'en',
  previewMode = false,
}: Props) {
  const [allPersons, setAllPersons] = useState<FamousPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const t = LABELS[language] || LABELS.en;

  // Filter state — initialized from props
  const [fMulank, setFMulank] = useState<number>(mulank ?? 1);
  const [fBhagyank, setFBhagyank] = useState<number>(bhagyank ?? 1);
  const [fLifePath, setFLifePath] = useState<number>(lifePath);
  const [fSoulUrge, setFSoulUrge] = useState<number>(soulUrge);
  const [fField, setFField] = useState<string>('all');
  const [openBreakdown, setOpenBreakdown] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPersons() {
      setLoading(true);
      const { data, error } = await supabase
        .from('famous_persons')
        .select('*')
        .eq('verified', true);
      if (cancelled) return;
      if (error || !data) {
        setLoading(false);
        return;
      }
      setAllPersons(data as FamousPerson[]);
      setLoading(false);
    }
    fetchPersons();
    return () => {
      cancelled = true;
    };
  }, []);

  // Reset sliders when source numbers change
  useEffect(() => {
    if (mulank != null) setFMulank(mulank);
  }, [mulank]);
  useEffect(() => {
    if (bhagyank != null) setFBhagyank(bhagyank);
  }, [bhagyank]);
  useEffect(() => setFLifePath(lifePath), [lifePath]);
  useEffect(() => setFSoulUrge(soulUrge), [soulUrge]);

  const availableFields = useMemo(() => {
    const set = new Set<string>();
    allPersons.forEach((p) => {
      if (p.field) set.add(p.field);
    });
    return Array.from(set).sort();
  }, [allPersons]);

  const careerFields = useMemo(
    () => (profession ? inferCareerFields(profession) : []),
    [profession],
  );

  const allMatches = useMemo<MatchResult[]>(() => {
    const results: MatchResult[] = [];
    for (const person of allPersons) {
      if (fField !== 'all' && person.field !== fField) continue;

      const matching: MatchedNumber[] = [];
      let base = 0;
      let masterBonus = 0;

      const checks: Array<{ key: NumKey; userVal: number; personVal: number | null }> = [
        { key: 'mulank', userVal: fMulank, personVal: person.mulank },
        { key: 'bhagyank', userVal: fBhagyank, personVal: person.bhagyank },
        { key: 'life_path', userVal: fLifePath, personVal: person.life_path },
        { key: 'destiny_number', userVal: destiny, personVal: person.destiny_number },
        { key: 'soul_urge', userVal: fSoulUrge, personVal: person.soul_urge },
      ];

      for (const c of checks) {
        if (c.personVal != null && c.personVal === c.userVal) {
          const isMaster = MASTER_NUMBERS.has(c.userVal);
          const w = WEIGHTS[c.key];
          matching.push({ key: c.key, value: c.userVal, weight: w, isMaster });
          base += w;
          if (isMaster) masterBonus += MASTER_BONUS_PER_MATCH;
        }
      }

      if (matching.length === 0) continue;

      const careerBoosted =
        careerFields.length > 0 && person.field ? careerFields.includes(person.field) : false;
      const careerBoostScore = careerBoosted ? CAREER_BOOST : 0;
      const total = base + masterBonus + careerBoostScore;
      const { label, pct } = getConfidence(total);

      results.push({
        person,
        matchingNumbers: matching,
        confidence: label,
        confidenceScore: pct,
        totalScore: total,
        careerBoosted,
        careerBoostScore,
        masterBonus,
      });
    }
    results.sort((a, b) => b.totalScore - a.totalScore);
    return results;
  }, [allPersons, fMulank, fBhagyank, fLifePath, fSoulUrge, destiny, fField, careerFields]);

  const archetype = archetypes[lifePath] || 'The Unique Soul';
  const PER_TIER = previewMode ? 2 : 4;
  // Tier by score: HIGH ≥3, MEDIUM 1.5–2.99, POSSIBLE >0 and <1.5
  const highTier = allMatches.filter((m) => m.totalScore >= 3).slice(0, PER_TIER);
  const mediumTier = allMatches
    .filter((m) => m.totalScore >= 1.5 && m.totalScore < 3)
    .slice(0, PER_TIER);
  const possibleTier = allMatches
    .filter((m) => m.totalScore > 0 && m.totalScore < 1.5)
    .slice(0, PER_TIER);
  const totalShown = highTier.length + mediumTier.length + possibleTier.length;
  const hiddenCount = Math.max(0, allMatches.length - totalShown);

  const resetFilters = () => {
    if (mulank != null) setFMulank(mulank);
    if (bhagyank != null) setFBhagyank(bhagyank);
    setFLifePath(lifePath);
    setFSoulUrge(soulUrge);
    setFField('all');
  };

  const renderBreakdown = (match: MatchResult) => (
    <div className="mt-2 p-3 rounded-md bg-background/60 border border-border space-y-2 text-xs">
      <div className="font-semibold text-foreground">{t.breakdown}</div>
      <div className="space-y-1">
        {match.matchingNumbers.map((mn, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">
              {t[mn.key]} = {mn.value}
              {mn.isMaster && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0">
                  {t.masterTag}
                </Badge>
              )}
            </span>
            <span className="font-mono text-foreground">
              +{mn.weight} ({t.weight})
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-2 space-y-1">
        {match.masterBonus > 0 && (
          <div className="flex justify-between text-amber-500">
            <span>{t.masterBonus}</span>
            <span className="font-mono">+{match.masterBonus.toFixed(1)}</span>
          </div>
        )}
        {match.careerBoostScore > 0 && (
          <div className="flex justify-between text-primary">
            <span>{t.careerBoost}</span>
            <span className="font-mono">+{match.careerBoostScore.toFixed(1)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border/50">
          <span>{t.total}</span>
          <span className="font-mono">
            {match.totalScore.toFixed(1)} → {match.confidenceScore}%
          </span>
        </div>
      </div>
    </div>
  );

  const renderCard = (match: MatchResult) => {
    const flag = match.person.country ? COUNTRY_FLAGS[match.person.country] || '🌍' : '🌍';
    const isOpen = openBreakdown === match.person.id;
    return (
      <div
        key={match.person.id}
        className={`p-3 sm:p-4 rounded-lg border ${getConfidenceBg(match.confidence)}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground text-sm sm:text-base flex items-center gap-2 flex-wrap">
              <Star className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{flag}</span>
              <span>{match.person.name}</span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {match.person.profession}
              {match.person.field ? ` · ${match.person.field}` : ''}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`${getConfidenceColor(match.confidence)} border-current self-start text-xs whitespace-nowrap`}
          >
            {match.confidence} {t.match} ({match.confidenceScore}%)
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mb-2">{match.person.short_bio}</p>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {match.matchingNumbers.map((mn, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {t[mn.key]}: {mn.value}
              {mn.isMaster && ' ★'}
            </Badge>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/80 italic mb-1">
          <span className="font-medium not-italic">{t.why}:</span>{' '}
          {match.matchingNumbers.map((m) => t[m.key]).join(' + ')} {t.match.toLowerCase()}.
        </p>

        <Collapsible
          open={isOpen}
          onOpenChange={(o) => setOpenBreakdown(o ? match.person.id : null)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
              <ChevronDown
                className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
              {t.breakdown}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>{renderBreakdown(match)}</CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderSlider = (
    label: string,
    value: number,
    setValue: (n: number) => void,
    min = 1,
    max = 33,
  ) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Badge variant="outline" className="text-xs font-mono">
          {value}
          {MASTER_NUMBERS.has(value) && ' ★'}
        </Badge>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => setValue(v[0])}
        min={min}
        max={max}
        step={1}
      />
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="flex items-center gap-3 font-display text-base sm:text-lg">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 space-y-4">
        {/* Archetype */}
        <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {t.yourArchetype}
            </span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-foreground">{archetype}</p>
        </div>

        {/* Filters */}
        {!previewMode && (
          <div className="p-3 sm:p-4 rounded-lg bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t.filters}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-7 px-2 text-xs gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                {t.reset}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderSlider(t.mulank, fMulank, setFMulank, 1, 9)}
              {renderSlider(t.bhagyank, fBhagyank, setFBhagyank, 1, 9)}
              {renderSlider(t.life_path, fLifePath, setFLifePath, 1, 33)}
              {renderSlider(t.soul_urge, fSoulUrge, setFSoulUrge, 1, 33)}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t.fieldFilter}</Label>
              <Select value={fField} onValueChange={setFField}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allFields}</SelectItem>
                  {availableFields.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Your Numbers summary */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">{t.yourNumbers}</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-xs">
              {t.mulank}: {fMulank}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t.bhagyank}: {fBhagyank}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t.life_path}: {fLifePath}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t.destiny_number}: {destiny}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t.soul_urge}: {fSoulUrge}
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-muted-foreground text-sm">{t.loading}</div>
        ) : totalShown === 0 ? (
          <div className="text-center py-6 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t.empty}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* HIGH tier */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                {t.highMatches}
              </h3>
              {highTier.length > 0 ? (
                <div className="space-y-3">{highTier.map(renderCard)}</div>
              ) : (
                <p className="text-xs text-muted-foreground italic px-1">{t.noHigh}</p>
              )}
            </div>

            {/* MEDIUM tier */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                {t.mediumMatches}
              </h3>
              {mediumTier.length > 0 ? (
                <div className="space-y-3">{mediumTier.map(renderCard)}</div>
              ) : (
                <p className="text-xs text-muted-foreground italic px-1">{t.noMedium}</p>
              )}
            </div>

            {/* POSSIBLE tier — collapsible */}
            <Collapsible defaultOpen={false}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  {t.possibleMatches}{' '}
                  {possibleTier.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {possibleTier.length}
                    </Badge>
                  )}
                </h3>
                {possibleTier.length > 0 && (
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                      <ChevronDown className="w-3 h-3" />
                      {t.showMore}
                    </Button>
                  </CollapsibleTrigger>
                )}
              </div>
              {possibleTier.length > 0 ? (
                <CollapsibleContent>
                  <div className="space-y-3 mt-3">{possibleTier.map(renderCard)}</div>
                </CollapsibleContent>
              ) : (
                <p className="text-xs text-muted-foreground italic px-1 mt-2">{t.noPossible}</p>
              )}
            </Collapsible>

            {previewMode && hiddenCount > 0 && (
              <div className="mt-4 p-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-center">
                <Lock className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  +{hiddenCount} {t.moreLocked}
                </p>
                <Button asChild size="sm" variant="default">
                  <Link to="/payment">{t.seeMore}</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
