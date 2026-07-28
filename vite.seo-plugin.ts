import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Plugin } from 'vite'

type SiteJson = {
  domain?: string
  name?: string
  seo?: { title?: string; description?: string }
}

type ArticleFm = {
  title?: string
  description?: string
  date?: string
  updated?: string
  image?: string
  draft?: boolean
}

function normalizeOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, '')
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function resolveOrigin(root: string): string {
  const fromEnv = process.env.VITE_SITE_URL
  if (fromEnv?.trim()) return normalizeOrigin(fromEnv)

  const sitePath = path.join(root, 'src/data/site.json')
  const site = JSON.parse(fs.readFileSync(sitePath, 'utf8')) as SiteJson
  if (site.domain?.trim()) return normalizeOrigin(site.domain)
  return ''
}

function readArticles(root: string) {
  const dir = path.join(root, 'content/articles')
  if (!fs.existsSync(dir)) return [] as { slug: string; fm: ArticleFm }[]

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data } = matter(raw)
      return {
        slug: file.replace(/\.mdx$/i, ''),
        fm: data as ArticleFm,
      }
    })
    .filter((article) => !article.fm.draft)
    .sort((a, b) => String(b.fm.date).localeCompare(String(a.fm.date)))
}

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function writeSeoAssets(root: string) {
  const publicDir = path.join(root, 'public')
  fs.mkdirSync(publicDir, { recursive: true })

  const origin = resolveOrigin(root)
  const site = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8')) as SiteJson
  const articles = readArticles(root)

  const staticRoutes = [
    { route: '/', priority: '1.0' },
    { route: '/writing', priority: '0.9' },
    { route: '/contact', priority: '0.8' },
  ]

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    origin ? `Sitemap: ${origin}/sitemap.xml` : '# Set site.domain or VITE_SITE_URL to emit Sitemap',
    '',
  ].join('\n')

  const urlEntries = origin
    ? [
        ...staticRoutes.map(({ route, priority }) => {
          const loc = route === '/' ? `${origin}/` : `${origin}${route}`
          return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
        }),
        ...articles.map((article) => {
          const loc = `${origin}/writing/${article.slug}`
          const lastmod = article.fm.updated || article.fm.date
          return `  <url>\n    <loc>${loc}</loc>${
            lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
          }\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
        }),
      ].join('\n')
    : '  <!-- Set site.domain or VITE_SITE_URL before build to emit absolute URLs -->'

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n')

  const rssItems = articles
    .map((article) => {
      const link = origin ? `${origin}/writing/${article.slug}` : `/writing/${article.slug}`
      return [
        '    <item>',
        `      <title>${xmlEscape(article.fm.title || article.slug)}</title>`,
        `      <link>${link}</link>`,
        `      <guid>${link}</guid>`,
        article.fm.date ? `      <pubDate>${new Date(article.fm.date).toUTCString()}</pubDate>` : '',
        `      <description>${xmlEscape(article.fm.description || '')}</description>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${xmlEscape(site.seo?.title || site.name || 'Writing')}</title>`,
    `    <link>${origin || '/'}</link>`,
    `    <description>${xmlEscape(site.seo?.description || 'Technical writing')}</description>`,
    origin ? `    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>` : '',
    rssItems,
    '  </channel>',
    '</rss>',
    '',
  ]
    .filter(Boolean)
    .join('\n')

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots)
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss)
}

/** Writes robots.txt, sitemap.xml, and rss.xml into public/. */
export function seoAssetsPlugin(): Plugin {
  let root = process.cwd()

  return {
    name: 'seo-assets',
    configResolved(config) {
      root = config.root
    },
    buildStart() {
      writeSeoAssets(root)
    },
    configureServer() {
      writeSeoAssets(root)
    },
  }
}
