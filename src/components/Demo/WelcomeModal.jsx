import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'

const LANGUAGES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
]

export default function WelcomeModal({ onClose }) {
  const { t, i18n } = useTranslation()
  const [selectedLang, setSelectedLang] = useState(() => i18n.language || 'fr')
  const overlayRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    if (overlayRef.current) gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    if (cardRef.current) gsap.fromTo(cardRef.current, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)', delay: 0.1 })
  }, [])

  const handleStart = useCallback(() => {
    localStorage.setItem('inspecto_welcome_done', '1')
    localStorage.setItem('inspecto_demo_lang', selectedLang)
    const close = () => onClose(selectedLang)
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 0.95, opacity: 0, duration: 0.25, onComplete: close })
    } else { close() }
  }, [selectedLang, onClose])

  return (
    <div ref={overlayRef} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={cardRef} style={{ width: 520, maxWidth: '95vw', background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '40px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '0.06em' }}>inspecto</span>
            <span style={{ position: 'absolute', top: -1, left: 0, width: 6, height: 6, borderRadius: '50%', background: '#d7294a' }} />
          </div>
          <div style={{ width: 60, height: 2, background: '#d7294a', marginBottom: 16 }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 6 }}>{t('welcome.title')}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{t('welcome.subtitle')}</p>
        </div>

        {/* Language selection */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{t('welcome.languageLabel')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setSelectedLang(l.code)} style={{
                padding: '6px 16px', borderRadius: 20, border: '1px solid',
                borderColor: selectedLang === l.code ? '#d7294a' : 'rgba(255,255,255,0.2)',
                background: selectedLang === l.code ? '#d7294a' : 'transparent',
                color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
              }}>{l.label}</button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={handleStart} style={{
          width: '100%', padding: 14, borderRadius: 8, border: 'none',
          background: '#d7294a', color: '#fff', fontFamily: 'Inter, sans-serif',
          fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s',
        }}>{t('welcome.start')}</button>
      </div>
    </div>
  )
}
