import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePortfolio } from '../../../context/PortfolioContext'
import { listArticleMeta, listCategories } from '../../../lib/articles'
import { Reveal } from '../../../components/motion/Reveal'
import { Section } from '../../../components/ui/Section'
import { Button } from '../../../components/ui/Button'
import { staggerContainer, viewportOnce } from '../../../lib/motion'
import { KnowledgeArticleCard } from '../../articles/components/KnowledgeArticleCard'
import { cn } from '../../../design-system'
import { motion, useReducedMotion } from 'framer-motion'

const TRUST_TOPICS = [
  'Frontend Architecture',
  'React Performance',
  'Next.js & SSR',
  'Design Systems',
  'TypeScript',
  'Scalable UI',
]

export function Writing() {
  const { writing, site } = usePortfolio()
  const reduceMotion = useReducedMotion()
  const articles = useMemo(() => listArticleMeta(), [])
  const categories = useMemo(() => listCategories(), [])
  const [activeCategory, setActiveCategory] = useState('All')

  const featured = useMemo(
    () => articles.find((article) => article.featured) ?? articles[0],
    [articles],
  )

  const popular = useMemo(
    () =>
      articles
        .filter((article) => article.popular && article.slug !== featured?.slug)
        .slice(0, 3),
    [articles, featured?.slug],
  )

  const filteredLatest = useMemo(() => {
    const pool = articles.filter((article) => article.slug !== featured?.slug)
    if (activeCategory === 'All') return pool.slice(0, 4)
    return pool.filter((article) => article.category === activeCategory).slice(0, 4)
  }, [articles, featured?.slug, activeCategory])

  const stats = useMemo(
    () => ({
      articles: articles.length,
      categories: categories.length,
      advanced: articles.filter((a) => a.difficulty === 'Advanced').length,
    }),
    [articles, categories.length],
  )

  return (
    <Section
      id="writing"
      title={writing.title}
      subtitle={writing.subtitle}
      label="06 — Knowledge"
      align="right"
      variant="panel"
      className="knowledge-section overflow-hidden"
      decorations="accent"
    >
      <div className="knowledge">
        <Reveal>
          <div className="knowledge__intro">
            <p className="knowledge__lede">
              Field notes from shipping production React and Next.js systems — architecture
              boundaries, performance budgets, typed interfaces, and the trade-offs I actually make
              on real products.
            </p>
            <dl className="knowledge__stats">
              <div className="knowledge__stat">
                <dt>Essays</dt>
                <dd>{stats.articles}</dd>
              </div>
              <div className="knowledge__stat">
                <dt>Topics</dt>
                <dd>{stats.categories}</dd>
              </div>
              <div className="knowledge__stat knowledge__stat--accent">
                <dt>Advanced</dt>
                <dd>{stats.advanced}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={40}>
          <ul className="knowledge__topics" aria-label="Expertise areas covered">
            {TRUST_TOPICS.map((topic) => (
              <li key={topic}>
                <span className="knowledge__topic">{topic}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {featured ? (
          <Reveal delay={70}>
            <div className="knowledge__featured">
              <div className="knowledge__rail-head">
                <h3 className="knowledge__rail-title">Featured insight</h3>
                <p className="knowledge__rail-note">Editor&apos;s pick · deepest technical dive</p>
              </div>
              <KnowledgeArticleCard article={featured} variant="featured" index={0} />
            </div>
          </Reveal>
        ) : null}

        {popular.length > 0 ? (
          <motion.div
            className="knowledge__rail"
            variants={staggerContainer}
            initial={reduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="knowledge__rail-head">
              <h3 className="knowledge__rail-title">Popular with engineers</h3>
              <p className="knowledge__rail-note">Most referenced architecture &amp; performance pieces</p>
            </div>
            <div className="knowledge__popular-grid">
              {popular.map((article, i) => (
                <KnowledgeArticleCard
                  key={article.slug}
                  article={article}
                  variant="compact"
                  index={i + 1}
                />
              ))}
            </div>
          </motion.div>
        ) : null}

        <div className="knowledge__latest">
          <div className="knowledge__rail-head knowledge__rail-head--row">
            <div>
              <h3 className="knowledge__rail-title">Latest writing</h3>
              <p className="knowledge__rail-note">Filter by domain to scan for relevance</p>
            </div>
            <div className="knowledge__filters" role="toolbar" aria-label="Filter by category">
              <FilterChip
                label="All"
                active={activeCategory === 'All'}
                onClick={() => setActiveCategory('All')}
              />
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>
          </div>

          {filteredLatest.length === 0 ? (
            <p className="knowledge__empty">No essays in this category yet.</p>
          ) : (
            <motion.div
              key={activeCategory}
              className="knowledge__latest-grid"
              variants={staggerContainer}
              initial={reduceMotion ? false : 'hidden'}
              animate="visible"
            >
              {filteredLatest.map((article, i) => (
                <KnowledgeArticleCard
                  key={article.slug}
                  article={article}
                  variant="standard"
                  index={i + 2}
                />
              ))}
            </motion.div>
          )}
        </div>

        <Reveal delay={60}>
          <aside className="knowledge__cta" aria-labelledby="knowledge-newsletter">
            <div className="knowledge__cta-copy">
              <p className="knowledge__cta-eyebrow">Stay in the loop</p>
              <h3 id="knowledge-newsletter" className="knowledge__cta-title font-display">
                Prefer a conversation over a feed?
              </h3>
              <p className="knowledge__cta-text">
                I write about frontend systems the same way I build them — with clear boundaries,
                measurable trade-offs, and production context. Reach out if you want to talk
                architecture, performance, or roles.
              </p>
            </div>
            <div className="knowledge__cta-actions">
              <Button href="/writing">Explore all articles</Button>
              <Button variant="secondary" href={`mailto:${site.email}`}>
                Email me
              </Button>
              <Link to="/contact" className="knowledge__cta-link" data-cursor="link">
                Contact form →
              </Link>
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn('knowledge-filter', active && 'knowledge-filter--active')}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
