import { useTheme } from '../../context/ThemeContext'

/**
 * Optional CSS atmosphere layer above the scene gradient.
 * Light mode keeps content readable; dark mode relies on `.scene-bg--dark`.
 */
export function AmbientBackground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (isDark) {
    return null
  }

  return <div className="ambient-bg ambient-bg--light" aria-hidden />
}
