const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const repoDir = path.join(rootDir, '..');
const docsDir = path.join(repoDir, 'docs', 'opportunities');
const checklistPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_HANDOFF_CHECKLIST.md');
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
  'HANDOFF_CHECKLIST: OPERATOR_READY',
  'HANDOFF_CHECKLIST: REQUIRED_FIELDS',
  'HANDOFF_CHECKLIST: ARTIFACT_REFERENCES',
  'HANDOFF_CHECKLIST: VERIFICATION_COMMANDS',
  'HANDOFF_CHECKLIST: STOP_CONDITIONS',
  'HANDOFF_CHECKLIST: CURRENT_NO_EXECUTION',
];

requiredChecklistMarkers.forEach((marker) => {
  assert(checklist.includes(marker), `missing handoff checklist marker: ${marker}`);
});

[
  'Current phase.',
  'Release candidate commit SHA.',
  'Last known good noindex commit SHA.',
  'Production deployment target.',
  'Expected Opportunities URL set.',
  'Expected indexed/noindex policy.',
  'Expected sitemap/RSS output.',
  'Expected JSON-LD output.',
  'Expected newsletter output.',
  'Artifact index path.',
  'Verification command list.',
  'Daily ops report path.',
  'Known risks.',
  'Stop conditions.',
  'Next single task.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing required handoff field marker: ${marker}`);
});

[
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_ARTIFACT_INDEX.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_READINESS_RULES.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EXECUTION_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_FALLBACK_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_ARCHIVE_CLOSURE_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_STATUS.md',
].forEach((fileName) => {
  assert(checklist.includes(fileName), `missing handoff artifact reference: ${fileName}`);
  assert(fs.existsSync(path.join(docsDir, fileName)), `missing handoff artifact file: ${fileName}`);
});

[
  '`node src/tools/verify-opportunities-production-qa-artifact-index.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-readiness.js --self-test`',
  '`node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-indexed-release-fallback-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js --self-test`',
  '`node src/tools/verify-opportunities-all.js`',
  '`git diff --check`',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing handoff verification command marker: ${marker}`);
});

[
  'Release candidate commit SHA is missing.',
  'Rollback/noindex fallback target is missing.',
  'Local aggregate QA fails.',
  'Production HTTP QA fails.',
  'Indexed output QA fails.',
  'Non-published Opportunity appears in any indexable surface.',
  'Newsletter output links to unverifiable or non-published indexed URL.',
  'Production behavior differs from the approved release scope.',
].forEach((marker) => {
  assert(checklist.includes(marker), `missing handoff stop condition marker: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during handoff checklist task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during handoff checklist task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during handoff checklist task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during handoff checklist task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during handoff checklist task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during handoff checklist task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during handoff checklist task`);
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
  assert(!fs.existsSync(filePath), `handoff checklist task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`handoff fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`handoff fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`handoff fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('handoff fixture must not add newsletter output during handoff planning');
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
  console.log('Self-test PASS: unsafe handoff fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA handoff checklist verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA handoff checklist verification PASS: ${requiredChecklistMarkers.length} checklist markers, ${records.length} non-published records`);
