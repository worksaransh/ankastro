import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

// ============ TRUST STATS BAR (animated counters) ============
export const TrustStats = ({ items }: { items?: Array<{ value: string; label: string }> }) => {
  const stats = items && items.length ? items : [
    { value: '4.8', label: 'Rating' },
    { value: '50K+', label: 'Reports' },
    { value: '24hr', label: 'Delivery' },
    { value: '98%', label: 'Satisfaction' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
      {stats.map((s, i) => (
        <Card key={i} className="text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/15">
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ============ BEFORE / AFTER COMPARISON ============
interface BAProps {
  title?: string;
  before?: { name: string; planet: string; number: string; bars: Array<{ label: string; value: number }> };
  after?: { name: string; planet: string; number: string; bars: Array<{ label: string; value: number }> };
}
export const BeforeAfter = ({ title, before, after }: BAProps) => {
  const b = before || { name: 'RAHUL', planet: 'Saturn', number: '4', bars: [
    { label: 'Career', value: 42 }, { label: 'Wealth', value: 36 }, { label: 'Fame', value: 48 }, { label: 'Relations', value: 40 },
  ]};
  const a = after || { name: 'RAAHUL', planet: 'Sun', number: '1', bars: [
    { label: 'Career', value: 86 }, { label: 'Wealth', value: 79 }, { label: 'Fame', value: 92 }, { label: 'Relations', value: 83 },
  ]};
  const Side = ({ d, tone, badge }: { d: typeof b; tone: 'red' | 'green'; badge: string }) => (
    <Card className={tone === 'red' ? 'border-rose-300/40' : 'border-emerald-300/40'}>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${tone === 'red' ? 'bg-rose-500/15 text-rose-600' : 'bg-emerald-500/15 text-emerald-600'}`}>{badge}</span>
          <span className="text-xs text-muted-foreground">{d.number} · {d.planet}</span>
        </div>
        <div className="text-2xl font-bold tracking-wide mb-3">{d.name}</div>
        <div className="space-y-2">
          {d.bars.map((bar, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-0.5"><span className="text-muted-foreground">{bar.label}</span><span className={tone === 'red' ? 'text-rose-600' : 'text-emerald-600'}>{bar.value}%</span></div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${tone === 'red' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="my-10">
      {title && <h2 className="font-display text-2xl text-center mb-6">{title}</h2>}
      <div className="grid sm:grid-cols-2 gap-4 items-center">
        <Side d={b} tone="red" badge="Before" />
        <Side d={a} tone="green" badge="After" />
      </div>
    </div>
  );
};

// ============ CELEBRITY / IMAGE CAROUSEL ============
export const ImageCarousel = ({ title, subtitle, images }: { title?: string; subtitle?: string; images?: Array<{ url: string; name?: string }> }) => {
  const imgs = (images || []).filter((i) => i.url);
  const trackRef = useRef<HTMLDivElement>(null);
  if (imgs.length === 0) return null;
  return (
    <div className="my-10">
      {title && <h2 className="font-display text-2xl text-center mb-1">{title}</h2>}
      {subtitle && <p className="text-center text-muted-foreground text-sm mb-5">{subtitle}</p>}
      <div ref={trackRef} className="flex gap-3 overflow-x-auto pb-3 snap-x">
        {imgs.map((im, i) => (
          <div key={i} className="snap-center shrink-0 w-40">
            <img src={im.url} alt={im.name || ''} className="w-40 h-52 object-cover rounded-xl border border-border" loading="lazy" />
            {im.name && <p className="text-center text-sm mt-2 font-medium">{im.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ REPORT PREVIEW (multi-page) ============
export const ReportPreview = ({ title, subtitle, pages, insideItems }: { title?: string; subtitle?: string; pages?: string[]; insideItems?: string[] }) => {
  const imgs = (pages || []).filter(Boolean);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % imgs.length), 3500);
    return () => clearInterval(t);
  }, [imgs.length]);
  if (imgs.length === 0 && (!insideItems || insideItems.length === 0)) return null;
  return (
    <div className="my-10">
      {title && <h2 className="font-display text-2xl text-center mb-1">{title}</h2>}
      {subtitle && <p className="text-center text-muted-foreground text-sm mb-5">{subtitle}</p>}
      {imgs.length > 0 && (
        <div className="max-w-sm mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-border shadow-lg">
            <img src={imgs[idx]} alt={`Page ${idx + 1}`} className="w-full" loading="lazy" />
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-primary' : 'bg-muted'}`} aria-label={`Page ${i + 1}`} />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-1">Page {idx + 1} of {imgs.length}</p>
        </div>
      )}
      {insideItems && insideItems.length > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <p className="text-center text-sm font-medium mb-3">Report mein kya milega</p>
          <div className="flex flex-wrap justify-center gap-2">
            {insideItems.map((it, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">✓ {it}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
