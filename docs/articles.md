# Articles (MDX)

## Why MDX

Long-form writing needs headings, code, and prose — not JSON strings. Each article is **one file** under `content/articles/`.

```
content/articles/<slug>.mdx  →  /writing/<slug>
```

Adding an article = add that file. Homepage carousel, `/writing` index, sitemap, and RSS pick it up automatically.

## Frontmatter

```yaml
---
title: Your title
description: One or two sentences for cards + SEO
date: 2025-11-12
updated: 2025-11-20        # optional
tags: [React, Performance]
category: Performance
image: /writing/react-19.svg
draft: false               # optional, default false
mediumUrl: ""              # optional Medium/canonical republication URL
---
```

The **filename** is the slug (`react-19-compiler-performance.mdx` → `/writing/react-19-compiler-performance`).

## Features

| Feature | Implementation |
|---------|----------------|
| Syntax highlighting | `rehype-pretty-code` + Shiki |
| Copy code | MDX `pre` → `CodeBlock` |
| Reading time | `reading-time` on MDX body |
| Tags / categories | Frontmatter + index filters |
| Search | Client filter over title/description/tags/body |
| Related | Shared tags + same category |
| Prev / next | Chronological neighbors |
| TOC | Heading extract + IntersectionObserver |
| Pagination | `/writing` index, 6 per page |
| RSS | `public/rss.xml` (generated) |
| Sitemap | Article URLs included |
| SEO | Per-article title/description/OG + `BlogPosting` JSON-LD |

## Authoring Medium reprints

Keep the same content here. Set `mediumUrl` to the Medium post if you want an “Also on Medium” link. Prefer this site’s URL as the primary share target when possible.

## Related code

- `src/lib/articles/` — catalog, search, related, lazy MDX load
- `src/features/articles/` — index + article page UI
- `vite.config.ts` — `@mdx-js/rollup` pipeline
- `vite.seo-plugin.ts` — sitemap + RSS
