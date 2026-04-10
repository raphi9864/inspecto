import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Intro from '../Intro/Intro'
import Navbar from '../Navbar'

export default function PresenterLayout() {
  const { t } = useTranslation()
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem('intro-seen') === '1'
  )

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('intro-seen', '1')
    setIntroDone(true)
  }, [])

  return (
    <>
      {!introDone && <Intro onComplete={handleIntroComplete} />}
      <Navbar />
      <div id="avatar-wrapper" style={{ visibility: introDone ? 'visible' : 'hidden' }}>
        <Outlet context={{ introDone }} />
      </div>
      <footer className="presenter-footer">
        <img
          src="/logo-inspecto-white.svg"
          alt="inspecto"
          className="presenter-footer-logo presenter-footer-logo--dark"
        />
        <img
          src="/logo-inspecto.svg"
          alt="inspecto"
          className="presenter-footer-logo presenter-footer-logo--light"
        />
        <a href="https://inspectogroup.com/contact/" className="btn-demo-footer" target="_blank" rel="noopener">
          {t('presenter.footer_cta')}
        </a>
        <p>{t('presenter.footer_copy')} <a href="https://inspectogroup.com" target="_blank" rel="noopener">inspectogroup.com</a></p>
      </footer>
    </>
  )
}
