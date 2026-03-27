import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../../context/DemoContext'

export default function DemoProgressBar() {
  const { t } = useTranslation()
  const { status, currentPhase, totalPhases, phaseTitle } = useDemoContext()
  const [wizardOpen, setWizardOpen] = useState(false)

  useEffect(() => {
    if (status !== 'running') return
    const check = () => setWizardOpen(!!document.querySelector('.wizard-stepper'))
    check()
    const interval = setInterval(check, 500)
    return () => clearInterval(interval)
  }, [status, currentPhase])

  if (status !== 'running') return null

  const progress = ((currentPhase) / totalPhases) * 100

  return (
    <div className="demo-progress">
      <div className="demo-progress-bar" style={{ width: `${progress}%` }} />
      {phaseTitle && (
        <div className={`demo-progress-label${wizardOpen ? ' demo-progress-label--wizard' : ''}`}>
          <span className="demo-progress-phase">{t('demo.phase')} {currentPhase}/{totalPhases}</span>
          <span className="demo-progress-title">{phaseTitle}</span>
        </div>
      )}
    </div>
  )
}
