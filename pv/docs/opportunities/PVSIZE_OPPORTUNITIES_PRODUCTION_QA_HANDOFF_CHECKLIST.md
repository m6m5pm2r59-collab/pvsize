# PVSize Opportunities Production QA Handoff Checklist

Status: handoff planning gate only

Updated: 2026-08-01

## Purpose

This checklist defines the required handoff package for a future indexed-release production QA operator.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

HANDOFF_CHECKLIST: OPERATOR_READY

The handoff must let the next operator identify the release candidate, run the correct QA gates, find the evidence trail, and know the stop conditions without changing production state during handoff planning.

## Required Handoff Fields

HANDOFF_CHECKLIST: REQUIRED_FIELDS

Future handoff must include:

- Current phase.
- Release candidate commit SHA.
- Last known good noindex commit SHA.
- Production deployment target.
- Expected Opportunities URL set.
- Expected indexed/noindex policy.
- Expected sitemap/RSS output.
- Expected JSON-LD output.
- Expected newsletter output.
- Artifact index path.
- Verification command list.
- Daily ops report path.
- Known risks.
- Stop conditions.
- Next single task.

## Required Artifact References

HANDOFF_CHECKLIST: ARTIFACT_REFERENCES

Future handoff must reference:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_ARTIFACT_INDEX.md`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_READINESS_RULES.md`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EXECUTION_CHECKLIST.md`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_FALLBACK_CHECKLIST.md`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_ARCHIVE_CLOSURE_CHECKLIST.md`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`

## Required Verification Commands

HANDOFF_CHECKLIST: VERIFICATION_COMMANDS

Future handoff must include:

- `node src/tools/verify-opportunities-production-qa-artifact-index.js --self-test`
- `node src/tools/verify-opportunities-production-qa-readiness.js --self-test`
- `node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`
- `node src/tools/verify-opportunities-indexed-release-fallback-checklist.js --self-test`
- `node src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js --self-test`
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

## Stop Conditions

HANDOFF_CHECKLIST: STOP_CONDITIONS

Future handoff must tell the next operator to stop when:

- Release candidate commit SHA is missing.
- Rollback/noindex fallback target is missing.
- Local aggregate QA fails.
- Production HTTP QA fails.
- Indexed output QA fails.
- Non-published Opportunity appears in any indexable surface.
- Newsletter output links to unverifiable or non-published indexed URL.
- Production behavior differs from the approved release scope.

## Current No-Handoff-Execution Requirement

HANDOFF_CHECKLIST: CURRENT_NO_EXECUTION

This handoff checklist task must not:

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

This task only defines the indexed-release production QA handoff checklist and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, or change record publication states in this task.
