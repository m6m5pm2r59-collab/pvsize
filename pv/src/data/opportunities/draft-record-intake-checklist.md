# Opportunities Draft Record Intake Checklist

Status: active guardrail

## Purpose

Define the checks required before a SAM.gov notice, or any future approved source notice, can become a non-published draft record in `opportunities.json`.

This checklist exists because source approval does not equal record approval. Each opportunity must be verified as its own unit before it can enter the data file.

## Intake Decision

Create a draft record only when all required fields can be filled from official source evidence.

If any required field is uncertain, do not create the record. Leave the notice out of `opportunities.json` and record the gap in an operator report.

## Required Evidence

Before creating a draft record, verify:

- Official source URL points to the exact notice, not only a search page.
- Source id exists in `sources.json`.
- Source status is `approved`.
- Notice title is visible on the official source.
- Buyer, issuer, agency, or utility is visible on the official source.
- Country and region can be determined from the official source.
- Opportunity type can be classified as `tender`, `incentive`, or `procurement-signal`.
- Technology tags can be chosen from `tags.json`.
- Published date is visible, or the field is intentionally empty.
- Deadline is visible, or the field is intentionally empty.
- The notice is not clearly cancelled, superseded, or stale.
- Summary can be written without inventing facts.

## Draft Record Defaults

New draft records must start with:

- `review_status`: `discovered` or `needs_review`
- `quality_score`: below 70 unless a human has completed full review
- `source_id`: approved source id
- `last_verified`: date the official notice was checked

New draft records must not start with:

- `review_status`: `approved`
- `review_status`: `published`
- `quality_score`: 80 or above

## SAM.gov Specific Checks

For SAM.gov notices, verify:

- Notice URL is the direct SAM.gov notice detail page.
- Solicitation or notice identifier is visible.
- Contracting office or agency is visible.
- Notice type or opportunity type is visible.
- Response deadline or due date is visible, unless SAM.gov shows no deadline.
- Place of performance or applicable region is visible, if stated.
- Solar, storage, microgrid, inverter, module, mounting, EV charging, or related electrical scope is visible in the official notice.

## Rejection Conditions

Do not create a draft record when:

- The notice is only available from a third-party copied database.
- The source URL is a search result without a stable notice URL.
- Solar relevance is inferred but not visible in official text.
- Deadline, issuer, or scope cannot be checked.
- The notice appears closed, cancelled, or superseded and has no archival value.
- The summary would require guessing.

## Publication Reminder

Draft intake never publishes content.

Public Opportunity pages require the separate publication gate in `source-review-policy.md`.
