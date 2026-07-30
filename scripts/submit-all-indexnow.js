/**
 * scripts/submit-all-indexnow.js
 * Submits key URLs to IndexNow (Bing, Yandex).
 * Run after deploy: node scripts/submit-all-indexnow.js
 */
const DOMAIN = 'https://www.kolkatacabservice.com';
const INDEXNOW_KEY = 'f63a562479e04845a7090b84784a9e52';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const CORE_PAGES = [
  ${DOMAIN}/,
  ${DOMAIN}/services,${DOMAIN}/services/airport-transfer,${DOMAIN}/services/outstation,
  ${DOMAIN}/services/local-taxi,${DOMAIN}/services/one-way,${DOMAIN}/services/round-trip,
  ${DOMAIN}/services/wedding-car-rental,${DOMAIN}/services/corporate-car-rental,
  ${DOMAIN}/west-bengal,${DOMAIN}/jharkhand,${DOMAIN}/odisha,${DOMAIN}/bihar,
  ${DOMAIN}/west-bengal/kolkata,${DOMAIN}/west-bengal/howrah,${DOMAIN}/west-bengal/siliguri,
  ${DOMAIN}/west-bengal/darjeeling,${DOMAIN}/jharkhand/ranchi,${DOMAIN}/jharkhand/jamshedpur,
  ${DOMAIN}/jharkhand/dhanbad,${DOMAIN}/jharkhand/bokaro,${DOMAIN}/jharkhand/deoghar,
  ${DOMAIN}/odisha/bhubaneswar,${DOMAIN}/odisha/puri,${DOMAIN}/kolkata/salt-lake,
  ${DOMAIN}/routes/kolkata-to-ranchi,${DOMAIN}/routes/ranchi-to-kolkata,
  ${DOMAIN}/routes/kolkata-to-jamshedpur,${DOMAIN}/routes/jamshedpur-to-kolkata,
  ${DOMAIN}/routes/kolkata-to-bhubaneswar,${DOMAIN}/routes/kolkata-to-darjeeling,
  ${DOMAIN}/routes/kolkata-to-siliguri,${DOMAIN}/routes/kolkata-to-puri,
  ${DOMAIN}/routes/kolkata-to-digha,${DOMAIN}/routes/kolkata-to-durgapur,
  ${DOMAIN}/kolkata-to-jamshedpur-cab,${DOMAIN}/jamshedpur-to-kolkata-cab,
  ${DOMAIN}/fare-chart,${DOMAIN}/fleet,${DOMAIN}/faq,${DOMAIN}/about,${DOMAIN}/contact,
];
async function main() {
  console.log(Submitting  URLs to IndexNow...);
  const payload = { host: 'www.kolkatacabservice.com', key: INDEXNOW_KEY, keyLocation: ${DOMAIN}/.txt, urlList: CORE_PAGES };
  const response = await fetch(INDEXNOW_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(payload) });
  console.log(Response:  );
  if (response.status === 200 || response.status === 202) console.log(SUCCESS!  URLs submitted.);
  console.log('\nFor Google: https://search.google.com/search-console');
  console.log('  Sitemaps -> Add sitemap_index.xml AND sitemap.xml');
  console.log('  URL Inspection -> homepage -> Request Indexing');
}
main().catch(console.error);
