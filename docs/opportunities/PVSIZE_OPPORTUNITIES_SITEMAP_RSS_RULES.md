# PVSize Opportunities Sitemap And RSS Rules

Status: planning gate only

Updated: 2026-07-30

## Purpose

This document defines sitemap and RSS rules for future indexed Opportunities distribution.

It does not approve sitemap or RSS output. The current Opportunities MVP must remain noindex-only and must not include Opportunities URLs in sitemap, RSS, feed alternates, or indexed release surfaces until a later implementation task passes published-record gates.

## Core Rule

SITEMAP_RSS_RULE: PUBLISHED_ONLY

Only records with `review_status: published` may appear in Opportunities sitemap or RSS output.

Non-published records must remain excluded from:

- `src/sitemap.xml`
- `src/opportunities.xml`
- `src/opportunities.rss`
- `src/opportunities/feed.xml`
- `src/opportunities/rss.xml`
- RSS alternate links on listing or detail pages

## Canonical URL Rule

SITEMAP_RSS_RULE: CANONICAL_MATCH

Future sitemap and RSS URLs must match the canonical URL on the corresponding Opportunities page.

Each Opportunity detail URL must follow:

`https://pvsize.com/opportunities/{slug}/`

## Feed Field Rule

SITEMAP_RSS_RULE: ALLOWED_FEED_FIELDS

Future RSS entries may include only fields backed by `opportunities.json` and official source evidence:

- Title.
- Canonical detail URL.
- Description or overview.
- Published date when verified.
- Source label.
- Country or region.
- Status.

## Blocked Feed Rule

SITEMAP_RSS_RULE: BLOCKED_FEED_FIELDS

Future RSS entries must not include:

- Inferred budget.
- Award likelihood.
- Inferred buyer intent.
- Contact details not present in the official source.
- Application instructions invented by PVSize.
- Any field generated only from AI confidence.

## Required Verification

SITEMAP_RSS_RULE: REQUIRED_VERIFICATION

Before sitemap or RSS output can be added:

- Record status verifier confirms `review_status: published`.
- SEO metadata verifier passes.
- Structured-data rules verifier passes.
- Index-policy verifier self-test passes.
- Sitemap/RSS verifier confirms non-published records fail when injected into sitemap/RSS fixtures.
- Aggregate QA passes.

## Current No-Output Requirement

SITEMAP_RSS_RULE: CURRENT_NO_OUTPUT

Current Opportunities pages must not contain:

- RSS alternate links.
- Opportunities RSS/feed files.
- Opportunities URLs in `src/sitemap.xml`.

## Next Implementation Boundary

This task only defines planning and verification rules.

Do not add sitemap/RSS output, JSON-LD output, newsletter output, or published record transitions in this task.
