import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { getRawPortfolioData } from '../src/lib/content/raw'
import { formatContentValidationError, parsePortfolioData } from '../src/lib/content/schema'
import { articleFrontmatterSchema } from '../src/lib/articles/schema'

const articlesDir = path.resolve('content/articles')

try {
  const data = parsePortfolioData(getRawPortfolioData())
  console.log(`✓ Portfolio JSON valid (${Object.keys(data).length} domains)`)

  if (!fs.existsSync(articlesDir)) {
    throw new Error('Missing content/articles directory')
  }

  const files = fs.readdirSync(articlesDir).filter((file) => file.endsWith('.mdx'))
  if (files.length === 0) throw new Error('No MDX articles found in content/articles')

  let published = 0
  for (const file of files) {
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8')
    const { data: fm } = matter(raw)
    const parsed = articleFrontmatterSchema.parse(fm)
    if (!parsed.draft) published += 1
  }

  console.log(`✓ Articles valid (${published} published / ${files.length} files)`)
} catch (error) {
  console.error(
    error instanceof Error && error.message.startsWith('Invalid')
      ? error.message
      : `Invalid content\n${formatContentValidationError(error)}`,
  )
  process.exit(1)
}
