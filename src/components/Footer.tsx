import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { BUSINESS, getAllStates } from '@/lib/data';
import { getPopularRoutes } from '@/lib/routeData';

export default async function Footer() {
  const states = getAllStates();
  const popularRoutes = await getPopularRoutes(12);

  // Top cities for internal linking — crawlable by Google
  // Salt Lake & New Town point to /kolkata/[area] (canonical) — richer hyper-local pages
  const topCities = [
    { name: 'Kolkata', href: '/west-bengal/kolkata' },
    { name: 'Howrah', href: '/west-bengal/howrah' },
    { name: 'Salt Lake', href: '/kolkata/salt-lake' },
    { name: 'New Town', href: '/kolkata/new-town' },
    { name: 'Siliguri', href: '/west-bengal/siliguri' },
    { name: 'Darjeeling', href: '/west-bengal/darjeeling' },
    { name: 'Durgapur', href: '/west-bengal/durgapur' },
    { name: 'Asansol', href: '/west-bengal/asansol' },
    { name: 'Digha', href: '/west-bengal/digha' },
    { name: 'Ranchi', href: '/jharkhand/ranchi' },
    { name: 'Jamshedpur', href: '/jharkhand/jamshedpur' },
    { name: 'Dhanbad', href: '/jharkhand/dhanbad' },
    { name: 'Bokaro', href: '/jharkhand/bokaro' },
    { name: 'Deoghar', href: '/jharkhand/deoghar' },
    { name: 'Bhubaneswar', href: '/odisha/bhubaneswar' },
    { name: 'Puri', href: '/odisha/puri' },
    { name: 'Cuttack', href: '/odisha/cuttack' },
    { name: 'Balasore', href: '/odisha/balasore' },
    { name: 'Baripada', href: '/odisha/baripada' },
    { name: 'Malda', href: '/west-bengal/malda' },
    { name: 'Berhampur', href: '/odisha/berhampur' },
    { name: 'Kharagpur', href: '/west-bengal/kharagpur' },
  ];

  // Kolkata area pages
  const kolkataAreas = [
    { name: 'Salt Lake Cab', href: '/kolkata/salt-lake' },
    { name: 'New Town Cab', href: '/kolkata/new-town' },
    { name: 'Howrah Cab', href: '/kolkata/howrah' },
    { name: 'Park Street Cab', href: '/kolkata/park-street' },
    { name: 'Dum Dum Cab', href: '/kolkata/dum-dum' },
    { name: 'Ballygunge Cab', href: '/kolkata/ballygunge' },
    { name: 'Gariahat Cab', href: '/kolkata/gariahat' },
    { name: 'Jadavpur Cab', href: '/kolkata/jadavpur' },
    { name: 'Tollygunge Cab', href: '/kolkata/tollygunge' },
    { name: 'Esplanade Cab', href: '/kolkata/esplanade' },
    { name: 'Barasat Cab', href: '/kolkata/barasat' },
    { name: 'Behala Cab', href: '/kolkata/behala' },
  ];

  return (
    <footer className="bg-gradient-to-b from-secondary to-indigo-950 text-white">
      {/* SEO Internal Link Mesh — Massive crawlable link section */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            {/* Top Cities */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <p className="text-sm font-bold text-primary mb-3">Cab Service by City</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                {topCities.map(city => (
                  <Link key={city.name} href={city.href} className="text-gray-400 hover:text-primary transition-colors py-0.5">
                    {city.name} Cab
                  </Link>
                ))}
              </div>
            </div>
            {/* Popular Routes */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-2">
              <p className="text-sm font-bold text-primary mb-3">Popular Routes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {popularRoutes.map(route => (
                  <Link key={route.slug} href={`/routes/${route.slug}`} className="text-gray-400 hover:text-primary transition-colors py-0.5">
                    {route.fromName} to {route.toName}
                  </Link>
                ))}
              </div>
            </div>
            {/* Kolkata Areas */}
            <div>
              <p className="text-sm font-bold text-primary mb-3">Kolkata Areas</p>
              <div className="space-y-1">
                {kolkataAreas.map(area => (
                  <Link key={area.name} href={area.href} className="block text-gray-400 hover:text-primary transition-colors py-0.5">
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
            {/* Services */}
            <div>
              <p className="text-sm font-bold text-primary mb-3">Our Services</p>
              <div className="space-y-1">
                <Link href="/services/local-taxi" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Local Taxi Kolkata</Link>
                <Link href="/services/outstation" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Outstation Cab</Link>
                <Link href="/services/one-way" className="block text-gray-400 hover:text-primary transition-colors py-0.5">One-Way Taxi</Link>
                <Link href="/services/round-trip" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Round Trip Cab</Link>
                <Link href="/services/airport-transfer" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Airport Transfer</Link>
                <Link href="/services/wedding-car-rental" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Wedding Car</Link>
                <Link href="/services/corporate-car-rental" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Corporate Rental</Link>
                <Link href="/tours" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Tour Packages</Link>
                <Link href="/fare-chart" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Fare Chart</Link>
                <Link href="/fleet" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Our Fleet</Link>
                <Link href="/blog" className="block text-gray-400 hover:text-primary transition-colors py-0.5">Travel Blog</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Image src="/logo.webp" alt={BUSINESS.name} width={40} height={40} className="rounded-lg" style={{ width: 'auto', height: 'auto' }} />
              {BUSINESS.name}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Kolkata Cab Service is the best cab & taxi service in Kolkata, West Bengal. Book cab in Kolkata from ₹12/km. Airport transfer ₹1200, outstation, local, one-way, wedding car, corporate rental. Serving 80+ cities across West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh. 24/7 availability. No surge pricing.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors font-semibold">
                <Phone size={14} /> {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} /> {BUSINESS.email}
              </a>
              <p className="flex items-center gap-2">
                <Clock size={14} /> {BUSINESS.hours}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} /> Kolkata, West Bengal, India
              </p>
            </div>
          </div>

          {/* Why Choose Us — trust signals */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Why Choose Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">✅ <span>Lowest fare from ₹12/km — no surge pricing ever</span></li>
              <li className="flex items-start gap-2">✅ <span>★4.8 Google rating — 5000+ happy customers</span></li>
              <li className="flex items-start gap-2">✅ <span>Police-verified drivers with 5+ years experience</span></li>
              <li className="flex items-start gap-2">✅ <span>Clean, AC, GPS-tracked vehicles</span></li>
              <li className="flex items-start gap-2">✅ <span>Free cancellation up to 4 hours before</span></li>
              <li className="flex items-start gap-2">✅ <span>Instant WhatsApp confirmation in 2 minutes</span></li>
              <li className="flex items-start gap-2">✅ <span>24/7/365 availability — rain, festival, midnight</span></li>
              <li className="flex items-start gap-2">✅ <span>80+ cities, 500+ routes coverage</span></li>
            </ul>
          </div>

          {/* States with city links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Service Areas</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {states.filter(s => !['delhi-ncr', 'uttarakhand', 'madhya-pradesh'].includes(s.slug)).map((state) => (
                <li key={state.slug}>
                  <Link href={`/${state.slug}`} className="hover:text-primary transition-colors font-medium">
                    {state.name}
                  </Link>
                  <span className="text-gray-500 text-xs ml-1">({state.cities.length} cities)</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {state.cities.slice(0, 5).map(city => (
                      <Link key={city.slug} href={`/${state.slug}/${city.slug}`} className="text-xs text-gray-500 hover:text-primary transition-colors">
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links + Payment */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Kolkata Cab Service</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/fleet" className="hover:text-primary transition-colors">Our Fleet — Sedan, SUV, Tempo</Link></li>
              <li><Link href="/fare-chart" className="hover:text-primary transition-colors">Kolkata Cab Fare Chart</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Travel Blog & Guides</Link></li>
              <li><Link href="/tours" className="hover:text-primary transition-colors">Tour Packages from Kolkata</Link></li>
              <li><Link href="/kolkata-cab-vs-ola-uber" className="hover:text-primary transition-colors font-medium">🆚 Kolkata Cab vs Ola vs Uber</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors text-gray-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors text-gray-500">Terms & Conditions</Link></li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-semibold mb-2 text-gray-400">Payment Options</h4>
              <p className="text-xs text-gray-500">Cash • UPI (GPay, PhonePe) • Credit/Debit Card • Bank Transfer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review CTA strip — E-E-A-T trust signal */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex text-amber-400 text-lg">★★★★★</div>
            <p className="text-sm text-gray-300"><strong className="text-white">4.8/5</strong> on Google • 2,847+ reviews</p>
          </div>
          <a href={BUSINESS.gbpReviewLink} target="_blank" rel="noopener noreferrer" className="px-5 py-2 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-all">
            ⭐ Leave a Review
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-400">
          <p suppressHydrationWarning>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved. | Best Cab Service in Kolkata ₹12/km</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/fleet" className="hover:text-primary transition-colors">Fleet</Link>
            <Link href="/fare-chart" className="hover:text-primary transition-colors">Fare Chart</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link href="/tours" className="hover:text-primary transition-colors">Tours</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="/kolkata-cab-vs-ola-uber" className="hover:text-primary transition-colors">vs Ola/Uber</Link>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
