import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { MULANK_PSEO_DATA } from '@/lib/programmaticSeoData';
import { Sparkles, Star, Sun, ShieldCheck, ArrowRight, CheckCircle2, Heart, Gem, Compass } from 'lucide-react';
import { faqSchema, breadcrumbSchema } from '@/lib/jsonLd';

export default function MulankDetailPseoPage() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const numVal = parseInt(number || '1', 10);
  const data = MULANK_PSEO_DATA[numVal] || MULANK_PSEO_DATA[1];

  const canonicalUrl = `/numerology/mulank/${data.mulank}`;

  const schemas = [
    breadcrumbSchema([
      { name: 'Home', item: '/' },
      { name: 'Numerology Directory', item: '/reports' },
      { name: `Mulank ${data.mulank} Blueprint`, item: canonicalUrl },
    ]),
    faqSchema(data.faqs),
  ];

  return (
    <>
      <SEO
        title={data.title}
        description={data.summary}
        keywords={`mulank ${data.mulank}, mulank ${data.mulank} personality, ruling planet ${data.planet}, mulank ${data.mulank} remedies`}
        canonical={canonicalUrl}
        schema={schemas}
      />

      <div className="min-h-screen bg-[#07020f] text-gray-100 spiritual-pattern pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#07020f]/90 backdrop-blur border-b border-white/5 py-3.5 px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button size="sm" onClick={() => navigate('/form')} className="bg-primary hover:bg-primary/90 text-white text-xs">
              Calculate Free Mulank
            </Button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
          {/* Breadcrumbs */}
          <nav className="text-xs text-gray-400 flex items-center gap-2">
            <Link to="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <Link to="/reports" className="hover:text-amber-300">Numerology</Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold">Mulank {data.mulank}</span>
          </nav>

          {/* Hero Banner */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-primary/20 via-violet-900/30 to-amber-500/10 border border-amber-400/30 shadow-2xl relative overflow-hidden text-center sm:text-left">
            <div className="absolute top-4 right-6 opacity-20 hidden sm:block">
              <span className="font-display text-9xl font-extrabold text-amber-400">{data.mulank}</span>
            </div>

            <div className="relative z-10 space-y-4 max-w-2xl">
              <Badge className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs px-3 py-1 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 mr-1 inline animate-pulse" />
                Vedic & Pythagorean Blueprint
              </Badge>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Mulank {data.mulank} Numerology Guide
              </h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {data.summary}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" onClick={() => navigate('/form')} className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-sm rounded-2xl shadow-lg gap-2">
                  Get Full Personal Report <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Grid Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="glass-card-mystical border-white/10 text-center p-4">
              <span className="text-2xl block mb-1">🪐</span>
              <p className="text-xs text-gray-400 uppercase">Ruling Planet</p>
              <p className="font-bold text-amber-300 text-sm mt-0.5">{data.planet}</p>
            </Card>
            <Card className="glass-card-mystical border-white/10 text-center p-4">
              <span className="text-2xl block mb-1">🔥</span>
              <p className="text-xs text-gray-400 uppercase">Element</p>
              <p className="font-bold text-white text-sm mt-0.5">{data.element}</p>
            </Card>
            <Card className="glass-card-mystical border-white/10 text-center p-4">
              <span className="text-2xl block mb-1">👑</span>
              <p className="text-xs text-gray-400 uppercase">Deity</p>
              <p className="font-bold text-amber-300 text-sm mt-0.5">{data.deity}</p>
            </Card>
            <Card className="glass-card-mystical border-white/10 text-center p-4">
              <span className="text-2xl block mb-1">💎</span>
              <p className="text-xs text-gray-400 uppercase">Lucky Gemstone</p>
              <p className="font-bold text-emerald-400 text-sm mt-0.5">{data.luckyGems.join(', ')}</p>
            </Card>
          </div>

          {/* Personality & Career */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card-mystical border-white/10 p-6 space-y-4">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" /> Key Personality Traits
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {data.personalityTraits.map((trait, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="glass-card-mystical border-white/10 p-6 space-y-4">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" /> Best Career Paths
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {data.careerPaths.map((career, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{career}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Remedies Section */}
          <Card className="p-6 sm:p-8 border-amber-400/30 bg-amber-500/5 space-y-4 rounded-3xl">
            <h3 className="font-display text-2xl font-bold text-amber-400 flex items-center gap-2">
              <Gem className="w-6 h-6 text-amber-400" /> Vedic Remedies for Mulank {data.mulank}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              <b>Sacred Mantra & Practice:</b> {data.remedyText}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-xs text-gray-300">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <b>Lucky Days:</b> {data.luckyDays.join(', ')}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <b>Lucky Colors:</b> {data.luckyColors.join(', ')}
              </span>
            </div>
          </Card>

          {/* FAQs */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-white">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {data.faqs.map((faq, idx) => (
                <Card key={idx} className="glass-card-mystical border-white/10 p-4 space-y-1">
                  <h4 className="font-bold text-white text-sm">Q: {faq.q}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
