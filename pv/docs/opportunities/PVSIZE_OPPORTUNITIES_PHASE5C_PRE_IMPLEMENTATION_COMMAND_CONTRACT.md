# PVSize Opportunities Phase 5C Pre-Implementation Command Contract

Status: command contract gate only

Updated: 2026-08-02

## Purpose

This document defines the canonical local command entrypoint for Opportunities aggregate QA during the Phase 5C pre-implementation stage.

It does not deploy, add indexed output, add sitemap/RSS output, add JSON-LD output, add newsletter form/output, request search indexing, change record publication states, or change Opportunities product surfaces.

## PRE_IMPLEMENTATION_COMMAND_CONTRACT: CANONICAL_LOCAL_ENTRYPOINT

The canonical local entrypoint for Opportunities aggregate QA is:

- `npm --prefix src run verify:opportunities`

This is the operator-facing command that Marvis, Codex, and future CI wiring should reference first during pre-implementation work.

## PRE_IMPLEMENTATION_COMMAND_CONTRACT: OPTIONAL_PRODUCTION_NOINDEX_ENTRYPOINT

The optional production noindex verification passthrough is:

- `npm --prefix src run verify:opportunities:production-noindex`

This passthrough is for future production noindex checks only. It is not approval to deploy, index, publish, request indexing, or close Phase 5C.

## PRE_IMPLEMENTATION_COMMAND_CONTRACT: DIRECT_SCRIPT_BACKING

The package scripts are only wrappers around the existing direct script entrypoints:

- `node src/tools/verify-opportunities-all.js`
- `PVSIZE_VERIFY_PRODUCTION=1 node src/tools/verify-opportunities-all.js`

The direct Node commands remain the implementation backing. The `npm --prefix src run ...` entrypoint is the canonical operator path.

## PRE_IMPLEMENTATION_COMMAND_CONTRACT: EXIT_CODE_RULE

The canonical command contract is pass/fail by process exit code:

- Exit `0` means the full aggregate gate passed.
- Any non-zero exit means the stage must stop and investigate before continuing.
- Do not treat partial step output as success if the final process exit is non-zero.

## PRE_IMPLEMENTATION_COMMAND_CONTRACT: STAGE_BOUNDARY

This command contract task must not be combined with:

- CI workflow creation
- indexed output activation
- newsletter output activation
- published record transitions
- deployment
- indexing request
- Opportunities listing/detail product-surface changes

Those remain separate later tasks in the pre-implementation queue.

## PRE_IMPLEMENTATION_COMMAND_CONTRACT: OPERATOR_EXPECTATION

During Phase 5C pre-implementation:

- Use `npm --prefix src run verify:opportunities` as the default QA command in reports and handoffs.
- Use the optional production noindex passthrough only when a later task explicitly needs production noindex verification.
- Keep the current MVP noindex-only.
- Keep all five records below `published`.
- Treat this contract as infrastructure-only.

## Current No-Release Requirement

This task only defines the canonical aggregate QA command contract.

Do not deploy, add indexed output, add newsletter form/output, request indexing, change record publication states, or change Opportunities product surfaces in this task.
