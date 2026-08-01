const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const checklistPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_SIGNOFF_CHECKLIST.md');
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
  'SIGNOFF: REQUIRED_BEFORE_INDEXED_RELEASE',
  'SIGNOFF: REQUIRED_SIGNOFF_FIELDS',
  'SIGNOFF: LOCAL_QA_SIGNOFF',
  'SIGNOFF: PRODUCTION_QA_SIGNOFF',
  'SIGNOFF: INDEXED_OUTPUT_SIGNOFF',
  'SIGNOFF: FALLBACK_SIGNOFF',
  'SIGNOFF: CLOSURE_HOLD',
  'SIGNOFF: CURRENT_NO_SIGNOFF',
];

requiredChecklistMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing signoff marker: ${marker}`);
});

[
  'Signoff id.',
  'Signoff date.',
  'Operator.',
  'Current phase.',
  'Release candidate commit SHA.',
  'QA run manifest path.',
  'Evidence bundle path.',
  'Artifact index path.',
  'Production deployment target.',
  'Production URL set.',
  'Local aggregate QA result.',
  'Production HTTP QA result.',
  'Robots/canonical QA result.',
  'Sitemap/RSS QA result.',
  'JSON-LD QA result.',
  'Newsletter output QA result.',
  'Fallback/noindex decision.',
  'Known risk acceptance.',
  'Final signoff decision.',
  'Next single task.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing required signoff field: ${marker}`);
});

[
  '`node src/tools/verify-opportunities-production-qa-run-manifest.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-evidence-bundle-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-all.js`',
  '`git diff --check`',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing local QA signoff command: ${marker}`);
});

[
  'Production listing URL HTTP PASS.',
  'Production detail URL HTTP PASS.',
  'Production homepage entry-link PASS.',
  'Production robots meta PASS.',
  'Production canonical PASS.',
  'Production unexpected JSON-LD absence PASS for non-published records.',
  'Production unexpected RSS alternate absence PASS until RSS is explicitly approved.',
  'Production fallback/noindex target PASS when fallback is used.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing production QA signoff marker: ${marker}`);
});

[
  'Sitemap Opportunities URLs match published records.',
  'RSS Opportunities items match published records.',
  'JSON-LD Opportunities entities match published records.',
  'Newsletter output references only published records.',
  'Search indexing request is separately approved.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing indexed output signoff marker: ${marker}`);
});

[
  'HOLD_NO_INDEX.',
  'ROLLBACK_TO_NOINDEX.',
  'APPROVED_FOR_INDEXED_RELEASE.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing fallback signoff outcome: ${marker}`);
});

[
  'Signoff record exists.',
  'Evidence bundle exists.',
  'Archive closure checklist passes.',
  'Production QA report exists.',
  'Published-record gates pass for every indexable Opportunity.',
  'No fallback hold is active.',
  'Next single task is recorded.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing closure hold marker: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during signoff checklist task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during signoff checklist task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during signoff checklist task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during signoff checklist task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during signoff checklist task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during signoff checklist task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during signoff checklist task`);
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
  assert(!fs.existsSync(filePath), `signoff checklist task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`signoff fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`signoff fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`signoff fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('signoff fixture must not add newsletter output during signoff planning');
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
  console.log('Self-test PASS: unsafe signoff fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA signoff checklist verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA signoff checklist verification PASS: ${requiredChecklistMarkers.length} checklist markers, ${records.length} non-published records`);
