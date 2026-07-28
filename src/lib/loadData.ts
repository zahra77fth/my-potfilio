import type { PortfolioData } from './content/schema'
import { getRawPortfolioData } from './content/raw'

/**
 * Portfolio content from `src/data/*.json`.
 * Shape is enforced by Zod in `npm run validate:content` (also runs before `build` / CI)
 * so the client bundle does not ship the validator.
 */
export function getPortfolioData(): PortfolioData {
  return getRawPortfolioData() as PortfolioData
}
