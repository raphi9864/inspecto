import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../../context/DemoContext'
import gsap from 'gsap'

export default function DemoControlBar() {
  const { t } = useTranslation()
  const {
    status, currentPhase, phaseTitle, totalPhases,
    pauseDemo, resumeDemo, nextStep, prevStep, jumpToModule,
    skipDemo, isMuted, setMuted, phases,
  } = useDemoContext()
  const [confirmQuit, setConfirmQuit] = useState(false)
  const barRef = useRef(null)

  const isPaused = status === 'paused'
  const isRunning = status === 'running'

  /* Entrance animation */
  useEffect(() => {
    if (!barRef.current) return
    if (status === 'running' || status === 'paused') {
      const ctx = gsap.context(() => {
        gsap.fromTo(barRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }
        )
      }, barRef)
      return () => ctx.revert()
    }
  }, [status === 'running' || status === 'paused'])

  if (status !== 'running' && status !== 'paused') return null

  const canPrevChapter = currentPhase > 1
  const canNextChapter = currentPhase < totalPhases

  const handlePrevChapter = () => {
    if (!canPrevChapter) return
    jumpToModule(currentPhase - 1)
  }

  const handleNextChapter = () => {
    if (!canNextChapter) return
    jumpToModule(currentPhase + 1)
  }

  const handlePrevStep = () => {
    prevStep()
  }

  const handleNextStep = () => {
    nextStep()
  }

  const handlePlayPause = () => {
    if (isPaused) resumeDemo()
    else pauseDemo()
  }

  const handleMuteToggle = () => {
    setMuted(!isMuted)
  }

  const handleQuit = () => {
    setConfirmQuit(false)
    skipDemo()
  }

  return (
    <div className="demo-control-bar" ref={barRef}>
      {/* Prev Chapter */}
      <button
        className={`dcb-btn${!canPrevChapter ? ' dcb-btn--disabled' : ''}`}
        onClick={handlePrevChapter}
        disabled={!canPrevChapter}
        title={t('demo.prevChapter', 'Previous chapter')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="11,5 3,12 11,19" />
          <polygon points="19,5 11,12 19,19" />
        </svg>
      </button>

      {/* Prev Step */}
      <button
        className="dcb-btn"
        onClick={handlePrevStep}
        title={t('demo.prevStep', 'Previous step')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <rect x="4" y="5" width="3" height="14" />
          <polygon points="19,5 9,12 19,19" />
        </svg>
      </button>

      <div className="dcb-sep" />

      {/* Play / Pause */}
      <button
        className={`dcb-btn dcb-btn--play${isRunning ? ' dcb-btn--active' : ''}`}
        onClick={handlePlayPause}
        title={isPaused ? t('demo.resume', 'Resume') : t('demo.pause', 'Pause')}
      >
        {isPaused ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        )}
      </button>

      <div className="dcb-sep" />

      {/* Next Step */}
      <button
        className="dcb-btn"
        onClick={handleNextStep}
        title={t('demo.next', 'Next step')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="5,5 15,12 5,19" />
          <rect x="17" y="5" width="3" height="14" />
        </svg>
      </button>

      {/* Next Chapter */}
      <button
        className={`dcb-btn${!canNextChapter ? ' dcb-btn--disabled' : ''}`}
        onClick={handleNextChapter}
        disabled={!canNextChapter}
        title={t('demo.nextChapter', 'Next chapter')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="5,5 13,12 5,19" />
          <polygon points="13,5 21,12 13,19" />
        </svg>
      </button>

      <div className="dcb-sep" />

      {/* Mute toggle */}
      <button
        className={`dcb-btn${isMuted ? ' dcb-btn--muted' : ''}`}
        onClick={handleMuteToggle}
        title={isMuted ? t('demo.unmute', 'Unmute') : t('demo.mute', 'Mute')}
      >
        {isMuted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      <div className="dcb-sep" />

      {/* Phase label */}
      <div className="dcb-phase-label">
        <span className="dcb-phase-number">{currentPhase}/{totalPhases}</span>
        <span className="dcb-phase-title">{phaseTitle}</span>
      </div>

      <div className="dcb-sep" />

      {/* Quit */}
      {!confirmQuit ? (
        <button
          className="dcb-btn dcb-btn--quit"
          onClick={() => setConfirmQuit(true)}
          title={t('demo.quit', 'Quit demo')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (
        <div className="dcb-confirm">
          <span className="dcb-confirm-text">{t('demo.quitConfirm', 'Quitter ?')}</span>
          <button className="dcb-confirm-yes" onClick={handleQuit}>Oui</button>
          <button className="dcb-confirm-no" onClick={() => setConfirmQuit(false)}>Non</button>
        </div>
      )}
    </div>
  )
}
