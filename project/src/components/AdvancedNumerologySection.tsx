import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PinnacleCycle, 
  ChallengeCycle, 
  KarmicDebt,
  ElementalBalance 
} from "@/lib/advancedNumerology";
import { 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  Sparkles
} from "lucide-react";

interface AdvancedNumerologySectionProps {
  pinnacleCycles: PinnacleCycle[];
  challengeCycles: ChallengeCycle[];
  karmicDebts: KarmicDebt[];
  elementalBalance: ElementalBalance;
}

const AdvancedNumerologySection = ({
  pinnacleCycles,
  challengeCycles,
  karmicDebts,
  elementalBalance,
}: AdvancedNumerologySectionProps) => {
  const { language } = useLanguage();
  
  const labels = {
    en: {
      pinnacles: 'Life Phase Highlights (Pinnacles)',
      pinnaclesDesc: 'The major chapters of your life and what each one is about.',
      challenges: 'Lessons by Life Phase (Challenges)',
      challengesDesc: 'The key lesson life is teaching you in each phase.',
      karmicDebt: 'Old Patterns to Heal (Karmic Numbers)',
      karmicDebtDesc: 'Recurring patterns from the past that you are here to gently work through.',
      elements: 'Your Energy Mix (Elements)',
      elementsDesc: 'The balance of fire, water, earth, air, and ether in your chart.',
      fire: 'Fire',
      water: 'Water',
      earth: 'Earth',
      air: 'Air',
      ether: 'Ether',
      dominant: 'Strongest Element',
      weak: 'Element That Needs Care',
      notPresent: 'Not present in your chart',
      foundIn: 'Found in',
      lesson: 'Lesson',
      remedy: 'What helps',
      opportunities: 'Opportunities',
      challengesList: 'Challenges',
    },
    hi: {
      pinnacles: 'जीवन चरण (Pinnacles)',
      pinnaclesDesc: 'आपके जीवन के मुख्य अध्याय और हर चरण का मुख्य विषय।',
      challenges: 'हर चरण के सबक (Challenges)',
      challengesDesc: 'हर चरण में जीवन आपको क्या सिखा रहा है।',
      karmicDebt: 'पुराने पैटर्न (Karmic Numbers)',
      karmicDebtDesc: 'पुराने पैटर्न जिन पर इस जीवन में काम करना है।',
      elements: 'आपकी ऊर्जा का मिश्रण (Elements)',
      elementsDesc: 'अग्नि, जल, पृथ्वी, वायु और आकाश का संतुलन।',
      fire: 'अग्नि',
      water: 'जल',
      earth: 'पृथ्वी',
      air: 'वायु',
      ether: 'आकाश',
      dominant: 'सबसे मजबूत तत्व',
      weak: 'ध्यान देने वाला तत्व',
      notPresent: 'आपके चार्ट में मौजूद नहीं',
      foundIn: 'में पाया गया',
      lesson: 'सबक',
      remedy: 'क्या मदद करेगा',
      opportunities: 'अवसर',
      challengesList: 'चुनौतियां',
    },
    hinglish: {
      pinnacles: 'Life Phases (Pinnacles)',
      pinnaclesDesc: 'Aapki life ke major chapters aur har phase ka main theme.',
      challenges: 'Har Phase ke Lessons (Challenges)',
      challengesDesc: 'Har phase mein life aapko kya sikha rahi hai.',
      karmicDebt: 'Purane Patterns (Karmic Numbers)',
      karmicDebtDesc: 'Purane patterns jin par is life mein gently kaam karna hai.',
      elements: 'Aapki Energy Mix (Elements)',
      elementsDesc: 'Fire, Water, Earth, Air aur Ether ka balance aapke chart mein.',
      fire: 'Fire (Agni)',
      water: 'Water (Jal)',
      earth: 'Earth (Prithvi)',
      air: 'Air (Vayu)',
      ether: 'Ether (Akash)',
      dominant: 'Strongest Element',
      weak: 'Element jise care chahiye',
      notPresent: 'Aapke chart mein present nahi',
      foundIn: 'Mila in mein',
      lesson: 'Lesson',
      remedy: 'Kya help karega',
      opportunities: 'Opportunities',
      challengesList: 'Challenges',
    },
  };
  
  const t = labels[language] || labels.en;
  
  const elementIcons: Record<string, React.ReactNode> = {
    fire: <Flame className="w-5 h-5 text-orange-500" />,
    water: <Droplets className="w-5 h-5 text-blue-500" />,
    earth: <Mountain className="w-5 h-5 text-amber-700" />,
    air: <Wind className="w-5 h-5 text-cyan-500" />,
    ether: <Sparkles className="w-5 h-5 text-purple-500" />,
  };
  
  const elementColors: Record<string, string> = {
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    earth: 'bg-amber-700',
    air: 'bg-cyan-500',
    ether: 'bg-purple-500',
  };
  
  const presentDebts = karmicDebts.filter(d => d.present);
  
  return (
    <div className="space-y-6">
      {/* Pinnacle Cycles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {t.pinnacles}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.pinnaclesDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pinnacleCycles.map((cycle, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-display font-bold text-primary">{cycle.number}</span>
                  <Badge variant="outline">{cycle.ages}</Badge>
                </div>
                <p className="text-sm font-medium text-foreground mb-3">
                  {cycle.theme[language] || cycle.theme.en}
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-green-600 font-medium">{t.opportunities}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cycle.opportunities.slice(0, 2).map((o, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-green-500/10">{o}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 font-medium">{t.challengesList}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cycle.challenges.slice(0, 2).map((c, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-orange-500/10">{c}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Challenge Cycles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {t.challenges}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.challengesDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {challengeCycles.map((cycle, idx) => (
              <div key={idx} className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-display font-bold text-orange-600">{cycle.number}</span>
                  <Badge variant="outline">{cycle.ages}</Badge>
                </div>
                <p className="text-sm text-foreground mb-2">
                  {cycle.challenge[language] || cycle.challenge.en}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  {t.lesson}: {cycle.lesson}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Karmic Debt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            {t.karmicDebt}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.karmicDebtDesc}</p>
        </CardHeader>
        <CardContent>
          {presentDebts.length > 0 ? (
            <div className="space-y-4">
              {presentDebts.map((debt) => (
                <div key={debt.number} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-display font-bold text-purple-600">{debt.number}</span>
                    <div>
                      <p className="text-sm font-medium">{t.foundIn}: {debt.foundIn.join(', ')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-3">
                    {debt.meaning[language] || debt.meaning.en}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-xs font-medium text-purple-600 mb-1">{t.lesson}</p>
                      <p className="text-sm text-muted-foreground">{debt.lesson}</p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-xs font-medium text-green-600 mb-1">{t.remedy}</p>
                      <p className="text-sm text-muted-foreground">{debt.remedy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-green-500/50" />
              <p>{t.notPresent}</p>
              <p className="text-sm mt-2">No major karmic debts (13, 14, 16, 19) found. Your soul is in a lighter karmic cycle.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Elemental Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            {t.elements}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.elementsDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-1 sm:gap-4 mb-6">
            {(['fire', 'water', 'earth', 'air', 'ether'] as const).map((element) => (
              <div key={element} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-2">
                  {elementIcons[element]}
                </div>
                <p className="text-xs font-medium capitalize">{t[element]}</p>
                <p className="text-2xl font-display font-bold">{elementalBalance[element]}</p>
              </div>
            ))}
          </div>
          
          {/* Visual Bar */}
          <div className="h-4 rounded-full overflow-hidden flex bg-muted/30 mb-4">
            {(['fire', 'water', 'earth', 'air', 'ether'] as const).map((element) => {
              const total = elementalBalance.fire + elementalBalance.water + elementalBalance.earth + elementalBalance.air + elementalBalance.ether;
              const percentage = total > 0 ? (elementalBalance[element] / total) * 100 : 0;
              return (
                <div 
                  key={element} 
                  className={`${elementColors[element]} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              );
            })}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg">
              <p className="text-sm font-medium text-green-600 mb-1">{t.dominant}</p>
              <div className="flex items-center gap-2">
                {elementIcons[elementalBalance.dominant]}
                <span className="capitalize font-medium">{t[elementalBalance.dominant as keyof typeof t]}</span>
              </div>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-lg">
              <p className="text-sm font-medium text-orange-600 mb-1">{t.weak}</p>
              <div className="flex items-center gap-2">
                {elementIcons[elementalBalance.weak]}
                <span className="capitalize font-medium">{t[elementalBalance.weak as keyof typeof t]}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedNumerologySection;
