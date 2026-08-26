import { supabase } from '@/integrations/supabase/client';
import { hasAccess, type Tier } from '@/lib/tiers';

/**
 * Server-side authoritative tier check.
 * Calls the `get-report-tier` edge function which uses the service role to
 * read the user's payments table, bypassing any client-side tampering.
 */
export async function fetchVerifiedTier(reportId?: string | null, reportKey?: string | null): Promise<Tier> {
  try {
    const { data, error } = await supabase.functions.invoke('get-report-tier', {
      body: { 
        reportId: reportId || undefined,
        reportKey: reportKey || undefined
      },
    });
    if (error) {
      console.warn('[verifyTier] edge error:', error);
      return 'glimpse';
    }
    return (data?.tier as Tier) || 'glimpse';
  } catch (e) {
    console.warn('[verifyTier] exception:', e);
    return 'glimpse';
  }
}

export async function assertTier(
  required: Tier, 
  reportId?: string | null, 
  reportKey?: string | null
): Promise<{ ok: boolean; tier: Tier }> {
  const tier = await fetchVerifiedTier(reportId, reportKey);
  return { ok: hasAccess(tier, required), tier };
}
