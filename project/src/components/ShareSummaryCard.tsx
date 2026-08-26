import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Share2, FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { downloadShareableImage, shareImageNative } from '@/lib/shareableImage';
import { generateOnePagerPDF } from '@/lib/onePagerPdf';
import { trackEvent } from '@/lib/analytics';
import type { NumerologyProfile } from '@/lib/numerology';
import type { VedicProfile } from '@/lib/vedicNumerology';

interface Props {
  fullName: string;
  dateOfBirth: string;
  profile: NumerologyProfile;
  vedicProfile: VedicProfile;
  archetypeTitle?: string;
}

const t = {
  en: {
    title: 'Share Your Cosmic Blueprint',
    subtitle: 'Download a beautiful summary card for WhatsApp, Instagram or Stories — or grab a printable one-page PDF.',
    downloadPng: 'Download Share Card',
    sharePng: 'Share Card',
    downloadPdf: 'One-Page PDF',
    pngDone: 'Share card downloaded!',
    pdfDone: 'One-page PDF downloaded!',
    err: 'Something went wrong. Please try again.',
  },
  hi: {
    title: 'अपना कॉस्मिक ब्लूप्रिंट साझा करें',
    subtitle: 'WhatsApp, Instagram या Stories के लिए सुंदर सारांश कार्ड डाउनलोड करें — या एक पृष्ठ का प्रिंट करने योग्य PDF प्राप्त करें।',
    downloadPng: 'शेयर कार्ड डाउनलोड',
    sharePng: 'कार्ड शेयर करें',
    downloadPdf: 'एक पृष्ठ PDF',
    pngDone: 'शेयर कार्ड डाउनलोड हो गया!',
    pdfDone: 'एक पृष्ठ PDF डाउनलोड हो गई!',
    err: 'कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें।',
  },
  hinglish: {
    title: 'Apna Cosmic Blueprint Share Karein',
    subtitle: 'WhatsApp, Instagram ya Stories ke liye beautiful summary card download karein — ya printable one-page PDF lein.',
    downloadPng: 'Share Card Download',
    sharePng: 'Card Share Karein',
    downloadPdf: 'One-Page PDF',
    pngDone: 'Share card download ho gaya!',
    pdfDone: 'One-page PDF download ho gayi!',
    err: 'Kuch problem aayi. Please dobara try karein.',
  },
} as const;

export const ShareSummaryCard = ({ fullName, dateOfBirth, profile, vedicProfile, archetypeTitle }: Props) => {
  const { language } = useLanguage();
  const L = t[language as keyof typeof t] || t.en;
  const [busy, setBusy] = useState<'png' | 'pdf' | 'share' | null>(null);

  const handleDownloadPng = async () => {
    setBusy('png');
    try {
      await downloadShareableImage({ fullName, profile, vedicProfile, archetypeTitle, language: language as any });
      toast.success(L.pngDone);
      trackEvent('share_card_downloaded', { lang: language });
    } catch (e) {
      toast.error(L.err);
    } finally {
      setBusy(null);
    }
  };

  const handleShareNative = async () => {
    setBusy('share');
    try {
      const shared = await shareImageNative({ fullName, profile, vedicProfile, archetypeTitle, language: language as any });
      if (shared) trackEvent('share_card_shared_native', { lang: language });
      else await downloadShareableImage({ fullName, profile, vedicProfile, archetypeTitle, language: language as any });
    } catch (e) {
      toast.error(L.err);
    } finally {
      setBusy(null);
    }
  };

  const handleOnePager = async () => {
    setBusy('pdf');
    try {
      await generateOnePagerPDF({ fullName, dateOfBirth, profile, vedicProfile, archetypeTitle, language: language as any });
      toast.success(L.pdfDone);
      trackEvent('one_pager_downloaded', { lang: language });
    } catch (e) {
      toast.error(L.err);
    } finally {
      setBusy(null);
    }
  };

  const canShareNative = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2 font-display text-lg">
          <ImageIcon className="w-5 h-5 text-primary" />
          {L.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <p className="text-sm text-muted-foreground">{L.subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownloadPng} disabled={!!busy} className="gap-2">
            {busy === 'png' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {L.downloadPng}
          </Button>
          {canShareNative && (
            <Button onClick={handleShareNative} disabled={!!busy} variant="secondary" className="gap-2">
              {busy === 'share' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              {L.sharePng}
            </Button>
          )}
          <Button onClick={handleOnePager} disabled={!!busy} variant="outline" className="gap-2">
            {busy === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {L.downloadPdf}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareSummaryCard;
