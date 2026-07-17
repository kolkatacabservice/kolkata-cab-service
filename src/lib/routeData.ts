/**
 * src/lib/routeData.ts
 *
 * Route data helpers — Cloudflare Workers optimized.
 *
 * This version uses pre-compiled dynamic imports of 20KB city shards,
 * keeping Workers CPU time well under the 10ms limit without any external fetch dependencies.
 */
import 'server-only';
import { Route } from './data';
import { getCityRouteShard } from './cityRouteShards';
import { getCityRouteToShard } from './cityRouteToShards';

// Memory cache for shards loaded during the current request lifecycle.
const SHARD_CACHE = new Map<string, Route[]>();

async function getShard(shardName: string): Promise<Route[]> {
  const cached = SHARD_CACHE.get(shardName);
  if (cached) return cached;

  let shardData: Route[];
  switch (shardName) {
    case 'west-bengal':
      shardData = (await import('@/data/routes-west-bengal.json')).default as unknown as Route[];
      break;
    case 'jharkhand':
      shardData = (await import('@/data/routes-jharkhand.json')).default as unknown as Route[];
      break;
    case 'odisha':
      shardData = (await import('@/data/routes-odisha.json')).default as unknown as Route[];
      break;
    case 'bihar':
      shardData = (await import('@/data/routes-bihar.json')).default as unknown as Route[];
      break;
    case 'uttar-pradesh':
      shardData = (await import('@/data/routes-uttar-pradesh.json')).default as unknown as Route[];
      break;
    case 'cross-wb':
      shardData = (await import('@/data/routes-cross-wb.json')).default as unknown as Route[];
      break;
    case 'cross-jh':
      shardData = (await import('@/data/routes-cross-jh.json')).default as unknown as Route[];
      break;
    case 'cross-od':
      shardData = (await import('@/data/routes-cross-od.json')).default as unknown as Route[];
      break;
    default:
      shardData = (await import('@/data/routes-cross-other.json')).default as unknown as Route[];
  }

  SHARD_CACHE.set(shardName, shardData);
  return shardData;
}

// Get routes starting from a state (both intra-state and cross-state)
// Load all shards (mainly for static build-time sitemaps)
async function getAllRoutesInternal(): Promise<Route[]> {
  const shards = ['west-bengal', 'jharkhand', 'odisha', 'bihar', 'uttar-pradesh', 'cross-wb', 'cross-jh', 'cross-od', 'cross-other'];
  const all: Route[] = [];
  for (const s of shards) {
    all.push(...(await getShard(s)));
  }
  return all;
}

// ─── Public async helpers ─────────────────────────────────────────────────────

export async function getAllRoutes(): Promise<Route[]> {
  return getAllRoutesInternal();
}

/** O(1) city shard load + cheap O(n) find over ~117 routes */
export async function getRoute(slug: string): Promise<Route | undefined> {
  const parts = slug.split('-to-');
  if (parts.length !== 2) return undefined;
  const fromCity = parts[0];
  const routes = await getCityRouteShard(fromCity);
  return routes.find(r => r.slug === slug);
}

/** Loads only the relevant city shard (~117 routes) */
export async function getRoutesFrom(citySlug: string): Promise<Route[]> {
  return getCityRouteShard(citySlug);
}

/** Loads only the relevant city shard (~117 routes) */
export async function getRoutesTo(citySlug: string): Promise<Route[]> {
  return getCityRouteToShard(citySlug);
}

export async function getRoutesBetweenStates(fromState: string, toState: string): Promise<Route[]> {
  if (fromState === toState) {
    return getShard(fromState);
  }
  let shardName = '';
  if (fromState === 'west-bengal') shardName = 'cross-wb';
  else if (fromState === 'jharkhand') shardName = 'cross-jh';
  else if (fromState === 'odisha') shardName = 'cross-od';
  else shardName = 'cross-other';

  const routes = await getShard(shardName);
  return routes.filter(r => r.fromState === fromState && r.toState === toState);
}

/** Uses pre-calculated popular-routes.json to avoid request-time overhead */
export async function getPopularRoutes(limit = 12): Promise<Route[]> {
  const popular = (await import('@/data/popular-routes.json')).default as unknown as Route[];
  return popular.slice(0, limit);
}

export async function getLocalRoutes(citySlug: string, maxDistance = 200): Promise<Route[]> {
  const routes = await getCityRouteShard(citySlug);
  return routes
    .filter(r => r.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

export async function getPopularLocalRoutes(citySlug: string, limit = 8): Promise<Route[]> {
  const routes = await getCityRouteShard(citySlug);
  return routes
    .filter(r => r.distance <= 250 && r.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

export async function getAllRouteSlugs(): Promise<string[]> {
  const all = await getAllRoutesInternal();
  return all.map(r => r.slug);
}

export async function getHighPriorityRoutes(): Promise<Route[]> {
  const all = await getAllRoutesInternal();
  const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
  return all.filter(r =>
    r.distance <= 250 || hubSlugs.has(r.from) || hubSlugs.has(r.to)
  );
}

export async function getLinkedRouteSlugs(): Promise<string[]> {
  const all = await getAllRoutesInternal();
  const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
  const seen = new Set<string>();

  all.forEach(r => {
    if (r.distance <= 250 || hubSlugs.has(r.from) || hubSlugs.has(r.to)) {
      seen.add(r.slug);
    }
  });

  const routesByCity = new Map<string, Route[]>();
  for (const route of all) {
    const list = routesByCity.get(route.from) ?? [];
    list.push(route);
    routesByCity.set(route.from, list);
  }
  for (const [, cityRoutes] of routesByCity) {
    cityRoutes.slice(0, 20).forEach(r => seen.add(r.slug));
    cityRoutes
      .filter(r => r.distance <= 250 && r.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 12)
      .forEach(r => seen.add(r.slug));
  }

  const finalSlugs = new Set<string>(seen);
  for (const slug of seen) {
    const parts = slug.split('-to-');
    if (parts.length === 2) {
      const reverseSlug = `${parts[1]}-to-${parts[0]}`;
      const hasReverse = all.some(r => r.slug === reverseSlug);
      if (hasReverse) finalSlugs.add(reverseSlug);
    }
  }
  return Array.from(finalSlugs);
}

export async function getLinkedVehicleRouteSlugs(): Promise<string[]> {
  const linked = await getLinkedRouteSlugs();
  return linked.filter(isHubRoute);
}

// ─── Pure synchronous helpers (no route data access needed) ───────────────────

export function isHubRoute(slug: string): boolean {
  const parts = slug.split('-to-');
  if (parts.length === 2) {
    const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
    return hubSlugs.has(parts[0]) || hubSlugs.has(parts[1]);
  }
  return false;
}
