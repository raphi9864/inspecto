import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PresenterLayout from './components/Presenter/PresenterLayout'
import Presenter from './components/Presenter/Presenter'
import AppShell from './components/AppShell/AppShell'
import StandaloneShell from './components/AppShell/StandaloneShell'
import TemplateShell from './components/AppShell/TemplateShell'

/* ─── Lazy-loaded pages ─── */
const Home = lazy(() => import('./components/pages/Home'))
const HomeGlobal = lazy(() => import('./components/pages/HomeGlobal'))
const Projects = lazy(() => import('./components/pages/Projects'))
const Inspections = lazy(() => import('./components/pages/Inspections'))
const Statistics = lazy(() => import('./components/pages/Statistics'))
const Traceability = lazy(() => import('./components/pages/Traceability'))
const Activities = lazy(() => import('./components/pages/Activities'))
const Documentation = lazy(() => import('./components/pages/Documentation'))
const FormTemplates = lazy(() => import('./components/pages/FormTemplates'))
const Team = lazy(() => import('./components/pages/Team'))
const TasksResources = lazy(() => import('./components/pages/TasksResources'))
const GanttPage = lazy(() => import('./components/pages/GanttPage'))
const FindingsNC = lazy(() => import('./components/pages/FindingsNC'))
const ActionsPage = lazy(() => import('./components/pages/ActionsPage'))
const Settings = lazy(() => import('./components/pages/Settings'))
const QualityControlPlan = lazy(() => import('./components/pages/QualityControlPlan'))
const CFSIPage = lazy(() => import('./components/pages/CFSIPage'))
const RFF = lazy(() => import('./components/pages/RFF'))
const CustomizeTemplates = lazy(() => import('./components/pages/CustomizeTemplates'))
const CustomizeFieldtypes = lazy(() => import('./components/pages/CustomizeFieldtypes'))
const GlobalStatistics = lazy(() => import('./components/pages/GlobalStatistics'))
const AdvancedStatistics = lazy(() => import('./components/pages/AdvancedStatistics'))
const GlobalGantt = lazy(() => import('./components/pages/GlobalGantt'))
const StubPage = lazy(() => import('./components/pages/StubPage'))
const ExpiringFiles = lazy(() => import('./components/pages/ExpiringFiles'))
const MessagePage = lazy(() => import('./components/pages/MessagePage'))
const SaeAuditWorkflow = lazy(() => import('./components/pages/SaeAuditWorkflow'))
const SaeGed = lazy(() => import('./components/pages/SaeGed'))

/* ─── Shared loading spinner ─── */
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '200px',
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '3px solid var(--border-primary, rgba(255,255,255,0.08))',
        borderTopColor: 'var(--blue, #1a6fc4)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Presenter (intro) */}
        <Route path="/" element={<PresenterLayout />}>
          <Route index element={<Presenter />} />
        </Route>

        {/* Home Global (no sidebar) */}
        <Route path="/home" element={<StandaloneShell />}>
          <Route index element={<HomeGlobal />} />
        </Route>

        {/* Project management (full sidebar) */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Presenter introDoneOverride={true} />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="projets" element={<Projects />} />
          <Route path="inspections" element={<Inspections />} />
          <Route path="statistiques" element={<Statistics />} />
          <Route path="traceabilite" element={<Traceability />} />
          <Route path="activites" element={<Activities />} />
          <Route path="taches" element={<TasksResources />} />
          <Route path="gantt" element={<GanttPage />} />
          <Route path="findings" element={<FindingsNC />} />
          <Route path="actions" element={<ActionsPage />} />
          <Route path="qcp" element={<QualityControlPlan />} />
          <Route path="cfsi" element={<CFSIPage />} />
          <Route path="rff" element={<RFF />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="expiring" element={<ExpiringFiles />} />
          <Route path="team" element={<Team />} />
          <Route path="templates" element={<FormTemplates />} />
          <Route path="message" element={<MessagePage />} />
          <Route path="settings" element={<Settings />} />
          {/* SAE modules — accessible in any mode but surfaced in sidebar only when SAE */}
          <Route path="audit-workflow" element={<SaeAuditWorkflow />} />
          <Route path="ged" element={<SaeGed />} />
        </Route>

        {/* Template editing (own sidebar) */}
        <Route path="/templates" element={<TemplateShell />}>
          <Route index element={<CustomizeTemplates />} />
          <Route path="fieldtypes" element={<CustomizeFieldtypes />} />
        </Route>

        {/* Global pages (no sidebar) */}
        <Route path="/statistics" element={<StandaloneShell />}>
          <Route index element={<GlobalStatistics />} />
        </Route>
        <Route path="/advanced-stats" element={<StandaloneShell />}>
          <Route index element={<AdvancedStatistics />} />
        </Route>
        <Route path="/global-gantt" element={<StandaloneShell />}>
          <Route index element={<GlobalGantt />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
