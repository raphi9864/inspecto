import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MainMenu from './MainMenu'
import AnimatedOutlet from './AnimatedOutlet'
import ToastContainer from '../Toast'
import FakeChatbot from '../Demo/FakeChatbot'
import '../../css/pages.css'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mainMenuOpen, setMainMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} />
      <div className="app-main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onOpenMainMenu={() => setMainMenuOpen(true)}
        />
        <div className="app-content">
          <AnimatedOutlet />
        </div>
      </div>
      <MainMenu open={mainMenuOpen} onClose={() => setMainMenuOpen(false)} />
      <ToastContainer />
      <FakeChatbot />
    </div>
  )
}
