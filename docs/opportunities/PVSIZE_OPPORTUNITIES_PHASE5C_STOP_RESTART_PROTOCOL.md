---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: c4e42f760229254c82de8cc2300dc5c9_5319258f8e4711f196d8525400f8a581
    ReservedCode1: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: c4e42f760229254c82de8cc2300dc5c9_5319258f8e4711f196d8525400f8a581
    ReservedCode2: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
---

# PVSize Opportunities Phase 5C Stop and Restart Protocol

Defines exactly how Marvis should stop, save state, resume, and hand back control when a planning-only long-run stage is interrupted or blocked.

Updated: 2026-08-02 16:50 CST

## Protocol Purpose

The Phase 5C planning-only long-run board runs 10 sequential tasks (L01-L10). Interruption can happen mid-task or between tasks. This protocol ensures:

1. The current task state is never lost
2. Restart is deterministic — the same task resumes from the same checkpoint
3. Handoff to Codex or another Marvis session is unambiguous
4. The authoritative state file is always the single source of truth for "what to do next"

## Stop Conditions

Marvis must stop execution when any of these occur.

### Stop Triggers from Long-Run Board

From `LONG_RUN_BOARD: STOP_CONDITIONS`:

| # | Stop Trigger | Detection |
|---|---|---|
| S1 | A task would deploy code | Any `git push` beyond docs/ or src/tools/ |
| S2 | A task would add indexed output | Any sitemap, RSS, JSON-LD, or newsletter creation |
| S3 | A task would request indexing | Any search console, sitemap submission, or index-now call |
| S4 | A task would mark indexed release complete | Any status change to "indexed release approved" |
| S5 | A task would close Phase 5C | Any status change to "Phase 5C closed" |
| S6 | A task would change any record to `published` | Any `review_status` change in opportunities.json |
| S7 | Aggregate QA fails for non-server reason | `verify-opportunities-all.js` exit code != 0 with no static-server error |
| S8 | Git shows unrelated dirty user changes | `git status` shows modified files outside docs/opportunities/ or src/tools/ |
| S9 | Status file conflicts with this board | Mismatch between STATUS.md Next Single Task and board task queue |
| S10 | External account/credential/DNS required | Any prompt requiring production credentials |

### Additional Stop Triggers

| # | Stop Trigger | Detection |
|---|---|---|
| S11 | Verifier self-test fails | `--self-test` exit code != 0 |
| S12 | Current task document already exists and is complete | Document exists with all required sections |
| S13 | User or Codex explicitly requests stop | Direct instruction |
| S14 | Blocked-run exception (see Blocked-Run Exception Playbook) | Matching blocked-run pattern |

## State to Save on Stop

When stopping, Marvis must ensure the following state is persisted before handing back control:

### Always Persisted (via git commit)

| State Item | Location | How to Save |
|---|---|---|
| Current task number | `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md` → `Next Single Task` | Must explicitly write the next task before stopping |
| Last completed task | `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md` → `Completed` section | Add a line for the completed task |
| Current commit hash | `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md` → `Last Commit` | Write the most recent commit hash |
| Report for completed task | `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/` | Write before stopping |
| All new/modified files | git working tree | `git add` explicit file list + `git commit` + `git push origin main` |

### Stop-Only Additional State

When stopping mid-task (before task completion), Marvis must also save:

| State Item | Location | How to Save |
|---|---|---|
| Partial work product | `docs/opportunities/` (if document exists) | Commit as-is with `[WIP]` prefix in commit message |
| Failure reason | Stop handoff message | Include in the handoff text |
| What was already verified | Stop handoff message | Include pass/fail counts |
| Exact stop point within task | Stop handoff message | e.g., "document created, verifier not yet created" |

## Restart Protocol

When Marvis resumes after a stop (either due to new user instruction or session restart), follow this exact sequence.

### Step 1: Read Mandatory Startup Files

From `LONG_RUN_BOARD: MANDATORY_STARTUP`:

```
1. docs/opportunities/PVSIZE_OPPORTUNITIES_MASTER_PLAN.md
2. docs/opportunities/PVSIZE_OPPORTUNITIES_RUNBOOK.md
3. docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md  ← Authority
4. docs/opportunities/PVSIZE_PHASE5B_TO_PHASE5C_PUBLICATION_RELEASE_GATE.md
5. Latest report in reports/
6. git status --short --branch
7. git log --oneline --decorate -n 12
```

### Step 2: Determine Restart Entry Point

The restart entry point is determined by `STATUS.md → Next Single Task`. This is the single source of truth.

If Next Single Task says "Continue ... from L04", start L04. Do not skip to L05 unless STATUS.md explicitly says so.

### Step 3: Check for Partial Work

Before starting, check if the current task's expected files already exist:

- If document exists but verifier does not → resume at verifier creation
- If document exists with all sections → verify completeness, then move on
- If neither exists → start fresh
- If both exist and verifier passes → task was likely completed; verify and move on

### Step 4: Execute the Task

Execute the current task from the long-run board. Follow `LONG_RUN_BOARD: PER_TASK_PATTERN`:
- One planning document
- One verifier (when beneficial)
- Status update
- Report

### Step 5: Verify and Commit

Run `LONG_RUN_BOARD: REQUIRED_VERIFICATION`:
- New verifier self-test
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

Then `LONG_RUN_BOARD: COMMIT_PROTOCOL`:
- Commit with explicit file list
- Update STATUS.md
- Write report
- Push to origin main
- Confirm clean state

## Handoff Format

When Marvis stops and hands back control, the handoff message must follow this exact structure.

### To User / Codex (after clean task completion)

```text
## Phase 5C L0X Completed

**Task**: L0X <task name>
**Commit**: <hash> Phase 5C L0X: <message>
**Verifier**: <path> — <pass/total> PASS
**Aggregate QA**: <N> steps PASS
**Status**: STATUS.md updated, Next: L<X+1>

**Files**:
- <doc path>
- <verifier path>
- STATUS.md (updated)
- <report path>

**Guardrails**: planning-only, no deploy, no indexed output, no published records.
```

### To User / Codex (after blocked stop)

```text
## Phase 5C L0X Blocked

**Task**: L0X <task name>
**Blocker**: <description of what blocked>
**Stop Trigger**: <S1-S14 from Stop Conditions table>
**Partial Work**: <what was done before stop>
**Commit**: <hash> [WIP] Phase 5C L0X: <partial message> (if committed)

**To Resume**:
1. Read STATUS.md → Next Single Task will point to L0X
2. Check if <doc path> exists — <yes/no>
3. <specific instruction for resuming>

**Guardrails**: planning-only, no deploy, no indexed output, no published records.
```

### To Another Marvis Session

```text
[STAGE_CHECKPOINT]
repo=/Users/xiaotudou/Documents/Codex/2026-07-13/p/pvsize-full
stage=Phase 5C planning-only long-run
current_task=L0X
last_commit=<hash>
status_file=docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md
board=docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md
partial_work=<description or "none">
resume_from=<specific action>
[/STAGE_CHECKPOINT]
```

## Example: Mid-Task Stop and Restart

### Scenario

L04 verifier is being created but `--self-test` fails. Marvis stops per S11.

### State at Stop

- Document: `PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md` — exists, committed
- Verifier: `verify-opportunities-phase5c-stop-restart-protocol.js` — exists but self-test fails
- STATUS.md: Next Single Task still points to L04
- Last Commit: `abc1234 [WIP] Phase 5C L04: stop/restart protocol document only`

### Restart

1. Read STATUS.md — Next Single Task says L04
2. Check files: document exists, verifier exists but incomplete
3. Resume at verifier fix — investigate self-test failure, fix, re-run
4. On pass → full verification → commit → STATUS.md update → push

## Guardrails (Planning-Only)

This protocol operates within planning-only mode. It must not:

- Deploy code or change deployment state
- Add indexed output (sitemap, RSS, JSON-LD, newsletter)
- Request search indexing
- Approve indexed release
- Close Phase 5C
- Change any record to `published`
- Require production credentials, DNS settings, or external services

*（内容由AI生成，仅供参考）*
