import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogPost {
  slug: string;
  title: string;
  meta_description: string | null;
  category: string | null;
  published_at: string | null;
  featured_image: string | null;
}

const labels = {
  en: { eyebrow: 'From the Blog', title: 'Learn Numerology, One Read at a Time', cta: 'Read More', viewAll: 'View All Articles' },
  hi: { eyebrow: 'ब्लॉग से', title: 'अंकशास्त्र सीखें, एक लेख से शुरू करें', cta: 'पढ़ें', viewAll: 'सभी लेख देखें' },
  hinglish: { eyebrow: 'Blog Se', title: 'Numerology Seekhein, Ek Article Se Shuru Karein', cta: 'Padhein', viewAll: 'Sabhi Articles Dekhein' },
} as const;

export const BlogPreview = () => {
  const { language } = useLanguage();
  const L = labels[language as keyof typeof labels] || labels.en;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('slug, title, meta_description, category, published_at, featured_image')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      setPosts((data || []) as BlogPost[]);
      setLoading(false);
    })();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 px-2">
      <div className="text-center mb-6 sm:mb-8">
        <Badge variant="secondary" className="mb-3 gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {L.eyebrow}
        </Badge>
        <h2 className="font-display text-2xl sm:text-3xl text-primary">{L.title}</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
            <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-primary/10">
              {post.featured_image && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                  <img src={post.featured_image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <CardContent className="p-4 sm:p-5">
                {post.category && (
                  <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wide">
                    {post.category}
                  </Badge>
                )}
                <h3 className="font-display text-base sm:text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                {post.meta_description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.meta_description}</p>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {L.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link to="/blog">
          <Button variant="outline" size="lg" className="gap-2">
            {L.viewAll} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default BlogPreview;
