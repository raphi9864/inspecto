import { useTranslation } from 'react-i18next'
import { useDemoContext } from '../../context/DemoContext'

export default function DemoOverlay() {
  const { t } = useTranslation()
  const { status, skipDemo } = useDemoContext()

  if (status !== 'running') return null

  return (
    <div className="demo-overlay" onClick={e => e.stopPropagation()}>
      <button className="demo-skip-btn" onClick={skipDemo} aria-label={t('demo.skip')}>
        {t('demo.skip')}
      </button>
    </div>
  )
}
