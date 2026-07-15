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

const FROM = 'Jamshedpur';
const TO = 'Kolkata';
const DISTANCE = 270;
const DURATION = '4-5';
const PRICE_SEDAN = 4500;
const PRICE_SUV = 5800;
const PRICE_TEMPO = 7800;
const VIA = ['Baharagora', 'Kharagpur', 'Kolaghat', 'NH 16'];

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: `Jamshedpur to Kolkata Cab ₹${PRICE_SEDAN} | One Way Taxi, Cheapest Cab | ${BUSINESS.name}`,
  description: `Book Jamshedpur to Kolkata cab from ₹${PRICE_SEDAN}. One way taxi, round trip, cheapest cab. ${DISTANCE} km. AC sedan/SUV. 24/7 booking. Call ${BUSINESS.phone}.`,
  keywords: [
    'jamshedpur to kolkata cab', 'jamshedpur to kolkata taxi', 'jamshedpur to kolkata car',
    'jamshedpur to kolkata cab fare', 'jamshedpur to kolkata one way cab',
    'jamshedpur to kolkata one way taxi', 'jamshedpur to kolkata cheapest cab',
    'jamshedpur to kolkata cab booking', 'jamshedpur to kolkata cab price',
    'jamshedpur to kolkata taxi fare', 'jamshedpur to kolkata distance',
    'jamshedpur to kolkata cab service', 'jamshedpur to kolkata car rental',
    'jamshedpur to kolkata round trip cab', 'jamshedpur to kolkata drop taxi',
    'cab from jamshedpur to kolkata', 'taxi from jamshedpur to kolkata',
    'cheapest cab jamshedpur to kolkata', 'best cab jamshedpur to kolkata',
    'tatanagar to kolkata cab', 'tatanagar to howrah cab',
    'jamshedpur to kolkata airport cab', 'jamshedpur to howrah cab',
  ],
  openGraph: {
    title: `Jamshedpur to Kolkata Cab ₹${PRICE_SEDAN} | ${BUSINESS.name}`,
    description: `Book Jamshedpur to Kolkata taxi. ${DISTANCE} km, from ₹${PRICE_SEDAN}. One way & round trip. Call ${BUSINESS.phone}`,
    type: 'website',
    siteName: BUSINESS.name,
    url: `${BUSINESS.domain}/jamshedpur-to-kolkata-cab`,
    locale: 'en_IN',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: 'Jamshedpur to Kolkata Cab Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Jamshedpur to Kolkata Cab ₹${PRICE_SEDAN}`,
    description: `Book Jamshedpur to Kolkata taxi. ${DISTANCE} km, AC cabs. Call ${BUSINESS.phone}`,
    images: [`${BUSINESS.domain}/navbanner.webp`],
  },
  alternates: {
    // This page has richer, hand-crafted content for the flagship route.
    // Canonical points here (not to /routes/jamshedpur-to-kolkata) to signal
    // this is the authoritative version. The dynamic route page links back here.
    canonical: `${BUSINESS.domain}/jamshedpur-to-kolkata-cab`,
  },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

export default function JamshedpurToKolkataCabPage() {
  const vehicles = getVehicles();

  const faqs = [
    { question: 'What is the cab fare from Jamshedpur to Kolkata?', answer: `Jamshedpur to Kolkata cab fare starts from ₹${PRICE_SEDAN} for Sedan (Swift Dzire, Honda Amaze), ₹${PRICE_SUV} for SUV (Ertiga, Innova Crysta), and ₹${PRICE_TEMPO} for Tempo Traveller. Toll and parking extra. Call ${BUSINESS.phone}.` },
    { question: 'How far is Kolkata from Jamshedpur?', answer: `Kolkata is ${DISTANCE} km from Jamshedpur via NH 16 highway. The cab journey takes approximately ${DURATION} hours through Baharagora, Kharagpur, and Kolaghat.` },
    { question: 'Is one way cab available from Jamshedpur to Kolkata?', answer: `Yes! One-way cab from Jamshedpur to Kolkata is available at ₹${PRICE_SEDAN} (sedan). You pay only one side fare — no return charges. Call ${BUSINESS.phone} to book.` },
    { question: 'What is the cheapest cab from Jamshedpur to Kolkata?', answer: `The cheapest cab from Jamshedpur to Kolkata is our Sedan (Swift Dzire) at just ₹${PRICE_SEDAN}. Includes fuel, driver charges. No hidden fees. Call ${BUSINESS.phone}.` },
    { question: 'Can I get a cab from Tatanagar to Kolkata?', answer: `Yes! Tatanagar (Jamshedpur) to Kolkata cab is available 24/7. We pick up from Tatanagar Junction, Jubilee Park area, Bistupur, Sakchi, or any location in Jamshedpur. Sedan from ₹${PRICE_SEDAN}.` },
    { question: 'Do you provide cab from Jamshedpur to Kolkata Airport?', answer: 'Yes! Jamshedpur to Kolkata Airport (CCU) cab is available. Distance is 285 km. Fare starts at ₹4,750 for sedan. We drop you directly at the departure terminal. Ideal for catching flights.' },
    { question: 'Is Jamshedpur to Howrah cab available?', answer: 'Yes! Jamshedpur to Howrah cab is available at ₹4,350 (sedan). We drop you at Howrah Station or any location in Howrah. The route via NH 16 takes about 4 hours.' },
    { question: 'Can I book Jamshedpur to Kolkata cab for a group?', answer: `Yes! For groups, we offer Tempo Traveller (12-17 seater) from ₹${PRICE_TEMPO}. Multiple sedans and SUVs also available for wedding groups, corporate teams, and family trips. Call ${BUSINESS.phone}.` },
    { question: 'Is night travel available from Jamshedpur to Kolkata?', answer: 'Yes! Our cab service operates 24/7. Late night and early morning departures are available without any surcharge. All drivers have extensive NH 16 highway experience.' },
    { question: 'What payment methods are accepted?', answer: `We accept Cash, UPI (Google Pay, Paytm, PhonePe), Debit/Credit Cards, and Online Bank Transfer. GST-compliant invoices available for corporate bookings.` },
  ];

  const relatedRoutes = [
    { name: 'Kolkata to Jamshedpur', slug: 'kolkata-to-jamshedpur', distance: 270, price: 4500 },
    { name: 'Jamshedpur to Ranchi', slug: 'jamshedpur-to-ranchi', distance: 140, price: 3000 },
    { name: 'Jamshedpur to Dhanbad', slug: 'jamshedpur-to-dhanbad', distance: 170, price: 3400 },
    { name: 'Jamshedpur to Bokaro', slug: 'jamshedpur-to-bokaro', distance: 130, price: 2900 },
    { name: 'Jamshedpur to Patna', slug: 'jamshedpur-to-patna', distance: 427, price: 6200 },
    { name: 'Jamshedpur to Howrah', slug: 'jamshedpur-to-howrah', distance: 260, price: 4350 },
    { name: 'Ranchi to Kolkata', slug: 'ranchi-to-kolkata', distance: 410, price: 5900 },
    { name: 'Jamshedpur to Kolkata Airport', slug: 'jamshedpur-to-kolkata-airport', distance: 285, price: 4750 },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateRouteSchema(FROM, TO, PRICE_SEDAN)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Jamshedpur to Kolkata Cab', url: `${BUSINESS.domain}/jamshedpur-to-kolkata-cab` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Jamshedpur to Kolkata Cab', href: '/jamshedpur-to-kolkata-cab' }]} />
          <h1 className="text-3xl md:text-5xl font-extrabold mt-4 mb-4">
            Jamshedpur to Kolkata <span className="text-gradient">Cab Service</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-6">
            Book the cheapest one-way & round trip cab from Jamshedpur to Kolkata. {DISTANCE} km, {DURATION} hours. Starting <strong className="text-primary">₹{PRICE_SEDAN}</strong>. 24/7 service.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><MapPin size={14} /> {DISTANCE} km</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Clock size={14} /> {DURATION} hours</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Route size={14} /> Via {VIA.join(', ')}</span>
            <span className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full text-primary font-bold"><Car size={14} /> From ₹{PRICE_SEDAN}</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Jamshedpur to Kolkata Cab Fare — One Way & Round Trip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {vehicles.slice(0, 4).map((v) => (
              <div key={v.id} className="p-6 bg-gradient-to-br from-accent/50 to-white rounded-2xl border border-primary/10 card-hover text-center">
                <h3 className="font-bold text-secondary text-lg mb-1">{v.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{v.models.slice(0, 2).join(', ')}</p>
                <p className="text-3xl font-extrabold text-primary mb-1">₹{v.id === 'sedan' ? PRICE_SEDAN : v.id === 'suv' ? PRICE_SUV : v.id === 'tempo' ? PRICE_TEMPO : Math.round(DISTANCE * v.pricePerKm * 1.1)}</p>
                <p className="text-xs text-gray-400">One-Way • {DISTANCE} km</p>
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

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Jamshedpur to Kolkata Cab — Complete Travel Guide</h2>
          
          {/* ── QUICK ANSWER BOX — targets AI Overviews / Featured Snippets ── */}
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <h3 className="text-base font-bold text-secondary mb-3 flex items-center gap-2">
                ⚡ Quick Answer — Jamshedpur to Kolkata Cab Route Facts
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
                📍 Highway Route: Jamshedpur → Baharagora → Kharagpur → Kolaghat → Kolkata (NH 18 and NH 16)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                📞 24/7 Helpline: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a> | No surge pricing, flat fares guaranteed.
              </p>
            </div>
            <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-amber-200 shadow-sm">
              <Image
                src="/navbanner.webp"
                alt="Jamshedpur to Kolkata Cab booking - AC sedan and SUV taxi"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
                priority
              />
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Looking for the <strong>best cab from Jamshedpur to Kolkata</strong>? {BUSINESS.name} provides the most reliable and affordable cab service from Jamshedpur (Tatanagar) to Kolkata. Whether you need a <strong>one-way taxi from Jamshedpur to Kolkata</strong>, a round trip, or a direct drop to Kolkata Airport or Howrah Station — we offer the <strong>cheapest cab</strong> with AC vehicles and experienced highway drivers.
          </p>
          <p className="text-gray-600 mb-4">
            The <strong>Jamshedpur to Kolkata distance is {DISTANCE} km</strong> via NH 16. The cab travels through Baharagora, Kharagpur, and Kolaghat before entering Kolkata. The journey takes approximately {DURATION} hours in clean, well-maintained AC vehicles with experienced drivers who know this route thoroughly.
          </p>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Jamshedpur to Kolkata One Way Cab</h3>
          <p className="text-gray-600 mb-4">
            Our <strong>Jamshedpur to Kolkata one-way cab</strong> is the cheapest way to travel between these two cities. Pay only for the one-way journey at ₹{PRICE_SEDAN} (sedan). No return fare, no hidden charges. We pick up from anywhere in Jamshedpur — Tatanagar Junction, Bistupur, Sakchi, Telco, Sonari, Kadma, Adityapur, or Gamharia.
          </p>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Jamshedpur to Kolkata Airport/Howrah Cab</h3>
          <p className="text-gray-600 mb-4">
            Need to catch a flight or train? We provide direct cab from <strong>Jamshedpur to Kolkata Airport (CCU)</strong> at ₹4,750 and <strong>Jamshedpur to Howrah Station</strong> at ₹4,350. Early morning pickups available for catching early flights and trains.
          </p>

          <h3 className="text-xl font-bold text-secondary mt-8 mb-3">Route Map — NH 16</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Jamshedpur (Tatanagar)', 'Baharagora', 'Kharagpur', 'Kolaghat', 'Kolkata'].map((stop, i, arr) => (
              <span key={stop} className="flex items-center gap-1">
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-secondary">{stop}</span>
                {i < arr.length - 1 && <ArrowRight size={14} className="text-primary" />}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: <CreditCard size={20} />, title: 'Cheapest Fare', desc: `Starting ₹${PRICE_SEDAN}. No return charges.` },
              { icon: <Shield size={20} />, title: 'Safe & Reliable', desc: 'Verified drivers. GPS-tracked vehicles.' },
              { icon: <Clock size={20} />, title: '24/7 Service', desc: 'Day, night, early morning — always available.' },
              { icon: <Star size={20} />, title: 'Multiple Pickup Points', desc: 'Tatanagar, Bistupur, Sakchi, Telco, Sonari, Kadma.' },
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
        </div>
      </section>

      {/* Related Routes */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Related Routes from Jamshedpur</h2>
          {/* Cross-link to dynamic route page to avoid cannibalization confusion */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-secondary text-sm">📍 Detailed Route: Jamshedpur → Kolkata</p>
              <p className="text-xs text-gray-500 mt-0.5">Distance, fare chart, map, stopovers, and more</p>
            </div>
            <Link href="/routes/jamshedpur-to-kolkata" className="text-sm font-bold text-primary hover:underline whitespace-nowrap">View Route Details →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedRoutes.map((route) => (
              <Link key={route.slug} href={`/routes/${route.slug}`} className="group route-card bg-white rounded-xl p-4">
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{route.name}</p>
                <p className="text-xs text-gray-500 mt-1">{route.distance} km</p>
                <p className="text-primary font-bold mt-2">From ₹{route.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <BookingForm defaultFrom="Jamshedpur" defaultTo="Kolkata" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title="Jamshedpur to Kolkata Cab — FAQs" />
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Jamshedpur to Kolkata Cab Now!</h2>
          <p className="text-white/90 mb-6">Cheapest fare. AC cabs. 24/7 instant booking.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> Call {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hi! I want to book a cab from Jamshedpur to Kolkata. Please share fare details.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp Booking
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
