# PVSize Opportunities Production QA Go/No-Go Criteria

Status: go/no-go criteria planning gate only

Updated: 2026-08-01

## Purpose

This checklist defines the go/no-go criteria for a future indexed Opportunities production QA decision.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, indexed release approval, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

GO_NO_GO: REQUIRED_BEFORE_APPROVAL

Every future indexed-release decision must evaluate explicit GO, NO-GO, and HOLD criteria before approving indexed release, requesting indexing, or archiving Phase 5C closure evidence.

## Required Criteria Groups

GO_NO_GO: REQUIRED_GROUPS

Future go/no-go review must include:

- Release candidate criteria.
- Published-record criteria.
- Local QA criteria.
- Production HTTP criteria.
- Robots/canonical criteria.
- Sitemap/RSS criteria.
- JSON-LD criteria.
- Newsletter output criteria.
- Evidence bundle criteria.
- Signoff criteria.
- Decision log criteria.
- Fallback criteria.
- Risk criteria.
- Next single task criteria.

## GO Criteria

GO_NO_GO: GO_CRITERIA

Future indexed release may be GO only when:

- Release candidate commit SHA is recorded.
- All indexable Opportunities are `review_status: published`.
- Local aggregate QA passes.
- Production HTTP QA passes.
- Robots and canonical QA passes.
- Sitemap/RSS output includes only published Opportunities.
- JSON-LD output includes only published Opportunities.
- Newsletter output includes only published Opportunities.
- Evidence bundle is complete.
- Signoff checklist is complete.
- Decision log is complete.
- Fallback/noindex target is recorded.
- Known risks are accepted.
- Next single task is recorded.

## NO-GO Criteria

GO_NO_GO: NO_GO_CRITERIA

Future indexed release must be NO-GO when:

- Release candidate commit SHA is missing.
- Any indexable Opportunity is below `review_status: published`.
- Local aggregate QA fails.
- Production HTTP QA fails.
- Robots or canonical QA fails.
- Sitemap/RSS output includes a non-published Opportunity.
- JSON-LD output includes a non-published Opportunity.
- Newsletter output includes a non-published Opportunity.
- Evidence bundle is incomplete.
- Signoff checklist is incomplete.
- Decision log is incomplete.
- Fallback/noindex target is missing.
- Known risks are unaccepted.
- Next single task is missing.

## HOLD Criteria

GO_NO_GO: HOLD_CRITERIA

Future indexed release must HOLD when:

- Production state is unclear.
- Production deployment target is ambiguous.
- Verification evidence is stale.
- Sitemap/RSS output cannot be inspected.
- JSON-LD output cannot be inspected.
- Newsletter output cannot be inspected.
- Search indexing request is not separately approved.
- Fallback path cannot be verified.
- Archive closure evidence is incomplete.

## Current No-Approval Requirement

GO_NO_GO: CURRENT_NO_APPROVAL

This go/no-go criteria task must not:

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

This task only defines the indexed-release production QA go/no-go criteria and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, approve indexed release, or change record publication states in this task.
