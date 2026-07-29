# Opportunities Human Review Authorization Log

Status: active governance record

## Purpose

Record explicit human reviewer decisions before any Opportunity record moves beyond `discovered`.

This log exists because AI operators may prepare evidence packets, but may not supply the human decision required by the release gate.

## Allowed Use

Use this log only for Phase 5B human-review rehearsal and future human review workflow.

This log may authorize:

- `discovered` -> `needs_review`

This log must not authorize:

- `needs_review` -> `approved`
- `approved` -> `published`
- Any public page generation
- Sitemap, RSS, newsletter, or SEO index work

Those actions require later gates.

## Required Authorization Entry

Each authorization entry must include:

- Opportunity ID:
- Reviewer name:
- Reviewer role:
- Review date:
- Decision:
- Evidence packet:
- Source URL checked:
- Scope checked:
- Deadline checked:
- Status checked:
- Known gaps:
- Allowed state change:
- Explicit publication decision:

Decision must be one of:

- `send to needs_review`
- `keep discovered`
- `reject`

Allowed state change must be one of:

- `none`
- `discovered -> needs_review`

Explicit publication decision must be:

- `not approved for publication`

## Authorization Template

Copy this block for each human review decision:

```text
## Authorization: {opportunity_id}

Opportunity ID:
Reviewer name:
Reviewer role:
Review date:
Decision:
Evidence packet:
Source URL checked:
Scope checked:
Deadline checked:
Status checked:
Known gaps:
Allowed state change:
Explicit publication decision: not approved for publication
```

## Current Authorizations

No human authorizations recorded yet.

## Stop Conditions

STOP and keep the record at `discovered` when:

- Reviewer name is missing.
- Reviewer role is missing.
- Review date is missing.
- Decision is missing or ambiguous.
- Evidence packet is not referenced.
- Source URL was not checked.
- Deadline or status was not checked.
- Allowed state change is not explicit.
- Publication decision is missing.
- Publication decision is anything other than `not approved for publication`.

## Publication Reminder

This log can only move a record into human review.

It cannot approve or publish an Opportunity.
