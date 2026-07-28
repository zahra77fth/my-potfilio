# Engineering principles

These rules exist so the repo stays maintainable as a **staff-level frontend artifact**, not just a pretty landing page.

## 1. Justify every change

Before editing, answer:

- Why is this better?
- Why is this simpler?
- Why is this more maintainable?
- Would another senior engineer agree?

If you cannot answer, do not make the change.

## 2. Prefer deletion over abstraction

Dead code, unused hooks, parallel “legacy” trees, and unused design primitives cost more than they save. Delete first. Extract only when duplication is real and stable.

## 3. Incremental evolution, not rewrites

Preserve git history. Refactor in thin slices that leave the app green (`tsc`, build) after each step. Do not rebuild the portfolio to prove taste.

## 4. One dependency direction

```
app → features → components / hooks / context → lib / types / data / design-system
```

`lib` must never import from `components`. Features own routes and product UI; shared UI stays dumb and reusable.

## 5. Optimize where measurement justifies it

Bundle size, GPU time, and LCP matter. Blanket `React.memo`, premature design systems, and speculative micro-libraries do not. See [performance.md](./performance.md).

## 6. Content stays editable without a deploy ritual for engineers

Structured portfolio data lives in JSON under `src/data/`. Changing a job title should not require touching React. Long-form writing (future MDX) is a different content type — do not force everything into one format. See [content-system.md](./content-system.md).

## 7. Accessibility and SEO are product features

Focus traps, route focus, reduced motion, canonical/OG tags, and sitemap generation are not “polish later.” They ship with the architecture. See [architecture.md](./architecture.md).

## 8. Docs must match the code

If reality diverges from docs, fix the docs in the same PR (or fix the code). Lying architecture notes are worse than none.
