import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import Topbar from './Topbar'
import MainMenu from './MainMenu'
import ToastContainer from '../Toast'
import '../../css/pages.css'

export default function TemplateShell() {
  const [mainMenuOpen, setMainMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className="template-sidebar">
        <div className="template-sidebar-title">Navigation</div>
        <NavLink
          to="/templates"
          end
          className={({ isActive }) => `template-sidebar-item${isActive ? ' active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <span>Customize templates</span>
        </NavLink>
        <NavLink
          to="/templates/fieldtypes"
          className={({ isActive }) => `template-sidebar-item${isActive ? ' active' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
          <span>Customize fieldtypes</span>
        </NavLink>
      </aside>
      <div className="app-main">
        <Topbar onOpenMainMenu={() => setMainMenuOpen(true)} />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
      <MainMenu open={mainMenuOpen} onClose={() => setMainMenuOpen(false)} />
      <ToastContainer />
    </div>
  )
}
