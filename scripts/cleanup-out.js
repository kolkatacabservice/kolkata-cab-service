/**
 * scripts/cleanup-out.js
 *
 * Postbuild cleanup for Cloudflare Pages free tier (20,000 file limit).
 * Removes Next.js RSC payload .txt files from ./out/ SUBDIRECTORIES ONLY —
 * they are only needed for client-side navigation in ISR mode, which we don't use.
 *
 * IMPORTANT: We must NOT delete root-level .txt files such as:
 *   - robots.txt  (critical for Google indexing — 404 = total SEO failure)
 *   - *.txt       (IndexNow API key files)
 *
 * RSC payload .txt files live in subdirectories (e.g. out/routes/*.txt),
 * never at the root level, so skipping root-level .txt is safe.
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
let removedCount = 0;

// Root-level .txt files that MUST be preserved (never delete these)
const PRESERVE_ROOT_TXT = new Set([
  'robots.txt',
]);

function cleanDir(dir, isRoot = false) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      cleanDir(fullPath, false); // Never root after first level
    } else if (entry.name.endsWith('.txt')) {
      // At root level: preserve robots.txt and any IndexNow key files
      if (isRoot && (PRESERVE_ROOT_TXT.has(entry.name) || /^[a-f0-9]{32}\.txt$/.test(entry.name))) {
        console.log(`  ✅ Preserved root-level: ${entry.name}`);
        continue;
      }
      try {
        fs.unlinkSync(fullPath);
        removedCount++;
      } catch {
        // ignore — file may already be gone
      }
    }
  }
}

console.log('🧹 Cleaning ./out/ — removing RSC payload .txt files (preserving root-level .txt)...');
cleanDir(OUT_DIR, true);

// Verify robots.txt survived
const robotsPath = path.join(OUT_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ CRITICAL: robots.txt missing from out/ — Google cannot crawl the site!');
  console.error('   Run: node scripts/generate-static-files.js  then  next build  again.');
  process.exit(1);
} else {
  console.log('✅ robots.txt verified present in out/');
}

const remaining = countFiles(OUT_DIR);
console.log(`✅ Removed ${removedCount} RSC .txt files. Total files remaining: ${remaining}`);

if (remaining > 20000) {
  console.warn(`⚠️  WARNING: ${remaining} files in ./out/ — exceeds Cloudflare Pages 20,000 limit!`);
  console.warn('   Deploy will fail. Reduce pages in generateStaticParams() or increase hub route limit.');
  process.exit(1); // Fail the build so the issue is caught early
} else {
  console.log('✅ File count OK — within Cloudflare Pages 20,000 limit.');
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}
