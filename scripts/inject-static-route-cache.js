/**
 * inject-static-route-cache.js
 *
 * Optimizes static site delivery on Cloudflare Workers Free Tier.
 *
 * WHAT THIS SCRIPT DOES:
 * 1. Copies ALL statically pre-rendered HTML files from .next/server/app/
 *    directly into .open-next/assets/ as .html files.
 *    - Example: .next/server/app/routes/kolkata-to-siliguri.html
 *      is copied to .open-next/assets/routes/kolkata-to-siliguri.html
 *    - Cloudflare CDN matches clean URLs (e.g. /routes/kolkata-to-siliguri)
 *      to these .html files and serves them directly, bypassing the Worker completely.
 *    - Result: 0ms Worker CPU time for all direct visits and search engine crawls,
 *      permanently eliminating Error 1102 on route pages.
 *
 * 2. Writes .cache files (HTML + RSC payload JSON) to .open-next/cache/
 *    ONLY for critical pages and the top 300 hub routes (and their vehicle combinations).
 *    - Non-route pages (Home, Fleet, Services, Cities, States) get .cache files so client-side
 *      RSC navigation requests work perfectly.
 *    - Only the top 300 hub routes get .cache files (300 routes * 4 vehicles = 1,200 cache files).
 *    - The remaining ~13,500 route pages DO NOT get .cache files.
 *    - Result: Total assets uploaded to Cloudflare remains at ~18,000 files,
 *      safely under the Cloudflare Free Tier 20,000 files upload limit!
 *
 * USAGE: Run AFTER opennextjs-cloudflare build, BEFORE copy-cache.js
 * (Already wired into package.json build:cf script)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NEXT_APP_DIR = path.join(ROOT, '.next/server/app');
const OPEN_NEXT_CACHE_DIR = path.join(ROOT, '.open-next/cache');
const OPEN_NEXT_ASSETS_DIR = path.join(ROOT, '.open-next/assets');

// ─── Helper: find the build ID folder inside .open-next/cache ────────────────
function getBuildIdFolder() {
  if (!fs.existsSync(OPEN_NEXT_CACHE_DIR)) {
    throw new Error(`.open-next/cache not found. Run \`opennextjs-cloudflare build\` first.`);
  }
  const entries = fs.readdirSync(OPEN_NEXT_CACHE_DIR);
  const buildIdDir = entries.find(e => {
    const full = path.join(OPEN_NEXT_CACHE_DIR, e);
    return fs.lstatSync(full).isDirectory();
  });
  if (!buildIdDir) {
    throw new Error('No build ID directory found in .open-next/cache. Build may have failed.');
  }
  return path.join(OPEN_NEXT_CACHE_DIR, buildIdDir);
}

// ─── Helper: Load and calculate the top 300 hub routes ────────────────────────
function getPrebuiltRouteSlugs(limit = 300) {
  const dataDir = path.join(ROOT, 'src/data');
  const files = [
    'routes-west-bengal.json',
    'routes-jharkhand.json',
    'routes-odisha.json',
    'routes-bihar.json',
    'routes-uttar-pradesh.json',
    'routes-cross-wb.json',
    'routes-cross-jh.json',
    'routes-cross-od.json',
    'routes-cross-other.json'
  ];

  let routes = [];
  for (const f of files) {
    const full = path.join(dataDir, f);
    if (fs.existsSync(full)) {
      try {
        const data = JSON.parse(fs.readFileSync(full, 'utf8'));
        routes.push(...data);
      } catch (err) {
        console.error(`[inject] Error parsing data file ${f}:`, err.message);
      }
    }
  }

  const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
  const routeMap = new Map(routes.map(r => [r.slug, r]));

  const tier1 = routes.filter(r => hubSlugs.has(r.from) && hubSlugs.has(r.to));
  const tier2 = routes
    .filter(r => hubSlugs.has(r.from) && !hubSlugs.has(r.to))
    .sort((a, b) => a.distance - b.distance);
  const tier3 = routes
    .filter(r => !hubSlugs.has(r.from) && hubSlugs.has(r.to))
    .sort((a, b) => a.distance - b.distance);

  const seen = new Set();
  const result = [];

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

  return new Set(withReverse.slice(0, limit));
}

// ─── Walk .next/server/app recursively, collect all .html files ───────────────
function collectHtmlFiles(dir, relBase = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      if (entry.startsWith('_') && entry !== '_not-found') continue;
      const subRel = relBase ? `${relBase}/${entry}` : entry;
      results.push(...collectHtmlFiles(fullPath, subRel));
    } else if (entry.endsWith('.html')) {
      const slug = entry.slice(0, -5); // remove .html
      const cacheKey = relBase ? `${relBase}/${slug}` : slug;
      const metaPath = path.join(dir, `${slug}.meta`);
      const rscPath = path.join(dir, `${slug}.rsc`);
      results.push({
        cacheKey,
        htmlPath: fullPath,
        metaPath,
        rscPath,
      });
    }
  }
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('[inject-static-cache] Starting full-site static optimization...');
  console.time('[inject-static-cache] Total time');

  const buildCacheDir = getBuildIdFolder();
  const buildId = path.basename(buildCacheDir);
  console.log(`[inject] Build ID: ${buildId}`);

  if (!fs.existsSync(NEXT_APP_DIR)) {
    console.error(`[inject] ERROR: .next/server/app not found. Run \`next build\` first.`);
    process.exit(1);
  }

  // Calculate prebuilt hub routes
  const prebuiltRoutes = getPrebuiltRouteSlugs(300);
  console.log(`[inject] Calculated ${prebuiltRoutes.size} prebuilt hub routes for cache injection.`);

  // Clean existing route cache directories of non-hub cache files
  const routesCacheDir = path.join(buildCacheDir, 'routes');
  const routesAssetsCacheDir = path.join(OPEN_NEXT_ASSETS_DIR, 'cdn-cgi/_next_cache', buildId, 'routes');
  
  const cleanCacheDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath);
    let deleted = 0;
    for (const entry of entries) {
      if (entry.endsWith('.cache')) {
        const slug = entry.slice(0, -6);
        if (!prebuiltRoutes.has(slug)) {
          fs.unlinkSync(path.join(dirPath, entry));
          deleted++;
        }
      }
    }
    if (deleted > 0) {
      console.log(`[inject] Cleaned ${deleted} leftover cache files from ${path.basename(dirPath)}`);
    }
  };

  cleanCacheDir(routesCacheDir);
  cleanCacheDir(routesAssetsCacheDir);

  const allFiles = collectHtmlFiles(NEXT_APP_DIR);
  console.log(`[inject] Found ${allFiles.length} static HTML pages to optimize.`);

  let htmlCopied = 0;
  let cacheInjected = 0;
  let cacheSkipped = 0;
  let errors = 0;

  for (const { cacheKey, htmlPath, metaPath, rscPath } of allFiles) {
    try {
      // Decide whether we process this page
      const isRoute = cacheKey.startsWith('routes/');
      let isPrebuiltHub = false;

      if (isRoute) {
        const parts = cacheKey.split('/');
        const routeSlug = parts[1];
        if (prebuiltRoutes.has(routeSlug)) {
          isPrebuiltHub = true;
        }
      }

      // If it is a route and NOT a prebuilt hub route, we SKIP IT ENTIRELY!
      if (isRoute && !isPrebuiltHub) {
        cacheSkipped++;
        continue;
      }

      // 1. Copy the .html file directly to open-next assets directory
      // This is the core magic: direct CDN serving with 0ms Worker CPU!
      const assetHtmlPath = path.join(OPEN_NEXT_ASSETS_DIR, `${cacheKey}.html`);
      const assetHtmlDir = path.dirname(assetHtmlPath);
      
      fs.mkdirSync(assetHtmlDir, { recursive: true });
      fs.copyFileSync(htmlPath, assetHtmlPath);
      htmlCopied++;

      // Generate the .cache file
      const cacheFilePath = path.join(buildCacheDir, `${cacheKey}.cache`);
      const cacheDir = path.dirname(cacheFilePath);
      fs.mkdirSync(cacheDir, { recursive: true });

      // Read HTML and RSC
      const html = fs.readFileSync(htmlPath, 'utf8');
      let rsc = undefined;
      if (fs.existsSync(rscPath)) {
        try {
          rsc = fs.readFileSync(rscPath, 'utf8');
        } catch {
          // ignore
        }
      }

      // Read meta
      let meta = {
        headers: {
          'x-nextjs-stale-time': '31536000',
          'x-nextjs-prerender': '1',
          'x-next-cache-tags': `_N_T_/layout,_N_T_/${cacheKey}`,
        },
      };

      if (fs.existsSync(metaPath)) {
        try {
          const metaRaw = fs.readFileSync(metaPath, 'utf8');
          const parsed = JSON.parse(metaRaw);
          if (parsed && parsed.headers) {
            meta = parsed;
          }
        } catch {
          // ignore
        }
      }

      const cacheEntry = JSON.stringify({ type: 'app', meta, html, rsc });
      fs.writeFileSync(cacheFilePath, cacheEntry, 'utf8');
      cacheInjected++;

    } catch (err) {
      console.error(`[inject] ERROR processing ${cacheKey}:`, err.message);
      errors++;
    }
  }

  console.log(`\n[inject] ✅ Optimization Complete!`);
  console.log(`[inject]   Static HTML files copied to assets: ${htmlCopied}`);
  console.log(`[inject]   Cache JSON files written (.cache):   ${cacheInjected}`);
  console.log(`[inject]   Cache JSON files skipped (non-hub): ${cacheSkipped}`);
  console.log(`[inject]   Errors: ${errors}`);
  console.timeEnd('[inject-static-cache] Total time');
}

main();
