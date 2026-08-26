import { validateReturnUrl } from '@/lib/returnUrl';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { hasAccess, TIERS, type Tier } from '@/lib/tiers';

interface TierGateProps {
  /** Tier currently unlocked for this report */
  unlocked: Tier;
  /** Minimum tier required to view children */
  required: Tier;
  /** Optional report id for upgrade deeplink */
  reportId?: string;
  /** Short label of what's behind the gate */
  featureLabel?: string;
  /** Teaser content shown below the lock card when access is denied */
  preview?: ReactNode;
  /** URL to return to after successful upgrade/payment */
  returnUrl?: string;
  children: ReactNode;
}

const t = {
  en: { locked: 'Premium content', cta: 'Unlock', from: 'from' },
  hi:  { locked: 'प्रीमियम सामग्री', cta: 'अनलॉक करें', from: 'से' },
  hinglish: { locked: 'Premium content', cta: 'Unlock karein', from: 'se' },
} as const;

export const TierGate = ({ unlocked, required, reportId, featureLabel, preview, returnUrl, children }: TierGateProps) => {
  const { language } = useLanguage();
  const L = t[language as keyof typeof t] || t.en;

  if (hasAccess(unlocked, required)) return <>{children}</>;

  const price = TIERS[required]?.price ?? 0;
  const safeReturnUrl = validateReturnUrl(returnUrl);
  const params = new URLSearchParams();
  params.set('tier', required);
  if (reportId) params.set('report', reportId);
  if (safeReturnUrl !== '/advanced-report') params.set('returnUrl', safeReturnUrl);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-divine/5 p-6 my-4">
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Lock className="w-3 h-3" /> {required}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-lg text-foreground mb-1">
              {featureLabel || L.locked}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {L.from} ₹{price}
            </p>
            <Link to={`/payment?${params.toString()}`}>
              <Button size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                {L.cta} — ₹{price}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {preview && <div className="opacity-60 pointer-events-none select-none">{preview}</div>}
    </div>
  );
};

export default TierGate;
