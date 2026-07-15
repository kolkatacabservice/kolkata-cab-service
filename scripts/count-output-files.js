/**
 * scripts/count-output-files.js
 *
 * Counts the total number of files in .vercel/output/static after a
 * `@cloudflare/next-on-pages` build and warns if close to the 20,000-file limit.
 *
 * Usage: node scripts/count-output-files.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../.vercel/output/static');
const CF_PAGES_LIMIT = 20000;
const WARNING_THRESHOLD = 0.8; // Warn at 80% of limit

function countFilesRecursively(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFilesRecursively(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

if (!fs.existsSync(OUTPUT_DIR)) {
  console.error(`ERROR: Output directory not found: ${OUTPUT_DIR}`);
  console.error('Run `npm run build && npx @cloudflare/next-on-pages` first.');
  process.exit(1);
}

const totalFiles = countFilesRecursively(OUTPUT_DIR);
const percentage = ((totalFiles / CF_PAGES_LIMIT) * 100).toFixed(1);
const remaining = CF_PAGES_LIMIT - totalFiles;

console.log('\n── Cloudflare Pages File Count Report ──────────────────────');
console.log(`  Output directory : ${OUTPUT_DIR}`);
console.log(`  Total files      : ${totalFiles.toLocaleString()}`);
console.log(`  CF Pages limit   : ${CF_PAGES_LIMIT.toLocaleString()}`);
console.log(`  Usage            : ${percentage}%`);
console.log(`  Remaining budget : ${remaining.toLocaleString()} files`);
console.log('─────────────────────────────────────────────────────────────');

if (totalFiles > CF_PAGES_LIMIT) {
  console.error(`\n❌ EXCEEDS LIMIT by ${(totalFiles - CF_PAGES_LIMIT).toLocaleString()} files!`);
  console.error('   Reduce generateStaticParams() counts further or remove unused pages.');
  process.exit(1);
} else if (totalFiles > CF_PAGES_LIMIT * WARNING_THRESHOLD) {
  console.warn(`\n⚠  Warning: Using ${percentage}% of the limit. Consider reducing pre-renders.`);
} else {
  console.log('\n✅ Within Cloudflare Pages free-tier file limit.\n');
}
