import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { supabase } from '@/integrations/supabase/client';
import { BLOG_POSTS_50, BlogPostItem } from '@/content/blogPostsData';
import { getRecommendationBySlug, RecommendationItem } from '@/lib/recommendationHelper';
import RecommendationCard from '@/components/RecommendationCard';
import { ArrowLeft, Calendar, User, Clock, Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (data) {
          const pItem: BlogPostItem = {
            id: data.id,
            slug: data.slug,
            title: data.title,
            metaTitle: data.meta_title || data.title,
            metaDescription: data.meta_description || '',
            category: data.category || 'General',
            author: data.author || 'AnkJyotish',
            publishedAt: data.published_at ? data.published_at.split('T')[0] : '2026-07-20',
            readTime: '7 min read',
            heroImage: data.featured_image || 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
            summary: data.meta_description || '',
            content: data.content || '',
            embeddedRecommendationSlug: data.embedded_recommendation_slug || 'ceylon-yellow-sapphire-pukhraj',
          };
          setPost(pItem);
        } else {
          const fallback = BLOG_POSTS_50.find((b) => b.slug === slug) || null;
          setPost(fallback);
        }
      } catch {
        const fallback = BLOG_POSTS_50.find((b) => b.slug === slug) || null;
        setPost(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post?.embeddedRecommendationSlug) {
      getRecommendationBySlug(post.embeddedRecommendationSlug).then(setRecommendation);
    }
  }, [post]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground text-lg">Post not found</p>
        <Link to="/blog"><Button variant="ghost">← Back to Blog</Button></Link>
      </div>
    );
  }

  const wordCount = post.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta_title || post.title,
    description: post.meta_description || '',
    author: { '@type': 'Person', name: post.author || 'Ankjyotish' },
    datePublished: post.published_at,
    image: post.featured_image || undefined,
    publisher: { '@type': 'Organization', name: 'Ankjyotish' },
    wordCount,
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-6 mb-2 text-foreground">{line.slice(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-3 text-foreground">{line.slice(3)}</h2>;
        if (line.startsWith('# ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-3 text-foreground">{line.slice(2)}</h2>;
        if (line.startsWith('- ')) return <li key={i} className="ml-6 text-foreground/90">{line.slice(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="text-foreground/90 leading-relaxed mb-3">{line}</p>;
      });
  };

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || `${post.title} — Ankjyotish numerology blog.`}
        keywords={post.keywords?.join(', ')}
        ogImage={post.featured_image || undefined}
        ogImageAlt={post.title}
        ogType="article"
        canonical={`/blog/${post.slug}`}
        article={{
          publishedTime: post.published_at || undefined,
          author: post.author || 'Ankjyotish',
          section: post.category || undefined,
          tags: post.keywords || [],
        }}
        schema={[
          jsonLd,
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ankjyotishai.com/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ankjyotishai.com/blog' },
              { '@type': 'ListItem', position: 3, name: post.title, item: `https://ankjyotishai.com/blog/${post.slug}` },
            ],
          },
        ]}
      />

      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/blog"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Blog</Button></Link>
              <Logo size="md" />
            </div>
            <LanguageToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {post.featured_image && (
            <img src={post.featured_image} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded-xl mb-6" />
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
            {post.tags?.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 border-b border-border pb-4 flex-wrap">
            {post.author && <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>}
            {post.published_at && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.published_at).toLocaleDateString()}</span>}
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readingMinutes} min read</span>
          </div>

          <article className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </article>

          {recommendation && (
            <div className="mt-10 p-6 rounded-2xl bg-[#150f26] border border-amber-400/30 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Recommended Remedial Gemstone / Yantra
              </h4>
              <RecommendationCard item={recommendation} sourcePage={`blog_${post.slug}`} />
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-border">
            <Link to="/blog"><Button variant="ghost">← Back to all posts</Button></Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogPostPage;
