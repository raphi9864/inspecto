import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../../context/DemoContext'
import useVoiceSettings from '../../hooks/useVoiceSettings'
import gsap from 'gsap'

export default function DemoAvatar() {
  const { t } = useTranslation()
  const { status, runEngine } = useDemoContext()
  const { voiceGender, setVoiceGender } = useVoiceSettings()
  const engineStarted = useRef(false)
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const soundWaveRef = useRef(null)

  /* Run the engine once avatar is mounted and textRef is ready.
     Use a small delay to ensure refs are assigned after render. */
  useEffect(() => {
    if (status !== 'running' || engineStarted.current) return
    const timer = setTimeout(() => {
      if (textRef.current && !engineStarted.current) {
        engineStarted.current = true
        runEngine(textRef)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [status, runEngine])

  /* Reset engine flag when demo ends so it can be relaunched */
  useEffect(() => {
    if (status === 'idle' || status === 'complete') {
      engineStarted.current = false
    }
  }, [status])

  /* Sound wave animation */
  useEffect(() => {
    if (status !== 'running' || !soundWaveRef.current) return
    const spans = soundWaveRef.current.querySelectorAll('span')
    const anim = gsap.to(spans, {
      scaleY: () => gsap.utils.random(0.25, 1),
      duration: 0.4,
      stagger: { each: 0.08, repeat: -1, yoyo: true },
      ease: 'power1.inOut',
      transformOrigin: 'bottom center',
    })
    return () => anim.kill()
  }, [status])

  /* Entrance / exit animation */
  useEffect(() => {
    if (!containerRef.current) return
    if (status === 'running') {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
      )
    } else if (status === 'complete') {
      gsap.to(containerRef.current, {
        opacity: 0, y: 40, scale: 0.9, duration: 0.4, ease: 'power2.in',
      })
    }
  }, [status])

  if (status === 'idle') return null

  return (
    <div className="demo-avatar-float" ref={containerRef} style={{ opacity: 0 }}>
      {/* Mini avatar */}
      <div className="demo-avatar-circle">
        <svg className="demo-avatar-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="96" fill="#EBF4FF" stroke="#2ea3f2" strokeWidth="2"/>
          <path d="M60 170 C60 135 75 120 100 120 C125 120 140 135 140 170" fill="#2ea3f2"/>
          <path d="M82 120 L100 135 L118 120" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="100" cy="85" r="32" fill="#F5D6B8"/>
          <path d="M68 80 C68 58 82 48 100 48 C118 48 132 58 132 80 C132 72 125 62 100 62 C75 62 68 72 68 80Z" fill="#3A3A3A"/>
          <ellipse cx="88" cy="88" rx="3.5" ry="4" fill="#2D3748"/>
          <ellipse cx="112" cy="88" rx="3.5" ry="4" fill="#2D3748"/>
          <path d="M90 100 Q100 110 110 100" stroke="#C4956A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <rect x="108" y="130" width="28" height="12" rx="3" fill="#fff" opacity="0.9"/>
          <circle cx="114" cy="136" r="2.5" fill="#CC0000"/>
          <rect x="119" y="134" width="14" height="3" rx="1" fill="#2ea3f2"/>
        </svg>
        <div className="demo-sound-wave" ref={soundWaveRef}>
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      {/* Speech bubble */}
      <div className="demo-speech-bubble">
        <p className="demo-speech-text" ref={textRef}></p>
      </div>

      {/* Voice gender toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('demo.voice')}</span>
        <button
          onClick={() => setVoiceGender('male')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, color: voiceGender === 'male' ? '#2ea3f2' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {' '}{t('demo.male')}
        </button>
        <button
          onClick={() => setVoiceGender('female')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600, color: voiceGender === 'female' ? '#d7294a' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {' '}{t('demo.female')}
        </button>
      </div>
    </div>
  )
}
