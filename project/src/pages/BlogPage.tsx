import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { BLOG_POSTS_50, BlogPostItem } from '@/content/blogPostsData';
import { ArrowLeft, Calendar, User, Search, BookOpen, Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';
import { useSEOSettings } from '@/hooks/useSEOSettings';

const CATEGORIES = ['All', 'Fundamentals', 'Vedic Numerology', 'Name Numerology', 'Love Compatibility', 'Wealth & Career', 'Remedies & Mantras'];

const BlogPage = () => {
  const { language } = useLanguage();
  const seo = useSEOSettings();
  const [allPosts, setAllPosts] = useState<BlogPostItem[]>(BLOG_POSTS_50);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (data && data.length > 0) {
          const dbFormatted: BlogPostItem[] = data.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            title: d.title,
            metaTitle: d.meta_title || d.title,
            metaDescription: d.meta_description || '',
            category: d.category || 'General',
            author: d.author || 'AnkJyotish',
            publishedAt: d.published_at ? d.published_at.split('T')[0] : '2026-07-20',
            readTime: '7 min read',
            heroImage: d.featured_image || 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
            summary: d.meta_description || '',
            content: d.content || '',
          }));

          // Merge without duplicate slugs
          const existingSlugs = new Set(dbFormatted.map((p) => p.slug));
          const filteredFallbacks = BLOG_POSTS_50.filter((p) => !existingSlugs.has(p.slug));
          setAllPosts([...dbFormatted, ...filteredFallbacks]);
        }
      } catch {
        /* fallback dataset used */
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = allPosts.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <SEO
        title={seo.getPageTitle('blog', '50+ Vedic Numerology Articles & Guides — AnkJyotish')}
        description={seo.getPageDesc('blog', 'Read 50+ expert guides on Vedic numerology, Chaldean vs Pythagorean numbers, Mulank vs Bhagyank, name corrections, and gemstones.')}
        ogImage={seo.getOgImage()}
        canonical="/blog"
      />

      <div className="min-h-screen bg-[#0d0714] text-white spiritual-pattern pb-16">
        <header className="sticky top-0 z-50 bg-[#0d0714]/90 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/"><Button variant="ghost" size="sm" className="text-gray-300"><ArrowLeft className="w-4 h-4 mr-1" />Home</Button></Link>
              <Logo size="md" />
            </div>
            <LanguageToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 px-3 py-1 text-xs">
              📚 Vedic Knowledge Library (50+ Articles)
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-white to-amber-400 bg-clip-text text-transparent">
              Vedic Numerology & Life Insights Blog
            </h1>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              Deep-dive guides on birth numbers, Chaldean name vibrations, relationship synergy, and planetary remedies.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search 50+ articles by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-white/5 border-white/15 text-white placeholder-gray-400 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                <Card className="bg-[#150f26] border-white/10 hover:border-amber-400/50 transition-all duration-300 overflow-hidden rounded-2xl h-full flex flex-col hover:shadow-xl hover:shadow-amber-500/10">
                  <div className="h-44 overflow-hidden relative bg-black/40">
                    <img
                      src={post.heroImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <Badge className="absolute top-2 left-2 bg-black/70 text-amber-300 border border-amber-500/30 text-[10px]">
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h2 className="font-display text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-3">
                      <span className="flex items-center gap-1"><User className="w-3 h-3 text-amber-400" />{post.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-500" />{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogPage;
