import { useEffect } from 'react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { captureUtm } from '@/lib/utm';

const TrackingScripts = () => {
  const { data: settings } = useSystemSettings();

  // first-touch ad attribution (utm/gclid/fbclid)
  useEffect(() => { captureUtm(); }, []);

  useEffect(() => {
    if (!settings) return;

    const appended: HTMLElement[] = [];

    // Google Analytics — idempotent: only inject once per gaId
    const gaId = settings.ga_id;
    const gadsId = settings.google_ads_id;
    if (gaId && !document.getElementById(`ga-script-${gaId}`)) {
      const script = document.createElement('script');
      script.id = `ga-script-${gaId}`;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
      appended.push(script);

      const inlineScript = document.createElement('script');
      inlineScript.id = `ga-inline-${gaId}`;
      inlineScript.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');${gadsId ? `gtag('config','${gadsId}');` : ''}`;
      document.head.appendChild(inlineScript);
      appended.push(inlineScript);
    } else if (!gaId && gadsId && !document.getElementById(`gads-script-${gadsId}`)) {
      // Google Ads only (no GA4)
      const script = document.createElement('script');
      script.id = `gads-script-${gadsId}`;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gadsId}`;
      document.head.appendChild(script);
      appended.push(script);
      const inlineScript = document.createElement('script');
      inlineScript.id = `gads-inline-${gadsId}`;
      inlineScript.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gadsId}');`;
      document.head.appendChild(inlineScript);
      appended.push(inlineScript);
    }

    // Google Search Console verification meta (admin-set)
    const gsc = settings.gsc_verification;
    if (gsc && !document.querySelector('meta[name="google-site-verification"]')) {
      const m = document.createElement('meta');
      m.name = 'google-site-verification';
      m.content = gsc;
      document.head.appendChild(m);
      appended.push(m as unknown as HTMLElement);
    }

    // Meta Pixel — idempotent: only inject once per pixelId
    const pixelId = settings.meta_pixel_id;
    if (pixelId && !document.getElementById(`fb-pixel-${pixelId}`)) {
      const pixelScript = document.createElement('script');
      pixelScript.id = `fb-pixel-${pixelId}`;
      pixelScript.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
      document.head.appendChild(pixelScript);
      appended.push(pixelScript);
    }

    // Cleanup on settings change / unmount: only remove what *this* effect added
    return () => {
      appended.forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [settings?.ga_id, settings?.meta_pixel_id, settings?.google_ads_id, settings?.gsc_verification]);

  return null;
};

export default TrackingScripts;
