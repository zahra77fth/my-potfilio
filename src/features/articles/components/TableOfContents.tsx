import { useEffect, useState } from 'react'
import type { ArticleHeading } from '../../../lib/articles'

interface TableOfContentsProps {
  headings: ArticleHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="article-toc" aria-label="On this page">
      <p className="article-toc__title">On this page</p>
      <ol className="article-toc__list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={
              heading.level === 3 ? 'article-toc__item article-toc__item--h3' : 'article-toc__item'
            }
          >
            <a
              href={`#${heading.id}`}
              className={
                activeId === heading.id ? 'article-toc__link article-toc__link--active' : 'article-toc__link'
              }
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
