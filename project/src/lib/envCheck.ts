/**
 * Runtime validation for required environment variables.
 * Called once at app boot. Logs a clear message if anything is missing
 * so deployments to Hostinger fail loudly instead of silently breaking
 * Supabase / data calls.
 *
 * NOTE: Do not modify src/integrations/supabase/client.ts — it is auto-generated.
 * The Supabase client already pulls from import.meta.env, so we just validate here.
 */
export function validateEnv(): { ok: boolean; missing: string[] } {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const;
  const missing: string[] = [];

  for (const key of required) {
    const value = (import.meta.env as Record<string, string | undefined>)[key];
    if (!value || value.trim() === '') missing.push(key);
  }

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `[Ankjyotish] Missing required environment variable(s): ${missing.join(', ')}.\n` +
        `Make sure these are configured in your hosting environment before building.`
    );
  }

  return { ok: missing.length === 0, missing };
}
