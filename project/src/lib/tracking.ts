// E-commerce style conversion events for Meta Pixel + GA4 + Google Ads.
// Har report/plan = ek PRODUCT (content_id) -> Meta Events Manager me
// product-wise breakdown + catalog/dynamic ads ready.
// IDs admin-editable (system_settings). Safe no-ops if unset.
import { supabase } from '@/integrations/supabase/client';

let cache: Record<string, string> | null = null;
const getSettings = async (): Promise<Record<string, string>> => {
  if (cache) return cache;
  try {
    const { data } = await supabase.from('system_settings').select('key, value');
    cache = {};
    (data || []).forEach((s: any) => { cache![s.key] = s.value; });
  } catch { cache = {}; }
  return cache!;
};

// once-per-order guard (refresh/re-visit par dobara Purchase NA jaye)
const firedKey = (orderId: string) => `aj_purchased_${orderId}`;
const alreadyFired = (orderId: string) => {
  try { return localStorage.getItem(firedKey(orderId)) === '1'; } catch { return false; }
};
const markFired = (orderId: string) => {
  try { localStorage.setItem(firedKey(orderId), '1'); } catch { /* ignore */ }
};

export interface PurchaseItem {
  id: string;          // product id e.g. report key: business_numerology / plan_master
  name?: string;       // readable name
  price: number;       // unit price (INR)
  quantity?: number;   // default 1
}

// PRODUCT-WISE purchase — ecommerce params (Meta: contents/content_ids,
// GA4: items, GAds: conversion). Call on order success.
export const trackPurchase = async (orderId: string, value: number, items: PurchaseItem[] | string, fallbackName?: string) => {
  try {
    if (!orderId || alreadyFired(orderId)) return;
    // back-compat: string reportKey -> single item
    const list: PurchaseItem[] = typeof items === 'string'
      ? [{ id: items, name: fallbackName || items, price: value, quantity: 1 }]
      : (items || []);
    if (!list.length) list.push({ id: orderId, name: fallbackName || 'report', price: value, quantity: 1 });

    const t = await getSettings();
    const w = window as any;
    const eventID = `purch_${orderId}`; // dedupe id (CAPI-ready)

    if (t.meta_pixel_id && w.fbq) {
      w.fbq('track', 'Purchase', {
        value, currency: 'INR',
        content_type: 'product',
        content_ids: list.map((i) => i.id),
        content_name: list.map((i) => i.name || i.id).join(', '),
        contents: list.map((i) => ({ id: i.id, quantity: i.quantity || 1, item_price: i.price })),
        num_items: list.reduce((a, i) => a + (i.quantity || 1), 0),
      }, { eventID });
    }
    if (w.gtag) {
      if (t.ga_id) {
        w.gtag('event', 'purchase', {
          transaction_id: orderId, value, currency: 'INR',
          items: list.map((i) => ({ item_id: i.id, item_name: i.name || i.id, price: i.price, quantity: i.quantity || 1 })),
        });
      }
      if (t.google_ads_id && t.google_ads_purchase_label) {
        w.gtag('event', 'conversion', {
          send_to: `${t.google_ads_id}/${t.google_ads_purchase_label}`,
          value, currency: 'INR', transaction_id: orderId,
        });
      }
    }
    markFired(orderId);
  } catch { /* tracking optional */ }
};

// Lead event — free snapshot (report-wise)
export const trackLead = async (productId?: string, productName?: string) => {
  try {
    const t = await getSettings();
    const w = window as any;
    if (t.meta_pixel_id && w.fbq) {
      w.fbq('track', 'Lead', productId ? {
        content_type: 'product', content_ids: [productId], content_name: productName || productId,
      } : undefined);
    }
    if (t.ga_id && w.gtag) w.gtag('event', 'generate_lead', productId ? { item_id: productId } : undefined);
  } catch { /* optional */ }
};

// InitiateCheckout — /buy par (report-wise)
export const trackInitiateCheckout = async (value?: number, productId?: string, productName?: string) => {
  try {
    const t = await getSettings();
    const w = window as any;
    if (t.meta_pixel_id && w.fbq) {
      w.fbq('track', 'InitiateCheckout', {
        ...(value ? { value, currency: 'INR' } : {}),
        ...(productId ? { content_type: 'product', content_ids: [productId], content_name: productName || productId, contents: [{ id: productId, quantity: 1, item_price: value || 0 }] } : {}),
      });
    }
    if (t.ga_id && w.gtag) {
      w.gtag('event', 'begin_checkout', {
        ...(value ? { value, currency: 'INR' } : {}),
        ...(productId ? { items: [{ item_id: productId, item_name: productName || productId, price: value || 0, quantity: 1 }] } : {}),
      });
    }
  } catch { /* optional */ }
};

// ViewContent — report landing par (product page view, retargeting ke liye)
export const trackViewContent = async (productId: string, productName?: string, value?: number) => {
  try {
    const t = await getSettings();
    const w = window as any;
    if (t.meta_pixel_id && w.fbq) {
      w.fbq('track', 'ViewContent', {
        content_type: 'product', content_ids: [productId], content_name: productName || productId,
        ...(value ? { value, currency: 'INR' } : {}),
      });
    }
    if (t.ga_id && w.gtag) {
      w.gtag('event', 'view_item', { items: [{ item_id: productId, item_name: productName || productId, price: value || 0 }] });
    }
  } catch { /* optional */ }
};
