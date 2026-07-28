# PVSize UI/UX Continuous Delivery Runbook

Updated: 2026-07-28

## Start Of Every Run

Read these first:

1. `docs/pdos/PVSIZE_UI_MASTER_PLAN.md`
2. `docs/pdos/PVSIZE_UI_RUNBOOK.md`
3. `docs/pdos/PVSIZE_UI_STATUS.md`
4. `/Users/xiaotudou/Documents/Obsidian/raw/08_codex专属部门/PVSize Design Operating System/01_执行看板.md`
5. Latest relevant report under `/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`
6. `git status --short`
7. Recent relevant commits

Use `PVSIZE_UI_STATUS.md` "Next single task" as the only execution entry.

## Work Rules

- Each run may complete only one smallest independent task.
- Prefer real UI/code improvement over planning-only output.
- Preserve SEO, canonical, robots, schema, analytics scripts, forms, calculator logic, country mapping, currency/unit logic, and localizations.
- Do not modify Stage 0 frozen PDOS files.
- Do not start Opportunities until City Pages pilot decision is recorded.
- Do not batch all city pages until the path strip is componentized or template-driven.
- Do not invent local policy, cost, electricity, or rebate facts.

## Validation Rules

Pick the smallest sufficient verification set for the changed scope:

- Static checks such as `git diff --check`.
- Local page load for edited pages and shared CSS.
- Desktop and narrow viewport screenshots for visual changes.
- Production URL checks after deployment.
- Confirm main domain serves the deployed version.
- Distinguish expected static-preview backend errors from real page errors.

## Commit And Deploy Rules

Commit only when:

- The task is complete.
- Local verification passed.
- Changed files are scoped.
- `PVSIZE_UI_STATUS.md` is updated.

Deploy only when:

- The task is production-safe.
- Build or relevant checks pass.
- Commit is complete.
- The deployed production URL and `https://pvsize.com` can be verified.

Do not mark `Closed` without production verification evidence.

## Stop And Ask

Pause and ask the user before:

- Deleting many production pages.
- Changing DNS, domain, account permission, payment, privacy, or user-data logic.
- Running broad irreversible rewrites.
- Modifying Stage 0 frozen rules.
- Overwriting unknown user changes.
- Spending money or changing external account settings.
- Continuing after serious production deployment failure.

## End Of Every Run

Update `docs/pdos/PVSIZE_UI_STATUS.md` with:

- Current phase
- Current sample/page
- Run goal
- Completed work
- Modified files
- Verification and result
- Commit hash
- Deployment URL
- Production verification status
- Risks or gaps
- Next single task
- Whether user decision is needed

Also add or update a concise report in:

`/Users/xiaotudou/Documents/Codex/2026-07-16/pvsize-daily-ops/reports/`
