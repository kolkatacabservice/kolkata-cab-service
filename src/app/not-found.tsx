import { Metadata } from 'next';
import Link from 'next/link';
import { Home, Phone, Route, Car } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

export const metadata: Metadata = {
  title: `Page Not Found | ${BUSINESS.name}`,
  description: `The page you're looking for doesn't exist. Browse our cab services, routes, or contact us at ${BUSINESS.phone}.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-5xl font-extrabold text-primary">404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-secondary mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. But don&apos;t worry — we&apos;re still here to help you book your cab!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Home size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">Home Page</p>
              <p className="text-xs text-gray-400">Back to main page</p>
            </div>
          </Link>
          <Link href="/contact" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Phone size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">Contact Us</p>
              <p className="text-xs text-gray-400">Book cab or get help</p>
            </div>
          </Link>
          <Link href="/services/outstation" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Route size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">Our Services</p>
              <p className="text-xs text-gray-400">Browse cab services</p>
            </div>
          </Link>
          <Link href="/fleet" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Car size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">Our Fleet</p>
              <p className="text-xs text-gray-400">View available cars</p>
            </div>
          </Link>
        </div>

        <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
          <Phone size={22} /> Call {BUSINESS.phone}
        </a>
      </div>
    </section>
  );
}
