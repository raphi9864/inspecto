import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import Typed from 'typed.js'
import Avatar from './Avatar'
import SpeechBubble from './SpeechBubble'
import CategoryCard from './CategoryCard'
import { useDemoContext } from '../../context/DemoContext'
import WelcomeModal from '../Demo/WelcomeModal'

/* ─── SVG Icons for subcategories (16×16 outlined) ─── */
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const TaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const GanttIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const InspectionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)
const FindingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const ActionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)
const QCPIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
)
const CFSIIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)
const ExpiringIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
)
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const StatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 32L14 18l8 6 12-18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const TraceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const TeamIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

/* ─── Category icons (40×40) ─── */
const ProjectMgmtIcon = () => (
  <svg className="cat-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M4 14h32" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 6v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 6v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 22h8M10 28h5" stroke="var(--cat-accent)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="29" cy="27" r="6" stroke="var(--cat-accent)" strokeWidth="1.5" />
    <path d="M26 27l2 2 4-4" stroke="var(--cat-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const QualityIcon = () => (
  <svg className="cat-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 3L6 9v10c0 10 14 18 14 18s14-8 14-18V9L20 3z" stroke="currentColor" strokeWidth="2" />
    <path d="M14 20l4 4 8-8" stroke="var(--cat-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const LibraryIcon = () => (
  <svg className="cat-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6h8l2 3h18a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" />
    <path d="M12 20h16M12 25h10" stroke="var(--cat-accent)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const DashboardIcon = () => (
  <svg className="cat-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="22" y="4" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="22" y="16" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="4" y="22" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12l3-4 3 2 4-4" stroke="var(--cat-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ─── Categories data ─── */
const CATEGORIES = [
  {
    key: 'project-management',
    title: 'Project Management',
    accent: '#2ea3f2',
    icon: <ProjectMgmtIcon />,
    position: 'top-left',
    subcategories: [
      { label: 'Activities', route: '/app/activites', description: 'Planning et suivi des activit\u00e9s projet', icon: <ActivityIcon /> },
      { label: 'Tasks & Resources', route: '/app/taches', description: 'Gestion des t\u00e2ches et allocation des ressources', icon: <TaskIcon /> },
      { label: 'Gantt chart', route: '/app/gantt', description: 'Diagramme de Gantt interactif', icon: <GanttIcon /> },
    ],
  },
  {
    key: 'quality',
    title: 'Quality',
    accent: '#38a169',
    icon: <QualityIcon />,
    position: 'top-right',
    subcategories: [
      { label: 'Inspections', route: '/app/inspections', description: 'Planification et ex\u00e9cution des audits terrain', icon: <InspectionIcon /> },
      { label: 'Findings / NC', route: '/app/findings', description: 'Gestion des non-conformit\u00e9s et constats', icon: <FindingIcon /> },
      { label: 'Actions', route: '/app/actions', description: "Plans d\u2019actions correctives et pr\u00e9ventives", icon: <ActionIcon /> },
      { label: 'Quality control plan', route: '/app/qcp', description: 'Plans de contr\u00f4le qualit\u00e9 (QCP)', icon: <QCPIcon /> },
      { label: 'CFSI', route: '/app/cfsi', description: 'Conformit\u00e9 fournisseurs et sous-traitants', icon: <CFSIIcon /> },
    ],
  },
  {
    key: 'library',
    title: 'Library',
    accent: '#805AD5',
    icon: <LibraryIcon />,
    position: 'bottom-left',
    subcategories: [
      { label: 'Documentation', route: '/app/documentation', description: 'Biblioth\u00e8que documentaire centralis\u00e9e', icon: <DocIcon /> },
      { label: 'Expiring files', route: '/app/expiring', description: 'Alertes documents arrivant \u00e0 expiration', icon: <ExpiringIcon /> },
      { label: 'Message', route: '/app/message', description: 'Messagerie interne projet', icon: <MessageIcon /> },
    ],
  },
  {
    key: 'dashboard-analytics',
    title: 'Dashboard & Analytics',
    accent: '#e53e3e',
    icon: <DashboardIcon />,
    position: 'bottom-right',
    subcategories: [
      { label: 'Dashboard', route: '/app/dashboard', description: 'Tableau de bord KPIs en temps r00e9el', icon: <HomeIcon /> },
      { label: 'Statistics', route: '/app/statistiques', description: 'Statistiques et analyses avanc\u00e9es', icon: <StatsIcon /> },
      { label: 'Traceability', route: '/app/traceabilite', description: 'Tra\u00e7abilit\u00e9 compl\u00e8te des actions', icon: <TraceIcon /> },
      { label: 'Team', route: '/app/team', description: 'Gestion des \u00e9quipes et permissions', icon: <TeamIcon /> },
    ],
  },
]

export default function Presenter({ introDoneOverride }) {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const centerRef = useRef(null)
  const textRef = useRef(null)
  const soundWaveRef = useRef(null)
  const navigate = useNavigate()
  const outletContext = useOutletContext()
  const introDone = introDoneOverride ?? outletContext?.introDone ?? true
  const demo = useDemoContext()
  const [showWelcome, setShowWelcome] = useState(false)

  /* ─── Bug fix #1 & #2: track ALL Typed instances in refs ─── */
  const initialTypedRef = useRef(null)
  const hoverTypedRef = useRef(null)

  /* ─── Bug fix #3: track sound wave GSAP tween ─── */
  const soundAnimRef = useRef(null)

  /* ─── Bug fix #4 & #7: track ALL setTimeout IDs for cleanup ─── */
  const timeoutsRef = useRef(new Set())

  /* ─── Bug fix #5: track which category is hovered ─── */
  const expandedCatRef = useRef(null)

  /* ─── State ─── */
  const [expandedCategory, setExpandedCategory] = useState(null)

  /* ─── Safe timeout helper (bug fix #7) ─── */
  const safeTimeout = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id)
      fn()
    }, ms)
    timeoutsRef.current.add(id)
    return id
  }, [])

  /* ─── Sound wave ─── */
  function startSoundWave() {
    if (!soundWaveRef.current) return
    /* Bug fix #3: kill existing before creating new */
    if (soundAnimRef.current) {
      soundAnimRef.current.kill()
      soundAnimRef.current = null
    }
    soundAnimRef.current = gsap.to(soundWaveRef.current.querySelectorAll('span'), {
      scaleY: () => gsap.utils.random(0.25, 1),
      duration: 0.4,
      stagger: { each: 0.08, repeat: -1, yoyo: true },
      ease: 'power1.inOut',
      transformOrigin: 'bottom center',
    })
  }

  function stopSoundWave() {
    if (soundAnimRef.current) {
      soundAnimRef.current.pause()
      gsap.to(soundWaveRef.current?.querySelectorAll('span') || [], {
        scaleY: 0.3,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
  }

  /* ─── Typed.js helper: safely destroy + clear + create ─── */
  function safeTyped(ref, text, opts = {}) {
    /* Bug fix #2: always destroy previous before creating new */
    if (ref.current) {
      ref.current.destroy()
      ref.current = null
    }
    if (textRef.current) {
      textRef.current.innerHTML = ''
    }
    if (!textRef.current) return
    ref.current = new Typed(textRef.current, {
      strings: [text],
      typeSpeed: opts.typeSpeed ?? 20,
      showCursor: false,
      startDelay: opts.startDelay ?? 0,
      onComplete: opts.onComplete,
    })
  }

  /* ─── Initial entrance animation ─── */
  useEffect(() => {
    if (!introDone || !containerRef.current) return

    const ctx = gsap.context(() => {
      /* Set initial states */
      gsap.set('#avatar-human', { scale: 0.3, opacity: 0, rotation: -8 })
      gsap.set('#sound-wave', { opacity: 0, y: 8 })
      gsap.set('.speech-bubble', { opacity: 0, y: 30, scale: 0.9 })
      gsap.set('.category-card', { opacity: 0, y: 30, scale: 0.95 })
      gsap.set('.presenter-footer', { opacity: 0, y: 15 })

      /* Avatar entrance */
      gsap.to('#avatar-human', {
        scale: 1, opacity: 1, rotation: 0, duration: 1,
        ease: 'elastic.out(1, 0.6)', delay: 0.2,
      })
      gsap.to('#sound-wave', {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.6,
      })
      gsap.to('.speech-bubble', {
        opacity: 1, y: 0, scale: 1, duration: 0.7,
        ease: 'back.out(1.8)', delay: 0.7,
      })

      /* Stagger category cards in: top-left, top-right, bottom-left, bottom-right */
      gsap.to('.category-card', {
        opacity: 1, y: 0, scale: 1, duration: 0.6,
        stagger: 0.12, ease: 'power3.out', delay: 0.8,
      })

      gsap.to('.presenter-footer', {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 1.6,
      })

      /* Bug fix #1: store initial Typed instance */
      startSoundWave()
      safeTyped(initialTypedRef, t('presenter.greeting'), {
        typeSpeed: 22,
        startDelay: 900,
        onComplete: () => {
          safeTimeout(() => stopSoundWave(), 800)
        },
      })
    }, containerRef)

    return () => {
      ctx.revert()
      /* Bug fix #1: destroy initial typed on unmount */
      if (initialTypedRef.current) {
        initialTypedRef.current.destroy()
        initialTypedRef.current = null
      }
    }
  }, [introDone])

  /* ─── Full cleanup on unmount (bug fix #4, #6, #7) ─── */
  useEffect(() => {
    return () => {
      /* Bug fix #6: destroy all Typed instances */
      if (initialTypedRef.current) {
        initialTypedRef.current.destroy()
        initialTypedRef.current = null
      }
      if (hoverTypedRef.current) {
        hoverTypedRef.current.destroy()
        hoverTypedRef.current = null
      }
      /* Bug fix #3: kill sound animation */
      if (soundAnimRef.current) {
        soundAnimRef.current.kill()
        soundAnimRef.current = null
      }
      /* Bug fix #7: clear ALL timeouts */
      timeoutsRef.current.forEach((id) => clearTimeout(id))
      timeoutsRef.current.clear()
    }
  }, [])

  /* ─── Expand a category ─── */
  function handleExpand(catKey) {
    if (expandedCategory) return
    expandedCatRef.current = catKey

    /* Bug fix #1: destroy initial typed when user interacts */
    if (initialTypedRef.current) {
      initialTypedRef.current.destroy()
      initialTypedRef.current = null
    }

    setExpandedCategory(catKey)

    /* Avatar types the category description */
    const text = t(`presenter.categoryTexts.${catKey}`)
    if (text) {
      safeTyped(hoverTypedRef, text, { typeSpeed: 18 })
      startSoundWave()
      safeTimeout(() => stopSoundWave(), text.length * 18 + 800)
    }

    /* Animate avatar shift: if card is on left, avatar goes right, and vice versa */
    const cat = CATEGORIES.find((c) => c.key === catKey)
    if (cat && centerRef.current) {
      const isLeft = cat.position.includes('left')
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.to(centerRef.current, {
        x: isLeft ? 80 : -80,
        duration: prefersReduced ? 0.01 : 0.5,
        ease: 'power2.out',
      })
    }
  }

  /* ─── Collapse back to default view ─── */
  function handleBack() {
    expandedCatRef.current = null
    setExpandedCategory(null)

    /* Return avatar to center */
    if (centerRef.current) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.to(centerRef.current, {
        x: 0,
        duration: prefersReduced ? 0.01 : 0.5,
        ease: 'power2.out',
      })
    }

    /* Reset typed to greeting */
    const greeting = t('presenter.greeting')
    safeTyped(hoverTypedRef, greeting, { typeSpeed: 22 })
    startSoundWave()
    safeTimeout(() => stopSoundWave(), greeting.length * 22 + 800)
  }

  /* ─── Navigate to subcategory page ─── */
  function handleSubcategoryClick(route, cardEl) {
    /* Bug fix #6: destroy all Typed instances before navigation */
    if (initialTypedRef.current) {
      initialTypedRef.current.destroy()
      initialTypedRef.current = null
    }
    if (hoverTypedRef.current) {
      hoverTypedRef.current.destroy()
      hoverTypedRef.current = null
    }
    /* Bug fix #3: kill sound animation */
    if (soundAnimRef.current) {
      soundAnimRef.current.kill()
      soundAnimRef.current = null
    }

    document.body.classList.add('page-leaving')

    /* GSAP zoom animation */
    if (cardEl) {
      gsap.to(cardEl, { scale: 1.05, duration: 0.15, ease: 'power2.in' })
    }
    gsap.to(containerRef.current, {
      scale: 1.08,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      delay: 0.1,
      onComplete: () => {
        document.body.classList.remove('page-leaving')
        navigate(route)
      },
    })
  }

  /* ─── Keyboard: Escape to go back ─── */
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && expandedCategory) {
        handleBack()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [expandedCategory])

  return (
    <section id="avatar-section" className="presenter-layout" ref={containerRef}>
      {/* Top-left card */}
      <div className="presenter-cell cell-top-left">
        <CategoryCard
          category={CATEGORIES[0]}
          isExpanded={expandedCategory === CATEGORIES[0].key}
          isHidden={expandedCategory !== null && expandedCategory !== CATEGORIES[0].key}
          onExpand={() => handleExpand(CATEGORIES[0].key)}
          onSubcategoryClick={handleSubcategoryClick}
          onBack={handleBack}
          position={CATEGORIES[0].position}
        />
      </div>

      {/* Center: Avatar + Speech bubble (hidden during demo to avoid duplication) */}
      <div className="presenter-center" ref={centerRef}>
        <Avatar soundWaveRef={soundWaveRef} />
        {demo?.status !== 'running' && demo?.status !== 'paused' && (
          <SpeechBubble textRef={textRef} />
        )}
      </div>

      {/* Top-right card */}
      <div className="presenter-cell cell-top-right">
        <CategoryCard
          category={CATEGORIES[1]}
          isExpanded={expandedCategory === CATEGORIES[1].key}
          isHidden={expandedCategory !== null && expandedCategory !== CATEGORIES[1].key}
          onExpand={() => handleExpand(CATEGORIES[1].key)}
          onSubcategoryClick={handleSubcategoryClick}
          onBack={handleBack}
          position={CATEGORIES[1].position}
        />
      </div>

      {/* Bottom-left card */}
      <div className="presenter-cell cell-bottom-left">
        <CategoryCard
          category={CATEGORIES[2]}
          isExpanded={expandedCategory === CATEGORIES[2].key}
          isHidden={expandedCategory !== null && expandedCategory !== CATEGORIES[2].key}
          onExpand={() => handleExpand(CATEGORIES[2].key)}
          onSubcategoryClick={handleSubcategoryClick}
          onBack={handleBack}
          position={CATEGORIES[2].position}
        />
      </div>

      {/* Bottom-right card */}
      <div className="presenter-cell cell-bottom-right">
        <CategoryCard
          category={CATEGORIES[3]}
          isExpanded={expandedCategory === CATEGORIES[3].key}
          isHidden={expandedCategory !== null && expandedCategory !== CATEGORIES[3].key}
          onExpand={() => handleExpand(CATEGORIES[3].key)}
          onSubcategoryClick={handleSubcategoryClick}
          onBack={handleBack}
          position={CATEGORIES[3].position}
        />
      </div>

      {/* CTA buttons (E2) */}
      {!expandedCategory && (
        <div className="presenter-cta-row">
          <button
            className="presenter-cta presenter-cta--demo"
            onClick={() => {
              if (demo?.status === 'idle' || demo?.status === 'complete') {
                sessionStorage.removeItem('demo-seen')
                const welcomed = localStorage.getItem('inspecto_welcome_done')
                if (welcomed) { demo.startDemo() }
                else { setShowWelcome(true) }
              }
            }}
            disabled={demo?.status === 'running'}
            data-demo-target="presenter-demo-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {t('presenter.startDemo')}
          </button>
          <a
            href="https://inspectogroup.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="presenter-cta presenter-cta--meeting"
            data-demo-target="presenter-meeting-btn"
          >
            {t('presenter.bookMeeting')}
          </a>
        </div>
      )}

      {showWelcome && (
        <WelcomeModal onClose={() => { setShowWelcome(false); demo.startDemo() }} />
      )}
    </section>
  )
}
