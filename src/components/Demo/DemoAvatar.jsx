import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../../context/DemoContext'
import gsap from 'gsap'

export default function DemoAvatar() {
  const { t } = useTranslation()
  const { status, runEngine, startDemo, dismissDemo, currentStep } = useDemoContext()
  const engineStarted = useRef(false)
  const containerRef = useRef(null)
  const textRef = useRef(null)

  /* ─── Dynamic repositioning based on target element quadrant ─── */
  const defaultPos = { bottom: 24, left: 24, top: 'auto', right: 'auto' }
  const [avatarPos, setAvatarPos] = useState(defaultPos)

  useEffect(() => {
    if (status !== 'running' && status !== 'paused') return
    if (!currentStep?.selector) {
      setAvatarPos(defaultPos)
      return
    }
    const el = document.querySelector(currentStep.selector)
    if (!el) { setAvatarPos(defaultPos); return }

    const rect = el.getBoundingClientRect()
    const isTop = rect.top < window.innerHeight / 2

    if (isTop) {
      // Target is in top half → avatar goes to bottom-left (inside sidebar area, no conflict)
      setAvatarPos({ bottom: 24, left: 24, top: 'auto', right: 'auto' })
    } else {
      // Target is in bottom half → avatar goes to top, clear of sidebar (left: 260px)
      setAvatarPos({ top: 80, left: 260, bottom: 'auto', right: 'auto' })
    }
  }, [currentStep, status])

  /* Run the engine once avatar is mounted and textRef is ready */
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

  /* Reset engine flag when demo ends */
  useEffect(() => {
    if (status === 'idle' || status === 'complete') {
      engineStarted.current = false
    }
  }, [status])

  /* Entrance animation */
  useEffect(() => {
    if (!containerRef.current) return
    if (status === 'running') {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
      )
    }
  }, [status])

  if (status !== 'running' && status !== 'paused' && status !== 'complete') return null

  /* ─── End of demo: conclusion card (D5) ─── */
  if (status === 'complete') {
    return (
      <div className="demo-avatar-float demo-avatar-complete" ref={containerRef}>
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
          </svg>
        </div>
        <div className="demo-speech-bubble demo-speech-solid">
          <button className="demo-close-btn" onClick={dismissDemo} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <p className="demo-speech-text">{t('demo.conclusion')}</p>
          <div className="demo-end-actions">
            <a
              href="https://inspectogroup.com/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="demo-end-btn demo-end-btn--primary"
            >
              {t('demo.bookDemo')} →
            </a>
            <button
              className="demo-end-btn demo-end-btn--outline"
              onClick={() => {
                sessionStorage.removeItem('demo-seen')
                startDemo()
              }}
            >
              ↺ {t('demo.restart')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Running / paused: avatar + speech ─── */
  const posStyle = {
    opacity: 0,
    top: avatarPos.top === 'auto' ? 'auto' : avatarPos.top,
    bottom: avatarPos.bottom === 'auto' ? 'auto' : avatarPos.bottom,
    left: avatarPos.left === 'auto' ? 'auto' : avatarPos.left,
    right: avatarPos.right === 'auto' ? 'auto' : avatarPos.right,
    transition: 'top 0.4s cubic-bezier(0.4,0,0.2,1), bottom 0.4s cubic-bezier(0.4,0,0.2,1), left 0.4s cubic-bezier(0.4,0,0.2,1), right 0.4s cubic-bezier(0.4,0,0.2,1)',
  }

  return (
    <div className="demo-avatar-float" ref={containerRef} style={posStyle}>
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
      </div>

      <div className="demo-speech-bubble demo-speech-solid">
        <p className="demo-speech-text" ref={textRef}></p>
      </div>
    </div>
  )
}
