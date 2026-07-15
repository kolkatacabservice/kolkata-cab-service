import { Metadata } from 'next';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS, getVehicles } from '@/lib/data';
import { getPopularRoutes } from '@/lib/routeData';
import { generateBreadcrumbSchema, generateItemListSchema, generateCabPriceSchema, generateWebPageSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata: Metadata = {
  title: `Kolkata Cab Fare Chart 2025 — Taxi Rate Per KM | Local & Outstation`,
  description: `Complete cab fare chart for Kolkata 2025. Sedan ₹12/km, SUV ₹16/km, Innova Crysta ₹18/km. Local packages from ₹1,800, airport fares, outstation rates. No surge pricing. Call ${BUSINESS.phone}.`,
  openGraph: {
    title: `Kolkata Cab Fare Chart 2025 | Sedan ₹12/km, SUV ₹16/km`,
    description: `Complete pricing guide — outstation ₹12/km sedan, local 4hr ₹1,800, airport ₹800+. No hidden charges. No surge. Call ${BUSINESS.phone}`,
    type: 'website',
    siteName: 'Kolkata Cab Service',
    url: `${BUSINESS.domain}/fare-chart`,
    locale: 'en_IN',
    images: [{ url: `${BUSINESS.domain}/navbanner.webp`, width: 1200, height: 630, alt: 'Kolkata Cab Fare Chart 2025' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Kolkata Cab Fare Chart 2025 | ₹12/km Sedan`,
    description: `Outstation ₹12/km | Local 4hr ₹1,800 | Airport from ₹800. No surge. Call ${BUSINESS.phone}`,
    images: [`${BUSINESS.domain}/navbanner.webp`],
  },
  alternates: { canonical: `${BUSINESS.domain}/fare-chart` },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

export default async function FareChartPage() {
  const vehicles = getVehicles();
  const popularRoutes = await getPopularRoutes(20);

  const localPackages = [
    { name: '4 Hours / 40 KM', sedan: 1800, suv: 2500, crysta: 3000, tempo: 3500 },
    { name: '8 Hours / 80 KM', sedan: 2800, suv: 3800, crysta: 4500, tempo: 5500 },
    { name: '12 Hours / 120 KM', sedan: 3800, suv: 5200, crysta: 6000, tempo: 7500 },
    { name: 'Full Day / 200 KM', sedan: 5000, suv: 7000, crysta: 8500, tempo: 10000 },
  ];

  const extraCharges = [
    { item: 'Extra KM (Sedan)', rate: '₹12/km' },
    { item: 'Extra KM (SUV)', rate: '₹16/km' },
    { item: 'Extra KM (Innova Crysta)', rate: '₹18/km' },
    { item: 'Extra KM (Tempo Traveller)', rate: '₹22/km' },
    { item: 'Extra Hour (Sedan)', rate: '₹150/hr' },
    { item: 'Extra Hour (SUV)', rate: '₹200/hr' },
    { item: 'Driver Night Halt', rate: '₹300/night' },
    { item: 'Outstation Min/Day', rate: '250 km' },
  ];

  const airportFares = [
    { area: 'Salt Lake / New Town', sedan: 800, suv: 1200 },
    { area: 'Park Street / Central Kolkata', sedan: 900, suv: 1400 },
    { area: 'Howrah / Shibpur', sedan: 1000, suv: 1500 },
    { area: 'South Kolkata (Gariahat/Ballygunge)', sedan: 1000, suv: 1500 },
    { area: 'Tollygunge / Behala', sedan: 1100, suv: 1600 },
    { area: 'Barasat / North Suburbs', sedan: 700, suv: 1000 },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Fare Chart', url: `${BUSINESS.domain}/fare-chart` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateCabPriceSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebPageSchema(
        'Kolkata Cab Fare Chart 2026',
        'Complete cab fare chart with per-km rates, local packages, and airport fares.',
        `${BUSINESS.domain}/fare-chart`
      )) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateItemListSchema(
        popularRoutes.slice(0, 20).map((r, i) => ({
          name: `${r.fromName} to ${r.toName} Cab — ₹${r.priceSaloon}`,
          url: `${BUSINESS.domain}/routes/${r.slug}`,
          position: i + 1,
        }))
      )) }} />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Fare Chart', href: '/fare-chart' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
            Kolkata Cab <span className="text-gradient">Fare Chart</span> 2025
          </h1>
          <p className="text-gray-300 max-w-3xl">Complete pricing guide — transparent rates, no hidden charges, no surge pricing. Same rate 24/7, 365 days.</p>
        </div>
      </section>

      {/* Per KM Rates */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">Outstation Cab Rates — Per KM</h2>
          <p className="text-gray-500 text-sm mb-6">Applicable for all outstation trips from Kolkata and other cities</p>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-5 py-4 text-left text-sm font-semibold">Vehicle Type</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold">Models</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Capacity</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Luggage</th>
                  <th className="px-5 py-4 text-right text-sm font-semibold">Rate/KM</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-semibold text-secondary text-sm">{v.name}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{v.models.join(', ')}</td>
                    <td className="px-5 py-3.5 text-center text-sm">{v.capacity} persons</td>
                    <td className="px-5 py-3.5 text-center text-sm">{v.luggage} bags</td>
                    <td className="px-5 py-3.5 text-right font-bold text-primary text-lg">₹{v.pricePerKm}/km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Local Packages */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">Local Taxi Packages — Kolkata</h2>
          <p className="text-gray-500 text-sm mb-6">Hourly packages for city sightseeing, shopping, hospital visits, and local travel</p>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-5 py-4 text-left text-sm font-semibold">Package</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Sedan</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">SUV</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Innova Crysta</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Tempo Traveller</th>
                </tr>
              </thead>
              <tbody>
                {localPackages.map((pkg, i) => (
                  <tr key={pkg.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-semibold text-secondary text-sm">{pkg.name}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary text-sm">₹{pkg.sedan.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary text-sm">₹{pkg.suv.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary text-sm">₹{pkg.crysta.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary text-sm">₹{pkg.tempo.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Airport Fares */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">Airport Cab Fares — Kolkata (CCU)</h2>
          <p className="text-gray-500 text-sm mb-6">Fixed-rate airport transfers. No surge pricing. Flight tracking included.</p>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-5 py-4 text-left text-sm font-semibold">Area (To/From Airport)</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">Sedan</th>
                  <th className="px-5 py-4 text-center text-sm font-semibold">SUV</th>
                </tr>
              </thead>
              <tbody>
                {airportFares.map((fare, i) => (
                  <tr key={fare.area} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-semibold text-secondary text-sm">{fare.area}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary text-sm">₹{fare.sedan.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-primary text-sm">₹{fare.suv.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Extra Charges */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Extra Charges & Policies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extraCharges.map((charge) => (
              <div key={charge.item} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">{charge.item}</p>
                <p className="text-lg font-bold text-primary mt-1">{charge.rate}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100">
            <h3 className="font-bold text-secondary mb-2">✅ What&apos;s Included in the Fare</h3>
            <p className="text-gray-600 text-sm">Fuel charges, Driver charges, AC, Vehicle maintenance</p>
            <h3 className="font-bold text-secondary mt-4 mb-2">❌ Not Included (Actual amount payable)</h3>
            <p className="text-gray-600 text-sm">Toll charges, Parking fees, State border permit (if applicable)</p>
            <p className="text-xs text-gray-400 mt-3">* All additional charges are communicated upfront before booking confirmation. Zero markup on toll and parking.</p>
          </div>
        </div>
      </section>

      {/* Route-wise Fares */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">Popular Route Fares from Kolkata</h2>
          <p className="text-gray-500 text-sm mb-6">One-way cab fares for popular routes</p>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Route</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Distance</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Sedan</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">SUV</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Tempo</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Book</th>
                </tr>
              </thead>
              <tbody>
                {popularRoutes.map((r, i) => (
                  <tr key={r.slug} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">
                      <Link href={`/routes/${r.slug}`} className="font-semibold text-secondary hover:text-primary transition-colors">
                        {r.fromName} → {r.toName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 text-sm">{r.distance} km</td>
                    <td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{r.priceSaloon}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{r.priceSuv}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary text-sm">₹{r.priceTempo}</td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/routes/${r.slug}`} className="text-xs text-primary font-semibold hover:underline">
                        Book →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book at These Rates — Call Now!</h2>
          <p className="text-white/90 mb-6">Same transparent rates online and offline. No hidden charges. No surge pricing.</p>
          <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
            <Phone size={22} /> {BUSINESS.phone}
          </a>
        </div>
      </section>
    </>
  );
}
