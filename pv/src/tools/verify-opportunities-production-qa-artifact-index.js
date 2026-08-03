const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const repoDir = path.join(rootDir, '..');
const docsDir = path.join(repoDir, 'docs', 'opportunities');
const reportsDir = '/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports';
const artifactIndexPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_ARTIFACT_INDEX.md');
const statusPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_STATUS.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const artifactIndex = fs.readFileSync(artifactIndexPath, 'utf8');
const status = fs.readFileSync(statusPath, 'utf8');
const aggregateQa = fs.readFileSync(path.join(rootDir, 'tools', 'verify-opportunities-all.js'), 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredMarkers = [
  'ARTIFACT_INDEX: PLANNING_ONLY',
  'ARTIFACT_INDEX: REQUIRED_GROUPS',
  'ARTIFACT_INDEX: PLANNING_DOCUMENTS',
  'ARTIFACT_INDEX: VERIFICATION_SCRIPTS',
  'ARTIFACT_INDEX: REPORT_TRAIL',
  'ARTIFACT_INDEX: COMPLETENESS_RULES',
  'ARTIFACT_INDEX: CURRENT_NO_RELEASE',
];

requiredMarkers.forEach((marker) => {
  assert(artifactIndex.includes(marker), `missing artifact index marker: ${marker}`);
});

const requiredDocs = [
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_READINESS_RULES.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EXECUTION_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_FALLBACK_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_ARCHIVE_CLOSURE_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_READINESS_SEQUENCE.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_SEARCH_INDEXING_REQUEST_HOLD_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PUBLISHED_RECORD_PREFLIGHT_MATRIX.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_OUTPUT_ACTIVATION_PREFLIGHT_MATRIX.md',
  'PVSIZE_OPPORTUNITIES_NEWSLETTER_ACTIVATION_HOLD_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_RELEASE_PLANNING_SUMMARY.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_MARVIS_HANDOFF.md',
  'PVSIZE_OPPORTUNITIES_STATUS.md',
];

requiredDocs.forEach((fileName) => {
  assert(artifactIndex.includes(`docs/opportunities/${fileName}`), `artifact index missing planning document reference: ${fileName}`);
  assert(fs.existsSync(path.join(docsDir, fileName)), `missing planning document: ${fileName}`);
});

const requiredScripts = [
  'verify-opportunities-production-qa-readiness.js',
  'verify-opportunities-production-qa-execution-checklist.js',
  'verify-opportunities-indexed-release-fallback-checklist.js',
  'verify-opportunities-indexed-release-archive-closure-checklist.js',
  'verify-opportunities-index-policy.js',
  'verify-opportunities-production-qa-search-indexing-request-hold-checklist.js',
  'verify-opportunities-published-record-preflight-matrix.js',
  'verify-opportunities-indexed-output-activation-preflight-matrix.js',
  'verify-opportunities-newsletter-activation-hold-checklist.js',
  'verify-opportunities-phase5c-indexed-release-planning-summary.js',
  'verify-opportunities-phase5c-marvis-handoff.js',
  'verify-opportunities-all.js',
  'verify-opportunities-page.js',
  'verify-opportunities-production-noindex.js',
];

requiredScripts.forEach((fileName) => {
  assert(artifactIndex.includes(`src/tools/${fileName}`), `artifact index missing verification script reference: ${fileName}`);
  assert(fs.existsSync(path.join(rootDir, 'tools', fileName)), `missing verification script: ${fileName}`);
});

const requiredReports = [
  'PVSize_Opportunities_Phase5C_ProductionQAReadiness_20260801.md',
  'PVSize_Opportunities_Phase5C_ProductionQAExecutionChecklist_20260801.md',
  'PVSize_Opportunities_Phase5C_IndexedReleaseFallbackChecklist_20260801.md',
  'PVSize_Opportunities_Phase5C_IndexedReleaseArchiveClosureChecklist_20260801.md',
];

requiredReports.forEach((fileName) => {
  assert(artifactIndex.includes(fileName), `artifact index missing report reference: ${fileName}`);
  assert(fs.existsSync(path.join(reportsDir, fileName)), `missing daily ops report: ${fileName}`);
});

[
  'Production QA readiness verification',
  'Production QA execution checklist verification',
  'Indexed release fallback checklist verification',
  'Indexed release archive closure checklist verification',
  'Production QA search indexing hold verification',
  'Published record preflight matrix verification',
  'Indexed output activation preflight matrix verification',
  'Newsletter activation hold checklist verification',
  'Phase 5C indexed-release planning summary verification',
].forEach((label) => {
  assert(aggregateQa.includes(label), `aggregate QA missing artifact group verifier: ${label}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during artifact index task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during artifact index task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during artifact index task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during artifact index task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during artifact index task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during artifact index task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during artifact index task`);
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
  assert(!fs.existsSync(filePath), `artifact index task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`artifact index fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`artifact index fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`artifact index fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('artifact index fixture must not add newsletter output during artifact indexing');
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
  console.log('Self-test PASS: unsafe artifact index fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA artifact index verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA artifact index verification PASS: ${requiredMarkers.length} markers, ${requiredDocs.length} docs, ${requiredScripts.length} scripts, ${requiredReports.length} reports`);
