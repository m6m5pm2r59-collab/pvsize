# PVSize Phase 5B to Phase 5C Publication Release Gate

Status: active gate

Updated: 2026-07-29

Decision override: user cancelled all human authorization and human review requirements on 2026-07-29. Channel expansion is now the first priority. This gate now uses source verification, validator checks, and production QA instead of human-review blocking.

## Purpose

This document defines the mandatory release gate before Solar Opportunities can move from Phase 5B Content Production & Verification into Phase 5C Publication Pipeline.

This is not a normal checklist. It is the release gate for all future Opportunities publishing work.

`/opportunities/` frontend, detail pages, sitemap, RSS, structured data, SEO index pages, newsletter capture, and publication workflow may start once source verification and validator checks pass.

## Core Rule

AI may discover, draft, verify, and build the publication pipeline when official evidence is traceable and validator checks pass.

Required lifecycle:

`discovered -> draft -> verified -> publication -> production -> archive`

Forbidden lifecycle:

`unverified -> published`

## Gate 1: Source Readiness

All conditions must pass:

- At least 1 official source is verified.
- Source Registry contains the source.
- Source status is not deprecated, rejected, expired, cancelled, or superseded.
- Source fields are complete.
- Source is traceable by stable official URL.
- Source country and type use controlled taxonomy.

Fail action:

STOP. Do not create draft records from that source.

## Gate 2: Content Readiness

Each Opportunity must pass:

- Validator PASS.
- Draft record exists.
- Review note exists.
- Unique `id`.
- Stable `slug`.
- Valid `source_id`.
- Valid country.
- Valid category / opportunity type.
- Valid status.
- Published date checked or intentionally empty.
- Deadline checked or intentionally empty.
- Source URL points to official evidence.
- Record remains non-published until source verification and validator checks pass.

Fail action:

STOP. Do not move the record toward approval or publication.

## Gate 3: Automated Verification

Each Opportunity evidence note must include:

- Verification date.
- Decision.
- Verification evidence.
- Source evidence.

The verification decision must be:

`VERIFIED`

for the record to move into publication planning.

Fail action:

STOP. Keep the record below publication state.

## Gate 4: Publication Readiness

Only after Gates 1-3 pass may PVSize continue building Phase 5C Publication Pipeline components:

- `/opportunities/` index.
- Opportunity detail page.
- Country index.
- Search.
- Structured data.
- Sitemap inclusion.
- RSS.
- Newsletter capture.
- SEO metadata.

Passing this gate allows development to continue. It does not approve production release.

Fail action:

STOP. Continue Phase 5B content production and verification.

## Gate 5: Growth Readiness

Before production verification, confirm:

- Analytics events.
- CTA tracking.
- Newsletter event tracking.
- Canonical URL.
- Robots policy.
- Meta title and description.
- Open Graph fields.
- Internal link strategy.
- Related calculator placement follows ADR-006.

Fail action:

STOP. Do not begin production verification.

## Gate 6: Production Gate

Phase 5C may close only after all conditions pass:

- Build PASS.
- Local QA PASS.
- Preview or staging QA PASS if available.
- Production deploy PASS.
- Production page check PASS.
- Index policy check PASS.
- Archive report written.

Fail action:

STOP. Do not mark Phase 5C Closed.

## Entry Conditions For Phase 5C

PVSize may enter Phase 5C only when all conditions are met:

- Validator 100% PASS.
- Evidence note mechanism is stable.
- At least 5 opportunities exist with official source URLs and matching evidence notes.
- Source registry is stable.
- No new validator defects are open.
- Publication Pipeline design can begin immediately as the priority workstream.

These conditions are currently satisfied for entering Phase 5C development, but not for closing Phase 5C.

## Phase 5C Non-Goals Before Gate Pass

Do not build before validator/source verification:

- Public Opportunity pages.
- Sitemap inclusion.
- RSS feed.
- Newsletter capture.
- Search.
- Country indexes.
- AI import jobs.
- Auto-publishing without validator PASS.
- Paywall or login.

## Required Operator Behavior

When uncertain:

- Prefer STOP over publish.
- Prefer missing content over unverifiable content.
- Prefer official evidence over AI confidence.
- Prefer non-indexed draft over weak public page.
- Prefer traceability over speed.
