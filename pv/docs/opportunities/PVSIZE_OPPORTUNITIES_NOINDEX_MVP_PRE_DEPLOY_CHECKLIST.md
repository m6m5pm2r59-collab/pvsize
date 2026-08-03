# PVSize Opportunities Noindex MVP Pre-Deploy Checklist

Status: active checklist

Updated: 2026-07-30

## Purpose

This checklist defines the pre-deploy and production verification requirements for the current Phase 5C noindex Opportunities MVP.

The current MVP includes:

- `/opportunities/`
- Five generated opportunity detail pages.
- Official source links.
- Calculator CTAs.
- Analytics script markers.
- `noindex,follow` robots policy.

This checklist does not approve sitemap inclusion, RSS, newsletter capture, structured data, or indexed SEO release.

## Gate 1: Local Aggregate QA

Required before deploy:

- `node src/tools/verify-opportunities-all.js` PASS.
- `git diff --check` PASS.
- Working tree contains only the intended Opportunities changes.

Expected aggregate coverage:

- Opportunity data validator.
- Detail page generation.
- Listing and detail HTML verification.
- Noindex/index-policy verification.
- Analytics and CTA marker verification.
- Local HTTP verification for listing plus all five detail pages.

Fail action:

STOP. Fix local QA before deployment.

## Gate 2: Noindex Policy

Required before deploy:

- `/opportunities/` contains `noindex,follow`.
- Each detail page contains `noindex,follow`.
- Opportunities URLs are absent from `src/sitemap.xml`.
- Opportunities pages do not include JSON-LD structured data.
- Opportunities pages do not expose RSS feed links.

Fail action:

STOP. Do not deploy a page that can be indexed before production verification approves indexing.

## Gate 3: Route And Content

Required before deploy:

- `/opportunities/` loads locally with HTTP 200.
- All five detail routes load locally with HTTP 200.
- Listing links to every generated detail page.
- Each detail page links back to `/opportunities/`.
- Every opportunity card has an official source CTA.
- Every detail page has an official source CTA.
- Calculator CTAs are data-driven from `related_calculators`.

Fail action:

STOP. Keep the MVP local until routes and CTAs pass.

## Gate 4: Production Verification

Required after deploy:

- `https://pvsize.com/opportunities/` returns HTTP 200.
- All five detail URLs return HTTP 200.
- Production HTML keeps `noindex,follow`.
- Production HTML has no JSON-LD structured data on Opportunities pages.
- Production sitemap still excludes Opportunities URLs.
- Production RSS/feed files do not expose Opportunities URLs.
- Homepage or approved internal entry point links to `/opportunities/`.
- No unexpected console-blocking page errors are observed if browser verification is available.

Fail action:

STOP. Do not mark Phase 5C Closed.

## Gate 5: Archive

Required before marking this noindex MVP verification complete:

- Status file records the deploy target and verification result.
- Report file records local QA, production URL checks, risks, and next task.
- Git commit and push are complete.
- No production P0 regression is known.

Fail action:

STOP. Keep Phase 5C open.

## Explicit Non-Approvals

The following remain not approved by this checklist:

- Sitemap inclusion.
- RSS feed publication.
- Newsletter capture.
- Structured data.
- Indexed SEO launch.
- Published opportunity record status.
- Phase 5C Closed.

These require a separate production verification task after the noindex MVP is proven stable.
