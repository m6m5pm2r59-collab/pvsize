# PVSize Opportunities Architecture Audit

Date: 2026-07-28

Status: Phase 0 audit complete

## Scope

This audit prepares Solar Opportunities V1. It does not modify production pages, data pipelines, database schemas, or forms.

Source plan:

- `/Users/xiaotudou/Documents/Obsidian/raw/08_codex专属部门/三站经营总控/PVSize_Opportunities频道执行方案_v1.0.md`

Governing decision:

- ADR-006: opportunities should appear after calculator value and trust surfaces, not before calculator completion.

## 1. Technical Stack And Routing

Current PVSize is a mostly static Vercel site.

Evidence:

- Static pages live under `src/`.
- Clean URL and redirects are configured in `src/vercel.json`.
- Serverless endpoints live under `src/api/`.
- Build/deploy appears to use Vercel static output conventions.
- `src/package.json` has Node utility scripts but no framework dependency list.

Existing route pattern:

- Folder `index.html` pages for major sections, such as `/calculators/`, `/learn/`, `/partners/`, `/request-solar-plan/`.
- Flat `.html` pages for many learn and city routes.
- `cleanUrls: true` and `trailingSlash: true`.

Opportunities routing recommendation:

- Public channel root: `src/opportunities/index.html` -> `/opportunities/`.
- Static detail MVP: `src/opportunities/{country}/{slug}.html` or `src/opportunities/{country}/{slug}/index.html`.
- Prefer generated static pages for MVP unless a persistent database/admin layer is added.
- Add approved opportunity URLs to `src/tools/indexable-pages.js` only after quality review.

## 2. Database And ORM

No persistent database or ORM was found.

Evidence:

- No Prisma, Supabase, Firebase, MongoDB, SQLite, or Postgres dependency appears in source.
- No schema or migration directory exists.
- Existing APIs forward forms or log events; they do not persist records.
- City and indexing workflows use files under `src/data/` plus build-time scripts.

Implication:

- Phase 5 cannot assume database-backed opportunities.
- MVP should start with file-backed reviewed data unless a database is explicitly introduced.

Recommended MVP storage path:

- `src/data/opportunities/opportunities.json`
- `src/data/opportunities/sources.json`
- `src/data/opportunities/tags.json`

Future database candidates:

- Postgres or Supabase only after the file-backed editorial workflow proves valuable.

## 3. Authentication

No user authentication system was found.

Evidence:

- No login routes.
- No auth provider dependency.
- No session/user database.
- Forms are public and protected through validation/rate limits/Turnstile.

Implication:

- Do not build member features in Phase 5 MVP.
- Do not implement saved searches, saved opportunities, team accounts, or paid features until auth is intentionally selected.

## 4. Email Service

Current email handling is form-forwarding, not a newsletter system.

Evidence:

- `src/api/lead.js` sends lead payloads to FormSubmit.
- `src/api/feedback.js` also uses FormSubmit.
- Environment variables include `FORMSUBMIT_ENDPOINT`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
- Privacy copy mentions newsletter consent, but no newsletter provider integration was found.

Implication:

- Weekly alerts and subscriber preferences need new infrastructure.
- Phase 5 MVP can start with email capture only, but recurring newsletter delivery needs a provider decision.

Recommended staged approach:

1. Add a public subscription form with explicit consent.
2. Store subscriptions in a reviewed file only for local tests, or choose a provider before production capture.
3. Defer preference center and automated weekly sends until service is selected.

Provider decision needed later:

- Beehiiv, Buttondown, MailerLite, Brevo, Resend with custom storage, or Supabase + scheduled email.

## 5. Admin / Backoffice

No management backoffice was found.

Evidence:

- No `/admin` app.
- No authenticated editor.
- Existing `src/tools/` scripts handle sitemap, city quality, traffic, and city path strip updates.

MVP implication:

- Human review should start as repo-based editorial workflow:
  - Candidate JSON/Markdown.
  - Review status in data files.
  - Static generation script.
  - Git review before publish.

Future admin route:

- `/admin/opportunities` should not be built until auth and storage are selected.

## 6. SEO And Structured Data

SEO is handled per static page plus a sitemap allowlist.

Evidence:

- Canonicals are present on key pages.
- Many pages include JSON-LD.
- `src/tools/indexable-pages.js` is the explicit sitemap allowlist.
- `src/tools/generate-sitemap.js` renders `src/sitemap.xml`.
- `src/tools/audit-indexing.js` checks canonical, robots, sitemap, and internal links.
- `src/vercel.json` handles headers and redirects.

Opportunities SEO recommendation:

- Use strict index allowlist.
- Do not generate country/technology combination pages unless at least 5 reviewed active opportunities exist.
- Add Opportunity pages to sitemap only after source verification and editorial review.
- Use `CollectionPage`, `WebPage`, `BreadcrumbList`, and possibly `Event`-like structured data only if fields are accurate. Avoid false schema for tenders if no appropriate schema applies.

## 7. Analytics And Event Tracking

PVSize has a lightweight custom analytics layer.

Evidence:

- `src/pv-analytics.js` infers page type and posts events to `/api/event/`.
- `src/api/event.js` logs event payloads to server logs.
- `src/tools/report-traffic.js` parses Vercel production logs.
- Forms use `pvTrack` for submit success/error.
- Calculator pages track result and CTA events.

Opportunities analytics recommendation:

Add event names:

- `opportunities_list_view`
- `opportunity_filter_change`
- `opportunity_card_click`
- `opportunity_detail_view`
- `official_source_click`
- `opportunity_subscribe_start`
- `opportunity_subscribe_success`
- `opportunity_related_calculator_click`
- `calculator_opportunity_impression`
- `calculator_opportunity_click`

Important limitation:

- Current event data is log-based, not database-backed. Dashboards will depend on Vercel logs unless a real event store is introduced.

## 8. Scheduled Tasks

No production scheduled task system was found in the repo.

Evidence:

- No cron config was found in `src/vercel.json`.
- Existing automation is Codex-side heartbeat, not website infrastructure.
- `src/tools/report-traffic.js` can read Vercel logs manually.

Implication:

- AI search/import should not be assumed to run inside the current site.
- Phase 5 collection should start as manual/repo-run scripts, then later evaluate Vercel Cron, GitHub Actions, or an external worker.

## 9. Reusable Components And Patterns

Reusable assets:

- `src/pdos-shell.js`: nav/footer shell for PDOS pages.
- `src/style.css`: global styles.
- `src/calculator-trust.css`: calculator trust styling.
- `src/city-pages.css`: city path strip styling.
- `src/solar-project-flow.js`: calculator result summary and next-step flow.
- `src/calculator-engagement.js`: engagement utilities.
- `src/pv-analytics.js`: tracking and form metadata.
- `src/tools/indexable-pages.js`: sitemap allowlist.
- `src/tools/audit-indexing.js`: SEO/indexing audit.

Recommended Opportunities reuse:

- Reuse PDOS shell or existing global nav/footer.
- Reuse card/list patterns from calculators and partners where compatible.
- Reuse `pv-analytics.js`.
- Reuse sitemap allowlist workflow.
- Reuse source-tracked CTA pattern from calculators and city pages.

## 10. Needed Data Models

File-backed MVP models:

### Opportunity

- `id`
- `slug`
- `title`
- `status`
- `country`
- `region`
- `opportunity_type`
- `technology`
- `buyer_or_issuer`
- `project_size`
- `estimated_value`
- `published_date`
- `deadline`
- `source_language`
- `last_verified`
- `official_source_url`
- `overview`
- `requirements`
- `eligibility`
- `relevance_notes`
- `source_reliability`
- `quality_score`
- `review_status`
- `tags`
- `related_calculators`
- `change_log`

### Source

- `id`
- `name`
- `url`
- `country`
- `source_type`
- `allowed_use_notes`
- `reliability_score`
- `last_checked`

### Subscription

Do not implement production subscription storage until provider is selected.

Suggested fields once storage exists:

- `email`
- `countries`
- `technologies`
- `opportunity_types`
- `frequency`
- `consent_timestamp`
- `source_page`
- `status`

## 11. Route Plan

Phase 5 public MVP routes:

- `/opportunities/`
- `/opportunities/united-states/`
- `/opportunities/japan/`
- `/opportunities/europe/`
- `/opportunities/solar/`
- `/opportunities/battery-storage/`
- `/opportunities/incentives/`
- `/opportunities/tenders/`
- `/opportunities/{country}/{slug}/`

Only index routes with reviewed content.

Non-index or deferred routes:

- `/opportunities/weekly-brief/`
- `/admin/opportunities/`
- `/account/`
- `/saved-opportunities/`

## 12. Risks

P0/P1 risks:

- No persistent database exists.
- No auth/admin exists.
- No newsletter provider exists.
- Automated import could violate source terms if started too early.
- Official source deadlines/status changes require human review.
- Large generated pages can damage SEO if empty or low quality.
- Log-based analytics may be insufficient for Phase 7 dashboards.

Mitigations:

- Start repo-backed and human-reviewed.
- Keep first data set small.
- No auto-publish.
- No paid/login features in MVP.
- Use sitemap allowlist.
- Track source URL and last verified date on every opportunity.

## 13. Phased Implementation Order

Recommended next phases:

1. Phase 0A: Complete audit and accept architecture constraints. This document.
2. Phase 0B: Create reviewed sample data spec and 10-30 hand-curated sample opportunities outside production pages.
3. Phase 5A: Add data schema files and validation script.
4. Phase 5B: Generate non-index preview pages from reviewed sample data.
5. Phase 5C: Add `/opportunities/` public list page with static sample set.
6. Phase 5D: Add detail page generation.
7. Phase 5E: Add subscription capture after email-provider decision.
8. Phase 6A: Add calculator result recommendation component after trust/result surfaces.
9. Phase 7A: Add analytics events and log report parser extensions.

## 14. Expected Files To Modify

Likely Phase 5 files:

- `src/data/opportunities/opportunities.json`
- `src/data/opportunities/sources.json`
- `src/data/opportunities/tags.json`
- `src/tools/validate-opportunities.js`
- `src/tools/generate-opportunities.js`
- `src/tools/indexable-pages.js`
- `src/opportunities/index.html`
- `src/opportunities/{country}/{slug}/index.html`
- `src/style.css` or a scoped `src/opportunities.css`
- `src/pv-analytics.js`
- `src/sitemap.xml`

Possible later files:

- `src/api/lead.js` or a new `src/api/subscribe.js`
- `src/tools/report-traffic.js`
- Calculator result pages or `src/solar-project-flow.js`

Avoid in MVP unless approved:

- Auth routes.
- Admin routes.
- Payment routes.
- Bulk import jobs.

## Phase 0 Conclusion

PVSize can build Solar Opportunities V1, but the current codebase is not yet a database-backed product platform. The safest path is a static, file-backed, human-reviewed MVP first, with a strict sitemap allowlist and clear source verification metadata.

Do not start AI ingestion or a public indexed opportunity database until sample data, validation rules, and source policy are in place.
