/**
 * scripts/generate-static-sitemaps.js
 *
 * Pre-generates sitemap_index.xml and sitemaps (0-6.xml) as static XML files
 * directly into the public/ directory. This ensures they load instantly with 0ms CPU time
 * on Cloudflare Workers, completely resolving sitemap fetch time-out issues (1102).
 *
 * ── v2 SEO OVERHAUL ─────────────────────────────────────────────────────────────
 * Problem: 34 sub-sitemaps with all 13,800 routes submitted → Google treating as thin
 * duplicates, de-indexing from 20,946 → 15,099 between June–August 2026.
 *
 * Fix: 3-tier route classification:
 *   Tier 1: Hub/popular routes → Always in sitemap, priority 0.88–0.95 (~2,000 routes)
 *   Tier 2: Short/medium routes (≤250km) → In sitemap, priority 0.65 (~1,500 routes)
 *   Tier 3: Long-distance non-hub routes → EXCLUDED from sitemap (~10,000+ routes)
 *
 * Result: Sitemap shrinks from 34 sub-files to ~9 sub-files.
 * Crawl budget focused on ~3,500 high-value pages instead of 13,800+.
 * ────────────────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.kolkatacabservice.com';
// Use the current build date in IST. The date portion is correct for India;
// we anchor time to midnight UTC to avoid timezone confusion in GSC.
const TODAY = new Date();
const LAST_MODIFIED = `${TODAY.getUTCFullYear()}-${String(TODAY.getUTCMonth()+1).padStart(2,'0')}-${String(TODAY.getUTCDate()).padStart(2,'0')}T00:00:00+05:30`;
const publicDir = path.join(__dirname, '../public');
const sitemapDir = path.join(publicDir, 'sitemap');

// Ensure directory exists and is clean (remove stale old XML files like 5.xml, 7.xml, etc.)
if (fs.existsSync(sitemapDir)) {
  fs.rmSync(sitemapDir, { recursive: true, force: true });
}
fs.mkdirSync(sitemapDir, { recursive: true });

// ─── 1. Load raw data files ───
const citiesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/cities.json'), 'utf8'));
const toursData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/tours.json'), 'utf8'));
const blogsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/blogs.json'), 'utf8'));
const areasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/kolkata-areas.json'), 'utf8'));

// Load all shards and merge into routes
const shardFiles = [
  'routes-west-bengal.json', 'routes-jharkhand.json', 'routes-odisha.json',
  'routes-bihar.json', 'routes-uttar-pradesh.json', 'routes-cross-wb.json',
  'routes-cross-jh.json', 'routes-cross-od.json', 'routes-cross-other.json'
];

let routes = [];
for (const file of shardFiles) {
  const filePath = path.join(__dirname, `../src/data/${file}`);
  if (fs.existsSync(filePath)) {
    const shard = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    routes.push(...shard);
  }
}
console.log(`✓ Loaded ${routes.length} total routes.`);

// Helper values
const stateSlugs = Object.keys(citiesData);
const tourSlugs = toursData.map(t => t.slug);
const cities = [];
for (const [stateSlug, stateVal] of Object.entries(citiesData)) {
  for (const city of stateVal.cities) {
    cities.push({
      ...city,
      state: stateSlug,
      stateName: stateVal.name,
    });
  }
}

// ─── 2. Route tier classification (mirrors src/lib/routeIndexing.ts) ───────────

// Hub cities with real search demand — routes involving these are always indexed
// IMPORTANT: Keep in sync with HUB_CITY_SLUGS in src/lib/routeIndexing.ts
const HUB_CITY_SLUGS = new Set([
  // Major hubs — highest search volume
  'kolkata', 'ranchi', 'jamshedpur', 'bhubaneswar', 'patna',
  // Secondary hubs — still have real outstation search demand
  'siliguri', 'dhanbad', 'durgapur', 'asansol', 'howrah',
  // Tourist destination hubs — high cab search volume
  'darjeeling', 'puri', 'digha', 'deoghar',
]);

// Popular tourist/destination cities — routes TO these are indexed
// IMPORTANT: Keep in sync with POPULAR_DESTINATION_SLUGS in src/lib/routeIndexing.ts
const POPULAR_DESTINATION_SLUGS = new Set([
  // WB tourist highlights (nationally searched)
  'darjeeling', 'digha', 'mandarmani', 'gangasagar', 'mayapur',
  'bishnupur', 'bolpur-shantiniketan', 'sundarbans', 'bakkhali',
  // WB urban — significant cab search volume
  'durgapur', 'asansol', 'kharagpur', 'haldia', 'bardhaman',
  'howrah', 'kolkata-airport', 'barasat', 'kalyani',
  // Jharkhand — popular religious & nature destinations
  'deoghar', 'netarhat', 'hazaribagh', 'giridih', 'bokaro',
  // Odisha — high tourist cab demand
  'puri', 'konark', 'cuttack', 'rourkela', 'chilika', 'berhampur',
  // Bihar — pilgrimage destinations
  'bodh-gaya', 'gaya', 'nalanda', 'rajgir',
  // UP — major pilgrimage/tourist
  'varanasi', 'prayagraj',
]);

// Reverse hub routes get highest priority (high commercial intent)
const REVERSE_HUB_ROUTES = new Set([
  'ranchi-to-kolkata', 'jamshedpur-to-kolkata', 'bhubaneswar-to-kolkata',
  'siliguri-to-kolkata', 'dhanbad-to-kolkata', 'puri-to-kolkata',
  'deoghar-to-ranchi', 'bokaro-to-ranchi', 'hazaribagh-to-ranchi',
  'deoghar-to-kolkata', 'darjeeling-to-kolkata', 'durgapur-to-kolkata',
  'asansol-to-kolkata', 'ranchi-to-jamshedpur', 'jamshedpur-to-ranchi',
  'bokaro-to-kolkata', 'dhanbad-to-ranchi', 'giridih-to-ranchi',
  'hazaribagh-to-kolkata', 'cuttack-to-bhubaneswar', 'puri-to-bhubaneswar',
  'rourkela-to-bhubaneswar', 'konark-to-bhubaneswar', 'kolkata-to-ranchi',
  'kolkata-to-jamshedpur', 'kolkata-to-puri', 'kolkata-to-darjeeling',
  'kolkata-to-siliguri', 'kolkata-to-bhubaneswar', 'kolkata-to-deoghar',
  'kolkata-to-digha', 'kolkata-to-mandarmani', 'kolkata-to-durgapur',
  'kolkata-to-asansol', 'kolkata-to-kharagpur', 'kolkata-to-haldia',
  'kolkata-to-ranchi-airport', 'ranchi-to-kolkata-airport',
]);

function getRouteTier(route) {
  const fromHub = HUB_CITY_SLUGS.has(route.from);
  const toHub = HUB_CITY_SLUGS.has(route.to);
  const fromPopular = POPULAR_DESTINATION_SLUGS.has(route.from);
  const toPopular = POPULAR_DESTINATION_SLUGS.has(route.to);

  if (fromHub || toHub || fromPopular || toPopular) return 'tier1';
  // Tier 2: Short routes (≤150km) — locally searched even between small cities
  if (route.distance > 0 && route.distance <= 150) return 'tier2';
  return 'tier3';
}

function shouldIncludeInSitemap(route) {
  return getRouteTier(route) !== 'tier3';
}

function getRouteSitemapPriority(route) {
  if (REVERSE_HUB_ROUTES.has(route.slug)) return 0.95;
  const tier = getRouteTier(route);
  if (tier === 'tier1') return 0.88;
  if (tier === 'tier2') return 0.65;
  return 0.40;
}

// Helper to check hub routes for vehicle pages
function isHubRoute(slug) {
  const parts = slug.split('-to-');
  if (parts.length === 2) {
    const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
    return hubSlugs.has(parts[0]) || hubSlugs.has(parts[1]);
  }
  return false;
}

// ─── 3. XML Sitemap Builder ───
function buildSitemapXml(urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const item of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.url}</loc>\n`;
    xml += `    <lastmod>${item.lastModified}</lastmod>\n`;
    xml += `    <changefreq>${item.changeFrequency}</changefreq>\n`;
    xml += `    <priority>${item.priority.toFixed(2)}</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>`;
  return xml;
}

// ─── 4. Generate Sitemaps ───

// --- Sitemap 0: Core pages ---
const sitemap0Urls = [
  { url: DOMAIN, lastModified: LAST_MODIFIED, changeFrequency: 'daily', priority: 1.0 },
  { url: `${DOMAIN}/about`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${DOMAIN}/contact`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${DOMAIN}/fleet`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${DOMAIN}/tours`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${DOMAIN}/services`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${DOMAIN}/services/local-taxi`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.90 },
  { url: `${DOMAIN}/services/outstation`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.90 },
  { url: `${DOMAIN}/services/one-way`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.90 },
  { url: `${DOMAIN}/services/round-trip`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85 },
  { url: `${DOMAIN}/services/airport-transfer`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.92 },
  { url: `${DOMAIN}/services/wedding-car-rental`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85 },
  { url: `${DOMAIN}/services/corporate-car-rental`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.85 },
  { url: `${DOMAIN}/kolkata-to-jamshedpur-cab`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${DOMAIN}/jamshedpur-to-kolkata-cab`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${DOMAIN}/faq`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${DOMAIN}/fare-chart`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.88 },
  { url: `${DOMAIN}/blog`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${DOMAIN}/kolkata-cab-vs-ola-uber`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.88 },
  { url: `${DOMAIN}/privacy-policy`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${DOMAIN}/terms`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 }
];
fs.writeFileSync(path.join(sitemapDir, '0.xml'), buildSitemapXml(sitemap0Urls));
console.log(`✓ Generated public/sitemap/0.xml (${sitemap0Urls.length} core pages)`);

// --- Sitemap 1: States + Hub Cities ---
// Only include hub cities (high-traffic) and tourist cities — skip generic small cities
const REDIRECTED_CITIES = ['salt-lake-kolkata', 'new-town-kolkata'];
const HUB_CITIES_FOR_SITEMAP = new Set([
  'kolkata', 'ranchi', 'jamshedpur', 'bhubaneswar', 'patna', 'siliguri',
  'darjeeling', 'puri', 'durgapur', 'asansol', 'dhanbad', 'bokaro', 'deoghar',
  'howrah', 'kharagpur', 'midnapore', 'bardhaman', 'malda', 'digha',
  'mandarmani', 'gangasagar', 'mayapur', 'bishnupur', 'jalpaiguri', 'cuttack',
  'rourkela', 'konark', 'sambalpur', 'balasore', 'gaya', 'bodh-gaya', 'varanasi',
  'hazaribagh', 'kalyani', 'barasat', 'barrackpore', 'nabadwip', 'murshidabad',
  'haldia', 'cooch-behar', 'bankura', 'purulia', 'jhargram', 'giridih', 'dumka',
  'nalanda', 'rajgir', 'prayagraj', 'muzaffarpur', 'serampore', 'chandannagar',
]);

// Exclude states with no real content coverage
const EXCLUDED_STATES = new Set(['delhi-ncr', 'uttarakhand', 'madhya-pradesh']);

const statePages = stateSlugs
  .filter(slug => !EXCLUDED_STATES.has(slug))
  .map(slug => ({
    url: `${DOMAIN}/${slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: 0.9
  }));

const cityPages = cities
  .filter(city =>
    !REDIRECTED_CITIES.includes(city.slug) &&
    !EXCLUDED_STATES.has(city.state) &&
    HUB_CITIES_FOR_SITEMAP.has(city.slug)
  )
  .map(city => ({
    url: `${DOMAIN}/${city.state}/${city.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: HUB_CITY_SLUGS.has(city.slug) ? 0.92 : 0.80
  }));

fs.writeFileSync(path.join(sitemapDir, '1.xml'), buildSitemapXml([...statePages, ...cityPages]));
console.log(`✓ Generated public/sitemap/1.xml (${statePages.length} state + ${cityPages.length} hub/tourist city pages)`);

// --- Sitemap 2: Tier 1 + Tier 2 Routes ONLY (excludes Tier 3) ---
// v2 change: Only include routes with real search demand.
// Tier 3 routes (~10,000+) are EXCLUDED from sitemap — they still exist as pages
// but are not submitted to Google. This concentrates crawl budget on quality pages.
const indexableRoutes = routes.filter(r => shouldIncludeInSitemap(r));
const tier1Routes = indexableRoutes.filter(r => getRouteTier(r) === 'tier1');
const tier2Routes = indexableRoutes.filter(r => getRouteTier(r) === 'tier2');

console.log(`✓ Route tier breakdown:`);
console.log(`  Tier 1 (hub/popular, always indexed): ${tier1Routes.length} routes`);
console.log(`  Tier 2 (short/medium, indexed): ${tier2Routes.length} routes`);
console.log(`  Tier 3 (thin, excluded from sitemap): ${routes.length - indexableRoutes.length} routes`);

// Sort Tier 1 with highest-priority first, then Tier 2
const sortedIndexableRoutes = [
  ...tier1Routes.sort((a, b) => getRouteSitemapPriority(b) - getRouteSitemapPriority(a)),
  ...tier2Routes.sort((a, b) => a.distance - b.distance),
];

const sitemap2Urls = sortedIndexableRoutes.map(route => ({
  url: `${DOMAIN}/routes/${route.slug}`,
  lastModified: LAST_MODIFIED,
  changeFrequency: getRouteTier(route) === 'tier1' ? 'weekly' : 'monthly',
  priority: getRouteSitemapPriority(route),
}));

// Split into chunks of 500 URLs max (sitemap spec limit is 50,000 but 500 is practical)
const ROUTE_CHUNK_SIZE = 500;
const routeChunks = [];
for (let i = 0; i < sitemap2Urls.length; i += ROUTE_CHUNK_SIZE) {
  routeChunks.push(sitemap2Urls.slice(i, i + ROUTE_CHUNK_SIZE));
}
routeChunks.forEach((chunk, idx) => {
  const fileName = idx === 0 ? '2.xml' : `2_${idx}.xml`;
  fs.writeFileSync(path.join(sitemapDir, fileName), buildSitemapXml(chunk));
  console.log(`✓ Generated public/sitemap/${fileName} (${chunk.length} indexable routes)`);
});
console.log(`✓ Routes split into ${routeChunks.length} sitemap chunks (was 28 chunks for all 13,800 routes)`);


// --- Sitemap 3: Tours + Blogs + Kolkata areas ---
const tourPages = tourSlugs.map(slug => ({
  url: `${DOMAIN}/tours/${slug}`,
  lastModified: LAST_MODIFIED,
  changeFrequency: 'monthly',
  priority: 0.8
}));
const blogPages = blogsData.map(blog => ({
  url: `${DOMAIN}/blog/${blog.slug}`,
  lastModified: LAST_MODIFIED,
  changeFrequency: 'monthly',
  priority: 0.75
}));
const areaPages = areasData.map(area => ({
  url: `${DOMAIN}/kolkata/${area.slug}`,
  lastModified: LAST_MODIFIED,
  changeFrequency: 'weekly',
  priority: 0.90
}));
fs.writeFileSync(path.join(sitemapDir, '3.xml'), buildSitemapXml([...tourPages, ...blogPages, ...areaPages]));
console.log(`✓ Generated public/sitemap/3.xml (${tourPages.length} tours + ${blogPages.length} blogs + ${areaPages.length} kolkata areas)`);

// --- Sitemap 4: Hub city service sub-pages ---
// IMPORTANT: Restrict to hub cities ONLY (not all cities). Including every
// city × service combination (~4,200 URLs) dilutes crawl budget and creates
// thousands of near-identical thin pages. Hub cities only = ~90 high-value URLs.
const CITY_SERVICE_TYPES = ['local', 'outstation', 'one-way', 'round-trip', 'airport-transfer', 'wedding-car'];
// Note: these sub-pages have noindex in _headers. We include them in sitemap so
// Google can discover canonical parent but marks them appropriately via HTML meta.
// For hub cities only (they have enough unique content to warrant sub-pages):
const HUB_CITIES_FOR_SERVICE_SITEMAP = ['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna', 'siliguri', 'darjeeling', 'puri'];
const sitemap4Urls = [];
for (const city of cities) {
  if (REDIRECTED_CITIES.includes(city.slug)) continue;
  if (!HUB_CITIES_FOR_SERVICE_SITEMAP.includes(city.slug)) continue;
  for (const serviceType of CITY_SERVICE_TYPES) {
    sitemap4Urls.push({
      url: `${DOMAIN}/${city.state}/${city.slug}/${serviceType}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.75
    });
  }
}
fs.writeFileSync(path.join(sitemapDir, '4.xml'), buildSitemapXml(sitemap4Urls));
console.log(`✓ Generated public/sitemap/4.xml (${sitemap4Urls.length} hub city service links — hub cities only)`);

// Helper to replicate getStaticVehicleRouteSlugs(300) from routeDataStatic.ts
function getStaticVehicleRouteSlugsJs(limit = 300) {
  const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
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
      const hasReverse = routes.some(r => r.slug === rev);
      if (hasReverse && !seen.has(rev)) {
        seen.add(rev);
        withReverse.push(rev);
      }
    }
  }

  return withReverse.slice(0, limit).filter(slug => {
    const parts = slug.split('-to-');
    return parts.length === 2 && (hubSlugs.has(parts[0]) || hubSlugs.has(parts[1]));
  });
}

// --- Sitemap 5: Hub route vehicle pages (/routes/[route]/[vehicle]) ---
// Vehicle pages (sedan/suv/tempo/luxury) exist ONLY for hub-origin routes
// (kolkata, ranchi, bhubaneswar, jamshedpur, patna as the FROM city).
// These are pre-built as static HTML with unique vehicle-specific content,
// fares per vehicle type, and vehicle FAQs. Their canonical points to themselves.
// They MUST be in the sitemap so Google discovers and indexes them.
const VEHICLE_SLUGS = ['sedan', 'suv', 'tempo', 'luxury'];
const vehicleRouteSlugsSitemap = getStaticVehicleRouteSlugsJs(300); // top 300 hub routes
const sitemap5Urls = [];
for (const routeSlug of vehicleRouteSlugsSitemap) {
  for (const vehicleSlug of VEHICLE_SLUGS) {
    const routeData = routes.find(r => r.slug === routeSlug);
    const isHighValue = routeData && (
      POPULAR_DESTINATION_SLUGS.has(routeData.to) ||
      POPULAR_DESTINATION_SLUGS.has(routeData.from)
    );
    sitemap5Urls.push({
      url: `${DOMAIN}/routes/${routeSlug}/${vehicleSlug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: isHighValue ? 0.78 : 0.65
    });
  }
}
fs.writeFileSync(path.join(sitemapDir, '5.xml'), buildSitemapXml(sitemap5Urls));
console.log(`✓ Generated public/sitemap/5.xml (${sitemap5Urls.length} hub route vehicle page links)`);

// --- Sitemap 6: Service city pages (/services/[service]/[city]) ---
const SERVICE_SLUGS = ['local-taxi', 'outstation', 'one-way', 'round-trip', 'airport-transfer', 'wedding-car-rental', 'corporate-car-rental'];
const HUB_CITY_SLUGS_FOR_SERVICES = ['kolkata', 'ranchi', 'bhubaneswar'];
const sitemap6Urls = [];
for (const city of cities) {
  if (HUB_CITY_SLUGS_FOR_SERVICES.includes(city.slug)) {
    for (const serviceSlug of SERVICE_SLUGS) {
      sitemap6Urls.push({
        url: `${DOMAIN}/services/${serviceSlug}/${city.slug}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: 'monthly',
        priority: 0.82
      });
    }
  }
}
fs.writeFileSync(path.join(sitemapDir, '6.xml'), buildSitemapXml(sitemap6Urls));
console.log(`✓ Generated public/sitemap/6.xml (${sitemap6Urls.length} links)`);

// ─── 5. Generate sitemap.xml index (replaces sitemap_index.xml) ───
// Dynamically scan the sitemapDir for all .xml files so we never miss any.
// IMPORTANT: Write to public/sitemap.xml ONLY. The duplicate public/sitemap_index.xml
// has been removed — having two identical files caused GSC to track them as separate
// sitemaps, diluting signals. The _redirects rule 301s sitemap_index.xml → sitemap.xml.
const generatedSitemapFiles = fs.readdirSync(sitemapDir)
  .filter(f => f.endsWith('.xml'))
  .sort((a, b) => {
    // Correct sort for names like 2.xml, 2_1.xml, 2_10.xml, 2_2.xml:
    // Parse the base number and the optional sub-index separately.
    const parseFilename = (name) => {
      const base = name.replace('.xml', '');
      const parts = base.split('_');
      return [parseInt(parts[0], 10), parts[1] ? parseInt(parts[1], 10) : -1];
    };
    const [aBase, aSub] = parseFilename(a);
    const [bBase, bSub] = parseFilename(b);
    if (aBase !== bBase) return aBase - bBase;
    return aSub - bSub;
  });

let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const sitemapFile of generatedSitemapFiles) {
  indexXml += `  <sitemap>\n`;
  indexXml += `    <loc>${DOMAIN}/sitemap/${sitemapFile}</loc>\n`;
  indexXml += `    <lastmod>${LAST_MODIFIED}</lastmod>\n`;
  indexXml += `  </sitemap>\n`;
}
indexXml += `</sitemapindex>`;

// Write to sitemap.xml (canonical URL)
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);
console.log(`✓ Generated public/sitemap.xml (${generatedSitemapFiles.length} sitemaps: ${generatedSitemapFiles.join(', ')})`);

// Remove any stale sitemap_index.xml that may exist from previous builds
const staleIndex = path.join(publicDir, 'sitemap_index.xml');
if (fs.existsSync(staleIndex)) {
  fs.unlinkSync(staleIndex);
  console.log('✓ Removed stale public/sitemap_index.xml (duplicate of sitemap.xml)');
}

console.log('');
console.log('🎉 All static sitemaps generated successfully!');
console.log(`📊 Sitemap v2 Summary:`);
console.log(`   Previous: 34 sub-files with ALL ${routes.length} routes (diluted crawl budget)`);
console.log(`   New: ${generatedSitemapFiles.length} sub-files with only ${indexableRoutes.length} indexable routes (${routes.length - indexableRoutes.length} thin routes excluded)`);
console.log(`   Crawl budget now focused on ${indexableRoutes.length + sitemap0Urls.length + statePages.length + cityPages.length} high-value pages`);
