# PVSize Opportunities Production QA Run Manifest

Status: run manifest planning gate only

Updated: 2026-08-01

## Purpose

This manifest defines the required metadata for a future indexed-release production QA run.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

RUN_MANIFEST: DECLARE_BEFORE_QA

Every future indexed-release production QA run must declare its run identity, release candidate, expected production behavior, verification commands, artifact outputs, and stop conditions before production checks begin.

## Required Manifest Fields

RUN_MANIFEST: REQUIRED_FIELDS

Future production QA run manifest must include:

- QA run id.
- QA run date.
- Operator.
- Current phase.
- Release candidate commit SHA.
- Last known good noindex commit SHA.
- Production deployment target.
- Expected Opportunities URL set.
- Expected indexed/noindex policy.
- Expected sitemap/RSS output.
- Expected JSON-LD output.
- Expected newsletter output.
- Verification command list.
- Artifact index path.
- Handoff checklist path.
- Report output path.
- Fallback/noindex target.
- Stop conditions.
- Next single task.

## Required Verification Plan

RUN_MANIFEST: VERIFICATION_PLAN

Future production QA run manifest must include:

- `node src/tools/verify-opportunities-production-qa-artifact-index.js --self-test`
- `node src/tools/verify-opportunities-production-qa-handoff-checklist.js --self-test`
- `node src/tools/verify-opportunities-production-qa-readiness.js --self-test`
- `node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`
- `node src/tools/verify-opportunities-indexed-release-fallback-checklist.js --self-test`
- `node src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js --self-test`
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

## Required Output Artifacts

RUN_MANIFEST: OUTPUT_ARTIFACTS

Future production QA run must produce or reference:

- Daily ops report.
- Production URL check results.
- Indexed output check results.
- Fallback/noindex decision.
- Archive closure decision.
- Known risks.
- Next single task.

## Stop Conditions

RUN_MANIFEST: STOP_CONDITIONS

Future production QA run must stop when:

- Run id is missing.
- Release candidate commit SHA is missing.
- Last known good noindex commit SHA is missing.
- Expected URL set is missing.
- Local aggregate QA fails.
- Production HTTP QA fails.
- Indexed output QA fails.
- Any non-published Opportunity appears in an indexable surface.
- Fallback/noindex target is missing.

## Current No-Run-Execution Requirement

RUN_MANIFEST: CURRENT_NO_EXECUTION

This run manifest task must not:

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

This task only defines the indexed-release production QA run manifest and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, or change record publication states in this task.
