import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS } from '@/lib/data';
import { generateFaqSchema, generateBreadcrumbSchema, generateAirportTransferSchema } from '@/lib/seo';
import { Plane, Clock, Shield, CheckCircle, Phone, MapPin, Star } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Airport Cab Kolkata ₹1200 | CCU Taxi Pickup & Drop | Book 24/7',
  description: `Airport cab service at Kolkata (CCU), Ranchi (IXR), Bhubaneswar (BBI). Sedan ₹1,200, SUV ₹1,800, Innova ₹2,200. Flight tracking, meet & greet, 24/7. No surge. Call ${BUSINESS.phone}`.slice(0, 160),
  keywords: [
    'kolkata airport cab', 'kolkata airport taxi', 'ccu airport cab', 'ccu airport taxi',
    'netaji subhash airport cab', 'netaji subhash chandra bose airport taxi',
    'dum dum airport cab', 'dum dum airport taxi', 'kolkata airport transfer',
    'airport pickup kolkata', 'airport drop kolkata', 'cab from kolkata airport',
    'taxi from kolkata airport', 'kolkata to airport cab', 'airport cab service kolkata',
    'kolkata airport innova cab', 'airport cab 24/7 kolkata', 'flight pickup taxi kolkata',
    'kolkata airport cab booking', 'airport shuttle kolkata', 'cheap airport cab kolkata',
    'ranchi airport cab', 'birsa munda airport taxi', 'bhubaneswar airport cab',
    'biju patnaik airport taxi', 'bagdogra airport cab', 'siliguri airport taxi',
  ],
  alternates: { canonical: `${BUSINESS.domain}/services/airport-transfer` },
  openGraph: {
    title: 'Airport Cab Kolkata ₹1200 | CCU Pickup & Drop | 24/7',
    description: `Kolkata airport taxi from ₹1,200. CCU pickup & drop, flight tracking, no surge. Sedan, SUV, Innova Crysta. Call ${BUSINESS.phone}`,
    type: 'website',
    siteName: BUSINESS.name,
    url: `${BUSINESS.domain}/services/airport-transfer`,
    locale: 'en_IN',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: 'Airport Cab Kolkata CCU Transfer Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Airport Cab Kolkata ₹1200 | CCU Taxi 24/7',
    description: `Kolkata airport taxi from ₹1,200. No surge. 24/7. Call ${BUSINESS.phone}`,
  },
};

export default function AirportTransferPage() {
  const faqs = [
    { question: 'How does airport pickup work at Kolkata airport?', answer: `Our driver tracks your flight in real-time at Netaji Subhash Chandra Bose International Airport (CCU), Dum Dum. He waits at the arrival gate with a name board. No extra charges for flight delays. Call ${BUSINESS.phone} to book airport pickup.` },
    { question: 'Which airports do you serve for cab service?', answer: 'We serve airports across our 3-state service area: Kolkata (CCU), Ranchi (IXR), Bhubaneswar (BBI), and Bagdogra/Siliguri (IXB). Our primary hub is CCU, Kolkata.' },
    { question: 'What is the airport transfer fare from Kolkata airport?', answer: 'Airport transfer fares depend on distance. From CCU airport: Sedan ₹1,200–₹1,800 for city centre (Salt Lake, New Town, Howrah, Park Street). SUV ₹1,800–₹2,200. For outstation drops, per-km rates apply.' },
    { question: 'Do you provide Kolkata airport cab at night?', answer: 'Yes! We operate 24/7 at Kolkata airport including early morning and late night flights. No night surcharges — same rate applies all day.' },
    { question: 'Can I book airport transfer for a group from Kolkata?', answer: 'Yes! We provide Tempo Travellers and multiple vehicles for group airport transfers from CCU. Perfect for corporate teams, families, and wedding groups.' },
    { question: 'How early should I book a cab from Kolkata airport?', answer: `We recommend booking at least 2 hours before your pickup time. For outstation trips from Kolkata airport, book 1 day in advance. WhatsApp ${BUSINESS.phone} — we confirm instantly.` },
  ];

  const airports = [
    { code: 'CCU', name: 'Netaji Subhash Chandra Bose Intl. Airport', city: 'Kolkata', note: 'Primary hub — Dum Dum, Kolkata' },
    { code: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', note: 'Jharkhand hub' },
    { code: 'BBI', name: 'Biju Patnaik Intl. Airport', city: 'Bhubaneswar', note: 'Odisha hub' },
    { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', note: 'North Bengal — Gateway to Darjeeling' },
  ];

  const fareTable = [
    { vehicle: '🚗 Sedan (Swift Dzire / Amaze)', capacity: '4', cityFare: '₹1,200 – ₹1,800', outstationFare: '₹12/km' },
    { vehicle: '🚙 SUV (Ertiga / Innova)', capacity: '6', cityFare: '₹1,800 – ₹2,200', outstationFare: '₹16/km' },
    { vehicle: '🚘 Innova Crysta', capacity: '7', cityFare: '₹2,200', outstationFare: '₹18/km' },
    { vehicle: '🚌 Tempo Traveller', capacity: '12', cityFare: '₹3,500', outstationFare: '₹22/km' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateAirportTransferSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Services', url: `${BUSINESS.domain}/services` },
        { name: 'Airport Transfer', url: `${BUSINESS.domain}/services/airport-transfer` }
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Services', href: '#' }, { name: 'Airport Transfer', href: '/services/airport-transfer' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Airport <span className="text-gradient">Transfer Service</span> in Kolkata ₹1,200 | 24/7 CCU Cab</h1>
          <p className="text-lg text-gray-300 max-w-3xl">Reliable airport cab service at Netaji Subhash Chandra Bose Airport (CCU), Kolkata. Flight tracking, meet & greet at arrival gate, 24/7 availability — no waiting.</p>
          <div className="flex flex-wrap gap-4 mt-6">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
              <Phone size={18} /> Book Now: {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {[
              { icon: <Plane size={16} />, text: 'Flight Tracking Included' },
              { icon: <Clock size={16} />, text: '24/7 Airport Service' },
              { icon: <Shield size={16} />, text: 'Verified Drivers' },
              { icon: <Star size={16} />, text: '4.9★ Airport Rating' },
              { icon: <CheckCircle size={16} />, text: 'No Surge at Night' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-primary font-medium">
                {badge.icon} {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-4">Kolkata Airport Cab Service — CCU Pickup & Drop</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>{BUSINESS.name}</strong> provides the most reliable airport cab service in Kolkata at Netaji Subhash Chandra Bose International Airport (IATA: CCU), Dum Dum. Whether you need a pickup from the airport to Salt Lake, New Town, Howrah, Park Street, or any other area in Kolkata — or a departure drop from anywhere in the city to CCU — we have you covered, 24 hours a day, 7 days a week.
                  </p>
                  <p>
                    Our airport cab service works simply: book via call or WhatsApp at {BUSINESS.phone}. Our driver tracks your flight in real-time. On arrival, he waits at the arrival gate with a name board displaying your name. No extra charges if your flight is delayed.
                  </p>
                  <p>
                    For departure pickups, our driver arrives at your location 15–20 minutes before the scheduled pickup time to ensure you reach the airport with plenty of time for check-in. We cover all terminals at Kolkata airport — domestic and international.
                  </p>
                  <p>
                    Beyond Kolkata, we also provide airport cab service at Birsa Munda (Ranchi), Biju Patnaik (Bhubaneswar), and Bagdogra (Siliguri/Darjeeling) airports.
                  </p>
                </div>
              </div>

              {/* Fare Table */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Kolkata Airport Transfer Fare</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-secondary text-white">
                        <th className="px-4 py-3 text-left text-sm">Vehicle</th>
                        <th className="px-4 py-3 text-center text-sm">Capacity</th>
                        <th className="px-4 py-3 text-center text-sm">City Transfer (CCU)</th>
                        <th className="px-4 py-3 text-center text-sm">Outstation Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fareTable.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-secondary text-sm">{row.vehicle}</td>
                          <td className="px-4 py-3 text-center text-gray-500 text-sm">{row.capacity}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary text-sm">{row.cityFare}</td>
                          <td className="px-4 py-3 text-center text-gray-600 text-sm">{row.outstationFare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Toll & parking charges extra for outstation. No surcharge for night flights.</p>
              </div>

              {/* How it works */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">How Kolkata Airport Cab Booking Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: '1', title: 'Book via Call / WhatsApp', desc: `Call or WhatsApp ${BUSINESS.phone} with your flight details and pickup location.` },
                    { step: '2', title: 'Driver Assigned Instantly', desc: 'We assign a verified driver and share his name & contact within minutes.' },
                    { step: '3', title: 'Arrive & Ride Comfortably', desc: 'Driver meets you at the arrival gate with a name board. Flight delays are tracked automatically.' },
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-accent/50 rounded-xl border border-primary/10">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">{item.step}</div>
                      <h4 className="font-bold text-secondary mb-1 text-sm">{item.title}</h4>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Airports */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Airports We Serve</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {airports.map((airport) => (
                    <div key={airport.code} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-12 h-8 bg-secondary text-white rounded text-center flex items-center justify-center text-xs font-bold">{airport.code}</div>
                      <div>
                        <p className="font-semibold text-secondary text-sm">{airport.city}</p>
                        <p className="text-xs text-gray-400">{airport.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">Airport Transfer Helpline</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">
                  📞 {BUSINESS.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title="Kolkata Airport Cab — FAQs" />
        </div>
      </section>

      {/* Multi-Airport Coverage */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Airport Cab Service at <span className="text-primary">Other Airports</span></h2>
          <p className="text-gray-600 mb-6">
            Besides Kolkata Airport (CCU), {BUSINESS.name} provides airport cab service at <strong>Birsa Munda Airport, Ranchi</strong> and <strong>Biju Patnaik Airport, Bhubaneswar</strong>. Same reliable service — flight tracking, meet & greet, 24/7 availability, no surge pricing. We also provide airport transfers from Jamshedpur, Dhanbad, and Siliguri to their nearest airports.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { airport: 'Birsa Munda Airport (IXR)', city: 'Ranchi', href: '/jharkhand/ranchi', fare: '₹600' },
              { airport: 'Biju Patnaik Airport (BBI)', city: 'Bhubaneswar', href: '/odisha/bhubaneswar', fare: '₹500' },
              { airport: 'Bagdogra Airport (IXB)', city: 'Siliguri', href: '/west-bengal/siliguri', fare: '₹1,200' },
            ].map((a) => (
              <Link key={a.city} href={a.href} className="group p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
                <p className="text-xs text-gray-400 mb-1">{a.airport}</p>
                <p className="font-semibold text-secondary group-hover:text-primary transition-colors">✈️ {a.city} Airport Cab</p>
                <p className="text-primary font-bold text-sm mt-2">Sedan from {a.fare}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Airport Cab — Kolkata, Ranchi, Bhubaneswar</h2>
          <p className="text-white/90 mb-6">Airport pickup & drop — any time, any terminal. 24/7 service. No surge pricing.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I need a cab for airport transfer. Please share fare details.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
