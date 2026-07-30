import type { ReactNode } from 'react'

/**
 * Renders plain text with optional `**bold**` markers for recruiter-scannable keywords.
 * Does not support nested markers or other Markdown.
 */
export function richText(input: string): ReactNode {
  const parts = input.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part ? <span key={i}>{part}</span> : null
  })
}
