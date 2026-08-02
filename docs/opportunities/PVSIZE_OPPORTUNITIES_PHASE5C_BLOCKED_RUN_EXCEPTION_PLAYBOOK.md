---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 152197a3d7e9375bf12095386579fe5d_4dd32ffa8e4a11f196d8525400f8a581
    ReservedCode1: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 152197a3d7e9375bf12095386579fe5d_4dd32ffa8e4a11f196d8525400f8a581
    ReservedCode2: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
---

# PVSize Opportunities Phase 5C Blocked-Run Exception Playbook

Defines what counts as a blocker, what evidence to record, and when to stop instead of guessing — for the Phase 5C planning-only long-run board (`PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md`).

Updated: 2026-08-02 17:10 CST

## Playbook Purpose

Not every verification failure or unexpected result is a blocker. Some failures are transient, some are environment-specific, and some indicate a genuine blockage that requires human review. This playbook eliminates guessing: for each category of problem, it defines whether it is a blocker, what evidence is required, and what action to take.

This playbook follows the long-run board's `STOP_CONDITIONS` and `MANDATORY_STARTUP` protocol, and integrates with the stop and restart protocol (`PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md`).

## Blocker Definition

A **blocker** is any condition that:

1. Cannot be resolved by Marvis without changing planning-only boundaries
2. Would produce an incorrect or misleading artifact if ignored
3. Requires external information, credentials, or human decision
4. Indicates a systemic issue (not a one-off file problem)
5. Contradicts the authoritative status file

A condition is **not a blocker** if Marvis can resolve it by:

- Retrying a command that failed due to a transient issue
- Switching to an equivalent valid path or parameter
- Reading additional context from existing repository files
- Fixing a verifier mismatch caused by a known document format difference

## Blocker Categories

### B1: Verification Failure (Non-Transient)

**Blocking**: YES

**Definition**: A verifier or aggregate QA step fails for a reason that is not a known transient condition (see B7).

**When it blocks**: Verifier self-test failures, aggregate QA step failures, `git diff --check` failures that are not caused by the current task's deliberate changes.

**Evidence required**:
- Full error output from the failing step
- Which verifier / step name
- The expected vs actual result
- Whether the failure is in self-test or real check mode

**Action**: Stop execution. Record evidence. Do not attempt to fix unless the fix is within planning-only boundaries and is clearly correct.

### B2: Planning-Only Boundary Violation Risk

**Blocking**: YES

**Definition**: The current or next task could potentially cross a planning-only boundary (deploy, indexed output, sitemap/RSS/JSON-LD/newsletter, indexing request, indexed release approval, Phase 5C closure, published record transition).

**When it blocks**: If Marvis cannot determine with certainty that a planned action stays within planning-only mode.

**Evidence required**:
- Which specific boundary is at risk
- Which task step triggered the concern
- What the safe alternative would be

**Action**: Stop immediately. Do not proceed with the risky action. Record the boundary concern.

### B3: Status File Conflict

**Blocking**: YES

**Definition**: `PVSIZE_OPPORTUNITIES_STATUS.md` content contradicts the long-run board or previous commits.

**When it blocks**: Next Single Task points to a different task than expected; Last Commit is wrong; a completed item is missing; a guardrail assertion fails.

**Evidence required**:
- The conflicting line(s) from STATUS.md
- The expected state from the board or previous commit
- The nature of the conflict

**Action**: Stop. Do not attempt to "fix" the conflict without human direction.

### B4: Missing or Corrupted Required File

**Blocking**: YES

**Definition**: A file required by MANDATORY_STARTUP or a prior task is missing, empty, or corrupted.

**When it blocks**: Required startup file missing; a prior artifact document missing; a verifier script that should exist per the acceptance commit ledger is absent.

**Evidence required**:
- Which file is missing or corrupted
- Expected path
- Whether it was expected from a prior completed task

**Action**: Stop. The state is inconsistent and needs review.

### B5: Git State Anomaly

**Blocking**: YES

**Definition**: Git working tree has unexpected dirty files, detached HEAD, or merge conflicts.

**When it blocks**: `git status` shows modified files that are not part of the current task; `git log` shows unexpected divergence from origin.

**Evidence required**:
- Full `git status --short --branch` output
- `git diff --stat` if there are unexpected changes
- `git log --oneline --all -n 20` for divergence detection

**Action**: Stop. Do not attempt to commit or resolve merge conflicts without direction.

### B6: External Dependency Required

**Blocking**: YES

**Definition**: The task requires a credential, account, API key, DNS setting, search console property, or production service.

**When it blocks**: Any task that needs authentication, external API calls, production deployment, or service configuration.

**Evidence required**:
- Which dependency is required
- Which task step triggers it
- What the dependency gates

**Action**: Stop. Record the dependency. Do not attempt to simulate or mock it.

### B7: Transient Failure (Not a Blocker)

**Blocking**: NO

**Definition**: A failure that is temporary and can be resolved by retry or by Marvis within planning-only boundaries.

**Examples**:
- Temporary static server fails to start (aggregate QA can be rerun with appropriate permissions)
- Network timeout on a git fetch (not required for planning-only work)
- A file system race condition (retry the read)
- `npm` or `node` not in PATH but fixable with `export PATH="/opt/homebrew/bin:$PATH"`

**Evidence required if recurring**: 
- How many retries failed
- The consistent error message
- Why it is still considered transient

**Action**: Retry up to 2 more times. If it still fails after 3 total attempts, escalate to B1.

### B8: Ambiguous Task Interpretation

**Blocking**: YES (until resolved)

**Definition**: A task description has multiple reasonable interpretations and the correct path cannot be determined from existing repository context.

**When it blocks**: Two or more valid approaches exist, and choosing the wrong one would produce a materially different artifact.

**Evidence required**:
- The ambiguous task description (verbatim)
- The alternative interpretations
- Why repository context does not resolve it

**Action**: Stop. Present the ambiguity for human resolution. Do not guess.

### B9: Aggregate QA Regression

**Blocking**: YES

**Definition**: Aggregate QA passes fewer steps than the last recorded run, or a previously passing step now fails.

**When it blocks**: A step that was reported PASS in the prior verification now reports FAIL, and the task did not intentionally change that path.

**Evidence required**:
- Which step regressed
- The prior pass count vs current pass count
- The failure output
- What changed between runs

**Action**: Stop. A regression in previously passing verification indicates an unintended side effect.

### B10: File Already Exists (Task Collision)

**Blocking**: NO (with verification)

**Definition**: The expected output file for the current task already exists on disk.

**When it does not block**: The file exists but was created by a prior execution of the same task and is complete.

**When it blocks**: The file exists with incomplete content, was created by a different process, or conflicts with the task.

**Evidence required to proceed**:
- Verify the file has all required sections
- Verify the file has AIGC frontmatter (if applicable)
- Verify the corresponding verifier exists and passes

**Action**: If the file passes verification, mark the task as already completed and move to next. If incomplete, resume where left off.

## Decision Flowchart

```
Problem detected
    │
    ├─ Is this a transient failure (B7)?
    │   ├─ YES → Retry (max 3 total attempts) → Still failing? → Escalate to B1
    │   └─ NO → Continue
    │
    ├─ Is this a planning-only boundary risk (B2)?
    │   └─ YES → STOP immediately. Record which boundary.
    │
    ├─ Is this a status file conflict (B3)?
    │   └─ YES → STOP. Record conflicting lines.
    │
    ├─ Is this a missing required file (B4)?
    │   └─ YES → STOP. Record which file and expected path.
    │
    ├─ Is this a git anomaly (B5)?
    │   └─ YES → STOP. Record git state.
    │
    ├─ Is this an external dependency (B6)?
    │   └─ YES → STOP. Record dependency.
    │
    ├─ Is this ambiguous (B8)?
    │   └─ YES → STOP. Present ambiguity.
    │
    ├─ Is this an aggregate QA regression (B9)?
    │   └─ YES → STOP. Record regression.
    │
    ├─ Is this a duplicate file (B10)?
    │   └─ YES → Verify completeness → Move on or resume
    │
    └─ Must be B1 (verification failure)
        └─ STOP. Record evidence.
```

## Evidence Recording Template

For every blocked run, record the following in the stop handoff:

```text
## Blocked-Run Exception Report

**Blocker Category**: B<1-10>
**Blocking**: YES/NO
**Task**: L0X <task name>
**Detected At**: <step within task>

**What Happened**:
<description of the problem>

**Evidence**:
<full error output, conflicting lines, or state output>

**Why It Blocks**:
<which blocker criteria are met>

**Expected Resolution**:
<what human or Codex decision is needed to unblock>

**Partial Work**:
<what was completed before the block>

**To Resume**:
<specific instructions for resuming after resolution>
```

## When to Stop Instead of Guessing

The fundamental rule: **if Marvis cannot be certain, Marvis must stop.**

| Situation | Stop or Proceed | Rationale |
|---|---|---|
| Verifier failure with clear, fixable cause (e.g., wrong regex for document format) | Proceed — fix and re-verify | Within planning-only, deterministic |
| Verifier failure with unclear cause | Stop (B1) | Guessing wastes context and may produce wrong artifact |
| Network timeout on git push | Proceed — commit locally, note push failure | Planning-only work does not depend on remote sync |
| Git shows unexpected dirty file | Stop (B5) | Could indicate concurrent work or system issue |
| Aggregate QA step count differs from expected | Stop (B9) | Regression detection |
| Document section name slightly different from verifier expectation | Proceed — fix verifier to match document | Known document format variation |
| Prior task's verifier starts failing | Stop (B9) | Regression; unintended side effect |
| Node not found in PATH | Proceed — export PATH and retry | Known environment fix |
| File permission error on write | Stop (B4/B5) | System state issue |
| Two equally valid document structures | Stop (B8) | Ambiguity requires human decision |

## Blocked-Run Handoff Format

When stopping due to a blocker, use the handoff format from the stop and restart protocol (`PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md`, L04), with the addition of the blocked-run exception report:

```text
## Phase 5C L0X Blocked

**Task**: L0X <task name>
**Blocker**: B<1-10> <blocker category name>
**Detected At**: <step>
**Evidence**: <see Blocked-Run Exception Report>

**Commit**: <hash> [WIP] Phase 5C L0X: <partial message> (if committed)

**To Resume**:
1. Read STATUS.md → Next Single Task will point to L0X
2. Check for partial work at <paths>
3. Address blocker per Expected Resolution in exception report
4. Resume from <specific checkpoint>

**Guardrails**: planning-only, no deploy, no indexed output, no published records.
```

## Blocker Resolution Guidance

### For Marvis (Within Planning-Only)

These blockers can be self-resolved:
- B7 (transient): Retry with appropriate parameters
- B10 (duplicate file): Verify and skip

### For Codex or Owner

These blockers require human review:
- B1 (verification failure, unclear cause): Needs root-cause analysis
- B2 (planning-only boundary): Needs decision on whether to proceed
- B3 (status conflict): Needs reconciliation
- B4 (missing file): Needs investigation of why a prior completed artifact is missing
- B5 (git anomaly): Needs investigation of concurrent changes
- B6 (external dependency): Needs credentials or service setup
- B8 (ambiguity): Needs task interpretation decision
- B9 (regression): Needs investigation of side effects

### Resolution After Unblock

After the blocker is resolved (either by Marvis or by Codex), resume per the stop and restart protocol (`PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md`, L04):

1. Read STATUS.md
2. Check for partial work
3. Pick up from the recorded checkpoint
4. Proceed with verification and commit

## Guardrails (Planning-Only)

This playbook operates within planning-only mode. It must not:

- Deploy code or change deployment state
- Add indexed output (sitemap, RSS, JSON-LD, newsletter)
- Request search indexing
- Approve indexed release
- Close Phase 5C
- Change any record to `published`
- Require production credentials, DNS settings, or external services

*（内容由AI生成，仅供参考）*
