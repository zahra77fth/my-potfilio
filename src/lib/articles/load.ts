import type { ArticleFrontmatter, ArticleMeta, ArticleModule, ArticleRecord } from './types'
import { estimateReadingMinutes, parseFrontmatter } from './frontmatter'
import { extractHeadings, slugFromPath } from './utils'

const rawModules = import.meta.glob('../../../content/articles/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, unknown>

const componentModules = import.meta.glob('../../../content/articles/*.mdx') as Record<
  string,
  () => Promise<ArticleModule>
>

function asFrontmatter(data: Record<string, unknown>): ArticleFrontmatter {
  // Shape enforced by `npm run validate:content` — keep client free of Zod.
  return {
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    updated: data.updated ? String(data.updated) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: String(data.category ?? ''),
    image: String(data.image ?? ''),
    draft: Boolean(data.draft),
    mediumUrl: data.mediumUrl ? String(data.mediumUrl) : undefined,
  }
}

function asRawSource(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'default' in value) {
    const nested = (value as { default: unknown }).default
    if (typeof nested === 'string') return nested
  }
  throw new Error('Article source must be a raw string (check Vite MDX/?raw plugin order)')
}

function buildCatalog(): ArticleRecord[] {
  const articles: ArticleRecord[] = []

  for (const [path, raw] of Object.entries(rawModules)) {
    const { data, content } = parseFrontmatter(asRawSource(raw))
    const frontmatter = asFrontmatter(data)
    if (frontmatter.draft) continue

    const slug = slugFromPath(path)
    const readingMinutes = estimateReadingMinutes(content)

    articles.push({
      ...frontmatter,
      slug,
      readingTime: `${readingMinutes} min read`,
      readingMinutes,
      headings: extractHeadings(content),
      bodyText: content,
    })
  }

  return articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

let cached: ArticleRecord[] | null = null

export function listArticles(): ArticleRecord[] {
  if (!cached) cached = buildCatalog()
  return cached
}

export function listArticleMeta(): ArticleMeta[] {
  return listArticles().map(({ headings: _h, bodyText: _b, ...meta }) => meta)
}

export function getArticle(slug: string): ArticleRecord | undefined {
  return listArticles().find((article) => article.slug === slug)
}

export async function loadArticleComponent(slug: string) {
  const entry = Object.entries(componentModules).find(([path]) => slugFromPath(path) === slug)
  if (!entry) throw new Error(`Unknown article: ${slug}`)
  const mod = await entry[1]()
  return mod.default
}

export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const current = getArticle(slug)
  if (!current) return []

  return listArticles()
    .filter((article) => article.slug !== slug)
    .map((article) => {
      const sharedTags = article.tags.filter((tag) => current.tags.includes(tag)).length
      const sameCategory = article.category === current.category ? 1 : 0
      return { article, score: sharedTags * 2 + sameCategory }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (a.article.date < b.article.date ? 1 : -1))
    .slice(0, limit)
    .map(({ article }) => {
      const { headings: _h, bodyText: _b, ...meta } = article
      return meta
    })
}

export function getAdjacentArticles(slug: string): {
  prev: ArticleMeta | null
  next: ArticleMeta | null
} {
  const articles = listArticleMeta()
  const index = articles.findIndex((article) => article.slug === slug)
  if (index < 0) return { prev: null, next: null }
  return {
    prev: articles[index + 1] ?? null,
    next: articles[index - 1] ?? null,
  }
}

export function searchArticles(query: string): ArticleRecord[] {
  const q = query.trim().toLowerCase()
  if (!q) return listArticles()

  return listArticles().filter((article) => {
    const haystack = [
      article.title,
      article.description,
      article.category,
      ...article.tags,
      article.bodyText,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function listCategories(): string[] {
  return [...new Set(listArticles().map((article) => article.category))].sort()
}

export function listTags(): string[] {
  return [...new Set(listArticles().flatMap((article) => article.tags))].sort()
}

export const ARTICLES_PER_PAGE = 6

export function paginateArticles<T>(items: T[], page: number, pageSize = ARTICLES_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total: items.length,
  }
}
