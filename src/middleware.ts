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

  return NextResponse.next();
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
