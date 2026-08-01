# PVSize Opportunities Indexed Release Fallback Checklist

Status: fallback planning gate only

Updated: 2026-08-01

## Purpose

This checklist defines rollback and noindex fallback planning for a future indexed Opportunities production QA failure.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, or record publication transitions. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates.

## Core Rule

FALLBACK_CHECKLIST: NOINDEX_FIRST

If indexed-release production QA fails, restore or preserve `noindex,follow` before requesting indexing or marking the release complete.

## Step 1: Fallback Trigger

FALLBACK_CHECKLIST: FALLBACK_TRIGGER

Trigger rollback or noindex fallback when any future production QA check finds:

- Production listing/detail HTTP failure.
- Robots policy mismatch.
- Canonical URL mismatch.
- Sitemap includes non-published Opportunity URL.
- RSS/feed includes non-published Opportunity URL.
- JSON-LD appears for non-published Opportunity URL.
- Newsletter output links to unverifiable or non-published indexed URL.
- Analytics or CTA marker missing from required page.

Stop condition:

If any trigger fires, stop indexing actions immediately.

## Step 2: Rollback Target

FALLBACK_CHECKLIST: ROLLBACK_TARGET

Before any future indexed-release deployment, record:

- Last known good noindex commit SHA.
- Release candidate commit SHA.
- Deployment target.
- Expected Opportunities URL set.
- Expected sitemap/RSS output set.
- Expected JSON-LD output set.
- Expected newsletter output set.

Stop condition:

If the last known good noindex commit is not recorded, do not deploy an indexed release.

## Step 3: Noindex Fallback Actions

FALLBACK_CHECKLIST: NOINDEX_FALLBACK_ACTIONS

When fallback is needed, restore:

- Listing `noindex,follow`.
- Detail-page `noindex,follow`.
- Opportunities URL exclusion from sitemap.
- Opportunities URL exclusion from RSS/feed.
- JSON-LD removal for non-published records.
- Newsletter link removal for non-published indexed URLs.
- Search indexing request hold.

Stop condition:

If any indexed surface still exposes a non-published record, keep fallback active.

## Step 4: Verification After Fallback

FALLBACK_CHECKLIST: FALLBACK_VERIFICATION

After rollback or noindex fallback, run:

- `node src/tools/verify-opportunities-index-policy.js --self-test`
- `node src/tools/verify-opportunities-production-qa-readiness.js --self-test`
- `node src/tools/verify-opportunities-production-qa-execution-checklist.js --self-test`
- `node src/tools/verify-opportunities-indexed-release-fallback-checklist.js --self-test`
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

Stop condition:

If fallback verification fails, do not request indexing, do not mark indexed release complete, and do not close Phase 5C.

## Step 5: Production Recheck

FALLBACK_CHECKLIST: PRODUCTION_RECHECK

After a future fallback deploy, production QA must confirm:

- Listing/detail pages return HTTP 200 or intentional rollback status.
- Listing/detail pages use the fallback robots policy.
- Production sitemap excludes blocked Opportunities URLs.
- Production RSS/feed excludes blocked Opportunities URLs.
- Production JSON-LD excludes blocked Opportunities records.
- Production newsletter output excludes blocked Opportunities URLs.
- Homepage/internal entry link behavior matches the fallback plan.

Stop condition:

If production recheck fails, keep fallback active and write a failure report.

## Step 6: Indexing Hold

FALLBACK_CHECKLIST: INDEXING_HOLD

During fallback:

- Do not request Search Console indexing.
- Do not submit sitemap ping.
- Do not publish RSS/feed announcement.
- Do not send newsletter announcement.
- Do not mark indexed release complete.
- Do not mark Phase 5C Closed.

## Step 7: Failure Report

FALLBACK_CHECKLIST: FAILURE_REPORT

Every fallback event must archive:

- Failure trigger.
- Release candidate commit SHA.
- Rollback target commit SHA.
- URLs checked.
- Expected result.
- Actual result.
- Fallback action taken.
- Verification commands and results.
- Remaining risk.
- Next single task.

## Current No-Fallback-Execution Requirement

FALLBACK_CHECKLIST: CURRENT_NO_EXECUTION

This checklist task must not:

- Deploy production code.
- Change robots policy.
- Add Opportunities URLs to sitemap.
- Add RSS/feed output.
- Add JSON-LD output.
- Add newsletter form/output.
- Request search indexing.
- Change record publication states.

## Next Implementation Boundary

This task only defines indexed release rollback/noindex fallback checklist and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, or change record publication states in this task.
