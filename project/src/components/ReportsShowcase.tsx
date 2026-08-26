import { Link, useNavigate } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import { rt } from '@/content/reportContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';

// Homepage grid of PAID reports -> price + direct Buy + Details.
// Static (no DB dependency) so prices stay consistent and it always renders.
export default function ReportsShowcase() {
  const navigate = useNavigate();
  const { reports } = useReports();
  const { language } = useLanguage();
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl mb-3">{language === 'hi' ? 'पर्सनलाइज़्ड न्यूमेरोलॉजी रिपोर्ट्स' : language === 'en' ? 'Personalised Numerology Reports' : 'Personalised Numerology Reports'}</h2>
        <p className="text-muted-foreground">{language === 'hi' ? 'हर रिपोर्ट अलग — अपना सवाल चुनें, ₹199 से शुरू' : language === 'en' ? 'Each report is unique — pick your question, from ₹199' : 'Har report alag — apna sawaal chuno, ₹199 se shuru'}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((r) => {
          const off = Math.round(((r.originalPrice - r.price) / r.originalPrice) * 100);
          return (
            <Card key={r.slug} className="h-full border-border/60 hover:border-gold/50 transition-all hover:shadow-lg flex flex-col">
              <CardContent className="pt-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{r.emoji}</span>
                  {r.badge && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">{rt(r,'badge',language)}</span>}
                </div>
                <p className="font-display text-lg mb-1 leading-snug">{rt(r,'title',language).split('—')[0].trim()}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{rt(r,'subtitle',language)}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gold">₹{r.price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{r.originalPrice}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500">{off}% OFF</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="w-3.5 h-3.5 fill-gold text-gold" />{r.rating}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="mystical" className="flex-1" onClick={() => navigate(`/buy/${r.slug}`)}>Buy ₹{r.price}</Button>
                  <Link to={`/report/${r.slug}`} className="shrink-0">
                    <Button variant="outline" className="gap-1">
                      {language === 'hi' ? 'विवरण' : language === 'en' ? 'Details' : 'Details'} <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="text-center mt-8">
        <Link to="/reports">
          <Button variant="ghost" className="gap-1">
            {language === 'hi' ? 'सभी रिपोर्ट्स देखें' : language === 'en' ? 'View All Reports' : 'Saari reports dekho'} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
