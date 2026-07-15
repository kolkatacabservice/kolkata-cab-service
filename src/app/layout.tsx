import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import ScrollToTop from '@/components/ScrollToTop';
import { BUSINESS } from '@/lib/data';
import { generateLocalBusinessSchema, generateOrganizationSchema, generateWebsiteSchema, generateTaxiServiceSchema, generateHowToBookSchema, generateSpeakableSchema } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  // 'swap' shows text immediately in fallback font then swaps to Inter once loaded.
  // This improves FCP and LCP vs 'optional' which can hide text until font arrives.
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  adjustFontFallback: true, // reduces CLS by matching fallback metrics to Inter
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.domain),
  title: {
    default: 'Kolkata Cab Service | Book Taxi in Kolkata ₹12/km | Airport, Outstation, Local 24/7',
    template: '%s | Kolkata Cab Service',
  },
  description: `★4.8 rated cab service in Kolkata from ₹12/km. Airport taxi ₹1,200 | Outstation to Ranchi, Jamshedpur, Bhubaneswar, Darjeeling | Local 4hr ₹1,800. AC Innova Crysta, Sedan, SUV. No surge 24/7. Call ${BUSINESS.phone}`,
  keywords: [
    // Primary high-volume keywords
    'kolkata cab service', 'cab service in kolkata', 'kolkata taxi service',
    'taxi in kolkata', 'cab in kolkata', 'book cab kolkata', 'book taxi kolkata',
    // Route keywords (highest search volume)
    'kolkata to ranchi cab', 'kolkata to ranchi taxi',
    'kolkata to jamshedpur cab', 'kolkata to jamshedpur taxi',
    'kolkata to bhubaneswar cab', 'kolkata to siliguri cab',
    'kolkata to darjeeling cab', 'kolkata to puri cab',
    'kolkata to digha cab', 'kolkata to durgapur cab',
    // Typo / garbled variants (critical for this site)
    'kolkatato ranchi cab', 'kolkata to ranchitaxi', 'kolkata to ranchicab',
    'kolkatato jamshedpur cab', 'kolkata to jamshedpurtaxi',
    'ranchi to kolkata cab', 'ranchi to kolkata taxi',
    'jamshedpur to kolkata cab', 'jamshedpur to kolkata taxi',
    // Airport
    'kolkata airport cab', 'kolkata airport taxi', 'ccu airport cab',
    'netaji subhas chandra bose airport cab', 'dum dum airport cab',
    'kolkata airport pickup', 'kolkata airport drop',
    // Vehicle keywords
    'innova cab kolkata', 'innova crysta kolkata', 'sedan cab kolkata',
    'suv cab kolkata', 'tempo traveller kolkata',
    // Car rental
    'car rental kolkata', 'car hire kolkata', 'cab rental kolkata',
    // Service keywords
    'outstation cab kolkata', 'one way cab kolkata', 'local taxi kolkata',
    'round trip cab kolkata', 'airport transfer kolkata', 'wedding car kolkata',
    // Brand/competitor alternatives
    'no surge cab kolkata', 'fixed rate taxi kolkata', 'ola alternative kolkata',
    // 24/7
    '24 hour cab kolkata', '24x7 taxi kolkata', 'night cab kolkata',
    // Voice search / question-based queries
    'best cab service near me kolkata',
    'cheap cab service kolkata',
    'reliable taxi kolkata',
    'how to book cab in kolkata',
    'cab booking kolkata online',
    'taxi booking kolkata number',
    // Location-specific Kolkata
    'salt lake cab service', 'new town cab service', 'howrah cab service',
    'park street cab', 'south kolkata cab', 'north kolkata taxi',
    'esplanade taxi', 'sealdah cab', 'howrah station cab',
    // Intercity direct searches
    'kolkata to patna cab', 'kolkata to dhanbad cab', 'kolkata to bokaro cab',
    'kolkata to asansol cab', 'kolkata to haldia cab', 'kolkata to krishnanagar cab',
    // Hindi transliterations (common search patterns)
    'kolkata se ranchi cab', 'kolkata taxi number', 'cab seva kolkata',
  ],
  authors: [{ name: BUSINESS.name, url: BUSINESS.domain }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  classification: 'Travel & Transportation',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Kolkata Cab Service',
  },
  alternates: {
    languages: {
      'en-IN': BUSINESS.domain,
      'x-default': BUSINESS.domain,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'hA2rdWAaPWyD-lFAcFjm1udGm3G71_hOvT3YxeVM73Y',
    other: {
      'msvalidate.01': ['0E793A3BAE966498595F256CE9DBE8B2'],
    },
  },
  category: 'Travel & Transportation',
  other: {
    'format-detection': 'telephone=yes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const localBusinessSchema = generateLocalBusinessSchema();
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const taxiServiceSchema = generateTaxiServiceSchema();
  const howToBookSchema = generateHowToBookSchema();
  const speakableSchema = generateSpeakableSchema();

  return (
    <html lang="en-IN" dir="ltr" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager — deferred 5 s to push completely outside TBT window */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function(){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
               new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KNT8T5XS');},5000);
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://g.page" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ═══ CRITICAL: Preload LCP hero image ═══
            This eliminates the 2,000ms "Element render delay" in PageSpeed.
            Without this, browser waits for React hydration before discovering the image. */}
        <link rel="preload" as="image" type="image/webp" href="/navbanner.webp" fetchPriority="high" />
        
        {/* Content-Language for SEO */}
        <meta httpEquiv="Content-Language" content="en-IN" />
        {/* hrefLang is handled per-page via Next.js metadata.alternates — not here */}
        
        {/* PWA & Theme */}
        <meta name="theme-color" content="#1A237E" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kolkata Cab" />


        
        {/* GMB Integration */}
        <link rel="me" href="https://g.page/r/CQpn2lOt9Y8QEBM" />
        <link rel="author" href="https://g.page/r/CQpn2lOt9Y8QEBM" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(taxiServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToBookSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KNT8T5XS"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {(() => {
          const gaId = (process.env.NEXT_PUBLIC_GA_ID || '').trim();
          if (!gaId) return null;
          return (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          );
        })()}
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingButtons />
        <ScrollToTop />
      </body>
    </html>
  );
}
