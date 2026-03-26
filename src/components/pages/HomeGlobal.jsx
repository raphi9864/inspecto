import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Chart, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import gsap from 'gsap'
import { showToast } from '../Toast'

Chart.register(ArcElement, Tooltip)

const KPI_CARDS = [
  { label: 'Projects', sub: 'Ongoing / Archived', value: 7, color: 'var(--blue)', icon: 'folder',
    data: [4, 3], labels: ['Ongoing: 4 (57%)', 'Archived: 3 (43%)'], colors: ['var(--blue)', '#cbd5e1'] },
  { label: 'Inspections / Audits', sub: 'Opened / Pending / Overdue / Close', value: 388, color: '#dc2626', icon: 'clipboard',
    data: [0, 29, 350, 9], labels: ['Opened: 0 (0%)', 'Pending: 29 (7%)', 'Overdue: 350 (90%)', 'Close: 9 (2%)'], colors: ['#22c55e', '#f59e0b', '#dc2626', '#94a3b8'] },
  { label: 'Non-conformities / Findings', sub: 'Opened / Pending / Overdue / Close', value: 108, color: '#dc2626', icon: 'alert',
    data: [23, 81, 0, 4], labels: ['Opened: 23 (21%)', 'Pending: 81 (75%)', 'Overdue: 0 (0%)', 'Close: 4 (4%)'], colors: ['#dc2626', '#f59e0b', '#7c3aed', '#22c55e'] },
  { label: 'Actions', sub: 'Opened / Pending / Overdue / Close', value: 35, color: '#f59e0b', icon: 'calendar',
    data: [0, 19, 15, 1], labels: ['Opened: 0 (0%)', 'Pending: 19 (54%)', 'Overdue: 15 (43%)', 'Close: 1 (3%)'], colors: ['#22c55e', '#f59e0b', '#dc2626', '#94a3b8'] },
]

const PROJECTS = [
  { name: 'ALLIA - MAINTENANCE DES EQUIPEMENTS ATELIERS - 2025-09-03 09:01:20', company: 'INSPECTO', progress: 0, tasks: 4, findings: 1 },
  { name: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO', progress: 16, tasks: 15, findings: 0 },
  { name: 'Jupiter Bach', company: 'INSPECTO', progress: 0, tasks: 5, findings: 3 },
  { name: 'BRAKE manufacturing Alstom', company: 'INSPECTO', progress: 0, tasks: 8, findings: 2 },
  { name: 'Fabrication moteur HT', company: 'INSPECTO', progress: 42, tasks: 12, findings: 7 },
]

const TASKS = [
  { name: 'Toles', from: '05-09-2026', to: '02-10-2026', activity: 'ACHAT', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
  { name: 'Cahier de soudage', from: '06-09-2026', to: '30-10-2026', activity: 'INGENIERIE', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
  { name: 'Fonds bombes', from: '19-09-2026', to: '07-11-2026', activity: 'ACHAT', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
  { name: 'Plan d\'inspection et de controle', from: '02-10-2026', to: '17-11-2026', activity: 'INGENIERIE', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
]

const donutOpts = {
  cutout: '70%',
  plugins: { tooltip: { enabled: true }, legend: { display: false } },
  responsive: true,
  maintainAspectRatio: true,
}

export default function HomeGlobal() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.home-kpi-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' })
      gsap.fromTo('.home-section', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3 })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {KPI_CARDS.map((kpi, i) => (
          <div key={i} className="home-kpi-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border-primary)' }}
            onClick={() => navigate('/app')}>
            <div style={{ background: kpi.color, color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{kpi.label}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{kpi.sub}</div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{kpi.value}</div>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 100, height: 100, position: 'relative' }}>
                <Doughnut data={{ datasets: [{ data: kpi.data, backgroundColor: kpi.colors, borderWidth: 0 }] }} options={donutOpts} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{kpi.value}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 10, justifyContent: 'center' }}>
                {kpi.labels.map((l, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: kpi.colors[j], flexShrink: 0 }}></span>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects + Incoming Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Projects */}
        <div className="home-section" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 300, color: 'var(--text-primary)' }}>{t('common.projects')}</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => showToast('Expiring files', 'info')}>{t('common.expiring_files')}</button>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/app/projets')}>{t('common.seeAll')}</button>
              <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '6px 14px' }} onClick={() => showToast('New project', 'info')}>{t('common.newProject')}</button>
            </div>
          </div>
          {PROJECTS.map((p, i) => (
            <div key={i} style={{ padding: '14px 0', borderTop: i ? '1px solid #f0f0f0' : 'none', cursor: 'pointer' }} onClick={() => navigate('/app')}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{p.company}</div>
              <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: 4 }}>
                <div style={{ height: '100%', width: `${p.progress}%`, background: 'var(--blue)', borderRadius: 2 }}></div>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>{p.progress}%</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: '0.88rem', padding: '3px 8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: 4, color: 'var(--text-secondary)' }}>{t('common.remaining_tasks')} ({p.tasks})</span>
                <span style={{ fontSize: '0.88rem', padding: '3px 8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: 4, color: 'var(--text-secondary)' }}>{t('common.findings_nc')} ({p.findings})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incoming Tasks */}
        <div className="home-section" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 300, color: 'var(--text-primary)', marginBottom: 16 }}>{t('home.incomingTasks')}</h2>
          {TASKS.map((task, i) => (
            <div key={i} style={{ padding: 14, border: '1px solid var(--border-primary)', borderRadius: 8, marginBottom: 10, cursor: 'pointer' }} onClick={() => navigate('/app/taches')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{task.name}</strong>
                <span style={{ fontSize: '0.88rem', padding: '3px 10px', background: '#22c55e', color: '#fff', borderRadius: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  {t('common.ongoing')}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--blue)', marginBottom: 4 }}>From {task.from} to {task.to}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('home.activity')} : <strong>{task.activity}</strong></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('home.projectLabel')} : {task.project}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('home.company')} : {task.company}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
