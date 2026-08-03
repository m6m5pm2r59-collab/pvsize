# PVSize Opportunities Production QA Evidence Bundle Checklist

Status: evidence bundle planning gate only

Updated: 2026-08-01

## Purpose

This checklist defines the evidence bundle required before a future indexed Opportunities release can be archived or considered for Phase 5C closure.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

EVIDENCE_BUNDLE: COMPLETE_BEFORE_CLOSURE

Every future indexed-release production QA run must leave a complete evidence bundle before archive closure. Missing evidence means the release cannot be marked complete, even when production checks appear to pass.

## Required Bundle Sections

EVIDENCE_BUNDLE: REQUIRED_SECTIONS

Future evidence bundle must include:

- Release summary.
- Release candidate commit SHA.
- Last known good noindex commit SHA.
- Production deployment target.
- Production URLs checked.
- Local QA commands and results.
- Production HTTP results.
- Robots/canonical results.
- Sitemap/RSS results.
- JSON-LD results.
- Newsletter output results.
- Fallback/noindex decision.
- Known risks.
- Next single task.

## Local QA Evidence

EVIDENCE_BUNDLE: LOCAL_QA_EVIDENCE

Future evidence bundle must include local command results for:

- `node src/tools/verify-opportunities-production-qa-run-manifest.js --self-test`
- `node src/tools/verify-opportunities-production-qa-artifact-index.js --self-test`
- `node src/tools/verify-opportunities-production-qa-handoff-checklist.js --self-test`
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

Each result must include PASS/FAIL status, run timestamp, and the release candidate commit SHA.

## Production QA Evidence

EVIDENCE_BUNDLE: PRODUCTION_QA_EVIDENCE

Future evidence bundle must include:

- Production listing URL HTTP status.
- Production detail URL HTTP statuses.
- Production homepage entry-link result.
- Production robots meta result for each Opportunities URL.
- Production canonical result for each Opportunities URL.
- Production no unexpected JSON-LD result for non-published records.
- Production no unexpected RSS alternate result.
- Production fallback/noindex target verification when fallback is used.

## Indexed Output Evidence

EVIDENCE_BUNDLE: INDEXED_OUTPUT_EVIDENCE

Future evidence bundle must include indexed-output evidence only after a separate indexed-release implementation task has approved published records and output generation:

- Sitemap Opportunities URL list.
- RSS Opportunities item list.
- JSON-LD Opportunities URL list.
- Newsletter output summary.
- Published-record id list.
- Published-record review-state proof.
- Search indexing request status, if a separate task explicitly approves indexing.

Any indexed-output evidence for a non-published Opportunity is a release-blocking failure.

## Fallback Evidence

EVIDENCE_BUNDLE: FALLBACK_EVIDENCE

When fallback or rollback is used, future evidence bundle must include:

- Trigger reason.
- Fallback/noindex commit SHA or deployment target.
- URLs rechecked after fallback.
- Sitemap/RSS recheck result.
- JSON-LD recheck result.
- Newsletter output recheck result.
- Known residual risks.
- Next single task after fallback.

## Current No-Execution Requirement

EVIDENCE_BUNDLE: CURRENT_NO_EXECUTION

This evidence bundle checklist task must not:

- Deploy production code.
- Change robots policy.
- Add Opportunities URLs to sitemap.
- Add RSS/feed output.
- Add JSON-LD output.
- Add newsletter form/output.
- Request search indexing.
- Change record publication states.
- Mark indexed release complete.
- Mark Phase 5C Closed.

## Next Implementation Boundary

This task only defines the indexed-release production QA evidence bundle checklist and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, or change record publication states in this task.
