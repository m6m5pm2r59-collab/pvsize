# PVSize Opportunities Phase 5C Marvis Executor Packet

Status: historical T01-T07 executor packet

Updated: 2026-08-02

## 0. Mission

You are Marvis, the execution agent taking over PVSize Opportunities Phase 5C work.

Your job in this historical packet was to continue the Opportunities channel from the current noindex-only MVP state toward indexed-release readiness by executing one small verifiable task at a time from this packet and from the authoritative status file.

Codex will later act as stage reviewer and acceptance checker, not as the per-task messenger.

This packet is now complete as historical baseline only.

For the active long-running planning-only stage, use:

`docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md`

## 1. Repository

Fixed repository path:

`/Users/xiaotudou/Documents/Codex/2026-07-13/p/pvsize-full`

Daily ops report directory:

`/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`

GitHub remote:

`m6m5pm2r59-collab/pvsize`

Target branch:

`main`

## 2. Authority

Do not trust old heartbeat text or external summaries.

The authoritative status file is:

`docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`

Current phase:

`Phase 5C: Publication Pipeline`

Known handoff baseline:

`e0f9b29 Record opportunities production QA post release watch commit`

Before each work cycle, re-read the authoritative files and git state. If this packet conflicts with `PVSIZE_OPPORTUNITIES_STATUS.md`, the status file wins.

## 3. Mandatory Startup

At the start of every task, read:

1. `docs/opportunities/PVSIZE_OPPORTUNITIES_MASTER_PLAN.md`
2. `docs/opportunities/PVSIZE_OPPORTUNITIES_RUNBOOK.md`
3. `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
4. `docs/opportunities/PVSIZE_PHASE5B_TO_PHASE5C_PUBLICATION_RELEASE_GATE.md`
5. Latest relevant report in `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`
6. `git status --short --branch`
7. `git log --oneline --decorate -n 12`

Use `Next Single Task` from the status file as the only task entry point.

## 4. Current Product State

The Opportunities channel is still a noindex-only MVP.

Already done:

- `/opportunities/` listing exists.
- Five opportunity detail pages exist.
- All current Opportunities pages are noindex-only.
- Local and production noindex MVP verification have previously passed.
- Multiple production QA planning gates and verifiers have been added.
- Aggregate QA is available at `node src/tools/verify-opportunities-all.js`.

Not done:

- No indexed release.
- No sitemap/RSS Opportunities output.
- No JSON-LD Opportunities structured data output.
- No newsletter form/output.
- No search indexing request.
- No Phase 5C closure.
- No record has been moved to `review_status: published`.

## 5. Global Guardrails

These rules apply to every task:

- Do not deploy.
- Do not add indexed output.
- Do not add Opportunities URLs to sitemap.
- Do not add RSS/feed output.
- Do not add JSON-LD output.
- Do not add newsletter form/output.
- Do not request search indexing.
- Do not approve indexed release.
- Do not mark indexed release complete.
- Do not mark Phase 5C Closed.
- Do not change opportunity record publication states.
- Do not change the five current records to `published`.
- Do not invent opportunity data.
- Do not add paid/login/account features.
- Do not add external crawling/import automation.
- Do not submit real forms.

The current MVP must remain noindex-only unless a future explicit indexed-release implementation packet says otherwise.

## 6. Long Stage Task

Stage name:

`Phase 5C Indexed Release QA Planning Closure`

Goal:

Complete the remaining indexed-release QA planning gates so the future indexed Opportunities release has clear rules for search indexing hold, published-record transition readiness, indexed output activation, newsletter activation, final evidence, and stage acceptance.

This stage is planning-only. It must not perform the indexed release.

## 7. Per-Task Execution Pattern

Each small task should usually add:

- One planning document in `docs/opportunities/`
- One verifier in `src/tools/`
- One aggregate QA entry in `src/tools/verify-opportunities-all.js`
- One existence check in `src/tools/verify-opportunities-page.js`
- One status update in `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
- One report in `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`

Each verifier must confirm:

- Required document markers exist.
- Current phase remains `Phase 5C: Publication Pipeline`.
- Status does not mark Phase 5C Closed.
- Status does not mark indexed release complete.
- All records remain below `published`.
- Sitemap does not include Opportunities URLs.
- Listing/detail pages remain `noindex,follow`.
- No JSON-LD was added.
- No RSS alternate was added.
- No newsletter form/email input/API output was added.
- Unsafe self-test fixtures fail for non-published record indexing, JSON-LD, sitemap, and newsletter output.

## 8. Required Verification

Run at minimum:

- New verifier self-test.
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

If aggregate QA fails only because the local HTTP verifier cannot start a temporary static server under sandbox restrictions, rerun aggregate QA with elevated/local-server permission if available. Do not skip it.

## 9. Commit And Push Protocol

After each small task passes verification:

1. Commit the implementation: `Add opportunities <task name>`
2. Update `PVSIZE_OPPORTUNITIES_STATUS.md` and the report with that commit hash.
3. Commit the record update: `Record opportunities <task name> commit`
4. Push to `origin main` if credentials are available.
5. Confirm `git status --short --branch` is clean and synced.

If push fails from a transient network error, retry up to three times. If still blocked, leave commits local, record the failure, and stop.

## 10. Task Queue

Execute these tasks in order. After each task, update `Next Single Task` to the next task in this queue.

### T01 Search Indexing Request Hold Checklist

Objective:

Add indexed-release production QA search indexing request hold checklist for Opportunities.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_SEARCH_INDEXING_REQUEST_HOLD_CHECKLIST.md`
- `src/tools/verify-opportunities-production-qa-search-indexing-request-hold-checklist.js`

Required markers:

- `SEARCH_INDEXING_HOLD: REQUIRED_BEFORE_REQUEST`
- `SEARCH_INDEXING_HOLD: REQUIRED_FIELDS`
- `SEARCH_INDEXING_HOLD: BLOCKED_CONDITIONS`
- `SEARCH_INDEXING_HOLD: RELEASE_CONDITIONS`
- `SEARCH_INDEXING_HOLD: EVIDENCE_REQUIREMENTS`
- `SEARCH_INDEXING_HOLD: CURRENT_NO_REQUEST`

Next task: T02.

### T02 Published Record Transition Preflight Matrix

Objective:

Add indexed-release published-record transition preflight matrix for Opportunities.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PUBLISHED_RECORD_PREFLIGHT_MATRIX.md`
- `src/tools/verify-opportunities-published-record-preflight-matrix.js`

Required content:

- Source evidence requirements.
- Record quality requirements.
- Review note requirements.
- Deadline/status freshness checks.
- Published-only indexed output dependency.
- Stop conditions.
- Explicit current no-transition rule.

Next task: T03.

### T03 Indexed Output Activation Preflight Matrix

Objective:

Add indexed output activation preflight matrix for sitemap, RSS, and JSON-LD.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_OUTPUT_ACTIVATION_PREFLIGHT_MATRIX.md`
- `src/tools/verify-opportunities-indexed-output-activation-preflight-matrix.js`

Required content:

- Sitemap activation preflight.
- RSS activation preflight.
- JSON-LD activation preflight.
- Published-record dependency.
- Production QA dependency.
- Rollback/noindex fallback dependency.
- Current no-output rule.

Next task: T04.

### T04 Newsletter Activation Hold Checklist

Objective:

Add indexed-release newsletter activation hold checklist for Opportunities.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_NEWSLETTER_ACTIVATION_HOLD_CHECKLIST.md`
- `src/tools/verify-opportunities-newsletter-activation-hold-checklist.js`

Required content:

- Consent requirement.
- Analytics event requirement.
- Published-record-only content rule.
- Form/output/API hold conditions.
- Activation release conditions.
- Current no-newsletter-output rule.

Next task: T05.

### T05 Production QA Artifact Index Refresh

Objective:

Refresh the production QA artifact index so it includes all planning docs, verifiers, and report trail added after the original artifact index.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_ARTIFACT_INDEX.md`
- `src/tools/verify-opportunities-production-qa-artifact-index.js`

Required content:

- Run manifest.
- Evidence bundle.
- Signoff checklist.
- Decision log template.
- Go/no-go criteria.
- Release notes template.
- Monitoring handoff checklist.
- Post-release watch checklist.
- Search indexing request hold checklist.
- Published record preflight matrix.
- Indexed output activation preflight matrix.
- Newsletter activation hold checklist.
- Matching reports.

Next task: T06.

### T06 Phase 5C Indexed Release Planning Closure Summary

Objective:

Add a planning closure summary for indexed-release readiness planning.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_RELEASE_PLANNING_SUMMARY.md`
- `src/tools/verify-opportunities-phase5c-indexed-release-planning-summary.js`

Required content:

- Completed planning gate list.
- Remaining implementation gates.
- Explicit no deployment.
- Explicit no indexed output.
- Explicit no newsletter output.
- Explicit no indexing request.
- Explicit no published-record transition.
- Explicit Phase 5C remains open.
- Next stage acceptance request.

Next task: T07.

### T07 Final Planning Aggregate QA And Acceptance Handoff

Objective:

Prepare final Marvis handoff for Codex stage acceptance.

Expected files:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_MARVIS_HANDOFF.md`
- Optional verifier if useful: `src/tools/verify-opportunities-phase5c-marvis-handoff.js`

Required content:

- Current phase.
- Last commit.
- Full planning artifact list.
- Full verifier list.
- Report list.
- Commands run.
- Known risks.
- Explicit non-approvals.
- Suggested acceptance command list.
- Next single task: `Codex stage acceptance review for Phase 5C indexed-release QA planning. Do not deploy, add indexed output, add newsletter form/output, request indexing, mark Phase 5C Closed, approve indexed release, or change record publication states during review.`

After T07:

Stop automatic execution and request Codex acceptance review.

## 11. Report Naming

Use this pattern:

`PVSize_Opportunities_Phase5C_<ShortTaskName>_YYYYMMDD.md`

Examples:

- `PVSize_Opportunities_Phase5C_SearchIndexingRequestHold_20260802.md`
- `PVSize_Opportunities_Phase5C_PublishedRecordPreflightMatrix_20260802.md`
- `PVSize_Opportunities_Phase5C_IndexedOutputActivationPreflight_20260802.md`

## 12. Status File Update Rules

Every task must update:

`docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`

Required updates:

- `Updated:` timestamp.
- Add one bullet under `Completed`.
- Set `Last Commit` to `Pending this run.` before first commit.
- Add verification bullets under `Last Verification`.
- Update `Next Single Task`.
- After feature commit, replace `Pending this run.` with feature commit hash and message.
- Record commit should only update the Last Commit reference.

Never set:

- `Phase 5C Closed`
- `Status: indexed release complete`
- Any wording that implies indexed release approval.

## 13. Aggregate QA Update Rules

Every new verifier must be added to:

`src/tools/verify-opportunities-all.js`

Place it near the other production QA planning verifiers, before page verification.

Every new verifier must also be checked for existence in:

`src/tools/verify-opportunities-page.js`

## 14. Done Criteria For The Long Stage

The long stage is done only when:

- T01 through T07 are complete.
- Each task has a report.
- Each task has a verifier or justified artifact check.
- Aggregate QA passes.
- `git diff --check` passes.
- Remote `origin/main` contains all commits.
- `PVSIZE_OPPORTUNITIES_STATUS.md` says Phase 5C remains `Publication Pipeline`.
- `Next Single Task` requests Codex stage acceptance review.
- No indexed release action has been taken.

## 15. Stop Conditions

Stop and ask for owner or Codex review if any of these occur:

- A task appears to require deployment.
- A task appears to require indexing request.
- A task appears to require changing records to `published`.
- A task appears to require adding sitemap/RSS/JSON-LD/newsletter output.
- Aggregate QA fails for a reason other than local static server sandbox permission.
- Git status shows unrelated dirty user changes.
- Git push fails after three retries.
- Status file conflicts with this packet.
- A real production credential, DNS setting, analytics account, search console account, or external service account is needed.

## 16. Short Prompt For Marvis

Use this prompt in Marvis if its input box is limited:

```text
You are taking over PVSize Opportunities Phase 5C execution. Repo: /Users/xiaotudou/Documents/Codex/2026-07-13/p/pvsize-full. First read docs/opportunities/PVSIZE_OPPORTUNITIES_MARVIS_EXECUTOR_PACKET.md and obey it. Then read the mandatory startup files listed there, especially docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md. Use Next Single Task as the only task entry. Current work is noindex-only planning. Do not deploy, add indexed output, add sitemap/RSS, add JSON-LD, add newsletter form/output, request indexing, approve indexed release, mark Phase 5C Closed, or change record publication states. Execute T01-T07 one small verifiable task at a time, update status/report, run verifier self-test + node src/tools/verify-opportunities-all.js + git diff --check, commit, push main, and stop after T07 for Codex acceptance review.
```

## 17. Codex Acceptance Reviewer Instructions

When Marvis finishes T07, Codex should run acceptance review:

1. Read mandatory startup files.
2. Read all reports from this long stage.
3. Check `git status --short --branch`.
4. Check recent commits.
5. Run all new verifiers or aggregate QA.
6. Run `git diff --check`.
7. Confirm no records are `published`.
8. Confirm no Opportunities URLs are in sitemap.
9. Confirm listing/detail pages remain `noindex,follow`.
10. Confirm no JSON-LD, RSS alternate, newsletter form, newsletter API, or indexing request was added.
11. Return PASS/FAIL with repair tasks.

Acceptance review must not deploy, request indexing, approve indexed release, close Phase 5C, or change record states.
