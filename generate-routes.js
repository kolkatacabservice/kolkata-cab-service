// Route generator script - generates all routes from city data
// Including hub-to-city routes AND popular inter-city local routes
const fs = require('fs');
const path = require('path');

const citiesData = require('./src/data/cities.json');

const hubCities = ['kolkata', 'ranchi', 'bhubaneswar'];

// Distance estimation based on lat/lng (Haversine simplified for India)
function estimateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  // Road distance is typically 1.3x straight line
  return Math.round(R * c * 1.3);
}

function estimateDuration(distanceKm) {
  const avgSpeed = 50; // km/h average in India
  const hours = distanceKm / avgSpeed;
  const low = Math.max(1, Math.floor(hours));
  const high = Math.ceil(hours) + 1;
  return `${low}-${high}`;
}

function estimatePrice(distanceKm, type) {
  const rates = { sedan: 11, suv: 14, tempo: 18 };
  const baseFares = { sedan: 1500, suv: 2000, tempo: 3000 };
  return Math.round((distanceKm * rates[type] + baseFares[type]) / 100) * 100;
}

// Known routes with accurate data
const knownRoutes = {
  // === Kolkata Hub Routes ===
  'kolkata-to-ranchi': { distance: 420, duration: '7-8', via: ['NH 16', 'Kharagpur', 'Jamshedpur'] },
  'kolkata-to-darjeeling': { distance: 600, duration: '11-12', via: ['NH 12', 'Siliguri'] },
  'kolkata-to-siliguri': { distance: 560, duration: '10-11', via: ['NH 12', 'Malda'] },
  'kolkata-to-bhubaneswar': { distance: 440, duration: '7-8', via: ['NH 16', 'Kharagpur', 'Balasore'] },
  'kolkata-to-puri': { distance: 500, duration: '8-9', via: ['NH 16', 'Bhubaneswar'] },
  'kolkata-to-digha': { distance: 185, duration: '3-4', via: ['NH 116B', 'Kolaghat'] },
  'kolkata-to-jamshedpur': { distance: 270, duration: '4-5', via: ['NH 16', 'Kharagpur'] },
  'kolkata-to-dhanbad': { distance: 290, duration: '5-6', via: ['NH 19', 'Asansol'] },
  'kolkata-to-durgapur': { distance: 170, duration: '3-4', via: ['NH 19'] },
  'kolkata-to-asansol': { distance: 210, duration: '4-5', via: ['NH 19', 'Durgapur'] },
  'kolkata-to-deoghar': { distance: 370, duration: '6-7', via: ['NH 19', 'Dhanbad'] },
  // New Kolkata local/tourist routes
  'kolkata-to-mandarmani': { distance: 170, duration: '3-4', via: ['NH 116B', 'Kolaghat', 'Contai'] },
  'kolkata-to-bakkhali': { distance: 132, duration: '3-4', via: ['Diamond Harbour Road', 'Kakdwip'] },
  'kolkata-to-gangasagar': { distance: 130, duration: '3-4', via: ['Diamond Harbour Road', 'Kakdwip', 'Kachuberia Ghat'] },
  'kolkata-to-mayapur': { distance: 130, duration: '3-4', via: ['NH 12', 'Krishnanagar'] },
  'kolkata-to-nabadwip': { distance: 120, duration: '2-3', via: ['NH 12', 'Krishnanagar'] },
  'kolkata-to-krishnanagar': { distance: 105, duration: '2-3', via: ['NH 12'] },
  'kolkata-to-diamond-harbour': { distance: 50, duration: '1-2', via: ['Diamond Harbour Road'] },
  'kolkata-to-haldia': { distance: 136, duration: '2-3', via: ['NH 116', 'Kolaghat'] },
  'kolkata-to-contai': { distance: 164, duration: '3-4', via: ['NH 116B', 'Kolaghat'] },
  'kolkata-to-tamluk': { distance: 95, duration: '2-3', via: ['NH 116'] },
  'kolkata-to-alipurduar': { distance: 650, duration: '12-14', via: ['NH 12', 'Siliguri'] },
  'kolkata-to-hooghly': { distance: 45, duration: '1-2', via: ['GT Road'] },
  'kolkata-to-baharampur': { distance: 200, duration: '4-5', via: ['NH 12'] },
  'kolkata-to-raiganj': { distance: 400, duration: '7-9', via: ['NH 12', 'Malda'] },
  'kolkata-to-bolpur-shantiniketan': { distance: 183, duration: '3-5', via: ['NH 19', 'Bardhaman'] },

  // === Ranchi Hub Routes ===
  'ranchi-to-jamshedpur': { distance: 140, duration: '2-3', via: ['NH 33'] },
  'ranchi-to-dhanbad': { distance: 170, duration: '3-4', via: ['NH 33'] },
  'ranchi-to-deoghar': { distance: 250, duration: '5-6', via: ['Giridih'] },
  'ranchi-to-bhubaneswar': { distance: 510, duration: '9-10', via: ['Jamshedpur', 'Balasore'] },
  'ranchi-to-bokaro': { distance: 110, duration: '2-3', via: ['NH 32'] },
  'ranchi-to-hazaribagh': { distance: 100, duration: '2-3', via: ['NH 33'] },
  'ranchi-to-netarhat': { distance: 155, duration: '3-4', via: ['Lohardaga'] },
  'ranchi-to-dumka': { distance: 310, duration: '6-7', via: ['Giridih', 'Deoghar'] },
  'ranchi-to-chaibasa': { distance: 135, duration: '2-3', via: ['NH 75'] },
  'ranchi-to-latehar': { distance: 120, duration: '2-3', via: ['Lohardaga'] },

  // === Bhubaneswar Hub Routes ===
  'bhubaneswar-to-puri': { distance: 60, duration: '1-2', via: ['NH 316'] },
  'bhubaneswar-to-konark': { distance: 65, duration: '1-2', via: ['Marine Drive Road'] },
  'bhubaneswar-to-cuttack': { distance: 30, duration: '0-1', via: ['NH 16'] },
  'bhubaneswar-to-rourkela': { distance: 350, duration: '6-7', via: ['NH 49'] },
  'bhubaneswar-to-gopalpur': { distance: 195, duration: '3-4', via: ['NH 16', 'Berhampur'] },
  'bhubaneswar-to-baripada': { distance: 275, duration: '5-6', via: ['NH 49'] },
  'bhubaneswar-to-angul': { distance: 150, duration: '3-4', via: ['NH 55'] },
};

// Popular inter-city LOCAL routes (non-hub to non-hub)
// These are frequently searched routes that competitors all have
const interCityRoutes = [
  // West Bengal popular local routes
  ['siliguri', 'darjeeling'],
  ['siliguri', 'dooars'],
  ['siliguri', 'jalpaiguri'],
  ['siliguri', 'cooch-behar'],
  ['siliguri', 'alipurduar'],
  ['durgapur', 'asansol'],
  ['durgapur', 'bardhaman'],
  ['durgapur', 'bolpur-shantiniketan'],
  ['asansol', 'dhanbad'],
  ['asansol', 'bardhaman'],
  ['bardhaman', 'bolpur-shantiniketan'],
  ['digha', 'mandarmani'],
  ['digha', 'contai'],
  ['howrah', 'diamond-harbour'],
  ['howrah', 'hooghly'],
  ['howrah', 'tamluk'],
  ['kharagpur', 'digha'],
  ['kharagpur', 'midnapore'],
  ['kharagpur', 'haldia'],
  ['malda', 'murshidabad'],
  ['malda', 'raiganj'],
  ['murshidabad', 'baharampur'],
  ['nabadwip', 'mayapur'],
  ['krishnanagar', 'nabadwip'],
  ['krishnanagar', 'mayapur'],
  ['bankura', 'bishnupur'],
  ['bakkhali', 'gangasagar'],
  ['bolpur-shantiniketan', 'bishnupur'],

  // Jharkhand popular local routes
  ['jamshedpur', 'dhanbad'],
  ['jamshedpur', 'bokaro'],
  ['jamshedpur', 'chaibasa'],
  ['dhanbad', 'bokaro'],
  ['dhanbad', 'giridih'],
  ['dhanbad', 'deoghar'],
  ['bokaro', 'hazaribagh'],
  ['hazaribagh', 'giridih'],
  ['deoghar', 'dumka'],
  ['deoghar', 'giridih'],
  ['palamu', 'netarhat'],
  ['palamu', 'betla'],
  ['latehar', 'netarhat'],
  ['latehar', 'palamu'],
  ['sahebganj', 'dumka'],
  ['ramgarh', 'hazaribagh'],
  ['ramgarh', 'bokaro'],



  // Odisha popular local routes
  ['puri', 'konark'],
  ['puri', 'chilika'],
  ['cuttack', 'puri'],
  ['cuttack', 'konark'],
  ['berhampur', 'gopalpur'],
  ['sambalpur', 'jharsuguda'],
  ['balasore', 'baripada'],
  ['rourkela', 'sambalpur'],
  ['rourkela', 'jharsuguda'],
  ['koraput', 'jeypore'],



  // Cross-state popular routes
  ['jamshedpur', 'bhubaneswar'],
  ['dhanbad', 'asansol'],
  ['balasore', 'digha'],

  // === MORE OUTSTATION & TOURIST ROUTES ===

  // West Bengal outstation / tourist
  ['kolkata', 'murshidabad'],
  ['kolkata', 'bishnupur'],
  ['kolkata', 'bankura'],
  ['kolkata', 'purulia'],
  ['kolkata', 'malda'],
  ['kolkata', 'cooch-behar'],
  ['kolkata', 'jalpaiguri'],
  ['kolkata', 'dooars'],
  ['kolkata', 'midnapore'],
  ['kolkata', 'howrah'],
  ['kolkata', 'kharagpur'],
  ['kolkata', 'bardhaman'],
  ['siliguri', 'gangtok'], // People search this even though Gangtok is Sikkim
  ['siliguri', 'raiganj'],
  ['siliguri', 'malda'],
  ['digha', 'kolkata'],
  ['mandarmani', 'kolkata'],
  ['bakkhali', 'kolkata'],
  ['gangasagar', 'kolkata'],
  ['mayapur', 'kolkata'],

  // Jharkhand outstation
  ['ranchi', 'kolkata'],
  ['ranchi', 'giridih'],
  ['ranchi', 'ramgarh'],
  ['ranchi', 'sahebganj'],
  ['ranchi', 'godda'],
  ['jamshedpur', 'kolkata'],
  ['jamshedpur', 'ranchi'],
  ['dhanbad', 'kolkata'],
  ['bokaro', 'kolkata'],
  ['deoghar', 'kolkata'],



  // Odisha outstation
  ['bhubaneswar', 'kolkata'],
  ['bhubaneswar', 'sambalpur'],
  ['bhubaneswar', 'berhampur'],
  ['bhubaneswar', 'balasore'],
  ['bhubaneswar', 'chilika'],
  ['bhubaneswar', 'dhenkanal'],
  ['puri', 'kolkata'],
  ['puri', 'bhubaneswar'],
  ['cuttack', 'kolkata'],
  ['rourkela', 'kolkata'],
  ['rourkela', 'ranchi'],

];

// Known inter-city distances
const knownInterCityRoutes = {
  'siliguri-to-darjeeling': { distance: 70, duration: '2-3', via: ['Kurseong', 'NH 55'] },
  'siliguri-to-dooars': { distance: 95, duration: '2-3', via: ['Malbazar'] },
  'siliguri-to-jalpaiguri': { distance: 45, duration: '1-2', via: ['NH 31'] },
  'siliguri-to-cooch-behar': { distance: 155, duration: '3-4', via: ['NH 31'] },
  'siliguri-to-alipurduar': { distance: 170, duration: '3-4', via: ['Jalpaiguri'] },
  'durgapur-to-asansol': { distance: 50, duration: '1-2', via: ['NH 19'] },
  'durgapur-to-bardhaman': { distance: 55, duration: '1-2', via: ['NH 19'] },
  'durgapur-to-bolpur-shantiniketan': { distance: 70, duration: '1-2', via: ['SH 14'] },
  'asansol-to-dhanbad': { distance: 60, duration: '1-2', via: ['NH 19'] },
  'asansol-to-bardhaman': { distance: 100, duration: '2-3', via: ['NH 19'] },
  'bardhaman-to-bolpur-shantiniketan': { distance: 60, duration: '1-2', via: ['SH 14'] },
  'digha-to-mandarmani': { distance: 15, duration: '0-1', via: [] },
  'digha-to-contai': { distance: 35, duration: '0-1', via: [] },
  'howrah-to-diamond-harbour': { distance: 55, duration: '1-2', via: ['Diamond Harbour Road'] },
  'howrah-to-hooghly': { distance: 40, duration: '1-2', via: ['GT Road'] },
  'howrah-to-tamluk': { distance: 90, duration: '2-3', via: ['NH 116'] },
  'kharagpur-to-digha': { distance: 120, duration: '2-3', via: ['NH 116B'] },
  'kharagpur-to-midnapore': { distance: 20, duration: '0-1', via: [] },
  'kharagpur-to-haldia': { distance: 75, duration: '1-2', via: ['Kolaghat'] },
  'malda-to-murshidabad': { distance: 130, duration: '2-3', via: [] },
  'malda-to-raiganj': { distance: 90, duration: '2-3', via: [] },
  'murshidabad-to-baharampur': { distance: 10, duration: '0-1', via: [] },
  'nabadwip-to-mayapur': { distance: 8, duration: '0-1', via: ['Ferry/Bridge'] },
  'krishnanagar-to-nabadwip': { distance: 25, duration: '0-1', via: [] },
  'krishnanagar-to-mayapur': { distance: 30, duration: '0-1', via: [] },
  'bankura-to-bishnupur': { distance: 35, duration: '0-1', via: [] },
  'bakkhali-to-gangasagar': { distance: 75, duration: '2-3', via: ['Namkhana', 'Ferry'] },
  'bolpur-shantiniketan-to-bishnupur': { distance: 65, duration: '1-2', via: [] },

  // Jharkhand
  'jamshedpur-to-dhanbad': { distance: 170, duration: '3-4', via: ['NH 33'] },
  'jamshedpur-to-bokaro': { distance: 130, duration: '2-3', via: ['NH 33'] },
  'jamshedpur-to-chaibasa': { distance: 70, duration: '1-2', via: ['NH 75'] },
  'dhanbad-to-bokaro': { distance: 55, duration: '1-2', via: ['NH 32'] },
  'dhanbad-to-giridih': { distance: 75, duration: '1-2', via: [] },
  'dhanbad-to-deoghar': { distance: 170, duration: '3-4', via: ['Giridih'] },
  'bokaro-to-hazaribagh': { distance: 105, duration: '2-3', via: [] },
  'hazaribagh-to-giridih': { distance: 90, duration: '2-3', via: [] },
  'deoghar-to-dumka': { distance: 65, duration: '1-2', via: [] },
  'deoghar-to-giridih': { distance: 100, duration: '2-3', via: [] },
  'palamu-to-netarhat': { distance: 75, duration: '2-3', via: [] },
  'palamu-to-betla': { distance: 25, duration: '0-1', via: [] },
  'latehar-to-netarhat': { distance: 60, duration: '1-2', via: [] },
  'latehar-to-palamu': { distance: 55, duration: '1-2', via: [] },
  'sahebganj-to-dumka': { distance: 120, duration: '2-3', via: [] },
  'ramgarh-to-hazaribagh': { distance: 50, duration: '1-2', via: [] },
  'ramgarh-to-bokaro': { distance: 40, duration: '0-1', via: [] },



  // Odisha
  'puri-to-konark': { distance: 35, duration: '0-1', via: ['Marine Drive'] },
  'puri-to-chilika': { distance: 50, duration: '1-2', via: [] },
  'cuttack-to-puri': { distance: 85, duration: '1-2', via: ['Bhubaneswar'] },
  'cuttack-to-konark': { distance: 95, duration: '2-3', via: ['Bhubaneswar'] },
  'berhampur-to-gopalpur': { distance: 16, duration: '0-1', via: [] },
  'sambalpur-to-jharsuguda': { distance: 55, duration: '1-2', via: [] },
  'balasore-to-baripada': { distance: 100, duration: '2-3', via: [] },
  'rourkela-to-sambalpur': { distance: 155, duration: '3-4', via: [] },
  'rourkela-to-jharsuguda': { distance: 135, duration: '2-3', via: [] },
  'koraput-to-jeypore': { distance: 30, duration: '0-1', via: [] },

  // Cross state
  'jamshedpur-to-bhubaneswar': { distance: 400, duration: '7-8', via: ['Balasore', 'NH 16'] },
  'dhanbad-to-asansol': { distance: 60, duration: '1-2', via: ['NH 19'] },
  'balasore-to-digha': { distance: 95, duration: '2-3', via: [] },
};

// Collect all cities with their state info
const allCities = [];
for (const [stateSlug, stateData] of Object.entries(citiesData)) {
  for (const city of stateData.cities) {
    allCities.push({ ...city, state: stateSlug, stateName: stateData.name });
  }
}

const routes = [];
const generatedSlugs = new Set();

function addRoute(fromCity, toCity, known) {
  const fwdSlug = `${fromCity.slug}-to-${toCity.slug}`;
  const revSlug = `${toCity.slug}-to-${fromCity.slug}`;

  if (!generatedSlugs.has(fwdSlug)) {
    const distance = known ? known.distance : estimateDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng);
    const duration = known ? known.duration : estimateDuration(distance);
    const via = known ? known.via : [];

    routes.push({
      from: fromCity.slug,
      fromName: fromCity.name,
      fromState: fromCity.state,
      to: toCity.slug,
      toName: toCity.name,
      toState: toCity.state,
      distance,
      duration,
      slug: fwdSlug,
      via,
      priceSaloon: estimatePrice(distance, 'sedan'),
      priceSuv: estimatePrice(distance, 'suv'),
      priceTempo: estimatePrice(distance, 'tempo')
    });
    generatedSlugs.add(fwdSlug);
  }

  if (!generatedSlugs.has(revSlug)) {
    const knownRev = knownInterCityRoutes[revSlug] || knownRoutes[revSlug];
    const knownFwd = known || knownInterCityRoutes[fwdSlug] || knownRoutes[fwdSlug];
    const useKnown = knownRev || knownFwd;
    const distance = useKnown ? useKnown.distance : estimateDistance(toCity.lat, toCity.lng, fromCity.lat, fromCity.lng);
    const duration = useKnown ? useKnown.duration : estimateDuration(distance);
    const via = useKnown ? [...(useKnown.via || [])].reverse() : [];

    routes.push({
      from: toCity.slug,
      fromName: toCity.name,
      fromState: toCity.state,
      to: fromCity.slug,
      toName: fromCity.name,
      toState: fromCity.state,
      distance,
      duration,
      slug: revSlug,
      via,
      priceSaloon: estimatePrice(distance, 'sedan'),
      priceSuv: estimatePrice(distance, 'suv'),
      priceTempo: estimatePrice(distance, 'tempo')
    });
    generatedSlugs.add(revSlug);
  }
}

// 1. Generate hub-to-all-cities routes
for (const hubSlug of hubCities) {
  const hubCity = allCities.find(c => c.slug === hubSlug);
  if (!hubCity) continue;

  for (const targetCity of allCities) {
    if (targetCity.slug === hubSlug) continue;
    const fwdSlug = `${hubSlug}-to-${targetCity.slug}`;
    const known = knownRoutes[fwdSlug];
    addRoute(hubCity, targetCity, known);
  }
}

// 2. Generate popular inter-city local routes
for (const [fromSlug, toSlug] of interCityRoutes) {
  const fromCity = allCities.find(c => c.slug === fromSlug);
  const toCity = allCities.find(c => c.slug === toSlug);
  if (!fromCity || !toCity) {
    console.warn(`Warning: Could not find city pair: ${fromSlug} <-> ${toSlug}`);
    continue;
  }
  const fwdSlug = `${fromSlug}-to-${toSlug}`;
  const known = knownInterCityRoutes[fwdSlug] || knownRoutes[fwdSlug];
  addRoute(fromCity, toCity, known);
}

fs.writeFileSync(
  path.join(__dirname, 'src/data/routes.json'),
  JSON.stringify(routes, null, 2)
);

console.log(`Generated ${routes.length} routes`);
console.log(`Unique slugs: ${generatedSlugs.size}`);
console.log(`Total cities: ${allCities.length}`);
