import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Sparkles } from 'lucide-react';

interface Remedy {
  id?: string;
  number: number;
  planet_en: string;
  planet_hi: string;
  color_en: string;
  color_hi: string;
  day_en: string;
  day_hi: string;
  gemstone_en: string;
  gemstone_hi: string;
  mantra: string;
  remedies_en: string[];
  remedies_hi: string[];
  remedies_hinglish: string[];
}

export default function RemediesManager() {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [selectedNum, setSelectedNum] = useState<number>(1);
  const [editing, setEditing] = useState<Remedy | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('remedies')
        .select('*')
        .order('number', { ascending: true });

      if (error) throw error;
      setRemedies((data || []) as Remedy[]);
    } catch (e: any) {
      toast.error('Failed to load remedies: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // When selected number changes or remedies load, set the editing item
  useEffect(() => {
    if (remedies.length > 0) {
      const current = remedies.find((r) => r.number === selectedNum);
      if (current) {
        setEditing({ ...current });
      }
    }
  }, [selectedNum, remedies]);

  const setField = (field: keyof Remedy, value: any) => {
    if (!editing) return;
    setEditing((p: any) => ({ ...p, [field]: value }));
  };

  const linesToArr = (text: string) =>
    text
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

  const arrToLines = (arr: string[] | undefined) =>
    Array.isArray(arr) ? arr.join('\n') : '';

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const { id, ...payload } = editing;
      const { error } = await supabase
        .from('remedies')
        .upsert({ ...payload, number: selectedNum }, { onConflict: 'number' });

      if (error) throw error;

      toast.success(`Remedies for Number ${selectedNum} saved successfully!`);
      load();
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remedies & Upay Manager</CardTitle>
        <CardDescription>
          Configure ruling planets, gemstones, mantras, colors, and daily remedies for numbers 1 to 9.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selector pills 1-9 */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const hasData = remedies.some((r) => r.number === n);
            return (
              <button
                key={n}
                onClick={() => setSelectedNum(n)}
                className={`w-10 h-10 rounded-full font-display font-semibold transition flex flex-col items-center justify-center relative ${
                  selectedNum === n
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/60 hover:bg-muted text-foreground'
                }`}
              >
                <span>{n}</span>
                {hasData && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {loading && !editing ? (
          <p className="text-center py-6 text-sm text-muted-foreground">Loading remedy details...</p>
        ) : !editing ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No remedies configured for this number. Start editing below.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <Sparkles className="w-5 h-5" /> Number {selectedNum} Configuration
            </div>

            {/* Planet & Mantra */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Ruling Planet (EN)</label>
                <Input
                  value={editing.planet_en || ''}
                  onChange={(e) => setField('planet_en', e.target.value)}
                  placeholder="e.g. Sun (Surya)"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Ruling Planet (HI)</label>
                <Input
                  value={editing.planet_hi || ''}
                  onChange={(e) => setField('planet_hi', e.target.value)}
                  placeholder="e.g. सूर्य"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Mantra</label>
                <Input
                  value={editing.mantra || ''}
                  onChange={(e) => setField('mantra', e.target.value)}
                  placeholder="e.g. Om Suryaya Namah"
                />
              </div>
            </div>

            {/* Day & Gemstone */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Lucky Day (EN)</label>
                <Input
                  value={editing.day_en || ''}
                  onChange={(e) => setField('day_en', e.target.value)}
                  placeholder="e.g. Sunday"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Lucky Day (HI)</label>
                <Input
                  value={editing.day_hi || ''}
                  onChange={(e) => setField('day_hi', e.target.value)}
                  placeholder="e.g. रविवार"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Gemstone (EN)</label>
                <Input
                  value={editing.gemstone_en || ''}
                  onChange={(e) => setField('gemstone_en', e.target.value)}
                  placeholder="e.g. Ruby"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Gemstone (HI)</label>
                <Input
                  value={editing.gemstone_hi || ''}
                  onChange={(e) => setField('gemstone_hi', e.target.value)}
                  placeholder="e.g. माणिक"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Lucky Colors (EN)</label>
                <Input
                  value={editing.color_en || ''}
                  onChange={(e) => setField('color_en', e.target.value)}
                  placeholder="e.g. Gold, Orange, Yellow"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Lucky Colors (HI)</label>
                <Input
                  value={editing.color_hi || ''}
                  onChange={(e) => setField('color_hi', e.target.value)}
                  placeholder="e.g. सुनहरा, नारंगी, पीला"
                />
              </div>
            </div>

            {/* Upays lists */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Daily Remedies (English) — One per line
                </label>
                <Textarea
                  rows={4}
                  value={arrToLines(editing.remedies_en)}
                  onChange={(e) => setField('remedies_en', linesToArr(e.target.value))}
                  placeholder="Offer water to the rising Sun&#13;Wear gold or copper"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Daily Remedies (Hindi) — One per line
                </label>
                <Textarea
                  rows={4}
                  value={arrToLines(editing.remedies_hi)}
                  onChange={(e) => setField('remedies_hi', linesToArr(e.target.value))}
                  placeholder="रोज़ सुबह सूर्य को जल दें&#13;तांबा या सोना पहनें"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Daily Remedies (Hinglish) — One per line
                </label>
                <Textarea
                  rows={4}
                  value={arrToLines(editing.remedies_hinglish)}
                  onChange={(e) => setField('remedies_hinglish', linesToArr(e.target.value))}
                  placeholder="Subah ugte surya ko jal do&#13;Tamba ya sona pehno"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={save} disabled={saving} className="gap-1">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Remedies'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
