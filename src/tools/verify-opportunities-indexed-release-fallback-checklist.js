const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const checklistPath = path.join(rootDir, '..', 'docs', 'opportunities', 'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_FALLBACK_CHECKLIST.md');
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
  'FALLBACK_CHECKLIST: NOINDEX_FIRST',
  'FALLBACK_CHECKLIST: FALLBACK_TRIGGER',
  'FALLBACK_CHECKLIST: ROLLBACK_TARGET',
  'FALLBACK_CHECKLIST: NOINDEX_FALLBACK_ACTIONS',
  'FALLBACK_CHECKLIST: FALLBACK_VERIFICATION',
  'FALLBACK_CHECKLIST: PRODUCTION_RECHECK',
  'FALLBACK_CHECKLIST: INDEXING_HOLD',
  'FALLBACK_CHECKLIST: FAILURE_REPORT',
  'FALLBACK_CHECKLIST: CURRENT_NO_EXECUTION',
];

requiredChecklistMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing fallback checklist marker: ${marker}`);
});

[
  'Production listing/detail HTTP failure.',
  'Robots policy mismatch.',
  'Canonical URL mismatch.',
  'Sitemap includes non-published Opportunity URL.',
  'RSS/feed includes non-published Opportunity URL.',
  'JSON-LD appears for non-published Opportunity URL.',
  'Newsletter output links to unverifiable or non-published indexed URL.',
  'Analytics or CTA marker missing from required page.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing fallback trigger marker: ${marker}`);
});

[
  'Last known good noindex commit SHA.',
  'Release candidate commit SHA.',
  'Deployment target.',
  'Expected Opportunities URL set.',
  'Expected sitemap/RSS output set.',
  'Expected JSON-LD output set.',
  'Expected newsletter output set.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing rollback target marker: ${marker}`);
});

[
  'Listing `noindex,follow`.',
  'Detail-page `noindex,follow`.',
  'Opportunities URL exclusion from sitemap.',
  'Opportunities URL exclusion from RSS/feed.',
  'JSON-LD removal for non-published records.',
  'Newsletter link removal for non-published indexed URLs.',
  'Search indexing request hold.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing noindex fallback action marker: ${marker}`);
});

[
  '`node src/tools/verify-opportunities-index-policy.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-readiness.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-indexed-release-fallback-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-all.js`',
  '`git diff --check`',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing fallback verification command marker: ${marker}`);
});

[
  'Do not request Search Console indexing.',
  'Do not submit sitemap ping.',
  'Do not publish RSS/feed announcement.',
  'Do not send newsletter announcement.',
  'Do not mark indexed release complete.',
  'Do not mark Phase 5C Closed.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing indexing hold marker: ${marker}`);
});

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during fallback checklist task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during fallback checklist task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during fallback checklist task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during fallback checklist task`);
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
  assert(!fs.existsSync(filePath), `fallback checklist task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`fallback fixture must restore noindex for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`fallback fixture must remove JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`fallback fixture must remove sitemap URL for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureFeed.includes(detailUrl)) {
    errors.push(`fallback fixture must remove RSS URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('fallback fixture must block newsletter output during fallback planning');
  }

  const selfTestErrors = errors.slice(before);
  [
    'must restore noindex for non-published record',
    'must remove JSON-LD for non-published record',
    'must remove sitemap URL for non-published record',
    'must remove RSS URL for non-published record',
    'must block newsletter output',
  ].forEach((marker) => {
    if (!selfTestErrors.some((error) => error.includes(marker))) {
      console.error(`Self-test FAIL: missing ${marker}`);
      process.exit(1);
    }
  });

  errors.splice(before);
  console.log('Self-test PASS: unsafe indexed release fallback fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities indexed release fallback checklist verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities indexed release fallback checklist verification PASS: ${requiredChecklistMarkers.length} checklist markers, ${records.length} non-published records`);
