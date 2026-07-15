import { Metadata } from 'next';
import { Phone } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS } from '@/lib/data';
import { generateFaqSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata: Metadata = {
  // `absolute` prevents layout template from appending "| Kolkata Cab Service" again
  title: { absolute: `Kolkata Cab Service FAQ 2025 | Booking, Pricing, Routes & Payment` },
  description: `FAQs about Kolkata cab service. How to book, pricing (₹12/km sedan), payment options, airport transfers, cancellation policy, wedding cars & corporate rental. Call ${BUSINESS.phone}.`,
  openGraph: {
    title: `Kolkata Cab Service FAQ — Booking, Fares & Routes Guide`,
    description: `All your questions answered. Booking process, fares (₹12/km), payment, cancellation, airport cab, wedding cars. Call ${BUSINESS.phone}.`,
    type: 'website',
    siteName: 'Kolkata Cab Service',
    url: `${BUSINESS.domain}/faq`,
    locale: 'en_IN',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: 'Kolkata Cab Service FAQ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Kolkata Cab Service FAQ | Booking & Fares Guide`,
    description: `All questions answered. Fares ₹12/km. Call ${BUSINESS.phone}.`,
    images: [`${BUSINESS.domain}/navbanner.webp`],
  },
  alternates: { canonical: `${BUSINESS.domain}/faq` },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

const faqCategories = [
  {
    title: 'Booking & Reservation',
    faqs: [
      { question: 'How can I book a cab in Kolkata?', answer: `You can book a cab by calling ${BUSINESS.phone}, sending a WhatsApp message, or filling out the booking form on our website. Share your pickup location, destination, date, time, and number of passengers for instant confirmation.` },
      { question: 'Do I need to download an app to book?', answer: 'No! We believe in keeping things simple. Just call or WhatsApp us. No app download, no account creation, no complicated registration process. Instant booking via phone call or WhatsApp message.' },
      { question: 'How far in advance should I book?', answer: 'We recommend booking at least 2-4 hours in advance for local trips and 12-24 hours in advance for outstation trips. However, we do accommodate last-minute bookings when vehicles are available. For wedding cars and group travel, book at least 1-2 weeks early.' },
      { question: 'Will I get booking confirmation?', answer: 'Yes! You receive instant booking confirmation on WhatsApp within 2 minutes. The confirmation includes driver name, phone number, vehicle number, vehicle type, exact fare breakdown, and pickup details.' },
      { question: 'Can I book a cab for someone else?', answer: 'Absolutely! You can book a cab for family members, friends, clients, or guests. Just share the passenger name, pickup address, and contact number. We will coordinate directly with the passenger for a smooth pickup.' },
    ],
  },
  {
    title: 'Pricing & Payment',
    faqs: [
      { question: 'What is the cab fare per km in Kolkata?', answer: 'Sedan (Swift Dzire, Honda Amaze): ₹12/km | SUV (Ertiga, Innova): ₹16/km | Innova Crysta: ₹18/km | Tempo Traveller: ₹22/km. All rates include fuel and driver. No surge pricing ever — same rate 24/7, 365 days.' },
      { question: 'Are there any hidden charges?', answer: 'Absolutely not! Our pricing is 100% transparent. The fare includes fuel, driver, and AC. Toll charges, parking fees, and state permit (if applicable) are additional but communicated upfront before booking confirmation. No surprise charges.' },
      { question: 'What payment methods do you accept?', answer: 'We accept Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Bank Transfer (NEFT/IMPS). For corporate clients, we also accept purchase orders and provide GST invoices.' },
      { question: 'When do I need to pay?', answer: 'For standard bookings, you can pay after the trip completion. For advance bookings (especially outstation), we may request a small advance (₹500-1000) to confirm the booking, which is adjusted in the final bill.' },
      { question: 'Do you charge extra at night or during festivals?', answer: 'No! Unlike app-based services, we do NOT have surge pricing. Our rates remain the same whether it is 3 AM, Durga Puja, New Year, or any other peak time. Fixed rates, always.' },
      { question: 'Is there a minimum fare?', answer: 'For local trips, our minimum package is 4 hours/40 km. For outstation trips, the minimum billing is 130 km per day (one-way). These are standard industry minimums to cover the vehicle and driver costs.' },
    ],
  },
  {
    title: 'Vehicles & Drivers',
    faqs: [
      { question: 'What types of vehicles are available?', answer: 'We offer: Sedan (Swift Dzire, Honda Amaze — 4 passengers), SUV (Ertiga, Innova — 6 passengers), Premium SUV (Innova Crysta — 7 passengers), Tempo Traveller (12-17 passengers), and Luxury vehicles (Fortuner, Mercedes — on request). All vehicles are AC.' },
      { question: 'Are your vehicles clean and well-maintained?', answer: 'Yes! Every vehicle is sanitized before and after each trip. We conduct regular maintenance checks, and our fleet is maintained at authorized service centers. All vehicles have valid insurance, fitness certificates, and permits.' },
      { question: 'Are your drivers verified?', answer: 'Yes, all our drivers are police-verified with valid commercial driving licenses and minimum 5 years of professional driving experience. They are trained in customer service, route navigation, and safety protocols.' },
      { question: 'Can I choose a specific vehicle?', answer: 'Yes! You can choose the vehicle type (Sedan, SUV, Crysta, Tempo). While we cannot guarantee a specific model (e.g., Dzire vs Amaze), we ensure the vehicle meets your requested category specifications.' },
    ],
  },
  {
    title: 'Routes & Services',
    faqs: [
      { question: 'What cities do you cover?', answer: `We provide cab services across 5 states and 80+ cities: West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh. Major hub cities include Kolkata, Ranchi, and Bhubaneswar. We cover 500+ routes.` },
      { question: 'Do you provide one-way cab service?', answer: 'Yes! One-way cab is one of our most popular services. Pay only for the one-way journey — no return fare charges. Available from Kolkata to all major cities. The most affordable option for point-to-point travel.' },
      { question: 'Do you provide airport transfer service?', answer: `Yes! We provide 24/7 airport cab service at Kolkata Airport (CCU). Our driver tracks your flight status, arrives early, and waits at the arrival gate with a name board. No extra charge for flight delays. Call ${BUSINESS.phone} for airport bookings.` },
      { question: 'Do you offer wedding car rental?', answer: 'Yes! We offer premium wedding car rental with flower decoration, ribbon decoration, and professional chauffeurs. Innova Crysta (₹5,000/day), Fortuner (₹8,000/day), luxury sedan (₹6,000/day). Book early for wedding season!' },
      { question: 'Do you provide corporate car rental?', answer: 'Yes! Monthly contracts for employee transport, client meetings, business events. 15-25% corporate discount. GST invoices provided. Dedicated account manager. Minimum contract: 1 month.' },
    ],
  },
  {
    title: 'Cancellation & Policies',
    faqs: [
      { question: 'What is the cancellation policy?', answer: 'Free cancellation up to 4 hours before scheduled pickup time. Cancellations within 4 hours may attract a nominal charge of ₹200-500 depending on the trip type. Refunds for prepaid bookings are processed within 24 hours.' },
      { question: 'What if my plans change during the trip?', answer: 'No problem! You can change your destination or extend the trip during the journey. Additional charges (if any) will be calculated based on the extra distance at the same per-km rate. Just inform the driver or call us.' },
      { question: 'What if I miss my pickup time?', answer: 'Our driver will wait for up to 30 minutes at the pickup location. After that, standard waiting charges apply (₹100/hour). For airport pickups, there is no waiting charge as we track your flight.' },
      { question: 'Do you provide travel insurance?', answer: 'All our vehicles carry comprehensive vehicle insurance. For personal travel insurance for passengers, we recommend purchasing a separate travel policy for outstation trips.' },
    ],
  },
];

export default function FAQPage() {
  const allFaqs = faqCategories.flatMap(cat => cat.faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(allFaqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'FAQ', url: `${BUSINESS.domain}/faq` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'FAQ', href: '/faq' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-gray-300 max-w-3xl">Everything you need to know about booking a cab with {BUSINESS.name}. Can&apos;t find your answer? Call {BUSINESS.phone}.</p>
        </div>
      </section>

      {/* FAQ Categories */}
      {faqCategories.map((category, catIdx) => (
        <section key={catIdx} className={`py-12 ${catIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-6">{category.title}</h2>
            <FAQSection faqs={category.faqs} />
          </div>
        </section>
      ))}

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Still Have Questions?</h2>
          <p className="text-white/90 mb-6">Call us anytime — we&apos;re available 24/7!</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
            <Phone size={22} /> {BUSINESS.phone}
          </a>
        </div>
      </section>
    </>
  );
}
