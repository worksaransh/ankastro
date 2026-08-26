/**
 * Allowlist of safe internal return URLs.
 * Used to prevent open-redirect attacks via the returnUrl query parameter.
 */
const ALLOWED_RETURN_PATHS = new Set([
  '/advanced-report',
  '/tools/vibration',
  '/dashboard',
  '/report',
  '/summary',
  '/decisions',
  '/calculator-test',
  '/payment',
]);

const DEFAULT_RETURN_PATH = '/advanced-report';

/**
 * Validates a returnUrl string and returns either the cleaned path
 * or the default safe fallback.
 *
 * Rejects:
 * - Absolute URLs (http://, https://, //)
 * - javascript: / data: protocols
 * - Query fragments with newlines or control chars
 * - Anything not in the allowlist
 */
export function validateReturnUrl(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') return DEFAULT_RETURN_PATH;

  const trimmed = raw.trim();

  // Block protocol-based URLs, host-relative URLs, and protocol handlers
  if (
    /^https?:\/\//i.test(trimmed) ||
    /^\/\//i.test(trimmed) ||
    /^javascript:/i.test(trimmed) ||
    /^data:/i.test(trimmed) ||
    /[\r\n\x00-\x1f\x7f]/.test(trimmed)
  ) {
    return DEFAULT_RETURN_PATH;
  }

  // Normalize: strip trailing slash and query/hash for allowlist lookup
  const cleanPath = trimmed.split(/[?#]/)[0].replace(/\/$/, '') || trimmed;

  if (ALLOWED_RETURN_PATHS.has(cleanPath)) {
    return cleanPath;
  }

  return DEFAULT_RETURN_PATH;
}
