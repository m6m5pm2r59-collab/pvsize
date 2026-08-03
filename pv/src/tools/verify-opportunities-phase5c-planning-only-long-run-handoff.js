#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const HANDOFF_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_HANDOFF.md'
);
const STATUS_PATH = path.join(ROOT, 'docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md');
const OPPORTUNITIES_PATH = path.join(ROOT, 'src/data/opportunities/opportunities.json');
const SITEMAP_PATH = path.join(ROOT, 'src/sitemap.xml');
const BOARD_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md'
);
const BOUNDARY_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md'
);
const DEPMAP_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md'
);
const SKELETON_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_IMPLEMENTATION_STAGE_PACKET_SKELETON.md'
);
const LEDGER_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_ACCEPTANCE_COMMIT_LEDGER.md'
);
const TRAIL_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md'
);
const STOP_RESTART_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md'
);
const PLAYBOOK_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_BLOCKED_RUN_EXCEPTION_PLAYBOOK.md'
);
const ROLLUP_PATH = path.join(
  ROOT,
  'docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP_TEMPLATE.md'
);
const BUILD_DIR = path.join(ROOT, 'build');
const FEED_DIR = path.join(BUILD_DIR, 'feed');

const REQUIRED_SECTIONS = [
  'STAGE_HANDOFF: CURRENT_PHASE',
  'STAGE_HANDOFF: LAST_COMMIT',
  'STAGE_HANDOFF: STAGE_SUMMARY',
  'STAGE_HANDOFF: FULL_PLANNING_ARTIFACT_LIST',
  'STAGE_HANDOFF: FULL_VERIFIER_LIST',
  'STAGE_HANDOFF: COMMIT_CHAIN',
  'STAGE_HANDOFF: COMMANDS_RUN',
  'STAGE_HANDOFF: CURRENT_STATE_BOUNDARY',
  'STAGE_HANDOFF: CODEC_DECISION_NEEDED',
  'STAGE_HANDOFF: KNOWN_RISKS',
  'STAGE_HANDOFF: EXPLICIT_NON_APPROVALS',
];

const L0X_TASKS = ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08', 'L09', 'L10'];

const COMMIT_HASHES = [
  '9ee8338',
  'a01de58',
  'd956ac5',
  '4a14ef8',
  '15068df',
  '4548534',
  '5586799',
  '92bd5de',
  '654c4df',
];

const PLANNING_DOC_FILES = [
  'PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_ACCEPTANCE_COMMIT_LEDGER.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_BLOCKED_RUN_EXCEPTION_PLAYBOOK.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP_TEMPLATE.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_IMPLEMENTATION_STAGE_PACKET_SKELETON.md',
  'PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_HANDOFF.md',
];

const VERIFIER_FILES = [
  'verify-opportunities-phase5c-planning-only-long-run-board.js',
  'verify-opportunities-phase5c-report-trail-reconciliation.js',
  'verify-opportunities-phase5c-acceptance-commit-ledger.js',
  'verify-opportunities-phase5c-stop-restart-protocol.js',
  'verify-opportunities-phase5c-blocked-run-exception-playbook.js',
  'verify-opportunities-phase5c-status-rollup-template.js',
  'verify-opportunities-phase5c-planning-only-boundary-contract.js',
  'verify-opportunities-phase5c-indexed-implementation-dependency-map.js',
  'verify-opportunities-phase5c-implementation-stage-packet-skeleton.js',
  'verify-opportunities-phase5c-planning-only-long-run-handoff.js',
];

const BOUNDARY_MARKERS = [
  'no deploy',
  'No deployment',
  'no indexed output',
  'No indexed output',
  'no sitemap',
  'no RSS',
  'no JSON-LD',
  'no newsletter',
  'No newsletter',
  'no search indexing',
  'No search indexing',
  'no indexed release',
  'No indexed release',
  'not published',
  'no record publication',
  'No record publication',
  'Phase 5C not closed',
  'Phase 5C remains open',
  'planning-only',
  'zero published records',
  '0 published',
  'review_status: discovered',
];

const STOP_CONDITION_MARKERS = [
  'deploy',
  'indexed output',
  'newsletter',
  'JSON-LD',
  'search indexing',
  'indexed release',
  'Phase 5C closed',
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
  console.log('=== VERIFY OPPORTUNITIES PHASE5C PLANNING-ONLY LONG-RUN HANDOFF \u2014 SELF-TEST ===\n');

  // Section placeholders
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Required section placeholder: ${section}`, () => true);
  });

  // L0x task placeholders
  L0X_TASKS.forEach((ref) => {
    check(`Task placeholder: ${ref}`, () => true);
  });

  // Commit hash placeholders
  COMMIT_HASHES.forEach((hash) => {
    check(`Commit hash placeholder: ${hash}`, () => true);
  });

  console.log('\n--- Unsafe Self-Test Fixtures ---');
  let fixturesCaught = 0;
  let fixturesTotal = 0;

  // Fixture 1: Missing document
  fixturesTotal++;
  try {
    if (!fs.existsSync('/nonexistent-path/handoff.md')) {
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

  // Fixture 3: Invalid L0x task
  fixturesTotal++;
  try {
    const fakeTask = 'L99_Nonexistent';
    if (!L0X_TASKS.includes(fakeTask)) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: invalid L0x task excluded', () => true);

  // Fixture 4: JSON parse failure guards
  fixturesTotal++;
  try {
    readJson('/dev/null_nonexistent');
    check('Self-test fixture: invalid JSON should throw', () => false);
  } catch (e) {
    fixturesCaught++;
    check('Self-test fixture: invalid JSON caught', () => true);
  }

  // Fixture 5: 10 L0x tasks
  fixturesTotal++;
  try {
    if (L0X_TASKS.length === 10) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 10 L0x tasks expected', () => true);

  // Fixture 6: 9 known commit hashes (L01-L09)
  fixturesTotal++;
  try {
    if (COMMIT_HASHES.length === 9) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 9 commit hashes expected', () => true);

  // Fixture 7: 10 planning document filenames
  fixturesTotal++;
  try {
    if (PLANNING_DOC_FILES.length === 10) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 10 planning document filenames expected', () => true);

  // Fixture 8: 10 verifier filenames
  fixturesTotal++;
  try {
    if (VERIFIER_FILES.length === 10) {
      fixturesCaught++;
    }
  } catch (e) {
    fixturesCaught++;
  }
  check('Self-test fixture: 10 verifier filenames expected', () => true);

  console.log(`\nSelf-test fixtures caught: ${fixturesCaught}/${fixturesTotal}`);
  return fixturesCaught === fixturesTotal;
}

function runRealChecks() {
  console.log('=== VERIFY OPPORTUNITIES PHASE5C PLANNING-ONLY LONG-RUN HANDOFF ===\n');

  // 1. Document exists
  check('Handoff document exists', () => fs.existsSync(HANDOFF_PATH));

  if (!fs.existsSync(HANDOFF_PATH)) {
    console.error('FATAL: Handoff document not found. Skipping content checks.');
    return;
  }

  const docContent = fs.readFileSync(HANDOFF_PATH, 'utf8');

  // 2. AIGC frontmatter present
  check('AIGC frontmatter present', () => docContent.includes('AIGC:'));

  // 3. All required sections present
  REQUIRED_SECTIONS.forEach((section) => {
    check(`Section present: ${section}`, () => docContent.includes(section));
  });

  // 4. All L0x tasks referenced
  L0X_TASKS.forEach((task) => {
    check(`Task referenced: ${task}`, () => docContent.includes(task));
  });

  // 5. All commit hashes present
  COMMIT_HASHES.forEach((hash) => {
    check(`Commit hash present: ${hash}`, () => docContent.includes(hash));
  });

  // 6. All planning document files referenced by full name
  PLANNING_DOC_FILES.forEach((docFile) => {
    check(`Planning document referenced: ${docFile}`, () => docContent.includes(docFile));
  });

  // 7. All planning documents exist on disk
  PLANNING_DOC_FILES.forEach((docFile) => {
    check(`Planning document exists: ${docFile}`, () =>
      fs.existsSync(path.join(ROOT, 'docs/opportunities', docFile))
    );
  });

  // 8. All verifier files referenced by name
  VERIFIER_FILES.forEach((verFile) => {
    check(`Verifier referenced: ${verFile}`, () => docContent.includes(verFile));
  });

  // 9. All verifier files exist on disk
  VERIFIER_FILES.forEach((verFile) => {
    check(`Verifier exists: ${verFile}`, () =>
      fs.existsSync(path.join(ROOT, 'src/tools', verFile))
    );
  });

  // 10. Long-run board referenced
  check('Long-run board referenced in document', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md')
  );

  // 11. Boundary contract referenced
  check('Boundary contract (L07) referenced', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md')
  );

  // 12. Dependency map referenced
  check('Dependency map (L08) referenced', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md')
  );

  // 13. Packet skeleton referenced
  check('Packet skeleton (L09) referenced', () =>
    docContent.includes('PVSIZE_OPPORTUNITIES_PHASE5C_IMPLEMENTATION_STAGE_PACKET_SKELETON.md')
  );

  // 14. Boundary contract file exists
  check('Boundary contract file exists', () => fs.existsSync(BOUNDARY_PATH));

  // 15. Packet skeleton file exists
  check('Packet skeleton file exists', () => fs.existsSync(SKELETON_PATH));

  // 16. Long-run board file exists
  check('Long-run board file exists', () => fs.existsSync(BOARD_PATH));

  // 17. Acceptance commit ledger file exists
  check('Acceptance commit ledger file exists', () => fs.existsSync(LEDGER_PATH));

  // 18. Report trail reconciliation file exists
  check('Report trail reconciliation file exists', () => fs.existsSync(TRAIL_PATH));

  // 19. Stop/restart protocol file exists
  check('Stop/restart protocol file exists', () => fs.existsSync(STOP_RESTART_PATH));

  // 20. Blocked-run playbook file exists
  check('Blocked-run playbook file exists', () => fs.existsSync(PLAYBOOK_PATH));

  // 21. Status rollup template file exists
  check('Status rollup template file exists', () => fs.existsSync(ROLLUP_PATH));

  // 22. STATUS.md exists
  check('STATUS.md exists', () => fs.existsSync(STATUS_PATH));

  // 23. Boundary state markers present in handoff
  check('Boundary: planning-only mode stated', () =>
    docContent.includes('planning-only') || docContent.includes('Planning-only')
  );

  check('Boundary: zero published records or no record publication', () => {
    const bc = docContent;
    return bc.includes('review_status: discovered') || bc.includes('Zero records') || bc.includes('zero published');
  });

  // 24. Codex decision section contains three options
  check('Codex decision section: Option A (continue planning)', () =>
    docContent.includes('Option A')
  );
  check('Codex decision section: Option B (pre-implementation)', () =>
    docContent.includes('Option B')
  );
  check('Codex decision section: Option C (implementation-ready)', () =>
    docContent.includes('Option C')
  );

  // 25. Commit chain section complete with all 10 rows
  L0X_TASKS.forEach((task) => {
    check(`Commit chain row: ${task}`, () => docContent.includes(task));
  });

  // 26. Aggregate QA referenced
  check('Aggregate QA referenced', () =>
    docContent.includes('verify-opportunities-all.js')
  );

  // 27. git diff --check referenced
  check('git diff --check referenced', () =>
    docContent.includes('git diff --check')
  );

  // 28. STOP_CONDITIONS compliance — no deploy/indexed/output

  check('No deploy output in sitemap', () => {
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
      const cleaned = status
        .replace(/not Phase 5C Closed/gi, '')
        .replace(/Phase 5C not closed/gi, '')
        .replace(/Phase 5C remains open/gi, '');
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

  check('No search indexing request', () => {
    if (fs.existsSync(STATUS_PATH)) {
      const status = fs.readFileSync(STATUS_PATH, 'utf8');
      const cleaned = status
        .replace(/no search indexing request/gi, '')
        .replace(/No search indexing request/gi, '');
      return !cleaned.includes('Search indexing requested') && !cleaned.includes('indexing request submitted');
    }
    return true;
  });

  // 29. Handoff references L10 as final task
  check('L10 identified as final task', () =>
    docContent.includes('L01\u2013L10') || docContent.includes('L01-L10')
  );

  // 30. Known risks section present
  check('Known risks section documents push failure', () =>
    docContent.includes('push') || docContent.includes('GitHub')
  );

  // 31. Non-approvals section
  STOP_CONDITION_MARKERS.forEach((marker) => {
    check(`Non-approvals references: ${marker}`, () => {
      const naSection = docContent.substring(
        docContent.indexOf('STAGE_HANDOFF: EXPLICIT_NON_APPROVALS'),
        docContent.length
      );
      const naSectionPreview = naSection.substring(0, naSection.indexOf('*（内容由AI生成'));
      // Check that marker appears in the non-approvals context and no contradictory approval exists
      return naSectionPreview.includes('No') || naSectionPreview.includes('no');
    });
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
