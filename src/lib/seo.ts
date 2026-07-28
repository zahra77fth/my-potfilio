import type { ContactData, SiteData } from '../types'
import { getArticle } from './articles'

export interface PageMeta {
  title: string
  description: string
  path: string
  keywords?: string
  ogImage?: string
  ogType?: 'website' | 'profile' | 'article'
  jsonLdExtra?: unknown
}

export function normalizeOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, '')
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/** Absolute site origin — env wins, then site.json, then runtime origin. */
export function getSiteOrigin(site: SiteData): string {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined
  if (fromEnv?.trim()) return normalizeOrigin(fromEnv)
  if (site.domain?.trim()) return normalizeOrigin(site.domain)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return ''
}

export function absoluteUrl(origin: string, pathOrUrl: string): string {
  if (!pathOrUrl) return origin || ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (!origin) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${origin}${path}`
}

export function resolvePageMeta(
  pathname: string,
  site: SiteData,
  contact: ContactData,
): PageMeta {
  const path = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname

  if (path === '/contact') {
    return {
      title: `Contact — ${site.name}`,
      description: contact.subtitle,
      path: '/contact',
      keywords: site.seo.keywords,
      ogImage: site.seo.ogImage,
      ogType: 'website',
    }
  }

  if (path === '/writing') {
    return {
      title: `Writing — ${site.name}`,
      description: 'Technical articles on React, TypeScript, and frontend architecture.',
      path: '/writing',
      keywords: site.seo.keywords,
      ogImage: site.seo.ogImage,
      ogType: 'website',
    }
  }

  if (path.startsWith('/writing/')) {
    const slug = path.slice('/writing/'.length)
    const article = getArticle(slug)
    if (article) {
      const origin = getSiteOrigin(site)
      return {
        title: `${article.title} — ${site.name}`,
        description: article.description,
        path: `/writing/${article.slug}`,
        keywords: [...article.tags, site.seo.keywords].join(', '),
        ogImage: article.image,
        ogType: 'article',
        jsonLdExtra: {
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.description,
          image: absoluteUrl(origin, article.image),
          datePublished: article.date,
          dateModified: article.updated || article.date,
          author: {
            '@type': 'Person',
            name: site.name,
          },
          keywords: article.tags.join(', '),
          mainEntityOfPage: absoluteUrl(origin, `/writing/${article.slug}`),
        },
      }
    }
  }

  return {
    title: site.seo.title,
    description: site.seo.description,
    path: '/',
    keywords: site.seo.keywords,
    ogImage: site.seo.ogImage,
    ogType: 'website',
  }
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function buildJsonLd(site: SiteData, origin: string, extra?: unknown) {
  const sameAs = [site.social.github, site.social.linkedin, site.social.twitter, site.social.dribbble].filter(
    Boolean,
  )

  const graph: unknown[] = [
    {
      '@type': 'WebSite',
      '@id': origin ? `${origin}/#website` : undefined,
      name: site.seo.title,
      url: origin || undefined,
      description: site.seo.description,
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': origin ? `${origin}/#person` : undefined,
      name: site.name,
      jobTitle: site.title,
      description: site.tagline,
      email: site.email,
      url: origin || undefined,
      image: absoluteUrl(origin, site.seo.ogImage),
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.location,
      },
      sameAs: sameAs.length ? sameAs : undefined,
    },
  ]

  if (extra) graph.push(extra)

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

/** Apply document head tags for the active route (SPA-friendly, no extra deps). */
export function applyPageMeta(site: SiteData, meta: PageMeta) {
  const origin = getSiteOrigin(site)
  const url = absoluteUrl(origin, meta.path)
  const image = absoluteUrl(origin, meta.ogImage || site.seo.ogImage)

  document.title = meta.title

  upsertMeta('name', 'description', meta.description)
  if (meta.keywords) upsertMeta('name', 'keywords', meta.keywords)

  if (url) upsertLink('canonical', url)

  upsertMeta('property', 'og:title', meta.title)
  upsertMeta('property', 'og:description', meta.description)
  upsertMeta('property', 'og:type', meta.ogType || 'website')
  upsertMeta('property', 'og:site_name', site.name)
  if (url) upsertMeta('property', 'og:url', url)
  if (image) upsertMeta('property', 'og:image', image)

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', meta.title)
  upsertMeta('name', 'twitter:description', meta.description)
  if (image) upsertMeta('name', 'twitter:image', image)

  upsertJsonLd('portfolio-jsonld', buildJsonLd(site, origin, meta.jsonLdExtra))
}
