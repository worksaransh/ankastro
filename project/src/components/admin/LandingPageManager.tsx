import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, Trash2, ChevronUp, ChevronDown, Save, RefreshCw, ExternalLink, ArrowLeft, Eye, EyeOff,
} from 'lucide-react';

interface LP {
  id: string; slug: string; title: string; subtitle: string | null;
  hero_image_url: string | null; meta_title: string | null; meta_description: string | null;
  tool_type: string | null; active: boolean; sort_order: number;
}
interface Block {
  id: string; page_id: string; type: string; content: any; position: number; active: boolean;
}

const BLOCK_TYPES = ['heading', 'paragraph', 'image', 'youtube', 'cta', 'faq', 'list', 'testimonial', 'trust_stats', 'before_after', 'carousel', 'report_preview'];

const emptyContent = (type: string): any => {
  switch (type) {
    case 'heading': return { text: 'New Heading', level: 2 };
    case 'paragraph': return { text: 'New paragraph text...' };
    case 'image': return { url: '', alt: '', caption: '' };
    case 'youtube': return { videoId: '', title: '' };
    case 'cta': return { label: 'Get Report', href: '/form', style: 'primary' };
    case 'faq': return { items: [{ q: 'Question?', a: 'Answer.' }] };
    case 'list': return { items: ['Item one', 'Item two'] };
    case 'testimonial': return { text: 'Great service!', author: 'Customer' };
    case 'trust_stats': return { items: [{ value: '4.8', label: 'Rating' }, { value: '50K+', label: 'Reports' }, { value: '24hr', label: 'Delivery' }, { value: '98%', label: 'Satisfaction' }] };
    case 'before_after': return { title: 'Naam sudhaar ke baad kya badalta hai?', before: { name: 'RAHUL', planet: 'Saturn', number: '4', bars: [{ label: 'Career', value: 42 }, { label: 'Wealth', value: 36 }, { label: 'Fame', value: 48 }, { label: 'Relations', value: 40 }] }, after: { name: 'RAAHUL', planet: 'Sun', number: '1', bars: [{ label: 'Career', value: 86 }, { label: 'Wealth', value: 79 }, { label: 'Fame', value: 92 }, { label: 'Relations', value: 83 }] } };
    case 'carousel': return { title: 'Celebrities jinhone naam badla', subtitle: '', images: [{ url: '', name: '' }] };
    case 'report_preview': return { title: 'Aapki report kaisi dikhti hai', subtitle: '', pages: [''], insideItems: ['Name number analysis', 'Lucky number & colour', 'Remedies'] };
    default: return {};
  }
};

const LandingPageManager = () => {
  const [pages, setPages] = useState<LP[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LP | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [savingPage, setSavingPage] = useState(false);

  const loadPages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('landing_pages').select('*').order('sort_order');
    if (error) toast.error('Load failed: ' + error.message);
    setPages((data || []) as LP[]);
    setLoading(false);
  };
  useEffect(() => { loadPages(); }, []);

  const openEditor = async (p: LP) => {
    setEditing(p);
    const { data } = await supabase.from('page_blocks').select('*').eq('page_id', p.id).order('position');
    setBlocks((data || []) as Block[]);
  };

  const createPage = async () => {
    const slug = prompt('Page slug (e.g. vehicle-numerology-report):')?.trim();
    if (!slug) return;
    const { data, error } = await supabase.from('landing_pages')
      .insert({ slug, title: slug.replace(/-/g, ' '), sort_order: pages.length + 1 })
      .select('*').single();
    if (error) { toast.error(error.message); return; }
    toast.success('Page created');
    await loadPages();
    openEditor(data as LP);
  };

  const savePage = async () => {
    if (!editing) return;
    setSavingPage(true);
    const { error } = await supabase.from('landing_pages').update({
      title: editing.title, subtitle: editing.subtitle, hero_image_url: editing.hero_image_url,
      meta_title: editing.meta_title, meta_description: editing.meta_description,
      tool_type: editing.tool_type, active: editing.active, sort_order: editing.sort_order,
      updated_at: new Date().toISOString(),
    }).eq('id', editing.id);
    setSavingPage(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Page saved');
    loadPages();
  };

  const deletePage = async (p: LP) => {
    if (!confirm(`Delete page "${p.slug}"? Iske saare blocks bhi delete honge.`)) return;
    const { error } = await supabase.from('landing_pages').delete().eq('id', p.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted'); setEditing(null); loadPages();
  };

  // ---- Blocks ----
  const addBlock = async (type: string) => {
    if (!editing) return;
    const { data, error } = await supabase.from('page_blocks')
      .insert({ page_id: editing.id, type, content: emptyContent(type), position: blocks.length + 1 })
      .select('*').single();
    if (error) { toast.error(error.message); return; }
    setBlocks((b) => [...b, data as Block]);
  };

  const updateBlockContent = (id: string, content: any) =>
    setBlocks((b) => b.map((x) => (x.id === id ? { ...x, content } : x)));

  const saveBlock = async (blk: Block) => {
    const { error } = await supabase.from('page_blocks')
      .update({ content: blk.content, active: blk.active, position: blk.position }).eq('id', blk.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Block saved');
  };

  const deleteBlock = async (id: string) => {
    if (!confirm('Delete this block?')) return;
    const { error } = await supabase.from('page_blocks').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    setBlocks((b) => b.filter((x) => x.id !== id));
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= blocks.length) return;
    const reordered = [...blocks];
    [reordered[idx], reordered[j]] = [reordered[j], reordered[idx]];
    const withPos = reordered.map((b, i) => ({ ...b, position: i + 1 }));
    setBlocks(withPos);
    await Promise.all(withPos.map((b) => supabase.from('page_blocks').update({ position: b.position }).eq('id', b.id)));
  };

  const toggleBlockActive = async (blk: Block) => {
    const next = !blk.active;
    setBlocks((b) => b.map((x) => (x.id === blk.id ? { ...x, active: next } : x)));
    await supabase.from('page_blocks').update({ active: next }).eq('id', blk.id);
  };

  // ============ EDITOR VIEW ============
  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setEditing(null); loadPages(); }}><ArrowLeft className="w-4 h-4" /></Button>
            <CardTitle className="text-base">Edit: {editing.slug}</CardTitle>
          </div>
          <a href={`/r/${editing.slug}`} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="w-3 h-3" /> Preview</Button>
          </a>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Page meta */}
          <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-lg bg-muted/30">
            <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>Subtitle</Label><Input value={editing.subtitle || ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></div>
            <div><Label>Hero Image URL</Label><Input value={editing.hero_image_url || ''} onChange={(e) => setEditing({ ...editing, hero_image_url: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Tool Type</Label><Input value={editing.tool_type || 'none'} onChange={(e) => setEditing({ ...editing, tool_type: e.target.value })} placeholder="name|vehicle|mobile|none" /></div>
            <div><Label>SEO Title</Label><Input value={editing.meta_title || ''} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} /></div>
            <div><Label>SEO Description</Label><Input value={editing.meta_description || ''} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} /></div>
            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4" />
              <Label className="!mb-0">Active (public)</Label>
            </div>
            <div className="flex items-end">
              <Button size="sm" onClick={savePage} disabled={savingPage} className="gap-1"><Save className="w-3 h-3" /> Save Page</Button>
            </div>
          </div>

          {/* Blocks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Content Blocks</h4>
              <div className="flex flex-wrap gap-1">
                {BLOCK_TYPES.map((t) => (
                  <Button key={t} size="sm" variant="outline" className="h-7 text-xs capitalize" onClick={() => addBlock(t)}>
                    <Plus className="w-3 h-3 mr-0.5" />{t}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {blocks.length === 0 && <p className="text-sm text-muted-foreground">Koi block nahi. Upar se add karo.</p>}
              {blocks.map((blk, idx) => (
                <div key={blk.id} className={`border rounded-lg p-3 ${blk.active ? '' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="capitalize">{blk.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(idx, -1)}><ChevronUp className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(idx, 1)}><ChevronDown className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleBlockActive(blk)}>{blk.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteBlock(blk.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <BlockEditor block={blk} onChange={(c) => updateBlockContent(blk.id, c)} />
                  <div className="mt-2 text-right">
                    <Button size="sm" onClick={() => saveBlock(blk)} className="gap-1 h-7"><Save className="w-3 h-3" /> Save Block</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ============ LIST VIEW ============
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Landing Pages</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={loadPages}><RefreshCw className="w-4 h-4" /></Button>
          <Button size="sm" onClick={createPage} className="gap-1"><Plus className="w-4 h-4" /> New Page</Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <p className="text-muted-foreground">Loading...</p> : pages.length === 0 ? (
          <p className="text-muted-foreground">No pages. Run 04_landing_pages.sql, ya "New Page" se banao.</p>
        ) : (
          <div className="space-y-2">
            {pages.map((p) => (
              <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{p.title}</span>
                    {!p.active && <Badge variant="secondary">hidden</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">/r/{p.slug}</span>
                </div>
                <div className="flex gap-2">
                  <a href={`/r/${p.slug}`} target="_blank" rel="noreferrer"><Button size="sm" variant="ghost"><ExternalLink className="w-4 h-4" /></Button></a>
                  <Button size="sm" variant="outline" onClick={() => openEditor(p)}>Edit</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deletePage(p)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ---- Per-type block editor ----
const BlockEditor = ({ block, onChange }: { block: Block; onChange: (c: any) => void }) => {
  const c = block.content || {};
  const set = (patch: any) => onChange({ ...c, ...patch });

  switch (block.type) {
    case 'heading':
      return (
        <div className="grid sm:grid-cols-4 gap-2">
          <Input className="sm:col-span-3" value={c.text || ''} onChange={(e) => set({ text: e.target.value })} placeholder="Heading text" />
          <Input type="number" value={c.level || 2} onChange={(e) => set({ level: Number(e.target.value) })} placeholder="Level 1-3" />
        </div>
      );
    case 'paragraph':
      return <Textarea value={c.text || ''} onChange={(e) => set({ text: e.target.value })} rows={3} placeholder="Paragraph text" />;
    case 'image':
      return (
        <div className="space-y-2">
          <Input value={c.url || ''} onChange={(e) => set({ url: e.target.value })} placeholder="Image URL (https://...)" />
          <div className="grid sm:grid-cols-2 gap-2">
            <Input value={c.alt || ''} onChange={(e) => set({ alt: e.target.value })} placeholder="Alt text" />
            <Input value={c.caption || ''} onChange={(e) => set({ caption: e.target.value })} placeholder="Caption" />
          </div>
          {c.url && <img src={c.url} alt="" className="h-20 rounded border object-cover" />}
        </div>
      );
    case 'youtube':
      return (
        <div className="space-y-2">
          <Input value={c.videoId || ''} onChange={(e) => set({ videoId: e.target.value })} placeholder="YouTube URL or video ID" />
          <Input value={c.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="Video title (optional)" />
        </div>
      );
    case 'cta':
      return (
        <div className="grid sm:grid-cols-3 gap-2">
          <Input value={c.label || ''} onChange={(e) => set({ label: e.target.value })} placeholder="Button label" />
          <Input value={c.href || ''} onChange={(e) => set({ href: e.target.value })} placeholder="/payment?tier=pro" />
          <Input value={c.style || 'primary'} onChange={(e) => set({ style: e.target.value })} placeholder="primary|secondary" />
        </div>
      );
    case 'list':
      return (
        <Textarea
          value={(c.items || []).join('\n')}
          onChange={(e) => set({ items: e.target.value.split('\n').filter(Boolean) })}
          rows={4} placeholder="Ek line = ek item"
        />
      );
    case 'testimonial':
      return (
        <div className="grid sm:grid-cols-3 gap-2">
          <Textarea className="sm:col-span-2" value={c.text || ''} onChange={(e) => set({ text: e.target.value })} rows={2} placeholder="Testimonial text" />
          <Input value={c.author || ''} onChange={(e) => set({ author: e.target.value })} placeholder="Author" />
        </div>
      );
    case 'faq':
      return (
        <div className="space-y-2">
          {(c.items || []).map((it: any, i: number) => (
            <div key={i} className="grid sm:grid-cols-2 gap-2">
              <Input value={it.q || ''} onChange={(e) => {
                const items = [...c.items]; items[i] = { ...items[i], q: e.target.value }; set({ items });
              }} placeholder="Question" />
              <div className="flex gap-1">
                <Input value={it.a || ''} onChange={(e) => {
                  const items = [...c.items]; items[i] = { ...items[i], a: e.target.value }; set({ items });
                }} placeholder="Answer" />
                <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive shrink-0" onClick={() => {
                  set({ items: c.items.filter((_: any, j: number) => j !== i) });
                }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" className="h-7" onClick={() => set({ items: [...(c.items || []), { q: '', a: '' }] })}>
            <Plus className="w-3 h-3 mr-1" /> Add Q&A
          </Button>
        </div>
      );
    case 'trust_stats':
      return (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Stats (value + label):</p>
          {(c.items || []).map((it: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Input value={it.value || ''} onChange={(e) => { const items = [...c.items]; items[i] = { ...items[i], value: e.target.value }; set({ items }); }} placeholder="4.8" />
              <div className="flex gap-1">
                <Input value={it.label || ''} onChange={(e) => { const items = [...c.items]; items[i] = { ...items[i], label: e.target.value }; set({ items }); }} placeholder="Rating" />
                <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive shrink-0" onClick={() => set({ items: c.items.filter((_: any, j: number) => j !== i) })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" className="h-7" onClick={() => set({ items: [...(c.items || []), { value: '', label: '' }] })}><Plus className="w-3 h-3 mr-1" /> Add stat</Button>
        </div>
      );
    case 'carousel':
      return (
        <div className="space-y-2">
          <Input value={c.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="Section title" />
          <Input value={c.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Subtitle (optional)" />
          <p className="text-xs text-muted-foreground">Images (URL + name):</p>
          {(c.images || []).map((im: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Input value={im.url || ''} onChange={(e) => { const images = [...c.images]; images[i] = { ...images[i], url: e.target.value }; set({ images }); }} placeholder="Image URL" />
              <div className="flex gap-1">
                <Input value={im.name || ''} onChange={(e) => { const images = [...c.images]; images[i] = { ...images[i], name: e.target.value }; set({ images }); }} placeholder="Name (optional)" />
                <Button size="icon" variant="ghost" className="h-9 w-9 text-destructive shrink-0" onClick={() => set({ images: c.images.filter((_: any, j: number) => j !== i) })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" className="h-7" onClick={() => set({ images: [...(c.images || []), { url: '', name: '' }] })}><Plus className="w-3 h-3 mr-1" /> Add image</Button>
        </div>
      );
    case 'report_preview':
      return (
        <div className="space-y-2">
          <Input value={c.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="Section title" />
          <Input value={c.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Subtitle (optional)" />
          <p className="text-xs text-muted-foreground">Report page image URLs (ek line = ek page):</p>
          <Textarea value={(c.pages || []).join('\n')} onChange={(e) => set({ pages: e.target.value.split('\n').filter(Boolean) })} rows={3} placeholder="https://...page1.jpg" />
          <p className="text-xs text-muted-foreground">"Kya milega" items (ek line = ek item):</p>
          <Textarea value={(c.insideItems || []).join('\n')} onChange={(e) => set({ insideItems: e.target.value.split('\n').filter(Boolean) })} rows={3} placeholder="Name number analysis" />
        </div>
      );
    case 'before_after':
      return (
        <div className="space-y-2">
          <Input value={c.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="Section title" />
          <p className="text-xs text-muted-foreground">Before/After ka detailed content fixed hai (RAHUL→RAAHUL example). Title yahan se badlein. Score bars seed/SQL se customize ho sakte hain.</p>
        </div>
      );
    default:
      return <p className="text-xs text-muted-foreground">No editor for type: {block.type}</p>;
  }
};

export default LandingPageManager;
