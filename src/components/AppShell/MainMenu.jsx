import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const MENU_ITEMS = [
  { icon: 'home', label: 'Home', path: '/home' },
  { icon: 'folder', label: 'Project management', path: '/app' },
  { icon: 'template', label: 'Template editing', path: '/templates' },
  { icon: 'stats', label: 'Statistics', path: '/statistics' },
  { icon: 'advanced', label: 'Advanced Statistics', path: '/advanced-stats' },
  { icon: 'gantt', label: 'Gantt chart', path: '/global-gantt' },
]

const icons = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  folder: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  template: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  stats: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  advanced: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  gantt: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="12" height="4" rx="1"/><rect x="3" y="16" width="15" height="4" rx="1"/></svg>,
  help: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
}

export default function MainMenu({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const panelRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (open) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(panelRef.current, { x: -260 }, { x: 0, duration: 0.3, ease: 'power2.out' })
    }
  }, [open])

  const handleClose = () => {
    gsap.to(panelRef.current, { x: -260, duration: 0.2, ease: 'power2.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose })
  }

  const handleNav = (path) => {
    navigate(path)
    handleClose()
  }

  const isActive = (path) => {
    if (path === '/app') return location.pathname.startsWith('/app')
    if (path === '/templates') return location.pathname.startsWith('/templates')
    return location.pathname === path
  }

  if (!open) return null

  return (
    <div className="main-menu-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="main-menu-panel" ref={panelRef} onClick={e => e.stopPropagation()}>
        <div className="main-menu-header">Menu</div>

        <nav className="main-menu-nav">
          {MENU_ITEMS.map(item => (
            <button
              key={item.path}
              className={`main-menu-item${isActive(item.path) ? ' active' : ''}`}
              onClick={() => handleNav(item.path)}
            >
              {icons[item.icon]}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="main-menu-footer">
          <button className="main-menu-item" onClick={() => { handleClose() }}>
            {icons.help}
            <span>Help</span>
          </button>
        </div>
      </div>
    </div>
  )
}
