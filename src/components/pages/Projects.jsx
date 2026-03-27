import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'
const projects = [
  { name: 'Fabrication moteur HT',       dates: 'From 08-09-2024 to 08-09-2025', department: 'Production',   status: 'active' },
  { name: 'Jupiter Bach',                dates: 'From 10-11-2025 to 10-11-2026', department: 'Maintenance',  status: 'active' },
  { name: 'Pilatus PC21 — Projet Raphy', dates: 'From 01-03-2026 to 01-03-2027', department: 'Production',   status: 'archived' },
  { name: 'Transformateur de vapeur',    dates: 'From 01-07-2026 to 01-07-2027', department: 'HSE',          status: 'active' },
]

export default function Projects() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [dashboardIdx, setDashboardIdx] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [filterDept, setFilterDept] = useState('')
  const [filterStatus, setFilterStatus] = useState('not_archived')
  const navigate = useNavigate()

  useEffect(() => {
    const projParam = searchParams.get('proj')
    if (projParam !== null) {
      setDashboardIdx(parseInt(projParam))
    }
  }, [searchParams])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.kpi-card, .home-kpi-card', { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 })
      gsap.to('.panel', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5 })

      // Animate Gantt bars
      const ganttBars = containerRef.current?.querySelectorAll('.mini-gantt-bar')
      if (ganttBars) {
        ganttBars.forEach((bar) => {
          const targetW = bar.style.width
          bar.style.width = '0%'
          gsap.to(bar, { width: targetW, duration: 0.8, delay: 0.6, ease: 'power2.out' })
        })
      }

      // Animate SVG donut arcs
      document.querySelectorAll('.proj-kpi-donut circle:nth-child(2)').forEach((circle) => {
        const targetDash = circle.getAttribute('stroke-dasharray')
        circle.setAttribute('stroke-dasharray', '0 188')
        gsap.to(circle, {
          attr: { 'stroke-dasharray': targetDash },
          duration: 1, delay: 0.5, ease: 'power2.out',
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [dashboardIdx, activeSection])

  function openProject(idx) {
    setDashboardIdx(idx)
    setActiveSection('dashboard')
    setSearchParams({ proj: String(idx) })
  }

  function backToList() {
    setDashboardIdx(null)
    setSearchParams({})
  }

  if (dashboardIdx !== null) {
    const name = projects[dashboardIdx]?.name || 'Projet'
    return (
      <div ref={containerRef}>
        <div>
          <button className="btn-outline" onClick={backToList} style={{ marginBottom: 16 }}>{t('common.back')}</button>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px' }}>{name}</h2>
          <div>
            {activeSection === 'dashboard' && (
              <>
                <div className="proj-kpi-row" id="proj-kpi-row">
                  {[
                    { label: t('projects.progress'), pct: '42%', stroke: 'var(--blue)', dash: '79 110', stats: [{ dot: 'blue', l: t('statistics.legend.ongoing'), v: '3' }, { dot: 'gray', l: t('statistics.statsLabels.closedLabel'), v: '1' }] },
                    { label: t('projects.actions'), pct: '11', stroke: 'var(--status-error)', dash: '125 63', stats: [{ dot: 'teal', l: t('statistics.legend.ongoing'), v: '1' }, { dot: 'red', l: t('statistics.statsLabels.overdue'), v: '9' }, { dot: 'gray', l: t('statistics.legend.closed'), v: '1' }] },
                    { label: t('projects.inspections'), pct: '141', stroke: 'var(--status-error)', dash: '151 37', stats: [{ dot: 'yellow', l: t('statistics.legend.pending'), v: '18' }, { dot: 'red', l: t('statistics.statsLabels.overdue'), v: '108' }, { dot: 'gray', l: t('statistics.legend.closed'), v: '14' }] },
                    { label: t('projects.findingsNC'), pct: '42', stroke: 'var(--status-warning)', dash: '140 48', stats: [{ dot: 'orange', l: t('statistics.legend.ongoing'), v: '28' }, { dot: 'yellow', l: t('statistics.legend.pending'), v: '10' }, { dot: 'gray', l: t('statistics.legend.closed'), v: '4' }] },
                  ].map((kpi) => (
                    <div className="proj-kpi-card" key={kpi.label} onClick={() => { if (kpi.label !== t('projects.progress')) navigate('/app/inspections') }} style={{ cursor: kpi.label !== t('projects.progress') ? 'pointer' : undefined }}>
                      <div className="proj-kpi-label">{kpi.label}</div>
                      <div className="proj-kpi-donut">
                        <svg viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                          <circle cx="40" cy="40" r="30" fill="none" stroke={kpi.stroke} strokeWidth="8" strokeDasharray={kpi.dash} strokeLinecap="round" transform="rotate(-90 40 40)"/>
                          <text x="40" y="44" textAnchor="middle" fontSize={kpi.pct.length > 3 ? 13 : 14} fontWeight="700" fill="var(--text-primary)">{kpi.pct}</text>
                        </svg>
                      </div>
                      <div className="proj-kpi-stats">
                        {kpi.stats.map((s) => (
                          <div className="proj-kpi-stat" key={s.l}><span className={`kpi-dot ${s.dot}`}></span>{s.l} <strong>{s.v}</strong></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="proj-dashboard-body">
                  <div className="panel" style={{ flex: 1 }}>
                    <div className="panel-header">
                      <div className="panel-title">{name}</div>
                    </div>
                    <div className="panel-body">
                      <div className="proj-dash-info">
                        <div className="proj-dash-info-row"><span className="proj-dash-label">{t('home.startDate')}&nbsp;:&nbsp;</span><span>08-09-2024</span></div>
                        <div className="proj-dash-info-row"><span className="proj-dash-label">{t('home.endDate')}&nbsp;:&nbsp;</span><span>08-09-2025</span></div>
                      </div>
                      <div className="mini-gantt">
                        {[
                          { label: 'INSPECTION-1', w: '65%', bg: 'var(--blue)', status: 'ok', statusText: 'Ouvertes' },
                          { label: 'INSPECTION-2', w: '40%', bg: 'var(--status-warning)', status: 'pending', statusText: 'En cours' },
                          { label: 'INSPECTION-3', w: '20%', bg: 'var(--status-error)', status: 'alert', statusText: 'En retard' },
                        ].map((g) => (
                          <div key={g.label} style={{ display: 'contents' }}>
                            <div className="mini-gantt-label">{g.label}</div>
                            <div className="mini-gantt-bar-wrap"><div className="mini-gantt-bar" style={{ width: g.w, background: g.bg }}></div></div>
                            <div className="mini-gantt-status"><span className={`status ${g.status}`}>{g.statusText}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'activities' && (
              <div className="section-content">
                <div className="panel" style={{ opacity: 1, transform: 'none' }}>
                  <div className="panel-header"><div className="panel-title">{t('sidebar.activities')}</div></div>
                  <div className="panel-body" style={{ padding: 0 }}>
                    <div className="trace-timeline">
                      {[
                        { dot: 'blue', action: 'Inspection INS-2026-003 updated — status changed to En retard', user: 'S. Dupont', time: '14:32', date: "Aujourd'hui" },
                        { dot: 'red', action: 'NC #NC-2026-0041 created — Vibration anomaly on turbine T-07', user: 'A. Leroy', time: '11:20', date: "Aujourd'hui" },
                        { dot: 'green', action: 'Document Plan_qualite_v3.pdf uploaded to library', user: 'J. Martin', time: '09:45', date: "Aujourd'hui" },
                        { dot: 'blue', action: 'Inspection INS-2026-001 assigned to S. Dupont', user: 'R. Attal', time: '16:00', date: 'Hier' },
                        { dot: 'purple', action: 'Project milestone "Phase 2 — Assembly" marked as complete', user: 'R. Attal', time: '14:15', date: 'Hier' },
                        { dot: 'green', action: 'CAPA action #CA-042 validated and closed', user: 'S. Dupont', time: '10:30', date: '16 mars 2026' },
                      ].map((item, i) => (
                        <div className="trace-item" key={i}>
                          <div className={`trace-dot trace-dot-${item.dot}`}></div>
                          <div className="trace-content">
                            <div className="trace-action">{item.action}</div>
                            <div className="trace-meta">
                              <span className="trace-time">{item.date} · {item.time}</span>
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{item.user}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'tasks' && (
              <div className="section-content">
                <div className="panel" style={{ opacity: 1, transform: 'none' }}>
                  <div className="panel-header">
                    <div className="panel-title">{t('sidebar.tasksResources')}</div>
                    <div className="panel-actions"><button className="panel-btn primary">{t('tasks.newTask')}</button></div>
                  </div>
                  <div className="panel-body" style={{ padding: 0 }}>
                    <table className="data-table">
                      <thead><tr><th>{t('common.name')}</th><th>{t('tasks.assignee')}</th><th>{t('tasks.priority.critical').replace(/.*/, t('statistics.kpi.totalNC').split(' ')[0] === 'Total' ? 'Priority' : 'Priority')}</th><th>{t('common.status')}</th><th>{t('activities.tableHeaders.endDate')}</th></tr></thead>
                      <tbody>
                        {[
                          { title: 'Serrage des vis des deux flasques', assignee: 'S. Dupont', priority: 'progress', priorityText: 'Normal', status: 'progress', statusText: 'En cours', deadline: '01-04-2026' },
                          { title: 'Calibration poste soudage S3', assignee: 'A. Leroy', priority: 'alert', priorityText: 'Urgent', status: 'pending', statusText: 'En attente', deadline: '19-03-2026' },
                          { title: 'Mise à jour check-list pré-démarrage', assignee: 'J. Martin', priority: 'pending', priorityText: 'Moyen', status: 'ok', statusText: 'Planifié', deadline: '25-03-2026' },
                          { title: 'Revue documentation ISO 19443', assignee: 'R. Attal', priority: 'progress', priorityText: 'Normal', status: 'progress', statusText: 'En cours', deadline: '30-03-2026' },
                          { title: 'Inspection visuelle lot 43', assignee: 'S. Dupont', priority: 'alert', priorityText: 'Urgent', status: 'alert', statusText: 'En retard', deadline: '17-03-2026' },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td><strong>{row.title}</strong></td>
                            <td>{row.assignee}</td>
                            <td><span className={`status ${row.priority}`}>{row.priorityText}</span></td>
                            <td><span className={`status ${row.status}`}>{row.statusText}</span></td>
                            <td>{row.deadline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <div className="panel-title" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('tasks.progressLabel')}</div>
                  <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4 }}>
                    <div style={{ width: '42%', height: '100%', background: 'var(--blue)', borderRadius: 4, transition: 'width 0.8s ease' }}></div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>42% complete — 2 of 5 tasks done</div>
                </div>
              </div>
            )}

            {activeSection === 'gantt' && (
              <div className="section-content">
                <div className="panel" style={{ opacity: 1, transform: 'none' }}>
                  <div className="panel-header"><div className="panel-title">{t('sidebar.ganttChart')} — {name}</div></div>
                  <div className="panel-body">
                    <div className="mini-gantt" style={{ gap: '0.5rem 0.75rem' }}>
                      {[
                        { label: 'Phase 1 — Préparation', w: '100%', bg: 'var(--status-success)', status: 'ok', statusText: 'Terminée' },
                        { label: 'Phase 2 — Assemblage', w: '65%', bg: 'var(--blue)', status: 'progress', statusText: 'En cours' },
                        { label: 'INSPECTION-1 — Réacteur R-04', w: '65%', bg: 'var(--blue)', status: 'ok', statusText: 'Ouvertes' },
                        { label: 'INSPECTION-2 — Qualité entrant', w: '40%', bg: 'var(--status-warning)', status: 'pending', statusText: 'En cours' },
                        { label: 'INSPECTION-3 — Vibrations T-07', w: '20%', bg: 'var(--status-error)', status: 'alert', statusText: 'En retard' },
                        { label: 'Phase 3 — Tests', w: '10%', bg: 'var(--toggle-off)', status: 'pending', statusText: 'Planifiée' },
                        { label: 'Phase 4 — Livraison', w: '0%', bg: 'var(--toggle-off)', status: 'pending', statusText: 'Planifiée' },
                      ].map((g) => (
                        <div key={g.label} style={{ display: 'contents' }}>
                          <div className="mini-gantt-label">{g.label}</div>
                          <div className="mini-gantt-bar-wrap"><div className="mini-gantt-bar" style={{ width: g.w, background: g.bg }}></div></div>
                          <div className="mini-gantt-status"><span className={`status ${g.status}`}>{g.statusText}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'actions' && (
              <div className="section-content">
                <div className="panel" style={{ opacity: 1, transform: 'none' }}>
                  <div className="panel-header">
                    <div className="panel-title">{t('sidebar.actions')}</div>
                    <div className="panel-actions"><button className="panel-btn primary">{t('actionsPage.newAction')}</button></div>
                  </div>
                  <div className="panel-body" style={{ padding: 0 }}>
                    <table className="data-table">
                      <thead><tr><th>{t('common.name')}</th><th>{t('tasks.assignee')}</th><th>Priority</th><th>Deadline</th><th>{t('common.status')}</th></tr></thead>
                      <tbody>
                        {[
                          { title: 'Isoler les 3 pièces NC du lot 42', assignee: 'S. Dupont', priority: 'alert', priorityText: 'Critique', deadline: '18-03-2026', status: 'progress', statusText: 'En cours' },
                          { title: 'Recalibrer poste soudage S3', assignee: 'A. Leroy', priority: 'pending', priorityText: 'Majeur', deadline: '19-03-2026', status: 'pending', statusText: 'En attente' },
                          { title: 'Mettre à jour check-list pré-démarrage', assignee: 'J. Martin', priority: 'progress', priorityText: 'Normal', deadline: '25-03-2026', status: 'ok', statusText: 'Planifié' },
                          { title: 'Former les opérateurs soudage TIG', assignee: 'R. Attal', priority: 'pending', priorityText: 'Majeur', deadline: '01-04-2026', status: 'pending', statusText: 'En attente' },
                        ].map((a, i) => (
                          <tr key={i}>
                            <td><strong>{a.title}</strong></td>
                            <td>{a.assignee}</td>
                            <td><span className={`status ${a.priority}`}>{a.priorityText}</span></td>
                            <td>{a.deadline}</td>
                            <td><span className={`status ${a.status}`}>{a.statusText}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'qcp' && (
              <div className="section-content">
                <div className="panel" style={{ opacity: 1, transform: 'none' }}>
                  <div className="panel-header"><div className="panel-title">{t('sidebar.qualityControlPlan')}</div></div>
                  <div className="panel-body" style={{ padding: 0 }}>
                    <table className="data-table">
                      <thead><tr><th>Control Point</th><th>Criteria</th><th>Method</th><th>Frequency</th><th>Responsible</th></tr></thead>
                      <tbody>
                        {[
                          { point: 'Soudure TIG — Bride moteur', criteria: 'Pas de porosité > 0.5mm', method: 'Visuel + Radiographie', freq: 'Chaque lot', resp: 'S. Dupont' },
                          { point: 'Serrage boulonnerie flasques', criteria: '45 ± 2 Nm', method: 'Clé dynamométrique', freq: 'Chaque assemblage', resp: 'A. Leroy' },
                          { point: 'Dimension carter', criteria: '± 0.02mm', method: 'MMT / Palpeur 3D', freq: '1/10 pièces', resp: 'J. Martin' },
                          { point: 'Essai vibration rotor', criteria: '< 2.5 mm/s RMS', method: 'Accéléromètre', freq: 'Chaque moteur', resp: 'S. Dupont' },
                          { point: 'Traitement thermique', criteria: '850°C ± 10°C / 2h', method: 'Thermocouple + enregistreur', freq: 'Chaque lot', resp: 'A. Leroy' },
                        ].map((q, i) => (
                          <tr key={i}>
                            <td><strong>{q.point}</strong></td>
                            <td>{q.criteria}</td>
                            <td>{q.method}</td>
                            <td>{q.freq}</td>
                            <td>{q.resp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'cfsi' && (
              <div className="section-content">
                <div className="panel" style={{ opacity: 1, transform: 'none' }}>
                  <div className="panel-header"><div className="panel-title">{t('sidebar.cfsi')}</div></div>
                  <div className="panel-body" style={{ padding: 0 }}>
                    <table className="data-table">
                      <thead><tr><th>Certificate Name</th><th>{t('common.type')}</th><th>Issue Date</th><th>Expiration</th><th>{t('common.status')}</th></tr></thead>
                      <tbody>
                        {[
                          { name: 'ISO 19443:2018 — Inspecto Group', type: 'Certification', issued: '15-01-2025', expires: '15-01-2028', status: 'ok', statusText: 'Valide' },
                          { name: 'EN 9100 — Site Nord', type: 'Certification', issued: '01-06-2024', expires: '01-06-2027', status: 'ok', statusText: 'Valide' },
                          { name: 'Qualification soudeur TIG — S. Dupont', type: 'Personnel', issued: '10-03-2025', expires: '10-03-2027', status: 'ok', statusText: 'Valide' },
                          { name: 'Certificat matière — Lot 42', type: 'Matériau', issued: '01-02-2026', expires: '—', status: 'progress', statusText: 'En vigueur' },
                          { name: 'Calibration accéléromètre #A-12', type: 'Équipement', issued: '05-09-2025', expires: '05-03-2026', status: 'alert', statusText: 'Expire bientôt' },
                        ].map((c, i) => (
                          <tr key={i}>
                            <td><strong>{c.name}</strong></td>
                            <td>{c.type}</td>
                            <td>{c.issued}</td>
                            <td>{c.expires}</td>
                            <td><span className={`status ${c.status}`}>{c.statusText}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'team' && (
              <div className="section-content">
                <div className="team-grid">
                  {[
                    { initials: 'RA', name: 'Raphaël Attal', role: 'Administrateur', email: 'raphaelattal98@gmail.com', phone: '+33 6 12 34 56 78' },
                    { initials: 'JM', name: 'Jean Martin', role: 'Inspecteur principal', email: 'j.martin@inspecto.com', phone: '+33 6 98 76 54 32', bg: 'var(--status-success)' },
                    { initials: 'SD', name: 'Sophie Dupont', role: 'Inspecteur', email: 's.dupont@inspecto.com', phone: '+33 6 11 22 33 44', bg: 'var(--status-warning)' },
                    { initials: 'AL', name: 'Antoine Leroy', role: 'Inspecteur', email: 'a.leroy@inspecto.com', phone: '+33 6 55 66 77 88', bg: 'var(--bg-tertiary)' },
                  ].map((m) => (
                    <div className="team-card" key={m.initials}>
                      <div className="team-card-avatar" style={m.bg ? { background: m.bg } : {}}>{m.initials}</div>
                      <div className="team-card-info">
                        <div className="team-card-name">{m.name}</div>
                        <div className="team-card-email">{m.email}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>{m.phone}</div>
                        <span className="team-card-role" style={{ marginTop: '0.25rem', display: 'inline-block' }}>{m.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} data-demo-target="projects-page">
      <div className="proj-toolbar">
        <div className="proj-filters">
          <div className="proj-view-toggle">
            <button className="proj-view-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
            <button className="proj-view-btn active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button>
          </div>
          <div className="proj-filter-select"><label>Pick department</label><select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}><option value="">{t('common.all')}</option><option value="Production">Production</option><option value="Maintenance">Maintenance</option><option value="HSE">HSE</option></select></div>
          <div className="proj-filter-select"><label>{t('common.status')}</label><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="not_archived">Not archived</option><option value="">{t('common.all')}</option><option value="archived">Archived</option></select></div>
        </div>
        <button className="panel-btn primary">{t('common.newProject')}</button>
      </div>

      <div className="proj-grid" id="proj-grid">
        {projects.map((proj, i) => ({ proj, i }))
          .filter(({ proj }) => !filterDept || proj.department === filterDept)
          .filter(({ proj }) => {
            if (filterStatus === 'not_archived') return proj.status !== 'archived'
            if (filterStatus === 'archived') return proj.status === 'archived'
            return true // '' means all
          })
          .map(({ proj, i }) => (
          <div className="proj-card" data-proj={String(i)} key={i} onClick={() => openProject(i)}>
            <div className="proj-card-header">
              <div className="proj-card-title">{proj.name}</div>
              <span className="proj-role-badge">INSPECTOR</span>
            </div>
            <div className="proj-card-company">INSPECTO</div>
            <div className="proj-card-dates">{proj.dates}</div>
            <div className="proj-card-actions">
              <button className="proj-action-btn primary" onClick={(e) => { e.stopPropagation(); openProject(i) }}>{t('common.explore')}</button>
              <button className="proj-icon-btn" title="QR Code" onClick={(e) => { e.stopPropagation(); showToast('QR Code generated', 'info') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></button>
              <button className="proj-icon-btn" title={t('common.edit')} onClick={(e) => { e.stopPropagation(); openProject(i) }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button className="proj-icon-btn" title="Dupliquer" onClick={(e) => { e.stopPropagation(); showToast('Project duplicated', 'success') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
              <button className="proj-icon-btn" title="Archiver" onClick={(e) => { e.stopPropagation(); showToast('Project archived', 'info') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg></button>
              <button className="proj-icon-btn danger" title={t('common.delete')} onClick={(e) => { e.stopPropagation(); if(confirm(t('common.deleteConfirm'))) showToast('Project deleted') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
