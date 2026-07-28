import { SKY_CANVAS_CLEAR } from '../../../lib/theme'

/**
 * Light-mode sky mesh/shader palette.
 * Boot gradient + WebGL clear live in `lib/theme` (shared with CSS FOUC path).
 */
export { SKY_BOOT_GRADIENT, SKY_CANVAS_CLEAR } from '../../../lib/theme'

export const SKY_PALETTE = {
  zenith: '#4a6d94',
  mid: '#6d9ec4',
  horizon: '#edf4fa',
  sun: '#fff8ee',
  cloud: '#ffffff',
  cloudFar: '#f4f9fd',
  cloudHighlight: '#fcfeff',
  cloudShadow: '#b0c9de',
  bird: '#2a4460',
  sparkle: '#f5faff',
  /** Alias for clear — keeps mesh code reading one config module */
  clear: SKY_CANVAS_CLEAR,
} as const

/** RGB 0–1 for SkyBackdrop shader */
export const SKY_SHADER = {
  zenith: [0.29, 0.427, 0.58] as const,
  mid: [0.427, 0.62, 0.769] as const,
  horizon: [0.929, 0.957, 0.98] as const,
  warm: [1.0, 0.973, 0.933] as const,
  accent: [0.55, 0.72, 0.88] as const,
} as const
