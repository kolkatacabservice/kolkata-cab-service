import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS } from '@/lib/data';
import { generateServicePageMetadata, generateFaqSchema, generateBreadcrumbSchema, generateServiceTypeSchema } from '@/lib/seo';
import { Phone, CheckCircle, Clock } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = generateServicePageMetadata(
  'Two Way Cab Service',
  'Two-way cab service from Kolkata — same day return with driver waiting. Best for day trips, hospital, business meetings. Sedan ₹12/km'
);

export default function TwoWayPage() {
  const faqs = [
    { question: 'What is two-way cab service from Kolkata?', answer: `Two-way cab from Kolkata means the driver picks you up, waits at the destination for you, and then brings you back on the same day. It is different from round trip (multi-day) — two-way is for same-day return journeys. Call ${BUSINESS.phone}.` },
    { question: 'What is the fare for two-way cab from Kolkata?', answer: 'Two-way cab fare from Kolkata is charged for the total km travelled (both ways). For example, Kolkata to Durgapur (165 km × 2 = 330 km): Sedan ₹3,630, SUV ₹4,620. Driver waiting charge: ₹150/hr. Call for exact quote.' },
    { question: 'How is two-way different from round trip?', answer: 'Two-way cab is for same-day return journeys (e.g., Kolkata to Durgapur and back in a day). Round trip is for multi-day stays where the driver accompanies you and stays overnight. Two-way includes driver waiting time at destination.' },
    { question: 'What is the waiting charge for two-way cab?', answer: 'Driver waiting charge for two-way cab is ₹150/hour for Sedan and ₹200/hour for SUV/Innova. First 30 minutes of waiting is free. Ideal for doctor visits, office meetings, or short stop destinations.' },
    { question: 'Is two-way cab available for Kolkata to Digha same day?', answer: 'Yes! Kolkata to Digha (190 km each way, 380 km total) same-day two-way trip — Sedan approx ₹4,180 including fuel. Driver waits at Digha (2–4 hours). Best to start early morning for comfortable trip.' },
  ];

  const examples = [
    { route: 'Kolkata → Durgapur → Kolkata', dist: '330 km total', sedan: '₹3,630', suv: '₹4,620', wait: '2–4 hrs' },
    { route: 'Kolkata → Bardhaman → Kolkata', dist: '260 km total', sedan: '₹2,860', suv: '₹3,640', wait: '1–3 hrs' },
    { route: 'Kolkata → Digha → Kolkata', dist: '380 km total', sedan: '₹4,180', suv: '₹5,320', wait: '3–5 hrs' },
    { route: 'Kolkata → Bolpur → Kolkata', dist: '320 km total', sedan: '₹3,520', suv: '₹4,480', wait: '2–3 hrs' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceTypeSchema('Two Way Cab Service Kolkata', 'two-way', 'Same-day return cab service from Kolkata. Driver waits at destination. Ideal for business trips and day outings.')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Services', url: `${BUSINESS.domain}/services` },
        { name: 'Two Way Cab', url: `${BUSINESS.domain}/services/two-way` }
      ])) }} />

      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Services', href: '#' }, { name: 'Two Way Cab', href: '/services/two-way' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Two Way <span className="text-gradient">Cab Service</span> from Kolkata ₹12/km | Return Trip Included</h1>
          <p className="text-lg text-gray-300 max-w-3xl">Same-day return cab from Kolkata — driver picks you up, waits at destination, and brings you back. Best for business meetings, hospital, shopping & day trips. Driver waiting included.</p>
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
                <h2 className="text-2xl font-bold text-secondary mb-4">Two-Way Cab from Kolkata — Same Day Return</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>{BUSINESS.name}</strong>&apos;s two-way cab service from Kolkata is designed for same-day return journeys where you need the cab and driver to wait at your destination and bring you back. It&apos;s the ideal solution for a day trip to Durgapur for a business meeting, Bolpur-Shantiniketan for a cultural visit, Digha for a beach day, or a hospital visit to a nearby city.
                  </p>
                  <p>
                    The two-way cab fare is calculated on the total km travelled (going + return), plus driver waiting charges at the destination. We offer transparent pricing with no hidden fees — fuel, driver, and the first 30 minutes of waiting are included. For longer waits, waiting charges of ₹150/hr (Sedan) apply.
                  </p>
                  <p>
                    Our two-way cab fleet includes AC Sedans (Swift Dzire, Honda Amaze) from ₹12/km and AC SUVs (Ertiga, Innova) from ₹16/km. All vehicles are well-maintained and driven by experienced drivers who know the routes in and around Kolkata.
                  </p>
                </div>
              </div>

              {/* Fare examples */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Two-Way Cab Fare Examples from Kolkata</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-secondary text-white">
                        <th className="px-4 py-3 text-left text-sm">Route</th>
                        <th className="px-4 py-3 text-center text-sm">Total KM</th>
                        <th className="px-4 py-3 text-center text-sm">Sedan Fare</th>
                        <th className="px-4 py-3 text-center text-sm">SUV Fare</th>
                        <th className="px-4 py-3 text-center text-sm">Wait Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examples.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-secondary text-sm">{row.route}</td>
                          <td className="px-4 py-3 text-center text-gray-500 text-sm">{row.dist}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary text-sm">{row.sedan}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary text-sm">{row.suv}</td>
                          <td className="px-4 py-3 text-center text-gray-400 text-xs">{row.wait}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Sedan ₹12/km, SUV ₹16/km. Wait charges ₹150/hr after first 30 min. Toll extra.</p>
              </div>

              {/* When to use */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">When is Two-Way Cab Best from Kolkata?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Business meetings in Durgapur, Bardhaman, or Haldia',
                    'Hospital visits to SSKM, AMRI, Apollo in nearby cities',
                    'Day trip to Shantiniketan (Bolpur) for cultural visit',
                    'Day outing to Digha beach from Kolkata',
                    'Court, government office visits outside Kolkata',
                    'Family day trips within 200–300 km from Kolkata',
                    'Returning same day without needing overnight driver',
                    'Shopping trips to wholesale markets in nearby towns',
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
                <p className="text-sm text-gray-300 mb-2">Two-Way Cab Booking</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={faqs} title="Two-Way Cab from Kolkata — FAQs" /></div></section>

      {/* Multi-City Coverage */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Two-Way Cab from <span className="text-primary">Other Cities</span></h2>
          <p className="text-gray-600 mb-6">
            Same-day return cab also available from <strong>Ranchi</strong>, <strong>Jamshedpur</strong>, <strong>Bhubaneswar</strong>, and 80+ other cities. Driver picks you up, waits, and brings you back.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Ranchi', href: '/jharkhand/ranchi' },
              { name: 'Jamshedpur', href: '/jharkhand/jamshedpur' },
              { name: 'Bhubaneswar', href: '/odisha/bhubaneswar' },
              { name: 'Dhanbad', href: '/jharkhand/dhanbad' },
              { name: 'Siliguri', href: '/west-bengal/siliguri' },
              { name: 'Durgapur', href: '/west-bengal/durgapur' },
            ].map((city) => (
              <Link key={city.name} href={city.href} className="group p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-all text-center">
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">🔄 {city.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Two-Way Cab — Kolkata, Ranchi & More</h2>
          <p className="text-white/90 mb-6">Same-day return. Driver waits. Transparent pricing. Book now!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to book a two-way cab.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
