# PVSize Opportunities Status

Updated: 2026-07-29 21:58 CST

## Current Phase

Phase 5B: Content Production & Human Review

## Current State

Phase 5B content production and human review guardrail is implemented. Five non-published draft records now exist with matching structured review notes. Two official U.S. sources are approved for draft-only discovery. All records remain `discovered` and non-published; the data layer still has no public opportunity pages, sitemap entries, AI import jobs, or newsletter capture flows.

The approval rehearsal has started at the governance layer only: a human-review evidence template now defines the minimum checks before any record can move from `discovered` to `needs_review`. No record has been advanced, approved, published, indexed, or exposed publicly.

The first human-review rehearsal evidence packet was added for `opp_us_2026_0004`. Official evidence is sufficient to prepare the record for human review, but the record remains `discovered` because no identified human reviewer has chosen `send to needs_review`.

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
- `src/data/opportunities/review-notes/opp_us_2026_0001.md` added with checks required before moving the first draft from `discovered` to `needs_review` or `approved`.
- Review note fields added: reviewer, review date, decision, source, and verification.
- `src/tools/validate-opportunities.js` now requires every opportunity record to have a matching review note with required markers.
- `docs/opportunities/PVSIZE_PHASE5B_TO_PHASE5C_PUBLICATION_RELEASE_GATE.md` added as the mandatory gate before frontend, sitemap, RSS, newsletter, SEO, or publication work.
- `src_us_grants_search` promoted from `needs_review` to `approved` for draft-only funding and incentive discovery after official source review.
- First Grants.gov/Simpler.Grants.gov solar funding draft added as `review_status: discovered` and `status: closed`; it is not approved, not published, and not indexed.
- `src/data/opportunities/review-notes/opp_us_2026_0002.md` added for the Grants.gov draft.
- Additional SAM.gov microgrid/PV/BESS draft added as `review_status: discovered` and `status: closed`; it is not approved, not published, and not indexed.
- `src/data/opportunities/review-notes/opp_us_2026_0003.md` added for the new SAM.gov draft.
- Active SAM.gov USGS communications infrastructure draft added as `review_status: discovered` and `status: open`; it is not approved, not published, and not indexed.
- `src/data/opportunities/review-notes/opp_us_2026_0004.md` added for the new SAM.gov draft.
- Closed SAM.gov U.S. Army 63rd Readiness Division microgrid draft added as `review_status: discovered` and `status: closed`; it is not approved, not published, and not indexed.
- `src/data/opportunities/review-notes/opp_us_2026_0005.md` added for the new SAM.gov draft.
- `src/data/opportunities/human-review-evidence-template.md` added to define the Phase 5B evidence requirements before moving any draft from `discovered` to `needs_review`.
- First human-review rehearsal evidence packet added to `src/data/opportunities/review-notes/opp_us_2026_0004.md`; the record remains `discovered` because AI cannot provide the required human reviewer decision.

## Current Constraints

- Do not start public indexed opportunity pages until sample data, validation rules, and source policy are in place.
- Do not invent opportunity data.
- Do not build paid/login features in MVP.
- Do not add AI ingestion or auto-publish before human review workflow exists.

## Last Commit

Pending this run: Add first human review rehearsal evidence

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
- Human review note marker check for current evidence, checks before `needs_review`, checks before `approved`, and publication gate reminder
- Validator self-test checks missing review note failure case
- Release gate marker check for source readiness, content readiness, human review, publication readiness, growth readiness, production gate, and Phase 5C entry conditions
- Grants.gov Search Grants page checked as an official public source for draft-only funding and incentive discovery
- Validator self-test non-approved source fixture updated to use a still-unapproved EU source after Grants.gov approval
- Grants.gov/Simpler.Grants.gov SolWEB2 listing checked: direct official URL, title, DOE Golden Field Office agency, solar/ecosystem/agrivoltaics scope, funding opportunity number, archived status, and official documents visible
- SAM.gov JBMDL microgrid notice checked: direct official URL, notice ID, agency, response date, PV/BESS/microgrid relevance, and closed status due passed deadline
- SAM.gov USGS communications infrastructure notice checked: direct official URL, notice ID, agency, response date, solar power systems, backup battery arrays, and open status at intake time
- SAM.gov U.S. Army 63rd Readiness Division MILCON ERCIP Microgrid notice checked: direct official URL, notice ID, agency, response date, Mountain View California location, 750kW PV solar, 750kWh BESS, and closed status due passed deadline
- Human review evidence template marker check for record snapshot, source evidence, human review fields, allowed state change, stop conditions, and publication reminder
- `opp_us_2026_0004` human-review rehearsal checked: direct official URL, source registry, country/source match, notice title, notice ID, published date, response deadline, issuer, solar relevance, storage relevance, and no known cancellation/supersession at rehearsal time

## Risks And Gaps

- No persistent database or ORM exists.
- No auth/admin system exists.
- Email handling is FormSubmit-based, not newsletter/subscription infrastructure.
- No production scheduler exists for import jobs.
- Analytics is log-based through `/api/event/` and Vercel logs.
- Validation is local-only; it is not wired into an npm script or deployment gate because the repository has no root `package.json`.
- Source candidates are still editorial candidates. They are not approved for automated ingestion or publication.
- SAM.gov and Grants.gov are approved for draft-only discovery. EU and Japan sources remain `needs_review`.
- No source is approved for automated ingestion or publication.
- Draft records are not publication-ready. They require human review before approval or publication.
- Validator is still local-only; it is not wired into a deployment gate.
- Human review note exists and is structurally validated, but the review itself is not complete.
- Phase 5C has not started. The release gate explicitly blocks frontend/publication work until entry conditions pass.

## Next Single Task

Continue Phase 5B content production:

Continue Phase 5B human-review rehearsal: either obtain an identified human reviewer decision for `opp_us_2026_0004` before moving it to `needs_review`, or repeat the evidence-packet rehearsal for another existing draft. Do not move any record to `approved`; keep Phase 5C frontend, sitemap, RSS, newsletter, AI import jobs, and publication-state changes blocked.

## User Decision Needed

No immediate decision needed for Phase 5A schema work.
