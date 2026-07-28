# Folder structure

## Why folders matter

Folder boundaries encode ownership. When two trees solve the same problem (legacy vs live), contributors ship to the wrong place. This repo has one live tree.

## `src/` map

| Path | Owns | Does not own |
|------|------|--------------|
| `app/` | Bootstrap, providers, route table | Section UI, 3D scenes |
| `features/home` | Home composition, hero, sections | Global chrome |
| `features/contact` | Contact page | Site header/footer |
| `features/layout` | Shell chrome (header, footer, nav, outlet) | Page-specific content |
| `features/projects` | Project cards + modal | Unrelated marketing sections |
| `components/ui` | Reusable primitives (Button, Section, …) | Feature business logic |
| `components/three` | Sky / galaxy WebGL | App routing |
| `components/motion` | `Reveal`, headline split | Page layout |
| `components/seo` | `DocumentHead` | Meta string helpers (`lib/seo`) |
| `components/a11y` | Route focus helpers | Focus-trap hook (`hooks/`) |
| `context/` | React providers for theme + portfolio bag | Fetching / mutation |
| `data/` | Author-edited JSON (Zod-validated) | Duplicate public copies |
| `design-system/` | Tokens + `cn` | Full component library (intentionally thin) |
| `hooks/` | Leaf reusable hooks | Feature-only state |
| `lib/` | Pure helpers (load, theme, motion, seo, content schema) | React components |
| `types/` | Contracts for JSON shapes | Runtime parsing |

## `public/`

Static assets copied as-is: avatar, project thumbs, writing art, résumé, favicon, OG image.  
`robots.txt` / `sitemap.xml` are **generated** on dev/build by `vite.seo-plugin` (gitignored).

## What to avoid

- Creating `pages/` again — routes live under `features/` + `app/`
- Putting route UI in `components/sections/` — that legacy path was deleted
- Growing `design-system/` into an unused primitive kit — tokens + `cn` are enough until patterns stabilize
- Importing from `features/*` into `components/*` — dependency inversion

## Related

- [architecture.md](./architecture.md) — dependency rules
- [content-system.md](./content-system.md) — `src/data` ownership
