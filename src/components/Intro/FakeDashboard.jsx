import { useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════
   FakeDashboard — Pure CSS/SVG perspective-tilt dashboard
   Rendered inside the intro sequence for cinematic effect.
   All animations driven by parent GSAP timeline via class selectors.
   ═══════════════════════════════════════════════════════════════ */

const KPI_CARDS = [
  { label: 'PROJETS',           value: '61',    sub: '32 en cours',    borderColor: '#2ea3f2' },
  { label: 'INSPECTIONS',       value: '1 187', sub: '11 ouvertes',    borderColor: '#00ff88' },
  { label: 'NON-CONFORMITÉS',   value: '416',   sub: '186 ouvertes',   borderColor: '#f6a623' },
  { label: 'ACTIONS',           value: '194',   sub: '125 en retard',  borderColor: '#d7294a' },
]

const GANTT_ROWS = [
  { name: 'Pilatus PC21',       pct: 65, color: '#2ea3f2' },
  { name: 'ISO 19443 Site B',   pct: 40, color: '#00ff88' },
  { name: 'AS9100 Hangar 4',    pct: 80, color: '#f6a623' },
  { name: 'Audit Supplier 1',   pct: 25, color: '#2ea3f2' },
  { name: 'Revue CAPA',         pct: 55, color: '#d7294a' },
]

const NC_ROWS = [
  'Serrage vis flasques — EN COURS',
  'Défaut soudure TIG lot 42 — EN COURS',
  'Calibration capteur P3 — OUVERT',
]

export default function FakeDashboard() {
  const clockRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    // Live clock
    const tick = () => {
      if (clockRef.current) {
        const now = new Date()
        clockRef.current.textContent =
          now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    }
    tick()
    timerRef.current = setInterval(tick, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // SVG donut: circumference = 2π × 38 ≈ 238.76
  const C = 2 * Math.PI * 38
  const seg1 = C * 0.45 // green
  const seg2 = C * 0.35 // orange
  const seg3 = C * 0.20 // red

  return (
    <div className="fd-perspective">
      <div className="fd-container">
        {/* Scanning line */}
        <div className="fd-scanline" />

        {/* Top bar */}
        <div className="fd-topbar">
          <div className="fd-dots">
            <span style={{ background: '#d7294a' }} />
            <span style={{ background: '#f6c90e' }} />
            <span style={{ background: '#00ff88' }} />
          </div>
          <span className="fd-topbar-title">INSPECTO DQI — Tableau de bord</span>
          <span className="fd-clock" ref={clockRef}>09:42:17</span>
        </div>

        {/* KPI cards */}
        <div className="fd-kpi-row">
          {KPI_CARDS.map((c, i) => (
            <div className="fd-kpi-card" key={i} style={{ borderLeftColor: c.borderColor }}>
              <div className="fd-kpi-label">{c.label}</div>
              <div className="fd-kpi-value">{c.value}</div>
              <div className="fd-kpi-sub">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Gantt section */}
        <div className="fd-gantt">
          <div className="fd-gantt-title">PLANNING — Semaine 13</div>
          {GANTT_ROWS.map((r, i) => (
            <div className="fd-gantt-row" key={i}>
              <span className="fd-gantt-name">{r.name}</span>
              <div className="fd-gantt-track">
                <div
                  className="fd-gantt-bar"
                  style={{ '--bar-width': `${r.pct}%`, '--bar-color': r.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="fd-bottom">
          {/* NC list */}
          <div className="fd-nc-list">
            {NC_ROWS.map((text, i) => (
              <div className="fd-nc-row" key={i}>
                <span className="fd-nc-dot" />
                <span className="fd-nc-text">{text}</span>
              </div>
            ))}
          </div>

          {/* Donut chart */}
          <div className="fd-donut-wrap">
            <svg viewBox="0 0 100 100" className="fd-donut-svg">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="38" fill="none"
                stroke="#00ff88" strokeWidth="8"
                strokeDasharray={`${seg1} ${C - seg1}`}
                strokeDashoffset="0"
                className="fd-donut-seg"
                transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="38" fill="none"
                stroke="#f6a623" strokeWidth="8"
                strokeDasharray={`${seg2} ${C - seg2}`}
                strokeDashoffset={`${-seg1}`}
                className="fd-donut-seg"
                transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="38" fill="none"
                stroke="#d7294a" strokeWidth="8"
                strokeDasharray={`${seg3} ${C - seg3}`}
                strokeDashoffset={`${-(seg1 + seg2)}`}
                className="fd-donut-seg"
                transform="rotate(-90 50 50)" />
              <text x="50" y="48" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter">78%</text>
              <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="Inter">CONFORMITÉ</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
