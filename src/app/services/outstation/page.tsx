import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS, getAllStates } from '@/lib/data';
import { getPopularRoutes } from '@/lib/routeData';
import { generateServicePageMetadata, generateFaqSchema, generateBreadcrumbSchema, generateServiceTypeSchema } from '@/lib/seo';
import { Phone, CheckCircle } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = generateServicePageMetadata(
  'Outstation Cab Service',
  'Kolkata outstation cab service across 500+ routes. Sedan ₹12/km, SUV ₹16/km. One-way & round trip. 24/7 booking'
);

export default async function OutstationPage() {
  const states = getAllStates();
  const routes = await getPopularRoutes(12);

  const faqs = [
    { question: 'What is outstation cab service from Kolkata?', answer: `Outstation cab from Kolkata means intercity taxi service where you travel between Kolkata and other cities. ${BUSINESS.name} covers 500+ outstation routes from Kolkata including Darjeeling, Puri, Ranchi, Bhubaneswar, Digha, Siliguri, Jamshedpur, and more. Available as one-way or round trip. Call ${BUSINESS.phone}.` },
    { question: 'What is the outstation cab fare from Kolkata?', answer: 'Outstation cab fare from Kolkata: Sedan ₹12/km, SUV ₹16/km, Innova Crysta ₹18/km, Tempo Traveller ₹22/km. All fares include fuel and driver charges. Toll and parking are extra. Driver allowance of ₹300/day included for multi-day trips.' },
    { question: 'What is the minimum booking for outstation trips?', answer: 'Minimum 150 km per day for one-way trips from Kolkata and 250 km per day for round trips. Driver allowance of ₹300/day is included in the fare.' },
    { question: 'Is driver accommodation included on multi-day outstation trips?', answer: 'Yes, for multi-day round trips from Kolkata, driver accommodation is included in the fare. The driver manages his own stay at the destination city.' },
    { question: 'Can I make stops on an outstation trip from Kolkata?', answer: 'Yes! You can make multiple stops and sightseeing detours. Additional km will be charged at the per-km rate. Discuss your itinerary when booking for the best experience.' },
    { question: 'What is the best cab for Kolkata to Darjeeling trip?', answer: 'For Kolkata to Darjeeling (600 km), we recommend Innova Crysta or Ertiga, which handle mountain roads very well. Distance approx 600 km; estimated fare ₹7,200–₹9,600. Book via call or WhatsApp.' },
  ];

  const fareData = [
    { vehicle: 'Sedan (Swift Dzire / Amaze)', perKm: '₹12', dayMin: '₹2,400', note: '200 km/day min (RT)' },
    { vehicle: 'SUV (Ertiga / Innova)', perKm: '₹16', dayMin: '₹3,200', note: '200 km/day min (RT)' },
    { vehicle: 'Innova Crysta', perKm: '₹18', dayMin: '₹3,600', note: '200 km/day min (RT)' },
    { vehicle: 'Tempo Traveller', perKm: '₹22', dayMin: '₹4,400', note: '200 km/day min (RT)' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceTypeSchema('Outstation Cab Service Kolkata', 'outstation', 'Comfortable intercity cab service from Kolkata across 500+ routes. One-way and round trip available.')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Services', url: `${BUSINESS.domain}/services` },
        { name: 'Outstation Cab', url: `${BUSINESS.domain}/services/outstation` }
      ])) }} />

      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Services', href: '#' }, { name: 'Outstation Cab', href: '/services/outstation' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Outstation <span className="text-gradient">Cab Service</span> from Kolkata ₹12/km | Book Online</h1>
          <p className="text-lg text-gray-300 max-w-3xl">Book outstation cab from Kolkata to 500+ cities. AC Sedan ₹12/km, SUV ₹16/km, Innova Crysta ₹18/km. One-way & round trip. Verified drivers. No surge 24/7. Call {BUSINESS.phone}.</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
            <Phone size={18} /> Book Now: {BUSINESS.phone}
          </a>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Outstation Cab from Kolkata — Intercity Taxi Across East India</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>{BUSINESS.name}</strong> provides outstation cab service from Kolkata across 500+ intercity routes connecting cities in West Bengal, Jharkhand, and Odisha. Whether you need a car for a business trip, family vacation, pilgrimage, or wedding — our outstation taxi from Kolkata offers AC vehicles, professional drivers, and transparent pricing.
                  </p>
                  <p>
                    Popular outstation destinations from Kolkata include Darjeeling (600 km), Digha (185 km), Puri (500 km), Siliguri (560 km), Ranchi (400 km), Jamshedpur (270 km), Bhubaneswar (450 km), Durgapur (180 km), and Dhanbad (300 km). We cover both one-way and round-trip options on all these routes.
                  </p>
                  <p>
                    Our outstation cab fare from Kolkata is transparent: Sedan ₹12/km, SUV ₹16/km, Innova Crysta ₹18/km, Tempo Traveller ₹22/km. All fares include fuel and driver charges. Toll, parking, and state permit charges are extra. Driver allowance of ₹300/night is included for multi-day trips.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Why Book Outstation Cab from Kolkata with Us?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'One-way outstation — pay only for one side, no return charge',
                    'Round trip outstation — driver stays with you for multi-day trips',
                    'No minimum distance restriction for short outstation trips',
                    'AC vehicles — Swift Dzire, Ertiga, Innova Crysta, Tempo Traveller',
                    'Police-verified, experienced outstation drivers',
                    'Real-time WhatsApp updates throughout the journey',
                    'Multiple stops and sightseeing detours allowed',
                    'Driver allowance & accommodation included for round trips',
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fare Table */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Outstation Cab Fare from Kolkata</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-secondary text-white">
                        <th className="px-4 py-3 text-left text-sm">Vehicle Type</th>
                        <th className="px-4 py-3 text-center text-sm">Per KM</th>
                        <th className="px-4 py-3 text-center text-sm">Minimum / Day</th>
                        <th className="px-4 py-3 text-center text-sm">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fareData.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-secondary text-sm">{row.vehicle}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary text-sm">{row.perKm}</td>
                          <td className="px-4 py-3 text-center text-gray-600 text-sm">{row.dayMin}</td>
                          <td className="px-4 py-3 text-center text-gray-400 text-xs">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Toll, parking & state permits extra. Driver allowance ₹300/night included.</p>
              </div>

              {/* Popular Routes */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Popular Outstation Routes from Kolkata</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {routes.map(r => (
                    <Link key={r.slug} href={`/routes/${r.slug}`} className="route-card bg-white rounded-xl p-3 border border-gray-100 hover:border-primary/30 transition-colors">
                      <p className="font-semibold text-secondary text-sm">{r.fromName} → {r.toName}</p>
                      <p className="text-xs text-gray-500 mt-1">{r.distance} km • From ₹{r.priceSaloon}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* All cities */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Outstation Cab from All Cities</h3>
                {states.map(state => (
                  <div key={state.slug} className="mb-4">
                    <h4 className="font-semibold text-secondary text-sm mb-2">{state.name}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {state.cities.map(city => (
                        <Link key={city.slug} href={`/${state.slug}/${city.slug}/outstation`} className="text-xs text-primary hover:underline bg-accent px-2 py-1 rounded-full">{city.name}</Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">Outstation Cab Booking</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={faqs} title="Outstation Cab from Kolkata — FAQs" /></div></section>

      {/* Multi-City Coverage — SEO Content + Internal Links */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Outstation Cab Service in <span className="text-primary">Other Cities</span></h2>
          <p className="text-gray-600 mb-6">
            Our outstation cab service isn&apos;t limited to Kolkata. {BUSINESS.name} operates outstation taxi services from <strong>Ranchi</strong> (to Jamshedpur, Dhanbad, Kolkata, Deoghar), <strong>Jamshedpur</strong> (to Kolkata, Ranchi, Dhanbad, Bokaro), <strong>Bhubaneswar</strong> (to Puri, Konark, Cuttack, Kolkata), and 80+ other cities across West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh. Same fleet, same rates, same quality.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Ranchi', href: '/jharkhand/ranchi', desc: 'Outstation to Kolkata, Deoghar & more' },
              { name: 'Jamshedpur', href: '/jharkhand/jamshedpur', desc: 'Outstation to Kolkata, Ranchi & more' },
              { name: 'Bhubaneswar', href: '/odisha/bhubaneswar', desc: 'Outstation to Puri, Kolkata & more' },
              { name: 'Dhanbad', href: '/jharkhand/dhanbad', desc: 'Outstation to Ranchi, Kolkata & more' },
              { name: 'Siliguri', href: '/west-bengal/siliguri', desc: 'Outstation to Darjeeling, Kolkata' },
              { name: 'Durgapur', href: '/west-bengal/durgapur', desc: 'Outstation to Kolkata, Asansol' },
              { name: 'Bokaro', href: '/jharkhand/bokaro', desc: 'Outstation to Ranchi, Jamshedpur' },
              { name: 'Puri', href: '/odisha/puri', desc: 'Outstation to Bhubaneswar, Konark' },
            ].map((city) => (
              <Link key={city.name} href={city.href} className="group p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">🚗 {city.name}</p>
                <p className="text-xs text-gray-400 mt-1">{city.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Outstation Cab from Kolkata</h2>
          <p className="text-white/90 mb-6">500+ routes from Kolkata, Ranchi & Bhubaneswar. One-way & round trip. AC vehicles, verified drivers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to book an outstation cab from Kolkata.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
