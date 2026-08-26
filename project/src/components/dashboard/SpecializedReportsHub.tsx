import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Eye, ShoppingCart, Check, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { REPORTS, rt, getMasterPrice } from '@/content/reportContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateWhiteLabelPDF, type ReportKey } from '@/lib/whiteLabelPdf';
import { fetchBranding } from '@/hooks/useBranding';
import { toast } from 'sonner';

interface SpecializedReportsHubProps {
  purchasedReports?: string[];
  hasMaster?: boolean;
  hasPlus?: boolean;
  userProfileData?: any;
}

export const SpecializedReportsHub: React.FC<SpecializedReportsHubProps> = ({
  purchasedReports = [],
  hasMaster = false,
  hasPlus = false,
  userProfileData,
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const isHi = language === 'hi';
  const isHinglish = language === 'hinglish';

  const handleDownloadPdf = async (reportKey: ReportKey) => {
    setDownloadingKey(reportKey);
    try {
      const branding = await fetchBranding();
      const prof = userProfileData?.profile || {};
      const numP = userProfileData?.numerology || {};

      const inputJson = {
        fullBirthName: prof.full_birth_name || prof.full_name || 'Valued User',
        dateOfBirth: prof.dob || '01/01/1990',
        gender: prof.gender || 'male',
        profession: prof.profession || 'Professional',
      };

      const profileJson = {
        lifePath: numP.lifePath || 1,
        destiny: numP.destiny || 1,
        soulUrge: numP.soulUrge || 1,
        personality: numP.personality || 1,
        personalYear: numP.personalYear || 1,
      };

      await generateWhiteLabelPDF(reportKey, profileJson, inputJson, branding);
      toast.success(isHi ? 'PDF सफलतापूर्वक डाउनलोड हो गया!' : 'PDF downloaded successfully!');
    } catch (err: any) {
      console.error('Failed to generate PDF:', err);
      toast.error(err.message || 'PDF generation failed. Please try again.');
    } finally {
      setDownloadingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="font-display text-2xl font-bold text-white tracking-wide">
              {isHi
                ? 'प्रीमियम विशिष्ट रिपोर्ट्स — सभी व्यक्तिगत'
                : isHinglish
                ? 'Premium Specialized Reports — All Personalized'
                : 'Premium Specialized Reports — All Personalized'}
            </h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {isHi
              ? 'प्रत्येक रिपोर्ट अनोखी है — अपना प्रश्न चुनें, ₹199 से'
              : 'Each report is unique — pick your question, from ₹199'}
          </p>
        </div>
        
        {hasMaster && (
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold px-3 py-1 text-xs">
            👑 Master Plan Unlocked — All Reports Included
          </Badge>
        )}
      </div>

      {/* Reports Grid (All 9 Specialized Reports) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map((r) => {
          const isPurchased = hasMaster || hasPlus || purchasedReports.includes(r.key);
          const discountPct = Math.round(((r.originalPrice - r.price) / r.originalPrice) * 100);
          const isDownloading = downloadingKey === r.key;
          const displayTitle = rt(r, 'title', language).split('—')[0].trim();
          const displaySub = rt(r, 'subtitle', language);

          return (
            <Card
              key={r.key}
              className="glass-card-mystical border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
                {/* Top Badge & Rating Row */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                        {r.emoji}
                      </span>
                      {r.badge && (
                        <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-[11px] font-semibold px-2 py-0.5">
                          {rt(r, 'badge', language)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 text-xs font-medium text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{r.rating}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {displaySub}
                  </p>

                  {/* Deliverables List */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                    {r.deliverables.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-amber-400 font-display">
                        {isPurchased ? (isHi ? 'अनलॉक्ड' : 'Unlocked') : `₹${r.price}`}
                      </span>
                      {!isPurchased && (
                        <>
                          <span className="text-xs text-gray-500 line-through">₹{r.originalPrice}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {discountPct}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* View/Preview Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/report?key=${r.key}`)}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      {isHi ? 'रिपोर्ट खोलें' : 'View Report'}
                    </Button>

                    {/* PDF Download or Buy Button */}
                    {isPurchased ? (
                      <Button
                        size="sm"
                        onClick={() => handleDownloadPdf(r.key)}
                        disabled={isDownloading}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold text-xs gap-1.5"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            {isHi ? 'डाउनलोडिंग...' : 'PDF...'}
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            {isHi ? 'PDF डाउनलोड' : 'Download PDF'}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/buy/${r.slug}`)}
                        className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white text-xs font-semibold gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {isHi ? `खरीदें ₹${r.price}` : `Buy ₹${r.price}`}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Master Suite Banner */}
      <Card className="glass-card-mystical border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-background p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              👑 Master Suite — All-in-One Lifetime Access
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              {isHi ? 'सभी 9 प्रीमियम रिपोर्ट्स + 100+ पन्नों का ब्लूप्रिंट' : 'Get All 9 Premium Reports + 100+ Page Blueprint'}
            </h3>
            <p className="text-xs text-gray-300 max-w-xl">
              {isHi
                ? 'मास्टर प्लान के साथ सभी 9 रिपोर्ट्स, 10-वर्षीय रोडमैप, पिनेकल चक्र, और व्यक्तिगत AI चैट हमेशा के लिए अनलॉक करें।'
                : 'Unlock all 9 specialized reports, 10-year life roadmap, Pinnacle cycles, and personal AI Chat for life with Master.'}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <div className="text-3xl font-bold text-amber-400 font-display">
              {hasMaster ? (isHi ? 'अनलॉक्ड' : 'Unlocked') : `₹${getMasterPrice()}`}
            </div>
            <Button
              onClick={() => navigate(hasMaster ? '/dashboard' : '/payment?tier=master')}
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold text-sm px-6 gap-2"
            >
              {hasMaster ? (isHi ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard') : (isHi ? 'मास्टर प्लान अनलॉक करें' : 'Unlock Master Suite')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
