# PVSize Opportunities Phase 5C Pre-Implementation Long-Run Board

Status: active long-run stage board

Updated: 2026-08-02

## PRE_IMPLEMENTATION_BOARD: STAGE_NAME

`Phase 5C Pre-Implementation Continuous Automation`

## PRE_IMPLEMENTATION_BOARD: MODE_INFRASTRUCTURE_ONLY

This board is infrastructure-only.

It exists so Marvis can continue a long-running Phase 5C pre-implementation control flow without waiting for per-task user copy/paste.

It must not deploy, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, request search indexing, approve indexed release, close Phase 5C, change record publication states, or change Opportunities product surfaces.

## PRE_IMPLEMENTATION_BOARD: STARTING_BASELINE

Start from this accepted baseline:

- Remote main commit: `d899e20 Record opportunities Phase 5C long-run stage acceptance review`
- Phase: `Phase 5C: Publication Pipeline`
- Current product state: noindex-only MVP remains unchanged
- Planning-only long-run stage: accepted historical baseline
- Next-stage direction: `Option B pre-implementation` selected on 2026-08-02

## PRE_IMPLEMENTATION_BOARD: AUTHORITY

The authoritative file remains:

`docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`

If this board conflicts with the status file, the status file wins.

## PRE_IMPLEMENTATION_BOARD: MANDATORY_STARTUP

Before every work cycle, read:

1. `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_LONG_RUN_BOARD.md`
2. `docs/opportunities/PVSIZE_OPPORTUNITIES_MASTER_PLAN.md`
3. `docs/opportunities/PVSIZE_OPPORTUNITIES_RUNBOOK.md`
4. `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
5. `docs/opportunities/PVSIZE_PHASE5B_TO_PHASE5C_PUBLICATION_RELEASE_GATE.md`
6. Latest relevant report in `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`
7. `git status --short --branch`
8. `git log --oneline --decorate -n 12`

Use `Next Single Task` in the status file as the only execution entry.

## PRE_IMPLEMENTATION_BOARD: CONTINUOUS_EXECUTION

Once this stage starts, Marvis should continue the queue below in order without waiting for fresh user instructions between small tasks.

Only stop for:

- Explicit stop conditions in this board
- A blocking verification failure
- A conflict with the status file
- A task that would violate infrastructure-only mode
- A missing credential, account, external approval, or deployment requirement

## PRE_IMPLEMENTATION_BOARD: STAGE_INTENT

This stage exists to build the infrastructure-only bridge between the accepted planning-only stage and any future implementation-ready work.

This stage is successful when:

- Opportunities QA has one canonical local execution entrypoint
- Relevant verifiers are intentionally orchestrated instead of treated as scattered artifacts
- A non-deploying CI gate skeleton exists for future automation
- A deployment dry-run checklist exists for future indexed release execution
- Evidence, reporting, and handoff expectations are explicit
- The current noindex MVP remains unchanged

## PRE_IMPLEMENTATION_BOARD: EXECUTION_CONTRACT

This stage is infrastructure-only, not product-surface work.

For every small task, Marvis must:

- Make one smallest verifiable change
- Record task status directly on this board
- Record changed files
- Record verifier evidence
- Record commit hash after push
- Unlock the next task only after the current task passes verification

Do not skip tasks, batch unrelated changes, or reinterpret later tasks as permission to touch indexed release surfaces early.

## PRE_IMPLEMENTATION_BOARD: TASK_QUEUE

Execute these tasks in order. Each task is still one smallest verifiable change, but the stage continues automatically from one task to the next.

### PI-01 Add aggregate QA unified entrypoint

Objective:

Create one canonical local command path for Opportunities aggregate QA so pre-implementation and future implementation stages no longer rely on ad hoc script discovery.

Expected files:

- `src/package.json`
- `src/tools/verify-opportunities-all.js`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_COMMAND_CONTRACT.md`

### PI-02 Add verifier orchestration matrix

Objective:

Document which verifier belongs to which gate, which command path owns it, and which failures should stop the stage immediately.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION_MATRIX.md`
- `src/tools/verify-opportunities-phase5c-pre-implementation-verifier-orchestration-matrix.js`

### PI-03 Add CI gate skeleton

Objective:

Create a non-deploying CI skeleton that can run the canonical Opportunities QA entrypoint without touching production, indexing, newsletter, or publication state.

Expected files:

- `.github/workflows/opportunities-pre-implementation.yml`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_CI_GATE_SKELETON.md`
- `src/tools/verify-opportunities-phase5c-pre-implementation-ci-gate-skeleton.js`

### PI-04 Add local and CI command contract

Objective:

Freeze the contract between local runs and CI runs so the same canonical commands, exit conditions, and stop conditions are explicit before implementation begins.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_LOCAL_CI_COMMAND_CONTRACT.md`
- `src/tools/verify-opportunities-phase5c-pre-implementation-local-ci-command-contract.js`

### PI-05 Add deployment dry-run checklist

Objective:

Create a future deployment dry-run checklist that proves release operators can prepare the indexed-release QA path without deploying or changing product surfaces now.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_DEPLOY_DRY_RUN_CHECKLIST.md`
- `src/tools/verify-opportunities-phase5c-pre-implementation-deploy-dry-run-checklist.js`

### PI-06 Add evidence bundle and reporting contract

Objective:

Define the evidence bundle, report trail, and commit recording contract that future indexed-release execution must follow once implementation begins.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_EVIDENCE_BUNDLE_CONTRACT.md`
- `src/tools/verify-opportunities-phase5c-pre-implementation-evidence-bundle-contract.js`

### PI-07 Add stage handoff for Codex acceptance

Objective:

Prepare the final pre-implementation stage handoff back to Codex for acceptance review of the full infrastructure-only stage.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_STAGE_HANDOFF.md`
- `src/tools/verify-opportunities-phase5c-pre-implementation-stage-handoff.js`

After PI-07:

Stop automatic execution and request Codex stage acceptance review.

## PRE_IMPLEMENTATION_BOARD: PER_TASK_PATTERN

Each small task should usually add:

- One infrastructure or control-plane document in `docs/opportunities/`
- One verifier in `src/tools/` when the artifact benefits from repeatable checks
- One status update in `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
- One report in `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`

Only add aggregate QA wiring when the new artifact is meaningful to keep in the durable gate.

## PRE_IMPLEMENTATION_BOARD: REQUIRED_VERIFICATION

For every small task, run at minimum:

- New verifier self-test if one was added
- New verifier real check if one was added
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

If aggregate QA fails only because the temporary local static server cannot start under sandbox restrictions, rerun with the needed local-server permission instead of skipping.

## PRE_IMPLEMENTATION_BOARD: COMMIT_PROTOCOL

After each small task passes verification:

1. Commit implementation work.
2. Update `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`.
3. Add the report.
4. Push to `origin main` if credentials are available.
5. Confirm `git status --short --branch` is clean and synced.

## PRE_IMPLEMENTATION_BOARD: STOP_CONDITIONS

Stop and ask for Codex or owner review if any of these occur:

- A task would deploy code
- A task would add indexed output
- A task would add sitemap/RSS/JSON-LD/newsletter output
- A task would request indexing
- A task would mark indexed release complete
- A task would close Phase 5C
- A task would change any current record to `published`
- A task would change Opportunities listing/detail product surfaces
- A task would require CI secrets, production credentials, or external account setup
- Aggregate QA fails for a reason other than temporary local static-server permission
- Git shows unrelated dirty user changes
- Status file conflicts with this board

## PRE_IMPLEMENTATION_BOARD: STAGE_EXIT_GATES

This stage is complete only when all of the following are true:

- Aggregate QA can run from one canonical local entrypoint
- Relevant verifiers are mapped to explicit gate ownership
- A non-deploying CI gate skeleton exists
- Local and CI command contracts are documented
- A non-deploying deployment dry-run checklist exists
- Evidence bundle and reporting contract are documented
- Codex handoff exists for this stage
- No deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, published record transition, or product-surface change leaked into the stage

## PRE_IMPLEMENTATION_BOARD: FUTURE_STAGE_HANDOFF

This board prepares for a future implementation-ready or execution-ready decision, but does not make that decision.

When this stage ends, Codex should decide whether the next stage is:

- Additional pre-implementation tightening
- Implementation-ready work
- Indexed-release execution preparation

## PRE_IMPLEMENTATION_BOARD: SHORT_PROMPT

Use this prompt in Marvis when its input box is limited:

```text
Repo: /Users/xiaotudou/Documents/Codex/2026-07-13/p/pvsize-full. First read docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PRE_IMPLEMENTATION_LONG_RUN_BOARD.md, then read the mandatory startup files listed there. Obey docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md as authority. Use Next Single Task as the only entry point. Continue the PI-01 through PI-07 queue automatically one small verifiable task at a time without asking the user for each next task. This stage is infrastructure-only. Do not deploy, add indexed output, add sitemap/RSS, add JSON-LD, add newsletter form/output, request indexing, approve indexed release, close Phase 5C, change record publication states, or change Opportunities product surfaces. After each task run the required verification, update status and report, commit, push main, and continue until a stop condition or the final handoff task.
```
