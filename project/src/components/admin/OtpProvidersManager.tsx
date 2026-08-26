import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Send } from 'lucide-react';

type Provider = {
  id: string;
  name: string;
  display_name: string;
  enabled: boolean;
  priority: number;
  is_test: boolean;
  config: Record<string, any>;
};

const empty: Omit<Provider, 'id'> = {
  name: 'msg91', display_name: '', enabled: false, priority: 100, is_test: false, config: {},
};

export default function OtpProvidersManager() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [configText, setConfigText] = useState('{}');
  const [testPhone, setTestPhone] = useState('+91');

  const load = async () => {
    const { data } = await supabase.from('otp_providers' as any).select('*').order('priority');
    setProviders((data as any) || []);
    const { data: lg } = await supabase.from('otp_delivery_log' as any).select('*').order('created_at', { ascending: false }).limit(100);
    setLogs((lg as any) || []);
  };

  useEffect(() => { load(); }, []);

  const startEdit = (p: Provider | null) => {
    if (p) {
      setEditing(p);
      setForm(p);
      setConfigText(JSON.stringify(p.config, null, 2));
    } else {
      setEditing(null);
      setForm(empty);
      setConfigText('{}');
    }
    setOpen(true);
  };

  const save = async () => {
    let config: any = {};
    try { config = JSON.parse(configText); } catch { toast.error('Invalid JSON in config'); return; }
    const payload = { ...form, config };
    const res = editing
      ? await supabase.from('otp_providers' as any).update(payload).eq('id', editing.id)
      : await supabase.from('otp_providers' as any).insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success('Saved');
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this provider?')) return;
    const { error } = await supabase.from('otp_providers' as any).delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const sendTest = async (providerId: string) => {
    if (!/^\+[1-9]\d{7,14}$/.test(testPhone)) { toast.error('Enter test phone in E.164 (e.g. +9198…)'); return; }
    const { data, error } = await supabase.functions.invoke('test-otp-provider', { body: { provider_id: providerId, phone: testPhone } });
    if (error) { toast.error(error.message); return; }
    toast.success(`Test OTP queued via ${data?.tested_provider}`);
    load();
  };

  return (
    <Tabs defaultValue="providers" className="space-y-4">
      <TabsList>
        <TabsTrigger value="providers">Providers</TabsTrigger>
        <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="providers">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>OTP Providers</CardTitle>
            <div className="flex gap-2 items-center">
              <Input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+91…" className="w-40" />
              <Button onClick={() => startEdit(null)} size="sm" className="gap-1"><Plus className="w-4 h-4" />Add</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>Priority</TableHead><TableHead>Enabled</TableHead><TableHead>Test</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {providers.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.display_name || p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.name}</div>
                    </TableCell>
                    <TableCell>{p.priority}</TableCell>
                    <TableCell>{p.enabled ? <Badge>On</Badge> : <Badge variant="secondary">Off</Badge>}</TableCell>
                    <TableCell>{p.is_test ? <Badge variant="outline">Test</Badge> : '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => sendTest(p.id)}><Send className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {providers.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No providers configured. Add MSG91, Twilio, Fast2SMS, or Custom.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-3">
              Provider secrets (MSG91_AUTH_KEY, TWILIO_*, FAST2SMS_API_KEY) must be added under Supabase Edge Function Secrets before enabling.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logs">
        <Card>
          <CardHeader><CardTitle>Recent Delivery Attempts</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Time</TableHead><TableHead>Phone</TableHead><TableHead>Provider</TableHead><TableHead>Status</TableHead><TableHead>Detail</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs">{new Date(l.created_at).toLocaleString()}</TableCell>
                    <TableCell>{l.phone}</TableCell>
                    <TableCell>{l.provider}</TableCell>
                    <TableCell>{l.status === 'sent' ? <Badge>sent</Badge> : <Badge variant="destructive">{l.status}</Badge>}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.provider_message_id || l.error_message || '-'}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No deliveries yet.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} OTP Provider</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Provider Type</Label>
              <Select value={form.name} onValueChange={(v) => setForm({ ...form, name: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="fast2sms">Fast2SMS</SelectItem>
                  <SelectItem value="custom">Custom Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Display Name</Label><Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></div>
            <div><Label>Priority (lower = tried first)</Label><Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} /><Label>Enabled</Label></div>
            <div className="flex items-center gap-3"><Switch checked={form.is_test} onCheckedChange={(v) => setForm({ ...form, is_test: v })} /><Label>Test mode (don't actually send)</Label></div>
            <div>
              <Label>Config JSON</Label>
              <Textarea rows={6} value={configText} onChange={(e) => setConfigText(e.target.value)} placeholder='{"template_id":"...","sender_id":"..."}' />
              <p className="text-xs text-muted-foreground mt-1">Non-secret fields only. Secrets live in Supabase Edge Function Secrets.</p>
            </div>
          </div>
          <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
