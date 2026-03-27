import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../../context/DemoContext'

export default function DemoOverlay() {
  const { t } = useTranslation()
  const { status, skipDemo, pauseDemo, resumeDemo, nextStep, jumpToModule, currentPhase, phases, muteVoice, toggleMuteVoice } = useDemoContext()
  const [confirmQuit, setConfirmQuit] = useState(false)

  if (status !== 'running' && status !== 'paused') return null

  const isPaused = status === 'paused'

  return (
    <div className="demo-overlay" onClick={e => e.stopPropagation()}>
      {/* Control bar — bottom center */}
      <div className="demo-controls">
        {/* Phase pills */}
        <div className="demo-phase-pills">
          {phases.map(p => (
            <button
              key={p.phase}
              className={`demo-phase-pill${currentPhase === p.phase ? ' demo-phase-pill--active' : ''}`}
              onClick={() => jumpToModule(p.phase)}
            >
              {p.phaseTitle}
            </button>
          ))}
        </div>

        <div className="demo-ctrl-row">
          {/* Voice mute toggle */}
          <button
            className="demo-ctrl-btn"
            onClick={toggleMuteVoice}
            title={muteVoice ? t('demo.unmute') : t('demo.mute')}
          >
            {muteVoice ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            )}
          </button>

          {/* Pause / Resume */}
          <button
            className="demo-ctrl-btn"
            onClick={isPaused ? resumeDemo : pauseDemo}
            title={isPaused ? t('demo.resume') : t('demo.pause')}
          >
            {isPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            )}
            <span>{isPaused ? t('demo.resume') : t('demo.pause')}</span>
          </button>

          {/* Next step */}
          <button className="demo-ctrl-btn" onClick={nextStep} title={t('demo.next')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 15 12 5 21 5 3"/><rect x="17" y="4" width="3" height="16"/></svg>
            <span>{t('demo.next')}</span>
          </button>

          <div className="demo-ctrl-sep" />

          {/* Quit */}
          {!confirmQuit ? (
            <button className="demo-ctrl-btn demo-ctrl-quit" onClick={() => setConfirmQuit(true)} title={t('demo.quit')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>{t('demo.quit')}</span>
            </button>
          ) : (
            <div className="demo-ctrl-confirm">
              <span>{t('demo.quitConfirm')}</span>
              <button className="demo-ctrl-btn demo-ctrl-yes" onClick={() => { setConfirmQuit(false); skipDemo() }}>{t('demo.yes')}</button>
              <button className="demo-ctrl-btn" onClick={() => setConfirmQuit(false)}>{t('demo.no')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
