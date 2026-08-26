import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck, Crown, Star, Check, Lock, AlertCircle, HelpCircle, ArrowRight, Info
} from 'lucide-react';
import { type Tier } from '@/lib/tiers';
import { REPORT_NAMES, INDIVIDUAL_REPORT_TYPES } from '@/lib/constants';

interface BillingAuditProps {
  accountTier: Tier;
  sub: {
    active: boolean;
    plan?: string;
    expiresAt?: string;
    loading: boolean;
  };
  reports: any[];
  reportTiers: Record<string, Tier>;
  language: 'en' | 'hi' | 'hinglish';
}

export const BillingAudit: React.FC<BillingAuditProps> = ({
  accountTier,
  sub,
  reports,
  reportTiers,
  language
}) => {
  const [showComparison, setShowComparison] = useState(false);

  const t = {
    en: {
      title: 'Plan & Billing Audit',
      subtitle: 'Audit your active memberships, lifetime plans, unlocked reports, and understand your benefits.',
      sectionActive: 'Your Active Benefits',
      sectionPending: 'Available Upgrades & Locked Items',
      lifetimePlan: 'Lifetime One-Time Plan',
      noLifetime: 'No Lifetime Plan Active',
      subStatus: 'AnkJyotish Plus Subscription',
      noSub: 'No Active Subscription',
      validTill: 'Valid till',
      unlockedReports: 'Unlocked Individual Reports',
      noReports: 'No individual reports purchased yet',
      lockedReports: 'Locked Individual Reports',
      allUnlockedMaster: '🎉 All Individual Reports are unlocked free with your Master Plan!',
      upgradeBtn: 'Upgrade Account',
      buyPlusBtn: 'Join Plus Membership',
      viewReport: 'View Report',
      howItWorks: 'How do plans differ? View Comparison',
      hideComparison: 'Hide Plan Comparison',
      tblPlan: 'Plan Type',
      tblPrice: 'Price',
      tblDuration: 'Duration',
      tblReports: 'Reports Included',
      tblDaily: 'Daily Readings & AI Chat',
      tblDailyPro: 'Daily forecasts (Basic)',
      tblDiscounts: 'Report Discounts',
      subPlanName: 'Plus Membership',
      oneTimeTitle: 'One-Time Lifetime Plans',
      nonRecur: 'Non-recurring manual renewal',
      lifetime: 'Lifetime Access',
      starterBenefit: 'Basic Blueprint Report only',
      proBenefit: 'Basic + Advanced Blueprint Reports',
      masterBenefit: 'Basic + Advanced + ALL 9 Individual Reports (Free)',
      plusBenefit: 'None (Requires separate purchase)',
      plusDaily: 'Daily Personal lucky numbers, colors, timings & unlimited AI Chat',
      oneTimeDailyStarterPro: 'Basic Only / No AI Chat',
      oneTimeDailyMaster: 'Unlimited AI Chat (Lifetime)',
      oneTimeDailyPro: 'Basic forecast only',
      plusDiscounts: '50% member discount on all reports',
      oneTimeDiscounts: 'None (Reports are full price)',
      masterDiscounts: 'N/A (All reports are 100% Free)',
      pendingStarterMsg: 'Starter (₹299) unlocks Basic report',
      pendingProMsg: 'Pro (₹599) unlocks Basic & Advanced reports',
      pendingMasterMsg: 'Master (₹999) unlocks everything + all 9 individual reports free forever',
      pendingPlusMsg: 'Plus (₹99/mo) activates daily guidance & AI numerology assistant',
      memberDiscountBadge: '50% Plus Discount Active',
      statusActive: 'Active',
      statusInactive: 'Inactive',
      lockedLifetimeTitle: 'Lifetime Plans Unlocked State',
      upgradeMasterBtn: 'Upgrade to Master (₹999)',
      plusBenefitsTitle: 'Plus Membership Benefits',
    },
    hi: {
      title: 'योजना और बिलिंग ऑडिट',
      subtitle: 'अपनी सक्रिय सदस्यताओं, आजीवन योजनाओं, अनलॉक की गई रिपोर्ट्स की जांच करें और अपने लाभों को समझें।',
      sectionActive: 'आपके सक्रिय लाभ',
      sectionPending: 'उपलब्ध अपग्रेड और लॉक्ड आइटम्स',
      lifetimePlan: 'आजीवन वन-टाइम योजना',
      noLifetime: 'कोई आजीवन योजना सक्रिय नहीं है',
      subStatus: 'अंकज्योतिष प्लस सदस्यता',
      noSub: 'कोई सक्रिय सदस्यता नहीं है',
      validTill: 'तक मान्य',
      unlockedReports: 'अनलॉक की गई रिपोर्ट्स',
      noReports: 'अभी तक कोई व्यक्तिगत रिपोर्ट नहीं खरीदी गई है',
      lockedReports: 'लॉक्ड व्यक्तिगत रिपोर्ट्स',
      allUnlockedMaster: '🎉 आपकी मास्टर योजना के साथ सभी व्यक्तिगत रिपोर्ट्स मुफ्त में अनलॉक हैं!',
      upgradeBtn: 'खाता अपग्रेड करें',
      buyPlusBtn: 'प्लस सदस्यता लें',
      viewReport: 'रिपोर्ट देखें',
      howItWorks: 'योजनाओं में क्या अंतर है? तुलना देखें',
      hideComparison: 'तुलना छुपाएं',
      tblPlan: 'योजना का प्रकार',
      tblPrice: 'कीमत',
      tblDuration: 'अवधि',
      tblReports: 'शामिल रिपोर्ट्स',
      tblDaily: 'दैनिक रीडिंग्स और AI चैट',
      tblDailyPro: 'दैनिक पूर्वानुमान (बेसिक)',
      tblDiscounts: 'रिपोर्ट्स पर छूट',
      subPlanName: 'प्लस सदस्यता',
      oneTimeTitle: 'एक-बार की आजीवन योजनाएं',
      nonRecur: 'मैनुअल नवीनीकरण (नॉन-रिकरिंग)',
      lifetime: 'आजीवन पहुंच',
      starterBenefit: 'केवल बेसिक ब्लूप्रिंट रिपोर्ट',
      proBenefit: 'बेसिक + एडवांस ब्लूप्रिंट रिपोर्ट्स',
      masterBenefit: 'बेसिक + एडवांस + सभी 9 व्यक्तिगत रिपोर्ट्स (मुफ्त)',
      plusBenefit: 'कोई नहीं (अलग से खरीदना होगा)',
      plusDaily: 'दैनिक व्यक्तिगत शुभ अंक, रंग, समय और असीमित AI चैट',
      oneTimeDailyStarterPro: 'केवल बेसिक / कोई AI चैट नहीं',
      oneTimeDailyMaster: 'असीमित AI चैट (आजीवन)',
      oneTimeDailyPro: 'केवल बेसिक पूर्वानुमान',
      plusDiscounts: 'सभी रिपोर्ट्स पर 50% सदस्य छूट',
      oneTimeDiscounts: 'कोई नहीं (रिपोर्ट्स पूरी कीमत पर हैं)',
      masterDiscounts: 'लागू नहीं (सभी रिपोर्ट्स 100% मुफ्त हैं)',
      pendingStarterMsg: 'बेसिक रिपोर्ट अनलॉक करने के लिए स्टार्टर (₹299)',
      pendingProMsg: 'बेसिक और एडवांस रिपोर्ट अनलॉक करने के लिए प्रो (₹599)',
      pendingMasterMsg: 'सभी 9 रिपोर्ट्स मुफ्त और आजीवन अनलॉक करने के लिए मास्टर (₹999)',
      pendingPlusMsg: 'दैनिक मार्गदर्शन और AI सहायक सक्रिय करने के लिए प्लस (₹99/माह)',
      memberDiscountBadge: '50% प्लस छूट सक्रिय',
      statusActive: 'सक्रिय',
      statusInactive: 'निष्क्रिय',
      lockedLifetimeTitle: 'आजीवन योजनाओं की स्थिति',
      upgradeMasterBtn: 'मास्टर अपग्रेड करें (₹999)',
      plusBenefitsTitle: 'प्लस सदस्यता के लाभ',
    },
    hinglish: {
      title: 'Plan & Billing Audit',
      subtitle: 'Apni active memberships, lifetime plans, unlocked reports check karein aur apne benefits ko samjhein.',
      sectionActive: 'Your Active Benefits',
      sectionPending: 'Available Upgrades & Locked Items',
      lifetimePlan: 'Lifetime One-Time Plan',
      noLifetime: 'No Lifetime Plan Active',
      subStatus: 'AnkJyotish Plus Subscription',
      noSub: 'No Active Subscription',
      validTill: 'Valid till',
      unlockedReports: 'Unlocked Individual Reports',
      noReports: 'Abhi tak koi report purchase nahi ki gayi',
      lockedReports: 'Locked Individual Reports',
      allUnlockedMaster: '🎉 All Individual Reports unlocked free hain aapke Master Plan ke saath!',
      upgradeBtn: 'Upgrade Account',
      buyPlusBtn: 'Join Plus Membership',
      viewReport: 'Report Dekhein',
      howItWorks: 'Plans me kya difference hai? View Comparison',
      hideComparison: 'Hide Plan Comparison',
      tblPlan: 'Plan Type',
      tblPrice: 'Price',
      tblDuration: 'Duration',
      tblReports: 'Reports Included',
      tblDaily: 'Daily Readings & AI Chat',
      tblDailyPro: 'Daily forecasts (Basic)',
      tblDiscounts: 'Report Discounts',
      subPlanName: 'Plus Membership',
      oneTimeTitle: 'One-Time Lifetime Plans',
      nonRecur: 'Non-recurring manual renewal',
      lifetime: 'Lifetime Access',
      starterBenefit: 'Basic Blueprint Report only',
      proBenefit: 'Basic + Advanced Blueprint Reports',
      masterBenefit: 'Basic + Advanced + ALL 9 Individual Reports (Free)',
      plusBenefit: 'None (Separate purchase required)',
      plusDaily: 'Daily Personal lucky numbers, colors, timings & unlimited AI Chat',
      oneTimeDailyStarterPro: 'Basic Only / No AI Chat',
      oneTimeDailyMaster: 'Unlimited AI Chat (Lifetime)',
      oneTimeDailyPro: 'Basic forecast only',
      plusDiscounts: '50% member discount on all reports',
      oneTimeDiscounts: 'None (Reports are full price)',
      masterDiscounts: 'N/A (All reports 100% Free)',
      pendingStarterMsg: 'Starter (₹299) unlocks Basic report',
      pendingProMsg: 'Pro (₹599) unlocks Basic & Advanced reports',
      pendingMasterMsg: 'Master (₹999) unlocks everything + all 9 reports free forever',
      pendingPlusMsg: 'Plus (₹99/mo) activates daily guidance & AI assistant',
      memberDiscountBadge: '50% Plus Discount Active',
      statusActive: 'Active',
      statusInactive: 'Inactive',
      lockedLifetimeTitle: 'Lifetime Plans Unlocked State',
      upgradeMasterBtn: 'Upgrade to Master (₹999)',
      plusBenefitsTitle: 'Plus Membership Benefits',
    }
  };

  const tr = t[language] || t.en;

  // Extract purchased individual report keys
  const purchasedReportKeys = reports
    .filter(r => INDIVIDUAL_REPORT_TYPES.includes(r.report_type))
    .map(r => r.report_type);

  const lockedReportKeys = (INDIVIDUAL_REPORT_TYPES as readonly string[]).filter(
    key => !purchasedReportKeys.includes(key)
  );

  return (
    <Card className="glass-card-mystical border-white/10 shadow-xl mb-8 overflow-hidden">
      <CardHeader className="bg-white/[0.01] border-b border-white/5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-display font-bold text-white">{tr.title}</CardTitle>
              <CardDescription className="text-xs text-gray-400 mt-0.5">{tr.subtitle}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            className="text-xs text-amber-400 hover:text-amber-300 hover:bg-white/5 gap-1 rounded-xl self-start sm:self-center"
          >
            <HelpCircle className="w-4 h-4" />
            {showComparison ? tr.hideComparison : tr.howItWorks}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Dynamic Comparison Panel */}
        {showComparison && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-left space-y-4 animate-fade-in">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">{language === 'hi' ? 'योजनाओं का विवरण' : 'PLANS COMPARISON MATRIX'}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-semibold">
                    <th className="py-2.5">{tr.tblPlan}</th>
                    <th className="py-2.5">{tr.tblPrice}</th>
                    <th className="py-2.5">{tr.tblDuration}</th>
                    <th className="py-2.5">{tr.tblReports}</th>
                    <th className="py-2.5">{tr.tblDaily}</th>
                    <th className="py-2.5">{tr.tblDiscounts}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="py-3 font-semibold text-white">Plus Membership</td>
                    <td className="py-3 text-amber-400 font-medium">₹99 / ₹249</td>
                    <td className="py-3 text-gray-400">30d / 92d ({tr.nonRecur})</td>
                    <td className="py-3">{tr.plusBenefit}</td>
                    <td className="py-3 text-emerald-400">
                      <div className="flex items-start gap-1">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{tr.plusDaily}</span>
                      </div>
                    </td>
                    <td className="py-3 text-emerald-400 font-medium">{tr.plusDiscounts}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-white">Starter Plan</td>
                    <td className="py-3 text-gray-400">₹299</td>
                    <td className="py-3 text-gray-400">{tr.lifetime}</td>
                    <td className="py-3">{tr.starterBenefit}</td>
                    <td className="py-3 text-gray-400">{tr.oneTimeDailyStarterPro}</td>
                    <td className="py-3 text-gray-400">{tr.oneTimeDiscounts}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-white">Pro Plan</td>
                    <td className="py-3 text-gray-400">₹599</td>
                    <td className="py-3 text-gray-400">{tr.lifetime}</td>
                    <td className="py-3">{tr.proBenefit}</td>
                    <td className="py-3 text-gray-300">
                      <div className="flex items-start gap-1">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{tr.tblDailyPro}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">{tr.oneTimeDiscounts}</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="py-3 font-bold text-white flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-gold fill-gold" /> Master Plan
                    </td>
                    <td className="py-3 text-gold font-bold">₹999</td>
                    <td className="py-3 text-gray-400">{tr.lifetime}</td>
                    <td className="py-3 text-emerald-400 font-semibold">{tr.masterBenefit}</td>
                    <td className="py-3 text-emerald-400">
                      <div className="flex items-start gap-1">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{tr.oneTimeDailyMaster}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gold font-bold">{tr.masterDiscounts}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Status Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Items */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-white/5 pb-1">{tr.sectionActive}</h3>
            
            {/* Lifetime Tier */}
            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Crown className={`w-5 h-5 ${accountTier !== 'glimpse' ? 'text-primary' : 'text-gray-500'}`} />
                <div>
                  <p className="text-xs text-gray-400 font-medium">{tr.lifetimePlan}</p>
                  <p className="text-sm font-bold text-white capitalize mt-0.5">
                    {accountTier !== 'glimpse' ? `${accountTier} Plan` : tr.noLifetime}
                  </p>
                </div>
              </div>
              {accountTier !== 'glimpse' && (
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  {tr.statusActive}
                </Badge>
              )}
            </div>

            {/* Plus Sub */}
            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Star className={`w-5 h-5 ${sub.active ? 'text-gold fill-gold' : 'text-gray-500'}`} />
                <div>
                  <p className="text-xs text-gray-400 font-medium">{tr.subStatus}</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {sub.active ? `${sub.plan === 'plus_quarterly' ? 'Quarterly' : 'Monthly'} Pass` : tr.noSub}
                  </p>
                  {sub.active && sub.expiresAt && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {tr.validTill}: {new Date(sub.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className={`font-bold uppercase tracking-wider text-[10px] ${
                  sub.active ? 'border-gold/30 bg-gold/10 text-gold' : 'border-gray-500/30 bg-gray-500/10 text-gray-400'
                }`}>
                  {sub.active ? tr.statusActive : tr.statusInactive}
                </Badge>
                {sub.active && (
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[9px] font-medium mt-1">
                    {tr.memberDiscountBadge}
                  </Badge>
                )}
              </div>
            </div>

            {/* Unlocked Reports */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-300">{tr.unlockedReports}</p>
              {accountTier === 'master' ? (
                <div className="p-3 text-center text-xs text-amber-400 bg-amber-400/5 border border-amber-400/25 rounded-xl">
                  {tr.allUnlockedMaster}
                </div>
              ) : purchasedReportKeys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {purchasedReportKeys.map((key) => (
                    <div key={key} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-xs text-gray-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{REPORT_NAMES[key] || key}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic pl-1">{tr.noReports}</p>
              )}
            </div>
          </div>

          {/* Pending / Upgrades */}
          <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-white/5 pb-1">{tr.sectionPending}</h3>
            
            {/* Lifetme Pending Items */}
            {accountTier !== 'master' && (
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.01] border border-white/5 text-left flex-col sm:flex-row">
                  <AlertCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5 hidden sm:block" />
                  <div className="space-y-1.5 flex-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{tr.lockedLifetimeTitle}</p>
                    <ul className="space-y-1.5 text-xs text-gray-400 list-disc pl-4">
                      {accountTier === 'glimpse' && <li className="leading-tight">{tr.pendingStarterMsg}</li>}
                      {accountTier !== 'pro' && accountTier !== 'master' && <li className="leading-tight">{tr.pendingProMsg}</li>}
                      <li className="leading-tight text-amber-400/90 font-medium">{tr.pendingMasterMsg}</li>
                    </ul>
                    <Link to={accountTier === 'glimpse' ? '/payment' : `/payment?tier=master&upgrade=1&returnUrl=/dashboard`} className="block pt-1">
                      <Button size="sm" className="w-full gap-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary/95 text-white">
                        {accountTier === 'glimpse' ? tr.upgradeBtn : tr.upgradeMasterBtn}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Plus Sub Pending */}
            {!sub.active && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.01] border border-white/5 text-left flex-col sm:flex-row">
                <Info className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5 hidden sm:block" />
                <div className="space-y-1.5 flex-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">{tr.plusBenefitsTitle}</p>
                  <p className="text-xs text-gray-400 leading-normal">{tr.pendingPlusMsg}</p>
                  <Link to="/plus" className="block pt-1">
                    <Button size="sm" variant="outline" className="w-full gap-1.5 rounded-xl text-xs font-bold border-gold/30 bg-gold/5 text-gold hover:bg-gold/10">
                      {tr.buyPlusBtn}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Locked Reports */}
            {accountTier !== 'master' && lockedReportKeys.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-300">{tr.lockedReports}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1">
                  {lockedReportKeys.map((key) => (
                    <Link to={`/buy/${key}`} key={key} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all text-left group">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 group-hover:text-white transition-colors truncate">
                        <Lock className="w-3 h-3 text-gray-500 shrink-0 group-hover:text-primary transition-colors" />
                        <span className="truncate">{REPORT_NAMES[key] || key}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all translate-x-[-4px] group-hover:translate-x-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
