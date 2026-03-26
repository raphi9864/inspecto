import { useEffect, useRef, useState, useMemo } from 'react'
import { geoOrthographic, geoPath, geoInterpolate } from 'd3-geo'
import { feature } from 'topojson-client'
import gsap from 'gsap'

/* ═══════════════════════════════════════════════════════════════
   EuropeMap — Real GeoJSON data rendered via d3-geo projection
   Orthographic projection centered on Europe, SVG output.
   ═══════════════════════════════════════════════════════════════ */

const EUROPE_IDS = new Set([
  '008','020','040','056','070','100','112','191','196','203',
  '208','233','246','250','276','292','300','348','352','372',
  '380','428','438','440','442','470','492','498','528','578',
  '616','620','642','643','688','703','705','724','752','756',
  '792','804','826','832','833',
])

const HIGHLIGHT_IDS = new Set(['250','380','724','276']) // FR, IT, ES, DE

const CITIES = [
  { name: 'Paris',      lon: 2.3,   lat: 48.8  },
  { name: 'Lyon',       lon: 4.8,   lat: 45.7  },
  { name: 'Madrid',     lon: -3.7,  lat: 40.4  },
  { name: 'London',     lon: -0.1,  lat: 51.5  },
  { name: 'Frankfurt',  lon: 8.7,   lat: 50.1  },
  { name: 'Milano',     lon: 9.2,   lat: 45.5  },
  { name: 'Zürich',     lon: 8.5,   lat: 47.4  },
  { name: 'Warsaw',     lon: 21.0,  lat: 52.2  },
  { name: 'Barcelona',  lon: 2.1,   lat: 41.4  },
  { name: 'Marseille',  lon: 5.4,   lat: 43.3  },
  { name: 'Athens',     lon: 23.7,  lat: 37.9  },
  { name: 'Toulouse',   lon: 1.4,   lat: 43.6  },
]

const ARC_PAIRS = [
  [0, 1],  // Paris → Lyon
  [0, 2],  // Paris → Madrid
  [1, 5],  // Lyon → Milano
  [4, 7],  // Frankfurt → Warsaw
  [0, 3],  // Paris → London
  [6, 4],  // Zürich → Frankfurt
  [2, 8],  // Madrid → Barcelona
]

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function EuropeWireframe3D({ phase = 0 }) {
  const wrapperRef = useRef(null)
  const svgRef = useRef(null)
  const citiesRef = useRef(null)
  const arcsRef = useRef(null)
  const [topoData, setTopoData] = useState(null)
  const [size, setSize] = useState({ w: 800, h: 600 })

  // Fetch TopoJSON once
  useEffect(() => {
    fetch(TOPO_URL)
      .then(r => r.json())
      .then(setTopoData)
      .catch(() => {})
  }, [])

  // Responsive sizing
  useEffect(() => {
    function measure() {
      if (wrapperRef.current) {
        const { clientWidth: w, clientHeight: h } = wrapperRef.current
        if (w > 0 && h > 0) setSize({ w, h })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Build projection + paths
  const { countryPaths, cityPoints, arcLines } = useMemo(() => {
    if (!topoData) return { countryPaths: [], cityPoints: [], arcLines: [] }

    const scale = Math.min(size.w, size.h) * 1.3
    const projection = geoOrthographic()
      .scale(scale)
      .translate([size.w / 2, size.h / 2])
      .rotate([-15, -52, 0])
      .clipAngle(90)

    const pathGen = geoPath(projection)

    // Countries
    const countries = feature(topoData, topoData.objects.countries).features
    const europeanCountries = countries.filter(f => EUROPE_IDS.has(f.id))
    const countryPaths = europeanCountries.map(f => ({
      id: f.id,
      d: pathGen(f),
      highlight: HIGHLIGHT_IDS.has(f.id),
    })).filter(c => c.d)

    // Cities
    const cityPoints = CITIES.map((c, i) => {
      const xy = projection([c.lon, c.lat])
      if (!xy) return null
      return { ...c, x: xy[0], y: xy[1], i }
    }).filter(Boolean)

    // Arcs — great circle interpolated polylines
    const arcLines = ARC_PAIRS.map(([fi, ti]) => {
      const from = CITIES[fi], to = CITIES[ti]
      const interp = geoInterpolate([from.lon, from.lat], [to.lon, to.lat])
      const pts = []
      for (let t = 0; t <= 1; t += 0.05) {
        const coord = interp(t)
        const xy = projection(coord)
        if (xy) pts.push(xy)
      }
      if (pts.length < 2) return null
      return pts.map(p => p.join(',')).join(' ')
    }).filter(Boolean)

    return { countryPaths, cityPoints, arcLines }
  }, [topoData, size])

  // Phase 0: fade in
  useEffect(() => {
    if (phase >= 0 && svgRef.current && topoData) {
      gsap.fromTo(svgRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)', transformOrigin: 'center' }
      )
    }
  }, [phase, topoData])

  // Phase 1: cities stagger in
  useEffect(() => {
    if (phase >= 1 && citiesRef.current) {
      gsap.fromTo(citiesRef.current.querySelectorAll('.city-group'),
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)', transformOrigin: 'center' }
      )
    }
  }, [phase, cityPoints])

  // Phase 2: arcs draw in
  useEffect(() => {
    if (phase >= 2 && arcsRef.current) {
      const paths = arcsRef.current.querySelectorAll('.arc-path')
      paths.forEach((p, i) => {
        const len = p.getTotalLength()
        gsap.fromTo(p,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.0, delay: i * 0.15, ease: 'power2.out' }
        )
      })
    }
  }, [phase, arcLines])

  // Phase 3: move to corner
  useEffect(() => {
    if (phase === 3 && wrapperRef.current) {
      gsap.to(wrapperRef.current, {
        x: '30vw', y: '-30vh', scale: 0.28,
        duration: 1.0, ease: 'power3.inOut',
      })
    }
  }, [phase])

  return (
    <div ref={wrapperRef} className="intro-globe-canvas" style={{ willChange: 'transform' }}>
      <div className="europe-perspective">
        <div className="europe-scanline" />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${size.w} ${size.h}`}
          className="europe-svg"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          {/* Country shapes */}
          {countryPaths.map(c => (
            <path
              key={c.id}
              d={c.d}
              className={`country-path${c.highlight ? ' emphasis' : ''}`}
            />
          ))}

          {/* Arc connections */}
          <g ref={arcsRef}>
            {arcLines.map((pts, idx) => (
              <polyline
                key={idx}
                className="arc-path"
                points={pts}
                fill="none"
                stroke="#d7294a"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
          </g>

          {/* City markers */}
          <g ref={citiesRef}>
            {cityPoints.map((city) => (
              <g key={city.name} className="city-group" style={{ opacity: 0 }}>
                <circle cx={city.x} cy={city.y} r="3" className="city-dot" />
                <circle cx={city.x} cy={city.y} r="3" className="city-pulse"
                  style={{ animationDelay: `${city.i * 0.2}s` }} />
                <text
                  x={city.x + 6}
                  y={city.y + (city.i % 2 === 0 ? -5 : 12)}
                  className="city-label"
                >{city.name}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
