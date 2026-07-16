/**
 * scripts/generate-static-sitemaps.js
 *
 * Pre-generates sitemap_index.xml and sitemaps (0-6.xml) as static XML files
 * directly into the public/ directory. This ensures they load instantly with 0ms CPU time
 * on Cloudflare Workers, completely resolving sitemap fetch time-out issues (1102).
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.kolkatacabservice.com';
const LAST_MODIFIED = '2026-06-16T11:00:00.000Z';
const publicDir = path.join(__dirname, '../public');
const sitemapDir = path.join(publicDir, 'sitemap');

// Ensure directories exist
if (!fs.existsSync(sitemapDir)) {
  fs.mkdirSync(sitemapDir, { recursive: true });
}

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

const VEHICLE_SLUGS = ['sedan', 'suv', 'tempo', 'luxury'];
const HUB_SLUGS = ['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna'];
const POPULAR_DESTINATIONS = [
  'darjeeling', 'digha', 'mandarmani', 'gangasagar', 'mayapur', 'siliguri',
  'dooars', 'bishnupur', 'bolpur-shantiniketan', 'murshidabad', 'sundarbans',
  'bakkhali', 'navadwip', 'cooch-behar', 'jalpaiguri', 'alipurduar',
  'durgapur', 'asansol', 'bardhaman', 'malda', 'kharagpur', 'midnapore',
  'howrah', 'barasat', 'kalyani', 'bongaon', 'ranaghat', 'barrackpore', 'dum-dum',
  'kolkata-airport', 'jhargram', 'bankura', 'purulia', 'haldia', 'tamluk', 'contai',
  'diamond-harbour', 'krishnanagar', 'hooghly', 'serampore', 'chandannagar',
  'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar', 'hazaribagh',
  'giridih', 'ramgarh', 'dumka', 'palamu', 'netarhat', 'latehar', 'chaibasa',
  'sahebganj', 'khunti', 'seraikela', 'bhubaneswar', 'puri', 'cuttack',
  'rourkela', 'konark', 'chilika', 'sambalpur', 'balasore', 'baripada',
  'berhampur', 'patna', 'gaya', 'bodh-gaya', 'nalanda', 'rajgir',
  'muzaffarpur', 'varanasi', 'prayagraj'
];
const REVERSE_HUB_ROUTES = [
  'ranchi-to-kolkata', 'jamshedpur-to-kolkata', 'bhubaneswar-to-kolkata',
  'siliguri-to-kolkata', 'dhanbad-to-kolkata', 'puri-to-kolkata',
  'deoghar-to-ranchi', 'bokaro-to-ranchi', 'hazaribagh-to-ranchi',
  'deoghar-to-kolkata', 'darjeeling-to-kolkata', 'durgapur-to-kolkata',
  'asansol-to-kolkata', 'ranchi-to-jamshedpur', 'jamshedpur-to-ranchi',
  'ranchi-to-kolkata-airport', 'bokaro-to-kolkata', 'dhanbad-to-ranchi',
  'giridih-to-ranchi', 'hazaribagh-to-kolkata', 'cuttack-to-bhubaneswar',
  'puri-to-bhubaneswar', 'rourkela-to-bhubaneswar', 'kolkata-to-ranchi-airport',
];
const TOP_PRIORITY_CITIES = [
  'kolkata', 'howrah', 'kolkata-airport', 'siliguri', 'darjeeling', 'durgapur',
  'asansol', 'bardhaman', 'kharagpur', 'midnapore', 'malda', 'murshidabad',
  'barasat', 'kalyani', 'bongaon', 'ranaghat', 'basirhat', 'barrackpore',
  'dum-dum', 'digha', 'mandarmani', 'gangasagar', 'mayapur', 'nabadwip',
  'bishnupur', 'bolpur-shantiniketan', 'jalpaiguri', 'cooch-behar', 'bankura',
  'purulia', 'jhargram', 'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar',
  'hazaribagh', 'giridih', 'ramgarh', 'dumka', 'palamu', 'bhubaneswar', 'puri',
  'cuttack', 'rourkela', 'konark', 'sambalpur', 'balasore', 'baripada', 'patna',
  'gaya', 'bodh-gaya', 'nalanda', 'rajgir', 'varanasi', 'prayagraj'
];
const CITY_SERVICE_TYPES = [
  'local', 'outstation', 'one-way', 'two-way', 'round-trip', 'airport-transfer', 'wedding-car'
];

// Helper to check hub routes
function isHubRoute(slug) {
  const parts = slug.split('-to-');
  if (parts.length === 2) {
    const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
    return hubSlugs.has(parts[0]) || hubSlugs.has(parts[1]);
  }
  return false;
}

// ─── 2. Calculate linked vehicle routes ───
function getLinkedRouteSlugs() {
  const hubSlugs = new Set(['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna']);
  const seen = new Set();

  routes.forEach(r => {
    if (r.distance <= 250 || hubSlugs.has(r.from) || hubSlugs.has(r.to)) {
      seen.add(r.slug);
    }
  });

  const routesByCity = new Map();
  for (const route of routes) {
    const list = routesByCity.get(route.from) || [];
    list.push(route);
    routesByCity.set(route.from, list);
  }
  for (const [, cityRoutes] of routesByCity) {
    cityRoutes.slice(0, 20).forEach(r => seen.add(r.slug));
    cityRoutes
      .filter(r => r.distance <= 250 && r.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 12)
      .forEach(r => seen.add(r.slug));
  }

  const finalSlugs = new Set(seen);
  for (const slug of seen) {
    const parts = slug.split('-to-');
    if (parts.length === 2) {
      const reverseSlug = `${parts[1]}-to-${parts[0]}`;
      const hasReverse = routes.some(r => r.slug === reverseSlug);
      if (hasReverse) finalSlugs.add(reverseSlug);
    }
  }
  return Array.from(finalSlugs);
}

function getLinkedVehicleRouteSlugs() {
  const linked = getLinkedRouteSlugs();
  return linked.filter(isHubRoute);
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

// ─── 4. Generate Sitemaps 0-6 ───

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
  { url: `${DOMAIN}/services/two-way`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.80 },
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
console.log('✓ Generated public/sitemap/0.xml');

// --- Sitemap 1: States + Cities ---
const REDIRECTED_CITIES = ['salt-lake-kolkata', 'new-town-kolkata'];
const statePages = stateSlugs.map(slug => ({
  url: `${DOMAIN}/${slug}`,
  lastModified: LAST_MODIFIED,
  changeFrequency: 'weekly',
  priority: 0.9
}));
const cityPages = cities
  .filter(city => !REDIRECTED_CITIES.includes(city.slug))
  .map(city => ({
    url: `${DOMAIN}/${city.state}/${city.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: TOP_PRIORITY_CITIES.includes(city.slug) ? 0.90 : 0.72
  }));
fs.writeFileSync(path.join(sitemapDir, '1.xml'), buildSitemapXml([...statePages, ...cityPages]));
console.log('✓ Generated public/sitemap/1.xml');

// --- Sitemap 2: Routes ---
const sitemap2Urls = routes.map(route => {
  const isHighPriority = (
    (HUB_SLUGS.includes(route.from) && POPULAR_DESTINATIONS.includes(route.to)) ||
    (HUB_SLUGS.includes(route.to) && POPULAR_DESTINATIONS.includes(route.from))
  );
  const isReverseHubRoute = REVERSE_HUB_ROUTES.includes(route.slug);
  return {
    url: `${DOMAIN}/routes/${route.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: isReverseHubRoute ? 0.95 : isHighPriority ? 0.88 : 0.65
  };
});
fs.writeFileSync(path.join(sitemapDir, '2.xml'), buildSitemapXml(sitemap2Urls));
console.log(`✓ Generated public/sitemap/2.xml (${sitemap2Urls.length} links)`);

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
console.log('✓ Generated public/sitemap/3.xml');

// --- Sitemap 4: City service sub-pages ---
const HUB_CITY_SLUGS = ['kolkata', 'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar',
  'bhubaneswar', 'puri', 'siliguri', 'darjeeling', 'howrah', 'durgapur', 'asansol',
  'patna', 'varanasi'];
const sitemap4Urls = [];
for (const city of cities) {
  if (REDIRECTED_CITIES.includes(city.slug)) continue;
  const isTopCity = TOP_PRIORITY_CITIES.includes(city.slug);
  const isHubCity = HUB_CITY_SLUGS.includes(city.slug);
  for (const serviceType of CITY_SERVICE_TYPES) {
    sitemap4Urls.push({
      url: `${DOMAIN}/${city.state}/${city.slug}/${serviceType}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: isHubCity ? 0.82 : isTopCity ? 0.75 : 0.6
    });
  }
}
fs.writeFileSync(path.join(sitemapDir, '4.xml'), buildSitemapXml(sitemap4Urls));
console.log(`✓ Generated public/sitemap/4.xml (${sitemap4Urls.length} links)`);

// --- Sitemap 5 & 6: Vehicle route pages ---
const linkedVehicleSlugs = getLinkedVehicleRouteSlugs();
const vehicleRoutePages = [];
const linkedRoutes = routes.filter(r => linkedVehicleSlugs.includes(r.slug));
const halfIndex = Math.ceil(linkedRoutes.length / 2);

const routesPart1 = linkedRoutes.slice(0, halfIndex);
const routesPart2 = linkedRoutes.slice(halfIndex);

// Generate Part 1 (sitemap/5.xml)
const sitemap5Urls = [];
for (const route of routesPart1) {
  const isHighPriority = (
    (HUB_SLUGS.includes(route.from) && POPULAR_DESTINATIONS.includes(route.to)) ||
    (HUB_SLUGS.includes(route.to) && POPULAR_DESTINATIONS.includes(route.from))
  );
  for (const vehicleSlug of VEHICLE_SLUGS) {
    sitemap5Urls.push({
      url: `${DOMAIN}/routes/${route.slug}/${vehicleSlug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: isHighPriority ? 0.5 : 0.3
    });
  }
}
fs.writeFileSync(path.join(sitemapDir, '5.xml'), buildSitemapXml(sitemap5Urls));
console.log(`✓ Generated public/sitemap/5.xml (${sitemap5Urls.length} links)`);

// Generate Part 2 (sitemap/6.xml)
const sitemap6Urls = [];
for (const route of routesPart2) {
  const isHighPriority = (
    (HUB_SLUGS.includes(route.from) && POPULAR_DESTINATIONS.includes(route.to)) ||
    (HUB_SLUGS.includes(route.to) && POPULAR_DESTINATIONS.includes(route.from))
  );
  for (const vehicleSlug of VEHICLE_SLUGS) {
    sitemap6Urls.push({
      url: `${DOMAIN}/routes/${route.slug}/${vehicleSlug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: isHighPriority ? 0.5 : 0.3
    });
  }
}
fs.writeFileSync(path.join(sitemapDir, '6.xml'), buildSitemapXml(sitemap6Urls));
console.log(`✓ Generated public/sitemap/6.xml (${sitemap6Urls.length} links)`);


// ─── 5. Generate sitemap_index.xml ───
const sitemapsList = ['0.xml', '1.xml', '2.xml', '3.xml', '4.xml', '5.xml', '6.xml'];
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const sitemapFile of sitemapsList) {
  indexXml += `  <sitemap>\n`;
  indexXml += `    <loc>${DOMAIN}/sitemap/${sitemapFile}</loc>\n`;
  indexXml += `    <lastmod>${LAST_MODIFIED}</lastmod>\n`;
  indexXml += `  </sitemap>\n`;
}
indexXml += `</sitemapindex>`;
fs.writeFileSync(path.join(publicDir, 'sitemap_index.xml'), indexXml);
console.log('✓ Generated public/sitemap_index.xml');
console.log('🎉 All static sitemaps generated successfully!');
