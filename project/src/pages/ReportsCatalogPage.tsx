import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { SpecializedReportsHub } from '@/components/dashboard/SpecializedReportsHub';

export default function ReportsCatalogPage() {
  const { language } = useLanguage();
  const [purchasedKeys, setPurchasedKeys] = useState<string[]>([]);
  const [hasPlus, setHasPlus] = useState(false);
  const [hasMaster, setHasMaster] = useState(false);

  useEffect(() => {
    const fetchEntitlements = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const { data, error } = await supabase.functions.invoke('get-report-tier');
        if (!error && data) {
          if (data.isMaster) setHasMaster(true);
          if (data.hasPlus) setHasPlus(true);
          if (data.purchasedReportsMap) {
            setPurchasedKeys(Object.keys(data.purchasedReportsMap));
          }
        }
      } catch (e) {
        console.warn('Failed to load entitlements:', e);
      }
    };
    fetchEntitlements();
  }, []);

  return (
    <div className="min-h-screen bg-background spiritual-pattern">
      <SEO
        title="All Premium Numerology Reports — AnkJyotish AI"
        description="Choose from Name Correction, Mobile Numerology, Vehicle, Career, Baby Name, and Marriage Compatibility reports with instant PDF downloads."
        canonical="/reports"
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">
            {language === 'hi' ? '← डैशबोर्ड' : '← Dashboard'}
          </Link>
        </div>

        <SpecializedReportsHub
          purchasedReports={purchasedKeys}
          hasMaster={hasMaster}
          hasPlus={hasPlus}
        />
      </div>
    </div>
  );
}
