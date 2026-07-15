import { Shield, Users, Award, Phone, Heart, Building, CheckCircle, Star, TrendingUp, MapPin } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import { BUSINESS } from '@/lib/data';
import { generateAboutMetadata, generateAboutPageSchema, generateBreadcrumbSchema, generateFaqSchema, generateWebPageSchema } from '@/lib/seo';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata = generateAboutMetadata();

const faqItems = [
  { question: 'Where is Kolkata Cab Service based?', answer: `${BUSINESS.name} is based out of Kolkata, West Bengal, and operates across 3 states including West Bengal, Jharkhand, and Odisha.` },
  { question: 'How long has Kolkata Cab Service been operating?', answer: `${BUSINESS.name} has been providing reliable cab and car rental services since ${BUSINESS.foundYear}. With over 5 years of operations, we have served 5,000+ customers across 80+ cities.` },
  { question: 'Are your drivers verified?', answer: 'Yes. All our drivers are police-verified with background checks and hold valid commercial driving licences. Vehicles carry all required documents including registration, insurance, and pollution certificates.' },
  { question: 'Can I get a GST invoice for corporate bookings?', answer: 'Yes, we provide GST-compliant invoices for all corporate cab bookings. Our corporate clients in Kolkata and other cities can claim GST input tax credit on cab expenses.' },
];

export default function AboutPage() {
  const milestones = [
    { year: '2020', title: 'Founded', desc: 'Started operations in Kolkata with a small fleet of 5 vehicles, focused on outstation cab service.' },
    { year: '2021', title: 'Expanded to 3 States', desc: 'Extended service to Jharkhand and Odisha, covering 30+ cities from our Kolkata hub.' },
    { year: '2022', title: '1,000+ Customers', desc: 'Crossed 1,000 happy customers milestone with 4.8★ average rating. Launched airport transfer service at CCU.' },
    { year: '2023', title: 'Corporate & Wedding', desc: 'Launched dedicated corporate car rental and wedding car rental services in Kolkata with expanded fleet.' },
    { year: '2024', title: '80+ Cities, 500+ Routes', desc: 'Expanded to 80+ cities across West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh. Launched Tempo Traveller and luxury car segments.' },
    { year: '2025', title: '5,000+ Customers', desc: 'Serving 5,000+ customers across 80+ cities in 3 states. Focused on Kolkata, Ranchi, Jamshedpur & East India.' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateAboutPageSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: BUSINESS.domain }, { name: 'About Us', url: `${BUSINESS.domain}/about` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqItems)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebPageSchema(
        'About Kolkata Cab Service',
        'Learn about Kolkata Cab Service — trusted cab provider across West Bengal, Jharkhand & Odisha since 2020.',
        `${BUSINESS.domain}/about`,
        'AboutPage'
      )) }} />

      {/* Hero */}
      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'About Us', href: '/about' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">About <span className="text-gradient">{BUSINESS.name}</span></h1>
          <p className="text-lg text-gray-300 max-w-3xl">{BUSINESS.tagline} — Kolkata&apos;s most trusted cab & car rental service since {BUSINESS.foundYear}. Verified drivers, AC vehicles, no hidden charges.</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `${new Date().getFullYear() - BUSINESS.foundYear}+`, label: 'Years of Service', icon: <Award size={24} /> },
              { value: '5,000+', label: 'Happy Customers', icon: <Users size={24} /> },
              { value: '80+', label: 'Cities Covered', icon: <MapPin size={24} /> },
              { value: '4.8★', label: 'Average Rating', icon: <Star size={24} /> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="opacity-70">{stat.icon}</div>
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-5">Who We Are</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <strong>{BUSINESS.name}</strong> is Kolkata&apos;s leading cab and car rental service, operating across East India since {BUSINESS.foundYear}. Founded with a mission to provide safe, reliable, and affordable transportation, we have grown from a small Kolkata-based cab provider to a multi-state operator serving 80+ cities across West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh.
            </p>
            <p>
              Our hub cities — Kolkata, Ranchi, Jamshedpur, and Bhubaneswar — serve as central operational points from which we connect 80+ cities through 500+ routes. Whether you need a cab from Kolkata to Darjeeling, Ranchi to Jamshedpur, an airport transfer at Netaji Subhash Chandra Bose International Airport (CCU) or Birsa Munda Airport, or a wedding car for your special day — we are your trusted travel partner across East India.
            </p>
            <p>
              We provide a complete range of car rental services including <strong>local taxi</strong> for city travel in Kolkata, <strong>outstation cabs</strong> for intercity journeys, <strong>one-way taxi</strong> for point-to-point affordable travel, <strong>round-trip packages</strong> for multi-day tours, <strong>airport and railway station transfers</strong>, <strong>wedding car rental</strong> with beautiful flower decoration, and <strong>corporate car rental</strong> with GST invoices and monthly packages.
            </p>
            <p>
              Our fleet includes AC Sedans (Swift Dzire, Honda Amaze), SUVs (Ertiga, Innova, Innova Crysta), Tempo Travellers (12–17 seater), and Luxury vehicles (Fortuner, Mercedes). All vehicles are regularly maintained, sanitized, and driven by police-verified, experienced professional drivers.
            </p>
            <p>
              At {BUSINESS.name}, customer satisfaction is our highest priority. We offer transparent pricing with no hidden charges, 24/7 customer support, instant WhatsApp confirmation, and a best-price guarantee. We accept Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Online Bank Transfers.
            </p>
          </div>

          {/* Trust Points */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-secondary mb-4">Our Commitment to You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Police-verified drivers with clean backgrounds',
                'AC vehicles — clean, sanitized before every trip',
                'Transparent pricing — no hidden or surge charges',
                '24/7 customer support and instant confirmation',
                'GPS-tracked vehicles for your safety',
                'GST invoices for all corporate bookings',
                'Flexible payment — Cash, UPI, Card, Bank Transfer',
                'Best price guarantee — we match any genuine quote',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Services We Offer in Kolkata, Ranchi & East India</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MapPin size={28} />, title: 'Local Taxi Kolkata', desc: 'Hourly cab rental for city sightseeing, shopping, hospital, and events in Kolkata. Packages from ₹1,800.' },
              { icon: <Shield size={28} />, title: 'Outstation Cab', desc: 'Intercity cab service from Kolkata to 80+ cities. One-way and round trip. Sedan ₹12/km.' },
              { icon: <TrendingUp size={28} />, title: 'One-Way Taxi', desc: 'Pay only for one side. Most affordable option for point-to-point intercity travel from Kolkata.' },
              { icon: <Users size={28} />, title: 'Airport Transfer', desc: 'Pickup & drop at Netaji Subhash Airport (CCU). Flight tracking, name board, 24/7 service.' },
              { icon: <Heart size={28} />, title: 'Wedding Car Rental', desc: 'Decorated Innova Crysta, Fortuner & luxury cars for baraat, vidaai, and wedding functions in Kolkata.' },
              { icon: <Building size={28} />, title: 'Corporate Car Rental', desc: 'Employee transport, client meetings, monthly contracts, GST invoices for businesses in Kolkata.' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary mb-4">{item.icon}</div>
                <h3 className="font-bold text-secondary mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey — Milestones */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-8">Our Journey Since {BUSINESS.foundYear}</h2>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-16 shrink-0">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">{m.year}</span>
                </div>
                <div className="flex-1 pb-4 border-b border-gray-100">
                  <p className="font-bold text-secondary">{m.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <FAQSection faqs={faqItems} title="About Kolkata Cab Service — FAQs" />
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Experience Kolkata&apos;s Best Cab Service</h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">Book your cab now and experience safe, reliable, and affordable travel across East India.</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg hover:scale-105 transition-all">
            <Phone size={22} /> Call {BUSINESS.phone}
          </a>
        </div>
      </section>
    </>
  );
}
