# PVSize UI/UX Master Plan

Updated: 2026-07-28

## Goal

Complete PVSize UI/UX redesign through real production delivery, not planning-only work.

Fixed sequence:

1. Calculator
2. Homepage
3. Guide
4. City Pages
5. Opportunities
6. Full-site QA and production archive

Do not start the next major phase until the current phase has implementation evidence, technical verification, production verification, and a recorded next-state decision.

## Phase Status

| Phase | Status | Notes |
| --- | --- | --- |
| Calculator | Closed | Calculator Hub and Panel Count production verification passed. |
| Homepage | Live | First-screen path-first redesign deployed. |
| Guide | Partial live | Learn directory and selected guides use path-first calculator routing. |
| City Pages | Technical stage passed / growth observing | 5-city City Calculator Path Strip pilot deployed and production verified; behavior metrics remain observing and full rollout is not approved. |
| Opportunities | Ready to start | City Pages technical stage no longer blocks the main UI redesign flow. |
| Full-site QA | Pending | Starts after Opportunities production verification. |

## City Pages Milestones

1. San Diego production pilot: complete.
2. 5-city representative pilot: complete in production.
3. Observe pilot behavior and verify no SEO/runtime regression.
4. Decide whether to promote the path strip into the city template/generator.
5. Componentize before wider rollout.
6. Expand only to approved `pilot_index_slugs`, not every city page.
7. Run desktop/narrow viewport and production checks.
8. Record outcome and mark the City Pages technical stage passed after production verification.
9. Keep growth validation observing until Clarity, GSC, Analytics, or approved manual metrics support a wider rollout decision.
10. Do not approve full rollout without metrics or explicit user approval.

## Opportunities Milestones

1. Read existing Opportunities pages and routes.
2. Identify first production-safe Opportunity surface.
3. Apply PDOS calculator recommendation flow where relevant.
4. Verify SEO, CTA, analytics, and mobile layout.
5. Deploy and record production verification.

## Full-site QA Milestones

1. Verify key routes: homepage, calculators, guides, learn, 5 pilot city pages, request plan, opportunity pages.
2. Check desktop and narrow layout.
3. Check production HTTP 200 and canonical/robots/sitemap consistency.
4. Record known exclusions and acceptable static-preview backend warnings.
5. Archive final status and next growth tasks.
