export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'portfolio-theme'

/**
 * Light-mode sky boot colors — owned here so `lib` does not depend on Three/UI.
 * Keep in sync with `components/three/sky/skyConfig` palette.
 */
export const SKY_CANVAS_CLEAR = '#7aacd0'

export const SKY_BOOT_GRADIENT =
  'linear-gradient(180deg, #4a6d94 0%, #6d9ec4 40%, #a8cce6 74%, #edf4fa 100%)'

/** WebGL clear color — matches scene fog / backdrop. */
export const THEME_CANVAS_CLEAR: Record<Theme, string> = {
  light: SKY_CANVAS_CLEAR,
  dark: '#030712',
}

export const THEME_SCENE_GRADIENT: Record<Theme, string> = {
  light: SKY_BOOT_GRADIENT,
  dark:
    'radial-gradient(ellipse 130% 90% at 48% 42%, #1e1b4b 0%, #0f172a 35%, #030712 70%, #020617 100%)',
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* private mode */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readThemeFromDocument(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  root.dataset.theme = theme
  root.style.background = THEME_SCENE_GRADIENT[theme]

  const meta = document.querySelector('meta[name="theme-color"]:not([media])')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#020617' : SKY_CANVAS_CLEAR)
  }
}
