import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import gsap from "gsap"

export default function AnimatedOutlet() {
  const containerRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      )
    })
    return () => ctx.revert()
  }, [location.pathname])

  return (
    <div ref={containerRef} style={{ height: "100%" }}>
      <Outlet />
    </div>
  )
}
