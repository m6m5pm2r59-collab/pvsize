# PVSize Opportunities Status

Updated: 2026-07-28 22:18 CST

## Current Phase

Phase 5B: Source Candidate Approval

## Current State

Phase 5B source candidate approval is implemented for one source. SAM.gov Contract Opportunities is approved for draft-only opportunity discovery; the data layer still has no real opportunity records, public opportunity pages, sitemap entries, AI import jobs, or newsletter capture flows.

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

## Current Constraints

- Do not start public indexed opportunity pages until sample data, validation rules, and source policy are in place.
- Do not invent opportunity data.
- Do not build paid/login features in MVP.
- Do not add AI ingestion or auto-publish before human review workflow exists.

## Last Commit

`90dd2d7 Approve SAM.gov opportunities source`

## Last Verification

Phase 5A validation passed:

- `node -e` JSON parse check for `opportunities.json`, `sources.json`, and `tags.json`
- `git diff --check`
- Schema marker check for opportunity records, review states, validation rules, calculator relation rules, and non-goals
- `node src/tools/validate-opportunities.js`
- Source policy marker check for statuses, approval checks, draft record rules, AI use rules, and publication gate
- SAM.gov source page checked: official contract opportunities procurement notice search, reachable without account for searching

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

## Next Single Task

Create the first SAM.gov draft opportunity record template:

Add one clearly non-published `discovered` or `needs_review` draft record structure from the approved SAM.gov source only if every required field can be filled from an official notice. If no suitable official notice can be verified safely in one round, create a draft-record intake checklist instead. Do not publish pages, AI import jobs, or sitemap entries.

## User Decision Needed

No immediate decision needed for Phase 5A schema work.
