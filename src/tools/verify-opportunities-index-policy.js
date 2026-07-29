const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const robotsPath = path.join(rootDir, 'robots.txt');
const listingPath = path.join(rootDir, 'opportunities', 'index.html');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : '';
const errors = [];

const opportunityUrls = [
  'https://pvsize.com/opportunities/',
  ...records.map((record) => `https://pvsize.com/opportunities/${record.slug}/`),
];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(records.length > 0, 'expected at least one opportunity record');
assert(fs.existsSync(listingPath), 'missing opportunities listing page');
assert(robots.includes('Sitemap: https://pvsize.com/sitemap.xml'), 'robots.txt must keep sitemap pointer');

records.forEach((record) => {
  assert(record.review_status !== 'published', `record must not be published before production QA: ${record.id}`);
});

opportunityUrls.forEach((url, index) => {
  assert(!sitemap.includes(url), `opportunity URL must not be in sitemap before production QA: ${url}`);
  if (sitemap.includes(url) && index > 0) {
    const record = records[index - 1];
    assert(record.review_status === 'published', `sitemap opportunity must be published: ${record.id}`);
  }
});

[
  listingPath,
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
].forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must stay noindex`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD before schema QA`);
  assert(!html.includes('<link rel="alternate" type="application/rss+xml"'), `${relativePath} must not expose RSS before feed QA`);
});

records.forEach((record) => {
  const detailPath = path.join(rootDir, 'opportunities', record.slug, 'index.html');
  const html = fs.readFileSync(detailPath, 'utf8');
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;

  if (html.includes('<script type="application/ld+json">')) {
    assert(record.review_status === 'published', `schema opportunity must be published: ${record.id}`);
  }
  if (html.includes('<link rel="alternate" type="application/rss+xml"') || sitemap.includes(detailUrl)) {
    assert(record.review_status === 'published', `indexable opportunity must be published: ${record.id}`);
  }
});

const rssCandidates = [
  path.join(rootDir, 'opportunities.xml'),
  path.join(rootDir, 'opportunities.rss'),
  path.join(rootDir, 'opportunities', 'feed.xml'),
  path.join(rootDir, 'opportunities', 'rss.xml'),
];

rssCandidates.forEach((filePath) => {
  assert(!fs.existsSync(filePath), `RSS file must not exist before feed QA: ${path.relative(rootDir, filePath)}`);
  if (fs.existsSync(filePath)) {
    const feed = fs.readFileSync(filePath, 'utf8');
    records.forEach((record) => {
      const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
      if (feed.includes(detailUrl) || feed.includes(`/opportunities/${record.slug}/`)) {
        assert(record.review_status === 'published', `RSS opportunity must be published: ${record.id}`);
      }
    });
  }
});

if (errors.length) {
  console.error(`Opportunities index-policy verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities index-policy verification PASS: ${opportunityUrls.length} URL(s) remain noindex and out of sitemap/RSS/schema`);
