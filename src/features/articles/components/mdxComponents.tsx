import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'

type AnchorProps = ComponentPropsWithoutRef<'a'>

function isExternal(href?: string) {
  return Boolean(href && /^https?:\/\//i.test(href))
}

export const mdxComponents = {
  pre: CodeBlock,
  a: ({ href, children, ...rest }: AnchorProps) => {
    const external = isExternal(href)
    return (
      <a
        href={href}
        {...rest}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  },
  img: (props: ComponentPropsWithoutRef<'img'>) => (
    <img loading="lazy" decoding="async" {...props} />
  ),
}

export function ArticleProse({ children }: { children: ReactNode }) {
  return <div className="article-prose">{children}</div>
}

export function formatArticleDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
