import { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import EuropeWireframe3D from '../globe/EuropeWireframe3D'
import FakeDashboard from './FakeDashboard'

/* ═══════════════════════════════════════════════════════════════
   INTRO — Cinematic 32-second opening sequence
   Phase 0: Boot (0–2.5s)
   Phase 1: Globe reveal (2.5–8s)
   Phase 2: KPI counters (8–14s)
   Phase 3: Dashboard 3D reveal (14.5–22.5s) ← NEW
   Phase 4: Brand moment (23–28s)
   Phase 5: Transition (28–32s)
   ═══════════════════════════════════════════════════════════════ */

const SECTORS = [
  'NUCLÉAIRE · ISO 19443',
  'AÉRONAUTIQUE · AS/EN 9100',
  'DÉFENSE · OTAN',
  'OIL & GAS · API Q1',
  'PHARMACIE · GMP',
  'CONSTRUCTION · ISO 9001',
]

const METRICS = [
  { label: 'INSPECTIONS ACTIVES', value: 1187 },
  { label: 'NC EN COURS', value: 416 },
  { label: 'AUDITS CE MOIS', value: 89 },
  { label: 'TAUX CONFORMITÉ', value: 98.7, suffix: '%' },
]

const KPIS = [
  { num: '500+',  label: 'COMPTES ACTIFS' },
  { num: '6',     label: 'PAYS' },
  { num: '1 393', label: 'INSPECTIONS' },
  { num: '98.7%', label: 'CONFORMITÉ' },
]

export default function Intro({ onComplete }) {
  const overlayRef = useRef(null)
  const tlRef = useRef(null)
  const metricTimers = useRef([])
  const dashKpiTimers = useRef([])
  const [globePhase, setGlobePhase] = useState(-1)

  /* ─── Skip handler ─── */
  const handleSkip = useCallback(() => {
    if (tlRef.current) tlRef.current.kill()
    metricTimers.current.forEach(clearInterval)
    metricTimers.current = []
    dashKpiTimers.current.forEach(clearInterval)
    dashKpiTimers.current = []

    const overlay = overlayRef.current
    if (!overlay) { onComplete(); return }
    const tl = gsap.timeline({ onComplete: () => onComplete() })
    tl.to('.intro-red-sweep', { scaleX: 1, duration: 0.5, ease: 'power3.inOut' })
    tl.to(overlay, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 0.35)
  }, [onComplete])

  /* ─── Master timeline ─── */
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tlRef.current = tl

      // ═══════════════════════════════════════════
      // Progress bar — 32s fill
      // ═══════════════════════════════════════════
      tl.to('.intro-progress-fill', { scaleX: 1, duration: 32, ease: 'none' }, 0)

      // ═══════════════════════════════════════════
      // PHASE 0 — BOOT (0–2.5s)
      // ═══════════════════════════════════════════

      tl.set('.intro-scanline', { opacity: 1, top: '-2px' })
      tl.to('.intro-scanline', { top: '100%', duration: 2.5, ease: 'power1.inOut' }, 0)
      tl.to('.intro-scanline', { opacity: 0, duration: 0.3 }, 2.2)

      tl.to('.intro-grid', { opacity: 1, duration: 1.5 }, 0.8)

      const bootEl = overlay.querySelector('.intro-boot-text')
      if (bootEl) {
        const text = 'INSPECTO DQI'
        bootEl.textContent = ''
        text.split('').forEach((char, i) => {
          tl.call(() => { bootEl.textContent += char }, null, 0.3 + i * 0.08)
        })
      }

      const versionEl = overlay.querySelector('.intro-version')
      if (versionEl) {
        const vtext = 'v4.2.1 — INITIALISATION...'
        versionEl.textContent = ''
        vtext.split('').forEach((char, i) => {
          tl.call(() => { versionEl.textContent += char }, null, 1.0 + i * 0.04)
        })
      }

      // ═══════════════════════════════════════════
      // PHASE 1 — GLOBE REVEAL (2.5–8s)
      // ═══════════════════════════════════════════

      tl.call(() => setGlobePhase(0), null, 2.5)
      tl.call(() => setGlobePhase(1), null, 4.0)

      tl.to('.intro-sector-item', {
        opacity: 1, x: 0, duration: 0.6,
        stagger: 0.15, ease: 'power2.out',
      }, 3.0)

      tl.to('.intro-metric-item', {
        opacity: 1, x: 0, duration: 0.5,
        stagger: 0.12, ease: 'power2.out',
      }, 3.5)

      tl.call(() => {
        const metricEls = overlay.querySelectorAll('.intro-metric-value')
        METRICS.forEach((m, i) => {
          const el = metricEls[i]
          if (!el) return
          const timer = setInterval(() => {
            const jitter = m.suffix ? (Math.random() * 0.4 - 0.2) : Math.floor(Math.random() * 3 - 1)
            const val = m.suffix
              ? (m.value + jitter).toFixed(1) + m.suffix
              : (m.value + jitter).toLocaleString('fr-FR')
            el.textContent = val
          }, 800)
          metricTimers.current.push(timer)
        })
      }, null, 4.0)

      // ═══════════════════════════════════════════
      // PHASE 2 — KPI COUNTERS (8–14s)
      // ═══════════════════════════════════════════

      tl.call(() => setGlobePhase(2), null, 8.0)

      tl.to('.intro-sector-list', { opacity: 0, duration: 0.6 }, 7.8)
      tl.to('.intro-live-metrics', { opacity: 0, duration: 0.6 }, 7.8)

      tl.to('.intro-hud-corner', { opacity: 1, duration: 0.4, stagger: 0.08 }, 8.2)
      tl.to('.intro-soundwave', { opacity: 1, duration: 0.4 }, 8.5)

      KPIS.forEach((kpi, i) => {
        const startAt = 8.5 + i * 1.5
        tl.fromTo(`.intro-kpi-big[data-idx="${i}"]`, {
          opacity: 0, scale: 1.4,
        }, {
          opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out',
        }, startAt)
        tl.fromTo(`.intro-kpi-big-label[data-idx="${i}"]`, {
          opacity: 0, y: 8,
        }, {
          opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
        }, startAt + 0.3)
        if (i < KPIS.length - 1) {
          tl.to(`.intro-kpi-big[data-idx="${i}"]`, { opacity: 0, y: -20, scale: 0.9, duration: 0.4 }, startAt + 1.1)
          tl.to(`.intro-kpi-big-label[data-idx="${i}"]`, { opacity: 0, y: -10, duration: 0.3 }, startAt + 1.1)
        }
      })

      // ═══════════════════════════════════════════
      // PHASE 3 — DASHBOARD 3D REVEAL (14.5–22.5s)
      // ═══════════════════════════════════════════

      // Fade out KPI + HUD + soundwave
      tl.to('.intro-kpi-big[data-idx="3"]', { opacity: 0, duration: 0.4 }, 14.0)
      tl.to('.intro-kpi-big-label[data-idx="3"]', { opacity: 0, duration: 0.3 }, 14.0)
      tl.to('.intro-soundwave', { opacity: 0, duration: 0.3 }, 14.0)
      tl.to('.intro-hud-corner', { opacity: 0, duration: 0.3 }, 14.0)

      // Globe migrates to corner
      tl.call(() => setGlobePhase(3), null, 14.2)

      // Stop metric flicker
      tl.call(() => {
        metricTimers.current.forEach(clearInterval)
        metricTimers.current = []
      }, null, 14.0)

      // Dashboard appears with perspective tilt
      tl.fromTo('.fd-perspective', {
        opacity: 0, y: 60,
      }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
      }, 14.5)

      tl.fromTo('.fd-container', {
        rotateX: 25, rotateY: -8,
      }, {
        rotateX: 0, rotateY: 0, duration: 1.5, ease: 'power3.out',
      }, 14.5)

      // Internal elements stagger
      tl.fromTo('.fd-topbar', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 14.8)

      tl.fromTo('.fd-kpi-card', {
        opacity: 0, y: 20,
      }, {
        opacity: 1, y: 0, duration: 0.5,
        stagger: 0.1, ease: 'power2.out',
      }, 15.1)

      // Gantt bars draw
      tl.to('.fd-gantt-bar', {
        width: 'var(--bar-width)', duration: 1.2,
        stagger: 0.15, ease: 'power2.out',
      }, 15.7)

      // Bottom row
      tl.fromTo('.fd-bottom', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 16.5)

      // Donut segments animate
      tl.fromTo('.fd-donut-seg', {
        strokeDashoffset: 238.76,
      }, {
        strokeDashoffset: 0, duration: 1.2,
        stagger: 0.2, ease: 'power2.out',
      }, 16.8)

      // KPI flicker on dashboard
      tl.call(() => {
        const kpiEls = overlay.querySelectorAll('.fd-kpi-value')
        const originals = KPI_CARDS_DATA.map(c => c.value)
        const timer = setInterval(() => {
          kpiEls.forEach((el, i) => {
            const base = parseInt(originals[i].replace(/\s/g, ''), 10)
            if (!isNaN(base)) {
              const jitter = Math.floor(Math.random() * 3 - 1)
              el.textContent = (base + jitter).toLocaleString('fr-FR')
            }
          })
        }, 1200)
        dashKpiTimers.current.push(timer)
      }, null, 17.0)

      // Dashboard exit — tilt back + blur + scale down
      tl.to('.fd-container', {
        rotateX: 8, scale: 0.85, filter: 'blur(8px)',
        duration: 1.5, ease: 'power2.inOut',
      }, 21.0)
      tl.to('.fd-perspective', { opacity: 0, duration: 1.2 }, 21.3)

      // Stop dashboard KPI flicker
      tl.call(() => {
        dashKpiTimers.current.forEach(clearInterval)
        dashKpiTimers.current = []
      }, null, 22.0)

      // ═══════════════════════════════════════════
      // PHASE 4 — BRAND MOMENT (23–28s)
      // ═══════════════════════════════════════════

      tl.to('.intro-boot-text', { opacity: 0, duration: 0.3 }, 22.5)
      tl.to('.intro-version', { opacity: 0, duration: 0.3 }, 22.5)

      // INSPECTO title — clip-path wipe per letter
      const titleLetters = overlay.querySelectorAll('.intro-brand-letter')
      titleLetters.forEach((el, i) => {
        tl.to(el, {
          clipPath: 'inset(0 0% 0 0)', duration: 0.12,
          ease: 'power2.out',
        }, 23.0 + i * 0.07)
      })

      // Red underline draws
      tl.to('.intro-brand-line', {
        scaleX: 1, duration: 0.5, ease: 'power2.inOut',
      }, 24.0)

      // Tagline words blur in
      tl.to('.intro-tagline-word', {
        opacity: 1, filter: 'blur(0px)', duration: 0.45,
        stagger: 0.09, ease: 'power2.out',
      }, 24.8)

      // ═══════════════════════════════════════════
      // PHASE 5 — TRANSITION (28–32s)
      // ═══════════════════════════════════════════

      tl.to('.intro-brand-letter', { opacity: 0, y: -8, duration: 0.35, stagger: 0.03 }, 28.0)
      tl.to('.intro-brand-line', { opacity: 0, duration: 0.3 }, 28.2)
      tl.to('.intro-tagline-word', { opacity: 0, y: -8, duration: 0.3, stagger: 0.04 }, 28.3)

      tl.to('.intro-grid', { opacity: 0, duration: 0.5 }, 28.8)

      // Red bar sweep + slide out
      tl.to('.intro-red-sweep', { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 29.5)
      tl.to(overlay, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, 30.0)

      // Done
      tl.call(() => onComplete(), null, 31.0)

    }, overlay)

    return () => {
      ctx.revert()
      metricTimers.current.forEach(clearInterval)
      metricTimers.current = []
      dashKpiTimers.current.forEach(clearInterval)
      dashKpiTimers.current = []
    }
  }, [onComplete])

  /* ─── Tagline split into words ─── */
  const tagline = 'Inspection, contrôles et audits digitalisés'
  const tagWords = tagline.split(' ')

  /* ─── inspecto letters ─── */
  const brandLetters = 'inspecto'.split('')

  return (
    <div id="intro-overlay" ref={overlayRef}>

      {/* Background grid */}
      <div className="intro-grid" />

      {/* Red scanline */}
      <div className="intro-scanline" />

      {/* Red sweep bar for exit */}
      <div className="intro-red-sweep" />

      {/* Boot text */}
      <span className="intro-boot-text" />
      <span className="intro-version" />

      {/* Globe */}
      <EuropeWireframe3D phase={globePhase} />

      {/* Sector list — left */}
      <div className="intro-sector-list">
        {SECTORS.map((s, i) => (
          <div className="intro-sector-item" key={i} style={{ opacity: 0, transform: 'translateX(-40px)' }}>
            {s}
          </div>
        ))}
      </div>

      {/* Live metrics — right */}
      <div className="intro-live-metrics">
        {METRICS.map((m, i) => (
          <div className="intro-metric-item" key={i} style={{ opacity: 0, transform: 'translateX(40px)' }}>
            <span className="intro-metric-label">{m.label}</span>
            <span className="intro-metric-value">
              {m.suffix ? m.value.toFixed(1) + m.suffix : m.value.toLocaleString('fr-FR')}
            </span>
          </div>
        ))}
      </div>

      {/* HUD corners */}
      <div className="intro-hud-corner tl" style={{ opacity: 0 }} />
      <div className="intro-hud-corner tr" style={{ opacity: 0 }} />
      <div className="intro-hud-corner bl" style={{ opacity: 0 }} />
      <div className="intro-hud-corner br" style={{ opacity: 0 }} />

      {/* Sound wave bars */}
      <div className="intro-soundwave" style={{ opacity: 0 }}>
        <span /><span /><span /><span /><span />
      </div>

      {/* Big KPI counter — stacked center */}
      <div className="intro-kpi-center">
        {KPIS.map((kpi, i) => (
          <div className="intro-kpi-stack" key={i}>
            <div className="intro-kpi-big" data-idx={i} style={{ opacity: 0 }}>{kpi.num}</div>
            <div className="intro-kpi-big-label" data-idx={i} style={{ opacity: 0 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Fake dashboard — Phase 3 */}
      <FakeDashboard />

      {/* Brand moment */}
      <div className="intro-brand-center">
        <h1 className="intro-brand-title">
          {brandLetters.map((ch, i) => (
            <span className={`intro-brand-letter${i === 0 ? ' intro-brand-i' : ''}`} key={i} style={{ clipPath: 'inset(0 100% 0 0)', position: 'relative' }}>
              {ch}
              {i === 0 && <span className="intro-brand-dot" />}
            </span>
          ))}
          <span className="intro-brand-registered">®</span>
        </h1>
        <div className="intro-brand-line" />
        <p className="intro-tagline">
          {tagWords.map((w, i) => (
            <span className="intro-tagline-word" key={i}>{w}&nbsp;</span>
          ))}
        </p>
      </div>

      {/* Skip button */}
      <button className="intro-skip" onClick={handleSkip}>
        Passer <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Progress bar */}
      <div className="intro-progress"><div className="intro-progress-fill" /></div>
    </div>
  )
}

/* Reference data for KPI flicker (must match FakeDashboard) */
const KPI_CARDS_DATA = [
  { value: '61' },
  { value: '1 187' },
  { value: '416' },
  { value: '194' },
]
