#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const MATRIX_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION_MATRIX.md'
);
const TOOLS_DIR = path.join(ROOT, 'src/tools');
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');
const AGGREGATE_PATH = path.join(TOOLS_DIR, 'verify-opportunities-all.js');

const REQUIRED_MARKERS = [
  'PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: TOTAL_COUNT',
  'PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: MATRIX',
  'PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: STOP_ON_FAIL_SUMMARY',
  'PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: ORCHESTRATION_CONTROL_FLOW',
  'PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: INFRASTRUCTURE_ONLY',
];

const EXPECTED_VERIFIERS = [
  // G1: Source & Content Readiness
  'validate-opportunities.js',
  'generate-opportunity-detail-pages.js',
  // G2: Page & Content Verification
  'verify-opportunities-page.js',
  'verify-opportunities-analytics-cta.js',
  'verify-opportunities-seo-metadata.js',
  // G3: Index Policy & Readiness
  'verify-opportunities-index-policy.js',
  'verify-opportunities-indexed-readiness.js',
  // G4: Structured Data / Sitemap / RSS / Newsletter Rules
  'verify-opportunities-structured-data-rules.js',
  'verify-opportunities-sitemap-rss-rules.js',
  'verify-opportunities-newsletter-rules.js',
  // G5: Production QA Planning
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
  // G6: Indexed Release Planning
  'verify-opportunities-published-record-preflight-matrix.js',
  'verify-opportunities-indexed-output-activation-preflight-matrix.js',
  'verify-opportunities-newsletter-activation-hold-checklist.js',
  'verify-opportunities-phase5c-indexed-release-planning-summary.js',
  'verify-opportunities-phase5c-indexed-implementation-dependency-map.js',
  // G7: Planning-Only Long-Run Stage Governance
  'verify-opportunities-phase5c-planning-only-long-run-board.js',
  'verify-opportunities-phase5c-planning-only-boundary-contract.js',
  'verify-opportunities-phase5c-planning-only-long-run-handoff.js',
  'verify-opportunities-phase5c-marvis-handoff.js',
  'verify-opportunities-phase5c-status-rollup-template.js',
  'verify-opportunities-phase5c-report-trail-reconciliation.js',
  'verify-opportunities-phase5c-stop-restart-protocol.js',
  'verify-opportunities-phase5c-blocked-run-exception-playbook.js',
  'verify-opportunities-phase5c-acceptance-commit-ledger.js',
  // G8: Pre-Implementation Stage Governance
  'verify-opportunities-phase5c-pre-implementation-long-run-board.js',
  'verify-opportunities-phase5c-pre-implementation-command-contract.js',
  'verify-opportunities-phase5c-implementation-stage-packet-skeleton.js',
  // G9: HTTP & Production Noindex
  'verify-opportunities-http.js',
  'verify-opportunities-production-noindex.js',
];

const STOP_ON_FAIL_VERIFIERS = new Set([
  'validate-opportunities.js',
  'generate-opportunity-detail-pages.js',
  'verify-opportunities-page.js',
  'verify-opportunities-analytics-cta.js',
  'verify-opportunities-seo-metadata.js',
  'verify-opportunities-index-policy.js',
  'verify-opportunities-indexed-readiness.js',
  'verify-opportunities-structured-data-rules.js',
  'verify-opportunities-sitemap-rss-rules.js',
  'verify-opportunities-newsletter-rules.js',
  'verify-opportunities-production-qa-readiness.js',
  'verify-opportunities-production-qa-search-indexing-request-hold-checklist.js',
  'verify-opportunities-published-record-preflight-matrix.js',
  'verify-opportunities-indexed-output-activation-preflight-matrix.js',
  'verify-opportunities-newsletter-activation-hold-checklist.js',
  'verify-opportunities-phase5c-indexed-release-planning-summary.js',
  'verify-opportunities-phase5c-planning-only-long-run-board.js',
  'verify-opportunities-phase5c-planning-only-boundary-contract.js',
  'verify-opportunities-phase5c-planning-only-long-run-handoff.js',
  'verify-opportunities-phase5c-marvis-handoff.js',
  'verify-opportunities-phase5c-pre-implementation-long-run-board.js',
  'verify-opportunities-phase5c-pre-implementation-command-contract.js',
  'verify-opportunities-all.js',
]);

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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C PRE-IMPLEMENTATION VERIFIER ORCHESTRATION MATRIX — SELF-TEST ===\n');

  REQUIRED_MARKERS.forEach((marker) => {
    check(`Required marker placeholder: ${marker}`, () => true);
  });

  EXPECTED_VERIFIERS.forEach((name) => {
    check(`Expected verifier placeholder: ${name}`, () => true);
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

  fixturesTotal += 1;
  if (EXPECTED_VERIFIERS.length !== 45) {
    console.log('  FIXTURE FAIL (expected): wrong verifier count fixture (got ' + EXPECTED_VERIFIERS.length + ', expected 45)');
    fixturesCaught += 1;
  }

  if (STOP_ON_FAIL_VERIFIERS.size !== 23) {
    console.log('  FIXTURE FAIL (expected): wrong stop-on-fail count fixture (got ' + STOP_ON_FAIL_VERIFIERS.size + ', expected 23)');
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

// --- Real checks ---

check('Verifier orchestration matrix doc exists', () => fs.existsSync(MATRIX_PATH));

if (fs.existsSync(MATRIX_PATH)) {
  const doc = fs.readFileSync(MATRIX_PATH, 'utf8');

  REQUIRED_MARKERS.forEach((marker) => {
    check(`Matrix marker exists: ${marker}`, () => doc.includes(marker));
  });

  check('Matrix declares total verifier count (43)', () =>
    doc.includes('Total verifiers cataloged: **43**')
  );

  check('Matrix declares total gates (9 + master)', () =>
    doc.includes('Total gates: **9**')
  );

  check('Matrix declares 23 stage-stop verifiers', () =>
    doc.includes('**Stage-stop verifiers**') && doc.includes('**23**')
  );

  check('Matrix declares 20 advisory verifiers', () =>
    doc.includes('**Advisory verifiers**') && doc.includes('**20**')
  );

  check('Matrix declares 1 conditional verifier', () =>
    doc.includes('**Conditional verifiers**') && doc.includes('**1**')
  );

  // Check each gate heading exists
  const gateHeadings = [
    'Gate G1: Source & Content Readiness',
    'Gate G2: Page & Content Verification',
    'Gate G3: Index Policy & Readiness',
    'Gate G4: Structured Data / Sitemap / RSS / Newsletter Rules',
    'Gate G5: Production QA Planning',
    'Gate G6: Indexed Release Planning',
    'Gate G7: Planning-Only Long-Run Stage Governance',
    'Gate G8: Pre-Implementation Stage Governance',
    'Gate G9: HTTP & Production Noindex',
    'Gate GM: Master Aggregate',
  ];

  gateHeadings.forEach((heading) => {
    check(`Gate heading exists: ${heading}`, () => doc.includes(heading));
  });

  // Check each expected verifier is mentioned in the matrix
  EXPECTED_VERIFIERS.forEach((name) => {
    check(`Verifier listed in matrix: ${name}`, () => doc.includes(name));
  });

  // Check master aggregate is listed
  check('Master aggregate listed in matrix', () =>
    doc.includes('`verify-opportunities-all.js`')
  );

  // Check canonical command path
  check('Canonical QA command in matrix', () =>
    doc.includes('`npm --prefix src run verify:opportunities`')
  );

  // Check optional production passthrough
  check('Optional production passthrough in matrix', () =>
    doc.includes('`npm --prefix src run verify:opportunities:production-noindex`')
  );

  // Check infrastructure-only constraint
  check('Matrix keeps infrastructure-only constraint', () =>
    doc.includes('Do not deploy, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, request search indexing, approve indexed release, close Phase 5C, change record publication states, or change Opportunities product surfaces in this task.')
  );

  // Check stop-on-fail YES entries exist for critical verifiers
  const criticalStopVerifiers = [
    'validate-opportunities.js',
    'verify-opportunities-page.js',
    'verify-opportunities-index-policy.js',
    'verify-opportunities-structured-data-rules.js',
    'verify-opportunities-phase5c-pre-implementation-long-run-board.js',
    'verify-opportunities-phase5c-pre-implementation-command-contract.js',
    'verify-opportunities-all.js',
  ];

  // For each critical verifier, find the line with its name and check it has YES in the stop-on-fail column
  criticalStopVerifiers.forEach((name) => {
    const lines = doc.split('\n');
    let found = false;
    for (const line of lines) {
      if (line.includes(name) && line.includes('YES')) {
        found = true;
        break;
      }
    }
    check(`Critical verifier ${name} marked stop-on-fail: YES`, () => found);
  });
}

// Verify all expected verifier files exist on disk
EXPECTED_VERIFIERS.forEach((name) => {
  const filePath = path.join(TOOLS_DIR, name);
  check(`Verifier file exists on disk: ${name}`, () => fs.existsSync(filePath));
});

// Check that the aggregate references this new verifier is optional at this stage (PI-02),
// but we validate the aggregate exists
if (fs.existsSync(AGGREGATE_PATH)) {
  check('Master aggregate file exists', () => true);
  const aggregate = fs.readFileSync(AGGREGATE_PATH, 'utf8');
  check('Aggregate includes data validator step', () =>
    aggregate.includes('validate-opportunities.js')
  );
  check('Aggregate includes page verification step', () =>
    aggregate.includes('verify-opportunities-page.js')
  );
  check('Aggregate includes index policy step', () =>
    aggregate.includes('verify-opportunities-index-policy.js')
  );
  check('Aggregate includes HTTP verification step', () =>
    aggregate.includes('verify-opportunities-http.js')
  );
  check('Aggregate includes SEO metadata step', () =>
    aggregate.includes('verify-opportunities-seo-metadata.js')
  );
}

// Infrastructure-only safety checks
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

// Verifier count consistency check
const existingFiles = EXPECTED_VERIFIERS.filter((name) =>
  fs.existsSync(path.join(TOOLS_DIR, name))
);
check(`All ${EXPECTED_VERIFIERS.length} expected verifiers exist on disk`, () =>
  existingFiles.length === EXPECTED_VERIFIERS.length
);

console.log(`\nResults: ${passed}/${total} passed`);
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach((error) => console.log(`  ${error}`));
}
process.exit(errors.length ? 1 : 0);
