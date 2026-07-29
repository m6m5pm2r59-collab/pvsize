# PVSize Opportunities Runbook

Updated: 2026-07-30

## Per-Run Startup

Each run must read:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_MASTER_PLAN.md`
- `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
- `docs/pdos/PVSIZE_UI_STATUS.md`
- The Opportunities execution plan in Obsidian.
- ADR-006.
- Latest relevant report.
- Git status.
- Recent commits.

Use `Next Single Task` in the status file as the only execution entry.

## Working Rules

- One smallest verifiable task per run.
- Preserve PDOS design language.
- Do not modify production code during Phase 0.
- Do not invent opportunity data.
- Do not publish unverifiable opportunities.
- Do not submit real forms.
- Do not create paid, login, or account features in MVP unless explicitly approved.
- Do not put opportunities before calculator completion in calculator flows.

## Validation

For Phase 0:

- Document exists.
- Required audit sections are present.
- `git diff --check` passes.
- No production page/code changes are included.

For implementation phases:

- Static checks.
- Relevant local scripts/tests.
- SEO and canonical checks.
- Analytics marker checks.
- Responsive/browser checks when UI changes.
- Production verification when deployed.

## Opportunities QA Modes

Use the default local aggregate QA for normal development and pre-commit checks:

- `node src/tools/verify-opportunities-all.js`

This mode is local-only. It runs the data validator, detail generator, page verifier, index-policy verifier, analytics/CTA verifier, and local HTTP verifier. It does not require production network access.

Use the optional production noindex QA only for production or post-deploy verification:

- `PVSIZE_VERIFY_PRODUCTION=1 node src/tools/verify-opportunities-all.js`

This mode runs the default local aggregate QA first, then checks `https://pvsize.com` for Opportunities listing/detail HTTP 200, `noindex,follow`, no premature JSON-LD, sitemap exclusion, RSS/feed absence, and homepage entry link.

Do not use the optional production QA to approve sitemap, RSS, newsletter capture, structured data, indexed SEO launch, published opportunity record status, or Phase 5C closure. Those remain separately gated.

## Reporting

Every run must update:

- `docs/opportunities/PVSIZE_OPPORTUNITIES_STATUS.md`
- A report in `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`

Reports must record:

- Goal.
- Files changed.
- Verification.
- Risks.
- Next single task.

## Escalation

Pause and ask for user decision before:

- Adding paid features.
- Adding authentication.
- Adding external data crawling that may violate source terms.
- Changing DNS/domain/account settings.
- Deleting production pages.
- Changing business strategy.
- Running bulk imports into production.
