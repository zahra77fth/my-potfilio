import { useEffect, useState } from 'react'

/**
 * Defer mounting heavy work (WebGL) until after first paint / idle.
 * Keeps the CSS scene gradient as the LCP background.
 */
export function useDeferredScene(enabled: boolean) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setReady(false)
      return
    }

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const mount = () => {
      if (!cancelled) setReady(true)
    }

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(mount, { timeout: 1500 })
    } else {
      timeoutId = setTimeout(mount, 200)
    }

    return () => {
      cancelled = true
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [enabled])

  return ready
}
