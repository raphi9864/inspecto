import { useEffect, useRef } from 'react'
import { useDemoContext } from '../../context/DemoContext'
import gsap from 'gsap'

/**
 * SVG overlay with a "hole" cut out over the spotlight target.
 * Everything outside the hole is dimmed.
 */
export default function DemoSpotlight() {
  const { spotlightTarget, status } = useDemoContext()
  const rectRef = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    if (!rectRef.current) return
    if (spotlightTarget) {
      const pad = 8
      gsap.to(rectRef.current, {
        attr: {
          x: spotlightTarget.x - pad,
          y: spotlightTarget.y - pad,
          width: spotlightTarget.w + pad * 2,
          height: spotlightTarget.h + pad * 2,
          rx: 12,
        },
        duration: 0.35,
        ease: 'power2.out',
      })
      gsap.to(svgRef.current, { opacity: 1, duration: 0.25 })
    } else {
      gsap.to(svgRef.current, { opacity: 0, duration: 0.2 })
    }
  }, [spotlightTarget])

  if (status !== 'running') return null

  return (
    <svg
      ref={svgRef}
      className="demo-spotlight"
      style={{ opacity: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            ref={rectRef}
            x="0" y="0" width="0" height="0" rx="12"
            fill="black"
          />
        </mask>
      </defs>
      <rect
        width="100%" height="100%"
        fill="rgba(0,0,0,0.55)"
        mask="url(#spotlight-mask)"
      />
    </svg>
  )
}
