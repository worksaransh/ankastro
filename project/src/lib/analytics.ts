import { supabase } from '@/integrations/supabase/client';

/**
 * Fire-and-forget analytics event logger.
 * Safe: never throws, never blocks user flow.
 */
export const trackEvent = async (event: string, meta: Record<string, any> = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('analytics_events').insert({
      event,
      user_id: session?.user?.id ?? null,
      meta,
    });
  } catch (err) {
    // Silent — analytics must never break UX
    if (import.meta.env.DEV) console.warn('[analytics] failed:', event, err);
  }
};
