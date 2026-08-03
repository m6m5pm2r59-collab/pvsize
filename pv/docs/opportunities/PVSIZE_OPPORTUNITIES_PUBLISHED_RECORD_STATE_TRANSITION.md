# PVSize Opportunities Published Record-State Transition

Status: draft gate

Updated: 2026-07-30

## Purpose

This document defines the record-state requirements before any Opportunity can move from the current noindex MVP baseline toward indexed publication.

It is a preparation document only. It does not publish records, remove `noindex`, add sitemap URLs, add RSS, add structured data, or close Phase 5C.

## Current Baseline

Current records in `src/data/opportunities/opportunities.json` remain:

- `review_status: discovered`
- non-indexed
- source-backed
- production visible only as noindex briefs

This is acceptable for the noindex MVP baseline.

## Required Published State

Before a record can become `review_status: published`, it must meet all conditions:

- `source_id` references an approved official source.
- `official_source_url` is a stable official URL.
- `source_reliability` matches the source registry score.
- `country`, `status`, `opportunity_type`, and `technology` use controlled taxonomy.
- `last_verified` is present and recent enough for the release task.
- `quality_score` is at least 80.
- `deadline` is either current or the public `status` is `closed`, `cancelled`, or `superseded`.
- Matching review/evidence note exists.
- The record is safe to present as public PVSize market intelligence.

## Required Indexable Channel State

Before the channel can become indexable, all selected published records must pass:

- Local aggregate QA.
- Optional production noindex QA before index policy change.
- SEO title and description review.
- Canonical URL review.
- Structured data design and validation.
- Sitemap inclusion rule.
- RSS/feed inclusion rule.
- Newsletter or subscription capture rule, if enabled.
- Production QA after index policy change.

## Forbidden Transitions

Forbidden:

- `discovered -> published`
- `parsed -> published`
- `needs_review -> published`
- noindex page -> sitemap inclusion without production QA
- noindex page -> structured data without schema validation
- noindex page -> RSS inclusion without feed QA

Allowed only through an explicit release task:

- `approved -> published`
- `published -> indexable`

## Validator Gap To Close

The current validator enforces several published-record safeguards, but indexed release still needs a dedicated transition check for:

- all selected published records having `quality_score >= 80`
- no `discovered` records entering sitemap/RSS/schema
- no stale open deadline entering indexed publication
- `published` records being the only records eligible for sitemap/RSS/schema

## Next Implementation Step

Add a validator or verifier rule that blocks sitemap/RSS/schema/indexable release unless all included Opportunity records have `review_status: published` and pass the published-state requirements above.
