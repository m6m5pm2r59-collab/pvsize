const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const rulesPath = path.join(rootDir, '..', 'docs', 'opportunities', 'PVSIZE_OPPORTUNITIES_NEWSLETTER_RULES.md');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const rules = fs.readFileSync(rulesPath, 'utf8');
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const requiredRuleMarkers = [
  'NEWSLETTER_RULE: AFTER_INDEXED_CONTENT_GATES',
  'NEWSLETTER_RULE: CONSENT_REQUIRED',
  'NEWSLETTER_RULE: ANALYTICS_REQUIRED',
  'NEWSLETTER_RULE: PUBLISHED_OR_NOINDEX_ONLY',
  'NEWSLETTER_RULE: BLOCKED_FEATURES',
  'NEWSLETTER_RULE: CURRENT_NO_OUTPUT',
];

requiredRuleMarkers.forEach((marker) => {
  assert(rules.includes(marker), `missing newsletter rule marker: ${marker}`);
});

[
  'Clear opt-in copy.',
  'Email field label.',
  'Privacy or consent note.',
  'Success state.',
  'Error state.',
  'No pre-checked consent.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing consent marker: ${marker}`);
});

[
  '`opportunities_newsletter_view`',
  '`opportunities_newsletter_submit`',
  '`opportunities_newsletter_success`',
  '`opportunities_newsletter_error`',
].forEach((marker) => {
  assert(rules.includes(marker), `missing analytics marker: ${marker}`);
});

[
  'Paid newsletter.',
  'Login requirement.',
  'Account system.',
  'Anonymous procurement posting.',
  'Real email submission during local QA.',
  'External marketing automation without explicit service selection.',
].forEach((marker) => {
  assert(rules.includes(marker), `missing blocked feature marker: ${marker}`);
});

records.forEach((record) => {
  assert(record.review_status !== 'published', `record must stay below published during newsletter rules task: ${record.id}`);
});

[
  path.join(rootDir, 'opportunities', 'index.html'),
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
].forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(!html.includes('<form'), `${relativePath} must not include newsletter form`);
  assert(!html.includes('type="email"'), `${relativePath} must not include email input`);
  assert(!html.includes('newsletter'), `${relativePath} must not include newsletter output before newsletter gate`);
  assert(!html.includes('/api/newsletter'), `${relativePath} must not include newsletter API endpoint`);
});

function runSelfTest() {
  const fixture = '<form action="/api/newsletter"><input type="email" name="email"></form>';
  const before = errors.length;

  if (fixture.includes('<form')) errors.push('newsletter fixture must not include form before newsletter gate');
  if (fixture.includes('type="email"')) errors.push('newsletter fixture must not include email input before newsletter gate');
  if (fixture.includes('/api/newsletter')) errors.push('newsletter fixture must not include API endpoint before newsletter gate');

  const selfTestErrors = errors.slice(before);
  [
    'newsletter fixture must not include form',
    'newsletter fixture must not include email input',
    'newsletter fixture must not include API endpoint',
  ].forEach((marker) => {
    if (!selfTestErrors.some((error) => error.includes(marker))) {
      console.error(`Self-test FAIL: missing ${marker}`);
      process.exit(1);
    }
  });

  errors.splice(before);
  console.log('Self-test PASS: newsletter form/API fixture');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities newsletter rules verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities newsletter rules verification PASS: ${requiredRuleMarkers.length} rule markers, ${records.length} non-published records`);
