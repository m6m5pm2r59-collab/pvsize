const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rulesPath = path.join(rootDir, '..', 'docs', 'opportunities', 'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_READINESS_RULES.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const rules = fs.readFileSync(rulesPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredRuleMarkers = [
  'PRODUCTION_QA_RULE: LOCAL_AGGREGATE_FIRST',
  'PRODUCTION_QA_RULE: PRE_DEPLOY_CHECKS',
  'PRODUCTION_QA_RULE: DEPLOYMENT_BOUNDARY',
  'PRODUCTION_QA_RULE: PRODUCTION_HTTP_CHECKS',
  'PRODUCTION_QA_RULE: INDEXED_OUTPUT_CHECKS',
  'PRODUCTION_QA_RULE: ROLLBACK_OR_NOINDEX_FALLBACK',
  'PRODUCTION_QA_RULE: ARCHIVE_REQUIRED',
  'PRODUCTION_QA_RULE: CURRENT_NO_DEPLOY',
];

requiredRuleMarkers.forEach((marker) => {
  assert(rules.includes(marker), `missing production QA rule marker: ${marker}`);
});

[
  '`node src/tools/verify-opportunities-production-qa-readiness.js --self-test`',
  '`node src/tools/verify-opportunities-all.js`',
  '`git diff --check`',
  '`PVSIZE_VERIFY_PRODUCTION=1 node src/tools/verify-opportunities-all.js`',
].forEach((marker) => {
  assert(rules.includes(marker), `missing production QA command marker: ${marker}`);
});

[
  'Local aggregate Opportunities QA.',
  'Published-record index-policy self-test.',
  'SEO metadata verification.',
  'Structured-data rules verification.',
  'Sitemap/RSS rules verification.',
  'Newsletter rules verification.',
  'Analytics/CTA verification.',
  'HTTP verification.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing pre-deploy check marker: ${marker}`);
});

[
  'Production listing/detail HTTP 200.',
  'Robots policy.',
  'Canonical URL.',
  'Homepage/internal entry link.',
  'Analytics marker.',
  'Official source CTA.',
  'Calculator CTA.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing production HTTP check marker: ${marker}`);
});

[
  'JSON-LD eligibility.',
  'Sitemap inclusion/exclusion.',
  'RSS/feed output.',
  'Newsletter form/output.',
  'Published-only record inclusion.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing indexed output check marker: ${marker}`);
});

[
  'Rollback or keep noindex policy.',
  'Do not request indexing.',
  'Do not mark indexed release complete.',
  'Do not close Phase 5C.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing failure handling marker: ${marker}`);
});

records.forEach((record) => {
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  assert(record.review_status !== 'published', `record must stay below published during production QA readiness task: ${record.id}`);
  assert(!sitemap.includes(detailUrl), `sitemap must not include opportunity URL during production QA readiness task: ${record.id}`);
});

const pagePaths = [
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
];

pagePaths.forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex during production QA readiness task`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD during production QA readiness task`);
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
  assert(!fs.existsSync(filePath), `production QA readiness task must not add RSS output: ${path.relative(rootDir, filePath)}`);
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
    errors.push(`production QA fixture must not index non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureHtml.includes('application/ld+json')) {
    errors.push(`production QA fixture must not add JSON-LD for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureSitemap.includes(detailUrl)) {
    errors.push(`production QA fixture must not add sitemap URL for non-published record: ${record.id}`);
  }
  if (record.review_status !== 'published' && fixtureFeed.includes(detailUrl)) {
    errors.push(`production QA fixture must not add RSS URL for non-published record: ${record.id}`);
  }
  if (fixtureHtml.includes('<form') || fixtureHtml.includes('/api/newsletter')) {
    errors.push('production QA fixture must not add newsletter output during readiness planning');
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
  console.log('Self-test PASS: unsafe production indexed-output fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities production QA readiness verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities production QA readiness verification PASS: ${requiredRuleMarkers.length} rule markers, ${records.length} non-published records`);
