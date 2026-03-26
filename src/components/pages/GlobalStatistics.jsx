import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import gsap from 'gsap'

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler)

const PROJECTS = ['All projects', "L'OREAL", 'ABB France', 'ALLIA', 'Fabrication moteur HT', 'Jupiter Bach', 'BRAKE manufacturing']

export default function GlobalStatistics() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [tab, setTab] = useState('general')
  const [project, setProject] = useState(PROJECTS[0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 })
    }, ref)
    return () => ctx.revert()
  }, [tab])

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: t('sidebar.inspections'), data: [12, 19, 8, 15, 22, 30, 25, 18, 27, 14, 20, 35], backgroundColor: 'var(--blue)' },
      { label: t('sidebar.findingsNC'), data: [3, 5, 2, 8, 6, 10, 7, 4, 9, 3, 6, 12], backgroundColor: '#dc2626' },
    ],
  }

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Actions completed', data: [2, 4, 3, 7, 5, 8, 12, 9, 14, 11, 15, 20], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.3 },
      { label: 'Actions overdue', data: [1, 2, 1, 3, 4, 2, 5, 3, 2, 4, 3, 1], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.3 },
    ],
  }

  const ncDonut = {
    labels: ['Minor', 'Major', 'Critical'],
    datasets: [{ data: [45, 38, 25], backgroundColor: ['#f59e0b', '#dc2626', '#7c3aed'], borderWidth: 0 }],
  }

  const ncBarData = {
    labels: ['Welding', 'Assembly', 'Machining', 'Electrical', 'Painting', 'Incoming'],
    datasets: [
      { label: t('statistics.statsLabels.openLabel'), data: [8, 5, 3, 4, 2, 1], backgroundColor: '#dc2626' },
      { label: t('statistics.legend.pending'), data: [12, 8, 6, 5, 4, 3], backgroundColor: '#f59e0b' },
      { label: t('statistics.legend.closed'), data: [3, 2, 1, 1, 0, 1], backgroundColor: '#22c55e' },
    ],
  }

  return (
    <div ref={ref}>
      {/* Tabs */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-primary)', padding: '16px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
          {['general', 'finding'].map(tabKey => (
            <button key={tabKey} onClick={() => setTab(tabKey)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, paddingBottom: 8,
              color: tab === tabKey ? 'var(--blue)' : 'var(--text-secondary)', borderBottom: tab === tabKey ? '2px solid #2563eb' : '2px solid transparent',
            }}>{tabKey === 'general' ? t('statistics.tabs.general') : t('statistics.tabs.findings')}</button>
          ))}
        </div>
        <div className="modal-field" style={{ maxWidth: 400 }}>
          <label style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t('statistics.filters.project')}</label>
          <select className="wizard-input" value={project} onChange={e => setProject(e.target.value)}>
            {PROJECTS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {tab === 'general' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="stat-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>{t('globalStats.inspectionsByMonth')}</h3>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
          </div>
          <div className="stat-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Actions trend</h3>
            <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
          </div>
          <div className="stat-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ label: t('globalStats.totalInspections'), val: 388, color: 'var(--blue)' }, { label: t('globalStats.totalNC'), val: 108, color: '#dc2626' }, { label: t('globalStats.totalActions'), val: 35, color: '#f59e0b' }, { label: t('globalStats.closureRate'), val: '78%', color: '#22c55e' }].map((s, i) => (
                <div key={i} style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="stat-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>{t('home.progress')}</h3>
            {['Fabrication moteur HT', 'ABB France - Piece N2', 'Jupiter Bach', 'BRAKE manufacturing'].map((p, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 4 }}>
                  <span>{p}</span><span style={{ fontWeight: 600 }}>{[42, 67, 15, 28][i]}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--border-primary)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${[42, 67, 15, 28][i]}%`, background: 'var(--blue)', borderRadius: 3 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="stat-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>{t('statistics.kpi.totalNC')}</h3>
            <div style={{ maxWidth: 250, margin: '0 auto' }}>
              <Doughnut data={ncDonut} options={{ cutout: '65%', plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
          <div className="stat-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>{t('advancedStats.ncByArea')}</h3>
            <Bar data={ncBarData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }} />
          </div>
        </div>
      )}
    </div>
  )
}
