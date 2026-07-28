import { z } from 'zod'
import type { ArticleFrontmatter } from './types'

const dateString = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return value
}, z.string().min(1))

/** Zod schema used by CI / validate:content — not imported by the client catalog. */
export const articleFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: dateString,
  updated: dateString.optional(),
  tags: z.array(z.string().min(1)).min(1),
  category: z.string().min(1),
  image: z.string().min(1),
  draft: z.boolean().optional().default(false),
  mediumUrl: z.union([z.string().url(), z.literal('')]).optional(),
})

export function assertArticleFrontmatter(data: unknown): ArticleFrontmatter {
  return articleFrontmatterSchema.parse(data)
}
