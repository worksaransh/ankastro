import { useState, useEffect } from 'react';
import { REPORTS } from '@/content/reportContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, X, BarChart3 } from 'lucide-react';

const ALL_TIERS = ['starter', 'pro', 'master', 'addon', 'plus_monthly', 'plus_quarterly'] as const;
type TierKey = typeof ALL_TIERS[number];

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  expiry_date: string | null;
  usage_limit: number;
  used_count: number;
  active: boolean;
  applicable_tiers: string[] | null;
  min_cart_value: number;
  first_time_user_only: boolean;
  auto_apply: boolean;
  allow_stacking: boolean;
  per_user_limit: number;
}

interface AnalyticsRow {
  coupon_id: string;
  code: string;
  redemptions: number;
  discount_total: number;
  revenue_total: number;
}

const CouponManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<Partial<Coupon> | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'list' | 'analytics'>('list');
  const [analytics, setAnalytics] = useState<AnalyticsRow[]>([]);

  const loadCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons((data || []) as Coupon[]);
  };

  const loadAnalytics = async () => {
    const { data: reds } = await supabase
      .from('coupon_redemptions')
      .select('coupon_id, discount_amount, payment_id');
    const { data: coups } = await supabase.from('coupons').select('id, code');
    const { data: pays } = await supabase.from('payments').select('id, amount, coupon_code');
    const codeMap: Record<string, string> = {};
    (coups || []).forEach((c: any) => (codeMap[c.id] = c.code));
    const agg: Record<string, AnalyticsRow> = {};
    (reds || []).forEach((r: any) => {
      const row = agg[r.coupon_id] ||= { coupon_id: r.coupon_id, code: codeMap[r.coupon_id] || '?', redemptions: 0, discount_total: 0, revenue_total: 0 };
      row.redemptions += 1;
      row.discount_total += Number(r.discount_amount || 0);
      const pay = (pays || []).find((p: any) => p.id === r.payment_id);
      if (pay) row.revenue_total += Number(pay.amount || 0);
    });
    setAnalytics(Object.values(agg).sort((a, b) => b.revenue_total - a.revenue_total));
  };

  useEffect(() => { loadCoupons(); }, []);
  useEffect(() => { if (tab === 'analytics') loadAnalytics(); }, [tab]);

  const handleSave = async () => {
    if (!editing?.code) { toast.error('Code is required'); return; }
    setSaving(true);
    try {
      const payload: any = { ...editing, code: editing.code!.toUpperCase() };
      if (Array.isArray(payload.applicable_tiers) && payload.applicable_tiers.length === 0) payload.applicable_tiers = null;
      // strip server-managed fields so insert/update never conflicts
      delete payload.used_count; delete payload.created_at; delete payload.updated_at;
      if (editing.id) {
        delete payload.id;
        const { error } = await supabase.from('coupons').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        delete payload.id;
        const { error } = await supabase.from('coupons').insert(payload);
        if (error) throw error;
      }
      toast.success('Coupon saved!');
      setEditing(null);
      await loadCoupons();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await supabase.from('coupons').delete().eq('id', id);
    toast.success('Coupon deleted');
    loadCoupons();
  };

  const toggleActive = async (coupon: Coupon) => {
    await supabase.from('coupons').update({ active: !coupon.active }).eq('id', coupon.id);
    loadCoupons();
  };

  const toggleTier = (tier: TierKey) => {
    const current = editing?.applicable_tiers || [];
    const next = current.includes(tier) ? current.filter(t => t !== tier) : [...current, tier];
    setEditing({ ...editing, applicable_tiers: next });
  };

  if (editing) {
    const tiers = editing.applicable_tiers || [];
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editing.id ? 'Edit Coupon' : 'New Coupon'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Code *</label><Input value={editing.code || ''} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} placeholder="BASIC50" /></div>
            <div>
              <label className="text-sm font-medium">Discount Type</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground" value={editing.discount_type || 'percentage'} onChange={(e) => setEditing({ ...editing, discount_type: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount (₹)</option>
                <option value="free">Free (100% off)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="text-sm font-medium">Discount Value</label><Input type="number" value={editing.discount_value ?? 0} onChange={(e) => setEditing({ ...editing, discount_value: Number(e.target.value) })} /></div>
            <div><label className="text-sm font-medium">Usage Limit (0 = ∞)</label><Input type="number" value={editing.usage_limit ?? 0} onChange={(e) => setEditing({ ...editing, usage_limit: Number(e.target.value) })} /></div>
            <div><label className="text-sm font-medium">Per-User Limit</label><Input type="number" value={editing.per_user_limit ?? 1} onChange={(e) => setEditing({ ...editing, per_user_limit: Number(e.target.value) })} /></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Expiry Date</label><Input type="date" value={editing.expiry_date?.split('T')[0] || ''} onChange={(e) => setEditing({ ...editing, expiry_date: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
            <div><label className="text-sm font-medium">Min Cart Value (₹)</label><Input type="number" value={editing.min_cart_value ?? 0} onChange={(e) => setEditing({ ...editing, min_cart_value: Number(e.target.value) })} /></div>
            <div><label className="text-sm font-medium">Report (optional — sirf is report par)</label>
              <select value={(editing as any).report_key || ''} onChange={(e) => setEditing({ ...editing, report_key: e.target.value || null } as any)} className="w-full h-10 rounded-md border border-border bg-background px-2 text-sm">
                <option value="">All reports / tiers</option>
                {REPORTS.map((r) => <option key={r.key} value={r.key}>{r.emoji} {r.key}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Applicable Packages (none selected = all)</label>
            <div className="flex flex-wrap gap-3">
              {ALL_TIERS.map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={tiers.includes(t)} onCheckedChange={() => toggleTier(t)} />
                  <span className="capitalize text-sm">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={!!editing.first_time_user_only} onCheckedChange={(v) => setEditing({ ...editing, first_time_user_only: !!v })} />
              First-time users only
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={!!editing.auto_apply} onCheckedChange={(v) => setEditing({ ...editing, auto_apply: !!v })} />
              Auto-apply at checkout
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={!!editing.allow_stacking} onCheckedChange={(v) => setEditing({ ...editing, allow_stacking: !!v })} />
              Allow stacking
            </label>
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Coupon'}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Coupons</CardTitle>
          <div className="flex gap-1 ml-4">
            <Button size="sm" variant={tab === 'list' ? 'default' : 'ghost'} onClick={() => setTab('list')}>All</Button>
            <Button size="sm" variant={tab === 'analytics' ? 'default' : 'ghost'} onClick={() => setTab('analytics')} className="gap-1"><BarChart3 className="w-3.5 h-3.5" />Analytics</Button>
          </div>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setEditing({ code: '', discount_type: 'percentage', discount_value: 0, usage_limit: 0, used_count: 0, active: true, applicable_tiers: [], min_cart_value: 0, first_time_user_only: false, auto_apply: false, allow_stacking: false, per_user_limit: 1 })}>
          <Plus className="w-4 h-4" />New Coupon
        </Button>
      </CardHeader>
      <CardContent>
        {tab === 'analytics' ? (
          analytics.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No redemptions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr><th className="py-2">Code</th><th>Redemptions</th><th>Discount Given</th><th>Revenue Driven</th></tr>
                </thead>
                <tbody>
                  {analytics.map(a => (
                    <tr key={a.coupon_id} className="border-b">
                      <td className="py-2"><code className="font-mono font-bold text-primary">{a.code}</code></td>
                      <td>{a.redemptions}</td>
                      <td>₹{a.discount_total.toFixed(0)}</td>
                      <td>₹{a.revenue_total.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : coupons.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No coupons yet.</p>
        ) : (
          <div className="space-y-2">
            {coupons.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="font-mono font-bold text-primary">{c.code}</code>
                    <Badge variant={c.active ? 'default' : 'secondary'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                    <Badge variant="outline">{c.discount_type === 'free' ? 'FREE' : c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}</Badge>
                    {Array.isArray(c.applicable_tiers) && c.applicable_tiers.length > 0 && (
                      <Badge variant="outline" className="capitalize">{c.applicable_tiers.join(', ')}</Badge>
                    )}
                    {(c as any).report_key && (
                      <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/30">🎯 {(c as any).report_key.replace(/_/g,' ')}</Badge>
                    )}
                    {c.first_time_user_only && <Badge variant="outline">First-time</Badge>}
                    {c.auto_apply && <Badge variant="outline">Auto</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used: {c.used_count}{c.usage_limit > 0 ? `/${c.usage_limit}` : ''} • Per-user: {c.per_user_limit || '∞'} • {c.expiry_date ? `Expires: ${new Date(c.expiry_date).toLocaleDateString()}` : 'No expiry'}{c.min_cart_value > 0 ? ` • Min ₹${c.min_cart_value}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(c)}>{c.active ? 'Disable' : 'Enable'}</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(c)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponManager;
