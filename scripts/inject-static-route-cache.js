/**
 * inject-static-route-cache.js
 *
 * Converts ALL statically pre-rendered HTML files from .next/server/app/
 * into open-next .cache format and injects them into .open-next/cache/<buildId>/.
 *
 * WHY THIS EXISTS:
 * Next.js App Router generates static HTML for all pre-rendered pages in .next/server/app/.
 * However, @opennextjs/cloudflare only copies pages rendered dynamically during build
 * into .open-next/cache. Static pages (force-static) are NOT included — meaning when
 * Cloudflare receives a request, it finds no cache, falls through to the Worker JS runtime,
 * consumes CPU, and hits the 10ms Free Tier limit → Error 1102 / 503.
 *
 * FIX: This script walks ALL of .next/server/app/ recursively, finds every .html + .meta
 * pair, and writes them as .cache files into .open-next/cache/<buildId>/ at the exact
 * matching path. After copy-cache.js runs, every page (routes, cities, fleet, services,
 * tours, blog, etc.) exists in .open-next/assets/cdn-cgi/_next_cache/ and is served
 * directly from CDN with 0ms Worker CPU usage — permanently eliminating 1102 errors.
 *
 * COVERAGE:
 * - /routes/<slug>            → 13,808 pages
 * - /routes/<slug>/<vehicle>  → 1,200 pages (hub routes × 4 vehicles)
 * - /west-bengal, /jharkhand, /odisha, /bihar  → state pages
 * - /west-bengal/<city>, /jharkhand/<city>, etc. → city pages
 * - /west-bengal/<city>/outstation|one-way|airport-transfer|etc. → city service pages
 * - /fleet, /services/*, /tours/*, /blog/*
 * - /kolkata/<area> → Kolkata area pages
 * - All other static pages (home, about, faq, contact, privacy, terms, etc.)
 *
 * USAGE: Run AFTER opennextjs-cloudflare build, BEFORE copy-cache.js
 * (Already wired into package.json build:cf script)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NEXT_APP_DIR = path.join(ROOT, '.next/server/app');
const OPEN_NEXT_CACHE_DIR = path.join(ROOT, '.open-next/cache');

// ─── Skip non-page files and internal Next.js files ──────────────────────────
const SKIP_EXTENSIONS = new Set(['.js', '.nft.json', '.rsc', '.meta', '.body', '.txt']);
const SKIP_NAMES = new Set(['page.js', 'page_client-reference-manifest.js', 'page.js.nft.json']);

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

// ─── Walk .next/server/app recursively, collect all .html files ───────────────
function collectHtmlFiles(dir, relBase = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      // Skip internal Next.js directories
      if (entry.startsWith('_') && entry !== '_not-found') continue;
      // Recurse into subdirectories (these are URL path segments)
      const subRel = relBase ? `${relBase}/${entry}` : entry;
      results.push(...collectHtmlFiles(fullPath, subRel));
    } else if (entry.endsWith('.html')) {
      // This is a pre-rendered page
      const slug = entry.slice(0, -5); // remove .html
      const cacheKey = relBase ? `${relBase}/${slug}` : slug;
      const metaPath = path.join(dir, `${slug}.meta`);
      results.push({
        cacheKey,  // relative path like "routes/kolkata-to-siliguri" or "west-bengal/kolkata"
        htmlPath: fullPath,
        metaPath,
      });
    }
  }
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('[inject-static-cache] Starting full-site static cache injection...');
  console.time('[inject-static-cache] Total time');

  const buildCacheDir = getBuildIdFolder();
  const buildId = path.basename(buildCacheDir);
  console.log(`[inject] Build ID: ${buildId}`);

  if (!fs.existsSync(NEXT_APP_DIR)) {
    console.error(`[inject] ERROR: .next/server/app not found. Run \`next build\` first.`);
    process.exit(1);
  }

  const allFiles = collectHtmlFiles(NEXT_APP_DIR);
  console.log(`[inject] Found ${allFiles.length} static HTML pages to inject.`);

  let injected = 0;
  let skipped = 0;
  let errors = 0;

  for (const { cacheKey, htmlPath, metaPath } of allFiles) {
    try {
      const cacheFilePath = path.join(buildCacheDir, `${cacheKey}.cache`);
      const cacheDir = path.dirname(cacheFilePath);

      // Ensure parent directory exists
      fs.mkdirSync(cacheDir, { recursive: true });

      // Read HTML
      const html = fs.readFileSync(htmlPath, 'utf8');

      // Read RSC payload (crucial for Next.js 15 App Router hydration)
      const rscPath = htmlPath.slice(0, -5) + '.rsc';
      let rsc = '';
      if (fs.existsSync(rscPath)) {
        try {
          rsc = fs.readFileSync(rscPath, 'utf8');
        } catch (err) {
          console.warn(`[inject] Warning: Failed to read RSC for ${cacheKey}: ${err.message}`);
        }
      }

      // Read meta (headers) if available
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
          // Use default meta if parse fails
        }
      }

      // Build the .cache file in open-next/staticAssetsIncrementalCache format
      const cacheEntry = JSON.stringify({ type: 'app', meta, html, rsc });
      fs.writeFileSync(cacheFilePath, cacheEntry, 'utf8');
      injected++;

      if (injected % 2000 === 0) {
        console.log(`[inject] Progress: ${injected}/${allFiles.length} injected...`);
      }
    } catch (err) {
      console.error(`[inject] ERROR processing ${cacheKey}:`, err.message);
      errors++;
    }
  }

  console.log(`\n[inject] ✅ Done!`);
  console.log(`[inject]   Injected: ${injected}`);
  console.log(`[inject]   Skipped (already existed): ${skipped}`);
  console.log(`[inject]   Errors: ${errors}`);
  console.log(`[inject]   Cache dir: ${buildCacheDir}`);
  console.timeEnd('[inject-static-cache] Total time');
}

main();
