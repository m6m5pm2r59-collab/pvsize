const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const manifestPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_RUN_MANIFEST.md');
const statusPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_STATUS.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const manifest = fs.readFileSync(manifestPath, 'utf8');
const status = fs.readFileSync(statusPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredManifestMarkers = [
  'RUN_MANIFEST: DECLARE_BEFORE_QA',
  'RUN_MANIFEST: REQUIRED_FIELDS',
  'RUN_MANIFEST: VERIFICATION_PLAN',
  'RUN_MANIFEST: OUTPUT_ARTIFACTS',
  'RUN_MANIFEST: STOP_CONDITIONS',
  'RUN_MANIFEST: CURRENT_NO_EXECUTION',
];

requiredManifestMarkers.forEach((marker) => {
  assert(manifest.includes(marker), `missing run manifest marker: ${marker}`);
});

[
  'QA run id.',
  'QA run date.',
  'Operator.',
  'Current phase.',
  'Release candidate commit SHA.',
  'Last known good noindex commit SHA.',
  'Production deployment target.',
  'Expected Opportunities URL set.',
  'Expected indexed/noindex policy.',
  'Expected sitemap/RSS output.',
  'Expected JSON-LD output.',
  'Expected newsletter output.',
  'Verification command list.',
  'Artifact index path.',
  'Handoff checklist path.',
  'Report output path.',
  'Fallback/noindex target.',
  'Stop conditions.',
  'Next single task.',
].forEach((marker) => {
  assert(manifest.includes(marker), `missing required manifest field: ${marker}`);
});

[
  '`node src/tools/verify-opportunities-production-qa-artifact-index.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-handoff-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-readiness.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-indexed-release-fallback-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-all.js`',
  '`git diff --check`',
].forEach((marker) => {
  assert(manifest.includes(marker), `missing verification plan command: ${marker}`);
});

[
  'Daily ops report.',
  'Production URL check results.',
  'Indexed output check results.',
  'Fallback/noindex decision.',
  'Archive closure decision.',
  'Known risks.',
  'Next single task.',
].forEach((marker) => {
  assert(manifest.includes(marker), `missing output artifact marker: ${marker}`);
});

[
  'Run id is missing.',
  'Release candidate commit SHA is missing.',
  'Last known good noindex commit SHA is missing.',
  'Expected URL set is missing.',
  'Local aggregate QA fails.',
  'Production HTTP QA fails.',
  'Indexed output QA fails.',
  'Any non-published Opportunity appears in an indexable surface.',
  'Fallback/noindex target is missing.',
].forEach((marker) => {
  assert(manifest.includes(marker), `missing stop condition marker: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during run manifest task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during run manifest task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during run manifest task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during run manifest task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during run manifest task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during run manifest task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during run manifest task`);
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
  assert(!fs.existsSync(filePath), `run manifest task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`run manifest fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`run manifest fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`run manifest fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('run manifest fixture must not add newsletter output during run manifest planning');
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
  console.log('Self-test PASS: unsafe run manifest fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA run manifest verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA run manifest verification PASS: ${requiredManifestMarkers.length} manifest markers, ${records.length} non-published records`);
