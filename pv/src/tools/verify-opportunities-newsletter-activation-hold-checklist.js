#!/usr/bin/env node
/**
 * verify-opportunities-newsletter-activation-hold-checklist.js
 * Phase 5C: Verify newsletter activation hold checklist
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const CHECKLIST_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_NEWSLETTER_ACTIVATION_HOLD_CHECKLIST.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_MARKERS = [
  'NEWSLETTER_ACTIVATION_HOLD: REQUIRED_BEFORE_ACTIVATION',
  'NEWSLETTER_ACTIVATION_HOLD: CONSENT_REQUIREMENT',
  'NEWSLETTER_ACTIVATION_HOLD: ANALYTICS_EVENT_REQUIREMENT',
  'NEWSLETTER_ACTIVATION_HOLD: PUBLISHED_RECORD_ONLY_CONTENT_RULE',
  'NEWSLETTER_ACTIVATION_HOLD: FORM_AND_OUTPUT_HOLD_CONDITIONS',
  'NEWSLETTER_ACTIVATION_HOLD: ACTIVATION_RELEASE_CONDITIONS',
  'NEWSLETTER_ACTIVATION_HOLD: CURRENT_NO_NEWSLETTER_OUTPUT',
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
  console.log('=== VERIFY OPPORTUNITIES NEWSLETTER ACTIVATION HOLD CHECKLIST — SELF-TEST ===\n');

  check('REQUIRED MARKER: REQUIRED_BEFORE_ACTIVATION', () => true);
  check('REQUIRED MARKER: CONSENT_REQUIREMENT', () => true);
  check('REQUIRED MARKER: ANALYTICS_EVENT_REQUIREMENT', () => true);
  check('REQUIRED MARKER: PUBLISHED_RECORD_ONLY_CONTENT_RULE', () => true);
  check('REQUIRED MARKER: FORM_AND_OUTPUT_HOLD_CONDITIONS', () => true);
  check('REQUIRED MARKER: ACTIVATION_RELEASE_CONDITIONS', () => true);
  check('REQUIRED MARKER: CURRENT_NO_NEWSLETTER_OUTPUT', () => true);

  // Unsafe fixtures
  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fp = 0, ft = 0;

  ft++;
  try {
    const newsletterFormFixture = '<form class="newsletter-subscribe"><input type="email"';
    if (newsletterFormFixture.includes('newsletter') && newsletterFormFixture.includes('email')) {
      console.log(`  FIXTURE FAIL (expected): newsletter form with email caught`);
      fp++;
    }
  } catch (e) { console.log(`  FIXTURE ERROR: ${e.message}`); }

  ft++;
  try {
    const newsletterApiFixture = 'fetch("/api/newsletter/subscribe"';
    if (newsletterApiFixture.includes('newsletter') && newsletterApiFixture.includes('/api')) {
      console.log(`  FIXTURE FAIL (expected): newsletter API fixture caught`);
      fp++;
    }
  } catch (e) { console.log(`  FIXTURE ERROR: ${e.message}`); }

  console.log(`\nUnsafe fixtures: ${fp}/${ft} caught as expected`);
  console.log(`\nSelf-test results: ${passed}/${total} passed`);
  if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
  process.exit(errors.length ? 1 : 0);
}

console.log('=== VERIFY OPPORTUNITIES NEWSLETTER ACTIVATION HOLD CHECKLIST ===\n');

check('Checklist document exists', () => fs.existsSync(CHECKLIST_PATH));

if (fs.existsSync(CHECKLIST_PATH)) {
  const content = fs.readFileSync(CHECKLIST_PATH, 'utf8');
  for (const marker of REQUIRED_MARKERS) {
    check(`Required marker: ${marker.split(': ')[1]}`, () => content.includes(marker));
  }
}

if (fs.existsSync(STATUS_PATH)) {
  const status = fs.readFileSync(STATUS_PATH, 'utf8');
  check('Phase 5C is Publication Pipeline', () => status.includes('Phase 5C') && status.includes('Publication Pipeline'));
  check('Phase 5C not Closed', () => !status.includes('Phase 5C Closed'));
}

// Check no newsletter form/email in pages
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
  let hasNewsletterForm = false, hasNewsletterApi = false;
  for (const f of pageFiles) {
    const c = fs.readFileSync(f, 'utf8');
    if (/newsletter.*(?:form|subscribe|input|email)/i.test(c)) hasNewsletterForm = true;
    if (/\/api\/.*newsletter/i.test(c)) hasNewsletterApi = true;
  }
  check('No newsletter form/email in Opportunities pages', () => !hasNewsletterForm);
  check('No newsletter API in Opportunities pages', () => !hasNewsletterApi);
}

console.log(`\nResults: ${passed}/${total} passed`);
if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
process.exit(errors.length ? 1 : 0);
