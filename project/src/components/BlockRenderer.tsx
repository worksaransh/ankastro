import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import type { PageBlock } from '@/hooks/useLandingPage';
import { TrustStats, BeforeAfter, ImageCarousel, ReportPreview } from '@/components/PremiumSections';

// Extract a YouTube video id from an id or any youtube url
const ytId = (raw: string): string => {
  if (!raw) return '';
  if (!raw.includes('http') && !raw.includes('/')) return raw.trim();
  const m = raw.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : raw.trim();
};

const BlockRenderer = ({ block }: { block: PageBlock }) => {
  const c = block.content || {};
  switch (block.type) {
    case 'heading': {
      const lvl = c.level || 2;
      const cls = lvl === 1
        ? 'font-display text-3xl md:text-4xl'
        : lvl === 3 ? 'font-display text-xl md:text-2xl' : 'font-display text-2xl md:text-3xl';
      return <h2 className={`${cls} text-foreground mt-8 mb-3`}>{c.text}</h2>;
    }
    case 'paragraph':
      return <p className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-wrap">{c.text}</p>;
    case 'list':
      return (
        <ul className="space-y-2 mb-4">
          {(c.items || []).map((it: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-foreground/90">
              <span className="text-primary mt-1">✦</span><span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case 'image':
      if (!c.url) return null;
      return (
        <figure className="my-6">
          <img src={c.url} alt={c.alt || ''} className="w-full rounded-xl border border-border" loading="lazy" />
          {c.caption && <figcaption className="text-xs text-muted-foreground text-center mt-2">{c.caption}</figcaption>}
        </figure>
      );
    case 'youtube': {
      const id = ytId(c.videoId || c.url || '');
      if (!id) return null;
      return (
        <div className="my-6">
          {c.title && <p className="font-medium mb-2">{c.title}</p>}
          <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${id}`}
              title={c.title || 'video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
    case 'faq':
      return (
        <Accordion type="single" collapsible className="my-6">
          {(c.items || []).map((it: any, i: number) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    case 'cta':
      return (
        <div className="my-8 text-center">
          <Link to={c.href || '/form'}>
            <Button size="lg" variant={c.style === 'secondary' ? 'outline' : 'default'}>
              {c.label || 'Get Started'}
            </Button>
          </Link>
        </div>
      );
    case 'testimonial':
      return (
        <Card className="my-4 bg-muted/30">
          <CardContent className="pt-6">
            <p className="italic text-foreground/90">“{c.text}”</p>
            {c.author && <p className="text-sm text-muted-foreground mt-2">— {c.author}</p>}
          </CardContent>
        </Card>
      );
    case 'trust_stats':
      return <TrustStats items={c.items} />;
    case 'before_after':
      return <BeforeAfter title={c.title} before={c.before} after={c.after} />;
    case 'carousel':
      return <ImageCarousel title={c.title} subtitle={c.subtitle} images={c.images} />;
    case 'report_preview':
      return <ReportPreview title={c.title} subtitle={c.subtitle} pages={c.pages} insideItems={c.insideItems} />;
    default:
      return null;
  }
};

export default BlockRenderer;
