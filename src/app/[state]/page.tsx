import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';

import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import { getState, getAllStateSlugs, BUSINESS, getStatePriceLabels, type Route } from '@/lib/data';
import { getRoutesFrom, getPopularLocalRoutes, getRoute } from '@/lib/routeData';
import { generateStateMetadata, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/seo';

// Only pre-built state pages served; unknown state slugs → 404 (no on-demand ISR)
export const dynamicParams = false;
// Force fully static SSG — zero ISR Reads/Writes on Vercel
export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  return getAllStateSlugs().map(slug => ({ state: slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getState(stateSlug);
  if (!state) return {};
  const baseMetadata = generateStateMetadata(state.name);
  const cityNames = state.cities.slice(0, 8).map(c => c.name);
  return {
    ...baseMetadata,
    keywords: [
      `cab service in ${state.name}`,
      `taxi in ${state.name}`,
      `${state.name} cab service`,
      `${state.name} taxi service`,
      `cab booking ${state.name}`,
      `outstation cab ${state.name}`,
      `one way cab ${state.name}`,
      `round trip cab ${state.name}`,
      `airport cab ${state.name}`,
      `car rental ${state.name}`,
      `taxi booking ${state.name}`,
      `24/7 cab ${state.name}`,
      `best cab service ${state.name}`,
      `cheap cab ${state.name}`,
      `ac cab ${state.name}`,
      ...cityNames.map(c => `cab service in ${c}`),
      ...cityNames.map(c => `taxi in ${c}`),
      ...cityNames.map(c => `${c} to kolkata cab`),
    ],
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params;
  const state = getState(stateSlug);
  if (!state) notFound();

  const prices = getStatePriceLabels(stateSlug);


  const hubCity = state.cities.find(c => c.type === 'hub') || state.cities[0];
  const hubRoutes = (await getRoutesFrom(hubCity.slug)).slice(0, 12);
  const touristCities = state.cities.filter(c => c.tourist);

  // Gather local routes for all cities in this state to show popular intra-state routes
  const intraStateRoutes: Route[] = [];
  const seenSlugs = new Set<string>();
  for (const city of state.cities) {
    const localRoutes = await getPopularLocalRoutes(city.slug, 4);
    for (const r of localRoutes) {
      if (!seenSlugs.has(r.slug) && r.toState === state.slug) {
        intraStateRoutes.push(r);
        seenSlugs.add(r.slug);
      }
    }
  }
  const localRoutesSample = intraStateRoutes.slice(0, 12);

  const faqs = [
    { question: `What cab services are available in ${state.name}?`, answer: `${BUSINESS.name} offers local taxi, outstation cab, one-way taxi, round trip, airport transfer, wedding car rental, and corporate car rental services across all major cities in ${state.name} including ${state.cities.slice(0, 5).map(c => c.name).join(', ')}.` },
    { question: `How can I book a cab in ${state.name}?`, answer: `You can book a cab anywhere in ${state.name} by calling ${BUSINESS.phone}, sending a WhatsApp message, or filling out the booking form on our website. We provide instant confirmation.` },
    { question: `What is the cheapest cab option in ${state.name}?`, answer: `Our Sedan category (Swift Dzire, Honda Amaze) is the most affordable option starting at ${prices.sedanPerKm}. For local rides, we have packages starting from ₹${prices.localPkgSedan} for ${prices.localPkgName}.` },
    { question: `Do you provide one-way cab service in ${state.name}?`, answer: `Yes! We provide one-way cab service between all cities in ${state.name}. You only pay for the one-way journey — no return fare charges.` },
    { question: `Which cities in ${state.name} do you cover?`, answer: `We cover ${state.cities.length} cities in ${state.name}: ${state.cities.map(c => c.name).join(', ')}. Our hub city is ${hubCity.name}.` },
  ];

  const breadcrumbs = [{ name: state.name, href: `/${state.slug}` }];

  return (
    <>
      {/* Geo Meta Tags — target hub city of this state */}
      <meta name="geo.region" content={
        stateSlug === 'west-bengal' ? 'IN-WB' :
        stateSlug === 'jharkhand' ? 'IN-JH' :
        stateSlug === 'odisha' ? 'IN-OR' :
        stateSlug === 'bihar' ? 'IN-BR' :
        stateSlug === 'uttar-pradesh' ? 'IN-UP' : 'IN-WB'
      } />
      <meta name="geo.placename" content={hubCity.name} />
      <meta name="geo.position" content={`${hubCity.lat};${hubCity.lng}`} />
      <meta name="ICBM" content={`${hubCity.lat}, ${hubCity.lng}`} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: BUSINESS.domain }, { name: state.name, url: `${BUSINESS.domain}/${state.slug}` }])) }} />

      {/* Hero */}
      <section className="relative text-white py-16 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">
            Cab Service in <span className="text-gradient">{state.name}</span> {prices.displayRate} | Book Taxi Online 24/7
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">{state.description}</p>
          <div className="flex flex-wrap gap-4">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full">
              <Phone size={18} /> {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8">Cab Service in {state.name} — <span className="text-primary">{state.cities.length} Cities</span> | All Areas Covered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {state.cities.map((city) => (
              <Link key={city.slug} href={`/${state.slug}/${city.slug}`} className="group p-5 bg-white rounded-xl border border-gray-100 card-hover shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{city.name}</h3>
                    {city.type === 'hub' && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Hub City</span>}
                    {city.tourist && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium ml-1">Tourist</span>}
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">{city.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes from Hub */}
      {hubRoutes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8">Popular Routes from <span className="text-primary">{hubCity.name}</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hubRoutes.map((route) => (
                <Link key={route.slug} href={`/routes/${route.slug}`} className="route-card bg-white rounded-xl p-4">
                  <p className="font-semibold text-secondary text-sm">{route.fromName} → {route.toName}</p>
                  <p className="text-xs text-gray-500 mt-1">{route.distance} km • {route.duration} hrs</p>
                  <p className="text-primary font-bold mt-2">From ₹{route.priceSaloon}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Local Routes in State */}
      {localRoutesSample.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Popular Local Routes in <span className="text-primary">{state.name}</span></h2>
            <p className="text-gray-500 mb-8">Book affordable cab service on popular nearby routes across {state.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {localRoutesSample.map((route) => (
                <Link key={route.slug} href={`/routes/${route.slug}`} className="group bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{route.fromName} → {route.toName}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-500">{route.distance} km • {route.duration} hrs</span>
                    <span className="text-primary font-bold">From ₹{route.priceSaloon}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tourist Places */}
      {touristCities.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8">Tourist Places in <span className="text-primary">{state.name}</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {touristCities.slice(0, 6).map((city) => (
                <Link key={city.slug} href={`/${state.slug}/${city.slug}`} className="group bg-white rounded-2xl border border-gray-100 p-6 card-hover shadow-sm">
                  <h3 className="font-bold text-secondary text-lg group-hover:text-primary transition-colors mb-2">{city.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{city.description}</p>
                  {city.landmarks && (
                    <div className="flex flex-wrap gap-1.5">
                      {city.landmarks.slice(0, 3).map((l) => (
                        <span key={l} className="px-2 py-0.5 bg-accent text-primary text-xs rounded-full">{l}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <BookingForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title={`FAQs — Cab Service in ${state.name}`} />
        </div>
      </section>

      {/* Long-form SEO Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <article className="max-w-4xl space-y-6" itemScope itemType="https://schema.org/Article">
            <h2 className="text-2xl font-bold text-secondary">Cab Service in {state.name} — Best Taxi Service | Book Online {prices.displayRate}</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong>{BUSINESS.name}</strong> is the most trusted cab and taxi service provider across {state.name}. Book cab in {state.name} from {prices.displayRate}. We cover {state.cities.length}+ cities including {state.cities.slice(0, 5).map(c => c.name).join(', ')}, and more. If you are searching for cab service in {state.name}, taxi service in {state.name}, car rental {state.name}, or taxi near me {state.name} — you are at the right place. Whether you need a local taxi for city travel, an outstation cab for intercity journeys, a one-way drop taxi, airport transfer, wedding car rental, or corporate car service — we have you covered 24 hours a day, 7 days a week. Call {BUSINESS.phone} for instant booking.
              </p>
              <p>
                Our fleet includes AC Sedans (Swift Dzire, Honda Amaze) at {prices.sedanPerKm}, SUVs (Ertiga, Innova) at {prices.suvPerKm}, Premium SUV (Innova Crysta) at {prices.crystaPerKm}, and Tempo Travellers (12-17 seater) at {prices.tempoPerKm}. Every vehicle is well-maintained, sanitized, and GPS-tracked. Drivers are police-verified with 5+ years of experience.
              </p>
              <p>
                Unlike Ola and Uber, we charge <strong>fixed rates with zero surge pricing</strong> — the same fare applies at 3 AM, during festivals, and peak hours. We accept Cash, UPI, and Card payments. Book via call ({BUSINESS.phone}), WhatsApp, or our online booking form for instant confirmation.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Popular Searches — SEO internal linking */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Popular Searches in {state.name}</h3>
          <div className="flex flex-wrap gap-2">
            {state.cities.slice(0, 12).flatMap(c => {
              const routeSlug = `${c.slug}-to-${hubCity.slug}`;
              const hasRoute = getRoute(routeSlug) !== undefined;
              return [
                { label: `${c.name} cab service`, href: `/${state.slug}/${c.slug}` },
                { label: `taxi in ${c.name}`, href: `/${state.slug}/${c.slug}` },
                { 
                  label: `${c.name} to ${hubCity.name} cab`, 
                  href: hasRoute ? `/routes/${routeSlug}` : `/${state.slug}/${c.slug}/outstation` 
                },
              ];
            }).map((item, i) => (
              <Link key={i} href={item.href} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-500 hover:border-primary/40 hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
