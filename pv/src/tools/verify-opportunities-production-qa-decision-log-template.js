const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const templatePath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_DECISION_LOG_TEMPLATE.md');
const statusPath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_STATUS.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const template = fs.readFileSync(templatePath, 'utf8');
const status = fs.readFileSync(statusPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredTemplateMarkers = [
  'DECISION_LOG: REQUIRED_FOR_SIGNOFF',
  'DECISION_LOG: REQUIRED_FIELDS',
  'DECISION_LOG: ALLOWED_DECISIONS',
  'DECISION_LOG: REQUIRED_EVIDENCE_LINKS',
  'DECISION_LOG: HOLD_ROLLBACK_TRIGGERS',
  'DECISION_LOG: CURRENT_NO_DECISION',
];

requiredTemplateMarkers.forEach((marker) => {
  assert(template.includes(marker), `missing decision log marker: ${marker}`);
});

[
  'Decision log id.',
  'Decision date.',
  'Operator.',
  'Current phase.',
  'Release candidate commit SHA.',
  'Production QA run id.',
  'Signoff id.',
  'Evidence bundle path.',
  'Production deployment target.',
  'Production URL set.',
  'Local QA result summary.',
  'Production QA result summary.',
  'Indexed output result summary.',
  'Newsletter output result summary.',
  'Fallback/noindex decision.',
  'Risk decision.',
  'Final decision.',
  'Decision rationale.',
  'Follow-up owner.',
  'Next single task.',
].forEach((marker) => {
  assert(template.includes(marker), `missing required decision field: ${marker}`);
});

[
  'HOLD_NO_INDEX.',
  'ROLLBACK_TO_NOINDEX.',
  'APPROVED_FOR_INDEXED_RELEASE.',
].forEach((marker) => {
  assert(template.includes(marker), `missing allowed decision: ${marker}`);
});

[
  'Production QA run manifest.',
  'Production QA evidence bundle.',
  'Production QA signoff checklist.',
  'Production QA artifact index.',
  'Daily ops report.',
  'Archive closure checklist.',
  'Fallback checklist when HOLD or rollback is chosen.',
].forEach((marker) => {
  assert(template.includes(marker), `missing evidence link marker: ${marker}`);
});

[
  'Any local QA command fails.',
  'Any production HTTP check fails.',
  'Any robots or canonical check fails.',
  'Any sitemap/RSS check contains a non-published Opportunity.',
  'Any JSON-LD check contains a non-published Opportunity.',
  'Any newsletter output contains a non-published Opportunity.',
  'Any indexing request is not separately approved.',
  'Evidence bundle is incomplete.',
  'Signoff checklist is incomplete.',
  'Phase 5C closure evidence is incomplete.',
].forEach((marker) => {
  assert(template.includes(marker), `missing hold or rollback trigger: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during decision log template task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during decision log template task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during decision log template task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during decision log template task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during decision log template task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during decision log template task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during decision log template task`);
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
  assert(!fs.existsSync(filePath), `decision log template task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`decision log fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`decision log fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`decision log fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('decision log fixture must not add newsletter output during decision log planning');
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
  console.log('Self-test PASS: unsafe decision log fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA decision log template verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA decision log template verification PASS: ${requiredTemplateMarkers.length} template markers, ${records.length} non-published records`);
