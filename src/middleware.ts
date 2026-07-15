/**
 * src/middleware.ts — Edge Middleware (runs on Cloudflare Workers edge runtime)
 *
 * Runs on EVERY request that reaches the Worker (only on cache misses after
 * Cloudflare caches the response).
 *
 * Responsibilities:
 *   1. Redirect non-www → www (301 permanent)
 *   2. Redirect http → https (301 permanent)
 *   3. Serve IndexNow key verification
 *   4. Set Cache-Control s-maxage headers for Cloudflare edge caching
 *      — route/city/service pages: 30 days
 *      — state/tour/blog pages: 7 days
 *      — home/services: 24 hours
 *
 * NOTE: Uses only Web APIs (NextRequest, Headers, URL) — no Node.js APIs.
 * This is required for Edge Middleware compatibility with OpenNext/Cloudflare.
 */
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  // ── Skip for local dev + preview environments ─────────────────────────────
  const isDevOrPreview =
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('vercel.app') ||
    hostname.includes('workers.dev') ||
    hostname.includes('pages.dev');

  if (isDevOrPreview) {
    return NextResponse.next();
  }

  // ── IndexNow key verification (Bing/Yandex) ───────────────────────────────
  if (pathname === '/b8e4c2a1f3d7e9b0.txt') {
    return new NextResponse('b8e4c2a1f3d7e9b0', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // ── Canonical: redirect non-www → www ────────────────────────────────────
  if (hostname === 'kolkatacabservice.com') {
    url.host = 'www.kolkatacabservice.com';
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // ── Canonical: redirect http → https ─────────────────────────────────────
  if (url.protocol === 'http:') {
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // ── Cache-Control headers for Cloudflare edge ─────────────────────────────
  // s-maxage tells Cloudflare to cache at the edge for N seconds.
  // After the first Worker render, all subsequent requests are served from CF
  // edge cache for the TTL — the Worker does NOT run again until cache expires.
  // This makes on-demand rendering free-tier safe.
  const response = NextResponse.next();

  // SEO headers
  response.headers.set('Content-Language', 'en-IN');
  response.headers.set(
    'X-Robots-Tag',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  const knownStates = ['west-bengal', 'jharkhand', 'odisha', 'bihar', 'uttar-pradesh'];
  const segments = pathname.split('/').filter(Boolean);

  if (pathname.startsWith('/routes/')) {
    // 13,600+ on-demand route pages — render once, CF caches 30 days
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=2592000, max-age=3600, stale-while-revalidate=86400'
    );
  } else if (segments.length >= 2 && knownStates.includes(segments[0])) {
    // City main + service pages: /[state]/[city] and /[state]/[city]/[service]
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=2592000, max-age=3600, stale-while-revalidate=86400'
    );
  } else if (segments.length === 1 && knownStates.includes(segments[0])) {
    // State pages: /west-bengal, /jharkhand, etc.
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=604800, max-age=3600, stale-while-revalidate=86400'
    );
  } else if (pathname.startsWith('/kolkata/')) {
    // Kolkata neighbourhood pages
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=2592000, max-age=3600, stale-while-revalidate=86400'
    );
  } else if (pathname.startsWith('/tours/') || pathname.startsWith('/blog/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=604800, max-age=3600, stale-while-revalidate=86400'
    );
  } else {
    // Home, services, about, fare-chart, contact, etc.
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=86400, max-age=3600, stale-while-revalidate=3600'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static JS/CSS chunks)
     * - _next/image  (image optimization)
     * - Static files with extensions (.webp, .png, .ico, .js, .css, etc.)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:webp|png|jpg|jpeg|svg|ico|css|js|woff2|avif|txt)).*)',
  ],
};
