---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 152197a3d7e9375bf12095386579fe5d_3cc60e9b8d4c11f196d8525400f8a581
    ReservedCode1: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 152197a3d7e9375bf12095386579fe5d_3cc60e9b8d4c11f196d8525400f8a581
    ReservedCode2: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
---

# PVSize Opportunities Phase 5C Status Rollup Template

Defines the compact stage rollup template for the Phase 5C planning-only long-run board (`PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md`). Every later run records goal, progress, blockers, verification, and next queue item in a uniform way, making stage-level review and cross-run comparison easy.

Updated: 2026-08-02 17:30 CST

## Template Purpose

The Phase 5C planning-only long-run stage runs multiple tasks (L01-L10 and potentially beyond) across many execution sessions. Without a uniform rollup format, each session's report reflects that session's specific prompt — making it difficult for Codex or Marvis to compare runs, detect drift, and audit progress at a glance.

This template defines a single compact rollup block to be appended to `PVSIZE_OPPORTUNITIES_STATUS.md` (or a designated rollup document) after each task is completed. The block is identical in structure for every task, differing only in content.

## Integration Points

- **Long-run board**: `PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md`
- **Status file**: `PVSIZE_OPPORTUNITIES_STATUS.md`
- **Stop/restart protocol**: `PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md` (L04)
- **Blocked-run exception playbook**: `PVSIZE_OPPORTUNITIES_PHASE5C_BLOCKED_RUN_EXCEPTION_PLAYBOOK.md` (L05)
- **Acceptance commit ledger**: `PVSIZE_OPPORTUNITIES_PHASE5C_ACCEPTANCE_COMMIT_LEDGER.md` (L03)

## Rollup Block Template

Each completed task produces exactly one rollup block. The block uses the format below:

```text
### L0X: <task name>

**Goal**: <one-sentence statement of what this task aimed to achieve>

**Progress**:
- <artifact 1 created, committed>
- <artifact 2 created, committed>
- <verification passed: N/N self-test, M steps aggregate QA>

**Blockers**: <NONE, or B1-B10 with brief evidence>

**Verification**:
- Self-test: <count>/<count> PASS
- Real check: <count>/<count> PASS
- Aggregate QA: <N> steps PASS
- git diff --check: PASS

**Next Queue Item**: L0Y <next task name>
```

### Field Definitions

| Field | Required | Description |
|---|---|---|
| `L0X: <task name>` | Yes | Task identifier and short name from the long-run board task queue |
| `Goal` | Yes | One sentence. Must match the Objective from the long-run board. |
| `Progress` | Yes | Bullet list of concrete outputs (files created, commits made, verifications run). No narrative. |
| `Blockers` | Yes | `NONE` if no blockers were encountered. Otherwise B1-B10 with a one-line evidence summary referencing the blocked-run exception playbook. |
| `Verification` | Yes | Four-line fixed format: self-test, real check, aggregate QA, git diff. |
| `Next Queue Item` | Yes | Must match the Next Single Task in STATUS.md. |

### Progress Bullet Rules

Progress bullets must be:

- **Concrete**: state what file was created, not what "work was done"
- **Complete**: include both document and verifier artifacts
- **Commit-aware**: mention the commit hash when a task completes

Allowed progress bullet examples:

```text
- Created docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP_TEMPLATE.md (committed in <hash>)
- Created src/tools/verify-opportunities-phase5c-status-rollup-template.js with --self-test (committed in <hash>)
- Updated STATUS.md: L06 → complete, Next → L07
```

Forbidden:

```text
- Completed task
- Made good progress
- Everything went well
```

### Blocker Recording

If no blockers were encountered:

```text
**Blockers**: NONE
```

If a blocker was encountered, reference the blocked-run exception playbook format:

```text
**Blockers**: B1 — verifier self-test returned expected 6/6 but saw 5/6; root cause: section heading mismatch; resolved by fixing verifier regex.
```

For unresolved blockers, the task stops and the rollup block is not written (the task is not complete). Instead, the blocked-run exception playbook (L05) handoff format is used.

## Rollup Storage

### Option A: Inline in STATUS.md (Recommended)

Append the rollup block directly to `PVSIZE_OPPORTUNITIES_STATUS.md` in a `## Phase 5C Status Rollup` section after the `Completed` section. This keeps all status information in one authoritative file.

```markdown
## Phase 5C Status Rollup

### L01: Promote the long-run board

**Goal**: Create the planning-only long-run board as the new total board for Marvis continuous execution.

**Progress**:
- Created docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md (committed in <hash>)
- Created src/tools/verify-opportunities-phase5c-planning-only-long-run-board.js with --self-test (committed in <hash>)

**Blockers**: NONE

**Verification**:
- Self-test: 10/10 PASS
- Real check: 10/10 PASS
- Aggregate QA: 29 steps PASS
- git diff --check: PASS

**Next Queue Item**: L02 Reconcile the report trail

### L02: Reconcile the report trail
...
```

### Option B: Standalone Rollup Document

If STATUS.md becomes too long, create a standalone `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP.md` and reference it from STATUS.md. This decision should be made when STATUS.md exceeds 300 lines.

## Rollup Audit Properties

The uniform rollup format enables these audit checks:

1. **Goal drift**: Compare the Goal field across tasks to the long-run board Objectives — any mismatch indicates the task was executed against a different intention.
2. **Progress completeness**: Verify that each task's Progress bullets include both document and verifier artifacts.
3. **Blocker pattern**: Scan the Blockers field across tasks to identify systemic issues or recurring problems.
4. **Verification regression**: Compare Verification self-test and aggregate QA counts to detect regressions.
5. **Queue coherence**: Verify that Next Queue Item for L0X points to L0(X+1) as defined in the long-run board task queue.

## Relationship to Other L0x Templates

| L0x | Template Produced | How It Uses the Rollup |
|---|---|---|
| L02 | Report trail reconciliation | Cross-references rollup entries to map report-to-commit chains |
| L03 | Acceptance commit ledger | Maps each rollup entry to its commit hash for stage review |
| L04 | Stop/restart protocol | Uses Next Queue Item from the last rollup entry to determine resume point |
| L05 | Blocked-run exception playbook | Distinguishes completed rollup entries (no blockers) from blocked entries |

## Example: L06 Rollup Block

```text
### L06: Add status rollup template

**Goal**: Create a compact stage rollup template so every later run records goal, progress, blockers, verification, and next queue item in a uniform way.

**Progress**:
- Created docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP_TEMPLATE.md (committed in <hash>)
- Created src/tools/verify-opportunities-phase5c-status-rollup-template.js with --self-test (committed in <hash>)

**Blockers**: NONE

**Verification**:
- Self-test: 6/6 PASS
- Real check: <N>/<N> PASS
- Aggregate QA: <N> steps PASS
- git diff --check: PASS

**Next Queue Item**: L07 Add planning-only boundary contract
```

## Guardrails (Planning-Only)

The status rollup template operates within planning-only mode. It must not:

- Deploy code or change deployment state
- Add indexed output (sitemap, RSS, JSON-LD, newsletter)
- Request search indexing
- Approve indexed release
- Close Phase 5C
- Change any record to `published`
- Require production credentials, DNS settings, or external services

*（内容由AI生成，仅供参考）*
