# PVSize Opportunities Data

Status: schema-only, no published records.

This directory is the file-backed starting point for Solar Opportunities V1.

Current files:

- `opportunities.json`: reviewed opportunity records.
- `sources.json`: approved source registry.
- `tags.json`: controlled taxonomy.
- `opportunities.schema.md`: field definitions, review states, and validation rules.

Rules:

- Do not add real records unless each record has an official source URL and review status.
- Do not publish records with `review_status` below `approved`.
- Do not add generated pages to the sitemap until records pass validation and editorial review.
- Do not copy paid database content.
- Do not auto-publish AI-discovered opportunities.
