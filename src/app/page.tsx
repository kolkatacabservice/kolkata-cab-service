import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import nextDynamic from 'next/dynamic';
import { MapPin, Shield, Clock, CreditCard, Car, Phone, Star, ArrowRight, Route, Plane, Heart, Building, ChevronRight, Users, Award, CheckCircle } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import HeroBanner from '@/components/HeroBanner';
import FAQSection from '@/components/FAQSection';
import { BUSINESS, getAllStates, getServices, getVehicles } from '@/lib/data';
import { getPopularRoutes } from '@/lib/routeData';
import { generateFaqSchema, generateReviewSchema, generatePopularRoutesItemListSchema, generateHomePageMetadata, generateSeasonalOfferSchema } from '@/lib/seo';

// Dynamic imports for below-fold components — reduces initial JS bundle by ~25 KiB
const FareCalculator = nextDynamic(() => import('@/components/FareCalculator'), {
  loading: () => (
    <div className="py-20 text-center">
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full text-gray-400 text-sm border border-gray-100">
        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        Calculating fares&hellip;
      </div>
    </div>
  ),
});
const GoogleMapEmbed = nextDynamic(() => import('@/components/GoogleMapEmbed'), {
  loading: () => (
    <div className="py-16 text-center">
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-full text-gray-400 text-sm border border-gray-100">
        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        Loading map&hellip;
      </div>
    </div>
  ),
});

// Force fully static SSG — zero ISR Reads/Writes on Vercel
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  ...generateHomePageMetadata(),
  other: {
    'geo.region': 'IN-WB',
    'geo.placename': 'Kolkata',
    'geo.position': '22.5726;88.3639',
    'ICBM': '22.5726, 88.3639',
    'format-detection': 'telephone=yes',
    'thumbnail': `${BUSINESS.domain}/navbanner.webp`,
  },
};

export default async function HomePage() {
  const states = getAllStates();
  const popularRoutes = await getPopularRoutes(12);
  const services = getServices();
  const vehicles = getVehicles();

  const faqs = [
    { question: `What is the phone number of ${BUSINESS.name}?`, answer: `You can call us at ${BUSINESS.phone} or WhatsApp us anytime. We are available 24/7, 365 days a year for cab bookings across East India.` },
    { question: 'What cities do you cover for cab service?', answer: `We provide cab services across West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh. Our hub cities are Kolkata, Ranchi, Bhubaneswar, Patna, and Varanasi. We cover 80+ cities and 500+ routes.` },
    { question: 'What types of cabs are available in Kolkata?', answer: 'We offer Sedan (Swift Dzire, Honda Amaze), SUV (Ertiga, Innova, Innova Crysta), Tempo Traveller (12-17 seater), and Luxury cars (Fortuner, Mercedes). We also provide decorated cars for weddings.' },
    { question: 'Do you provide one-way taxi service from Kolkata?', answer: 'Yes! We offer one-way taxi service from Kolkata to all major cities. You pay only for the one-way journey with no return charges. This is the most affordable option for point-to-point travel.' },
    { question: 'How can I book a cab in Kolkata?', answer: `You can book a cab by calling ${BUSINESS.phone}, sending a WhatsApp message, or filling out the booking form on our website. We provide instant confirmation and fare details.` },
    { question: 'Do you provide Kolkata airport cab service?', answer: `Yes! We provide pickup and drop service at Netaji Subhash Chandra Bose International Airport (CCU), Dum Dum. Sedan from ₹1800, SUV from ₹2,200. Our driver tracks your flight and waits with a name board. Call ${BUSINESS.phone}.` },
    { question: 'Do you provide wedding car rental in Kolkata?', answer: 'Yes, we offer premium wedding car rental services in Kolkata with flower decoration, ribbon decoration, red carpet, and professional chauffeurs. We provide decorated Innova Crysta, Fortuner, and luxury sedans for baraat, vidaai, and wedding functions.' },
    { question: 'What payment methods do you accept?', answer: `We accept Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Online Bank Transfers. Payment can be made before or after the trip as per your convenience.` },
    { question: 'Is there a corporate car rental service in Kolkata?', answer: 'Yes, we provide dedicated corporate car rental services in Kolkata for employee transport, client meetings, business events, and executive travel. Monthly contracts and GST invoices are available for corporate clients.' },
    { question: 'What is the cab fare per km in Kolkata?', answer: 'Cab fare in Kolkata starts at ₹12/km for Sedan (Swift Dzire, Honda Amaze), ₹16/km for SUV (Ertiga, Innova), ₹18/km for Innova Crysta, and ₹22/km for Tempo Traveller. Local packages start from ₹1,800 for 4 hours/40 km. All fares include fuel and driver charges — no hidden costs.' },
  ];

  const testimonials = [
    { name: 'Rajesh Kumar', location: 'Kolkata', rating: 5, text: 'Excellent service! Booked a cab from Kolkata to Darjeeling. The driver was professional, car was clean, and the entire trip was very comfortable. Highly recommended!' },
    { name: 'Priya Sharma', location: 'Salt Lake, Kolkata', rating: 5, text: 'Best cab service in Kolkata! Used their service for airport pickup from CCU. Very punctual — driver was waiting with a name board. Very affordable pricing.' },
    { name: 'Amit Singh', location: 'Howrah', rating: 5, text: 'Booked a round trip from Kolkata to Puri. Everything was perfect — on time pickup, comfortable Innova, and the driver was like a guide sharing local knowledge.' },
    { name: 'Sunita Devi', location: 'New Town, Kolkata', rating: 5, text: 'Used their wedding car rental service. The decorated Innova Crysta looked absolutely stunning. Everyone at the wedding was impressed. Thank you Kolkata Cab Service!' },
    { name: 'Mohammed Iqbal', location: 'Park Street, Kolkata', rating: 5, text: 'Traveled from Kolkata to Varanasi. The one-way fare was very reasonable compared to other services. Clean car, experienced driver. Will definitely use again!' },
    { name: 'Ananya Chatterjee', location: 'Ballygunge, Kolkata', rating: 5, text: 'Regular customer for over a year now. I use Kolkata Cab Service for my weekly outstation trips. The rates are fixed, no surge pricing, and the cars are always clean and well-maintained.' },
    { name: 'Vikram Ghosh', location: 'Dum Dum, Kolkata', rating: 4, text: 'Used their airport drop service at 4 AM for an early morning flight from CCU. Driver arrived 15 minutes before time. Sedan was comfortable and fare was exactly as quoted. Good value for money.' },
    { name: 'Sneha Roy', location: 'Gariahat, Kolkata', rating: 5, text: 'Booked a tempo traveller for a family pilgrimage from Kolkata to Gangasagar. The driver knew all the routes, the 12-seater was spacious. We will book again for our Mayapur trip.' },
    { name: 'Deepak Mandal', location: 'Behala, Kolkata', rating: 5, text: 'Corporate cab service for our IT company in Salt Lake. Monthly contract with GST billing. Drivers are always on time and professional. Best B2B cab service in Kolkata.' },
    { name: 'Ritu Agarwal', location: 'Tollygunge, Kolkata', rating: 4, text: 'Kolkata to Digha weekend trip with family. SUV Ertiga was perfect for 5 people with luggage. Driver was patient at all stops. Very happy with the one-way fare — much cheaper than Uber.' },
    { name: 'Saurav Das', location: 'Barasat, Kolkata', rating: 5, text: 'I compare prices every time — Kolkata Cab Service consistently beats Ola, Uber, and other local operators on outstation routes. Plus no cancellation drama. Fixed rate, reliable service.' },
    { name: 'Moumita Sen', location: 'Jadavpur, Kolkata', rating: 5, text: 'Hired an Innova Crysta for my sister\'s wedding. Beautiful flower decoration, red carpet setup, and the chauffeur was dressed professionally. Made the wedding entrance memorable!' },
  ];

  const whyChooseUs = [
    { icon: <Shield className="w-8 h-8" />, title: '100% Safe & Verified', desc: 'All drivers are police-verified with background checks. GPS-tracked vehicles for your complete safety.' },
    { icon: <Clock className="w-8 h-8" />, title: '24/7 Availability', desc: 'Book anytime, day or night. We operate 365 days including all holidays with no surge pricing.' },
    { icon: <CreditCard className="w-8 h-8" />, title: 'No Hidden Charges', desc: 'Transparent pricing with all-inclusive fares. Toll, parking, driver allowance all communicated upfront.' },
    { icon: <Car className="w-8 h-8" />, title: 'Well-Maintained Fleet', desc: 'Clean, sanitized AC vehicles. Regular maintenance and safety checks on all our cars.' },
    { icon: <MapPin className="w-8 h-8" />, title: '80+ Cities Covered', desc: 'Service across 5 states with 500+ routes. Local, outstation, and one-way trips available.' },
    { icon: <Star className="w-8 h-8" />, title: 'Best Price Guarantee', desc: 'Competitive pricing with no surge. Compare our fares — we guarantee the best rates across Kolkata.' },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    MapPin: <MapPin className="w-6 h-6" />,
    Route: <Route className="w-6 h-6" />,
    ArrowRight: <ArrowRight className="w-6 h-6" />,
    ArrowLeftRight: <ArrowRight className="w-6 h-6" />,
    RotateCcw: <ArrowRight className="w-6 h-6" />,
    Plane: <Plane className="w-6 h-6" />,
    Heart: <Heart className="w-6 h-6" />,
    Building: <Building className="w-6 h-6" />,
  };

  const kolkataAreas = [
    { name: 'Salt Lake (Bidhannagar)', desc: 'IT hub & residential area', slug: 'salt-lake' },
    { name: 'New Town (Rajarhat)', desc: 'Tech parks & commercial zone', slug: 'new-town' },
    { name: 'Howrah', desc: 'Twin city across Hooghly', slug: 'howrah' },
    { name: 'Dum Dum (Airport)', desc: 'CCU airport transfers', slug: 'dum-dum' },
    { name: 'Park Street', desc: 'Central business district', slug: 'park-street' },
    { name: 'Ballygunge', desc: 'South Kolkata residential', slug: 'ballygunge' },
    { name: 'Esplanade / BBD Bagh', desc: 'Government & business hub', slug: 'esplanade' },
    { name: 'Gariahat', desc: 'Shopping & south residential', slug: 'gariahat' },
    { name: 'Barasat', desc: 'North 24 Parganas', slug: 'barasat' },
    { name: 'Behala', desc: 'Southwest Kolkata', slug: 'behala' },
    { name: 'Tollygunge', desc: 'Metro & residential south', slug: 'tollygunge' },
    { name: 'Jadavpur', desc: 'University & south connector', slug: 'jadavpur' },
  ];

  const fareData = [
    { vehicle: '🚗 Sedan (Swift Dzire / Amaze)', capacity: '4 Passengers', perKm: '₹12/km', local4hr: '₹1,800', local8hr: '₹2,800' },
    { vehicle: '🚙 SUV (Ertiga / Innova)', capacity: '6 Passengers', perKm: '₹16/km', local4hr: '₹2,500', local8hr: '₹3,800' },
    { vehicle: '🚐 Innova Crysta', capacity: '7 Passengers', perKm: '₹18/km', local4hr: '₹3,000', local8hr: '₹4,500' },
    { vehicle: '🚌 Tempo Traveller', capacity: '12 Passengers', perKm: '₹22/km', local4hr: '₹3,500', local8hr: '₹5,500' },
  ];

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateReviewSchema(testimonials)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePopularRoutesItemListSchema(popularRoutes)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSeasonalOfferSchema()) }} />


      {/* Hero Section */}
      <section id="hero">
        <div className="relative min-h-[480px] sm:min-h-[550px] lg:min-h-[700px] flex items-center lg:overflow-hidden bg-secondary">
          <div className="absolute inset-0 w-full h-full">
            <HeroBanner />
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-16 lg:py-24 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* Hero content */}
              <div className="text-white pb-12 sm:pb-16 lg:pb-0">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm mb-4 sm:mb-6 border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  ★ 4.8 Google Rating — Serving 80+ Cities Across East India
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 sm:mb-4 drop-shadow-lg">
                  <span className="text-gradient">Kolkata Cab Service</span> — Best Taxi Booking ₹12/km
                  <br />
                  <span className="text-xl sm:text-2xl lg:text-4xl font-bold text-white/90">Local Taxi, Outstation Cab &amp; Airport Transfer in Kolkata | 24/7</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-5 sm:mb-8 max-w-lg drop-shadow-md">
                  Trusted Kolkata cab service for local taxi, outstation cab booking, airport transfer, one-way taxi, car rental &amp; wedding car. AC sedan ₹12/km, SUV ₹16/km. Book cab in Kolkata online or by call — no surge pricing, 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:scale-105 transition-all text-sm sm:text-base">
                    <Phone size={18} /> Call Now: {BUSINESS.phone}
                  </a>
                  <a href="#booking-form" className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/25 transition-all text-sm sm:text-base">
                    Book Online <ArrowRight size={16} />
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 sm:gap-6 mt-5 sm:mt-8 text-xs sm:text-sm text-white/90">
                  <span className="flex items-center gap-1.5">✅ Best Cab Service Kolkata</span>
                  <span className="flex items-center gap-1.5">✅ No Surge Pricing 24/7</span>
                  <span className="flex items-center gap-1.5">✅ ★4.8 Rated — 5000+ Customers</span>
                </div>
              </div>

              {/* Booking Form — Desktop */}
              <div className="hidden lg:block animate-slideUp">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA — replaces duplicate BookingForm on mobile */}
        <div className="lg:hidden relative z-20 px-3 sm:px-4 -mt-10 sm:-mt-16 pb-10" id="booking-form">
          <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-400 to-primary" />
            <p className="text-secondary font-bold text-lg mb-1 text-center">Book Your Cab Instantly</p>
            <p className="text-gray-500 text-sm mb-4 text-center">24/7 availability — confirm in under 2 minutes</p>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-xl shadow-lg text-base"
              >
                <Phone size={18} /> Call Now: {BUSINESS.phone}
              </a>
              <a
                href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to book a cab in Kolkata.')}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg text-base"
              >
                💬 WhatsApp Us — Quick Booking
              </a>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-150" />
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="bg-white px-3 text-gray-600 text-[10px] font-bold uppercase tracking-wider">Or Book Online Below</span>
                </div>
              </div>

              <BookingForm compact flat />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Users className="w-8 h-8" />, value: '5,000+', label: 'Happy Customers' },
              { icon: <Route className="w-8 h-8" />, value: '500+', label: 'Routes Covered' },
              { icon: <MapPin className="w-8 h-8" />, value: '80+', label: 'Cities Served' },
              { icon: <Award className="w-8 h-8" />, value: '4.8★', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-10 lg:py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-3">Our <span className="text-gradient">Services</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">From local rides to long-distance trips, weddings to corporate travel — we offer every type of cab & car rental service across East India.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`} className="group p-6 bg-white rounded-2xl border border-gray-100 card-hover shadow-sm">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  {iconMap[service.icon] || <Car className="w-6 h-6" />}
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                  Learn More <ChevronRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Kolkata Areas We Serve */}
      <section className="py-10 lg:py-20 bg-gray-50 lazy-section" id="kolkata-areas">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-3">Cab Service Areas in <span className="text-gradient">Kolkata</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We pick up and drop from every corner of Kolkata — from Dum Dum to Tollygunge, Salt Lake to Howrah.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {kolkataAreas.map((area) => (
              <Link key={area.name} href={`/kolkata/${area.slug}`} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
                  <MapPin size={16} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{area.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{area.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">We also cover <strong>Barasat, Dankuni, Chandannagar, Serampore, Bally, Belur, Liluah, Garden Reach, Maheshtala</strong> and all other Kolkata suburbs.</p>
          </div>
        </div>
      </section>

      {/* Kolkata Cab Fare Chart */}
      <section className="py-10 lg:py-20 bg-white" id="fare-chart">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-3">Kolkata Cab <span className="text-gradient">Fare Chart</span></h2>
            <p className="text-gray-500">Transparent pricing — no hidden charges, no surge pricing</p>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-3 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Vehicle Type</th>
                  <th className="px-3 md:px-5 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">Capacity</th>
                  <th className="px-3 md:px-5 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">Per KM</th>
                  <th className="px-3 md:px-5 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">4 Hrs</th>
                  <th className="px-3 md:px-5 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">8 Hrs</th>
                </tr>
              </thead>
              <tbody>
                {fareData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-semibold text-secondary text-sm">{row.vehicle}</td>
                    <td className="px-5 py-3.5 text-center text-gray-500 text-sm">{row.capacity}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-orange-700 text-sm">{row.perKm}</td>
                    <td className="px-5 py-3.5 text-center text-gray-600 text-sm">{row.local4hr}</td>
                    <td className="px-5 py-3.5 text-center text-gray-600 text-sm">{row.local8hr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">* Outstation fares: Toll, parking & night charges extra. Local packages include driver & fuel.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-secondary text-white relative overflow-hidden" id="how-it-works">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 10%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It <span className="text-primary">Works</span></h2>
            <p className="text-gray-300/80 max-w-2xl mx-auto">Book your Kolkata cab in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            {[
              { step: 1, title: 'Choose Your Route', desc: 'Enter your pickup location in Kolkata or nearby, your destination, travel date and time.' },
              { step: 2, title: 'Select a Vehicle', desc: 'Pick from our range of AC Sedan, SUV, Innova Crysta, or Tempo Traveller based on group size.' },
              { step: 3, title: 'Enjoy Your Ride', desc: 'Get instant confirmation on WhatsApp, flexible payment options, and a safe ride with a verified driver.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-20 h-20 mx-auto bg-gray-800 border-4 border-primary rounded-full flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300/80 text-sm px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 lg:py-20 bg-gray-50" id="popular-routes">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Popular <span className="text-gradient">Routes</span></h2>
            <p className="text-gray-500">Most booked cab routes from Kolkata and across our service areas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularRoutes.map((route) => (
              <Link key={route.slug} href={`/routes/${route.slug}`} className="route-card bg-white rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shrink-0">
                  <Route size={20} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-secondary text-sm truncate">{route.fromName} → {route.toName}</p>
                  <p className="text-xs text-gray-500">{route.distance} km • From ₹{route.priceSaloon}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0 ml-auto" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/west-bengal/kolkata" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-secondary font-semibold rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors">
              All Kolkata Routes <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-16 lg:py-20 bg-white" id="fleet">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Our <span className="text-gradient">Fleet</span></h2>
            <p className="text-gray-500">Choose from our well-maintained, AC vehicles for a comfortable journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.slice(0, 3).map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover shadow-sm">
                <div className="relative h-48 bg-gradient-to-br from-accent to-orange-50">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} - ${vehicle.models.join(', ')} for rent in Kolkata`}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary mb-1">{vehicle.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{vehicle.models.join(', ')}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">👥 {vehicle.capacity} Passengers</span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">🧳 {vehicle.luggage} Bags</span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">❄️ AC</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Starting from</span>
                      <p className="text-2xl font-bold text-primary">₹{vehicle.pricePerKm}<span className="text-sm text-gray-500 font-normal">/km</span></p>
                    </div>
                    <a href={`tel:${BUSINESS.phone}`} className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/fleet" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-colors">
              View Full Fleet <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 lg:py-20 bg-gray-50" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-3">Why Choose <span className="text-gradient">Us</span></h2>
            <p className="text-gray-500">Trusted by 5,000+ travelers across East India — here is why Kolkata Cab Service is the best choice</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl card-hover shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-primary mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-secondary mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Additional trust content */}
          <div className="mt-12 p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-secondary mb-4">Why Kolkata Cab Service is the <span className="text-gradient">Best in Kolkata</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {[
                'All drivers are police-verified and hold valid commercial driving licences',
                'Vehicles are maintained at our own garage with regular safety inspections',
                'We operate Sedan, SUV (Innova, Ertiga), Tempo Traveller, and Luxury cars',
                'Serving Kolkata since 2020 with 5,000+ completed trips',
                'Instant booking confirmation via WhatsApp within 2 minutes',
                'Available across all Kolkata areas: Salt Lake, New Town, Howrah, Park Street, Dum Dum, Ballygunge, and more',
                'One-way, round trip, local hourly, outstation — all service types available',
                'GST invoice provided for all corporate bookings',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* States Coverage */}
      <section className="py-10 lg:py-20 bg-white" id="coverage">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-3">Service <span className="text-gradient">Coverage</span></h2>
            <p className="text-gray-500">We operate across 5 states with 80+ cities — Kolkata, West Bengal & East India</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {states.map((state) => (
              <Link key={state.slug} href={`/${state.slug}`} className="group p-6 bg-white rounded-2xl border border-gray-100 card-hover shadow-sm text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <h3 className="font-bold text-secondary group-hover:text-primary transition-colors">{state.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{state.cities.length} cities</p>
                <p className="text-xs text-gray-500 mt-1">Capital: {state.capital}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 lg:py-20 bg-secondary" id="testimonials">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">Customer <span className="text-amber-400">Reviews</span></h2>
            <p className="text-gray-300/80">What 5,000+ happy customers across Kolkata say about us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                  {t.rating < 5 && Array.from({ length: 5 - t.rating }).map((_, j) => (
                    <Star key={`e-${j}`} size={16} className="text-gray-600" />
                  ))}
                </div>
                <p className="text-gray-200 text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-300 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white text-sm border border-white/20">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span>4.8/5 rating based on 2,847+ reviews</span>
            </div>
            <a
              href="https://g.page/r/CQpn2lOt9Y8QEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              ⭐ Rate Us on Google
            </a>
          </div>
        </div>
      </section>

      {/* Why Better Than Uber/Ola — E-E-A-T Comparison */}
      <section className="py-10 lg:py-20 bg-white" id="vs-comparison">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-3">Kolkata Cab Service vs <span className="text-gradient">Uber & Ola</span></h2>
            <p className="text-gray-500">Why thousands of Kolkata travelers choose us over app-based ride aggregators</p>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-3 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm font-semibold">Feature</th>
                  <th className="px-3 md:px-5 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">Kolkata Cab</th>
                  <th className="px-3 md:px-5 py-3 md:py-4 text-center text-xs md:text-sm font-semibold">Uber / Ola</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Surge Pricing', us: '❌ Never — Fixed rates 24/7', them: '✅ Yes — 2-3x during rain/festivals' },
                  { feature: 'Outstation Trips', us: '✅ 500+ routes, one-way available', them: '❌ Limited availability' },
                  { feature: 'Airport Pickup (CCU)', us: '✅ ₹1800 flat, flight tracking', them: '✅ Variable pricing' },
                  { feature: 'Cancellation Drama', us: '❌ Zero cancellations', them: '✅ Frequent driver cancellations' },
                  { feature: 'Wedding Car Rental', us: '✅ Decorated cars, red carpet', them: '❌ Not available' },
                  { feature: 'Corporate Billing (GST)', us: '✅ Monthly contracts, GST invoice', them: '❌ Limited support' },
                  { feature: 'WhatsApp Booking', us: '✅ Instant confirmation in 2 min', them: '❌ App-only booking' },
                  { feature: 'Driver Quality', us: '✅ Police-verified, 5+ yrs exp', them: '⚠️ Varies significantly' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-semibold text-secondary text-sm">{row.feature}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-green-700 font-medium">{row.us}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-gray-500">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">Join 5,000+ Kolkata travelers who switched from app-based cabs to Kolkata Cab Service for reliable, surge-free rides.</p>
          </div>
        </div>
      </section>

      {/* Instant Fare Calculator */}
      <FareCalculator />

      {/* Google Maps — Our Location */}
      <GoogleMapEmbed
        title="Our Service Area — Kolkata & East India"
        subtitle="Kolkata Cab Service covers 80+ cities across West Bengal, Jharkhand, Odisha, Bihar & Uttar Pradesh. View our headquarters and service coverage."
      />

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-primary to-amber-500" id="cta">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Kolkata Cab Now!</h2>
          <p className="text-lg text-white/90 mb-8">Call us or WhatsApp for instant booking confirmation. 24/7 available — no waiting!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              <Phone size={22} /> {BUSINESS.phone}
            </a>
            <a href={`${BUSINESS.whatsappLink}?text=${encodeURIComponent('Hi! I want to book a cab in Kolkata.')}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all">
              💬 WhatsApp Us
            </a>
          </div>
          {/* GMB Integration */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://g.page/r/CQpn2lOt9Y8QEBM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full text-sm border border-white/30 hover:bg-white/30 transition-all"
            >
              📍 Find Us on Google Maps
            </a>
            <a
              href="https://g.page/r/CQpn2lOt9Y8QEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full text-sm border border-white/30 hover:bg-white/30 transition-all"
            >
              ⭐ Write a Google Review
            </a>
          </div>
        </div>
      </section>

      {/* About Kolkata Cab Service — Helpful, User-Focused Content */}
      <section className="py-10 lg:py-20 bg-gray-50" id="about-kolkata-cab">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary mb-6">About <span className="text-gradient">Kolkata Cab Service</span></h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Since {BUSINESS.foundYear}, we have been helping travellers across Kolkata, West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh get from point A to point B safely and affordably. Whether you need a ride to the airport, a car for your family vacation, or daily transport for your business — we handle it all with clean AC vehicles and experienced drivers.
              </p>
              <p>
                Our outstation rates start at ₹12 per km for a sedan (Swift Dzire or Honda Amaze) and ₹16 per km for an SUV like the Ertiga or Innova. For larger groups, we offer Tempo Travellers at ₹22 per km. Every fare includes fuel, driver charges, and air conditioning — the only extras are toll and parking, which we communicate before you confirm your booking.
              </p>
              <p>
                What sets us apart from app-based ride services is consistency. Our rates stay the same whether it&apos;s a rainy evening, a Durga Puja night, or a regular Tuesday morning. There&apos;s no surge pricing, no dynamic fare multiplier — just a fixed, transparent rate that you agree to before you ride. That predictability is why over 5,000 customers trust us with their travel plans.
              </p>
              <p>
                We operate across all areas of Kolkata including Salt Lake, New Town, Howrah, Park Street, Dum Dum, Ballygunge, and Behala. Beyond Kolkata, our hubs in Ranchi, Bhubaneswar, Patna, and Varanasi cover Jharkhand, Odisha, Bihar, and Uttar Pradesh completely. With 500+ routes connecting 80+ cities, you can book any intercity journey through a single phone call.
              </p>
              <p>
                Every driver in our fleet is police-verified with a minimum of five years of professional driving experience. All vehicles are GPS-tracked so you can share your live location with family. We&apos;re available round the clock — whether you need an early morning airport pickup at 3 AM or a late-night ride home after a function.
              </p>
              <p>
                Booking takes under two minutes. Call us at <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a>, send a WhatsApp message, or fill out the booking form above. You&apos;ll get instant confirmation with your driver&apos;s name, phone number, and vehicle details. No app download needed.
              </p>
            </div>

            {/* Airport Transfer Quick Guide */}
            <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-4">Kolkata Airport Transfers — Fixed Rates, No Surge</h3>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Netaji Subhash Chandra Bose International Airport (CCU) in Dum Dum is a 30-45 minute drive from most parts of the city. Our airport transfer service includes real-time flight tracking — your driver will be waiting at the arrival gate with a name board, even if your flight is delayed.
                </p>
                <p>
                  <strong>Sample fares:</strong> Airport to Salt Lake — ₹1,200 (Sedan), Airport to Howrah — ₹800 (Sedan), Airport to Park Street — ₹700 (Sedan). SUV rates are approximately 40% higher. These are fixed prices with no surge pricing, even during peak travel hours or festivals.
                </p>
              </div>
            </div>

            {/* Coverage Areas */}
            <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-secondary mb-4">Where We Operate</h3>
              <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                <p>
                  We pick up and drop at all major Kolkata locations: railway stations (Howrah, Sealdah), bus terminals (Esplanade, Karunamoyee), hospitals (SSKM, AMRI, Apollo, Fortis), IT hubs (Sector V Salt Lake, DLF New Town, TCS Gitobitan), and tourist landmarks (Victoria Memorial, Dakshineswar, Belur Math, Eco Park, Science City).
                </p>
                <p>
                  For corporate clients, we offer monthly contracts with dedicated vehicles, fixed schedules, and GST invoices. Many IT companies in Salt Lake and New Town rely on our fleet for daily employee transportation.
                </p>
              </div>
            </div>

            {/* NAP — Name, Address, Phone for local SEO consistency */}
            <address className="mt-8 p-6 bg-accent rounded-2xl not-italic">
              <h3 className="text-lg font-bold text-secondary mb-3">Contact Kolkata Cab Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold">Kolkata Cab Service</p>
                  <p>Park Street Area, Kolkata</p>
                  <p>West Bengal, India - 700001</p>
                </div>
                <div>
                  <p><strong>Phone:</strong> <a href={`tel:${BUSINESS.phone}`} className="text-amber-900 font-semibold hover:underline">{BUSINESS.phone}</a></p>
                  <p><strong>Email:</strong> <a href={`mailto:${BUSINESS.email}`} className="text-amber-900 hover:underline">{BUSINESS.email}</a></p>
                  <p><strong>Hours:</strong> 24/7, 365 Days</p>
                  <p className="mt-2"><a href="https://g.page/r/CQpn2lOt9Y8QEBM" target="_blank" rel="noopener noreferrer" className="text-amber-900 font-semibold hover:underline">View on Google Maps</a></p>
                </div>
              </div>
            </address>
          </div>
        </div>
      </section>

      {/* Seasonal / Festival Cab Service — targets high-volume seasonal keywords */}
      <section className="py-16 lg:py-20 bg-white" id="seasonal-offers">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Festival & Seasonal <span className="text-gradient">Cab Service</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Need a cab during Durga Puja, Diwali, Christmas, or summer holidays? We operate at fixed rates with no surge pricing — even during peak festival demand.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: '🪔',
                title: 'Durga Puja Cab',
                desc: 'Pandal hopping, airport transfers, outstation travel during Durga Puja. Dedicated cabs for all 5 days.',
                tags: ['Pandal Hopping', 'Airport', 'Outstation'],
                period: 'Sep – Oct',
              },
              {
                emoji: '🎆',
                title: 'Diwali & Kali Puja Cab',
                desc: 'Safe late-night cab rides during Diwali and Kali Puja celebrations. Family travel, party drops.',
                tags: ['Night Rides', 'Family Travel', 'Safe'],
                period: 'Oct – Nov',
              },
              {
                emoji: '🎄',
                title: 'Christmas & New Year Cab',
                desc: 'Airport transfers, party transportation, outstation trips during Christmas and New Year season.',
                tags: ['Party Drops', 'Airport', 'Trips'],
                period: 'Dec – Jan',
              },
              {
                emoji: '☀️',
                title: 'Summer Holiday Cab',
                desc: 'Special packages to Darjeeling, Puri, Digha, Sundarbans with AC cab. Beat the heat with hill station trips.',
                tags: ['Darjeeling', 'Puri', 'Digha'],
                period: 'Apr – Jun',
              },
            ].map((offer, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{offer.emoji}</div>
                <h3 className="font-bold text-secondary text-lg mb-2">{offer.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{offer.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {offer.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">{tag}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-500">📅 {offer.period}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-accent rounded-2xl text-center">
            <p className="text-secondary font-semibold mb-2">🎉 No Surge Pricing During Festivals — Guaranteed!</p>
            <p className="text-gray-600 text-sm">Unlike Ola and Uber, {BUSINESS.name} charges the same fixed rates during Durga Puja, Diwali, Christmas, and all other festivals. Call <a href={`tel:${BUSINESS.phone}`} className="text-amber-900 font-bold hover:underline">{BUSINESS.phone}</a> to book.</p>
          </div>
        </div>
      </section>

      {/* Popular Searches — SEO Internal Links */}
      <section className="py-12 bg-white" id="popular-searches">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-secondary mb-6">Popular Searches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-bold text-secondary mb-3">Cab Service by City</h3>
              <div className="space-y-0.5">
                {[
                  { name: 'Kolkata', href: '/west-bengal/kolkata' },
                  { name: 'Howrah', href: '/west-bengal/howrah' },
                  { name: 'Salt Lake', href: '/kolkata/salt-lake' },
                  { name: 'Siliguri', href: '/west-bengal/siliguri' },
                  { name: 'Darjeeling', href: '/west-bengal/darjeeling' },
                  { name: 'Durgapur', href: '/west-bengal/durgapur' },
                  { name: 'Asansol', href: '/west-bengal/asansol' },
                  { name: 'Ranchi', href: '/jharkhand/ranchi' },
                  { name: 'Jamshedpur', href: '/jharkhand/jamshedpur' },
                  { name: 'Bhubaneswar', href: '/odisha/bhubaneswar' },
                ].map(city => (
                  <Link key={city.name} href={city.href} className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">
                    Cab service in {city.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary mb-3">Popular Routes</h3>
              <div className="space-y-0.5">
                {popularRoutes.slice(0, 10).map(r => (
                  <Link key={r.slug} href={`/routes/${r.slug}`} className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">
                    {r.fromName} to {r.toName} Cab
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary mb-3">Services</h3>
              <div className="space-y-0.5">
                {[
                  { name: 'Local Taxi Kolkata', href: '/services/local-taxi' },
                  { name: 'Outstation Cab Kolkata', href: '/services/outstation' },
                  { name: 'One Way Taxi Kolkata', href: '/services/one-way' },
                  { name: 'Airport Cab Kolkata', href: '/services/airport-transfer' },
                  { name: 'Wedding Car Kolkata', href: '/services/wedding-car-rental' },
                  { name: 'Corporate Car Rental', href: '/services/corporate-car-rental' },
                  { name: 'Round Trip Cab', href: '/services/round-trip' },
                  { name: 'Tour Packages', href: '/tours' },
                  { name: 'Kolkata Cab Fare Chart', href: '/fare-chart' },
                ].map(s => (
                  <Link key={s.name} href={s.href} className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary mb-3">Useful Links</h3>
              <div className="space-y-0.5">
                <Link href="/fare-chart" className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">Kolkata Cab Fare Chart</Link>
                <Link href="/faq" className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">Frequently Asked Questions</Link>
                <Link href="/blog" className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">Travel Blog &amp; Guides</Link>
                <Link href="/fleet" className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">Our Fleet</Link>
                <Link href="/tours" className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">Tour Packages</Link>
                <Link href="/contact" className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">Contact Us</Link>
                <Link href="/about" className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">About Us</Link>
                <Link href="/kolkata-cab-vs-ola-uber" className="block text-sm text-primary font-semibold hover:text-primary/80 transition-colors py-1">🆚 vs Ola / Uber</Link>
              </div>
              <h3 className="text-sm font-bold text-secondary mt-4 mb-3">Kolkata Areas</h3>
              <div className="space-y-0.5">
                {[
                  { name: 'Salt Lake Cab', href: '/kolkata/salt-lake' },
                  { name: 'New Town Cab', href: '/kolkata/new-town' },
                  { name: 'Howrah Cab', href: '/kolkata/howrah' },
                  { name: 'Park Street Cab', href: '/kolkata/park-street' },
                  { name: 'Dum Dum / Airport Cab', href: '/kolkata/dum-dum' },
                  { name: 'Ballygunge Cab', href: '/kolkata/ballygunge' },
                  { name: 'Gariahat Cab', href: '/kolkata/gariahat' },
                  { name: 'Jadavpur Cab', href: '/kolkata/jadavpur' },
                  { name: 'Tollygunge Cab', href: '/kolkata/tollygunge' },
                  { name: 'Esplanade Cab', href: '/kolkata/esplanade' },
                  { name: 'Barasat Cab', href: '/kolkata/barasat' },
                  { name: 'Behala Cab', href: '/kolkata/behala' },
                ].map(a => (
                  <Link key={a.name} href={a.href} className="block text-sm text-gray-600 hover:text-primary transition-colors py-1">{a.name}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FAQSection faqs={faqs} title="Frequently Asked Questions — Kolkata Cab Service" />
        </div>
      </section>
    </>
  );
}
