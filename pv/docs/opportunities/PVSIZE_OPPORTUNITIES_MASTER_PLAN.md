# PVSize Opportunities Master Plan

Updated: 2026-07-29

## Goal

Build Solar Opportunities V1 as PVSize Phase 5 product expansion after the UI/UX production archive.

Solar Opportunities must connect:

Calculator traffic -> verified opportunities -> email subscription -> repeat visits -> business intent.

## Source Plan

This plan is governed by:

- `/Users/xiaotudou/Documents/Obsidian/raw/08_codex专属部门/三站经营总控/PVSize_Opportunities频道执行方案_v1.0.md`
- `/Users/xiaotudou/Documents/Obsidian/raw/08_codex专属部门/PVSize Design Operating System/Stage X：Decision Records/ADR-006_Opportunity After Calculator.md`
- Existing PVSize PDOS rules and UI/UX archive.

## Fixed Phase Order

1. Phase 0: Architecture audit, no production code changes.
2. Phase 5: Solar Opportunities data system and public MVP.
3. Phase 6: Calculator-to-Opportunities recommendation flow.
4. Phase 7: Growth validation and analytics.
5. Final archive.

Do not skip Phase 0. Do not start data pipelines, public pages, or recommendation components until `docs/opportunities-architecture-audit.md` is complete and accepted.

## MVP Boundaries

First public MVP should support:

- `/opportunities`
- Opportunity list.
- Opportunity detail pages.
- Country, technology, type, status, and deadline filtering.
- Source and verification notes.
- Email subscription.
- United States, Japan, and European Union first.
- Tenders, Incentives, and Procurement Signals only.

Do not build in V1:

- Forced registration.
- Paid wall.
- Anonymous user procurement posting.
- Marketplace transactions.
- Scraped paid-database copies.
- Unverifiable opportunity records.

## Phase 0 Definition Of Done

Phase 0 is complete only when `docs/opportunities-architecture-audit.md` documents:

- Current technical stack and routing.
- Database and ORM status.
- Authentication status.
- Email service status.
- Admin/backoffice status.
- SEO and structured data implementation.
- Analytics/event tracking implementation.
- Scheduled task support.
- Reusable components.
- Needed data models.
- Route plan.
- Risks.
- Phased implementation order.
- Expected files to modify.

## Phase 5 Definition Of Done

Phase 5 is complete only when the MVP supports a small verified opportunity set, source metadata, automated governance checks, public list/detail pages, subscription capture, and production verification.

## Phase 6 Definition Of Done

Phase 6 is complete only when calculator results can show relevant opportunities after the user completes the calculator task and trust surfaces. This must follow ADR-006.

## Phase 7 Definition Of Done

Phase 7 is complete only when key events and dashboard surfaces exist for calculator, guide, city, opportunities, newsletter, and inquiry behavior.
