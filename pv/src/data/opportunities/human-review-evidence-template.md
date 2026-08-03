# Opportunities Human Review Evidence Template

Status: active guardrail

## Purpose

Define the minimum evidence required before an Opportunity draft may move from `discovered` to `needs_review`.

This template does not approve or publish any record. It only prepares a draft for human review.

## Scope

Use this template for every Opportunity record before changing:

`review_status: discovered`

to:

`review_status: needs_review`

Do not use this template to move a record to `approved` or `published`.

## Required Record Snapshot

Copy these fields from `opportunities.json` into the review note before human review starts:

- Opportunity ID:
- Slug:
- Title:
- Current record status:
- Current review status:
- Country:
- Region:
- Opportunity type:
- Technology tags:
- Buyer or issuer:
- Published date:
- Deadline:
- Source ID:
- Source reliability:
- Official source URL:
- Last verified:
- Quality score:

## Required Source Evidence

Before a record can move to `needs_review`, verify and record evidence for:

- Direct official source URL loads.
- Source ID exists in `sources.json`.
- Source status is `approved`.
- Source country matches the record country.
- Buyer or issuer is visible in the official source.
- Notice title is visible in the official source.
- Published date is visible, or intentionally empty with reason.
- Deadline is visible, or intentionally empty with reason.
- Status treatment is correct: `open`, `closing-soon`, `closed`, `cancelled`, `superseded`, or `unknown`.
- Solar, storage, microgrid, inverter, module, mounting, EV charging, or related power-system relevance is visible in official evidence.
- Summary can be traced to official evidence without invented claims.

## Required Human Review Fields

Add or update these fields in the matching `review-notes/{id}.md`:

- Reviewer:
- Review date:
- Decision:
- Source:
- Verification:

Decision must be one of:

- `send to needs_review`
- `keep discovered`
- `reject`

Only a human reviewer may choose `send to needs_review`.

## Required Verification Notes

The review note must state:

- Which official fields were checked.
- Which official fields are still missing or uncertain.
- Whether the record is active or closed at review time.
- Whether any amendments, cancellations, or superseding notices were found.
- Whether the record should remain below approval.
- Whether additional documents must be attached before approval.

## Allowed State Change

If all required evidence is present and the human reviewer chooses `send to needs_review`, the operator may change:

- `review_status` from `discovered` to `needs_review`
- `quality_score` only if evidence improves confidence, but keep it below `70`

The operator must not change:

- `review_status` to `approved`
- `review_status` to `published`
- `quality_score` to `70` or above

## Stop Conditions

STOP and keep the record at `discovered` when:

- Official source URL does not load.
- Source is no longer `approved`.
- Source country and record country do not match.
- Buyer, deadline, or scope cannot be verified.
- Solar relevance is inferred but not visible in official evidence.
- Notice is cancelled or superseded and the replacement is not reviewed.
- Review note is missing required fields.
- Human reviewer is not identified.
- Decision is not explicit.

## Publication Reminder

Moving a record to `needs_review` does not approve it for publication.

Publication still requires:

- Human `APPROVED` decision.
- Validator PASS.
- Release Gate PASS.
- Separate Phase 5C publication workflow.
