import { useEffect, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true' && el.tabIndex !== -1,
  )
}

interface UseFocusTrapOptions {
  enabled: boolean
  containerRef: RefObject<HTMLElement | null>
  /** Prefer this element on open; falls back to the first focusable control. */
  initialFocusRef?: RefObject<HTMLElement | null>
}

/**
 * Traps Tab inside a dialog and restores focus to the opener on close.
 */
export function useFocusTrap({ enabled, containerRef, initialFocusRef }: UseFocusTrapOptions) {
  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusInitial = () => {
      const preferred = initialFocusRef?.current
      const fallback = getFocusable(container)[0]
      ;(preferred ?? fallback)?.focus()
    }

    const frame = requestAnimationFrame(focusInitial)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusable = getFocusable(container)
      if (focusable.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (active === last || !container.contains(active)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [enabled, containerRef, initialFocusRef])
}
