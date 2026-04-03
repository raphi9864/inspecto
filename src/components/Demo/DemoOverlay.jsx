import { useDemoContext } from '../../context/DemoContext'
import DemoControlBar from './DemoControlBar'

export default function DemoOverlay() {
  const { status } = useDemoContext()

  if (status !== 'running' && status !== 'paused') return null

  return (
    <div className="demo-overlay" onClick={e => e.stopPropagation()}>
      <DemoControlBar />
    </div>
  )
}
