// Fully static — sitemap structure only changes on deploy
export const dynamic = 'force-static';



export async function GET() {
  const DOMAIN = 'https://www.kolkatacabservice.com';
  // Fixed date to prevent false freshness signals — updates automatically on each deploy/build
  // Kept in sync with LAST_MODIFIED in sitemap.ts (2026-06-16)
  const LAST_MODIFIED = '2026-06-16T11:00:00.000Z';
  const sitemaps = [
    `${DOMAIN}/sitemap/0.xml`,
    `${DOMAIN}/sitemap/1.xml`,
    `${DOMAIN}/sitemap/2.xml`,
    `${DOMAIN}/sitemap/3.xml`,
    `${DOMAIN}/sitemap/4.xml`,
    `${DOMAIN}/sitemap/5.xml`,  // Vehicle-specific route pages part 1
    `${DOMAIN}/sitemap/6.xml`,  // Vehicle-specific route pages part 2
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${LAST_MODIFIED}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',  // Sitemap index itself shouldn't be indexed as a page
    },
  });
}
