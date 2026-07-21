const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../out');

// Known static pages in root that Next.js exports as both .html and .txt (RSC payload)
const ROOT_PAGES_TO_CLEAN = new Set([
  'about.txt',
  'contact.txt',
  'faq.txt',
  'fleet.txt',
  'fare-chart.txt',
  'privacy-policy.txt',
  'terms.txt',
  'services.txt',
  'tours.txt',
  'kolkata-cab-vs-ola-uber.txt',
  'jamshedpur-to-kolkata-cab.txt',
  'kolkata-to-jamshedpur-cab.txt',
  'bihar.txt',
  'jharkhand.txt',
  'odisha.txt',
  'west-bengal.txt',
  'uttar-pradesh.txt',
  'blog.txt',
  'index.txt'
]);

function cleanTxtFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      cleanTxtFiles(fullPath);
    } else if (entry.endsWith('.txt')) {
      const relativePath = path.relative(OUT_DIR, fullPath);
      const isSubdir = relativePath.includes('/') || relativePath.includes('\\');

      if (isSubdir) {
        // All .txt files inside subdirectories (like routes/ or west-bengal/) are RSC payloads. Safe to delete.
        fs.unlinkSync(fullPath);
      } else {
        // If in root, only delete if it matches a known page name (avoiding robots.txt and domain verifications)
        if (ROOT_PAGES_TO_CLEAN.has(entry)) {
          fs.unlinkSync(fullPath);
        } else {
          console.log(`[clean-rsc-txt] Keeping root verification/config file: ${entry}`);
        }
      }
    }
  }
}

console.log('[clean-rsc-txt] Cleaning Next.js RSC payload .txt files from out/...');
const timeStart = Date.now();
cleanTxtFiles(OUT_DIR);
const duration = ((Date.now() - timeStart) / 1000).toFixed(2);
console.log(`[clean-rsc-txt] ✅ Done in ${duration}s!`);
