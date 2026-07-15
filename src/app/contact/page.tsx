import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';

import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS } from '@/lib/data';
import { generateContactMetadata, generateContactPageSchema, generateBreadcrumbSchema, generateFaqSchema, generateWebPageSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata = generateContactMetadata();

const contactFaqs = [
  { question: `What is the phone number of ${BUSINESS.name}?`, answer: `You can reach ${BUSINESS.name} at ${BUSINESS.phone}. This number is available 24/7 for cab bookings, quotes, and customer support. You can also WhatsApp us at the same number for instant booking confirmation.` },
  { question: `Where is ${BUSINESS.name} located?`, answer: `${BUSINESS.name} is based in Kolkata, West Bengal, India. We operate across 5 states — West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh — covering 80+ cities including Kolkata, Ranchi, Jamshedpur, Dhanbad, Bhubaneswar, Siliguri, and more.` },
  { question: `What are the working hours of ${BUSINESS.name}?`, answer: `We operate 24 hours a day, 7 days a week, 365 days a year. Whether you need a cab at 3 AM for an early morning flight, during festivals, or on national holidays — we are always available. Call ${BUSINESS.phone} anytime.` },
  { question: `How can I book a cab with ${BUSINESS.name}?`, answer: `You can book a cab in 3 ways: (1) Call ${BUSINESS.phone}, (2) WhatsApp us at ${BUSINESS.phone}, (3) Fill out the booking form on our website. Share your pickup location, destination, date, time, and passenger count. You'll get instant confirmation within 2 minutes.` },
  { question: `Do you provide GST invoices for corporate bookings?`, answer: `Yes! We provide GST-compliant invoices for all corporate cab bookings. Businesses in Kolkata, Ranchi, Jamshedpur, and other cities can claim GST input tax credit. Contact us at ${BUSINESS.phone} or ${BUSINESS.email} for corporate inquiries.` },
  { question: `What payment methods do you accept?`, answer: `We accept Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Bank Transfer/NEFT. For corporate clients, we also accept purchase orders and monthly invoicing. Payment can be made after the trip for cash bookings.` },
];

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateContactPageSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: BUSINESS.domain }, { name: 'Contact Us', url: `${BUSINESS.domain}/contact` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(contactFaqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebPageSchema(
        'Contact Kolkata Cab Service',
        `Contact ${BUSINESS.name} for cab booking. Call ${BUSINESS.phone} — 24/7 available.`,
        `${BUSINESS.domain}/contact`,
        'ContactPage'
      )) }} />

      {/* Geo meta — Kolkata primary */}
      <meta name="geo.region" content="IN-WB" />
      <meta name="geo.placename" content="Kolkata" />
      <meta name="geo.position" content="22.5726;88.3639" />
      <meta name="ICBM" content="22.5726, 88.3639" />

      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Contact Us', href: '/contact' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Contact <span className="text-gradient">{BUSINESS.name}</span></h1>
          <p className="text-lg text-gray-300">Book a cab or get help. We&apos;re available 24/7. Call, WhatsApp, or fill the form below.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <a href={`tel:${BUSINESS.phone}`} className="flex items-start gap-4 p-5 bg-accent/50 rounded-2xl hover:bg-accent transition-colors group">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shrink-0"><Phone size={24} /></div>
                  <div>
                    <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">Call Us</h3>
                    <p className="text-gray-500 text-sm">Available 24/7 for bookings</p>
                    <p className="text-primary font-bold text-lg mt-1">{BUSINESS.phone}</p>
                  </div>
                </a>

                <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to book a cab.')}`} className="flex items-start gap-4 p-5 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors group">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shrink-0">💬</div>
                  <div>
                    <h3 className="font-bold text-secondary group-hover:text-green-600 transition-colors">WhatsApp</h3>
                    <p className="text-gray-500 text-sm">Chat with us for instant booking</p>
                    <p className="text-green-600 font-bold text-lg mt-1">{BUSINESS.phone}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white shrink-0"><Mail size={24} /></div>
                  <div>
                    <h3 className="font-bold text-secondary">Email</h3>
                    <p className="text-gray-500 text-sm">For queries and corporate bookings</p>
                    <p className="text-secondary font-bold mt-1">{BUSINESS.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white shrink-0"><Clock size={24} /></div>
                  <div>
                    <h3 className="font-bold text-secondary">Operating Hours</h3>
                    <p className="text-gray-500 text-sm">We never close</p>
                    <p className="text-secondary font-bold mt-1">{BUSINESS.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white shrink-0"><MapPin size={24} /></div>
                  <div>
                    <h3 className="font-bold text-secondary">Service Areas</h3>
                    <p className="text-gray-500 text-sm">We operate across 3 states</p>
                    <p className="text-secondary font-medium text-sm mt-1">West Bengal • Jharkhand • Odisha</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <FAQSection faqs={contactFaqs} title={`Contact ${BUSINESS.name} — FAQs`} />
        </div>
      </section>

      {/* Map */}
      <GoogleMapEmbed />
    </>
  );
}
