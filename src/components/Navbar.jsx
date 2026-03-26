import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t } = useTranslation()
  return (
    <nav className="navbar" id="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-dot"></span>
        <span className="navbar-logo-text">{t('navbar.brand')}</span>
      </Link>
      <div className="navbar-right">
        <a href="https://inspectogroup.com/contact/" className="btn-demo" target="_blank" rel="noopener">
          {t('navbar.demoBtn')}
        </a>
      </div>
    </nav>
  )
}
