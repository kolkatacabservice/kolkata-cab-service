import type { MetadataRoute } from 'next';

// Force static so this is pre-rendered at build time — zero Worker compute on each crawl.
// Cloudflare serves it as a Worker route (not a static asset), so Cloudflare's managed
// robots.txt injection does NOT apply. This eliminates the "Content-Signal" Googlebot warning.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Standard crawlers: allow everything except internal routes ──
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // ── Block AI Training Crawlers & Scrapers (Consumes bandwidth, no search value) ──
      { userAgent: 'Amazonbot', disallow: '/' },
      { userAgent: 'Applebot-Extended', disallow: '/' }, // Apple AI training
      { userAgent: 'Bytespider', disallow: '/' }, // ByteDance AI crawler
      { userAgent: 'CCBot', disallow: '/' }, // Common Crawl
      { userAgent: 'ClaudeBot', disallow: '/' }, // Anthropic Claude training
      { userAgent: 'Claude-User', disallow: '/' }, // Claude assistant agent
      { userAgent: 'ChatGPT-User', disallow: '/' }, // ChatGPT user agent scraper
      { userAgent: 'FacebookBot', disallow: '/' }, // Meta scraping
      { userAgent: 'Google-Extended', disallow: '/' }, // Google Gemini training
      { userAgent: 'Google-CloudVertexBot', disallow: '/' }, // Google Cloud Vertex AI
      { userAgent: 'GPTBot', disallow: '/' }, // OpenAI GPT training
      { userAgent: 'Meta-ExternalAgent', disallow: '/' }, // Meta crawler
      { userAgent: 'meta-externalagent', disallow: '/' }, // Meta crawler lowercase
      { userAgent: 'Meta-ExternalFetcher', disallow: '/' }, // Meta agent
      { userAgent: 'MistralAI-User', disallow: '/' }, // Mistral AI assistant
      { userAgent: 'Manus Bot', disallow: '/' }, // Manus agent
      { userAgent: 'Perplexity-User', disallow: '/' }, // Perplexity assistant scraper
      { userAgent: 'PetalBot', disallow: '/' }, // Huawei bot
      { userAgent: 'ProRataInc', disallow: '/' }, // ProRata AI crawler
      { userAgent: 'TikTok Spider', disallow: '/' }, // TikTok scraper
      { userAgent: 'Timpibot', disallow: '/' }, // Timpi search/AI bot
      { userAgent: 'Novellum AI Crawl', disallow: '/' }, // Novellum crawler
      { userAgent: 'Anchor Browser', disallow: '/' }, // Anchor AI crawler
      
      // ── Explicitly ALLOW Search Engines & AI Search Engines (To show in search results & AI Overviews) ──
      { userAgent: 'Googlebot', allow: '/' }, // Google Search Engine
      { userAgent: 'BingBot', allow: '/' }, // Microsoft Bing Search
      { userAgent: 'Applebot', allow: '/' }, // Apple Search & Siri
      { userAgent: 'OAI-SearchBot', allow: '/' }, // OpenAI SearchGPT / ChatGPT Search
      { userAgent: 'PerplexityBot', allow: '/' }, // Perplexity Search Engine
      { userAgent: 'Claude-SearchBot', allow: '/' }, // Anthropic Search Bot
      { userAgent: 'Baidu', allow: '/' }, // Baidu Search
      { userAgent: 'archive.org_bot', allow: '/' }, // Wayback Machine Archive
      { userAgent: 'DuckAssistBot', allow: '/' }, // DuckDuckGo AI assistant
    ],
    // Single canonical sitemap index — Googlebot discovers all 7 sub-sitemaps from here.
    sitemap: 'https://www.kolkatacabservice.com/sitemap_index.xml',
  };
}
