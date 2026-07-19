/**
 * custom-incremental-cache.ts
 *
 * A drop-in replacement for @opennextjs/cloudflare's staticAssetsIncrementalCache
 * that stores cache files under `_next_cache/` instead of `cdn-cgi/_next_cache/`.
 *
 * WHY THIS EXISTS:
 * Cloudflare intercepts all requests to the `/cdn-cgi/` namespace at the CDN layer
 * before they reach the Worker's ASSETS binding. This means `ASSETS.fetch()` calls
 * to `http://assets.local/cdn-cgi/_next_cache/...` always fail silently, causing
 * every cache lookup to return null (MISS). Pages with `dynamicParams = false` then
 * return 404 instead of the pre-rendered HTML.
 *
 * FIX: Use `_next_cache/` as the cache directory so ASSETS.fetch() can actually
 * retrieve the files from Workers Static Assets.
 *
 * PAIRED WITH:
 * - scripts/copy-cache.js: Copies .open-next/cache/ → .open-next/assets/_next_cache/
 * - scripts/inject-static-route-cache.js: Injects pre-rendered HTML into .open-next/cache/
 */

// Cache directory — must NOT start with cdn-cgi/ (Cloudflare intercepts that namespace)
const CACHE_DIR = "_next_cache";
const FALLBACK_BUILD_ID = "no-build-id";

// Access the cloudflare context symbol to get env.ASSETS
const CLOUDFLARE_CTX_SYMBOL = Symbol.for("__cloudflare-context__");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAssets(): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (globalThis as any)[CLOUDFLARE_CTX_SYMBOL];
  return ctx?.env?.ASSETS ?? null;
}

function getAssetUrl(key: string, cacheType: string): string {
  if (cacheType === "composable") {
    throw new Error("Composable cache is not supported in static assets incremental cache");
  }

  const buildId = process.env.OPEN_NEXT_BUILD_ID ?? FALLBACK_BUILD_ID;
  const name = (
    cacheType === "fetch"
      ? `${CACHE_DIR}/__fetch/${buildId}/${key}`
      : `${CACHE_DIR}/${buildId}/${key}.cache`
  ).replace(/\/+/g, "/");

  return `http://assets.local/${name}`;
}

const customStaticAssetsIncrementalCache = {
  name: "custom-static-assets-incremental-cache",

  async get(key: string, cacheType: string) {
    const assets = getAssets();
    const buildId = process.env.OPEN_NEXT_BUILD_ID ?? FALLBACK_BUILD_ID;
    console.log(`[CacheGet] Key: ${key}, CacheType: ${cacheType}, BuildID: ${buildId}`);
    if (!assets) {
      console.warn('[CacheGet] WARNING: ASSETS binding is not available!');
      return null;
    }

    try {
      const url = getAssetUrl(key, cacheType);
      console.log(`[CacheGet] Fetching: ${url}`);
      const response = await assets.fetch(url);
      console.log(`[CacheGet] Response OK: ${response.ok}, Status: ${response.status}`);

      if (!response.ok) {
        await response.body?.cancel();
        return null;
      }

      const val = await response.json();
      console.log(`[CacheGet] Successfully loaded JSON from cache for ${key}`);
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: val as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lastModified: (globalThis as any).__BUILD_TIMESTAMP_MS__ ?? Date.now(),
      };
    } catch (err) {
      console.error(`[CacheGet] ERROR fetching from static assets:`, err);
      return null;
    }
  },

  async set(key: string, value: unknown, cacheType: string) {
    const assets = getAssets();
    if (!assets) {
      console.warn('[CustomStaticAssetsIncrementalCache] ASSETS binding not available for set');
      return;
    }

    try {
      const url = getAssetUrl(key, cacheType);
      const response = new Response(JSON.stringify(value), {
        headers: { 'Content-Type': 'application/json' },
      });
      const cachedResponse = new Response(response.body, {
        headers: response.headers,
      });
      await assets.set(url, cachedResponse);
      console.log(`[CustomStaticAssetsIncrementalCache] Successfully set cache for ${key}`);
    } catch (err) {
      console.error(`[CustomStaticAssetsIncrementalCache] ERROR setting cache for ${key}:`, err);
    }
  },

  async delete(_key: string) {
    console.error("CustomStaticAssetsIncrementalCache: Failed to delete from read-only cache");
  },
};

export default customStaticAssetsIncrementalCache;
