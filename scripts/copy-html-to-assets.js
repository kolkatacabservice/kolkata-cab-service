/**
 * copy-html-to-assets.js
 *
 * Copies ALL pre-rendered HTML files from .next/server/app/ directly into
 * .open-next/assets/ at the correct URL paths (e.g., /about.html, /routes/kolkata-to-siliguri.html).
 *
 * WHY THIS EXISTS:
 * The Worker 1102 error happens because every HTML page request goes through the
 * full Worker pipeline (middleware init + server handler + cache lookup), consuming
 * CPU time. By placing raw HTML files in the assets directory, the patched worker.js
 * can serve them directly via ASSETS.fetch() — bypassing middleware and server
 * entirely, reducing CPU usage to near-zero for static pages.
 *
 * USAGE: Run AFTER opennextjs-cloudflare build, AFTER inject-static-route-cache.js
 * (Already wired into package.json build:cf script)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NEXT_APP_DIR = path.join(ROOT, '.next/server/app');
const ASSETS_DIR = path.join(ROOT, '.open-next/assets');

// Skip non-page files
const SKIP_EXTENSIONS = new Set(['.js', '.nft.json', '.rsc', '.meta', '.body', '.txt']);

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
      const slug = entry.slice(0, -5);
      const cacheKey = relBase ? `${relBase}/${slug}` : slug;
      results.push({ cacheKey, htmlPath: fullPath });
    }
  }
  return results;
}

function main() {
  console.log('[copy-html-to-assets] Starting...');
  console.time('[copy-html-to-assets] Total time');

  if (!fs.existsSync(NEXT_APP_DIR)) {
    console.error('[copy-html-to-assets] ERROR: .next/server/app not found. Run `next build` first.');
    process.exit(1);
  }

  const allFiles = collectHtmlFiles(NEXT_APP_DIR);
  console.log(`[copy-html-to-assets] Found ${allFiles.length} static HTML pages.`);

  let copied = 0;
  let errors = 0;

  for (const { cacheKey, htmlPath } of allFiles) {
    try {
      const destPath = path.join(ASSETS_DIR, `${cacheKey}.html`);
      const destDir = path.dirname(destPath);

      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(htmlPath, destPath);
      copied++;

      if (copied % 2000 === 0) {
        console.log(`[copy-html-to-assets] Progress: ${copied}/${allFiles.length}...`);
      }
    } catch (err) {
      console.error(`[copy-html-to-assets] ERROR copying ${cacheKey}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n[copy-html-to-assets] Done!`);
  console.log(`  Copied: ${copied}`);
  console.log(`  Errors: ${errors}`);
  console.timeEnd('[copy-html-to-assets] Total time');
}

main();
