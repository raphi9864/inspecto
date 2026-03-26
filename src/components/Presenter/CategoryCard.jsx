import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'

/**
 * CategoryCard — Large category card for the Presenter page.
 *
 * Two modes:
 *  - collapsed: shows category icon, title, and small subcategory badges
 *  - expanded: shows full subcategory list with icon + label + description
 *
 * Props:
 *  - category      { key, title, icon, accent, subcategories[] }
 *  - isExpanded    boolean
 *  - isHidden      boolean — true when another card is expanded
 *  - onExpand      () => void
 *  - onSubcategoryClick (route, cardEl) => void
 *  - onBack        () => void
 *  - position      'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
 */
export default function CategoryCard({
  category,
  isExpanded,
  isHidden,
  onExpand,
  onSubcategoryClick,
  onBack,
  position,
}) {
  const { t } = useTranslation()
  const cardRef = useRef(null)

  /* Animate hide/show when another card expands */
  useEffect(() => {
    if (!cardRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = prefersReduced ? 0.01 : 0.4

    if (isHidden) {
      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: dur,
        ease: 'power2.in',
        pointerEvents: 'none',
      })
    } else {
      gsap.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        duration: dur,
        ease: 'power2.out',
        pointerEvents: 'auto',
      })
    }
  }, [isHidden])

  function handleKeyDown(e) {
    if (e.key === 'Escape' && isExpanded && onBack) {
      e.preventDefault()
      onBack()
    }
    if ((e.key === 'Enter' || e.key === ' ') && !isExpanded) {
      e.preventDefault()
      onExpand()
    }
  }

  function handleSubcategoryKeyDown(e, sub) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSubcategoryClick(sub.route, cardRef.current)
    }
  }

  const posClass = `category-pos-${position}`

  return (
    <div
      ref={cardRef}
      className={`category-card ${posClass}${isExpanded ? ' expanded' : ''}`}
      data-category={category.key}
      style={{ '--cat-accent': category.accent }}
      role="button"
      tabIndex={isHidden ? -1 : 0}
      aria-label={`Categorie ${category.title}`}
      aria-expanded={isExpanded}
      onClick={!isExpanded ? onExpand : undefined}
      onKeyDown={handleKeyDown}
    >
      {/* Top accent bar */}
      <div className="category-card-accent" />

      {/* Card header */}
      <div className="category-card-header">
        <div className="category-card-icon">{category.icon}</div>
        <h3 className="category-card-title">{category.title}</h3>
      </div>

      {/* Collapsed mode: badges */}
      {!isExpanded && (
        <div className="category-badges">
          {category.subcategories.map((sub) => (
            <span key={sub.route} className="category-badge">
              {sub.label}
            </span>
          ))}
        </div>
      )}

      {/* Expanded mode: full subcategory list + back button */}
      {isExpanded && (
        <div className="category-expanded-content">
          <div className="subcategory-list">
            {category.subcategories.map((sub) => (
              <div
                key={sub.route}
                className="subcategory-item"
                role="button"
                tabIndex={0}
                aria-label={`${sub.label} — ${sub.description}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSubcategoryClick(sub.route, cardRef.current)
                }}
                onKeyDown={(e) => handleSubcategoryKeyDown(e, sub)}
              >
                <div className="subcategory-icon">{sub.icon}</div>
                <div className="subcategory-info">
                  <span className="subcategory-label">{sub.label}</span>
                  <span className="subcategory-desc">{sub.description}</span>
                </div>
                <span className="subcategory-arrow" aria-hidden="true">&rarr;</span>
              </div>
            ))}
          </div>
          <button
            className="category-back-btn"
            onClick={(e) => {
              e.stopPropagation()
              onBack()
            }}
            aria-label={t('presenter.backToCategories')}
          >
            {t('common.back')}
          </button>
        </div>
      )}
    </div>
  )
}
