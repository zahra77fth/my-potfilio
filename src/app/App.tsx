import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { getPortfolioData } from '../lib/loadData'
import { AppProviders } from './providers'
import { Layout } from '../features/layout/Layout'
import { HashScroll } from '../components/HashScroll'
import { RouteFocus } from '../components/a11y/RouteFocus'
import { DocumentHead } from '../components/seo/DocumentHead'
import { PageFallback } from '../components/ui/PageFallback'

const portfolioData = getPortfolioData()

const HomePage = lazy(() => import('../features/home/HomePage').then((m) => ({ default: m.HomePage })))
const ContactPage = lazy(() =>
  import('../features/contact/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const WritingIndexPage = lazy(() =>
  import('../features/articles/WritingIndexPage').then((m) => ({ default: m.WritingIndexPage })),
)
const ArticlePage = lazy(() =>
  import('../features/articles/ArticlePage').then((m) => ({ default: m.ArticlePage })),
)

export default function App() {
  return (
    <AppProviders data={portfolioData}>
      <BrowserRouter>
        <DocumentHead />
        <RouteFocus />
        <HashScroll />
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageFallback />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="contact"
              element={
                <Suspense fallback={<PageFallback />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="writing"
              element={
                <Suspense fallback={<PageFallback />}>
                  <WritingIndexPage />
                </Suspense>
              }
            />
            <Route
              path="writing/:slug"
              element={
                <Suspense fallback={<PageFallback />}>
                  <ArticlePage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
