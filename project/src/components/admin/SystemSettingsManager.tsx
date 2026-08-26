import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string;
}

const settingLabels: Record<string, { label: string; description: string; group: string }> = {
  brand_name: { label: 'Brand Name', description: 'Your app brand name', group: 'Branding' },
  contact_email: { label: 'Contact Email', description: 'Support email address', group: 'Branding' },
  whatsapp_number: { label: 'WhatsApp Number', description: 'Support WhatsApp number', group: 'Branding' },
  currency: { label: 'Currency', description: 'Default currency code', group: 'Branding' },
  default_language: { label: 'Default Language', description: 'Default language (en/hi/hinglish)', group: 'Branding' },
  meta_pixel_id: { label: 'Meta Pixel ID', description: 'Facebook/Meta Pixel ID for tracking', group: 'Analytics' },
  ga_id: { label: 'Google Analytics ID', description: 'GA4 Measurement ID (G-XXXXXXX)', group: 'Analytics' },
  google_ads_id: { label: 'Google Ads ID', description: 'Conversion tag ID (AW-XXXXXXX)', group: 'Analytics' },
  google_ads_purchase_label: { label: 'Google Ads Purchase Label', description: 'Conversion label (AW tag ke saath, e.g. AbCdEfGh)', group: 'Analytics' },
  gsc_verification: { label: 'Search Console Verification', description: 'google-site-verification meta content value', group: 'Analytics' },
  report_price: { label: 'Report Price (₹)', description: 'Price for premium report', group: 'Payment' },
  payments_enabled: { label: 'Payments Enabled', description: 'true or false', group: 'Payment' },
  payment_mode: { label: 'Payment Mode', description: 'test or live', group: 'Payment' },
  // SEO
  seo_home_title: { label: 'Home Page Title', description: 'SEO title for homepage (max ~60 chars)', group: 'SEO' },
  seo_home_description: { label: 'Home Page Description', description: 'Meta description for homepage (max 160 chars)', group: 'SEO' },
  seo_home_keywords: { label: 'Home Page Keywords', description: 'Comma-separated keywords', group: 'SEO' },
  seo_blog_title: { label: 'Blog Page Title', description: 'SEO title for blog listing page', group: 'SEO' },
  seo_blog_description: { label: 'Blog Page Description', description: 'Meta description for blog page', group: 'SEO' },
  seo_sample_title: { label: 'Sample Report Title', description: 'SEO title for sample report page', group: 'SEO' },
  seo_sample_description: { label: 'Sample Report Description', description: 'Meta description for sample report', group: 'SEO' },
  seo_contact_title: { label: 'Contact Page Title', description: 'SEO title for contact page', group: 'SEO' },
  seo_contact_description: { label: 'Contact Page Description', description: 'Meta description for contact page', group: 'SEO' },
  og_image_url: { label: 'Default OG Image URL', description: 'Social share image URL (1200x630px recommended)', group: 'SEO' },
  site_tagline: { label: 'Site Tagline', description: 'Short tagline shown in titles', group: 'SEO' },
};

const SystemSettingsManager = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('system_settings').select('*').order('key');
      setSettings((data || []) as Setting[]);
    };
    load();
  }, []);

  const handleChange = (key: string, value: string) => {
    setEdited({ ...edited, [key]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(edited)) {
        const { error } = await supabase.from('system_settings').update({ value }).eq('key', key);
        if (error) throw error;
      }
      toast.success('Settings saved!');
      setEdited({});
      const { data } = await supabase.from('system_settings').select('*').order('key');
      setSettings((data || []) as Setting[]);
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    } finally { setSaving(false); }
  };

  const groups = ['Branding', 'Analytics', 'Payment', 'SEO'];

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="text-lg">{group} Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings
              .filter((s) => settingLabels[s.key]?.group === group)
              .map((s) => {
                const meta = settingLabels[s.key];
                return (
                  <div key={s.key} className="grid md:grid-cols-3 gap-2 items-center">
                    <div>
                      <p className="font-medium text-sm">{meta?.label || s.key}</p>
                      <p className="text-xs text-muted-foreground">{meta?.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        value={edited[s.key] !== undefined ? edited[s.key] : s.value}
                        onChange={(e) => handleChange(s.key, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      ))}

      {Object.keys(edited).length > 0 && (
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      )}
    </div>
  );
};

export default SystemSettingsManager;
