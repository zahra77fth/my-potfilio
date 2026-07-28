# Performance

## Goal

Protect **first paint** and **interaction** while keeping the immersive background. Perceived performance > synthetic purity.

## Budgets (current strategy)

| Area | Policy |
|------|--------|
| First paint | CSS scene gradient + theme FOUC script in `index.html` |
| Main JS | Keep entry small; do not statically import Three |
| 3D | Lazy + deferred (`useDeferredScene`); no `r3f` modulepreload |
| 3D skip | `prefers-reduced-motion` or performance tier `lite` (`prefers-reduced-data`) |
| GPU | `frameloop="never"` while `document.visibilityState` is hidden |
| Routes / sections | `React.lazy` + `Suspense` |
| Vendors | Manual chunks: `react`, `router`, `motion`, `three`, `r3f` |
| Scroll progress | CSS `animation-timeline` only |
| Below-fold motion | `Reveal` (IO + CSS), not Framer |

## Measured outcome (Phase 2)

| Chunk | Role |
|-------|------|
| `index-*.js` ~33 KB | App shell (was ~1 MB when Three was eager) |
| `motion-*.js` | Framer — still on first paint (header/cursors/outlet) |
| `r3f-*.js` ~883 KB | Fiber + Three — loaded only after idle scene mount |

Exact hashes change per build; re-check with `npm run build`.

## How to verify

```bash
npm run build
# Inspect dist/assets/* sizes and dist/index.html modulepreload list.
# r3f / three / GalaxyCanvas / SkyCanvas must NOT be preloaded.
npm run preview
```

Chrome Performance + Lighthouse (Incognito): confirm LCP is not blocked on WebGL.

## What not to do

- Blanket `React.memo` / `useMemo` without a profile
- Eager-importing `GalaxyCanvas` / `SkyCanvas` from Layout
- Re-adding drei for convenience helpers
- Enabling continuous canvas work in background tabs
- Treating ARCHITECTURE claims as truth without checking `vite.config.ts` and `SceneBackground`

## Related code

- `src/components/background/SceneBackground.tsx`
- `src/hooks/useDeferredScene.ts`
- `src/components/three/SceneCanvasShell.tsx`
- `vite.config.ts` (`manualChunks`, `modulePreload.resolveDependencies`)
