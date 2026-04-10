import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'

const LANGUAGES = [
  { code: 'fr', flag: '\u{1F1EB}\u{1F1F7}', name: 'Fran\u00e7ais' },
  { code: 'en', flag: '\u{1F1EC}\u{1F1E7}', name: 'English' },
  { code: 'es', flag: '\u{1F1EA}\u{1F1F8}', name: 'Espa\u00f1ol' },
  { code: 'it', flag: '\u{1F1EE}\u{1F1F9}', name: 'Italiano' },
  { code: 'de', flag: '\u{1F1E9}\u{1F1EA}', name: 'Deutsch' },
]

const GENDERS = ['male', 'female']

export default function WelcomeModal({ onClose, initialLang, initialVoice }) {
  const { t } = useTranslation()
  const [selectedLang, setSelectedLang] = useState(initialLang || 'fr')
  const [selectedVoice, setSelectedVoice] = useState(initialVoice || null)
  const [playingPreview, setPlayingPreview] = useState(null) // e.g. "fr_male"
  const [previewError, setPreviewError] = useState(null)
  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const audioRef = useRef(null)

  /* ─── GSAP entrance ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      }
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 40, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)', delay: 0.1 }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  /* ─── Preload all preview audio files on mount ─── */
  const preloadedRef = useRef({})
  useEffect(() => {
    for (const lang of LANGUAGES) {
      for (const gender of GENDERS) {
        const genderCode = gender === 'male' ? 'm' : 'f'
        const key = `${lang.code}_${gender}`
        const audio = new Audio()
        audio.preload = 'auto'
        audio.src = `/audio/preview/preview_${lang.code}_${genderCode}.mp3`
        preloadedRef.current[key] = audio
      }
    }
    return () => {
      Object.values(preloadedRef.current).forEach(a => { a.pause(); a.src = '' })
      preloadedRef.current = {}
    }
  }, [])

  /* ─── Cleanup active audio on unmount ─── */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  /* ─── Preview audio (uses preloaded files for instant playback) ─── */
  const playPreview = useCallback((lang, gender) => {
    const key = `${lang}_${gender}`

    // If already playing this one, stop it
    if (playingPreview === key && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
      setPlayingPreview(null)
      return
    }

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    setPreviewError(null)
    setPlayingPreview(key)

    // Use preloaded audio if available, fallback to new Audio
    const preloaded = preloadedRef.current[key]
    const audio = preloaded || new Audio(`/audio/preview/preview_${lang}_${gender === 'male' ? 'm' : 'f'}.mp3`)
    if (preloaded) audio.currentTime = 0
    audioRef.current = audio

    const onEnded = () => {
      setPlayingPreview(null)
      audioRef.current = null
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
    const onError = () => {
      setPlayingPreview(null)
      setPreviewError(key)
      audioRef.current = null
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      setTimeout(() => setPreviewError(prev => prev === key ? null : prev), 2000)
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    audio.play().catch(() => {
      setPlayingPreview(null)
      setPreviewError(key)
      audioRef.current = null
      setTimeout(() => setPreviewError(prev => prev === key ? null : prev), 2000)
    })
  }, [playingPreview])

  /* ─── Start demo ─── */
  const handleStart = useCallback(() => {
    // Stop any preview audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    localStorage.setItem('inspecto_welcome_done', '1')
    localStorage.setItem('inspecto_demo_lang', selectedLang)
    if (selectedVoice) {
      localStorage.setItem('inspecto_voice_gender', selectedVoice)
    }

    const close = () => onClose(selectedLang, selectedVoice || 'male')
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 0.95, opacity: 0, duration: 0.25, onComplete: close })
    } else {
      close()
    }
  }, [selectedLang, selectedVoice, onClose])

  const canStart = selectedLang && selectedVoice

  return (
    <div ref={overlayRef} className="welcome-overlay">
      <div ref={cardRef} className="welcome-card">

        {/* Close button */}
        <button
          className="welcome-close-btn"
          onClick={() => {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
            onClose(null)
          }}
          aria-label={t('common.close')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header */}
        <div className="welcome-header">
          <div className="welcome-logo">
            <img src="/logo-inspecto-white.svg" alt="inspecto" className="welcome-logo-img" />
          </div>
          <div className="welcome-divider" />
          <h2 className="welcome-title">{t('demo.chooseLanguageVoice')}</h2>
        </div>

        {/* Language + Voice grid */}
        <div className="welcome-lang-grid">
          {LANGUAGES.map(lang => {
            const isActive = selectedLang === lang.code
            return (
              <div
                key={lang.code}
                className={`welcome-lang-card${isActive ? ' welcome-lang-card--active' : ''}`}
                onClick={() => setSelectedLang(lang.code)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedLang(lang.code) } }}
              >
                {/* Language label */}
                <div className="welcome-lang-label">
                  <span className="welcome-lang-flag">{lang.flag}</span>
                  <span className="welcome-lang-name">{lang.name}</span>
                </div>

                {/* Voice options */}
                <div className="welcome-voice-options">
                  {GENDERS.map(gender => {
                    const previewKey = `${lang.code}_${gender}`
                    const isVoiceSelected = isActive && selectedVoice === gender
                    const isPlaying = playingPreview === previewKey
                    const hasError = previewError === previewKey

                    return (
                      <div key={gender} className="welcome-voice-row">
                        <label
                          className={`welcome-voice-label${isVoiceSelected ? ' welcome-voice-label--selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLang(lang.code)
                            setSelectedVoice(gender)
                          }}
                        >
                          <span className={`welcome-radio${isVoiceSelected ? ' welcome-radio--checked' : ''}`}>
                            {isVoiceSelected && <span className="welcome-radio-dot" />}
                          </span>
                          <span className="welcome-voice-text">
                            {gender === 'male' ? t('demo.maleVoice') : t('demo.femaleVoice')}
                          </span>
                        </label>
                        <button
                          className={`welcome-preview-btn${isPlaying ? ' welcome-preview-btn--playing' : ''}${hasError ? ' welcome-preview-btn--error' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            playPreview(lang.code, gender)
                          }}
                          aria-label={`${t('demo.previewVoice')} - ${lang.name} ${gender === 'male' ? t('demo.maleVoice') : t('demo.femaleVoice')}`}
                          title={hasError ? 'Audio unavailable' : t('demo.previewVoice')}
                        >
                          {hasError ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          ) : isPlaying ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <button
          className={`welcome-start-btn${!canStart ? ' welcome-start-btn--disabled' : ''}`}
          onClick={handleStart}
          disabled={!canStart}
        >
          {t('demo.startDemo')}
        </button>
      </div>
    </div>
  )
}
