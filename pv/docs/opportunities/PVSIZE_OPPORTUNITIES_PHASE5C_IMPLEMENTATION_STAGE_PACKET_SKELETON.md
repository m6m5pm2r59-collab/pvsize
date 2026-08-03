---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 152197a3d7e9375bf12095386579fe5d_L09
    ReservedCode1: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 152197a3d7e9375bf12095386579fe5d_L09
    ReservedCode2: FbkNHFKQnBVNo6vSelHAmIaKlGvNU0INM6jGTKcUJQGSkVDQXLsHzDhd+Dvn0aofkZVNe+OfgSDzU6QYbtwrDGqDIglBn9iXildfJ+gT/njK9ji3rlMTLCW5arftpUnvoMVFgSVE/vpk/f/8ijnr8hHXxI1ReyuhUe/iQlM/pPjsqnh5salKM+FdwQo=
---

# PVSize Opportunities Phase 5C Implementation-Stage Packet Skeleton

Prepares the shell of a future implementation-stage executor packet so the next stage can start from a stable structure when approved. This is a planning-only artifact — it defines the packet shape, entry conditions, task structure, and exit gates without executing any implementation.

Status: planning-only

Updated: 2026-08-02

## 1. Purpose

When the Phase 5C planning-only long-run stage ends after L10, Codex will decide whether the next stage moves to implementation. If approved, the implementation executor packet will need a stable, pre-audited structure that maps every planning artifact into an executable sequence.

This skeleton provides that structure now, while all planning artifacts (L01-L08) are fresh, so the future implementation packet only needs to fill in completion checkboxes and execution evidence — not design the packet from scratch.

This skeleton does not deploy code, add indexed output, add newsletter output, add sitemap/RSS output, add JSON-LD output, request search indexing, approve indexed release, close Phase 5C, or change any record to `published`.

## 2. Skeleton Position in the Stage Pipeline

```
L01-L08 (planning artifacts, complete) → L09 (this skeleton) → L10 (handoff) → Codex decision
                                                                                      ↓
                                                                            Future implementation packet
                                                                            (filled from this skeleton)
```

The dependency map in `PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md` (L08) defines the ordering that the future implementation packet will follow. This skeleton encodes that ordering into packet sections.

## 3. Future Packet Metadata Slots

The following slots will be filled when the future implementation packet is activated. They are defined here so the structure is locked.

| Slot | Placeholder Value (This Skeleton) | Will Be Filled With |
|---|---|---|
| Packet status | `skeleton (planning-only)` | `active` |
| Activation date | `(pending Codex approval)` | ISO date of Codex approval |
| Base commit | `(pending L10 handoff)` | Commit hash at L10 completion |
| Remote main baseline | `(pending L10 final push)` | Remote main head after L10 push |
| Stage owner | `Marvis (execution agent)` | Confirmed Marvis session |
| Reviewer | `Codex` | Codex |

## 4. Entry Conditions

These gates must be satisfied before the future implementation packet can be activated. They are derived from the boundary contract (L07) and dependency map (L08).

### 4.1 Hard Gates

| Gate | Source | Description |
|---|---|---|
| G1: Planning stage complete | L07 | All L01-L10 planning artifacts accepted; STATUS.md points to implementation stage |
| G2: Boundary contract approved | L07 | `PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md` accepted; implementation side of the contract is clear |
| G3: Dependency map resolved | L08 | All hard dependencies D1-D10 in `PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md` are confirmed satisfied |
| G4: Codex approval | L10 | Codex acceptance review of L10 handoff returns ACCEPT |
| G5: No planning-only violations | L07 | Current state has no deploy, no indexed output, no newsletter, no sitemap/RSS, no JSON-LD, no indexing request, no published records, no Phase 5C closure |

### 4.2 Soft Gates

| Gate | Source | Description |
|---|---|---|
| SG1: Report trail current | L02 | All L01-L10 reports exist in the report directory and match the acceptance commit ledger (L03) |
| SG2: Status rollup current | L06 | STATUS.md has a completed rollup for the planning-only stage |
| SG3: Stop/restart protocol current | L04 | Protocol reflects the actual interruption history during L01-L10 |

## 5. Implementation Task Queue (from Dependency Map)

The following task sequence is derived from the dependency map's `IS-01` through `IS-07` implementation steps and the hard dependency chain. Each task is a placeholder — the implementation packet will fill in completion status, evidence paths, and commit hashes.

### 5.1 IS-01: Verify Planning Baseline

**Depends on**: IR-01, IR-02, IR-03, L07

**Objective**: Re-verify that all planning artifacts, verifier scripts, and state checks are in the expected baseline before any implementation begins.

**Skeleton tasks**:
- [ ] Run aggregate QA (`node src/tools/verify-opportunities-all.js`)
- [ ] Confirm `git diff --check` clean
- [ ] Re-read L07 boundary contract and confirm no planning-only violations
- [ ] Confirm STATUS.md Next Single Task points to IS-01
- [ ] Write IS-01 start report

### 5.2 IS-02: Published-Record State Transition

**Depends on**: IS-01 PASS, IR-02, IR-03, IR-04

**Objective**: Transition the five draft Opportunity records from `review_status: discovered` toward `published` per the published-record state transition rules (IR-02) and preflight matrix (IR-03).

**Skeleton tasks**:
- [ ] Review each of the five draft records against the published-record preflight matrix
- [ ] Execute state transitions one record at a time per IR-02 sequencing rules
- [ ] Run `src/tools/validate-opportunities.js` after each transition
- [ ] Run aggregate QA after all transitions
- [ ] Write IS-02 completion report

### 5.3 IS-03: SEO Metadata Activation

**Depends on**: IS-02 PASS, IR-13

**Objective**: Activate SEO metadata (title, description, canonical, robots) on Opportunities listing and detail pages per structured data rules (IR-13), while keeping pages noindex until production QA passes.

**Skeleton tasks**:
- [ ] Add SEO metadata to `/opportunities/` listing
- [ ] Add SEO metadata to each of the five detail pages
- [ ] Run `src/tools/verify-opportunities-seo-metadata.js`
- [ ] Run aggregate QA
- [ ] Write IS-03 completion report

### 5.4 IS-04: Structured Data / JSON-LD Activation

**Depends on**: IS-03 PASS, IR-13

**Objective**: Add JSON-LD structured data to Opportunities listing and detail pages per the structured data rules (IR-13) with published-record-only gating.

**Skeleton tasks**:
- [ ] Add `Organization` + `ItemList` JSON-LD to `/opportunities/` listing
- [ ] Add `Organization` JSON-LD to each detail page
- [ ] Run `src/tools/verify-opportunities-structured-data-rules.js`
- [ ] Run aggregate QA
- [ ] Write IS-04 completion report

### 5.5 IS-05: Sitemap and RSS Registration

**Depends on**: IS-04 PASS, IR-14

**Objective**: Register Opportunities URLs in sitemap and RSS/feed per sitemap/RSS rules (IR-14) with published-record-only gating.

**Skeleton tasks**:
- [ ] Add Opportunities listing + detail URLs to `src/sitemap.xml`
- [ ] Add Opportunities entries to feed
- [ ] Run `src/tools/verify-opportunities-sitemap-rss-rules.js`
- [ ] Run aggregate QA
- [ ] Write IS-05 completion report

### 5.6 IS-06: Newsletter Integration

**Depends on**: IS-05 PASS, IR-15, IR-05

**Objective**: Add newsletter form and API integration per newsletter rules (IR-15) and activation hold checklist (IR-05).

**Skeleton tasks**:
- [ ] Add newsletter subscription form to Opportunities listing and detail pages
- [ ] Wire newsletter API endpoint
- [ ] Run `src/tools/verify-opportunities-newsletter-rules.js`
- [ ] Run aggregate QA
- [ ] Write IS-06 completion report

### 5.7 IS-07: Production QA and Indexed Release

**Depends on**: IS-06 PASS, IR-06 through IR-25

**Objective**: Execute full production QA pipeline per QA readiness rules (IR-06), execution checklist (IR-07), fallback checklist (IR-08), and go/no-go criteria (IR-22). If QA passes, approve indexed release per archive closure checklist (IR-09).

**Skeleton tasks**:
- [ ] Execute pre-deploy checks from production QA execution checklist (IR-07)
- [ ] Deploy to production
- [ ] Run `PVSIZE_VERIFY_PRODUCTION=1 node src/tools/verify-opportunities-all.js`
- [ ] Execute post-deploy monitoring per monitoring handoff (IR-24)
- [ ] Execute post-release watch per post-release watch checklist (IR-25)
- [ ] Run go/no-go criteria evaluation (IR-22)
- [ ] If GO: record indexed release decision in decision log (IR-21)
- [ ] If GO: update robots from noindex to index
- [ ] If GO: request search indexing per indexing request hold checklist (IR-26)
- [ ] If GO: archive closure per indexed release archive closure checklist (IR-09)
- [ ] Write IS-07 completion report

## 6. Per-Task Pattern

Each IS task in the future implementation packet will follow this pattern:

1. **Pre-check**: Run aggregate QA, confirm clean state, re-read relevant planning documents
2. **Execute**: Implement the task objective with one smallest verifiable change
3. **Verify**: Run the task-specific verifier script, then aggregate QA, then `git diff --check`
4. **Record**: Update STATUS.md, write report, commit, push
5. **Gate**: Confirm the next task's entry conditions are met before proceeding

## 7. Verification Script Map

The following verifier scripts are relevant during implementation. The implementation packet will reference these for each IS task.

| Verifier | Used By |
|---|---|
| `src/tools/validate-opportunities.js` | IS-01, IS-02 |
| `src/tools/verify-opportunities-all.js` | All IS tasks |
| `src/tools/verify-opportunities-page.js` | IS-03, IS-04 |
| `src/tools/verify-opportunities-seo-metadata.js` | IS-03 |
| `src/tools/verify-opportunities-structured-data-rules.js` | IS-04 |
| `src/tools/verify-opportunities-sitemap-rss-rules.js` | IS-05 |
| `src/tools/verify-opportunities-newsletter-rules.js` | IS-06 |
| `src/tools/verify-opportunities-index-policy.js` | IS-03, IS-04, IS-05 |
| `src/tools/verify-opportunities-production-qa-readiness.js` | IS-07 |
| `src/tools/verify-opportunities-production-qa-execution-checklist.js` | IS-07 |
| `src/tools/verify-opportunities-indexed-release-fallback-checklist.js` | IS-07 |
| `src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js` | IS-07 |
| `src/tools/verify-opportunities-production-qa-go-no-go-criteria.js` | IS-07 |
| `src/tools/verify-opportunities-production-qa-release-notes-template.js` | IS-07 |
| `src/tools/verify-opportunities-production-qa-monitoring-handoff-checklist.js` | IS-07 |
| `src/tools/verify-opportunities-production-qa-post-release-watch-checklist.js` | IS-07 |
| `src/tools/verify-opportunities-production-noindex.js` | IS-07 |

## 8. Planning-Only Guardrails

This skeleton is a planning-only artifact. It must not, and the future implementation packet must not cross into before Codex approval:

- **Deploy code** — No deployment until IS-07
- **Add indexed output** — No sitemap entries until IS-05 after IS-04 PASS
- **Add newsletter output** — No newsletter form/API until IS-06 after IS-05 PASS
- **Add JSON-LD output** — No structured data until IS-04 after IS-03 PASS
- **Request search indexing** — No indexing request until IS-07 GO decision
- **Approve indexed release** — No approval until IS-07 go/no-go evaluation
- **Close Phase 5C** — No closure until IS-07 archive closure checklist
- **Change records to published** — No published records until IS-02 after IS-01 PASS

These guardrails are inherited from `PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md` (L07) and the dependency map (L08). The boundary contract is the authoritative reference.

## 9. Stop Conditions

The future implementation packet will stop and request Codex review if:

- Any IS task fails verification after two retries per the stop/restart protocol (L04)
- A blocked-run condition from the exception playbook (L05) is triggered
- Git shows unrelated dirty user changes
- A deployment, credential, DNS, or production service access is required before its scheduled IS task
- Aggregate QA fails for a reason other than temporary local static-server permission
- Status file conflicts with this packet

## 10. Exit Conditions

The implementation stage is complete when:

- All IS-01 through IS-07 tasks are marked complete with verified evidence
- Aggregate QA passes with all verifier steps
- Production QA passes with `PVSIZE_VERIFY_PRODUCTION=1`
- Indexed release decision is recorded (GO/NO-GO)
- Archive closure checklist is completed (if GO)
- STATUS.md is updated with implementation stage completion
- Final report is written to the report directory

## 11. Cross-References

### 11.1 Planning Artifacts (L01-L08)

| Ref | Artifact | Relevance to Implementation |
|---|---|---|
| L01 | `PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md` | Defines planning-only mode and task queue that produced this skeleton |
| L02 | `PVSIZE_OPPORTUNITIES_PHASE5C_REPORT_TRAIL_RECONCILIATION.md` | Report trail for planning stage; used by IS-01 and exit conditions |
| L03 | `PVSIZE_OPPORTUNITIES_PHASE5C_ACCEPTANCE_COMMIT_LEDGER.md` | Commit ledger for planning stage; used by IS-01 baseline verification |
| L04 | `PVSIZE_OPPORTUNITIES_PHASE5C_STOP_RESTART_PROTOCOL.md` | Stop/restart rules for the continuous execution loop |
| L05 | `PVSIZE_OPPORTUNITIES_PHASE5C_BLOCKED_RUN_EXCEPTION_PLAYBOOK.md` | Blocked-run exception handling rules |
| L06 | `PVSIZE_OPPORTUNITIES_PHASE5C_STATUS_ROLLUP_TEMPLATE.md` | Status rollup format for each IS task |
| L07 | `PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_BOUNDARY_CONTRACT.md` | The contract that separates planning from implementation |
| L08 | `PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md` | The dependency chain IS-01 through IS-07, hard dependencies D1-D10 |

### 11.2 Future Artifacts

| Ref | Artifact | Relevance |
|---|---|---|
| L09 | This skeleton | Provides the structure the future packet will fill |
| L10 | `PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_HANDOFF.md` | Codex handoff after L09 |

### 11.3 Indexed Release Planning Artifacts (IR-01 through IR-26)

All 26 IR artifacts from the dependency map (L08) are referenced in the IS task queue above. See `PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_IMPLEMENTATION_DEPENDENCY_MAP.md` Section 2.2 for the full IR artifact table.

## 12. Acceptance Criteria

- [ ] All eight planning artifact cross-references (L01-L08) are present
- [ ] All seven implementation task slots (IS-01 through IS-07) are defined
- [ ] Entry conditions (G1-G5, SG1-SG3) are explicit
- [ ] Stop conditions reference L04 and L05
- [ ] Exit conditions are explicit
- [ ] Planning-only guardrails are present and reference the boundary contract (L07)
- [ ] Dependency map (L08) is referenced as the authoritative task ordering source
- [ ] Verification script map covers all relevant verifiers
- [ ] Packet metadata slots are defined
- [ ] Per-task pattern is documented
