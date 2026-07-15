import type { MetadataRoute } from 'next';

// ── CRITICAL: Force full static generation for ALL sitemap sub-routes ──
// Without this, Next.js treats each /sitemap/N.xml as an ISR route,
// causing millions of ISR Writes as Google/Bing crawl them constantly.
// With force-static, all 7 sitemaps are pre-built at deploy time — zero ISR.
export const dynamic = 'force-static';
export const revalidate = false;
import { getAllCities, getAllStateSlugs, getTourSlugs, VEHICLE_SLUGS } from '@/lib/data';
import { getAllRoutes, getLinkedRouteSlugs, getLinkedVehicleRouteSlugs } from '@/lib/routeData';
import blogsData from '@/data/blogs.json';
import areasData from '@/data/kolkata-areas.json';

const DOMAIN = 'https://www.kolkatacabservice.com';
// Fixed build-date constant to prevent "fake freshness" signals to Google on every build
const LAST_MODIFIED = '2026-06-16T11:00:00.000Z';

// High-value REVERSE routes that need top priority (not in special landing pages)
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
  // West Bengal — Kolkata metro + key cities
  // Note: salt-lake-kolkata & new-town-kolkata excluded — 301 redirect to /kolkata/salt-lake & /kolkata/new-town
  'kolkata', 'howrah', 'kolkata-airport',
  'siliguri', 'darjeeling', 'durgapur', 'asansol', 'bardhaman',
  'kharagpur', 'midnapore', 'malda', 'murshidabad',
  // New WB cities — high search volume
  'barasat', 'kalyani', 'bongaon', 'ranaghat', 'basirhat',
  'barrackpore', 'dum-dum', 'digha', 'mandarmani', 'gangasagar',
  'mayapur', 'nabadwip', 'bishnupur', 'bolpur-shantiniketan',
  'jalpaiguri', 'cooch-behar', 'bankura', 'purulia', 'jhargram',
  // Jharkhand
  'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar',
  'hazaribagh', 'giridih', 'ramgarh', 'dumka', 'palamu',
  // Odisha
  'bhubaneswar', 'puri', 'cuttack', 'rourkela', 'konark',
  'sambalpur', 'balasore', 'baripada',
  // Bihar + UP
  'patna', 'gaya', 'bodh-gaya', 'nalanda', 'rajgir', 'varanasi', 'prayagraj',
];

const HUB_SLUGS = ['kolkata', 'ranchi', 'bhubaneswar', 'jamshedpur', 'patna'];
const POPULAR_DESTINATIONS = [
  // WB tourist + popular
  'darjeeling', 'digha', 'mandarmani', 'gangasagar', 'mayapur', 'siliguri',
  'dooars', 'bishnupur', 'bolpur-shantiniketan', 'murshidabad', 'sundarbans',
  'bakkhali', 'nabadwip', 'cooch-behar', 'jalpaiguri', 'alipurduar',
  // WB urban
  'durgapur', 'asansol', 'bardhaman', 'malda', 'kharagpur', 'midnapore',
  'howrah', 'barasat', 'kalyani', 'bongaon', 'ranaghat',
  'barrackpore', 'dum-dum', 'kolkata-airport',
  'jhargram', 'bankura', 'purulia', 'haldia', 'tamluk', 'contai',
  'diamond-harbour', 'krishnanagar', 'hooghly', 'serampore', 'chandannagar',
  // Jharkhand
  'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar', 'hazaribagh',
  'giridih', 'ramgarh', 'dumka', 'palamu', 'netarhat', 'latehar',
  'chaibasa', 'sahebganj', 'khunti', 'seraikela',
  // Odisha
  'bhubaneswar', 'puri', 'cuttack', 'rourkela', 'konark', 'chilika',
  'sambalpur', 'balasore', 'baripada', 'berhampur',
  // Bihar + UP
  'patna', 'gaya', 'bodh-gaya', 'nalanda', 'rajgir',
  'muzaffarpur', 'varanasi', 'prayagraj',
];

// City sub-page service types that should be indexed
const CITY_SERVICE_TYPES = [
  'local', 'outstation', 'one-way', 'two-way', 'round-trip', 'airport-transfer', 'wedding-car',
] as const;

// Generate 7 sub-sitemaps (split vehicle-specific route pages to sitemap/5 and sitemap/6)
export async function generateSitemaps() {
  return [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }];
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const sitemapId = await id;
  const cities = getAllCities();
  const routes = await getAllRoutes();
  const stateSlugs = getAllStateSlugs();
  const tourSlugs = getTourSlugs();

  switch (sitemapId) {
    // Core pages + services
    case '0': {
      return [
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
        { url: `${DOMAIN}/terms`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
      ];
    }

    // State + city pages
    // salt-lake-kolkata & new-town-kolkata are 301-redirected to /kolkata/ area pages — exclude from sitemap
    case '1': {
      const REDIRECTED_CITIES = ['salt-lake-kolkata', 'new-town-kolkata'];
      const statePages: MetadataRoute.Sitemap = stateSlugs
        .map(slug => ({
          url: `${DOMAIN}/${slug}`,
          lastModified: LAST_MODIFIED,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
        }));

      const cityPages: MetadataRoute.Sitemap = cities
        .filter(city => !REDIRECTED_CITIES.includes(city.slug))
        .map(city => ({
          url: `${DOMAIN}/${city.state}/${city.slug}`,
          lastModified: LAST_MODIFIED,
          changeFrequency: 'monthly' as const,
          priority: TOP_PRIORITY_CITIES.includes(city.slug) ? 0.90 : 0.72,
        }));

      return [...statePages, ...cityPages];
    }

    // Route pages — index 100% of the active routes in our database.
    // They compile dynamically on first visitor/bot request (via Next.js dynamicParams/ISR)
    // and are cached for 30 days. None of them return a 404 since they exist in the database.
    case '2': {
      return routes.map(route => {
        const isHighPriority = (
          (HUB_SLUGS.includes(route.from) && POPULAR_DESTINATIONS.includes(route.to)) ||
          (HUB_SLUGS.includes(route.to) && POPULAR_DESTINATIONS.includes(route.from))
        );
        const isReverseHubRoute = REVERSE_HUB_ROUTES.includes(route.slug);
        return {
          url: `${DOMAIN}/routes/${route.slug}`,
          lastModified: LAST_MODIFIED,
          changeFrequency: 'monthly' as const,
          priority: isReverseHubRoute ? 0.95 : isHighPriority ? 0.88 : 0.65,
        };
      });
    }

    // Tours + blogs + Kolkata areas
    case '3': {
      const tourPages: MetadataRoute.Sitemap = tourSlugs.map(slug => ({
        url: `${DOMAIN}/tours/${slug}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: 'monthly',
        priority: 0.8,
      }));

      const blogPages: MetadataRoute.Sitemap = (blogsData as Array<{ slug: string }>).map(blog => ({
        url: `${DOMAIN}/blog/${blog.slug}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }));

      const areaPages: MetadataRoute.Sitemap = (areasData as Array<{ slug: string }>).map(area => ({
        url: `${DOMAIN}/kolkata/${area.slug}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: 'weekly' as const,
        priority: 0.90,
      }));

      return [...tourPages, ...blogPages, ...areaPages];
    }

    // City service sub-pages
    case '4': {
      // salt-lake-kolkata & new-town-kolkata excluded — 301 redirect to /kolkata/ pages
      const REDIRECTED_CITIES = ['salt-lake-kolkata', 'new-town-kolkata'];
      // Hub cities get boosted sub-service priority
      const HUB_CITY_SLUGS = ['kolkata', 'ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'deoghar',
        'bhubaneswar', 'puri', 'siliguri', 'darjeeling', 'howrah', 'durgapur', 'asansol',
        'patna', 'varanasi'];
      const subPages: MetadataRoute.Sitemap = [];
      for (const city of cities) {
        if (REDIRECTED_CITIES.includes(city.slug)) continue;
        const isTopCity = TOP_PRIORITY_CITIES.includes(city.slug);
        const isHubCity = HUB_CITY_SLUGS.includes(city.slug);
        for (const serviceType of CITY_SERVICE_TYPES) {
          subPages.push({
            url: `${DOMAIN}/${city.state}/${city.slug}/${serviceType}`,
            lastModified: LAST_MODIFIED,
            changeFrequency: 'monthly' as const,
            priority: isHubCity ? 0.82 : isTopCity ? 0.75 : 0.6,
          });
        }
      }
      return subPages;
    }

    // Vehicle-specific route pages part 1 — only pre-built routes
    case '5': {
      const linkedSlugs = new Set(await getLinkedVehicleRouteSlugs());
      const vehicleRoutePages: MetadataRoute.Sitemap = [];
      const linkedRoutes = routes.filter(r => linkedSlugs.has(r.slug));
      const halfIndex = Math.ceil(linkedRoutes.length / 2);
      const routesPart1 = linkedRoutes.slice(0, halfIndex);
      for (const route of routesPart1) {
        const isHighPriority = (
          (HUB_SLUGS.includes(route.from) && POPULAR_DESTINATIONS.includes(route.to)) ||
          (HUB_SLUGS.includes(route.to) && POPULAR_DESTINATIONS.includes(route.from))
        );
        for (const vehicleSlug of VEHICLE_SLUGS) {
          vehicleRoutePages.push({
            url: `${DOMAIN}/routes/${route.slug}/${vehicleSlug}`,
            lastModified: LAST_MODIFIED,
            changeFrequency: 'monthly' as const,
            priority: isHighPriority ? 0.5 : 0.3,
          });
        }
      }
      return vehicleRoutePages;
    }

    // Vehicle-specific route pages part 2 — only pre-built routes
    case '6': {
      const linkedSlugs = new Set(await getLinkedVehicleRouteSlugs());
      const vehicleRoutePages: MetadataRoute.Sitemap = [];
      const linkedRoutes = routes.filter(r => linkedSlugs.has(r.slug));
      const halfIndex = Math.ceil(linkedRoutes.length / 2);
      const routesPart2 = linkedRoutes.slice(halfIndex);
      for (const route of routesPart2) {
        const isHighPriority = (
          (HUB_SLUGS.includes(route.from) && POPULAR_DESTINATIONS.includes(route.to)) ||
          (HUB_SLUGS.includes(route.to) && POPULAR_DESTINATIONS.includes(route.from))
        );
        for (const vehicleSlug of VEHICLE_SLUGS) {
          vehicleRoutePages.push({
            url: `${DOMAIN}/routes/${route.slug}/${vehicleSlug}`,
            lastModified: LAST_MODIFIED,
            changeFrequency: 'monthly' as const,
            priority: isHighPriority ? 0.5 : 0.3,
          });
        }
      }
      return vehicleRoutePages;
    }

    default:
      return [];
  }
}
