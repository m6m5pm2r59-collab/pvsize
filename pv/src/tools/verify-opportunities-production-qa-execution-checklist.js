const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const checklistPath = path.join(rootDir, '..', 'docs', 'opportunities', 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EXECUTION_CHECKLIST.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const checklist = fs.readFileSync(checklistPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredChecklistMarkers = [
  'PRODUCTION_QA_CHECKLIST: ONE_RELEASE_AT_A_TIME',
  'PRODUCTION_QA_CHECKLIST: PREFLIGHT_SNAPSHOT',
  'PRODUCTION_QA_CHECKLIST: LOCAL_GATE',
  'PRODUCTION_QA_CHECKLIST: RELEASE_CANDIDATE_REVIEW',
  'PRODUCTION_QA_CHECKLIST: POST_DEPLOY_HTTP',
  'PRODUCTION_QA_CHECKLIST: POST_DEPLOY_INDEXED_OUTPUT',
  'PRODUCTION_QA_CHECKLIST: SEARCH_INDEXING_HOLD',
  'PRODUCTION_QA_CHECKLIST: FAILURE_HANDLING',
  'PRODUCTION_QA_CHECKLIST: ARCHIVE_HANDOFF',
  'PRODUCTION_QA_CHECKLIST: CURRENT_NO_EXECUTION',
];

requiredChecklistMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing production QA checklist marker: ${marker}`);
});

[
  'Release candidate commit SHA.',
  'Changed scope.',
  'Expected Opportunities URLs.',
  'Expected indexed/noindex policy.',
  'Expected sitemap/RSS files.',
  'Expected JSON-LD surfaces.',
  'Expected newsletter surfaces.',
  'Rollback target commit SHA.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing preflight snapshot marker: ${marker}`);
});

[
  '`node src/tools/verify-opportunities-production-qa-readiness.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-all.js`',
  '`git diff --check`',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing local gate command marker: ${marker}`);
});

[
  'Listing URL returns HTTP 200.',
  'Each expected detail URL returns HTTP 200.',
  'Homepage/internal entry link is present.',
  'Canonical URLs match deployed URLs.',
  'Robots policy matches the approved release plan.',
  'Analytics marker is present.',
  'Official source CTA is present.',
  'Calculator CTA is present.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing post-deploy HTTP marker: ${marker}`);
});

[
  'Sitemap includes only approved published Opportunities URLs.',
  'Sitemap excludes non-published Opportunities URLs.',
  'RSS/feed includes only approved published Opportunities URLs.',
  'RSS/feed excludes non-published Opportunities URLs.',
  'JSON-LD appears only for approved published Opportunities URLs.',
  'Newsletter output links only to published or intentionally noindex Opportunities pages.',
  'No non-published record appears in any indexable surface.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing indexed output marker: ${marker}`);
});

[
  'Rollback to the recorded target commit or keep noindex policy.',
  'Remove or block unintended indexed output.',
  'Do not request indexing.',
  'Do not mark indexed release complete.',
  'Do not mark Phase 5C Closed.',
  'Write failure report with URL, expected result, actual result, and rollback decision.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing failure handling marker: ${marker}`);
});

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during production QA execution checklist task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during production QA execution checklist task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during production QA execution checklist task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during production QA execution checklist task`);
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
  assert(!fs.existsSync(filePath), `production QA execution checklist task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
  const fixtureFeed = `<item><link>${detailUrl}</link></item>`;
  const before = errors.length;

  if (record.review_status !== 'published' && fixtureHtml.includes('index,follow')) {
    errors.push(`execution checklist fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`execution checklist fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`execution checklist fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureFeed.includes(detailUrl)) {
    errors.push(`execution checklist fixture must not add RSS URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('execution checklist fixture must not add newsletter output during checklist planning');
  }

  const selfTestErrors = errors.slice(before);
  [
    'must not index non-published record',
    'must not add JSON-LD for non-published record',
    'must not add sitemap URL for non-published record',
    'must not add RSS URL for non-published record',
    'must not add newsletter output',
  ].forEach((marker) => {
    if (!selfTestErrors.some((error) => error.includes(marker))) {
      console.error(`Self-test FAIL: missing ${marker}`);
      process.exit(1);
    }
  });

  errors.splice(before);
  console.log('Self-test PASS: unsafe production QA execution fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA execution checklist verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA execution checklist verification PASS: ${requiredChecklistMarkers.length} checklist markers, ${records.length} non-published records`);
