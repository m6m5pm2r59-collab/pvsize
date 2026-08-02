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

# PVSize Opportunities Phase 5C Planning-Only Boundary Contract

Freezes the contract between planning-only work and future pre-implementation or implementation work so that Marvis does not cross the line accidentally. This contract is a durable reference — it does not set dates, approve implementation, or authorize any indexed/deploy action.

Updated: 2026-08-02 17:55 CST

## 1. Contract Purpose

The Phase 5C planning-only long-run stage (`PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md`) runs planning tasks (L01-L10 and beyond) that must remain entirely **planning-only**. The boundary contract defines exactly what planning-only means, what future work lies beyond the boundary, and what evidence proves the boundary is intact.

This contract is not a release gate. It is a fence — Marvis and Codex both reference it to know where planning ends and pre-implementation / implementation begins.

## 2. Planning-Only — What Is Allowed

Marvis may perform these actions during the planning-only stage:

| # | Allowed Action | Examples |
|---|---|---|
| P1 | Create planning documents under `docs/opportunities/` | L01 long-run board, L02 report trail, L03 acceptance ledger, L04 stop/restart protocol, L05 blocked-run playbook, L06 status rollup template, L07 boundary contract, L08 dependency map, L09 implementation skeleton, L10 handoff |
| P2 | Create verifier scripts under `src/tools/` | `verify-opportunities-phase5c-*.js` scripts with `--self-test` |
| P3 | Run local verification | `node src/tools/verify-opportunities-all.js`, `git diff --check` |
| P4 | Write reports to the report directory | `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/` |
| P5 | Update `PVSIZE_OPPORTUNITIES_STATUS.md` | Timestamp, Completed, Last Commit, Last Verification, Next Single Task |
| P6 | Commit and push planning artifacts | `git add` + `git commit` + `git push origin main` |
| P7 | Read existing source code and data files | `opportunities.json`, `sources.json`, HTML pages, verifier scripts |
| P8 | Aggregate QA wiring | Adding new verifier steps to `verify-opportunities-all.js` |

## 3. Beyond Planning-Only — What Is Forbidden

Marvis must **never** perform these actions during the planning-only stage, even if asked:

| # | Forbidden Action | Boundary Rule |
|---|---|---|
| F1 | Deploy any code | Planning produces documents and verifier scripts; deployment is an implementation action. No `vercel deploy`, no production push beyond `git push`. |
| F2 | Add indexed output | No sitemap entries, no RSS feed output, no JSON-LD structured data output for Opportunities URLs. The noindex MVP remains exactly as it is. |
| F3 | Add newsletter output | No newsletter form, newsletter API, newsletter signup, or newsletter content output. |
| F4 | Request search indexing | No search console URL submission, no indexing API call, no "request indexing" action. |
| F5 | Approve indexed release | No gate that marks the indexed-release as "approved" or "activated". All indexed-release gates remain planned but not activated. |
| F6 | Close Phase 5C | No statement that Phase 5C is closed or complete. Phase 5C remains open. |
| F7 | Change record publication states | No record transitions from `discovered` to `needs_review`, `approved`, or `published`. All five draft records remain at `review_status: discovered`. |
| F8 | Modify production HTML/CSS/JS | Planning documents only. No edits to `src/opportunities/index.html`, detail pages, or any production-facing asset. |
| F9 | Modify production data files | No edits to `src/data/opportunities/opportunities.json` or `sources.json` beyond what was already committed before the planning-only stage started. |
| F10 | Create deploy configuration | No `vercel.json` changes, no environment variable changes, no build script changes. |

## 4. Definition: Planning-Only vs. Pre-Implementation vs. Implementation

These three zones are deliberately separated by hard boundaries:

| Zone | Definition | Entry Condition |
|---|---|---|
| **Planning-Only** | Current zone. Documents, verifier scripts, local QA, and status tracking only. No production changes. | Active now (L01-L10 task queue). |
| **Pre-Implementation** | Preparation that touches code or data without deploying or publishing. Includes: wiring new data fields, adding test infrastructure, running generators in dry-run mode, adding templates that are not yet served. | Requires explicit Codex approval to exit planning-only. |
| **Implementation** | Deployment, indexed output activation, published record transitions, sitemap/RSS/schema/newsletter activation, production QA execution, Phase 5C closure. | Requires pre-implementation completion + explicit Codex + owner approval. |

## 5. Evidence Chain — Proving the Boundary Is Intact

Every task in the planning-only stage must produce verifiable evidence that no forbidden action occurred. This evidence is checked by:

- **Per-task verifier** (e.g., `verify-opportunities-phase5c-planning-only-boundary-contract.js`): checks its own document integrity and real-world state.
- **Aggregate QA** (`verify-opportunities-all.js`): runs all verifiers and confirms no deploy/indexed/newsletter/published/closure action.
- **Planning-only guardrails in each document**: every L0x planning document includes `Guardrails (Planning-Only)` section that restates the forbidden actions.

### Minimum Evidence Per Task

| Check | What It Proves |
|---|---|
| No deploy output | No deployment logs, no production change |
| No indexed output in sitemap | Sitemap contains zero Opportunities URLs |
| No RSS/JSON-LD/newsletter output | No feed, schema, or newsletter markup |
| No published records | `opportunities.json` has zero `review_status: published` records |
| No Phase 5C closure | STATUS.md does not claim Phase 5C is closed |
| No indexed release approval | STATUS.md does not claim indexed release is approved |
| `git diff --check` PASS | No dirty working tree, no whitespace violations |

## 6. Cross-References Within the Planning-Only Stage

This boundary contract is referenced by and references other L0x artifacts:

| Artifact | Relationship |
|---|---|
| L01 long-run board | Defines the task queue and planning-only mode; this contract is the durable legal definition of that mode. |
| L02 report trail reconciliation | Records per-task evidence that the boundary was respected. |
| L03 acceptance commit ledger | Maps each task's commit to verifier evidence, reinforcing the boundary. |
| L04 stop/restart protocol | Defines what happens when a stop or restart occurs — the boundary must be re-verified on every restart. |
| L05 blocked-run exception playbook | Defines blocker categories (B1-B10); any boundary violation is an automatic B1 blocker. |
| L06 status rollup template | Every rollup block must include an explicit boundary check in the Verification section. |
| L08 dependency map | Future implementation dependencies are documented here but not activated. |
| L09 implementation skeleton | Future implementation structure is documented here but remains a planning artifact. |
| L10 stage handoff | The final handoff to Codex must include a boundary verification summary. |

## 7. Boundary Violation Protocol

If Marvis or any tool accidentally crosses the boundary:

1. **Stop immediately**. Do not try to "fix" by making more changes.
2. **Record the violation** in the current task's report with: what action was taken, what file/state was touched, and what the correct state should be.
3. **Escalate to Codex**. The planning-only stage cannot self-heal a boundary violation; it requires human (Codex) review.
4. **Do not commit** the violating change. If it was already committed, create a revert commit and push.

A boundary violation is a B1 blocker per the blocked-run exception playbook (L05).

## 8. Planning-Only Guardrails (This Document)

This document itself must obey planning-only mode:

- ✅ P1 (planning document): This is a planning document under `docs/opportunities/`.
- ✅ P3 (local verification): Its verifier runs only local checks.
- ❌ F1 (Deploy code): No deploy action is triggered.
- ❌ F2 (indexed output): No sitemap/RSS/JSON-LD is added.
- ❌ F3 (newsletter output): No newsletter form or API output.
- ❌ F4 (indexing request): No search indexing is requested.
- ❌ F5 (indexed release): Indexed release is not approved.
- ❌ F6 (Phase 5C closure): Phase 5C is not closed.
- ❌ F7 (published records): No records transition to published.
- ❌ F8 (production code): No production HTML/CSS/JS is modified.
- ❌ F9 (production data): No production data files are modified.
- ❌ F10 (deploy config): No deploy configuration is changed.

## 9. Acceptance Criteria

The boundary contract is successfully delivered when:

1. This document exists at the expected path.
2. The verifier `verify-opportunities-phase5c-planning-only-boundary-contract.js` passes `--self-test` and real checks.
3. Aggregate QA includes this verifier and all checks pass.
4. STATUS.md is updated to reflect L07 completion.
5. A report is written to the report directory.
6. All changes are committed and pushed to `origin main`.
7. No forbidden action occurred during L07 execution.
