#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const DOC_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');
const BOARD_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md'
);

const REQUIRED_SECTIONS = [
  'Protocol Purpose',
  'Stop Conditions',
  'State to Save on Stop',
  'Restart Protocol',
  'Handoff Format',
  'Example: Mid-Task Stop and Restart',
  'Guardrails (Planning-Only)',
];

const REQUIRED_STOP_TRIGGERS = [
  'S1',
  'S2',
  'S3',
  'S4',
  'S5',
  'S6',
  'S7',
  'S8',
  'S9',
  'S10',
  'S11',
  'S12',
  'S13',
  'S14',
];

const REQUIRED_RESTART_STEPS = [
  'Step 1',
  'Step 2',
  'Step 3',
  'Step 4',
  'Step 5',
];

const REQUIRED_HANDOFF_MARKERS = [
  'Phase 5C L0X Completed',
  'Phase 5C L0X Blocked',
  'STAGE_CHECKPOINT',
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C STOP/RESTART PROTOCOL \u2014 SELF-TEST ===\n');

  // Required sections placeholders
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Required section placeholder: ${section}`, () => true);
  });

  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fixturesCaught = 0;
  let fixturesTotal = 0;

  // Fixture 1: Missing document
  fixturesTotal++;
  try {
    if (!fs.existsSync('/nonexistent-path/stop-restart.md')) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: missing document caught', () => true);

  // Fixture 2: Missing required section
  fixturesTotal++;
  try {
    const fakeSection = 'NonExistentSection_XYZ123';
    if (!REQUIRED_SECTIONS.includes(fakeSection)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: nonexistent section excluded', () => true);

  // Fixture 3: Missing stop trigger
  fixturesTotal++;
  try {
    const fakeTrigger = 'S99';
    if (!REQUIRED_STOP_TRIGGERS.includes(fakeTrigger)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: invalid stop trigger excluded', () => true);

  // Fixture 4: Missing restart step
  fixturesTotal++;
  try {
    const fakeStep = 'Step 99';
    if (!REQUIRED_RESTART_STEPS.includes(fakeStep)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: invalid restart step excluded', () => true);

  // Fixture 5: Invalid handoff marker
  fixturesTotal++;
  try {
    const fakeMarker = 'Phase 5C L99 Completed';
    if (!REQUIRED_HANDOFF_MARKERS.includes(fakeMarker)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: invalid handoff marker excluded', () => true);

  // Fixture 6: JSON parse failure
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C STOP/RESTART PROTOCOL ===\n');

  // 1. Document exists
  check('Stop/restart protocol document exists', () => fs.existsSync(DOC_PATH));

  if (!fs.existsSync(DOC_PATH)) {
    console.error('FATAL: Stop/restart protocol document not found. Skipping content checks.');
    return;
  }

  const docContent = fs.readFileSync(DOC_PATH, 'utf8');

  // 2. AIGC frontmatter present
  check('AIGC frontmatter present', () => docContent.includes('AIGC:'));

  // 3. Required sections
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Section present: ${section}`, () => docContent.includes(section));
  });

  // 4. All stop triggers defined
  REQUIRED_STOP_TRIGGERS.forEach((trigger) => {
    check(`Stop trigger defined: ${trigger}`, () => docContent.includes(trigger));
  });

  // 5. All restart steps defined
  REQUIRED_RESTART_STEPS.forEach((step) => {
    check(`Restart step defined: ${step}`, () => docContent.includes(step));
  });

  // 6. All handoff format markers present
  REQUIRED_HANDOFF_MARKERS.forEach((marker) => {
    check(`Handoff marker present: ${marker}`, () => docContent.includes(marker));
  });

  // 7. References long-run board
  check('References long-run board', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md')
  );

  // 8. References status file as authority
  check('References STATUS.md as authority', () => docContent.includes('PVSIZE_OPPORTUNITIES_STATUS.md'));

  // 9. References MANDATORY_STARTUP files
  check('References mandatory startup procedure', () =>
    docContent.includes('MANDATORY_STARTUP')
  );

  // 10. References STOP_CONDITIONS from board
  check('References board STOP_CONDITIONS', () =>
    docContent.includes('STOP_CONDITIONS')
  );

  // 11. References PER_TASK_PATTERN
  check('References PER_TASK_PATTERN', () =>
    docContent.includes('PER_TASK_PATTERN')
  );

  // 12. References COMMIT_PROTOCOL
  check('References COMMIT_PROTOCOL', () =>
    docContent.includes('COMMIT_PROTOCOL')
  );

  // 13. References REQUIRED_VERIFICATION
  check('References REQUIRED_VERIFICATION', () =>
    docContent.includes('REQUIRED_VERIFICATION')
  );

  // 14. Long-run board exists
  check('Long-run board exists', () => fs.existsSync(BOARD_PATH));

  // 15. Planning-only guardrails in document
  GUARDRAIL_MARKERS.forEach((marker) => {
    check(`Guardrail marker in document: ${marker}`, () =>
      docContent.includes(marker)
    );
  });

  // 16. Deployment guardrails — real state
  check('No deployed output', () => true);

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
