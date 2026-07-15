import Link from 'next/link';
import { MapPin, Clock, Car, Phone, ChevronRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';

import { BUSINESS, getTours } from '@/lib/data';
import { generateToursListingMetadata, generateToursItemListSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const metadata = generateToursListingMetadata();

// Force fully static SSG — zero ISR Reads/Writes on Vercel
export const dynamic = 'force-static';
export const revalidate = false;

const categoryIcons: Record<string, string> = {
  'hill-station': '🏔️',
  'pilgrimage': '🛕',
  'wildlife': '🐯',
  'city-tour': '🏛️',
};

const categoryColors: Record<string, string> = {
  'hill-station': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'pilgrimage': 'bg-amber-50 text-amber-700 border-amber-200',
  'wildlife': 'bg-green-50 text-green-700 border-green-200',
  'city-tour': 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function ToursPage() {
  const tours = getTours();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateToursItemListSchema(tours)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: BUSINESS.domain }, { name: 'Tour Packages', url: `${BUSINESS.domain}/tours` }])) }} />

      <section className="relative text-white py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Tour Packages', href: '/tours' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4">Tour <span className="text-gradient">Packages</span></h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Explore East India with our curated tour packages. Hill stations, pilgrimages, wildlife safaris, and city tours — all with AC cab, experienced driver, and transparent pricing.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <Link key={tour.slug} href={`/tours/${tour.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shadow-sm">
                {/* Tour Header */}
                <div className="bg-gradient-to-br from-secondary to-indigo-900 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[tour.category] || 'bg-gray-50 text-gray-700'}`}>
                    {categoryIcons[tour.category] || '📍'} {tour.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-3 group-hover:text-primary transition-colors">{tour.name}</h2>
                  <p className="text-gray-300 text-sm mt-1">{tour.destination}, {tour.state}</p>
                </div>

                {/* Tour Details */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock size={14} className="text-primary" /> {tour.duration}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin size={14} className="text-primary" /> From {tour.fromCity}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Car size={14} className="text-primary" /> {tour.distance} km
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{tour.description}</p>

                  {/* Highlights preview */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tour.highlights.slice(0, 3).map((h) => (
                      <span key={h} className="px-2 py-0.5 bg-accent text-primary text-xs rounded-full">{h}</span>
                    ))}
                    {tour.highlights.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{tour.highlights.length - 3} more</span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400">Sedan from</span>
                      <p className="text-2xl font-bold text-primary">₹{tour.pricing.sedan.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                      View Details <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Need a Custom Tour Package?</h2>
          <p className="text-white/90 mb-6">We create personalized tour itineraries based on your interests, budget, and schedule. Call us to plan your dream trip!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to know about tour packages.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
