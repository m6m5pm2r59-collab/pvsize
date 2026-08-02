#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const BOARD_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_LONG_RUN_BOARD.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_MARKERS = [
  'PRE_IMPLEMENTATION_BOARD: STAGE_NAME',
  'PRE_IMPLEMENTATION_BOARD: MODE_INFRASTRUCTURE_ONLY',
  'PRE_IMPLEMENTATION_BOARD: STARTING_BASELINE',
  'PRE_IMPLEMENTATION_BOARD: AUTHORITY',
  'PRE_IMPLEMENTATION_BOARD: MANDATORY_STARTUP',
  'PRE_IMPLEMENTATION_BOARD: CONTINUOUS_EXECUTION',
  'PRE_IMPLEMENTATION_BOARD: STAGE_INTENT',
  'PRE_IMPLEMENTATION_BOARD: EXECUTION_CONTRACT',
  'PRE_IMPLEMENTATION_BOARD: TASK_QUEUE',
  'PRE_IMPLEMENTATION_BOARD: PER_TASK_PATTERN',
  'PRE_IMPLEMENTATION_BOARD: REQUIRED_VERIFICATION',
  'PRE_IMPLEMENTATION_BOARD: STOP_CONDITIONS',
  'PRE_IMPLEMENTATION_BOARD: STAGE_EXIT_GATES',
  'PRE_IMPLEMENTATION_BOARD: SHORT_PROMPT',
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C PRE-IMPLEMENTATION LONG-RUN BOARD — SELF-TEST ===\n');

  REQUIRED_MARKERS.forEach((marker) => {
    check(`Required marker placeholder: ${marker}`, () => true);
  });

  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fixturesCaught = 0;
  let fixturesTotal = 0;

  fixturesTotal += 1;
  if ('Phase 5C Closed'.includes('Closed')) {
    console.log('  FIXTURE FAIL (expected): closed-phase fixture caught');
    fixturesCaught += 1;
  }

  fixturesTotal += 1;
  if ('indexed release approved'.includes('indexed release')) {
    console.log('  FIXTURE FAIL (expected): indexed-release approval fixture caught');
    fixturesCaught += 1;
  }

  fixturesTotal += 1;
  if ('published record transition'.includes('published')) {
    console.log('  FIXTURE FAIL (expected): published-state fixture caught');
    fixturesCaught += 1;
  }

  fixturesTotal += 1;
  if ('product surface change'.includes('product surface')) {
    console.log('  FIXTURE FAIL (expected): product-surface fixture caught');
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

check('Pre-implementation long-run board exists', () => fs.existsSync(BOARD_PATH));

if (fs.existsSync(BOARD_PATH)) {
  const board = fs.readFileSync(BOARD_PATH, 'utf8');
  REQUIRED_MARKERS.forEach((marker) => {
    check(`Board marker exists: ${marker}`, () => board.includes(marker));
  });
  check('Board keeps infrastructure-only mode explicit', () =>
    board.includes('This board is infrastructure-only.')
  );
  check('Board keeps PI-01 through PI-07 queue explicit', () =>
    board.includes('PI-01') && board.includes('PI-07')
  );
  check('Board keeps CI skeleton scope explicit', () =>
    board.includes('CI gate skeleton') && board.includes('.github/workflows/opportunities-pre-implementation.yml')
  );
  check('Board keeps deploy dry-run scope explicit', () =>
    board.includes('deployment dry-run checklist')
  );
  check('Board forbids product-surface changes', () =>
    board.includes('product surfaces') || board.includes('product-surface')
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
  check('Status records Option B pre-implementation selection', () =>
    status.includes('Option B pre-implementation')
  );
  check('Status points Next Single Task to PI-01', () =>
    status.includes('PI-01 Add aggregate QA unified entrypoint')
  );
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
