import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import NumberDisplay from '@/components/NumberDisplay';
import ReportSection from '@/components/ReportSection';
import { 
  Sparkles, Star, Compass, Gem, Heart, Calendar, Lock, 
  ArrowRight, CheckCircle2, TrendingUp, Brain, Zap 
} from 'lucide-react';
import { numberMeanings } from '@/lib/numerology';
import SEO from '@/components/SEO';
import { useSEOSettings } from '@/hooks/useSEOSettings';

// Sample data for preview
const sampleProfile = {
  lifePath: 7,
  destiny: 3,
  soulUrge: 5,
  personality: 9,
  birthday: 4,
  maturity: 1,
  attitude: 8,
  personalYear: 6,
};

const SampleReportPage = () => {
  const lifePathMeaning = numberMeanings[sampleProfile.lifePath];
  const destinyMeaning = numberMeanings[sampleProfile.destiny];
  const seo = useSEOSettings();

  return (
    <div className="min-h-screen py-8 px-4 relative bg-background">
      <SEO
        title={seo.getPageTitle('sample', 'Sample Numerology Report - Ankjyotish')}
        description={seo.getPageDesc('sample', 'Preview a sample Ankjyotish numerology report — see what your personalized Vedic report includes.')}
        ogImage={seo.getOgImage()}
        canonical="/sample-report"
      />
      <div className="absolute inset-0 stars-bg opacity-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-4 flex justify-center">
            <Logo size="lg" />
          </div>
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            📋 Sample Report Preview
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">
            See What Your Blueprint Reveals
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This is a sample of the full 100+ page numerology report. 
            Get your personalized version with exact numbers for ₹499.
          </p>
        </div>

        {/* Sample Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <NumberDisplay number={sampleProfile.lifePath} label="Life Path" highlight />
          <NumberDisplay number={sampleProfile.destiny} label="Destiny" />
          <NumberDisplay number={sampleProfile.soulUrge} label="Soul Urge" />
          <NumberDisplay number={sampleProfile.personality} label="Personality" />
        </div>

        {/* Sample Life Purpose Section */}
        <ReportSection
          icon={Compass}
          title="Your Life Purpose"
          subtitle={`Life Path ${sampleProfile.lifePath}: ${lifePathMeaning.title}`}
        >
          <p className="text-foreground/90 leading-relaxed mb-4">
            {lifePathMeaning.purpose}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-primary text-sm font-medium mb-2">Your Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {lifePathMeaning.strengths.map((s) => (
                  <span key={s} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-primary text-sm font-medium mb-2">Growth Areas</h4>
              <div className="flex flex-wrap gap-2">
                {lifePathMeaning.challenges.map((c) => (
                  <span key={c} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </ReportSection>

        {/* Destiny Preview */}
        <ReportSection
          icon={Gem}
          title="Talents & Destiny"
          subtitle={`Destiny ${sampleProfile.destiny}: ${destinyMeaning.title}`}
        >
          <p className="text-foreground/90 leading-relaxed mb-4">
            {destinyMeaning.purpose.slice(0, 200)}...
          </p>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
            <div className="blur-sm opacity-50 pointer-events-none">
              <h4 className="text-primary text-sm font-medium mb-2">Career Paths</h4>
              <div className="flex flex-wrap gap-2">
                {destinyMeaning.careers.map((c) => (
                  <span key={c} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </ReportSection>

        {/* Locked Sections Preview */}
        <div className="space-y-4 mb-8">
          {[
            { icon: Heart, title: 'Emotional World & Soul Urge', desc: 'Deep dive into your heart\'s desires' },
            { icon: Brain, title: 'Vedic Numerology (Mulank & Bhagyank)', desc: 'Ancient Indian wisdom applied to your chart' },
            { icon: Calendar, title: '12-Month Predictions', desc: 'Month-by-month guidance for the year ahead' },
            { icon: TrendingUp, title: '10-Year Life Forecast', desc: 'Long-term cycles and turning points' },
            { icon: Zap, title: 'Karmic Debts & Pinnacles', desc: 'Past-life patterns and major life phases' },
            { icon: Star, title: 'Loshu Grid Analysis', desc: 'Missing numbers and hidden strengths' },
          ].map((section) => (
            <Card key={section.title} className="border-dashed border-muted-foreground/30 opacity-70">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground/80">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.desc}</p>
                </div>
                <Lock className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-12 space-y-6">
          <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="font-display text-2xl text-primary mb-2">
              Get Your Complete Blueprint
            </h2>
            <p className="text-muted-foreground mb-4">
              100+ pages • Personalized to YOUR exact numbers • PDF download included
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm">
              {['Core Numbers', 'Vedic Analysis', 'Life Cycles', 'Predictions', 'Compatibility', 'Remedies'].map((f) => (
                <span key={f} className="flex items-center gap-1 text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {f}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/form">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Sparkles className="w-5 h-5" />
                  Get My Report — ₹499
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleReportPage;
