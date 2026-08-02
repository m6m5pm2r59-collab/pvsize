# PVSize Opportunities Production QA Search Indexing Request Hold Checklist

Status: search indexing request hold planning gate only

Updated: 2026-08-02

## Purpose

This checklist defines the hold conditions that must be satisfied before any future search indexing request for Solar Opportunities.

It does not request search indexing, deploy production code, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, change record publication states, mark indexed release complete, approve indexed release, or mark Phase 5C Closed. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

SEARCH_INDEXING_HOLD: REQUIRED_BEFORE_REQUEST

Every future search indexing request must first pass this hold checklist. No indexing request may be submitted while any hold condition is active.

## Required Fields

SEARCH_INDEXING_HOLD: REQUIRED_FIELDS

Before a search indexing request may be considered, these fields must be confirmed:

- **Site verification**: Search Console property ownership is verified for pvsize.com.
- **Sitemap registration**: An Opportunities sitemap is registered in Search Console.
- **Robots policy**: All indexable Opportunities URLs have `robots: index,follow`.
- **Canonical URLs**: All indexable Opportunities URLs return correct canonical URLs.
- **Noindex fallback target**: A verified revert commit is documented with SHA and rollback time.
- **Published records**: Every indexable Opportunity record has `review_status: published`.
- **Local aggregate QA**: All verifiers pass with zero failures.
- **Production HTTP QA**: All indexable URLs return HTTP 200.
- **Structured data validation**: All indexable pages contain valid JSON-LD with published-record safety.
- **Sitemap output validation**: Sitemap contains only published Opportunity URLs.
- **RSS output validation**: RSS feed contains only published Opportunity items.
- **Newsletter output validation**: Newsletter output contains only published Opportunity content.
- **Evidence bundle**: Complete indexed-release evidence bundle exists and is signed off.
- **Indexing approval**: Separate indexing request approval from designated reviewer.

## Blocked Conditions

SEARCH_INDEXING_HOLD: BLOCKED_CONDITIONS

Any search indexing request must be BLOCKED while any of these conditions are true:

- Any indexable Opportunity is below `review_status: published`.
- Local aggregate QA has failures.
- Production HTTP QA has failures.
- Robots policy on any indexable page is not `index,follow`.
- Sitemap contains a non-published Opportunity URL.
- RSS feed contains a non-published Opportunity item.
- JSON-LD on any indexable page references a non-published Opportunity.
- Newsletter output contains a non-published Opportunity.
- Evidence bundle is incomplete or unsigned.
- Fallback revert commit SHA is not recorded.
- Production state is ambiguous.
- Verification evidence is stale.
- Indexing request is not separately approved.

## Release Conditions

SEARCH_INDEXING_HOLD: RELEASE_CONDITIONS

Search indexing request may be released only when:

- All blocked conditions are cleared.
- At least one published Opportunity exists.
- All published Opportunities pass local and production QA.
- Evidence bundle records all verification results.
- Separate indexing request approval is logged with reviewer, date, and scope.
- Revert commit is verified as operationally reachable.

## Evidence Requirements

SEARCH_INDEXING_HOLD: EVIDENCE_REQUIREMENTS

Before a search indexing request may be submitted, evidence must document:

- Search Console property ownership for pvsize.com.
- Sitemap registration containing only published Opportunities.
- Robots policy verification for all indexable Opportunities.
- Canonical URL verification for all indexable Opportunities.
- Published-record state verification for all indexable Opportunities.
- Local aggregate QA pass output.
- Production HTTP QA pass output.
- Structured data validation pass output.
- Sitemap output validation pass output.
- RSS output validation pass output.
- Newsletter output validation pass output.
- Indexing request approval with reviewer and date.
- Revert commit SHA with verification command.

## Current No-Request Requirement

SEARCH_INDEXING_HOLD: CURRENT_NO_REQUEST

This search indexing request hold checklist task must not:

- Submit a search indexing request.
- Deploy production code.
- Change robots policy.
- Add Opportunities URLs to sitemap.
- Add RSS/feed output.
- Add JSON-LD output.
- Add newsletter form/output.
- Change record publication states.
- Mark indexed release complete.
- Mark Phase 5C Closed.
- Approve indexed release.

## Next Implementation Boundary

This task only defines the indexed-release search indexing request hold checklist and verification rules.

Do not request indexing, deploy, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, mark Phase 5C Closed, approve indexed release, or change record publication states in this task.
