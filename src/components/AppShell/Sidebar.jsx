import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProject } from '../../context/ProjectContext'
import LanguageSwitcher from '../LanguageSwitcher'

/* ─── SVG Icons (16x16, outlined, stroke="currentColor") ─── */
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const FolderIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
const ActivityIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const TaskIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const GanttIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const InspectionIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const FindingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const ActionIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const QCPIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
const CFSIIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const DocIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const ExpiringIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
const MessageIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const TraceIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const TeamIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const SettingsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const ChevronIcon = ({ collapsed }) => <svg className={`sidebar-section-chevron${collapsed ? ' collapsed' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
const ChevronDownIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>

function useSidebarSections() {
  const { t } = useTranslation()
  return [
    {
      items: [
        { Icon: HomeIcon, label: t('sidebar.home'), path: '/app', end: true },
        { Icon: FolderIcon, label: t('sidebar.dashboard'), path: '/app/dashboard' },
      ],
    },
    {
      label: t('sidebar.projectManagement'),
      collapsible: true,
      items: [
        { Icon: ActivityIcon, label: t('sidebar.activities'), path: '/app/activites' },
        { Icon: TaskIcon, label: t('sidebar.tasksResources'), path: '/app/taches' },
        { Icon: GanttIcon, label: t('sidebar.ganttChart'), path: '/app/gantt' },
      ],
    },
    {
      label: t('sidebar.quality'),
      collapsible: true,
      items: [
        { Icon: InspectionIcon, label: t('sidebar.inspections'), path: '/app/inspections' },
        { Icon: FindingIcon, label: t('sidebar.findingsNC'), path: '/app/findings' },
        { Icon: ActionIcon, label: t('sidebar.actions'), path: '/app/actions' },
        { Icon: QCPIcon, label: t('sidebar.qualityControlPlan'), path: '/app/qcp' },
        { Icon: CFSIIcon, label: t('sidebar.cfsi'), path: '/app/cfsi' },
      ],
    },
    {
      label: t('sidebar.library'),
      collapsible: true,
      items: [
        { Icon: DocIcon, label: t('sidebar.documentation'), path: '/app/documentation' },
        { Icon: ExpiringIcon, label: t('sidebar.expiringFiles'), path: '/app/expiring' },
        { Icon: MessageIcon, label: t('sidebar.message'), path: '/app/message' },
      ],
    },
    {
      items: [
        { Icon: TraceIcon, label: t('sidebar.traceability'), path: '/app/traceabilite' },
        { Icon: TeamIcon, label: t('sidebar.team'), path: '/app/team' },
        { Icon: SettingsIcon, label: t('sidebar.settings'), path: '/app/settings' },
      ],
    },
  ]
}

function ProjectDropdown() {
  const { t } = useTranslation()
  const { projects, activeProject, setActiveProject, clearProject } = useProject()
  const [open, setOpen] = useState(false)

  return (
    <div className="sidebar-project-dropdown">
      <label className="sidebar-project-label">{t('sidebar.project')}</label>
      <button className="sidebar-project-btn" onClick={() => setOpen(!open)}>
        <span className="sidebar-project-btn-text">{activeProject?.label || t('sidebar.allProjects')}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="sidebar-project-list">
          <div
            className={`sidebar-project-option${!activeProject ? ' selected' : ''}`}
            onClick={() => { clearProject(); setOpen(false) }}
          >
            {t('sidebar.allProjects')}
          </div>
          {projects.map(p => (
            <div
              key={p.id}
              className={`sidebar-project-option${activeProject?.id === p.id ? ' selected' : ''}`}
              onClick={() => { setActiveProject(p); setOpen(false) }}
            >
              {p.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ open = true }) {
  const sections = useSidebarSections()
  const [expanded, setExpanded] = useState({})

  const toggleSection = (label) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }))
  }

  if (!open) return null

  return (
    <aside className="app-sidebar">
      <ProjectDropdown />
      <nav className="sidebar-nav">
        {sections.map((section, si) => (
          <div key={si} className="sidebar-section">
            {section.label && (
              <div
                className="sidebar-section-label"
                onClick={() => section.collapsible && toggleSection(section.label)}
              >
                <span>{section.label}</span>
                {section.collapsible && <ChevronIcon collapsed={!expanded[section.label]} />}
              </div>
            )}
            {(!section.collapsible || !section.label || expanded[section.label]) &&
              section.items.map((item) => (
                <NavLink
                  key={item.path + item.label}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
                >
                  <item.Icon />
                  <span>{item.label}</span>
                </NavLink>
              ))
            }
          </div>
        ))}
      </nav>
      <LanguageSwitcher variant="sidebar" />
    </aside>
  )
}
