const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const checklistPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EVIDENCE_BUNDLE_CHECKLIST.md');
const statusPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_STATUS.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const checklist = fs.readFileSync(checklistPath, 'utf8');
const status = fs.readFileSync(statusPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredChecklistMarkers = [
  'EVIDENCE_BUNDLE: COMPLETE_BEFORE_CLOSURE',
  'EVIDENCE_BUNDLE: REQUIRED_SECTIONS',
  'EVIDENCE_BUNDLE: LOCAL_QA_EVIDENCE',
  'EVIDENCE_BUNDLE: PRODUCTION_QA_EVIDENCE',
  'EVIDENCE_BUNDLE: INDEXED_OUTPUT_EVIDENCE',
  'EVIDENCE_BUNDLE: FALLBACK_EVIDENCE',
  'EVIDENCE_BUNDLE: CURRENT_NO_EXECUTION',
];

requiredChecklistMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing evidence bundle marker: ${marker}`);
});

[
  'Release summary.',
  'Release candidate commit SHA.',
  'Last known good noindex commit SHA.',
  'Production deployment target.',
  'Production URLs checked.',
  'Local QA commands and results.',
  'Production HTTP results.',
  'Robots/canonical results.',
  'Sitemap/RSS results.',
  'JSON-LD results.',
  'Newsletter output results.',
  'Fallback/noindex decision.',
  'Known risks.',
  'Next single task.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing required evidence section: ${marker}`);
});

[
  '`node src/tools/verify-opportunities-production-qa-run-manifest.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-artifact-index.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-handoff-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-all.js`',
  '`git diff --check`',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing local QA evidence command: ${marker}`);
});

[
  'Production listing URL HTTP status.',
  'Production detail URL HTTP statuses.',
  'Production homepage entry-link result.',
  'Production robots meta result for each Opportunities URL.',
  'Production canonical result for each Opportunities URL.',
  'Production no unexpected JSON-LD result for non-published records.',
  'Production no unexpected RSS alternate result.',
  'Production fallback/noindex target verification when fallback is used.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing production QA evidence marker: ${marker}`);
});

[
  'Sitemap Opportunities URL list.',
  'RSS Opportunities item list.',
  'JSON-LD Opportunities URL list.',
  'Newsletter output summary.',
  'Published-record id list.',
  'Published-record review-state proof.',
  'Search indexing request status, if a separate task explicitly approves indexing.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing indexed output evidence marker: ${marker}`);
});

[
  'Trigger reason.',
  'Fallback/noindex commit SHA or deployment target.',
  'URLs rechecked after fallback.',
  'Sitemap/RSS recheck result.',
  'JSON-LD recheck result.',
  'Newsletter output recheck result.',
  'Known residual risks.',
  'Next single task after fallback.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing fallback evidence marker: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during evidence bundle task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during evidence bundle task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during evidence bundle task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during evidence bundle task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during evidence bundle task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during evidence bundle task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during evidence bundle task`);
  assert(!html.includes('<link rel="alternate" type="application/rss+xml"'), `${relativePath} must not expose RSS alternate link`);
  assert(!html.includes('<form'), `${relativePath} must not include newsletter form`);
  assert(!html.includes('type="email"'), `${relativePath} must not include email input`);
  assert(!html.includes('/api/newsletter'), `${relativePath} must not include newsletter API endpoint`);
});

[
  path.join(rootDir, 'opportunities.xml'),
  path.join(rootDir, 'opportunities.rss'),
  path.join(rootDir, 'opportunities', 'feed.xml'),
  path.join(rootDir, 'opportunities', 'rss.xml'),
].forEach((filePath) => {
  assert(!fs.existsSync(filePath), `evidence bundle task must not add RSS output: ${path.relative(rootDir, filePath)}`);
});

function runSelfTest() {
  const record = records[0];
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  const fixtureHtml = [
    '<meta name="robots" content="index,follow">',
    '<script type="application/ld+json">{"@type":"WebPage"}</script>',
    '<form action="/api/newsletter"><input type="email" name="email"></form>',
  ].join('');
  const fixtureSitemap = `<url><loc>${detailUrl}</loc></url>`;
  const before = errors.length;

  if (record.review_status !== 'published' && fixtureHtml.includes('index,follow')) {
    errors.push(`evidence bundle fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`evidence bundle fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`evidence bundle fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('evidence bundle fixture must not add newsletter output during evidence bundle planning');
  }

  const selfTestErrors = errors.slice(before);
  [
    'must not index non-published record',
    'must not add JSON-LD for non-published record',
    'must not add sitemap URL for non-published record',
    'must not add newsletter output',
  ].forEach((marker) => {
    if (!selfTestErrors.some((error) => error.includes(marker))) {
      console.error(`Self-test FAIL: missing ${marker}`);
      process.exit(1);
    }
  });

  errors.splice(before);
  console.log('Self-test PASS: unsafe evidence bundle fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA evidence bundle verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA evidence bundle verification PASS: ${requiredChecklistMarkers.length} checklist markers, ${records.length} non-published records`);
