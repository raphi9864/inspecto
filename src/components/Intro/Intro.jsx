import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Splitting from 'splitting'
import 'splitting/dist/splitting.css'

/* ─── KPI data ─── */
const INTRO_KPIS = [
  { value: 500, suffix: '+', label: 'comptes actifs' },
  { value: 6, suffix: '', label: 'pays couverts' },
  { value: 1393, suffix: '', label: 'inspections' },
  { value: 98.7, suffix: '%', label: 'conformité' },
]

/* ─── Canvas particle system ─── */
function initParticleCanvas(canvas) {
  const ctx = canvas.getContext('2d')
  let W, H, dots, particles, rafId
  let dotsVisible = false
  let particlesVisible = false
  let warpMode = false

  function resize() {
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
    // Rebuild dot grid
    dots = []
    for (let x = 20; x < W; x += 40) {
      for (let y = 20; y < H; y += 40) {
        const dx = x - W / 2, dy = y - H / 2
        const dist = Math.sqrt(dx * dx + dy * dy)
        dots.push({ x, y, opacity: 0, dist })
      }
    }
    dots.sort((a, b) => a.dist - b.dist)
    // Rebuild particles
    particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.25 + 0.05,
    }))
  }

  resize()
  window.addEventListener('resize', resize)

  // Wave: light up dots from center outward
  function triggerDotWave() {
    dotsVisible = true
    dots.forEach((d, i) => {
      gsap.to(d, { opacity: 0.1, duration: 0.4, delay: i * 0.0008, ease: 'power2.out' })
    })
  }

  function showParticles() { particlesVisible = true }

  function triggerWarp() {
    warpMode = true
    // Accelerate particles toward center
    particles.forEach(p => {
      const dx = W / 2 - p.x, dy = H / 2 - p.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      p.vx = (dx / dist) * 8
      p.vy = (dy / dist) * 8
      p.r = Math.min(p.r * 3, 6)
    })
  }

  function draw() {
    ctx.clearRect(0, 0, W, H)

    // Draw dot grid
    if (dotsVisible) {
      dots.forEach(d => {
        if (d.opacity <= 0) return
        ctx.fillStyle = `rgba(46,163,242,${d.opacity})`
        ctx.fillRect(d.x - 1, d.y - 1, 2, 2)
      })
    }

    // Draw floating particles
    if (particlesVisible) {
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (!warpMode) {
          if (p.x < 0 || p.x > W) p.vx *= -1
          if (p.y < 0 || p.y > H) p.vy *= -1
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(46,163,242,${p.opacity})`
        ctx.fill()
      })

      // Draw faint connection lines between nearby particles
      if (!warpMode) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = dx * dx + dy * dy
            if (dist < 22000) {
              ctx.strokeStyle = `rgba(46,163,242,${0.04 * (1 - dist / 22000)})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }
    }

    rafId = requestAnimationFrame(draw)
  }

  rafId = requestAnimationFrame(draw)

  return {
    triggerDotWave,
    showParticles,
    triggerWarp,
    destroy() {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    },
  }
}

export default function Intro({ onComplete }) {
  const overlayRef = useRef(null)
  const canvasRef = useRef(null)
  const particleCtrl = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    // Init canvas particles
    if (canvasRef.current) {
      particleCtrl.current = initParticleCanvas(canvasRef.current)
    }

    // Splitting.js
    Splitting({ target: overlay.querySelector('#intro-title'), by: 'chars' })
    Splitting({ target: overlay.querySelector('#line1'), by: 'words' })
    Splitting({ target: overlay.querySelector('#line2'), by: 'words' })

    // Background slideshow — all hidden initially
    const slides = overlay.querySelectorAll('.intro-bg-slide')
    gsap.set(slides, { opacity: 0 })

    // Sector tags initial states
    const sectorTags = overlay.querySelectorAll('.sector-tag')
    sectorTags.forEach((tag, i) => {
      gsap.set(tag, {
        x: i % 2 === 0 ? gsap.utils.random(-80, -40) : gsap.utils.random(40, 80),
        y: gsap.utils.random(-10, 10),
        opacity: 0,
        scale: 0.8,
      })
    })

    // KPI initial states
    gsap.set('.intro-kpi-item', { opacity: 0, y: 20 })
    gsap.set('.intro-kpi-underline', { scaleX: 0 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      /* ═══════════════════════════════════════════
         Phase 0 — Boot Sequence (0–2s)
         ═══════════════════════════════════════════ */
      tl.set('#intro-scanline', { opacity: 1, top: '-2px' })
      tl.to('#intro-scanline', { top: '100%', duration: 3.5, ease: 'power1.inOut', opacity: 0.9 }, 0)
      tl.to('#intro-scanline', { opacity: 0, duration: 0.5 }, 3.5)
      tl.to('#intro-progress-fill', { width: '100%', duration: 20, ease: 'none' }, 0)
      // Trigger dot grid wave at 0.3s
      tl.call(() => particleCtrl.current?.triggerDotWave(), null, 0.3)

      /* ─── Background slideshow (Ken Burns crossfade) ─── */
      // Slide 0: Soudure industrielle (0–5s)
      tl.set('[data-slide="0"]', { scale: 1 })
      tl.to('[data-slide="0"]', { opacity: 0.25, duration: 1.5, ease: 'power2.out' }, 1.0)
      tl.to('[data-slide="0"]', { scale: 1.06, duration: 4, ease: 'none' }, 1.0)
      tl.to('[data-slide="0"]', { opacity: 0, duration: 1, ease: 'power2.in' }, 4.5)

      // Slide 1: Chantier construction (5–9s)
      tl.set('[data-slide="1"]', { scale: 1.04 })
      tl.to('[data-slide="1"]', { opacity: 0.25, duration: 1, ease: 'power2.out' }, 5.0)
      tl.to('[data-slide="1"]', { scale: 1, duration: 4, ease: 'none' }, 5.0)
      tl.to('[data-slide="1"]', { opacity: 0, duration: 1, ease: 'power2.in' }, 8.5)

      // Slide 2: Aéronautique (9–13s)
      tl.set('[data-slide="2"]', { scale: 1 })
      tl.to('[data-slide="2"]', { opacity: 0.25, duration: 1, ease: 'power2.out' }, 9.0)
      tl.to('[data-slide="2"]', { scale: 1.06, duration: 4, ease: 'none' }, 9.0)
      tl.to('[data-slide="2"]', { opacity: 0, duration: 1, ease: 'power2.in' }, 12.5)

      // Slide 3: Usine/tech (13–17s)
      tl.set('[data-slide="3"]', { scale: 1.04 })
      tl.to('[data-slide="3"]', { opacity: 0.22, duration: 1, ease: 'power2.out' }, 13.0)
      tl.to('[data-slide="3"]', { scale: 1, duration: 4, ease: 'none' }, 13.0)
      tl.to('[data-slide="3"]', { opacity: 0, duration: 1, ease: 'power2.in' }, 16.5)

      // Slide 4: Digital/tech (17–20s)
      tl.set('[data-slide="4"]', { scale: 1 })
      tl.to('[data-slide="4"]', { opacity: 0.2, duration: 0.8, ease: 'power2.out' }, 17.0)
      tl.to('[data-slide="4"]', { scale: 1.05, duration: 3, ease: 'none' }, 17.0)

      /* ═══════════════════════════════════════════
         Phase 1 — Logo Reveal (2–4s)
         ═══════════════════════════════════════════ */
      tl.to('#logo-dot', { scale: 1, opacity: 1, duration: 1.0, ease: 'back.out(2)' }, 0.8)
      tl.to('#logo-dot', { scale: 1.2, boxShadow: '0 0 0 20px rgba(46,163,242,0)', duration: 0.5, ease: 'power2.out', yoyo: true, repeat: 1 }, 2.2)
      tl.to('#intro-logo-label', { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 2.3)

      // Title reveal with clip-path wipe
      // First: make all chars visible but hide title with clip-path
      tl.set('#intro-title', { clipPath: 'inset(0 100% 0 0)', opacity: 1 }, 0)
      tl.set('#intro-title .char', { y: 0, opacity: 1 }, 0)
      // Then: wipe reveal from left to right
      tl.to('#intro-title', { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' }, 2.5)

      /* ═══════════════════════════════════════════
         Phase 2 — Video + Particles (3–5s)
         ═══════════════════════════════════════════ */
      tl.call(() => particleCtrl.current?.showParticles(), null, 3.5)

      /* ═══════════════════════════════════════════
         Phase 3 — Tagline + Sectors (5–9s)
         ═══════════════════════════════════════════ */
      tl.to('#intro-tagline', { opacity: 1, y: 0, duration: 1.1 }, 5.0)
      tl.to('.sector-tag', {
        x: 0, y: 0, opacity: 1, scale: 1,
        duration: 0.7,
        stagger: { each: 0.12, ease: 'power2.out' },
        ease: 'back.out(1.3)',
      }, 6.0)
      // Pulse glow on tags
      tl.to('.sector-tag', {
        borderColor: 'rgba(46,163,242,0.75)',
        boxShadow: '0 0 16px rgba(46,163,242,0.25)',
        duration: 0.5,
        stagger: { each: 0.08, yoyo: true, repeat: 1 },
      }, 7.8)

      /* ═══════════════════════════════════════════
         Phase 4 — KPI Counters (9–14s) ⭐ NEW
         ═══════════════════════════════════════════ */
      // Fade out sectors + title/tagline
      tl.to('.sector-tag', { opacity: 0, y: -16, scale: 0.88, duration: 0.5, stagger: { each: 0.05, from: 'random' } }, 8.8)
      tl.to(['#intro-title', '#intro-tagline', '#intro-logo-group'], { opacity: 0, duration: 0.6 }, 9.0)

      // KPI items appear
      tl.to('.intro-kpi-item', {
        opacity: 1, y: 0, duration: 0.6,
        stagger: 0.15, ease: 'power3.out',
      }, 9.5)
      tl.to('.intro-kpi-underline', {
        scaleX: 1, duration: 0.5,
        stagger: 0.15, ease: 'power2.out',
      }, 10.0)

      // Animate counter numbers
      INTRO_KPIS.forEach((kpi, i) => {
        const el = overlay.querySelector(`#intro-kpi-num-${i}`)
        if (el) {
          const obj = { val: 0 }
          tl.to(obj, {
            val: kpi.value,
            duration: 2.2,
            ease: 'power2.out',
            snap: { val: kpi.value % 1 === 0 ? 1 : 0.1 },
            onUpdate: () => {
              if (kpi.value % 1 === 0) {
                el.textContent = Math.round(obj.val).toLocaleString('fr-FR') + kpi.suffix
              } else {
                el.textContent = obj.val.toFixed(1) + kpi.suffix
              }
            },
          }, 9.8 + i * 0.15)
        }
      })

      /* ═══════════════════════════════════════════
         Phase 5 — Accroche Finale (14–17.5s)
         ═══════════════════════════════════════════ */
      tl.to('.intro-kpi-item', { opacity: 0, y: -12, duration: 0.5, stagger: 0.06 }, 13.5)
      tl.to('#line1 .word', {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.6, stagger: 0.08, ease: 'power3.out',
      }, 14.2)
      tl.to('#line2 .word', {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.6, stagger: 0.08, ease: 'power3.out',
      }, 15.8)

      /* ═══════════════════════════════════════════
         Phase 6 — Sweep Final (17.5–20s)
         ═══════════════════════════════════════════ */
      // Warp particles toward center
      tl.call(() => particleCtrl.current?.triggerWarp(), null, 18.0)
      // Flash + fade
      tl.to('#intro-flash', { opacity: 0.6, duration: 0.15, ease: 'power2.in' }, 18.5)
      tl.to('#intro-flash', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 18.65)
      tl.to(['#line1', '#line2', '#intro-video-overlay'], { opacity: 0, duration: 0.3 }, 18.8)
      tl.to('#intro-overlay', {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        onComplete: () => onComplete(),
      }, 19.2)
    }, overlay)

    return () => {
      ctx.revert()
      particleCtrl.current?.destroy()
    }
  }, [onComplete])

  return (
    <div id="intro-overlay" ref={overlayRef}>
      {/* Background layers */}
      {/* Background slideshow — one image per phase */}
      <img className="intro-bg-slide" data-slide="0"
        src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80"
        alt="" aria-hidden="true" />
      <img className="intro-bg-slide" data-slide="1"
        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
        alt="" aria-hidden="true" />
      <img className="intro-bg-slide" data-slide="2"
        src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1920&q=80"
        alt="" aria-hidden="true" />
      <img className="intro-bg-slide" data-slide="3"
        src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80"
        alt="" aria-hidden="true" />
      <img className="intro-bg-slide" data-slide="4"
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80"
        alt="" aria-hidden="true" />
      <div id="intro-video-overlay"></div>
      <canvas id="intro-particles" ref={canvasRef}></canvas>
      <div id="intro-scanline"></div>
      <div id="intro-flash"></div>

      {/* Logo group */}
      <div id="intro-logo-group">
        <div id="logo-dot"></div>
        <span id="intro-logo-label">DQI</span>
      </div>

      {/* Title */}
      <h1 id="intro-title">INSPECTO</h1>
      <p id="intro-tagline">Inspection, contrôles et audits digitalisés</p>

      {/* Sector tags */}
      <div id="intro-sectors">
        <span className="sector-tag">Nucléaire · ISO 19443</span>
        <span className="sector-tag">Aéronautique · AS/EN 9100</span>
        <span className="sector-tag">Défense</span>
        <span className="sector-tag">Oil &amp; Gas</span>
        <span className="sector-tag">Pharmacie</span>
        <span className="sector-tag">Construction</span>
        <span className="sector-tag">Énergie</span>
        <span className="sector-tag">Mécanique</span>
      </div>

      {/* KPI Counters ⭐ NEW */}
      <div className="intro-kpi-row">
        {INTRO_KPIS.map((kpi, i) => (
          <div className="intro-kpi-item" key={i}>
            <div className="intro-kpi-number" id={`intro-kpi-num-${i}`}>0{kpi.suffix}</div>
            <div className="intro-kpi-underline"></div>
            <div className="intro-kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Accroches */}
      <p className="intro-accroche" id="line1">Dans l'industrie, chaque inspection compte.</p>
      <p className="intro-accroche" id="line2">INSPECTO DQI digitalise tout — de l'audit au rapport.</p>

      {/* Progress bar */}
      <div id="intro-progress"><div id="intro-progress-fill"></div></div>
    </div>
  )
}
