import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type RecoveryStatus = 'pending' | 'valid' | 'invalid';

interface RecoveryState {
  status: RecoveryStatus;
  error: string;
  source: string; // which detection path matched (for debugging)
}

const log = (...args: unknown[]) => {
  // Single namespaced logger so it's easy to filter in console
  console.log('[recovery-session]', ...args);
};

/**
 * Wraps the locked Supabase auth client to detect a password-recovery
 * session from any of the supported flows:
 *  - PKCE        → ?code=...
 *  - Implicit    → #access_token=...&refresh_token=...&type=recovery
 *  - Event-based → onAuthStateChange('PASSWORD_RECOVERY')
 *  - Existing    → previously hydrated session
 *
 * Cleans the URL on success and logs every step so the flow is debuggable.
 */
export const useRecoverySession = (): RecoveryState => {
  const [state, setState] = useState<RecoveryState>({
    status: 'pending',
    error: '',
    source: '',
  });

  useEffect(() => {
    let mounted = true;
    const setStatus = (next: Partial<RecoveryState>) => {
      if (!mounted) return;
      setState((prev) => ({ ...prev, ...next }));
    };

    log('init', {
      href: window.location.href,
      hasHash: !!window.location.hash,
      hasQuery: !!window.location.search,
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        log('auth event', event, { hasSession: !!session });
        if (event === 'PASSWORD_RECOVERY') {
          setStatus({ status: 'valid', source: 'event:PASSWORD_RECOVERY' });
        }
      },
    );

    const cleanUrl = () => {
      window.history.replaceState({}, '', window.location.pathname);
    };

    const init = async () => {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const queryParams = new URLSearchParams(window.location.search);

      // 1. Explicit error from email link (expired / invalid / used)
      const errDesc =
        hashParams.get('error_description') || queryParams.get('error_description');
      if (errDesc) {
        const msg = errDesc.replace(/\+/g, ' ');
        log('detected error in url', msg);
        setStatus({ status: 'invalid', error: msg, source: 'url:error' });
        return;
      }

      // 2. PKCE flow
      const code = queryParams.get('code');
      if (code) {
        log('detected pkce code, exchanging…');
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          log('pkce exchange failed', error.message);
          setStatus({ status: 'invalid', error: error.message, source: 'pkce' });
        } else {
          log('pkce exchange ok');
          cleanUrl();
          setStatus({ status: 'valid', source: 'pkce' });
        }
        return;
      }

      // 3. Implicit flow (recovery tokens in hash)
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      if (accessToken && refreshToken && type === 'recovery') {
        log('detected implicit recovery tokens, setting session…');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          log('setSession failed', error.message);
          setStatus({ status: 'invalid', error: error.message, source: 'implicit' });
        } else {
          log('setSession ok');
          cleanUrl();
          setStatus({ status: 'valid', source: 'implicit' });
        }
        return;
      }

      // 4. Fallback: an existing session (event may have fired pre-mount)
      const { data: { session } } = await supabase.auth.getSession();
      log('fallback getSession', { hasSession: !!session });
      setStatus(
        session
          ? { status: 'valid', source: 'existing-session' }
          : {
              status: 'invalid',
              error: 'No recovery token found in URL.',
              source: 'none',
            },
      );
    };

    init();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
