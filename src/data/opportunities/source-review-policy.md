# Opportunities Source Review Policy

Status: active guardrail

## Purpose

Define when an official source can be used to create Solar Opportunities draft records.

This policy prevents PVSize from treating a source registry entry as publishable just because the source is official. A source may be official and still require editorial checks before it can feed public Opportunity pages.

## Source Statuses

Allowed source statuses:

- `needs_review`: candidate source. It may be inspected manually, but it must not feed automated import or public pages.
- `approved`: source has passed manual review and may feed draft opportunity records.
- `rejected`: source must not be used.
- `expired`: source was once useful but is no longer active.
- `cancelled`: source was removed or no longer fits the product scope.
- `superseded`: source has a newer replacement source.

Blocked for draft record creation:

- `needs_review`
- `rejected`
- `expired`
- `cancelled`
- `superseded`

Allowed for draft record creation:

- `approved`

## Approval Checks

A source may move from `needs_review` to `approved` only after all checks pass:

- The source is an official public source, not a copied paid database or third-party scraper.
- The source URL is reachable in a normal browser.
- The source has clear procurement, funding, incentive, or market-signal relevance.
- The source provides enough detail to verify issuer, geography, deadline, and official documents.
- The source can be filtered for solar, storage, grid, inverter, module, mounting, or EV charging relevance.
- The source terms do not clearly prohibit citation, summary, or linking.
- The source has a stable URL pattern or a stable search page.
- The source country matches controlled taxonomy in `tags.json`.
- The source type matches controlled values in `opportunities.schema.md`.

## Draft Record Rules

Draft opportunity records may be created only from `approved` sources.

Draft records must start below publication state:

- `discovered`
- `parsed`
- `needs_review`

Draft records must not start as:

- `approved`
- `published`

## Human Review Rules

Human review is required before any opportunity record moves to `approved` or `published`.

Human review must verify:

- Official source URL.
- Buyer, issuer, agency, or utility.
- Country and region.
- Opportunity type.
- Technology tags.
- Published date, if available.
- Deadline, if available.
- Eligibility or procurement scope.
- Whether the opportunity is still open.
- Whether PVSize summary text is accurate and not overclaiming.

## AI Use Rules

AI may help with:

- Finding candidate notices within approved sources.
- Extracting title, date, issuer, deadline, and tags.
- Drafting a short neutral summary.
- Flagging uncertainty.

AI may not:

- Approve a source.
- Approve an opportunity record.
- Publish a record.
- Invent missing deadlines, values, eligibility, or project size.
- Rewrite a third-party notice as if PVSize verified unstated facts.

## Publication Gate

No Opportunity page may be generated, linked, indexed, or added to sitemap unless:

- Source status is `approved`.
- Opportunity `review_status` is `published`.
- `quality_score` is 80 or above.
- Official source URL is present.
- `last_verified` is present.
- Deadline is not stale unless the record is explicitly closed, cancelled, expired, or superseded.
