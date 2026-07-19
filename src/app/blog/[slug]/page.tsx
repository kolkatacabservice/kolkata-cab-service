import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Phone, Clock } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS } from '@/lib/data';
import { generateBreadcrumbSchema, generateArticleSchema } from '@/lib/seo';
import blogsData from '@/data/blogs.json';

type Blog = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  readTime: string;
  content: string[];
};

const blogs = blogsData as Blog[];

// Pre-build blogs at build-time. Only serve pre-rendered pages, returning 404 for unknown slugs.
export const dynamicParams = false;
export const dynamic = 'force-static';
export const revalidate = false;

export async function generateStaticParams() {
  return blogs.map(b => ({ slug: b.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) return {};
  return {
    title: blog.title.length > 55 ? `${blog.title.slice(0, 52)}... | ${BUSINESS.name}` : `${blog.title} | ${BUSINESS.name}`,
    description: blog.description,
    keywords: blog.keywords,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      siteName: BUSINESS.name,
      url: `${BUSINESS.domain}/blog/${blog.slug}`,
      locale: 'en_IN',
      publishedTime: blog.date,
      modifiedTime: blog.date,
      authors: [BUSINESS.name],
      images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: [`${BUSINESS.domain}/navbanner.webp`],
    },
    alternates: { canonical: `${BUSINESS.domain}/blog/${blog.slug}` },
    other: { thumbnail: `${BUSINESS.domain}/navbanner.webp` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) notFound();

  // Find related blogs (same category or just pick others)
  const relatedBlogs = blogs.filter(b => b.slug !== blog.slug).slice(0, 3);

  // Enhanced Article schema with isAccessibleForFree, speakable, wordCount
  const articleSchema = generateArticleSchema(blog);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Blog', url: `${BUSINESS.domain}/blog` },
        { name: blog.title, url: `${BUSINESS.domain}/blog/${blog.slug}` },
      ])) }} />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <Breadcrumbs items={[
            { name: 'Blog', href: '/blog' },
            { name: blog.title, href: `/blog/${blog.slug}` },
          ]} />
          <div className="flex items-center gap-3 mt-4 mb-3">
            <span className="px-3 py-1 bg-primary/30 text-white text-xs font-medium rounded-full">{blog.category}</span>
            <span className="flex items-center gap-1 text-xs text-gray-300"><Clock size={12} /> {blog.readTime}</span>
            <span className="text-xs text-gray-400">{new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">{blog.title}</h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <article className="prose prose-gray max-w-none">
            {blog.content.map((block, i) => {
              // Handle markdown-style headings
              if (block.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold text-secondary mt-8 mb-4">{block.replace('## ', '')}</h2>;
              }
              if (block.startsWith('**') && block.endsWith('**')) {
                return <p key={i} className="font-bold text-secondary mb-2">{block.replace(/\*\*/g, '')}</p>;
              }
              if (block.startsWith('- ') || block.startsWith('1. ')) {
                return <p key={i} className="text-gray-600 mb-2 pl-4 border-l-2 border-primary/20">{block}</p>;
              }
              return <p key={i} className="text-gray-600 mb-4 leading-relaxed">{block}</p>;
            })}
          </article>

          {/* Author / CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-secondary to-gray-800 rounded-2xl text-white text-center">
            <h3 className="text-xl font-bold mb-2">Need a Cab? We&apos;re a Call Away!</h3>
            <p className="text-gray-300 text-sm mb-4">Book with {BUSINESS.name} — 24/7 availability, transparent pricing, verified drivers.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg">
                <Phone size={18} /> {BUSINESS.phone}
              </a>
              <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hi! I want to book a cab.')}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary mb-6">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="group bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">{b.category}</span>
                  <h3 className="text-sm font-bold text-secondary mt-2 mb-1 group-hover:text-primary transition-colors line-clamp-2">{b.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{b.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
