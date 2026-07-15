import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Route, Phone, Clock, ArrowRight, ArrowLeftRight, CheckCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';

import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import FareCalculator from '@/components/FareCalculator';
import FleetSection from '@/components/FleetSection';
import { getState, getCity, getAllCities, getVehicles, BUSINESS, getStatePriceLabels, getStateFares } from '@/lib/data';
import { getRoutesFrom, getRoutesTo, getPopularLocalRoutes } from '@/lib/routeData';
import { generateCityMetadata, generateFaqSchema, generateBreadcrumbSchema, generateCityServiceSchema, getCityGeoMeta, generateCityGeoCircleSchema } from '@/lib/seo';
import { generateCityPageContent } from '@/lib/cityContent';
import { formatBoldText } from '@/lib/textHelper';

// Only pre-built city pages served; unknown state/city combos → 404 (no on-demand ISR)
export const dynamicParams = false;
// Force fully static SSG — zero ISR Reads/Writes on Vercel
export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  const cities = getAllCities();
  return cities.map(c => ({ state: c.state, city: c.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug);
  const city = getCity(stateSlug, citySlug);
  if (!state || !city) return {};
  const baseMetadata = generateCityMetadata(city.name, state.name);
  return {
    ...baseMetadata,
    keywords: [
      `cab service in ${city.name}`,
      `taxi in ${city.name}`,
      `${city.name} cab service`,
      `${city.name} taxi service`,
      `cab booking ${city.name}`,
      `book cab in ${city.name}`,
      `${city.name} cab`,
      `${city.name} taxi`,
      `outstation cab from ${city.name}`,
      `one way cab from ${city.name}`,
      `round trip cab ${city.name}`,
      `airport cab ${city.name}`,
      `airport transfer ${city.name}`,
      `local taxi ${city.name}`,
      `${city.name} local cab`,
      `car rental ${city.name}`,
      `${city.name} to kolkata cab`,
      `kolkata to ${city.name} cab`,
      `${city.name} innova cab`,
      `${city.name} suv cab`,
      `${city.name} sedan cab`,
      `24/7 cab ${city.name}`,
      `night cab ${city.name}`,
      `cab near me ${city.name}`,
      `taxi near me ${city.name}`,
      `best cab service ${city.name}`,
      `cheap cab ${city.name}`,
      `ac cab ${city.name}`,
      `wedding car ${city.name}`,
      `tempo traveller ${city.name}`,
      ...(city.alternateNames || []).map((n: string) => `cab service in ${n}`),
      ...(city.alternateNames || []).map((n: string) => `taxi in ${n}`),
    ],
  };
}

export default async function CityPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug);
  const city = getCity(stateSlug, citySlug);
  if (!state || !city) notFound();

  const routesFrom = await getRoutesFrom(citySlug);
  const routesTo = await getRoutesTo(citySlug);
  const localRoutes = await getPopularLocalRoutes(citySlug, 12);

  const vehicles = getVehicles();
  const prices = getStatePriceLabels(stateSlug);
  const fares = getStateFares(stateSlug);

  // Generate rich, unique content for this city
  const content = generateCityPageContent({
    city,
    stateName: state.name,
    stateSlug: state.slug,
    routesFrom: routesFrom.slice(0, 20),
    routesTo: routesTo.slice(0, 20),
  });

  const serviceTypes = [
    { name: 'Local Taxi', slug: 'local', icon: <MapPin size={20} />, desc: `Hourly cab rental for city travel in ${city.name}`, price: `From ₹${prices.localPkgSedan}` },
    { name: 'Outstation Cab', slug: 'outstation', icon: <Route size={20} />, desc: `Intercity cab from ${city.name}`, price: `From ${prices.sedanPerKm}` },
    { name: 'One-Way Taxi', slug: 'one-way', icon: <ArrowRight size={20} />, desc: `Pay only one side from ${city.name}`, price: `From ${prices.sedanPerKm}` },
    { name: 'Two-Way Cab', slug: 'two-way', icon: <ArrowLeftRight size={20} />, desc: `Same driver onward & return from ${city.name}`, price: `From ${prices.sedanPerKm}` },
    { name: 'Round Trip', slug: 'round-trip', icon: <ArrowRight size={20} />, desc: `Multi-day trips from ${city.name}`, price: `From ${prices.sedanPerKm}` },
    { name: 'Airport Transfer', slug: 'airport-transfer', icon: <ArrowRight size={20} />, desc: `Airport pickup/drop in ${city.name}`, price: `From ${prices.airportSedan}` },
    { name: 'Wedding Car', slug: 'wedding-car', icon: <ArrowRight size={20} />, desc: `Decorated car in ${city.name}`, price: 'From ₹5,000' },
  ];

  // ItemList schema for routes
  const routeItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Cab Routes from ${city.name}`,
    url: `${BUSINESS.domain}/${state.slug}/${city.slug}`,
    numberOfItems: routesFrom.length,
    itemListElement: routesFrom.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${r.fromName} to ${r.toName} Cab`,
      url: `${BUSINESS.domain}/routes/${r.slug}`,
    })),
  };

  return (
    <>
      {/* Geo Meta Tags — city-specific for local ranking */}
      {(() => {
        const geo = getCityGeoMeta(city.name, state.slug, city.lat, city.lng);
        return (
          <>
            <meta name="geo.region" content={geo['geo.region']} />
            <meta name="geo.placename" content={geo['geo.placename']} />
            <meta name="geo.position" content={geo['geo.position']} />
            <meta name="ICBM" content={geo['ICBM']} />
          </>
        );
      })()}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(content.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: state.name, url: `${BUSINESS.domain}/${state.slug}` },
        { name: city.name, url: `${BUSINESS.domain}/${state.slug}/${city.slug}` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCityServiceSchema(city.name, state.name, city.alternateNames)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCityGeoCircleSchema(city.name, state.name, city.lat, city.lng, city.alternateNames)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(routeItemListSchema) }} />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[
            { name: state.name, href: `/${state.slug}` },
            { name: city.name, href: `/${state.slug}/${city.slug}` },
          ]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
            {city.slug === 'kolkata' ? (
              <>Cab Service in <span className="text-gradient">Kolkata</span> — Book Taxi {prices.displayRate} | Airport, Outstation, Local 24/7</>
            ) : (
              <>Cab Service in <span className="text-gradient">{city.name}</span> {prices.displayRate} | {city.name} Taxi 24/7</>
            )}
          </h1>
          {city.alternateNames && city.alternateNames.length > 0 && (
            <p className="text-xs text-gray-300 font-medium mb-3 italic">
              Also known as: {city.alternateNames.join(', ')}
            </p>
          )}
          <p className="text-gray-300 max-w-3xl mb-4">{city.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-4">
            {city.airport && <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">✈️ {city.airport}</span>}
            {city.railway && <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">🚂 {city.railway}</span>}
            <span className="flex items-center gap-1.5 bg-primary/30 px-3 py-1.5 rounded-full font-semibold">📞 {BUSINESS.phone}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
              <Phone size={18} /> Call Now
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a cab in ${city.name}.`)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Rich About Content — SEO Core */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <article className="max-w-4xl" itemScope itemType="https://schema.org/Article">
            <h2 className="text-2xl font-bold text-secondary mb-4">Cab Service in {city.name}, {state.name} — Best Taxi Service | Book Online {prices.displayRate}</h2>
            
            {/* ── QUICK ANSWER BOX — targets AI Overviews / Featured Snippets ── */}
            <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <h3 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                  ⚡ Quick Answer — {city.name} Cab Service Facts
                </h3>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">Local Sedan</dt>
                    <dd className="font-bold text-secondary">₹{prices.localPkgSedan}</dd>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">Outstation Rate</dt>
                    <dd className="font-bold text-secondary">₹{prices.sedanRate}/km</dd>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">Airport Transfer</dt>
                    <dd className="font-bold text-primary">{prices.airportSedan}</dd>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">Service Areas</dt>
                    <dd className="font-bold text-primary">City-wide 24/7</dd>
                  </div>
                </dl>
                <p className="text-xs text-gray-500 mt-3">
                  📍 Service Types: Local Hourly Packages (8h/80km), One-way Outstation, Round Trip, Airport Drop, and Luxury Wedding Cars.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📞 24/7 Booking: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a> | All rates are clear & transparent.
                </p>
              </div>
              <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-amber-200 shadow-sm">
                <Image
                  src="/navbanner.webp"
                  alt={`Cab service in ${city.name} - booking AC sedan and SUV taxi`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 192px"
                  priority
                />
              </div>
            </div>
            {content.aboutContent.map((para, i) => (
              <p key={i} className="text-gray-600 mb-4 leading-relaxed">{formatBoldText(para)}</p>
            ))}
          </article>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">Our Services in <span className="text-primary">{city.name}</span></h2>
          <p className="text-gray-500 text-sm mb-6">Complete range of cab & car rental services available in {city.name}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((srv) => (
              <Link key={srv.slug} href={`/${stateSlug}/${citySlug}/${srv.slug}`} className="group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {srv.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">{srv.name}</h3>
                    <span className="text-xs text-primary font-medium">{srv.price}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">{srv.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us — City Specific */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Why Choose {BUSINESS.name} in <span className="text-primary">{city.name}</span>?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.whyChooseUs.map((item, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <h3 className="font-bold text-secondary text-sm">{item.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      {content.areas.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">Areas We Serve in <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">Pickup and drop from every corner of {city.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.areas.map((area, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary text-sm">{area.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{area.areas}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Local Routes — Key SEO Section */}
      {localRoutes.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">Popular Cab Routes from <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">Book affordable outstation cab from {city.name}. One-way & round trip available on all routes.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {localRoutes.map((route) => (
                <Link key={route.slug} href={`/routes/${route.slug}`} className="group bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <ArrowRight size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors truncate">{route.fromName} → {route.toName}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-3 text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {route.distance} km</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {route.duration} hrs</span>
                    </div>
                    <span className="text-primary font-bold">₹{route.priceSaloon}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Routes From City */}
      {routesFrom.length > 12 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">All Outstation Routes from <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">{routesFrom.length} routes available from {city.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {routesFrom.map((route) => (
                <Link key={route.slug} href={`/routes/${route.slug}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-all text-sm">
                  <span className="text-secondary font-medium truncate">{route.fromName} → {route.toName}</span>
                  <span className="text-primary font-bold shrink-0 ml-2">₹{route.priceSaloon}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Routes To City */}
      {routesTo.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">Cab Routes to <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">Book cab from other cities to {city.name}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {routesTo.map((route) => (
                <Link key={route.slug} href={`/routes/${route.slug}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 transition-all text-sm">
                  <span className="text-secondary font-medium truncate">{route.fromName} → {route.toName}</span>
                  <span className="text-primary font-bold shrink-0 ml-2">₹{route.priceSaloon}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Cab Fare Chart in <span className="text-primary">{city.name}</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-4 py-3 text-left text-sm">Vehicle Type</th>
                  <th className="px-4 py-3 text-left text-sm">Models</th>
                  <th className="px-4 py-3 text-center text-sm">Capacity</th>
                  <th className="px-4 py-3 text-right text-sm">Per KM Rate</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.slice(0, 5).map((v, i) => (
                  <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-secondary text-sm">{v.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{v.models.slice(0, 2).join(', ')}</td>
                    <td className="px-4 py-3 text-center text-sm">{v.capacity} persons</td>
                    <td className="px-4 py-3 text-right font-bold text-primary text-sm">₹{i === 0 ? prices.sedanRate : i === 1 ? prices.suvRate : i === 2 ? prices.innovaRate : i === 3 ? prices.crystaRate : prices.tempoRate}/km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-4">Local Taxi Packages in {city.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fares.localPackages.map((pkg) => (
              <div key={pkg.name} className="p-4 bg-white rounded-xl border border-primary/10 shadow-sm">
                <h4 className="font-bold text-secondary mb-2">{pkg.name}</h4>
                <p className="text-sm text-gray-500">Sedan: <span className="font-bold text-primary">₹{pkg.sedan}</span></p>
                <p className="text-sm text-gray-500">SUV: <span className="font-bold text-primary">₹{pkg.suv}</span></p>
                <p className="text-sm text-gray-500">Tempo: <span className="font-bold text-primary">₹{pkg.tempo}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section — Our Vehicles */}
      <FleetSection cityName={city.name} />

      {/* Landmarks */}
      {city.landmarks && city.landmarks.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">Pickup & Drop Points in <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">We pick up and drop at all major locations in {city.name}</p>
            <div className="flex flex-wrap gap-3">
              {city.landmarks.map((l) => (
                <span key={l} className="px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-sm text-gray-700 shadow-sm">{l}</span>
              ))}
              {city.airport && <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium">✈️ {city.airport}</span>}
              {city.railway && <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium">🚂 {city.railway}</span>}
            </div>
          </div>
        </section>
      )}

      {/* Booking */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <BookingForm defaultFrom={city.name} />
        </div>
      </section>

      {/* FAQ — Now with 10+ FAQs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={content.faqs} title={`Frequently Asked Questions — Cab Service in ${city.name}`} />
        </div>
      </section>

      {/* Popular Searches — Real SEO Internal Links (crawlable by Google) */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">People Also Search For</h3>
          <div className="flex flex-wrap gap-2">
            {/* Route-based keywords → link to routes */}
            {routesFrom.slice(0, 8).map((route) => (
              <Link
                key={route.slug}
                href={`/routes/${route.slug}`}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-500 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {city.name} to {route.toName} cab
              </Link>
            ))}
            {/* Service keywords → link to service subpages */}
            {[
              { label: `${city.name} innova cab`, href: `/${stateSlug}/${citySlug}/outstation` },
              { label: `outstation cab ${city.name}`, href: `/${stateSlug}/${citySlug}/outstation` },
              { label: `one way cab ${city.name}`, href: `/${stateSlug}/${citySlug}/one-way` },
              { label: `${city.name} airport cab`, href: `/${stateSlug}/${citySlug}/airport-transfer` },
              { label: `local taxi ${city.name}`, href: `/${stateSlug}/${citySlug}/local` },
              { label: `round trip cab ${city.name}`, href: `/${stateSlug}/${citySlug}/round-trip` },
              { label: `wedding car ${city.name}`, href: `/${stateSlug}/${citySlug}/wedding-car` },
              { label: `${city.name} suv cab`, href: `/${stateSlug}/${citySlug}/outstation` },
              { label: `corporate cab ${city.name}`, href: `/${stateSlug}/${citySlug}/local` },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-500 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Fare Calculator */}
      <FareCalculator defaultFrom={city.name} />

      {/* Google Maps — City Coverage */}
      <GoogleMapEmbed
        cityName={city.name}
        cityLat={city.lat}
        cityLng={city.lng}
        title={`Cab Service Coverage in ${city.name}`}
        subtitle={`We provide cab pickup and drop across all areas of ${city.name}, ${state.name}. View our service coverage area.`}
      />

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Your Cab in {city.name} Now!</h2>
          <p className="text-white/90 mb-6">Call us for instant booking. Available 24/7 in {city.name}!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a cab in ${city.name}.`)}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
