import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProject } from '../../context/ProjectContext'
import { useDemoContext } from '../../context/DemoContext'
import { showToast } from '../Toast'
import LanguageSwitcher from '../LanguageSwitcher'
import WelcomeModal from '../Demo/WelcomeModal'

export default function Topbar({ onToggleSidebar, onOpenMainMenu }) {
  const { t } = useTranslation()
  const location = useLocation()
  const { activeProject } = useProject()
  const demo = useDemoContext()
  const [showWelcome, setShowWelcome] = useState(false)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('inspecto-theme')
    return saved ? saved === 'dark' : true
  })

  const path = location.pathname
  const title = activeProject
    ? (t(`topbar.pagesWithProject.${path}`, { defaultValue: '' }) || t(`topbar.pages.${path}`, { defaultValue: t('topbar.brand') }))
    : t(`topbar.pages.${path}`, { defaultValue: t('topbar.brand') })

  return (
    <header className="app-topbar">
      <button className="topbar-hamburger" onClick={onOpenMainMenu || onToggleSidebar} aria-label={t('topbar.openMenu')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div className="topbar-page-title">{title}</div>

      <div className="topbar-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder={t('common.search')} aria-label={t('common.search')} />
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-action-btn topbar-demo-btn"
          title={t('topbar.demoTooltip')}
          aria-label={t('topbar.demoTooltip')}
          onClick={() => {
            if (demo?.status === 'idle' || demo?.status === 'complete') {
              sessionStorage.removeItem('demo-seen')
              const welcomed = localStorage.getItem('inspecto_welcome_done')
              if (welcomed) { demo.startDemo() }
              else { setShowWelcome(true) }
            }
          }}
          disabled={demo?.status === 'running'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <span>{t('topbar.demo')}</span>
        </button>

        <div className="topbar-brand">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          <span>{t('topbar.brand')}</span>
        </div>

        <div className="topbar-toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <div className="topbar-toggle-switch" onClick={() => {
          setDarkMode(d => {
            const next = !d
            document.documentElement.dataset.theme = next ? 'dark' : 'light'
            localStorage.setItem('inspecto-theme', next ? 'dark' : 'light')
            return next
          })
        }} style={{ cursor: 'pointer', background: darkMode ? 'var(--bg-tertiary)' : 'var(--blue)' }}>
            <div className="topbar-toggle-knob" style={{ left: darkMode ? 16 : 2 }}></div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>

        <button className="topbar-action-btn" title={t('common.notifications')} aria-label={t('common.notifications')} onClick={() => showToast(t('common.noNotifications'), 'info')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        <div className="topbar-avatar">RA</div>

        <LanguageSwitcher variant="topbar" />

        <Link to="/" className="topbar-back-btn">&larr;</Link>
      </div>

      {showWelcome && (
        <WelcomeModal onClose={() => { setShowWelcome(false); demo.startDemo() }} />
      )}
    </header>
  )
}
