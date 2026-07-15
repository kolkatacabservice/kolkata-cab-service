import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import { BUSINESS } from '@/lib/data';
import { generateServicePageMetadata, generateFaqSchema, generateBreadcrumbSchema, generateWeddingCarSchema } from '@/lib/seo';
import { Heart, Phone, CheckCircle, Star } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata = generateServicePageMetadata(
  'Wedding Car Rental',
  'Premium wedding car rental in Kolkata with flower decoration. Decorated Innova Crysta, Fortuner & luxury sedans for baraat, vidaai, wedding functions'
);

export default function WeddingCarPage() {
  const faqs = [
    { question: 'What wedding car rental services are available in Kolkata?', answer: `${BUSINESS.name} provides premium wedding car rental in Kolkata with flower decoration, ribbon decoration, red carpet entrance, and professional chauffeurs. Vehicles include decorated Innova Crysta, Fortuner, luxury sedans, and Tempo Travellers for baraat processions. Call ${BUSINESS.phone} for packages.` },
    { question: 'What is the price of wedding car rental in Kolkata?', answer: 'Wedding car rental in Kolkata: Decorated Sedan ₹3,500–₹5,000; Decorated Innova Crysta ₹5,000–₹8,000; Decorated Fortuner ₹8,000–₹12,000; Luxury Mercedes/BMW ₹12,000–₹20,000 per day. Price includes decoration and driver.' },
    { question: 'Do you provide decorated car for baraat in Kolkata?', answer: 'Yes! We provide beautifully decorated cars for baraat with flower garland, ribbon, and traditional decoration. We also provide Tempo Travellers and multiple vehicles for larger baraat processions in Kolkata.' },
    { question: 'Can I book a wedding car for vidaai (bride send-off)?', answer: 'Absolutely! We specialize in vidaai car arrangements with tasteful flower decoration, red carpet, and a professional chauffeur to ensure the bride feels special. Available across all areas of Kolkata.' },
    { question: 'How early should I book a wedding car in Kolkata?', answer: 'For peak wedding seasons (November–February and May–June), book 2–4 weeks in advance. For last-minute bookings, call us at least 48 hours before the wedding. WhatsApp us for availability.' },
    { question: 'Do you provide multiple cars for a wedding?', answer: 'Yes! We provide a complete wedding car fleet — decorated groom car, bride car (vidaai), baraat fleet, guest transport Tempo Travellers, and airport/station pickup. Full wedding transportation packages available.' },
  ];

  const packages = [
    { name: 'Sedan Wedding Package', vehicle: 'Decorated Swift Dzire / Amaze', capacity: '4', price: '₹3,500 – ₹5,000', includes: ['Flower decoration', 'Ribbon & bow', 'Professional driver', 'Fuel included'] },
    { name: 'Innova Crysta Package', vehicle: 'Decorated Innova Crysta 7-Seater', capacity: '7', price: '₹5,000 – ₹8,000', includes: ['Full flower garland', 'Premium ribbon', 'Professional driver', 'Fuel included'] },
    { name: 'Fortuner Package', vehicle: 'Decorated Toyota Fortuner', capacity: '6', price: '₹8,000 – ₹12,000', includes: ['Luxury flower decoration', 'Premium ribbon', 'Professional chauffeur', 'Red carpet'] },
    { name: 'Luxury Car Package', vehicle: 'Mercedes / BMW (Luxury)', capacity: '4', price: '₹12,000 – ₹20,000', includes: ['Exotic flower decoration', 'Champagne interior', 'Uniformed chauffeur', 'Red carpet & roses'] },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWeddingCarSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Services', url: `${BUSINESS.domain}/services` },
        { name: 'Wedding Car Rental', url: `${BUSINESS.domain}/services/wedding-car-rental` }
      ])) }} />

      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Services', href: '#' }, { name: 'Wedding Car Rental', href: '/services/wedding-car-rental' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Wedding Car <span className="text-gradient">Rental in Kolkata</span> ₹3,500 | Decorated Cars</h1>
          <p className="text-lg text-gray-300 max-w-3xl">Premium decorated cars for your special day in Kolkata — baraat, vidaai, wedding functions. Flower-decorated Innova Crysta, Fortuner & luxury sedans with professional chauffeurs.</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
            <Phone size={18} /> Book Wedding Car: {BUSINESS.phone}
          </a>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {['Flower Decoration', 'Ribbon & Bow', 'Red Carpet', 'Professional Chauffeur', '4.9★ Wedding Rating', 'Baraat & Vidaai'].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 text-primary font-medium">
                <Heart size={14} /> {badge}
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
                <h2 className="text-2xl font-bold text-secondary mb-4">Wedding Car Rental Service in Kolkata</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Make your wedding day unforgettable with <strong>{BUSINESS.name}</strong>&apos;s premium wedding car rental service in Kolkata. We provide beautifully decorated vehicles for every wedding occasion — baraat (groom&apos;s procession), vidaai (bride&apos;s send-off), wedding reception, and family transport. Serving all areas of Kolkata including Salt Lake, New Town, Howrah, Park Street, Ballygunge, Behala, Dum Dum, and all Kolkata suburbs.
                  </p>
                  <p>
                    Our fleet of wedding cars includes elegantly decorated Innova Crysta (7-seater), Toyota Fortuner, luxury sedans, and Mercedes/BMW for the most premium experience. All vehicles come with fresh flower garlands, ribbon and bow decoration, red carpet, and a professionally dressed, experienced chauffeur to make the bride and groom feel truly royal.
                  </p>
                  <p>
                    We also provide fleet arrangements for complete wedding transportation — multiple decorated vehicles for baraat procession, Tempo Travellers for wedding guests, and airport/railway pickup service for guests arriving from out of town. Call {BUSINESS.phone} to discuss your complete wedding transport needs.
                  </p>
                </div>
              </div>

              {/* Packages */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Wedding Car Packages in Kolkata</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg, i) => (
                    <div key={i} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-primary/30 transition-colors">
                      <h4 className="font-bold text-secondary mb-1">{pkg.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{pkg.vehicle} • {pkg.capacity} seater</p>
                      <p className="text-xl font-bold text-primary mb-3">{pkg.price}</p>
                      <div className="space-y-1">
                        {pkg.includes.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle size={12} className="text-green-500" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">* Prices vary by decoration type, date, and trip distance. Call for exact quote.</p>
              </div>

              {/* Why choose */}
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Why Choose Us for Wedding Car Rental in Kolkata?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Fresh flower decoration arranged on the morning of your wedding',
                    'Professional chauffeurs in formal attire',
                    'On-time pickup — we guarantee no delays on your special day',
                    'Red carpet, ribbon, and bow included in all packages',
                    'Serving all Kolkata areas — Salt Lake, New Town, Howrah & more',
                    'Baraat procession fleet — 5 to 20+ vehicles available',
                    'Innova Crysta, Fortuner, BMW, Mercedes available',
                    '4.9★ rating from 428+ wedding customers in Kolkata',
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Heart size={14} className="text-red-400 shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <BookingForm />
              <div className="p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">Wedding Car Booking</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">📞 {BUSINESS.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50"><div className="max-w-7xl mx-auto px-4"><FAQSection faqs={faqs} title="Wedding Car Rental Kolkata — FAQs" /></div></section>

      {/* Multi-City Wedding Coverage */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-4">Wedding Car Rental in <span className="text-primary">Other Cities</span></h2>
          <p className="text-gray-600 mb-6">
            Planning a wedding outside Kolkata? {BUSINESS.name} provides decorated wedding car rental in <strong>Ranchi</strong>, <strong>Jamshedpur</strong>, <strong>Bhubaneswar</strong>, <strong>Dhanbad</strong>, and other cities across East India. Same premium decoration, professional chauffeurs, and on-time guarantee.
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
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">💒 {city.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book Wedding Car — Kolkata, Ranchi & More</h2>
          <p className="text-white/90 mb-6">Make your special day unforgettable. Premium decorated cars with professional chauffeurs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to book a decorated wedding car.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
