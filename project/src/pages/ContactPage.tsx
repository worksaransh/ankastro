import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Send, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { useSEOSettings } from '@/hooks/useSEOSettings';

const ContactPage = () => {
  const { language } = useLanguage();
  const seo = useSEOSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: "We're here to help with any questions or concerns",
      name: 'Your Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Your Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully! We will get back to you soon.',
      error: 'Failed to send message. Please try again or email us directly.',
      emailTitle: 'Email Us',
      emailDesc: 'We respond within 24 hours',
    },
    hi: {
      title: 'संपर्क करें',
      subtitle: 'किसी भी प्रश्न या चिंता के लिए हम यहां हैं',
      name: 'आपका नाम',
      email: 'ईमेल पता',
      subject: 'विषय',
      message: 'आपका संदेश',
      send: 'संदेश भेजें',
      sending: 'भेज रहे हैं...',
      success: 'संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।',
      error: 'संदेश भेजने में विफल। कृपया पुनः प्रयास करें या सीधे ईमेल करें।',
      emailTitle: 'ईमेल करें',
      emailDesc: 'हम 24 घंटे के भीतर जवाब देते हैं',
    },
    hinglish: {
      title: 'Contact Karein',
      subtitle: 'Kisi bhi sawaal ya concern ke liye hum yahaan hain',
      name: 'Aapka Naam',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Aapka Message',
      send: 'Message Bhejein',
      sending: 'Bhej rahe hain...',
      success: 'Message successfully bhej diya gaya! Hum jaldi aapse contact karenge.',
      error: 'Message bhejne mein fail ho gaya. Please phir try karein ya seedha email karein.',
      emailTitle: 'Email Karein',
      emailDesc: 'Hum 24 ghante mein respond karte hain',
    },
  };

  const t = translations[language] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      toast.success(t.success);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('[ContactPage] submit error:', err);
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background spiritual-pattern">
      <SEO
        title={seo.getPageTitle('contact', 'Contact Us - Ankjyotish Support')}
        description={seo.getPageDesc('contact', 'Get in touch with the Ankjyotish team. We respond within 24 hours via email.')}
        ogImage={seo.getOgImage()}
        canonical="/contact"
      />
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

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">{t.title}</h1>
          <p className="text-muted-foreground text-lg">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="card-divine">
            <CardHeader>
              <CardTitle className="font-display">Send us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t.subject}</Label>
                  <Input
                    id="subject"
                    placeholder="Payment issue / Report question / Other"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t.message}</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your question or concern..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.send}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t.emailTitle}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{t.emailDesc}</p>
                    <a
                      href="mailto:care@ankjyotishai.com"
                      className="text-primary hover:underline font-medium"
                    >
                      care@ankjyotishai.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-sm space-y-1">
                <p className="font-semibold text-foreground">Business Details</p>
                <p className="text-muted-foreground">Sangeeta Creations (Proprietorship)</p>
                <p className="text-muted-foreground">Owner: Rajesh Gulati</p>
                <p className="text-muted-foreground">Delhi, India</p>
                <p className="text-muted-foreground">Email: <a className="text-primary hover:underline" href="mailto:care@ankjyotishai.com">care@ankjyotishai.com</a></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Sangeeta Creations</p>
          <p>© {new Date().getFullYear()} All Rights Reserved · care@ankjyotishai.com</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
