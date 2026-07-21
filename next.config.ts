import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Static Export for Cloudflare Pages ──────────────────────────────────────
  // Generates ./out/ directory with pure static HTML — served directly by
  // Cloudflare's CDN with ZERO CPU usage. Eliminates Error 1102 permanently.
  output: "export",

  // Fixed deployment ID — keeps the buildId stable across rebuilds.
  // Without this, every `next build` generates a new random buildId.
  deploymentId: "kolkata-cab-v1",

  // Ensure consistent URLs — no trailing slashes
  trailingSlash: false,

  // `sharp` is NOT supported in the Cloudflare Pages build environment.
  // Use unoptimized: true so Next.js skips server-side image processing.
  images: {
    unoptimized: true,
    // Retain device/image sizes for <Image> sizing hints (no actual transform occurs)
    deviceSizes: [390, 640, 750, 1080, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
  },

  poweredByHeader: false,

  // ── Strip legacy JS polyfills — SWC targets modern browsers only ──
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // NOTE: Headers and redirects below are for local `next dev` development only.
  // In production (Cloudflare Pages), these are handled by public/_headers
  // and public/_redirects files which are processed by Cloudflare's CDN layer.
  // Keep them here so local development works correctly.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value:
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://wa.me; frame-src https://www.google.com https://maps.google.com https://maps.googleapis.com https://www.googletagmanager.com;",
          },
          { key: "Content-Language", value: "en-IN" },
        ],
      },
      {
        // Long-lived cache for immutable static assets
        source: "/:path*.:ext(js|css|woff2|webp|avif|png|jpg|jpeg|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/routes/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=2592000, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:state/:city(.*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, s-maxage=2592000, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // Noindex headers for stub/removed state paths
      {
        source: "/delhi-ncr/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/uttarakhand/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/madhya-pradesh/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  async redirects() {
    return [
      // Redirect /sitemap.xml → /sitemap_index.xml (Google compatibility fallback)
      {
        source: "/sitemap.xml",
        destination: "/sitemap_index.xml",
        permanent: true,
      },
      // Redirect /route/xxx to /routes/xxx (common typo)
      {
        source: "/route/:path*",
        destination: "/routes/:path*",
        permanent: true,
      },
      // Redirect /service/xxx to /services/xxx (common typo)
      {
        source: "/service/:path*",
        destination: "/services/:path*",
        permanent: true,
      },
      // Duplicate page consolidation — Salt Lake & New Town
      {
        source: "/west-bengal/salt-lake-kolkata",
        destination: "/kolkata/salt-lake",
        permanent: true,
      },
      {
        source: "/west-bengal/salt-lake-kolkata/:path*",
        destination: "/kolkata/salt-lake",
        permanent: true,
      },
      {
        source: "/west-bengal/new-town-kolkata",
        destination: "/kolkata/new-town",
        permanent: true,
      },
      {
        source: "/west-bengal/new-town-kolkata/:path*",
        destination: "/kolkata/new-town",
        permanent: true,
      },
      // Two-Way → Round Trip
      {
        source: "/services/two-way",
        destination: "/services/round-trip",
        permanent: true,
      },
      {
        source: "/:state/:city/two-way",
        destination: "/:state/:city/round-trip",
        permanent: true,
      },
      // Delhi-NCR, Uttarakhand, MP remain redirected (no content yet)
      { source: "/delhi-ncr", destination: "/", permanent: true },
      { source: "/delhi-ncr/:path*", destination: "/", permanent: true },
      { source: "/uttarakhand", destination: "/", permanent: true },
      { source: "/uttarakhand/:path*", destination: "/", permanent: true },
      { source: "/madhya-pradesh", destination: "/", permanent: true },
      { source: "/madhya-pradesh/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
