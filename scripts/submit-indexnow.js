/**
 * IndexNow Batch Submission Script
 * Submits all URLs to Bing/Yandex IndexNow API for instant crawl signaling.
 * 
 * Usage: node scripts/submit-indexnow.js
 * 
 * IndexNow is free, no auth needed, and signals crawlers to come immediately.
 * Bing, Yandex, Seznam, and Naver support IndexNow natively.
 */

const DOMAIN = 'https://www.kolkatacabservice.com';
const INDEXNOW_KEY = 'f63a562479e04845a7090b84784a9e52';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

// All URLs that need indexing — focus on "Discovered - currently not indexed" pages
const urls = [
  // Blog pages
  `${DOMAIN}/blog`,
  `${DOMAIN}/blog/best-weekend-trips-from-kolkata`,
  `${DOMAIN}/blog/complete-guide-cab-service-kolkata`,
  `${DOMAIN}/blog/kolkata-airport-cab-service-guide`,
  `${DOMAIN}/blog/kolkata-corporate-car-rental`,
  `${DOMAIN}/blog/kolkata-local-taxi-fare-chart`,
  `${DOMAIN}/blog/kolkata-to-darjeeling-road-trip-guide`,
  `${DOMAIN}/blog/kolkata-to-digha-road-trip`,
  `${DOMAIN}/blog/kolkata-to-puri-cab-jagannath-temple`,
  `${DOMAIN}/blog/kolkata-to-siliguri-cab-nh12`,
  `${DOMAIN}/blog/kolkata-wedding-car-rental-guide`,

  // City pages — Jharkhand
  `${DOMAIN}/jharkhand/bokaro`,
  `${DOMAIN}/jharkhand/deoghar`,
  `${DOMAIN}/jharkhand/dhanbad`,

  // City pages — Odisha
  `${DOMAIN}/odisha/cuttack`,
  `${DOMAIN}/odisha/puri`,
  `${DOMAIN}/odisha/rourkela`,

  // City pages — West Bengal
  `${DOMAIN}/west-bengal/kolkata`,
  `${DOMAIN}/west-bengal/asansol`,
  `${DOMAIN}/west-bengal/darjeeling`,
  `${DOMAIN}/west-bengal/durgapur`,
  `${DOMAIN}/west-bengal/howrah`,
  `${DOMAIN}/west-bengal/kolkata-airport`,
  `${DOMAIN}/west-bengal/new-town-kolkata`,
  `${DOMAIN}/west-bengal/salt-lake-kolkata`,
  `${DOMAIN}/west-bengal/siliguri`,

  // Service pages
  `${DOMAIN}/services/airport-transfer`,
  `${DOMAIN}/services/corporate-car-rental`,
  `${DOMAIN}/services/local-taxi`,
  `${DOMAIN}/services/outstation`,
  `${DOMAIN}/services/round-trip`,
  `${DOMAIN}/services/two-way`,

  // Route pages — All discovered but not indexed
  `${DOMAIN}/routes/asansol-to-bhubaneswar`,
  `${DOMAIN}/routes/asansol-to-kolkata`,
  `${DOMAIN}/routes/asansol-to-ranchi`,
  `${DOMAIN}/routes/bhubaneswar-to-bokaro`,
  `${DOMAIN}/routes/bhubaneswar-to-darjeeling`,
  `${DOMAIN}/routes/bhubaneswar-to-deoghar`,
  `${DOMAIN}/routes/bhubaneswar-to-dhanbad`,
  `${DOMAIN}/routes/bhubaneswar-to-digha`,
  `${DOMAIN}/routes/bhubaneswar-to-dooars`,
  `${DOMAIN}/routes/bhubaneswar-to-durgapur`,
  `${DOMAIN}/routes/bhubaneswar-to-gangasagar`,
  `${DOMAIN}/routes/bhubaneswar-to-jamshedpur`,
  `${DOMAIN}/routes/bhubaneswar-to-kolkata`,
  `${DOMAIN}/routes/bhubaneswar-to-konark`,
  `${DOMAIN}/routes/bhubaneswar-to-mandarmani`,
  `${DOMAIN}/routes/bhubaneswar-to-mayapur`,
  `${DOMAIN}/routes/bhubaneswar-to-ranchi`,
  `${DOMAIN}/routes/bhubaneswar-to-siliguri`,
  `${DOMAIN}/routes/bokaro-to-bhubaneswar`,
  `${DOMAIN}/routes/bokaro-to-kolkata`,
  `${DOMAIN}/routes/bokaro-to-ranchi`,
  `${DOMAIN}/routes/darjeeling-to-bhubaneswar`,
  `${DOMAIN}/routes/darjeeling-to-kolkata`,
  `${DOMAIN}/routes/darjeeling-to-ranchi`,
  `${DOMAIN}/routes/deoghar-to-bhubaneswar`,
  `${DOMAIN}/routes/deoghar-to-kolkata`,
  `${DOMAIN}/routes/deoghar-to-ranchi`,
  `${DOMAIN}/routes/dhanbad-to-bhubaneswar`,
  `${DOMAIN}/routes/dhanbad-to-kolkata`,
  `${DOMAIN}/routes/dhanbad-to-ranchi`,
  `${DOMAIN}/routes/digha-to-bhubaneswar`,
  `${DOMAIN}/routes/digha-to-kolkata`,
  `${DOMAIN}/routes/digha-to-ranchi`,
  `${DOMAIN}/routes/dooars-to-bhubaneswar`,
  `${DOMAIN}/routes/dooars-to-kolkata`,
  `${DOMAIN}/routes/dooars-to-ranchi`,
  `${DOMAIN}/routes/durgapur-to-bhubaneswar`,
  `${DOMAIN}/routes/durgapur-to-kolkata`,
  `${DOMAIN}/routes/durgapur-to-ranchi`,
  `${DOMAIN}/routes/gangasagar-to-bhubaneswar`,
  `${DOMAIN}/routes/gangasagar-to-kolkata`,
  `${DOMAIN}/routes/gangasagar-to-ranchi`,
  `${DOMAIN}/routes/howrah-to-ranchi`,
  `${DOMAIN}/routes/jamshedpur-to-bhubaneswar`,
  `${DOMAIN}/routes/jamshedpur-to-kolkata`,
  `${DOMAIN}/routes/jamshedpur-to-ranchi`,
  `${DOMAIN}/routes/kolkata-to-bhubaneswar`,
  `${DOMAIN}/routes/kolkata-to-darjeeling`,
  `${DOMAIN}/routes/kolkata-to-deoghar`,
  `${DOMAIN}/routes/kolkata-to-digha`,
  `${DOMAIN}/routes/kolkata-to-dooars`,
  `${DOMAIN}/routes/kolkata-to-durgapur`,
  `${DOMAIN}/routes/kolkata-to-gangasagar`,
  `${DOMAIN}/routes/kolkata-to-howrah`,
  `${DOMAIN}/routes/kolkata-to-konark`,
  `${DOMAIN}/routes/kolkata-to-mandarmani`,
  `${DOMAIN}/routes/kolkata-to-mayapur`,
  `${DOMAIN}/routes/kolkata-to-puri`,
  `${DOMAIN}/routes/kolkata-to-siliguri`,
  `${DOMAIN}/routes/konark-to-bhubaneswar`,
  `${DOMAIN}/routes/konark-to-ranchi`,
  `${DOMAIN}/routes/mandarmani-to-bhubaneswar`,
  `${DOMAIN}/routes/mandarmani-to-kolkata`,
  `${DOMAIN}/routes/mandarmani-to-ranchi`,
  `${DOMAIN}/routes/mayapur-to-bhubaneswar`,
  `${DOMAIN}/routes/mayapur-to-kolkata`,
  `${DOMAIN}/routes/mayapur-to-ranchi`,
  `${DOMAIN}/routes/puri-to-bhubaneswar`,
  `${DOMAIN}/routes/puri-to-kolkata`,
  `${DOMAIN}/routes/puri-to-ranchi`,
  `${DOMAIN}/routes/ranchi-to-asansol`,
  `${DOMAIN}/routes/ranchi-to-bokaro`,
  `${DOMAIN}/routes/ranchi-to-darjeeling`,
  `${DOMAIN}/routes/ranchi-to-deoghar`,
  `${DOMAIN}/routes/ranchi-to-dhanbad`,
  `${DOMAIN}/routes/ranchi-to-digha`,
  `${DOMAIN}/routes/ranchi-to-dooars`,
  `${DOMAIN}/routes/ranchi-to-durgapur`,
  `${DOMAIN}/routes/ranchi-to-gangasagar`,
  `${DOMAIN}/routes/ranchi-to-howrah`,
  `${DOMAIN}/routes/ranchi-to-jamshedpur`,
  `${DOMAIN}/routes/ranchi-to-konark`,
  `${DOMAIN}/routes/ranchi-to-mandarmani`,
  `${DOMAIN}/routes/ranchi-to-mayapur`,
  `${DOMAIN}/routes/ranchi-to-puri`,
  `${DOMAIN}/routes/ranchi-to-siliguri`,
  `${DOMAIN}/routes/siliguri-to-bhubaneswar`,
  `${DOMAIN}/routes/siliguri-to-kolkata`,
  `${DOMAIN}/routes/siliguri-to-ranchi`,
  `${DOMAIN}/routes/ranchi-to-bhubaneswar`,

  // Tour pages
  `${DOMAIN}/tours/agra-taj-mahal-tour`,
  `${DOMAIN}/tours/bhopal-sanchi-pachmarhi-tour`,
  `${DOMAIN}/tours/bodh-gaya-rajgir-tour`,
  `${DOMAIN}/tours/darjeeling-tour`,
  `${DOMAIN}/tours/dehradun-mussoorie-tour`,
  `${DOMAIN}/tours/golden-triangle-tour`,
  `${DOMAIN}/tours/haridwar-rishikesh-tour`,
  `${DOMAIN}/tours/jim-corbett-safari-tour`,
  `${DOMAIN}/tours/khajuraho-temple-tour`,
  `${DOMAIN}/tours/kolkata-beach-tour`,
  `${DOMAIN}/tours/kolkata-city-tour`,
  `${DOMAIN}/tours/nainital-lake-tour`,
  `${DOMAIN}/tours/north-bengal-tour`,
  `${DOMAIN}/tours/patna-rajgir-nalanda-tour`,
  `${DOMAIN}/tours/puri-konark-tour`,
  `${DOMAIN}/tours/ranchi-netarhat-tour`,
  `${DOMAIN}/tours/sundarbans-tour`,
];

async function submitToIndexNow() {
  console.log(`\n🚀 IndexNow Batch Submission`);
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log(`🔑 Key: ${INDEXNOW_KEY}`);
  console.log(`🌐 Host: www.kolkatacabservice.com\n`);

  const payload = {
    host: 'www.kolkatacabservice.com',
    key: INDEXNOW_KEY,
    keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200 || response.status === 202) {
      console.log(`✅ SUCCESS! All ${urls.length} URLs submitted to IndexNow.`);
      console.log(`📋 Search engines notified: Bing, Yandex, Seznam, Naver`);
      console.log(`⏰ Crawlers will visit these URLs within hours to days.\n`);
    } else {
      const body = await response.text();
      console.log(`⚠️ Response body: ${body}`);
    }
  } catch (error) {
    console.error(`❌ Error submitting to IndexNow:`, error);
  }
}

submitToIndexNow();
