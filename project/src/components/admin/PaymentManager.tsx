import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, RefreshCw } from 'lucide-react';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  cashfree_order_id: string;
  created_at: string;
}

const PaymentManager = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) toast.error(error.message);
    setPayments((data || []) as Payment[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markPaid = async (p: Payment) => {
    if (!confirm(`Mark order ${p.cashfree_order_id} as PAID and unlock report?`)) return;
    const { error } = await supabase.from('payments').update({ status: 'success', updated_at: new Date().toISOString() }).eq('id', p.id);
    if (error) return toast.error(error.message);
    toast.success('Payment marked as paid. Report unlocked.');
    load();
  };

  const filtered = useMemo(() => payments.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.cashfree_order_id?.toLowerCase().includes(search.toLowerCase()) && !p.user_id?.includes(search)) return false;
    return true;
  }), [payments, statusFilter, search]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Payments ({filtered.length})</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search order/user id..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-border rounded px-2 py-1 bg-background text-sm">
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button size="sm" variant="outline" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b">
                <th className="text-left py-2">Order ID</th><th className="text-left py-2">User</th>
                <th className="text-left py-2">Amount</th><th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date</th><th className="text-left py-2">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No payments</td></tr> :
                  filtered.map(p => (
                    <tr key={p.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 font-mono text-xs">{p.cashfree_order_id}</td>
                      <td className="py-2 font-mono text-xs">{p.user_id?.slice(0, 8)}...</td>
                      <td className="py-2">₹{p.amount}</td>
                      <td className="py-2"><Badge variant={p.status === 'success' ? 'default' : p.status === 'pending' ? 'secondary' : 'destructive'}>{p.status}</Badge></td>
                      <td className="py-2 text-muted-foreground">{new Date(p.created_at).toLocaleString()}</td>
                      <td className="py-2">
                        {p.status !== 'success' && (
                          <Button size="sm" variant="outline" onClick={() => markPaid(p)} className="gap-1">
                            <CheckCircle className="w-3 h-3" />Mark Paid
                          </Button>
                        )}
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

export default PaymentManager;
