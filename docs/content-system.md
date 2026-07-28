# Content system

## Why JSON for portfolio records

Portfolio data is **structured**: roles, dates, skill lists, project tags, nav links. JSON is the smallest honest representation:

- Diffable in PRs
- Editable without React knowledge
- Imported at build time (no content API, no waterfall)
- Validated at build/CI with Zod (`src/lib/content/schema.ts`) — not shipped in the client bundle


## Source of truth

```
src/data/*.json
  → getPortfolioData()          // typed bag (Zod-checked in CI/build)
  → PortfolioProvider
  → usePortfolio() in features
```

| File | Role |
|------|------|
| `site.json` | Identity, social, nav, SEO (`domain`, `ogImage`, keywords) |
| `profile.json` | Hero + about |
| `skills.json` | Skill groups |
| `experience.json` | Work history |
| `projects.json` | Case studies (empty `live`/`github` hides links) |
| `education.json` | Education + certifications |
| `writing.json` | Homepage Writing chrome (title/subtitle only) |
| `content/articles/*.mdx` | Article source of truth (see [articles.md](./articles.md)) |
| `contact.json` | Contact page copy + FAQ |

Types are inferred from Zod and re-exported from `src/types` so feature imports stay stable.

Assets referenced by path live under `public/` (avatar, thumbs, OG image, résumé).

## Authoring rules

1. Prefer editing JSON over hard-coding copy in components.
2. Empty string URLs mean “no link” — do not invent `#` placeholders.
3. Set `site.domain` or `VITE_SITE_URL` before production so sitemap/OG absolute URLs resolve.
4. Run `npm run validate:content` after content edits (also runs in CI).
5. Writing items may include a kebab-case `slug` (prep for on-site articles) and/or external `url` (e.g. Medium).

## What JSON is not for

Long-form articles live in **MDX** under `content/articles/`. Do not stuff article bodies into JSON.

## Validation

```bash
npm run validate:content
```

Invalid shapes fail `npm run validate:content` with path-level messages. That script runs in CI and as the first step of `npm run build`, so bad JSON never ships — without putting Zod in the client bundle.

## How to extend

1. Add fields to the JSON file.
2. Extend the Zod schema in `src/lib/content/schema.ts` (types update automatically).
3. Consume via `usePortfolio()` in the feature that owns the UI.

Avoid a second content loader. One bag, one provider, one schema.
