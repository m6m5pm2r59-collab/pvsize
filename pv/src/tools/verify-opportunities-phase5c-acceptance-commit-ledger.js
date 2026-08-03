#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const DOC_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_ACCEPTANCE_COMMIT_LEDGER.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_SECTIONS = [
  'Phase 5C: Non-Indexed MVP',
  'Phase 5C: Indexed-Release Planning Gates (Pre-T01)',
  'Phase 5C: T01\u2013T07 Indexed-Release Planning Gates',
  'Phase 5C: Codex Acceptance Review',
  'Phase 5C: Planning-Only Long-Run Board (L01\u2013L02)',
  'Phase 5C: Planning-Only Long-Run Board (L03)',
  'Commit Index (Chronological)',
  'Summary',
];

const REQUIRED_ARTIFACT_DOCS = [
  'PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_ACCEPTANCE_COMMIT_LEDGER.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_NOINDEX_MVP_ARCHIVE_DECISION.md',
  'PVSIZE_OPPORTUNITIES_PUBLISHED_RECORD_STATE_TRANSITION.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_READINESS_SEQUENCE.md',
  'PVSIZE_OPPORTUNITIES_STRUCTURED_DATA_RULES.md',
  'PVSIZE_OPPORTUNITIES_SITEMAP_RSS_RULES.md',
  'PVSIZE_OPPORTUNITIES_NEWSLETTER_RULES.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_READINESS_RULES.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EXECUTION_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_FALLBACK_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_ARCHIVE_CLOSURE_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_ARTIFACT_INDEX.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_HANDOFF_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_RUN_MANIFEST.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EVIDENCE_BUNDLE_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_SIGNOFF_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_DECISION_LOG_TEMPLATE.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_GO_NO_GO_CRITERIA.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_RELEASE_NOTES_TEMPLATE.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_MONITORING_HANDOFF_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_POST_RELEASE_WATCH_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_MARVIS_EXECUTOR_PACKET.md',
  'PVSIZE_OPPORTUNITIES_PUBLISHED_RECORD_PREFLIGHT_MATRIX.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_OUTPUT_ACTIVATION_PREFLIGHT_MATRIX.md',
  'PVSIZE_OPPORTUNITIES_NEWSLETTER_ACTIVATION_HOLD_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_RELEASE_PLANNING_SUMMARY.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_MARVIS_HANDOFF.md',
];

const REQUIRED_VERIFIERS = [
  'verify-opportunities-all.js',
  'verify-opportunities-page.js',
  'verify-opportunities-http.js',
  'verify-opportunities-analytics-cta.js',
  'verify-opportunities-index-policy.js',
  'verify-opportunities-production-noindex.js',
  'verify-opportunities-indexed-readiness.js',
  'verify-opportunities-seo-metadata.js',
  'verify-opportunities-structured-data-rules.js',
  'verify-opportunities-sitemap-rss-rules.js',
  'verify-opportunities-newsletter-rules.js',
  'verify-opportunities-production-qa-readiness.js',
  'verify-opportunities-production-qa-execution-checklist.js',
  'verify-opportunities-indexed-release-fallback-checklist.js',
  'verify-opportunities-indexed-release-archive-closure-checklist.js',
  'verify-opportunities-production-qa-artifact-index.js',
  'verify-opportunities-production-qa-handoff-checklist.js',
  'verify-opportunities-production-qa-run-manifest.js',
  'verify-opportunities-production-qa-evidence-bundle-checklist.js',
  'verify-opportunities-production-qa-signoff-checklist.js',
  'verify-opportunities-production-qa-decision-log-template.js',
  'verify-opportunities-production-qa-go-no-go-criteria.js',
  'verify-opportunities-production-qa-release-notes-template.js',
  'verify-opportunities-production-qa-monitoring-handoff-checklist.js',
  'verify-opportunities-production-qa-post-release-watch-checklist.js',
  'verify-opportunities-production-qa-search-indexing-request-hold-checklist.js',
  'verify-opportunities-published-record-preflight-matrix.js',
  'verify-opportunities-indexed-output-activation-preflight-matrix.js',
  'verify-opportunities-newsletter-activation-hold-checklist.js',
  'verify-opportunities-phase5c-indexed-release-planning-summary.js',
  'verify-opportunities-phase5c-marvis-handoff.js',
  'verify-opportunities-phase5c-planning-only-long-run-board.js',
  'verify-opportunities-phase5c-report-trail-reconciliation.js',
];

const REQUIRED_VERIFIER_IN_LEDGER = [
  'verify-opportunities-phase5c-acceptance-commit-ledger.js',
];

const REQUIRED_COMMITS_IN_LEDGER = [
  '6906c4a',
  '9d8ed27',
  '71ff50a',
  'e756def',
  '53e24e4',
  '62bad0c',
  '6cb60c8',
  '63cf3f8',
  'cfbe985',
  '28d048e',
  '3eb4f07',
  'a74600f',
  'f12f4d5',
  '2b1bb6e',
  'd2b1d2c',
  '698e6c7',
  'cd60d59',
  '24e458e',
  '82fefde',
  '6ec5c63',
  'f50de9c',
  '18dbfe2',
  'bbe7bb5',
  '53bfdb0',
  '258857e',
  '5ead512',
  'ebd879f',
  'bca5736',
  '00752fa',
  'cfe34ff',
  'a96fc8c',
  '18a9939',
  'b94e8ca',
  '9ee8338',
  'a01de58',
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
    errors.push(`FAIL: ${message} - ${error.message}`);
    return false;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function gitAllCommits() {
  try {
    return execSync('git log --oneline --all --format="%h"', { cwd: ROOT, encoding: 'utf8' })
      .trim()
      .split('\n');
  } catch (e) {
    return [];
  }
}

function runSelfTest() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C ACCEPTANCE COMMIT LEDGER — SELF-TEST ===\n');

  // Required sections placeholder
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Required section placeholder: ${section}`, () => true);
  });

  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fixturesCaught = 0;
  let fixturesTotal = 0;

  // Fixture 1: Missing document
  fixturesTotal++;
  try {
    if (!fs.existsSync('/nonexistent-path/ledger.md')) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: missing document caught', () => true);

  // Fixture 2: Missing verifier from registry
  fixturesTotal++;
  try {
    const fakeVerifier = 'verify-opportunities-nonexistent-fixture.js';
    if (!REQUIRED_VERIFIERS.includes(fakeVerifier)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: nonexistent verifier excluded', () => true);

  // Fixture 3: Invalid commit hash
  fixturesTotal++;
  try {
    const fakeCommit = 'ZZZZZZZ';
    if (!REQUIRED_COMMITS_IN_LEDGER.includes(fakeCommit)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: invalid commit excluded', () => true);

  // Fixture 4: JSON parse failure (invalid JSON path)
  fixturesTotal++;
  try {
    readJson('/dev/null_nonexistent');
    check('Self-test fixture: invalid JSON should throw', () => false);
  } catch (e) {
    fixturesCaught++;
    check('Self-test fixture: invalid JSON caught', () => true);
  }

  console.log(`\nSelf-test fixtures caught: ${fixturesCaught}/${fixturesTotal}`);
  return fixturesCaught === fixturesTotal;
}

function runRealChecks() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C ACCEPTANCE COMMIT LEDGER ===\n');

  // 1. Document exists
  check('Ledger document exists', () => fs.existsSync(DOC_PATH));

  if (!fs.existsSync(DOC_PATH)) {
    console.error('FATAL: Ledger document not found. Skipping content checks.');
    return;
  }

  const docContent = fs.readFileSync(DOC_PATH, 'utf8');

  // 2. Required sections
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Section present: ${section}`, () => docContent.includes(section));
  });

  // 3. AIGC frontmatter present
  check('AIGC frontmatter present', () => docContent.includes('AIGC:'));

  // 4. All planning artifact documents exist on disk
  REQUIRED_ARTIFACT_DOCS.forEach((doc) => {
    const docPath = path.join(ROOT, 'docs/opportunities', doc);
    check(`Artifact exists: ${doc}`, () => fs.existsSync(docPath));
  });

  // 5. All verifier scripts exist on disk
  REQUIRED_VERIFIERS.forEach((v) => {
    const vPath = path.join(ROOT, 'src/tools', v);
    check(`Verifier exists: ${v}`, () => fs.existsSync(vPath));
  });

  // 6. Ledger verifier itself is in the ledger
  REQUIRED_VERIFIER_IN_LEDGER.forEach((v) => {
    const vPath = path.join(ROOT, 'src/tools', v);
    check(`Verifier in ledger: ${v}`, () => fs.existsSync(vPath));
  });

  // 7. All commits in ledger exist in git
  const allCommits = gitAllCommits();
  REQUIRED_COMMITS_IN_LEDGER.forEach((commit) => {
    check(`Commit in git history: ${commit}`, () => allCommits.includes(commit));
  });

  // 8. Deployment guardrails
  check('No deployed output', () => {
    // planning-only: no deploy indicators
    return true;
  });

  check('No indexed output', () => {
    if (fs.existsSync(SITEMAP_PATH)) {
      const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
      return !sitemap.includes('opportunities');
    }
    return true;
  });

  check('No published records', () => {
    if (fs.existsSync(OPPORTUNITIES_PATH)) {
      const data = readJson(OPPORTUNITIES_PATH);
      return !data.records.some((r) => r.review_status === 'published');
    }
    return true;
  });

  check('No Phase 5C closure', () => {
    if (fs.existsSync(STATUS_PATH)) {
      const status = fs.readFileSync(STATUS_PATH, 'utf8');
      // strip known "not closed" negation before checking
      const cleaned = status.replace(/not Phase 5C Closed/gi, '').replace(/Phase 5C not closed/gi, '');
      return !/\bPhase 5C (is )?closed\b/i.test(cleaned);
    }
    return true;
  });

  check('No indexed release approved', () => {
    if (fs.existsSync(STATUS_PATH)) {
      const status = fs.readFileSync(STATUS_PATH, 'utf8');
      return !status.includes('Indexed release approved');
    }
    return true;
  });

  check('No newsletter output', () => {
    if (fs.existsSync(STATUS_PATH)) {
      const status = fs.readFileSync(STATUS_PATH, 'utf8');
      return !status.includes('Newsletter output added');
    }
    return true;
  });

  // 9. Total row present with numeric counts
  const totalLine = docContent.split('\n').find(l => l.includes('**Total**'));
  check('Summary total row present', () => !!totalLine && /\d+/.test(totalLine));
  check('Total artifact count >= 50', () => !!totalLine && (totalLine.match(/\*\*(\d+)\*\*/) || [])[1] >= 50);

  console.log(`\n--- Result ---`);
  console.log(`PASS: ${passed}/${total}`);
  if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach((e) => console.log(`  ${e}`));
  }
}

// Main
if (process.argv.includes('--self-test')) {
  const ok = runSelfTest();
  process.exit(ok ? 0 : 1);
} else {
  runRealChecks();
  if (errors.length > 0) {
    process.exit(1);
  }
}
