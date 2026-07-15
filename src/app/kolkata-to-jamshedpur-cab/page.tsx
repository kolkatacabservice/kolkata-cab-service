import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Car, ArrowRight, Route, Shield, CreditCard, Star } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS, getVehicles } from '@/lib/data';
import { generateFaqSchema, generateBreadcrumbSchema, generateRouteSchema } from '@/lib/seo';

const FROM = 'Kolkata';
const TO = 'Jamshedpur';
const DISTANCE = 270;
const DURATION = '4-5';
const PRICE_SEDAN = 4500;
const PRICE_SUV = 5800;
const PRICE_TEMPO = 7800;
const VIA = ['NH 16', 'Kolaghat', 'Kharagpur', 'Baharagora'];

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: `Kolkata to Jamshedpur Cab ₹${PRICE_SEDAN} | One Way Taxi, Cheapest Cab | ${BUSINESS.name}`,
  description: `Book Kolkata to Jamshedpur cab from ₹${PRICE_SEDAN}. One way taxi, round trip, cheapest cab. ${DISTANCE} km, AC sedan/SUV, 24/7. Call ${BUSINESS.phone}. Best fare guaranteed.`,
  keywords: [
    'kolkata to jamshedpur cab', 'kolkata to jamshedpur taxi', 'kolkata to jamshedpur car',
    'kolkata to jamshedpur cab fare', 'kolkata to jamshedpur one way cab',
    'kolkata to jamshedpur one way taxi', 'kolkata to jamshedpur cheapest cab',
    'kolkata to jamshedpur cab booking', 'kolkata to jamshedpur cab price',
    'kolkata to jamshedpur taxi fare', 'kolkata to jamshedpur distance',
    'kolkata to jamshedpur cab service', 'kolkata to jamshedpur car rental',
    'kolkata to jamshedpur round trip cab', 'kolkata to jamshedpur drop taxi',
    'cab from kolkata to jamshedpur', 'taxi from kolkata to jamshedpur',
    'cheapest cab kolkata to jamshedpur', 'best cab kolkata to jamshedpur',
    'kolkata jamshedpur cab rate', 'book cab kolkata jamshedpur',
    'kolkata to tatanagar cab', 'kolkata to tatanagar taxi',
    'howrah to jamshedpur cab', 'airport to jamshedpur cab',
  ],
  openGraph: {
    title: `Kolkata to Jamshedpur Cab ₹${PRICE_SEDAN} | ${BUSINESS.name}`,
    description: `Book Kolkata to Jamshedpur taxi. ${DISTANCE} km, from ₹${PRICE_SEDAN}. One way & round trip. Call ${BUSINESS.phone}`,
    type: 'website',
    siteName: BUSINESS.name,
    url: `${BUSINESS.domain}/kolkata-to-jamshedpur-cab`,
    locale: 'en_IN',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: 'Kolkata to Jamshedpur Cab Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Kolkata to Jamshedpur Cab ₹${PRICE_SEDAN}`,
    description: `Book Kolkata to Jamshedpur taxi. ${DISTANCE} km, AC cabs. Call ${BUSINESS.phone}`,
    images: [`${BUSINESS.domain}/navbanner.webp`],
  },
  alternates: {
    // This page has richer, hand-crafted content for the flagship route.
    // Canonical points here (not to /routes/kolkata-to-jamshedpur) to signal
    // this is the authoritative version. The dynamic route page links back here.
    canonical: `${BUSINESS.domain}/kolkata-to-jamshedpur-cab`,
  },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

export default function KolkataToJamshedpurCabPage() {
  const vehicles = getVehicles();

  const faqs = [
    { question: 'What is the cab fare from Kolkata to Jamshedpur?', answer: `Kolkata to Jamshedpur cab fare starts from ₹${PRICE_SEDAN} for Sedan (Swift Dzire, Honda Amaze), ₹${PRICE_SUV} for SUV (Ertiga, Innova Crysta), and ₹${PRICE_TEMPO} for Tempo Traveller. This is for one-way trip. Toll and parking extra. Call ${BUSINESS.phone} for exact quote.` },
    { question: 'How far is Jamshedpur from Kolkata by road?', answer: `Jamshedpur is ${DISTANCE} km from Kolkata by road via NH 16 through Kolaghat, Kharagpur, and Baharagora. The journey takes approximately ${DURATION} hours depending on traffic conditions.` },
    { question: 'Is one way cab available from Kolkata to Jamshedpur?', answer: `Yes! We offer one-way cab from Kolkata to Jamshedpur. You pay only for the one-way journey — no return charges. This is the cheapest option at ₹${PRICE_SEDAN} for sedan. Call ${BUSINESS.phone}.` },
    { question: 'What is the cheapest cab from Kolkata to Jamshedpur?', answer: `The cheapest cab from Kolkata to Jamshedpur is our Sedan (Swift Dzire) at ₹${PRICE_SEDAN} one-way. This includes fuel and driver charges. For the best deal, book through our website or call ${BUSINESS.phone}.` },
    { question: 'Can I book a round trip cab from Kolkata to Jamshedpur?', answer: `Yes! Round trip cab from Kolkata to Jamshedpur is available. Fare is calculated on total km (both ways). Minimum 250 km/day for overnight trips. Driver accommodation included. Call ${BUSINESS.phone} for round trip quotes.` },
    { question: 'Which route does the cab take from Kolkata to Jamshedpur?', answer: `Our cabs take the NH 16 route: Kolkata → Kolaghat → Kharagpur → Baharagora → Jamshedpur. This is the fastest and smoothest highway route with good road conditions throughout.` },
    { question: 'Is airport pickup available for Kolkata to Jamshedpur cab?', answer: `Yes! We provide Kolkata Airport (CCU) pickup for Jamshedpur drop. Our driver will meet you at the arrival gate with a name board. Flight tracking included. Distance from airport is 285 km. Fare from ₹4,750.` },
    { question: 'Can I book Kolkata to Jamshedpur cab for wedding?', answer: `Absolutely! We provide decorated wedding cars from Kolkata to Jamshedpur. Innova Crysta, Fortuner, and luxury cars available with flower decoration. Perfect for baraat, vidaai, and wedding functions. Call ${BUSINESS.phone}.` },
    { question: 'Do you provide cab from Howrah to Jamshedpur?', answer: `Yes! Howrah to Jamshedpur cab is available at ₹4,350 (sedan). We pick up from Howrah Station, Howrah Maidan, or any location in Howrah. Call ${BUSINESS.phone} for booking.` },
    { question: 'Is night travel available from Kolkata to Jamshedpur?', answer: 'Yes, our Kolkata to Jamshedpur cab service is available 24/7 including late night and early morning. No night surcharge. All drivers are experienced with night driving on Highway NH 16.' },
  ];

  const relatedRoutes = [
    { name: 'Jamshedpur to Kolkata', slug: 'jamshedpur-to-kolkata', distance: 270, price: 4500 },
    { name: 'Kolkata to Ranchi', slug: 'kolkata-to-ranchi', distance: 410, price: 5900 },
    { name: 'Jamshedpur to Ranchi', slug: 'jamshedpur-to-ranchi', distance: 140, price: 3000 },
    { name: 'Howrah to Jamshedpur', slug: 'howrah-to-jamshedpur', distance: 260, price: 4350 },
    { name: 'Kolkata Airport to Jamshedpur', slug: 'kolkata-airport-to-jamshedpur', distance: 285, price: 4750 },
    { name: 'Jamshedpur to Dhanbad', slug: 'jamshedpur-to-dhanbad', distance: 170, price: 3400 },
    { name: 'Jamshedpur to Bokaro', slug: 'jamshedpur-to-bokaro', distance: 130, price: 2900 },
    { name: 'Jamshedpur to Patna', slug: 'jamshedpur-to-patna', distance: 427, price: 6200 },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateRouteSchema(FROM, TO, PRICE_SEDAN)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Kolkata to Jamshedpur Cab', url: `${BUSINESS.domain}/kolkata-to-jamshedpur-cab` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Kolkata to Jamshedpur Cab', href: '/kolkata-to-jamshedpur-cab' }]} />
          <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-4">
            Kolkata to Jamshedpur <span className="text-gradient">Cab Service</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-6">
            Book the cheapest one-way & round trip cab from Kolkata to Jamshedpur. {DISTANCE} km, {DURATION} hours. AC sedan, SUV, Tempo Traveller. Starting <strong className="text-primary">₹{PRICE_SEDAN}</strong>.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><MapPin size={14} /> {DISTANCE} km</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Clock size={14} /> {DURATION} hours</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Route size={14} /> Via {VIA.join(', ')}</span>
            <span className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full text-primary font-bold"><Car size={14} /> From ₹{PRICE_SEDAN}</span>
          </div>
        </div>
      </section>

      {/* Quick Pricing Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Kolkata to Jamshedpur Cab Fare — One Way & Round Trip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {vehicles.slice(0, 4).map((v) => (
              <div key={v.id} className="p-6 bg-gradient-to-br from-accent/50 to-white rounded-2xl border border-primary/10 card-hover text-center">
                <h3 className="font-bold text-secondary text-lg mb-1">{v.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{v.models.slice(0, 2).join(', ')}</p>
                <p className="text-3xl font-extrabold text-primary mb-1">₹{v.id === 'sedan' ? PRICE_SEDAN : v.id === 'suv' ? PRICE_SUV : v.id === 'tempo' ? PRICE_TEMPO : Math.round(DISTANCE * v.pricePerKm * 1.1)}</p>
                <p className="text-xs text-gray-400">One-Way • {DISTANCE} km</p>
                <p className="text-xs text-gray-500 mt-2">{v.capacity} persons • {v.luggage} bags</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-secondary text-lg">🎯 Best Price Guarantee</h3>
              <p className="text-gray-500 text-sm">Transparent pricing. No hidden charges. Toll & parking extra.</p>
            </div>
            <a href={`tel:${BUSINESS.phone}`} className="px-8 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all whitespace-nowrap">
              <Phone size={16} className="inline mr-2" />Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Detailed Content — SEO Pillar */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Kolkata to Jamshedpur Cab — Complete Travel Guide</h2>
          
          {/* ── QUICK ANSWER BOX — targets AI Overviews / Featured Snippets ── */}
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <h3 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                ⚡ Quick Answer — Kolkata to Jamshedpur Cab Route Facts
              </h3>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                  <dt className="text-xs text-gray-400 mb-1">Distance</dt>
                  <dd className="font-bold text-secondary">{DISTANCE} km</dd>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                  <dt className="text-xs text-gray-400 mb-1">Travel Time</dt>
                  <dd className="font-bold text-secondary">{DURATION} hrs</dd>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                  <dt className="text-xs text-gray-400 mb-1">Sedan Fare</dt>
                  <dd className="font-bold text-primary">₹{PRICE_SEDAN}</dd>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
                  <dt className="text-xs text-gray-400 mb-1">SUV Fare</dt>
                  <dd className="font-bold text-primary">₹{PRICE_SUV}</dd>
                </div>
              </dl>
              <p className="text-xs text-gray-500 mt-3">
                📍 Highway Route: Kolkata → Kolaghat → Kharagpur → Baharagora → Jamshedpur (NH 16 and NH 18)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                📞 24/7 Helpline: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a> | No surge pricing, flat fares guaranteed.
              </p>
            </div>
            <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-amber-200 shadow-sm">
              <Image
                src="/navbanner.webp"
                alt="Kolkata to Jamshedpur Cab booking - AC sedan and SUV taxi"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
                priority
              />
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Looking for the <strong>best cab service from Kolkata to Jamshedpur</strong>? {BUSINESS.name} provides the most reliable and affordable cab, taxi, and car rental service on the Kolkata–Jamshedpur route. Whether you need a <strong>one-way cab from Kolkata to Jamshedpur</strong>, a round trip, or an airport transfer — we have you covered with AC vehicles, experienced drivers, and the best fares starting at just ₹{PRICE_SEDAN}.
          </p>
          <p className="text-gray-600 mb-4">
            The <strong>Kolkata to Jamshedpur distance is {DISTANCE} km</strong> via the smooth NH 16 highway. The journey passes through Kolaghat, Kharagpur, and Baharagora before entering Jamshedpur (Tatanagar). With our well-maintained vehicles and professional drivers, the trip takes approximately {DURATION} hours in comfortable AC conditions.
          </p>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Why Choose Our Kolkata to Jamshedpur Cab?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: <CreditCard size={20} />, title: 'Cheapest Fare Guaranteed', desc: `Starting ₹${PRICE_SEDAN}. No hidden charges. Pay only for what you travel.` },
              { icon: <Shield size={20} />, title: 'Verified Professional Drivers', desc: 'Background-checked, experienced NH 16 highway drivers.' },
              { icon: <Clock size={20} />, title: '24/7 Availability', desc: 'Book anytime — day or night. Early morning & late night available.' },
              { icon: <Star size={20} />, title: 'AC, Clean Vehicles', desc: 'Well-maintained fleet: Swift Dzire, Ertiga, Innova Crysta, Tempo.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-secondary text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Kolkata to Jamshedpur One Way Cab</h3>
          <p className="text-gray-600 mb-4">
            Our <strong>Kolkata to Jamshedpur one-way cab</strong> is the most affordable option for point-to-point travel. You pay only for the one-way journey — no return charges. One-way sedan starts at just ₹{PRICE_SEDAN}, making it the <strong>cheapest cab from Kolkata to Jamshedpur</strong>. Perfect for business trips, relocation, family visits, or any single-direction travel.
          </p>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Kolkata to Jamshedpur Round Trip Cab</h3>
          <p className="text-gray-600 mb-4">
            Planning to return? Our <strong>Kolkata to Jamshedpur round trip cab</strong> offers you the same vehicle and driver for the entire journey. The fare is calculated on total km traveled (both ways). Minimum 250 km/day applies for overnight stays. Driver rest and accommodation is included. Ideal for weekend trips, business meetings with same-day return, and family functions.
          </p>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Airport to Jamshedpur Cab</h3>
          <p className="text-gray-600 mb-4">
            Flying into Kolkata? We provide <strong>Kolkata Airport (CCU) to Jamshedpur cab</strong> service with flight tracking. Our driver will meet you at the arrival gate with a name board when you land. The airport to Jamshedpur distance is 285 km. Fare starts at ₹4,750 for sedan. Also available from <strong>Howrah to Jamshedpur</strong> at ₹4,350.
          </p>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Route Details — NH 16 Highway</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Kolkata', 'Kolaghat', 'Kharagpur', 'Baharagora', 'Jamshedpur (Tatanagar)'].map((stop, i, arr) => (
              <span key={stop} className="flex items-center gap-1">
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-secondary">{stop}</span>
                {i < arr.length - 1 && <ArrowRight size={14} className="text-primary" />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Routes */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Related Routes — Jamshedpur Cab Service</h2>
          {/* Cross-link to dynamic route page to avoid cannibalization confusion */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-secondary text-sm">📍 Detailed Route: Kolkata → Jamshedpur</p>
              <p className="text-xs text-gray-500 mt-0.5">Distance, fare chart, map, via stops and more</p>
            </div>
            <Link href="/routes/kolkata-to-jamshedpur" className="text-sm font-bold text-primary hover:underline whitespace-nowrap">View Route Details →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedRoutes.map((route) => (
              <Link key={route.slug} href={`/routes/${route.slug}`} className="group route-card bg-white rounded-xl p-4">
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{route.name}</p>
                <p className="text-xs text-gray-500 mt-1">{route.distance} km • One Way</p>
                <p className="text-primary font-bold mt-2">From ₹{route.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <BookingForm defaultFrom="Kolkata" defaultTo="Jamshedpur" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title="Kolkata to Jamshedpur Cab — Frequently Asked Questions" />
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Kolkata to Jamshedpur Cab Now!</h2>
          <p className="text-white/90 mb-6">Best fare. AC cabs. 24/7 service. Instant confirmation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> Call {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hi! I want to book a cab from Kolkata to Jamshedpur. Please share fare details.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp Booking
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
