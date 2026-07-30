# PVSize Opportunities Status

Updated: 2026-07-30 09:00 CST

## Current Phase

Phase 5C: Publication Pipeline

## Current State

User decision on 2026-07-29 cancelled all human authorization and human review requirements. Channel expansion is now the first priority. Phase 5B content production baseline is sufficient to proceed: five non-published draft records exist with matching evidence notes, and two official U.S. sources are approved for draft-only discovery.

The mainline has moved to Phase 5C Publication Pipeline. The first non-indexed `/opportunities/` listing surface has been added using the five verified draft records. Existing records remain below published status in the data file. Noindex MVP production verification has passed, but sitemap/RSS/newsletter/schema/indexed SEO release remains separately gated.

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
- `src/data/opportunities/human-review-authorization-log.md` added to define how a named human reviewer decision must be recorded before any draft can move from `discovered` to `needs_review`.
- User decision recorded: human authorization and human review are no longer blocking requirements; Phase 5C channel expansion is now first priority.
- Publication release gate updated to use source verification, validator checks, and production QA instead of human-review blocking.
- Opportunities master plan, runbook, and schema updated to remove human-review blocking language.
- First non-indexed `/opportunities/` listing surface added at `src/opportunities/index.html` using five source-backed opportunity records.
- `src/tools/verify-opportunities-page.js` added to make `/opportunities/` noindex, card count, official source link, calculator link, and no-schema checks repeatable without Playwright.
- Internal entry links to `/opportunities/` added on homepage navigation and partners navigation/footer; verification script now checks these links.
- First non-indexed opportunity detail page added for `opp_us_2026_0004` at `/opportunities/usgs-communications-site-infrastructure-idiq/`; listing now links to the detail brief.
- `src/tools/verify-opportunities-page.js` now reads `opportunities.json` to verify listing titles, official source URLs, and card count from data instead of hardcoded opportunity arrays.
- Second non-indexed opportunity detail page added for `opp_us_2026_0001` at `/opportunities/178th-wing-base-microgrid-construction/`; listing now links to the detail brief and the page verification covers two detail pages.
- `src/tools/generate-opportunity-detail-pages.js` added as the reusable Phase 5C detail-page generator for the current two noindex detail briefs.
- Existing two noindex detail pages regenerated from `opportunities.json`; page verification now checks that the generator exists.
- Third non-indexed opportunity detail page added for `opp_us_2026_0003` at `/opportunities/jbmdl-power-generation-microgrid-construction/`; listing now links to the detail brief and the generator plus verification script cover three detail pages.
- Fourth non-indexed opportunity detail page added for `opp_us_2026_0005` at `/opportunities/63rd-readiness-division-milcon-ercip-microgrid/`; listing now links to the detail brief and the generator plus verification script cover four detail pages.
- Fifth non-indexed opportunity detail page added for `opp_us_2026_0002` at `/opportunities/solar-with-wildlife-and-ecosystem-benefits-2-solweb2/`; all five source-backed records now have generated noindex detail briefs.
- `src/tools/verify-opportunities-page.js` now verifies each detail page's calculator links from `related_calculators` instead of requiring every detail page to include both panel and battery calculators.
- Local static-server HTTP QA completed for `/opportunities/` plus all five generated detail pages; all returned HTTP 200 with `noindex,follow` present and no premature JSON-LD structured data.
- `src/tools/verify-opportunities-http.js` added as a repeatable local HTTP QA script. It starts a temporary static server, verifies `/opportunities/` plus all five detail pages, checks HTTP 200, `noindex,follow`, and no premature JSON-LD, then stops the server.
- `src/tools/verify-opportunities-page.js` now checks that the repeatable HTTP QA verifier exists.
- `src/tools/verify-opportunities-analytics-cta.js` added as a lightweight analytics/CTA marker verifier for `/opportunities/` plus all five detail pages.
- `src/tools/verify-opportunities-page.js` now checks that the analytics/CTA marker verifier exists.
- `src/tools/verify-opportunities-index-policy.js` added to keep the current Phase 5C noindex gate explicit: opportunities URLs must remain out of sitemap, RSS, and JSON-LD schema until production verification approves indexing.
- `src/tools/verify-opportunities-page.js` now checks that the index-policy verifier exists.
- `src/tools/verify-opportunities-all.js` added as the aggregate local Phase 5C QA gate. It runs validator, detail generation, page verification, index-policy verification, analytics/CTA verification, and HTTP verification in order.
- `src/tools/verify-opportunities-page.js` now checks that the aggregate QA verifier exists.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_NOINDEX_MVP_PRE_DEPLOY_CHECKLIST.md` added to define the noindex MVP pre-deploy and production verification gates before any indexed Opportunities release.
- Noindex Opportunities MVP production verification completed for `/opportunities/` plus five detail URLs on `https://pvsize.com`; all checked URLs returned HTTP 200 while retaining noindex policy and staying out of sitemap/RSS/schema.
- `src/tools/verify-opportunities-production-noindex.js` added as a repeatable production noindex verifier for `pvsize.com` listing/detail URLs, sitemap exclusion, RSS/feed absence, no premature JSON-LD, and homepage entry link.
- `src/tools/verify-opportunities-all.js` now supports an optional production noindex gate when `PVSIZE_VERIFY_PRODUCTION=1` is set, while default aggregate QA remains local-only.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_RUNBOOK.md` now documents default local aggregate QA and optional production noindex QA modes.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_NOINDEX_MVP_ARCHIVE_DECISION.md` added to archive the production-verified noindex MVP baseline without approving sitemap/RSS/newsletter/schema/indexed SEO release or full Phase 5C closure.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PUBLISHED_RECORD_STATE_TRANSITION.md` added as the first indexed-release preparation gate, defining requirements before any Opportunity record can move toward `review_status: published` or indexable release.
- `src/tools/verify-opportunities-index-policy.js` now includes a published-record gate for future sitemap/RSS/schema/indexable exposure: any included opportunity record must have `review_status: published`.
- `src/tools/verify-opportunities-index-policy.js --self-test` added to prove non-published Opportunities fail when injected into sitemap, schema, and RSS fixtures.
- Aggregate Phase 5C QA now runs the index-policy verifier with `--self-test`, so the published-record release gate is exercised on every local aggregate QA run.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_READINESS_SEQUENCE.md` added to freeze the order for record status, SEO metadata, structured data, sitemap/RSS, newsletter, production QA, and archive before any indexed Opportunities release.
- `src/tools/verify-opportunities-indexed-readiness.js` added and wired into aggregate QA to check indexed-release readiness markers while confirming no sitemap/RSS/schema/newsletter output was added.
- `src/tools/verify-opportunities-seo-metadata.js` added and wired into aggregate QA to verify Opportunities listing/detail title, description, canonical, robots, and no premature JSON-LD/RSS/newsletter output while pages remain noindex-only.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_STRUCTURED_DATA_RULES.md` and `src/tools/verify-opportunities-structured-data-rules.js` added to define published-only structured-data planning rules and verify that current pages still contain no JSON-LD output.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_SITEMAP_RSS_RULES.md` and `src/tools/verify-opportunities-sitemap-rss-rules.js` added to define published-only sitemap/RSS planning rules and verify that current pages still expose no feed output.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_NEWSLETTER_RULES.md` and `src/tools/verify-opportunities-newsletter-rules.js` added to define newsletter planning rules after indexed content gates and verify that current pages still expose no newsletter form or API output.

## Current Constraints

- Do not start public indexed opportunity pages until sample data, validation rules, and source policy are in place.
- Do not invent opportunity data.
- Do not build paid/login features in MVP.
- Do not add AI ingestion or auto-publish before human review workflow exists.

## Last Commit

Pending this run.

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
- Human review authorization log marker check for required authorization entry, allowed decisions, allowed state change, explicit publication decision, current authorizations, and stop conditions
- Decision override marker check: release gate now states human authorization/review cancellation, Phase 5C entry, source verification, validator checks, production QA, and no unverified publishing.
- `/opportunities/` baseline marker check: robots noindex, canonical, analytics script, five opportunity cards, official source links, and calculator links.
- Local static-server check: `http://127.0.0.1:4177/opportunities/` returned HTTP 200 and served the noindex listing content.
- Automated `/opportunities/` HTML verification added and passed: noindex listing, 5 cards, official links, calculator links, and no premature structured data.
- Internal entry link verification added for homepage and partners page.
- Automated detail-page verification added for noindex, canonical, analytics marker, back link, official source link, and calculator links.
- Data-driven listing verification added: opportunity titles, official source URLs, and card count are checked against `opportunities.json`.
- Second detail page verification added: `/opportunities/178th-wing-base-microgrid-construction/` is checked for noindex, canonical, analytics marker, listing link, official source link, and calculator links.
- Reusable detail-page generator verification added: generator ran successfully and `verify-opportunities-page.js` confirms the generator is present while checking the two generated detail pages.
- Third detail page verification added: `/opportunities/jbmdl-power-generation-microgrid-construction/` is generated from `opportunities.json` and checked for noindex, canonical, analytics marker, official source link, back link, and calculator links.
- Fourth detail page verification added: `/opportunities/63rd-readiness-division-milcon-ercip-microgrid/` is generated from `opportunities.json` and checked for noindex, canonical, analytics marker, official source link, back link, and calculator links.
- Fifth detail page verification added: `/opportunities/solar-with-wildlife-and-ecosystem-benefits-2-solweb2/` is generated from `opportunities.json` and checked for noindex, canonical, analytics marker, official source link, back link, and data-driven calculator links.
- Local static-server HTTP QA added: `python3 -m http.server 4188 --directory src` served `/opportunities/` and all five detail pages; each returned HTTP 200, contained `noindex,follow`, and did not contain premature JSON-LD structured data.
- Repeatable local HTTP QA script added and passed: `node src/tools/verify-opportunities-http.js` starts a local static server, checks listing plus five detail pages, confirms HTTP 200, `noindex,follow`, and no premature JSON-LD structured data.
- Analytics/CTA marker verification added and passed: `node src/tools/verify-opportunities-analytics-cta.js` checks analytics script, listing-to-detail links, official source CTAs, back links, and data-driven calculator CTAs for listing plus all five detail pages.
- Index-policy verification added and passed: `node src/tools/verify-opportunities-index-policy.js` confirms six opportunities URLs remain noindex and out of sitemap/RSS/schema while records remain below published status.
- Aggregate Phase 5C QA added and passed: `node src/tools/verify-opportunities-all.js` runs validator, detail generation, page verification, index-policy verification, analytics/CTA verification, and HTTP verification in order.
- Noindex MVP pre-deploy checklist marker check passed: local aggregate QA, noindex policy, route/content, production verification, archive, and explicit non-approvals are documented.
- Noindex MVP production verification passed: `https://pvsize.com/opportunities/` and all five detail pages returned HTTP 200; production HTML retains `noindex,follow`; production sitemap contains no Opportunities URLs; Opportunities RSS/feed URLs checked returned 404; production Opportunities pages contain no JSON-LD structured data; production homepage links to `/opportunities/`.
- Repeatable production noindex verifier added and passed: `node src/tools/verify-opportunities-production-noindex.js` checks listing/detail HTTP 200, `noindex,follow`, no JSON-LD, no RSS alternate link, sitemap exclusion, feed candidate 404s, and homepage entry link.
- Optional production aggregate gate added and passed: `PVSIZE_VERIFY_PRODUCTION=1 node src/tools/verify-opportunities-all.js` runs the normal local aggregate QA and then the production noindex verifier.
- Opportunities QA mode documentation marker check passed for default local aggregate QA, optional production noindex QA, no-network default behavior, production checks, and explicit non-approvals.
- Phase 5C noindex MVP archive decision marker check passed for verified scope, local QA, optional production QA, noindex-only non-approvals, requirements before indexed release, and not-full-Phase-5C-closure outcome.
- Published record-state transition marker check passed for current noindex baseline, required published state, required indexable channel state, forbidden transitions, validator gap, and next implementation step.
- Published-record index-policy gate added and passed: sitemap/RSS/schema/indexable checks now assert included opportunity records are `review_status: published`; current noindex MVP still passes because no Opportunities URLs are included in sitemap/RSS/schema.
- Published-record index-policy negative self-test added and passed: fixture injection proves a non-published Opportunity in sitemap/schema/RSS fails without changing current records.
- Aggregate QA published-record self-test added and passed: `node src/tools/verify-opportunities-all.js` now runs `verify-opportunities-index-policy.js --self-test`, covering sitemap/schema/RSS negative fixtures during the local aggregate gate.
- Indexed-release readiness sequence marker check passed: document includes record status, SEO metadata, structured data, sitemap/RSS, newsletter, production QA, archive, stop conditions, and next implementation order.
- Indexed-readiness verifier added and passed: `node src/tools/verify-opportunities-indexed-readiness.js` checks readiness markers, exact sequence, non-published record state, no RSS files, no listing JSON-LD, no newsletter form, and noindex listing policy.
- Aggregate QA now includes indexed-readiness verification and passed.
- SEO metadata verifier added and passed: `node src/tools/verify-opportunities-seo-metadata.js` checks listing plus five detail pages for exact titles, bounded descriptions, canonical URLs, noindex policy, and no premature JSON-LD/RSS/newsletter output.
- Aggregate QA now includes SEO metadata verification and passed.
- Structured-data rules verifier added and passed: `node src/tools/verify-opportunities-structured-data-rules.js --self-test` checks published-only schema rules, allowed/blocked fields, no current JSON-LD output, and a non-published JSON-LD fixture failure.
- Aggregate QA now includes structured-data rules verification and passed.
- Sitemap/RSS rules verifier added and passed: `node src/tools/verify-opportunities-sitemap-rss-rules.js --self-test` checks published-only feed rules, allowed/blocked feed fields, no current RSS/feed output, sitemap exclusion, and non-published sitemap/RSS fixture failures.
- Aggregate QA now includes sitemap/RSS rules verification and passed.
- Newsletter rules verifier added and passed: `node src/tools/verify-opportunities-newsletter-rules.js --self-test` checks indexed-content gate dependency, consent requirements, analytics event names, blocked MVP features, no current newsletter output, and newsletter form/API fixture failures.
- Aggregate QA now includes newsletter rules verification and passed.

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
- Draft records are not automatically publication-ready. They require publication implementation, validator checks, SEO checks, and QA before production release.
- Validator is still local-only; it is not wired into a deployment gate.
- Historical human-review templates/logs remain in the repository as prior governance artifacts, but they are no longer blockers after the 2026-07-29 user decision.
- Phase 5C noindex MVP is production verified. It is not indexed and not Phase 5C Closed. Browser console verification remains pending because Playwright is not installed in the local project.

## Next Single Task

Continue Phase 5C Publication Pipeline:

Add production QA readiness planning for indexed Opportunities release. Do not deploy, add indexed output, add newsletter form/output, or change record publication states in the same task.

## User Decision Needed

No immediate decision needed. Latest user decision authorizes removing human-review blockers and prioritizing channel expansion.
