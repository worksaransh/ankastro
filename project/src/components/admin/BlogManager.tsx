import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Eye, Edit2, X, Upload, Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  featured_image: string | null;
  content: string;
  category: string | null;
  tags: string[];
  author: string | null;
  status: string;
  language: string;
  published_at: string | null;
  created_at: string;
}

const emptyPost: Omit<BlogPost, 'id' | 'created_at'> = {
  title: '', slug: '', meta_title: '', meta_description: '', keywords: [],
  featured_image: '', content: '', category: 'general', tags: [], author: 'Ankjyotish',
  status: 'draft', language: 'en', published_at: null,
};

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterLang, setFilterLang] = useState<string>('all');

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('blog-images').upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(path);
      setEditing((prev) => prev ? { ...prev, featured_image: publicUrl } : prev);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const loadPosts = async () => {
    let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (filterLang !== 'all') query = query.eq('language', filterLang);
    const { data } = await query;
    setPosts((data || []) as BlogPost[]);
  };

  useEffect(() => { loadPosts(); }, [filterLang]);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    if (!editing || !editing.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const slug = editing.slug || generateSlug(editing.title);
      const payload = { ...editing, slug, published_at: editing.status === 'published' ? editing.published_at || new Date().toISOString() : editing.published_at };

      if (editing.id) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload as any);
        if (error) throw error;
      }
      toast.success('Blog post saved!');
      setEditing(null);
      await loadPosts();
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Post deleted');
    loadPosts();
  };

  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{editing.id ? 'Edit Post' : 'New Post'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Title *</label><Input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: generateSlug(e.target.value) })} /></div>
            <div><label className="text-sm font-medium">Slug</label><Input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Meta Title</label><Input value={editing.meta_title || ''} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Category</label><Input value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
          </div>
          <div><label className="text-sm font-medium">Meta Description</label><Textarea rows={2} value={editing.meta_description || ''} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} /></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Keywords (comma-separated)</label><Input value={editing.keywords?.join(', ') || ''} onChange={(e) => setEditing({ ...editing, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></div>
            <div><label className="text-sm font-medium">Tags (comma-separated)</label><Input value={editing.tags?.join(', ') || ''} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Image URL or upload below"
                value={editing.featured_image || ''}
                onChange={(e) => setEditing({ ...editing, featured_image: e.target.value })}
              />
              <label className="inline-flex">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ''; }}
                />
                <Button type="button" variant="outline" disabled={uploading} className="gap-2 cursor-pointer" asChild>
                  <span>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Uploading...' : 'Upload'}
                  </span>
                </Button>
              </label>
            </div>
            {editing.featured_image && (
              <img src={editing.featured_image} alt="Featured" className="mt-2 max-h-40 rounded-lg border border-border object-cover" />
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Author</label><Input value={editing.author || ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <select className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground" value={editing.language || 'en'} onChange={(e) => setEditing({ ...editing, language: e.target.value })}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>
          <div><label className="text-sm font-medium">Content (Markdown supported)</label><Textarea rows={12} value={editing.content || ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
          <div className="flex items-center gap-4">
            <select
              className="border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              value={editing.status || 'draft'}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Blog Posts ({posts.length})</CardTitle>
        <div className="flex items-center gap-2">
          <select className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground" value={filterLang} onChange={(e) => setFilterLang(e.target.value)}>
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
          <Button size="sm" className="gap-1" onClick={() => setEditing({ ...emptyPost })}><Plus className="w-4 h-4" />New Post</Button>
        </div>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No blog posts yet. Create your first one!</p>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{post.title}</p>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">/blog/{post.slug} • {post.category}</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {post.status === 'published' && (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setEditing(post)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogManager;
