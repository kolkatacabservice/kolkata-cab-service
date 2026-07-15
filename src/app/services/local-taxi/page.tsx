import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS, getLocalPackages } from '@/lib/data';
import { generateServicePageMetadata, generateFaqSchema, generateBreadcrumbSchema, generateServiceTypeSchema } from '@/lib/seo';
import { MapPin, Phone, CheckCircle, Clock } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = generateServicePageMetadata(
  'Local Taxi Service',
  'Local taxi service in Kolkata. Hourly cab rental for city travel, sightseeing, hospital, shopping & events. Sedan ₹1,800 for 4 hrs/40 km'
);

export default function LocalTaxiPage() {
  const packages = getLocalPackages();

  const faqs = [
    { question: 'What is local taxi service in Kolkata?', answer: `Local taxi service in Kolkata means hourly cab rental for travel within the city — for hospital visits, shopping, sightseeing, office travel, airport drops, or any local purpose. ${BUSINESS.name} offers local taxi packages starting from ₹1,800 for 4 hours/40 km. Call ${BUSINESS.phone}.` },
    { question: 'What are the local taxi packages in Kolkata?', answer: 'Kolkata local taxi packages: 4 Hours/40 KM — Sedan ₹1,800, SUV ₹2,500; 8 Hours/80 KM — Sedan ₹2,800, SUV ₹3,800; 12 Hours/120 KM — Sedan ₹3,800, SUV ₹5,200. Extra hours ₹150/hr, extra km ₹12–16/km.' },
    { question: 'Do you provide local cabs in all areas of Kolkata?', answer: `Yes! We provide local taxi service across all Kolkata areas including Salt Lake, New Town, Howrah, Park Street, Ballygunge, Dum Dum, Barasat, Behala, Tollygunge, Gariahat, Esplanade, and all suburbs. Pick up from home, office, hotel, or railway station.` },
    { question: 'Can I hire a cab for a full day in Kolkata?', answer: 'Yes! Our full-day (8 hours/80 km) cab package is ideal for city sightseeing, multiple appointments, or a full day of travel in Kolkata. Sedan ₹2,800, SUV ₹3,800. Extra usage charged separately.' },
    { question: 'Is local taxi available for hospital visits in Kolkata?', answer: `Yes, we provide local taxi for hospital visits, medical appointments, and discharge in Kolkata. Available for SSKM, AMRI, Apollo, Fortis, Belle Vue, and all hospitals across Kolkata. Book at ${BUSINESS.phone}.` },
    { question: 'Do you provide outstation taxi from Kolkata too?', answer: 'Yes! Along with local Kolkata taxi, we provide outstation cab service from Kolkata to 500+ cities including Darjeeling, Puri, Ranchi, Jamshedpur, Bhubaneswar, and more. One-way and round trip available.' },
  ];

  const localAreas = [
    'Salt Lake & Sector V', 'New Town & Rajarhat', 'Howrah', 'Dum Dum & Airport',
    'Park Street & BBD Bagh', 'Ballygunge', 'Gariahat', 'Behala',
    'Tollygunge', 'Jadavpur', 'Barasat', 'Dum Dum Cantonment',
    'Esplanade', 'Sealdah', 'Shyambazar', 'Ultadanga',
  ];

  const useCases = [
    { icon: '🏥', title: 'Hospital Visits', desc: 'Medical appointments, discharge & emergency — all hospitals covered.' },
    { icon: '✈️', title: 'Airport Transfer', desc: 'Pickup & drop at CCU (Netaji Subhash Airport), Dum Dum.' },
    { icon: '🎭', title: 'City Sightseeing', desc: 'Victoria Memorial, Dakshineswar, Belur Math & more.' },
    { icon: '🛍️', title: 'Shopping Trips', desc: 'New Market, South City Mall, Golpark & all major markets.' },
    { icon: '🏢', title: 'Office Travel', desc: 'Daily commute, client meetings, IT park transport.' },
    { icon: '🎓', title: 'School & College', desc: 'College admissions, exam centres & institutions.' },
    { icon: '🚂', title: 'Railway Station', desc: 'Howrah station, Sealdah station pickup & drop.' },
    { icon: '🎊', title: 'Events & Functions', desc: 'Weddings, parties, pujas, and family gatherings.' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceTypeSchema('Local Taxi Service Kolkata', 'local-taxi', 'Hourly local cab rental service in Kolkata for city travel, hospital visits, sightseeing, and events. Sedan, SUV, Innova available.')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Services', url: `${BUSINESS.domain}/services` },
        { name: 'Local Taxi', url: `${BUSINESS.domain}/services/local-taxi` }
      ])) }} />

      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Services', href: '#' }, { name: 'Local Taxi', href: '/services/local-taxi' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Local <span className="text-gradient">Taxi Service</span> in Kolkata ₹1,800/4hr | Book Online 24/7</h1>
          <p className="text-lg text-gray-300 max-w-3xl">Hourly cab rental in Kolkata for hospital visits, airport, sightseeing, shopping & events. Starting ₹1,800 for 4 hrs/40 km. 24/7 availability, AC vehicles.</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
            <Phone size={18} /> Book Now: {BUSINESS.phone}
          </a>
        </div>
      </section>

      {/* Trust row */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { icon: '⏰', text: 'Hourly Rental Available' },
              { icon: '🌙', text: '24/7 Including Night' },
              { icon: '❄️', text: 'AC Vehicles Only' },
              { icon: '✅', text: 'No Advance Payment' },
              { icon: '📍', text: 'All Kolkata Areas' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-primary font-medium">
                <span>{b.icon}</span> {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">

              <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Local Taxi & Cab Service in Kolkata</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>{BUSINESS.name}</strong> provides reliable local taxi service in Kolkata for all kinds of city travel. Whether you need a cab for a hospital visit, daily office commute, school run, shopping trip, or city sightseeing — our local taxi service covers every corner of Kolkata, including Salt Lake, New Town, Howrah, Park Street, Dum Dum, Ballygunge, and all popular areas.
                  </p>
                  <p>
                    Our local taxi packages are based on time and km usage, making it easy to plan your budget. The 4-hour/40-km package is ideal for short trips like hospital visits, shopping, or two-three appointments. The 8-hour/80-km package is perfect for a full day of travel — multiple stops, city sightseeing, or office travel across Kolkata.
                  </p>
                  <p>
                    All local taxis are AC, well-maintained, and driven by experienced Kolkata-based drivers who know the city&apos;s traffic patterns and shortcuts. We pick up from your home, office, hotel, railway station (Howrah/Sealdah), and drop anywhere including Kolkata airport (CCU).
                  </p>
                </div>
              </div>

              {/* Packages table */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Local Taxi Packages in Kolkata (2026)</h3>
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
                <p className="text-xs text-gray-400 mt-2">* Extra km charged at ₹12/km (Sedan), ₹16/km (SUV). Extra hour: ₹150–₹200/hr.</p>
              </div>

              {/* Use cases */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">When to Use Local Taxi Service in Kolkata</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {useCases.map((uc, i) => (
                    <div key={i} className="p-4 bg-accent/50 rounded-xl border border-primary/10 text-center">
                      <div className="text-3xl mb-2">{uc.icon}</div>
                      <h4 className="font-bold text-secondary text-xs mb-1">{uc.title}</h4>
                      <p className="text-gray-400 text-xs">{uc.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Local Taxi Service Areas in Kolkata</h3>
                <div className="flex flex-wrap gap-2">
                  {localAreas.map((area) => (
                    <span key={area} className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm text-gray-700 shadow-sm">
                      <MapPin size={12} className="inline-block text-primary mr-1" />{area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why choose */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Why Choose Our Local Taxi in Kolkata?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Hourly packages — pay only for time you use',
                    'AC vehicles — comfortable even in Kolkata summer heat',
                    '24/7 availability including early morning & late night',
                    'Kolkata-based drivers familiar with all city routes',
                    'No advance payment — pay at trip end via Cash/UPI',
                    'Instant WhatsApp confirmation within 2 minutes',
                    'Pickup from all Kolkata areas — including suburbs',
                    'Same-day booking, last-minute confirmed',
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">Book Local Taxi Now</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={faqs} title="Local Taxi Kolkata — FAQs" /></div></section>

      {/* Multi-City Coverage */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Local Taxi in <span className="text-primary">Other Cities</span></h2>
          <p className="text-gray-600 mb-6">
            {BUSINESS.name} also provides local taxi service in <strong>Ranchi</strong>, <strong>Jamshedpur</strong>, <strong>Bhubaneswar</strong>, <strong>Dhanbad</strong>, <strong>Siliguri</strong>, and 80+ other cities. Same hourly packages, same rates, same AC fleet.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Ranchi', href: '/jharkhand/ranchi' },
              { name: 'Jamshedpur', href: '/jharkhand/jamshedpur' },
              { name: 'Bhubaneswar', href: '/odisha/bhubaneswar' },
              { name: 'Dhanbad', href: '/jharkhand/dhanbad' },
              { name: 'Siliguri', href: '/west-bengal/siliguri' },
              { name: 'Durgapur', href: '/west-bengal/durgapur' },
            ].map((city) => (
              <Link key={city.name} href={city.href} className="group p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-all text-center">
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">🚗 {city.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Local Taxi — Kolkata, Ranchi & More</h2>
          <p className="text-white/90 mb-6">4 Hrs ₹1,800 | 8 Hrs ₹2,800 | 24/7 Available | AC Vehicles</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I need a local taxi.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
