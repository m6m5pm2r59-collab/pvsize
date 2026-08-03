const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const checklistPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_ARCHIVE_CLOSURE_CHECKLIST.md');
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
  'ARCHIVE_CLOSURE_CHECKLIST: NO_CLOSURE_IN_PLANNING',
  'ARCHIVE_CLOSURE_CHECKLIST: CLOSURE_PRECONDITIONS',
  'ARCHIVE_CLOSURE_CHECKLIST: EVIDENCE_PACKAGE',
  'ARCHIVE_CLOSURE_CHECKLIST: INDEXED_OUTPUT_EVIDENCE',
  'ARCHIVE_CLOSURE_CHECKLIST: CLOSURE_DECISION',
  'ARCHIVE_CLOSURE_CHECKLIST: REPORT_HANDOFF',
  'ARCHIVE_CLOSURE_CHECKLIST: CURRENT_NO_CLOSURE',
];

requiredChecklistMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing archive closure checklist marker: ${marker}`);
});

[
  'Release candidate commit SHA is recorded.',
  'Production deployment target is recorded.',
  'Production URLs checked are recorded.',
  'Local aggregate QA passed.',
  'Production HTTP QA passed.',
  'Indexed output QA passed.',
  'Fallback/noindex rollback plan is recorded.',
  'No critical production defects remain open.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing closure precondition marker: ${marker}`);
});

[
  'Changed scope.',
  'Modified files.',
  'Verification commands and results.',
  'Production deployment target.',
  'Production URLs.',
  'Robots policy result.',
  'Sitemap/RSS result.',
  'JSON-LD result.',
  'Newsletter output result.',
  'Analytics/CTA result.',
  'Rollback/noindex fallback target.',
  'Known risks.',
  'Next single task.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing evidence package marker: ${marker}`);
});

[
  'Sitemap includes only approved published Opportunities URLs.',
  'RSS/feed includes only approved published Opportunities URLs.',
  'JSON-LD appears only for approved published Opportunities URLs.',
  'Newsletter output links only to published or intentionally noindex Opportunities pages.',
  'Non-published records are excluded from all indexable surfaces.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing indexed output evidence marker: ${marker}`);
});

[
  'Indexed release production QA passed.',
  'Archive evidence package is complete.',
  'Rollback/noindex fallback remains available.',
  'Indexed output behavior matches approved scope.',
  'No forbidden MVP features were added.',
  'Phase 5C closure is approved only in that future closure task.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing closure decision marker: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during archive closure planning');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during archive closure planning');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during archive closure planning');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during archive closure checklist task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during archive closure checklist task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during archive closure checklist task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during archive closure checklist task`);
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
  assert(!fs.existsSync(filePath), `archive closure checklist task must not add RSS output: ${path.relative(rootDir, filePath)}`);
});

function runSelfTest() {
  const record = records[0];
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  const fixtureStatus = '## Current Phase\n\nPhase 5C Closed\n\nindexed release complete';
  const fixtureHtml = [
    '<meta name="robots" content="index,follow">',
    '<script type="application/ld+json">{"@type":"WebPage"}</script>',
    '<form action="/api/newsletter"><input type="email" name="email"></form>',
  ].join('');
  const fixtureSitemap = `<url><loc>${detailUrl}</loc></url>`;
  const before = errors.length;

  if (fixtureStatus.includes('Phase 5C Closed')) {
    errors.push('archive closure fixture must not mark Phase 5C Closed during planning');
  }
  if (fixtureStatus.includes('indexed release complete')) {
    errors.push('archive closure fixture must not mark indexed release complete during planning');
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('index,follow')) {
    errors.push(`archive closure fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`archive closure fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`archive closure fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('archive closure fixture must not add newsletter output during closure planning');
  }

  const selfTestErrors = errors.slice(before);
  [
    'must not mark Phase 5C Closed',
    'must not mark indexed release complete',
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
  console.log('Self-test PASS: unsafe archive closure fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities indexed release archive closure checklist verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities indexed release archive closure checklist verification PASS: ${requiredChecklistMarkers.length} checklist markers, ${records.length} non-published records`);
