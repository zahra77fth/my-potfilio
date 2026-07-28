# Design decisions

Record of choices that look optional from the outside but are load-bearing.

## SPA (Vite) instead of Next.js

**Why:** Portfolio content is mostly static, hosting should be trivial, and the immersive WebGL background is a client product. SSR would force a heavier framework and complicate Three.js without enough SEO payoff for a personal site *yet*.

**Cost:** Weak non-JS preview for `/contact`. Mitigated with strong `index.html` defaults + client `DocumentHead` + sitemap.

**Revisit when:** Articles need shareable per-URL OG that scrapers must see without JS, or you need SSR/ISR for content at scale.

## JSON for portfolio data (not MDX, not a CMS)

**Why:** Profile, jobs, skills, and projects are structured records. JSON diffs cleanly, needs no toolchain, and HMR works. Authors edit files; engineers do not gate copy changes.

**Cost:** Authors must keep JSON valid — Zod fails the app/CI on drift. Writing index naming is aligned (`writing.json`).

**Not for:** Long-form articles — those should be MDX (planned), not stuffed into JSON strings.

## Dual motion stacks (Framer + CSS `Reveal`)

**Why:** Framer is excellent for route transitions, header, menu, and cursor affordances. Below-fold sections do not need a JS animation library on the critical path — `IntersectionObserver` + CSS is enough and cheaper.

**Cost:** Two APIs to learn. Documented as intentional, not unfinished migration.

**Do not:** Reintroduce a second Framer reveal helper (`MotionReveal` was deleted).

## Deferred React Three Fiber, not “no canvas”

**Why:** The sky/galaxy *is* the brand atmosphere. Removing it for Lighthouse vanity would change the product. Instead: CSS gradient first paint, idle mount, skip on reduced-motion / reduced-data, pause when tab hidden, never modulepreload the `r3f` chunk.

**Cost:** ~883 KB deferred vendor still downloads for capable users after idle.

**Removed:** `@react-three/drei` — only `Line` + `OrthographicCamera` were used; local `FatLine` / `SkyOrthoCamera` keep the dependency graph honest.

## Thin design system

**Why:** Tokens + `cn` reduce inconsistency without inventing an internal component library nobody uses. Unused `Box`/`Stack` wrappers were deleted.

**Do not:** Add primitives “for completeness.” Extract when a third call site appears.

## No react-helmet

**Why:** A small `applyPageMeta` helper updates the real DOM. One less dependency and enough for this SPA.

## Focus trap as a hook, not a package

**Why:** Two dialogs (menu, project modal). A 40-line hook matches the need; floating-ui focus packages would be disproportionate.

## Related

- [performance.md](./performance.md)
- [content-system.md](./content-system.md)
- [engineering-principles.md](./engineering-principles.md)
