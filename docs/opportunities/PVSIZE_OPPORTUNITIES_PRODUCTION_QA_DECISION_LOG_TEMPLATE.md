# PVSize Opportunities Production QA Decision Log Template

Status: decision log template planning gate only

Updated: 2026-08-01

## Purpose

This template defines the decision log required for a future indexed Opportunities production QA run.

It does not approve deployment, indexed output, sitemap/RSS output, JSON-LD output, newsletter form/output, indexing requests, record publication transitions, indexed release completion, indexed release approval, or Phase 5C closure. The current Opportunities MVP must remain noindex-only until a separate indexed-release implementation task passes all published-record gates and production QA.

## Core Rule

DECISION_LOG: REQUIRED_FOR_SIGNOFF

Every future indexed-release production QA signoff must reference a decision log entry that records the observed evidence, decision, fallback state, and next task.

## Required Decision Fields

DECISION_LOG: REQUIRED_FIELDS

Future decision log entry must include:

- Decision log id.
- Decision date.
- Operator.
- Current phase.
- Release candidate commit SHA.
- Production QA run id.
- Signoff id.
- Evidence bundle path.
- Production deployment target.
- Production URL set.
- Local QA result summary.
- Production QA result summary.
- Indexed output result summary.
- Newsletter output result summary.
- Fallback/noindex decision.
- Risk decision.
- Final decision.
- Decision rationale.
- Follow-up owner.
- Next single task.

## Allowed Decisions

DECISION_LOG: ALLOWED_DECISIONS

Future decision log entry must use exactly one final decision:

- HOLD_NO_INDEX.
- ROLLBACK_TO_NOINDEX.
- APPROVED_FOR_INDEXED_RELEASE.

`APPROVED_FOR_INDEXED_RELEASE` is only valid after published-record gates, local QA, production QA, indexed output QA, newsletter output QA, evidence bundle, signoff checklist, and risk decision all pass.

## Required Evidence Links

DECISION_LOG: REQUIRED_EVIDENCE_LINKS

Future decision log entry must link or name:

- Production QA run manifest.
- Production QA evidence bundle.
- Production QA signoff checklist.
- Production QA artifact index.
- Daily ops report.
- Archive closure checklist.
- Fallback checklist when HOLD or rollback is chosen.

## Hold And Rollback Triggers

DECISION_LOG: HOLD_ROLLBACK_TRIGGERS

Future decision log entry must choose HOLD or rollback when:

- Any local QA command fails.
- Any production HTTP check fails.
- Any robots or canonical check fails.
- Any sitemap/RSS check contains a non-published Opportunity.
- Any JSON-LD check contains a non-published Opportunity.
- Any newsletter output contains a non-published Opportunity.
- Any indexing request is not separately approved.
- Evidence bundle is incomplete.
- Signoff checklist is incomplete.
- Phase 5C closure evidence is incomplete.

## Current No-Decision Requirement

DECISION_LOG: CURRENT_NO_DECISION

This decision log template task must not:

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

This task only defines the indexed-release production QA decision log template and verification rules.

Do not deploy, add indexed output, add newsletter form/output, add sitemap/RSS output, add JSON-LD output, request indexing, mark Phase 5C Closed, approve indexed release, or change record publication states in this task.
