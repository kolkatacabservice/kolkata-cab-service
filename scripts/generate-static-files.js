/**
 * generate-static-files.js
 *
 * Pre-generates static files that Next.js static export cannot handle:
 *   1. public/feed.xml  — RSS feed from src/data/blogs.json
 *   2. public/robots.txt — robots.txt (replaces robots.ts route handler)
 *
 * WHY THIS EXISTS:
 * With `output: 'export'`, Next.js Route Handlers (feed.xml/route.ts, robots.ts)
 * are NOT exported as static files — they require a server runtime.
 * This script generates them as static files in public/ so Cloudflare Pages
 * serves them directly from CDN with zero CPU.
 *
 * USAGE: Run BEFORE `next build` so public/ files are included in the build output.
 * Already wired into package.json build:cf script.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BLOGS_PATH = path.join(ROOT, 'src/data/blogs.json');
const PUBLIC_DIR = path.join(ROOT, 'public');

const DOMAIN = 'https://www.kolkatacabservice.com';
const BUSINESS_NAME = 'Kolkata Cab Service';
const BUSINESS_EMAIL = 'kolkatacabtaxiservices@gmail.com';
const LAST_BUILD_DATE = 'Wed, 11 Jun 2026 00:00:00 +0000';
const INDEXNOW_KEY = 'f63a562479e04845a7090b84784a9e52';

// ── Generate feed.xml ────────────────────────────────────────────────────────
function generateFeedXml() {
  if (!fs.existsSync(BLOGS_PATH)) {
    console.warn('[generate-static-files] blogs.json not found, skipping feed.xml');
    return;
  }

  const blogs = JSON.parse(fs.readFileSync(BLOGS_PATH, 'utf8'));

  const rssItems = blogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(blog => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${DOMAIN}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${DOMAIN}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.description}]]></description>
      <category>${blog.category}</category>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <author>${BUSINESS_EMAIL} (${BUSINESS_NAME})</author>
    </item>`)
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${BUSINESS_NAME} — Travel Blog</title>
    <link>${DOMAIN}/blog</link>
    <description>Travel guides, route tips, fare charts, and cab booking guides from ${BUSINESS_NAME}. Expert advice for cab travel in Kolkata, Ranchi, Jamshedpur, and 80+ cities across East India.</description>
    <language>en-IN</language>
    <managingEditor>${BUSINESS_EMAIL} (${BUSINESS_NAME})</managingEditor>
    <webMaster>${BUSINESS_EMAIL} (${BUSINESS_NAME})</webMaster>
    <lastBuildDate>${LAST_BUILD_DATE}</lastBuildDate>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${DOMAIN}/logo.webp</url>
      <title>${BUSINESS_NAME}</title>
      <link>${DOMAIN}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), rssFeed, 'utf8');
  console.log('[generate-static-files] ✅ feed.xml generated');
}

// ── Generate robots.txt ──────────────────────────────────────────────────────
function generateRobotsTxt() {
  // IMPORTANT: This generates a static robots.txt in public/ so Cloudflare Pages
  // serves it directly from CDN — no Worker, no Cloudflare managed-content injection.
  // The Cloudflare "AI Scrapers" feature injects Content-Signal headers into
  // robots.txt served through Workers/Next.js, causing Googlebot warnings.
  // A static file in public/ bypasses this entirely.

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Claude-User
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Google-CloudVertexBot
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Meta-ExternalFetcher
Disallow: /

User-agent: MistralAI-User
Disallow: /

User-agent: Manus Bot
Disallow: /

User-agent: Perplexity-User
Disallow: /

User-agent: PetalBot
Disallow: /

User-agent: ProRataInc
Disallow: /

User-agent: TikTok Spider
Disallow: /

User-agent: Timpibot
Disallow: /

User-agent: Novellum AI Crawl
Disallow: /

User-agent: Anchor Browser
Disallow: /

User-agent: Googlebot
Allow: /

User-agent: BingBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Baidu
Allow: /

User-agent: archive.org_bot
Allow: /

User-agent: DuckAssistBot
Allow: /

Sitemap: ${DOMAIN}/sitemap_index.xml
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('[generate-static-files] ✅ robots.txt generated (static file, no Cloudflare injection)');
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('[generate-static-files] Generating static files...');
  generateFeedXml();
  generateRobotsTxt();
  console.log('[generate-static-files] ✅ Done!');
}

main();
