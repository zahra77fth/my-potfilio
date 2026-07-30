import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ProjectItem } from '../../types'
import { Button } from '../../components/ui/Button'
import { useFocusTrap } from '../../hooks/useFocusTrap'

interface ProjectModalProps {
  project: ProjectItem | null
  index?: number
  onClose: () => void
}

export function ProjectModal({ project, index, onClose }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = project != null

  useFocusTrap({ enabled: open, containerRef: panelRef, initialFocusRef: closeRef })

  useEffect(() => {
    if (!project) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  if (!project || typeof document === 'undefined') return null

  const hasLive = project.links.live.trim() !== ''
  const hasGithub = project.links.github.trim() !== ''
  const products = project.products ?? []
  const highlights = project.highlights ?? []

  return createPortal(
    <div className="project-modal">
      <button
        type="button"
        className="project-modal__backdrop"
        aria-label="Close project details"
        data-cursor="close"
        tabIndex={-1}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="project-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
      >
        <div className="project-modal__accent" aria-hidden />

        <header className="project-modal__toolbar">
          <div className="project-modal__toolbar-start">
            {index != null ? (
              <span className="project-modal__index" aria-hidden>
                {String(index).padStart(2, '0')}
              </span>
            ) : null}
            <div className="project-modal__toolbar-text">
              <span className="project-modal__eyebrow">Case study</span>
              <span className="project-modal__toolbar-title">{project.name}</span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            data-cursor="close"
            onClick={onClose}
            className="project-modal__close"
            aria-label="Close dialog"
          >
            <span className="project-modal__close-icon" aria-hidden>
              ×
            </span>
            <span className="project-modal__close-label">Close</span>
            <kbd className="project-modal__kbd">Esc</kbd>
          </button>
        </header>

        <div className="project-modal__main">
          <div className="project-modal__hero">
            <img
              src={project.image}
              alt=""
              className="project-modal__image"
              width={960}
              height={480}
            />
            <div className="project-modal__hero-overlay" aria-hidden />
            <div className="project-modal__hero-caption">
              {project.featured ? (
                <span className="project-modal__badge">Featured</span>
              ) : null}
              {hasLive ? (
                <span className="project-modal__badge project-modal__badge--live">Live</span>
              ) : null}
            </div>
          </div>

          <div className="project-modal__body">
            <h2 id="project-modal-title" className="project-modal__title">
              {project.name}
            </h2>

            {(project.role || project.period) && (
              <p className="project-modal__meta">
                {project.role ? <span>{project.role}</span> : null}
                {project.role && project.period ? (
                  <span className="project-modal__meta-sep" aria-hidden>
                    ·
                  </span>
                ) : null}
                {project.period ? <span>{project.period}</span> : null}
              </p>
            )}

            <div className="project-modal__sections">
              <section
                className="project-modal__section project-modal__section--card"
                aria-labelledby="project-modal-overview"
              >
                <h3 id="project-modal-overview" className="project-modal__section-label">
                  Overview
                </h3>
                <p className="project-modal__description">{project.description}</p>
              </section>

              {highlights.length > 0 ? (
                <section
                  className="project-modal__section project-modal__section--card"
                  aria-labelledby="project-modal-platform"
                >
                  <h3 id="project-modal-platform" className="project-modal__section-label">
                    Platform architecture
                  </h3>
                  <ul className="project-modal__highlights">
                    {highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {products.length > 0 ? (
                <div className="project-modal__product-stack">
                  <h3 className="project-modal__section-label project-modal__section-label--stack">
                    Product sections
                  </h3>
                  {products.map((product, productIndex) => {
                    const headingId = `project-modal-product-${productIndex}`
                    const techId = `${headingId}-tech`
                    const productHighlights = product.highlights ?? []
                    const productTags = product.tags ?? []

                    return (
                      <section
                        key={product.name}
                        className="project-modal__section project-modal__section--product"
                        aria-labelledby={headingId}
                      >
                        <header className="project-modal__product-header">
                          <div className="project-modal__product-header-row">
                            <span className="project-modal__product-index" aria-hidden>
                              {String(productIndex + 1).padStart(2, '0')}
                            </span>
                            {product.shortName ? (
                              <span className="project-modal__product-code">{product.shortName}</span>
                            ) : null}
                          </div>
                          <h4 id={headingId} className="project-modal__product-name">
                            {product.name}
                          </h4>
                          {product.audience ? (
                            <p className="project-modal__product-audience">{product.audience}</p>
                          ) : null}
                          <p className="project-modal__product-desc">{product.description}</p>
                        </header>

                        {productHighlights.length > 0 ? (
                          <div className="project-modal__product-tech" aria-labelledby={techId}>
                            <h5 id={techId} className="project-modal__product-tech-label">
                              Technical contributions
                            </h5>
                            <ul className="project-modal__highlights">
                              {productHighlights.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {productTags.length > 0 ? (
                          <ul className="project-modal__tags" aria-label={`${product.shortName ?? product.name} focus`}>
                            {productTags.map((tag) => (
                              <li key={tag}>
                                <span className="project-modal__tag">{tag}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </section>
                    )
                  })}
                </div>
              ) : null}

              <section
                className="project-modal__section project-modal__section--card"
                aria-labelledby="project-modal-stack"
              >
                <h3 id="project-modal-stack" className="project-modal__section-label">
                  Shared tech stack
                </h3>
                <ul className="project-modal__tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <span className="project-modal__tag">{tag}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <footer className="project-modal__footer">
              <div className="project-modal__actions">
                {hasLive ? (
                  <Button href={project.links.live} external>
                    Visit product
                  </Button>
                ) : null}
                {hasGithub ? (
                  <Button variant="secondary" href={project.links.github} external>
                    Source code
                  </Button>
                ) : null}
                <Button variant="ghost" cursorHint="close" onClick={onClose}>
                  Dismiss
                </Button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
