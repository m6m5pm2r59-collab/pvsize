# PVSize Opportunities Newsletter Rules

Status: planning gate only

Updated: 2026-07-30

## Purpose

This document defines newsletter planning and verification rules for future Opportunities distribution.

It does not approve newsletter capture or outbound email. The current Opportunities MVP must remain noindex-only and must not include newsletter forms, subscription endpoints, hidden email capture, or live email submission until a later implementation task passes indexed content gates.

## Core Rule

NEWSLETTER_RULE: AFTER_INDEXED_CONTENT_GATES

Newsletter capture may be implemented only after the indexed content gates are ready:

- SEO metadata verification passes.
- Structured-data rules verification passes.
- Sitemap/RSS rules verification passes.
- Index-policy self-test passes.
- Aggregate QA passes.

## Consent Rule

NEWSLETTER_RULE: CONSENT_REQUIRED

Future newsletter capture must include:

- Clear opt-in copy.
- Email field label.
- Privacy or consent note.
- Success state.
- Error state.
- No pre-checked consent.

## Analytics Rule

NEWSLETTER_RULE: ANALYTICS_REQUIRED

Future newsletter capture must define analytics events before production verification:

- `opportunities_newsletter_view`
- `opportunities_newsletter_submit`
- `opportunities_newsletter_success`
- `opportunities_newsletter_error`

Do not submit real forms during QA.

## Content Eligibility Rule

NEWSLETTER_RULE: PUBLISHED_OR_NOINDEX_ONLY

Newsletter content may link only to:

- Published indexable Opportunities that passed sitemap/RSS/schema gates.
- Intentionally noindex Opportunities pages that remain excluded from sitemap/RSS/schema.

Newsletter content must not link to unverifiable records, invented opportunities, or pages with unclear source evidence.

## Blocked Features

NEWSLETTER_RULE: BLOCKED_FEATURES

Do not add in the MVP newsletter task:

- Paid newsletter.
- Login requirement.
- Account system.
- Anonymous procurement posting.
- Real email submission during local QA.
- External marketing automation without explicit service selection.

## Current No-Output Requirement

NEWSLETTER_RULE: CURRENT_NO_OUTPUT

Current Opportunities pages must not contain:

- Newsletter form.
- Email input.
- Subscribe CTA wired to a form.
- Newsletter API endpoint.
- Marketing automation endpoint.

## Next Implementation Boundary

This task only defines planning and verification rules.

Do not add newsletter form/output, sitemap/RSS output, JSON-LD output, or published record transitions in this task.
