import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Flag { key: string; enabled: boolean; description: string | null; }

const FeatureFlagsManager = () => {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('feature_flags').select('*').order('key');
    if (error) toast.error(error.message);
    setFlags((data || []) as Flag[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (key: string, enabled: boolean) => {
    const { error } = await supabase.from('feature_flags').update({ enabled, updated_at: new Date().toISOString() }).eq('key', key);
    if (error) return toast.error(error.message);
    toast.success(`${key} ${enabled ? 'enabled' : 'disabled'}`);
    load();
  };

  return (
    <Card>
      <CardHeader><CardTitle>Feature Flags</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> :
          <div className="space-y-3">
            {flags.map(f => (
              <div key={f.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-mono text-sm font-medium">{f.key}</p>
                  {f.description && <p className="text-xs text-muted-foreground">{f.description}</p>}
                </div>
                <Switch checked={f.enabled} onCheckedChange={(v) => toggle(f.key, v)} />
              </div>
            ))}
            {flags.length === 0 && <p className="text-muted-foreground">No flags defined.</p>}
          </div>
        }
      </CardContent>
    </Card>
  );
};

export default FeatureFlagsManager;
