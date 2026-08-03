# PVSize Opportunities Production QA Signoff Checklist

Status: signoff planning gate only

Updated: 2026-08-01

## Purpose

This checklist defines the signoff record required before a future indexed Opportunities release can proceed after production QA.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

SIGNOFF: REQUIRED_BEFORE_INDEXED_RELEASE

Every future indexed-release production QA run must have an explicit signoff record before indexed release, search indexing request, or archive closure. Missing or incomplete signoff means HOLD.

## Required Signoff Fields

SIGNOFF: REQUIRED_SIGNOFF_FIELDS

Future production QA signoff must include:

- Signoff id.
- Signoff date.
- Operator.
- Current phase.
- Release candidate commit SHA.
- QA run manifest path.
- Evidence bundle path.
- Artifact index path.
- Production deployment target.
- Production URL set.
- Local aggregate QA result.
- Production HTTP QA result.
- Robots/canonical QA result.
- Sitemap/RSS QA result.
- JSON-LD QA result.
- Newsletter output QA result.
- Fallback/noindex decision.
- Known risk acceptance.
- Final signoff decision.
- Next single task.

## Local QA Signoff

SIGNOFF: LOCAL_QA_SIGNOFF

Future signoff must confirm local QA evidence for:

- `node src/tools/verify-opportunities-production-qa-run-manifest.js --self-test`
- `node src/tools/verify-opportunities-production-qa-evidence-bundle-checklist.js --self-test`
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

Local signoff must include PASS/FAIL status, timestamp, and release candidate commit SHA.

## Production QA Signoff

SIGNOFF: PRODUCTION_QA_SIGNOFF

Future signoff must confirm:

- Production listing URL HTTP PASS.
- Production detail URL HTTP PASS.
- Production homepage entry-link PASS.
- Production robots meta PASS.
- Production canonical PASS.
- Production unexpected JSON-LD absence PASS for non-published records.
- Production unexpected RSS alternate absence PASS until RSS is explicitly approved.
- Production fallback/noindex target PASS when fallback is used.

## Indexed Output Signoff

SIGNOFF: INDEXED_OUTPUT_SIGNOFF

Future signoff may approve indexed output only when a separate indexed-release implementation task has created published records and output generation:

- Sitemap Opportunities URLs match published records.
- RSS Opportunities items match published records.
- JSON-LD Opportunities entities match published records.
- Newsletter output references only published records.
- Search indexing request is separately approved.

Any non-published Opportunity in sitemap, RSS, JSON-LD, newsletter output, or indexable robots policy requires HOLD.

## Fallback Signoff

SIGNOFF: FALLBACK_SIGNOFF

Future signoff must record one fallback outcome:

- HOLD_NO_INDEX.
- ROLLBACK_TO_NOINDEX.
- APPROVED_FOR_INDEXED_RELEASE.

`APPROVED_FOR_INDEXED_RELEASE` is only allowed when every local QA, production QA, indexed output, evidence bundle, and risk acceptance field is complete.

## Closure Hold

SIGNOFF: CLOSURE_HOLD

Phase 5C must remain open until:

- Signoff record exists.
- Evidence bundle exists.
- Archive closure checklist passes.
- Production QA report exists.
- Published-record gates pass for every indexable Opportunity.
- No fallback hold is active.
- Next single task is recorded.

## Current No-Signoff Requirement

SIGNOFF: CURRENT_NO_SIGNOFF

This signoff checklist task must not:

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
- Approve indexed release.

## Next Implementation Boundary

This task only defines the indexed-release production QA signoff checklist and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, approve indexed release, or change record publication states in this task.
