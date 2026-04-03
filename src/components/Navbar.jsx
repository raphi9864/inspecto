import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../context/DemoContext'
import WelcomeModal from './Demo/WelcomeModal'

export default function Navbar() {
  const { t } = useTranslation()
  const demo = useDemoContext()
  const [showWelcome, setShowWelcome] = useState(false)

  const launchDemo = () => {
    if (demo?.status === 'idle' || demo?.status === 'complete') {
      sessionStorage.removeItem('demo-seen')
      setShowWelcome(true)
    }
  }

  return (
    <nav className="navbar" id="navbar">
      <Link to="/" className="navbar-logo" aria-label="inspecto">
        <img src="/logo-inspecto-white.svg" alt="inspecto" className="navbar-logo-img" height="28" />
      </Link>

      <div className="navbar-right">
        <button
          className="navbar-cta navbar-cta--demo"
          onClick={launchDemo}
          disabled={demo?.status === 'running'}
          data-demo-target="navbar-demo-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>{t('navbar.startDemo')}</span>
        </button>
        <a
          href="https://inspectogroup.com/contact/"
          className="navbar-cta navbar-cta--book"
          target="_blank"
          rel="noopener noreferrer"
          data-demo-target="navbar-book-btn"
        >
          {t('navbar.demoBtn')}
        </a>
      </div>

      {showWelcome && (
        <WelcomeModal
          initialLang={demo?.demoLang || 'fr'}
          initialVoice={demo?.demoVoice || null}
          onClose={(lang, voice) => { setShowWelcome(false); if (lang) demo.startDemo(lang, voice) }}
        />
      )}
    </nav>
  )
}
