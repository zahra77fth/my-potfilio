import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../../../lib/articles'
import { ArticleCardLink } from './ArticleCardLink'

interface RelatedArticlesProps {
  articles: ArticleMeta[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="article-related" aria-labelledby="related-articles-title">
      <div className="article-related__head">
        <h2 id="related-articles-title" className="font-display text-2xl font-bold">
          Related articles
        </h2>
        <Link to="/writing" className="text-sm font-semibold text-accent">
          All writing →
        </Link>
      </div>
      <div className="article-related__grid">
        {articles.map((article) => (
          <ArticleCardLink key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
