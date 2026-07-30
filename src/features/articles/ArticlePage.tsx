import { MDXProvider } from '@mdx-js/react'
import { useEffect, useState, type ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getAdjacentArticles,
  getArticle,
  getRelatedArticles,
  loadArticleComponent,
} from '../../lib/articles'
import { Container } from '../../components/ui/Container'
import { PageFallback } from '../../components/ui/PageFallback'
import { ArticlePager } from './components/ArticlePager'
import { ArticleProse, formatArticleDate, mdxComponents } from './components/mdxComponents'
import { RelatedArticles } from './components/RelatedArticles'
import { TableOfContents } from './components/TableOfContents'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)
  const [Content, setContent] = useState<ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setContent(null)
    setError(null)

    if (!slug || !getArticle(slug)) {
      setError('not-found')
      return
    }

    loadArticleComponent(slug)
      .then((component) => {
        if (!cancelled) setContent(() => component)
      })
      .catch(() => {
        if (!cancelled) setError('load-failed')
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (!article || error === 'not-found') {
    return (
      <div className="section-padding">
        <Container className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold">Article not found</h1>
          <p className="mt-3 text-muted">That slug is not in the writing catalog.</p>
          <Link to="/writing" className="mt-6 inline-flex font-semibold text-accent">
            ← Back to writing
          </Link>
        </Container>
      </div>
    )
  }

  const related = getRelatedArticles(article.slug)
  const { prev, next } = getAdjacentArticles(article.slug)

  return (
    <div className="section-padding">
      <Container>
        <div className="article-layout">
          <aside className="article-layout__aside">
            <TableOfContents headings={article.headings} />
          </aside>

          <article className="article-layout__main">
            <p className="text-sm">
              <Link to="/writing" className="font-semibold text-accent">
                ← Writing
              </Link>
            </p>

            <header className="article-hero">
              <div className="article-hero__meta">
                {article.featured ? (
                  <span className="knowledge-badge knowledge-badge--editor">Editor&apos;s pick</span>
                ) : null}
                {article.eyebrow ? <span className="article-hero__eyebrow">{article.eyebrow}</span> : null}
                <span>{article.category}</span>
                <span aria-hidden>·</span>
                <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                <span aria-hidden>·</span>
                <span>{article.readingTime}</span>
                {article.difficulty ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>{article.difficulty}</span>
                  </>
                ) : null}
              </div>
              <h1 className="article-hero__title font-display">{article.title}</h1>
              <p className="article-hero__desc">{article.description}</p>
              <ul className="article-hero__tags" aria-label="Tags">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <span className="knowledge-card__tag">{tag}</span>
                  </li>
                ))}
              </ul>
              {article.mediumUrl ? (
                <p className="mt-4 text-sm text-muted">
                  Also on{' '}
                  <a
                    href={article.mediumUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent"
                  >
                    Medium
                  </a>
                </p>
              ) : null}
              <img
                src={article.image}
                alt=""
                width={960}
                height={480}
                className="article-hero__image"
              />
            </header>

            <ArticleProse>
              {error === 'load-failed' ? (
                <p className="text-muted">Could not load this article body.</p>
              ) : Content ? (
                <MDXProvider components={mdxComponents}>
                  <Content />
                </MDXProvider>
              ) : (
                <PageFallback />
              )}
            </ArticleProse>

            <ArticlePager prev={prev} next={next} />
          </article>
        </div>

        <div className="mt-16">
          <RelatedArticles articles={related} />
        </div>
      </Container>
    </div>
  )
}
