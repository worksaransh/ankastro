import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const TermsPage = () => {
  const { language } = useLanguage();

  return (
    <>
      <SEO title="Terms of Service — Ankjyotish" description="Read Ankjyotish terms of service, usage policy and user agreement." canonical="/terms" />
          <div className="min-h-screen bg-background">
      {/* Header */}
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Ankjyotish AI ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Ankjyotish AI is a numerology and astrology guidance platform that provides personalized reports based on your birth date, name, and other personal information. The service includes:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
              <li>Numerology calculations and interpretations</li>
              <li>Vedic astrology lite insights</li>
              <li>Partner compatibility analysis</li>
              <li>Life guidance and recommendations</li>
              <li>Downloadable PDF reports</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">3. Important Disclaimer</h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium mb-2">⚠️ Please Read Carefully</p>
              <p className="text-amber-700 text-sm">
                The readings, predictions, and guidance provided by Ankjyotish AI are for entertainment and spiritual exploration purposes only. They should NOT be considered as:
              </p>
              <ul className="list-disc pl-6 mt-2 text-amber-700 text-sm space-y-1">
                <li>Medical advice or diagnosis</li>
                <li>Legal or financial advice</li>
                <li>Guaranteed predictions of future events</li>
                <li>Psychological or mental health treatment</li>
              </ul>
              <p className="text-amber-700 text-sm mt-2">
                Always consult qualified professionals for medical, legal, financial, or mental health concerns.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">4. Age Requirement</h2>
            <p className="text-muted-foreground">
              You must be at least 18 years of age to use this Service. By using the Service, you represent and warrant that you are at least 18 years old.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">5. Payment Terms</h2>
            <p className="text-muted-foreground mb-4">
              Premium features are available for a one-time payment of ₹499. This payment grants you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Lifetime access to your premium numerology report</li>
              <li>Unlimited PDF downloads of your report</li>
              <li>Access to all premium features for the purchased report</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Payments are processed securely through Cashfree Payments. We do not store your payment card details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">6. Refund Policy</h2>
            <p className="text-muted-foreground">
              Due to the digital nature of our product, refunds are generally not provided once a report has been generated. However, we may consider refunds in cases of:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
              <li>Technical errors preventing report generation</li>
              <li>Duplicate payments</li>
              <li>Service not delivered as described</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Refund requests must be made within 7 days of purchase. Please contact us at care@ankjyotishai.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, including but not limited to text, graphics, logos, and software, is the property of Ankjyotish AI and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">8. User Responsibilities</h2>
            <p className="text-muted-foreground">
              You agree to provide accurate information when using our Service. You are responsible for maintaining the confidentiality of your account and password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Ankjyotish AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us at:
            </p>
            <ul className="list-none mt-4 text-muted-foreground space-y-2">
              <li>Email: <a href="mailto:care@ankjyotishai.com" className="text-primary hover:underline">care@ankjyotishai.com</a></li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Sangeeta Creations</p>
          <p>© {new Date().getFullYear()} All Rights Reserved · care@ankjyotishai.com</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default TermsPage;
