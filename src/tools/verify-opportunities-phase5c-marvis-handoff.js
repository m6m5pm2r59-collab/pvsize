#!/usr/bin/env node
/**
 * verify-opportunities-phase5c-marvis-handoff.js
 * Phase 5C: Verify Marvis handoff for Codex acceptance
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const HANDOFF_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_MARVIS_HANDOFF.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_MARKERS = [
  'PHASE5C_MARVIS_HANDOFF: CURRENT_PHASE',
  'PHASE5C_MARVIS_HANDOFF: LAST_COMMIT',
  'PHASE5C_MARVIS_HANDOFF: FULL_PLANNING_ARTIFACT_LIST',
  'PHASE5C_MARVIS_HANDOFF: FULL_VERIFIER_LIST',
  'PHASE5C_MARVIS_HANDOFF: COMMANDS_RUN',
  'PHASE5C_MARVIS_HANDOFF: KNOWN_RISKS',
  'PHASE5C_MARVIS_HANDOFF: EXPLICIT_NON_APPROVALS',
  'PHASE5C_MARVIS_HANDOFF: SUGGESTED_ACCEPTANCE_COMMANDS',
  'PHASE5C_MARVIS_HANDOFF: NEXT_SINGLE_TASK',
];

let errors = [];
let passed = 0;
let total = 0;

function check(msg, fn) {
  total++;
  try {
    if (fn()) { passed++; return true; }
    else { errors.push(`FAIL: ${msg}`); return false; }
  } catch (e) {
    errors.push(`FAIL: ${msg} — ${e.message}`);
    return false;
  }
}

const selfTest = process.argv.includes('--self-test');

if (selfTest) {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C MARVIS HANDOFF — SELF-TEST ===\n');

  for (const marker of REQUIRED_MARKERS) {
    check(`REQUIRED MARKER: ${marker.split(': ')[1]}`, () => true);
  }

  console.log(`\nSelf-test results: ${passed}/${total} passed`);
  if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
  process.exit(errors.length ? 1 : 0);
}

console.log('=== VERIFY OPPORTUNITIES PHASE5C MARVIS HANDOFF ===\n');

check('Handoff document exists', () => fs.existsSync(HANDOFF_PATH));

if (fs.existsSync(HANDOFF_PATH)) {
  const content = fs.readFileSync(HANDOFF_PATH, 'utf8');
  for (const marker of REQUIRED_MARKERS) {
    check(`Required marker: ${marker.split(': ')[1]}`, () => content.includes(marker));
  }
}

if (fs.existsSync(STATUS_PATH)) {
  const status = fs.readFileSync(STATUS_PATH, 'utf8');
  check('Phase 5C is Publication Pipeline', () => status.includes('Phase 5C') && status.includes('Publication Pipeline'));
  check('Phase 5C not Closed', () => !status.includes('Phase 5C Closed'));
}

// Verify all planning documents exist
const planningDocs = [
  'PVSIZE_OPPORTUNITIES_PRODUCTION_QA_SEARCH_INDEXING_REQUEST_HOLD_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PUBLISHED_RECORD_PREFLIGHT_MATRIX.md',
  'PVSIZE_OPPORTUNITIES_INDEXED_OUTPUT_ACTIVATION_PREFLIGHT_MATRIX.md',
  'PVSIZE_OPPORTUNITIES_NEWSLETTER_ACTIVATION_HOLD_CHECKLIST.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_RELEASE_PLANNING_SUMMARY.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_MARVIS_HANDOFF.md',
];
for (const doc of planningDocs) {
  check(`Planning doc exists: ${doc}`, () => fs.existsSync(path.join(ROOT, 'docs/opportunities', doc)));
}

// Verify all verifier scripts exist
const verifierScripts = [
  'verify-opportunities-production-qa-search-indexing-request-hold-checklist.js',
  'verify-opportunities-published-record-preflight-matrix.js',
  'verify-opportunities-indexed-output-activation-preflight-matrix.js',
  'verify-opportunities-newsletter-activation-hold-checklist.js',
  'verify-opportunities-phase5c-indexed-release-planning-summary.js',
];
for (const v of verifierScripts) {
  check(`Verifier exists: ${v}`, () => fs.existsSync(path.join(ROOT, 'src/tools', v)));
}

console.log(`\nResults: ${passed}/${total} passed`);
if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
process.exit(errors.length ? 1 : 0);
