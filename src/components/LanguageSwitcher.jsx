import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LANGS = ['FR', 'EN', 'IT', 'ES', 'DE']

export default function LanguageSwitcher({ variant = 'sidebar' }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const current = (i18n.language || 'fr').toUpperCase()

  const change = (code) => {
    const lc = code.toLowerCase()
    i18n.changeLanguage(lc)
    localStorage.setItem('inspecto_lang', lc)
    setOpen(false)
  }

  if (variant === 'topbar') {
    return (
      <div className="lang-switcher-topbar" style={{ position: 'relative' }}>
        <button
          className="topbar-action-btn topbar-lang"
          aria-label="Language"
          onClick={() => setOpen(!open)}
        >
          <span>{current}</span>
        </button>
        {open && (
          <div className="lang-dropdown">
            {LANGS.map(l => (
              <button
                key={l}
                className={`lang-option${l === current ? ' active' : ''}`}
                onClick={() => change(l)}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="lang-switcher-sidebar">
      <div className="lang-pills">
        {LANGS.map(l => (
          <button
            key={l}
            className={`lang-pill${l === current ? ' active' : ''}`}
            onClick={() => change(l)}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}
