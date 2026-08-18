import { BUSINESS, type City, type Route, getStateFares, getStateDisplayRate } from './data';

// ═══════════════════════════════════════════════════════════════
// CITY CONTENT GENERATION ENGINE
// Generates unique, keyword-rich content for every city page
// ═══════════════════════════════════════════════════════════════

interface CityContentInput {
  city: City;
  stateName: string;
  stateSlug: string;
  routesFrom: Route[];
  routesTo: Route[];
}

// ─── Kolkata-specific areas for neighbourhood coverage ───
const KOLKATA_AREAS = [
  { name: 'Salt Lake (Bidhannagar)', areas: 'Sector I–V, City Centre, Karunamoyee' },
  { name: 'New Town (Rajarhat)', areas: 'Action Area I–III, Eco Park, Biswa Bangla Gate' },
  { name: 'Howrah', areas: 'Howrah Station, Shibpur, Belur, Bally, Liluah' },
  { name: 'Dum Dum', areas: 'Airport Area, Nagerbazar, Dum Dum Cantonment' },
  { name: 'Park Street', areas: 'Park Circus, Free School Street, Mullick Bazar' },
  { name: 'Ballygunge', areas: 'Gariahat, Golpark, Dhakuria, Lake Market' },
  { name: 'Esplanade / BBD Bagh', areas: 'Dalhousie, Writers Building, GPO' },
  { name: 'Tollygunge', areas: 'Rashbehari, Bhawanipur, Hazra, Kalighat' },
  { name: 'Barasat', areas: 'Madhyamgram, Hridaypur, Barasat Court' },
  { name: 'Behala', areas: 'Joka, Thakurpukur, Sakherbazar, Parnashree' },
  { name: 'Ultadanga / Sealdah', areas: 'Maniktala, Phoolbagan, CIT Road' },
  { name: 'Jadavpur / Garia', areas: 'Jadavpur University, Garia Station, Narendrapur' },
  { name: 'Lake Town / Bangur', areas: 'Kankurgachi, Baguiati, VIP Road' },
  { name: 'Barrackpore', areas: 'Titagarh, Belghoria, Kamarhati, Sodepur' },
  { name: 'South Kolkata', areas: 'Alipore, New Alipore, Chetla, Ekbalpur' },
];

function getCityHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    // Weighted hash for better distribution across 6 templates
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// ─── City-specific best time + unique travel notes ───
// These create genuinely differentiated content that can't be templated away
const CITY_TRAVEL_NOTES: Record<string, { bestTime: string; specialty: string; travelNote: string }> = {
  'darjeeling':   { bestTime: 'March–May and September–November', specialty: 'Darjeeling tea, Tiger Hill sunrise, Toy Train heritage ride', travelNote: 'Night drives to Tiger Hill for sunrise are a popular request — our drivers are experienced with this high-altitude route.' },
  'digha':        { bestTime: 'October–March (avoid monsoon waves)', specialty: 'Sea beach, seafood, Digha Science Centre', travelNote: 'Weekend and Puja holiday traffic to Digha is heavy — book 2 days in advance for guaranteed availability.' },
  'puri':         { bestTime: 'October–February, avoid Rath Yatra rush', specialty: 'Jagannath Temple darshan, Puri beach, Konark day trip', travelNote: 'Rath Yatra month sees 10× cab demand — our Bhubaneswar–Puri route cabs are pre-booked 3 weeks ahead.' },
  'mandarmani':   { bestTime: 'October–March', specialty: 'Longest driveable beach, red crabs, sunsets', travelNote: 'Mandarmani is just 4 hours from Kolkata via NH-116 — a popular weekend escape, especially for young travelers.' },
  'gangasagar':   { bestTime: 'December–January for Makar Sankranti Mela', specialty: 'Kapil Muni Ashram, Sagar Island', travelNote: 'Makar Sankranti sees millions of pilgrims — pre-book your cab to Gangasagar at least 2 weeks in advance during that period.' },
  'mayapur':      { bestTime: 'October–March, Gaura Purnima in March is special', specialty: 'ISKCON Chandrodaya Mandir, Triveni Ghat', travelNote: 'Mayapur is just 3.5 hours from Kolkata via NH-12 — ideal for a one-day spiritual trip.' },
  'bishnupur':    { bestTime: 'October\u2013February', specialty: 'Terracotta temples, Bishnupur Gharana music, Dashavatara Rath', travelNote: 'Bishnupur terracotta temples are UNESCO tentative list sites \u2014 our drivers know all temple locations for efficient sightseeing.' },
  'konark':       { bestTime: 'November–February, Konark Dance Festival in November', specialty: 'Sun Temple (UNESCO World Heritage), Chandrabhaga beach', travelNote: 'Konark is 65km from Bhubaneswar and 36km from Puri — easily combined as a triangle day trip with our cab service.' },
  'deoghar':      { bestTime: 'Shravan month (July–August) and Shivratri', specialty: 'Baidyanath Jyotirlinga, 22 temples of Deoghar', travelNote: 'Shravan month sees massive devotee traffic to Baidyanath Dham — book Ranchi–Deoghar cabs 3–4 weeks ahead during this period.' },
  'hazaribagh':   { bestTime: 'October–March', specialty: 'Hazaribagh Wildlife Sanctuary, Rajrappa Temple, Canary Hill', travelNote: 'Hazaribagh offers a scenic 2-hour drive from Ranchi through forested hills — popular for weekend getaways.' },
  'netarhat':     { bestTime: 'October–February for sunrise/sunset views', specialty: 'Sunrise Point, Lodh Falls, Netarhat forests', travelNote: 'Netarhat is 154km from Ranchi via a scenic ghat road — our drivers know the safest route for this mountain road.' },
  'bodh-gaya':    { bestTime: 'October–March', specialty: 'Mahabodhi Temple (UNESCO), Bodhi Tree, Thai Monastery', travelNote: 'Bodh Gaya sees Buddhist pilgrims from 80+ countries — our drivers are familiar with all monasteries and pilgrimage sites.' },
  'varanasi':     { bestTime: 'October–March, Ganga Aarti is best at sunset', specialty: 'Kashi Vishwanath Temple, Ganga Aarti, Sarnath', travelNote: 'Varanasi is 678km from Kolkata — we recommend our Innova Crysta or SUV for this long-distance pilgrimage route.' },
  'siliguri':     { bestTime: 'October–April (avoid heavy monsoon)', specialty: 'Gateway to Northeast India, Hong Kong Market, NJP Railway', travelNote: 'Siliguri is the transit hub for Darjeeling, Gangtok, Sikkim and Bhutan — our cabs connect you to all these hill destinations.' },
  'kharagpur':    { bestTime: 'October–March', specialty: 'IIT Kharagpur campus, Hijli Detention Camp, railway junction', travelNote: 'Kharagpur is 2.5 hours from Kolkata via NH-16 — popular for IIT campus visits and Odisha road trips via Bhubaneswar.' },
  'durgapur':     { bestTime: 'October–March', specialty: 'Durgapur Steel Plant, Durgapur Barrage, Deul Park', travelNote: 'Durgapur is one of the largest planned industrial cities in India — our corporate cab service is heavily used here.' },
  'bolpur-shantiniketan': { bestTime: 'Basanta Utsav (Holi, February–March), Poush Mela in December', specialty: 'Visva-Bharati University, Rabindranath Tagore Museum, Khoai area', travelNote: 'Poush Mela in December draws thousands of visitors — book your Kolkata–Shantiniketan cab 2 weeks in advance for that period.' },
  'haldia':       { bestTime: 'October–February', specialty: 'Haldia Port, Petrochemical Complex, Rasikpur beach', travelNote: 'Haldia is the major port city of West Bengal — our corporate car service is popular with port authority staff and executives.' },
  'cuttack':      { bestTime: 'October–March', specialty: 'Barabati Fort, Cuttack Chandi Temple, Silver Filigree Bazaar', travelNote: 'Cuttack is just 30km from Bhubaneswar — easily combined in a same-day trip with our Bhubaneswar cab service.' },
  'rourkela':     { bestTime: 'October–March', specialty: 'Steel plant township, Vedvyas Temple, Biju Patnaik Park', travelNote: 'Rourkela is 380km from Bhubaneswar via NH-55 — our Innova Crysta is the preferred vehicle for this route.' },
  'asansol':      { bestTime: 'October–March', specialty: 'Asansol coal belt, Maithon Dam, Panchet Dam', travelNote: 'Maithon Dam is a popular half-day trip from Asansol — our local packages work well for dam visits and back.' },
};

// ─── Generate a city-specific unique introductory sentence ───
function getUniqueCityIntro(city: City, stateName: string): string {
  const note = CITY_TRAVEL_NOTES[city.slug];
  if (note) {
    return `Planning a trip to ${city.name}? Here's what you should know: ${note.travelNote}`;
  }
  if (city.landmarks && city.landmarks.length >= 3) {
    return `${city.name} is home to notable landmarks like ${city.landmarks.slice(0, 3).join(', ')} — our cab service gives you direct access to each of these.`;
  }
  return `${city.name} is an important city in ${stateName} with growing cab travel demand for business and personal trips.`;
}

// ─── Get best time to visit for tourism cities ───
function getBestTimeToVisit(citySlug: string): string | null {
  return CITY_TRAVEL_NOTES[citySlug]?.bestTime ?? null;
}

// ─── Get local specialty description ───
function getLocalSpecialty(citySlug: string): string | null {
  return CITY_TRAVEL_NOTES[citySlug]?.specialty ?? null;
}

// ─── Generate detailed "About Cab Service" content ───
function getAboutCityContent(input: CityContentInput): string[] {
  const { city, stateName, routesFrom } = input;
  const isKolkata = city.slug === 'kolkata';
  const paragraphs: string[] = [];
  const stateFares = getStateFares(input.stateSlug || 'west-bengal');
  const displayRate = getStateDisplayRate(input.stateSlug || 'west-bengal');
  const hash = getCityHash(city.slug);
  const templateIndex = hash % 2;

  // Paragraph 1: Main SEO paragraph — KEYWORD NUCLEAR & highly unique
  if (isKolkata) {
    paragraphs.push(
      `Looking for the best cab service in Kolkata? ${BUSINESS.name} is Kolkata’s most trusted and affordable taxi service in Kolkata, providing reliable cab booking in Kolkata and car rental across the entire Kolkata metropolitan area. We provide Kolkata cab service in all areas including Salt Lake, New Town, Howrah, Park Street, Dum Dum, Ballygunge, Tollygunge, Barasat, Behala, Gariahat, Jadavpur, Sealdah, Esplanade, and all other Kolkata localities. Whether you need a local taxi in Kolkata for a few hours, an outstation cab from Kolkata to Darjeeling or Puri, a one-way cab from Kolkata, a Kolkata airport cab for CCU airport transfer at ₹1200, a decorated wedding car in Kolkata, or a corporate car rental in Kolkata — we are your one-stop solution. Kolkata cab fare starts from just ${displayRate}. Taxi near me Kolkata. Call ${BUSINESS.phone} for instant booking 24/7.`
    );
  } else if (city.type === 'hub') {
    const altText = city.alternateNames && city.alternateNames.length > 0 ? ` Also known as ${city.alternateNames.join(', ')}.` : '';
    // 6 unique templates for hub cities — reduces duplicate rate from 50% to ~17%
    const hubTemplates = [
      `Book the leading cab service in ${city.name}, ${stateName} — ${BUSINESS.name} provides premier taxi service in ${city.name} starting from just ${displayRate}.${altText} As a major transportation and business hub, we specialize in daily outstation cabs, corporate rentals with GST invoicing, and airport drops. If you are searching for a taxi in ${city.name}, outstation cab from ${city.name}, or cab booking near me in ${city.name}, our professional services with verified drivers are available 24/7. Call ${BUSINESS.phone} for instant bookings.`,
      `Need a reliable car hire in the hub city of ${city.name}, ${stateName}? At ${BUSINESS.name}, we offer the best taxi booking in ${city.name} from ${displayRate}.${altText} Our hub network connects ${city.name} to all surrounding cities with flat rates. Whether you need local hourly packages or long-distance one-way trips, we guarantee premium comfort with no surge pricing. Contact us at ${BUSINESS.phone} to reserve your sedan or SUV.`,
      `${city.name}, ${stateName} is one of the most important cab booking destinations in Eastern India — and ${BUSINESS.name} is at the forefront of this demand.${altText} From ${displayRate} for outstation routes, we provide verified-driver cabs across all localities of ${city.name} 24 hours a day. Whether it's a business commute, intercity trip, or airport drop, our flat-rate fares with zero surge pricing make us the first choice in ${city.name}. Dial ${BUSINESS.phone} anytime.`,
      `Searching for the most affordable taxi in ${city.name}, ${stateName}? ${BUSINESS.name} delivers reliable, AC cab service from ${displayRate} — no surge pricing, no hidden fees.${altText} We serve all major localities, railway stations, and airports in and around ${city.name}. Our corporate clients get GST-compliant invoices and dedicated account support. Individual travelers enjoy instant confirmations on WhatsApp within 2 minutes. Call ${BUSINESS.phone}.`,
      `${BUSINESS.name} has been the go-to cab service in ${city.name}, ${stateName} for outstation and local travel since ${BUSINESS.foundYear}.${altText} Starting at ${displayRate}, our fleet of Sedans, Ertiga SUVs, and Innova Crystas connect you to over 100 cities from ${city.name}. Every booking comes with a verified driver, real-time tracking, and a transparent fare breakdown. No surprise charges. Book now at ${BUSINESS.phone}.`,
      `When it comes to trusted cab booking in ${city.name}, ${stateName}, ${BUSINESS.name} stands apart with our commitment to fixed-rate fares from ${displayRate}.${altText} Our drivers hold commercial licenses and are familiar with both the city's internal routes and the long-distance highways heading out of ${city.name}. We take advance bookings up to 7 days in advance and also handle same-hour urgent requests. Reach us at ${BUSINESS.phone}.`,
    ];
    paragraphs.push(hubTemplates[hash % 6]);
  } else if (city.tourist) {
    const altText = city.alternateNames && city.alternateNames.length > 0 ? ` Also known as ${city.alternateNames.join(', ')}.` : '';
    const specialty = getLocalSpecialty(city.slug);
    const bestTime = getBestTimeToVisit(city.slug);
    // 6 unique templates for tourist cities
    const touristTemplates = [
      `Explore the scenic beauty and attractions of ${city.name} with ${BUSINESS.name}'s dedicated tourist taxi service in ${city.name} starting at just ${displayRate}.${altText} We offer custom travel packages, temple darshan visits, and local sightseeing tours in ${city.name}. If you are looking for local cab service in ${city.name}, outstation car rental, or a reliable taxi near me in ${city.name}, we have clean, sanitised AC cars ready. Book instantly by calling ${BUSINESS.phone}.`,
      `Make your trip to ${city.name}, ${stateName} memorable with our highly-rated tourist cab booking in ${city.name}.${altText} Starting from just ${displayRate}, we provide comfortable sightseeing rides, railway station pickups, and outstation tours. Our drivers are local tour guides who know the best routes and tourist spots. For safe and budget-friendly sightseeing in ${city.name}, call ${BUSINESS.phone} or book via WhatsApp.`,
      `${city.name} in ${stateName} is famous for ${specialty || city.landmarks?.slice(0, 2).join(' and ') || 'its unique attractions'} — and the best way to explore it is with a private cab.${altText} ${BUSINESS.name} offers dedicated sightseeing packages starting from ${displayRate}. ${bestTime ? `Best time to visit ${city.name}: ${bestTime}.` : ''} Our air-conditioned vehicles are ready for day trips and multi-day outstation tours from ${city.name}. Call ${BUSINESS.phone}.`,
      `Planning a visit to ${city.name}, ${stateName}? Our ${city.name} cab service ensures you reach every attraction comfortably, starting at just ${displayRate}.${altText} ${bestTime ? `The best time to visit ${city.name} is ${bestTime}.` : ''} We specialize in full-day sightseeing packages, temple circuit visits, and outstation tours from ${city.name} to nearby cities. All cars are AC and driven by experienced local drivers. Contact ${BUSINESS.phone}.`,
      `The ideal way to explore ${city.name}'s most iconic sites — ${specialty || city.landmarks?.join(', ') || 'its famous landmarks'} — is with a private cab from ${BUSINESS.name}.${altText} We offer tourist-friendly packages from ${displayRate} including driver-guided sightseeing. ${bestTime ? `The ideal visiting period is ${bestTime}.` : ''} Call ${BUSINESS.phone} or book via WhatsApp for instant confirmation.`,
      `${BUSINESS.name} offers premium taxi service in ${city.name}, ${stateName} to ensure your travel experience is seamless and enjoyable.${altText} Whether you're visiting ${city.name} for tourism, pilgrimage, or leisure, our reliable cab service starts from ${displayRate}. ${specialty ? `The city is known for its ${specialty}.` : ''} We provide pickups from railway stations, bus stands, and hotels across ${city.name}. Dial ${BUSINESS.phone} for availability.`,
    ];
    paragraphs.push(touristTemplates[hash % 6]);
  } else {
    const altText = city.alternateNames && city.alternateNames.length > 0 ? ` Also known as ${city.alternateNames.join(', ')}.` : '';
    // 6 unique templates for regular cities
    const regularTemplates = [
      `Enjoy safe and reliable commuting with ${BUSINESS.name}, the top cab service in ${city.name}, ${stateName}.${altText} Starting at a flat rate of ${displayRate}, we provide city-wide local drops, outstation cabs, and one-way drop taxis. If you need an AC cab in ${city.name}, a taxi service near me, or quick car rental in ${city.name}, we offer instant bookings with verified drivers. Call ${BUSINESS.phone} to secure your ride.`,
      `For the best taxi booking experience in ${city.name}, trust ${BUSINESS.name} for flat-rate fares starting from ${displayRate}.${altText} We offer prompt doorstep pickups for local, outstation, airport, and station transfers across ${city.name}. Our commercial fleet is clean, air-conditioned, and driven by experienced local chauffeurs. Call us at ${BUSINESS.phone} to book your ride instantly with no advance payment.`,
      `${BUSINESS.name} provides affordable and dependable cab service in ${city.name}, ${stateName} from just ${displayRate}.${altText} Our vehicles operate round the clock — covering all localities in ${city.name} for local errands, outstation one-way drops, and highway trips. Verified drivers. No surge pricing. Instant WhatsApp confirmations. Call ${BUSINESS.phone}.`,
      `Trust ${BUSINESS.name} for your next cab booking in ${city.name}, ${stateName}.${altText} We connect you to all major cities across Eastern India at flat rates starting from ${displayRate}. Our fleet includes compact Sedans for solo travelers, SUVs for families, and Tempo Travellers for groups. 24/7 availability with no extra fees for night trips. Book at ${BUSINESS.phone}.`,
      `Looking for a cab in ${city.name}, ${stateName}? ${BUSINESS.name} offers unmatched outstation and local taxi service from ${displayRate}.${altText} We serve everyone — from daily commuters to long-distance travelers, airport and railway transfers, and holiday tour groups. All our drivers in ${city.name} are background-verified and trained for long drives. WhatsApp or call ${BUSINESS.phone} anytime.`,
      `${city.name} travelers choose ${BUSINESS.name} for our fixed fares (from ${displayRate}), zero surge pricing, and 24/7 cab availability.${altText} Whether you're booking a last-minute taxi in ${city.name} or planning a well in advance outstation trip, we deliver reliability and comfort. Clean AC vehicles, experienced drivers, and instant booking confirmation via WhatsApp. Call ${BUSINESS.phone}.`,
    ];
    paragraphs.push(regularTemplates[hash % 6]);
  }

  // Paragraph 2: City description and why it matters
  paragraphs.push(
    `${city.description} ${city.tourist ? `As a popular destination, ${city.name} attracts visitors throughout the year, and our cab service ensures comfortable, hassle-free travel to and from ${city.name}.` : `As an important city in ${stateName}, ${city.name} has significant business and travel demand, and our cab service caters to both business and personal travel needs.`}`
  );

  // Paragraph 3: Services overview
  if (templateIndex === 0) {
    paragraphs.push(
      `We offer a comprehensive range of travel options in ${city.name}: (1) **Local Taxi Service** for hourly running within the city (packages like 4h/40km or 8h/80km starting at ₹${stateFares.localPackages[0]?.sedan || '1,800'}), (2) **Outstation Cabs** for round trips and intercity travel${routesFrom.length > 0 ? ` (popular routes include drop-offs to ${routesFrom.slice(0, 3).map(r => r.toName).join(', ')})` : ''}, (3) **One-Way Drop Taxi** where you pay only one side, (4) **Airport & Station Transfers** with flight tracking, and (5) **Premium Wedding Car Rentals** featuring decorated Innovas and luxury sedans.`
    );
  } else {
    paragraphs.push(
      `Choose from our specialized travel services in ${city.name} designed to fit your budget: **Local Hourly Car Hire** (starts at ₹${stateFares.localPackages[0]?.sedan || '1,800'} for city running), **One-Way Outstation Taxi** (no return charge on intercity travel${routesFrom.length > 0 ? ` to cities like ${routesFrom.slice(0, 3).map(r => r.toName).join(', ')}` : ''}), **Round Trip Outstation Cab** (multi-day packages), **Railway/Airport Transfers** (CCU and local hubs), and **Luxury Wedding Chauffeur Service** for special events.`
    );
  }

  // Paragraph 3.5: Unique city intro / travel note
  const uniqueIntro = getUniqueCityIntro(city, stateName);
  paragraphs.push(uniqueIntro);

  // Paragraph 4: Transport infrastructure
  const transportPoints: string[] = [];
  if (city.airport) transportPoints.push(`${city.airport} — we provide 24/7 airport pickup and drop with flight tracking, meet & greet, and no extra charge for flight delays`);
  if (city.railway) transportPoints.push(`${city.railway} — our drivers are available for station pickup and drop at all hours`);
  if (transportPoints.length > 0) {
    // 2 variations for transport paragraph
    if (hash % 2 === 0) {
      paragraphs.push(
        `${city.name} is well-connected by major transport infrastructure. ${transportPoints.join('. ')}. ${BUSINESS.name} provides seamless last-mile connectivity from these transport hubs to any destination within ${city.name} or outstation routes.`
      );
    } else {
      paragraphs.push(
        `Getting to and from ${city.name}'s key transport hubs is simple with ${BUSINESS.name}. ${transportPoints.join('. ')}. Whether you need an early morning airport cab or a late-night railway station pickup in ${city.name}, our 24/7 fleet is always ready with no extra surcharge for odd hours.`
      );
    }
  }

  // Paragraph 5: Landmarks and attractions coverage
  if (city.landmarks && city.landmarks.length > 0) {
    paragraphs.push(
      `Our cab service in ${city.name} covers all major landmarks and attractions including ${city.landmarks.join(', ')}. Whether you're visiting for tourism, pilgrimage, business, or family functions, our experienced drivers know every corner of ${city.name} and can suggest the best routes and itineraries. We also offer customized sightseeing packages for tourists visiting ${city.name} for the first time.`
    );
  }

  // Paragraph 6: Routes from this city
  if (routesFrom.length > 0) {
    const topRoutes = routesFrom.slice(0, 8);
    const routeList = topRoutes.map(r => `${city.name} to ${r.toName} (${r.distance} km, from ₹${r.priceSaloon})`).join(', ');
    paragraphs.push(
      `Popular outstation cab routes from ${city.name} include: ${routeList}. All outstation fares include fuel, driver, and AC. Toll and parking charges are communicated upfront with no hidden costs. Book your outstation cab from ${city.name} by calling ${BUSINESS.phone} or WhatsApp.`
    );
  }

  // Paragraph 7: Booking and contact — 4 variations
  const bookingTemplates = [
    `Booking a taxi in ${city.name} is quick and hassle-free with ${BUSINESS.name}. Just call ${BUSINESS.phone} or send a message on WhatsApp. We confirm bookings in under 2 minutes, sending driver details and vehicle numbers directly to your phone. We accept Cash, UPI (GPay, PhonePe, Paytm), and Card payments. Operating 24/7, 365 days a year, we ensure reliable travel even during peak holidays and night hours. Book your cab in ${city.name} today.`,
    `At ${BUSINESS.name}, we provide round-the-clock cab booking across all localities of ${city.name}. To book, dial ${BUSINESS.phone} or fill the online reservation form on our site. We guarantee transparent billing with no hidden fees and a free cancellation policy. You can pay via UPI, cards, or directly in cash to the driver after your trip. Trust us for safe, comfortable, and punctual taxi services in ${city.name}.`,
    `Reserve your cab in ${city.name} with ${BUSINESS.name} in just 2 minutes — call or WhatsApp ${BUSINESS.phone}. Our booking coordinators are available 24/7 to find you the right vehicle at the right time. All payments are flexible: cash, UPI (Google Pay, PhonePe, Paytm), or debit/credit card. Advance bookings are accepted up to 7 days ahead with free modification before the trip.`,
    `Need a cab in ${city.name} right now or for a planned trip? Contact ${BUSINESS.name} at ${BUSINESS.phone}. We handle urgent same-hour bookings as well as advance scheduled trips. After confirmation, you'll receive the driver's name, vehicle number, and contact number on WhatsApp. We operate all days including national holidays and festival seasons — no extra charges.`,
  ];
  paragraphs.push(bookingTemplates[hash % 4]);

  return paragraphs;
}

// ─── Get neighbourhood areas to display ───
export function getCityAreas(city: City): { name: string; areas: string }[] {
  if (city.slug === 'kolkata') return KOLKATA_AREAS;

  // Generate generic areas from landmarks for non-Kolkata cities
  const areas: { name: string; areas: string }[] = [];
  if (city.railway) areas.push({ name: `${city.railway} Area`, areas: 'Station Area, Bus Stand, Auto Stand' });
  if (city.airport) areas.push({ name: `${city.airport} Area`, areas: 'Airport Road, Terminal Area' });
  if (city.landmarks) {
    city.landmarks.forEach(landmark => {
      areas.push({ name: `${landmark} Area`, areas: `${landmark}, nearby localities` });
    });
  }
  return areas.slice(0, 8);
}

// ─── Extended FAQs for city pages ───
export function getCityExtendedFAQs(input: CityContentInput): { question: string; answer: string }[] {
  const { city, stateName, routesFrom, stateSlug } = input;
  const stateFares = getStateFares(stateSlug || 'west-bengal');
  const faqs: { question: string; answer: string }[] = [];

  faqs.push(
    {
      question: `What is the best cab service in ${city.name}?`,
      answer: `${BUSINESS.name} is rated the best cab service in ${city.name}, ${stateName}. We provide local taxi, outstation cab, one-way taxi, round trip, airport/railway transfer, wedding car rental, and corporate car rental. Our vehicles are AC, clean, and well-maintained, driven by experienced, police-verified drivers. We operate 24/7 with no surge pricing. Call ${BUSINESS.phone} for instant booking.`,
    },
    {
      question: `What is the cab fare per km in ${city.name}?`,
      answer: `Cab fare in ${city.name} starts at ₹${stateFares.sedan.pricePerKm}/km for Sedan (Swift Dzire, Honda Amaze), ₹${stateFares.suv.pricePerKm}/km for SUV (Ertiga, Innova), ₹${stateFares.crysta?.pricePerKm || stateFares.innova.pricePerKm}/km for Innova Crysta, and ₹${stateFares.tempo.pricePerKm}/km for Tempo Traveller. Local packages: ${stateFares.localPackages[0]?.name} from ₹${stateFares.localPackages[0]?.sedan} (Sedan). All fares include fuel and driver.`,
    },
    {
      question: `How can I book a taxi in ${city.name}?`,
      answer: `You can book a taxi in ${city.name} by: (1) Calling ${BUSINESS.phone}, (2) Sending a WhatsApp message, (3) Filling out the booking form on our website. Share your pickup location, destination, date, time, and number of passengers. You'll receive instant confirmation within 2 minutes.`,
    },
    {
      question: `Is cab available 24/7 in ${city.name}?`,
      answer: `Yes! ${BUSINESS.name} operates 24 hours a day, 7 days a week, 365 days a year in ${city.name}. Whether you need a cab at 3 AM for an early morning flight, a late-night ride, or during festivals and holidays — we are always available. Call ${BUSINESS.phone} anytime.`,
    },
    {
      question: `Do you provide one-way cab from ${city.name}?`,
      answer: `Yes, we provide one-way cab service from ${city.name} to all major cities${routesFrom.length > 0 ? ` including ${routesFrom.slice(0, 5).map(r => r.toName).join(', ')}` : ''}. You pay only for the one-way journey — no return fare charges. One-way cab is the most affordable option for point-to-point outstation travel from ${city.name}.`,
    },
  );

  // Airport FAQ
  if (city.airport) {
    faqs.push({
      question: `Do you provide airport cab service in ${city.name}?`,
      answer: `Yes! We provide 24/7 airport pickup and drop service at ${city.airport} in ${city.name}. For pickups, our driver tracks your flight and waits at the arrival gate with a name board — no extra charge for flight delays. For drops, the driver arrives at your location 30 minutes before the scheduled departure. Airport Sedan starts from ₹${stateFares.airportTransfer.sedan}.`,
    });
  }

  // Railway FAQ
  if (city.railway) {
    faqs.push({
      question: `Do you provide railway station cab in ${city.name}?`,
      answer: `Yes, we provide cab pickup and drop at ${city.railway} in ${city.name}. Our driver will be waiting at the station exit at your scheduled time. For outstation trips, the driver can pick you up directly from the station platform. Available 24/7 at standard rates.`,
    });
  }

  faqs.push(
    {
      question: `What cars are available for rent in ${city.name}?`,
      answer: `In ${city.name}, we offer: Sedan (Swift Dzire, Honda Amaze — 4 passengers), SUV (Ertiga, Innova — 6 passengers), Premium SUV (Innova Crysta — 7 passengers), Tempo Traveller (12-17 passengers), and Luxury cars (Fortuner, Mercedes — on request). All vehicles are AC, sanitized, and well-maintained. Wedding car decoration is also available.`,
    },
    {
      question: `Do you offer wedding car rental in ${city.name}?`,
      answer: `Yes! We provide premium wedding car rental services in ${city.name} with flower decoration, ribbon decoration, red carpet, and professional chauffeurs. Available vehicles include decorated Innova Crysta (₹5,000/day), Fortuner (₹8,000/day), and luxury sedans. Perfect for baraat, vidaai, reception car, and wedding function transport. Book early for wedding season!`,
    },
    {
      question: `Is there corporate cab service in ${city.name}?`,
      answer: `Yes, ${BUSINESS.name} provides corporate car rental services in ${city.name} for employee transport, client meetings, business events, and executive travel. We offer monthly contracts with bulk discounts, GST invoices, and dedicated account managers. Call ${BUSINESS.phone} for corporate inquiries.`,
    },
    {
      question: `What payment methods are accepted for cab booking in ${city.name}?`,
      answer: `We accept all major payment methods: Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Bank Transfer/NEFT. For corporate clients, we also accept purchase orders and provide GST invoices. Payment can be made after the trip for cash bookings, or in advance for online bookings.`,
    },
  );

  return faqs;
}

export function getCityHindiFAQs(input: CityContentInput): { question: string; answer: string }[] {
  const { city } = input;
  const displayRate = getStateDisplayRate(input.stateSlug || 'west-bengal');
  return [
    {
      question: `${city.name} mein sabse achhi cab service kaun si hai?`,
      answer: `${BUSINESS.name} ${city.name} mein sabse bharosemand aur sasti cab service hai. Hum local travel, outstation, airport pickup aur drop ke liye AC gaadiyan (Sedan, SUV, Innova) 24/7 provide karte hain. Booking ke liye ${BUSINESS.phone} par call karein.`,
    },
    {
      question: `${city.name} se outstation cab ka kiraya kitna hai?`,
      answer: `${city.name} se outstation cab ka kiraya ${displayRate} se shuru hota hai. Humare paas one-way aur round trip dono options hain, aur hum koi extra surge charge nahi lete. Call karein ${BUSINESS.phone}.`,
    },
  ];
}

// ─── Generate "Why Choose Us" points for city ───
export function getCityWhyChooseUs(cityName: string): { title: string; description: string }[] {
  const hash = getCityHash(cityName);
  const v = hash % 3;

  const drivers = [
    `All our drivers in ${cityName} are police-verified with valid commercial licences and 5+ years of professional driving experience.`,
    `We provide highly experienced, police-verified local drivers in ${cityName} with active commercial licenses and expertise in highway routes.`,
    `Enjoy a safe ride in ${cityName} with our verified, well-trained drivers who possess 5+ years of professional commercial driving experience.`
  ];

  const fleet = [
    `Every vehicle is AC, sanitized before each trip, and regularly maintained at our authorized service centers. No compromises on comfort.`,
    `Our fleet in ${cityName} features fully air-conditioned, sanitised vehicles (sedans, SUVs, tempos) that undergo routine maintenance checks.`,
    `Travel comfortably in clean, well-maintained, and sanitized AC cars. We promise zero compromise on safety and vehicle quality.`
  ];

  const pricing = [
    `No hidden charges, no surge pricing. All fares include fuel and driver. Toll and parking communicated upfront before confirmation.`,
    `Enjoy transparent billing with fixed fares and zero surge pricing. All rates include fuel and driver; tolls are shared upfront.`,
    `We guarantee flat-rate pricing in ${cityName} with no hidden costs. Driver fees and fuel are included; toll details are shared transparently.`
  ];

  const availability = [
    `We operate round the clock in ${cityName}. Early morning flights, late night arrivals, holidays, festivals — we never say no.`,
    `Our cab services are active 24/7 in ${cityName} to handle late-night drops, early morning airport transfers, and festival trips.`,
    `Get round-the-clock transportation in ${cityName}. We remain open 24 hours, 7 days a week, including major holidays and festivals.`
  ];

  const booking = [
    `Get booking confirmation within 2 minutes on WhatsApp with complete driver and vehicle details. No app download needed.`,
    `Skip app downloads — book instantly on WhatsApp or phone call and receive complete driver details in under 2 minutes.`,
    `Our 2-minute booking system sends driver and vehicle allocation alerts directly to your WhatsApp with no app required.`
  ];

  const payments = [
    `Pay via Cash, UPI (Google Pay, PhonePe), Credit Card, Debit Card, or Bank Transfer. We accept all major payment methods.`,
    `We accept UPI (GPay, Paytm, PhonePe), net banking, debit/credit cards, and direct cash to the driver for ease of billing.`,
    `Choose from flexible payment options including cash, mobile UPI payments, credit/credit cards, and direct bank transfers.`
  ];

  return [
    { title: 'Verified Drivers', description: drivers[v] },
    { title: 'Clean AC Fleet', description: fleet[v] },
    { title: 'Transparent Pricing', description: pricing[v] },
    { title: '24/7 Availability', description: availability[v] },
    { title: 'Instant Booking', description: booking[v] },
    { title: 'Multiple Payment Options', description: payments[v] },
  ];
}

// ─── Main export: Generate all city page content ───
export function generateCityPageContent(input: CityContentInput) {
  const { city, stateName } = input;

  return {
    aboutContent: getAboutCityContent(input),
    areas: getCityAreas(city),
    faqs: [...getCityExtendedFAQs(input), ...getCityHindiFAQs(input)],
    whyChooseUs: getCityWhyChooseUs(city.name),
    isKolkata: city.slug === 'kolkata',
    popularSearches: [
      // ═══ PRIMARY KEYWORDS (highest volume) ═══
      `cab service in ${city.name}`,
      `${city.name} cab service`,
      `${city.name} taxi service`,
      `taxi service in ${city.name}`,
      `taxi in ${city.name}`,
      `cab in ${city.name}`,
      `${city.name} cab`,
      `${city.name} taxi`,
      `car rental ${city.name}`,
      `car rental in ${city.name}`,
      `${city.name} car rental`,
      `${city.name} car hire`,
      // ═══ BOOKING & ACTION KEYWORDS ═══
      `book cab ${city.name}`,
      `book taxi ${city.name}`,
      `${city.name} cab booking`,
      `${city.name} taxi booking`,
      `${city.name} cab booking online`,
      `${city.name} online cab booking`,
      `book cab online ${city.name}`,
      `hire cab ${city.name}`,
      `hire taxi ${city.name}`,
      `rent car ${city.name}`,
      `${city.name} cab online`,
      `call cab ${city.name}`,
      `whatsapp cab booking ${city.name}`,
      // ═══ "NEAR ME" KEYWORDS ═══
      `cab near me ${city.name}`,
      `taxi near me ${city.name}`,
      `cab service near me ${city.name}`,
      `taxi service near me ${city.name}`,
      `cab near me`,
      `taxi near me`,
      `book cab near me ${city.name}`,
      `cab near me ${city.name} ${stateName}`,
      `taxi near me ${city.name} ${stateName}`,
      `car rental near me ${city.name}`,
      // ═══ "BEST" & QUALITY KEYWORDS ═══
      `best cab service ${city.name}`,
      `best taxi service ${city.name}`,
      `best cab ${city.name}`,
      `best taxi ${city.name}`,
      `top cab service ${city.name}`,
      `top taxi service ${city.name}`,
      `trusted cab ${city.name}`,
      `reliable cab ${city.name}`,
      `reliable taxi ${city.name}`,
      `safe cab ${city.name}`,
      `safe taxi ${city.name}`,
      // ═══ PRICING & FARE KEYWORDS ═══
      `${city.name} cab fare`,
      `${city.name} taxi fare`,
      `${city.name} cab rate per km`,
      `${city.name} taxi rate per km`,
      `${city.name} cab price`,
      `${city.name} taxi price`,
      `${city.name} cab charges`,
      `${city.name} taxi charges`,
      `${city.name} cab fare per km`,
      `cheap cab ${city.name}`,
      `cheapest cab ${city.name}`,
      `cheapest taxi ${city.name}`,
      `affordable cab ${city.name}`,
      `affordable taxi ${city.name}`,
      `low cost cab ${city.name}`,
      `budget cab ${city.name}`,
      `${city.name} cab fare chart`,
      `${city.name} taxi fare chart`,
      // ═══ OUTSTATION KEYWORDS ═══
      `outstation cab ${city.name}`,
      `${city.name} outstation cab`,
      `${city.name} outstation taxi`,
      `outstation taxi ${city.name}`,
      `${city.name} outstation cab service`,
      `outstation cab from ${city.name}`,
      `outstation taxi from ${city.name}`,
      `intercity cab ${city.name}`,
      `${city.name} intercity taxi`,
      // ═══ LOCAL TAXI KEYWORDS ═══
      `local taxi ${city.name}`,
      `${city.name} local taxi`,
      `${city.name} local cab`,
      `local cab service ${city.name}`,
      `hourly cab rental ${city.name}`,
      `${city.name} hourly taxi`,
      `${city.name} city taxi`,
      `${city.name} city cab`,
      // ═══ ONE-WAY KEYWORDS ═══
      `one way cab ${city.name}`,
      `${city.name} one way cab`,
      `${city.name} one way taxi`,
      `one way taxi ${city.name}`,
      `one way taxi from ${city.name}`,
      `drop taxi ${city.name}`,
      `${city.name} drop cab`,
      // ═══ ROUND TRIP KEYWORDS ═══
      `round trip cab ${city.name}`,
      `${city.name} round trip cab`,
      `${city.name} round trip taxi`,
      `return cab ${city.name}`,
      // ═══ AIRPORT KEYWORDS ═══
      `${city.name} airport cab`,
      `${city.name} airport taxi`,
      `airport cab ${city.name}`,
      `airport taxi ${city.name}`,
      `${city.name} airport transfer`,
      `${city.name} airport pickup`,
      `${city.name} airport drop`,
      `cab from ${city.name} airport`,
      `taxi from ${city.name} airport`,
      `${city.name} airport cab service`,
      // ═══ RAILWAY STATION KEYWORDS ═══
      `${city.name} station cab`,
      `${city.name} railway station taxi`,
      `cab from ${city.name} station`,
      `${city.name} station pickup`,
      `${city.name} station drop`,
      // ═══ VEHICLE-SPECIFIC KEYWORDS ═══
      `${city.name} innova cab`,
      `${city.name} innova crysta`,
      `${city.name} suv cab`,
      `${city.name} suv taxi`,
      `${city.name} sedan cab`,
      `${city.name} sedan taxi`,
      `${city.name} ertiga cab`,
      `${city.name} tempo traveller`,
      `${city.name} swift dzire`,
      `innova on rent ${city.name}`,
      `suv on rent ${city.name}`,
      `tempo traveller hire ${city.name}`,
      `${city.name} luxury car rental`,
      `${city.name} ac cab`,
      // ═══ WEDDING CAR KEYWORDS ═══
      `wedding car ${city.name}`,
      `${city.name} wedding car rental`,
      `wedding car rental ${city.name}`,
      `decorated car ${city.name}`,
      `baraat car ${city.name}`,
      `vidaai car ${city.name}`,
      `shaadi car ${city.name}`,
      // ═══ CORPORATE KEYWORDS ═══
      `corporate cab ${city.name}`,
      `${city.name} corporate car rental`,
      `corporate car rental ${city.name}`,
      `office cab ${city.name}`,
      `employee transport ${city.name}`,
      `${city.name} corporate taxi`,
      // ═══ TIME-SPECIFIC KEYWORDS ═══
      `24 hour taxi ${city.name}`,
      `24/7 cab ${city.name}`,
      `24x7 cab service ${city.name}`,
      `midnight cab ${city.name}`,
      `late night cab ${city.name}`,
      `early morning cab ${city.name}`,
      `night taxi ${city.name}`,
      // ═══ COMPARISON KEYWORDS ═══
      `${city.name} cab vs ola`,
      `${city.name} cab vs uber`,
      `better than ola ${city.name}`,
      `better than uber ${city.name}`,
      `no surge cab ${city.name}`,
      `fixed rate cab ${city.name}`,
      `no surge pricing ${city.name}`,
      // ═══ ROUTE-SPECIFIC KEYWORDS ═══
      `${city.name} to kolkata cab`,
      `kolkata to ${city.name} cab`,
      `${city.name} to kolkata taxi`,
      `${city.name} to kolkata taxi fare`,
      `${city.name} to ranchi cab`,
      `${city.name} to jamshedpur cab`,
      `${city.name} to bhubaneswar cab`,
      `${city.name} to delhi cab`,
      `${city.name} to patna cab`,
      // ═══ PURPOSE-SPECIFIC KEYWORDS ═══
      `${city.name} sightseeing cab`,
      `${city.name} tour cab`,
      `${city.name} cab for shopping`,
      `${city.name} cab for hospital`,
      `${city.name} cab for family trip`,
      `${city.name} cab for business trip`,
      `${city.name} cab for pilgrimage`,
      `${city.name} darshan cab`,
      // ═══ SAFETY & FEATURES KEYWORDS ═══
      `gps tracked cab ${city.name}`,
      `verified driver cab ${city.name}`,
      `police verified driver ${city.name}`,
      `ac cab ${city.name}`,
      `clean cab ${city.name}`,
      `sanitized cab ${city.name}`,
      // ═══ QUESTION-FORMAT KEYWORDS ═══
      `how to book cab in ${city.name}`,
      `what is cab fare in ${city.name}`,
      `how much taxi fare ${city.name}`,
      `which is best cab service in ${city.name}`,
      `cab service contact number ${city.name}`,
      `${city.name} cab phone number`,
      // ═══ PAYMENT KEYWORDS ═══
      `upi payment cab ${city.name}`,
      `cash payment cab ${city.name}`,
      `online payment cab ${city.name}`,
      // ═══ FESTIVAL & SEASONAL KEYWORDS ═══
      `${city.name} durga puja cab`,
      `${city.name} diwali cab`,
      `${city.name} festival cab`,
      `${city.name} holiday cab`,
      `${city.name} weekend cab`,
      `${city.name} summer cab`,
      // ═══ GROUP & FAMILY KEYWORDS ═══
      `${city.name} group cab`,
      `${city.name} family cab`,
      `${city.name} shared cab`,
      `${city.name} cab for group travel`,
      // ═══ MULTI-CITY ROUTE KEYWORDS ═══
      `${city.name} to darjeeling cab`,
      `${city.name} to puri cab`,
      `${city.name} to digha cab`,
      `${city.name} to siliguri cab`,
      // ═══ SPECIALIZED USE CASE ═══
      `${city.name} cab for exam`,
      `${city.name} cab for interview`,
      `${city.name} cab for school admission`,
      `${city.name} cab for medical`,
      // ═══ ALTERNATE NAME KEYWORDS (misspellings & local names) ═══
      ...(city.alternateNames || []).flatMap(alt => [
        `${alt} cab service`,
        `${alt} taxi service`,
        `cab service in ${alt}`,
        `taxi in ${alt}`,
        `${alt} to kolkata cab`,
        `kolkata to ${alt} cab`,
        `${alt} cab booking`,
        `${alt} taxi fare`,
        `${alt} cab near me`,
        `best cab ${alt}`,
      ]),
      // ═══ HINDI / HINGLISH KEYWORDS ═══
      `${city.name} cab service number`,
      `${city.name} cab ka number`,
      `${city.name} se kolkata cab`,
      `kolkata se ${city.name} cab`,
      `${city.name} mein cab`,
      `${city.name} taxi ka kiraya`,
      `${city.name} cab kitna lagta hai`,
      `${city.name} se cab kaise book kare`,
    ],
  };
}
