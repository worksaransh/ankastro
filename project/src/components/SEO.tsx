import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  canonical?: string;
  schema?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
  locale?: 'en_US' | 'hi_IN';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SITE_URL = 'https://ankjyotishai.com';
const DEFAULT_OG = `${SITE_URL}/og-image.jpg`;

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
  ogType = 'website',
  canonical,
  schema,
  noindex,
  locale = 'en_US',
  article,
}: SEOProps) => {
  const fullTitle = title.includes('Ankjyotish') ? title : `${title} | Ankjyotish`;

  // Auto-default canonical to current path if not provided
  let resolvedCanonical = canonical;
  if (!resolvedCanonical && typeof window !== 'undefined') {
    resolvedCanonical = window.location.pathname + window.location.search;
  }
  const fullCanonical = resolvedCanonical
    ? resolvedCanonical.startsWith('http')
      ? resolvedCanonical
      : `${SITE_URL}${resolvedCanonical}`
    : SITE_URL;

  const image = ogImage || DEFAULT_OG;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  // Truncate description for safety (Google limits ~160 chars)
  const safeDescription = description.length > 160
    ? description.slice(0, 157).trim() + '…'
    : description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex
        ? <meta name="robots" content="noindex,nofollow" />
        : <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="Ankjyotish" />
      <meta property="og:locale" content={locale} />
      {locale === 'en_US' && <meta property="og:locale:alternate" content="hi_IN" />}

      {/* Article-specific */}
      {ogType === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {ogType === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {ogType === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {ogType === 'article' && article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {ogType === 'article' && article?.tags?.map((t) => (
        <meta key={t} property="article:tag" content={t} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Ankjyotish" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={image} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}

      {/* JSON-LD */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
