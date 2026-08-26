import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const PrivacyPage = () => {
  const { language } = useLanguage();

  return (
    <>
      <SEO title="Privacy Policy — Ankjyotish" description="Ankjyotish privacy policy — how we collect, store and protect your personal data." canonical="/privacy" />
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
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect the following types of information to provide our numerology services:
            </p>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Personal Information:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Full name (birth name and current name)</li>
              <li>Date of birth</li>
              <li>Time of birth (optional, for astrology features)</li>
              <li>City and country of birth</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Gender (optional)</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Partner Information (if provided):</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Partner's name</li>
              <li>Partner's date of birth</li>
              <li>Partner's time of birth (optional)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              Your personal information is used solely for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Generating your personalized numerology and astrology reports</li>
              <li>Calculating compatibility scores when partner details are provided</li>
              <li>Sending your report via email (if requested)</li>
              <li>Processing payments and delivering purchased services</li>
              <li>Providing customer support</li>
              <li>Improving our services based on usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">3. Data Storage & Security</h2>
            <p className="text-muted-foreground">
              We take data security seriously and implement the following measures:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
              <li>All data is encrypted in transit using SSL/TLS</li>
              <li>User data is stored securely on encrypted databases</li>
              <li>We use industry-standard security practices</li>
              <li>Payment information is processed by Cashfree and never stored on our servers</li>
              <li>Access to personal data is restricted to authorized personnel only</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">4. Data Sharing</h2>
            <p className="text-muted-foreground">
              We do NOT sell, rent, or share your personal information with third parties except:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
              <li>Payment processors (Cashfree) for transaction processing</li>
              <li>Cloud service providers for hosting and data storage</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights, privacy, safety, or property</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">5. Cookies & Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted-foreground space-y-2">
              <li>Remember your language preferences</li>
              <li>Keep you logged in to your account</li>
              <li>Save your form progress</li>
              <li>Analyze website usage (Google Analytics)</li>
              <li>Track marketing campaigns (Facebook Pixel, if applicable)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal data we hold</li>
              <li>Correct inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact us at care@ankjyotishai.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal data for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time by contacting us. Some data may be retained for legal or business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at:
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

export default PrivacyPage;
