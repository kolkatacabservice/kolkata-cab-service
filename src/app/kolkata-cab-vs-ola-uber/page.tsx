import { Metadata } from 'next';
import Link from 'next/link';
import { Phone, CheckCircle, XCircle, Star, Shield, Clock, Car, CreditCard, MapPin } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS } from '@/lib/data';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: { absolute: `Kolkata Cab Service vs Ola vs Uber — Best Taxi Comparison 2026` },
  description: `Compare ${BUSINESS.name} with Ola, Uber, Rapido & InDrive in Kolkata. No surge pricing, fixed rates, verified drivers. See why 5000+ customers choose us over app-based cabs. Call ${BUSINESS.phone}.`,
  keywords: [
    'ola alternative kolkata', 'uber alternative kolkata', 'best cab service kolkata',
    'kolkata cab vs ola', 'kolkata cab vs uber', 'no surge pricing cab kolkata',
    'fixed rate taxi kolkata', 'rapido alternative kolkata', 'best taxi app kolkata',
    'reliable cab service kolkata', 'cheap cab kolkata no surge',
  ],
  openGraph: {
    title: 'Kolkata Cab Service vs Ola vs Uber — Honest Comparison',
    description: 'Fixed rates, no surge, verified drivers. See why customers switch from Ola & Uber.',
    url: `${BUSINESS.domain}/kolkata-cab-vs-ola-uber`,
    siteName: BUSINESS.name,
    locale: 'en_IN',
    type: 'article',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: 'Kolkata Cab Service vs Ola vs Uber Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kolkata Cab Service vs Ola vs Uber — Honest Comparison',
    description: 'Fixed rates, no surge, verified drivers. See why customers switch from Ola & Uber.',
    images: [`${BUSINESS.domain}/navbanner.webp`],
  },
  alternates: { canonical: `${BUSINESS.domain}/kolkata-cab-vs-ola-uber` },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

const features = [
  { feature: 'Surge Pricing', ours: false, oursText: 'Never — Fixed rates 24/7', ola: true, olaText: '2-3x during peak', uber: true, uberText: '2-4x during peak' },
  { feature: 'Night Surcharge', ours: false, oursText: 'Same rate day & night', ola: true, olaText: '1.5x after 11 PM', uber: true, uberText: '1.25-2x at night' },
  { feature: 'Festival Pricing', ours: false, oursText: 'No increase during Durga Puja, Diwali', ola: true, olaText: '3-5x during Puja', uber: true, uberText: '3-5x during Puja' },
  { feature: 'Booking Method', ours: true, oursText: 'Call / WhatsApp / Website', ola: true, olaText: 'App only', uber: true, uberText: 'App only' },
  { feature: 'Driver Verification', ours: true, oursText: 'Police-verified, 5+ yrs exp', ola: true, olaText: 'Basic background check', uber: true, uberText: 'Basic background check' },
  { feature: 'Advance Booking', ours: true, oursText: 'Book days in advance', ola: true, olaText: 'Limited availability', uber: true, uberText: 'Limited availability' },
  { feature: 'Outstation Service', ours: true, oursText: '500+ routes, one-way from ₹12/km', ola: false, olaText: 'Very limited routes', uber: false, uberText: 'Not available' },
  { feature: 'Wedding Car Rental', ours: true, oursText: 'Decorated Crysta from ₹5,000/day', ola: false, olaText: 'Not available', uber: false, uberText: 'Not available' },
  { feature: 'Corporate Contracts', ours: true, oursText: 'Monthly contracts, GST invoices', ola: true, olaText: 'Ola Corporate', uber: true, uberText: 'Uber for Business' },
  { feature: 'Cancellation', ours: true, oursText: 'Free up to 4 hrs before', ola: false, olaText: '₹50-100 fee', uber: false, uberText: '₹50-150 fee' },
  { feature: 'Payment Options', ours: true, oursText: 'Cash, UPI, Card, Bank Transfer', ola: true, olaText: 'App payment, UPI', uber: true, uberText: 'App payment, UPI' },
  { feature: 'Flight Tracking', ours: true, oursText: 'Real-time tracking, no delay charge', ola: false, olaText: 'Not available', uber: false, uberText: 'Not available' },
  { feature: 'Tempo Traveller', ours: true, oursText: '12-17 seater available', ola: false, olaText: 'Not available', uber: false, uberText: 'Not available' },
  { feature: 'App Required', ours: true, oursText: 'No app needed — just call', ola: false, olaText: 'Must download app', uber: false, uberText: 'Must download app' },
];

const faqs = [
  { question: 'Is Kolkata Cab Service better than Ola for outstation trips?', answer: `Yes. Ola has very limited outstation coverage from Kolkata. ${BUSINESS.name} covers 500+ outstation routes including Kolkata to Darjeeling (₹6,500), Puri (₹5,500), Digha (₹2,500), Siliguri (₹6,000), and more. One-way pricing available — you don't pay for return.` },
  { question: 'Why is there no surge pricing with Kolkata Cab Service?', answer: `We operate on a fixed-rate model. Our rates are pre-determined based on distance and vehicle type. Whether it's 3 AM, Durga Puja, New Year's Eve, or heavy rain — the rate stays the same. This is fundamentally different from Ola/Uber's algorithm-based dynamic pricing.` },
  { question: 'Can I book without downloading an app?', answer: `Yes! Just call ${BUSINESS.phone} or WhatsApp us. No app download, no account creation, no OTP verification needed. We confirm your booking within 2 minutes with complete driver and vehicle details.` },
  { question: 'How are your drivers different from Ola/Uber drivers?', answer: 'Our drivers are full-time professionals — not part-time gig workers. They are police-verified, have minimum 5 years commercial driving experience, know the city routes, and are trained in customer service. They drive the same vehicle daily and maintain it well.' },
  { question: 'What about safety compared to Ola and Uber?', answer: `All our vehicles are GPS-tracked with live location sharing. You get the driver's name, photo, phone number, and vehicle number before pickup. Our drivers are police-verified and we have 24/7 support at ${BUSINESS.phone}. For women passengers, we also offer female-preferred driver option on request.` },
  { question: 'Is Kolkata Cab Service cheaper than Uber?', answer: 'During normal hours, our rates are comparable to Ola/Uber. But during peak hours, festivals, rain, or late night — when Ola/Uber surge to 2-5x — our rates remain the same fixed rate. Over time, our customers save 30-50% compared to app-based cabs.' },
  { question: 'Do you provide airport cab service like Ola/Uber?', answer: `Yes, and better! Our airport service includes real-time flight tracking — if your flight is delayed, our driver adjusts automatically. No waiting charges for delays. Fixed fare from airport: Salt Lake ₹1200, Park Street ₹1200, Howrah ₹1200 (Sedan). No surge at any time.` },
  { question: 'Can I use Kolkata Cab Service for daily office commute?', answer: `Absolutely. We offer monthly corporate packages at 15-25% discount over standard rates. Dedicated vehicle, same driver daily, fixed schedule. GST invoices provided. Many IT companies in Salt Lake Sector V and New Town use our corporate cab service.` },
];

export default function ComparisonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Kolkata Cab vs Ola vs Uber', url: `${BUSINESS.domain}/kolkata-cab-vs-ola-uber` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-14 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Kolkata Cab vs Ola vs Uber', href: '/kolkata-cab-vs-ola-uber' }]} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">
            <span className="text-gradient">Kolkata Cab Service</span> vs Ola vs Uber
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            Honest comparison — why 5,000+ Kolkata customers switched from app-based cabs to {BUSINESS.name}. No surge pricing, fixed rates, verified drivers, and services that Ola & Uber simply don&apos;t offer.
          </p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
            <Phone size={18} /> Try Us: {BUSINESS.phone}
          </a>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8 text-center">Feature-by-Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-4 py-4 text-left text-sm font-bold w-1/4">Feature</th>
                  <th className="px-4 py-4 text-center text-sm font-bold w-1/4 bg-primary/20">🏆 {BUSINESS.name}</th>
                  <th className="px-4 py-4 text-center text-sm font-bold w-1/4">Ola</th>
                  <th className="px-4 py-4 text-center text-sm font-bold w-1/4">Uber</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-secondary text-sm border-r border-gray-100">{f.feature}</td>
                    <td className="px-4 py-3 text-center text-sm bg-green-50/50 border-r border-gray-100">
                      <div className="flex items-center justify-center gap-1.5">
                        {f.feature === 'Surge Pricing' || f.feature === 'Night Surcharge' || f.feature === 'Festival Pricing'
                          ? <XCircle size={16} className="text-green-500" />
                          : <CheckCircle size={16} className="text-green-500" />}
                        <span className="text-green-700 font-medium">{f.oursText}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm border-r border-gray-100">
                      <span className={f.feature === 'Surge Pricing' || f.feature === 'Night Surcharge' || f.feature === 'Festival Pricing' ? 'text-red-500' : 'text-gray-500'}>{f.olaText}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <span className={f.feature === 'Surge Pricing' || f.feature === 'Night Surcharge' || f.feature === 'Festival Pricing' ? 'text-red-500' : 'text-gray-500'}>{f.uberText}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Advantages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8 text-center">Why Customers Switch to <span className="text-primary">{BUSINESS.name}</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <CreditCard size={24} />, title: 'Zero Surge Pricing', desc: 'Ola & Uber charge 2-5x during Durga Puja, rain, or late night. We charge the SAME rate — always. Save 30-50% during peak times.' },
              { icon: <Shield size={24} />, title: 'Professional Drivers', desc: 'Not part-time gig workers. Full-time, police-verified drivers with 5+ years experience who know every Kolkata road.' },
              { icon: <Phone size={24} />, title: 'No App Needed', desc: 'Just call or WhatsApp. No downloading apps, no creating accounts, no OTP hassles. Book in 2 minutes flat.' },
              { icon: <Car size={24} />, title: 'Outstation Specialist', desc: '500+ outstation routes that Ola/Uber don\'t cover. Kolkata to Darjeeling, Puri, Digha, Sundarbans — one-way from ₹12/km.' },
              { icon: <Clock size={24} />, title: 'Advance Booking', desc: 'Book days or weeks in advance with guaranteed availability. Perfect for airport transfers, weddings, and planned trips.' },
              { icon: <MapPin size={24} />, title: 'Airport Expert', desc: 'Flight tracking, meet & greet at arrival gate, no waiting charges for delays. Fixed airport fare — never variable.' },
            ].map((card, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary mb-4">{card.icon}</div>
                <h3 className="font-bold text-secondary text-lg mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8 text-center">Price Comparison — Real Examples</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-4 py-3 text-left text-sm">Route</th>
                  <th className="px-4 py-3 text-center text-sm bg-primary/20">🏆 Our Rate</th>
                  <th className="px-4 py-3 text-center text-sm">Ola (Peak)</th>
                  <th className="px-4 py-3 text-center text-sm">Uber (Peak)</th>
                  <th className="px-4 py-3 text-center text-sm text-green-300">You Save</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { route: 'Airport → Salt Lake', ours: '₹1,200', ola: '₹2,200–1,800', uber: '₹1,400–2,000', save: '₹200–800' },
                  { route: 'Airport → Howrah', ours: '₹1,200', ola: '₹1,800–2,500', uber: '₹1,600–2,800', save: '₹400–1,600' },
                  { route: 'Kolkata → Darjeeling', ours: '₹6,500', ola: 'Not Available', uber: 'Not Available', save: '—' },
                  { route: 'Kolkata → Digha', ours: '₹2,500', ola: 'Not Available', uber: 'Not Available', save: '—' },
                  { route: 'Park Street → New Town', ours: '₹700', ola: '₹900–1,400', uber: '₹1800–1,500', save: '₹200–800' },
                  { route: 'Durga Puja Night Ride', ours: '₹12/km', ola: '₹33–55/km', uber: '₹30–50/km', save: '60–80%' },
                ].map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-secondary text-sm">{r.route}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary text-sm bg-green-50/50">{r.ours}</td>
                    <td className="px-4 py-3 text-center text-red-500 text-sm">{r.ola}</td>
                    <td className="px-4 py-3 text-center text-red-500 text-sm">{r.uber}</td>
                    <td className="px-4 py-3 text-center font-bold text-green-600 text-sm">{r.save}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">* Ola/Uber peak rates based on actual user reports during Durga Puja 2025 and rainy season. Our rates are fixed year-round.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title="Kolkata Cab Service vs Ola vs Uber — FAQs" />
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Switch to Fixed-Rate Cab Service</h2>
          <p className="text-white/90 mb-6">No surge. No app. No hassle. Just call & ride.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hi! I want to try your cab service instead of Ola/Uber.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
