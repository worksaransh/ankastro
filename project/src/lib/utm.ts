// First-touch UTM/click-id capture for ad attribution.
// Captures utm_* + gclid/fbclid from URL on first visit, persists locally,
// and is attached to leads + orders so admin can see which ad converted.

const KEY = 'aj_utm_v1';

export interface UtmData {
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  utm_term?: string; utm_content?: string;
  gclid?: string; fbclid?: string;
  landing?: string; first_seen?: string;
}

export const captureUtm = () => {
  try {
    const p = new URLSearchParams(window.location.search);
    const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    const found: UtmData = {};
    let has = false;
    fields.forEach((f) => { const v = p.get(f); if (v) { (found as any)[f] = v; has = true; } });
    if (!has) return; // nothing to capture; keep first-touch
    const existing = getUtm();
    if (existing && existing.utm_source) return; // first-touch wins
    found.landing = window.location.pathname;
    found.first_seen = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(found));
  } catch { /* storage blocked — attribution optional */ }
};

export const getUtm = (): UtmData | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};
