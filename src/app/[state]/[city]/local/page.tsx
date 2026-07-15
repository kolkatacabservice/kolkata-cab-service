import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Phone, Clock, Car, CheckCircle, Shield, Star, CreditCard } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import { getState, getCity, getAllCities, getLocalPackages, getVehicles, BUSINESS } from '@/lib/data';
import { getStatePriceLabels } from '@/lib/data';
import { getRoutesFrom } from '@/lib/routeData';
import { generateFaqSchema, generateBreadcrumbSchema, getCityGeoMeta, generateCitySubServiceSchema } from '@/lib/seo';
import { generateLocalServiceContent } from '@/lib/serviceContent';
import { formatBoldText } from '@/lib/textHelper';

// Cloudflare Workers edge SSR — all city/service pages render on first request
// and are cached by Cloudflare edge for 30 days via Cache-Control headers.
export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  // Return empty — all 119 city pages render on demand via CF Workers edge SSR.
  // CF Cache then serves subsequent requests from cache (zero Workers cost).
  return [];
}


export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  if (!city) return {};
  const metaPrices = getStatePriceLabels(stateSlug);
  const state = getState(stateSlug);
  const stateName = state?.name || stateSlug;
  const canonicalUrl = `${BUSINESS.domain}/${stateSlug}/${citySlug}/local`;
  return {
    title: `Local Cab Service in ${city.name}, ${stateName} ₹${metaPrices.localPkgSedan}/${metaPrices.localPkgName} | Hourly Taxi 24/7 | ${BUSINESS.name}`,
    description: `Best local taxi service in ${city.name}, ${stateName}. Hourly cab rental: Sedan ₹${metaPrices.localPkgSedan}/${metaPrices.localPkgName}, SUV ₹2,500/4hr. Hospital, airport, shopping, sightseeing. AC cabs, verified drivers, 24/7. No surge. Call ${BUSINESS.phone}`.slice(0, 160),
    openGraph: {
      title: `Local Cab in ${city.name} ₹${metaPrices.localPkgSedan}/${metaPrices.localPkgName} | ${BUSINESS.name}`,
      description: `Hourly taxi rental in ${city.name}. AC sedan/SUV, verified drivers. 24/7. Call ${BUSINESS.phone}`,
      type: 'website',
      siteName: BUSINESS.name,
      url: canonicalUrl,
      locale: 'en_IN',
      images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: `Local Cab Service in ${city.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Local Taxi in ${city.name} | ${BUSINESS.name}`,
      description: `Hourly cab rental in ${city.name}. From ₹${metaPrices.localPkgSedan}. Call ${BUSINESS.phone}`,
      images: [`${BUSINESS.domain}/navbanner.webp`],
    },
    alternates: { canonical: canonicalUrl },
    other: { thumbnail: `${BUSINESS.domain}/navbanner.webp` },
    keywords: [
      `local cab service ${city.name}`,
      `local taxi ${city.name}`,
      `hourly cab ${city.name}`,
      `hourly taxi ${city.name}`,
      `local cab booking ${city.name}`,
      `${city.name} local taxi rental`,
      `4 hour cab ${city.name}`,
      `8 hour cab ${city.name}`,
      `local cab for hospital ${city.name}`,
      `${city.name} sightseeing cab`,
      `local cab rental ${city.name}`,
      `full day taxi ${city.name}`,
      `half day taxi ${city.name}`,
      `local cab for shopping ${city.name}`,
      `city tour cab ${city.name}`,
      `local taxi near me ${city.name}`,
    ],
  };
}

export default async function LocalPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug);
  const city = getCity(stateSlug, citySlug);
  if (!state || !city) notFound();
  const prices = getStatePriceLabels(stateSlug);

  const packages = getLocalPackages();
  const vehicles = getVehicles();
  const routes = (await getRoutesFrom(citySlug)).slice(0, 6);

  const content = generateLocalServiceContent({
    cityName: city.name,
    stateName: state.name,
    stateSlug: state.slug,
    citySlug: city.slug,
    landmarks: city.landmarks,
    airport: city.airport,
    railway: city.railway,
  });

  return (
    <>
      {/* Geo Meta Tags */}
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCitySubServiceSchema(city.name, state.name, state.slug, city.slug, 'Local Taxi Service', 'local', `Hourly local cab rental in ${city.name}, ${state.name}. Sedan ₹${prices.localPkgSedan}/${prices.localPkgName}, SUV ₹2,500/4hr. Hospital, airport, shopping. 24/7.`, '1800', '10000')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(content.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: state.name, url: `${BUSINESS.domain}/${state.slug}` },
        { name: city.name, url: `${BUSINESS.domain}/${state.slug}/${city.slug}` },
        { name: 'Local Taxi', url: `${BUSINESS.domain}/${stateSlug}/${citySlug}/local` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[
            { name: state.name, href: `/${state.slug}` },
            { name: city.name, href: `/${state.slug}/${city.slug}` },
            { name: 'Local Taxi', href: `/${state.slug}/${city.slug}/local` },
          ]} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">
            Local Cab Service in <span className="text-gradient">{city.name}</span> ₹{prices.localPkgSedan}/{prices.localPkgName}
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            Hourly taxi rental in {city.name}, {state.name} for hospital visits, airport transfers, shopping, sightseeing & all local travel. AC vehicles, verified drivers, no surge pricing — 24/7 availability.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-6">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Clock size={14} /> 4hr/8hr/12hr Packages</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Car size={14} /> Sedan, SUV, Tempo</span>
            <span className="flex items-center gap-1.5 bg-primary/30 px-3 py-1.5 rounded-full font-semibold"><Star size={14} /> 4.8★ Rating</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
              <Phone size={18} /> Book Now: {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a local taxi in ${city.name}.`)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {[
              { icon: <Shield size={16} />, text: 'Verified Drivers' },
              { icon: <Clock size={16} />, text: '24/7 Available' },
              { icon: <Star size={16} />, text: '4.8★ (2847 Reviews)' },
              { icon: <CheckCircle size={16} />, text: 'No Surge Pricing' },
              { icon: <CreditCard size={16} />, text: 'Cash/UPI/Card' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-primary font-medium">{b.icon} {b.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Rich Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Local Taxi Service in {city.name}, {state.name} — Hourly Cab Rental ₹1,800</h2>
                
                {/* ── QUICK ANSWER BOX — targets AI Overviews ── */}
                <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full text-left">
                    <h4 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                      ⚡ Quick Answer — {city.name} Local Cab Rental Facts
                    </h4>
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">4h/40km Sedan</dt>
                        <dd className="font-bold text-secondary">₹{prices.localPkgSedan}</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">8h/80km Sedan</dt>
                        <dd className="font-bold text-secondary">₹{packages[1]?.sedan || '2,800'}</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">Extra KM Rate</dt>
                        <dd className="font-bold text-primary">₹{prices.sedanPerKm}</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">Driver Allowance</dt>
                        <dd className="font-bold text-primary">Included</dd>
                      </div>
                    </dl>
                    <p className="text-xs text-gray-500 mt-3">
                      📍 Ideal for: City shopping, sightseeing, business meetings, and medical checkups with multiple stops.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📞 24/7 Helpline: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a> | Cabs are sanitized after every trip.
                    </p>
                  </div>
                  <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0 border border-amber-200 shadow-sm">
                    <Image
                      src="/navbanner.webp"
                      alt={`Local hourly cab rental in ${city.name} - AC Sedan & SUV taxi`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 160px"
                      priority
                    />
                  </div>
                </div>
                {content.aboutContent.map((para, i) => (
                  <p key={i} className="text-gray-600 mb-4 leading-relaxed">{formatBoldText(para)}</p>
                ))}
              </div>

              {/* Packages Table */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Local Taxi Packages in {city.name} (2025)</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-secondary text-white">
                        <th className="px-4 py-3 text-left text-sm">Package</th>
                        <th className="px-4 py-3 text-center text-sm">Sedan Fare</th>
                        <th className="px-4 py-3 text-center text-sm">SUV Fare</th>
                        <th className="px-4 py-3 text-center text-sm">Tempo Fare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-secondary text-sm">{pkg.name}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{pkg.sedan}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{pkg.suv}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{pkg.tempo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Extra km: {prices.sedanPerKm} (Sedan), {prices.suvPerKm} (SUV). Extra hour: ₹150–₹200/hr. No surge pricing.</p>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">When to Use Local Taxi in {city.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {content.useCases.map((uc, i) => (
                    <div key={i} className="p-4 bg-accent/50 rounded-xl border border-primary/10 text-center">
                      <div className="text-3xl mb-2">{uc.icon}</div>
                      <h4 className="font-bold text-secondary text-xs mb-1">{uc.title}</h4>
                      <p className="text-gray-400 text-xs">{uc.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Why Choose {BUSINESS.name} for Local Taxi in {city.name}?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.whyChooseUs.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Landmarks */}
              {city.landmarks && city.landmarks.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-secondary mb-4">Local Taxi Pickup Points in {city.name}</h3>
                  <p className="text-gray-600 mb-3">We pick up and drop from every location in {city.name}:</p>
                  <div className="flex flex-wrap gap-2">
                    {city.landmarks.map((l) => (
                      <span key={l} className="px-3 py-1.5 bg-accent rounded-full text-sm text-gray-700 font-medium">{l}</span>
                    ))}
                    {city.airport && <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium">✈️ {city.airport}</span>}
                    {city.railway && <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium">🚂 {city.railway}</span>}
                  </div>
                </div>
              )}

              {/* Fleet Info */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Our Vehicle Fleet in {city.name}</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-secondary text-white">
                        <th className="px-4 py-3 text-left text-sm">Vehicle</th>
                        <th className="px-4 py-3 text-left text-sm">Models</th>
                        <th className="px-4 py-3 text-center text-sm">Capacity</th>
                        <th className="px-4 py-3 text-right text-sm">Per KM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.slice(0, 4).map((v, i) => (
                        <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-secondary text-sm">{v.name}</td>
                          <td className="px-4 py-3 text-gray-500 text-sm">{v.models.slice(0, 2).join(', ')}</td>
                          <td className="px-4 py-3 text-center text-sm">{v.capacity} pax</td>
                          <td className="px-4 py-3 text-right font-bold text-primary text-sm">₹{i === 0 ? prices.sedanRate : i === 1 ? prices.suvRate : i === 2 ? prices.innovaRate : i === 3 ? prices.crystaRate : prices.tempoRate}/km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm defaultFrom={city.name} compact />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">{city.name} Cab Helpline</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
              <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a local taxi in ${city.name}.`)}`} className="block w-full p-4 bg-green-500 text-white text-center rounded-xl font-bold hover:bg-green-600 transition-colors">
                💬 Book on WhatsApp
              </a>
              <div className="p-4 bg-accent rounded-xl space-y-3">
                <h4 className="font-bold text-secondary text-sm">Quick Fares in {city.name}</h4>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Local 4hr/40km</span><span className="font-semibold text-primary">₹{prices.localPkgSedan}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Local 8hr/80km</span><span className="font-semibold text-primary">₹{prices.fares.localPackages[1]?.sedan || '2,800'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Outstation Rate</span><span className="font-semibold text-secondary">{prices.sedanPerKm}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">SUV Rate</span><span className="font-semibold text-secondary">{prices.suvPerKm}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes from City */}
      {routes.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">Also Available — Outstation Cab from <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">Need to travel outside {city.name}? Book outstation cab at {prices.sedanPerKm}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((r) => (
                <Link key={r.slug} href={`/routes/${r.slug}`} className="group bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{r.fromName} → {r.toName}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-500">{r.distance} km • {r.duration} hrs</span>
                    <span className="text-primary font-bold">₹{r.priceSaloon}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Services */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Other Services in <span className="text-primary">{city.name}</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Outstation Cab', slug: 'outstation', price: `${prices.sedanPerKm}` },
              { name: 'One-Way Taxi', slug: 'one-way', price: `${prices.sedanPerKm}` },
              { name: 'Two-Way Cab', slug: 'two-way', price: `${prices.sedanPerKm}` },
              { name: 'Round Trip', slug: 'round-trip', price: `${prices.sedanPerKm}` },
              { name: 'Airport Transfer', slug: 'airport-transfer', price: `${prices.airportSedan}+` },
              { name: 'Wedding Car', slug: 'wedding-car', price: '₹5,000+' },
            ].map((srv) => (
              <Link key={srv.slug} href={`/${stateSlug}/${citySlug}/${srv.slug}`} className="group p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-all text-center">
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{srv.name}</p>
                <p className="text-xs text-primary font-medium mt-1">{srv.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={content.faqs} title={`FAQs — Local Taxi in ${city.name}, ${state.name}`} />
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">People Also Search For</h3>
          <div className="flex flex-wrap gap-2">
            {content.popularSearches.slice(0, 24).map((kw, i) => (
              <a
                key={i}
                href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a cab in ${city.name}. Query: ${kw}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {kw}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Local Taxi in {city.name} Now!</h2>
          <p className="text-white/90 mb-6">4 Hrs ₹1,800 | 8 Hrs ₹2,800 | AC Vehicles | 24/7 | No Surge</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a local taxi in ${city.name}.`)}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
