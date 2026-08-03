const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rulesPath = path.join(rootDir, '..', 'docs', 'opportunities', 'PVSIZE_OPPORTUNITIES_STRUCTURED_DATA_RULES.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const listingPath = path.join(rootDir, 'opportunities', 'index.html');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const rules = fs.readFileSync(rulesPath, 'utf8');
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredRuleMarkers = [
  'STRUCTURED_DATA_RULE: PUBLISHED_ONLY',
  'STRUCTURED_DATA_RULE: ALLOWED_SCHEMA_TYPES',
  'STRUCTURED_DATA_RULE: ALLOWED_FIELDS',
  'STRUCTURED_DATA_RULE: BLOCKED_FIELDS',
  'STRUCTURED_DATA_RULE: REQUIRED_VERIFICATION',
  'STRUCTURED_DATA_RULE: CURRENT_NO_OUTPUT',
];

requiredRuleMarkers.forEach((marker) => {
  assert(rules.includes(marker), `missing structured-data rule marker: ${marker}`);
});

[
  '`WebPage`',
  '`ItemList`',
  '`name`',
  '`description`',
  '`url`',
  '`datePublished`',
  '`validThrough`',
  '`provider`',
  '`areaServed`',
  '`about`',
  '`isBasedOn`',
].forEach((marker) => {
  assert(rules.includes(marker), `missing allowed schema marker: ${marker}`);
});

[
  'Award likelihood',
  'Inferred budget',
  'Inferred buyer intent',
  'Contact details not present in the official source',
  'Any field generated only from AI confidence',
].forEach((marker) => {
  assert(rules.includes(marker), `missing blocked schema marker: ${marker}`);
});

records.forEach((record) => {
  assert(record.review_status !== 'published', `record must stay below published during structured-data rules task: ${record.id}`);
});

[
  listingPath,
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
].forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD output`);
  assert(!html.includes('application/ld+json'), `${relativePath} must not include JSON-LD MIME marker`);
});

function runSelfTest() {
  const record = records[0];
  const fixture = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: record.title,
    url: `https://pvsize.com/opportunities/${record.slug}/`,
  };
  const before = errors.length;

  if (record.review_status !== 'published' && fixture['@type']) {
    errors.push(`schema fixture opportunity must be published: ${record.id}`);
  }

  const selfTestErrors = errors.slice(before);
  if (!selfTestErrors.some((error) => error.includes('schema fixture opportunity must be published'))) {
    console.error('Self-test FAIL: non-published schema fixture did not fail');
    process.exit(1);
  }

  errors.splice(before);
  console.log('Self-test PASS: non-published opportunity JSON-LD fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities structured-data rules verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities structured-data rules verification PASS: ${requiredRuleMarkers.length} rule markers, ${records.length} non-published records`);
