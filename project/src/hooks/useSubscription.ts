import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SubStatus {
  active: boolean;
  plan?: string;
  expiresAt?: string;
  loading: boolean;
}

// Checks if the logged-in user (or email) has an active Plus subscription.
export const useSubscription = (): SubStatus => {
  const [status, setStatus] = useState<SubStatus>({ active: false, loading: true });

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { if (on) setStatus({ active: false, loading: false }); return; }
        const { data } = await supabase
          .from('subscriptions')
          .select('plan, status, expires_at')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .order('expires_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!on) return;
        if (data && data.expires_at && new Date(data.expires_at) > new Date()) {
          setStatus({ active: true, plan: data.plan, expiresAt: data.expires_at, loading: false });
        } else {
          setStatus({ active: false, loading: false });
        }
      } catch {
        if (on) setStatus({ active: false, loading: false });
      }
    })();
    return () => { on = false; };
  }, []);

  return status;
};
