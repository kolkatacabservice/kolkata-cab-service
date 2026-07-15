import { NextRequest, NextResponse } from 'next/server';

/**
 * IndexNow API — Instantly notify search engines about changed URLs.
 * 
 * Usage:
 *   POST /api/reindex
 *   Body: { "urls": ["/routes/kolkata-to-ranchi", "/services/outstation"] }
 *   Header: x-api-key: <REINDEX_API_KEY from .env.local>
 * 
 * This pings IndexNow (supported by Google, Bing, Yandex, Seznam) to
 * re-crawl updated pages immediately instead of waiting for the next crawl.
 */

const DOMAIN = 'https://www.kolkatacabservice.com';
const INDEXNOW_KEY = (process.env.INDEXNOW_API_KEY || 'f63a562479e04845a7090b84784a9e52').trim();

// IndexNow endpoints — all major search engines
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

export async function POST(request: NextRequest) {
  // Authenticate
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== (process.env.REINDEX_API_KEY || '').trim()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const urls: string[] = body.urls || [];

    if (urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    // Convert relative URLs to absolute
    const absoluteUrls = urls.map(url => 
      url.startsWith('http') ? url : `${DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`
    );

    // Ping all IndexNow endpoints in parallel
    const results = await Promise.allSettled(
      INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: 'www.kolkatacabservice.com',
            key: INDEXNOW_KEY,
            keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
            urlList: absoluteUrls,
          }),
        });
        return { endpoint, status: response.status, ok: response.ok };
      })
    );

    // Also ping Google's URL submission via sitemap ping (legacy but still works)
    const googlePing = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${DOMAIN}/sitemap_index.xml`)}`,
      { method: 'GET' }
    ).catch(() => null);

    return NextResponse.json({
      success: true,
      urlsSubmitted: absoluteUrls.length,
      urls: absoluteUrls,
      indexNowResults: results.map(r => 
        r.status === 'fulfilled' ? r.value : { error: r.reason?.message }
      ),
      googleSitemapPing: googlePing ? googlePing.status : 'failed',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit URLs', details: String(error) },
      { status: 500 }
    );
  }
}
