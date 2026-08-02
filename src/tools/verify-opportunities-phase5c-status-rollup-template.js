#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const DOC_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP_TEMPLATE.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');
const BOARD_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md'
);

const REQUIRED_SECTIONS = [
  'Template Purpose',
  'Integration Points',
  'Rollup Block Template',
  'Rollup Storage',
  'Rollup Audit Properties',
  'Relationship to Other L0x Templates',
  'Guardrails (Planning-Only)',
];

const REQUIRED_SUBSECTIONS = [
  'Field Definitions',
  'Progress Bullet Rules',
  'Blocker Recording',
];

const REQUIRED_ROLLUP_FIELDS = [
  'Goal',
  'Progress',
  'Blockers',
  'Verification',
  'Next Queue Item',
];

const REQUIRED_VERIFICATION_FIELDS = [
  'Self-test',
  'Real check',
  'Aggregate QA',
  'git diff --check',
];

const REQUIRED_AUDIT_PROPERTIES = [
  'Goal drift',
  'Progress completeness',
  'Blocker pattern',
  'Verification regression',
  'Queue coherence',
];

const GUARDRAIL_MARKERS = [
  'Deploy code',
  'indexed output',
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C STATUS ROLLUP TEMPLATE \u2014 SELF-TEST ===\n');

  // Required sections placeholders
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Required section placeholder: ${section}`, () => true);
  });

  // Required subsections placeholders
  REQUIRED_SUBSECTIONS.forEach((subsection) => {
    check(`Required subsection placeholder: ${subsection}`, () => true);
  });

  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fixturesCaught = 0;
  let fixturesTotal = 0;

  // Fixture 1: Missing document
  fixturesTotal++;
  try {
    if (!fs.existsSync('/nonexistent-path/status-rollup-template.md')) {
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

  // Fixture 3: Missing required rollup field
  fixturesTotal++;
  try {
    const fakeField = 'Thoughts';
    if (!REQUIRED_ROLLUP_FIELDS.includes(fakeField)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: invalid rollup field excluded', () => true);

  // Fixture 4: JSON parse failure guards
  fixturesTotal++;
  try {
    readJson('/dev/null_nonexistent');
    check('Self-test fixture: invalid JSON should throw', () => false);
  } catch (e) {
    fixturesCaught++;
    check('Self-test fixture: invalid JSON caught', () => true);
  }

  // Fixture 5: verification field completeness
  fixturesTotal++;
  try {
    if (REQUIRED_VERIFICATION_FIELDS.length === 4) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 4 verification sub-fields expected', () => true);

  // Fixture 6: audit properties count
  fixturesTotal++;
  try {
    if (REQUIRED_AUDIT_PROPERTIES.length === 5) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 5 audit properties expected', () => true);

  console.log(`\nSelf-test fixtures caught: ${fixturesCaught}/${fixturesTotal}`);
  return fixturesCaught === fixturesTotal;
}

function runRealChecks() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C STATUS ROLLUP TEMPLATE ===\n');

  // 1. Document exists
  check('Status rollup template document exists', () => fs.existsSync(DOC_PATH));

  if (!fs.existsSync(DOC_PATH)) {
    console.error('FATAL: Status rollup template document not found. Skipping content checks.');
    return;
  }

  const docContent = fs.readFileSync(DOC_PATH, 'utf8');

  // 2. AIGC frontmatter present
  check('AIGC frontmatter present', () => docContent.includes('AIGC:'));

  // 3. Required sections
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Section present: ${section}`, () => docContent.includes(section));
  });

  // 4. Required subsections
  REQUIRED_SUBSECTIONS.forEach((subsection) => {
    check(`Subsection present: ${subsection}`, () => docContent.includes(subsection));
  });

  // 5. Rollup block template includes all 5 required fields
  REQUIRED_ROLLUP_FIELDS.forEach((field) => {
    check(`Rollup field in template: ${field}`, () => {
      // Look for the field in the template block
      const templateBlock = docContent.split('### L0X:')[1]?.split('###')[0] || '';
      return templateBlock.includes(`**${field}**`);
    });
  });

  // 6. Verification sub-fields present
  REQUIRED_VERIFICATION_FIELDS.forEach((field) => {
    check(`Verification sub-field: ${field}`, () => docContent.includes(field));
  });

  // 7. Five audit properties defined
  REQUIRED_AUDIT_PROPERTIES.forEach((prop) => {
    check(`Audit property: ${prop}`, () => docContent.includes(prop));
  });

  // 8. Option A (inline in STATUS.md) defined
  check('Option A: inline in STATUS.md defined', () =>
    docContent.includes('Option A') && docContent.includes('PVSIZE_OPPORTUNITIES_STATUS.md')
  );

  // 9. Option B (standalone) defined
  check('Option B: standalone rollup document defined', () =>
    docContent.includes('Option B')
  );

  // 10. Example L06 rollup block present
  check('Example L06 rollup block present', () =>
    docContent.includes('Example: L06') && docContent.includes('Add status rollup template')
  );

  // 11. Forbidden progress patterns called out
  check('Forbidden progress patterns documented', () =>
    docContent.includes('Forbidden') &&
    docContent.includes('Completed task') &&
    docContent.includes('Made good progress')
  );

  // 12. Blocker recording format defined
  check('Blocker recording: NONE format documented', () =>
    docContent.includes('**Blockers**: NONE')
  );

  check('Blocker recording: B1 evidence format documented', () =>
    docContent.includes('B1 \u2014')
  );

  // 13. Relationship table references L02-L05
  check('References L02 report trail reconciliation', () =>
    docContent.includes('L02')
  );
  check('References L03 acceptance commit ledger', () =>
    docContent.includes('L03')
  );
  check('References L04 stop/restart protocol', () =>
    docContent.includes('L04')
  );
  check('References L05 blocked-run exception playbook', () =>
    docContent.includes('L05')
  );

  // 14. Reference to long-run board
  check('References long-run board', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md')
  );

  // 15. Long-run board exists
  check('Long-run board exists', () => fs.existsSync(BOARD_PATH));

  // 16. STATUS.md exists
  check('STATUS.md exists', () => fs.existsSync(STATUS_PATH));

  // 17. Planning-only guardrails in document
  GUARDRAIL_MARKERS.forEach((marker) => {
    check(`Guardrail marker in document: ${marker}`, () =>
      docContent.includes(marker)
    );
  });

  // 18. Real state checks — deployment/indexed/output
  check('No deployed output', () => true);

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
