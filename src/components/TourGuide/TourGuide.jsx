import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import Typed from 'typed.js'

export default function TourGuide({ pageKey, steps }) {
  const { t } = useTranslation()
  const guideRef = useRef(null)
  const textRef = useRef(null)
  const typedRef = useRef(null)
  const [current, setCurrent] = useState(-1)
  const [visible, setVisible] = useState(false)

  const tourKey = `tour-seen-${pageKey}`

  const closeTour = useCallback(() => {
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'))
    if (typedRef.current) typedRef.current.destroy()
    gsap.to(guideRef.current, {
      opacity: 0, y: 20, scale: 0.95, duration: 0.3,
      onComplete: () => setVisible(false),
    })
    sessionStorage.setItem(tourKey, '1')
  }, [tourKey])

  const showStep = useCallback((idx) => {
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'))
    if (typedRef.current) { typedRef.current.destroy(); typedRef.current = null }

    const step = steps[idx]
    if (step.target) {
      const el = document.querySelector(step.target)
      if (el) {
        el.classList.add('tour-highlight')
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }

    if (textRef.current) {
      textRef.current.textContent = ''
      typedRef.current = new Typed(textRef.current, {
        strings: [step.text],
        typeSpeed: 20,
        showCursor: false,
        startDelay: 100,
      })
    }

    if (step.action) step.action()
    setCurrent(idx)
  }, [steps])

  useEffect(() => {
    if (sessionStorage.getItem(tourKey)) return
    if (!steps || steps.length === 0) return

    const timer = setTimeout(() => {
      setVisible(true)
      gsap.fromTo(guideRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
      )
      showStep(0)
    }, 900)

    return () => clearTimeout(timer)
  }, [tourKey, steps, showStep])

  // Sound wave animation
  useEffect(() => {
    if (!visible) return
    const spans = guideRef.current?.querySelectorAll('.tour-sound-wave span')
    if (!spans) return
    const anim = gsap.to(spans, {
      scaleY: () => gsap.utils.random(0.2, 1),
      duration: 0.35,
      stagger: { each: 0.08, repeat: -1, yoyo: true },
      transformOrigin: 'bottom center',
    })
    return () => anim.kill()
  }, [visible])

  if (!visible) return null

  function handleNext() {
    if (current >= steps.length - 1) {
      closeTour()
    } else {
      showStep(current + 1)
    }
  }

  return (
    <div className="tour-guide" ref={guideRef} style={{ opacity: 0 }}>
      <div className="tour-guide-header">
        <div className="tour-avatar-circle">AI</div>
        <div>
          <div className="tour-name">{t('tourGuide.title')}</div>
          <div className="tour-role">{t('tourGuide.subtitle')}</div>
        </div>
        <div className="tour-sound-wave">
          <span style={{ height: 8 }}></span>
          <span style={{ height: 14 }}></span>
          <span style={{ height: 10 }}></span>
          <span style={{ height: 16 }}></span>
          <span style={{ height: 7 }}></span>
        </div>
      </div>
      <div className="tour-guide-body">
        <div className="tour-text" ref={textRef}></div>
      </div>
      <div className="tour-progress">
        <div className="tour-dots">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`tour-dot${i < current ? ' done' : i === current ? ' active' : ''}`}
            />
          ))}
        </div>
        <button className="tour-next-btn" onClick={handleNext}>
          {current >= steps.length - 1 ? t('common.close') : t('common.next')}
        </button>
      </div>
    </div>
  )
}
