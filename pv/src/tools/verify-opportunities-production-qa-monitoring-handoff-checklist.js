const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const checklistPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_MONITORING_HANDOFF_CHECKLIST.md');
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
  'MONITORING_HANDOFF: REQUIRED_AFTER_GO',
  'MONITORING_HANDOFF: REQUIRED_FIELDS',
  'MONITORING_HANDOFF: REQUIRED_CHECKS',
  'MONITORING_HANDOFF: ESCALATION_TRIGGERS',
  'MONITORING_HANDOFF: CLOSURE_EVIDENCE',
  'MONITORING_HANDOFF: CURRENT_NO_HANDOFF',
];

requiredMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing monitoring handoff marker: ${marker}`);
});

[
  'Monitoring handoff id.',
  'Handoff date.',
  'Current phase.',
  'Release candidate commit SHA.',
  'Production deployment target.',
  'Production URL set.',
  'Published-record list.',
  'Indexed output summary.',
  'Newsletter output summary.',
  'Monitoring owner.',
  'Monitoring window.',
  'Monitoring check cadence.',
  'Analytics event checks.',
  'Search visibility checks.',
  'Sitemap/RSS checks.',
  'JSON-LD checks.',
  'Newsletter output checks.',
  'Error and HTTP status checks.',
  'Escalation path.',
  'Rollback/noindex trigger list.',
  'Next single task.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing required monitoring handoff field: ${marker}`);
});

[
  'Opportunities listing HTTP status.',
  'Opportunities detail HTTP statuses.',
  'Robots meta status.',
  'Canonical URL status.',
  'Sitemap inclusion status.',
  'RSS/feed item status.',
  'JSON-LD parse status.',
  'Newsletter output status.',
  'Analytics event status.',
  'Homepage entry-link status.',
  'Calculator CTA status.',
  'Error log status.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing monitoring check marker: ${marker}`);
});

[
  'Any Opportunities URL returns non-200.',
  'Any published Opportunity is missing from expected indexed output.',
  'Any non-published Opportunity appears in indexed output.',
  'Robots or canonical output differs from the approved release plan.',
  'Sitemap/RSS output differs from the approved release plan.',
  'JSON-LD output differs from the approved release plan.',
  'Newsletter output differs from the approved release plan.',
  'Analytics events stop firing.',
  'Search indexing request status is unclear.',
  'Error logs show Opportunities regressions.',
  'Fallback/noindex trigger fires.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing escalation trigger: ${marker}`);
});

[
  'Production QA run manifest.',
  'Evidence bundle.',
  'Signoff checklist.',
  'Decision log.',
  'Go/no-go criteria.',
  'Release notes.',
  'Fallback checklist.',
  'Archive closure checklist.',
  'Daily ops report.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing closure evidence marker: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during monitoring handoff task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during monitoring handoff task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during monitoring handoff task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during monitoring handoff task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during monitoring handoff task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during monitoring handoff task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during monitoring handoff task`);
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
  assert(!fs.existsSync(filePath), `monitoring handoff task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`monitoring handoff fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`monitoring handoff fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`monitoring handoff fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('monitoring handoff fixture must not add newsletter output during monitoring handoff planning');
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
  console.log('Self-test PASS: unsafe monitoring handoff fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA monitoring handoff verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA monitoring handoff verification PASS: ${requiredMarkers.length} checklist markers, ${records.length} non-published records`);
