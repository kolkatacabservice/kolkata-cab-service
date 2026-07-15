import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Phone, Clock, Car, CheckCircle, Shield, Star, Route, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import { getState, getCity, getAllCities, getVehicles, BUSINESS } from '@/lib/data';
import { getStatePriceLabels } from '@/lib/data';
import { getRoutesFrom } from '@/lib/routeData';
import { generateFaqSchema, generateBreadcrumbSchema, getCityGeoMeta, generateCitySubServiceSchema } from '@/lib/seo';
import { generateOutstationServiceContent } from '@/lib/serviceContent';
import { formatBoldText } from '@/lib/textHelper';

// Cloudflare Workers edge SSR — renders on first request, cached 30 days by CF edge
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  // Pre-render ALL cities at build time — eliminates SSR cold starts on CF Free Tier
  const { getAllCities } = await import('@/lib/data');
  const cities = getAllCities();
  return cities.map(c => ({ state: c.state, city: c.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  const state = getState(stateSlug);
  if (!city) return {};
  const metaPrices = getStatePriceLabels(stateSlug);
  const stateName = state?.name || stateSlug;
  const canonicalUrl = `${BUSINESS.domain}/${stateSlug}/${citySlug}/outstation`;
  return {
    title: `Outstation Cab from ${city.name} ${metaPrices.sedanPerKm} | AC Taxi One-Way & Round Trip | ${BUSINESS.name}`,
    description: `Book outstation cab from ${city.name}, ${stateName}. Intercity AC taxi: Sedan ${metaPrices.sedanPerKm}, SUV ${metaPrices.suvPerKm}, Crysta ${metaPrices.crystaPerKm}. One-way & round trip. 24/7. Call ${BUSINESS.phone}`.slice(0, 160),
    openGraph: {
      title: `Outstation Cab from ${city.name} ${metaPrices.sedanPerKm} | ${BUSINESS.name}`,
      description: `Intercity taxi from ${city.name}. AC sedan/SUV, verified drivers. Call ${BUSINESS.phone}`,
      type: 'website', siteName: BUSINESS.name, url: canonicalUrl, locale: 'en_IN',
      images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: `Outstation Cab from ${city.name}` }],
    },
    twitter: { card: 'summary_large_image', title: `Outstation Cab from ${city.name} | ${BUSINESS.name}`, images: [`${BUSINESS.domain}/navbanner.webp`] },
    alternates: { canonical: canonicalUrl },
    other: { thumbnail: `${BUSINESS.domain}/navbanner.webp` },
    keywords: [
      `outstation cab from ${city.name}`,
      `outstation taxi from ${city.name}`,
      `intercity cab ${city.name}`,
      `${city.name} outstation cab`,
      `${city.name} outstation taxi`,
      `${city.name} outstation cab booking`,
      `${city.name} intercity taxi`,
      `one way cab from ${city.name}`,
      `round trip cab from ${city.name}`,
      `${city.name} cab ${metaPrices.sedanPerKm}`,
      `outstation sedan ${city.name}`,
      `outstation suv ${city.name}`,
      `outstation innova ${city.name}`,
      `outstation tempo traveller ${city.name}`,
      `${city.name} to kolkata outstation cab`,
      `best outstation cab ${city.name}`,
      `24/7 outstation cab ${city.name}`,
    ],
  };
}

export default async function OutstationPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug);
  const city = getCity(stateSlug, citySlug);
  if (!state || !city) notFound();
  const prices = getStatePriceLabels(stateSlug);

  const routes = (await getRoutesFrom(citySlug)).slice(0, 12);
  const vehicles = getVehicles();
  const content = generateOutstationServiceContent({ cityName: city.name, stateName: state.name, stateSlug: state.slug, citySlug: city.slug, landmarks: city.landmarks, airport: city.airport, railway: city.railway });

  return (
    <>
      {(() => { const geo = getCityGeoMeta(city.name, state.slug, city.lat, city.lng); return (<><meta name="geo.region" content={geo['geo.region']} /><meta name="geo.placename" content={geo['geo.placename']} /><meta name="geo.position" content={geo['geo.position']} /><meta name="ICBM" content={geo['ICBM']} /></>); })()}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCitySubServiceSchema(city.name, state.name, state.slug, city.slug, 'Outstation Cab Service', 'outstation', `Intercity cab from ${city.name}, ${state.name}. Sedan ${prices.sedanPerKm}, SUV ${prices.suvPerKm}. One-way & round trip. 24/7.`, '11', '18')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(content.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain }, { name: state.name, url: `${BUSINESS.domain}/${state.slug}` },
        { name: city.name, url: `${BUSINESS.domain}/${state.slug}/${city.slug}` },
        { name: 'Outstation Cab', url: `${BUSINESS.domain}/${stateSlug}/${citySlug}/outstation` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: state.name, href: `/${state.slug}` }, { name: city.name, href: `/${state.slug}/${city.slug}` }, { name: 'Outstation Cab', href: `/${state.slug}/${city.slug}/outstation` }]} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">Outstation Cab from <span className="text-gradient">{city.name}</span> {prices.sedanPerKm}</h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">Comfortable, affordable intercity cab service from {city.name}, {state.name}. AC Sedan, SUV, Innova Crysta, Tempo Traveller. One-way & round trip. 24/7 booking — no surge pricing.</p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-6">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Car size={14} /> Sedan {prices.sedanPerKm}</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Car size={14} /> SUV {prices.suvPerKm}</span>
            <span className="flex items-center gap-1.5 bg-primary/30 px-3 py-1.5 rounded-full font-semibold"><Star size={14} /> 4.8★ Rating</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg"><Phone size={18} /> Book Now: {BUSINESS.phone}</a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need an outstation cab from ${city.name}.`)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg">💬 WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[{ icon: <Shield size={16} />, text: 'Verified Drivers' }, { icon: <Clock size={16} />, text: '24/7 Available' }, { icon: <Star size={16} />, text: '4.8★ (2847 Reviews)' }, { icon: <CheckCircle size={16} />, text: 'No Surge Pricing' }, { icon: <Route size={16} />, text: '500+ Routes' }].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-primary font-medium">{b.icon} {b.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Outstation Cab Service from {city.name}, {state.name} — {prices.sedanPerKm} | Book Online 24/7</h2>
                
                {/* ── QUICK ANSWER BOX — targets AI Overviews ── */}
                <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full text-left">
                    <h4 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                      ⚡ Quick Answer — {city.name} Outstation Cab Facts
                    </h4>
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">Sedan Rate</dt>
                        <dd className="font-bold text-secondary">₹{prices.sedanRate}/km</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">SUV Rate</dt>
                        <dd className="font-bold text-secondary">₹{prices.suvRate}/km</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">Min Distance</dt>
                        <dd className="font-bold text-primary">150 km/day</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">Driver Charges</dt>
                        <dd className="font-bold text-primary">₹300/day</dd>
                      </div>
                    </dl>
                    <p className="text-xs text-gray-500 mt-3">
                      📍 Ideal for: Intercity round trips, weekend getaways, and outstation drops across West Bengal, Jharkhand, and Bihar.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📞 24/7 Helpline: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a> | Experienced highway drivers.
                    </p>
                  </div>
                  <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0 border border-amber-200 shadow-sm">
                    <Image
                      src="/navbanner.webp"
                      alt={`Outstation cab service from ${city.name} - booking AC sedan and SUV taxi`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 160px"
                      priority
                    />
                  </div>
                </div>
                {content.aboutContent.map((para, i) => (<p key={i} className="text-gray-600 mb-4 leading-relaxed">{formatBoldText(para)}</p>))}
              </div>

              {/* Fare Table */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Outstation Cab Fare Chart from {city.name}</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead><tr className="bg-secondary text-white">
                      <th className="px-4 py-3 text-left text-sm">Vehicle</th><th className="px-4 py-3 text-left text-sm">Models</th>
                      <th className="px-4 py-3 text-center text-sm">Capacity</th><th className="px-4 py-3 text-right text-sm">Per KM</th>
                    </tr></thead>
                    <tbody>{vehicles.slice(0, 4).map((v, i) => (
                      <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-secondary text-sm">{v.name}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{v.models.slice(0, 2).join(', ')}</td>
                        <td className="px-4 py-3 text-center text-sm">{v.capacity} pax</td>
                        <td className="px-4 py-3 text-right font-bold text-primary text-sm">₹{i === 0 ? prices.sedanRate : i === 1 ? prices.suvRate : i === 2 ? prices.innovaRate : i === 3 ? prices.crystaRate : prices.tempoRate}/km</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Minimum 150 km/day (one-way), 250 km/day (round trip). Toll, parking, permit extra.</p>
              </div>

              {/* Why Choose */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Why Choose {BUSINESS.name} for Outstation from {city.name}?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['24/7 outstation availability — early morning & late night', 'One-way & round trip — pay only for what you use', 'Experienced drivers who know intercity routes thoroughly', 'No surge pricing — same rate during festivals & holidays', 'AC, GPS-tracked, sanitized vehicles', 'Free cancellation up to 4 hours before pickup', `Pickup from home, hotel, ${city.railway || 'railway station'}, ${city.airport || 'airport'}`, 'Instant WhatsApp confirmation within 2 minutes'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />{item}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm defaultFrom={city.name} compact />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">Outstation Cab Helpline</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
              <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need an outstation cab from ${city.name}.`)}`} className="block w-full p-4 bg-green-500 text-white text-center rounded-xl font-bold hover:bg-green-600 transition-colors">💬 Book on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      {routes.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">Popular Outstation Routes from <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">Book affordable outstation cab from {city.name}. One-way & round trip available.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {routes.map((r) => (
                <Link key={r.slug} href={`/routes/${r.slug}`} className="group bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0"><ArrowRight size={14} className="text-primary" /></div>
                    <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{r.fromName} → {r.toName}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
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
              { name: 'Local Taxi', slug: 'local', price: `₹${prices.localPkgSedan}/${prices.localPkgName}` },
              { name: 'One-Way Taxi', slug: 'one-way', price: `${prices.sedanPerKm}` },
              { name: 'Two-Way Cab', slug: 'two-way', price: `${prices.sedanPerKm}` },
              { name: 'Round Trip', slug: 'round-trip', price: `${prices.sedanPerKm}` },
              { name: 'Airport Transfer', slug: 'airport-transfer', price: `${prices.airportSedan}+` },
              { name: 'Wedding Car', slug: 'wedding-car', price: '₹5,000+' }
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
      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={content.faqs} title={`FAQs — Outstation Cab from ${city.name}, ${state.name}`} /></div></section>

      {/* Popular Searches */}
      <section className="py-8 bg-white"><div className="max-w-7xl mx-auto px-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">People Also Search For</h3>
        <div className="flex flex-wrap gap-2">{content.popularSearches.slice(0, 24).map((kw, i) => (<a key={i} href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need an outstation cab from ${city?.name || 'this city'}. Query: ${kw}`)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors">{kw}</a>))}</div>
      </div></section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Outstation Cab from {city.name} Now!</h2>
          <p className="text-white/90 mb-6">Sedan {prices.sedanPerKm} | SUV {prices.suvPerKm} | AC Vehicles | 24/7 | No Surge</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all"><Phone size={22} /> {BUSINESS.phone}</a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need an outstation cab from ${city.name}.`)}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">💬 WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
