import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({ users: 0, paidUsers: 0, revenue: 0, todayRevenue: 0, conversion: 0 });
  const [series, setSeries] = useState<{ date: string; revenue: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [{ count: users }, { data: pays }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('amount,status,created_at,user_id'),
      ]);
      const success = (pays || []).filter((p: any) => p.status === 'success');
      const today = new Date().toISOString().slice(0, 10);
      const todayRev = success.filter((p: any) => p.created_at.startsWith(today)).reduce((s, p: any) => s + Number(p.amount || 0), 0);
      const totalRev = success.reduce((s, p: any) => s + Number(p.amount || 0), 0);
      const paidUsers = new Set(success.map((p: any) => p.user_id)).size;
      const conversion = users ? (paidUsers / users) * 100 : 0;

      // Last 14 days revenue
      const map: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        map[d.toISOString().slice(0, 10)] = 0;
      }
      success.forEach((p: any) => {
        const k = p.created_at.slice(0, 10);
        if (k in map) map[k] += Number(p.amount || 0);
      });
      setSeries(Object.entries(map).map(([date, revenue]) => ({ date: date.slice(5), revenue })));

      setStats({ users: users || 0, paidUsers, revenue: totalRev, todayRevenue: todayRev, conversion });
    })();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users },
    { label: 'Paid Users', value: stats.paidUsers, icon: Users },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign },
    { label: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: Calendar },
    { label: 'Conversion Rate', value: `${stats.conversion.toFixed(1)}%`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map(c => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-muted-foreground">{c.label}</p><p className="text-xl font-bold">{c.value}</p></div>
                <c.icon className="w-4 h-4 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Revenue (Last 14 days)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
