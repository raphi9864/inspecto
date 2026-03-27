import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import useVoiceSettings from '../../hooks/useVoiceSettings'

const LANGUAGES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
]

export default function WelcomeModal({ onClose }) {
  const { t, i18n } = useTranslation()
  const { voiceGender, setVoiceGender } = useVoiceSettings()
  const [selectedLang, setSelectedLang] = useState(() => i18n.language || 'fr')
  const [selectedGender, setSelectedGender] = useState(voiceGender || 'male')
  const [previewPlaying, setPreviewPlaying] = useState(null) // 'male' | 'female' | null
  const overlayRef = useRef(null)
  const cardRef = useRef(null)
  const audioRef = useRef(null)

  // Animate in
  useEffect(() => {
    if (overlayRef.current) gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    if (cardRef.current) gsap.fromTo(cardRef.current, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)', delay: 0.1 })
  }, [])

  const changeLang = useCallback((code) => {
    setSelectedLang(code)
  }, [])

  const playPreview = useCallback((gender) => {
    // Stop current
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setPreviewPlaying(gender)
    const url = `/audio/intro-${selectedLang}-${gender}.mp3`
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => { setPreviewPlaying(null); audioRef.current = null }
    audio.onerror = () => { setPreviewPlaying(null); audioRef.current = null }
    // Play only 3 seconds
    audio.play().catch(() => { setPreviewPlaying(null) })
    setTimeout(() => { if (audioRef.current === audio) { audio.pause(); setPreviewPlaying(null); audioRef.current = null } }, 3000)
  }, [selectedLang])

  const handleStart = useCallback(() => {
    // Save preferences
    setVoiceGender(selectedGender)
    localStorage.setItem('inspecto_welcome_done', '1')
    localStorage.setItem('inspecto_demo_lang', selectedLang)
    // Stop any preview
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    // Animate out — pass selected demo language to caller
    const close = () => onClose(selectedLang)
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 0.95, opacity: 0, duration: 0.25, onComplete: close })
    } else { close() }
  }, [selectedGender, selectedLang, setVoiceGender, onClose])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } }
  }, [])

  return (
    <div ref={overlayRef} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={cardRef} style={{ width: 580, maxWidth: '95vw', background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '40px 48px' }}>

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
              <button key={l.code} onClick={() => changeLang(l.code)} style={{
                padding: '6px 16px', borderRadius: 20, border: '1px solid',
                borderColor: selectedLang === l.code ? '#d7294a' : 'rgba(255,255,255,0.2)',
                background: selectedLang === l.code ? '#d7294a' : 'transparent',
                color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
              }}>{l.label}</button>
            ))}
          </div>
        </div>

        {/* Voice selection */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{t('welcome.guideLabel')}</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {/* George */}
            <VoiceCard
              letter="G" name="George" desc={t('welcome.georgeDesc')}
              selected={selectedGender === 'male'}
              onSelect={() => setSelectedGender('male')}
              onPreview={() => playPreview('male')}
              isPlaying={previewPlaying === 'male'}
              previewLabel={previewPlaying === 'male' ? t('welcome.playing') : t('welcome.preview')}
              gradient="linear-gradient(135deg, #0d2a45, #1a3a5c)"
              borderColor="rgba(0,180,255,0.4)"
            />
            {/* Alice */}
            <VoiceCard
              letter="A" name="Alice" desc={t('welcome.aliceDesc')}
              selected={selectedGender === 'female'}
              onSelect={() => setSelectedGender('female')}
              onPreview={() => playPreview('female')}
              isPlaying={previewPlaying === 'female'}
              previewLabel={previewPlaying === 'female' ? t('welcome.playing') : t('welcome.preview')}
              gradient="linear-gradient(135deg, #2a1535, #3d1a4a)"
              borderColor="rgba(215,41,74,0.4)"
            />
          </div>
        </div>

        {/* CTA */}
        <button onClick={handleStart} style={{
          width: '100%', padding: 14, borderRadius: 8, border: 'none',
          background: '#d7294a', color: '#fff', fontFamily: 'Inter, sans-serif',
          fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s',
          opacity: selectedGender ? 1 : 0.4,
        }}>{t('welcome.start')}</button>
      </div>
    </div>
  )
}

function VoiceCard({ letter, name, desc, selected, onSelect, onPreview, isPlaying, previewLabel, gradient, borderColor }) {
  return (
    <div onClick={onSelect} style={{
      flex: 1, padding: 20, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
      border: selected ? '2px solid #d7294a' : '1px solid rgba(255,255,255,0.1)',
      background: selected ? 'rgba(215,41,74,0.06)' : 'rgba(255,255,255,0.02)',
      transition: 'all 0.2s',
    }}>
      {/* Avatar */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
        background: gradient, border: `2px solid ${borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif',
      }}>{letter}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{desc}</div>
      <button onClick={(e) => { e.stopPropagation(); onPreview() }} style={{
        padding: '4px 14px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)',
        background: 'transparent', color: isPlaying ? '#d7294a' : 'rgba(255,255,255,0.6)',
        fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s',
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ marginRight: 4, verticalAlign: -1 }}>
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        {previewLabel}
      </button>
    </div>
  )
}
