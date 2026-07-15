import { BUSINESS } from '@/lib/data';
import blogsData from '@/data/blogs.json';

// Fully static — blog data comes from JSON, only changes on deploy
export const dynamic = 'force-static';

// Fixed build date — prevents non-deterministic output which breaks true static caching.
// Update this date manually when blog content changes significantly.
const LAST_BUILD_DATE = 'Wed, 11 Jun 2026 00:00:00 +0000';

const DOMAIN = BUSINESS.domain;


interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  content: string[];
}

export async function GET() {
  const blogs = blogsData as BlogPost[];

  const rssItems = blogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${DOMAIN}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${DOMAIN}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.description}]]></description>
      <category>${blog.category}</category>
      <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
      <author>${BUSINESS.email} (${BUSINESS.name})</author>
    </item>`
    )
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${BUSINESS.name} — Travel Blog</title>
    <link>${DOMAIN}/blog</link>
    <description>Travel guides, route tips, fare charts, and cab booking guides from ${BUSINESS.name}. Expert advice for cab travel in Kolkata, Ranchi, Jamshedpur, and 80+ cities across East India.</description>
    <language>en-IN</language>
    <managingEditor>${BUSINESS.email} (${BUSINESS.name})</managingEditor>
    <webMaster>${BUSINESS.email} (${BUSINESS.name})</webMaster>
    <lastBuildDate>${LAST_BUILD_DATE}</lastBuildDate>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${DOMAIN}/logo.webp</url>
      <title>${BUSINESS.name}</title>
      <link>${DOMAIN}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
