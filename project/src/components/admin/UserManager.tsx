import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, RefreshCw, Trash2 } from 'lucide-react';

interface UserRow {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
  isPaid?: boolean;
  reportCount?: number;
  topTier?: string | null;
  totalPaid?: number;
}

const UserManager = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: payments }, { data: reports }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('payments').select('user_id,status,amount,tier'),
      supabase.from('user_reports').select('user_id'),
    ]);
    const tierRankMap: Record<string, number> = { glimpse: 0, starter: 1, addon: 1, pro: 2, master: 3 };
    const paidIds = new Set<string>();
    const totals: Record<string, number> = {};
    const topTier: Record<string, string> = {};
    (payments || []).forEach((p: any) => {
      if (p.status === 'success') {
        paidIds.add(p.user_id);
        totals[p.user_id] = (totals[p.user_id] || 0) + Number(p.amount || 0);
        if (!topTier[p.user_id] || (tierRankMap[p.tier] ?? 0) > (tierRankMap[topTier[p.user_id]] ?? 0)) {
          topTier[p.user_id] = p.tier;
        }
      }
    });
    const reportCounts: Record<string, number> = {};
    (reports || []).forEach((r: any) => { reportCounts[r.user_id] = (reportCounts[r.user_id] || 0) + 1; });
    setUsers((profiles || []).map((p: any) => ({
      ...p,
      isPaid: paidIds.has(p.user_id),
      reportCount: reportCounts[p.user_id] || 0,
      topTier: topTier[p.user_id] || null,
      totalPaid: totals[p.user_id] || 0,
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markPaid = async (u: UserRow) => {
    if (!confirm(`Mark ${u.email} as paid (manual unlock)?`)) return;
    const orderId = `ADMIN_MANUAL_${Date.now()}`;
    const { error } = await supabase.from('payments').insert({
      user_id: u.user_id, amount: 0, status: 'success', cashfree_order_id: orderId,
    });
    if (error) return toast.error(error.message);
    toast.success('User marked paid. Report unlocked.');
    load();
  };

  const deleteUser = async (u: UserRow) => {
    if (!confirm(`Delete profile for ${u.email}? (This removes profile only — auth user remains)`)) return;
    const { error } = await supabase.from('profiles').delete().eq('id', u.id);
    if (error) return toast.error(error.message);
    toast.success('Profile deleted');
    load();
  };

  const filtered = useMemo(() => users.filter(u => {
    if (filter === 'paid' && !u.isPaid) return false;
    if (filter === 'free' && u.isPaid) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.email?.toLowerCase().includes(q) && !u.full_name?.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [users, filter, search]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Users ({filtered.length})</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search email/name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border border-border rounded px-2 py-1 bg-background text-sm">
            <option value="all">All Users</option>
            <option value="paid">Paid Only</option>
            <option value="free">Free Only</option>
          </select>
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2">Name</th><th className="text-left py-2">Email</th>
                <th className="text-left py-2">Phone</th><th className="text-left py-2">Status</th>
                <th className="text-left py-2">Tier</th><th className="text-left py-2">Reports</th>
                <th className="text-left py-2">Total ₹</th>
                <th className="text-left py-2">Joined</th><th className="text-left py-2">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No users</td></tr> :
                  filtered.map(u => (
                    <tr key={u.id} className="border-b hover:bg-muted/50">
                      <td className="py-2">{u.full_name || 'N/A'}</td>
                      <td className="py-2">{u.email}</td>
                      <td className="py-2 text-xs">{u.phone_number || '-'}</td>
                      <td className="py-2"><Badge variant={u.isPaid ? 'default' : 'secondary'}>{u.isPaid ? 'Paid' : 'Free'}</Badge></td>
                      <td className="py-2">{u.topTier ? <Badge variant="outline" className="capitalize">{u.topTier}</Badge> : '-'}</td>
                      <td className="py-2 text-center">{u.reportCount ?? 0}</td>
                      <td className="py-2">₹{u.totalPaid ?? 0}</td>
                      <td className="py-2 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-2 flex gap-1">
                        {!u.isPaid && <Button size="sm" variant="outline" onClick={() => markPaid(u)} className="gap-1"><CheckCircle className="w-3 h-3" />Paid</Button>}
                        <Button size="sm" variant="ghost" onClick={() => deleteUser(u)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
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

export default UserManager;
