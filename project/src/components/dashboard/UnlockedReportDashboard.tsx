import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2, Download, Sparkles, Crown, ArrowLeft, Star, Sun, ShieldCheck,
  Compass, Heart, Briefcase, TrendingUp, Calendar, Zap, MessageSquare, BookOpen, User, AlertCircle
} from 'lucide-react';
import { REPORTS, rt, getMasterPrice } from '@/content/reportContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateFullProfile, calculateBirthday, calculateLifePath } from '@/lib/numerology';
import { calculateLoshuGrid, calculatePinnacleCycles, calculateKarmicDebts } from '@/lib/advancedNumerology';
import { getDailyForecast } from '@/lib/dailyForecast';
import { IndividualReportViewer } from '@/components/dashboard/IndividualReportViewer';

interface UnlockedReportDashboardProps {
  orderId: string;
  reportKey: string;
  inputJson: any;
  profileJson: any;
  aiContent?: any;
  nikbContext?: any;
  onRedownloadPdf: () => void;
  isDownloadingPdf?: boolean;
}

const RULING_PLANETS: Record<number, string> = {
  1: 'Sun (Surya) ☀️',
  2: 'Moon (Chandra) 🌙',
  3: 'Jupiter (Guru) 🔮',
  4: 'Rahu 🪐',
  5: 'Mercury (Budh) ☿️',
  6: 'Venus (Shukra) ✨',
  7: 'Ketu 🐉',
  8: 'Saturn (Shani) 🪐',
  9: 'Mars (Mangal) 🔥',
};

const LUCKY_COLORS: Record<number, string> = {
  1: 'Golden Yellow, Red, Orange',
  2: 'White, Cream, Silver',
  3: 'Yellow, Saffron, Purple',
  4: 'Electric Blue, Grey',
  5: 'Emerald Green, White',
  6: 'Royal Blue, White, Pink',
  7: 'Light Green, White, Smoky',
  8: 'Dark Blue, Navy, Black',
  9: 'Red, Coral, Crimson',
};

const LUCKY_DAYS: Record<number, string> = {
  1: 'Sunday & Monday',
  2: 'Monday & Sunday',
  3: 'Thursday & Tuesday',
  4: 'Saturday & Sunday',
  5: 'Wednesday & Friday',
  6: 'Friday & Wednesday',
  7: 'Sunday & Monday',
  8: 'Saturday & Friday',
  9: 'Tuesday & Sunday',
};

export const UnlockedReportDashboard: React.FC<UnlockedReportDashboardProps> = ({
  orderId,
  reportKey,
  inputJson = {},
  profileJson = {},
  aiContent,
  nikbContext,
  onRedownloadPdf,
  isDownloadingPdf = false,
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const rMeta = REPORTS.find((r) => r.key === reportKey);
  const title = rMeta ? rt(rMeta, 'title', language).split('—')[0].trim() : 'Numerology Report';
  const emoji = rMeta?.emoji || '🔮';

  const name = inputJson.fullBirthName || inputJson.name || inputJson.currentName || 'Valued Client';
  const rawDob = inputJson.dateOfBirth || inputJson.dob || '01/01/1990';

  // Format DOB to DD/MM/YYYY
  let dobStr = rawDob;
  if (rawDob.includes('-')) {
    const parts = rawDob.split('-');
    if (parts.length === 3) dobStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  const mulank = calculateBirthday(dobStr);
  const bhagyank = calculateLifePath(dobStr);
  const numP = calculateFullProfile(name, dobStr);
  const loshu = calculateLoshuGrid(dobStr, name);
  const pinnacles = calculatePinnacleCycles(dobStr);
  const karmic = calculateKarmicDebts(dobStr, name);

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left animate-fade-in">
      {/* ===== HERO HEADER BANNER ===== */}
      <Card className="glass-card-mystical border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-background p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-2.5 py-0.5 gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isHi ? 'भुगतान सफल • रिपोर्ट अनलॉक्ड' : 'Payment Successful • Report Unlocked'}
              </Badge>
              <span className="text-xs text-gray-400 font-mono">Order ID: #{orderId.slice(0, 8)}</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10">{emoji}</span>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {title}
                </h1>
                <p className="text-xs text-gray-300 mt-0.5">
                  {isHi ? 'व्यक्तिगत वैदिक एवं पायथागॉरियन अंक ज्योतिष विश्लेषण' : 'Personalized Vedic & Pythagorean Numerology Insights'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <Button
              onClick={onRedownloadPdf}
              disabled={isDownloadingPdf}
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold text-xs sm:text-sm px-5 gap-2 shadow-lg shadow-amber-500/10"
            >
              <Download className="w-4 h-4" />
              {isDownloadingPdf ? (isHi ? 'PDF बन रहा है...' : 'Generating PDF...') : (isHi ? 'PDF डाउनलोड करें' : 'Download PDF Report')}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs sm:text-sm gap-1.5"
            >
              {isHi ? 'डैशबोर्ड' : 'Dashboard'}
            </Button>
          </div>
        </div>

        {/* Client Profile Pill Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-gray-300">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{name}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>DOB: {dobStr}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Mulank: <strong className="text-amber-300 font-bold">{mulank}</strong> | Bhagyank: <strong className="text-amber-300 font-bold">{bhagyank}</strong></span>
          </div>
        </div>
      </Card>

      {/* ===== CORE NUMEROLOGY METRICS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mulank Card */}
        <Card className="glass-card-mystical border-amber-500/20 p-4 relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Mulank (Driver)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">{mulank}</span>
              <span className="text-xs text-gray-300">{RULING_PLANETS[mulank] || 'Sun'}</span>
            </div>
            <p className="text-xs text-gray-400 pt-1">Primary personality, core drive & natural talents.</p>
          </div>
        </Card>

        {/* Bhagyank Card */}
        <Card className="glass-card-mystical border-purple-500/20 p-4 relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Bhagyank (Destiny)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">{bhagyank}</span>
              <span className="text-xs text-gray-300">{RULING_PLANETS[bhagyank] || 'Moon'}</span>
            </div>
            <p className="text-xs text-gray-400 pt-1">Life path, karmic direction & ultimate mission.</p>
          </div>
        </Card>

        {/* Personal Year Card */}
        <Card className="glass-card-mystical border-emerald-500/20 p-4 relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Active Personal Year</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">{numP.personalYear}</span>
              <span className="text-xs text-emerald-300">Year Cycle {numP.personalYear}/9</span>
            </div>
            <p className="text-xs text-gray-400 pt-1">Current 12-month energetic theme & timing.</p>
          </div>
        </Card>

        {/* Active Pinnacle Card */}
        <Card className="glass-card-mystical border-blue-500/20 p-4 relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Current Pinnacle</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">{pinnacles[0]?.number || 1}</span>
              <span className="text-xs text-blue-300">Phase 1 Cycle</span>
            </div>
            <p className="text-xs text-gray-400 pt-1">Major growth opportunities during this life phase.</p>
          </div>
        </Card>
      </div>

      {/* ===== AI PERSONALIZED INTERPRETATION READING ===== */}
      {(() => {
        if (!aiContent) return null;
        
        let parsed: any = null;
        if (typeof aiContent === 'object') {
          parsed = aiContent;
        } else if (typeof aiContent === 'string') {
          const trimmed = aiContent.trim();
          if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            try {
              parsed = JSON.parse(trimmed);
            } catch {
              parsed = { summary: aiContent };
            }
          } else {
            parsed = { summary: aiContent };
          }
        }

        if (!parsed) return null;

        return (
          <Card className="glass-card-mystical border-amber-500/30 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-display text-xl font-bold text-white">
                  {isHi ? 'व्यक्तिगत AI अंक ज्योतिष अंतर्दृष्टि' : 'Personalized AI Guidance & Strategic Blueprint'}
                </h3>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5">
                AI Powered Reading
              </Badge>
            </div>

            {/* Summary */}
            {parsed.summary && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-gray-200 leading-relaxed font-sans space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  📌 Executive Cosmic Summary
                </span>
                <p>{parsed.summary}</p>
              </div>
            )}

            {/* Strengths & Risks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cosmic Strengths */}
              {Array.isArray(parsed.strengths) && parsed.strengths.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Cosmic Strengths & Growth Drivers
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-200">
                    {parsed.strengths.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks & Caution Points */}
              {Array.isArray(parsed.risks) && parsed.risks.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    Strategic Risks & Blind Spots
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-200">
                    {parsed.risks.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actionable Steps */}
            {Array.isArray(parsed.actions) && parsed.actions.length > 0 && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Recommended Action Steps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-200">
                  {parsed.actions.map((act: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2">
                      <span className="font-bold text-amber-400 shrink-0">{idx + 1}.</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lucky Focus & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsed.luckyFocus && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    ✨ Lucky Focus & Vibrations
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">{parsed.luckyFocus}</p>
                </div>
              )}

              {parsed.timeline && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                    📅 Personal Year Timeline Horizon
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">{parsed.timeline}</p>
                </div>
              )}
            </div>

            {/* Closing Note */}
            {parsed.closingNote && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/20 text-center italic text-xs text-amber-200">
                "{parsed.closingNote}"
              </div>
            )}
          </Card>
        );
      })()}

      {/* ===== REPORT-SPECIFIC DEDICATED VISUAL ANALYSIS ===== */}
      <IndividualReportViewer
        reportKey={reportKey as any}
        formData={{ ...inputJson, fullBirthName: name, dateOfBirth: dobStr }}
        profile={numP}
        language={language as any}
      />

      {/* ===== REPORT-SPECIFIC VISUAL BREAKDOWN ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loshu Grid Summary */}
        <Card className="glass-card-mystical border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              Lo Shu Grid Matrix
            </h4>
            <Badge variant="outline" className="text-[10px] text-amber-300 border-amber-500/30">
              3x3 Cosmic Grid
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 w-48 mx-auto text-center font-bold font-mono">
            {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num) => {
              const count = loshu.gridCount?.[num] || (loshu.present.includes(num) ? 1 : 0);
              const isPresent = count > 0;
              return (
                <div
                  key={num}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    isPresent
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 text-gray-600'
                  }`}
                >
                  {isPresent ? String(num).repeat(count) : '-'}
                </div>
              );
            })}
          </div>

          <div className="text-xs text-gray-300 space-y-1.5 pt-2">
            <p><strong className="text-emerald-400">Present Numbers:</strong> {loshu.present.join(', ') || 'None'}</p>
            <p><strong className="text-rose-400">Missing Numbers:</strong> {loshu.missing.join(', ') || 'None'} (Areas for conscious growth)</p>
          </div>
        </Card>

        {/* Lucky Alignment & Remedies */}
        <Card className="glass-card-mystical border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Auspicious Vibrational Matrix
            </h4>
            <Badge variant="outline" className="text-[10px] text-emerald-300 border-emerald-500/30">
              Personal Remedies
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-gray-400 font-medium">Lucky Colors</span>
              <span className="text-amber-300 font-bold">{LUCKY_COLORS[mulank] || 'Yellow, White'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-gray-400 font-medium">Auspicious Days</span>
              <span className="text-amber-300 font-bold">{LUCKY_DAYS[mulank] || 'Sunday'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-gray-400 font-medium">Ruling Planet</span>
              <span className="text-amber-300 font-bold">{RULING_PLANETS[mulank]}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-gray-400 font-medium">Karmic Debts</span>
              <span className="text-rose-300 font-bold">
                {karmic.filter((k) => k.present).map((k) => k.number).join(', ') || 'None (Clean Karma)'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ===== MASTER SUITE UPGRADE CTA ===== */}
      <Card className="glass-card-mystical border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-background p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              👑 Master Plan — Complete Lifetime Access
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              {isHi ? 'सभी 9 रिपोर्ट्स + 100+ पन्नों की मास्टर रिपोर्ट अनलॉक करें' : 'Upgrade to Master: Unlock All 9 Reports + AI Chat'}
            </h3>
            <p className="text-xs text-gray-300 max-w-xl">
              {isHi
                ? 'मास्टर प्लान के साथ सभी रिपोर्ट्स, 10-वर्षीय लाइफ रोडमैप, पिनेकल चक्र और अनलिमिटेड AI चैट हमेशा के लिए प्राप्त करें।'
                : 'Get lifetime access to all 9 specialized reports, 10-year life roadmap, Pinnacle cycles, and personal AI Chat.'}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <div className="text-3xl font-bold text-amber-400 font-display">₹{getMasterPrice()}</div>
            <Button
              onClick={() => navigate('/payment?tier=master')}
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold text-sm px-6 gap-2"
            >
              {isHi ? 'मास्टर प्लान प्राप्त करें' : `Get Master Plan — ₹${getMasterPrice()}`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
