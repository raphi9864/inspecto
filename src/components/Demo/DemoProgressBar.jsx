import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../../context/DemoContext'

export default function DemoProgressBar() {
  const { t } = useTranslation()
  const { status, currentPhase, totalPhases, phaseTitle } = useDemoContext()

  if (status !== 'running') return null

  const progress = ((currentPhase) / totalPhases) * 100

  return (
    <div className="demo-progress">
      <div className="demo-progress-bar" style={{ width: `${progress}%` }} />
      {phaseTitle && (
        <div className="demo-progress-label">
          <span className="demo-progress-phase">{t('demo.phase')} {currentPhase}/{totalPhases}</span>
          <span className="demo-progress-title">{phaseTitle}</span>
        </div>
      )}
    </div>
  )
}
