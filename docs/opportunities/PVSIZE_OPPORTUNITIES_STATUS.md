# PVSize Opportunities Status

Updated: 2026-07-28 20:58 CST

## Current Phase

Phase 5A: Sample Data Specification

## Current State

Phase 5A sample data specification is implemented as a schema-only, file-backed starting point. No real opportunity records, public opportunity pages, sitemap entries, AI import jobs, or newsletter capture flows have been added.

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

## Current Constraints

- Do not start public indexed opportunity pages until sample data, validation rules, and source policy are in place.
- Do not invent opportunity data.
- Do not build paid/login features in MVP.
- Do not add AI ingestion or auto-publish before human review workflow exists.

## Last Commit

`0f84b2e Define opportunities data schema`

## Last Verification

Phase 5A validation passed:

- `node -e` JSON parse check for `opportunities.json`, `sources.json`, and `tags.json`
- `git diff --check`
- Schema marker check for opportunity records, review states, validation rules, calculator relation rules, and non-goals

## Risks And Gaps

- No persistent database or ORM exists.
- No auth/admin system exists.
- Email handling is FormSubmit-based, not newsletter/subscription infrastructure.
- No production scheduler exists for import jobs.
- Analytics is log-based through `/api/event/` and Vercel logs.
- No executable validation script exists yet; current validation rules are documented but not automated.

## Next Single Task

Create a local validation script for the schema-only Opportunities data:

Add `src/tools/validate-opportunities.js` to validate `src/data/opportunities/opportunities.json`, `sources.json`, and `tags.json` against the documented required structure and controlled taxonomy. Do not publish pages or add real opportunity records.

## User Decision Needed

No immediate decision needed for Phase 5A schema work.
