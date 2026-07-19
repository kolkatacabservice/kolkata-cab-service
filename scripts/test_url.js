const https = require('https');

const urls = [
  'https://www.kolkatacabservice.com/about',
  'https://www.kolkatacabservice.com/fleet',
  'https://www.kolkatacabservice.com/routes/kolkata-to-ranchi',
  'https://www.kolkatacabservice.com/west-bengal/kolkata'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        cacheHeader: res.headers['x-nextjs-cache'] || 'n/a',
        prerenderHeader: res.headers['x-nextjs-prerender'] || 'n/a',
        staleHeader: res.headers['x-nextjs-stale-time'] || 'n/a'
      });
      res.resume(); // consume response to free memory
    }).on('error', (err) => {
      resolve({
        url,
        statusCode: 'ERROR',
        error: err.message
      });
    });
  });
}

async function run() {
  console.log('Testing live urls...');
  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(`\nURL: ${res.url}`);
    console.log(`  Status: ${res.statusCode}`);
    if (res.statusCode !== 'ERROR') {
      console.log(`  x-nextjs-cache: ${res.cacheHeader}`);
      console.log(`  x-nextjs-prerender: ${res.prerenderHeader}`);
      console.log(`  x-nextjs-stale-time: ${res.staleHeader}`);
    } else {
      console.log(`  Error: ${res.error}`);
    }
  }
}

run();
