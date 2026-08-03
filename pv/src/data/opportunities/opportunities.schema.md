# Opportunities Data Schema

Version: 0.1.0

Status: schema-only

## Purpose

Define the file-backed data shape for Solar Opportunities V1 before any public page generation, import pipeline, AI parsing, or newsletter capture is built.

This schema supports a verified static MVP. It is not a database migration and does not publish opportunity pages by itself.

## Files

- `opportunities.json`: verified opportunity records.
- `sources.json`: approved source registry.
- `tags.json`: controlled country, technology, type, status, and review-state taxonomy.

## Opportunity Record

Required fields for any real verified record:

- `id`: stable internal id, such as `opp_us_2026_0001`.
- `slug`: lowercase URL slug.
- `title`: public title.
- `status`: one of `open`, `closing-soon`, `closed`, `cancelled`, `superseded`, `unknown`.
- `country`: controlled country slug.
- `region`: state, prefecture, province, city, or `national`.
- `opportunity_type`: one of `tender`, `incentive`, `procurement-signal`.
- `technology`: one or more controlled technology tags.
- `buyer_or_issuer`: official buyer, agency, utility, company, or issuer.
- `published_date`: ISO date or empty string if not stated.
- `deadline`: ISO date or empty string if not stated.
- `source_language`: ISO language code or short language label.
- `last_verified`: ISO date.
- `official_source_url`: official public source URL.
- `overview`: short evidence-backed summary.
- `review_status`: one of the controlled review statuses.
- `quality_score`: integer 0-100.

Optional fields:

- `project_size`
- `estimated_value`
- `requirements`
- `eligibility`
- `relevance_notes`
- `source_id`
- `source_reliability`
- `tags`
- `related_calculators`
- `change_log`
- `official_documents`

## Source Record

Required fields:

- `id`
- `name`
- `url`
- `country`
- `source_type`
- `allowed_use_notes`
- `reliability_score`
- `last_checked`
- `status`

Allowed `source_type` values:

- `government-procurement`
- `utility-procurement`
- `agency-program`
- `company-rfi`
- `official-newsroom`
- `association`

## Review States

Lifecycle:

`discovered -> parsed -> verified -> published`

Terminal or alternate states:

- `rejected`
- `expired`
- `cancelled`
- `superseded`

Rules:

- `published` requires `approved` quality.
- `verified` requires official source URL, last verified date, and validator PASS.
- `expired`, `cancelled`, and `superseded` records may remain accessible later, but must not be promoted as open opportunities.
- AI may move a record through the verification workflow when source evidence, validator checks, and publication gates pass.

## Validation Rules

Minimum validation before page generation:

- `schema_version` exists.
- Data file root has `records` array.
- Every record has unique `id`.
- Every record has unique `slug` within country.
- `country`, `technology`, `opportunity_type`, `status`, and `review_status` must use controlled taxonomy.
- `official_source_url` must be present for real records.
- `last_verified` must be present for `approved` or `published`.
- `quality_score` must be 70 or above for `approved`.
- `quality_score` must be 80 or above for `published`.
- No `published` record may have `deadline` in the past unless status is `closed`, `expired`, `cancelled`, or `superseded`.
- No page may be indexed unless record is `published`.

## URL Rules

Public detail route:

`/opportunities/{country}/{slug}/`

Examples:

- `/opportunities/united-states/example-solar-rfp/`
- `/opportunities/japan/example-storage-subsidy/`

Country/category pages:

- Must not be indexed unless at least 5 published records exist for the route.
- Must include source and verification explanations.

## Calculator Relation Rules

Comply with ADR-006:

- Opportunities appear after calculator result and trust surfaces.
- Never place opportunity content before calculator task completion.
- Show at most 3 recommended opportunities.
- Hide the module if no relevant record exists.

## Non-Goals

This schema does not implement:

- Database storage.
- Authentication.
- Admin UI.
- Newsletter provider integration.
- AI import.
- Public opportunity pages.
- Sitemap inclusion.
