# PVSize Opportunities Production QA Post-Release Watch Checklist

Status: post-release watch planning gate only

Updated: 2026-08-02

## Purpose

This checklist defines the post-release watch requirements for a future indexed Opportunities production QA release.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, indexed release approval, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

POST_RELEASE_WATCH: REQUIRED_AFTER_RELEASE

Every future indexed-release production QA release must have a post-release watch window with explicit checks, timing, escalation triggers, rollback/noindex criteria, and closure evidence before Phase 5C can close.

## Required Watch Fields

POST_RELEASE_WATCH: REQUIRED_FIELDS

Future post-release watch must include:

- Watch id.
- Watch start time.
- Watch end time.
- Current phase.
- Release candidate commit SHA.
- Production deployment target.
- Production URL set.
- Published-record list.
- Indexed output summary.
- Newsletter output summary.
- Watch owner.
- Watch cadence.
- Watch evidence path.
- Escalation path.
- Rollback/noindex trigger list.
- Final watch decision.
- Next single task.

## Required Watch Checks

POST_RELEASE_WATCH: REQUIRED_CHECKS

Future post-release watch must include checks for:

- Opportunities listing HTTP status.
- Opportunities detail HTTP statuses.
- Robots meta status.
- Canonical URL status.
- Sitemap inclusion status.
- RSS/feed item status.
- JSON-LD parse status.
- Newsletter output status.
- Analytics event status.
- Homepage entry-link status.
- Calculator CTA status.
- Error log status.
- Search visibility status.

## Required Watch Cadence

POST_RELEASE_WATCH: REQUIRED_CADENCE

Future post-release watch must define:

- Immediate post-release check.
- 15-minute check.
- 60-minute check.
- Same-day closeout check.
- Next-day follow-up check.

Each check must record timestamp, operator, command or source, PASS/FAIL status, and follow-up action.

## Required Escalation Triggers

POST_RELEASE_WATCH: ESCALATION_TRIGGERS

Future post-release watch must escalate when:

- Any Opportunities URL returns non-200.
- Any published Opportunity is missing from expected indexed output.
- Any non-published Opportunity appears in indexed output.
- Robots or canonical output differs from the approved release plan.
- Sitemap/RSS output differs from the approved release plan.
- JSON-LD output differs from the approved release plan.
- Newsletter output differs from the approved release plan.
- Analytics events stop firing.
- Search indexing status is unclear.
- Error logs show Opportunities regressions.
- Fallback/noindex trigger fires.

## Required Closure Evidence

POST_RELEASE_WATCH: CLOSURE_EVIDENCE

Future post-release watch must reference:

- Monitoring handoff checklist.
- Production QA run manifest.
- Evidence bundle.
- Signoff checklist.
- Decision log.
- Go/no-go criteria.
- Release notes.
- Fallback checklist.
- Archive closure checklist.
- Daily ops report.

## Current No-Watch Requirement

POST_RELEASE_WATCH: CURRENT_NO_WATCH

This post-release watch checklist task must not:

- Deploy production code.
- Change robots policy.
- Add Opportunities URLs to sitemap.
- Add RSS/feed output.
- Add JSON-LD output.
- Add newsletter form/output.
- Request search indexing.
- Change record publication states.
- Mark indexed release complete.
- Mark Phase 5C Closed.
- Approve indexed release.

## Next Implementation Boundary

This task only defines the indexed-release production QA post-release watch checklist and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, approve indexed release, or change record publication states in this task.
