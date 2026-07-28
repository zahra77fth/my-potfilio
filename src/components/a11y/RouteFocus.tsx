import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Moves keyboard focus to the main landmark on client-side route changes
 * so screen-reader / keyboard users land in page content, not the stale header control.
 */
export function RouteFocus() {
  const { pathname } = useLocation()

  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return

    if (!main.hasAttribute('tabindex')) {
      main.tabIndex = -1
    }

    main.focus({ preventScroll: true })
  }, [pathname])

  return null
}
