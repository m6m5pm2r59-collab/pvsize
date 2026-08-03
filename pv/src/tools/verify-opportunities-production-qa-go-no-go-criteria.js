const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const criteriaPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_GO_NO_GO_CRITERIA.md');
const statusPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_STATUS.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const criteria = fs.readFileSync(criteriaPath, 'utf8');
const status = fs.readFileSync(statusPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredMarkers = [
  'GO_NO_GO: REQUIRED_BEFORE_APPROVAL',
  'GO_NO_GO: REQUIRED_GROUPS',
  'GO_NO_GO: GO_CRITERIA',
  'GO_NO_GO: NO_GO_CRITERIA',
  'GO_NO_GO: HOLD_CRITERIA',
  'GO_NO_GO: CURRENT_NO_APPROVAL',
];

requiredMarkers.forEach((marker) => {
  assert(criteria.includes(marker), `missing go/no-go marker: ${marker}`);
});

[
  'Release candidate criteria.',
  'Published-record criteria.',
  'Local QA criteria.',
  'Production HTTP criteria.',
  'Robots/canonical criteria.',
  'Sitemap/RSS criteria.',
  'JSON-LD criteria.',
  'Newsletter output criteria.',
  'Evidence bundle criteria.',
  'Signoff criteria.',
  'Decision log criteria.',
  'Fallback criteria.',
  'Risk criteria.',
  'Next single task criteria.',
].forEach((marker) => {
  assert(criteria.includes(marker), `missing required criteria group: ${marker}`);
});

[
  'Release candidate commit SHA is recorded.',
  'All indexable Opportunities are `review_status: published`.',
  'Local aggregate QA passes.',
  'Production HTTP QA passes.',
  'Robots and canonical QA passes.',
  'Sitemap/RSS output includes only published Opportunities.',
  'JSON-LD output includes only published Opportunities.',
  'Newsletter output includes only published Opportunities.',
  'Evidence bundle is complete.',
  'Signoff checklist is complete.',
  'Decision log is complete.',
  'Fallback/noindex target is recorded.',
  'Known risks are accepted.',
  'Next single task is recorded.',
].forEach((marker) => {
  assert(criteria.includes(marker), `missing GO criterion: ${marker}`);
});

[
  'Release candidate commit SHA is missing.',
  'Any indexable Opportunity is below `review_status: published`.',
  'Local aggregate QA fails.',
  'Production HTTP QA fails.',
  'Robots or canonical QA fails.',
  'Sitemap/RSS output includes a non-published Opportunity.',
  'JSON-LD output includes a non-published Opportunity.',
  'Newsletter output includes a non-published Opportunity.',
  'Evidence bundle is incomplete.',
  'Signoff checklist is incomplete.',
  'Decision log is incomplete.',
  'Fallback/noindex target is missing.',
  'Known risks are unaccepted.',
  'Next single task is missing.',
].forEach((marker) => {
  assert(criteria.includes(marker), `missing NO-GO criterion: ${marker}`);
});

[
  'Production state is unclear.',
  'Production deployment target is ambiguous.',
  'Verification evidence is stale.',
  'Sitemap/RSS output cannot be inspected.',
  'JSON-LD output cannot be inspected.',
  'Newsletter output cannot be inspected.',
  'Search indexing request is not separately approved.',
  'Fallback path cannot be verified.',
  'Archive closure evidence is incomplete.',
].forEach((marker) => {
  assert(criteria.includes(marker), `missing HOLD criterion: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during go/no-go criteria task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during go/no-go criteria task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during go/no-go criteria task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during go/no-go criteria task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during go/no-go criteria task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during go/no-go criteria task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during go/no-go criteria task`);
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
  assert(!fs.existsSync(filePath), `go/no-go criteria task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`go/no-go fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`go/no-go fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`go/no-go fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('go/no-go fixture must not add newsletter output during go/no-go planning');
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
  console.log('Self-test PASS: unsafe go/no-go fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA go/no-go criteria verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA go/no-go criteria verification PASS: ${requiredMarkers.length} criteria markers, ${records.length} non-published records`);
