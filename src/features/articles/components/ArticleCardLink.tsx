import type { ArticleMeta } from '../../../lib/articles'
import { KnowledgeArticleCard } from './KnowledgeArticleCard'

interface ArticleCardLinkProps {
  article: ArticleMeta
  variant?: 'standard' | 'compact'
}

/** Shared card wrapper used by related articles and any legacy call sites. */
export function ArticleCardLink({ article, variant = 'standard' }: ArticleCardLinkProps) {
  return <KnowledgeArticleCard article={article} variant={variant} />
}
