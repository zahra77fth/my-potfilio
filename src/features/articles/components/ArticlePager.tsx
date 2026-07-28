import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../../../lib/articles'

interface ArticlePagerProps {
  prev: ArticleMeta | null
  next: ArticleMeta | null
}

export function ArticlePager({ prev, next }: ArticlePagerProps) {
  if (!prev && !next) return null

  return (
    <nav className="article-pager" aria-label="Article pagination">
      {prev ? (
        <Link to={`/writing/${prev.slug}`} className="article-pager__link article-pager__link--prev">
          <span className="article-pager__label">Previous</span>
          <span className="article-pager__title font-display">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/writing/${next.slug}`} className="article-pager__link article-pager__link--next">
          <span className="article-pager__label">Next</span>
          <span className="article-pager__title font-display">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  )
}
