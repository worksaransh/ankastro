import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const RefundPage = () => {
  const { language } = useLanguage();

  return (
    <>
      <SEO title="Refund Policy — Ankjyotish" description="Ankjyotish refund and cancellation policy. 7-day money-back guarantee." canonical="/refund" />
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
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p className="text-muted-foreground">
              At Ankjyotish AI, we strive to provide you with the best numerology and astrology insights. We understand that sometimes things don't go as planned, and we're here to help.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Digital Product Nature</h2>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-foreground">
                All purchases made on our platform are for digital products (numerology reports). Due to the nature of digital services, refunds are <strong>not applicable once the report has been generated and delivered</strong>. The report is created instantly upon successful payment and made available in the user's account.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">When We Offer Refunds</h2>
            <p className="text-muted-foreground mb-4">
              We will provide a full refund in the following cases:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-3">
              <li>
                <strong className="text-foreground">Technical Failure:</strong> If the report fails to generate due to a technical error on our end.
              </li>
              <li>
                <strong className="text-foreground">Duplicate Payment:</strong> If you were charged multiple times for the same purchase.
              </li>
              <li>
                <strong className="text-foreground">Service Not Delivered:</strong> If you did not receive your report and we cannot resolve the issue.
              </li>
              <li>
                <strong className="text-foreground">Significant Errors:</strong> If the report contains major calculation errors (not interpretive differences).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Refund Request Process</h2>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
              <li>Contact us within <strong className="text-foreground">7 days</strong> of purchase</li>
              <li>Provide your order ID and registered email address</li>
              <li>Describe the issue you encountered</li>
              <li>Allow up to 48 hours for our team to review your request</li>
              <li>If approved, refunds will be processed within 5-7 business days</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Non-Refundable Cases</h2>
            <p className="text-muted-foreground mb-4">
              We generally cannot offer refunds in the following situations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You simply changed your mind after viewing the report</li>
              <li>You disagree with the interpretations provided (these are based on established numerology principles)</li>
              <li>You provided incorrect information (name, date of birth) during form submission</li>
              <li>The request is made more than 7 days after purchase</li>
              <li>You have previously received a refund for a similar purchase</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Refund Method</h2>
            <p className="text-muted-foreground">
              Approved refunds will be credited back to the original payment method used during purchase:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">UPI/Bank Transfer:</strong> 2-3 business days</li>
              <li><strong className="text-foreground">Credit/Debit Card:</strong> 5-7 business days</li>
              <li><strong className="text-foreground">Wallet Payments:</strong> 1-2 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Contact for Refunds</h2>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-foreground mb-4">
                To request a refund, please contact us through any of the following channels:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>📧 Email: <a href="mailto:care@ankjyotishai.com" className="text-primary hover:underline">care@ankjyotishai.com</a></li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Please include your order ID and the email address used for purchase.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Our Guarantee</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                💚 We are committed to your satisfaction. If you have any concerns about your purchase, please reach out to us before requesting a refund. We often can resolve issues and ensure you get the value you expected from our service.
              </p>
            </div>
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

export default RefundPage;
