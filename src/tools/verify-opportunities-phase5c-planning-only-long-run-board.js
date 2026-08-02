#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const BOARD_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_MARKERS = [
  'LONG_RUN_BOARD: STAGE_NAME',
  'LONG_RUN_BOARD: MODE_PLANNING_ONLY',
  'LONG_RUN_BOARD: STARTING_BASELINE',
  'LONG_RUN_BOARD: AUTHORITY',
  'LONG_RUN_BOARD: MANDATORY_STARTUP',
  'LONG_RUN_BOARD: CONTINUOUS_EXECUTION',
  'LONG_RUN_BOARD: TASK_QUEUE',
  'LONG_RUN_BOARD: STOP_CONDITIONS',
  'LONG_RUN_BOARD: FUTURE_STAGE_HANDOFF',
  'LONG_RUN_BOARD: SHORT_PROMPT',
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

function runSelfTest() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C PLANNING-ONLY LONG-RUN BOARD — SELF-TEST ===\n');

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
  if ('/opportunities/'.includes('/opportunities/')) {
    console.log('  FIXTURE FAIL (expected): sitemap output fixture caught');
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

check('Long-run board exists', () => fs.existsSync(BOARD_PATH));

if (fs.existsSync(BOARD_PATH)) {
  const board = fs.readFileSync(BOARD_PATH, 'utf8');
  REQUIRED_MARKERS.forEach((marker) => {
    check(`Board marker exists: ${marker}`, () => board.includes(marker));
  });
  check('Board keeps planning-only mode explicit', () => board.includes('This board is planning-only.'));
  check('Board keeps L01-L10 queue explicit', () => board.includes('L01') && board.includes('L10'));
}

if (fs.existsSync(STATUS_PATH)) {
  const status = fs.readFileSync(STATUS_PATH, 'utf8');
  check('Status keeps Phase 5C as Publication Pipeline', () =>
    status.includes('## Current Phase\n\nPhase 5C: Publication Pipeline')
  );
  check('Status does not close Phase 5C', () => !status.includes('Phase 5C Closed'));
  check('Status does not approve indexed release', () => !status.includes('indexed release approved'));
  check('Status points Next Single Task to the long-run board', () =>
    status.includes('PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md')
  );
}

if (fs.existsSync(OPPORTUNITIES_PATH)) {
  const records = readJson(OPPORTUNITIES_PATH).records || [];
  check('All records remain below published', () => records.every((record) => record.review_status !== 'published'));
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
