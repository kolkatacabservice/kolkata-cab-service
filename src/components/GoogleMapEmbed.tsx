'use client';

import { useRef, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapEmbedProps {
  /** For route pages: show directions from → to */
  fromCity?: string;
  toCity?: string;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
  /** For city pages: show a single city pin */
  cityName?: string;
  cityLat?: number;
  cityLng?: number;
  /** Heading above the map */
  title?: string;
  subtitle?: string;
}

export default function GoogleMapEmbed({
  fromCity,
  toCity,
  fromLat,
  fromLng,
  toLat,
  toLng,
  cityName,
  cityLat,
  cityLng,
  title,
  subtitle,
}: GoogleMapEmbedProps) {
  const sectionRef = useRef<HTMLElement>(null);
  // loaded = true only after IntersectionObserver fires — defers all Maps JS
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }   // start loading 200 px before the section enters viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Build the appropriate Google Maps embed URL
  let mapSrc = '';
  let mapTitle = '';

  if (fromCity && toCity && fromLat && fromLng && toLat && toLng) {
    mapSrc = `https://maps.google.com/maps?width=100%25&height=400&hl=en&saddr=${encodeURIComponent(fromCity + ', India')}&daddr=${encodeURIComponent(toCity + ', India')}&t=&ie=UTF8&iwloc=B&output=embed`;
    mapTitle = `${fromCity} to ${toCity} Route Map`;
  } else if (cityName && cityLat && cityLng) {
    mapSrc = `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodeURIComponent(cityName + ', India')}&t=&z=12&ie=UTF8&iwloc=B&output=embed`;
    mapTitle = `${cityName} Map — Cab Service Area`;
  } else {
    mapSrc = `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=Kolkata+Cab+Service,+Park+Street,+Kolkata,+West+Bengal,+India&t=&z=12&ie=UTF8&iwloc=B&output=embed`;
    mapTitle = 'Kolkata Cab Service — Location Map';
  }

  const displayTitle = title || (fromCity && toCity ? `${fromCity} to ${toCity} — Route Map` : cityName ? `Cab Service in ${cityName} — Coverage Map` : 'Our Service Area');
  const displaySubtitle = subtitle || (fromCity && toCity ? `View the driving route from ${fromCity} to ${toCity}. Our experienced drivers know the best routes for a comfortable journey.` : cityName ? `We provide cab pickup and drop across all areas of ${cityName}. View our coverage area.` : 'Kolkata Cab Service covers 80+ cities across West Bengal, Jharkhand, Odisha, Bihar & Uttar Pradesh.');

  return (
    <section ref={sectionRef} className="google-map-section py-10 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <MapPin size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">Map &amp; Directions</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary">{displayTitle}</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">{displaySubtitle}</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white" style={{ minHeight: 400 }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none z-10 rounded-2xl" />

          {loaded ? (
            <iframe
              src={mapSrc}
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={mapTitle}
              className="w-full"
            />
          ) : (
            /* ── Placeholder shown before user scrolls to map ── */
            <div
              className="w-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-100 to-slate-200"
              style={{ height: 400 }}
              aria-label="Map loading placeholder"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <MapPin size={32} className="text-primary" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Map loads as you scroll</p>
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors shadow"
              >
                Load Map Now
              </button>
            </div>
          )}
        </div>

        {/* SEO: Accessible directions link for search engines */}
        {fromCity && toCity && (
          <div className="mt-4 text-center">
            <a
              href={`https://www.google.com/maps/dir/${encodeURIComponent(fromCity + ', India')}/${encodeURIComponent(toCity + ', India')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <MapPin size={14} />
              Open {fromCity} to {toCity} directions in Google Maps ↗
            </a>
          </div>
        )}
        {cityName && !fromCity && (
          <div className="mt-4 text-center">
            <a
              href={`https://www.google.com/maps/search/cab+service+${encodeURIComponent(cityName + ', India')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
            >
              <MapPin size={14} />
              View {cityName} on Google Maps ↗
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
