import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PageBlock {
  id: string;
  type: string;
  content: any;
  position: number;
  active: boolean;
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  hero_image_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  tool_type?: string | null;
  report_type_key?: string | null;
  active: boolean;
  badge?: string | null;
  price?: number | null;
  original_price?: number | null;
  rating?: number | null;
  reviews_count?: number | null;
  related_slugs?: string[] | null;
  report_key?: string | null;
}

export interface RelatedReport {
  slug: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  price?: number | null;
}

export const useRelatedReports = (slugs?: string[] | null) => {
  const [items, setItems] = useState<RelatedReport[]>([]);
  useEffect(() => {
    let cancelled = false;
    if (!slugs || slugs.length === 0) { setItems([]); return; }
    (async () => {
      try {
        const { data } = await supabase
          .from('landing_pages')
          .select('slug, title, subtitle, badge, price')
          .in('slug', slugs)
          .eq('active', true);
        if (!cancelled) setItems((data || []) as RelatedReport[]);
      } catch { if (!cancelled) setItems([]); }
    })();
    return () => { cancelled = true; };
  }, [JSON.stringify(slugs)]);
  return items;
};

export const useLandingPage = (slug?: string) => {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!slug) { setLoading(false); setNotFound(true); return; }
    (async () => {
      setLoading(true);
      try {
        const { data: pg } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .eq('active', true)
          .maybeSingle();
        if (cancelled) return;
        if (!pg) { setNotFound(true); setLoading(false); return; }
        setPage(pg as LandingPage);
        const { data: bl } = await supabase
          .from('page_blocks')
          .select('*')
          .eq('page_id', (pg as any).id)
          .eq('active', true)
          .order('position', { ascending: true });
        if (cancelled) return;
        setBlocks((bl || []) as PageBlock[]);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return { page, blocks, loading, notFound };
};
