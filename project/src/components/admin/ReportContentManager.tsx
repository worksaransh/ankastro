import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { REPORTS } from '@/content/reportContent';
import { extractContent } from '@/hooks/useReportContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MediaUpload from '@/components/admin/MediaUpload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, Download, Sparkles, Plus, Trash2 } from 'lucide-react';

const LANGS = [
  { k: 'hinglish', label: 'Hinglish' },
  { k: 'en', label: 'English' },
  { k: 'hi', label: 'हिंदी' },
];

export default function ReportContentManager() {
  const [reportKey, setReportKey] = useState(REPORTS[0].key);
  const [lang, setLang] = useState('hinglish');
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  const staticReport = REPORTS.find((r) => r.key === reportKey)!;

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('report_content')
        .select('content').eq('key', reportKey).eq('lang', lang).maybeSingle();
      if (data?.content && Object.keys(data.content).length) setContent(data.content);
      else setContent(extractContent(staticReport)); // fallback to static
    } catch {
      setContent(extractContent(staticReport));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [reportKey, lang]);

  const set = (field: string, value: any) => setContent((p: any) => ({ ...p, [field]: value }));
  const linesToArr = (t: string) => t.split('\n').map((x) => x.trim()).filter(Boolean);
  const arrToLines = (a: any) => (Array.isArray(a) ? a.join('\n') : '');

  const importStatic = () => { setContent(extractContent(staticReport)); toast.success('Static (Hinglish) content load ho gaya — ab Save karo'); };

  const aiTranslate = async () => {
    setTranslating(true);
    try {
      // translate from current Hinglish static base
      const src = extractContent(staticReport);
      const { data } = await supabase.functions.invoke('translate-report-content', {
        body: { content: src, targetLang: lang },
      });
      if (data?.ok && data.content) { setContent(data.content); toast.success('AI translation ready — review karke Save karo'); }
      else toast.error('AI translate fail: ' + (data?.error || 'try again'));
    } catch (e: any) { toast.error('AI translate error: ' + e.message); }
    finally { setTranslating(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('report_content')
        .upsert({ key: reportKey, lang, content, updated_at: new Date().toISOString() }, { onConflict: 'key,lang' });
      if (error) throw error;
      toast.success('Content saved!');
    } catch (e: any) { toast.error('Save failed: ' + e.message); }
    finally { setSaving(false); }
  };

  // FAQ / testimonial / step repeaters
  const faqs = content.faqs || [];
  const tms = content.testimonials || [];
  const steps = content.steps || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Content (CMS + 3 Language)</CardTitle>
        <p className="text-sm text-muted-foreground">Report + language chuno → edit karo. "AI Translate" se Hinglish se auto-translate ho jata hai. Empty rakho to static content dikhega.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* selectors */}
        <div className="flex flex-wrap gap-3 items-center">
          <select value={reportKey} onChange={(e) => setReportKey(e.target.value as any)} className="h-9 rounded-md border border-border bg-background px-2 text-sm">
            {REPORTS.map((r) => <option key={r.key} value={r.key}>{r.emoji} {r.key}</option>)}
          </select>
          <div className="flex gap-1">
            {LANGS.map((l) => (
              <button key={l.k} onClick={() => setLang(l.k)} className={`text-xs px-3 py-1.5 rounded ${lang === l.k ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{l.label}</button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={importStatic} className="gap-1"><Download className="w-3.5 h-3.5" /> Import static</Button>
          <Button size="sm" variant="outline" onClick={aiTranslate} disabled={translating} className="gap-1"><Sparkles className="w-3.5 h-3.5" /> {translating ? 'Translating…' : 'AI Translate'}</Button>
        </div>

        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <div className="space-y-3">
            <Field label="Title (H1)"><Input value={content.title || ''} onChange={(e) => set('title', e.target.value)} /></Field>
            <Field label="Subtitle"><Textarea rows={2} value={content.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} /></Field>
            <Field label="Badge"><Input value={content.badge || ''} onChange={(e) => set('badge', e.target.value)} /></Field>

            {/* Media: hero image + video */}
            <div className="border border-border rounded-lg p-3 bg-muted/30">
              <MediaUpload
                label="Hero Image (report landing page par dikhega)"
                value={content.heroImage}
                onChange={(url) => set('heroImage', url)}
                videoValue={content.heroVideo}
                onVideoChange={(url) => set('heroVideo', url)}
                bucket="media"
              />
            </div>

            <Field label="Pain headline"><Input value={content.painHeadline || ''} onChange={(e) => set('painHeadline', e.target.value)} /></Field>
            <Field label="Pains (ek line = ek point)"><Textarea rows={4} value={arrToLines(content.pains)} onChange={(e) => set('pains', linesToArr(e.target.value))} /></Field>

            <Field label="Promise headline"><Input value={content.promiseHeadline || ''} onChange={(e) => set('promiseHeadline', e.target.value)} /></Field>
            <Field label="Promise"><Textarea rows={3} value={content.promise || ''} onChange={(e) => set('promise', e.target.value)} /></Field>

            <Field label="Deliverables (ek line = ek point)"><Textarea rows={5} value={arrToLines(content.deliverables)} onChange={(e) => set('deliverables', linesToArr(e.target.value))} /></Field>

            <Field label="Why headline"><Input value={content.whyHeadline || ''} onChange={(e) => set('whyHeadline', e.target.value)} /></Field>
            <Field label="Why (ek line = ek point)"><Textarea rows={3} value={arrToLines(content.why)} onChange={(e) => set('why', linesToArr(e.target.value))} /></Field>

            <Field label="Final CTA"><Input value={content.finalCta || ''} onChange={(e) => set('finalCta', e.target.value)} /></Field>

            {/* Steps */}
            <Repeater title="Steps" items={steps} onAdd={() => set('steps', [...steps, { title: '', desc: '' }])}
              onDel={(i: number) => set('steps', steps.filter((_: any, x: number) => x !== i))}
              render={(s: any, i: number) => (<>
                <Input placeholder="Title" value={s.title || ''} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], title: e.target.value }; set('steps', a); }} />
                <Input placeholder="Desc" value={s.desc || ''} onChange={(e) => { const a = [...steps]; a[i] = { ...a[i], desc: e.target.value }; set('steps', a); }} />
              </>)} />

            {/* FAQs */}
            <Repeater title="FAQs" items={faqs} onAdd={() => set('faqs', [...faqs, { q: '', a: '' }])}
              onDel={(i: number) => set('faqs', faqs.filter((_: any, x: number) => x !== i))}
              render={(f: any, i: number) => (<>
                <Input placeholder="Question" value={f.q || ''} onChange={(e) => { const a = [...faqs]; a[i] = { ...a[i], q: e.target.value }; set('faqs', a); }} />
                <Textarea rows={2} placeholder="Answer" value={f.a || ''} onChange={(e) => { const a = [...faqs]; a[i] = { ...a[i], a: e.target.value }; set('faqs', a); }} />
              </>)} />

            {/* Testimonials */}
            <Repeater title="Testimonials" items={tms} onAdd={() => set('testimonials', [...tms, { name: '', city: '', text: '', stars: 5 }])}
              onDel={(i: number) => set('testimonials', tms.filter((_: any, x: number) => x !== i))}
              render={(t: any, i: number) => (<>
                <div className="flex gap-2">
                  <Input placeholder="Name" value={t.name || ''} onChange={(e) => { const a = [...tms]; a[i] = { ...a[i], name: e.target.value }; set('testimonials', a); }} />
                  <Input placeholder="City" value={t.city || ''} onChange={(e) => { const a = [...tms]; a[i] = { ...a[i], city: e.target.value }; set('testimonials', a); }} />
                  <Input type="number" placeholder="Stars" className="w-20" value={t.stars ?? 5} onChange={(e) => { const a = [...tms]; a[i] = { ...a[i], stars: Number(e.target.value) }; set('testimonials', a); }} />
                </div>
                <Textarea rows={2} placeholder="Text" value={t.text || ''} onChange={(e) => { const a = [...tms]; a[i] = { ...a[i], text: e.target.value }; set('testimonials', a); }} />
              </>)} />

            <div className="text-right pt-2">
              <Button onClick={save} disabled={saving} className="gap-1"><Save className="w-4 h-4" /> {saving ? 'Saving…' : `Save (${lang})`}</Button>
            </div>
            <p className="text-xs text-muted-foreground">Tip: Hinglish base hai. English/Hindi ke liye → wo language chuno → "AI Translate" → review → Save. beforeAfter chart static se aata hai.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs text-muted-foreground">{label}</label>{children}</div>;
}
function Repeater({ title, items, onAdd, onDel, render }: any) {
  return (
    <div className="border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{title}</span>
        <Button size="sm" variant="outline" onClick={onAdd} className="gap-1 h-7"><Plus className="w-3 h-3" /> Add</Button>
      </div>
      <div className="space-y-3">
        {items.map((it: any, i: number) => (
          <div key={i} className="space-y-1.5 border-b border-border/50 pb-2 last:border-0">
            {render(it, i)}
            <button onClick={() => onDel(i)} className="text-xs text-red-500 inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> remove</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground">Khali — "Add" ya "Import static".</p>}
      </div>
    </div>
  );
}
