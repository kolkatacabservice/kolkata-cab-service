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
    hash += slug.charCodeAt(i);
  }
  return hash;
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
  // Fix #2: Reverse routes get +4 template offset to ensure structurally different content from forward route
  const reverseOffset = isReverseRoute(route.from, route.to) ? 4 : 0;
  const templateIndex = (hash + reverseOffset) % 8;

  // Paragraph 1: Route overview — highly natural, keyword-rich, and distinct
  let p1 = '';
  if (templateIndex === 0) {
    p1 = `Looking to travel from ${route.fromName} to ${route.toName} by cab? The road distance is approximately ${route.distance} km, and the journey takes around ${route.duration} hours in a comfortable AC vehicle. ${BUSINESS.name} offers one-way and round-trip taxi service on this route starting from just ₹${route.priceSaloon} for a sedan${fromStateName && toStateName && fromStateName !== toStateName ? `, connecting ${fromStateName} and ${toStateName}` : ''}. Choose from sedans, SUVs, Innova Crysta, or Tempo Travellers — all with police-verified drivers and transparent pricing. Call ${BUSINESS.phone} for instant booking.`;
  } else if (templateIndex === 1) {
    p1 = `Planning a road trip from ${route.fromName} to ${route.toName}? The driving distance is about ${route.distance} km, taking approximately ${route.duration} hours. At ${BUSINESS.name}, we provide convenient outstation taxi booking from ${route.fromName} to ${route.toName} starting at ₹${route.priceSaloon} for AC sedan cabs. Enjoy a safe ride with our professional drivers and zero cancellation charges. Call us at ${BUSINESS.phone} to reserve your cab.`;
  } else if (templateIndex === 2) {
    p1 = `Book a reliable one-way or round-trip cab from ${route.fromName} to ${route.toName} with ${BUSINESS.name}. The journey covers ${route.distance} km via the fastest highway route, taking around ${route.duration} hours. Fares start at just ₹${route.priceSaloon} for a clean, air-conditioned Sedan. We also offer SUVs and luxury Crysta options with professional drivers. Get in touch at ${BUSINESS.phone} for instant confirmation.`;
  } else if (templateIndex === 3) {
    p1 = `Searching for an affordable taxi from ${route.fromName} to ${route.toName}? Get the best travel experience with ${BUSINESS.name}. The road trip covers a distance of ${route.distance} km and takes about ${route.duration} hours. Our taxi rates start at an unbeatable ₹${route.priceSaloon} for Sedan. Whether you need a drop or a round trip, book with us for flat rates and verified drivers. Connect with us at ${BUSINESS.phone}.`;
  } else if (templateIndex === 4) {
    p1 = `Travel comfortably from ${route.fromName} to ${route.toName} with our premium car rental service. Spanning a road distance of ${route.distance} km, this route is completed in approximately ${route.duration} hours. Starting from ₹${route.priceSaloon} for AC Sedan, we provide a smooth highway travel experience. Reserve your ride today by calling ${BUSINESS.phone} for door-to-door pick and drop.`;
  } else if (templateIndex === 5) {
    p1 = `Get a hassle-free cab booking from ${route.fromName} to ${route.toName} via ${BUSINESS.name}. Fares begin at just ₹${route.priceSaloon} for air-conditioned Sedans. The estimated travel time for the ${route.distance} km route is ${route.duration} hours. Our service features sanitised cars, experienced highway drivers, and instant booking confirmation. Call ${BUSINESS.phone} to hire your cab.`;
  } else if (templateIndex === 6) {
    p1 = `For your upcoming journey from ${route.fromName} to ${route.toName}, choose the comfort of ${BUSINESS.name}'s outstation taxi services. The travel distance is ${route.distance} km, requiring around ${route.duration} hours. We offer economic Sedans from ₹${route.priceSaloon}, family SUVs, and multi-seater Tempo Travellers. Experience safe, surge-free travel with professional chauffeurs. Contact us at ${BUSINESS.phone}.`;
  } else {
    p1 = `Need a private car from ${route.fromName} to ${route.toName}? Enjoy a premium, pocket-friendly trip starting from ₹${route.priceSaloon} for AC Sedan with ${BUSINESS.name}. Covering ${route.distance} km in about ${route.duration} hours, our services are ideal for one-way drops or multi-day tours. Call ${BUSINESS.phone} to lock in your booking with zero advance payment.`;
  }
  paragraphs.push(p1);

  // Paragraph 2: Vehicle options and transparent pricing details
  let p2 = '';
  if (templateIndex === 0) {
    p2 = `For the ${route.fromName} to ${route.toName} cab service, you can choose from multiple vehicle categories. Our Sedan category (Swift Dzire, Honda Amaze) starts at just ₹${route.priceSaloon} and is perfect for 1–3 passengers with moderate luggage. For families or groups, our SUV options (Ertiga, Innova, Innova Crysta) are available from ₹${route.priceSuv}, offering more space and comfort. For larger groups of 8–12 people, our Tempo Traveller starts at ₹${route.priceTempo} with ample luggage space. All fares include fuel and driver charges — no hidden costs, no surge pricing.`;
  } else if (templateIndex === 1) {
    p2 = `Whether you prefer an economical Sedan or a spacious SUV, our fleet has the perfect vehicle for your ${route.fromName} to ${route.toName} trip. Clean, well-maintained Sedan cabs (Dzire, Amaze) start from ₹${route.priceSaloon} (ideal for small groups). For family outstation trips, we recommend our Ertiga or Innova Crysta SUVs starting at ₹${route.priceSuv}. Larger travel groups can book our comfortable 12-17 seater Tempo Traveller starting at ₹${route.priceTempo}. All our fares are inclusive of fuel and driver allowance, with absolute transparency.`;
  } else if (templateIndex === 2) {
    p2 = `Our vehicle options for the ${route.fromName} to ${route.toName} taxi booking cater to all budgets. Fares start at a budget-friendly ₹${route.priceSaloon} for Sedan models like Swift Dzire, suitable for up to 4 passengers. For group or family travels, we offer 6-7 seater SUVs (Ertiga, Innova Crysta) starting at ₹${route.priceSuv}. For corporate outings or large families, our Tempo Traveller models start from ₹${route.priceTempo}. We maintain flat rates with no surge pricing, including fuel and driver fees.`;
  } else if (templateIndex === 3) {
    p2 = `To travel from ${route.fromName} to ${route.toName}, choose from our diverse fleet options. We offer clean AC Sedans (Dzire, Amaze) starting at ₹${route.priceSaloon} for individual travelers or couples. For families needing extra legroom, our Ertiga and Innova Crysta SUVs are priced from ₹${route.priceSuv}. For larger groups, our 12-seater Tempo Travellers start from ₹${route.priceTempo}. Fares include driver allowance and fuel, meaning no surprise charges at the end.`;
  } else if (templateIndex === 4) {
    p2 = `We provide a wide range of vehicles for your road trip from ${route.fromName} to ${route.toName}. Individual and corporate travelers can book our neat Sedans starting from ₹${route.priceSaloon}. Family groups can select from our Ertiga or premium Innova Crysta SUVs, available from ₹${route.priceSuv}. For group pilgrimages or tours, our Tempo Traveller starts at ₹${route.priceTempo}. Our billing is transparent, covering all driver allowances and fuel expenses upfront.`;
  } else if (templateIndex === 5) {
    p2 = `Select the ideal ride for your ${route.fromName} to ${route.toName} journey from our standard vehicle categories. Fares start at ₹${route.priceSaloon} for comfortable AC Sedans, perfect for up to 4 passengers. For groups of 5-7, we recommend our reliable Ertiga and premium Toyota Innova Crysta starting at ₹${route.priceSuv}. For larger families or tour groups, our spacious Tempo Traveller starts at ₹${route.priceTempo}. Fares are fixed and include fuel and driver costs.`;
  } else if (templateIndex === 6) {
    p2 = `Our fleet for the ${route.fromName} to ${route.toName} outstation route features vehicles for every budget. Our AC Sedans (Swift Dzire) start at ₹${route.priceSaloon} and are perfect for compact groups. For spacious travel, book an SUV (Ertiga or Innova Crysta) starting from ₹${route.priceSuv}. For large groups, our Tempo Traveller models are available starting at ₹${route.priceTempo}. Enjoy flat-rate pricing with driver and fuel charges included.`;
  } else {
    p2 = `Whether booking a sedan for a business trip or an SUV for family vacation from ${route.fromName} to ${route.toName}, we have you covered. Our Dzire sedan starts from ₹${route.priceSaloon}, Ertiga and Innova Crysta SUVs start at ₹${route.priceSuv}, and 12-15 seater Tempo Travellers start at ₹${route.priceTempo}. Fares are all-inclusive of fuel and driver fees with flat-rate guarantee.`;
  }
  paragraphs.push(p2);

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

  // Paragraph 5: Service commitment
  let p5 = '';
  if (templateIndex === 0) {
    p5 = `${BUSINESS.name} has been providing trusted cab services since ${BUSINESS.foundYear}. On the ${route.fromName} to ${route.toName} route, we ensure: (1) Clean, sanitized AC vehicles with regular maintenance checks, (2) Professional, police-verified drivers with 5+ years of experience on this route, (3) Transparent pricing with no hidden charges — toll and parking are communicated upfront, (4) Flexible payment options including Cash, UPI (Google Pay, PhonePe), Credit/Debit Cards, and Bank Transfer, (5) Free cancellation up to 4 hours before the scheduled pickup time. Book your ${route.fromName} to ${route.toName} cab now by calling ${BUSINESS.phone} or sending a WhatsApp message for instant confirmation.`;
  } else if (templateIndex === 1) {
    p5 = `Since ${BUSINESS.foundYear}, ${BUSINESS.name} has built a strong reputation for safe and reliable road transport. When booking your ${route.fromName} to ${route.toName} taxi with us, you get professional highway-certified drivers, clean sanitized AC cars, and a transparent pricing model. We support flexible online payments (UPI, Card, Cash) and offer a free 4-hour cancellation policy. Reserve your cab on the ${route.fromName}–${route.toName} route by calling ${BUSINESS.phone} or booking on WhatsApp for instant coordination.`;
  } else if (templateIndex === 2) {
    p5 = `Why choose ${BUSINESS.name} for your travel from ${route.fromName} to ${route.toName}? With operations since ${BUSINESS.foundYear}, we focus on customer safety and convenience. We guarantee experienced drivers with valid commercial licenses, well-maintained AC cars, flat rates with zero surge pricing, and multiple payment options (GPay, PhonePe, Cards, Cash). Enjoy a stress-free journey with free cancellations up to 4 hours before your ride. Call us on ${BUSINESS.phone} to secure your booking today.`;
  } else if (templateIndex === 3) {
    p5 = `With a legacy of service since ${BUSINESS.foundYear}, ${BUSINESS.name} is the top choice for travelers heading from ${route.fromName} to ${route.toName}. We stand out by offering clean AC cars, professional drivers who know the highways, flat rates without surge pricing, and easy payment via UPI, Cash, or Card. Enjoy the flexibility of free cancellation up to 4 hours before pickup. Book instantly by dialing ${BUSINESS.phone} or sending us a message on WhatsApp.`;
  } else if (templateIndex === 4) {
    p5 = `At ${BUSINESS.name}, we are committed to making your ${route.fromName} to ${route.toName} travel safe and enjoyable. Active since ${BUSINESS.foundYear}, we offer police-verified drivers, regularly sanitised AC sedans and SUVs, upfront billing with no hidden fees, and standard cancellation policies. We accept UPI, bank transfers, cards, and cash. Speak to our team at ${BUSINESS.phone} or connect on WhatsApp for immediate booking.`;
  } else if (templateIndex === 5) {
    p5 = `Choose ${BUSINESS.name} for a stress-free outstation trip from ${route.fromName} to ${route.toName}. Serving customers since ${BUSINESS.foundYear}, we provide well-maintained commercial vehicles, drivers with extensive highway route expertise, flat rates, and hassle-free payment methods. Plus, you get free cancellation up to 4 hours before departure. Call us at ${BUSINESS.phone} or drop a message on WhatsApp for 2-minute booking confirmation.`;
  } else if (templateIndex === 6) {
    p5 = `Customer satisfaction has been our priority at ${BUSINESS.name} since ${BUSINESS.foundYear}. For your taxi booking from ${route.fromName} to ${route.toName}, we deliver clean, sanitised vehicles, professional chauffeurs, fixed rates with no peak-hour surge, and convenient payment options (UPI, Cash, Cards). Cancel for free up to 4 hours prior to travel. Call ${BUSINESS.phone} or WhatsApp us to get started.`;
  } else {
    p5 = `Experience the reliability of East India's leading car rental brand. Since ${BUSINESS.foundYear}, ${BUSINESS.name} has been connecting ${route.fromName} and ${route.toName} with premium cab services. We offer verified drivers, fully functional AC vehicles, transparent billing, and 24/7 customer support. Enjoy zero cancellation fees up to 4 hours before your trip. Reach us at ${BUSINESS.phone} or WhatsApp us for instant confirmation.`;
  }
  paragraphs.push(p5);

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
      // ═══ Primary route keywords (highest volume) ═══
      `${route.fromName} to ${route.toName} cab`,
      `${route.fromName} to ${route.toName} taxi`,
      `${route.fromName} to ${route.toName} taxi fare`,
      `${route.fromName} to ${route.toName} cab fare`,
      `${route.fromName} to ${route.toName} one way cab`,
      `${route.fromName} to ${route.toName} cab booking`,
      `taxi from ${route.fromName} to ${route.toName}`,
      `cab from ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} car rental`,
      `${route.fromName} to ${route.toName} cab service`,
      `${route.fromName} to ${route.toName} taxi service`,
      // ═══ Distance & travel keywords ═══
      `${route.fromName} to ${route.toName} distance`,
      `${route.fromName} to ${route.toName} distance by road`,
      `${route.fromName} to ${route.toName} by road`,
      `${route.fromName} to ${route.toName} by car`,
      `${route.fromName} to ${route.toName} travel by car`,
      `${route.fromName} to ${route.toName} road trip`,
      `${route.fromName} to ${route.toName} travel time`,
      `${route.fromName} to ${route.toName} km`,
      `how to go from ${route.fromName} to ${route.toName}`,
      `how to reach ${route.toName} from ${route.fromName}`,
      // ═══ Pricing & fare keywords ═══
      `${route.fromName} to ${route.toName} cab price`,
      `${route.fromName} to ${route.toName} taxi charges`,
      `${route.fromName} to ${route.toName} cab rate`,
      `${route.fromName} to ${route.toName} cab rate per km`,
      `${route.fromName} to ${route.toName} cab cost`,
      `${route.fromName} to ${route.toName} taxi rate`,
      `${route.fromName} to ${route.toName} fare`,
      `${route.fromName} to ${route.toName} fare chart`,
      `${route.fromName} to ${route.toName} taxi fare today`,
      `${route.fromName} to ${route.toName} cab charges per km`,
      `cheapest cab ${route.fromName} to ${route.toName}`,
      `best cab ${route.fromName} to ${route.toName}`,
      `affordable taxi ${route.fromName} to ${route.toName}`,
      `cheap taxi ${route.fromName} to ${route.toName}`,
      `lowest fare ${route.fromName} to ${route.toName}`,
      // ═══ Booking & action keywords ═══
      `book cab ${route.fromName} to ${route.toName}`,
      `book taxi ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} cab online booking`,
      `${route.fromName} to ${route.toName} online cab booking`,
      `${route.fromName} to ${route.toName} cab booking online`,
      `hire cab ${route.fromName} to ${route.toName}`,
      `hire taxi ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} car hire`,
      `${route.fromName} to ${route.toName} car booking`,
      // ═══ Trip type keywords ═══
      `${route.fromName} to ${route.toName} outstation cab`,
      `${route.fromName} to ${route.toName} round trip cab`,
      `${route.fromName} to ${route.toName} one way taxi`,
      `${route.fromName} to ${route.toName} drop taxi`,
      `${route.fromName} to ${route.toName} return cab`,
      `${route.fromName} to ${route.toName} two way cab`,
      `${route.fromName} to ${route.toName} round trip taxi`,
      `${route.fromName} to ${route.toName} day trip cab`,
      // ═══ Vehicle-specific keywords ═══
      `${route.fromName} to ${route.toName} innova cab`,
      `${route.fromName} to ${route.toName} innova crysta`,
      `${route.fromName} to ${route.toName} suv cab`,
      `${route.fromName} to ${route.toName} sedan cab`,
      `${route.fromName} to ${route.toName} ertiga cab`,
      `${route.fromName} to ${route.toName} crysta cab`,
      `${route.fromName} to ${route.toName} tempo traveller`,
      `${route.fromName} to ${route.toName} swift dzire`,
      `${route.fromName} to ${route.toName} ac cab`,
      `${route.fromName} to ${route.toName} luxury cab`,
      // ═══ Reverse route keywords ═══
      `${route.toName} to ${route.fromName} cab`,
      `${route.toName} to ${route.fromName} taxi`,
      `${route.toName} to ${route.fromName} one way cab`,
      `${route.toName} to ${route.fromName} taxi fare`,
      `${route.toName} to ${route.fromName} cab fare`,
      `${route.toName} to ${route.fromName} cab booking`,
      `${route.toName} to ${route.fromName} car rental`,
      // ═══ Time-specific keywords ═══
      `${route.fromName} to ${route.toName} cab 24/7`,
      `${route.fromName} to ${route.toName} night cab`,
      `${route.fromName} to ${route.toName} early morning cab`,
      `${route.fromName} to ${route.toName} midnight taxi`,
      `${route.fromName} to ${route.toName} cab today`,
      `${route.fromName} to ${route.toName} cab tomorrow`,
      // ═══ "Near me" & local keywords ═══
      `${route.fromName} to ${route.toName} cab near me`,
      `cab near me ${route.fromName}`,
      `taxi near me ${route.fromName} to ${route.toName}`,
      // ═══ Safety & comfort keywords ═══
      `safe cab ${route.fromName} to ${route.toName}`,
      `reliable taxi ${route.fromName} to ${route.toName}`,
      `comfortable cab ${route.fromName} to ${route.toName}`,
      `trusted cab ${route.fromName} to ${route.toName}`,
      // ═══ Comparison keywords ═══
      `${route.fromName} to ${route.toName} cab vs train`,
      `${route.fromName} to ${route.toName} cab vs bus`,
      `${route.fromName} to ${route.toName} cab vs ola`,
      `${route.fromName} to ${route.toName} no surge cab`,
      `${route.fromName} to ${route.toName} fixed rate cab`,
      // ═══ Purpose-specific keywords ═══
      `${route.fromName} to ${route.toName} cab for family`,
      `${route.fromName} to ${route.toName} cab for wedding`,
      `${route.fromName} to ${route.toName} cab for business`,
      `${route.fromName} to ${route.toName} airport cab`,
      `${route.fromName} to ${route.toName} station cab`,
      // ═══ Question-format keywords ═══
      `how much ${route.fromName} to ${route.toName} cab fare`,
      `what is taxi fare from ${route.fromName} to ${route.toName}`,
      `best way to go ${route.fromName} to ${route.toName}`,
      `${route.fromName} to ${route.toName} cab contact number`,
      `${route.fromName} to ${route.toName} cab phone number`,
      // ═══ Group & family travel ═══
      `${route.fromName} to ${route.toName} group cab`,
      `${route.fromName} to ${route.toName} family cab`,
      `${route.fromName} to ${route.toName} shared cab`,
      // ═══ Payment keywords ═══
      `${route.fromName} to ${route.toName} cab upi payment`,
      `${route.fromName} to ${route.toName} cab cash payment`,
      // ═══ ALTERNATE NAME KEYWORDS (misspellings & local names) ═══
      ...(input.fromAlternateNames || fromCity?.alternateNames || []).flatMap(alt => [
        `${alt} to ${route.toName} cab`,
        `${alt} to ${route.toName} taxi`,
        `${alt} to ${route.toName} taxi fare`,
        `${alt} to ${route.toName} cab fare`,
        `${alt} to ${route.toName} cab booking`,
        `${alt} to ${route.toName} distance`,
      ]),
      ...(input.toAlternateNames || toCity?.alternateNames || []).flatMap(alt => [
        `${route.fromName} to ${alt} cab`,
        `${route.fromName} to ${alt} taxi`,
        `${route.fromName} to ${alt} taxi fare`,
        `${route.fromName} to ${alt} cab fare`,
        `${route.fromName} to ${alt} cab booking`,
        `${route.fromName} to ${alt} distance`,
      ]),
      // ═══ HINDI / HINGLISH KEYWORDS ═══
      `${route.fromName} se ${route.toName} cab`,
      `${route.fromName} se ${route.toName} taxi`,
      `${route.fromName} se ${route.toName} cab kiraya`,
      `${route.fromName} se ${route.toName} kitna dur hai`,
      `${route.fromName} se ${route.toName} gaadi`,
      `${route.fromName} se ${route.toName} cab kitna lagta hai`,
      `${route.toName} se ${route.fromName} cab`,
      `${route.toName} se ${route.fromName} taxi kiraya`,
    ],
  };
}
