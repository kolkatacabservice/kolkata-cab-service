/**
 * src/lib/routeIndexing.ts
 *
 * Route tier classification for SEO indexing decisions.
 *
 * Problem: 13,800+ route pages are all submitted to sitemap and indexed.
 * Google treats most of them as thin near-duplicates (only city name + price changes).
 * This causes: "Crawled – not indexed", "Duplicate, Google chose different canonical",
 * and overall index quality decay.
 *
 * Solution: 3-tier classification to concentrate crawl budget on high-value pages.
 *
 * Tier 1 — Hub city involved (kolkata, ranchi, etc.): ~3,000–4,000 routes
 * Tier 2 — Short distance (≤150km) non-hub routes: ~1,500–2,000 routes
 * Tier 3 — Long-distance, both cities non-hub: ~8,000+ routes → noindex
 */

import type { Route } from './data';

// ─── True hub cities — major commercial centers with verified search demand ───
// Strict set: must have real cab search volume. These are the 5 main hubs + key tourists.
export const HUB_CITY_SLUGS = new Set([
  // Major hubs — highest search volume
  'kolkata', 'ranchi', 'jamshedpur', 'bhubaneswar', 'patna',
  // Secondary hubs — still have real outstation search demand
  'siliguri', 'dhanbad', 'durgapur', 'asansol', 'howrah',
  // Tourist destination hubs — high cab search volume
  'darjeeling', 'puri', 'digha', 'deoghar',
]);

// ─── Important tourist destinations — routes TO these from anywhere are indexable ───
// Kept smaller and stricter than before — only cities with proven cab search intent
export const POPULAR_DESTINATION_SLUGS = new Set([
  // WB tourist highlights (nationally searched)
  'darjeeling', 'digha', 'mandarmani', 'gangasagar', 'mayapur',
  'bishnupur', 'bolpur-shantiniketan', 'sundarbans', 'bakkhali',
  // WB urban — significant cab search volume
  'durgapur', 'asansol', 'kharagpur', 'haldia', 'bardhaman',
  'howrah', 'kolkata-airport', 'barasat', 'kalyani',
  // Jharkhand — popular religious & nature destinations
  'deoghar', 'netarhat', 'hazaribagh', 'giridih', 'bokaro',
  // Odisha — high tourist cab demand
  'puri', 'konark', 'cuttack', 'rourkela', 'chilika', 'berhampur',
  // Bihar — pilgrimage destinations
  'bodh-gaya', 'gaya', 'nalanda', 'rajgir',
  // UP — major pilgrimage/tourist
  'varanasi', 'prayagraj',
]);

export type RouteTier = 'tier1' | 'tier2' | 'tier3';

/**
 * Returns the SEO tier for a route.
 *
 * Tier 1: Hub-to-hub, hub-to-popular, or popular-to-hub — Always index
 * Tier 2: ≤150km and neither city is a hub — Still locally relevant, index
 * Tier 3: Long-distance (>150km), both cities non-hub — noindex (save crawl budget)
 */
export function getRouteTier(route: Route): RouteTier {
  const fromHub = HUB_CITY_SLUGS.has(route.from);
  const toHub = HUB_CITY_SLUGS.has(route.to);
  const fromPopular = POPULAR_DESTINATION_SLUGS.has(route.from);
  const toPopular = POPULAR_DESTINATION_SLUGS.has(route.to);

  // Tier 1: Hub or popular destination involved
  if (fromHub || toHub || fromPopular || toPopular) return 'tier1';

  // Tier 2: Short distance routes — still locally searched even between small cities
  if (route.distance > 0 && route.distance <= 150) return 'tier2';

  // Tier 3: Long-distance, both cities non-hub, non-popular — thin content
  return 'tier3';
}

/**
 * Returns true if the route should be indexed by Google.
 * Tier 3 routes get noindex to prevent crawl budget waste.
 */
export function shouldIndexRoute(route: Route): boolean {
  return getRouteTier(route) !== 'tier3';
}

/**
 * Returns the sitemap priority for a route (0.0–1.0).
 */
export function getRouteSitemapPriority(route: Route): number {
  const tier = getRouteTier(route);

  // Reverse hub routes (from popular dest back to hub) deserve highest priority
  const REVERSE_HUB_ROUTES = new Set([
    'ranchi-to-kolkata', 'jamshedpur-to-kolkata', 'bhubaneswar-to-kolkata',
    'siliguri-to-kolkata', 'dhanbad-to-kolkata', 'puri-to-kolkata',
    'deoghar-to-ranchi', 'bokaro-to-ranchi', 'hazaribagh-to-ranchi',
    'deoghar-to-kolkata', 'darjeeling-to-kolkata', 'durgapur-to-kolkata',
    'asansol-to-kolkata', 'ranchi-to-jamshedpur', 'jamshedpur-to-ranchi',
    'bokaro-to-kolkata', 'dhanbad-to-ranchi', 'giridih-to-ranchi',
    'hazaribagh-to-kolkata', 'cuttack-to-bhubaneswar', 'puri-to-bhubaneswar',
    'rourkela-to-bhubaneswar', 'konark-to-bhubaneswar', 'kolkata-to-ranchi',
    'kolkata-to-jamshedpur', 'kolkata-to-puri', 'kolkata-to-darjeeling',
    'kolkata-to-siliguri', 'kolkata-to-bhubaneswar', 'kolkata-to-deoghar',
    'kolkata-to-digha', 'kolkata-to-mandarmani', 'kolkata-to-durgapur',
    'kolkata-to-asansol', 'kolkata-to-kharagpur', 'kolkata-to-haldia',
  ]);

  if (REVERSE_HUB_ROUTES.has(route.slug)) return 0.95;
  if (tier === 'tier1') return 0.88;
  if (tier === 'tier2') return 0.65;
  return 0.40; // tier3 — not in sitemap, but priority if included
}

/**
 * Returns true if this route should appear in the sitemap at all.
 * Tier 3 routes are excluded from the sitemap to concentrate crawl budget.
 */
export function shouldIncludeInSitemap(route: Route): boolean {
  return getRouteTier(route) !== 'tier3';
}
