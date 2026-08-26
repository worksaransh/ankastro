import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Save } from 'lucide-react';

interface PlanRow {
  id?: string;
  tier: string;
  price: number;
  original_price: number | null;
  active: boolean;
}

const TIER_ORDER = ['glimpse', 'starter', 'addon', 'pro', 'master'];

const PricingManager = () => {
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pricing_plans').select('*');
    if (error) { toast.error('Failed to load pricing'); setLoading(false); return; }
    const sorted = (data || []).sort(
      (a: any, b: any) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
    );
    setRows(sorted as PlanRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = (tier: string, field: keyof PlanRow, value: any) => {
    setRows((r) => r.map((row) => (row.tier === tier ? { ...row, [field]: value } : row)));
  };

  const save = async (row: PlanRow) => {
    setSaving(row.tier);
    const { error } = await supabase
      .from('pricing_plans')
      .update({
        price: Number(row.price) || 0,
        original_price: row.original_price === null || row.original_price === ('' as any) ? null : Number(row.original_price),
        active: row.active,
        updated_at: new Date().toISOString(),
      })
      .eq('tier', row.tier);
    setSaving(null);
    if (error) { toast.error(`Save failed: ${error.message}`); return; }
    toast.success(`${row.tier} updated`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pricing Plans</CardTitle>
        <Button size="sm" variant="outline" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">No pricing rows. Run pricing_plans.sql first.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Tier</th>
                  <th className="py-2">Price (₹)</th>
                  <th className="py-2">Original (₹)</th>
                  <th className="py-2">Active</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.tier} className="border-b">
                    <td className="py-2"><Badge variant="outline" className="capitalize">{row.tier}</Badge></td>
                    <td className="py-2">
                      <Input
                        type="number"
                        value={row.price}
                        onChange={(e) => update(row.tier, 'price', e.target.value)}
                        className="w-24 h-8"
                      />
                    </td>
                    <td className="py-2">
                      <Input
                        type="number"
                        value={row.original_price ?? ''}
                        placeholder="—"
                        onChange={(e) => update(row.tier, 'original_price', e.target.value === '' ? null : e.target.value)}
                        className="w-24 h-8"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={row.active}
                        onChange={(e) => update(row.tier, 'active', e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="py-2">
                      <Button size="sm" onClick={() => save(row)} disabled={saving === row.tier} className="gap-1">
                        <Save className="w-3 h-3" /> {saving === row.tier ? '...' : 'Save'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-3">
              Changes apply immediately on the payment page. Edge function uses these too (falls back to defaults if unset).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingManager;
