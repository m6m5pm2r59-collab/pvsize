const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rulesPath = path.join(rootDir, '..', 'docs', 'opportunities', 'PVSIZE_OPPORTUNITIES_SITEMAP_RSS_RULES.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const rules = fs.readFileSync(rulesPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredRuleMarkers = [
  'SITEMAP_RSS_RULE: PUBLISHED_ONLY',
  'SITEMAP_RSS_RULE: CANONICAL_MATCH',
  'SITEMAP_RSS_RULE: ALLOWED_FEED_FIELDS',
  'SITEMAP_RSS_RULE: BLOCKED_FEED_FIELDS',
  'SITEMAP_RSS_RULE: REQUIRED_VERIFICATION',
  'SITEMAP_RSS_RULE: CURRENT_NO_OUTPUT',
];

requiredRuleMarkers.forEach((marker) => {
  assert(rules.includes(marker), `missing sitemap/RSS rule marker: ${marker}`);
});

[
  'Title.',
  'Canonical detail URL.',
  'Description or overview.',
  'Published date when verified.',
  'Source label.',
  'Country or region.',
  'Status.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing allowed feed marker: ${marker}`);
});

[
  'Inferred budget.',
  'Award likelihood.',
  'Inferred buyer intent.',
  'Contact details not present in the official source.',
  'Application instructions invented by PVSize.',
  'Any field generated only from AI confidence.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing blocked feed marker: ${marker}`);
});

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during sitemap/RSS rules task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL before published gate: ${record.id}`);
});

const rssCandidates = [
  path.join(rootDir, 'opportunities.xml'),
  path.join(rootDir, 'opportunities.rss'),
  path.join(rootDir, 'opportunities', 'feed.xml'),
  path.join(rootDir, 'opportunities', 'rss.xml'),
];

rssCandidates.forEach((filePath) => {
  assert(!fs.existsSync(filePath), `RSS output must not exist before feed gate: ${path.relative(rootDir, filePath)}`);
});

[
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
].forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(!html.includes('<link rel="alternate" type="application/rss+xml"'), `${relativePath} must not expose RSS alternate link`);
});

function runSelfTest() {
  const record = records[0];
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  const fixtureSitemap = `<url><loc>${detailUrl}</loc></url>`;
  const fixtureFeed = `<item><title>${record.title}</title><link>${detailUrl}</link></item>`;
  const before = errors.length;

  if (fixtureSitemap.includes(detailUrl) && record.review_status !== 'published') {
    errors.push(`sitemap fixture opportunity must be published: ${record.id}`);
  }
  if (fixtureFeed.includes(detailUrl) && record.review_status !== 'published') {
    errors.push(`RSS fixture opportunity must be published: ${record.id}`);
  }

  const selfTestErrors = errors.slice(before);
  ['sitemap fixture opportunity must be published', 'RSS fixture opportunity must be published'].forEach((marker) => {
    if (!selfTestErrors.some((error) => error.includes(marker))) {
      console.error(`Self-test FAIL: missing ${marker}`);
      process.exit(1);
    }
  });

  errors.splice(before);
  console.log('Self-test PASS: non-published opportunity sitemap/RSS fixtures');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities sitemap/RSS rules verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities sitemap/RSS rules verification PASS: ${requiredRuleMarkers.length} rule markers, ${records.length} non-published records`);
