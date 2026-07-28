# Architecture

## Why this shape

The app is a Vite SPA with feature folders. That choice favors:

- Fast local iteration and static hosting (Vercel)
- Clear ownership of home vs contact vs projects UI
- Build-time content (JSON imports) with no content fetch waterfall

It deliberately does **not** use Next.js/SSR today. The trade-off: social scrapers that skip JS only see `index.html` defaults; per-route meta still updates in the client for users and JS-capable crawlers. Absolute OG URLs and sitemap entries require `site.domain` or `VITE_SITE_URL`.

## Runtime topology

```
main.tsx
  → app/App.tsx
      → AppProviders (Theme + Portfolio)
      → BrowserRouter
          → DocumentHead (per-route SEO)
          → RouteFocus (focus → #main)
          → HashScroll
          → Layout
              → SceneBackground (CSS first; deferred WebGL)
              → Header / SectionNav / Outlet / Footer
```

Routes:

| Path | Feature |
|------|---------|
| `/` | `features/home` (lazy sections below the fold) |
| `/contact` | `features/contact` |

## Layers

```
src/
  app/             Entry, providers, routing
  features/        Route-level UI (home, contact, layout, projects)
  components/      Shared UI, motion, effects, background, three, seo, a11y
  context/         Theme + portfolio data providers
  data/            JSON content (build-time source of truth)
  design-system/   Tokens + `cn` utility
  hooks/           Small reusable hooks
  lib/             Data loading, theme, motion, seo helpers
  types/           TypeScript contracts for JSON
```

## Dependency rules

**Allowed:** `app` → `features` → (`components` | `hooks` | `context`) → (`lib` | `types` | `data` | `design-system`)

**Forbidden:** `lib` → `components` (inverted infrastructure)

Theme clear colors and boot gradients live in `lib/theme` so Three/sky modules can import them — not the reverse.

## Data flow

```
src/data/*.json
  → getPortfolioData()          // static imports, typed bag
  → PortfolioProvider
  → usePortfolio() in features
```

No runtime fetch for portfolio content. Edit JSON → HMR / rebuild.

## Cross-cutting systems

| Concern | Where | Why |
|---------|-------|-----|
| Theme | `context/ThemeContext`, `lib/theme` | Persist preference; sync document + canvas clear |
| SEO | `components/seo/DocumentHead`, `lib/seo`, `vite.seo-plugin` | Per-route head without a heavy helmet lib; build-time robots/sitemap |
| A11y dialogs | `hooks/useFocusTrap` | One trap implementation for menu + project modal |
| Route focus | `components/a11y/RouteFocus` | Keyboard/SR land in `#main` after client navigations |
| Motion | Framer (chrome) + `Reveal` (IO/CSS below fold) | Dual stack is intentional — see [design-decisions.md](./design-decisions.md) |
| 3D | `components/three/*`, deferred via `SceneBackground` | Visual product; never on the critical path |

## Extending the architecture

1. **New page** — add a feature folder, lazy route in `app/App.tsx`, SEO branch in `lib/seo.ts`, sitemap route in `vite.seo-plugin.ts`.
2. **New home section** — lazy import from `features/home/HomePage.tsx`; keep section UI under `features/home/sections`.
3. **New shared control** — `components/ui` only if reused across features; otherwise keep it local to the feature.

Root [ARCHITECTURE.md](../ARCHITECTURE.md) is a short pointer here — keep detail in `docs/`.
