# PVSize Opportunities Phase 5C Pre-Implementation Verifier Orchestration Matrix

Status: verifier orchestration gate

Updated: 2026-08-02

## Purpose

This document maps every Opportunities verifier to its owning gate, canonical command path, and stop-on-fail behavior during the Phase 5C pre-implementation stage.

It is an infrastructure-only artifact. It does not deploy, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, request search indexing, change record publication states, or change Opportunities product surfaces.

## PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: TOTAL_COUNT

Total verifiers cataloged: **43** (excluding the master aggregate `verify-opportunities-all.js`).

Total gates: **9** (G1–G9) + 1 master aggregate gate (GM).

## PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: MATRIX

### Gate G1: Source & Content Readiness

Corresponds to Release Gate 1 (Source Readiness) and Gate 2 (Content Readiness).

Verifiers that ensure data integrity at the source and record level.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 1 | `validate-opportunities.js` | `node src/tools/validate-opportunities.js --self-test` | YES |
| 2 | `generate-opportunity-detail-pages.js` | `node src/tools/generate-opportunity-detail-pages.js` | YES |

### Gate G2: Page & Content Verification

Corresponds to Release Gate 4 (Publication Readiness) and Gate 5 (Growth Readiness).

Verifiers that check listing, detail pages, SEO metadata, and analytics/CTA markers.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 3 | `verify-opportunities-page.js` | `node src/tools/verify-opportunities-page.js` | YES |
| 4 | `verify-opportunities-analytics-cta.js` | `node src/tools/verify-opportunities-analytics-cta.js` | YES |
| 5 | `verify-opportunities-seo-metadata.js` | `node src/tools/verify-opportunities-seo-metadata.js` | YES |

### Gate G3: Index Policy & Readiness

Corresponds to Release Gate 6 (Production Gate) — index policy enforcement.

Verifiers that keep the noindex gate explicit and check indexed-release readiness markers.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 6 | `verify-opportunities-index-policy.js` | `node src/tools/verify-opportunities-index-policy.js --self-test` | YES |
| 7 | `verify-opportunities-indexed-readiness.js` | `node src/tools/verify-opportunities-indexed-readiness.js` | YES |

### Gate G4: Structured Data / Sitemap / RSS / Newsletter Rules

Corresponds to Release Gate 4 (Publication Readiness) — structured data, sitemap, RSS, newsletter rules.

Verifiers that enforce published-only planning rules and confirm no output leak.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 8 | `verify-opportunities-structured-data-rules.js` | `node src/tools/verify-opportunities-structured-data-rules.js --self-test` | YES |
| 9 | `verify-opportunities-sitemap-rss-rules.js` | `node src/tools/verify-opportunities-sitemap-rss-rules.js --self-test` | YES |
| 10 | `verify-opportunities-newsletter-rules.js` | `node src/tools/verify-opportunities-newsletter-rules.js --self-test` | YES |

### Gate G5: Production QA Planning

Production QA planning artifacts for future indexed-release execution.

Stop-on-fail is YES only for artifacts whose failure indicates a fundamental planning gap or infrastructure-only mode violation. Template/checklist verifiers with NO marking are advisory planning artifacts.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 11 | `verify-opportunities-production-qa-readiness.js` | `node src/tools/verify-opportunities-production-qa-readiness.js --self-test` | YES |
| 12 | `verify-opportunities-production-qa-execution-checklist.js` | `node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test` | NO |
| 13 | `verify-opportunities-indexed-release-fallback-checklist.js` | `node src/tools/verify-opportunities-indexed-release-fallback-checklist.js --self-test` | NO |
| 14 | `verify-opportunities-indexed-release-archive-closure-checklist.js` | `node src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js --self-test` | NO |
| 15 | `verify-opportunities-production-qa-artifact-index.js` | `node src/tools/verify-opportunities-production-qa-artifact-index.js --self-test` | NO |
| 16 | `verify-opportunities-production-qa-handoff-checklist.js` | `node src/tools/verify-opportunities-production-qa-handoff-checklist.js --self-test` | NO |
| 17 | `verify-opportunities-production-qa-run-manifest.js` | `node src/tools/verify-opportunities-production-qa-run-manifest.js --self-test` | NO |
| 18 | `verify-opportunities-production-qa-evidence-bundle-checklist.js` | `node src/tools/verify-opportunities-production-qa-evidence-bundle-checklist.js --self-test` | NO |
| 19 | `verify-opportunities-production-qa-signoff-checklist.js` | `node src/tools/verify-opportunities-production-qa-signoff-checklist.js --self-test` | NO |
| 20 | `verify-opportunities-production-qa-decision-log-template.js` | `node src/tools/verify-opportunities-production-qa-decision-log-template.js --self-test` | NO |
| 21 | `verify-opportunities-production-qa-go-no-go-criteria.js` | `node src/tools/verify-opportunities-production-qa-go-no-go-criteria.js --self-test` | NO |
| 22 | `verify-opportunities-production-qa-release-notes-template.js` | `node src/tools/verify-opportunities-production-qa-release-notes-template.js --self-test` | NO |
| 23 | `verify-opportunities-production-qa-monitoring-handoff-checklist.js` | `node src/tools/verify-opportunities-production-qa-monitoring-handoff-checklist.js --self-test` | NO |
| 24 | `verify-opportunities-production-qa-post-release-watch-checklist.js` | `node src/tools/verify-opportunities-production-qa-post-release-watch-checklist.js --self-test` | NO |
| 25 | `verify-opportunities-production-qa-search-indexing-request-hold-checklist.js` | `node src/tools/verify-opportunities-production-qa-search-indexing-request-hold-checklist.js --self-test` | YES |

### Gate G6: Indexed Release Planning

Preflight matrices and planning summaries for future indexed-release activation.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 26 | `verify-opportunities-published-record-preflight-matrix.js` | `node src/tools/verify-opportunities-published-record-preflight-matrix.js --self-test` | YES |
| 27 | `verify-opportunities-indexed-output-activation-preflight-matrix.js` | `node src/tools/verify-opportunities-indexed-output-activation-preflight-matrix.js --self-test` | YES |
| 28 | `verify-opportunities-newsletter-activation-hold-checklist.js` | `node src/tools/verify-opportunities-newsletter-activation-hold-checklist.js --self-test` | YES |
| 29 | `verify-opportunities-phase5c-indexed-release-planning-summary.js` | `node src/tools/verify-opportunities-phase5c-indexed-release-planning-summary.js --self-test` | YES |
| 30 | `verify-opportunities-phase5c-indexed-implementation-dependency-map.js` | `node src/tools/verify-opportunities-phase5c-indexed-implementation-dependency-map.js --self-test` | NO |

### Gate G7: Planning-Only Long-Run Stage Governance

Verifiers that govern the planning-only long-run stage: board, boundary contract, handoff, status rollup, report trail, stop/restart protocol, blocked-run exception playbook, and acceptance commit ledger.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 31 | `verify-opportunities-phase5c-planning-only-long-run-board.js` | `node src/tools/verify-opportunities-phase5c-planning-only-long-run-board.js --self-test` | YES |
| 32 | `verify-opportunities-phase5c-planning-only-boundary-contract.js` | `node src/tools/verify-opportunities-phase5c-planning-only-boundary-contract.js --self-test` | YES |
| 33 | `verify-opportunities-phase5c-planning-only-long-run-handoff.js` | `node src/tools/verify-opportunities-phase5c-planning-only-long-run-handoff.js --self-test` | YES |
| 34 | `verify-opportunities-phase5c-marvis-handoff.js` | `node src/tools/verify-opportunities-phase5c-marvis-handoff.js --self-test` | YES |
| 35 | `verify-opportunities-phase5c-status-rollup-template.js` | `node src/tools/verify-opportunities-phase5c-status-rollup-template.js --self-test` | NO |
| 36 | `verify-opportunities-phase5c-report-trail-reconciliation.js` | `node src/tools/verify-opportunities-phase5c-report-trail-reconciliation.js --self-test` | NO |
| 37 | `verify-opportunities-phase5c-stop-restart-protocol.js` | `node src/tools/verify-opportunities-phase5c-stop-restart-protocol.js --self-test` | NO |
| 38 | `verify-opportunities-phase5c-blocked-run-exception-playbook.js` | `node src/tools/verify-opportunities-phase5c-blocked-run-exception-playbook.js --self-test` | NO |
| 39 | `verify-opportunities-phase5c-acceptance-commit-ledger.js` | `node src/tools/verify-opportunities-phase5c-acceptance-commit-ledger.js --self-test` | NO |

### Gate G8: Pre-Implementation Stage Governance

Verifiers that govern the current pre-implementation stage: long-run board, command contract, and implementation-stage packet skeleton.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 40 | `verify-opportunities-phase5c-pre-implementation-long-run-board.js` | `node src/tools/verify-opportunities-phase5c-pre-implementation-long-run-board.js --self-test` | YES |
| 41 | `verify-opportunities-phase5c-pre-implementation-command-contract.js` | `node src/tools/verify-opportunities-phase5c-pre-implementation-command-contract.js --self-test` | YES |
| 42 | `verify-opportunities-phase5c-implementation-stage-packet-skeleton.js` | `node src/tools/verify-opportunities-phase5c-implementation-stage-packet-skeleton.js --self-test` | NO |

### Gate G9: HTTP & Production Noindex

HTTP-level and production noindex verifiers. These are conditional gates: HTTP may fail under sandbox restrictions; production noindex is optional (`PVSIZE_VERIFY_PRODUCTION=1`).

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| 43 | `verify-opportunities-http.js` | `node src/tools/verify-opportunities-http.js` | NO |

### Gate GM: Master Aggregate

The master aggregate QA entrypoint. All sub-verifiers are orchestrated through this single command. Its exit code is the final pass/fail decision for the entire stage.

| # | Verifier | Command Path | Stop-on-Fail |
|---|----------|-------------|:---:|
| M | `verify-opportunities-all.js` | `npm --prefix src run verify:opportunities` | YES |

Optional production noindex passthrough: `npm --prefix src run verify:opportunities:production-noindex` (adds `verify-opportunities-production-noindex.js` to GM).

## PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: STOP_ON_FAIL_SUMMARY

| Category | Count | Verifiers |
|----------|:-----:|-----------|
| **Stage-stop verifiers** (failure must stop the stage) | **23** | G1 (2), G2 (3), G3 (2), G4 (3), G5: readiness + search indexing hold (2), G6: preflight matrices + summary + newsletter hold (4), G7: board + boundary + handoff + marvis handoff (4), G8: board + command contract (2), GM (1) |
| **Advisory verifiers** (failure is a warning, not a stage-stop) | **20** | G5: execution/fallback/archive/artifact/handoff/manifest/evidence/signoff/decision/go-no-go/release-notes/monitoring/post-release (13), G6: dependency map (1), G7: status-rollup/report-trail/stop-restart/blocked-run/accepance-ledger (5), G8: packet-skeleton (1) |
| **Conditional verifiers** (failure may be permitted) | **1** | G9: http (1) |

## PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: ORCHESTRATION_CONTROL_FLOW

The master aggregate (`verify-opportunities-all.js`) runs verifiers in this fixed order:

1. G1: Data validator (`--self-test`)
2. G1: Detail generator
3. G2: SEO metadata
4. G4: Structured data rules (`--self-test`)
5. G4: Sitemap/RSS rules (`--self-test`)
6. G4: Newsletter rules (`--self-test`)
7. G5: Production QA readiness (`--self-test`)
8. G5: Production QA execution checklist (`--self-test`)
9. G5: Indexed release fallback checklist (`--self-test`)
10. G5: Indexed release archive closure checklist (`--self-test`)
11. G5: Production QA artifact index (`--self-test`)
12. G5: Production QA handoff checklist (`--self-test`)
13. G5: Production QA run manifest (`--self-test`)
14. G5: Production QA evidence bundle checklist (`--self-test`)
15. G5: Production QA signoff checklist (`--self-test`)
16. G5: Production QA decision log template (`--self-test`)
17. G5: Production QA go/no-go criteria (`--self-test`)
18. G5: Production QA release notes template (`--self-test`)
19. G5: Production QA monitoring handoff (`--self-test`)
20. G5: Production QA post-release watch (`--self-test`)
21. G5: Production QA search indexing hold (`--self-test`)
22. G6: Published record preflight matrix (`--self-test`)
23. G6: Indexed output activation preflight matrix (`--self-test`)
24. G6: Newsletter activation hold checklist (`--self-test`)
25. G6: Phase 5C indexed-release planning summary (`--self-test`)
26. G7: Phase 5C planning-only long-run board (`--self-test`)
27. G8: Phase 5C pre-implementation long-run board (`--self-test`)
28. G8: Phase 5C pre-implementation command contract (`--self-test`)
29. G7: Phase 5C status rollup template (`--self-test`)
30. G6/G7: Phase 5C indexed implementation dependency map (`--self-test`)
31. G7: Phase 5C implementation stage packet skeleton (`--self-test`)
32. G7: Phase 5C planning-only long-run handoff (`--self-test`)
33. G2: Page verification
34. G3: Indexed readiness verification
35. G3: Index policy verification (`--self-test`)
36. G2: Analytics CTA verification
37. G9: HTTP verification
38. (Optional) G9: Production noindex verification

Any step that returns non-zero exit code causes the aggregate to fail immediately, regardless of that verifier's individual stop-on-fail classification. This is the aggregate's own stop-on-fail contract, distinct from per-gate advisory classifications.

## PRE_IMPLEMENTATION_VERIFIER_ORCHESTRATION: INFRASTRUCTURE_ONLY

This matrix is infrastructure-only.

Do not deploy, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, request search indexing, approve indexed release, close Phase 5C, change record publication states, or change Opportunities product surfaces in this task.
