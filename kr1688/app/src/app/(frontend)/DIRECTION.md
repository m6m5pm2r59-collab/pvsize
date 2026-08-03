# KR1688 Frontend Direction

## Product framing

KR1688 is a **story-first** product. Every page and component must center on stories and reading.

### What KR1688 IS:
- Arabic-native story reading and discovery platform
- Saudi-first content emphasis
- Content-first CMS-powered experience (Payload + Next.js)
- RTL-first design system (Arabic as default reading direction)

### What KR1688 is NOT:
- An author marketplace (no author profiles, earnings, dashboards)
- An ecommerce platform (no shop, payment, subscription walls in Phase 2A)
- A blog or news site (stories are long-form narrative, not posts)
- A community-first forum (comments support reading, not social networking)

## App shell boundaries

| Layer | Purpose |
|---|---|
| `(frontend)/` | Public-facing story reader, story listing, about page |
| `(payload)/` | Admin panel only — not customer-facing |

## Design principles

1. **RTL default** — all layout, typography, and spacing assumes Arabic reading direction
2. **Story-first IA** — homepage leads with story discovery, not blog posts or marketing
3. **Minimal chrome** — reader experience over navigation complexity
4. **Bilingual where needed** — Arabic primary, English fallback for UI chrome and metadata

## Next steps (post-Phase 2A)

- Replace generic Payload template homepage with story-first landing
- RTL Tailwind configuration
- Arabic typography stack (Noto Naskh Arabic / IBM Plex Sans Arabic)
- Story listing + chapter reader pages
