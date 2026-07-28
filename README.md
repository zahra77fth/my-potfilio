# Portfolio Pro

Staff-oriented frontend portfolio for **Zahra Fattahi** — React 19, TypeScript, Vite 8, Tailwind CSS 4, React Three Fiber.

This repository is maintained like a production frontend codebase: explicit architecture, measurable performance choices, accessibility in the critical dialogs, and content that non-engineers can edit.

## Why these choices

| Choice | Trade-off |
|--------|-----------|
| Vite SPA | Simple deploy, great DX; no SSR — mitigate with solid `index.html` defaults + client SEO head |
| JSON in `src/data/` | Fast content edits for structured data; Zod-validated at load; long-form articles stay MDX (next) |
| Deferred R3F sky/galaxy | Brand atmosphere without blocking first paint (~33 KB entry vs ~1 MB when eager) |
| Framer + CSS `Reveal` | Rich chrome motion; cheap below-fold reveals |
| Thin design tokens | Consistency without an unused component library |
| No drei | Local `FatLine` / ortho camera instead of a heavy helper package for two call sites |

Deep rationale: [docs/design-decisions.md](./docs/design-decisions.md) · principles: [docs/engineering-principles.md](./docs/engineering-principles.md).

## Quick start

```bash
npm install
npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite HMR |
| `npm run build` | `tsc -b` + production bundle |
| `npm run preview` | Serve `dist/` |
| `npm run lint` | ESLint |
| `npm run validate:content` | Zod-validate `src/data/*.json` |

Optional: copy `.env.example` → `.env` and set `VITE_SITE_URL` for absolute SEO URLs.

## Architecture (30 seconds)

```
app/        → shell + routes
features/   → home, contact, layout, projects
components/ → shared UI, three, seo, a11y, motion
data/       → JSON source of truth
lib/        → loadData, theme, seo, motion (no React UI)
```

**Dependency rule:** `app` → `features` → `components`/`hooks`/`context` → `lib`/`types`/`data`.  
`lib` never imports `components`.

Full map: [docs/architecture.md](./docs/architecture.md) · folders: [docs/folder-structure.md](./docs/folder-structure.md).

## Performance posture

- CSS gradient paints first; WebGL mounts after idle
- Skips WebGL for reduced motion / reduced data
- Pauses canvas when the tab is hidden
- Lazy routes, lazy sections, vendor chunks; `r3f` is not modulepreloaded

Details and how to verify: [docs/performance.md](./docs/performance.md).

## Content

Edit `src/data/*.json` — no component changes required for copy/projects/experience.

| File | Use |
|------|-----|
| `site.json` | Identity, nav, SEO (`domain`, `ogImage`) |
| `profile.json` | Hero + about |
| `skills.json` / `experience.json` / `projects.json` / `education.json` | Sections |
| `writing.json` | Homepage Writing section title/subtitle only — article bodies live in `content/articles/*.mdx` |
| `contact.json` | Contact page |

Empty `live` / `github` / article `url` strings hide links.  
Guide: [docs/content-system.md](./docs/content-system.md).

## SEO & a11y (shipped)

- Per-route title/description/canonical/OG/Twitter/JSON-LD (`DocumentHead`)
- Build-time `robots.txt` + `sitemap.xml` (`vite.seo-plugin`)
- Focus trap + restore on mobile menu and project modal
- Focus moves to `#main` on client navigations
- Footer documents `P` (projects) / `R` (résumé) shortcuts

Set `site.domain` or `VITE_SITE_URL` before production deploys.

## How to extend

| Goal | Do this |
|------|---------|
| New article | Add `content/articles/<slug>.mdx` — see [docs/articles.md](./docs/articles.md) |
| New home section | Lazy section under `features/home/sections` + import from `HomePage` |
| New route | Feature folder + lazy route in `app/App.tsx` + SEO path in `lib/seo.ts` + sitemap entry in `vite.seo-plugin.ts` |
| New shared control | `components/ui` only if reused; else keep local to the feature |
| Theme/canvas color | `lib/theme` (not inside Three modules) |

## Documentation index

[docs/README.md](./docs/README.md)

## Git & deploy

- Workflow: [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md)
- Vercel: `npm run build`, output `dist/`; `vercel.json` SPA rewrites skip static SEO files
- Publish helper: `./scripts/publish-to-github.sh`

## Author

**Zahra Fattahi** — Frontend engineer (React, Next.js, design systems, performance)

- GitHub: [@zahra-hsb](https://github.com/zahra-hsb)
- LinkedIn: [Zahra HB](https://www.linkedin.com/in/zahra-hb-713760241/)
- Email: zafth98@gmail.com

## License

MIT
