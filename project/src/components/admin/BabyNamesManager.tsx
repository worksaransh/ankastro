import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { calculateNameVibration } from '@/lib/nameVibration';

interface BabyName {
  id?: string;
  name: string;
  gender: 'boy' | 'girl' | 'unisex';
  first_letter: string;
  name_root: number;
  ruling_planet: string;
  meaning: string;
  origin: string;
  language: string;
}

const RULING_PLANETS: Record<number, string> = {
  1: 'Sun',
  2: 'Moon',
  3: 'Jupiter',
  4: 'Rahu',
  5: 'Mercury',
  6: 'Venus',
  7: 'Ketu',
  8: 'Saturn',
  9: 'Mars',
};

const emptyName: BabyName = {
  name: '',
  gender: 'boy',
  first_letter: '',
  name_root: 1,
  ruling_planet: 'Sun',
  meaning: '',
  origin: 'Indian',
  language: 'hi',
};

export default function BabyNamesManager() {
  const [list, setList] = useState<BabyName[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<BabyName | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [rootFilter, setRootFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 15;

  const load = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('baby_names')
        .select('*', { count: 'exact' });

      // Apply search filters
      if (search.trim()) {
        query = query.or(`name.ilike.%${search.trim()}%,meaning.ilike.%${search.trim()}%`);
      }
      if (genderFilter !== 'all') {
        query = query.eq('gender', genderFilter);
      }
      if (rootFilter !== 'all') {
        query = query.eq('name_root', parseInt(rootFilter));
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query
        .order('name', { ascending: true })
        .range(from, to);

      if (error) throw error;

      setList((data || []) as BabyName[]);
      setTotalCount(count || 0);
    } catch (e: any) {
      toast.error('Failed to load baby names: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderFilter, rootFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleNameChange = (nameVal: string) => {
    if (!editing) return;
    const cleanName = nameVal.trim().replace(/[^a-zA-Z]/g, '');
    const firstLetter = cleanName.charAt(0).toUpperCase();
    
    // Chaldean root calculation
    let root = 1;
    let rulingPlanet = 'Sun';
    if (cleanName.length > 0) {
      try {
        const vibration = calculateNameVibration(cleanName);
        root = vibration.chaldeanRoot;
        rulingPlanet = RULING_PLANETS[root] || 'Sun';
      } catch (err) {
        console.error(err);
      }
    }

    setEditing({
      ...editing,
      name: nameVal,
      first_letter: firstLetter,
      name_root: root,
      ruling_planet: rulingPlanet,
    });
  };

  const save = async () => {
    if (!editing?.name.trim()) return toast.error('Name is required');
    if (!editing.meaning.trim()) return toast.error('Meaning is required');

    try {
      const { id, ...payload } = editing;
      const cleanPayload = {
        ...payload,
        name: payload.name.trim(),
        meaning: payload.meaning.trim(),
        first_letter: payload.first_letter || payload.name.trim().charAt(0).toUpperCase(),
      };

      const { error } = id
        ? await supabase.from('baby_names').update(cleanPayload).eq('id', id)
        : await supabase.from('baby_names').insert(cleanPayload);

      if (error) throw error;

      toast.success('Baby name saved successfully');
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this baby name?')) return;
    try {
      const { error } = await supabase.from('baby_names').delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted baby name');
      load();
    } catch (e: any) {
      toast.error('Failed to delete: ' + e.message);
    }
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  if (editing) {
    return (
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editing.id ? 'Edit Baby Name' : 'Add New Baby Name'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Name</label>
              <Input
                value={editing.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Aarav"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Gender</label>
              <select
                className="w-full h-10 border border-input rounded px-3 bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={editing.gender}
                onChange={(e) => setEditing({ ...editing, gender: e.target.value as any })}
              >
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-lg">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">First Letter</p>
              <p className="font-semibold text-sm">{editing.first_letter || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Chaldean Root</p>
              <p className="font-semibold text-sm text-primary">{editing.name_root || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Ruling Planet</p>
              <p className="font-semibold text-sm">{editing.ruling_planet || '—'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Meaning</label>
              <Input
                value={editing.meaning}
                onChange={(e) => setEditing({ ...editing, meaning: e.target.value })}
                placeholder="e.g. Peaceful, Wise"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Origin</label>
              <Input
                value={editing.origin}
                onChange={(e) => setEditing({ ...editing, origin: e.target.value })}
                placeholder="e.g. Indian"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Language Code</label>
              <select
                className="w-full h-10 border border-input rounded px-3 bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={editing.language}
                onChange={(e) => setEditing({ ...editing, language: e.target.value })}
              >
                <option value="hi">HI (Hindi/Sanskrit Origin)</option>
                <option value="en">EN (English/International)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} className="gap-1">
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Baby Names Directory</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Manage auspicious names seeded in your numerology engine database.</p>
        </div>
        <Button onClick={() => setEditing({ ...emptyName })} className="gap-1 shrink-0">
          <Plus className="w-4 h-4" /> Add Name
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search & Filters */}
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-2 items-center bg-muted/30 p-3 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search names or meanings..."
              className="pl-9 bg-background"
            />
          </div>
          <select
            value={genderFilter}
            onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }}
            className="h-10 border border-input rounded px-3 bg-background text-sm"
          >
            <option value="all">All Genders</option>
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
            <option value="unisex">Unisex</option>
          </select>
          <select
            value={rootFilter}
            onChange={(e) => { setRootFilter(e.target.value); setPage(1); }}
            className="h-10 border border-input rounded px-3 bg-background text-sm"
          >
            <option value="all">All Roots (1-9)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>Root {n}</option>
            ))}
          </select>
          <Button type="submit" size="sm" variant="secondary" className="gap-1">
            Search
          </Button>
        </form>

        {/* Name list */}
        {loading ? (
          <p className="text-center py-6 text-sm text-muted-foreground">Loading names...</p>
        ) : list.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No baby names found. Try adjusting filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground font-medium text-xs">
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Gender</th>
                  <th className="text-left py-2 px-3">Root</th>
                  <th className="text-left py-2 px-3">Planet</th>
                  <th className="text-left py-2 px-3">Meaning</th>
                  <th className="text-right py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((n) => (
                  <tr key={n.id} className="border-b hover:bg-muted/30">
                    <td className="py-2.5 px-3 font-semibold text-base">{n.name}</td>
                    <td className="py-2.5 px-3 capitalize">
                      <Badge variant={n.gender === 'boy' ? 'secondary' : n.gender === 'girl' ? 'outline' : 'default'} className="text-[10px]">
                        {n.gender}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-primary">{n.name_root}</td>
                    <td className="py-2.5 px-3 text-xs">{n.ruling_planet || RULING_PLANETS[n.name_root]}</td>
                    <td className="py-2.5 px-3 text-xs max-w-[200px] truncate" title={n.meaning}>{n.meaning}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(n)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(n.id!)}>
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} names
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs font-semibold px-2">Page {page} of {totalPages}</span>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
