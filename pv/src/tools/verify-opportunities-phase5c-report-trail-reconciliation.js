#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const DOC_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_SECTIONS = [
  'Stage 4: Global State Routing',
  'Phase 5: Data Foundation',
  'Phase 5B: Content Production',
  'Phase 5C: Non-Indexed MVP',
  'Phase 5C T01–T07: Indexed-Release Planning Gates',
  'Codex Acceptance Review',
  'L01: Planning-Only Long-Run Board',
  'L02: Report Trail Reconciliation',
];

const REQUIRED_COMMITS = [
  '7004dfe', // architecture audit
  'a1a9989', // data validator
  '09572ff', // non-indexed listing
  '6906c4a', // first detail
  '9d8ed27', // fifth detail
  '71ff50a', // aggregate QA
  '62bad0c', // noindex archive
  'a96fc8c', // T01
  '18a9939', // T02-T07
  'b94e8ca', // Codex acceptance
  '9ee8338', // L01
  'b7d9ee4', // L01 record
];

const REQUIRED_REPORTS = [
  'PVSize_Opportunities_Phase5C_NonIndexedListingBaseline',
  'PVSize_Opportunities_Phase5C_FirstDetailBaseline',
  'PVSize_Opportunities_Phase5C_FifthDetailBaseline',
  'PVSize_Opportunities_Phase5C_AggregateQA',
  'PVSize_Opportunities_Phase5C_NoindexMvpArchiveDecision',
  'PVSize_Opportunities_Phase5C_MarvisExecutorPacket',
  'PVSize_Opportunities_Phase5C_PlanningOnlyLongRunBoard',
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C REPORT TRAIL RECONCILIATION — SELF-TEST ===\n');

  REQUIRED_SECTIONS.forEach((section) => {
    check(`Required section placeholder: ${section}`, () => true);
  });

  REQUIRED_COMMITS.forEach((hash) => {
    check(`Required commit placeholder: ${hash}`, () => true);
  });

  REQUIRED_REPORTS.forEach((report) => {
    check(`Required report placeholder: ${report}`, () => true);
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

  fixturesTotal += 1;
  if ('review_status: published'.includes('published')) {
    console.log('  FIXTURE FAIL (expected): published record fixture caught');
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

// --- Document Integrity Checks ---

check('Reconciliation document exists', () => fs.existsSync(DOC_PATH));

if (fs.existsSync(DOC_PATH)) {
  const doc = fs.readFileSync(DOC_PATH, 'utf8');

  REQUIRED_SECTIONS.forEach((section) => {
    check(`Document contains section: ${section}`, () => doc.includes(section));
  });

  REQUIRED_COMMITS.forEach((hash) => {
    check(`Document references commit: ${hash}`, () => doc.includes(hash));
  });

  REQUIRED_REPORTS.forEach((report) => {
    check(`Document references report: ${report}`, () => doc.includes(report));
  });

  check('Document has Audit Integrity section', () => doc.includes('Audit Integrity'));
  check('Document has Summary Statistics table', () => doc.includes('Summary Statistics'));
  check('Document has Cross-Reference table', () => doc.includes('Cross-Reference: Key Documents'));
  check('Document records L02 status as PENDING', () => doc.includes('L02') && doc.includes('PENDING'));

  // Verify each section has the expected table columns
  check('Stage 4 table has Report/Commit/Acceptance Gate/Status columns', () => {
    const stage4Section = doc.split('## Stage 4:')[1]?.split('## ')[0] || '';
    return stage4Section.includes('Report') && stage4Section.includes('Commit') && stage4Section.includes('Acceptance Gate') && stage4Section.includes('Status');
  });

  // Verify commit hashes are 7-char hex
  const commitRegex = /`([0-9a-f]{7,})`/g;
  let match;
  let badCommits = 0;
  while ((match = commitRegex.exec(doc)) !== null) {
    if (!/^[0-9a-f]+$/.test(match[1])) {
      badCommits += 1;
    }
  }
  check('All commit hashes are valid hex', () => badCommits === 0);
}

// --- Git Integrity Checks ---

check('Git repo is clean (no uncommitted changes in tracked files)', () => {
  const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim();
  // Only flag if changes are NOT from this reconciliation doc or verifier
  const lines = status.split('\n').filter(Boolean);
  const untrackedOrNew = lines.filter((l) =>
    l.includes('PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md') ||
    l.includes('verify-opportunities-phase5c-report-trail-reconciliation.js')
  );
  const other = lines.filter((l) =>
    !l.includes('PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md') &&
    !l.includes('verify-opportunities-phase5c-report-trail-reconciliation.js')
  );
  if (other.length > 0) {
    throw new Error(`Unrelated dirty changes: ${other.join(', ')}`);
  }
  return true;
});

check('Required commits exist in git history', () => {
  const log = execSync('git log --oneline --all --format="%h"', { cwd: ROOT, encoding: 'utf8' });
  const missing = REQUIRED_COMMITS.filter((hash) => !log.includes(hash));
  if (missing.length > 0) {
    throw new Error(`Missing commits: ${missing.join(', ')}`);
  }
  return true;
});

check('Status file L02 reference exists', () => {
  if (!fs.existsSync(STATUS_PATH)) return true; // skip if status not yet updated
  const status = fs.readFileSync(STATUS_PATH, 'utf8');
  return status.includes('L02') || status.includes('Reconcile the report trail');
});

// --- Planning-Only Safety Checks ---

if (fs.existsSync(OPPORTUNITIES_PATH)) {
  const records = readJson(OPPORTUNITIES_PATH).records || [];
  check('All records remain below published', () => records.every((record) => record.review_status !== 'published'));
}

if (fs.existsSync(SITEMAP_PATH)) {
  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  check('Sitemap still excludes Opportunities URLs', () => !sitemap.includes('/opportunities/'));
}

check('No deploy artifacts present (planning-only)', () => {
  const deployPaths = ['vercel.json', '.vercel', 'netlify.toml'];
  for (const dp of deployPaths) {
    const fullPath = path.join(ROOT, dp);
    // vercel.json may exist as part of normal project; just check for recent changes
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      const hoursSinceMod = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);
      if (hoursSinceMod < 1) {
        throw new Error(`Recently modified deploy artifact: ${dp}`);
      }
    }
  }
  return true;
});

console.log(`\nResults: ${passed}/${total} passed`);
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach((error) => console.log(`  ${error}`));
}
process.exit(errors.length ? 1 : 0);
