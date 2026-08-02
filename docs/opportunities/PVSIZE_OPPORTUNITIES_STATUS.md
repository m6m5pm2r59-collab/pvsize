# PVSize Opportunities Status

Updated: 2026-08-02 15:40 CST

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
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_READINESS_RULES.md` and `src/tools/verify-opportunities-production-qa-readiness.js` added to define production QA readiness planning for a future indexed Opportunities release and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EXECUTION_CHECKLIST.md` and `src/tools/verify-opportunities-production-qa-execution-checklist.js` added to define the future production QA execution checklist for an indexed Opportunities release and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_FALLBACK_CHECKLIST.md` and `src/tools/verify-opportunities-indexed-release-fallback-checklist.js` added to define indexed release rollback/noindex fallback planning for Opportunities production QA and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_RELEASE_ARCHIVE_CLOSURE_CHECKLIST.md` and `src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js` added to define future indexed release archive closure planning and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_ARTIFACT_INDEX.md` and `src/tools/verify-opportunities-production-qa-artifact-index.js` added to index current indexed-release production QA planning documents, verifiers, and report trail while verifying that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_HANDOFF_CHECKLIST.md` and `src/tools/verify-opportunities-production-qa-handoff-checklist.js` added to define future indexed-release production QA handoff requirements and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_RUN_MANIFEST.md` and `src/tools/verify-opportunities-production-qa-run-manifest.js` added to define future indexed-release production QA run metadata and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_EVIDENCE_BUNDLE_CHECKLIST.md` and `src/tools/verify-opportunities-production-qa-evidence-bundle-checklist.js` added to define future indexed-release production QA evidence bundle requirements and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_SIGNOFF_CHECKLIST.md` and `src/tools/verify-opportunities-production-qa-signoff-checklist.js` added to define future indexed-release production QA signoff requirements and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, indexed release approval, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_DECISION_LOG_TEMPLATE.md` and `src/tools/verify-opportunities-production-qa-decision-log-template.js` added to define future indexed-release production QA decision log requirements and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, indexed release approval, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_GO_NO_GO_CRITERIA.md` and `src/tools/verify-opportunities-production-qa-go-no-go-criteria.js` added to define future indexed-release production QA go/no-go criteria and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, indexed release approval, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_RELEASE_NOTES_TEMPLATE.md` and `src/tools/verify-opportunities-production-qa-release-notes-template.js` added to define future indexed-release production QA release notes requirements and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, indexed release approval, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_MONITORING_HANDOFF_CHECKLIST.md` and `src/tools/verify-opportunities-production-qa-monitoring-handoff-checklist.js` added to define future indexed-release production QA monitoring handoff requirements and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, indexed release approval, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_POST_RELEASE_WATCH_CHECKLIST.md` and `src/tools/verify-opportunities-production-qa-post-release-watch-checklist.js` added to define future indexed-release production QA post-release watch requirements and verify that the current MVP still has no deploy, indexed output, newsletter output, sitemap/RSS output, JSON-LD output, indexing request, indexed release approval, Phase 5C closure, or published record transitions.
- `docs/opportunities/PVSIZE_OPPORTUNITIES_MARVIS_EXECUTOR_PACKET.md` added as the AI executor packet and repository-local total board for Marvis to continue the remaining Phase 5C indexed-release QA planning tasks without per-task user copy/paste.

- Phase 5C T02 completed: `docs/opportunities/PVSIZE_OPPORTUNITIES_PUBLISHED_RECORD_PREFLIGHT_MATRIX.md` and `src/tools/verify-opportunities-published-record-preflight-matrix.js` added to define published-record preflight matrix for indexed release planning and verify current no-deploy/indexed-output state; aggregate QA now includes published record preflight matrix verification.
- Phase 5C T03 completed: `docs/opportunities/PVSIZE_OPPORTUNITIES_INDEXED_OUTPUT_ACTIVATION_PREFLIGHT_MATRIX.md` and `src/tools/verify-opportunities-indexed-output-activation-preflight-matrix.js` added to define indexed output activation preflight matrix and verify current no-sitemap/RSS/schema/newsletter state; aggregate QA now includes indexed output activation preflight matrix verification.
- Phase 5C T04 completed: `docs/opportunities/PVSIZE_OPPORTUNITIES_NEWSLETTER_ACTIVATION_HOLD_CHECKLIST.md` and `src/tools/verify-opportunities-newsletter-activation-hold-checklist.js` added to define newsletter activation hold checklist and verify current no-newsletter-form/API state; aggregate QA now includes newsletter activation hold checklist verification.
- Phase 5C T05 completed: refreshed artifact index and artifact-index verifier to include T01-T07 documents, verification scripts, and aggregate QA labels; `docs/opportunities/PVSIZE_OPPORTUNITIES_PRODUCTION_QA_ARTIFACT_INDEX.md` now indexes 12 planning documents and 14 verification scripts.
- Phase 5C T06 completed: `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_INDEXED_RELEASE_PLANNING_SUMMARY.md` and `src/tools/verify-opportunities-phase5c-indexed-release-planning-summary.js` added to define remaining indexed release planning summary and verify current no-deploy/indexed-output state; aggregate QA now includes Phase 5C indexed-release planning summary verification.
- Phase 5C T07 completed: `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_MARVIS_HANDOFF.md` and `src/tools/verify-opportunities-phase5c-marvis-handoff.js` added to define Marvis handoff to Codex for indexed release acceptance review; aggregate QA and page verifier now include Marvis handoff verification.
- Phase 5C planning-only long-run board activated: `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md` and `src/tools/verify-opportunities-phase5c-planning-only-long-run-board.js` added so Marvis can continue a long-running planning-only stage from a single total board without per-task user copy/paste; aggregate QA and page verifier now include long-run board verification.

## Current Constraints

- Do not start public indexed opportunity pages until sample data, validation rules, and source policy are in place.
- Do not invent opportunity data.
- Do not build paid/login features in MVP.
- Do not add AI ingestion or auto-publish before human review workflow exists.

## Last Commit

`9ee8338 Add opportunities Phase 5C planning-only long-run board` (awaiting record commit / push)

## Last Verification

Phase 5C planning-only long-run board verification PASS (`10/10` self-test), aggregate QA PASS (`31` steps), `git diff --check` PASS, no records published, no Opportunities sitemap/RSS/JSON-LD/newsletter output added, indexed release not approved, Phase 5C not closed.

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

Phase 5C planning-only long-run stage is now the active execution path. Continue `docs/opportunities/PVSIZE_OPPORTUNITIES_PHASE5C_PLANNING_ONLY_LONG_RUN_BOARD.md` from `L02 Reconcile the report trail`. Do not deploy, add indexed output, add newsletter form/output, request indexing, approve indexed release, close Phase 5C, or change record publication states.

## Codex Indexed-Release Planning Gates Acceptance Review

- **Date**: 2026-08-02
- **Reviewer**: Codex (automated acceptance review)
- **Decision**: ACCEPT — Phase 5C T01-T07 all PASS
- **Remote main commit**: `b94e8ca Phase 5C: Codex acceptance review + AIGC标记 reconciliation`
- **Aggregate QA**: 30 steps PASS (local aggregate QA: `node src/tools/verify-opportunities-all.js`)
- **Published records**: `published_records=0` — no record has transitioned to published status; all five draft records remain at `review_status: discovered`
- **Deploy status**: Not deployed — current MVP is noindex-only, production-verified at `https://pvsize.com/opportunities/` with noindex policy intact
- **Indexed output**: None — no sitemap entries, RSS feed, or JSON-LD structured data for Opportunities URLs
- **Newsletter**: None — no newsletter form, API, or output for Opportunities content
- **Indexed release**: Not approved — all indexed-release gates remain planned but not activated
- **Phase 5C closure**: Not closed — Phase 5C remains open; indexed release, published record transitions, and Phase 5C closure await separate future approval
- **T01 gate**: Published record preflight matrix — PASS (9/9 self-tests)
- **T02 gate**: Published record preflight matrix document + verifier — PASS
- **T03 gate**: Indexed output activation preflight matrix — PASS (8/8 self-tests)
- **T04 gate**: Newsletter activation hold checklist — PASS (7/7 self-tests)
- **T05 gate**: Artifact index refresh — PASS (7 markers / 12 docs / 14 scripts / 4 reports)
- **T06 gate**: Phase 5C indexed-release planning summary — PASS (5/5)
- **T07 gate**: Marvis handoff to Codex — PASS (9/9)
- **AIGC 标记改动**: 5 files under `docs/opportunities/` had local unstaged AIGC frontmatter blocks + footer lines; committed and pushed to remote main in this acceptance review session

## User Decision Needed

No immediate decision needed. Latest user decision authorizes removing human-review blockers and prioritizing channel expansion.
