/**
 * Minimal frontmatter parser for our article YAML subset.
 * Avoids shipping gray-matter/js-yaml to the browser catalog.
 */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  if (!raw.startsWith('---')) return { data: {}, content: raw }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: raw }

  const yaml = raw.slice(4, end).trim()
  const content = raw.slice(end + 4).replace(/^\r?\n/, '')
  const data: Record<string, unknown> = {}

  const lines = yaml.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const match = /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line)
    if (!match) {
      i += 1
      continue
    }

    const key = match[1]
    const rest = match[2].trim()

    if (rest === '' || rest === '|' || rest === '>') {
      const items: string[] = []
      i += 1
      while (i < lines.length) {
        const nested = /^\s*-\s+(.+)$/.exec(lines[i])
        if (!nested) break
        items.push(stripQuotes(nested[1].trim()))
        i += 1
      }
      data[key] = items
      continue
    }

    if (rest.startsWith('[') && rest.endsWith(']')) {
      data[key] = rest
        .slice(1, -1)
        .split(',')
        .map((part) => stripQuotes(part.trim()))
        .filter(Boolean)
      i += 1
      continue
    }

    if (rest === 'true' || rest === 'false') {
      data[key] = rest === 'true'
      i += 1
      continue
    }

    data[key] = stripQuotes(rest)
    i += 1
  }

  return { data, content }
}

function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  return value
}

export function estimateReadingMinutes(text: string, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
