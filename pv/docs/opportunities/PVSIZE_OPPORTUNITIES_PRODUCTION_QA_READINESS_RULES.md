# PVSize Opportunities Production QA Readiness Rules

Status: planning gate only

Updated: 2026-08-01

## Purpose

This document defines production QA readiness planning for a future indexed Opportunities release.

It does not approve deployment, indexed output, newsletter capture, sitemap/RSS output, JSON-LD output, or record publication transitions. The current Opportunities MVP must remain noindex-only until a later implementation task changes that policy after published-record gates pass.

## Core Rule

PRODUCTION_QA_RULE: LOCAL_AGGREGATE_FIRST

Before any indexed Opportunities release can be deployed, local QA must pass first:

- `node src/tools/verify-opportunities-production-qa-readiness.js --self-test`
- `node src/tools/verify-opportunities-all.js`
- `git diff --check`

## Pre-Deploy Checks

PRODUCTION_QA_RULE: PRE_DEPLOY_CHECKS

Future indexed release pre-deploy QA must include:

- Local aggregate Opportunities QA.
- Published-record index-policy self-test.
- SEO metadata verification.
- Structured-data rules verification.
- Sitemap/RSS rules verification.
- Newsletter rules verification.
- Analytics/CTA verification.
- HTTP verification.

## Deployment Boundary

PRODUCTION_QA_RULE: DEPLOYMENT_BOUNDARY

Production QA readiness planning does not deploy code.

Do not combine this planning gate with:

- Production deploy.
- Indexed robots policy changes.
- Sitemap/RSS output.
- JSON-LD output.
- Newsletter form/output.
- Published record transitions.

## Production HTTP Checks

PRODUCTION_QA_RULE: PRODUCTION_HTTP_CHECKS

After a future deployment, production QA must verify:

- Production listing/detail HTTP 200.
- Robots policy.
- Canonical URL.
- Homepage/internal entry link.
- Analytics marker.
- Official source CTA.
- Calculator CTA.

Production verification may use:

- `PVSIZE_VERIFY_PRODUCTION=1 node src/tools/verify-opportunities-all.js`

## Indexed Output Checks

PRODUCTION_QA_RULE: INDEXED_OUTPUT_CHECKS

Before any indexed release is accepted, production QA must verify:

- JSON-LD eligibility.
- Sitemap inclusion/exclusion.
- RSS/feed output.
- Newsletter form/output.
- Published-only record inclusion.
- No non-published Opportunity URL appears in sitemap, RSS, JSON-LD, newsletter, or indexable pages.

## Failure Handling

PRODUCTION_QA_RULE: ROLLBACK_OR_NOINDEX_FALLBACK

If production QA fails:

- Rollback or keep noindex policy.
- Do not request indexing.
- Do not mark indexed release complete.
- Do not close Phase 5C.

## Archive Requirement

PRODUCTION_QA_RULE: ARCHIVE_REQUIRED

After production QA passes, archive:

- Changed scope.
- Modified files.
- Verification commands and results.
- Deployment target.
- Production URLs.
- Known risks.
- Next single task.

## Current No-Deploy Requirement

PRODUCTION_QA_RULE: CURRENT_NO_DEPLOY

Current Opportunities pages must remain:

- Noindex-only.
- Without JSON-LD output.
- Without sitemap/RSS output.
- Without newsletter form/output.
- Without published record transitions.

## Next Implementation Boundary

This task only defines production QA readiness planning and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, or change record publication states in this task.
