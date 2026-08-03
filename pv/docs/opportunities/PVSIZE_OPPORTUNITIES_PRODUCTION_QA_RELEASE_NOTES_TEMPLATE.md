# PVSize Opportunities Production QA Release Notes Template

Status: release notes template planning gate only

Updated: 2026-08-01

## Purpose

This template defines the release notes required for a future indexed Opportunities production QA release.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, indexed release approval, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

RELEASE_NOTES: REQUIRED_BEFORE_ARCHIVE

Every future indexed-release production QA archive must include release notes that summarize scope, evidence, decisions, risks, fallback state, and next task.

## Required Release Note Fields

RELEASE_NOTES: REQUIRED_FIELDS

Future release notes must include:

- Release notes id.
- Release date.
- Current phase.
- Release candidate commit SHA.
- Production deployment target.
- Production URL set.
- Published-record list.
- Indexed output summary.
- Newsletter output summary.
- Local QA summary.
- Production QA summary.
- Evidence bundle path.
- Signoff checklist path.
- Decision log path.
- Go/no-go criteria path.
- Fallback/noindex decision.
- Known risks.
- Final release note status.
- Next single task.

## Required User-Facing Summary

RELEASE_NOTES: USER_FACING_SUMMARY

Future release notes must include a user-facing summary that is accurate and bounded:

- What changed.
- Which Opportunities URLs are included.
- Which records are published.
- Which indexed surfaces are enabled.
- Which newsletter output is enabled.
- Which fallback or hold state applies.
- What remains intentionally unavailable.

The summary must not claim indexed release, search submission, newsletter capture, or Phase 5C closure unless those are separately approved and evidenced.

## Required QA Summary

RELEASE_NOTES: QA_SUMMARY

Future release notes must include QA evidence summaries for:

- Local aggregate QA.
- Production HTTP QA.
- Robots/canonical QA.
- Sitemap/RSS QA.
- JSON-LD QA.
- Newsletter output QA.
- Evidence bundle QA.
- Signoff QA.
- Decision log QA.
- Go/no-go QA.

## Required Risk Summary

RELEASE_NOTES: RISK_SUMMARY

Future release notes must include:

- Accepted risks.
- Open risks.
- Fallback triggers.
- Rollback target.
- Known monitoring gaps.
- Browser console verification status.
- Next owner or next task.

## Current No-Release-Notes Requirement

RELEASE_NOTES: CURRENT_NO_RELEASE

This release notes template task must not:

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

This task only defines the indexed-release production QA release notes template and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, approve indexed release, or change record publication states in this task.
