# PVSize Opportunities Status

Updated: 2026-07-28 23:38 CST

## Current Phase

Phase 5C: Negative Validation Fixtures

## Current State

Phase 5C negative validation fixtures are implemented through validator self-test mode. The validator now proves it fails missing, unknown, non-approved, and country-mismatched `source_id` cases. The data layer still has no public opportunity pages, sitemap entries, AI import jobs, or newsletter capture flows.

## Completed

- Phase 5-7 master plan created.
- Phase 5-7 runbook created.
- Phase 5-7 status file created.
- Historical Opportunities execution plan located in Obsidian.
- ADR-006 confirmed: opportunities appear after calculator value and trust surfaces.
- `docs/opportunities-architecture-audit.md` created.
- Architecture recommendation recorded: start with a static, file-backed, human-reviewed MVP before database/admin/AI ingestion.
- `src/data/opportunities/` created as a schema-only data directory.
- Opportunity, source, taxonomy, validation, URL, and calculator relation rules defined.
- Empty `opportunities.json` and `sources.json` records arrays created with no published records.
- `src/tools/validate-opportunities.js` added to enforce schema root structure, controlled taxonomy, unique ids/slugs, source quality fields, review-state thresholds, date format, and published-record safety rules.
- First official-source candidate registry added with 5 non-published sources across United States, European Union, and Japan.
- `src/data/opportunities/source-review-policy.md` added to define source approval checks, blocked statuses, draft record rules, human review rules, AI use rules, and publication gates.
- `src_us_sam_contract_opportunities` promoted from `needs_review` to `approved` for draft-only use after source policy review.
- `src/data/opportunities/draft-record-intake-checklist.md` added to define evidence requirements before any approved-source notice enters `opportunities.json`.
- First SAM.gov notice added to `opportunities.json` as `review_status: discovered` with `quality_score: 60`; it is not approved, not published, and not indexed.
- `src/tools/validate-opportunities.js` strengthened to enforce opportunity-to-source relationship checks.
- `src/tools/validate-opportunities.js --self-test` added to exercise negative source relationship fixtures without adding fixture data files.

## Current Constraints

- Do not start public indexed opportunity pages until sample data, validation rules, and source policy are in place.
- Do not invent opportunity data.
- Do not build paid/login features in MVP.
- Do not add AI ingestion or auto-publish before human review workflow exists.

## Last Commit

Pending this run: Add opportunities validator self-test

## Last Verification

Phase 5A validation passed:

- `node -e` JSON parse check for `opportunities.json`, `sources.json`, and `tags.json`
- `git diff --check`
- Schema marker check for opportunity records, review states, validation rules, calculator relation rules, and non-goals
- `node src/tools/validate-opportunities.js`
- Source policy marker check for statuses, approval checks, draft record rules, AI use rules, and publication gate
- SAM.gov source page checked: official contract opportunities procurement notice search, reachable without account for searching
- Draft intake checklist marker check for required evidence, draft defaults, SAM.gov checks, rejection conditions, and publication reminder
- SAM.gov notice checked: direct notice URL, Notice ID, agency, published date, due date, and PV/BESS/microgrid relevance visible
- Validator source relationship check: opportunity `source_id` must exist, must be `approved`, country must match, and source reliability must match
- Validator self-test checks missing `source_id`, unknown `source_id`, non-approved source, and country mismatch failure cases

## Risks And Gaps

- No persistent database or ORM exists.
- No auth/admin system exists.
- Email handling is FormSubmit-based, not newsletter/subscription infrastructure.
- No production scheduler exists for import jobs.
- Analytics is log-based through `/api/event/` and Vercel logs.
- Validation is local-only; it is not wired into an npm script or deployment gate because the repository has no root `package.json`.
- Source candidates are still editorial candidates. They are not approved for automated ingestion or publication.
- Only SAM.gov is approved for draft-only discovery. All other sources remain `needs_review`.
- No source is approved for automated ingestion or publication.
- First draft record is not publication-ready. It requires human review before approval or publication.
- Validator is still local-only; it is not wired into a deployment gate.

## Next Single Task

Prepare draft record human-review checklist for the first SAM.gov draft:

Create a review note for `opp_us_2026_0001` listing the remaining human checks needed before it can move from `discovered` to `needs_review` or `approved`. Do not change the record review status, publish pages, add AI import jobs, or add sitemap entries.

## User Decision Needed

No immediate decision needed for Phase 5A schema work.
