# Repository Split Index

This repository now uses two isolated top-level workspaces:

- [`/pv`](./pv/) — PVSize solar calculator project
- [`/kr1688`](./kr1688/) — KR1688 Arabic story platform project

Current operating rule:

- PV remains the only live production project in this repository.
- KR1688 stays isolated under `/kr1688`.
- Repository-root compatibility paths may still point into `/pv` during migration.

Migration status on 2026-08-03:

- `/pv` is the PV source-of-truth workspace.
- Root compatibility paths are being preserved for transition safety.
- A later approved task can remove root compatibility links after platform settings are updated.
