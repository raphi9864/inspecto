import { useState, useEffect, useCallback } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MainMenu from './MainMenu'
import AnimatedOutlet from './AnimatedOutlet'
import ToastContainer from '../Toast'
import FakeChatbot from '../Demo/FakeChatbot'
import '../../css/pages.css'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mainMenuOpen, setMainMenuOpen] = useState(false)

  /* Close mobile sidebar on route change or resize above mobile breakpoint */
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} mobileOpen={mobileSidebarOpen} onMobileClose={closeMobileSidebar} />
      <div className="app-main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
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
