import React, { useState } from 'react';
import { CombinedReportProfile, CombinedInsight } from '@/lib/combinedIntelligenceEngine';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  Compass,
  Layers,
  ArrowUpRight,
  Info,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoshuGridChart from '@/components/charts/LoshuGridChart';
import { KundliChart } from '@/components/KundliChart';
import { DailyPanchangWidget } from '@/components/DailyPanchangWidget';

interface ProgressiveResultViewProps {
  report: CombinedReportProfile;
}

export const ProgressiveResultView: React.FC<ProgressiveResultViewProps> = ({ report }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'level1' | 'level2' | 'level3'>('level1');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    [report.insights[0]?.topic || 'career']: true,
  });

  const langKey = language === 'hi' ? 'hi' : language === 'hinglish' ? 'hinglish' : 'en';

  const toggleTopicExpand = (topicKey: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicKey]: !prev[topicKey] }));
  };

  const { vedicKundli, numerologyProfile, insights } = report;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Banner: Cosmic Identity */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वैदिक + अंकशास्त्र समन्वय' : 'Vedic + Numerology Synthesis'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              {report.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              DOB: <span className="font-semibold text-foreground">{report.dob}</span>
              {report.birthTime && ` • ${report.birthTime}`}
              {report.cityName && ` • ${report.cityName}`}
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-card border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-medium">{language === 'hi' ? 'लग्न' : 'Lagna'}</p>
              <p className="text-sm font-bold text-foreground">{vedicKundli.lagna.sign}</p>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-medium">{language === 'hi' ? 'चंद्र राशि' : 'Moon'}</p>
              <p className="text-sm font-bold text-foreground">{vedicKundli.moonSignVedic.sign}</p>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-medium">{language === 'hi' ? 'मूलांक' : 'Mulank'}</p>
              <p className="text-sm font-bold text-primary">{numerologyProfile.mulank}</p>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-medium">{language === 'hi' ? 'भाग्यांक' : 'Bhagyank'}</p>
              <p className="text-sm font-bold text-primary">{numerologyProfile.bhagyank}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-LEVEL PROGRESSIVE DISCLOSURE TABS */}
      <div className="flex border-b border-border gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('level1')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'level1'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'hi' ? 'स्तर 1: स्पष्ट मार्गदर्शन' : 'Level 1: Plain Life Meaning'}</span>
        </button>

        <button
          onClick={() => setActiveTab('level2')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'level2'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{language === 'hi' ? 'स्तर 2: कारण और विश्लेषण' : 'Level 2: The "Why" & Synergies'}</span>
        </button>

        <button
          onClick={() => setActiveTab('level3')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'level3'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'hi' ? 'स्तर 3: संपूर्ण कुंडली और अंक' : 'Level 3: Deep Technical Kundli'}</span>
        </button>
      </div>

      {/* LEVEL 1: PLAIN LIFE MEANING */}
      {activeTab === 'level1' && (
        <div className="space-y-6">
          {insights.map((insight) => {
            const isExpanded = !!expandedTopics[insight.topic];
            return (
              <div
                key={insight.topic}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm transition-all"
              >
                <div
                  onClick={() => toggleTopicExpand(insight.topic)}
                  className="p-6 cursor-pointer flex items-center justify-between hover:bg-accent/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {insight.topic === 'career' ? '💼' : insight.topic === 'marriage' ? '💍' : '🔮'}
                      </span>
                      <h2 className="text-lg sm:text-xl font-display font-bold text-foreground">
                        {insight.title[langKey]}
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'hi' ? 'क्लिक करके विस्तार देखें' : 'Click to toggle direct guidance'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 space-y-6 border-t border-border/50 animate-fade-in">
                    {/* Direct Answer */}
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
                      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'hi' ? 'सीधा उत्तर' : 'Direct Answer'}</span>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                        {insight.level1Simple.directAnswer[langKey]}
                      </p>
                    </div>

                    {/* What This Means for Life */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {language === 'hi' ? 'व्यावहारिक प्रभाव' : 'Practical Life Impact'}
                      </h4>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {insight.level1Simple.whatThisMeans[langKey]}
                      </p>
                    </div>

                    {/* Timing Guidance */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                          {language === 'hi' ? 'महत्वपूर्ण समय चक्र' : 'Important Timing Period'}
                        </h4>
                        <p className="text-xs sm:text-sm text-foreground/90">
                          {insight.level1Simple.timingGuidance[langKey]}
                        </p>
                      </div>
                    </div>

                    {/* Action Steps */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>{language === 'hi' ? 'व्यावहारिक सुझाव' : 'Recommended Action Steps'}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {insight.level1Simple.actionSteps[langKey].map((stepText, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-secondary/50 border border-border/80 text-xs sm:text-sm leading-relaxed">
                            <span className="font-bold text-primary mr-1.5">{idx + 1}.</span>
                            {stepText}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* LEVEL 2: THE "WHY" & CROSS-SYSTEM SYNERGY */}
      {activeTab === 'level2' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <span>{language === 'hi' ? 'ज्योतिष और अंकशास्त्र का तुलनात्मक समन्वय' : 'Astrology & Numerology Cross-System Analysis'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {language === 'hi'
                ? 'हम जबरन समानता नहीं दिखाते; जहां दोनों विधाएं सहमत हैं उन्हें उजागर करते हैं और जहां दृष्टिकोण भिन्न है उसे स्पष्ट बताते हैं।'
                : 'We do not force agreement. We highlight mutual convergences and honestly explain contrasting perspectives.'}
            </p>
          </div>

          {insights.map((insight) => (
            <div key={insight.topic} className="bg-card border border-border rounded-3xl p-6 space-y-6">
              <h4 className="font-display font-bold text-lg text-foreground border-b border-border pb-3">
                {insight.title[langKey]}
              </h4>

              {/* Synergies */}
              {insight.level2Explanation.synergies.length > 0 && (
                <div className="space-y-3">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'परस्पर सहमति (Synergy)' : 'Agreements & Synergies'}</span>
                  </Badge>
                  <div className="space-y-3">
                    {insight.level2Explanation.synergies.map((syn, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="font-medium text-muted-foreground">Vedic: <strong className="text-foreground">{syn.factorAstro}</strong></span>
                          <span>•</span>
                          <span className="font-medium text-muted-foreground">Numerology: <strong className="text-foreground">{syn.factorNumero}</strong></span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground/90">
                          {syn.explanation[langKey]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divergences / Contrasting factors */}
              {insight.level2Explanation.divergences.length > 0 && (
                <div className="space-y-3 pt-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'भिन्न दृष्टिकोण (Contrasting Dynamics)' : 'Contrasting Perspectives'}</span>
                  </Badge>
                  <div className="space-y-3">
                    {insight.level2Explanation.divergences.map((div, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                        <p className="text-xs sm:text-sm text-foreground/90">
                          {div.explanation[langKey]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LEVEL 3: DEEP TECHNICAL KUNDLI & NUMEROLOGY */}
      {activeTab === 'level3' && (
        <div className="space-y-8 animate-fade-in">
          {/* Visual Kundli Chart (North & South Indian Modes) */}
          <KundliChart chart={report.vedicKundli || (report as any).vedicChart} title={language === 'hi' ? 'लग्न कुंडली (D-1 चार्ट)' : 'Lagna Kundli (D-1 Chart)'} />

          {/* Daily Vedic Panchang & Muhurta Widget */}
          <DailyPanchangWidget />

          {/* Planetary Coordinates Table */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-foreground">
                {language === 'hi' ? 'वैदिक ग्रह स्पष्ट स्थिति (लाहिड़ी अयनांश)' : 'Vedic Planetary Longitudes (Lahiri Ayanamsha)'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Ayanamsha: {vedicKundli.ayanamsha.toFixed(2)}°
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-2.5 px-3">Planet / Grah</th>
                    <th className="py-2.5 px-3">Sign / Rashi</th>
                    <th className="py-2.5 px-3">Degrees</th>
                    <th className="py-2.5 px-3">Nakshatra & Pada</th>
                    <th className="py-2.5 px-3">House</th>
                    <th className="py-2.5 px-3">Dignity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="bg-primary/5 font-semibold">
                    <td className="py-2.5 px-3">Lagna (Ascendant)</td>
                    <td className="py-2.5 px-3">{vedicKundli.lagna.sign}</td>
                    <td className="py-2.5 px-3">{vedicKundli.lagna.degreeFormatted}</td>
                    <td className="py-2.5 px-3">{vedicKundli.lagna.nakshatra} (Pada {vedicKundli.lagna.pada})</td>
                    <td className="py-2.5 px-3">1st House</td>
                    <td className="py-2.5 px-3">-</td>
                  </tr>
                  {vedicKundli.planets.map((p) => (
                    <tr key={p.planet} className="hover:bg-accent/30">
                      <td className="py-2.5 px-3 font-medium">{p.planet} {p.isRetrograde ? '(R)' : ''}</td>
                      <td className="py-2.5 px-3">{p.sign}</td>
                      <td className="py-2.5 px-3">{p.degreeFormatted}</td>
                      <td className="py-2.5 px-3">{p.nakshatra} (Pada {p.pada})</td>
                      <td className="py-2.5 px-3">{p.house}th</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.dignity === 'Exalted' ? 'bg-emerald-500/20 text-emerald-600' :
                          p.dignity === 'Debilitated' ? 'bg-rose-500/20 text-rose-600' :
                          p.dignity === 'Own Sign' ? 'bg-blue-500/20 text-blue-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {p.dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vimshottari Dasha Timeline */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground">
              {language === 'hi' ? 'विंशोत्तरी महादशा समय-चक्र' : 'Vimshottari Mahadasha Timeline'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {vedicKundli.currentDasha.timeline.map((dasha, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    dasha.isCurrent
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border bg-card/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground text-sm">{dasha.lord} Mahadasha</span>
                    {dasha.isCurrent && (
                      <Badge className="bg-primary text-primary-foreground text-[10px]">CURRENT</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dasha.startDate} → {dasha.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Lo Shu Grid */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-foreground">
              {language === 'hi' ? 'लो-शू ग्रिड और अंक संतुलन' : 'Lo Shu Grid & Numeric Balance'}
            </h3>
            <div className="max-w-md mx-auto">
              <LoshuGridChart grid={numerologyProfile.loshuGrid} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveResultView;
