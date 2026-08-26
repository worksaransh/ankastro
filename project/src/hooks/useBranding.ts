import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Branding } from '@/lib/whiteLabelPdf';

// Fetches the single app_branding row (id=1). Safe fallback to empty
// so PDF generation never breaks if table missing / not configured.
export const useBranding = () => {
  const [branding, setBranding] = useState<Branding>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('app_branding')
          .select('company_name, logo_url, brand_color, accent_color, tagline, footer_text, contact_line, website')
          .eq('id', 1)
          .maybeSingle();
        if (active && data) setBranding(data as Branding);
      } catch {
        /* table may not exist yet — use defaults */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { branding, loading };
};

// One-shot fetch (for use outside React render, e.g. inside a click handler)
export const fetchBranding = async (): Promise<Branding> => {
  try {
    const { data } = await supabase
      .from('app_branding')
      .select('company_name, logo_url, brand_color, accent_color, tagline, footer_text, contact_line, website')
      .eq('id', 1)
      .maybeSingle();
    return (data as Branding) || {};
  } catch {
    return {};
  }
};
