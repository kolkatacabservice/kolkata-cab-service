import { MetadataRoute } from 'next';

// Force static generation — robots.txt is crawled by every bot on every visit.
// Without this it triggers ISR Writes constantly.
export const dynamic = 'force-static';
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
        ],
      },
      // Explicitly welcome and allow AI/LLM crawlers for search & recommendations
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: [
      'https://www.kolkatacabservice.com/sitemap_index.xml',
      // Also list individual sitemaps for redundancy — if index fails, Google still discovers these
      'https://www.kolkatacabservice.com/sitemap/0.xml',
      'https://www.kolkatacabservice.com/sitemap/1.xml',
      'https://www.kolkatacabservice.com/sitemap/2.xml',
      'https://www.kolkatacabservice.com/sitemap/3.xml',
      'https://www.kolkatacabservice.com/sitemap/4.xml',
      'https://www.kolkatacabservice.com/sitemap/5.xml',
      'https://www.kolkatacabservice.com/sitemap/6.xml',
    ],
  };
}
