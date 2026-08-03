# PVSize Opportunities Phase 5C Noindex MVP Archive Decision

Status: active decision note

Updated: 2026-07-30

## Decision

The Phase 5C noindex Opportunities MVP is production verified and may be archived as the noindex baseline.

This decision does not close Phase 5C as a full publication pipeline. It only records that the current noindex listing and five detail briefs are live, traceable, locally verified, production verified, and intentionally excluded from public search indexing.

## Verified Scope

The verified noindex MVP includes:

- `/opportunities/`
- Five opportunity detail pages generated from `src/data/opportunities/opportunities.json`
- Official source CTAs
- Calculator CTAs
- Analytics script markers
- Production homepage entry link
- `noindex,follow` robots policy

## Verification Evidence

Local verification:

- `node src/tools/verify-opportunities-all.js` PASS

Optional production verification:

- `PVSIZE_VERIFY_PRODUCTION=1 node src/tools/verify-opportunities-all.js` PASS

Production evidence covered:

- `https://pvsize.com/opportunities/` returns HTTP 200
- All five detail pages return HTTP 200
- Listing and detail pages retain `noindex,follow`
- Listing and detail pages have no premature JSON-LD structured data
- Production sitemap excludes Opportunities URLs
- Production RSS/feed candidates do not expose Opportunities URLs
- Production homepage links to `/opportunities/`

## Still Noindex Only

The following remain intentionally not approved:

- Sitemap inclusion
- RSS feed publication
- Newsletter capture
- Structured data
- Indexed SEO launch
- Published opportunity record status
- Phase 5C full closure

## Requirements Before Indexed Release

Before any sitemap/RSS/newsletter/schema/indexed SEO release, PVSize must complete a separate task that verifies:

- Published record state model
- SEO title and meta description for listing and detail pages
- Canonical strategy
- Structured data schema and validation
- Sitemap inclusion rules
- RSS/feed content rules
- Newsletter capture and event tracking
- Index policy transition from noindex to indexable
- Production QA after the index policy change
- Archive report for indexed release

## Current Outcome

Accepted as production verified noindex MVP baseline.

Not accepted as full Phase 5C closure.

Next work should move to the next smallest Phase 5C publication capability only after confirming whether the priority is search/filter, newsletter capture, structured data, sitemap/RSS, or data status publication.
