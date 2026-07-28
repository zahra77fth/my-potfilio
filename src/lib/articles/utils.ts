/** GitHub-ish slug for heading anchors (matches rehype-slug defaults closely). */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function slugFromPath(path: string): string {
  const base = path.split('/').pop() ?? path
  return base.replace(/\.mdx$/i, '')
}

export function extractHeadings(markdown: string): { id: string; text: string; level: 2 | 3 }[] {
  const headings: { id: string; text: string; level: 2 | 3 }[] = []
  for (const line of markdown.split('\n')) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match) continue
    const level = match[1].length as 2 | 3
    const text = match[2].replace(/\s+#+\s*$/, '').trim()
    headings.push({ id: slugifyHeading(text), text, level })
  }
  return headings
}
