import { useDeferredValue, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  listArticleMeta,
  listCategories,
  listTags,
  paginateArticles,
  searchArticles,
  type ArticleDifficulty,
} from '../../lib/articles'
import { Container } from '../../components/ui/Container'
import { Button } from '../../components/ui/Button'
import { KnowledgeArticleCard } from './components/KnowledgeArticleCard'
import { Pagination } from './components/Pagination'
import { staggerContainer, viewportOnce } from '../../lib/motion'
import { cn } from '../../design-system'
import { usePortfolio } from '../../context/PortfolioContext'

const DIFFICULTIES: Array<'All' | ArticleDifficulty> = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
]

export function WritingIndexPage() {
  const { site } = usePortfolio()
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [tag, setTag] = useState('All')
  const [difficulty, setDifficulty] = useState<'All' | ArticleDifficulty>('All')
  const [page, setPage] = useState(1)
  const deferredQuery = useDeferredValue(query)

  const all = useMemo(() => listArticleMeta(), [])
  const categories = useMemo(() => ['All', ...listCategories()], [])
  const tags = useMemo(() => ['All', ...listTags()], [])
  const featured = useMemo(() => all.find((article) => article.featured), [all])

  const filtered = useMemo(() => {
    let items = searchArticles(deferredQuery)
    if (category !== 'All') items = items.filter((article) => article.category === category)
    if (tag !== 'All') items = items.filter((article) => article.tags.includes(tag))
    if (difficulty !== 'All') {
      items = items.filter((article) => article.difficulty === difficulty)
    }
    return items
  }, [deferredQuery, category, tag, difficulty])

  const { items, page: safePage, totalPages, total } = paginateArticles(filtered, page)

  const onFilter = (next: {
    query?: string
    category?: string
    tag?: string
    difficulty?: 'All' | ArticleDifficulty
  }) => {
    if (next.query !== undefined) setQuery(next.query)
    if (next.category !== undefined) setCategory(next.category)
    if (next.tag !== undefined) setTag(next.tag)
    if (next.difficulty !== undefined) setDifficulty(next.difficulty)
    setPage(1)
  }

  return (
    <div className="section-padding knowledge-index">
      <Container>
        <header className="knowledge-index__header">
          <p className="knowledge-index__eyebrow">Knowledge base</p>
          <h1 className="knowledge-index__title font-display">Technical Insights</h1>
          <p className="knowledge-index__intro">
            Essays on React, Next.js, performance, and frontend architecture — written the way
            Staff engineers brief a team: clear models, measurable trade-offs, production context.
          </p>
          <p className="knowledge-index__back">
            <Link to="/#writing" className="font-semibold text-accent" data-cursor="link">
              ← Back to homepage knowledge section
            </Link>
          </p>
        </header>

        {featured ? (
          <section className="knowledge-index__featured" aria-labelledby="index-featured">
            <div className="knowledge__rail-head">
              <h2 id="index-featured" className="knowledge__rail-title">
                Featured
              </h2>
              <p className="knowledge__rail-note">Start here if you want the deepest cut</p>
            </div>
            <KnowledgeArticleCard article={featured} variant="featured" index={0} />
          </section>
        ) : null}

        <div className="knowledge-index__controls">
          <label className="knowledge-index__search">
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(e) => onFilter({ query: e.target.value })}
              placeholder="Search architecture, React, TypeScript…"
              className="input-field knowledge-index__search-input"
            />
          </label>

          <div className="knowledge-index__chips" role="toolbar" aria-label="Category">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={cn('knowledge-filter', category === item && 'knowledge-filter--active')}
                aria-pressed={category === item}
                onClick={() => onFilter({ category: item })}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="knowledge-index__selects">
            <label className="knowledge-index__select">
              <span className="ds-field-label">Technology</span>
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

            <label className="knowledge-index__select">
              <span className="ds-field-label">Difficulty</span>
              <select
                className="input-field"
                value={difficulty}
                onChange={(e) =>
                  onFilter({ difficulty: e.target.value as 'All' | ArticleDifficulty })
                }
              >
                {DIFFICULTIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="knowledge-index__count" aria-live="polite">
          {total} insight{total === 1 ? '' : 's'}
          {category !== 'All' ? ` · ${category}` : ''}
          {difficulty !== 'All' ? ` · ${difficulty}` : ''}
        </p>

        {items.length === 0 ? (
          <p className="knowledge-index__empty">No articles match these filters.</p>
        ) : (
          <motion.div
            key={`${category}-${tag}-${difficulty}-${deferredQuery}-${safePage}`}
            className="knowledge-index__grid"
            variants={staggerContainer}
            initial={reduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
          >
            {items.map((article, i) => (
              <KnowledgeArticleCard
                key={article.slug}
                article={article}
                variant="standard"
                index={i}
              />
            ))}
          </motion.div>
        )}

        <div className="mt-10">
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>

        <aside className="knowledge__cta knowledge__cta--index" aria-labelledby="index-cta">
          <div className="knowledge__cta-copy">
            <p className="knowledge__cta-eyebrow">Working together</p>
            <h2 id="index-cta" className="knowledge__cta-title font-display">
              Building a frontend org or hiring?
            </h2>
            <p className="knowledge__cta-text">
              Happy to talk architecture reviews, performance programs, or full-time frontend roles.
            </p>
          </div>
          <div className="knowledge__cta-actions">
            <Button href={`mailto:${site.email}`}>Email {site.name.split(' ')[0]}</Button>
            <Button variant="secondary" href="/contact">
              Contact
            </Button>
          </div>
        </aside>
      </Container>
    </div>
  )
}
