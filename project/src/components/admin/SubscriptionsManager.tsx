import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface Sub {
  id: string; email: string | null; plan: string; amount: number;
  status: string; started_at: string | null; expires_at: string | null; created_at: string;
}

export default function SubscriptionsManager() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({ monthly: '99', quarterly: '249' });
  const [savingPrices, setSavingPrices] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false }).limit(50);
      setSubs((data as Sub[]) || []);
      const { data: ss } = await supabase.from('system_settings').select('key,value').in('key', ['plus_monthly_price','plus_quarterly_price']);
      const map: any = {}; (ss || []).forEach((r: any) => { map[r.key] = r.value; });
      setPrices({ monthly: map.plus_monthly_price || '99', quarterly: map.plus_quarterly_price || '249' });
      setLoading(false);
    })();
  }, []);

  const savePrices = async () => {
    setSavingPrices(true);
    await supabase.from('system_settings').upsert([
      { key: 'plus_monthly_price', value: prices.monthly },
      { key: 'plus_quarterly_price', value: prices.quarterly },
    ], { onConflict: 'key' });
    setSavingPrices(false);
    toast.success('Prices saved!');
  };

  const active = subs.filter(s => s.status === 'active');
  const revenue = subs.filter(s => s.status === 'active').reduce((a, s) => a + Number(s.amount), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{active.length}</p><p className="text-xs text-muted-foreground">Active members</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{subs.length}</p><p className="text-xs text-muted-foreground">Total subscribers</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">₹{revenue}</p><p className="text-xs text-muted-foreground">Active MRR</p></CardContent></Card>
      </div>

      {/* Price control */}
      <Card>
        <CardHeader><CardTitle className="text-base">Plus Plan Prices (admin-editable)</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3 items-end">
          <div><label className="text-xs text-muted-foreground">Monthly ₹</label><Input className="h-9 w-24" value={prices.monthly} onChange={e => setPrices(p => ({ ...p, monthly: e.target.value }))} /></div>
          <div><label className="text-xs text-muted-foreground">Quarterly ₹</label><Input className="h-9 w-24" value={prices.quarterly} onChange={e => setPrices(p => ({ ...p, quarterly: e.target.value }))} /></div>
          <Button size="sm" onClick={savePrices} disabled={savingPrices} className="gap-1"><Save className="w-3.5 h-3.5" />{savingPrices ? 'Saving…' : 'Save'}</Button>
        </CardContent>
      </Card>

      {/* Subscribers list */}
      <Card>
        <CardHeader><CardTitle className="text-base">Subscribers</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : subs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Abhi tak koi Plus member nahi. /plus pe promote karo!</p>
          ) : (
            <div className="space-y-2">
              {subs.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border text-sm">
                  <div>
                    <p className="font-medium">{s.email || 'Guest'}</p>
                    <p className="text-xs text-muted-foreground">{s.plan} · ₹{s.amount} · {s.started_at ? new Date(s.started_at).toLocaleDateString() : 'pending'}</p>
                    {s.expires_at && <p className="text-xs text-muted-foreground">Expires: {new Date(s.expires_at).toLocaleDateString()}</p>}
                  </div>
                  <Badge variant={s.status === 'active' ? 'default' : 'secondary'}>{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
