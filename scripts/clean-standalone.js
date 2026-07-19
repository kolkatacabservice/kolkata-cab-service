#!/usr/bin/env node
/**
 * clean-standalone.js
 *
 * After `next build` in standalone mode, Next.js copies ALL pre-rendered
 * HTML, RSC payloads, and meta files into:
 *   .next/standalone/.next/server/app/
 *
 * For 13,800+ routes this creates 41,000+ duplicate files consuming
 * gigabytes of disk space — causing ENOSPC errors on CI environments.
 *
 * This script deletes those duplicates from the standalone directory.
 * The original files in .next/server/app/ are kept intact for the
 * OpenNext cache injection scripts (inject-static-route-cache.js).
 *
 * Cloudflare Workers serves static content from KV Assets; the standalone
 * directory is only used to bundle the server entrypoint — not static files.
 */

const fs = require("fs");
const path = require("path");

const STANDALONE_DIR = path.join(
  process.cwd(),
  ".next",
  "standalone",
  ".next",
  "server",
  "app"
);

let deletedCount = 0;
let deletedBytes = 0;

function deleteMatchingFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      deleteMatchingFiles(fullPath);

      // Remove now-empty directories
      try {
        const remaining = fs.readdirSync(fullPath);
        if (remaining.length === 0) {
          fs.rmdirSync(fullPath);
        }
      } catch {
        // Ignore errors
      }
    } else if (
      entry.name.endsWith(".html") ||
      entry.name.endsWith(".rsc") ||
      entry.name.endsWith(".meta") ||
      entry.name.endsWith(".body")
    ) {
      try {
        const stat = fs.statSync(fullPath);
        deletedBytes += stat.size;
        fs.unlinkSync(fullPath);
        deletedCount++;
      } catch (err) {
        console.warn(`  Warning: Could not delete ${fullPath}: ${err.message}`);
      }
    }
  }
}

console.log("🧹 Cleaning pre-rendered files from standalone directory...");
console.log(`   Target: ${STANDALONE_DIR}`);

if (!fs.existsSync(STANDALONE_DIR)) {
  console.log(
    "   Standalone app directory not found — skipping (may not be in standalone mode)."
  );
  process.exit(0);
}

deleteMatchingFiles(STANDALONE_DIR);

const mb = (deletedBytes / 1024 / 1024).toFixed(1);
console.log(
  `✅ Deleted ${deletedCount.toLocaleString()} files (${mb} MB freed)`
);
