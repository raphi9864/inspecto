import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

export default function Statistics() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    let charts = []
    const ctx = gsap.context(() => {
      gsap.to('.kpi-card', { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 })
      gsap.to('.panel', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5 })
    }, containerRef)

    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      const cs = getComputedStyle(document.documentElement)
      const textColor = cs.getPropertyValue('--text-tertiary').trim() || '#94a3b8'
      const gridColor = cs.getPropertyValue('--border-secondary').trim() || 'rgba(255,255,255,0.04)'
      const tooltipBg = cs.getPropertyValue('--bg-tertiary').trim() || 'rgba(17,24,39,0.95)'
      const tooltipBorder = cs.getPropertyValue('--border-primary').trim() || 'rgba(255,255,255,0.08)'
      const tooltipText = cs.getPropertyValue('--text-primary').trim() || '#f0f4f8'
      // Direct hex colors for Chart.js canvas — canvas cannot resolve CSS var()
      const brandBlue = '#2ea3f2'
      const statusError = '#CC0000'
      const statusSuccess = '#38a169'
      const statusWarning = '#dd6b20'
      const severityMinor = '#f1c40f'

      Chart.defaults.color = textColor
      const commonFont = { family: 'Montserrat', size: 11, color: textColor }
      const tooltipStyle = { backgroundColor: tooltipBg, borderColor: tooltipBorder, borderWidth: 1, titleColor: tooltipText, bodyColor: tooltipText, titleFont: { family: 'Montserrat' }, bodyFont: { family: 'Montserrat' } }

      // Area chart
      const areaCtx = document.getElementById('chart-area')
      if (areaCtx) {
        charts.push(new Chart(areaCtx, {
          type: 'line',
          data: {
            labels: ['Jan 23','Avr 23','Jul 23','Oct 23','Jan 24','Avr 24','Jul 24','Oct 24','Jan 25','Avr 25','Jul 25','Oct 25','Jan 26','Mar 26'],
            datasets: [
              { label: 'Inspections', data: [12,18,24,31,42,55,68,82,98,110,124,138,149,156], borderColor: statusError, backgroundColor: 'rgba(204,0,0,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: statusError },
              { label: 'Non-conformités', data: [2,3,4,6,8,11,14,19,23,27,30,34,38,42], borderColor: statusSuccess, backgroundColor: 'rgba(56,161,105,0.08)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: statusSuccess },
            ]
          },
          options: { responsive: true, animation: { duration: 800, easing: 'easeInOutQuart' }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: commonFont } }, tooltip: { ...tooltipStyle, mode: 'index', intersect: false } }, scales: { y: { min: 0, ticks: { font: commonFont }, grid: { color: gridColor } }, x: { ticks: { font: commonFont, maxRotation: 45 }, grid: { display: false } } } }
        }))
      }

      // Bar chart
      const barCtx = document.getElementById('chart-bar')
      if (barCtx) {
        charts.push(new Chart(barCtx, {
          type: 'bar',
          data: { labels: ['Oct','Nov','Déc','Jan','Fév','Mar'], datasets: [{ label: 'Inspections', data: [24,18,12,22,31,27], backgroundColor: brandBlue, borderRadius: 4 }] },
          options: { responsive: true, animation: { duration: 800, easing: 'easeInOutQuart' }, plugins: { legend: { display: false }, tooltip: tooltipStyle }, scales: { y: { min: 0, ticks: { font: commonFont }, grid: { color: gridColor } }, x: { ticks: { font: commonFont }, grid: { display: false } } } }
        }))
      }

      // Pie chart
      const pieCtx = document.getElementById('chart-pie')
      if (pieCtx) {
        charts.push(new Chart(pieCtx, {
          type: 'doughnut',
          data: { labels: [t('statistics.legend.closed'),t('statistics.legend.pending'),t('statistics.legend.ongoing')], datasets: [{ data: [1383,7,3], backgroundColor: [statusError, brandBlue, statusSuccess], borderWidth: 0, hoverOffset: 4 }] },
          options: { cutout: '72%', animation: { duration: 800, easing: 'easeInOutQuart' }, plugins: { legend: { display: false }, tooltip: { ...tooltipStyle, callbacks: { label: (c) => ` ${c.label}: ${((c.raw/1393)*100).toFixed(1)}%` } } } }
        }))
      }

      // NC categories
      const ncCatCtx = document.getElementById('chart-nc-categories')
      if (ncCatCtx) {
        charts.push(new Chart(ncCatCtx, {
          type: 'bar',
          data: { labels: ['Procédé','Matériau','Humain','Équipement','Environnement'], datasets: [{ label: t('statistics.charts.ncCategories'), data: [142,87,63,44,24], backgroundColor: ['#2ea3f2','#dd6b20','#CC0000','#38a169','#9b59b6'], borderRadius: 4 }] },
          options: { indexAxis: 'y', responsive: true, animation: { duration: 800, easing: 'easeInOutQuart' }, plugins: { legend: { display: false }, tooltip: tooltipStyle }, scales: { x: { min: 0, ticks: { font: commonFont }, grid: { color: gridColor } }, y: { ticks: { font: commonFont }, grid: { display: false } } } }
        }))
      }

      // NC trend
      const ncTrendCtx = document.getElementById('chart-nc-trend')
      if (ncTrendCtx) {
        charts.push(new Chart(ncTrendCtx, {
          type: 'line',
          data: { labels: ['Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc','Jan','Fév','Mar'], datasets: [{ label: 'NC par mois', data: [28,24,31,35,29,27,34,22,18,31,28,33], borderColor: statusError, backgroundColor: 'rgba(204,0,0,0.07)', fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: statusError }] },
          options: { responsive: true, animation: { duration: 800, easing: 'easeInOutQuart' }, plugins: { legend: { display: false }, tooltip: tooltipStyle }, scales: { y: { min: 0, ticks: { font: commonFont }, grid: { color: gridColor } }, x: { ticks: { font: commonFont }, grid: { display: false } } } }
        }))
      }
    })

    return () => { ctx.revert(); charts.forEach(c => c.destroy()) }
  }, [])

  function switchTab(tab) {
    setActiveTab(tab)
    setTimeout(() => {
      const target = document.getElementById(`tab-${tab}`)
      if (target) gsap.from(target, { opacity: 0, y: 8, duration: 0.3, ease: 'power2.out' })
    }, 0)
  }

  return (
    <div ref={containerRef}>
      <div className="stats-tabs">
        <button className={`stats-tab${activeTab === 'general' ? ' active' : ''}`} onClick={() => switchTab('general')}>{t('statistics.tabs.general')}</button>
        <button className={`stats-tab${activeTab === 'findings' ? ' active' : ''}`} onClick={() => switchTab('findings')}>{t('statistics.tabs.findings')}</button>
      </div>

      {/* GENERAL */}
      <div id="tab-general" style={{ display: activeTab === 'general' ? 'block' : 'none' }}>
        <div className="stats-filter-row">
          <div className="proj-filter-select"><label>{t('statistics.filters.project')}</label><select><option>{t('statistics.filters.allProjects')}</option><option>Fabrication moteur HT</option><option>Jupiter Bach</option></select></div>
          <div className="proj-filter-select"><label>{t('statistics.filters.period')}</label><select><option>2023 — 2027</option><option>2026</option><option>2025</option></select></div>
          <button className="panel-btn ghost" style={{ fontSize: '0.9rem', marginLeft: 'auto' }} onClick={() => showToast(t('common.pdf_exported'), 'info')}>{t('statistics.filters.exportPDF')}</button>
        </div>

        <div className="kpi-bar" id="kpi-bar">
          {[
            { color: 'blue', title: t('statistics.kpi.totalInspections'), sub: t('statistics.kpi.allPeriods'), count: '1 393', pct: '94%', stroke: 'var(--blue)', dash: '225 14', stats: [{ dot: 'teal', l: t('statistics.kpi.ongoing'), v: '10' },{ dot: 'green', l: t('statistics.kpi.noNC'), v: '1 120' }] },
            { color: 'green', title: t('statistics.kpi.ongoing'), sub: t('statistics.kpi.activeMonth'), count: '10', pct: '7%', stroke: 'var(--status-success)', dash: '18 220', stats: [{ dot: 'green', l: t('statistics.statsLabels.planned'), v: '6' },{ dot: 'yellow', l: t('statistics.statsLabels.overdue'), v: '4' }] },
            { color: 'orange', title: t('statistics.kpi.noNC'), sub: t('statistics.kpi.compliant'), count: '1 120', pct: '80%', stroke: 'var(--status-warning)', dash: '196 43', stats: [{ dot: 'orange', l: t('statistics.statsLabels.complianceRate'), v: '80,4%' },{ dot: 'green', l: t('statistics.statsLabels.vsLastYear'), v: '+2,1%' }] },
            { color: 'dark', title: t('statistics.kpi.totalFindings'), sub: t('statistics.kpi.cumulatedNC'), count: '360', pct: '99,3%', stroke: 'var(--bg-tertiary)', dash: '234 5', stats: [{ dot: 'gray', l: t('statistics.statsLabels.closedLabel'), v: '358' },{ dot: 'red', l: t('statistics.statsLabels.openLabel'), v: '2' }] },
          ].map((k) => (
            <div className={`kpi-card kpi-${k.color}`} key={k.title}>
              <div className="kpi-hdr">
                <div className="kpi-hdr-info"><div className="kpi-hdr-title">{k.title}</div><div className="kpi-hdr-sub">{k.sub}</div></div>
                <div className="kpi-hdr-count">{k.count}</div>
              </div>
              <div className="kpi-body">
                <div className="kpi-donut">
                  <svg viewBox="0 0 84 84">
                    <circle cx="42" cy="42" r="38" className="donut-track"/>
                    <circle cx="42" cy="42" r="38" className="donut-arc" stroke={k.stroke} strokeDasharray={k.dash} transform="rotate(-90 42 42)"/>
                    <text x="42" y="46" className="donut-label">{k.pct}</text>
                  </svg>
                </div>
                <div className="kpi-stats">
                  {k.stats.map((s) => <div className="kpi-stat-row" key={s.l}><span className={`kpi-dot ${s.dot}`}></span>{s.l} <strong>{s.v}</strong></div>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-layout full" style={{ gridTemplateColumns: '1fr' }}>
          <div className="stats-charts-grid">
            <div className="panel" style={{ opacity: 1, transform: 'none' }} id="panel-area-chart">
              <div className="panel-header"><div className="panel-title">{t('statistics.charts.timeDistribution')}</div><div className="panel-actions"><span style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>2023 → 2027</span></div></div>
              <div className="panel-body"><canvas id="chart-area" height="140"></canvas></div>
            </div>
            <div className="stats-charts-row">
              <div className="panel" style={{ opacity: 1, transform: 'none' }} id="panel-bar-chart">
                <div className="panel-header"><div className="panel-title">{t('statistics.charts.monthlyInspections')}</div></div>
                <div className="panel-body"><canvas id="chart-bar" height="160"></canvas></div>
              </div>
              <div className="panel" style={{ opacity: 1, transform: 'none' }} id="panel-pie-chart">
                <div className="panel-header"><div className="panel-title">{t('statistics.charts.inspectionStatus')}</div></div>
                <div className="panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <canvas id="chart-pie" width="140" height="140"></canvas>
                  <div className="stats-pie-legend">
                    {[{ color: 'var(--status-error)', label: 'Clôturées', pct: '99,3%' },{ color: 'var(--blue)', label: 'En attente', pct: '0,5%' },{ color: 'var(--status-success)', label: 'En cours', pct: '0,2%' }].map((l) => (
                      <div className="stats-legend-row" key={l.label}><span className="stats-legend-dot" style={{ background: l.color }}></span><span>{l.label}</span><strong>{l.pct}</strong></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FINDINGS */}
      <div id="tab-findings" style={{ display: activeTab === 'findings' ? 'block' : 'none' }}>
        <div className="stats-filter-row">
          <div className="proj-filter-select"><label>{t('findings.formLabels.findingNC')}</label><select><option>{t('statistics.filters.allProjects')}</option><option>{t('findings.criticality.minor')}</option><option>{t('findings.criticality.major')}</option><option>{t('findings.criticality.critical')}</option></select></div>
          <div className="proj-filter-select"><label>{t('traceability.filters.actionType')}</label><select><option>{t('statistics.filters.allProjects')}</option></select></div>
        </div>
        <div className="stats-charts-row" style={{ marginTop: 0 }}>
          <div className="panel" style={{ opacity: 1, transform: 'none' }}>
            <div className="panel-header"><div className="panel-title">{t('statistics.charts.ncCategories')}</div></div>
            <div className="panel-body"><canvas id="chart-nc-categories" height="200"></canvas></div>
          </div>
          <div className="panel" style={{ opacity: 1, transform: 'none' }}>
            <div className="panel-header"><div className="panel-title">{t('statistics.charts.ncTrend')}</div></div>
            <div className="panel-body"><canvas id="chart-nc-trend" height="200"></canvas></div>
          </div>
        </div>
      </div>

    </div>
  )
}
