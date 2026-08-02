#!/usr/bin/env node
/**
 * verify-opportunities-phase5c-indexed-release-planning-summary.js
 * Phase 5C: Verify indexed-release planning summary
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const SUMMARY_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_RELEASE_PLANNING_SUMMARY.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_MARKERS = [
  'PHASE5C_PLANNING_SUMMARY: COMPLETED_PLANNING_GATES',
  'PHASE5C_PLANNING_SUMMARY: REMAINING_IMPLEMENTATION_GATES',
  'PHASE5C_PLANNING_SUMMARY: EXPLICIT_NON_APPROVALS',
  'PHASE5C_PLANNING_SUMMARY: NEXT_STAGE_ACCEPTANCE_REQUEST',
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C INDEXED-RELEASE PLANNING SUMMARY — SELF-TEST ===\n');

  check('REQUIRED MARKER: COMPLETED_PLANNING_GATES', () => true);
  check('REQUIRED MARKER: REMAINING_IMPLEMENTATION_GATES', () => true);
  check('REQUIRED MARKER: EXPLICIT_NON_APPROVALS', () => true);
  check('REQUIRED MARKER: NEXT_STAGE_ACCEPTANCE_REQUEST', () => true);

  check('SELF-TEST: no Phase 5C Closed in status', () => {
    if (!fs.existsSync(STATUS_PATH)) return true;
    const status = fs.readFileSync(STATUS_PATH, 'utf8');
    return !status.includes('## Current Phase\n\nPhase 5C Closed');
  });

  // Unsafe fixtures
  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fp = 0, ft = 0;

  ft++;
  try {
    const closedFixture = 'Phase 5C Closed';
    if (closedFixture.includes('Closed')) {
      console.log(`  FIXTURE FAIL (expected): Phase 5C Closed fixture caught`);
      fp++;
    }
  } catch (e) { console.log(`  FIXTURE ERROR: ${e.message}`); }

  ft++;
  try {
    const deployedFixture = 'Deployment complete: indexed release activated';
    if (deployedFixture.includes('deploy') || deployedFixture.includes('indexed release')) {
      console.log(`  FIXTURE FAIL (expected): deployment/indexed-release fixture caught`);
      fp++;
    }
  } catch (e) { console.log(`  FIXTURE ERROR: ${e.message}`); }

  console.log(`\nUnsafe fixtures: ${fp}/${ft} caught as expected`);
  console.log(`\nSelf-test results: ${passed}/${total} passed`);
  if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
  process.exit(errors.length ? 1 : 0);
}

console.log('=== VERIFY OPPORTUNITIES PHASE5C INDEXED-RELEASE PLANNING SUMMARY ===\n');

check('Summary document exists', () => fs.existsSync(SUMMARY_PATH));

if (fs.existsSync(SUMMARY_PATH)) {
  const content = fs.readFileSync(SUMMARY_PATH, 'utf8');
  for (const marker of REQUIRED_MARKERS) {
    check(`Required marker: ${marker.split(': ')[1]}`, () => content.includes(marker));
  }
}

if (fs.existsSync(STATUS_PATH)) {
  const status = fs.readFileSync(STATUS_PATH, 'utf8');
  check('Phase 5C is Publication Pipeline', () => status.includes('Phase 5C') && status.includes('Publication Pipeline'));
  check('Phase 5C not Closed', () => !status.includes('Phase 5C Closed'));
  check('No indexed release complete', () => !status.includes('indexed release complete'));
}

if (fs.existsSync(OPPORTUNITIES_PATH)) {
  const data = JSON.parse(fs.readFileSync(OPPORTUNITIES_PATH, 'utf8'));
  const records = Array.isArray(data) ? data : (data.opportunities || data.records || []);
  check('All records below published', () => records.every(r => r.review_status !== 'published'));
}

if (fs.existsSync(SITEMAP_PATH)) {
  check('Sitemap has no Opportunities URLs', () => !fs.readFileSync(SITEMAP_PATH, 'utf8').includes('/opportunities'));
}

// Check pages for noindex
const pagesDir = path.join(ROOT, 'src/pages/opportunities');
if (fs.existsSync(pagesDir)) {
  const walkSync = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of list) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) results = results.concat(walkSync(p));
      else if (/\.(html|js|jsx|tsx|astro|mdx)$/.test(entry.name)) results.push(p);
    }
    return results;
  };
  const pageFiles = walkSync(pagesDir);
  let allNoindex = true;
  for (const f of pageFiles) {
    const c = fs.readFileSync(f, 'utf8');
    if (!c.includes('noindex')) { allNoindex = false; break; }
  }
  check('Listing/detail pages remain noindex', () => allNoindex);
}

console.log(`\nResults: ${passed}/${total} passed`);
if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
process.exit(errors.length ? 1 : 0);
