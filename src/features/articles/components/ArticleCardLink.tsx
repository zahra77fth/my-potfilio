import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../../../lib/articles'
import { formatArticleDate } from './mdxComponents'

interface ArticleCardLinkProps {
  article: ArticleMeta
}

export function ArticleCardLink({ article }: ArticleCardLinkProps) {
  return (
    <article className="writing-card">
      <Link to={`/writing/${article.slug}`} className="writing-card__link" data-cursor="link">
        <div className="writing-card__media">
          <img
            src={article.image}
            alt=""
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            className="writing-card__image"
          />
        </div>
        <div className="writing-card__body">
          <div className="writing-card__meta">
            <span>{article.category}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            <span aria-hidden>·</span>
            <span>{article.readingTime}</span>
          </div>
          <h2 className="writing-card__title font-display">{article.title}</h2>
          <p className="writing-card__excerpt">{article.description}</p>
          <ul className="writing-card__tags" aria-label="Tags">
            {article.tags.map((tag) => (
              <li key={tag}>
                <span className="writing-card__tag">{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  )
}
