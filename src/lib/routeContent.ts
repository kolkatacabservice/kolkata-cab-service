import { BUSINESS, type Route, type City } from './data';

// ═══════════════════════════════════════════════════════════════
// ROUTE CONTENT GENERATION ENGINE
// Generates unique, keyword-rich content for every route page
// ═══════════════════════════════════════════════════════════════

interface RouteContentInput {
  route: Route;
  fromCity?: City;
  toCity?: City;
  fromStateName?: string;
  toStateName?: string;
  fromAlternateNames?: string[];
  toAlternateNames?: string[];
}

// ─── Distance-based travel tips ───
function getTravelTips(distance: number, fromName: string, toName: string, via: string[]): string[] {
  const tips: string[] = [];

  if (distance < 100) {
    tips.push(
      `The ${fromName} to ${toName} route is a short journey, perfect for a day trip. You can comfortably complete this trip and return the same day.`,
      `Pack light for this short trip — you won't need much. A small bag with essentials is sufficient.`,
      `This short route is ideal for business meetings, hospital visits, or family functions in ${toName}.`
    );
  } else if (distance < 250) {
    tips.push(
      `The ${fromName} to ${toName} distance is moderate. We recommend starting early in the morning to avoid traffic on the highway.`,
      `Carry some snacks and water for the journey. There are several dhabas and restaurants along the route for a meal break.`,
      `If you're traveling during monsoon season (July–September), allow extra time as road conditions may vary in some stretches.`
    );
  } else if (distance < 500) {
    tips.push(
      `The ${fromName} to ${toName} route is a long journey. We recommend starting by 5–6 AM to reach your destination before evening.`,
      `Our driver will take 1–2 rest stops during the journey for refreshments and washroom breaks. Let the driver know your preferences.`,
      `For overnight trips, we can arrange a comfortable stay at budget-friendly hotels near ${toName}. Ask our team for recommendations.`,
      `Carry snacks, water, and any medicines you might need. Phone chargers and power banks are recommended for long trips.`
    );
  } else {
    tips.push(
      `The ${fromName} to ${toName} route is a very long journey spanning ${distance} km. We strongly recommend either starting very early or breaking the trip with an overnight halt.`,
      `For journeys over 500 km, our drivers are experienced in long-distance travel and know the best rest stops, fuel stations, and food joints along NH routes.`,
      `Consider booking a round trip — it's more economical for long-distance travel and ensures you have a dedicated vehicle and driver for the entire duration.`,
      `Carry all essential documents, medicines, and sufficient cash/UPI for toll payments. Our fare includes fuel and driver, but toll and parking charges are additional.`
    );
  }

  if (via.length > 0) {
    tips.push(`The route passes through ${via.join(', ')}. These are good spots for rest breaks and refreshments.`);
  }

  return tips;
}

// ─── Road condition description ───
function getRoadDescription(distance: number, via: string[], fromName: string, toName: string): string {
  const highway = via.find(v => v.startsWith('NH')) || '';
  const hasHighway = highway.length > 0;

  if (distance < 50) {
    return `The road from ${fromName} to ${toName} is primarily city/urban road. Traffic may be heavy during peak hours (8–10 AM and 5–8 PM). Our experienced drivers are familiar with the best shortcuts and alternative routes to minimize travel time.`;
  }

  if (hasHighway) {
    return `The ${fromName} to ${toName} route primarily follows ${highway}, which is a well-maintained national highway with good road conditions throughout the year. The road is a mix of 4-lane and 6-lane expressway in most stretches, making it comfortable for travel in our AC vehicles. ${via.length > 1 ? `The route passes through ${via.filter(v => !v.startsWith('NH')).join(', ')}, where you can take short breaks.` : ''} Our drivers are experienced with this route and know the best lanes, toll plazas, and rest points.`;
  }

  if (distance < 200) {
    return `The ${fromName} to ${toName} route follows state highways and national highways with generally good road conditions. Some stretches may have ongoing construction, but our drivers are well-versed with alternative routes. The road quality is suitable for all our vehicle types including sedans and SUVs.`;
  }

  return `The ${fromName} to ${toName} route covers ${distance} km through a mix of national and state highways. Road conditions are generally good, with well-maintained stretches on the national highways. Our professional drivers are experienced with this route and ensure a safe, comfortable journey. The route passes through some scenic landscapes and small towns where you can stop for refreshments.`;
}

// ─── Generate booking steps ───
function getBookingSteps(fromName: string, toName: string): { step: number; title: string; description: string }[] {
  return [
    {
      step: 1,
      title: 'Contact Us',
      description: `Call us at ${BUSINESS.phone} or send a WhatsApp message. Tell us you need a cab from ${fromName} to ${toName}.`,
    },
    {
      step: 2,
      title: 'Share Trip Details',
      description: `Share your pickup address in ${fromName}, travel date, preferred time, number of passengers, and any special requirements (child seat, extra luggage space, etc.).`,
    },
    {
      step: 3,
      title: 'Choose Your Vehicle',
      description: `Select from our fleet — Sedan (Swift Dzire, Honda Amaze), SUV (Ertiga, Innova Crysta), or Tempo Traveller based on your group size and budget.`,
    },
    {
      step: 4,
      title: 'Get Instant Confirmation',
      description: `Receive booking confirmation on WhatsApp within 2 minutes with driver name, phone number, vehicle details, and exact fare breakdown.`,
    },
    {
      step: 5,
      title: 'Enjoy Your Ride',
      description: `Our verified driver arrives at your pickup location 15 minutes before scheduled time. Sit back and enjoy a comfortable, safe journey from ${fromName} to ${toName}.`,
    },
  ];
}

function getSlugHash(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    // Weighted hash for better distribution across 16 templates
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// ─── Highway-specific content lookup ───────────────────────────────────────────
// Makes route pages with the same highway genuinely unique from each other.
const HIGHWAY_NOTES: Record<string, string> = {
  'NH-16': 'NH-16 (the Kolkata–Bhubaneswar National Highway) is a 6-lane expressway with well-maintained toll plazas at Kolaghat, Kharagpur, and Bhubaneswar. It\'s one of the busiest freight and passenger corridors in Eastern India.',
  'NH-12': 'NH-12 connects West Bengal with Bihar through a mix of 2-lane and 4-lane stretches. The highway passes through lush paddy fields and riverside towns, making it a scenic though sometimes slow route.',
  'NH-19': 'NH-19 (the Grand Trunk Road) is one of India\'s oldest highways, connecting Kolkata with Delhi via Patna, Varanasi, and Agra. The route is well-maintained with regular toll plazas and fuel stations.',
  'NH-33': 'NH-33 (Jamshedpur–Ranchi National Highway) is a key arterial route through Jharkhand\'s industrial heartland. The 2-lane highway passes through forested terrain and has been undergoing widening in recent years.',
  'NH-49': 'NH-49 connects Ranchi with Kolkata through the Jharkhand plateau. The route features steep ghats and tribal villages, making it picturesque but requiring experienced drivers familiar with ghat road conditions.',
  'NH-6': 'NH-6 (now renumbered as part of NH-16/NH-27) was the historic Mumbai–Kolkata highway. The Kolkata–Dhanbad stretch via this corridor features 4-lane divided roads with regular rest stops.',
  'NH-75': 'NH-75 connects Ranchi with Deoghar through the scenic Jharkhand interior. The highway passes through tribal regions with unique cultural landscapes.',
  'NH-53': 'NH-53 (the Sambalpur–Jagdalpur corridor) connects Odisha\'s interior with national routes. It features varied terrain including hills and river crossings.',
  'NH-5': 'NH-5 is a key route in Odisha, connecting Bhubaneswar with Berhampur and the southern coast. The highway follows the Eastern Ghats coastline with beautiful sea views near Puri.',
};

// Get highway-specific note for a route's via array
function getHighwayNote(via: string[]): string | null {
  if (!via || via.length === 0) return null;
  for (const point of via) {
    if (point.startsWith('NH-') || point.startsWith('NH ')) {
      const key = point.trim().replace(/\s+/g, '-');
      if (HIGHWAY_NOTES[key]) return HIGHWAY_NOTES[key];
    }
  }
  return null;
}

// State-crossing specific content for inter-state routes
function getStateCrossingNote(fromState: string, toState: string, fromName: string, toName: string): string | null {
  if (!fromState || !toState || fromState === toState) return null;

  const pair = [fromState, toState].sort().join('|');
  const notes: Record<string, string> = {
    'jharkhand|west-bengal': `The ${fromName}–${toName} route crosses the West Bengal–Jharkhand state border. This is one of the most heavily-traveled inter-state corridors in Eastern India, with thousands of commuters and business travelers making this journey daily. Toll charges for the border stretch are included in our upfront quote.`,
    'odisha|west-bengal': `The ${fromName}–${toName} route crosses the Odisha–West Bengal state border along the NH-16 (Kolkata–Bhubaneswar) corridor. This is a well-maintained 4-6 lane expressway with multiple toll booths. Our fare quote includes all toll estimates for this inter-state crossing.`,
    'bihar|west-bengal': `The ${fromName}–${toName} journey crosses the Bihar–West Bengal state boundary. The highway connects the Gangetic plains of Bihar with West Bengal's river delta region — a scenic route through agricultural landscapes. Our drivers are experienced with inter-state documentation requirements.`,
    'bihar|jharkhand': `The ${fromName} to ${toName} route crosses the Bihar–Jharkhand border through forested and hilly terrain. Jharkhand was carved out of Bihar in 2000, and this inter-state corridor connects the Jharkhand plateau with the Bihar plains.`,
    'jharkhand|odisha': `The ${fromName}–${toName} route connects Jharkhand's tribal highlands with Odisha. This inter-state corridor passes through some of India's richest mineral regions and forested landscapes.`,
    'odisha|uttar-pradesh': `The ${fromName} to ${toName} journey is a long inter-state route crossing Odisha, Jharkhand or Chhattisgarh, and into Uttar Pradesh. Our Innova Crysta or SUV is the recommended vehicle for this multi-state, multi-day journey.`,
    'uttar-pradesh|west-bengal': `The ${fromName}–${toName} route is a major inter-state connection between Eastern UP and West Bengal. This historic Grand Trunk Road corridor passes through several state capitals and major cities.`,
  };

  return notes[pair] || `The ${fromName} to ${toName} route is an inter-state journey connecting ${fromState.replace(/-/g, ' ')} with ${toState.replace(/-/g, ' ')}. Our drivers are experienced with the inter-state highway network and can handle all routing, toll, and documentation requirements.`;
}

/**
 * Detects if this is the "reverse" direction of a route pair.
 * A route is considered reverse if its fromCity slug comes after toCity slug alphabetically.
 * This ensures A→B and B→A get different template variants and content angles.
 */
function isReverseRoute(from: string, to: string): boolean {
  return from > to;
}

// ─── Generate unique "About" description for route ───
function getRouteAboutContent(input: RouteContentInput): string[] {
  const { route, fromCity, toCity, fromStateName, toStateName } = input;
  const paragraphs: string[] = [];
  const hash = getSlugHash(route.slug);
  // Reverse routes get +8 offset — doubled from 4 because we now have 16 templates.
  // Forward range: 0–7. Reverse range: 8–15. Guarantees structurally different P1/P2/P5.
  const reverseOffset = isReverseRoute(route.from, route.to) ? 8 : 0;
  const templateIndex = (hash + reverseOffset) % 16;

  // ─── Paragraph 1 (16 structurally distinct angles) ───────────────────────────
  // Templates 0–7: forward route angles
  // Templates 8–15: reverse route angles (different rhetorical framing)
  const p1Templates: string[] = [
    // 0 — General traveler (planning framing)
    `Looking to travel from ${route.fromName} to ${route.toName} by cab? The road distance is approximately ${route.distance} km, and the journey takes around ${route.duration} hours in a comfortable AC vehicle. ${BUSINESS.name} offers one-way and round-trip taxi service on this route starting from just ₹${route.priceSaloon} for a sedan${fromStateName && toStateName && fromStateName !== toStateName ? `, connecting ${fromStateName} and ${toStateName}` : ''}. Choose from sedans, SUVs, Innova Crysta, or Tempo Travellers — all with police-verified drivers and transparent pricing. Call ${BUSINESS.phone} for instant booking.`,
    // 1 — Budget traveler (cost-first framing)
    `Comparing costs for your ${route.fromName} to ${route.toName} trip? Here's what you should know: a private AC cab from ${BUSINESS.name} costs just ₹${route.priceSaloon} for a Sedan — far more convenient than public transport for a ${route.distance} km journey taking ${route.duration} hours. Unlike ride-hailing apps, we offer no surge pricing and a fixed fare guarantee. One-way, round trip, and multi-day packages all available. Call ${BUSINESS.phone} for a custom quote.`,
    // 2 — Urgency / last-minute framing
    `Need a cab from ${route.fromName} to ${route.toName} today? ${BUSINESS.name} handles last-minute bookings on this ${route.distance} km route with instant driver allocation in under 2 minutes. Sedan fares start at ₹${route.priceSaloon}; SUVs from ₹${route.priceSuv} — all-inclusive, no surge. Our 24/7 team confirms your booking immediately with driver details on WhatsApp. Call ${BUSINESS.phone} right now.`,
    // 3 — Tourist/sightseeing framing
    `Heading from ${route.fromName} to ${route.toName} for tourism or leisure? ${BUSINESS.name} makes your journey part of the experience. The ${route.distance} km drive — taking about ${route.duration} hours — takes you through some beautiful terrain${fromStateName && toStateName && fromStateName !== toStateName ? ` crossing from ${fromStateName} into ${toStateName}` : ''}. Our drivers double as informal guides, knowing the best stops, viewpoints, and local food joints along the way. Sedan from ₹${route.priceSaloon}. Call ${BUSINESS.phone}.`,
    // 4 — Business/corporate framing
    `For business travelers needing reliable transport from ${route.fromName} to ${route.toName}: ${BUSINESS.name} provides corporate-grade cab service with fixed fares (Sedan ₹${route.priceSaloon}, SUV ₹${route.priceSuv}) covering ${route.distance} km in ${route.duration} hours. Get GST invoices, advance booking confirmation, and punctual drivers who prioritize your schedule. No unpredictable surge pricing. Multiple payment options including NEFT. Call ${BUSINESS.phone} for corporate bookings.`,
    // 5 — Family/group framing
    `Traveling as a family or group from ${route.fromName} to ${route.toName}? Our spacious Ertiga SUV (6 passengers, ₹${route.priceSuv}) and Innova Crysta (7 passengers) make the ${route.distance} km, ${route.duration}-hour journey comfortable for everyone. For larger groups, our 12-seater Tempo Traveller starts at ₹${route.priceTempo}. AC throughout, ample boot space, no compromise on comfort. ${BUSINESS.name} — the family traveler's first choice. Call ${BUSINESS.phone}.`,
    // 6 — Medical/hospital framing (empathetic tone)
    `If you're traveling from ${route.fromName} to ${route.toName} for medical reasons or a hospital visit, ${BUSINESS.name} ensures a calm, comfortable, and reliable journey. Our Sedans from ₹${route.priceSaloon} offer a clean, air-conditioned cabin; our SUVs from ₹${route.priceSuv} provide extra space for a companion and medical equipment. Drivers are trained to drive smoothly and follow your timing requirements. The ${route.distance} km route takes approximately ${route.duration} hours. Call ${BUSINESS.phone} for priority booking.`,
    // 7 — Pilgrimage/religious framing
    `Planning a pilgrimage or religious visit from ${route.fromName} to ${route.toName}? ${BUSINESS.name} offers calm, respectful cab service for this ${route.distance} km journey (approximately ${route.duration} hours). Our drivers are familiar with religious protocols and can accommodate early-morning departures, extended waiting times at temples and ghats, and multiple stops along the route. Sedan from ₹${route.priceSaloon}, Innova Crysta from ₹${route.priceSuv}. Call ${BUSINESS.phone} for advance booking.`,
    // 8 — Reverse route: arrival/departure angle
    `Just arrived in ${route.fromName} and need to reach ${route.toName}? ${BUSINESS.name} provides immediate airport, station, and hotel pickup for your onward journey — a ${route.distance} km trip taking ${route.duration} hours. Sedan starts at ₹${route.priceSaloon}${fromStateName && toStateName && fromStateName !== toStateName ? `, covering the ${fromStateName}–${toStateName} corridor` : ''}. Our driver meets you with a name board, helps with luggage, and navigates the fastest route. No waiting, no surge. Call ${BUSINESS.phone}.`,
    // 9 — Reverse route: return journey angle
    `Heading back from ${route.fromName} to ${route.toName}? Book your return cab with ${BUSINESS.name} before you're ready to leave — we hold your booking with no advance payment required. The return trip covers ${route.distance} km and typically takes ${route.duration} hours. Sedan at ₹${route.priceSaloon}, SUV at ₹${route.priceSuv}. Our driver picks you up from your hotel, guest house, or any location in ${route.fromName}. Call ${BUSINESS.phone} anytime.`,
    // 10 — Reverse route: outstation from B framing
    `Need an outstation cab from ${route.fromName} to ${route.toName}? ${BUSINESS.name} operates reliable one-way and round-trip taxi service on this ${route.distance} km route. Travel time: approximately ${route.duration} hours. Our fares are flat-rate: Sedan ₹${route.priceSaloon}, SUV ₹${route.priceSuv}, Tempo Traveller ₹${route.priceTempo} — all including fuel and driver. No surge pricing, no hidden charges. Call ${BUSINESS.phone} for instant booking.`,
    // 11 — Reverse route: budget comparison angle
    `What does it cost to go from ${route.fromName} to ${route.toName} by cab? With ${BUSINESS.name}, a one-way Sedan cab costs just ₹${route.priceSaloon} for the entire ${route.distance} km journey. Split across 3-4 passengers, that's significantly cheaper than train or bus for comparable comfort — and you travel door-to-door without luggage hassles. SUV from ₹${route.priceSuv} for larger groups. Call ${BUSINESS.phone} to confirm today's availability.`,
    // 12 — Reverse route: local hub departure angle
    `Leaving ${route.fromName} for ${route.toName}? Our cab service from ${route.fromName} covers all major pickup points — hotels, railway stations, bus stands, and residential areas — for the ${route.distance} km journey to ${route.toName}. Estimated travel time: ${route.duration} hours. ${BUSINESS.name} offers Sedan (₹${route.priceSaloon}), SUV (₹${route.priceSuv}), and Tempo Traveller (₹${route.priceTempo}) with all-inclusive flat-rate pricing. Call ${BUSINESS.phone}.`,
    // 13 — Reverse route: convenience/comfort angle
    `Why take a cab from ${route.fromName} to ${route.toName}? Because a private, AC car gives you complete control — depart when you want, stop where you like, and arrive fresh${route.duration.toString().includes('.') || parseFloat(route.duration.toString()) > 3 ? ` after the ${route.duration}-hour drive` : ''}. ${BUSINESS.name} charges a simple flat rate of ₹${route.priceSaloon} for Sedan and ₹${route.priceSuv} for SUV, with no surge pricing regardless of time or day. Book now by calling ${BUSINESS.phone}.`,
    // 14 — Reverse route: group/occasion angle
    `Planning a group trip from ${route.fromName} to ${route.toName}? ${BUSINESS.name}'s Tempo Traveller (12-seater at ₹${route.priceTempo}) is the perfect choice for weddings, family outings, corporate retreats, and pilgrimages. For smaller groups, our Ertiga SUV (6-seater, ₹${route.priceSuv}) or Innova Crysta offers premium comfort for the ${route.distance} km, ${route.duration}-hour journey. All vehicles are AC, sanitized before each trip. Call ${BUSINESS.phone}.`,
    // 15 — Reverse route: early morning/night departure angle
    `Need an early-morning or late-night cab from ${route.fromName} to ${route.toName}? ${BUSINESS.name} operates 24 hours a day, 7 days a week — no extra charges for odd hours. Whether your flight, train, or function requires a 3 AM start, our drivers arrive on time. Sedan fares from ₹${route.priceSaloon} for the ${route.distance} km trip. Same flat rate day or night. Call ${BUSINESS.phone} to schedule your departure time.`,
  ];
  paragraphs.push(p1Templates[templateIndex]);

  // ─── Paragraph 2 (16 vehicle/pricing angles) ─────────────────────────────────
  const p2Templates: string[] = [
    // 0
    `For the ${route.fromName} to ${route.toName} cab service, you can choose from multiple vehicle categories. Our Sedan category (Swift Dzire, Honda Amaze) starts at just ₹${route.priceSaloon} and is perfect for 1–3 passengers with moderate luggage. For families or groups, our SUV options (Ertiga, Innova, Innova Crysta) are available from ₹${route.priceSuv}, offering more space and comfort. For larger groups of 8–12 people, our Tempo Traveller starts at ₹${route.priceTempo} with ample luggage space. All fares include fuel and driver charges — no hidden costs, no surge pricing.`,
    // 1
    `Whether you prefer an economical Sedan or a spacious SUV, our fleet has the perfect vehicle for your ${route.fromName} to ${route.toName} trip. Clean, well-maintained Sedan cabs (Dzire, Amaze) start from ₹${route.priceSaloon} (ideal for small groups). For family outstation trips, we recommend our Ertiga or Innova Crysta SUVs starting at ₹${route.priceSuv}. Larger travel groups can book our comfortable 12-17 seater Tempo Traveller starting at ₹${route.priceTempo}. All our fares are inclusive of fuel and driver allowance, with absolute transparency.`,
    // 2
    `Our vehicle options for the ${route.fromName} to ${route.toName} taxi booking cater to all budgets. Fares start at a budget-friendly ₹${route.priceSaloon} for Sedan models like Swift Dzire, suitable for up to 4 passengers. For group or family travels, we offer 6-7 seater SUVs (Ertiga, Innova Crysta) starting at ₹${route.priceSuv}. For corporate outings or large families, our Tempo Traveller models start from ₹${route.priceTempo}. We maintain flat rates with no surge pricing, including fuel and driver fees.`,
    // 3
    `To travel from ${route.fromName} to ${route.toName}, choose from our diverse fleet options. We offer clean AC Sedans (Dzire, Amaze) starting at ₹${route.priceSaloon} for individual travelers or couples. For families needing extra legroom, our Ertiga and Innova Crysta SUVs are priced from ₹${route.priceSuv}. For larger groups, our 12-seater Tempo Travellers start from ₹${route.priceTempo}. Fares include driver allowance and fuel, meaning no surprise charges at the end.`,
    // 4
    `We provide a wide range of vehicles for your road trip from ${route.fromName} to ${route.toName}. Individual and corporate travelers can book our neat Sedans starting from ₹${route.priceSaloon}. Family groups can select from our Ertiga or premium Innova Crysta SUVs, available from ₹${route.priceSuv}. For group pilgrimages or tours, our Tempo Traveller starts at ₹${route.priceTempo}. Our billing is transparent, covering all driver allowances and fuel expenses upfront.`,
    // 5
    `Select the ideal ride for your ${route.fromName} to ${route.toName} journey from our standard vehicle categories. Fares start at ₹${route.priceSaloon} for comfortable AC Sedans, perfect for up to 4 passengers. For groups of 5-7, we recommend our reliable Ertiga and premium Toyota Innova Crysta starting at ₹${route.priceSuv}. For larger families or tour groups, our spacious Tempo Traveller starts at ₹${route.priceTempo}. Fares are fixed and include fuel and driver costs.`,
    // 6
    `Our fleet for the ${route.fromName} to ${route.toName} outstation route features vehicles for every budget. Our AC Sedans (Swift Dzire) start at ₹${route.priceSaloon} and are perfect for compact groups. For spacious travel, book an SUV (Ertiga or Innova Crysta) starting from ₹${route.priceSuv}. For large groups, our Tempo Traveller models are available starting at ₹${route.priceTempo}. Enjoy flat-rate pricing with driver and fuel charges included.`,
    // 7
    `Whether booking a sedan for a business trip or an SUV for a family vacation from ${route.fromName} to ${route.toName}, we have you covered. Our Dzire sedan starts from ₹${route.priceSaloon}, Ertiga and Innova Crysta SUVs start at ₹${route.priceSuv}, and 12-15 seater Tempo Travellers start at ₹${route.priceTempo}. Fares are all-inclusive of fuel and driver fees with flat-rate guarantee.`,
    // 8 — Innova-first framing
    `For the ${route.fromName}–${route.toName} journey, many of our customers prefer the Toyota Innova Crysta for its superior legroom, powerful AC, and captain seats. Innova Crysta fares for this ${route.distance} km route start at approximately ₹${Math.round(route.priceSuv * 1.15)}. For tighter budgets, our Swift Dzire Sedan at ₹${route.priceSaloon} offers clean, air-conditioned comfort for 1–4 passengers. Tempo Traveller (12-seater) starts at ₹${route.priceTempo} for group bookings. All prices are flat-rate with no hidden extras.`,
    // 9 — Per-passenger cost framing
    `A private cab from ${route.fromName} to ${route.toName} is more affordable than you might think. At ₹${route.priceSaloon} for a Sedan (4 passengers), the per-head cost is just ₹${Math.round(route.priceSaloon / 4)} per person — comparable to a train ticket, but door-to-door. Our SUV at ₹${route.priceSuv} works out to ₹${Math.round(route.priceSuv / 6)} per head for 6 passengers. Larger groups using our Tempo Traveller (₹${route.priceTempo}, 12 seats) pay as little as ₹${Math.round(route.priceTempo / 12)} per person. No surge pricing. Ever.`,
    // 10 — Luggage-first framing
    `Traveling with heavy luggage from ${route.fromName} to ${route.toName}? Our Sedans (Swift Dzire, Honda Amaze) have a spacious 460L boot — two large suitcases fit easily alongside cabin bags. Our SUVs (Ertiga, Innova Crysta) at ₹${route.priceSuv} can handle 4–6 bags with ease. For group travel with lots of luggage, our Tempo Traveller (₹${route.priceTempo}) has a massive cargo area. No luggage restrictions, no extra charges for baggage. Sedan from ₹${route.priceSaloon}.`,
    // 11 — Vehicle-by-occasion framing
    `Choosing the right vehicle for your ${route.fromName} to ${route.toName} trip depends on your occasion: for a business meeting, our Swift Dzire Sedan (₹${route.priceSaloon}) offers a professional, comfortable ride; for a family holiday, the Innova Crysta (₹${Math.round(route.priceSuv * 1.15)}) provides premium comfort; for a wedding or reception, we offer decorated Innovas with chauffeur service; for a pilgrimage group, our 12-seater Tempo Traveller (₹${route.priceTempo}) is ideal. All vehicles are AC and GPS-tracked.`,
    // 12 — Night travel safety angle
    `Concerned about night travel from ${route.fromName} to ${route.toName}? ${BUSINESS.name} provides verified, experienced drivers who are specifically trained for highway night driving. Our vehicles have GPS tracking (sharable with family), functioning headlights, and working AC throughout. Sedan night fare: ₹${route.priceSaloon} (same as daytime — no night surcharge). SUV: ₹${route.priceSuv}. Tempo: ₹${route.priceTempo}. We confirm all night bookings with driver details 24 hours in advance.`,
    // 13 — Return trip value framing
    `If you're planning to come back from ${route.toName} to ${route.fromName} as well, our round-trip package is significantly more economical than two separate one-way bookings. Round-trip Sedan on the ${route.fromName}–${route.toName} route starts at approximately ₹${Math.round(route.priceSaloon * 1.8)} — that's less than 2× the one-way fare because the driver waits for you. SUV round trip from ₹${Math.round(route.priceSuv * 1.8)}. Ideal for day trips, temple visits, and hospital consultations where you need a return the same day.`,
    // 14 — Transparency/trust framing
    `What you pay for the ${route.fromName} to ${route.toName} cab is exactly what you quoted — ₹${route.priceSaloon} for Sedan, ₹${route.priceSuv} for SUV, ₹${route.priceTempo} for Tempo Traveller. These fares cover fuel and driver. The only additional items are toll (typically ₹${route.distance < 150 ? '50–200' : route.distance < 300 ? '150–350' : '300–600'}) and parking, which our driver tells you upfront before departure. No meter, no surge, no end-of-trip surprises. ${BUSINESS.name} — transparent pricing since ${BUSINESS.foundYear}.`,
    // 15 — Multi-city/stopover framing
    `Traveling from ${route.fromName} to ${route.toName} with stops along the way? ${BUSINESS.name} supports custom multi-stop itineraries at no extra fare for planned stops under 30 minutes. Sedan (₹${route.priceSaloon}), SUV (₹${route.priceSuv}), and Tempo Traveller (₹${route.priceTempo}) are all available for this ${route.distance} km route. Long stops (e.g., 2+ hours at a temple or hospital) incur a standard driver waiting charge of ₹150/hour. We plan your entire trip — just tell us your stops when booking.`,
  ];
  paragraphs.push(p2Templates[templateIndex]);

  // Paragraph 2.5: Highway-specific note (unique per highway)
  // This is a key differentiator — routes via the same highway get the same note,
  // but routes via different highways get genuinely different highway descriptions.
  const highwayNote = getHighwayNote(route.via);
  if (highwayNote) {
    paragraphs.push(`**About this route's highway:** ${highwayNote} ${route.via.filter(v => !v.startsWith('NH')).length > 0 ? `The route also passes through ${route.via.filter(v => !v.startsWith('NH')).join(', ')}.` : ''}`);
  }

  // Paragraph 2.6: State-crossing note (unique per state pair)
  // Inter-state routes get context about crossing state borders — genuinely unique content
  const stateCrossingNote = getStateCrossingNote(
    route.fromState || '',
    route.toState || '',
    route.fromName,
    route.toName
  );
  if (stateCrossingNote) {
    paragraphs.push(stateCrossingNote);
  }

  // Paragraph 3 & 4: City content — Fix #2 & #9
  // Forward routes: lead with destination (you're going TO it — tourist appeal)
  // Reverse routes: lead with source city (you're departing FROM it — departure context)
  const isReverse = isReverseRoute(route.from, route.to);

  if (!isReverse) {
    // Forward route — destination-first angle
    if (toCity && toCity.tourist && toCity.landmarks && toCity.landmarks.length > 0) {
      paragraphs.push(
        `${route.toName} is a wonderful destination${toStateName ? ` in ${toStateName}` : ''} known for its rich heritage and attractions. When you arrive by cab from ${route.fromName}, you can explore famous places like ${toCity.landmarks.join(', ')}. ${toCity.description} Our drivers are familiar with all tourist spots in ${route.toName} and can suggest the best itinerary for your visit.`
      );
    } else if (toCity) {
      paragraphs.push(
        `${route.toName} is ${toCity.tourist ? 'a popular destination' : 'an important city'} in ${toStateName || 'the region'}. ${toCity.description} Our cab service provides convenient door-to-door transfers from ${route.fromName} to any location within ${route.toName} including ${toCity.landmarks ? toCity.landmarks.slice(0, 3).join(', ') : 'all major areas'}, railway station, bus stand, and residential areas.`
      );
    }
    // Source city pickup context
    if (fromCity) {
      const pickupPoints = [];
      if (fromCity.airport) pickupPoints.push(fromCity.airport);
      if (fromCity.railway) pickupPoints.push(fromCity.railway);
      if (fromCity.landmarks) pickupPoints.push(...fromCity.landmarks.slice(0, 3));
      paragraphs.push(
        `Our cab picks you up from anywhere in ${route.fromName}${pickupPoints.length > 0 ? ` including ${pickupPoints.slice(0, 4).join(', ')}` : ''}. ${fromCity.airport ? `Arriving by flight at ${fromCity.airport}? Our driver tracks your flight and waits at the arrival gate — no extra charge for delays.` : ''} ${fromCity.railway ? `For pickups from ${fromCity.railway}, our driver will be at the exit gate at your scheduled time.` : ''}`
      );
    }
  } else {
    // Reverse route — departure-first angle (you're leaving FROM this city)
    if (fromCity) {
      const pickupPoints = [];
      if (fromCity.airport) pickupPoints.push(fromCity.airport);
      if (fromCity.railway) pickupPoints.push(fromCity.railway);
      if (fromCity.landmarks) pickupPoints.push(...fromCity.landmarks.slice(0, 4));
      const fromDesc = fromCity.tourist && fromCity.description
        ? `${route.fromName} — ${fromCity.description.split('.')[0]}. `
        : `${route.fromName} is a major city in ${fromStateName || 'the region'}. `;
      paragraphs.push(
        `${fromDesc}Our cab service departs from all areas of ${route.fromName}${pickupPoints.length > 0 ? ` including ${pickupPoints.join(', ')}` : ''}. ${fromCity.airport ? `Flight passengers at ${fromCity.airport} can book our airport-to-${route.toName} cab with meet-and-greet service.` : ''} ${fromCity.railway ? `Pickups from ${fromCity.railway} available 24/7 — our driver will meet you at the station exit.` : ''}`
      );
    }
    // Destination context for reverse route
    if (toCity) {
      const dropPoints = [];
      if (toCity.airport) dropPoints.push(toCity.airport);
      if (toCity.railway) dropPoints.push(toCity.railway);
      if (toCity.landmarks) dropPoints.push(...toCity.landmarks.slice(0, 3));
      paragraphs.push(
        `${route.toName} is your destination${toStateName ? ` in ${toStateName}` : ''}. ${toCity.description ? toCity.description.split('.')[0] + '.' : ''} We offer door-to-door drop to any location in ${route.toName}${dropPoints.length > 0 ? ` including ${dropPoints.join(', ')}` : ''}. ${toCity.tourist ? `If you plan to visit local tourist spots, let our driver know — they can guide you to the best routes.` : ''}`
      );
    }
  }

  // ─── Paragraph 5: Service commitment (16 distinct trust angles) ────────────────
  const p5Templates: string[] = [
    // 0 — List-based trust signals
    `${BUSINESS.name} has been providing trusted cab services since ${BUSINESS.foundYear}. On the ${route.fromName} to ${route.toName} route, we ensure: (1) Clean, sanitized AC vehicles with regular maintenance checks, (2) Professional, police-verified drivers with 5+ years of experience on this route, (3) Transparent pricing with no hidden charges — toll and parking are communicated upfront, (4) Flexible payment options including Cash, UPI (Google Pay, PhonePe), Credit/Debit Cards, and Bank Transfer, (5) Free cancellation up to 4 hours before the scheduled pickup time. Book your ${route.fromName} to ${route.toName} cab now by calling ${BUSINESS.phone} or sending a WhatsApp message for instant confirmation.`,
    // 1 — Reputation/safety angle
    `Since ${BUSINESS.foundYear}, ${BUSINESS.name} has built a strong reputation for safe and reliable road transport. When booking your ${route.fromName} to ${route.toName} taxi with us, you get professional highway-certified drivers, clean sanitized AC cars, and a transparent pricing model. We support flexible online payments (UPI, Card, Cash) and offer a free 4-hour cancellation policy. Reserve your cab on the ${route.fromName}–${route.toName} route by calling ${BUSINESS.phone} or booking on WhatsApp for instant coordination.`,
    // 2 — Why choose us angle
    `Why choose ${BUSINESS.name} for your travel from ${route.fromName} to ${route.toName}? With operations since ${BUSINESS.foundYear}, we focus on customer safety and convenience. We guarantee experienced drivers with valid commercial licenses, well-maintained AC cars, flat rates with zero surge pricing, and multiple payment options (GPay, PhonePe, Cards, Cash). Enjoy a stress-free journey with free cancellations up to 4 hours before your ride. Call us on ${BUSINESS.phone} to secure your booking today.`,
    // 3 — Legacy/trust angle
    `With a legacy of service since ${BUSINESS.foundYear}, ${BUSINESS.name} is the top choice for travelers heading from ${route.fromName} to ${route.toName}. We stand out by offering clean AC cars, professional drivers who know the highways, flat rates without surge pricing, and easy payment via UPI, Cash, or Card. Enjoy the flexibility of free cancellation up to 4 hours before pickup. Book instantly by dialing ${BUSINESS.phone} or sending us a message on WhatsApp.`,
    // 4 — Safety-first angle
    `At ${BUSINESS.name}, we are committed to making your ${route.fromName} to ${route.toName} travel safe and enjoyable. Active since ${BUSINESS.foundYear}, we offer police-verified drivers, regularly sanitised AC sedans and SUVs, upfront billing with no hidden fees, and standard cancellation policies. We accept UPI, bank transfers, cards, and cash. Speak to our team at ${BUSINESS.phone} or connect on WhatsApp for immediate booking.`,
    // 5 — Stress-free/convenience angle
    `Choose ${BUSINESS.name} for a stress-free outstation trip from ${route.fromName} to ${route.toName}. Serving customers since ${BUSINESS.foundYear}, we provide well-maintained commercial vehicles, drivers with extensive highway route expertise, flat rates, and hassle-free payment methods. Plus, you get free cancellation up to 4 hours before departure. Call us at ${BUSINESS.phone} or drop a message on WhatsApp for 2-minute booking confirmation.`,
    // 6 — Customer satisfaction angle
    `Customer satisfaction has been our priority at ${BUSINESS.name} since ${BUSINESS.foundYear}. For your taxi booking from ${route.fromName} to ${route.toName}, we deliver clean, sanitised vehicles, professional chauffeurs, fixed rates with no peak-hour surge, and convenient payment options (UPI, Cash, Cards). Cancel for free up to 4 hours prior to travel. Call ${BUSINESS.phone} or WhatsApp us to get started.`,
    // 7 — Regional leader angle
    `Experience the reliability of East India's leading car rental brand. Since ${BUSINESS.foundYear}, ${BUSINESS.name} has been connecting ${route.fromName} and ${route.toName} with premium cab services. We offer verified drivers, fully functional AC vehicles, transparent billing, and 24/7 customer support. Enjoy zero cancellation fees up to 4 hours before your trip. Reach us at ${BUSINESS.phone} or WhatsApp us for instant confirmation.`,
    // 8 — Driver expertise angle (new)
    `Our drivers on the ${route.fromName}–${route.toName} route aren't just hired hands — they're experienced road professionals who have driven this specific ${route.distance} km corridor hundreds of times. They know the best toll booths, rest stops, dhabas, and fuel stations along the way. ${BUSINESS.name} has been operating since ${BUSINESS.foundYear} and every driver undergoes background verification and a commercial license check. Flat Sedan fare: ₹${route.priceSaloon}. Call ${BUSINESS.phone}.`,
    // 9 — Technology/GPS tracking angle (new)
    `${BUSINESS.name} equips every vehicle on the ${route.fromName} to ${route.toName} route with GPS tracking, so you — and your family — can follow the journey in real-time. All driver allocations are confirmed via WhatsApp with vehicle number and driver contact. Operating since ${BUSINESS.foundYear}, we've completed over 5,000 intercity trips across Eastern India. Transparent billing: Sedan ₹${route.priceSaloon}, no surge ever. Book at ${BUSINESS.phone}.`,
    // 10 — Payment flexibility angle (new)
    `Booking flexibility matters. ${BUSINESS.name} takes zero advance payment for most trips — pay the full ₹${route.priceSaloon} (Sedan) directly to the driver after your ${route.fromName} to ${route.toName} journey. Alternatively, prepay via UPI (Google Pay, PhonePe, Paytm), NEFT, or credit/debit card for corporate trips. Free cancellation up to 4 hours before pickup with zero questions asked. Serving since ${BUSINESS.foundYear}. Contact us at ${BUSINESS.phone}.`,
    // 11 — Speed of confirmation angle (new)
    `When you call ${BUSINESS.phone} to book a cab from ${route.fromName} to ${route.toName}, you typically receive driver confirmation within 2 minutes — not hours. We allocate from our network of verified local drivers, ensuring a nearby car is always available. ${BUSINESS.name} has operated this service since ${BUSINESS.foundYear}. Sedan at ₹${route.priceSaloon}, all-inclusive. For urgent or same-hour bookings, we still guarantee driver allocation within 30 minutes.`,
    // 12 — Comparison vs app-based cabs (new)
    `Unlike Ola and Uber, ${BUSINESS.name} offers fixed fares for the ${route.fromName} to ${route.toName} route — ₹${route.priceSaloon} for Sedan, ₹${route.priceSuv} for SUV. No surge during festival season, no 3× pricing on rainy days, no demand-based fluctuations. Our drivers also don't cancel on you at the last minute. Operating since ${BUSINESS.foundYear}, we've built repeat business on trust and consistency. Verify our rates by calling ${BUSINESS.phone} right now.`,
    // 13 — Hygiene/cleanliness angle (new)
    `Every vehicle dispatched by ${BUSINESS.name} for the ${route.fromName} to ${route.toName} trip is sanitized before your boarding — interior wiped down, AC filter cleaned monthly, and seat covers washed weekly. We've maintained this standard since ${BUSINESS.foundYear}. Our Sedan, SUV, and Tempo Traveller fleet is serviced at authorized workshops every 5,000 km. You get a car that looks and smells clean, not a random pickup off the street. Book at ₹${route.priceSaloon} (Sedan). Call ${BUSINESS.phone}.`,
    // 14 — Advance booking reliability angle (new)
    `Planning your ${route.fromName} to ${route.toName} trip well in advance? ${BUSINESS.name} accepts bookings up to 30 days ahead with no deposit required. Your slot is confirmed with driver allocation 24 hours before departure. We've been operating intercity cab services since ${BUSINESS.foundYear} and have served thousands of pre-planned trips — weddings, hospital appointments, airport transfers, and family functions. Flat Sedan rate: ₹${route.priceSaloon}. Call ${BUSINESS.phone} or WhatsApp to schedule.`,
    // 15 — Value comparison: per-km angle (new)
    `On a per-kilometre basis, ${BUSINESS.name}'s ${route.fromName} to ${route.toName} cab costs approximately ₹${Math.round(route.priceSaloon / route.distance)}/km for a Sedan — competitive with any private cab operator in Eastern India, and far below surge-priced ride-hailing alternatives on busy days. Established since ${BUSINESS.foundYear}, our pricing model is simple: you pay ₹${route.priceSaloon} flat, the driver gets fuel and allowance, and you get a clean AC vehicle from door to door. Call ${BUSINESS.phone}.`,
  ];
  paragraphs.push(p5Templates[templateIndex]);

  return paragraphs;
}

// ─── Extended FAQs for route pages ───
export function getRouteExtendedFAQs(input: RouteContentInput): { question: string; answer: string }[] {
  const { route, fromCity, toCity } = input;
  const faqs: { question: string; answer: string }[] = [];

  // Core FAQs (existing ones enhanced)
  faqs.push(
    {
      question: `What is the cab fare from ${route.fromName} to ${route.toName}?`,
      answer: `The cab fare from ${route.fromName} to ${route.toName} starts at ₹${route.priceSaloon} for Sedan (Swift Dzire, Honda Amaze), ₹${route.priceSuv} for SUV (Ertiga, Innova Crysta), and ₹${route.priceTempo} for Tempo Traveller (12-seater). All fares include fuel and driver charges. Toll and parking are extra but communicated upfront. Call ${BUSINESS.phone} for an exact quote.`,
    },
    {
      question: `What is the distance from ${route.fromName} to ${route.toName} by road?`,
      answer: `The road distance from ${route.fromName} to ${route.toName} is approximately ${route.distance} km. The journey takes around ${route.duration} hours by car, depending on traffic and road conditions. ${route.via.length > 0 ? `The most common route passes through ${route.via.join(', ')}.` : 'Our drivers take the fastest and safest route available.'}`,
    },
    {
      question: `Is one-way cab available from ${route.fromName} to ${route.toName}?`,
      answer: `Yes! ${BUSINESS.name} provides one-way cab service from ${route.fromName} to ${route.toName}. You only pay for the one-way journey — no return fare is charged. One-way cab starts at ₹${route.priceSaloon} for Sedan. This is the most affordable option if you don't need a return trip.`,
    },
    {
      question: `What types of cars are available for ${route.fromName} to ${route.toName}?`,
      answer: `We offer multiple vehicle options: Sedan (Swift Dzire, Honda Amaze — 4 passengers, 2 bags), SUV (Maruti Ertiga — 6 passengers, 3 bags), Premium SUV (Toyota Innova Crysta — 7 passengers, 4 bags), Tempo Traveller (12-17 passengers, 10+ bags), and Luxury vehicles (Fortuner, Mercedes — on request). All vehicles are AC, clean, and well-maintained.`,
    },
    {
      question: `How do I book a cab from ${route.fromName} to ${route.toName}?`,
      answer: `Booking is simple! Call ${BUSINESS.phone} or send a WhatsApp message with your pickup location, travel date, time, and number of passengers. You'll receive instant confirmation with driver details within 2 minutes. Alternatively, fill out the booking form on this page. No app download required.`,
    },
  );

  // Extended FAQs for deeper content
  faqs.push(
    {
      question: `Is the ${route.fromName} to ${route.toName} road safe for night travel?`,
      answer: `${route.distance < 200 ? `Yes, the ${route.fromName}–${route.toName} route is generally safe for night travel, especially on the national highway stretches. Our drivers are experienced with night driving on this route.` : `For long-distance routes like ${route.fromName} to ${route.toName} (${route.distance} km), we recommend starting early morning for the most comfortable experience. However, night travel is possible — our drivers are experienced and the major highway stretches are well-lit.`} All our vehicles have GPS tracking, and you can share your live location with family for complete safety.`,
    },
    {
      question: `What are the toll charges from ${route.fromName} to ${route.toName}?`,
      answer: (() => {
        // Tiered toll estimates based on realistic NH toll plaza density in East India
        // (NH-6, NH-16, NH-2, NH-33, NH-49 corridors — avg ₹50–₹130 per car plaza)
        let minToll = 0, maxToll = 0;
        if (route.distance < 100) {
          minToll = 0; maxToll = 100;
        } else if (route.distance < 200) {
          minToll = 80; maxToll = 220;
        } else if (route.distance < 350) {
          minToll = 150; maxToll = 380;
        } else if (route.distance < 500) {
          minToll = 300; maxToll = 600;
        } else {
          minToll = 500; maxToll = 900;
        }
        return `Toll charges on the ${route.fromName} to ${route.toName} route vary by vehicle type. For a sedan, expect approximately ₹${minToll}–₹${maxToll} total across all toll plazas on this ${route.distance} km route${route.via.length > 0 ? ` via ${route.via.join(', ')}` : ''}. SUVs and Tempo Travellers pay slightly higher commercial toll rates. Our driver will inform you of exact toll amounts before departure, and FASTag-enabled vehicles get smooth, cashless passage. Toll charges are NOT included in the quoted cab fare.`;
      })(),
    },
    {
      question: `Can I book a round trip from ${route.fromName} to ${route.toName}?`,
      answer: `Yes! We offer round-trip cab service from ${route.fromName} to ${route.toName} and back. Round trip is more economical than booking two separate one-way trips. The driver stays with you in ${route.toName} and waits until you're ready to return. Driver's accommodation charges are included in round-trip fares. Call ${BUSINESS.phone} for round-trip pricing.`,
    },
    {
      question: `Do you offer ${route.fromName} to ${route.toName} cab for group/family travel?`,
      answer: `Absolutely! For group or family travel from ${route.fromName} to ${route.toName}, we recommend our SUV (6 passengers) or Tempo Traveller (12-17 passengers). Group booking discounts may be available on this route. All our vehicles have ample luggage space. Contact us at ${BUSINESS.phone} to get a special group travel quote.`,
    },
    {
      question: `What is the cancellation policy for ${route.fromName} to ${route.toName} cab?`,
      answer: `We offer hassle-free cancellation. Cancel free of charge up to 4 hours before the scheduled pickup time. Cancellations within 4 hours may attract a nominal charge. Refunds for prepaid bookings are processed within 24 hours. No questions asked — we understand plans can change.`,
    },
    {
      question: `Do you provide ${route.fromName} to ${route.toName} cab in Innova Crysta?`,
      answer: `Yes, Toyota Innova Crysta is available for the ${route.fromName} to ${route.toName} route at ₹${Math.round(route.priceSuv * 1.15)}. The Innova Crysta offers premium comfort with captain seats, spacious interiors, powerful AC, and extra luggage space. It's the most popular choice for family outstation trips. Book Innova Crysta by calling ${BUSINESS.phone}.`,
    },
  );

  // Airport-related FAQ
  if (fromCity?.airport || toCity?.airport) {
    faqs.push({
      question: `Do you provide airport pickup for ${route.fromName} to ${route.toName} trip?`,
      answer: `${fromCity?.airport ? `Yes, we provide pickup from ${fromCity.airport} in ${route.fromName}. Our driver tracks your flight status and waits at the arrival gate with a name board. No extra charge for flight delays.` : ''} ${toCity?.airport ? `We also offer drop-off at ${toCity.airport} in ${route.toName} if needed.` : ''} Airport pickup/drop is available 24/7 with no extra charges beyond the trip fare.`,
    });
  }

  // Railway station FAQ
  if (fromCity?.railway || toCity?.railway) {
    faqs.push({
      question: `Can I get picked up from the railway station for ${route.fromName} to ${route.toName}?`,
      answer: `Yes! ${fromCity?.railway ? `We pick up from ${fromCity.railway} in ${route.fromName}. Our driver will be waiting at the station exit at your scheduled time.` : ''} ${toCity?.railway ? `We also provide drop-off at ${toCity.railway} in ${route.toName}.` : ''} Station pickups are available 24/7 at no extra charge.`,
    });
  }

  return faqs;
}

// ─── Hindi/Hinglish FAQs for route pages ───
export function getRouteHindiFAQs(input: RouteContentInput): { question: string; answer: string; lang: string }[] {
  const { route } = input;
  return [
    {
      question: `${route.fromName} se ${route.toName} cab ka kiraya kitna hai?`,
      answer: `${route.fromName} se ${route.toName} cab ka kiraya Sedan (Swift Dzire) mein \u20B9${route.priceSaloon} se shuru hota hai. SUV (Ertiga, Innova) mein \u20B9${route.priceSuv} aur Tempo Traveller mein \u20B9${route.priceTempo} lagta hai. Saare fare mein fuel aur driver charges included hai. Toll aur parking alag hai. Call karein ${BUSINESS.phone}.`,
      lang: 'hi',
    },
    {
      question: `${route.fromName} se ${route.toName} kitna dur hai road se?`,
      answer: `${route.fromName} se ${route.toName} road distance lagbhag ${route.distance} km hai. Car se ${route.duration} ghante lagte hain.${route.via.length > 0 ? ` Route ${route.via.join(', ')} se hokar jaata hai.` : ''} ${BUSINESS.name} ka AC cab book karein comfortable journey ke liye.`,
      lang: 'hi',
    },
    {
      question: `${route.fromName} se ${route.toName} one way cab milta hai?`,
      answer: `Haan! ${BUSINESS.name} mein ${route.fromName} se ${route.toName} one way cab available hai. Sirf one way ka paisa lagta hai \u2014 return fare nahi lagta. One way Sedan cab \u20B9${route.priceSaloon} se start hota hai. Call karein ${BUSINESS.phone}.`,
      lang: 'hi',
    },
  ];
}

// ─── Seasonal & Festival Travel Guide ───
function getSeasonalContent(fromName: string, toName: string, fromState: string, toState: string): string | null {
  const fLower = fromName.toLowerCase();
  const tLower = toName.toLowerCase();

  // 1. Hills / Darjeeling/Sikkim (West Bengal Hills)
  if (tLower.includes('darjeeling') || tLower.includes('kalimpong') || tLower.includes('gangtok') || tLower.includes('siliguri')) {
    return `🌸 **Spring & Autumn Peak (March–May, October–November)**: This is the absolute best time to visit Darjeeling and Gangtok. The skies are clear, offering breathtaking views of Kanchenjunga. Cabs are in high demand, so early booking is recommended.\n\n☔ **Monsoon Advisory (July–September)**: The Himalayan hills receive heavy rainfall. While beautiful, please factor in extra travel time due to occasional road diversions or minor landslides. Our hill-certified drivers ensure safety first.\n\n❄️ **Winter Season (December–February)**: Beautifully cold, perfect for experiencing the chill and clear skies. Ensure you book your taxi from Siliguri to Darjeeling in advance as tourist numbers peak during Christmas and New Year.`;
  }

  // 2. Beach / Digha/Mandarmani/Puri
  if (tLower.includes('digha') || tLower.includes('mandarmani') || tLower.includes('puri') || tLower.includes('konark') || tLower.includes('bakkhali')) {
    return `☀️ **Best Time for Beaches (October to March)**: The weather is pleasant and cool, perfect for beach activities in Digha, Mandarmani, or Puri.\n\n🎡 **Rath Yatra Festival (June–July in Puri)**: Puri experiences a massive influx of devotees. If planning a cab trip to Puri during this time, we suggest booking at least 7 days in advance due to strict traffic diversions and high demand.\n\n🚗 **Weekend Getaways**: Kolkata to Digha/Mandarmani has high weekend traffic. Start early in the morning (around 5–6 AM) to enjoy a smooth highway drive on NH 16 and avoid weekend rush hour.`;
  }

  // 3. Pilgrimage / Mayapur/Nabadwip/Deoghar
  if (tLower.includes('mayapur') || tLower.includes('nabadwip') || tLower.includes('deoghar') || tLower.includes('tarapith')) {
    if (tLower.includes('deoghar')) {
      return `🔱 **Shravani Mela (July–August)**: Deoghar gets highly crowded during the holy month of Shravan. Police enforce one-way loops and bypass routes. Our drivers are local experts and navigate these redirections easily.\n\n❄️ **Winter Pilgrimage (October–February)**: Very comfortable weather for temple visits and religious tours.`;
    }
    return `🌸 **Festivals in Mayapur**: Gaura Purnima (Feb–March), Janmashtami (Aug–Sept), and Rash Yatra (November) are celebrated with grand celebrations. Book your cab from Kolkata to Mayapur in advance to secure your preferred Sedan or SUV.`;
  }

  // 4. Durga Puja / Festive Season (Kolkata connection)
  if (fLower.includes('kolkata') || tLower.includes('kolkata')) {
    return `🎉 **Durga Puja Festive Peak (September–October)**: Travel between Kolkata and nearby states/cities peaks as people return home. While other cab services apply heavy surge pricing, ${BUSINESS.name} guarantees flat, transparent fares. Book at least 3-5 days in advance.\n\n💼 **Chhath Puja Travel (November)**: Extremely high demand for routes connecting Kolkata to Ranchi, Patna, Dhanbad, and Jamshedpur. Devotees travel for rituals, making early taxi bookings essential.`;
  }

  return null;
}

// ─── Main export: Generate all route page content ───
export function generateRoutePageContent(input: RouteContentInput) {
  const { route, fromCity, toCity } = input;

  return {
    aboutContent: getRouteAboutContent(input),
    travelTips: getTravelTips(route.distance, route.fromName, route.toName, route.via),
    roadDescription: getRoadDescription(route.distance, route.via, route.fromName, route.toName),
    bookingSteps: getBookingSteps(route.fromName, route.toName),
    faqs: [...getRouteExtendedFAQs(input), ...getRouteHindiFAQs(input)],
    reverseRouteSlug: `${route.to}-to-${route.from}`,
    reverseRouteLabel: `${route.toName} to ${route.fromName}`,
    seasonalContent: getSeasonalContent(route.fromName, route.toName, route.fromState, route.toState),
    keyHighlights: [
      { label: 'Distance', value: `${route.distance} km` },
      { label: 'Duration', value: `${route.duration} hours` },
      { label: 'Starting Fare', value: `₹${route.priceSaloon}` },
      { label: 'Vehicle Options', value: 'Sedan, SUV, Tempo' },
      { label: 'Availability', value: '24/7, 365 days' },
      { label: 'Payment', value: 'Cash, UPI, Card' },
    ],
    popularKeywords: [
      // Focused list of 18 most-searched, route-specific terms
      // (Reduced from 90+ to prevent keyword stuffing signals in rendered HTML)
      `${route.fromName} to ${route.toName} cab`,
      `${route.fromName} to ${route.toName} taxi`,
      `${route.fromName} to ${route.toName} cab fare`,
      `${route.fromName} to ${route.toName} one way cab`,
      `${route.fromName} to ${route.toName} cab booking`,
      `${route.fromName} to ${route.toName} distance`,
      `${route.fromName} to ${route.toName} travel time`,
      `${route.fromName} to ${route.toName} cab service`,
      `${route.fromName} to ${route.toName} innova`,
      `${route.fromName} to ${route.toName} suv cab`,
      `${route.fromName} to ${route.toName} tempo traveller`,
      `${route.toName} to ${route.fromName} cab`,
      `${route.toName} to ${route.fromName} taxi`,
      `taxi from ${route.fromName} to ${route.toName}`,
      `cab from ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} car rental`,
      `book cab ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} round trip cab`,
      // Alternate name variants (only if present — adds genuine value)
      ...(input.fromAlternateNames?.slice(0, 1) || fromCity?.alternateNames?.slice(0, 1) || []).map(alt => `${alt} to ${route.toName} cab`),
      ...(input.toAlternateNames?.slice(0, 1) || toCity?.alternateNames?.slice(0, 1) || []).map(alt => `${route.fromName} to ${alt} cab`),
      // Hindi/Hinglish — 2 most-searched local language terms
      `${route.fromName} se ${route.toName} cab`,
      `${route.fromName} se ${route.toName} taxi kiraya`,
    ],
  };
}
