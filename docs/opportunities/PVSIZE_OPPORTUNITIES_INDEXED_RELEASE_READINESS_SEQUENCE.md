# PVSize Opportunities Indexed Release Readiness Sequence

Status: active readiness sequence

Updated: 2026-07-30

## Purpose

This document defines the required order for moving the current noindex Opportunities MVP toward any indexed release.

It is a sequencing gate, not an implementation approval. Passing one step only allows the next step to be planned or implemented in a separate task.

## Current Baseline

The current Opportunities channel baseline is:

- `/opportunities/` listing exists.
- Five generated Opportunity detail briefs exist.
- Listing and detail pages are production verified as noindex-only.
- Opportunity records remain below `review_status: published`.
- Opportunities URLs are excluded from sitemap, RSS, and JSON-LD structured data.
- Local aggregate QA runs the published-record index-policy self-test.

## Core Rule

No indexed surface may include an Opportunity unless that record is explicitly eligible for indexed release.

Required sequence:

`record status -> SEO metadata -> structured data -> sitemap/RSS -> newsletter -> production QA -> archive`

Forbidden sequence:

`discovered or draft record -> sitemap/RSS/schema/indexed page`

## Step 1: Record Status Readiness

Before any Opportunity can become indexable, confirm:

- `review_status` is `published`.
- `status` is current and not misleading.
- `source_id` exists and points to an approved source.
- Official source URL is still reachable or intentionally archived.
- Deadline and publication dates are current or intentionally empty.
- Country, category, technology, and opportunity type use controlled taxonomy.
- `quality_score` remains within the publishable range defined by the validator.
- The record has a matching evidence note.

Stop condition:

If any item fails, keep the record out of sitemap, RSS, schema, newsletter, and indexed pages.

## Step 2: SEO Metadata Readiness

After record status readiness passes, define SEO metadata before adding structured data or feeds:

- Page title.
- Meta description.
- Canonical URL.
- Open Graph title and description.
- Robots policy change from `noindex,follow` to indexable policy.
- Internal link intent.
- Duplicate or expired-opportunity handling.

Stop condition:

If metadata cannot be generated without overstating source evidence, keep the page noindex.

## Step 3: Structured Data Readiness

Only after SEO metadata readiness passes, add structured data planning:

- Select allowed schema type for the record.
- Include only fields backed by the Opportunity record and official source evidence.
- Do not include inferred budget, award likelihood, buyer intent, or contact information unless present in the source.
- Verify JSON-LD is absent for non-published records.
- Verify JSON-LD is present only for published indexable records.

Stop condition:

If structured data would require unsupported claims, skip schema and keep the page out of indexed release.

## Step 4: Sitemap And RSS Readiness

Only after structured data readiness passes, add sitemap and RSS planning:

- Sitemap inclusion must be generated from published records only.
- RSS inclusion must be generated from published records only.
- Non-published records must fail the index-policy self-test when injected into sitemap, schema, or RSS fixtures.
- Sitemap URLs must match canonical URLs.
- RSS entries must link to canonical detail pages.
- Expired or archived records need explicit inclusion rules before any feed launch.

Stop condition:

If sitemap/RSS cannot prove published-only inclusion, do not ship sitemap/RSS changes.

## Step 5: Newsletter Readiness

Only after sitemap and RSS readiness passes, define newsletter capture and distribution:

- Subscription form target.
- Consent copy.
- Success and error states.
- Analytics events.
- No real email submission during QA.
- No paid, login, or account requirement in MVP.
- Newsletter content must link only to published or intentionally noindex pages.

Stop condition:

If consent, storage, or event tracking is unclear, do not launch newsletter capture.

## Step 6: Production QA Readiness

Before any indexed release is deployed, run:

- Local aggregate Opportunities QA.
- Published-record index-policy self-test.
- SEO metadata marker checks.
- Structured data validation checks.
- Sitemap/RSS published-only checks.
- Analytics and CTA checks.
- HTTP checks for listing and detail pages.
- Production verification after deployment.

Stop condition:

If production check fails, rollback or keep noindex policy and do not mark indexed release complete.

## Step 7: Archive

After production QA passes, archive:

- Changed scope.
- Modified files.
- Verification commands and results.
- Deployment target.
- Production URLs.
- Known risks.
- Next single task.

Phase 5C can close only after indexed release QA and archive are complete.

## Next Implementation Order

The next implementation tasks must stay in this order:

1. Add machine-checkable readiness markers for indexed release.
2. Add SEO metadata verification for Opportunities pages.
3. Add structured data generation for published records only.
4. Add sitemap and RSS generation for published records only.
5. Add newsletter capture after indexed content gates pass.
6. Run production QA and archive.

Do not combine these into one task.
