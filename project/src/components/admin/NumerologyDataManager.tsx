import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, X, Upload, Sparkles, BookOpen, Crown, Tag, Baby, Gem } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BabyNamesManager from './BabyNamesManager';
import RemediesManager from './RemediesManager';

interface Meaning {
  id?: string;
  number: number;
  category: string;
  language: string;
  title: string;
  purpose: string;
  strengths: string[];
  challenges: string[];
  careers: string[];
  relationships?: string;
  health?: string;
  spiritual?: string;
}

const empty: Meaning = {
  number: 1, category: 'life_path', language: 'en', title: '', purpose: '',
  strengths: [], challenges: [], careers: [],
};

const NumerologyDataManager = () => {
  const [list, setList] = useState<Meaning[]>([]);
  const [editing, setEditing] = useState<Meaning | null>(null);
  const [catFilter, setCatFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');

  const load = async () => {
    const { data } = await supabase.from('number_meanings').select('*').order('number').limit(500);
    setList((data || []) as Meaning[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) return toast.error('Title required');
    const { id, ...payload } = editing;
    const { error } = id
      ? await supabase.from('number_meanings').update(payload).eq('id', id)
      : await supabase.from('number_meanings').insert(payload);
    if (error) return toast.error(error.message);
    toast.success('Saved'); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('number_meanings').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const handleCsv = async (file: File) => {
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const cols = line.split(',');
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = cols[i]?.trim() || '');
      obj.number = parseInt(obj.number);
      ['strengths', 'challenges', 'careers'].forEach(k => { obj[k] = obj[k] ? obj[k].split('|') : []; });
      return obj;
    });
    const { error } = await supabase.from('number_meanings').insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`Imported ${rows.length} rows`); load();
  };

  const filtered = useMemo(() => list.filter(m =>
    (catFilter === 'all' || m.category === catFilter) &&
    (langFilter === 'all' || m.language === langFilter)
  ), [list, catFilter, langFilter]);

  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editing.id ? 'Edit' : 'New'} Number Meaning</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div><label className="text-xs">Number</label><Input type="number" value={editing.number} onChange={e => setEditing({ ...editing, number: +e.target.value })} /></div>
            <div><label className="text-xs">Category</label>
              <select className="w-full border border-border rounded px-2 py-2 bg-background" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                <option value="life_path">Life Path</option><option value="mulank">Mulank</option><option value="bhagyank">Bhagyank</option><option value="name_vibration">Name Vibration</option><option value="mobile_vibration">Mobile Vibration</option><option value="business_vibration">Business Vibration</option>

                <option value="destiny">Destiny</option><option value="soul_urge">Soul Urge</option>
              </select>
            </div>
            <div><label className="text-xs">Language</label>
              <select className="w-full border border-border rounded px-2 py-2 bg-background" value={editing.language} onChange={e => setEditing({ ...editing, language: e.target.value })}>
                <option value="en">EN</option><option value="hi">HI</option><option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>
          <div><label className="text-xs">Title</label><Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
          <div><label className="text-xs">Purpose</label><textarea className="w-full border border-border rounded px-2 py-2 bg-background min-h-[60px]" value={editing.purpose} onChange={e => setEditing({ ...editing, purpose: e.target.value })} /></div>
          <div><label className="text-xs">Strengths (comma-separated)</label><Input value={editing.strengths.join(', ')} onChange={e => setEditing({ ...editing, strengths: e.target.value.split(',').map(s => s.trim()) })} /></div>
          <div><label className="text-xs">Challenges (comma-separated)</label><Input value={editing.challenges.join(', ')} onChange={e => setEditing({ ...editing, challenges: e.target.value.split(',').map(s => s.trim()) })} /></div>
          <div><label className="text-xs">Careers (comma-separated)</label><Input value={editing.careers.join(', ')} onChange={e => setEditing({ ...editing, careers: e.target.value.split(',').map(s => s.trim()) })} /></div>
          <div><label className="text-xs">Relationships</label><Input value={editing.relationships || ''} onChange={e => setEditing({ ...editing, relationships: e.target.value })} /></div>
          <div><label className="text-xs">Health</label><Input value={editing.health || ''} onChange={e => setEditing({ ...editing, health: e.target.value })} /></div>
          <div><label className="text-xs">Spiritual</label><Input value={editing.spiritual || ''} onChange={e => setEditing({ ...editing, spiritual: e.target.value })} /></div>
          <Button onClick={save} className="gap-2"><Save className="w-4 h-4" />Save</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="meanings" className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2 pb-2 border-b border-border">
        <TabsList>
          <TabsTrigger value="meanings" className="gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Number Meanings</span>
          </TabsTrigger>
          <TabsTrigger value="remedies" className="gap-1.5">
            <Gem className="w-4 h-4" />
            <span>Remedies & Upay</span>
          </TabsTrigger>
          <TabsTrigger value="baby_names" className="gap-1.5">
            <Baby className="w-4 h-4" />
            <span>Baby Names</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="meanings" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle>Numerology Data ({filtered.length})</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border border-border rounded px-2 py-1 bg-background text-sm">
                <option value="all">All Categories</option><option value="life_path">Life Path</option><option value="mulank">Mulank</option><option value="bhagyank">Bhagyank</option><option value="name_vibration">Name Vibration</option><option value="mobile_vibration">Mobile Vibration</option><option value="business_vibration">Business Vibration</option>
              </select>
              <select value={langFilter} onChange={e => setLangFilter(e.target.value)} className="border border-border rounded px-2 py-1 bg-background text-sm">
                <option value="all">All Languages</option><option value="en">EN</option><option value="hi">HI</option><option value="hinglish">Hinglish</option>
              </select>
              <label className="cursor-pointer">
                <input type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleCsv(e.target.files[0])} />
                <Button size="sm" variant="outline" className="gap-1" asChild><span><Upload className="w-4 h-4" />CSV</span></Button>
              </label>
              <Button size="sm" className="gap-1" onClick={() => setEditing({ ...empty })}><Plus className="w-4 h-4" />Add</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">CSV headers: number,category,language,title,purpose,strengths,challenges,careers (use | to separate array items)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2">#</th><th className="text-left py-2">Title</th>
                  <th className="text-left py-2">Category</th><th className="text-left py-2">Lang</th>
                  <th className="text-left py-2">Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 font-bold">{m.number}</td>
                      <td className="py-2">{m.title}</td>
                      <td className="py-2"><Badge variant="outline">{m.category}</Badge></td>
                      <td className="py-2 text-xs">{m.language}</td>
                      <td className="py-2 flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(m)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(m.id!)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="remedies">
        <RemediesManager />
      </TabsContent>

      <TabsContent value="baby_names">
        <BabyNamesManager />
      </TabsContent>
    </Tabs>
  );
};

export default NumerologyDataManager;
