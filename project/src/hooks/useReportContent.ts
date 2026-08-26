import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { REPORTS, REPORT_I18N, type ReportLandingContent } from '@/content/reportContent';
import { REPORT_TRANSLATIONS } from '@/content/reportTranslations';

// Which fields are translatable marketing content (stored in DB).
// Structural fields (key, slug, emoji, price, images, rating) stay from static.
export const CONTENT_FIELDS = [
  'title', 'subtitle', 'badge', 'painHeadline', 'pains', 'promiseHeadline',
  'promise', 'steps', 'deliverables', 'beforeAfter', 'whyHeadline', 'why',
  'testimonials', 'faqs', 'finalCta', 'heroImage', 'heroVideo',
] as const;

export const langKey = (language?: string) =>
  language === 'en' ? 'en' : language === 'hi' ? 'hi' : 'hinglish';

// Pull translatable content out of a static report (used for "import to DB").
export const extractContent = (r: ReportLandingContent): Record<string, any> => {
  const o: Record<string, any> = {};
  CONTENT_FIELDS.forEach((f) => { o[f] = (r as any)[f]; });
  return o;
};

// Landing/buy page: static base + report_types(price/badge) + report_content(lang) overlay.
export const useReportContent = (slug?: string, language?: string) => {
  const base = REPORTS.find((r) => r.slug === slug);
  const [report, setReport] = useState<ReportLandingContent | undefined>(base);

  useEffect(() => {
    let on = true;
    if (!base) { setReport(undefined); return; }
    (async () => {
      let merged: any = { ...base };
      try {
        // price/badge/active overlay
        const { data: rt } = await supabase.from('report_types')
          .select('price, original_price, badge, active').eq('key', base.key).maybeSingle();
        if (rt) {
          if (typeof rt.price === 'number' && rt.price > 0) merged.price = rt.price;
          if (typeof rt.original_price === 'number' && rt.original_price > 0) merged.originalPrice = rt.original_price;
          if (rt.badge) merged.badge = rt.badge;
        }
      } catch { /* static price */ }
      let dbHadTitle = false;
      try {
        // language content overlay (DB-driven CMS)
        const { data: rc } = await supabase.from('report_content')
          .select('content').eq('key', base.key).eq('lang', langKey(language)).maybeSingle();
        if (rc?.content && typeof rc.content === 'object') {
          dbHadTitle = !!(rc.content as any).title;
          Object.keys(rc.content).forEach((k) => {
            const v = (rc.content as any)[k];
            if (v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0) && v !== '') merged[k] = v;
          });
        }
      } catch { /* static content */ }
      // static i18n fallback when DB empty for en/hi
      const lk = langKey(language);
      if (!dbHadTitle && (lk === 'en' || lk === 'hi')) {
        const trFull = REPORT_TRANSLATIONS[base.key]?.[lk];
        if (trFull) {
          Object.keys(trFull).forEach((k) => {
            const v = trFull[k];
            if (v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0) && v !== '') merged[k] = v;
          });
        } else {
          const tr = REPORT_I18N[base.key]?.[lk];
          if (tr) {
            if (tr.title) merged.title = tr.title;
            if (tr.subtitle) merged.subtitle = tr.subtitle;
            if (tr.badge !== undefined) merged.badge = tr.badge;
          }
        }
      }
      if (on) setReport(merged);
    })();
    return () => { on = false; };
    // eslint-disable-next-line
  }, [slug, language]);

  return report;
};
