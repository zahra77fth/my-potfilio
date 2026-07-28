import { useDeferredValue, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listCategories,
  listTags,
  paginateArticles,
  searchArticles,
} from '../../lib/articles'
import { Container } from '../../components/ui/Container'
import { ArticleCardLink } from './components/ArticleCardLink'
import { Pagination } from './components/Pagination'

export function WritingIndexPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [tag, setTag] = useState('All')
  const [page, setPage] = useState(1)
  const deferredQuery = useDeferredValue(query)

  const categories = useMemo(() => ['All', ...listCategories()], [])
  const tags = useMemo(() => ['All', ...listTags()], [])

  const filtered = useMemo(() => {
    let items = searchArticles(deferredQuery)
    if (category !== 'All') items = items.filter((article) => article.category === category)
    if (tag !== 'All') items = items.filter((article) => article.tags.includes(tag))
    return items
  }, [deferredQuery, category, tag])

  const { items, page: safePage, totalPages, total } = paginateArticles(filtered, page)

  const onFilter = (next: { query?: string; category?: string; tag?: string }) => {
    if (next.query !== undefined) setQuery(next.query)
    if (next.category !== undefined) setCategory(next.category)
    if (next.tag !== undefined) setTag(next.tag)
    setPage(1)
  }

  return (
    <div className="section-padding">
      <Container>
        <header className="writing-index__header">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Writing</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Technical writing
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Articles on React, TypeScript, and frontend architecture — hosted here, often also on
            Medium.
          </p>
          <p className="mt-3 text-sm text-muted">
            <Link to="/#writing" className="font-semibold text-accent">
              Jump to homepage carousel
            </Link>
          </p>
        </header>

        <div className="writing-index__filters">
          <label className="writing-index__search">
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(e) => onFilter({ query: e.target.value })}
              placeholder="Search title, tags, or content…"
              className="input-field"
            />
          </label>

          <label className="writing-index__select">
            <span className="ds-field-label">Category</span>
            <select
              className="input-field"
              value={category}
              onChange={(e) => onFilter({ category: e.target.value })}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="writing-index__select">
            <span className="ds-field-label">Tag</span>
            <select
              className="input-field"
              value={tag}
              onChange={(e) => onFilter({ tag: e.target.value })}
            >
              {tags.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {total} article{total === 1 ? '' : 's'}
        </p>

        {items.length === 0 ? (
          <p className="mt-10 text-muted">No articles match these filters.</p>
        ) : (
          <div className="writing-index__grid mt-8">
            {items.map((article) => (
              <ArticleCardLink key={article.slug} article={article} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Container>
    </div>
  )
}
