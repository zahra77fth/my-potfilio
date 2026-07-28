import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import { seoAssetsPlugin } from './vite.seo-plugin'

/** Heavy 3D vendors — loaded only after idle scene mount, never via entry modulepreload. */
function isDeferredVendor(dep: string) {
  return /(?:^|\/)(?:r3f|three|GalaxyCanvas|SkyCanvas|SceneCanvasShell)-/.test(dep)
}

const mdxPlugin = mdx({
  remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'wrap',
        properties: { className: ['article-heading-link'] },
      },
    ],
    [
      rehypePrettyCode,
      {
        theme: { light: 'github-light', dark: 'github-dark' },
        keepBackground: false,
      },
    ],
  ],
})

/** Let Vite's `?raw` loader win — MDX must not compile catalog source strings. */
const mdxExceptRaw = {
  ...mdxPlugin,
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    if (id.includes('?raw') || id.includes('&raw')) return null
    const transform = mdxPlugin.transform
    if (typeof transform !== 'function') return null
    return transform.call(this, code, id)
  },
}

export default defineConfig({
  plugins: [
    mdxExceptRaw,
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
    seoAssetsPlugin(),
  ],
  build: {
    target: 'es2022',
    cssMinify: true,
    modulePreload: {
      polyfill: false,
      resolveDependencies(_filename, deps) {
        return deps.filter((dep) => !isDeferredVendor(dep))
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router')) return 'router'
          if (id.includes('framer-motion')) return 'motion'
          if (/[/\\]node_modules[/\\]three[/\\]/.test(id)) return 'three'
          if (id.includes('@react-three')) return 'r3f'
          if (id.includes('shiki') || id.includes('rehype-pretty-code')) return 'syntax'
          if (id.includes('react-dom') || /[/\\]node_modules[/\\]react[/\\]/.test(id)) return 'react'
        },
      },
    },
  },
})
