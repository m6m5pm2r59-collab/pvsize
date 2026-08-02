---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: c4e42f760229254c82de8cc2300dc5c9_da7001018e3311f196d8525400f8a581
    ReservedCode1: dKXEs9zJt9ePBlmAI3uya5sZCJkMt3CHHH4zaYsB5ZcVIGr5GXkXDr+dBkDkFeIu8Dq0X7EudbraJts2cui2mrjFSo0MbzgLRyMMFHTY0/f5A31PDfie8rTgMdG5/v52Boqbha5hEJZrtifGfu81FLrNcXgnzEvVCsopeiphi4VYy/rNsYWcbhqndDI=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: c4e42f760229254c82de8cc2300dc5c9_da7001018e3311f196d8525400f8a581
    ReservedCode2: dKXEs9zJt9ePBlmAI3uya5sZCJkMt3CHHH4zaYsB5ZcVIGr5GXkXDr+dBkDkFeIu8Dq0X7EudbraJts2cui2mrjFSo0MbzgLRyMMFHTY0/f5A31PDfie8rTgMdG5/v52Boqbha5hEJZrtifGfu81FLrNcXgnzEvVCsopeiphi4VYy/rNsYWcbhqndDI=
---

# PVSize Opportunities Phase 5C — Published-Record Transition Preflight Matrix

Status: noindex-only planning gate

Created: 2026-08-02

## PUBLISHED_RECORD_PREFLIGHT: SOURCE_EVIDENCE_REQUIREMENTS

Before any record transitions from `discovered` / `needs_review` / `approved` to `review_status: published`, the following source evidence must be present:

- Official source URL matches a registered source in `sources.json`.
- Source is `review_status: approved`.
- Direct notice URL in the record resolves to an official government or institutional page.
- Notice ID / solicitation number / funding opportunity number is present.
- Agency / issuer name matches source registry.
- Published date and response deadline are present and not past.

## PUBLISHED_RECORD_PREFLIGHT: RECORD_QUALITY_REQUIREMENTS

- `quality_score` >= 60.
- `title` is non-empty and not truncated.
- `description` is non-empty, >50 characters, and contains at least one solar/PV/BESS/renewable keyword.
- `country` matches source country.
- `technology` array is non-empty and contains only allowed values.
- `type` is one of the allowed tender/incentive/procurement values.
- `status` is either `open` or `closed`.
- `deadline` is ISO 8601 date format or null.
- `value` and `currency` are present or explicitly null.

## PUBLISHED_RECORD_PREFLIGHT: REVIEW_NOTE_REQUIREMENTS

- A review note exists at `src/data/opportunities/review-notes/opp_{source_country}_{year}_{seq}.md`.
- Review note contains reviewer, review date, decision, source, and verification markers.
- Decision is `approved`.
- Source evidence verification is complete.
- Record quality verification is complete.

## PUBLISHED_RECORD_PREFLIGHT: DEADLINE_AND_STATUS_FRESHNESS

- If `status: open` and `deadline` exists, deadline must be in the future or within 7 days past (recently closed allowance).
- If `status: closed`, the record must still have a resolvable source URL and valid metadata.
- No record may be published if its source URL returns 404 or redirect to a non-matching page.

## PUBLISHED_RECORD_PREFLIGHT: PUBLISHED_ONLY_INDEXED_OUTPUT_DEPENDENCY

- Sitemap inclusion requires `review_status: published`.
- RSS feed inclusion requires `review_status: published`.
- JSON-LD structured data requires `review_status: published`.
- Newsletter content requires `review_status: published`.
- Indexing request requires at least one `review_status: published` record.

## PUBLISHED_RECORD_PREFLIGHT: STOP_CONDITIONS

Publishing is blocked if:

- Any source evidence requirement is unmet.
- Any record quality requirement is unmet.
- Any review note requirement is unmet.
- Deadline checks fail for open records.
- The published-only indexed output dependency is violated.
- Indexed release QA planning is incomplete.
- Phase 5C is still in Publication Pipeline without indexed release approval.
- Aggregate QA has not passed.

## PUBLISHED_RECORD_PREFLIGHT: CURRENT_NO_TRANSITION

No record currently meets published transition requirements:

- Five records exist as `review_status: discovered`.
- No record has `review_status: published`.
- No record transition to published may occur during the noindex-only planning phase.
- Phase 5C remains `Publication Pipeline`.
- Phase 5C is not Closed.
- No indexed release approval has been granted.
- No search indexing request has been made.

## PUBLISHED_RECORD_PREFLIGHT: VERIFICATION_COMMANDS

```bash
node src/tools/verify-opportunities-published-record-preflight-matrix.js --self-test
node src/tools/verify-opportunities-all.js
git diff --check
```
*（内容由AI生成，仅供参考）*
