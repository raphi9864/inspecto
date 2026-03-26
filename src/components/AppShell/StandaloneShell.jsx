import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import MainMenu from './MainMenu'
import ToastContainer from '../Toast'
import '../../css/pages.css'

export default function StandaloneShell() {
  const [mainMenuOpen, setMainMenuOpen] = useState(false)

  return (
    <div className="standalone-shell">
      <Topbar onOpenMainMenu={() => setMainMenuOpen(true)} />
      <div className="app-content">
        <Outlet />
      </div>
      <MainMenu open={mainMenuOpen} onClose={() => setMainMenuOpen(false)} />
      <ToastContainer />
    </div>
  )
}
