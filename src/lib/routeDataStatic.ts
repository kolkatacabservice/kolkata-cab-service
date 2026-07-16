/**
 * src/lib/routeDataStatic.ts
 *
 * Build-time only route helpers — called ONLY from generateStaticParams() in
 * Next.js page files. These use Node.js require() which works during `next build`
 * but does NOT exist in the Cloudflare Workers runtime.
 *
 * IMPORTANT: Never import this file from code that runs at request time.
 * Only import from page files that call generateStaticParams().
 */
import { Route } from './data';

function loadAllSync(): Route[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const wb = require('@/data/routes-west-bengal.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const jh = require('@/data/routes-jharkhand.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const od = require('@/data/routes-odisha.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bh = require('@/data/routes-bihar.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const up = require('@/data/routes-uttar-pradesh.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cwb = require('@/data/routes-cross-wb.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cjh = require('@/data/routes-cross-jh.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cod = require('@/data/routes-cross-od.json') as Route[];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const coth = require('@/data/routes-cross-other.json') as Route[];
  return [...wb, ...jh, ...od, ...bh, ...up, ...cwb, ...cjh, ...cod, ...coth];
}

function isHubRoute(slug: string): boolean {
  const parts = slug.split('-to-');
  if (parts.length === 2) {
    const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
    return hubSlugs.has(parts[0]) || hubSlugs.has(parts[1]);
  }
  return false;
}

/**
 * Returns ALL route slugs for full SSG — runs ONLY at build time.
 * Pre-renders every route as a static HTML file, ensuring 0ms Worker CPU usage per request.
 * Total routes ~13,800 — well within Cloudflare Pages 20,000-file limit.
 */
export function getAllRouteSlugs(): string[] {
  const routes = loadAllSync();
  return routes.map(r => r.slug);
}

/**
 * Returns at most `limit` route slugs, hub-first — runs ONLY at build time.
 * Kept for vehicle-page SSG which only needs hub routes.
 */
export function getStaticRouteSlugs(limit = 200): string[] {
  const routes = loadAllSync();
  const routeMap = new Map(routes.map(r => [r.slug, r]));
  const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);

  const tier1 = routes.filter(r => hubSlugs.has(r.from) && hubSlugs.has(r.to));
  const tier2 = routes
    .filter(r => hubSlugs.has(r.from) && !hubSlugs.has(r.to))
    .sort((a, b) => a.distance - b.distance);
  const tier3 = routes
    .filter(r => !hubSlugs.has(r.from) && hubSlugs.has(r.to))
    .sort((a, b) => a.distance - b.distance);

  const seen = new Set<string>();
  const result: string[] = [];

  for (const r of [...tier1, ...tier2, ...tier3]) {
    if (result.length >= limit) break;
    if (!seen.has(r.slug)) {
      seen.add(r.slug);
      result.push(r.slug);
    }
  }

  const withReverse = [...result];
  for (const slug of result) {
    if (withReverse.length >= limit) break;
    const parts = slug.split('-to-');
    if (parts.length === 2) {
      const rev = `${parts[1]}-to-${parts[0]}`;
      if (routeMap.has(rev) && !seen.has(rev)) {
        seen.add(rev);
        withReverse.push(rev);
      }
    }
  }

  return withReverse.slice(0, limit);
}

/** Returns hub-only route slugs for vehicle SSG pages — build time only. */
export function getStaticVehicleRouteSlugs(limit = 20): string[] {
  return getStaticRouteSlugs(limit).filter(isHubRoute);
}
