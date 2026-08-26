// Sentry integration helper with fallback logging (dry run friendly)
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (dsn) {
    console.log(`[Sentry] Initializing dry run on DSN: ${dsn}`);
    // Real Sentry integration would hook window.onerror here
    window.addEventListener('error', (event) => {
      console.error('[Sentry Error Captured]:', event.error || event.message);
    });
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[Sentry Rejection Captured]:', event.reason);
    });
  } else {
    console.log('[Sentry] No DSN configured. Running with standard console logs.');
  }
};

export const captureException = (error: Error, extraInfo?: any) => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (dsn) {
    console.error('[Sentry Exception Captured]:', error, extraInfo);
  } else {
    console.error('[Console fallback] Exception:', error, extraInfo);
  }
};
