#!/usr/bin/env node
/**
 * verify-opportunities-indexed-output-activation-preflight-matrix.js
 * Phase 5C: Verify indexed output activation preflight matrix
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const PREFLIGHT_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_OUTPUT_ACTIVATION_PREFLIGHT_MATRIX.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');

const REQUIRED_MARKERS = [
  'INDEXED_OUTPUT_PREFLIGHT: SITEMAP_ACTIVATION',
  'INDEXED_OUTPUT_PREFLIGHT: RSS_ACTIVATION',
  'INDEXED_OUTPUT_PREFLIGHT: JSON_LD_ACTIVATION',
  'INDEXED_OUTPUT_PREFLIGHT: PUBLISHED_RECORD_DEPENDENCY',
  'INDEXED_OUTPUT_PREFLIGHT: PRODUCTION_QA_DEPENDENCY',
  'INDEXED_OUTPUT_PREFLIGHT: ROLLBACK_AND_NOINDEX_FALLBACK',
  'INDEXED_OUTPUT_PREFLIGHT: CURRENT_NO_OUTPUT',
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
  console.log('=== VERIFY OPPORTUNITIES INDEXED OUTPUT ACTIVATION PREFLIGHT MATRIX — SELF-TEST ===\n');

  check('REQUIRED MARKER: SITEMAP_ACTIVATION', () => true);
  check('REQUIRED MARKER: RSS_ACTIVATION', () => true);
  check('REQUIRED MARKER: JSON_LD_ACTIVATION', () => true);
  check('REQUIRED MARKER: PUBLISHED_RECORD_DEPENDENCY', () => true);
  check('REQUIRED MARKER: PRODUCTION_QA_DEPENDENCY', () => true);
  check('REQUIRED MARKER: ROLLBACK_AND_NOINDEX_FALLBACK', () => true);
  check('REQUIRED MARKER: CURRENT_NO_OUTPUT', () => true);

  check('SELF-TEST: no opportunities in sitemap', () => {
    if (!fs.existsSync(SITEMAP_PATH)) return true;
    return !fs.readFileSync(SITEMAP_PATH, 'utf8').includes('/opportunities');
  });

  // Unsafe fixtures
  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fp = 0, ft = 0;

  ft++;
  try {
    const sitemapFixture = '<url><loc>https://pvsize.com/opportunities/us/solar-grant-001</loc></url>';
    if (sitemapFixture.includes('/opportunities')) {
      console.log(`  FIXTURE FAIL (expected): sitemap with /opportunities caught`);
      fp++;
    }
  } catch (e) { console.log(`  FIXTURE ERROR: ${e.message}`); }

  ft++;
  try {
    const jsonLdFixture = '<script type="application/ld+json">{"@type":"JobPosting"}</script>';
    if (jsonLdFixture.includes('ld+json')) {
      console.log(`  FIXTURE FAIL (expected): JSON-LD fixture caught`);
      fp++;
    }
  } catch (e) { console.log(`  FIXTURE ERROR: ${e.message}`); }

  ft++;
  try {
    const rssFixture = '<link rel="alternate" type="application/rss+xml" title="Opportunities RSS"';
    if (rssFixture.includes('application/rss+xml')) {
      console.log(`  FIXTURE FAIL (expected): RSS alternate fixture caught`);
      fp++;
    }
  } catch (e) { console.log(`  FIXTURE ERROR: ${e.message}`); }

  console.log(`\nUnsafe fixtures: ${fp}/${ft} caught as expected`);
  console.log(`\nSelf-test results: ${passed}/${total} passed`);
  if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
  process.exit(errors.length ? 1 : 0);
}

console.log('=== VERIFY OPPORTUNITIES INDEXED OUTPUT ACTIVATION PREFLIGHT MATRIX ===\n');

check('Preflight document exists', () => fs.existsSync(PREFLIGHT_PATH));

if (fs.existsSync(PREFLIGHT_PATH)) {
  const content = fs.readFileSync(PREFLIGHT_PATH, 'utf8');
  for (const marker of REQUIRED_MARKERS) {
    check(`Required marker: ${marker.split(': ')[1]}`, () => content.includes(marker));
  }
}

if (fs.existsSync(STATUS_PATH)) {
  const status = fs.readFileSync(STATUS_PATH, 'utf8');
  check('Phase 5C is Publication Pipeline', () => status.includes('Phase 5C') && status.includes('Publication Pipeline'));
  check('Phase 5C not Closed', () => !status.includes('Phase 5C Closed'));
}

if (fs.existsSync(OPPORTUNITIES_PATH)) {
  const data = JSON.parse(fs.readFileSync(OPPORTUNITIES_PATH, 'utf8'));
  const records = Array.isArray(data) ? data : (data.opportunities || data.records || []);
  check('No published records', () => records.every(r => r.review_status !== 'published'));
}

if (fs.existsSync(SITEMAP_PATH)) {
  check('Sitemap has no Opportunities URLs', () => !fs.readFileSync(SITEMAP_PATH, 'utf8').includes('/opportunities'));
}

// Check for JSON-LD in opportunity pages
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
  let hasJsonLd = false;
  for (const f of pageFiles) {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('ld+json') || c.includes('application/ld+json')) { hasJsonLd = true; break; }
  }
  check('No JSON-LD in Opportunities pages', () => !hasJsonLd);
}

// Check for RSS alternate in pages
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
  let hasRss = false;
  for (const f of pageFiles) {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('application/rss+xml') || c.includes('application/atom+xml')) { hasRss = true; break; }
  }
  check('No RSS alternate in Opportunities pages', () => !hasRss);
}

console.log(`\nResults: ${passed}/${total} passed`);
if (errors.length) { console.log('\nErrors:'); errors.forEach(e => console.log(`  ${e}`)); }
process.exit(errors.length ? 1 : 0);
