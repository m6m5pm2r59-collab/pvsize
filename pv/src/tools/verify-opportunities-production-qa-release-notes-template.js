const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const docsDir = path.join(rootDir, '..', 'docs', 'opportunities');
const templatePath = path.join(docsDir, 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_RELEASE_NOTES_TEMPLATE.md');
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

const requiredMarkers = [
  'RELEASE_NOTES: REQUIRED_BEFORE_ARCHIVE',
  'RELEASE_NOTES: REQUIRED_FIELDS',
  'RELEASE_NOTES: USER_FACING_SUMMARY',
  'RELEASE_NOTES: QA_SUMMARY',
  'RELEASE_NOTES: RISK_SUMMARY',
  'RELEASE_NOTES: CURRENT_NO_RELEASE',
];

requiredMarkers.forEach((marker) => {
  assert(template.includes(marker), `missing release notes marker: ${marker}`);
});

[
  'Release notes id.',
  'Release date.',
  'Current phase.',
  'Release candidate commit SHA.',
  'Production deployment target.',
  'Production URL set.',
  'Published-record list.',
  'Indexed output summary.',
  'Newsletter output summary.',
  'Local QA summary.',
  'Production QA summary.',
  'Evidence bundle path.',
  'Signoff checklist path.',
  'Decision log path.',
  'Go/no-go criteria path.',
  'Fallback/noindex decision.',
  'Known risks.',
  'Final release note status.',
  'Next single task.',
].forEach((marker) => {
  assert(template.includes(marker), `missing required release note field: ${marker}`);
});

[
  'What changed.',
  'Which Opportunities URLs are included.',
  'Which records are published.',
  'Which indexed surfaces are enabled.',
  'Which newsletter output is enabled.',
  'Which fallback or hold state applies.',
  'What remains intentionally unavailable.',
].forEach((marker) => {
  assert(template.includes(marker), `missing user-facing summary marker: ${marker}`);
});

[
  'Local aggregate QA.',
  'Production HTTP QA.',
  'Robots/canonical QA.',
  'Sitemap/RSS QA.',
  'JSON-LD QA.',
  'Newsletter output QA.',
  'Evidence bundle QA.',
  'Signoff QA.',
  'Decision log QA.',
  'Go/no-go QA.',
].forEach((marker) => {
  assert(template.includes(marker), `missing QA summary marker: ${marker}`);
});

[
  'Accepted risks.',
  'Open risks.',
  'Fallback triggers.',
  'Rollback target.',
  'Known monitoring gaps.',
  'Browser console verification status.',
  'Next owner or next task.',
].forEach((marker) => {
  assert(template.includes(marker), `missing risk summary marker: ${marker}`);
});

assert(status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline'), 'status must keep Current Phase as Phase 5C during release notes template task');
assert(!status.includes('## Current Phase\n\nPhase 5C Closed'), 'status must not mark Current Phase as Phase 5C Closed during release notes template task');
assert(!status.includes('Status: indexed release complete'), 'status must not mark indexed release complete during release notes template task');

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during release notes template task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during release notes template task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during release notes template task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during release notes template task`);
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
  assert(!fs.existsSync(filePath), `release notes template task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`release notes fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`release notes fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`release notes fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('release notes fixture must not add newsletter output during release notes planning');
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
  console.log('Self-test PASS: unsafe release notes fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA release notes template verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA release notes template verification PASS: ${requiredMarkers.length} template markers, ${records.length} non-published records`);
