# PVSize Opportunities Production QA Execution Checklist

Status: execution planning gate only

Updated: 2026-08-01

## Purpose

This checklist defines the future production QA execution order for an indexed Opportunities release.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, or record publication transitions. The current Opportunities MVP must remain noindex-only until a separate implementation task explicitly changes that state after published-record gates pass.

## Core Rule

PRODUCTION_QA_CHECKLIST: ONE_RELEASE_AT_A_TIME

Run production QA for one release candidate at a time. Do not combine production QA execution with content publication, indexed output generation, newsletter launch, or Phase 5C closure.

## Step 1: Preflight Snapshot

PRODUCTION_QA_CHECKLIST: PREFLIGHT_SNAPSHOT

Before any future indexed-release deploy, record:

- Release candidate commit SHA.
- Changed scope.
- Expected Opportunities URLs.
- Expected indexed/noindex policy.
- Expected sitemap/RSS files.
- Expected JSON-LD surfaces.
- Expected newsletter surfaces.
- Rollback target commit SHA.

Stop condition:

If the release candidate SHA, expected URL set, or rollback target is unclear, stop before deploy.

## Step 2: Local Gate

PRODUCTION_QA_CHECKLIST: LOCAL_GATE

Before any future indexed-release deploy, run:

- `node src/tools/verify-opportunities-production-qa-readiness.js --self-test`
- `node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

Stop condition:

If local aggregate QA or diff check fails, stop before deploy.

## Step 3: Release Candidate Review

PRODUCTION_QA_CHECKLIST: RELEASE_CANDIDATE_REVIEW

Before production deploy, confirm the release candidate contains only the intended indexed-release changes:

- Published-record transition changes, if and only if separately approved.
- SEO robots/canonical changes, if and only if separately approved.
- JSON-LD output, if and only if structured-data gates passed.
- Sitemap/RSS output, if and only if sitemap/RSS gates passed.
- Newsletter output, if and only if newsletter gates passed.
- No unrelated production page rewrites.
- No paid, login, account, or procurement-posting features.

Stop condition:

If unrelated changes are present, stop before deploy.

## Step 4: Post-Deploy HTTP Verification

PRODUCTION_QA_CHECKLIST: POST_DEPLOY_HTTP

After a future deployment, verify production HTTP behavior:

- Listing URL returns HTTP 200.
- Each expected detail URL returns HTTP 200.
- Homepage/internal entry link is present.
- Canonical URLs match deployed URLs.
- Robots policy matches the approved release plan.
- Analytics marker is present.
- Official source CTA is present.
- Calculator CTA is present.

Stop condition:

If any required production URL fails HTTP or critical marker checks, rollback or keep noindex policy.

## Step 5: Post-Deploy Indexed Output Verification

PRODUCTION_QA_CHECKLIST: POST_DEPLOY_INDEXED_OUTPUT

After a future deployment, verify indexed output behavior:

- Sitemap includes only approved published Opportunities URLs.
- Sitemap excludes non-published Opportunities URLs.
- RSS/feed includes only approved published Opportunities URLs.
- RSS/feed excludes non-published Opportunities URLs.
- JSON-LD appears only for approved published Opportunities URLs.
- Newsletter output links only to published or intentionally noindex Opportunities pages.
- No non-published record appears in any indexable surface.

Stop condition:

If any non-published record appears in sitemap, RSS, JSON-LD, newsletter, or indexable pages, rollback or keep noindex policy.

## Step 6: Search Indexing Hold

PRODUCTION_QA_CHECKLIST: SEARCH_INDEXING_HOLD

Do not request search indexing until production QA confirms:

- Local aggregate QA passed.
- Production HTTP checks passed.
- Indexed output checks passed.
- Rollback/noindex fallback is ready.
- Archive report is ready to be written.

Stop condition:

If any check is pending, do not request indexing.

## Step 7: Failure Handling

PRODUCTION_QA_CHECKLIST: FAILURE_HANDLING

If production QA fails:

- Rollback to the recorded target commit or keep noindex policy.
- Remove or block unintended indexed output.
- Do not request indexing.
- Do not mark indexed release complete.
- Do not mark Phase 5C Closed.
- Write failure report with URL, expected result, actual result, and rollback decision.

## Step 8: Archive Handoff

PRODUCTION_QA_CHECKLIST: ARCHIVE_HANDOFF

Only after production QA passes, archive:

- Release candidate commit SHA.
- Production deployment target.
- Production URLs checked.
- Verification commands and results.
- Indexed output status.
- Newsletter output status.
- Rollback target.
- Known risks.
- Next single task.

## Current No-Execution Requirement

PRODUCTION_QA_CHECKLIST: CURRENT_NO_EXECUTION

This checklist task must not:

- Deploy production code.
- Add indexed robots policy.
- Add Opportunities URLs to sitemap.
- Add RSS/feed output.
- Add JSON-LD output.
- Add newsletter form/output.
- Change record publication states.
- Request search indexing.

## Next Implementation Boundary

This task only defines the production QA execution checklist and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, or change record publication states in this task.
