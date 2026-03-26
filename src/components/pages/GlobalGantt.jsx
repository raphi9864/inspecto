import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const MONTHS = ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP']

const RESOURCES = [
  { name: 'R. Attal', bars: [{ start: 0, end: 5.5, color: 'var(--blue)' }, { start: 7, end: 10, color: '#7c3aed' }] },
  { name: 'S. Dupont', bars: [{ start: 0.5, end: 7, color: '#22c55e' }] },
  { name: 'J. Martin', bars: [{ start: 1, end: 7.5, color: '#f59e0b' }, { start: 9, end: 11.5, color: '#dc2626' }] },
  { name: 'A. Leroy', bars: [{ start: 0.5, end: 4.5, color: '#dc2626' }, { start: 8, end: 11, color: 'var(--blue)' }] },
  { name: 'T. Bernard', bars: [{ start: 4, end: 9, color: '#1a1a2e' }] },
]

const ACTIVITIES = [
  { name: 'Design', bars: [{ start: 0, end: 1.5, color: 'var(--blue)' }] },
  { name: 'Procurement', bars: [{ start: 1.5, end: 4, color: '#f59e0b' }] },
  { name: 'Production', bars: [{ start: 0, end: 7, color: '#22c55e' }] },
  { name: 'Pre Production', bars: [{ start: 0, end: 1.2, color: '#7c3aed' }] },
  { name: 'Testing', bars: [{ start: 7, end: 10, color: '#dc2626' }] },
  { name: 'Final Inspection', bars: [{ start: 10, end: 12, color: '#1a1a2e' }] },
]

export default function GlobalGantt() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [view, setView] = useState('resources')
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gantt-row', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 })
    }, ref)
    return () => ctx.revert()
  }, [view])

  const data = view === 'resources' ? RESOURCES : ACTIVITIES
  const colWidth = zoom * 0.8

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Zoom */}
          <button className="btn-icon" onClick={() => setZoom(z => Math.max(60, z - 20))} title="Zoom out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', minWidth: 40, textAlign: 'center' }}>{zoom}%</span>
          <button className="btn-icon" onClick={() => setZoom(z => Math.min(160, z + 20))} title="Zoom in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>

          {/* Toggle */}
          <div style={{ display: 'flex', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
            <button onClick={() => setView('activities')} style={{
              padding: '6px 16px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              background: view === 'activities' ? '#fff' : '#22c55e', color: view === 'activities' ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}>{t('gantt.activities')}</button>
            <button onClick={() => setView('resources')} style={{
              padding: '6px 16px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              background: view === 'resources' ? '#22c55e' : '#fff', color: view === 'resources' ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}>{t('gantt.resources')}</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline" onClick={() => showToast(t('toasts.pngExported'), 'success')} style={{ fontSize: '0.9rem' }}>{t('gantt.png')}</button>
          <button className="btn-outline" onClick={() => showToast(t('toasts.excelExported'), 'success')} style={{ fontSize: '0.9rem' }}>{t('gantt.excel')}</button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: MONTHS.length * colWidth + 140 }}>
            {/* Month headers */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)' }}>
              <div style={{ width: 140, flexShrink: 0, padding: '10px 16px' }}></div>
              {MONTHS.map((m, i) => (
                <div key={i} style={{ width: colWidth, flexShrink: 0, textAlign: 'center', padding: '10px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{m}</div>
              ))}
            </div>

            {/* Rows */}
            {data.map((row, ri) => (
              <div key={ri} className="gantt-row" style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', alignItems: 'center', minHeight: 40 }}>
                <div style={{ width: 140, flexShrink: 0, padding: '8px 16px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{row.name}</div>
                <div style={{ flex: 1, position: 'relative', height: 24 }}>
                  {row.bars.map((bar, bi) => (
                    <div key={bi} style={{
                      position: 'absolute',
                      left: bar.start * colWidth,
                      width: (bar.end - bar.start) * colWidth,
                      height: 14,
                      top: 5,
                      background: bar.color,
                      borderRadius: 7,
                      cursor: 'pointer',
                    }}
                      title={`${row.name}: ${MONTHS[Math.floor(bar.start)]} - ${MONTHS[Math.floor(bar.end)]}`}
                      onClick={() => showToast(`${row.name} — ${MONTHS[Math.floor(bar.start)]} to ${MONTHS[Math.min(12, Math.floor(bar.end))]}`, 'info')}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
