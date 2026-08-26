import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, Eye, EyeOff } from 'lucide-react';

interface Row {
  key: string; name: string; price: number; original_price: number | null;
  badge: string | null; active: boolean; sort_order: number;
}

export default function ReportCatalogManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('report_types')
      .select('key, name, price, original_price, badge, active, sort_order')
      .order('sort_order', { ascending: true });
    setRows((data as Row[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setField = (key: string, field: keyof Row, value: any) =>
    setRows((p) => p.map((r) => (r.key === key ? { ...r, [field]: value } : r)));

  const save = async (r: Row) => {
    setSavingKey(r.key);
    const { error } = await supabase.from('report_types').update({
      price: Number(r.price) || 0,
      original_price: r.original_price ? Number(r.original_price) : null,
      badge: r.badge || null,
      active: r.active,
      sort_order: Number(r.sort_order) || 0,
      updated_at: new Date().toISOString(),
    }).eq('key', r.key);
    setSavingKey(null);
    if (error) { toast.error('Save failed: ' + error.message); return; }
    toast.success(`${r.name} updated`);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading reports…</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Catalog — Prices & Visibility</CardTitle>
        <p className="text-sm text-muted-foreground">Yahan se har report ka price, badge aur show/hide control karo. (Report ka content code me hai; ye business settings hain.)</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-muted-foreground">Koi report_types row nahi mila. Pehle 05 + 09 SQL chalao.</p>}
        {rows.map((r) => (
          <div key={r.key} className="border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{r.name}</span>
              <button
                onClick={() => setField(r.key, 'active', !r.active)}
                className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${r.active ? 'bg-emerald-500/15 text-emerald-600' : 'bg-muted text-muted-foreground'}`}
              >
                {r.active ? <><Eye className="w-3 h-3" /> Visible</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Price ₹</label>
                <Input type="number" value={r.price} onChange={(e) => setField(r.key, 'price', e.target.value)} className="h-9" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cut price ₹</label>
                <Input type="number" value={r.original_price ?? ''} onChange={(e) => setField(r.key, 'original_price', e.target.value)} className="h-9" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Badge</label>
                <Input value={r.badge ?? ''} onChange={(e) => setField(r.key, 'badge', e.target.value)} placeholder="Bestseller" className="h-9" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Order</label>
                <Input type="number" value={r.sort_order} onChange={(e) => setField(r.key, 'sort_order', e.target.value)} className="h-9" />
              </div>
            </div>
            <div className="mt-2 text-right">
              <Button size="sm" onClick={() => save(r)} disabled={savingKey === r.key} className="gap-1">
                <Save className="w-3.5 h-3.5" /> {savingKey === r.key ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">⚠️ Price yahan badlo — checkout aur catalog dono isi se chalte hain (server-side bhi yahi price charge hota hai).</p>
      </CardContent>
    </Card>
  );
}
