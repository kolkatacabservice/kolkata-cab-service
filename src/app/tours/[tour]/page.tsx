import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Car, Phone, CheckCircle, XCircle, ChevronRight, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';

import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import { getTour, getTourSlugs, getTours, BUSINESS } from '@/lib/data';
import { generateTourMetadata, generateTourSchema, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/seo';

// Pre-build tours at build-time. Only serve pre-rendered pages, returning 404 for unknown slugs.
export const dynamicParams = false;
export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  return getTourSlugs().map(slug => ({ tour: slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ tour: string }> }): Promise<Metadata> {
  const { tour: tourSlug } = await params;
  const tour = getTour(tourSlug);
  if (!tour) return {};
  return generateTourMetadata(tour.name, tour.destination, tour.duration, tour.pricing.sedan);
}

export default async function TourDetailPage({ params }: { params: Promise<{ tour: string }> }) {
  const { tour: tourSlug } = await params;
  const tour = getTour(tourSlug);
  if (!tour) notFound();

  const allTours = getTours();
  const relatedTours = allTours.filter(t => t.slug !== tour.slug).slice(0, 3);

  const faqs = [
    { question: `What is the cost of ${tour.name}?`, answer: `The ${tour.name} starts at ₹${tour.pricing.sedan.toLocaleString('en-IN')} for Sedan, ₹${tour.pricing.suv.toLocaleString('en-IN')} for SUV, and ₹${tour.pricing.tempo.toLocaleString('en-IN')} for Tempo Traveller. This includes AC vehicle, fuel, driver allowance, and toll charges. Call ${BUSINESS.phone} for the best quote.` },
    { question: `What is included in the ${tour.name}?`, answer: `The package includes: ${tour.included.join(', ')}. Not included: ${tour.excluded.join(', ')}. We can also arrange hotel bookings on request.` },
    { question: `Can I customize the ${tour.name} itinerary?`, answer: `Absolutely! We offer fully customizable itineraries. You can add or remove stops, extend the trip, or modify the schedule. Call ${BUSINESS.phone} to discuss your requirements.` },
    { question: `Is ${tour.name} available year-round?`, answer: `Yes, our car-based tour packages are available throughout the year. However, some destinations may have seasonal considerations (monsoon for hill stations, summer for plains). We recommend the best time when you book.` },
    { question: `How do I book the ${tour.name}?`, answer: `You can book by calling ${BUSINESS.phone}, sending a WhatsApp message, or filling the booking form on this page. We provide instant confirmation and complete trip details.` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateTourSchema(tour.name, tour.destination, tour.pricing.sedan, tour.duration)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Tours', url: `${BUSINESS.domain}/tours` },
        { name: tour.name, url: `${BUSINESS.domain}/tours/${tour.slug}` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[
            { name: 'Tours', href: '/tours' },
            { name: tour.name, href: `/tours/${tour.slug}` },
          ]} />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mt-4 mb-4">
            {tour.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Clock size={14} /> {tour.duration}</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><MapPin size={14} /> From {tour.fromCity}</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Car size={14} /> {tour.distance} km</span>
            <span className="flex items-center gap-1.5 bg-primary/30 px-3 py-1.5 rounded-full font-semibold">From ₹{tour.pricing.sedan.toLocaleString('en-IN')}</span>
          </div>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
            <Phone size={18} /> Book Now: {BUSINESS.phone}
          </a>
        </div>
      </section>

      {/* Tour Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Description */}
              <h2 className="text-2xl font-bold text-secondary mb-4">{tour.name} — Book Cab Package</h2>
              <p className="text-gray-600 mb-6">{tour.description}</p>

              {/* Highlights */}
              <h3 className="text-xl font-bold text-secondary mt-8 mb-4">Tour Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {tour.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 text-xs">✓</span>
                    {h}
                  </div>
                ))}
              </div>

              {/* Itinerary */}
              <h3 className="text-xl font-bold text-secondary mt-8 mb-4">Detailed Itinerary</h3>
              <div className="space-y-4 mb-8">
                {tour.itinerary.map((item) => (
                  <div key={item.day} className="relative pl-8 pb-6 border-l-2 border-primary/20 last:border-transparent">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-primary rounded-full -translate-x-[9px] shadow-md shadow-primary/30" />
                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-primary text-white text-xs font-bold rounded-full">Day {item.day}</span>
                        <h4 className="font-bold text-secondary">{item.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Table */}
              <h3 className="text-xl font-bold text-secondary mt-8 mb-4">Tour Package Pricing</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <thead>
                    <tr className="bg-secondary text-white">
                      <th className="px-4 py-3 text-left text-sm">Vehicle Type</th>
                      <th className="px-4 py-3 text-left text-sm">Models</th>
                      <th className="px-4 py-3 text-center text-sm">Capacity</th>
                      <th className="px-4 py-3 text-right text-sm">Package Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-semibold text-sm">🚗 Sedan</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">Swift Dzire, Honda Amaze</td>
                      <td className="px-4 py-3 text-center text-sm">4</td>
                      <td className="px-4 py-3 text-right font-bold text-primary text-sm">₹{tour.pricing.sedan.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-sm">🚙 SUV</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">Ertiga, Innova Crysta</td>
                      <td className="px-4 py-3 text-center text-sm">6</td>
                      <td className="px-4 py-3 text-right font-bold text-primary text-sm">₹{tour.pricing.suv.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-semibold text-sm">🚐 Tempo</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">Tempo Traveller 12-Seater</td>
                      <td className="px-4 py-3 text-center text-sm">12</td>
                      <td className="px-4 py-3 text-right font-bold text-primary text-sm">₹{tour.pricing.tempo.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Included/Excluded */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} /> Included in Package
                  </h4>
                  <ul className="space-y-2">
                    {tour.included.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-green-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-red-50 rounded-xl border border-red-200">
                  <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <XCircle size={18} /> Not Included
                  </h4>
                  <ul className="space-y-2">
                    {tour.excluded.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-red-700">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar - Booking */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <BookingForm defaultFrom={tour.fromCity} compact />
              
              {/* Quick call */}
              <div className="mt-4 p-4 bg-secondary rounded-xl text-white text-center">
                <p className="text-sm text-gray-300 mb-2">Book This Tour</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-xl font-bold hover:text-primary transition-colors">
                  📞 {BUSINESS.phone}
                </a>
              </div>

              {/* WhatsApp booking */}
              <a
                href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I want to book the ${tour.name} package. Please share details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                💬 Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-6">Other <span className="text-primary">Tour Packages</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTours.map((t) => (
                <Link key={t.slug} href={`/tours/${t.slug}`} className="route-card bg-white rounded-xl p-5">
                  <p className="font-semibold text-secondary">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.duration} • {t.destination}</p>
                  <p className="text-primary font-bold mt-2">From ₹{t.pricing.sedan.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/tours" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                View All Tour Packages <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title={`FAQs — ${tour.name}`} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book {tour.name} Now!</h2>
          <p className="text-white/90 mb-6">{tour.duration} • From ₹{tour.pricing.sedan.toLocaleString('en-IN')} • AC Cab Included</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I want to book the ${tour.name}.`)}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
