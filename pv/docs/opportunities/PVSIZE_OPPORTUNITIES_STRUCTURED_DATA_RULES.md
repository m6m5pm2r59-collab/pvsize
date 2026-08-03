# PVSize Opportunities Structured Data Rules

Status: planning gate only

Updated: 2026-07-30

## Purpose

This document defines structured data rules for future indexed Opportunities pages.

It does not approve JSON-LD output. The current Opportunities MVP must remain noindex-only and must not include structured data until a later implementation task passes published-record gates.

## Core Rule

STRUCTURED_DATA_RULE: PUBLISHED_ONLY

Only records with `review_status: published` may appear in Opportunities JSON-LD.

Non-published records must remain excluded from:

- JSON-LD.
- Sitemap.
- RSS.
- Newsletter content.
- Indexed pages.

## Allowed Schema Planning

STRUCTURED_DATA_RULE: ALLOWED_SCHEMA_TYPES

Allowed schema types for future planning:

- `WebPage` for indexable Opportunity detail pages.
- `ItemList` for indexable Opportunities listing pages.

Do not use `JobPosting`, `Event`, `Product`, `Offer`, or `GovernmentService` unless source evidence and legal review clearly support the type in a later task.

## Allowed Fields

STRUCTURED_DATA_RULE: ALLOWED_FIELDS

Allowed fields must be backed by `opportunities.json` and official source evidence:

- `@context`
- `@type`
- `name`
- `description`
- `url`
- `datePublished`
- `validThrough`
- `provider`
- `areaServed`
- `about`
- `isBasedOn`

## Blocked Fields

STRUCTURED_DATA_RULE: BLOCKED_FIELDS

Blocked fields:

- Award likelihood.
- Inferred budget.
- Inferred buyer intent.
- Contact details not present in the official source.
- Pricing.
- Application instructions invented by PVSize.
- Any field generated only from AI confidence.

## Required Verification

STRUCTURED_DATA_RULE: REQUIRED_VERIFICATION

Before JSON-LD can be added:

- Record status verifier confirms `review_status: published`.
- SEO metadata verifier passes.
- Index-policy verifier self-test passes.
- Structured-data verifier confirms non-published records fail when injected into JSON-LD fixtures.
- Aggregate QA passes.

## Current No-Output Requirement

STRUCTURED_DATA_RULE: CURRENT_NO_OUTPUT

Current `/opportunities/` listing and detail pages must not contain:

- `<script type="application/ld+json">`
- `application/ld+json`
- JSON-LD fields for Opportunities.

## Next Implementation Boundary

This task only defines planning and verification rules.

Do not add JSON-LD output, sitemap/RSS, newsletter output, or published record transitions in this task.
