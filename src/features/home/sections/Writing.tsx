import { usePortfolio } from '../../../context/PortfolioContext'
import { listArticleMeta } from '../../../lib/articles'
import { Reveal } from '../../../components/motion/Reveal'
import { ArticleCarousel } from '../../../components/ui/ArticleCarousel'
import { Section } from '../../../components/ui/Section'
import { Link } from 'react-router-dom'

export function Writing() {
  const { writing } = usePortfolio()
  const items = listArticleMeta().map((article) => ({
    title: article.title,
    excerpt: article.description,
    image: article.image,
    url: '',
    slug: article.slug,
    tags: article.tags,
    readTime: article.readingTime,
  }))

  return (
    <Section
      id="writing"
      title={writing.title}
      subtitle={writing.subtitle}
      label="06 — Writing"
      align="right"
      variant="panel"
      className="overflow-hidden bg-surface/20"
      decorations="accent"
    >
      <Reveal>
        <ArticleCarousel items={items} />
        <p className="mt-8 text-center text-sm">
          <Link to="/writing" className="font-semibold text-accent" data-cursor="link">
            Browse all articles →
          </Link>
        </p>
      </Reveal>
    </Section>
  )
}
