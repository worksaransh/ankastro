import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const TIERS = ['starter', 'pro', 'master', 'addon'] as const;

interface UpgradePath {
  id: string;
  from_tier: string;
  to_tier: string;
  enabled: boolean;
  override_price: number | null;
}

const UpgradePathsManager = () => {
  const [paths, setPaths] = useState<UpgradePath[]>([]);
  const [from, setFrom] = useState<string>('starter');
  const [to, setTo] = useState<string>('pro');
  const [override, setOverride] = useState<string>('');

  const load = async () => {
    const { data } = await supabase.from('upgrade_paths').select('*').order('from_tier');
    setPaths((data || []) as UpgradePath[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (from === to) { toast.error('From and To must differ'); return; }
    const { error } = await supabase.from('upgrade_paths').insert({
      from_tier: from, to_tier: to, enabled: true,
      override_price: override ? Number(override) : null,
    });
    if (error) toast.error(error.message); else { toast.success('Path added'); setOverride(''); load(); }
  };

  const toggle = async (p: UpgradePath) => {
    await supabase.from('upgrade_paths').update({ enabled: !p.enabled }).eq('id', p.id);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this upgrade path?')) return;
    await supabase.from('upgrade_paths').delete().eq('id', id);
    load();
  };

  const updateOverride = async (id: string, val: string) => {
    await supabase.from('upgrade_paths').update({ override_price: val ? Number(val) : null }).eq('id', id);
    load();
  };

  return (
    <Card>
      <CardHeader><CardTitle>Upgrade Paths</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-2 p-3 rounded-lg bg-muted/40">
          <div>
            <label className="text-xs text-muted-foreground">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="block border border-border rounded-lg px-3 py-2 bg-background">
              {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="block border border-border rounded-lg px-3 py-2 bg-background">
              {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Override Price (optional)</label>
            <Input type="number" placeholder="e.g. 800" value={override} onChange={(e) => setOverride(e.target.value)} className="w-40" />
          </div>
          <Button onClick={add} className="gap-1"><Plus className="w-4 h-4" />Add</Button>
        </div>

        {paths.length === 0 ? (
          <p className="text-muted-foreground text-center py-6 text-sm">No upgrade paths configured.</p>
        ) : (
          <div className="space-y-2">
            {paths.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <span className="font-mono capitalize">{p.from_tier} → {p.to_tier}</span>
                  <Switch checked={p.enabled} onCheckedChange={() => toggle(p)} />
                  <span className="text-xs text-muted-foreground">{p.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="default"
                    defaultValue={p.override_price ?? ''}
                    onBlur={(e) => updateOverride(p.id, e.target.value)}
                    className="w-32 h-8 text-xs"
                  />
                  <Button variant="ghost" size="sm" onClick={() => del(p.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Override price replaces the target tier's full price. Final charge = override (or target price) minus what the user already paid.
        </p>
      </CardContent>
    </Card>
  );
};

export default UpgradePathsManager;
