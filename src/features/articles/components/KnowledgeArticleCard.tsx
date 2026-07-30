import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../../../lib/articles'
import { cn } from '../../../design-system'
import { fadeUp, hoverLift, springSnappy, tapScale } from '../../../lib/motion'
import { formatArticleDate } from '../components/mdxComponents'

export type KnowledgeCardVariant = 'featured' | 'standard' | 'compact'

interface KnowledgeArticleCardProps {
  article: ArticleMeta
  variant?: KnowledgeCardVariant
  index?: number
  className?: string
}

export function KnowledgeArticleCard({
  article,
  variant = 'standard',
  index,
  className,
}: KnowledgeArticleCardProps) {
  const reduceMotion = useReducedMotion()
  const href = `/writing/${article.slug}`
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <motion.article
      variants={fadeUp}
      className={cn('knowledge-card', `knowledge-card--${variant}`, className)}
      whileHover={reduceMotion || isFeatured ? undefined : hoverLift}
      whileTap={reduceMotion ? undefined : tapScale}
      transition={springSnappy}
    >
      <Link to={href} data-cursor="link" className="knowledge-card__link">
        <div className="knowledge-card__media">
          <img
            src={article.image}
            alt=""
            width={isFeatured ? 1200 : 640}
            height={isFeatured ? 675 : 400}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="knowledge-card__image"
          />
          <div className="knowledge-card__media-shade" aria-hidden />
          <div className="knowledge-card__media-glow" aria-hidden />

          <div className="knowledge-card__badges">
            {article.featured ? (
              <span className="knowledge-badge knowledge-badge--editor">Editor&apos;s pick</span>
            ) : null}
            {article.popular && !article.featured ? (
              <span className="knowledge-badge knowledge-badge--popular">Popular</span>
            ) : null}
            <span className="knowledge-badge knowledge-badge--category">{article.category}</span>
          </div>
        </div>

        <div className="knowledge-card__body">
          {article.eyebrow ? <p className="knowledge-card__eyebrow">{article.eyebrow}</p> : null}

          <h3 className="knowledge-card__title font-display">{article.title}</h3>

          {!isCompact ? (
            <p className="knowledge-card__excerpt">{article.description}</p>
          ) : null}

          <div className="knowledge-card__meta">
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            <span aria-hidden>·</span>
            <span>{article.readingTime}</span>
            {article.difficulty ? (
              <>
                <span aria-hidden>·</span>
                <span
                  className={cn(
                    'knowledge-card__difficulty',
                    `knowledge-card__difficulty--${article.difficulty.toLowerCase()}`,
                  )}
                >
                  {article.difficulty}
                </span>
              </>
            ) : null}
          </div>

          <ul className="knowledge-card__tags" aria-label="Technologies">
            {article.tags.slice(0, isFeatured ? 5 : 3).map((tag) => (
              <li key={tag}>
                <span className="knowledge-card__tag">{tag}</span>
              </li>
            ))}
          </ul>

          <span className="knowledge-card__cta">
            Read article
            <span className="knowledge-card__cta-arrow" aria-hidden>
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
