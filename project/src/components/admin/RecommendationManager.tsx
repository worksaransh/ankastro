import { useState, useEffect } from 'react';
import { RecommendationItem, FALLBACK_RECOMMENDATIONS } from '@/lib/recommendationHelper';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Gem, Plus, Edit3, Trash2, ExternalLink, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RecommendationManager() {
  const [items, setItems] = useState<RecommendationItem[]>(FALLBACK_RECOMMENDATIONS);
  const [loading, setLoading] = useState(false);

  // Edit Modal State
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<RecommendationItem> | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recommendation_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setItems(data as RecommendationItem[]);
      }
    } catch {
      /* fallback used */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: RecommendationItem) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem({
      category: 'gemstone',
      name: '',
      slug: '',
      short_description: '',
      associated_numbers: [1],
      image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      buy_link: '',
      price_display: '₹1,999',
      is_active: true,
      sort_order: items.length + 1,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem?.name || !editingItem?.buy_link) {
      toast.error('Name and Buy Link are required');
      return;
    }

    const slug = editingItem.slug || editingItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      ...editingItem,
      slug,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('recommendation_items').upsert(payload);
      if (error) throw error;
      toast.success('Recommendation item updated across all reports & tools!');
    } catch (e: any) {
      // Local state fallback update
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id === editingItem.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = { ...clone[idx], ...payload } as RecommendationItem;
          return clone;
        }
        return [...prev, { ...payload, id: `rec-${Date.now()}` } as RecommendationItem];
      });
      toast.success('Saved to local recommendation state');
    }

    setOpen(false);
    fetchItems();
  };

  const toggleActive = async (item: RecommendationItem) => {
    const nextState = !item.is_active;
    try {
      await supabase.from('recommendation_items').update({ is_active: nextState }).eq('id', item.id);
    } catch {
      /* ignore */
    }
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_active: nextState } : i));
    toast.success(`Item ${nextState ? 'Activated' : 'Deactivated'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/40 p-4 sm:p-6 rounded-2xl border border-border">
        <div>
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-400" />
            Affiliate & Product Recommendations Engine
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage gemstone, rudraksha, and yantra recommendation buy links. Editing a link here instantly updates it in PDF reports, tool results, mantras, and blogs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading} className="gap-1">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync
          </Button>
          <Button size="sm" onClick={handleAddNew} className="gap-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Associated Numbers</th>
                <th className="py-3 px-4">Buy Link</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-3">
                    <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-black/50 shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{item.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{item.slug}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="uppercase text-[10px] bg-primary/10 border-primary/20">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {item.associated_numbers.map((n) => (
                        <span key={n} className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] flex items-center justify-center">
                          {n}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate text-xs text-blue-400">
                    <a href={item.buy_link} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline truncate">
                      {item.buy_link} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0">
                      <Edit3 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-lg bg-[#110e21] border border-white/10 text-white p-5 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-display font-semibold flex items-center gap-2">
              <Gem className="w-5 h-5 text-amber-400" />
              {editingItem?.id ? 'Edit Recommendation Item' : 'Add Recommendation Item'}
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4 py-2 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#161326] px-3 py-2 text-sm text-white focus:outline-none"
                    value={editingItem.category || 'gemstone'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  >
                    <option value="gemstone">Gemstone</option>
                    <option value="rudraksha">Rudraksha</option>
                    <option value="yantra">Yantra</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Item Name *</Label>
                  <Input
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Ceylon Yellow Sapphire"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Affiliate Buy Link (Central URL) *</Label>
                <Input
                  value={editingItem.buy_link || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, buy_link: e.target.value })}
                  placeholder="https://amazon.in/dp/... or https://affiliate.link"
                  className="bg-white/5 border-white/10 focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <Label>Short Description</Label>
                <Input
                  value={editingItem.short_description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, short_description: e.target.value })}
                  placeholder="1-2 lines shown in report & tool results"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-1">
                <Label>Associated Mulank Numbers (1-9)</Label>
                <Input
                  value={(editingItem.associated_numbers || []).join(', ')}
                  onChange={(e) => {
                    const nums = e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 9);
                    setEditingItem({ ...editingItem, associated_numbers: nums });
                  }}
                  placeholder="e.g. 1, 3, 5"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-1">
                <Label>Product Image URL</Label>
                <Input
                  value={editingItem.image_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10">Cancel</Button>
            <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
