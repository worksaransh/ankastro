import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, X } from 'lucide-react';

interface Person {
  id?: string;
  name: string;
  date_of_birth: string;
  profession: string;
  short_bio: string;
  mulank?: number | null;
  bhagyank?: number | null;
  life_path: number;
  destiny_number: number;
  soul_urge: number;
  personality_number: number;
  country: string;
  field: string;
  verified: boolean;
  language: string;
}

const empty: Person = {
  name: '', date_of_birth: '', profession: '', short_bio: '',
  life_path: 1, destiny_number: 1, soul_urge: 1, personality_number: 1,
  country: 'India', field: 'General', verified: true, language: 'en',
};

const FamousPersonsManager = () => {
  const [list, setList] = useState<Person[]>([]);
  const [editing, setEditing] = useState<Person | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const load = async () => {
    const { data } = await supabase.from('famous_persons').select('*').order('name').limit(500);
    setList((data || []) as Person[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name) return toast.error('Name required');
    const { id, ...payload } = editing;
    const { error } = id
      ? await supabase.from('famous_persons').update(payload).eq('id', id)
      : await supabase.from('famous_persons').insert(payload);
    if (error) return toast.error(error.message);
    toast.success('Saved'); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('famous_persons').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const filtered = useMemo(() => list.filter(p => filter === 'all' || String(p.life_path) === filter), [list, filter]);

  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editing.id ? 'Edit' : 'New'} Famous Person</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div><label className="text-xs">Name *</label><Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label className="text-xs">DOB (YYYY-MM-DD)</label><Input value={editing.date_of_birth} onChange={e => setEditing({ ...editing, date_of_birth: e.target.value })} /></div>
            <div><label className="text-xs">Profession</label><Input value={editing.profession} onChange={e => setEditing({ ...editing, profession: e.target.value })} /></div>
            <div><label className="text-xs">Field</label><Input value={editing.field} onChange={e => setEditing({ ...editing, field: e.target.value })} /></div>
            <div><label className="text-xs">Country</label><Input value={editing.country} onChange={e => setEditing({ ...editing, country: e.target.value })} /></div>
            <div><label className="text-xs">Language</label>
              <select className="w-full border border-border rounded px-2 py-2 bg-background" value={editing.language} onChange={e => setEditing({ ...editing, language: e.target.value })}>
                <option value="en">EN</option><option value="hi">HI</option><option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            <div><label className="text-xs">Life Path</label><Input type="number" value={editing.life_path} onChange={e => setEditing({ ...editing, life_path: +e.target.value })} /></div>
            <div><label className="text-xs">Destiny</label><Input type="number" value={editing.destiny_number} onChange={e => setEditing({ ...editing, destiny_number: +e.target.value })} /></div>
            <div><label className="text-xs">Mulank</label><Input type="number" value={editing.mulank || ''} onChange={e => setEditing({ ...editing, mulank: +e.target.value || null })} /></div>
            <div><label className="text-xs">Bhagyank</label><Input type="number" value={editing.bhagyank || ''} onChange={e => setEditing({ ...editing, bhagyank: +e.target.value || null })} /></div>
          </div>
          <div><label className="text-xs">Short Bio</label><textarea className="w-full border border-border rounded px-2 py-2 bg-background min-h-[80px]" value={editing.short_bio} onChange={e => setEditing({ ...editing, short_bio: e.target.value })} /></div>
          <Button onClick={save} className="gap-2"><Save className="w-4 h-4" />Save</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Famous Persons ({filtered.length})</CardTitle>
        <div className="flex gap-2">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-border rounded px-2 py-1 bg-background text-sm">
            <option value="all">All Life Paths</option>
            {[1,2,3,4,5,6,7,8,9,11,22,33].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <Button size="sm" className="gap-1" onClick={() => setEditing({ ...empty })}><Plus className="w-4 h-4" />Add</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b">
              <th className="text-left py-2">Name</th><th className="text-left py-2">Profession</th>
              <th className="text-left py-2">DOB</th><th className="text-left py-2">LP</th>
              <th className="text-left py-2">Lang</th><th className="text-left py-2">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 font-medium">{p.name}</td>
                  <td className="py-2 text-xs">{p.profession}</td>
                  <td className="py-2 text-xs">{p.date_of_birth}</td>
                  <td className="py-2"><Badge variant="outline">{p.life_path}</Badge></td>
                  <td className="py-2 text-xs">{p.language}</td>
                  <td className="py-2 flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(p.id!)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamousPersonsManager;
