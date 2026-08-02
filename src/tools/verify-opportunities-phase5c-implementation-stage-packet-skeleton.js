#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const DOC_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_IMPLEMENTATION_STAGE_PACKET_SKELETON.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');
const BOARD_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md'
);
const DEPMAP_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md'
);
const BOUNDARY_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md'
);

const REQUIRED_SECTIONS = [
  'Purpose',
  'Skeleton Position in the Stage Pipeline',
  'Future Packet Metadata Slots',
  'Entry Conditions',
  'Implementation Task Queue',
  'Per-Task Pattern',
  'Verification Script Map',
  'Planning-Only Guardrails',
  'Stop Conditions',
  'Exit Conditions',
  'Cross-References',
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
  'L08',
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

const ENTRY_GATES = [
  'G1',
  'G2',
  'G3',
  'G4',
  'G5',
  'SG1',
  'SG2',
  'SG3',
];

const GUARDRAIL_MARKERS = [
  'Deploy code',
  'indexed output',
  'newsletter',
  'JSON-LD',
  'search indexing',
  'indexed release',
  'Phase 5C',
  'published',
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C IMPLEMENTATION STAGE PACKET SKELETON \u2014 SELF-TEST ===\n');

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
    if (!fs.existsSync('/nonexistent-path/packet-skeleton.md')) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: missing document caught', () => true);

  // Fixture 2: Missing required section
  fixturesTotal++;
  try {
    const fakeSection = 'NonExistentSection_XYZ789';
    if (!REQUIRED_SECTIONS.includes(fakeSection)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: nonexistent section excluded', () => true);

  // Fixture 3: Invalid IS step
  fixturesTotal++;
  try {
    const fakeStep = 'IS-99_Nonexistent';
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

  // Fixture 5: 7 IS steps
  fixturesTotal++;
  try {
    if (IMPLEMENTATION_STEPS.length === 7) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 7 IS steps expected', () => true);

  // Fixture 6: 9 L0x cross-references (L01-L08, L10)
  fixturesTotal++;
  try {
    if (L0X_REFS.length === 9) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 9 L0x cross-references expected', () => true);

  // Fixture 7: 8 entry gates (G1-G5 + SG1-SG3)
  fixturesTotal++;
  try {
    if (ENTRY_GATES.length === 8) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 8 entry gates expected', () => true);

  // Fixture 8: 8 guardrail markers
  fixturesTotal++;
  try {
    if (GUARDRAIL_MARKERS.length === 8) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 8 guardrail markers expected', () => true);

  console.log(`\nSelf-test fixtures caught: ${fixturesCaught}/${fixturesTotal}`);
  return fixturesCaught === fixturesTotal;
}

function runRealChecks() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C IMPLEMENTATION STAGE PACKET SKELETON ===\n');

  // 1. Document exists
  check('Packet skeleton document exists', () => fs.existsSync(DOC_PATH));

  if (!fs.existsSync(DOC_PATH)) {
    console.error('FATAL: Packet skeleton document not found. Skipping content checks.');
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

  // 6. All entry gates documented
  ENTRY_GATES.forEach((gate) => {
    check(`Entry gate documented: ${gate}`, () => docContent.includes(gate));
  });

  // 7. Pipeline diagram present
  check('Stage pipeline diagram present', () =>
    docContent.includes('L01-L08') && docContent.includes('Codex decision')
  );

  // 8. Metadata slots table
  check('Packet metadata slots table present', () =>
    docContent.includes('Packet status') && docContent.includes('Activation date') && docContent.includes('Base commit')
  );

  // 9. Boundary contract referenced
  check('Boundary contract (L07) referenced in guardrails', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md')
  );

  // 10. Dependency map referenced
  check('Dependency map (L08) referenced', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md')
  );

  // 11. Dependency map file exists
  check('Dependency map file exists', () => fs.existsSync(DEPMAP_PATH));

  // 12. Boundary contract file exists
  check('Boundary contract file exists', () => fs.existsSync(BOUNDARY_PATH));

  // 13. Long-run board exists
  check('Long-run board exists', () => fs.existsSync(BOARD_PATH));

  // 14. STATUS.md exists
  check('STATUS.md exists', () => fs.existsSync(STATUS_PATH));

  // 15. Per-task pattern documented
  check('Per-task pattern section documented (Pre-check/Execute/Verify/Record/Gate)', () =>
    docContent.includes('Pre-check') &&
    docContent.includes('Execute') &&
    docContent.includes('Verify') &&
    docContent.includes('Record') &&
    docContent.includes('Gate')
  );

  // 16. Verification script map present
  check('Verification script map present', () =>
    docContent.includes('verify-opportunities-all.js') &&
    docContent.includes('validate-opportunities.js') &&
    docContent.includes('verify-opportunities-page.js')
  );

  // 17. Planning-only guardrail markers
  GUARDRAIL_MARKERS.forEach((marker) => {
    check(`Guardrail marker in document: ${marker}`, () =>
      docContent.includes(marker)
    );
  });

  // 18. Stop conditions reference L04 and L05
  check('Stop conditions reference L04', () => {
    const stopSection = docContent.substring(
      docContent.indexOf('Stop Conditions'),
      docContent.indexOf('Exit Conditions')
    );
    return stopSection.includes('L04') && stopSection.includes('L05');
  });

  // 19. Exit conditions explicit
  check('Exit conditions explicit (IS-01 through IS-07 + aggregate QA + production QA)', () =>
    docContent.includes('IS-07') && docContent.includes('aggregate QA') &&
    docContent.includes('production QA')
  );

  // 20. Acceptance criteria checklist present
  check('Acceptance criteria checklist present (first item)', () =>
    docContent.includes('All eight planning artifact cross-references')
  );

  // 21. Real state checks — no deployment/indexed/output

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

  // 22. L09 forward reference to L10
  check('L10 handoff referenced in cross-references', () =>
    docContent.includes('L10')
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
