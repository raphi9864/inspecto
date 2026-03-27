import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext'
import { DemoProvider } from './context/DemoContext'
import App from './App'
import DemoOverlay from './components/Demo/DemoOverlay'
import DemoAvatar from './components/Demo/DemoAvatar'
import DemoSpotlight from './components/Demo/DemoSpotlight'
import DemoProgressBar from './components/Demo/DemoProgressBar'
import gsap from 'gsap'
import './i18n'
import './css/main.css'

// Suppress GSAP "target not found" warnings (lazy-loaded pages)
gsap.config({ nullTargetWarn: false })
import './css/animations.css'
import './css/demo.css'

// Apply saved theme (dark by default)
const savedTheme = localStorage.getItem('inspecto-theme') || 'dark'
document.documentElement.dataset.theme = savedTheme

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProjectProvider>
        <DemoProvider>
          <App />
          <DemoOverlay />
          <DemoAvatar />
          <DemoSpotlight />
          <DemoProgressBar />
        </DemoProvider>
      </ProjectProvider>
    </BrowserRouter>
  </React.StrictMode>
)
