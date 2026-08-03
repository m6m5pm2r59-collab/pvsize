# PV Root to `/pv` Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move visible PV project assets under `/pv` while preserving the current repository-level deployment entry points.

**Architecture:** The PV project becomes the source of truth under `/pv`. The repository root keeps only repo-level metadata plus compatibility symlinks so existing local scripts, paths, and Vercel rootDirectory=`src` continue to work without an immediate platform-side change.

**Tech Stack:** Git, symlinks, Vercel rootDirectory, Node.js verification scripts

## Global Constraints

- Do not change GitHub repository ownership or split into a second repository in this task.
- Do not deploy.
- Do not change Vercel dashboard settings in this task.
- Do not modify KR1688 files except to keep directory boundaries clear.
- Keep the current production-compatible root path `src` available after migration.
- Keep the task minimal: migrate structure, preserve behavior, verify locally, then push.

---

### Task 1: Create repo split shell

**Files:**
- Create: `docs/superpowers/plans/2026-08-03-pv-root-to-pv-migration.md`
- Modify: `README.md`
- Modify: `pv/README.md`
- Test: repository root and `/pv` structure checks

**Interfaces:**
- Consumes: existing repository root layout and `/pv` placeholder directory
- Produces: root repo index plus `/pv` project identity

- [ ] **Step 1: Replace the root README with a repo-split index**

- [ ] **Step 2: Rewrite `/pv/README.md` as the PV project README**

- [ ] **Step 3: Verify both README files describe the new root-vs-project boundary**

### Task 2: Move visible PV assets into `/pv`

**Files:**
- Move: `deploy.sh` -> `pv/deploy.sh`
- Move: `docs` -> `pv/docs`
- Move: `manifest.json` -> `pv/manifest.json`
- Move: `og-image.png` -> `pv/og-image.png`
- Move: `reports` -> `pv/reports`
- Move: `src` -> `pv/src`
- Move: `vercel.json` -> `pv/vercel.json`
- Test: root compatibility paths

**Interfaces:**
- Consumes: root visible PV asset set
- Produces: `/pv` as the PV source-of-truth tree

- [ ] **Step 1: Move the visible PV asset directories and files into `/pv`**

- [ ] **Step 2: Recreate root compatibility paths as symlinks pointing into `/pv`**

- [ ] **Step 3: Verify the moved paths exist under `/pv` and the root links resolve**

### Task 3: Verify non-deploy compatibility

**Files:**
- Test: `src`
- Test: `docs`
- Test: `reports`
- Test: `pv/src/tools/verify-opportunities-all.js`

**Interfaces:**
- Consumes: symlinked root compatibility paths
- Produces: evidence that existing root expectations still function

- [ ] **Step 1: Verify symlink status for root compatibility paths**

- [ ] **Step 2: Run `node src/tools/verify-opportunities-all.js`**

- [ ] **Step 3: Run `git diff --check` and confirm clean structural migration output**

- [ ] **Step 4: Commit and push the migration**
