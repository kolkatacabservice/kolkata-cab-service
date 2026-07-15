'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const bannerImages = [
  { src: '/navbanner.webp', alt: 'Kolkata Cab Service - Reliable cab booking across East India' },
  { src: '/navbanner1.webp', alt: 'Outstation Cab Service - Affordable intercity travel' },
  { src: '/navbanner2.webp', alt: 'Wedding Car Rental - Decorated cars for every occasion' },
  { src: '/navbanner3.webp', alt: 'Airport Transfer Service - On-time pickup and drop' },
];

interface HeroBannerProps {
  hideDots?: boolean;
}

export default function HeroBanner({ hideDots = false }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [loadOthers, setLoadOthers] = useState(false);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % bannerImages.length);
  }, []);

  useEffect(() => {
    // Delay loading of other images by 3 seconds to optimize LCP and initial page speed
    const timer = setTimeout(() => {
      setLoadOthers(true);
    }, 3000);

    const interval = setInterval(goToNext, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [goToNext]);

  return (
    <>
      {/* Render all images stacked; only the active one is visible via opacity.
          will-change:opacity promotes each to its own GPU compositing layer —
          avoids forced reflow on every slide transition. */}
      {bannerImages.map((img, index) => {
        const shouldRenderImage = index === 0 || loadOthers;
        return (
          <div
            key={img.src}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: index === current ? 1 : 0,
              willChange: index === current ? 'opacity' : 'auto',
              // Ensure first image is painted immediately for LCP
              zIndex: index === current ? 1 : 0,
            }}
            aria-hidden={index !== current}
          >
            {shouldRenderImage && (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                // Only the first (LCP) image gets priority + eager loading
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                sizes="100vw"
              />
            )}
          </div>
        );
      })}

      {/* Overlays */}
      <div className="absolute inset-0 bg-secondary/50" style={{ zIndex: 2 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-transparent to-secondary/30" style={{ zIndex: 2 }} />

      {/* Dots indicator */}
      {!hideDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
          {bannerImages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === current
                  ? 'bg-primary w-6 shadow-md shadow-primary/50'
                  : 'bg-white/40 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
