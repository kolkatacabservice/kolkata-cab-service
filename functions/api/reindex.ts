/**
 * functions/api/reindex.ts
 *
 * Cloudflare Pages Function — replaces src/app/api/reindex/route.ts
 *
 * POST /api/reindex — submit specific URLs to IndexNow (authenticated)
 * Header: x-api-key: <REINDEX_API_KEY>
 * Body: { "urls": ["/routes/kolkata-to-ranchi", ...] }
 */

interface Env {
  INDEXNOW_API_KEY?: string;
  REINDEX_API_KEY?: string;
}

const DOMAIN = 'https://www.kolkatacabservice.com';

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Authenticate
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== (env.REINDEX_API_KEY || '').trim()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const INDEXNOW_KEY = (env.INDEXNOW_API_KEY || 'f63a562479e04845a7090b84784a9e52').trim();
    const body = await request.json() as { urls?: string[] };
    const urls: string[] = body.urls || [];

    if (urls.length === 0) {
      return Response.json({ error: 'No URLs provided' }, { status: 400 });
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

    // Also ping Google's URL submission via sitemap ping
    const googlePing = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${DOMAIN}/sitemap_index.xml`)}`,
      { method: 'GET' }
    ).catch(() => null);

    return Response.json({
      success: true,
      urlsSubmitted: absoluteUrls.length,
      urls: absoluteUrls,
      indexNowResults: results.map(r =>
        r.status === 'fulfilled' ? r.value : { error: (r.reason as Error)?.message }
      ),
      googleSitemapPing: googlePing ? googlePing.status : 'failed',
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to submit URLs', details: String(error) },
      { status: 500 }
    );
  }
};
