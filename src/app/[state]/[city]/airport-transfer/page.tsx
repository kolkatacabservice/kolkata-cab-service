import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Phone, Clock, CheckCircle, Shield, Star, Plane } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import { getState, getCity, getAllCities, getVehicles, BUSINESS } from '@/lib/data';
import { getStatePriceLabels } from '@/lib/data';
import { generateFaqSchema, generateBreadcrumbSchema, getCityGeoMeta, generateCitySubServiceSchema } from '@/lib/seo';
import { generateAirportServiceContent } from '@/lib/serviceContent';
import { formatBoldText } from '@/lib/textHelper';

// Cloudflare Workers edge SSR — renders on first request, cached 30 days by CF edge
export const dynamicParams = true;
export const revalidate = false;
export async function generateStaticParams() { return []; }


export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  if (!city) return {};
  const metaPrices = getStatePriceLabels(stateSlug);
  const airportName = city.airport || `${city.name} Airport`;
  const canonicalUrl = `${BUSINESS.domain}/${stateSlug}/${citySlug}/airport-transfer`;
  return {
    title: `Airport Cab in ${city.name} from ${metaPrices.airportSedan} | ${airportName} Pickup & Drop 24/7 | ${BUSINESS.name}`,
    description: `Airport taxi in ${city.name}. Pickup/drop at ${airportName}. Sedan ${metaPrices.airportSedan}, SUV ₹2,500. Flight tracking, meet & greet. 24/7. Call ${BUSINESS.phone}`.slice(0, 160),
    openGraph: { title: `Airport Cab ${city.name} ${metaPrices.airportSedan} | ${BUSINESS.name}`, type: 'website', siteName: BUSINESS.name, url: canonicalUrl, locale: 'en_IN', images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: `Airport Cab in ${city.name}` }] },
    twitter: { card: 'summary_large_image', title: `Airport Taxi ${city.name} | ${BUSINESS.name}`, images: [`${BUSINESS.domain}/navbanner.webp`] },
    alternates: { canonical: canonicalUrl },
    other: { thumbnail: `${BUSINESS.domain}/navbanner.webp` },
    keywords: [
      `airport cab ${city.name}`,
      `airport taxi ${city.name}`,
      `airport transfer ${city.name}`,
      `${airportName} cab`,
      `${airportName} taxi`,
      `${airportName} pickup`,
      `${airportName} drop`,
      `${city.name} airport pickup`,
      `${city.name} airport drop`,
      `${city.name} airport cab service`,
      `airport cab booking ${city.name}`,
      `flight tracking cab ${city.name}`,
      `meet and greet airport ${city.name}`,
      `24/7 airport taxi ${city.name}`,
      `airport sedan cab ${city.name}`,
      `airport suv cab ${city.name}`,
      `corporate airport transfer ${city.name}`,
    ],
  };
}

export default async function AirportTransferPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug); const city = getCity(stateSlug, citySlug);
  if (!state || !city) notFound();
  const prices = getStatePriceLabels(stateSlug);
  const vehicles = getVehicles();
  const airportName = city.airport || `${city.name} Airport`;
  const content = generateAirportServiceContent({ cityName: city.name, stateName: state.name, stateSlug: state.slug, citySlug: city.slug, landmarks: city.landmarks, airport: city.airport, railway: city.railway });

  return (
    <>
      {(() => { const geo = getCityGeoMeta(city.name, state.slug, city.lat, city.lng); return (<><meta name="geo.region" content={geo['geo.region']} /><meta name="geo.placename" content={geo['geo.placename']} /><meta name="geo.position" content={geo['geo.position']} /><meta name="ICBM" content={geo['ICBM']} /></>); })()}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCitySubServiceSchema(city.name, state.name, state.slug, city.slug, 'Airport Transfer Service', 'airport-transfer', `Professional airport pickup and drop at ${airportName}, ${city.name}. Flight tracking, meet & greet, 24/7. Sedan from ₹1200.`, '800', '3000')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(content.faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: BUSINESS.domain }, { name: state.name, url: `${BUSINESS.domain}/${state.slug}` }, { name: city.name, url: `${BUSINESS.domain}/${state.slug}/${city.slug}` }, { name: 'Airport Transfer', url: `${BUSINESS.domain}/${stateSlug}/${citySlug}/airport-transfer` }])) }} />

      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: state.name, href: `/${state.slug}` }, { name: city.name, href: `/${state.slug}/${city.slug}` }, { name: 'Airport Transfer', href: `/${state.slug}/${city.slug}/airport-transfer` }]} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">Airport Cab in <span className="text-gradient">{city.name}</span> — {prices.airportSedan} Flat</h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">{airportName} pickup & drop. Flight tracking, meet & greet with name board, luggage assistance. Flat fare — no surge. 24/7.</p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg"><Phone size={18} /> {BUSINESS.phone}</a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need airport cab in ${city.name}.`)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg">💬 WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-gray-100"><div className="max-w-7xl mx-auto px-4"><div className="flex flex-wrap justify-center gap-6 text-sm">
        {[{ icon: <Plane size={16} />, t: 'Flight Tracking' }, { icon: <Shield size={16} />, t: 'Meet & Greet' }, { icon: <Clock size={16} />, t: '24/7 Available' }, { icon: <Star size={16} />, t: 'Flat Fare — No Surge' }].map((b, i) => (<div key={i} className="flex items-center gap-1.5 text-primary font-medium">{b.icon} {b.t}</div>))}
      </div></div></section>

      <section className="py-12 bg-white"><div className="max-w-7xl mx-auto px-4"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div><h2 className="text-2xl font-bold text-secondary mb-4">Airport Transfer Service in {city.name} — {airportName} Pickup & Drop</h2>
            
            {/* ── QUICK ANSWER BOX — targets AI Overviews ── */}
            <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full text-left">
                <h4 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                  ⚡ Quick Answer — {city.name} Airport Taxi Facts
                </h4>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">Sedan Fare</dt>
                    <dd className="font-bold text-secondary">₹{prices.airportSedan}</dd>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">SUV Fare</dt>
                    <dd className="font-bold text-secondary">₹{prices.airportSuv || '2,500'}</dd>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">Flight Delay Wait</dt>
                    <dd className="font-bold text-primary">Free (No Limit)</dd>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                    <dt className="text-xs text-gray-400 mb-1">Toll & Parking</dt>
                    <dd className="font-bold text-primary">Included</dd>
                  </div>
                </dl>
                <p className="text-xs text-gray-500 mt-3">
                  📍 Service area: Direct pickup and drop to/from {airportName} with live flight tracking and terminal meet & greet.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📞 24/7 Helpline: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a> | Safe & on-time transfers.
                </p>
              </div>
              <div className="relative w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0 border border-amber-200 shadow-sm">
                <Image
                  src="/navbanner.webp"
                  alt={`Airport transfer cab service in ${city.name} - booking AC sedan and SUV taxi`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 160px"
                  priority
                />
              </div>
            </div>
            {content.aboutContent.map((p, i) => (<p key={i} className="text-gray-600 mb-4 leading-relaxed">{formatBoldText(p)}</p>))}
          </div>
          <div><h3 className="text-xl font-bold text-secondary mb-4">Airport Cab Fare in {city.name}</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm"><table className="w-full border-collapse bg-white">
              <thead><tr className="bg-secondary text-white"><th className="px-4 py-3 text-left text-sm">Vehicle</th><th className="px-4 py-3 text-center text-sm">Airport Fare</th><th className="px-4 py-3 text-center text-sm">Capacity</th></tr></thead>
              <tbody>{vehicles.slice(0, 4).map((v, i) => (<tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}><td className="px-4 py-3 font-semibold text-secondary text-sm">{v.name}</td><td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{v.pricePerKm <= 12 ? '800' : v.pricePerKm <= 15 ? '1,200' : '1,500'}+</td><td className="px-4 py-3 text-center text-sm">{v.capacity} pax</td></tr>))}</tbody>
            </table></div>
            <p className="text-xs text-gray-400 mt-2">* Flat fare for airport area. Extra km at ₹{vehicles[0]?.pricePerKm || 12}/km. Toll & parking included.</p>
          </div>
          <div><h3 className="text-xl font-bold text-secondary mb-4">Airport Cab Features in {city.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Real-time flight tracking — we adjust for delays', 'Meet & greet at arrival gate with name board', 'Free waiting up to 45 min for flight delays', 'Luggage assistance — driver helps with bags', 'Flat fare — no meter, no surge, no hidden charges', '24/7 including early morning 3 AM flights', 'AC, GPS-tracked, sanitized vehicles', 'Corporate airport packages with GST billing'].map((item, i) => (<div key={i} className="flex items-start gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />{item}</div>))}
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <BookingForm defaultFrom={city.name} compact />
          <div className="p-4 bg-secondary rounded-xl text-white text-center"><p className="text-sm text-gray-300 mb-2">Airport Cab Helpline</p><a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a></div>
        </div>
      </div></div></section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Other Services in <span className="text-primary">{city.name}</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Local Taxi', slug: 'local', price: `₹${prices.localPkgSedan}/${prices.localPkgName}` },
              { name: 'Outstation Cab', slug: 'outstation', price: `${prices.sedanPerKm}` },
              { name: 'One-Way Taxi', slug: 'one-way', price: `${prices.sedanPerKm}` },
              { name: 'Two-Way Cab', slug: 'two-way', price: `${prices.sedanPerKm}` },
              { name: 'Round Trip', slug: 'round-trip', price: `${prices.sedanPerKm}` },
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

      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={content.faqs} title={`FAQs — Airport Cab in ${city.name}`} /></div></section>
      <section className="py-8 bg-white"><div className="max-w-7xl mx-auto px-4"><h3 className="text-sm font-semibold text-gray-400 mb-3">People Also Search For</h3><div className="flex flex-wrap gap-2">{content.popularSearches.slice(0, 24).map((kw, i) => (<a key={i} href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I need airport cab. Query: ${kw}`)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors">{kw}</a>))}</div></div></section>

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center"><div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Airport Cab in {city.name}!</h2>
        <p className="text-white/90 mb-6">Sedan {prices.airportSedan} | Flight Tracking | Meet & Greet | 24/7</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all"><Phone size={22} /> {BUSINESS.phone}</a>
          <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! Airport cab in ${city.name}.`)}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">💬 WhatsApp</a>
        </div>
      </div></section>
    </>
  );
}
