# PVSize Opportunities Status

Updated: 2026-07-28 20:38 CST

## Current Phase

Phase 0: Architecture Audit Complete

## Current State

Phase 0 architecture audit is complete. PVSize can build Solar Opportunities V1, but the current codebase is static-first and does not yet have a database, auth, admin, newsletter provider, or production scheduler.

## Completed

- Phase 5-7 master plan created.
- Phase 5-7 runbook created.
- Phase 5-7 status file created.
- Historical Opportunities execution plan located in Obsidian.
- ADR-006 confirmed: opportunities appear after calculator value and trust surfaces.
- `docs/opportunities-architecture-audit.md` created.
- Architecture recommendation recorded: start with a static, file-backed, human-reviewed MVP before database/admin/AI ingestion.

## Current Constraints

- Do not start public indexed opportunity pages until sample data, validation rules, and source policy are in place.
- Do not invent opportunity data.
- Do not build paid/login features in MVP.
- Do not add AI ingestion or auto-publish before human review workflow exists.

## Last Commit

`bce815a Start opportunities phase planning`

## Last Verification

Phase 0 audit document created and checked with repository inspection.

## Risks And Gaps

- No persistent database or ORM exists.
- No auth/admin system exists.
- Email handling is FormSubmit-based, not newsletter/subscription infrastructure.
- No production scheduler exists for import jobs.
- Analytics is log-based through `/api/event/` and Vercel logs.

## Next Single Task

Create the Phase 5 sample data specification without publishing pages:

Define `src/data/opportunities/` file schema for opportunities, sources, and tags, plus validation rules and review statuses. Do not add real opportunity records yet unless they are clearly marked sample/draft and not published.

## User Decision Needed

No immediate decision needed for Phase 0 audit.
