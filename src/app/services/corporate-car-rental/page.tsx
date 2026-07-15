import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS } from '@/lib/data';
import { generateServicePageMetadata, generateFaqSchema, generateBreadcrumbSchema, generateServiceTypeSchema } from '@/lib/seo';
import { Building, Phone, CheckCircle, FileText, Users } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = generateServicePageMetadata(
  'Corporate Car Rental',
  'Corporate cab service in Kolkata with GST invoice. Employee transport, executive car rental, monthly packages for businesses. 24/7 fleet management'
);

export default function CorporatePage() {
  const faqs = [
    { question: 'What corporate car rental services do you offer in Kolkata?', answer: `${BUSINESS.name} provides comprehensive corporate car rental in Kolkata including employee transport, client pickup, airport transfer for executives, business event travel, outstation business trips, and monthly cab contracts. GST invoices provided. Call ${BUSINESS.phone}.` },
    { question: 'Do you provide GST invoice for corporate cab bookings?', answer: 'Yes! We provide GST-compliant invoices for all corporate cab bookings in Kolkata. Corporate clients can claim Input Tax Credit (ITC) on cab expenses for business purposes. Our GSTIN is provided on all invoices.' },
    { question: 'What is the cost of monthly corporate car rental in Kolkata?', answer: 'Monthly corporate cab packages in Kolkata start from ₹25,000/month for daily employee transport (8 hours, 80 km). Executive car rental packages from ₹35,000/month. Custom packages available based on requirements.' },
    { question: 'Do you provide corporate airport transfer in Kolkata?', answer: 'Yes, we provide executive airport transfer service at CCU (Kolkata Airport) for corporate clients. Flight tracking, meet & greet, premium vehicles (Innova Crysta, Fortuner) available. Priority service for corporate accounts.' },
    { question: 'Can you provide multiple cabs for employee transport?', answer: 'Yes! We manage fleet requirements for corporate clients — from 1 cab to 20+ cabs for employee transport runs. Dedicated relationship manager assigned for corporate accounts in Kolkata.' },
    { question: 'Do you provide outstation cabs for business travel from Kolkata?', answer: 'Yes, we provide outstation cab service for business travel from Kolkata including multi-city business tours, client site visits, and conference travel. All-India coverage with GST invoice.' },
  ];

  const packages = [
    { name: 'Employee Transport', desc: 'Daily pick & drop for office staff', features: ['8 Hrs / 80 KM daily', 'Sedan or SUV available', 'Monthly billing with GST', 'Dedicated driver assigned'], from: '₹25,000/month' },
    { name: 'Executive Car Rental', desc: 'Premium service for CXOs & management', features: ['Innova Crysta / Fortuner', 'Chauffeur in formal attire', 'Airport & hotel transfers', 'Flexible scheduling'], from: '₹35,000/month' },
    { name: 'Business Trip Cab', desc: 'Outstation travel for client meetings', features: ['All India coverage', 'Multi-city itinerary', 'GST invoice provided', 'AC vehicles, verified drivers'], from: '₹16/km onward' },
    { name: 'Event Transport', desc: 'Corporate events & conference travel', features: ['Fleet of 5–50 vehicles', 'Multiple pickup points', 'Coordination manager', 'Tempo Traveller for groups'], from: 'Custom quote' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceTypeSchema('Corporate Car Rental Kolkata', 'corporate-car-rental', 'Professional corporate cab and car rental service in Kolkata with GST invoice, monthly packages, employee transport, and executive vehicle rental.')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Services', url: `${BUSINESS.domain}/services` },
        { name: 'Corporate Car Rental', url: `${BUSINESS.domain}/services/corporate-car-rental` }
      ])) }} />

      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Services', href: '#' }, { name: 'Corporate Car Rental', href: '/services/corporate-car-rental' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Corporate <span className="text-gradient">Car Rental in Kolkata</span> ₹25,000/month | GST Invoice</h1>
          <p className="text-lg text-gray-300 max-w-3xl">Business-grade cab service in Kolkata — employee transport, executive car rental, airport transfer, monthly contracts & GST invoices. 24/7 corporate fleet management.</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
            <Phone size={18} /> Corporate Enquiry: {BUSINESS.phone}
          </a>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {['GST Invoice Provided', 'Monthly Contracts', 'Dedicated Manager', '24/7 Fleet', 'Pan-India Coverage', 'Premium Vehicles'].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-primary font-medium">
                <FileText size={14} /> {badge}
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
                <h2 className="text-2xl font-bold text-secondary mb-4">Corporate Car Rental Service in Kolkata</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>{BUSINESS.name}</strong> provides comprehensive corporate cab and car rental services in Kolkata tailored for businesses — from startups to large enterprises operating in Salt Lake Sector V, New Town IT Park, Rajarhat, and across Greater Kolkata. Our corporate clients include IT companies, consulting firms, manufacturing units, and government organizations.
                  </p>
                  <p>
                    We offer employee transport services, executive car rental for CXOs and senior management, airport transfer for visiting clients, outstation business travel, and complete event transportation management. All corporate bookings come with GST-compliant invoices, enabling your business to claim Input Tax Credit (ITC) on cab expenses.
                  </p>
                  <p>
                    Our corporate fleet includes AC Sedans, SUVs, Innova Crysta, Fortuner, and Tempo Travellers — all regularly maintained and driven by professionally trained, police-verified drivers. Monthly contracts, quarterly billing, and custom SLAs available for corporate accounts. A dedicated relationship manager is assigned to each corporate client for seamless coordination.
                  </p>
                </div>
              </div>

              {/* Packages */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Corporate Car Rental Packages in Kolkata</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg, i) => (
                    <div key={i} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-primary/30 transition-colors">
                      <h4 className="font-bold text-secondary mb-1">{pkg.name}</h4>
                      <p className="text-xs text-gray-400 mb-3">{pkg.desc}</p>
                      <p className="text-xl font-bold text-primary mb-3">From {pkg.from}</p>
                      <div className="space-y-1">
                        {pkg.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle size={12} className="text-green-500" /> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why us */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Why Businesses Choose Us for Corporate Cab in Kolkata</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'GST invoice for every booking — claim ITC on cab expenses',
                    'Dedicated account manager for seamless coordination',
                    'Monthly billing with detailed trip reports',
                    'Background-verified, professionally trained drivers',
                    'AC fleet — Sedan, SUV, Innova Crysta, Fortuner, Tempo',
                    'Covering all Kolkata IT parks — Salt Lake Sector V, New Town, Rajarhat',
                    '24/7 emergency cab support for corporate clients',
                    'Pan-India coverage for business travel from Kolkata',
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Building size={14} className="text-primary shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">Corporate Cab Enquiry</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={faqs} title="Corporate Car Rental Kolkata — FAQs" /></div></section>

      {/* Multi-City Corporate Coverage */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Corporate Cab in <span className="text-primary">Other Cities</span></h2>
          <p className="text-gray-600 mb-6">
            {BUSINESS.name} provides corporate car rental beyond Kolkata — in <strong>Ranchi</strong> (IT hub, steel plants), <strong>Jamshedpur</strong> (Tata Steel, industrial), <strong>Bhubaneswar</strong> (IT Park, Infocity), and other cities. Monthly contracts, GST invoices, dedicated fleet management across East India.
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
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">🏢 {city.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Corporate Cab — Kolkata, Ranchi, Jamshedpur</h2>
          <p className="text-white/90 mb-6">Monthly contracts, GST invoice, dedicated fleet. Let us handle your corporate mobility.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I need corporate car rental service. Please share details.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
