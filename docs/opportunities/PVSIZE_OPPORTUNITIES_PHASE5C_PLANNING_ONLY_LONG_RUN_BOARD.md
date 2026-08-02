# PVSize Opportunities Phase 5C Planning-Only Long-Run Board

Status: active long-run stage board

Updated: 2026-08-02

## LONG_RUN_BOARD: STAGE_NAME

`Phase 5C Planning-Only Continuous Automation`

## LONG_RUN_BOARD: MODE_PLANNING_ONLY

This board is planning-only.

It exists so Marvis can continue a long-running Phase 5C control flow without waiting for per-task user copy/paste.

It must not deploy, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, request search indexing, approve indexed release, close Phase 5C, or change record publication states.

## LONG_RUN_BOARD: STARTING_BASELINE

Start from this accepted baseline:

- Remote main commit: `b94e8ca Phase 5C: Codex acceptance review + AIGC标记 reconciliation`
- Phase: `Phase 5C: Publication Pipeline`
- Current product state: noindex-only MVP remains unchanged
- Prior executor packet `docs/opportunities/PVSIZE_OPPORTUNITIES_MARVIS_EXECUTOR_PACKET.md` is now historical baseline only

## LONG_RUN_BOARD: AUTHORITY

The authoritative file remains:

`docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`

If this board conflicts with the status file, the status file wins.

## LONG_RUN_BOARD: MANDATORY_STARTUP

Before every work cycle, read:

1. `docs/opportunities/PVSIZE_OPPORTUNITIES_MASTER_PLAN.md`
2. `docs/opportunities/PVSIZE_OPPORTUNITIES_RUNBOOK.md`
3. `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
4. `docs/opportunities/PVSIZE_PHASE5B_TO_PHASE5C_PUBLICATION_RELEASE_GATE.md`
5. Latest relevant report in `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`
6. `git status --short --branch`
7. `git log --oneline --decorate -n 12`

Use `Next Single Task` in the status file as the only execution entry.

## LONG_RUN_BOARD: CONTINUOUS_EXECUTION

Once this stage starts, Marvis should continue the queue below in order without waiting for fresh user instructions between small tasks.

Only stop for:

- Explicit stop conditions in this board
- A blocking verification failure
- A conflict with the status file
- A task that would violate planning-only mode
- A missing credential, account, external approval, or deployment requirement

## LONG_RUN_BOARD: STAGE_GOAL

Build the long-running planning control plane for the future indexed Opportunities release.

This stage is successful when:

- Marvis has a durable total board for continuous execution
- The report trail and acceptance trail are easy for Codex to review at stage boundaries
- Planning-only boundaries are explicit
- Future implementation-stage entry conditions are documented
- The current noindex MVP remains unchanged

## LONG_RUN_BOARD: TASK_QUEUE

Execute these tasks in order. Each task is still one smallest verifiable change, but the stage continues automatically from one task to the next.

### L01 Promote the long-run board

Objective:

Create the new planning-only long-run board, mark the old T01-T07 executor packet as historical baseline, and switch the authoritative entry point to this board.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md`
- `src/tools/verify-opportunities-phase5c-planning-only-long-run-board.js`

### L02 Reconcile the report trail

Objective:

Create a planning-only report trail reconciliation document so stage reports, commits, and acceptance checkpoints are easy to audit later.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md`

### L03 Build the acceptance commit ledger

Objective:

Create a single ledger that maps planning artifacts, verifier scripts, reports, and commit hashes for stage-level review.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_ACCEPTANCE_COMMIT_LEDGER.md`

### L04 Add stop and restart protocol

Objective:

Define exactly how Marvis should stop, resume, and hand back control when a planning-only stage is interrupted or blocked.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md`

### L05 Add blocked-run exception playbook

Objective:

Document what counts as a blocker, what evidence to record, and when to stop instead of guessing.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_BLOCKED_RUN_EXCEPTION_PLAYBOOK.md`

### L06 Add status rollup template

Objective:

Create a compact stage rollup template so every later run records goal, progress, blockers, verification, and next queue item in a uniform way.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP_TEMPLATE.md`

### L07 Add planning-only boundary contract

Objective:

Freeze the contract between planning-only work and future pre-implementation or implementation work so Marvis does not cross the line accidentally.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md`

### L08 Add future indexed implementation dependency map

Objective:

Document the dependency map for the future indexed-release implementation stage without performing any implementation.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md`

### L09 Add future implementation-stage packet skeleton

Objective:

Prepare the shell of a future implementation-stage executor packet so the next stage can start from a stable structure when approved.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_IMPLEMENTATION_STAGE_PACKET_SKELETON.md`

### L10 Add stage handoff for Codex review

Objective:

Prepare the final planning-only long-run stage handoff back to Codex for acceptance review of this entire board-driven stage.

Expected file:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_HANDOFF.md`

After L10:

Stop automatic execution and request Codex stage acceptance review.

## LONG_RUN_BOARD: PER_TASK_PATTERN

Each small task should usually add:

- One planning document in `docs/opportunities/`
- One verifier in `src/tools/` when the artifact benefits from repeatable checks
- One status update in `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
- One report in `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`

Only add aggregate QA wiring when the new artifact is meaningful to keep in the durable gate.

## LONG_RUN_BOARD: REQUIRED_VERIFICATION

For every small task, run at minimum:

- New verifier self-test if one was added
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

If aggregate QA fails only because the temporary local static server cannot start under sandbox restrictions, rerun with the needed local-server permission instead of skipping.

## LONG_RUN_BOARD: COMMIT_PROTOCOL

After each small task passes verification:

1. Commit implementation work.
2. Update `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`.
3. Add the report.
4. Push to `origin main` if credentials are available.
5. Confirm `git status --short --branch` is clean and synced.

## LONG_RUN_BOARD: STOP_CONDITIONS

Stop and ask for Codex or owner review if any of these occur:

- A task would deploy code
- A task would add indexed output
- A task would add sitemap/RSS/JSON-LD/newsletter output
- A task would request indexing
- A task would mark indexed release complete
- A task would close Phase 5C
- A task would change any current record to `published`
- Aggregate QA fails for a reason other than temporary local static-server permission
- Git shows unrelated dirty user changes
- Status file conflicts with this board
- An external account, credential, DNS setting, search console property, or production service is required

## LONG_RUN_BOARD: FUTURE_STAGE_HANDOFF

This board prepares for a future stage decision, but does not make that decision.

When this stage ends, Codex should decide whether the next stage remains planning-only, moves to pre-implementation, or moves to implementation-ready work.

## LONG_RUN_BOARD: SHORT_PROMPT

Use this prompt in Marvis when its input box is limited:

```text
Repo: /Users/xiaotudou/Documents/Codex/2026-07-13/p/pvsize-full. First read docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md, then read the mandatory startup files listed there. Obey docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md as authority. Use Next Single Task as the only entry point. Continue the L01-L10 queue automatically one small verifiable task at a time without asking the user for each next task. This stage is planning-only. Do not deploy, add indexed output, add sitemap/RSS, add JSON-LD, add newsletter form/output, request indexing, approve indexed release, close Phase 5C, or change record publication states. After each task run the required verification, update status and report, commit, push main, and continue until a stop condition or the final handoff task.
```
