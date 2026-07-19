import { BUSINESS, getStatePriceLabels } from './data';

interface ServiceContentInput {
  cityName: string;
  stateName: string;
  stateSlug: string;
  citySlug: string;
  landmarks?: string[];
  airport?: string;
  railway?: string;
}

export function generateLocalServiceContent(input: ServiceContentInput) {
  const { cityName, stateName, stateSlug, landmarks, airport, railway } = input;
  // generateLocalServiceContent prices
  const prices = getStatePriceLabels(stateSlug || 'west-bengal');
  const landmarkList = landmarks?.slice(0, 6).join(', ') || 'railway station, bus stand, major markets';

  return {
    aboutContent: [
      `${BUSINESS.name} provides the most trusted and affordable local taxi service in ${cityName}, ${stateName}. Whether you need a cab for a quick hospital visit, daily office commute, school/college transport, shopping trip, or full-day city sightseeing — our local cab service in ${cityName} covers every corner of the city with AC vehicles, verified drivers, and transparent pricing. We operate 24 hours a day, 7 days a week, 365 days a year — including festivals, holidays, and late-night hours.`,
      `Our local taxi packages in ${cityName} are designed for maximum flexibility. The 4-hour/40-km package (Sedan ${prices.localPkgSedan}) is ideal for short trips like hospital visits, bank work, or 2-3 errands. The 8-hour/80-km package (Sedan ₹2,000) is perfect for full-day city travel — multiple stops, city sightseeing, or office travel across ${cityName}. For large groups, our SUV and Tempo Traveller options provide comfortable travel at competitive rates.`,
      `Unlike ride-hailing apps like Ola and Uber, ${BUSINESS.name} charges fixed rates in ${cityName} with zero surge pricing. The same fare applies at 3 AM, during peak hours, festivals like Durga Puja and Diwali, and New Year's Eve. Our drivers are police-verified professionals with 5+ years of driving experience in ${cityName}. Every vehicle in our fleet is AC, GPS-tracked, and sanitized before each trip for your safety.`,
      `We pick up from any address in ${cityName} — your home, office, hotel, hospital, railway station${airport ? `, ${airport}` : ''}, shopping mall, or any location. Our local ${cityName} drivers know every lane, shortcut, and traffic pattern in the city, ensuring you reach your destination on time. For corporate clients in ${cityName}, we offer monthly taxi packages with 15-25% discount, GST invoices, and dedicated relationship managers.`,
      `Booking a local taxi in ${cityName} is simple — call ${BUSINESS.phone}, send a WhatsApp message, or fill out our online booking form. You'll receive instant confirmation with driver name, phone number, and vehicle details within 2 minutes. Our driver arrives 10-15 minutes before pickup time. Payment options include Cash, UPI (GPay, PhonePe, Paytm), and card payments. No advance payment required — pay at the end of your trip.`,
      `${BUSINESS.name} covers all areas in ${cityName} including ${landmarkList}${railway ? `, ${railway}` : ''}. Whether you're a resident of ${cityName} looking for reliable daily transport, a business traveler needing a comfortable ride between meetings, or a tourist exploring the city's attractions — our local taxi service in ${cityName} is your best choice for safe, comfortable, and affordable city travel.`,
    ],
    useCases: [
      { icon: '🏥', title: 'Hospital & Medical', desc: `Medical appointments, emergency, discharge pickup in ${cityName}` },
      { icon: '🛍️', title: 'Shopping Trips', desc: `Malls, markets, and shopping areas across ${cityName}` },
      { icon: '🏢', title: 'Office & Corporate', desc: `Daily commute, client meetings, IT park transport` },
      { icon: '🎓', title: 'School & College', desc: `Exam centres, admissions, coaching classes` },
      { icon: '✈️', title: 'Airport Transfer', desc: airport ? `Pickup/drop at ${airport}` : `Airport pickup and drop` },
      { icon: '🚂', title: 'Railway Station', desc: railway ? `${railway} pickup & drop` : `Railway station transfers` },
      { icon: '🎊', title: 'Events & Functions', desc: `Weddings, parties, pujas, family gatherings` },
      { icon: '🏛️', title: 'Sightseeing', desc: `City tour, tourist spots, day trips from ${cityName}` },
    ],
    whyChooseUs: [
      `24/7 cab availability in ${cityName} — even at 3 AM`,
      'Police-verified drivers with 5+ years of local experience',
      `No surge pricing — same fixed rate during festivals and peak hours`,
      'AC, GPS-tracked, sanitized vehicles — Sedan, SUV, Tempo',
      'Instant booking confirmation on WhatsApp within 2 minutes',
      `Pickup from any address in ${cityName} — home, office, hotel`,
      'No advance payment — pay at trip end via Cash, UPI, or Card',
      'Free cancellation up to 2 hours before pickup time',
    ],
    faqs: [
      { question: `What is the local taxi fare in ${cityName}?`, answer: `Local taxi packages in ${cityName} start from ${prices.localPkgSedan} for 8 hours/80 km (Sedan). SUV starts from ${prices.localPkgSuv}. Innova Crysta from ₹3,100. Tempo Traveller from ₹3,700. Extra km charged at ${prices.sedanPerKm} (Sedan), ${prices.suvPerKm} (SUV). Extra hour: ₹150/hr. Call ${BUSINESS.phone} for custom packages.` },
      { question: `What areas do you cover for local taxi in ${cityName}?`, answer: `We cover all areas in ${cityName} including ${landmarkList}${airport ? `, ${airport}` : ''}${railway ? `, ${railway}` : ''}, bus stand, hospitals, schools, shopping areas, IT parks, and all residential and commercial zones.` },
      { question: `Can I book a local cab for half day in ${cityName}?`, answer: `Yes! We offer 4 hours/40 km packages perfect for half-day usage in ${cityName}. Ideal for shopping trips, hospital visits, or short sightseeing tours. Sedan: ${prices.localPkgSedan}, SUV: ₹1,800.` },
      { question: `Do you provide AC cabs for local travel in ${cityName}?`, answer: `Yes, all our local taxi vehicles in ${cityName} are AC fitted — Sedan (Swift Dzire, Honda Amaze), SUV (Ertiga, Innova), Innova Crysta, and Tempo Traveller (12-17 seater). AC is always on during your ride.` },
      { question: `Is there surge pricing for local taxi in ${cityName}?`, answer: `Never! Unlike Ola and Uber, ${BUSINESS.name} charges fixed rates in ${cityName}. Same fare at 3 AM, during festivals (Durga Puja, Diwali, Christmas), and peak hours. No dynamic or surge pricing — ever.` },
      { question: `How can I book a local cab in ${cityName}?`, answer: `Call ${BUSINESS.phone} or WhatsApp us. Share your pickup address, destination, date, time, and preferred vehicle type. Get instant confirmation within 2 minutes with driver name, phone, and vehicle number. No app download required.` },
      { question: `Do you provide corporate cab service in ${cityName}?`, answer: `Yes! Monthly corporate cab contracts for companies in ${cityName}. Employee transport, client meetings, airport VIP transfers. 15-25% corporate discount. GST invoices provided. Dedicated account manager for your company.` },
      { question: `Can I use local taxi for wedding functions in ${cityName}?`, answer: `Yes! We provide decorated wedding cars and regular cabs for wedding function transportation in ${cityName}. Baraat cars with flower decoration, guest shuttle service, vidaai cars — all available with professional chauffeurs.` },
      { question: `What payment methods do you accept in ${cityName}?`, answer: `We accept Cash, UPI (Google Pay, PhonePe, Paytm), Credit Card, Debit Card, and Bank Transfer. No advance payment required for local taxi in ${cityName} — pay at the end of your trip. Corporate clients get monthly billing.` },
      { question: `Is local taxi available for outstation trips from ${cityName}?`, answer: `Yes! Along with local taxi, we provide outstation cab service from ${cityName} to all cities in ${stateName} and neighboring states. One-way from ${prices.sedanPerKm}, round trip available. Call ${BUSINESS.phone} for outstation quotes.` },
    ],
    popularSearches: [
      `local taxi ${cityName}`, `cab service ${cityName}`, `taxi in ${cityName}`,
      `hourly cab ${cityName}`, `local cab booking ${cityName}`, `cheap taxi ${cityName}`,
      `${cityName} taxi service`, `${cityName} cab booking`, `taxi near me ${cityName}`,
      `cab for hospital ${cityName}`, `${cityName} airport taxi`, `best cab service ${cityName}`,
      `${cityName} local taxi fare`, `taxi rental ${cityName}`, `car rental ${cityName}`,
    ],
  };
}

export function generateOutstationServiceContent(input: ServiceContentInput) {
  const { cityName, stateName, stateSlug } = input;
  // generateOutstationServiceContent prices
  const prices = getStatePriceLabels(stateSlug || 'west-bengal');
  return {
    aboutContent: [
      `${BUSINESS.name} is the most trusted outstation cab service provider from ${cityName}, ${stateName}. We offer comfortable, affordable intercity taxi service from ${cityName} to all major cities across ${stateName}, West Bengal, Jharkhand, Odisha, Bihar, and beyond. Whether you're planning a business trip, family vacation, pilgrimage tour, or weekend getaway — our outstation cab service from ${cityName} provides the perfect transportation solution.`,
      `Our outstation taxi fleet includes AC Sedan (Swift Dzire, Honda Amaze) at ${prices.sedanPerKm}, SUV (Ertiga, Innova) at ${prices.suvPerKm}, Premium SUV (Innova Crysta) at ${prices.crystaPerKm}, and Tempo Traveller (13-26 seater) at ${prices.tempoPerKm}. All fares are fixed — no surge pricing during festivals, peak seasons, or late-night travel. Toll, parking, and state permit charges are additional and paid by the passenger.`,
      `We offer both one-way and round-trip outstation cabs from ${cityName}. One-way trips are charged for the single journey only — no return fare. Round trips include driver accommodation and have a minimum 250 km per day charge. Multi-day packages are available for extended tours and business trips with special rates.`,
      `All our outstation drivers are experienced professionals who know the intercity routes thoroughly. They have 5+ years of driving experience, valid commercial licenses, and clean police verification records. Vehicles are GPS-tracked for your safety, and you can share live location with family members during your trip.`,
      `Booking an outstation cab from ${cityName} is simple. Call ${BUSINESS.phone}, WhatsApp us, or fill the online booking form. You'll receive an instant fare quote and booking confirmation within 2 minutes. Our driver arrives 15 minutes before pickup time at your home, hotel, railway station, or airport. Free cancellation is available up to 4 hours before departure.`,
      `${BUSINESS.name} also provides specialized outstation services from ${cityName}: corporate travel packages with monthly billing, wedding car rental with decoration for destination weddings, group tours in Tempo Traveller, and airport transfer services. Whatever your intercity travel need from ${cityName}, we have the perfect solution.`,
    ],
    faqs: [
      { question: `What is the outstation cab fare from ${cityName}?`, answer: `Outstation cab fares from ${cityName}: Sedan ${prices.sedanPerKm}, SUV ${prices.suvPerKm}, Innova Crysta ${prices.crystaPerKm}, Tempo Traveller ${prices.tempoPerKm}. Minimum 150 km/day for one-way, 250 km/day for round trip. Toll and parking extra. Call ${BUSINESS.phone} for exact quotes.` },
      { question: `Can I book a one-way outstation cab from ${cityName}?`, answer: `Yes! One-way outstation cab from ${cityName} is available. You pay only for the one-way journey — no return charges. Most affordable option for intercity travel. Available on all routes.` },
      { question: `What is included in outstation cab fare from ${cityName}?`, answer: `Our outstation fares from ${cityName} include fuel charges, driver charges, and GST. Toll taxes, parking fees, state permit charges, and driver allowance (₹300/night for multi-day trips) are extra and paid directly.` },
      { question: `How far in advance should I book outstation cab from ${cityName}?`, answer: `We recommend 2-4 hours advance booking for outstation trips from ${cityName}. However, we accommodate last-minute bookings based on availability. For festivals and holidays, book 24 hours in advance.` },
      { question: `Do you provide multi-day outstation cab from ${cityName}?`, answer: `Yes! Multi-day packages from ${cityName} are available. Minimum 250 km/day charged. Driver accommodation included. Perfect for week-long tours, business trips, and family vacations. Call ${BUSINESS.phone}.` },
      { question: `Is night travel available for outstation from ${cityName}?`, answer: `Yes, 24/7 outstation service from ${cityName}. Early morning 3 AM departures, overnight journeys — all available at the same fixed rate. Night charge of ₹300 applies for 10 PM–6 AM travel.` },
      { question: `What vehicles are available for outstation from ${cityName}?`, answer: `Sedan (Swift Dzire, Honda Amaze — 4 pax), SUV (Ertiga, Innova — 6 pax), Innova Crysta (7 pax), Tempo Traveller (12-17 pax). All AC, GPS-tracked, sanitized. Choose based on group size and budget.` },
      { question: `Can I get corporate outstation cab from ${cityName}?`, answer: `Yes! Corporate outstation packages from ${cityName} with 15-25% discount, monthly billing, GST invoices, and dedicated fleet. Perfect for business travel, client pickups, and employee transport.` },
    ],
    popularSearches: [
      `outstation cab from ${cityName}`, `outstation taxi ${cityName}`, `intercity cab ${cityName}`,
      `${cityName} outstation cab service`, `cab from ${cityName}`, `${cityName} to kolkata cab`,
      `long distance cab ${cityName}`, `cheap outstation cab ${cityName}`, `book outstation cab ${cityName}`,
    ],
  };
}

export function generateOneWayServiceContent(input: ServiceContentInput) {
  const { cityName, stateName, stateSlug } = input;
  // generateOneWayServiceContent prices
  const prices = getStatePriceLabels(stateSlug || 'west-bengal');
  return {
    aboutContent: [
      `Looking for a one-way cab from ${cityName}? ${BUSINESS.name} offers the most affordable one-way taxi service from ${cityName}, ${stateName}. Unlike traditional round-trip bookings where you pay for both directions, our one-way cab charges you only for the distance you actually travel. This makes it 40-50% cheaper than a round trip for single-direction journeys.`,
      `Our one-way cab service from ${cityName} is available to all cities across ${stateName}, West Bengal, Jharkhand, Odisha, and Bihar. Whether it's an airport drop, railway station transfer, intercity business trip, or a family visit — our one-way taxi provides the most cost-effective solution. Sedan from ${prices.sedanPerKm}, SUV from ${prices.suvPerKm}, Tempo from ${prices.tempoPerKm}.`,
      `How one-way fare works from ${cityName}: You are charged per km for the actual distance traveled plus a base fare. No return km charges, no empty return charges. For example, a 200 km one-way trip in a Sedan costs approximately ₹3,700 (200 km × ₹11 + base fare) — compared to ₹4,400+ for a round trip booking.`,
      `All one-way cabs from ${cityName} come with AC, GPS tracking, experienced police-verified drivers, and the same no-surge pricing guarantee. The fare remains the same whether you book at 3 AM, during festivals, or peak hours. Free cancellation up to 4 hours before pickup. Instant WhatsApp confirmation with driver details.`,
      `Book your one-way cab from ${cityName} now — call ${BUSINESS.phone} or WhatsApp us. Share your pickup address, destination, date, and time. Get an instant fare quote and booking confirmation within 2 minutes. Available 24/7, 365 days.`,
    ],
    faqs: [
      { question: `What is one-way cab fare from ${cityName}?`, answer: `One-way fares from ${cityName}: Sedan ${prices.sedanPerKm}, SUV ${prices.suvPerKm}, Tempo ${prices.tempoPerKm}. You pay only for one-way distance. Toll and parking extra. Call ${BUSINESS.phone}.` },
      { question: `Is one-way cab cheaper than round trip from ${cityName}?`, answer: `Yes! One-way cab from ${cityName} is 40-50% cheaper than round trip for single-direction travel. You don't pay for the driver's return journey. Best option when you only need to go one way.` },
      { question: `Can I book one-way cab for airport drop from ${cityName}?`, answer: `Yes! One-way airport drop from ${cityName} to any nearby airport. Driver drops you at the departure terminal. Flight tracking included for airport pickups. Call ${BUSINESS.phone}.` },
      { question: `How is one-way fare calculated from ${cityName}?`, answer: `One-way fare = (Distance × Per KM rate) + Base fare. Sedan: ${prices.sedanPerKm} + ${prices.airportInnova} base. SUV: ${prices.suvPerKm} + ₹2,000 base. Toll and parking extra. No hidden charges.` },
      { question: `Is one-way cab available at night from ${cityName}?`, answer: `Yes! 24/7 one-way cab from ${cityName}. Same fixed fare at any time — no night surcharge, no surge pricing. Night charge of ₹300 applies for 10 PM–6 AM only for driver allowance.` },
      { question: `Do you provide one-way cab to all cities from ${cityName}?`, answer: `Yes! One-way cab from ${cityName} to all cities in ${stateName}, West Bengal, Jharkhand, Odisha, Bihar. No route is too far or too short. Call ${BUSINESS.phone} for any destination.` },
    ],
    popularSearches: [
      `one way cab from ${cityName}`, `one way taxi ${cityName}`, `drop taxi ${cityName}`,
      `${cityName} one way cab service`, `cheap one way cab ${cityName}`, `one side taxi ${cityName}`,
      `point to point cab ${cityName}`, `single trip taxi ${cityName}`, `one way cab booking ${cityName}`,
    ],
  };
}

export function generateRoundTripServiceContent(input: ServiceContentInput) {
  const { cityName, stateName, stateSlug } = input;
  // generateRoundTripServiceContent prices
  const prices = getStatePriceLabels(stateSlug || 'west-bengal');
  return {
    aboutContent: [
      `${BUSINESS.name} offers the best round-trip cab service from ${cityName}, ${stateName}. A round trip is ideal when you need to travel to another city and return within a few days. Unlike one-way bookings, round-trip cabs come with a dedicated driver who stays with you throughout your journey — perfect for multi-city tours, business trips, family vacations, and pilgrimage tours from ${cityName}.`,
      `Our round-trip cab fares from ${cityName} are calculated per km with a minimum of 250 km per day. Sedan at ${prices.sedanPerKm}, SUV at ${prices.suvPerKm}, Innova Crysta at ${prices.crystaPerKm}, and Tempo Traveller at ${prices.tempoPerKm}. Driver allowance of ₹300/night is included for overnight trips. All fares are fixed with zero surge pricing — the same rate applies during festivals, holidays, peak seasons, and late-night travel.`,
      `Round-trip advantages from ${cityName}: Your driver stays with you at the destination, so you have a cab available for local sightseeing, visiting relatives, business meetings, and return travel — all with a single booking. No need to find a new cab at your destination. The same driver, same vehicle, same comfort throughout your trip.`,
      `We provide round-trip cabs from ${cityName} to all cities across ${stateName}, West Bengal, Jharkhand, Odisha, Bihar, and beyond. Popular round trips include temple tours, beach holidays, hill station getaways, and business trips. For groups of 8+, our Tempo Traveller (12-17 seater) offers the most economical per-person rate.`,
      `Book round-trip cab from ${cityName} by calling ${BUSINESS.phone} or WhatsApp. Get instant fare quote, booking confirmation, and driver details within 2 minutes. Free cancellation up to 4 hours before pickup. Payment at trip end via Cash, UPI, or Card. Available 24/7, 365 days.`,
    ],
    faqs: [
      { question: `What is round trip cab fare from ${cityName}?`, answer: `Round trip fares from ${cityName}: Sedan ${prices.sedanPerKm}, SUV ${prices.suvPerKm}, Crysta ${prices.crystaPerKm}, Tempo ${prices.tempoPerKm}. Minimum 250 km/day. Driver allowance ₹300/night. Toll and parking extra. Call ${BUSINESS.phone}.` },
      { question: `What is included in round trip from ${cityName}?`, answer: `Round trip from ${cityName} includes fuel, driver charges, GST, and driver accommodation at destination. Toll, parking, state permit, and driver food allowance are extra.` },
      { question: `How is round trip fare calculated from ${cityName}?`, answer: `Round trip fare = Total km × Per KM rate. Minimum 250 km/day charged. Example: 2-day trip, 400 km actual = 500 km charged (250×2). Sedan: 500×₹11 = ₹5,500.` },
      { question: `Can I keep the cab for sightseeing at destination?`, answer: `Yes! Round trip means the driver stays with you. Use the cab for local sightseeing, meetings, shopping at your destination. Extra km beyond the daily limit charged at the same per-km rate.` },
      { question: `Is round trip available for multi-day tours from ${cityName}?`, answer: `Yes! Multi-day round trips from ${cityName} available — 2 days, 3 days, up to 30 days. Perfect for vacation tours, business trips, wedding functions. Call ${BUSINESS.phone} for custom packages.` },
      { question: `Do you provide round trip cab at night from ${cityName}?`, answer: `Yes! 24/7 round trip availability from ${cityName}. Same fixed rate anytime. Night charge of ₹300 applies for 10 PM–6 AM travel. No surge pricing ever.` },
    ],
    popularSearches: [
      `round trip cab from ${cityName}`, `round trip taxi ${cityName}`, `return cab ${cityName}`,
      `${cityName} round trip cab service`, `multi day cab ${cityName}`, `return trip taxi ${cityName}`,
      `cab for tour from ${cityName}`, `${cityName} round trip fare`, `book round trip cab ${cityName}`,
    ],
  };
}

export function generateAirportServiceContent(input: ServiceContentInput) {
  const { cityName, stateName, stateSlug, airport } = input;
  // generateAirportServiceContent prices
  const prices = getStatePriceLabels(stateSlug || 'west-bengal');
  const airportName = airport || `${cityName} Airport`;
  return {
    aboutContent: [
      `${BUSINESS.name} provides reliable airport transfer service in ${cityName}, ${stateName}. Whether you need a pickup from ${airportName} or a drop to the airport — our airport cab service ensures you reach on time, every time. We track your flight status in real-time, so even if your flight is delayed, our driver will be waiting for you at the arrival gate. No extra charges for flight delays up to 45 minutes.`,
      `Our airport transfer rates in ${cityName} start from just ${prices.airportSedan} for Sedan, ${prices.localPkgSedan} for SUV, and ${prices.airportInnova} for Innova Crysta. These are flat fares — no meter, no surge pricing, no hidden charges. The fare is fixed whether you travel at 3 AM, during peak hours, or on festival days. Toll and parking charges at the airport are included in the quoted price.`,
      `Airport cab features in ${cityName}: Flight tracking for pickups (we monitor your flight and adjust timing), meet-and-greet at arrival gate with name board, luggage assistance, complimentary water bottles, clean AC vehicles, and professional chauffeurs who know the fastest routes to ${airportName}. For business travelers, we offer premium vehicles including Innova Crysta and luxury sedans.`,
      `We provide airport transfer service to and from ${airportName} covering all areas of ${cityName}. Our drivers arrive 15 minutes before the scheduled pickup time. For airport drops, we recommend leaving 3 hours before domestic flights and 4 hours before international flights. Real-time traffic monitoring ensures the most efficient route to the airport.`,
      `Book airport cab in ${cityName} by calling ${BUSINESS.phone} or WhatsApp. Share your flight number, pickup/drop address, date, and time. Get instant confirmation within 2 minutes. Available 24/7 — early morning 3 AM flights, late night red-eye, any time. Corporate airport transfer packages with monthly billing and GST invoices available.`,
    ],
    faqs: [
      { question: `What is airport cab fare in ${cityName}?`, answer: `Airport cab fares in ${cityName}: Sedan from ${prices.airportSedan}, SUV from ${prices.localPkgSedan}, Innova Crysta from ${prices.airportInnova}. Flat fare — no meter, no surge. Toll and airport parking included. Call ${BUSINESS.phone}.` },
      { question: `Do you track flights for airport pickup in ${cityName}?`, answer: `Yes! We track your flight in real-time. If your flight is delayed, our driver waits at no extra charge (up to 45 minutes). Driver arrives at the arrival gate with a name board.` },
      { question: `How early should I book airport cab in ${cityName}?`, answer: `We recommend booking 2-4 hours in advance. However, we also accommodate last-minute bookings based on availability. For early morning flights (before 6 AM), book the previous evening.` },
      { question: `Is airport cab available at 3 AM in ${cityName}?`, answer: `Yes! 24/7 airport transfer in ${cityName}. Same fixed fare at 3 AM, midnight, or any time. No night surcharge, no surge pricing. Night allowance of ₹300 applies for 10 PM–6 AM.` },
      { question: `Do you provide airport transfer for groups in ${cityName}?`, answer: `Yes! SUV (6 pax), Innova Crysta (7 pax), and Tempo Traveller (12-17 pax) available for group airport transfers in ${cityName}. Corporate group packages available with GST billing.` },
      { question: `Can I book return airport transfer in ${cityName}?`, answer: `Yes! Book both airport pickup and drop together for better rates. Our driver can wait at the airport for your return flight or we can send a fresh vehicle. Call ${BUSINESS.phone}.` },
    ],
    popularSearches: [
      `airport cab ${cityName}`, `airport taxi ${cityName}`, `${cityName} airport transfer`,
      `${airportName} cab`, `airport pickup ${cityName}`, `airport drop ${cityName}`,
      `cheap airport cab ${cityName}`, `${cityName} airport taxi fare`, `book airport cab ${cityName}`,
    ],
  };
}

export function generateWeddingCarServiceContent(input: ServiceContentInput) {
  const { cityName, stateName } = input;
  return {
    aboutContent: [
      `${BUSINESS.name} provides premium wedding car rental service in ${cityName}, ${stateName}. Make your special day unforgettable with our beautifully decorated wedding cars. From baraat procession to vidaai, from guest shuttle service to honeymoon travel — we provide complete wedding transportation solutions in ${cityName} with professional chauffeurs and beautifully decorated vehicles.`,
      `Our wedding car fleet in ${cityName} includes luxury sedans (Honda City, Toyota Camry), premium SUVs (Innova Crysta, Toyota Fortuner), and luxury vehicles (Mercedes-Benz, BMW, Audi) for the bride and groom. For guest transportation, we offer multiple Innova Crysta, Ertiga, and Tempo Traveller vehicles. All wedding cars come with professional decoration including fresh flowers, ribbons, and custom themes.`,
      `Wedding car packages in ${cityName} start from ₹5,000 for decorated Sedan, ₹8,000 for decorated Innova Crysta, ₹12,000 for decorated Fortuner, and ₹20,000+ for luxury Mercedes/BMW. Packages include decoration, professional chauffeur, fuel for up to 100 km, and 8 hours of service. Extended hours and extra km available at additional rates.`,
      `We handle all types of wedding functions in ${cityName}: Baraat car with elaborate flower decoration, Doli/Palki car for the bride, guest shuttle service between venues, reception venue transfers, Mehndi and Sangeet event transport, and honeymoon travel. For destination weddings outside ${cityName}, our outstation wedding car packages include driver accommodation and multi-day rates.`,
      `Book wedding car in ${cityName} by calling ${BUSINESS.phone}. We recommend booking 1-2 weeks in advance for wedding season (November-February) to ensure availability of your preferred vehicle and decoration style. We provide trial decoration for premium bookings. Payment can be made via Cash, UPI, Bank Transfer, or Card. 50% advance required for wedding bookings.`,
    ],
    faqs: [
      { question: `What is wedding car rental fare in ${cityName}?`, answer: `Wedding car rates in ${cityName}: Decorated Sedan from ₹5,000, Innova Crysta from ₹8,000, Fortuner from ₹12,000, Mercedes/BMW from ₹20,000+. Includes decoration, driver, fuel for 100 km, 8 hours. Call ${BUSINESS.phone}.` },
      { question: `Do you provide baraat car in ${cityName}?`, answer: `Yes! Premium baraat car with elaborate flower decoration, ribbons, and custom themes. Decorated Innova Crysta, Fortuner, Mercedes available. Music system and garland arrangements can be added.` },
      { question: `Can I see decoration before booking in ${cityName}?`, answer: `Yes! For premium bookings (₹10,000+), we provide trial decoration. You can choose from 5+ decoration themes. Custom decoration as per your requirements is also available.` },
      { question: `Do you provide guest shuttle service for weddings in ${cityName}?`, answer: `Yes! Multiple vehicles for guest transportation — Ertiga (6 pax), Innova (7 pax), Tempo Traveller (12-17 pax). Shuttle between hotel, venue, railway station, and airport. Group discount available.` },
      { question: `How far in advance should I book wedding car in ${cityName}?`, answer: `1-2 weeks minimum. During wedding season (November-February), book 2-4 weeks in advance. Popular vehicles like Fortuner and Mercedes get booked quickly. 50% advance payment required.` },
      { question: `Do you provide wedding car for destination weddings from ${cityName}?`, answer: `Yes! Outstation wedding car from ${cityName} with multi-day packages. Driver accommodation included. Decoration available at destination. Call ${BUSINESS.phone} for custom packages.` },
    ],
    popularSearches: [
      `wedding car ${cityName}`, `wedding car rental ${cityName}`, `baraat car ${cityName}`,
      `decorated car ${cityName}`, `marriage car ${cityName}`, `dulhan car ${cityName}`,
      `wedding taxi ${cityName}`, `shaadi car ${cityName}`, `luxury wedding car ${cityName}`,
    ],
  };
}
