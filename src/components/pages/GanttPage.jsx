import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { useProject } from '../../context/ProjectContext'
import { getProjectData } from '../../data/fakeDashboard'
import { showToast } from '../Toast'
import { exportPNG, exportXLSX } from '../../utils/exportUtils'

function getResourceView(t) {
  return [
    { id: 1, label: 'R. Attal', tasks: [{ start: 0, duration: 4, color: 'var(--blue)', name: t('data.gantt.designReview') }, { start: 6, duration: 3, color: '#805ad5', name: t('data.gantt.finalAudit') }] },
    { id: 2, label: 'S. Dupont', tasks: [{ start: 1, duration: 5, color: 'var(--status-success)', name: t('data.gantt.fabricationOversight') }] },
    { id: 3, label: 'J. Martin', tasks: [{ start: 3, duration: 4, color: 'var(--status-warning)', name: t('data.gantt.qualityControl') }, { start: 8, duration: 2, color: 'var(--status-overdue)', name: t('data.gantt.ncResolution') }] },
    { id: 4, label: 'A. Leroy', tasks: [{ start: 2, duration: 3, color: 'var(--status-error)', name: t('data.gantt.weldingInspection') }, { start: 7, duration: 3, color: '#00897b', name: t('data.gantt.testing') }] },
    { id: 5, label: 'T. Bernard', tasks: [{ start: 5, duration: 4, color: 'var(--text-primary)', name: t('data.gantt.assemblySupport') }] },
  ]
}

export default function GanttPage() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const { activeProject } = useProject()
  const [viewMode, setViewMode] = useState('activities')
  const [zoom, setZoom] = useState(1)
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskProgress, setTaskProgress] = useState(null)

  const data = activeProject ? getProjectData(activeProject.id, t) : getProjectData(1, t)
  const { gantt, months } = data

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gantt-row', { opacity: 0, x: -10 }, {
        opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.2,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [viewMode, activeProject])

  const totalMonths = months.length
  const rows = viewMode === 'activities' ? gantt : getResourceView(t)

  return (
    <div ref={containerRef}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Zoom */}
          <button className="btn-outline" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button className="btn-outline" onClick={() => setZoom(z => Math.min(2, z + 0.25))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }}></div>
          {/* Toggle */}
          <button className={`btn-outline${viewMode === 'activities' ? ' active-toggle' : ''}`} onClick={() => setViewMode('activities')}>{t('gantt.activities')}</button>
          <button className={`btn-outline${viewMode === 'resources' ? ' active-toggle' : ''}`} onClick={() => setViewMode('resources')}>{t('gantt.resources')}</button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-outline" title="Export PNG" onClick={() => { exportPNG(containerRef, `inspecto-gantt-${new Date().toISOString().slice(0, 10)}.png`); showToast('PNG exported', 'success') }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            {t('gantt.png')}
          </button>
          <button className="btn-outline" title="Export Excel" onClick={() => { const exportData = rows.map(r => ({ label: r.label, start: r.start, duration: r.duration, progress: r.progress != null ? r.progress : '' })); exportXLSX(exportData, `inspecto-gantt-${new Date().toISOString().slice(0, 10)}.xlsx`); showToast('Excel exported', 'success') }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
            {t('gantt.excel')}
          </button>
        </div>
      </div>

      {/* Gantt chart */}
      <div className="gantt-section" style={{ overflow: 'auto' }}>
        <div style={{ minWidth: `${Math.round(600 * zoom)}px` }}>
          {/* Month headers */}
          <div className="gantt-months">
            <div className="gantt-label-col"></div>
            <div className="gantt-chart-area">
              {months.map((m, i) => (
                <div key={i} className="gantt-month-cell">{m}</div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="gantt-body">
            {viewMode === 'activities' ? (
              rows.map(task => {
                const left = (task.start / totalMonths) * 100
                const width = (task.duration / totalMonths) * 100
                return (
                  <div className="gantt-row" key={task.id}>
                    <div className="gantt-label-col">{task.label}</div>
                    <div className="gantt-chart-area">
                      <div className="gantt-bar-track" style={{ left: `${left}%`, width: `${width}%`, cursor: 'pointer' }}
                        onClick={() => { setSelectedTask(task); setTaskProgress(task.progress) }}>
                        <div className="gantt-bar-bg"></div>
                        <div className="gantt-bar-fill" style={{ width: `${task.progress}%`, background: task.color }}></div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              rows.map(res => (
                <div className="gantt-row" key={res.id}>
                  <div className="gantt-label-col">{res.label}</div>
                  <div className="gantt-chart-area">
                    {res.tasks.map((resTask, i) => {
                      const left = (resTask.start / totalMonths) * 100
                      const width = (resTask.duration / totalMonths) * 100
                      return (
                        <div key={i} className="gantt-bar-track" style={{ left: `${left}%`, width: `${width}%` }} title={resTask.name}>
                          <div className="gantt-bar-fill" style={{ width: '100%', background: resTask.color, borderRadius: '9px' }}></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{selectedTask.label || selectedTask.name}</h3>
            <div className="modal-field">
              <label>{t('tasks.progressLabel')}: {taskProgress}%</label>
              <input type="range" min="0" max="100" value={taskProgress} onChange={e => setTaskProgress(Number(e.target.value))}
                style={{ width: '100%', accentColor: selectedTask.color }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              <div>{t('home.startDate')}: month {selectedTask.start + 1}</div>
              <div>Duration: {selectedTask.duration} months</div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setSelectedTask(null)}>{t('common.close')}</button>
              <button className="btn-primary" onClick={() => { showToast(`Progress updated to ${taskProgress}%`); setSelectedTask(null) }}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
