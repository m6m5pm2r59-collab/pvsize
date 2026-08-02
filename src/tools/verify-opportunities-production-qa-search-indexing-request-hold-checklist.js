const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const checklistPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_SEARCH_INDEXING_REQUEST_HOLD_CHECKLIST.md');
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

const requiredMarkers = [
  'SEARCH_INDEXING_HOLD: REQUIRED_BEFORE_REQUEST',
  'SEARCH_INDEXING_HOLD: REQUIRED_FIELDS',
  'SEARCH_INDEXING_HOLD: BLOCKED_CONDITIONS',
  'SEARCH_INDEXING_HOLD: RELEASE_CONDITIONS',
  'SEARCH_INDEXING_HOLD: EVIDENCE_REQUIREMENTS',
  'SEARCH_INDEXING_HOLD: CURRENT_NO_REQUEST',
];

requiredMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing search indexing hold marker: ${marker}`);
});

[
  'Search Console property ownership',
  'Sitemap registration',
  'Robots policy',
  'Canonical URLs',
  'Noindex fallback target',
  'Published records',
  'Local aggregate QA',
  'Production HTTP QA',
  'Structured data validation',
  'Sitemap output validation',
  'RSS output validation',
  'Newsletter output validation',
  'Evidence bundle',
  'Indexing approval',
].forEach((field) => {
  assert(checklist.includes(field), `missing required field: ${field}`);
});

[
  'Any indexable Opportunity is below `review_status: published`',
  'Local aggregate QA has failures',
  'Production HTTP QA has failures',
  'Robots policy on any indexable page is not `index,follow`',
  'Sitemap contains a non-published Opportunity URL',
  'RSS feed contains a non-published Opportunity item',
  'JSON-LD on any indexable page references a non-published Opportunity',
  'Newsletter output contains a non-published Opportunity',
  'Evidence bundle is incomplete or unsigned',
  'Fallback revert commit SHA is not recorded',
  'Production state is ambiguous',
  'Verification evidence is stale',
  'Indexing request is not separately approved',
].forEach((condition) => {
  assert(checklist.includes(condition), `missing blocked condition: ${condition}`);
});

[
  'All blocked conditions are cleared',
  'At least one published Opportunity exists',
  'All published Opportunities pass local and production QA',
  'Evidence bundle records all verification results',
  'Separate indexing request approval is logged',
  'Revert commit is verified as operationally reachable',
].forEach((condition) => {
  assert(checklist.includes(condition), `missing release condition: ${condition}`);
});

[
  'Search Console property ownership for pvsize.com',
  'Sitemap registration containing only published Opportunities',
  'Robots policy verification for all indexable Opportunities',
  'Canonical URL verification',
  'Published-record state verification',
  'Local aggregate QA pass output',
  'Production HTTP QA pass output',
  'Structured data validation pass output',
  'Sitemap output validation pass output',
  'RSS output validation pass output',
  'Newsletter output validation pass output',
  'Indexing request approval with reviewer and date',
  'Revert commit SHA with verification command',
].forEach((evidence) => {
  assert(checklist.includes(evidence), `missing evidence requirement: ${evidence}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during search indexing hold task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during search indexing hold task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during search indexing hold task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during search indexing hold task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during search indexing hold task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during search indexing hold task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during search indexing hold task`);
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
  assert(!fs.existsSync(filePath), `search indexing hold task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`search indexing hold fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`search indexing hold fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`search indexing hold fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('search indexing hold fixture must not add newsletter output during indexing hold planning');
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
  console.log('Self-test PASS: unsafe search indexing hold fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA search indexing request hold checklist verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA search indexing request hold checklist verification PASS: ${requiredMarkers.length} hold markers, ${records.length} non-published records`);
