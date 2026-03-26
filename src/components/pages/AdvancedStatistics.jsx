import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, RadialLinearScale } from 'chart.js'
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2'
import gsap from 'gsap'

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, RadialLinearScale)

export default function AdvancedStatistics() {
  const { t } = useTranslation()
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.adv-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 })
    }, ref)
    return () => ctx.revert()
  }, [])

  const radarData = {
    labels: ['Welding', 'Assembly', 'Machining', 'Electrical', 'Painting', 'Testing'],
    datasets: [
      { label: t('globalStats.ncRate'), data: [65, 40, 55, 30, 20, 45], borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.15)', pointBackgroundColor: '#dc2626' },
      { label: t('globalStats.inspectionCoverage'), data: [80, 70, 60, 85, 50, 90], borderColor: 'var(--blue)', backgroundColor: 'rgba(37,99,235,0.15)', pointBackgroundColor: 'var(--blue)' },
    ],
  }

  const trendData = {
    labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'],
    datasets: [
      { label: t('advancedStats.resolutionTime'), data: [12, 10, 8, 7, 5], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4 },
      { label: t('advancedStats.detectionTime'), data: [5, 4, 3, 3, 2], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4 },
    ],
  }

  const costData = {
    labels: ['Rework', 'Scrap', 'Warranty', 'Delays', 'Testing'],
    datasets: [{ data: [35, 20, 15, 18, 12], backgroundColor: ['#dc2626', '#f59e0b', '#7c3aed', 'var(--blue)', '#22c55e'], borderWidth: 0 }],
  }

  const complianceData = {
    labels: ['ISO 19443', 'ISO 9001', 'EN 10204', 'ASME III', 'RCC-M'],
    datasets: [
      { label: 'Compliance %', data: [92, 88, 95, 78, 85], backgroundColor: ['var(--blue)', '#22c55e', 'var(--blue)', '#f59e0b', '#22c55e'] },
    ],
  }

  return (
    <div ref={ref}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 300, color: 'var(--text-primary)', marginBottom: 20 }}>Advanced Statistics</h2>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Avg resolution time', val: '5.2 days', trend: '-38%', trendColor: '#22c55e' },
          { label: 'First pass yield', val: '87.3%', trend: '+4.2%', trendColor: '#22c55e' },
          { label: 'NC recurrence rate', val: '12.1%', trend: '-2.8%', trendColor: '#22c55e' },
          { label: 'Overdue actions', val: '15', trend: '+3', trendColor: '#dc2626' },
        ].map((k, i) => (
          <div key={i} className="adv-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, border: '1px solid var(--border-primary)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{k.val}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: k.trendColor }}>{k.trend} vs last quarter</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="adv-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>{t('advancedStats.complianceRadar')}</h3>
          <Radar data={radarData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { r: { beginAtZero: true, max: 100 } } }} />
        </div>
        <div className="adv-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>{t('advancedStats.resolutionTrend')}</h3>
          <Line data={trendData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
        </div>
        <div className="adv-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>Cost of Non-Quality</h3>
          <div style={{ maxWidth: 280, margin: '0 auto' }}>
            <Doughnut data={costData} options={{ cutout: '60%', plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div className="adv-card" style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, border: '1px solid var(--border-primary)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 16 }}>Standards Compliance</h3>
          <Bar data={complianceData} options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, max: 100 } } }} />
        </div>
      </div>
    </div>
  )
}
