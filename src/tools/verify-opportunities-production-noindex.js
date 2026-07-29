const fs = require('fs');
const https = require('https');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const productionOrigin = process.env.PVSIZE_PRODUCTION_ORIGIN || 'https://pvsize.com';
const paths = [
  '/opportunities/',
  ...records.map((record) => `/opportunities/${record.slug}/`),
];
const feedPaths = [
  '/opportunities/feed.xml',
  '/opportunities/rss.xml',
  '/opportunities.rss',
  '/opportunities.xml',
];

function requestUrl(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers: { 'User-Agent': 'PVSize Opportunities QA' } }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        resolve({
          body,
          statusCode: response.statusCode,
          url,
        });
      });
    });

    request.setTimeout(10000, () => {
      request.destroy(new Error(`timeout: ${url}`));
    });
    request.on('error', reject);
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function verifyOpportunityPages() {
  for (const route of paths) {
    const url = `${productionOrigin}${route}`;
    const response = await requestUrl(url);

    assert(response.statusCode === 200, `expected HTTP 200 for ${url}, found ${response.statusCode}`);
    assert(response.body.includes('noindex,follow'), `missing noindex,follow marker: ${url}`);
    assert(!response.body.includes('<script type="application/ld+json">'), `premature JSON-LD structured data: ${url}`);
    assert(!response.body.includes('<link rel="alternate" type="application/rss+xml"'), `premature RSS alternate link: ${url}`);

    console.log(`PASS ${response.statusCode} ${url}`);
  }
}

async function verifySitemapExclusion() {
  const sitemapUrl = `${productionOrigin}/sitemap.xml`;
  const response = await requestUrl(sitemapUrl);

  assert(response.statusCode === 200, `expected HTTP 200 for ${sitemapUrl}, found ${response.statusCode}`);
  paths.forEach((route) => {
    const absoluteUrl = `${productionOrigin}${route}`;
    assert(!response.body.includes(absoluteUrl), `opportunity URL must not be in production sitemap: ${absoluteUrl}`);
  });

  console.log(`PASS ${response.statusCode} ${sitemapUrl} excludes ${paths.length} Opportunities URL(s)`);
}

async function verifyFeedAbsence() {
  for (const route of feedPaths) {
    const url = `${productionOrigin}${route}`;
    const response = await requestUrl(url);

    assert(response.statusCode === 404, `expected HTTP 404 for non-approved feed ${url}, found ${response.statusCode}`);
    assert(!response.body.includes('/opportunities/'), `feed candidate must not expose Opportunities URLs: ${url}`);
    console.log(`PASS ${response.statusCode} ${url}`);
  }
}

async function verifyHomepageEntry() {
  const homepageUrl = `${productionOrigin}/`;
  const response = await requestUrl(homepageUrl);

  assert(response.statusCode === 200, `expected HTTP 200 for ${homepageUrl}, found ${response.statusCode}`);
  assert(response.body.includes('href="/opportunities/"'), 'production homepage must link to /opportunities/');
  console.log(`PASS ${response.statusCode} ${homepageUrl} includes /opportunities/ entry`);
}

async function verify() {
  assert(records.length > 0, 'expected at least one opportunity record');

  await verifyOpportunityPages();
  await verifySitemapExclusion();
  await verifyFeedAbsence();
  await verifyHomepageEntry();

  console.log(`Opportunities production noindex verification PASS: ${paths.length} page(s), ${feedPaths.length} feed candidate(s)`);
}

verify().catch((error) => {
  console.error(`Opportunities production noindex verification FAIL: ${error.message}`);
  process.exit(1);
});
