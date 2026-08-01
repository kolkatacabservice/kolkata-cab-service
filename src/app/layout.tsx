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
    default: 'Cab Service in Kolkata ₹12/km | ⭐4.8 | Airport, Outstation, Local Taxi 24/7',
    template: '%s | Kolkata Cab Service',
  },
  description: `★4.8 rated cab service in Kolkata from ₹12/km. Airport taxi ₹1,200 | Outstation to Ranchi, Jamshedpur, Bhubaneswar, Darjeeling | Local 4hr ₹1,800. AC Innova Crysta, Sedan, SUV. No surge 24/7. Call ${BUSINESS.phone}`,
  keywords: [
    // Brand keywords — home page only
    'Kolkata Cab Service', 'kolkata cab service', 'cab service in kolkata', 'kolkata taxi service',
    'taxi in kolkata', 'cab in kolkata', 'book cab kolkata', 'book taxi kolkata',
    // Service-level keywords — home page appropriate
    'kolkata airport cab', 'kolkata airport taxi', 'kolkata airport pickup',
    'outstation cab kolkata', 'one way cab kolkata', 'round trip cab kolkata',
    'local taxi kolkata', 'car rental kolkata', 'cab rental kolkata',
    'innova cab kolkata', 'innova crysta kolkata', 'sedan cab kolkata', 'suv cab kolkata',
    // Service quality
    'no surge cab kolkata', 'fixed rate taxi kolkata', '24 hour cab kolkata',
    'reliable taxi kolkata', 'cheap cab service kolkata',
    // Hindi / voice search
    'kolkata taxi number', 'cab booking kolkata online', 'best cab service kolkata',
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
        {/* Google tag (gtag.js) — G-VKJTGRGJZP */}
        <Script
          id="gtag-js"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-VKJTGRGJZP"
        />
        <Script
          id="gtag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VKJTGRGJZP', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `,
          }}
        />
        {/* End Google tag */}

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
        <link rel="me" href="https://g.page/r/CcJ-ldDglNfaEBM/review" />
        <link rel="author" href="https://g.page/r/CcJ-ldDglNfaEBM/review" />
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
        {/* noscript fallback for non-JS environments */}
        <noscript>
          <img
            src="https://www.googletagmanager.com/collect?v=2&tid=G-VKJTGRGJZP"
            style={{ display: 'none' }}
            alt=""
            width={1}
            height={1}
          />
        </noscript>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingButtons />
        <ScrollToTop />
      </body>
    </html>
  );
}
