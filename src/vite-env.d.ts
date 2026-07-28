/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { ArticleFrontmatter } from './lib/articles/types'

  export const frontmatter: ArticleFrontmatter
  const MDXComponent: ComponentType
  export default MDXComponent
}

declare module '*?raw' {
  const content: string
  export default content
}
