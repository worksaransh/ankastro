import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TIERS, type Tier } from '@/lib/tiers';

export interface PriceInfo { price: number; originalPrice?: number | null; }

/**
 * Returns pricing for all tiers, preferring the admin-editable
 * `pricing_plans` table, falling back to hardcoded TIERS if the
 * table is empty or the fetch fails. Never throws.
 */
export const usePricing = () => {
  const [prices, setPrices] = useState<Record<string, PriceInfo>>(() => {
    const base: Record<string, PriceInfo> = {};
    (Object.keys(TIERS) as Tier[]).forEach((t) => {
      base[t] = { price: TIERS[t].price, originalPrice: TIERS[t].originalPrice ?? null };
    });
    return base;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('pricing_plans')
          .select('tier, price, original_price, active');
        if (!error && data && data.length && !cancelled) {
          setPrices((prev) => {
            const next = { ...prev };
            data.forEach((row: any) => {
              if (row.active !== false) {
                next[row.tier] = { price: Number(row.price), originalPrice: row.original_price };
              }
            });
            return next;
          });
        }
      } catch {
        /* keep fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const priceOf = (t: string): PriceInfo => prices[t] || { price: TIERS[t as Tier]?.price ?? 0, originalPrice: TIERS[t as Tier]?.originalPrice ?? null };

  return { prices, priceOf, loading };
};
