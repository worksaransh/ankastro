// JSON-LD structured data helpers for SEO.
// Use with <SEO schema={...} /> on any page.

const SITE_URL = 'https://ankjyotishai.com';
const SITE_NAME = 'Ankjyotish';
const LOGO_URL = `${SITE_URL}/og-image.jpg`;

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: LOGO_URL,
  sameAs: [
    'https://www.instagram.com/ankjyotish',
    'https://twitter.com/Ankjyotish',
  ],
  contactPoint: [{
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@ankjyotishai.com',
    availableLanguage: ['English', 'Hindi'],
  }],
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ['en', 'hi'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const productSchema = (opts?: { name?: string; price?: number; ratingValue?: number; reviewCount?: number }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: opts?.name || 'Ankjyotish Premium Numerology Report',
  description:
    'Personalized 100+ page Vedic & Pythagorean numerology report covering career, love, money, health, growth, and lucky timing.',
  brand: { '@type': 'Brand', name: SITE_NAME },
  image: LOGO_URL,
  offers: {
    '@type': 'Offer',
    price: opts?.price ?? 499,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/payment`,
  },
  ...(opts?.ratingValue && opts?.reviewCount ? {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: opts.ratingValue,
      reviewCount: opts.reviewCount,
    },
  } : {}),
});

export const articleSchema = (opts: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: opts.title,
  description: opts.description,
  image: opts.image || LOGO_URL,
  datePublished: opts.publishedTime,
  dateModified: opts.modifiedTime || opts.publishedTime,
  author: { '@type': 'Person', name: opts.author || 'Ankjyotish' },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/blog/${opts.slug}`,
  },
  ...(opts.category ? { articleSection: opts.category } : {}),
  ...(opts.tags?.length ? { keywords: opts.tags.join(', ') } : {}),
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
  })),
});

export const faqSchema = (qa: Array<{ q: string; a: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qa.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

export const calculatorWebAppSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ankjyotish Numerology Calculator',
  url: `${SITE_URL}/calculator`,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  description: 'Free Vedic & Pythagorean numerology calculator — find your Mulank, Bhagyank, Life Path, Destiny and more.',
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'INR' },
});

export const numerologyProfileSchema = (opts: {
  name: string;
  lifePath: number | string;
  destiny: number | string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: `${opts.name} — Numerology Profile`,
  about: 'Vedic & Pythagorean numerology blueprint',
  creator: { '@type': 'Organization', name: SITE_NAME },
  keywords: `numerology, life path ${opts.lifePath}, destiny ${opts.destiny}, ${opts.name}`,
});
