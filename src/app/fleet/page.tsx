import Image from 'next/image';
import Link from 'next/link';
import { Phone, Shield, Star, CheckCircle, Clock, Car, Users, Briefcase, Fuel, Gauge } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import FAQSection from '@/components/FAQSection';
import GoogleMapEmbed from '@/components/GoogleMapEmbed';

import { BUSINESS, getVehicles } from '@/lib/data';
import { generateFleetPageMetadata, generateFleetOfferCatalogSchema, generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata = generateFleetPageMetadata();

export default function FleetPage() {
  const vehicles = getVehicles();

  const faqs = [
    { question: 'What types of cars are available for rent in Kolkata?', answer: `${BUSINESS.name} offers Sedan (Swift Dzire, Honda Amaze), SUV (Ertiga, Innova), Premium SUV (Innova Crysta), Tempo Traveller (12-17 seater), and Luxury vehicles (Fortuner, Mercedes). All vehicles are AC, well-maintained, and GPS-tracked. Call ${BUSINESS.phone} to book.` },
    { question: 'What is the per km rate for car rental?', answer: 'Sedan: ₹12/km, SUV: ₹16/km, Innova Crysta: ₹18/km, Tempo Traveller: ₹22/km, Luxury: ₹25/km. These rates include AC, fuel, and driver. Toll and parking charges are extra.' },
    { question: 'Do you provide car rental in Ranchi and Jamshedpur?', answer: `Yes! ${BUSINESS.name} operates across Kolkata, Ranchi, Jamshedpur, Dhanbad, Bokaro, Bhubaneswar, and 80+ cities. Same fleet, same rates. Call ${BUSINESS.phone} for booking in any city.` },
    { question: 'Can I rent a car for a wedding in Kolkata?', answer: `Yes! We offer decorated wedding cars — Innova Crysta, Fortuner, and luxury sedans with flower decoration, ribbon, and professional chauffeur. Starting ₹3,500 for 4 hours. Book via ${BUSINESS.phone}.` },
    { question: 'Is there a minimum booking distance?', answer: 'For outstation trips, minimum booking is 250 km per day. For local rides, we offer 4hr/40km and 8hr/80km packages starting ₹1,800. No minimum for airport transfers.' },
    { question: 'Do you offer Tempo Traveller for group travel?', answer: `Yes! 12-seater and 17-seater Tempo Travellers available for group outings, pilgrimages, corporate events, and wedding parties. Rate: ₹22/km. Book via ${BUSINESS.phone} or WhatsApp.` },
    { question: 'Are the cars AC and sanitized?', answer: 'Yes! Every vehicle in our fleet is fully air-conditioned, regularly sanitized, and GPS-tracked. Drivers are police-verified with 5+ years of experience. We maintain the highest safety standards.' },
    { question: 'How do I choose the right vehicle for my trip?', answer: 'Sedan (4 pax, 2 bags): Best for couples and solo travellers. SUV (6 pax, 3 bags): Ideal for families. Innova Crysta (7 pax, 4 bags): Premium family/business travel. Tempo (12+ pax): Group trips.' },
  ];

  // Color schemes per vehicle type for visual variety
  const vehicleThemes: Record<string, { gradient: string; accent: string; badge: string }> = {
    sedan: { gradient: 'from-slate-900 via-slate-800 to-slate-900', accent: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    suv: { gradient: 'from-indigo-950 via-indigo-900 to-indigo-950', accent: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    tempo: { gradient: 'from-emerald-950 via-emerald-900 to-emerald-950', accent: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    luxury: { gradient: 'from-purple-950 via-purple-900 to-purple-950', accent: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    wedding: { gradient: 'from-rose-950 via-rose-900 to-rose-950', accent: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFleetOfferCatalogSchema(vehicles)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema([{ name: 'Home', url: BUSINESS.domain }, { name: 'Our Fleet', url: `${BUSINESS.domain}/fleet` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />

      {/* Geo meta — Kolkata primary */}
      <meta name="geo.region" content="IN-WB" />
      <meta name="geo.placename" content="Kolkata" />
      <meta name="geo.position" content="22.5726;88.3639" />
      <meta name="ICBM" content="22.5726, 88.3639" />

      {/* Hero */}
      <section className="relative text-white py-16 lg:py-20 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Car Rental Fleet', href: '/fleet' }]} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 mb-4">Car Rental <span className="text-gradient">Kolkata</span> — Innova, Sedan, SUV, Tempo</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl">Book car rental in Kolkata from ₹12/km — Innova Crysta, Ertiga SUV, Swift Dzire Sedan & Tempo Traveller. AC, verified drivers, GPS tracked. Available 24/7 in Kolkata, Ranchi, Jamshedpur & 80+ cities.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all text-sm md:text-base">
              <Phone size={18} /> Book Now: {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges — improved mobile */}
      <section className="py-4 md:py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
            {[
              { icon: <Shield size={14} />, text: 'Verified Drivers' },
              { icon: <Clock size={14} />, text: '24/7 Available' },
              { icon: <Star size={14} />, text: '4.8★ Rating' },
              { icon: <CheckCircle size={14} />, text: 'No Surge' },
              { icon: <Car size={14} />, text: 'AC Fleet' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-primary font-medium">{b.icon} {b.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Cards — Premium Redesign */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-6 md:space-y-8">
            {vehicles.map((vehicle, idx) => {
              const theme = vehicleThemes[vehicle.id] || vehicleThemes.sedan;
              const isEven = idx % 2 === 0;
              return (
                <div key={vehicle.id} className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br ${theme.gradient} border border-white/10`}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 ${isEven ? '' : 'lg:[direction:rtl]'}`}>
                    {/* Image — Much bigger now */}
                    <div className="relative h-56 sm:h-72 md:h-80 lg:h-[420px] overflow-hidden lg:[direction:ltr]">
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                      <Image
                        src={vehicle.image}
                        alt={`${vehicle.name} - ${vehicle.models.join(', ')} for rent at ${BUSINESS.name}`}
                        fill
                        className="object-contain p-6 md:p-8 lg:p-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={idx < 2}
                      />
                      {/* Price badge on image */}
                      <div className="absolute top-4 left-4 md:top-6 md:left-6">
                        <div className={`px-4 py-2 rounded-xl border ${theme.badge} backdrop-blur-sm font-bold text-sm md:text-base`}>
                          ₹{vehicle.pricePerKm}<span className="text-xs font-normal opacity-80">/km</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-8 lg:p-10 lg:[direction:ltr] flex flex-col justify-center">
                      {/* Vehicle Name */}
                      <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 ${theme.accent}`}>{vehicle.name}</h2>
                      <p className="text-gray-400 text-sm md:text-base mb-5 leading-relaxed">{vehicle.description}</p>

                      {/* Key Specs — card grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                          <Users size={16} className={theme.accent} />
                          <div>
                            <p className="text-white text-sm font-semibold">{vehicle.capacity} Passengers</p>
                            <p className="text-gray-500 text-xs">Max capacity</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                          <Briefcase size={16} className={theme.accent} />
                          <div>
                            <p className="text-white text-sm font-semibold">{vehicle.luggage} Bags</p>
                            <p className="text-gray-500 text-xs">Luggage space</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                          <Fuel size={16} className={theme.accent} />
                          <div>
                            <p className="text-white text-sm font-semibold">AC Vehicle</p>
                            <p className="text-gray-500 text-xs">Climate control</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10">
                          <Gauge size={16} className={theme.accent} />
                          <div>
                            <p className="text-white text-sm font-semibold">GPS Tracked</p>
                            <p className="text-gray-500 text-xs">Live location</p>
                          </div>
                        </div>
                      </div>

                      {/* Models */}
                      <div className="mb-5">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Models</h3>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.models.map((m) => (
                            <span key={m} className="px-3 py-1.5 bg-white/10 text-white/90 text-xs font-medium rounded-lg border border-white/10">{m}</span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features.map((f) => (
                            <span key={f} className="flex items-center gap-1 text-xs text-gray-400">
                              <CheckCircle size={12} className="text-green-500" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a href={`tel:${BUSINESS.phone}`} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all text-sm md:text-base">
                          <Phone size={16} /> Book {vehicle.name}
                        </a>
                        <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hi! I want to book a ${vehicle.name}. Please share availability and rates.`)}`} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500/20 text-green-400 border border-green-500/30 font-bold rounded-xl hover:bg-green-500/30 transition-all text-sm md:text-base">
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Long-form SEO Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Car Rental in Kolkata — Innova Crysta, Sedan, SUV &amp; Tempo Traveller</h2>
            
            {/* Fleet comparative stats matrix for AI search / LLM indexing */}
            <div className="my-8 overflow-x-auto rounded-2xl border border-amber-200 bg-amber-50/30 p-6">
              <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                📊 Vehicle Recommendation Matrix — Compare Cabs
              </h3>
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100">
                <thead>
                  <tr className="bg-secondary text-white text-sm">
                    <th className="px-4 py-3 text-left">Vehicle Type</th>
                    <th className="px-4 py-3 text-center">Capacity</th>
                    <th className="px-4 py-3 text-center">Luggage Space</th>
                    <th className="px-4 py-3 text-right">Base Fare/KM</th>
                    <th className="px-4 py-3 text-left">Ideal For</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {vehicles.map((v, i) => (
                    <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50/10'}>
                      <td className="px-4 py-3 font-semibold text-secondary">{v.name}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{v.capacity} Passengers</td>
                      <td className="px-4 py-3 text-center text-gray-700">{v.luggage} Bags</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">₹{v.pricePerKm}/km</td>
                      <td className="px-4 py-3 text-gray-600">
                        {v.id === 'sedan' ? 'Couples, Solo, Budget Travelers' :
                         v.id === 'suv' ? 'Families, Medium Groups' :
                         v.id === 'tempo' ? 'Large Groups, Wedding Parties, Pilgrimages' :
                         v.id === 'luxury' ? 'VIPs, Executives, Special Events' :
                         'Special Occasions & Groom Entries'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-3">* All vehicles are fully air-conditioned and feature active GPS tracking. Driver allowances apply for night trips.</p>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                <strong>{BUSINESS.name}</strong> maintains a fleet of 200+ well-maintained, AC, GPS-tracked vehicles across Kolkata, Ranchi, Jamshedpur, Dhanbad, Bhubaneswar, and 80+ cities in West Bengal, Jharkhand, and Odisha. Whether you need a compact sedan for a business trip, a spacious SUV for a family vacation, or a Tempo Traveller for a group pilgrimage — we have the right vehicle at the right price.
              </p>
              <p>
                Our <strong>Sedan fleet</strong> (Swift Dzire, Honda Amaze, Hyundai Aura) starts at just ₹12/km — ideal for solo travellers, couples, and business professionals. The <strong>SUV fleet</strong> (Ertiga, Innova, Marazzo) at ₹16/km offers extra space for families with luggage. For premium comfort, choose the <strong>Innova Crysta</strong> at ₹18/km — the gold standard for long-distance outstation travel and VIP airport transfers.
              </p>
              <p>
                For group travel, our <strong>Tempo Travellers</strong> (12-seater and 17-seater, Force Traveller) at ₹22/km are perfect for corporate outings, wedding parties, and pilgrimages to Deoghar, Varanasi, and Puri. All Tempo Travellers come with push-back seats, luggage carrier, and music system.
              </p>
              <p>
                Every vehicle in our fleet is <strong>fully insured, regularly serviced, and sanitized</strong> before each trip. Drivers are police-verified with 5+ years of experience and knowledge of local roads. We provide the same fleet quality in Kolkata, Ranchi, Jamshedpur, and all operational cities — no compromises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City Coverage */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Car Rental Available in <span className="text-primary">These Cities</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Kolkata', href: '/west-bengal/kolkata' },
              { name: 'Ranchi', href: '/jharkhand/ranchi' },
              { name: 'Jamshedpur', href: '/jharkhand/jamshedpur' },
              { name: 'Dhanbad', href: '/jharkhand/dhanbad' },
              { name: 'Bokaro', href: '/jharkhand/bokaro' },
              { name: 'Bhubaneswar', href: '/odisha/bhubaneswar' },
              { name: 'Puri', href: '/odisha/puri' },
              { name: 'Siliguri', href: '/west-bengal/siliguri' },
              { name: 'Darjeeling', href: '/west-bengal/darjeeling' },
              { name: 'Durgapur', href: '/west-bengal/durgapur' },
              { name: 'Asansol', href: '/west-bengal/asansol' },
              { name: 'Howrah', href: '/west-bengal/howrah' },
            ].map((city) => (
              <Link key={city.name} href={city.href} className="group p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
                <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">🚗 {city.name}</p>
                <p className="text-xs text-gray-400 mt-1">All vehicle types available</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title="Car Rental Fleet — FAQs" />
        </div>
      </section>

      {/* CTA */}
      <GoogleMapEmbed />

      <section className="py-12 bg-gradient-to-r from-primary to-amber-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Rent a Car — Sedan ₹12/km | SUV ₹16/km</h2>
          <p className="text-white/90 mb-6 text-sm md:text-base">AC vehicles, verified drivers, no surge pricing. Available in Kolkata, Ranchi, Jamshedpur & 80+ cities.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-base md:text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent('Hi! I need a car rental quote. Please share vehicle options and rates.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-full text-base md:text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SEO Keywords */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">People Also Search For</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'car rental kolkata', href: '/west-bengal/kolkata' },
              { label: 'sedan rental kolkata', href: '/fleet' },
              { label: 'suv hire kolkata', href: '/fleet' },
              { label: 'innova crysta kolkata', href: '/west-bengal/kolkata' },
              { label: 'tempo traveller kolkata', href: '/west-bengal/kolkata' },
              { label: 'car rental ranchi', href: '/jharkhand/ranchi' },
              { label: 'car hire jamshedpur', href: '/jharkhand/jamshedpur' },
              { label: 'innova cab ranchi', href: '/jharkhand/ranchi' },
              { label: 'wedding car kolkata', href: '/west-bengal/kolkata/wedding-car' },
              { label: 'corporate car fleet', href: '/services/corporate-car-rental' },
              { label: 'luxury car rental', href: '/fleet' },
              { label: 'car rental per km rate', href: '/fare-chart' },
              { label: 'ac cab for rent', href: '/fleet' },
              { label: 'self drive car kolkata', href: '/west-bengal/kolkata' },
              { label: 'car rental bhubaneswar', href: '/odisha/bhubaneswar' },
              { label: 'vehicle on rent', href: '/fleet' },
            ].map((kw, i) => (
              <Link key={i} href={kw.href} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-500 hover:border-primary/40 hover:text-primary transition-colors">
                {kw.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
