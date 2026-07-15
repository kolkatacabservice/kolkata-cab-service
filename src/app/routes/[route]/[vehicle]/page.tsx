import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Phone, CheckCircle, Users, Briefcase, Fuel, Gauge } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import BookingForm from '@/components/BookingForm';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';
import FareCalculator from '@/components/FareCalculator';
import { getCity, getState, getVehicle, getVehicles, VEHICLE_SLUGS, BUSINESS } from '@/lib/data';
import { getRoute } from '@/lib/routeData';
import { getStaticVehicleRouteSlugs } from '@/lib/routeDataStatic';
import { generateVehicleRouteMetadata, generateVehicleRouteSchema, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/seo';

// true = ALL route/vehicle combos work (SSR on first request via CF Workers)
export const dynamicParams = true;
// force-dynamic: skip ISR, avoid NoFallbackError with dummy cache
export const dynamic = 'force-dynamic';

// Pre-build the top 100 hub route × vehicle combos at build time.
// 100 routes × 4 vehicles = 400 files.
export async function generateStaticParams() {
  const routeSlugs = getStaticVehicleRouteSlugs(100);
  const params: { route: string; vehicle: string }[] = [];
  for (const rs of routeSlugs) {
    for (const vs of VEHICLE_SLUGS) {
      params.push({ route: rs, vehicle: vs });
    }
  }
  return params;
}


export async function generateMetadata({ params }: { params: Promise<{ route: string; vehicle: string }> }): Promise<Metadata> {
  const { route: routeSlug, vehicle: vehicleSlug } = await params;
  const route = await getRoute(routeSlug);
  const vehicle = getVehicle(vehicleSlug);
  if (!route || !vehicle) return {};
  const fare = vehicleSlug === 'sedan' ? route.priceSaloon : vehicleSlug === 'suv' ? route.priceSuv : vehicleSlug === 'tempo' ? route.priceTempo : Math.round(route.distance * vehicle.pricePerKm);
  const baseMetadata = generateVehicleRouteMetadata(route.fromName, route.toName, route.distance, vehicleSlug, fare, route.slug);
  return {
    ...baseMetadata,
    keywords: [
      `${vehicle.name} cab ${route.fromName} to ${route.toName}`,
      `${vehicle.name} taxi ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} ${vehicle.name}`,
      `${vehicle.name} fare ${route.fromName} to ${route.toName}`,
      `${vehicle.name} price ${route.fromName} to ${route.toName}`,
      `${vehicle.name} booking ${route.fromName} to ${route.toName}`,
      `${vehicleSlug} cab ${route.fromName} to ${route.toName}`,
      `${vehicleSlug} taxi ${route.fromName} to ${route.toName}`,
      `book ${vehicle.name} ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} cab fare ₹${fare}`,
      ...vehicle.models.map(m => `${m} ${route.fromName} to ${route.toName}`),
      ...vehicle.models.map(m => `book ${m} ${route.fromName} to ${route.toName}`),
    ],
  };
}

function getVehicleFare(route: { priceSaloon: number; priceSuv: number; priceTempo: number; distance: number }, vehicleSlug: string, pricePerKm: number) {
  if (vehicleSlug === 'sedan') return route.priceSaloon;
  if (vehicleSlug === 'suv') return route.priceSuv;
  if (vehicleSlug === 'tempo') return route.priceTempo;
  return Math.round(route.distance * pricePerKm);
}

export default async function VehicleRoutePage({ params }: { params: Promise<{ route: string; vehicle: string }> }) {
  const { route: routeSlug, vehicle: vehicleSlug } = await params;
  const route = await getRoute(routeSlug);
  const vehicle = getVehicle(vehicleSlug);
  if (!route || !vehicle) notFound();

  const fromCity = getCity(route.fromState, route.from);
  const toCity = getCity(route.toState, route.to);
  const fromState = getState(route.fromState);
  const allVehicles = getVehicles();
  const fare = getVehicleFare(route, vehicleSlug, vehicle.pricePerKm);

  const faqs = [
    { question: `What is the ${vehicle.name} fare from ${route.fromName} to ${route.toName}?`, answer: `The ${vehicle.name} (${vehicle.models.slice(0, 2).join(', ')}) fare from ${route.fromName} to ${route.toName} is ₹${fare} for one-way trip. Distance: ${route.distance} km. Fare includes AC, fuel, and driver. Toll and parking are extra. Call ${BUSINESS.phone} to book.` },
    { question: `Which ${vehicle.name} models are available for ${route.fromName} to ${route.toName}?`, answer: `We offer ${vehicle.models.join(', ')} for the ${route.fromName} to ${route.toName} route. All vehicles are AC, well-maintained, GPS-tracked, and sanitized before each trip.` },
    { question: `How many passengers can travel in a ${vehicle.name} from ${route.fromName} to ${route.toName}?`, answer: `Our ${vehicle.name} can accommodate ${vehicle.capacity} passengers with ${vehicle.luggage} luggage bags. For the ${route.distance} km journey from ${route.fromName} to ${route.toName}, this is ideal for ${vehicle.capacity <= 4 ? 'couples, solo travellers, and small families' : vehicle.capacity <= 7 ? 'families and medium groups' : 'large groups, pilgrimages, and corporate outings'}.` },
    { question: `Is round trip available for ${vehicle.name} from ${route.fromName} to ${route.toName}?`, answer: `Yes! Both one-way and round trip are available for ${vehicle.name} on the ${route.fromName} to ${route.toName} route. Round trip fare is approximately ₹${Math.round(fare * 1.8)} with driver accommodation included. Call ${BUSINESS.phone} for exact pricing.` },
    { question: `Can I book a ${vehicle.name} for ${route.fromName} to ${route.toName} at night?`, answer: `Yes! We provide 24/7 ${vehicle.name} cab service from ${route.fromName} to ${route.toName}. Early morning 3 AM pickups, late night rides, festival bookings — all available at the same fixed rate of ₹${fare}. No surge pricing ever. Call ${BUSINESS.phone}.` },
    { question: `How to book ${vehicle.name} from ${route.fromName} to ${route.toName}?`, answer: `Call ${BUSINESS.phone} or WhatsApp us. You can also fill the online booking form on this page. Select "${vehicle.name}" as car type. Get instant confirmation with driver details within 2 minutes.` },
    { question: `Is ${vehicle.name} comfortable for ${route.distance} km journey?`, answer: `Absolutely! Our ${vehicle.name} fleet features ${vehicle.features.join(', ')}. For the ${route.duration}-hour journey from ${route.fromName} to ${route.toName}, you'll enjoy a smooth, comfortable ride with experienced drivers who know the route well.` },
    { question: `What is included in the ${vehicle.name} fare of ₹${fare}?`, answer: `The ₹${fare} fare for ${vehicle.name} from ${route.fromName} to ${route.toName} includes: AC vehicle, fuel charges, driver charges, and GST. Extra charges: toll (as per actuals), parking, and night charges (₹300 for 10 PM–6 AM).` },
  ];

  const otherVehicles = allVehicles.filter(v => v.id !== vehicleSlug && v.id !== 'wedding');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateVehicleRouteSchema(route.fromName, route.toName, vehicleSlug, fare, route.distance, route.duration, route.slug)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([
        { name: 'Home', url: BUSINESS.domain },
        { name: 'Routes', url: `${BUSINESS.domain}/routes` },
        { name: `${route.fromName} to ${route.toName}`, url: `${BUSINESS.domain}/routes/${route.slug}` },
        { name: vehicle.name, url: `${BUSINESS.domain}/routes/${route.slug}/${vehicleSlug}` },
      ])) }} />

      {fromCity && (
        <>
          <meta name="geo.region" content={route.fromState === 'west-bengal' ? 'IN-WB' : route.fromState === 'jharkhand' ? 'IN-JH' : 'IN-OR'} />
          <meta name="geo.placename" content={route.fromName} />
          <meta name="geo.position" content={`${fromCity.lat};${fromCity.lng}`} />
          <meta name="ICBM" content={`${fromCity.lat}, ${fromCity.lng}`} />
        </>
      )}

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[
            { name: fromState?.name || '', href: `/${route.fromState}` },
            { name: `${route.fromName} to ${route.toName}`, href: `/routes/${route.slug}` },
            { name: vehicle.name, href: `/routes/${route.slug}/${vehicleSlug}` },
          ]} />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mt-4 mb-4">
            {route.fromName} to {route.toName} <span className="text-gradient">{vehicle.name} Cab ₹{fare}</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mb-4">
            Book {vehicle.name} ({vehicle.models.slice(0, 2).join(', ')}) from {route.fromName} to {route.toName}. {route.distance} km, {route.duration} hours. {vehicle.capacity} passengers, AC, GPS tracked. No surge pricing 24/7.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-6">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><MapPin size={14} /> {route.distance} km</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Clock size={14} /> {route.duration} hrs</span>
            <span className="flex items-center gap-1.5 bg-primary/30 px-3 py-1.5 rounded-full font-semibold">₹{fare}</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full"><Users size={14} /> {vehicle.capacity} Pax</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all">
              <Phone size={18} /> Book {vehicle.name}: {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I want to book a ${vehicle.name} from ${route.fromName} to ${route.toName}.`)}`} className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-12 bg-gradient-to-br from-secondary via-slate-800 to-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 sm:h-80 lg:h-96">
              <Image src={vehicle.image} alt={`${vehicle.name} - ${vehicle.models.join(', ')} for ${route.fromName} to ${route.toName}`} fill className="object-contain p-6 drop-shadow-2xl" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-extrabold mb-4 text-primary">{vehicle.name}</h2>
              <p className="text-gray-300 mb-6">{vehicle.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                  <Users size={16} className="text-primary" />
                  <div><p className="text-white text-sm font-semibold">{vehicle.capacity} Passengers</p><p className="text-gray-500 text-xs">Max capacity</p></div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                  <Briefcase size={16} className="text-primary" />
                  <div><p className="text-white text-sm font-semibold">{vehicle.luggage} Bags</p><p className="text-gray-500 text-xs">Luggage</p></div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                  <Fuel size={16} className="text-primary" />
                  <div><p className="text-white text-sm font-semibold">AC Vehicle</p><p className="text-gray-500 text-xs">Climate control</p></div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                  <Gauge size={16} className="text-primary" />
                  <div><p className="text-white text-sm font-semibold">GPS Tracked</p><p className="text-gray-500 text-xs">Live location</p></div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Models</h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.models.map(m => (<span key={m} className="px-3 py-1.5 bg-white/10 text-white/90 text-xs font-medium rounded-lg border border-white/10">{m}</span>))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map(f => (<span key={f} className="flex items-center gap-1 text-xs text-gray-400"><CheckCircle size={12} className="text-green-500" /> {f}</span>))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Route + Vehicle Pricing */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">{vehicle.name} Fare — {route.fromName} to {route.toName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-accent rounded-2xl border-2 border-primary/20 text-center">
              <p className="text-sm text-gray-500 mb-1">One-Way Fare</p>
              <p className="text-4xl font-extrabold text-primary">₹{fare}</p>
              <p className="text-xs text-gray-500 mt-1">{route.distance} km • {route.duration} hrs</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">Round Trip (Est.)</p>
              <p className="text-4xl font-extrabold text-secondary">₹{Math.round(fare * 1.8)}</p>
              <p className="text-xs text-gray-500 mt-1">Return included</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">Per KM Rate</p>
              <p className="text-4xl font-extrabold text-secondary">₹{vehicle.pricePerKm}</p>
              <p className="text-xs text-gray-500 mt-1">All inclusive</p>
            </div>
          </div>

          {/* What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
              <h3 className="font-bold text-secondary mb-3">✅ Included in ₹{fare}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {['AC vehicle with music system', 'Fuel charges for entire trip', 'Experienced, police-verified driver', 'GPS tracking & live location sharing', 'Free cancellation (4 hrs before)', 'No surge pricing — fixed fare 24/7'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 shrink-0" /> {item}</div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <h3 className="font-bold text-secondary mb-3">ℹ️ Extra Charges</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {['Toll charges (as per actuals)', 'Parking charges (as per actuals)', `Night charges: ₹${vehicle.driverAllowance} (10 PM–6 AM)`, 'State permit (if applicable)', `Driver allowance: ₹${vehicle.driverAllowance}/day (multi-day)`, 'Extra km beyond route: Same per-km rate'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2"><span className="text-amber-500 shrink-0">•</span> {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Other Vehicles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-2">Compare Other Vehicles for {route.fromName} to {route.toName}</h2>
          <p className="text-gray-500 text-sm mb-6">Choose the best vehicle for your {route.distance} km journey</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherVehicles.map(v => {
              const vFare = getVehicleFare(route, v.id, v.pricePerKm);
              return (
                <Link key={v.id} href={`/routes/${route.slug}/${v.id}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="relative h-40 bg-gradient-to-br from-accent to-orange-50">
                    <Image src={v.image} alt={`${v.name} for ${route.fromName} to ${route.toName}`} fill className="object-contain p-4" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">{v.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{v.models.slice(0, 2).join(', ')}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>👥 {v.capacity} Pax</span>
                        <span>🧳 {v.luggage} Bags</span>
                      </div>
                      <span className="text-xl font-extrabold text-primary">₹{vFare}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Form — Full Width */}
      <section className="py-12 bg-white" id="booking-form">
        <div className="max-w-2xl mx-auto px-4">
          <BookingForm defaultFrom={route.fromName} defaultTo={route.toName} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title={`${vehicle.name} Cab — ${route.fromName} to ${route.toName} FAQs`} />
        </div>
      </section>

      {/* Fare Calculator */}
      <FareCalculator defaultFrom={route.fromName} defaultTo={route.toName} />

      {/* Google Maps */}
      <GoogleMapEmbed
        fromCity={route.fromName} toCity={route.toName}
        fromLat={fromCity?.lat} fromLng={fromCity?.lng}
        toLat={toCity?.lat} toLng={toCity?.lng}
        title={`${route.fromName} to ${route.toName} ${vehicle.name} — Route Map`}
        subtitle={`${route.distance} km driving route. Book ${vehicle.name} for ₹${fare}.`}
      />

      {/* Back to Route + CTA */}
      <section className="py-12 bg-gradient-to-r from-primary to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Book {vehicle.name} — {route.fromName} to {route.toName} ₹{fare}</h2>
          <p className="text-white/90 mb-6">{vehicle.models.slice(0, 2).join(', ')} • {route.distance} km • {route.duration} hours • {vehicle.capacity} passengers</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I want to book a ${vehicle.name} from ${route.fromName} to ${route.toName}.`)}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
          <Link href={`/routes/${route.slug}`} className="inline-flex items-center gap-2 mt-4 text-white/80 text-sm hover:text-white transition-colors">
            ← View all vehicles for {route.fromName} to {route.toName}
          </Link>
        </div>
      </section>
    </>
  );
}
