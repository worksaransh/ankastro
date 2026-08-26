import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, X, Edit2 } from 'lucide-react';

interface SiteContent {
  id: string;
  key: string;
  value: string;
  content_type: string;
  language: string;
}

const SiteContentManager = () => {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [editing, setEditing] = useState<Partial<SiteContent> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('site_content').select('*').order('key');
    setItems((data || []) as SiteContent[]);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.key) { toast.error('Key is required'); return; }
    setSaving(true);
    try {
      if (editing.id) {
        const { error } = await supabase.from('site_content').update({ key: editing.key, value: editing.value, content_type: editing.content_type, language: editing.language }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_content').insert({ key: editing.key, value: editing.value || '', content_type: editing.content_type || 'text', language: editing.language || 'en' } as any);
        if (error) throw error;
      }
      toast.success('Content saved!');
      setEditing(null);
      await load();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this content?')) return;
    await supabase.from('site_content').delete().eq('id', id);
    toast.success('Deleted');
    load();
  };

  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editing.id ? 'Edit Content' : 'New Content'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="text-sm font-medium">Key *</label><Input value={editing.key || ''} onChange={(e) => setEditing({ ...editing, key: e.target.value })} placeholder="hero_title" /></div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground" value={editing.content_type || 'text'} onChange={(e) => setEditing({ ...editing, content_type: e.target.value })}>
                <option value="text">Text</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
                <option value="url">URL</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground" value={editing.language || 'en'} onChange={(e) => setEditing({ ...editing, language: e.target.value })}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>
          <div><label className="text-sm font-medium">Value</label><Textarea rows={6} value={editing.value || ''} onChange={(e) => setEditing({ ...editing, value: e.target.value })} /></div>
          <Button onClick={handleSave} disabled={saving} className="gap-2"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}</Button>
        </CardContent>
      </Card>
    );
  }

  const presets = [
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_cta', label: 'CTA Button Text', type: 'text' },
    { key: 'hero_premium_note', label: 'Premium Note', type: 'text' },
    { key: 'banner_text', label: 'Banner Text', type: 'text' },
    { key: 'banner_active', label: 'Banner Active (true/false)', type: 'text' },
    { key: 'banner_link', label: 'Banner Link', type: 'url' },
    { key: 'testimonial_1', label: 'Testimonial 1 (JSON)', type: 'json' },
    { key: 'testimonial_2', label: 'Testimonial 2 (JSON)', type: 'json' },
    { key: 'testimonial_3', label: 'Testimonial 3 (JSON)', type: 'json' },
    { key: 'feature_1', label: 'Feature Card 1 (JSON)', type: 'json' },
    { key: 'feature_2', label: 'Feature Card 2 (JSON)', type: 'json' },
    { key: 'feature_3', label: 'Feature Card 3 (JSON)', type: 'json' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle>Site Content</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Manage homepage hero, banners, testimonials, CTAs — all dynamic from DB.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground" onChange={(e) => {
            if (!e.target.value) return;
            const preset = presets.find(p => p.key === e.target.value);
            if (preset) setEditing({ key: preset.key, value: '', content_type: preset.type, language: 'en' });
            e.target.value = '';
          }}>
            <option value="">+ Add Preset...</option>
            {presets.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
          <Button size="sm" className="gap-1" onClick={() => setEditing({ key: '', value: '', content_type: 'text', language: 'en' })}><Plus className="w-4 h-4" />Custom</Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No dynamic content yet. Add homepage banners, hero text, testimonials, etc.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-primary">{item.key}</code>
                    <Badge variant="outline">{item.content_type}</Badge>
                    <Badge variant="secondary">{item.language}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{item.value.substring(0, 80)}{item.value.length > 80 ? '...' : ''}</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(item)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SiteContentManager;
