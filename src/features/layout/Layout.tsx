import { SceneBackground } from '../../components/background/SceneBackground'
import { CursorGlow } from '../../components/effects/CursorGlow'
import { InteractiveCursor } from '../../components/effects/InteractiveCursor'
import { ScrollProgress } from '../../components/ui/ScrollProgress'
import { usePortfolio } from '../../context/PortfolioContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { AnimatedOutlet } from './AnimatedOutlet'
import { Footer } from './Footer'
import { Header } from './Header'
import { SectionNav } from './SectionNav'

export function Layout() {
  const { site } = usePortfolio()
  useKeyboardShortcuts({ resumeUrl: site.resumeUrl })

  return (
    <>
      <SceneBackground />
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <ScrollProgress />
        <CursorGlow />
        <InteractiveCursor />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <SectionNav />
        <main id="main" tabIndex={-1} className="relative z-10 flex-1">
          <AnimatedOutlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
