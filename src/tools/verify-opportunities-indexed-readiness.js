const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const readinessPath = path.join(rootDir, '..', 'docs', 'opportunities', 'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_READINESS_SEQUENCE.md');
const listingPath = path.join(rootDir, 'opportunities', 'index.html');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const readiness = fs.readFileSync(readinessPath, 'utf8');
const listing = fs.readFileSync(listingPath, 'utf8');
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const readinessMarkers = [
  'READINESS_MARKER: RECORD_STATUS',
  'READINESS_MARKER: SEO_METADATA',
  'READINESS_MARKER: STRUCTURED_DATA',
  'READINESS_MARKER: SITEMAP_RSS',
  'READINESS_MARKER: NEWSLETTER',
  'READINESS_MARKER: PRODUCTION_QA',
  'READINESS_MARKER: ARCHIVE',
  'READINESS_MARKER: ONE_TASK_AT_A_TIME',
];

readinessMarkers.forEach((marker) => {
  assert(readiness.includes(marker), `missing readiness marker: ${marker}`);
});

const requiredSequence = [
  'record status',
  'SEO metadata',
  'structured data',
  'sitemap/RSS',
  'newsletter',
  'production QA',
  'archive',
];

const sequenceLine = readiness.match(/`record status -> SEO metadata -> structured data -> sitemap\/RSS -> newsletter -> production QA -> archive`/);
assert(Boolean(sequenceLine), 'missing exact indexed-release sequence line');

requiredSequence.forEach((label) => {
  assert(readiness.includes(label), `missing readiness sequence label: ${label}`);
});

records.forEach((record) => {
  assert(record.review_status !== 'published', `record must stay below published before readiness implementation: ${record.id}`);
});

[
  path.join(rootDir, 'opportunities.xml'),
  path.join(rootDir, 'opportunities.rss'),
  path.join(rootDir, 'opportunities', 'feed.xml'),
  path.join(rootDir, 'opportunities', 'rss.xml'),
].forEach((filePath) => {
  assert(!fs.existsSync(filePath), `readiness task must not add RSS output: ${path.relative(rootDir, filePath)}`);
});

assert(listing.includes('<meta name="robots" content="noindex,follow">'), 'listing must remain noindex during readiness marker task');
assert(!listing.includes('<script type="application/ld+json">'), 'listing must not add JSON-LD during readiness marker task');
assert(!listing.includes('<form'), 'listing must not add newsletter form during readiness marker task');

if (errors.length) {
  console.error(`Opportunities indexed-readiness verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities indexed-readiness verification PASS: ${readinessMarkers.length} markers, ${records.length} non-published records`);
