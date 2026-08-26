export const SITE_URL = 'https://ankjyotishai.com';

export const STATIC_ROUTES = [
  '/',
  '/reports',
  '/pricing',
  '/daily-forecast',
  '/moolank-calculator',
  '/naamank-calculator',
  '/remedies',
  '/baby-names',
  '/form',
  '/login',
  '/signup',
  '/sample-report',
];

export const generatePseoUrls = (): string[] => {
  const urls: string[] = [];

  // 1. Mulank Detail Pages (1 to 9)
  for (let i = 1; i <= 9; i++) {
    urls.push(`/numerology/mulank/${i}`);
  }

  // 2. Compatibility Pages (1 to 9 x 1 to 9 = 81 pairs)
  for (let i = 1; i <= 9; i++) {
    for (let j = 1; j <= 9; j++) {
      urls.push(`/compatibility/mulank-${i}-and-${j}`);
    }
  }

  return urls;
};

export const generateXmlSitemap = (): string => {
  const currentDate = new Date().toISOString().split('T')[0];
  const pseoUrls = generatePseoUrls();
  const allRoutes = [...STATIC_ROUTES, ...pseoUrls];

  const urlElements = allRoutes
    .map((path) => {
      const priority = path === '/' ? '1.0' : path.startsWith('/numerology') ? '0.8' : '0.7';
      return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};
