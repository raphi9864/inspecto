import { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProject } from '../../context/ProjectContext'
import { useDemoContext } from '../../context/DemoContext'
import { showToast } from '../Toast'
import WelcomeModal from '../Demo/WelcomeModal'

const FLAG_MAP = { FR: '\u{1F1EB}\u{1F1F7}', EN: '\u{1F1EC}\u{1F1E7}', IT: '\u{1F1EE}\u{1F1F9}', ES: '\u{1F1EA}\u{1F1F8}', DE: '\u{1F1E9}\u{1F1EA}' }
const LANG_NAMES = { FR: 'Fran\u00e7ais', EN: 'English', IT: 'Italiano', ES: 'Espa\u00f1ol', DE: 'Deutsch' }
const LANGS = Object.keys(FLAG_MAP)

function LanguageDropdown() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = (i18n.language || 'fr').toUpperCase()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const change = (code) => {
    i18n.changeLanguage(code.toLowerCase())
    localStorage.setItem('inspecto_lang', code.toLowerCase())
    setOpen(false)
  }

  return (
    <div className="topbar-lang-wrapper" ref={ref}>
      <button
        className="topbar-action-btn topbar-lang-btn"
        aria-label="Language"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        data-demo-target="lang-switcher"
      >
        <span className="topbar-lang-flag">{FLAG_MAP[current]}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div className="topbar-lang-dropdown">
          {LANGS.map(l => (
            <button
              key={l}
              className={`topbar-lang-option${l === current ? ' active' : ''}`}
              onClick={() => change(l)}
            >
              <span className="topbar-lang-flag">{FLAG_MAP[l]}</span>
              <span>{LANG_NAMES[l]}</span>
              {l === current && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Topbar({ onToggleSidebar, onToggleMobileSidebar, onOpenMainMenu }) {
  const { t } = useTranslation()
  const location = useLocation()
  const { activeProject } = useProject()
  const demo = useDemoContext()
  const [showWelcome, setShowWelcome] = useState(false)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('inspecto-theme')
    return saved ? saved === 'dark' : true
  })

  const toggleTheme = () => {
    setDarkMode(d => {
      const next = !d
      document.documentElement.dataset.theme = next ? 'dark' : 'light'
      localStorage.setItem('inspecto-theme', next ? 'dark' : 'light')
      return next
    })
  }

  const path = location.pathname
  const title = activeProject
    ? (t(`topbar.pagesWithProject.${path}`, { defaultValue: '' }) || t(`topbar.pages.${path}`, { defaultValue: t('topbar.brand') }))
    : t(`topbar.pages.${path}`, { defaultValue: t('topbar.brand') })

  const launchDemo = () => {
    if (demo?.status === 'idle' || demo?.status === 'complete') {
      sessionStorage.removeItem('demo-seen')
      setShowWelcome(true)
    }
  }

  return (
    <header className="app-topbar">
      {/* ── Left zone: hamburger + logo + breadcrumb ── */}
      <div className="topbar-left">
        {/* Mobile-only: toggle sidebar drawer */}
        {onToggleMobileSidebar && (
          <button className="topbar-mobile-hamburger" onClick={onToggleMobileSidebar} aria-label={t('topbar.openMenu')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
        {/* Desktop: existing hamburger opens MainMenu overlay */}
        <button className="topbar-hamburger" onClick={onOpenMainMenu || onToggleSidebar} aria-label={t('topbar.openMenu')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <Link to="/app" className="topbar-logo" aria-label="Inspecto">
          <svg className="topbar-logo-svg" viewBox="0 0 172 40" height="28" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="31" fontFamily="Montserrat,Inter,sans-serif" fontWeight="700" fontSize="32" className="topbar-logo-fill">inspecto</text>
            <circle cx="7.5" cy="6" r="4" fill="#CC0000"/>
            <text x="152" y="14" fontSize="11" fontWeight="600" className="topbar-logo-fill">®</text>
          </svg>
        </Link>
        <span className="topbar-breadcrumb-sep">/</span>
        <h1 className="topbar-page-title">{title}</h1>
      </div>

      {/* ── Center zone: search ── */}
      <div className="topbar-center">
        <div className="topbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder={t('common.search')} aria-label={t('common.search')} />
        </div>
      </div>

      {/* ── Right zone: actions ── */}
      <div className="topbar-right">
        {/* Demo CTA */}
        <button
          className="topbar-cta topbar-cta--demo"
          onClick={launchDemo}
          disabled={demo?.status === 'running'}
          data-demo-target="topbar-demo-btn"
          title={t('topbar.demoTooltip')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Demo</span>
        </button>

        {/* Book a Meeting CTA */}
        <a
          href="https://inspectogroup.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="topbar-cta topbar-cta--meeting"
          data-demo-target="topbar-meeting-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>{t('topbar.bookMeeting')}</span>
        </a>

        <div className="topbar-separator" />

        {/* Theme toggle pill */}
        <button
          className="topbar-theme-pill"
          onClick={toggleTheme}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          data-demo-target="theme-toggle"
        >
          <span className={`topbar-theme-icon${!darkMode ? ' active' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </span>
          <span className={`topbar-theme-icon${darkMode ? ' active' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </span>
        </button>

        {/* Notifications */}
        <button
          className="topbar-action-btn"
          title={t('common.notifications')}
          aria-label={t('common.notifications')}
          onClick={() => showToast(t('common.noNotifications'), 'info')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Avatar */}
        <div className="topbar-avatar" data-demo-target="topbar-avatar">RA</div>

        <div className="topbar-separator" />

        {/* Language */}
        <LanguageDropdown />
      </div>

      {showWelcome && (
        <WelcomeModal onClose={(lang) => { setShowWelcome(false); demo.startDemo(lang) }} />
      )}
    </header>
  )
}
