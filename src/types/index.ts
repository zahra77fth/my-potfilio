/**
 * Portfolio content contracts.
 * Runtime shapes are defined with Zod in `lib/content/schema` — this module re-exports types
 * so features keep importing from `types`.
 */
export type {
  ContactData,
  EducationData,
  ExperienceData,
  ExperienceItem,
  PortfolioData,
  ProfileData,
  ProjectItem,
  ProjectsData,
  SiteData,
  SkillsData,
  WritingData,
} from '../lib/content/schema'

/** Homepage carousel card — mapped from MDX article meta */
export interface ArticleItem {
  title: string
  excerpt: string
  image: string
  url: string
  slug?: string
  tags: string[]
  readTime?: string
}
