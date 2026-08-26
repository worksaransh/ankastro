import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { ArrowLeft, Shield, Zap, FileText, Mail, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

const AboutPage = () => {
  return (
    <>
      <SEO
        title="About Us — Sangeeta Creations | Ankjyotish AI"
        description="Sangeeta Creations is a registered proprietorship based in Delhi, India, offering digital numerology and astrology reports through Ankjyotish AI."
        canonical="/about"
      />
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Logo size="md" />
            </div>
            <LanguageToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-foreground mb-6">About Us</h1>

          <section className="mb-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              <strong className="text-foreground">Sangeeta Creations</strong> is a registered proprietorship firm based in Delhi, India. We provide digital numerology and astrology services through our platform <strong className="text-foreground">Ankjyotish AI</strong>. Our goal is to help individuals understand their life path, personality, and future insights using numerology-based analysis.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Business Information</h2>
            <Card className="card-divine">
              <CardContent className="pt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-primary" /><span><strong className="text-foreground">Business Name:</strong> Sangeeta Creations</span></div>
                <div className="flex items-center gap-3"><User className="w-4 h-4 text-primary" /><span><strong className="text-foreground">Owner:</strong> Rajesh Gulati</span></div>
                <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-primary" /><span><strong className="text-foreground">Business Type:</strong> Proprietorship</span></div>
                <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-primary" /><span><strong className="text-foreground">Nature of Business:</strong> Digital services (Numerology & Astrology reports)</span></div>
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /><span><strong className="text-foreground">Location:</strong> Delhi, India</span></div>
                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /><span><strong className="text-foreground">Email:</strong> <a className="text-primary hover:underline" href="mailto:care@ankjyotishai.com">care@ankjyotishai.com</a></span></div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
            <p className="text-muted-foreground">
              Our platform provides personalized numerology reports based on user inputs such as date of birth and name. These reports are generated digitally and delivered instantly to the user's account and email.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Why Choose Us</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Card><CardContent className="pt-6 text-center"><Shield className="w-6 h-6 text-primary mx-auto mb-2" /><p className="font-semibold text-foreground">Secure Payment</p><p className="text-xs text-muted-foreground mt-1">Powered by Cashfree</p></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><FileText className="w-6 h-6 text-primary mx-auto mb-2" /><p className="font-semibold text-foreground">Digital Product</p><p className="text-xs text-muted-foreground mt-1">PDF + Web report</p></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><Zap className="w-6 h-6 text-primary mx-auto mb-2" /><p className="font-semibold text-foreground">Instant Delivery</p><p className="text-xs text-muted-foreground mt-1">Generated in seconds</p></CardContent></Card>
            </div>
          </section>

          <section className="mb-8">
            <p className="text-xs text-muted-foreground italic">
              Disclaimer: Ankjyotish AI provides guidance based on numerology and astrology principles for self-reflection and informational purposes only. We do not guarantee specific outcomes or future events.
            </p>
          </section>
        </main>

        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Sangeeta Creations</p>
            <p>© {new Date().getFullYear()} All Rights Reserved</p>
            <p>Contact: <a href="mailto:care@ankjyotishai.com" className="text-primary hover:underline">care@ankjyotishai.com</a></p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutPage;
