import { useTranslation } from 'react-i18next'
import { useProductMode } from '../context/ProductModeContext'

/* ─────────────────────────────────────────────────────────────────
   ProductPills — Inspecto ⇄ SAE toggle
   Used in both the marketing Navbar and the /app Topbar.
   Flips ProductMode context (which persists to localStorage and
   applies data-product-mode on <html>).
   ───────────────────────────────────────────────────────────────── */

const InspectoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.6 6.1L21 9l-5 4.3L17.2 20 12 16.8 6.8 20 8 13.3 3 9l6.4-.9L12 2z" />
  </svg>
)
const SaeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="13" y2="16" />
  </svg>
)

export default function ProductPills({ variant = 'navbar' }) {
  const { t } = useTranslation()
  const { mode, setMode } = useProductMode()

  return (
    <div
      className={`product-pills product-pills--${variant}`}
      role="tablist"
      aria-label={t('navbar.productSwitcher')}
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'inspecto'}
        className={`product-pill${mode === 'inspecto' ? ' product-pill--active' : ''}`}
        onClick={() => setMode('inspecto')}
        data-demo-target="product-inspecto-btn"
      >
        <InspectoIcon />
        <span>{t('navbar.inspecto')}</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'sae'}
        className={`product-pill product-pill--sae${mode === 'sae' ? ' product-pill--active' : ''}`}
        onClick={() => setMode('sae')}
        data-demo-target="product-sae-btn"
      >
        <SaeIcon />
        <span>{t('navbar.sae')}</span>
      </button>
    </div>
  )
}
