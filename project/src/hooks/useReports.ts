import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { REPORTS, type ReportLandingContent } from '@/content/reportContent';

// Overlays admin-editable fields (price, original_price, badge, active,
// sort_order) from report_types onto the rich static report content.
// Static content (copy, FAQs, etc.) stays in code = always renders.
export interface ReportOverride {
  key: string; price?: number; original_price?: number;
  badge?: string | null; active?: boolean; sort_order?: number;
}

const applyOverride = (r: ReportLandingContent, o?: ReportOverride): ReportLandingContent => {
  if (!o) return r;
  return {
    ...r,
    price: typeof o.price === 'number' && o.price > 0 ? o.price : r.price,
    originalPrice: typeof o.original_price === 'number' && o.original_price > 0 ? o.original_price : r.originalPrice,
    badge: o.badge !== undefined && o.badge !== null ? o.badge : r.badge,
  };
};

export const useReports = () => {
  const [merged, setMerged] = useState<ReportLandingContent[]>(REPORTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('report_types')
          .select('key, price, original_price, badge, active, sort_order');
        if (!on) return;
        const map = new Map<string, ReportOverride>();
        (data || []).forEach((o: any) => map.set(o.key, o));
        const list = REPORTS
          .filter((r) => { const o = map.get(r.key); return o ? o.active !== false : true; })
          .map((r) => applyOverride(r, map.get(r.key)))
          .sort((a, b) => {
            const oa = map.get(a.key)?.sort_order ?? 999;
            const ob = map.get(b.key)?.sort_order ?? 999;
            return oa - ob;
          });
        setMerged(list.length ? list : REPORTS);
      } catch {
        setMerged(REPORTS); // DB issue -> static fallback (never breaks)
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  return { reports: merged, loading };
};

// Single report by slug, with DB overlay (for landing/buy pages)
export const useReport = (slug?: string) => {
  const base = REPORTS.find((r) => r.slug === slug);
  const [report, setReport] = useState<ReportLandingContent | undefined>(base);
  useEffect(() => {
    let on = true;
    if (!base) { setReport(undefined); return; }
    (async () => {
      try {
        const { data } = await supabase
          .from('report_types')
          .select('key, price, original_price, badge, active, sort_order')
          .eq('key', base.key).maybeSingle();
        if (on && data) setReport(applyOverride(base, data as any));
      } catch { /* static fallback */ }
    })();
    return () => { on = false; };
    // eslint-disable-next-line
  }, [slug]);
  return report;
};
