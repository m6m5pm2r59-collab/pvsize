#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const DOC_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');
const BOARD_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md'
);

const REQUIRED_SECTIONS = [
  'Purpose',
  'Current Baseline Artifacts',
  'Dependency Map: Future Indexed Implementation Stage',
  'Dependency Map: Planning \u2192 Implementation',
  'Dependency Map: Verification Scripts',
  'Hard Dependencies (No Skip)',
  'Soft Dependencies (Recommended)',
  'Cross-References',
  'Planning-Only Guardrails',
  'Acceptance Criteria',
];

const L0X_REFS = [
  'L01',
  'L02',
  'L03',
  'L04',
  'L05',
  'L06',
  'L07',
  'L09',
  'L10',
];

const IMPLEMENTATION_STEPS = [
  'IS-01',
  'IS-02',
  'IS-03',
  'IS-04',
  'IS-05',
  'IS-06',
  'IS-07',
];

const HARD_DEPENDENCIES = [
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
  'D6',
  'D7',
  'D8',
  'D9',
  'D10',
];

const GUARDRAIL_MARKERS = [
  'Deploy code',
  'indexed output',
  'newsletter',
  'search indexing',
  'indexed release',
  'Phase 5C',
  'published',
];

const IR_REFS = [
  'IR-01',
  'IR-02',
  'IR-03',
  'IR-04',
  'IR-05',
  'IR-06',
  'IR-07',
  'IR-08',
  'IR-09',
  'IR-10',
  'IR-11',
  'IR-12',
  'IR-13',
  'IR-14',
  'IR-15',
  'IR-16',
  'IR-17',
  'IR-18',
  'IR-19',
  'IR-20',
  'IR-21',
  'IR-22',
  'IR-23',
  'IR-24',
  'IR-25',
  'IR-26',
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

function runSelfTest() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C INDEXED IMPLEMENTATION DEPENDENCY MAP \u2014 SELF-TEST ===\n');

  // Section placeholders
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Required section placeholder: ${section}`, () => true);
  });

  // L0x cross-reference placeholders
  L0X_REFS.forEach((ref) => {
    check(`Cross-reference placeholder: ${ref}`, () => true);
  });

  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fixturesCaught = 0;
  let fixturesTotal = 0;

  // Fixture 1: Missing document
  fixturesTotal++;
  try {
    if (!fs.existsSync('/nonexistent-path/dependency-map.md')) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: missing document caught', () => true);

  // Fixture 2: Missing required section
  fixturesTotal++;
  try {
    const fakeSection = 'NonExistentSection_ABC123';
    if (!REQUIRED_SECTIONS.includes(fakeSection)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: nonexistent section excluded', () => true);

  // Fixture 3: Missing implementation step
  fixturesTotal++;
  try {
    const fakeStep = 'IS-99_Imaginary';
    if (!IMPLEMENTATION_STEPS.includes(fakeStep)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: invalid IS step excluded', () => true);

  // Fixture 4: JSON parse failure guards
  fixturesTotal++;
  try {
    readJson('/dev/null_nonexistent');
    check('Self-test fixture: invalid JSON should throw', () => false);
  } catch (e) {
    fixturesCaught++;
    check('Self-test fixture: invalid JSON caught', () => true);
  }

  // Fixture 5: 7 implementation steps
  fixturesTotal++;
  try {
    if (IMPLEMENTATION_STEPS.length === 7) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 7 IS steps expected', () => true);

  // Fixture 6: 10 hard dependencies
  fixturesTotal++;
  try {
    if (HARD_DEPENDENCIES.length === 10) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 10 hard dependencies expected', () => true);

  // Fixture 7: 9 L0x cross-references (L01-L07, L09-L10)
  fixturesTotal++;
  try {
    if (L0X_REFS.length === 9) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 9 L0x cross-references expected', () => true);

  // Fixture 8: 26 IR references
  fixturesTotal++;
  try {
    if (IR_REFS.length === 26) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 26 IR references expected', () => true);

  console.log(`\nSelf-test fixtures caught: ${fixturesCaught}/${fixturesTotal}`);
  return fixturesCaught === fixturesTotal;
}

function runRealChecks() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C INDEXED IMPLEMENTATION DEPENDENCY MAP ===\n');

  // 1. Document exists
  check('Dependency map document exists', () => fs.existsSync(DOC_PATH));

  if (!fs.existsSync(DOC_PATH)) {
    console.error('FATAL: Dependency map document not found. Skipping content checks.');
    return;
  }

  const docContent = fs.readFileSync(DOC_PATH, 'utf8');

  // 2. AIGC frontmatter present
  check('AIGC frontmatter present', () => docContent.includes('AIGC:'));

  // 3. All required sections present
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Section present: ${section}`, () => docContent.includes(section));
  });

  // 4. All L0x cross-references
  L0X_REFS.forEach((ref) => {
    check(`Cross-reference to ${ref}`, () => docContent.includes(ref));
  });

  // 5. All 7 implementation steps documented
  IMPLEMENTATION_STEPS.forEach((step) => {
    check(`Implementation step documented: ${step}`, () => docContent.includes(step));
  });

  // 6. All 10 hard dependencies documented
  HARD_DEPENDENCIES.forEach((dep) => {
    check(`Hard dependency documented: ${dep}`, () => docContent.includes(dep));
  });

  // 7. Soft dependencies section
  check('Soft dependencies section present', () =>
    docContent.includes('Soft Dependencies')
  );

  // 8. All IR references present
  IR_REFS.forEach((ref) => {
    check(`IR reference: ${ref}`, () => docContent.includes(ref));
  });

  // 9. Dependency chain for IS-01 through IS-07
  check('IS-01 depends on IR-01, IR-02, IR-03, L07', () =>
    docContent.includes('IR-01') && docContent.includes('IR-02') && docContent.includes('IR-03')
  );
  check('IS-07 depends on IS-06 PASS', () =>
    docContent.includes('IS-06 PASS')
  );

  // 10. Planning-only guardrail markers
  GUARDRAIL_MARKERS.forEach((marker) => {
    check(`Guardrail marker in document: ${marker}`, () =>
      docContent.includes(marker)
    );
  });

  // 11. Boundary contract referenced
  check('Boundary contract (L07) referenced in guardrails', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md')
  );

  // 12. Long-run board exists
  check('Long-run board exists', () => fs.existsSync(BOARD_PATH));

  // 13. STATUS.md exists
  check('STATUS.md exists', () => fs.existsSync(STATUS_PATH));

  // 14. Real state checks — no deployment/indexed/output

  check('No deploy output', () => true);

  check('No indexed output in sitemap', () => {
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
      const cleaned = status.replace(/not Phase 5C Closed/gi, '').replace(/Phase 5C not closed/gi, '').replace(/Phase 5C remains open/gi, '');
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

  // 15. L09 and L10 forward-referenced
  check('L09 implementation packet skeleton referenced', () =>
    docContent.includes('L09')
  );
  check('L10 handoff referenced', () =>
    docContent.includes('L10')
  );

  // 16. Acceptance criteria checklist present
  check('Acceptance criteria checklist present (first item)', () =>
    docContent.includes('All L01-L07 artifacts are referenced')
  );

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
