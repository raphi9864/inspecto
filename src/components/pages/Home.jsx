import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { useProject } from '../../context/ProjectContext'
import { getProjectData } from '../../data/fakeDashboard'
import { getOverviewKPI, getOverviewProjects, getIncomingTasks } from '../../data/fakeOverview'

export default function Home() {
  const { activeProject } = useProject()
  const containerRef = useRef(null)

  if (!activeProject) return <AllProjectsView containerRef={containerRef} />
  return <ProjectDashboardView containerRef={containerRef} project={activeProject} />
}

/* ═══════════════════════════════════════════════════════════════
   MODE 1: All Projects Overview (no project selected)
   ═══════════════════════════════════════════════════════════════ */
function AllProjectsView({ containerRef }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setActiveProject, projects } = useProject()

  useEffect(() => {
    let charts = []
    const ctx = gsap.context(() => {
      gsap.to('.home-kpi-card', {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3,
      })
      gsap.to('.panel', {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5,
      })
      // Count-up KPIs
      const overviewKPI = getOverviewKPI(t)
      const kpiValues = overviewKPI.map(k => k.total)
      document.querySelectorAll('.home-kpi-hdr-count').forEach((el, i) => {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: kpiValues[i], duration: 1.2, delay: 0.5, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val) },
        })
      })
      gsap.fromTo('.proj-row', { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.7,
      })
      gsap.fromTo('.task-item', { opacity: 0, y: 10 }, {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.8,
      })
    }, containerRef)

    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      const cs = getComputedStyle(document.documentElement)
      const textColor = cs.getPropertyValue('--text-tertiary').trim() || '#94a3b8'
      const bgBorder = cs.getPropertyValue('--bg-secondary').trim() || '#111827'
      const tooltipBg = cs.getPropertyValue('--bg-tertiary').trim() || 'rgba(17,24,39,0.95)'
      const tooltipBorder = cs.getPropertyValue('--border-primary').trim() || 'rgba(255,255,255,0.08)'
      const tooltipText = cs.getPropertyValue('--text-primary').trim() || '#f0f4f8'
      Chart.defaults.color = textColor
      const tooltipStyle = { backgroundColor: tooltipBg, borderColor: tooltipBorder, borderWidth: 1, titleColor: tooltipText, bodyColor: tooltipText, titleFont: { family: 'Montserrat' }, bodyFont: { family: 'Montserrat' } }
      const donutOpts = (labels, data, colors) => ({
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: bgBorder, borderWidth: 2, hoverOffset: 6 }] },
        options: {
          cutout: '72%',
          animation: { animateRotate: true, duration: 800, easing: 'easeInOutQuart' },
          plugins: { legend: { display: false }, tooltip: { ...tooltipStyle, callbacks: { label: (c) => ` ${c.label}: ${c.raw}` } } }
        }
      })
      overviewKPI.forEach(kpi => {
        const el = document.getElementById(`donut-overview-${kpi.key}`)
        if (el) charts.push(new Chart(el, donutOpts(kpi.donut.labels, kpi.donut.data, kpi.donut.colors)))
      })
    }).catch(() => {})

    return () => { ctx.revert(); charts.forEach(c => c.destroy()) }
  }, [t])

  const kpiData = getOverviewKPI(t)
  const overviewProjects = getOverviewProjects()
  const incomingTasks = getIncomingTasks(t)

  return (
    <div ref={containerRef} data-demo-target="home-page">
      {/* KPI Grid */}
      <div className="home-kpi-grid home-kpi-row" id="kpi-bar">
        {kpiData.map(kpi => (
          <div className="home-kpi-card" key={kpi.key} onClick={() => {
            const routes = { projects: '/app/projets', inspections: '/app/inspections', nc: '/app/findings', actions: '/app/actions' }
            navigate(routes[kpi.key] || '/app')
          }} style={{ cursor: 'pointer' }}>
            <div className={`home-kpi-hdr ${kpi.gradient}`}>
              <div className="home-kpi-hdr-text">
                <div className="home-kpi-hdr-title">{kpi.title}</div>
                <div className="home-kpi-hdr-sub">{kpi.sub}</div>
              </div>
              <div className="home-kpi-hdr-count">{kpi.total}</div>
            </div>
            <div className="home-kpi-body">
              <div className="home-kpi-donut-wrap">
                <canvas id={`donut-overview-${kpi.key}`} width="120" height="120"></canvas>
              </div>
              <div className="home-kpi-legend">
                {kpi.legend.map((l) => (
                  <div className="hleg-row" key={l.label}>
                    <span className="hleg-dot" style={{ background: l.dot }}></span>
                    {l.label}: <strong>{l.val}</strong> ({l.pct})
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard layout */}
      <div className="dashboard-layout">
        {/* Projects */}
        <div className="panel" id="panel-projects">
          <div className="panel-header">
            <div className="panel-title">{t('home.projects')}</div>
            <div className="panel-actions">
              <button className="panel-btn ghost" onClick={() => navigate('/app/expiring')}>{t('common.expiring_files').toUpperCase()}</button>
              <button className="panel-btn ghost" onClick={() => navigate('/app/projets')}>{t('common.seeAll')}</button>
              <button className="panel-btn primary">{t('common.newProject')}</button>
            </div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {overviewProjects.map((p, i) => (
              <div key={p.id} className="proj-row" style={{ padding: '0.875rem 1.25rem', borderBottom: i < overviewProjects.length - 1 ? '1px solid var(--gray-border)' : 'none', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--surface-light)', marginBottom: '0.15rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>{p.company}</div>
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginBottom: '0.4rem' }}>
                  <div style={{ width: `${p.progress}%`, height: '100%', background: 'var(--blue)', borderRadius: 2 }}></div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '0.4rem' }}>{p.progress}%</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="overview-tag">{t('common.remaining_tasks')} ({p.remainingTasks})</span>
                  <span className="overview-tag alert">{t('common.findings_nc')} ({p.findings})</span>
                  <button
                    className="btn-primary"
                    style={{ marginLeft: 'auto', fontSize: '0.85rem', padding: '4px 12px' }}
                    onClick={(e) => { e.stopPropagation(); const proj = projects.find(pp => pp.id === p.id); if (proj) { setActiveProject(proj); navigate('/app') } }}
                  >
                    {t('common.explore')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming tasks */}
        <div className="panel" id="panel-tasks">
          <div className="panel-header">
            <div className="panel-title">{t('home.incomingTasks')}</div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {incomingTasks.map((task, i) => (
              <div key={task.id} className="task-item" style={{ padding: '0.875rem 1.25rem', borderBottom: i < incomingTasks.length - 1 ? '1px solid var(--gray-border)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--surface-light)' }}>{task.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="task-status-badge">{t('common.ongoing')}</span>
                    <button className="btn-icon" title="See more" style={{ padding: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray)', lineHeight: 1.6 }}>
                  {task.dates}<br />
                  {t('home.activity')} : <strong>{task.activity}</strong><br />
                  {t('home.projectLabel')} : {task.project}<br />
                  {t('home.company')} : {task.company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MODE 2: Project Dashboard (project selected)
   ═══════════════════════════════════════════════════════════════ */
function ProjectDashboardView({ containerRef, project }) {
  const { t } = useTranslation()
  const data = getProjectData(project.id, t)
  const { kpi, detail, gantt, months } = data

  useEffect(() => {
    let charts = []
    const ctx = gsap.context(() => {
      gsap.fromTo('.kpi-card', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2,
      })
      gsap.fromTo('.project-banner', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.4,
      })
      gsap.fromTo('.activity-card', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.5,
      })
      gsap.fromTo('.gantt-section', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.6,
      })
    }, containerRef)

    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      const cs2 = getComputedStyle(document.documentElement)
      const textColor2 = cs2.getPropertyValue('--text-tertiary').trim() || '#94a3b8'
      const bgBorder2 = cs2.getPropertyValue('--bg-secondary').trim() || '#111827'
      const tooltipBg2 = cs2.getPropertyValue('--bg-tertiary').trim() || 'rgba(17,24,39,0.95)'
      const tooltipBorder2 = cs2.getPropertyValue('--border-primary').trim() || 'rgba(255,255,255,0.08)'
      const tooltipText2 = cs2.getPropertyValue('--text-primary').trim() || '#f0f4f8'
      Chart.defaults.color = textColor2
      const tooltipStyle2 = { backgroundColor: tooltipBg2, borderColor: tooltipBorder2, borderWidth: 1, titleColor: tooltipText2, bodyColor: tooltipText2, titleFont: { family: 'Montserrat' }, bodyFont: { family: 'Montserrat' } }
      const donutOpts = (labels, data, colors) => ({
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: bgBorder2, borderWidth: 2, hoverOffset: 6 }] },
        options: {
          cutout: '72%',
          animation: { animateRotate: true, duration: 800, easing: 'easeInOutQuart' },
          plugins: { legend: { display: false }, tooltip: { ...tooltipStyle2, callbacks: { label: (c) => ` ${c.label}: ${c.raw}` } } }
        }
      })
      const makeDonut = (id, kpiData) => {
        const el = document.getElementById(id)
        if (el) {
          charts.push(new Chart(el, donutOpts(
            kpiData.breakdown.map(b => b.label),
            kpiData.breakdown.map(b => b.count),
            kpiData.breakdown.map(b => b.color)
          )))
        }
      }
      makeDonut('donut-pd-actions', kpi.actions)
      makeDonut('donut-pd-inspections', kpi.inspections)
      makeDonut('donut-pd-findings', kpi.findings)
    }).catch(() => {})

    return () => { ctx.revert(); charts.forEach(c => c.destroy()) }
  }, [project, t])

  return (
    <div className="home-page" ref={containerRef}>
      {/* Row 1: 4 KPI cards */}
      <div className="kpi-row">
        <KpiProgress value={kpi.progress} detail={detail} />
        <KpiDonut data={kpi.actions} label="Actions" canvasId="donut-pd-actions" />
        <KpiDonut data={kpi.inspections} label="Inspections" canvasId="donut-pd-inspections" />
        <KpiDonut data={kpi.findings} label="Findings / NC" canvasId="donut-pd-findings" />
      </div>

      {/* Row 2: Project banner */}
      <div className="project-banner">
        <div className="project-banner-info">
          <button className="project-banner-edit" aria-label="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <h2>{detail.name}</h2>
          <div className="dates">{t('home.startDate')} : &nbsp;<strong>{detail.startDate}</strong></div>
          <div className="dates">{t('home.endDate')} : &nbsp;<strong>{detail.endDate}</strong></div>
        </div>
        <div className="project-banner-image-container">
          <img src={detail.image} alt={detail.name} className="project-banner-img" />
        </div>
      </div>

      {/* Row 3: Activity detail */}
      <div className="activity-card">
        <div className="activity-card-dates">{detail.currentActivity.date}</div>
        <h3 className="activity-card-title">{detail.currentActivity.label}</h3>
        <div className="activity-card-type">Inspection</div>
        <div className="activity-card-status">
          Status: <span className={`status-${detail.currentActivity.status.toLowerCase()}`}>{detail.currentActivity.status}</span>
        </div>
        <button className="activity-card-nav" aria-label="Next activity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Row 4: Gantt timeline */}
      <ActivityTimeline gantt={gantt} months={months} />
    </div>
  )
}

/* ─── Sub-components ─── */

function KpiProgress({ value, detail }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="kpi-card kpi-progress-card">
      <div className="kpi-card-title">{t('home.progress')}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>{value} <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-tertiary)' }}>%</span></div>
          <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{t('home.startDate')}: {detail.startDate}<br/>{t('home.endDate')}: {detail.endDate}</div>
        </div>
        <div className="kpi-progress-ring-wrap">
          <svg width="80" height="80" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--blue)" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
          <div className="kpi-progress-value" style={{ fontSize: '14px' }}>{value}%</div>
        </div>
      </div>
    </div>
  )
}

function KpiDonut({ data, label, canvasId }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <div className="kpi-card-title">{label}</div>
        <div className="kpi-card-total">{data.total} <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-tertiary)' }}>Total</span></div>
      </div>
      <div className="kpi-donut-body">
        <div className="kpi-donut-canvas-wrap">
          <canvas id={canvasId} width="100" height="100"></canvas>
        </div>
        <div className="kpi-donut-legend">
          {data.breakdown.map(b => (
            <div className="kpi-legend-row" key={b.label}>
              <span className="kpi-legend-dot" style={{ background: b.color }}></span>
              <span className="kpi-legend-label">{b.label}: {b.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActivityTimeline({ gantt, months }) {
  const { t } = useTranslation()
  const totalMonths = months.length
  return (
    <div className="gantt-section">
      <div className="gantt-header">
        <h3>{t('home.activityTimeline')}</h3>
      </div>
      <div className="gantt-months">
        <div className="gantt-label-col"></div>
        <div className="gantt-chart-area">
          {months.map((m, i) => (
            <div key={i} className="gantt-month-cell">{m}</div>
          ))}
        </div>
      </div>
      <div className="gantt-body">
        {gantt.map(task => {
          const left = (task.start / totalMonths) * 100
          const width = (task.duration / totalMonths) * 100
          return (
            <div className="gantt-row" key={task.id}>
              <div className="gantt-label-col">{task.label}</div>
              <div className="gantt-chart-area">
                <div className="gantt-bar-track" style={{ left: `${left}%`, width: `${width}%` }}>
                  <div className="gantt-bar-bg"></div>
                  <div className="gantt-bar-fill" style={{ width: `${task.progress}%`, background: task.color }}></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
