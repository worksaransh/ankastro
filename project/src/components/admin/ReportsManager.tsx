import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

interface Report {
  id: string;
  user_id: string;
  form_data: any;
  report_type: string;
  created_at: string;
  isPaid?: boolean;
}

const ReportsManager = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [langFilter, setLangFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const [{ data: rs }, { data: pays }] = await Promise.all([
      supabase.from('user_reports').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('payments').select('user_id,status').eq('status', 'success'),
    ]);
    const paidIds = new Set((pays || []).map((p: any) => p.user_id));
    setReports((rs || []).map((r: any) => ({ ...r, isPaid: paidIds.has(r.user_id) })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const unlock = async (r: Report) => {
    if (!confirm('Manually unlock this report?')) return;
    const { error } = await supabase.from('payments').insert({
      user_id: r.user_id, amount: 0, status: 'success', cashfree_order_id: `ADMIN_UNLOCK_${Date.now()}`,
    });
    if (error) return toast.error(error.message);
    toast.success('Report unlocked');
    load();
  };

  const remove = async (r: Report) => {
    if (!confirm('Delete this report?')) return;
    const { error } = await supabase.from('user_reports').delete().eq('id', r.id);
    if (error) return toast.error(error.message);
    toast.success('Deleted'); load();
  };

  const filtered = useMemo(() => reports.filter(r => {
    if (filter === 'paid' && !r.isPaid) return false;
    if (filter === 'free' && r.isPaid) return false;
    if (langFilter !== 'all' && r.form_data?.language !== langFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (r.form_data?.fullName || r.form_data?.name || '').toLowerCase();
      if (!name.includes(q) && !r.user_id.includes(search)) return false;
    }
    return true;
  }), [reports, filter, langFilter, search]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Reports ({filtered.length})</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search name/user..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} className="border border-border rounded px-2 py-1 bg-background text-sm">
            <option value="all">All Languages</option><option value="en">EN</option><option value="hi">HI</option><option value="hinglish">Hinglish</option>
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border border-border rounded px-2 py-1 bg-background text-sm">
            <option value="all">All</option><option value="paid">Paid</option><option value="free">Free</option>
          </select>
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2">Name</th><th className="text-left py-2">DOB</th>
                <th className="text-left py-2">Lang</th><th className="text-left py-2">Type</th>
                <th className="text-left py-2">Status</th><th className="text-left py-2">Created</th>
                <th className="text-left py-2">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No reports</td></tr> :
                  filtered.map(r => (
                    <tr key={r.id} className="border-b hover:bg-muted/50">
                      <td className="py-2">{r.form_data?.fullName || r.form_data?.name || 'N/A'}</td>
                      <td className="py-2 text-xs">{r.form_data?.dateOfBirth || r.form_data?.dob || '-'}</td>
                      <td className="py-2"><Badge variant="outline">{r.form_data?.language || 'en'}</Badge></td>
                      <td className="py-2 text-xs">{r.report_type}</td>
                      <td className="py-2"><Badge variant={r.isPaid ? 'default' : 'secondary'}>{r.isPaid ? 'Paid' : 'Free'}</Badge></td>
                      <td className="py-2 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="py-2 flex gap-1">
                        {!r.isPaid && <Button size="sm" variant="outline" onClick={() => unlock(r)} className="gap-1"><CheckCircle className="w-3 h-3" />Unlock</Button>}
                        <Button size="sm" variant="ghost" onClick={() => remove(r)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsManager;
