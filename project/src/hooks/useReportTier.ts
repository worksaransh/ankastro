import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { tierRank, type Tier } from '@/lib/tiers';

/**
 * Resolves the highest paid tier for a given report id.
 * Falls back to 'glimpse' for unauthenticated users or no successful payment.
 */
export function useReportTier(reportId?: string | null) {
  const [tier, setTier] = useState<Tier>('glimpse');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { if (!cancelled) { setTier('glimpse'); setLoading(false); } return; }

        const query = supabase
          .from('payments')
          .select('tier, report_id, status')
          .eq('user_id', session.user.id)
          .eq('status', 'success');

        const { data } = await query;
        let best: Tier = 'glimpse';
        (data || []).forEach((p: any) => {
          const t = (p.tier || 'glimpse') as Tier;
          // Report-specific takes precedence; account-level acts as fallback
          if (reportId ? p.report_id === reportId : true) {
            if (tierRank(t) > tierRank(best)) best = t;
          }
        });
        if (!cancelled) setTier(best);
      } catch (e) {
        console.error('[useReportTier]', e);
        if (!cancelled) setTier('glimpse');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [reportId]);

  return { tier, loading };
}
