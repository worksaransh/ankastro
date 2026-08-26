import { useSystemSettings } from './useSystemSettings';

export function useSEOSettings() {
  const { data: settings } = useSystemSettings();
  const get = (key: string, fallback: string) => settings?.[key] || fallback;

  return {
    getPageTitle: (page: string, fallback: string) => get(`seo_${page}_title`, fallback),
    getPageDesc: (page: string, fallback: string) => get(`seo_${page}_description`, fallback),
    getPageKeywords: (page: string, fallback: string) => get(`seo_${page}_keywords`, fallback),
    getOgImage: () => get('og_image_url', 'https://ankjyotishai.com/og-image.jpg'),
    getTagline: () => get('site_tagline', 'Divine Numerology AI'),
  };
}
