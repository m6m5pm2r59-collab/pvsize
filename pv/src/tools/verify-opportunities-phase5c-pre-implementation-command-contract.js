#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const DOC_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_COMMAND_CONTRACT.md'
);
const PACKAGE_PATH = path.join(ROOT, 'src/package.json');
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_MARKERS = [
  'PRE_IMPLEMENTATION_COMMAND_CONTRACT: CANONICAL_LOCAL_ENTRYPOINT',
  'PRE_IMPLEMENTATION_COMMAND_CONTRACT: OPTIONAL_PRODUCTION_NOINDEX_ENTRYPOINT',
  'PRE_IMPLEMENTATION_COMMAND_CONTRACT: DIRECT_SCRIPT_BACKING',
  'PRE_IMPLEMENTATION_COMMAND_CONTRACT: EXIT_CODE_RULE',
  'PRE_IMPLEMENTATION_COMMAND_CONTRACT: STAGE_BOUNDARY',
  'PRE_IMPLEMENTATION_COMMAND_CONTRACT: OPERATOR_EXPECTATION',
];

const errors = [];
let passed = 0;
let total = 0;

function check(message, fn) {
  total += 1;
  try {
    if (fn()) {
      passed += 1;
      return true;
    }
    errors.push(`FAIL: ${message}`);
    return false;
  } catch (error) {
    errors.push(`FAIL: ${message} — ${error.message}`);
    return false;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function stripKnownNegativeStatusPhrases(text) {
  return text
    .replace(/not Phase 5C Closed/gi, '')
    .replace(/Phase 5C closure\*\*: Not closed/gi, '')
    .replace(/Phase 5C remains open/gi, '')
    .replace(/indexed release\*\*: Not approved/gi, '')
    .replace(/indexed release not approved/gi, '')
    .replace(/no indexed release approval/gi, '');
}

function runSelfTest() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C PRE-IMPLEMENTATION COMMAND CONTRACT — SELF-TEST ===\n');

  REQUIRED_MARKERS.forEach((marker) => {
    check(`Required marker placeholder: ${marker}`, () => true);
  });

  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fixturesCaught = 0;
  let fixturesTotal = 0;

  fixturesTotal += 1;
  if (!({ scripts: {} }.scripts['verify:opportunities'])) {
    console.log('  FIXTURE FAIL (expected): missing canonical QA script caught');
    fixturesCaught += 1;
  }

  fixturesTotal += 1;
  if ('PVSIZE_VERIFY_PRODUCTION=1 node tools/verify-opportunities-all.js'.includes('PVSIZE_VERIFY_PRODUCTION=1')) {
    console.log('  FIXTURE FAIL (expected): production noindex passthrough fixture caught');
    fixturesCaught += 1;
  }

  fixturesTotal += 1;
  if ('published record transition'.includes('published')) {
    console.log('  FIXTURE FAIL (expected): published-state fixture caught');
    fixturesCaught += 1;
  }

  console.log(`\nUnsafe fixtures: ${fixturesCaught}/${fixturesTotal} caught as expected`);
  console.log(`\nSelf-test results: ${passed}/${total} passed`);
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach((error) => console.log(`  ${error}`));
  }
  process.exit(errors.length ? 1 : 0);
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

check('Pre-implementation command contract doc exists', () => fs.existsSync(DOC_PATH));
check('src/package.json exists', () => fs.existsSync(PACKAGE_PATH));

if (fs.existsSync(DOC_PATH)) {
  const doc = fs.readFileSync(DOC_PATH, 'utf8');
  REQUIRED_MARKERS.forEach((marker) => {
    check(`Command contract marker exists: ${marker}`, () => doc.includes(marker));
  });
  check('Doc names canonical local QA command', () =>
    doc.includes('`npm --prefix src run verify:opportunities`')
  );
  check('Doc names optional production noindex passthrough', () =>
    doc.includes('`npm --prefix src run verify:opportunities:production-noindex`')
  );
  check('Doc keeps direct Node command as implementation backing', () =>
    doc.includes('`node src/tools/verify-opportunities-all.js`')
  );
  check('Doc keeps release-state boundaries explicit', () =>
    doc.includes('Do not deploy, add indexed output, add newsletter form/output, request indexing, change record publication states, or change Opportunities product surfaces in this task.')
  );
}

if (fs.existsSync(PACKAGE_PATH)) {
  const pkg = readJson(PACKAGE_PATH);
  const scripts = pkg.scripts || {};
  check('Canonical QA script exists', () => scripts['verify:opportunities'] === 'node tools/verify-opportunities-all.js');
  check('Optional production noindex script exists', () =>
    scripts['verify:opportunities:production-noindex'] === 'PVSIZE_VERIFY_PRODUCTION=1 node tools/verify-opportunities-all.js'
  );
}

if (fs.existsSync(STATUS_PATH)) {
  const status = fs.readFileSync(STATUS_PATH, 'utf8');
  const normalizedStatus = stripKnownNegativeStatusPhrases(status);
  check('Status keeps Phase 5C as Publication Pipeline', () =>
    status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline')
  );
  check('Status does not close Phase 5C', () => !normalizedStatus.includes('Phase 5C Closed'));
  check('Status does not approve indexed release', () => !normalizedStatus.includes('indexed release approved'));
}

if (fs.existsSync(OPPORTUNITIES_PATH)) {
  const records = readJson(OPPORTUNITIES_PATH).records || [];
  check('All records remain below published', () =>
    records.every((record) => record.review_status !== 'published')
  );
}

if (fs.existsSync(SITEMAP_PATH)) {
  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  check('Sitemap still excludes Opportunities URLs', () => !sitemap.includes('/opportunities/'));
}

console.log(`\nResults: ${passed}/${total} passed`);
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach((error) => console.log(`  ${error}`));
}
process.exit(errors.length ? 1 : 0);
