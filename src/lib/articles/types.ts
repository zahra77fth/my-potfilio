import type { ComponentType } from 'react'

export interface ArticleFrontmatter {
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
  category: string
  image: string
  draft?: boolean
  mediumUrl?: string
}

export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string
  readingTime: string
  readingMinutes: number
}

export interface ArticleModule {
  default: ComponentType
  frontmatter: ArticleFrontmatter
}

export interface ArticleRecord extends ArticleMeta {
  headings: ArticleHeading[]
  /** Raw markdown body (no frontmatter) — used for search */
  bodyText: string
}
