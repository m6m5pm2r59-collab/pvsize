---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: c4e42f760229254c82de8cc2300dc5c9_db653a0b8e3311f196d8525400f8a581
    ReservedCode1: ++L2O29wETYqVArEF9ffW43Ozi8KVJ/RC99l1YeETzKuzLzJKFBJwERH8l0vJ592uH4+1ARa6bUtFL6iHqlWLv73yBewz8MLSy5j44f+BatcDNlEHajwla6+06GB16SKlgy9QAU+KpzDIZzlcLceRkvsLeBWLG4tNzDb727BjESVXUxOx+eEjqtNNs4=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: c4e42f760229254c82de8cc2300dc5c9_db653a0b8e3311f196d8525400f8a581
    ReservedCode2: ++L2O29wETYqVArEF9ffW43Ozi8KVJ/RC99l1YeETzKuzLzJKFBJwERH8l0vJ592uH4+1ARa6bUtFL6iHqlWLv73yBewz8MLSy5j44f+BatcDNlEHajwla6+06GB16SKlgy9QAU+KpzDIZzlcLceRkvsLeBWLG4tNzDb727BjESVXUxOx+eEjqtNNs4=
---

# PVSize Opportunities Phase 5C — Indexed Output Activation Preflight Matrix

Status: noindex-only planning gate

Created: 2026-08-02

## INDEXED_OUTPUT_PREFLIGHT: SITEMAP_ACTIVATION

Sitemap activation for Opportunities URLs requires:

- At least one record is `review_status: published`.
- All published records pass local aggregate QA.
- All published records pass production QA.
- Sitemap generator includes only published-record paths.
- Sitemap XML is valid and includes correct `<lastmod>` dates.
- Sitemap is accessible at the canonical sitemap URL.
- noindex meta tag is removed from published pages.
- Fallback: if sitemap activation fails, restore noindex and remove Opportunities URLs from sitemap.

## INDEXED_OUTPUT_PREFLIGHT: RSS_ACTIVATION

RSS feed activation for Opportunities requires:

- At least one record is `review_status: published`.
- RSS XML is valid Atom or RSS 2.0 format.
- Feed includes only published-record entries.
- Feed is accessible at a canonical feed URL.
- Feed entries include correct dates, titles, and links.
- Fallback: if RSS activation fails, remove feed file and confirm 404.

## INDEXED_OUTPUT_PREFLIGHT: JSON_LD_ACTIVATION

JSON-LD structured data activation requires:

- At least one record is `review_status: published`.
- Only published records include JSON-LD blocks.
- JSON-LD uses Schema.org `JobPosting` or `GovernmentService` types.
- JSON-LD is valid (passes Google Structured Data Testing Tool pattern).
- JSON-LD does not appear on non-published record pages.
- Fallback: if JSON-LD activation fails, remove all JSON-LD blocks.

## INDEXED_OUTPUT_PREFLIGHT: PUBLISHED_RECORD_DEPENDENCY

All three indexed outputs (sitemap, RSS, JSON-LD) share a common dependency:

- Published-record transition preflight must pass before any output activation.
- No output may activate with zero published records.
- No output may include non-published records.

## INDEXED_OUTPUT_PREFLIGHT: PRODUCTION_QA_DEPENDENCY

Before activating any indexed output:

- Production QA execution checklist must be run.
- Production QA go/no-go criteria must return GO.
- Production QA evidence bundle must be complete.
- Production QA signoff must be recorded.

## INDEXED_OUTPUT_PREFLIGHT: ROLLBACK_AND_NOINDEX_FALLBACK

Each activation must have a verified rollback procedure:

- Sitemap rollback: remove Opportunities URLs, confirm exclusion.
- RSS rollback: remove feed file, confirm 404.
- JSON-LD rollback: remove all `application/ld+json` blocks.
- noindex rollback: restore `noindex,follow` on all Opportunities pages.

## INDEXED_OUTPUT_PREFLIGHT: CURRENT_NO_OUTPUT

No indexed output is active:

- Sitemap does not include any Opportunities URLs.
- No Opportunities RSS/feed file exists.
- No Opportunities page contains JSON-LD structured data.
- All Opportunities pages remain `noindex,follow`.
- Phase 5C remains Publication Pipeline.
- Phase 5C is not Closed.
- No indexed release approval has been granted.

## INDEXED_OUTPUT_PREFLIGHT: VERIFICATION_COMMANDS

```bash
node src/tools/verify-opportunities-indexed-output-activation-preflight-matrix.js --self-test
node src/tools/verify-opportunities-all.js
git diff --check
```
*（内容由AI生成，仅供参考）*
