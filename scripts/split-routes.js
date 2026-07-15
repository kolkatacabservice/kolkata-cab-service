/**
 * scripts/split-routes.js
 *
 * Splits the monolithic src/data/routes.json (5 MB, ~13,808 entries) into
 * per-state shard files so that each Workers bundle stays well under 1 MB.
 *
 * Output files (all in src/data/):
 *   routes-west-bengal.json          ← WB→WB intra-state routes
 *   routes-jharkhand.json            ← JH→JH intra-state routes
 *   routes-odisha.json               ← OD→OD intra-state routes
 *   routes-bihar.json                ← BR→BR intra-state routes
 *   routes-uttar-pradesh.json        ← UP→UP intra-state routes
 *   routes-cross-wb.json             ← Cross-state routes FROM West Bengal
 *   routes-cross-jh.json             ← Cross-state routes FROM Jharkhand
 *   routes-cross-od.json             ← Cross-state routes FROM Odisha
 *   routes-cross-other.json          ← Cross-state routes FROM Bihar/UP
 *
 * Usage: node scripts/split-routes.js
 */

const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '../src/data/routes.json');
const outDir = path.join(__dirname, '../src/data');

if (!fs.existsSync(routesPath)) {
  console.error('ERROR: src/data/routes.json not found. Run generate-routes.js first.');
  process.exit(1);
}

const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const STATE_SHARD_MAP = {
  'west-bengal': 'west-bengal',
  'jharkhand': 'jharkhand',
  'odisha': 'odisha',
  'bihar': 'bihar',
  'uttar-pradesh': 'uttar-pradesh',
};

const shards = {
  'west-bengal': [],
  'jharkhand': [],
  'odisha': [],
  'bihar': [],
  'uttar-pradesh': [],
  'cross-wb': [],        // cross-state FROM West Bengal
  'cross-jh': [],        // cross-state FROM Jharkhand
  'cross-od': [],        // cross-state FROM Odisha
  'cross-other': [],     // cross-state FROM Bihar / UP / unknown
};

for (const route of routes) {
  const fromShard = STATE_SHARD_MAP[route.fromState];
  const toShard = STATE_SHARD_MAP[route.toState];

  if (fromShard && fromShard === toShard) {
    // Intra-state: both cities in same state
    shards[fromShard].push(route);
  } else {
    // Cross-state: bucket by fromState
    if (route.fromState === 'west-bengal') {
      shards['cross-wb'].push(route);
    } else if (route.fromState === 'jharkhand') {
      shards['cross-jh'].push(route);
    } else if (route.fromState === 'odisha') {
      shards['cross-od'].push(route);
    } else {
      shards['cross-other'].push(route);
    }
  }
}

let totalWritten = 0;
for (const [shardKey, shardRoutes] of Object.entries(shards)) {
  const outPath = path.join(outDir, `routes-${shardKey}.json`);
  fs.writeFileSync(outPath, JSON.stringify(shardRoutes, null, 2));
  const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
  const sizeWarning = sizeKB > 900 ? ' ⚠ LARGE — consider further splitting' : '';
  console.log(`  ✓ routes-${shardKey}.json  →  ${shardRoutes.length} routes  (${sizeKB} KB)${sizeWarning}`);
  totalWritten += shardRoutes.length;
}

// Remove old cross-state.json if it exists (replaced by cross-wb/jh/od/other)
const oldCrossState = path.join(outDir, 'routes-cross-state.json');
if (fs.existsSync(oldCrossState)) {
  fs.unlinkSync(oldCrossState);
  console.log('\n  🗑  Removed old routes-cross-state.json (replaced by per-state cross shards)');
}

console.log(`\nTotal routes written: ${totalWritten} / ${routes.length}`);
if (totalWritten !== routes.length) {
  console.warn('⚠  Mismatch! Some routes may not be in any shard.');
}
console.log('Done. Shard files ready in src/data/.');
