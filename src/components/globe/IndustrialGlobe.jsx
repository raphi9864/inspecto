import { useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════════
   IndustrialGlobe — Pure Canvas 2D wireframe globe
   No Three.js. Just math, lines, and presence.
   ═══════════════════════════════════════════════════════════════ */

const CITIES = [
  { name: 'Paris',      lat: 48.8566,  lon: 2.3522  },
  { name: 'Lyon',       lat: 45.7640,  lon: 4.8357  },
  { name: 'Marseille',  lat: 43.2965,  lon: 5.3698  },
  { name: 'Toulouse',   lat: 43.6047,  lon: 1.4442  },
  { name: 'Milano',     lat: 45.4642,  lon: 9.1900  },
  { name: 'Madrid',     lat: 40.4168,  lon: -3.7038 },
  { name: 'Zürich',     lat: 47.3769,  lon: 8.5417  },
  { name: 'Warsaw',     lat: 52.2297,  lon: 21.0122 },
  { name: 'Athens',     lat: 37.9838,  lon: 23.7275 },
  { name: 'London',     lat: 51.5074,  lon: -0.1278 },
  { name: 'Frankfurt',  lat: 50.1109,  lon: 8.6821  },
  { name: 'Barcelona',  lat: 41.3874,  lon: 2.1686  },
]

const ARCS = [
  [0, 1],  // Paris → Lyon
  [0, 5],  // Paris → Madrid
  [1, 4],  // Lyon → Milano
  [4, 10], // Milano → Frankfurt
  [10, 7], // Frankfurt → Warsaw
  [5, 11], // Madrid → Barcelona
]

const DEG = Math.PI / 180

function latLonTo3D(lat, lon, r) {
  const phi = (90 - lat) * DEG
  const theta = (lon + 180) * DEG
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y:  r * Math.cos(phi),
    z:  r * Math.sin(phi) * Math.sin(theta),
  }
}

function project(p, cx, cy, fov) {
  const scale = fov / (fov + p.z)
  return { x: cx + p.x * scale, y: cy - p.y * scale, scale, behind: p.z < -fov * 0.15 }
}

function rotateY(p, angle) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return { x: p.x * cos - p.z * sin, y: p.y, z: p.x * sin + p.z * cos }
}

export default function IndustrialGlobe({ phase = 0, style }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    rotation: 0,
    globeAlpha: 0,
    markerAlpha: 0,
    arcProgress: 0,
    shrink: 0,
    hovered: false,
    time: 0,
  })
  const rafRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth
    const H = canvas.clientHeight

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr
      canvas.height = H * dpr
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const s = stateRef.current
    s.time += 1

    // Animate state based on phase
    const speed = s.hovered ? 0.005 : 0.003
    s.rotation += speed

    // Smooth transitions
    if (phase >= 0) s.globeAlpha += (1 - s.globeAlpha) * 0.04
    if (phase >= 1) s.markerAlpha += (1 - s.markerAlpha) * 0.03
    if (phase >= 2) s.arcProgress += (1 - s.arcProgress) * 0.02
    if (phase >= 3) s.shrink += (1 - s.shrink) * 0.03

    if (s.globeAlpha < 0.005) {
      rafRef.current = requestAnimationFrame(draw)
      return
    }

    const baseRadius = Math.min(W, H) * 0.38
    const scale = 1 - s.shrink * 0.5
    const radius = baseRadius * scale
    const cx = W / 2 + s.shrink * (W * 0.3)
    const cy = H / 2 - s.shrink * (H * 0.25)
    const fov = 600

    ctx.globalAlpha = s.globeAlpha

    // ─── Atmosphere glow ───
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.5)
    glowGrad.addColorStop(0, `rgba(0,47,95,${0.15 * s.globeAlpha})`)
    glowGrad.addColorStop(0.4, `rgba(0,47,95,${0.25 * s.globeAlpha})`)
    glowGrad.addColorStop(0.7, `rgba(46,163,242,${0.12 * s.globeAlpha})`)
    glowGrad.addColorStop(1, 'rgba(46,163,242,0)')
    ctx.fillStyle = glowGrad
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2)
    ctx.fill()

    // ─── Wireframe sphere ───
    ctx.strokeStyle = `rgba(0,47,95,${0.35 * s.globeAlpha})`
    ctx.lineWidth = 0.6

    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath()
      let first = true
      for (let lon = 0; lon <= 360; lon += 4) {
        const p3 = latLonTo3D(lat, lon, radius)
        const rp = rotateY(p3, s.rotation)
        const pp = project(rp, cx, cy, fov)
        if (rp.z > 0) {
          if (first) { ctx.moveTo(pp.x, pp.y); first = false }
          else ctx.lineTo(pp.x, pp.y)
        } else {
          first = true
        }
      }
      ctx.stroke()
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 20) {
      ctx.beginPath()
      let first = true
      for (let lat = -90; lat <= 90; lat += 4) {
        const p3 = latLonTo3D(lat, lon, radius)
        const rp = rotateY(p3, s.rotation)
        const pp = project(rp, cx, cy, fov)
        if (rp.z > 0) {
          if (first) { ctx.moveTo(pp.x, pp.y); first = false }
          else ctx.lineTo(pp.x, pp.y)
        } else {
          first = true
        }
      }
      ctx.stroke()
    }

    // ─── Edge ring (equator emphasis) ───
    ctx.strokeStyle = `rgba(46,163,242,${0.15 * s.globeAlpha})`
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let lon = 0; lon <= 360; lon += 2) {
      const p3 = latLonTo3D(0, lon, radius)
      const rp = rotateY(p3, s.rotation)
      const pp = project(rp, cx, cy, fov)
      if (rp.z > 0) {
        if (lon === 0) ctx.moveTo(pp.x, pp.y)
        else ctx.lineTo(pp.x, pp.y)
      }
    }
    ctx.stroke()

    // ─── City markers ───
    if (s.markerAlpha > 0.01) {
      const cityPositions = CITIES.map((city, i) => {
        const p3 = latLonTo3D(city.lat, city.lon, radius)
        const rp = rotateY(p3, s.rotation)
        const pp = project(rp, cx, cy, fov)
        const visible = rp.z > 0
        // Stagger appearance
        const delay = i * 0.08
        const alpha = Math.max(0, Math.min(1, (s.markerAlpha - delay) / (1 - delay)))
        return { ...city, pp, visible, alpha, rp }
      })

      cityPositions.forEach((city, i) => {
        if (!city.visible || city.alpha < 0.01) return

        const { pp, alpha } = city
        const pulse = Math.sin(s.time * 0.06 + i * 0.7) * 0.3 + 0.7

        // Ping ring
        const pingPhase = ((s.time + i * 20) % 80) / 80
        if (pingPhase < 0.6) {
          ctx.strokeStyle = `rgba(215,41,74,${(1 - pingPhase / 0.6) * 0.4 * alpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(pp.x, pp.y, 3 + pingPhase * 14, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Dot
        ctx.fillStyle = `rgba(215,41,74,${pulse * alpha})`
        ctx.beginPath()
        ctx.arc(pp.x, pp.y, 2.5 * pp.scale, 0, Math.PI * 2)
        ctx.fill()

        // Glow
        ctx.shadowColor = 'rgba(215,41,74,0.6)'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(pp.x, pp.y, 1.5 * pp.scale, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // Label
        ctx.font = `${Math.round(9 * pp.scale)}px Inter, sans-serif`
        ctx.fillStyle = `rgba(255,255,255,${0.6 * alpha})`
        ctx.textAlign = 'left'
        ctx.fillText(city.name, pp.x + 6 * pp.scale, pp.y - 6 * pp.scale)
      })

      // ─── Arc connections ───
      if (s.arcProgress > 0.01) {
        ARCS.forEach(([fromIdx, toIdx], arcI) => {
          const from = cityPositions[fromIdx]
          const to = cityPositions[toIdx]
          if (!from.visible || !to.visible || from.alpha < 0.1 || to.alpha < 0.1) return

          const arcDelay = arcI * 0.12
          const progress = Math.max(0, Math.min(1, (s.arcProgress - arcDelay) / (1 - arcDelay)))
          if (progress < 0.01) return

          // Great-circle interpolation with altitude bulge
          const steps = 40
          const drawSteps = Math.floor(steps * progress)

          ctx.strokeStyle = `rgba(215,41,74,${0.45 * progress})`
          ctx.lineWidth = 1
          ctx.setLineDash([3, 4])
          ctx.beginPath()

          for (let s2 = 0; s2 <= drawSteps; s2++) {
            const t = s2 / steps
            // Slerp between the two 3D positions
            const p = {
              x: from.rp.x * (1 - t) + to.rp.x * t,
              y: from.rp.y * (1 - t) + to.rp.y * t,
              z: from.rp.z * (1 - t) + to.rp.z * t,
            }
            // Normalize to sphere surface + altitude bulge
            const len = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z)
            const bulge = 1 + Math.sin(t * Math.PI) * 0.12
            p.x = (p.x / len) * radius * bulge
            p.y = (p.y / len) * radius * bulge
            p.z = (p.z / len) * radius * bulge

            const pp = project(p, cx, cy, fov)
            if (s2 === 0) ctx.moveTo(pp.x, pp.y)
            else ctx.lineTo(pp.x, pp.y)
          }
          ctx.stroke()
          ctx.setLineDash([])
        })
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [phase])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  // Hover detection
  const handleMouseEnter = useCallback(() => { stateRef.current.hovered = true }, [])
  const handleMouseLeave = useCallback(() => { stateRef.current.hovered = false }, [])

  return (
    <canvas
      ref={canvasRef}
      className="intro-globe-canvas"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}
