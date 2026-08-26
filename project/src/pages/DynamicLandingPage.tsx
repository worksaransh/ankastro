import { useParams, Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { useLandingPage, useRelatedReports } from '@/hooks/useLandingPage';
import BlockRenderer from '@/components/BlockRenderer';

const DynamicLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { page, blocks, loading, notFound } = useLandingPage(slug);
  const related = useRelatedReports(page?.related_slugs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
            <Logo size="md" />
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-48 bg-muted rounded" />
          </div>
        )}

        {!loading && notFound && (
          <div className="text-center py-20">
            <h1 className="font-display text-2xl mb-3">Page not found</h1>
            <p className="text-muted-foreground mb-6">Ye page abhi available nahi hai.</p>
            <Link to="/"><Button>Home</Button></Link>
          </div>
        )}

        {!loading && page && (
          <>
            <SEO
              title={page.meta_title || page.title}
              description={page.meta_description || page.subtitle || ''}
              canonical={`/r/${page.slug}`}
            />
            {page.hero_image_url && (
              <img src={page.hero_image_url} alt={page.title} className="w-full rounded-2xl border border-border mb-6" loading="lazy" />
            )}

            {/* CRO hero */}
            {page.badge && <Badge className="mb-3">{page.badge}</Badge>}
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">{page.title}</h1>
            {page.subtitle && <p className="text-lg text-muted-foreground mb-4">{page.subtitle}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {!!page.rating && (
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(page.rating!) ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">{page.rating}{page.reviews_count ? ` (${page.reviews_count.toLocaleString()})` : ''}</span>
                </div>
              )}
              {!!page.price && (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">₹{page.price}</span>
                  {!!page.original_price && page.original_price > page.price && (
                    <span className="text-sm text-muted-foreground line-through">₹{page.original_price}</span>
                  )}
                </div>
              )}
            </div>

            <article>
              {blocks.map((b) => <BlockRenderer key={b.id} block={b} />)}
            </article>

            {/* Related reports — cross-linking */}
            {related.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <h3 className="font-display text-xl mb-4">Related Reports</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <Link key={r.slug} to={`/r/${r.slug}`}>
                      <Card className="hover:border-primary/50 transition h-full">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{r.title}</span>
                            {r.badge && <Badge variant="secondary" className="text-[10px]">{r.badge}</Badge>}
                          </div>
                          {r.subtitle && <p className="text-xs text-muted-foreground line-clamp-2">{r.subtitle}</p>}
                          {!!r.price && <p className="text-sm text-primary font-semibold mt-2">₹{r.price}</p>}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 text-center border-t border-border pt-8">
              <p className="text-muted-foreground mb-4">Apni poori personalised report chahiye?</p>
              <Link to="/form">
                <Button size="lg" className="gap-2">Get My Full Report <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DynamicLandingPage;
