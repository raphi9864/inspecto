import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COUNTRIES = [
  { id: 'france', emphasis: true, d: 'M -1.8,-43.4 L -2.1,-47.0 L -4.8,-47.8 L -4.5,-48.4 L -1.5,-49.6 L 0.1,-49.5 L 1.5,-51.0 L 2.5,-51.1 L 3.2,-50.3 L 4.9,-50.8 L 6.1,-49.9 L 6.8,-48.5 L 7.7,-47.6 L 7.6,-46.4 L 6.8,-44.0 L 5.5,-43.2 L 3.2,-43.3 L 1.8,-41.3 L 3.1,-40.5 L -1.8,-43.4 Z' },
  { id: 'iberia', emphasis: true, d: 'M -9.1,-38.7 L -9.5,-39.5 L -9.3,-41.0 L -8.9,-42.9 L -6.2,-43.6 L -4.5,-43.7 L -1.8,-43.4 L 3.2,-42.4 L 3.1,-40.5 L 1.2,-38.9 L 0.2,-37.6 L -1.1,-36.6 L -5.3,-36.0 L -6.2,-36.1 L -8.9,-37.0 L -9.1,-38.7 Z' },
  { id: 'italy', emphasis: true, d: 'M 7.0,-43.8 L 8.0,-44.4 L 9.5,-44.1 L 12.4,-44.1 L 13.8,-44.4 L 15.2,-41.9 L 15.8,-40.3 L 16.1,-38.9 L 15.6,-38.2 L 15.1,-37.5 L 15.6,-38.2 L 16.0,-37.9 L 18.5,-40.6 L 16.9,-41.0 L 14.8,-41.1 L 12.5,-41.9 L 11.9,-43.9 L 12.4,-44.1 Z' },
  { id: 'germany', emphasis: false, d: 'M 6.1,-49.9 L 6.8,-48.5 L 7.7,-47.6 L 8.0,-47.7 L 10.5,-47.3 L 13.4,-47.7 L 14.3,-48.6 L 15.0,-50.8 L 14.8,-53.9 L 12.5,-54.0 L 10.0,-55.0 L 8.6,-55.4 L 7.9,-57.8 L 5.0,-57.5 L 4.9,-52.7 L 3.4,-51.4 L 2.5,-51.1 L 3.2,-50.3 L 4.9,-50.8 L 6.1,-49.9 Z' },
  { id: 'uk', emphasis: false, d: 'M -5.7,-50.0 L -3.1,-51.0 L -2.9,-53.4 L -3.1,-54.6 L -5.2,-54.7 L -4.9,-57.9 L -3.1,-58.6 L -0.1,-60.8 L 1.8,-60.5 L 1.8,-57.7 L 0.1,-51.4 L 1.4,-51.1 L 0.5,-50.8 L -1.5,-50.7 L -5.7,-50.0 Z' },
  { id: 'poland', emphasis: false, d: 'M 14.3,-48.6 L 15.0,-50.8 L 14.8,-53.9 L 16.0,-54.2 L 18.0,-54.8 L 19.9,-54.4 L 22.0,-54.6 L 24.0,-56.0 L 24.3,-57.6 L 23.5,-59.4 L 25.0,-59.5 L 28.0,-58.5 L 27.5,-55.0 L 26.0,-52.0 L 24.0,-50.5 L 22.5,-49.0 L 20.0,-49.0 L 18.5,-48.0 L 17.0,-48.2 L 14.3,-48.6 Z' },
  { id: 'scandinavia', emphasis: false, d: 'M 5.0,-58.0 L 5.3,-59.3 L 5.0,-61.0 L 6.3,-62.5 L 5.2,-63.5 L 7.5,-65.5 L 9.0,-64.5 L 10.5,-63.4 L 12.0,-64.0 L 14.0,-65.5 L 16.0,-68.5 L 18.0,-69.5 L 20.0,-70.4 L 25.0,-71.0 L 28.0,-70.5 L 28.5,-68.5 L 27.0,-67.5 L 24.0,-65.8 L 22.5,-60.5 L 24.5,-60.2 L 25.0,-59.5 L 23.5,-59.4 L 22.0,-59.9 L 20.5,-59.0 L 18.7,-58.5 L 18.2,-57.2 L 16.5,-56.3 L 12.6,-56.1 L 10.5,-57.7 L 8.7,-57.5 L 8.0,-58.0 L 5.0,-58.0 Z' },
  { id: 'greece', emphasis: false, d: 'M 20.0,-42.0 L 21.5,-41.0 L 22.5,-40.5 L 24.0,-40.7 L 25.5,-41.3 L 26.5,-41.0 L 26.0,-40.0 L 24.5,-38.5 L 23.5,-37.9 L 22.0,-37.0 L 21.5,-38.0 L 20.5,-39.0 L 20.3,-40.0 L 20.0,-42.0 Z' },
]

const CITIES = [
  { name: 'Paris', x: 2.3, y: -48.8 },
  { name: 'Lyon', x: 4.8, y: -45.7 },
  { name: 'Madrid', x: -3.7, y: -40.4 },
  { name: 'London', x: -0.1, y: -51.5 },
  { name: 'Frankfurt', x: 8.7, y: -50.1 },
  { name: 'Milano', x: 9.2, y: -45.5 },
  { name: 'Zürich', x: 8.5, y: -47.4 },
  { name: 'Warsaw', x: 21.0, y: -52.2 },
  { name: 'Barcelona', x: 2.1, y: -41.4 },
  { name: 'Marseille', x: 5.4, y: -43.3 },
  { name: 'Athens', x: 23.7, y: -37.9 },
  { name: 'Toulouse', x: 1.4, y: -43.6 },
]

const ARCS = [
  [0, 1], [0, 2], [1, 5], [4, 7], [2, 8], [0, 3], [6, 4],
]

export default function EuropeWireframe3D({ phase = 0 }) {
  const wrapperRef = useRef(null)
  const svgRef = useRef(null)
  const citiesRef = useRef(null)
  const arcsRef = useRef(null)

  // Phase 0: fade in
  useEffect(() => {
    if (phase >= 0 && svgRef.current) {
      gsap.fromTo(svgRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)' })
    }
  }, [phase])

  // Phase 1: cities stagger in
  useEffect(() => {
    if (phase >= 1 && citiesRef.current) {
      gsap.fromTo(citiesRef.current.querySelectorAll('.city-group'),
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2)', transformOrigin: 'center' }
      )
    }
  }, [phase])

  // Phase 2: arcs draw in
  useEffect(() => {
    if (phase >= 2 && arcsRef.current) {
      const paths = arcsRef.current.querySelectorAll('.arc-path')
      paths.forEach(p => {
        const len = p.getTotalLength()
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.out', stagger: 0.2 })
      })
    }
  }, [phase])

  // Phase 3: move to corner
  useEffect(() => {
    if (phase === 3 && wrapperRef.current) {
      gsap.to(wrapperRef.current, { x: '30vw', y: '-30vh', scale: 0.28, duration: 1.0, ease: 'power3.inOut' })
    }
  }, [phase])

  return (
    <div ref={wrapperRef} className="intro-globe-canvas" style={{ willChange: 'transform' }}>
      <div className="europe-perspective">
        {/* Scan line */}
        <div className="europe-scanline" />
        <svg
          ref={svgRef}
          viewBox="-25 -74 70 40"
          className="europe-svg"
          style={{ opacity: 0 }}
        >
          {/* Country shapes */}
          {COUNTRIES.map(c => (
            <path
              key={c.id}
              d={c.d}
              className={`country-path ${c.emphasis ? 'emphasis' : ''}`}
            />
          ))}

          {/* City markers */}
          <g ref={citiesRef}>
            {CITIES.map((city, i) => (
              <g key={city.name} className="city-group" style={{ opacity: 0 }}>
                <circle cx={city.x} cy={city.y} r="0.35" className="city-dot" />
                <circle cx={city.x} cy={city.y} r="0.35" className="city-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                <text
                  x={city.x + 0.7}
                  y={city.y + (i % 2 === 0 ? -0.4 : 0.7)}
                  className="city-label"
                >{city.name}</text>
              </g>
            ))}
          </g>

          {/* Arc connections */}
          <g ref={arcsRef}>
            {ARCS.map(([fi, ti], idx) => {
              const from = CITIES[fi], to = CITIES[ti]
              const mx = (from.x + to.x) / 2
              const my = (from.y + to.y) / 2 - 2.5
              return (
                <path
                  key={idx}
                  className="arc-path"
                  d={`M ${from.x},${from.y} Q ${mx},${my} ${to.x},${to.y}`}
                  fill="none"
                  stroke="#d7294a"
                  strokeWidth="0.2"
                  opacity="0.5"
                  strokeDasharray="1 1"
                />
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}
