import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Phone, Clock, Car, CheckCircle, Shield, Star } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import { getState, getCity, getAllCities, getVehicles, BUSINESS } from '@/lib/data';
import { getStatePriceLabels } from '@/lib/data';
import { getRoutesFrom } from '@/lib/routeData';
import { generateFaqSchema, generateBreadcrumbSchema, getCityGeoMeta, generateCitySubServiceSchema } from '@/lib/seo';
import { generateOneWayServiceContent } from '@/lib/serviceContent';
import { formatBoldText } from '@/lib/textHelper';

// Pre-render pages as static HTML to avoid edge CPU execution limits
export const dynamicParams = false;
export const dynamic = 'force-static';
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
  const canonicalUrl = `${BUSINESS.domain}/${stateSlug}/${citySlug}/one-way`;
  return {
    title: `One Way Cab from ${city.name} ${metaPrices.sedanPerKm} | Pay One Side Only | ${BUSINESS.name}`,
    description: `Book one-way cab from ${city.name}, ${stateName}. Pay only one side — no return charges! Sedan ${metaPrices.sedanPerKm}, SUV ${metaPrices.suvPerKm}. 40-50% cheaper than round trip. 24/7. Call ${BUSINESS.phone}`.slice(0, 160),
    openGraph: {
      title: `One Way Cab from ${city.name} | Pay One Side | ${BUSINESS.name}`,
      description: `One-way taxi from ${city.name}. No return charges. ${metaPrices.sedanPerKm}. Call ${BUSINESS.phone}`,
      type: 'website', siteName: BUSINESS.name, url: canonicalUrl, locale: 'en_IN',
      images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: `One Way Cab from ${city.name}` }],
    },
    twitter: { card: 'summary_large_image', title: `One Way Taxi from ${city.name} | ${BUSINESS.name}`, images: [`${BUSINESS.domain}/navbanner.webp`] },
    alternates: { canonical: canonicalUrl },
    other: { thumbnail: `${BUSINESS.domain}/navbanner.webp` },
    keywords: [
      `one way cab from ${city.name}`,
      `one way taxi from ${city.name}`,
      `one side cab ${city.name}`,
      `${city.name} one way cab`,
      `${city.name} one way taxi`,
      `one way cab booking ${city.name}`,
      `one way cab ${metaPrices.sedanPerKm} ${city.name}`,
      `one way drop cab ${city.name}`,
      `${city.name} to kolkata one way cab`,
      `kolkata to ${city.name} one way cab`,
      `cheap one way cab ${city.name}`,
      `no return charge cab ${city.name}`,
      `single trip cab ${city.name}`,
      `one way sedan ${city.name}`,
      `one way suv ${city.name}`,
    ],
  };
}

export default async function OneWayPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug);
  const city = getCity(stateSlug, citySlug);
  if (!state || !city) notFound();
  const prices = getStatePriceLabels(stateSlug);

  const routes = (await getRoutesFrom(citySlug)).slice(0, 10);
  const vehicles = getVehicles();
  const content = generateOneWayServiceContent({ cityName: city.name, stateName: state.name, stateSlug: state.slug, citySlug: city.slug, landmarks: city.landmarks, airport: city.airport, railway: city.railway });

  return (
    <>
      {(() => { const geo = getCityGeoMeta(city.name, state.slug, city.lat, city.lng); return (<><meta name="geo.region" content={geo['geo.region']} /><meta name="geo.placename" content={geo['geo.placename']} /><meta name="geo.position" content={geo['geo.position']} /><meta name="ICBM" content={geo['ICBM']} /></>); })()}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCitySubServiceSchema(city.name, state.name, state.slug, city.slug, 'One Way Taxi Service', 'one-way', `One-way taxi from ${city.name}. Pay one side only. Sedan ${prices.sedanPerKm}, SUV ${prices.suvPerKm}. No return charges.`, '11', '18')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(content.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain }, { name: state.name, url: `${BUSINESS.domain}/${state.slug}` },
        { name: city.name, url: `${BUSINESS.domain}/${state.slug}/${city.slug}` },
        { name: 'One-Way Cab', url: `${BUSINESS.domain}/${stateSlug}/${citySlug}/one-way` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: state.name, href: `/${state.slug}` }, { name: city.name, href: `/${state.slug}/${city.slug}` }, { name: 'One-Way Cab', href: `/${state.slug}/${city.slug}/one-way` }]} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">One Way Cab from <span className="text-gradient">{city.name}</span> — Pay One Side Only</h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">Most affordable intercity cab from {city.name}. Pay only for one-way distance — no return fare charges. 40-50% cheaper than round trip. AC vehicles, verified drivers, 24/7.</p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-6">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Car size={14} /> Sedan {prices.sedanPerKm}</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Car size={14} /> SUV {prices.suvPerKm}</span>
            <span className="flex items-center gap-1.5 bg-green-500/30 px-3 py-1.5 rounded-full font-semibold">💰 Save 40-50%</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg"><Phone size={18} /> Book Now: {BUSINESS.phone}</a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a one-way cab from ${city.name}.`)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg">💬 WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[{ icon: <CheckCircle size={16} />, text: 'No Return Charges' }, { icon: <Shield size={16} />, text: 'Verified Drivers' }, { icon: <Clock size={16} />, text: '24/7 Available' }, { icon: <Star size={16} />, text: '4.8★ Rating' }].map((b, i) => (
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
                <h2 className="text-2xl font-bold text-secondary mb-4">One Way Taxi from {city.name}, {state.name} — Save 40-50% vs Round Trip</h2>
                
                {/* ── QUICK ANSWER BOX — targets AI Overviews ── */}
                <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full text-left">
                    <h4 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                      ⚡ Quick Answer — {city.name} One-Way Cab Facts
                    </h4>
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">One-Way Sedan</dt>
                        <dd className="font-bold text-secondary">₹{prices.sedanPerKm}</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">One-Way SUV</dt>
                        <dd className="font-bold text-secondary">₹{prices.suvPerKm}</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">Savings vs Round</dt>
                        <dd className="font-bold text-primary">40% - 50% Off</dd>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                        <dt className="text-xs text-gray-400 mb-1">Return Fare</dt>
                        <dd className="font-bold text-primary">₹0 (Zero)</dd>
                      </div>
                    </dl>
                    <p className="text-xs text-gray-500 mt-3">
                      📍 Ideal for: Drop-only trips, relocations, airport drops to other cities, and hassle-free single-journey travel.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📞 24/7 Helpline: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a> | All fares include toll guidelines.
                    </p>
                  </div>
                  <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0 border border-amber-200 shadow-sm">
                    <Image
                      src="/navbanner.webp"
                      alt={`One way cab service from ${city.name} - booking AC sedan and SUV taxi`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 160px"
                      priority
                    />
                  </div>
                </div>
                {content.aboutContent.map((para, i) => (<p key={i} className="text-gray-600 mb-4 leading-relaxed">{formatBoldText(para)}</p>))}
              </div>

              {/* Comparison */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">One-Way vs Round Trip — Fare Comparison from {city.name}</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead><tr className="bg-secondary text-white">
                      <th className="px-4 py-3 text-left text-sm">Trip Type</th><th className="px-4 py-3 text-center text-sm">200 km Example</th>
                      <th className="px-4 py-3 text-center text-sm">Sedan</th><th className="px-4 py-3 text-center text-sm">SUV</th>
                    </tr></thead>
                    <tbody>
                      <tr className="bg-green-50"><td className="px-4 py-3 font-semibold text-green-700 text-sm">✅ One-Way</td><td className="px-4 py-3 text-center text-sm">200 km charged</td><td className="px-4 py-3 text-center font-bold text-green-700 text-sm">≈ ₹3,700</td><td className="px-4 py-3 text-center font-bold text-green-700 text-sm">≈ ₹4,800</td></tr>
                      <tr className="bg-red-50"><td className="px-4 py-3 font-semibold text-red-500 text-sm">❌ Round Trip</td><td className="px-4 py-3 text-center text-sm">400 km charged</td><td className="px-4 py-3 text-center font-bold text-red-500 text-sm">≈ ₹5,900</td><td className="px-4 py-3 text-center font-bold text-red-500 text-sm">≈ ₹7,600</td></tr>
                      <tr className="bg-white"><td className="px-4 py-3 font-bold text-primary text-sm">💰 You Save</td><td className="px-4 py-3 text-center text-sm font-medium">50% less</td><td className="px-4 py-3 text-center font-bold text-primary text-sm">₹2,200</td><td className="px-4 py-3 text-center font-bold text-primary text-sm">₹2,800</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fare Table */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">One-Way Cab Fare from {city.name}</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead><tr className="bg-secondary text-white">
                      <th className="px-4 py-3 text-left text-sm">Vehicle</th><th className="px-4 py-3 text-center text-sm">Per KM</th><th className="px-4 py-3 text-center text-sm">Base Fare</th><th className="px-4 py-3 text-center text-sm">Capacity</th>
                    </tr></thead>
                    <tbody>{vehicles.slice(0, 4).map((v, i) => (
                      <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-secondary text-sm">{v.name}</td>
                        <td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{i === 0 ? prices.sedanRate : i === 1 ? prices.suvRate : i === 2 ? prices.innovaRate : i === 3 ? prices.crystaRate : prices.tempoRate}/km</td>
                        <td className="px-4 py-3 text-center text-gray-500 text-sm">₹{v.pricePerKm <= 12 ? '1,500' : v.pricePerKm <= 15 ? '2,000' : '2,500'}</td>
                        <td className="px-4 py-3 text-center text-sm">{v.capacity} pax</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Toll and parking extra. No return fare charged. GST included.</p>
              </div>

              {/* Why Choose */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Why One-Way Cab from {city.name} is Better</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Pay only for one-way distance — zero return charges', '40-50% cheaper than round trip for same distance', 'Same AC vehicles and verified drivers as round trip', 'No surge pricing — fixed rate anytime, any day', 'Available 24/7 — early morning, late night, festivals', 'Instant booking on WhatsApp — confirmation in 2 min', 'Free cancellation up to 4 hours before pickup', `Pickup from home, office, ${city.railway || 'railway station'}, ${city.airport || 'airport'}`].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />{item}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm defaultFrom={city.name} compact />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">One-Way Cab Helpline</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
              <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a one-way cab from ${city.name}.`)}`} className="block w-full p-4 bg-green-500 text-white text-center rounded-xl font-bold hover:bg-green-600 transition-colors">💬 Book on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      {routes.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-2">Popular One-Way Routes from <span className="text-primary">{city.name}</span></h2>
            <p className="text-gray-500 text-sm mb-6">Pay only one-way fare — no return charges</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((r) => (
                <Link key={r.slug} href={`/routes/${r.slug}`} className="group bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{r.fromName} ➡️ {r.toName}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-500">{r.distance} km • One-Way</span>
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
              { name: 'Outstation Cab', slug: 'outstation', price: `${prices.sedanPerKm}` },
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
      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={content.faqs} title={`FAQs — One Way Cab from ${city.name}`} /></div></section>

      {/* Popular Searches */}
      <section className="py-8 bg-white"><div className="max-w-7xl mx-auto px-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">People Also Search For</h3>
        <div className="flex flex-wrap gap-2">{content.popularSearches.slice(0, 24).map((kw, i) => (<a key={i} href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a one-way cab. Query: ${kw}`)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors">{kw}</a>))}</div>
      </div></section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book One-Way Cab from {city.name} — Save 50%!</h2>
          <p className="text-white/90 mb-6">Sedan {prices.sedanPerKm} | SUV {prices.suvPerKm} | No Return Charges | 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all"><Phone size={22} /> {BUSINESS.phone}</a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need a one-way cab from ${city.name}.`)}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">💬 WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
