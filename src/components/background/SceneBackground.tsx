import { lazy, Suspense } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useDeferredScene } from '../../hooks/useDeferredScene'
import { usePerformanceTier } from '../../hooks/usePerformanceTier'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { AmbientBackground } from './AmbientBackground'

const GalaxyCanvas = lazy(() =>
  import('../three/GalaxyCanvas').then((m) => ({ default: m.GalaxyCanvas })),
)
const SkyCanvas = lazy(() =>
  import('../three/SkyCanvas').then((m) => ({ default: m.SkyCanvas })),
)

/**
 * Full-viewport background stack (fixed z-0). Content sits above at z-10.
 * CSS gradient paints immediately; WebGL mounts after idle when motion/data allow.
 */
export function SceneBackground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const reducedMotion = usePrefersReducedMotion()
  const tier = usePerformanceTier()
  const sceneEnabled = !reducedMotion && tier !== 'lite'
  const mountScene = useDeferredScene(sceneEnabled)

  return (
    <div
      className={isDark ? 'scene-bg scene-bg--dark' : 'scene-bg scene-bg--light'}
      aria-hidden
    >
      <AmbientBackground />
      {mountScene ? (
        <Suspense fallback={null}>{isDark ? <GalaxyCanvas /> : <SkyCanvas />}</Suspense>
      ) : null}
    </div>
  )
}
