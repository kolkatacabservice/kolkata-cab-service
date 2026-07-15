import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ChevronRight } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS } from '@/lib/data';
import { generateBreadcrumbSchema, generateBlogListingSchema, generateWebPageSchema } from '@/lib/seo';
import blogsData from '@/data/blogs.json';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata: Metadata = {
  title: { absolute: `Travel Blog — Kolkata Cab Service | Route Guides, Tips & Fare Charts` },
  description: `Read travel guides, route tips, fare charts, and booking guides from ${BUSINESS.name}. Expert advice for cab travel in Kolkata and across East India. Updated 2025.`,
  openGraph: {
    title: `Travel Blog — ${BUSINESS.name} | Route Guides & Cab Tips`,
    description: `Travel guides, route tips, fare charts and expert advice for cab travel in Kolkata & East India. Updated 2025.`,
    url: `${BUSINESS.domain}/blog`,
    siteName: BUSINESS.name,
    locale: 'en_IN',
    type: 'website',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: `Travel Blog — ${BUSINESS.name}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Travel Blog — ${BUSINESS.name} | Route Guides & Cab Tips`,
    description: `Expert travel guides, fare charts and booking tips for Kolkata & East India cab travel.`,
    images: [`${BUSINESS.domain}/navbanner.webp`],
  },
  alternates: { canonical: `${BUSINESS.domain}/blog` },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

export default function BlogListPage() {
  const blogs = blogsData as Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    readTime: string;
  }>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Blog', url: `${BUSINESS.domain}/blog` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBlogListingSchema(blogs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebPageSchema(
        'Travel Blog — Kolkata Cab Service',
        'Travel guides, route tips, fare charts, and booking guides from Kolkata Cab Service.',
        `${BUSINESS.domain}/blog`,
        'CollectionPage'
      )) }} />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[
            { name: 'Blog', href: '/blog' },
          ]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
            Travel <span className="text-gradient">Blog</span> — Guides, Tips & Fare Charts
          </h1>
          <p className="text-gray-300 max-w-3xl">Expert travel guides, route information, fare charts, and booking tips from Kolkata Cab Service. Plan your perfect trip.</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-3 bg-gradient-to-r from-primary to-amber-500" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{blog.category}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={12} /> {blog.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{blog.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                      Read <ChevronRight size={14} />
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
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Need a Cab? Book Now!</h2>
          <p className="text-white/90 mb-6">Call us 24/7 for instant booking across 80+ cities in East India.</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
            📞 {BUSINESS.phone}
          </a>
        </div>
      </section>
    </>
  );
}
