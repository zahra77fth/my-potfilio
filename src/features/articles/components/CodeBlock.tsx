import { useCallback, useState, type ReactNode } from 'react'

interface PreProps {
  children?: ReactNode
  'data-language'?: string
}

/** MDX `<pre>` wrapper with copy-to-clipboard for code blocks. */
export function CodeBlock({ children, ...props }: PreProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    const text = extractText(children)
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard may be blocked */
    }
  }, [children])

  const language = props['data-language']

  return (
    <div className="article-code">
      <div className="article-code__toolbar">
        <span className="article-code__lang">{language || 'code'}</span>
        <button type="button" className="article-code__copy" onClick={onCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre {...props} className="article-code__pre">
        {children}
      </pre>
    </div>
  )
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object' && 'props' in node) {
    const props = node.props as { children?: ReactNode }
    return extractText(props.children)
  }
  return ''
}
