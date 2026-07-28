import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePortfolio } from '../../context/PortfolioContext'
import { applyPageMeta, resolvePageMeta } from '../../lib/seo'

/** Keeps document title/meta/canonical/OG/JSON-LD in sync with the active route. */
export function DocumentHead() {
  const { pathname } = useLocation()
  const { site, contact } = usePortfolio()

  useEffect(() => {
    applyPageMeta(site, resolvePageMeta(pathname, site, contact))
  }, [pathname, site, contact])

  return null
}
