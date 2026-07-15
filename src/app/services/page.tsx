import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Route, ArrowRight, Repeat, Plane, Heart, Building, Phone, Car } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS, getServices } from '@/lib/data';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata: Metadata = {
  title: `Our Services | Cab & Taxi Services | ${BUSINESS.name}`,
  description: `All cab & taxi services by ${BUSINESS.name} — local taxi ₹2,800/8hr, outstation ₹12/km, one-way, round trip, airport transfer ₹1200, wedding car ₹5,000, corporate car rental. 24/7. Call ${BUSINESS.phone}`.slice(0, 160),
  keywords: [
    'kolkata cab services', 'taxi services kolkata', 'cab types kolkata', 'kolkata taxi booking',
    'outstation cab kolkata', 'local taxi kolkata', 'airport taxi kolkata', 'wedding car kolkata',
    'corporate cab kolkata', 'one way taxi kolkata', 'round trip cab kolkata',
  ],
  openGraph: {
    title: `Cab & Taxi Services | ${BUSINESS.name}`,
    description: `Complete cab services — local, outstation, airport, wedding, corporate. ₹12/km. Call ${BUSINESS.phone}`,
    type: 'website',
    siteName: BUSINESS.name,
    url: `${BUSINESS.domain}/services`,
    locale: 'en_IN',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: `Cab Services - ${BUSINESS.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Our Services | ${BUSINESS.name}`,
    description: `All cab services — local, outstation, airport, wedding. Call ${BUSINESS.phone}`,
    images: [`${BUSINESS.domain}/navbanner.webp`],
  },
  alternates: { canonical: `${BUSINESS.domain}/services` },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

const serviceCards = [
  {
    name: 'Local Taxi',
    slug: 'local-taxi',
    icon: MapPin,
    price: 'From ₹1,800/4hr',
    desc: 'Hourly cab rental for city travel — shopping, hospital, sightseeing, meetings. AC sedan/SUV with driver.',
    features: ['4hr/40km packages', 'Extra km ₹12/km', 'AC sedan & SUV', '24/7 availability'],
  },
  {
    name: 'Outstation Cab',
    slug: 'outstation',
    icon: Route,
    price: 'From ₹12/km',
    desc: 'Intercity AC cab for long-distance travel. One-way and round trip options. 80+ cities covered.',
    features: ['Sedan ₹12/km', 'SUV ₹16/km', '80+ cities', 'Driver accommodation included'],
  },
  {
    name: 'One-Way Taxi',
    slug: 'one-way',
    icon: ArrowRight,
    price: 'From ₹12/km',
    desc: 'Pay only for one side — no return charges. The most affordable way to travel between cities.',
    features: ['No return fare', 'Point-to-point', 'All routes available', 'Cheapest option'],
  },
  {
    name: 'Two-Way / Round Trip',
    slug: 'round-trip',
    icon: Repeat,
    price: 'From ₹12/km',
    desc: 'Complete round trip with driver accommodation for multi-day tours, pilgrimages, and vacations.',
    features: ['Driver stays with you', 'Multi-day available', 'Custom itinerary', '250km/day min'],
  },
  {
    name: 'Airport Transfer',
    slug: 'airport-transfer',
    icon: Plane,
    price: 'From ₹1200',
    desc: 'Airport pickup & drop with real-time flight tracking. No surge. CCU, Ranchi, Bhubaneswar airports.',
    features: ['Flight tracking', 'No surge pricing', 'Meet & greet', 'Early/late flights'],
  },
  {
    name: 'Wedding Car Rental',
    slug: 'wedding-car-rental',
    icon: Heart,
    price: 'From ₹5,000',
    desc: 'Decorated wedding cars for baraat, vidaai, reception. Innova Crysta, Fortuner, luxury sedans.',
    features: ['Flower decoration', 'Red carpet', 'Fleet available', 'Premium chauffeur'],
  },
  {
    name: 'Corporate Car Rental',
    slug: 'corporate-car-rental',
    icon: Building,
    price: 'Monthly Packages',
    desc: 'Dedicated vehicles for employee transport, client meetings, business travel. GST invoices provided.',
    features: ['Monthly contracts', '15-25% discount', 'GST invoices', 'Dedicated vehicles'],
  },
];

export default function ServicesPage() {
  const faqs = [
    { question: `What cab services does ${BUSINESS.name} offer?`, answer: `We offer 7 types of cab services: Local Taxi (hourly rental), Outstation Cab (intercity), One-Way Taxi (pay one side), Round Trip, Airport Transfer, Wedding Car Rental (decorated), and Corporate Car Rental. All services are available 24/7 across West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh.` },
    { question: 'What is the cheapest cab option?', answer: `One-way taxi is the cheapest option — you pay only for the distance traveled in one direction with no return charges. Sedan starts at ₹12/km. For local travel, our 4hr/40km package at ₹1,800 is the most economical.` },
    { question: 'Do you provide AC cabs for all services?', answer: 'Yes! All our vehicles are AC (air-conditioned), clean, and sanitized. We offer Sedan (Swift Dzire, Honda Amaze), SUV (Ertiga, Innova), Innova Crysta, Tempo Traveller, and luxury vehicles across all service types.' },
    { question: `How do I book a cab with ${BUSINESS.name}?`, answer: `Call ${BUSINESS.phone}, WhatsApp us, or fill the booking form on our website. We provide instant confirmation with driver name and contact number. No app download required.` },
    { question: 'Is there surge pricing during festivals?', answer: `Never! Unlike Ola and Uber, ${BUSINESS.name} charges the same fixed rate 24/7 — during Durga Puja, Diwali, Christmas, New Year, or any peak time. No surge, no dynamic pricing, no hidden charges.` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Services', url: `${BUSINESS.domain}/services` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Our Services', href: '/services' }]} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">
            Cab & Taxi <span className="text-gradient">Services in Kolkata</span> ₹12/km | Book Online
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            Complete cab & taxi solutions for every travel need — local, outstation, airport, wedding, corporate. 
            Fixed rates, no surge pricing, 24/7 availability across 80+ cities.
          </p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all">
            <Phone size={18} /> Book Now: {BUSINESS.phone}
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-8 text-center">
            Cab Services in Kolkata — <span className="text-primary">Choose Your Service</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{service.name}</h3>
                      <p className="text-primary font-semibold text-sm">{service.price}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="text-primary font-semibold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                    Learn More <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6 text-center">Quick <span className="text-primary">Fare Guide</span></h2>
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-4 py-3 text-left text-sm">Service</th>
                  <th className="px-4 py-3 text-center text-sm">Sedan</th>
                  <th className="px-4 py-3 text-center text-sm">SUV</th>
                  <th className="px-4 py-3 text-center text-sm">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'Local (4hr/40km)', sedan: '₹1,800', suv: '₹2,500', tempo: '₹3,500' },
                  { s: 'Outstation (per km)', sedan: '₹12/km', suv: '₹16/km', tempo: '₹22/km' },
                  { s: 'One-Way (per km)', sedan: '₹12/km', suv: '₹16/km', tempo: '₹22/km' },
                  { s: 'Airport Transfer', sedan: 'From ₹1200', suv: 'From ₹1,800', tempo: 'From ₹2,200' },
                  { s: 'Wedding Car', sedan: 'From ₹5,000', suv: 'From ₹8,000', tempo: '—' },
                ].map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-sm text-secondary">{r.s}</td>
                    <td className="px-4 py-3 text-center text-sm text-primary font-bold">{r.sedan}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{r.suv}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{r.tempo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">* Toll, parking, state permit extra. No surge pricing — same rate 24/7.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title="FAQs — Our Cab Services" />
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Need a Cab? Book Now!</h2>
          <p className="text-white/90 mb-6">24/7 service across 80+ cities. No surge pricing. AC cabs with verified drivers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hi! I need to book a cab.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
