import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'
import { exportCSV, exportXLSX } from '../../utils/exportUtils'
import FilterPanel from '../shared/FilterPanel'

const INITIAL = [
  { id: 1, name: 'Serrage vis flasques moteur', assignee: 'S. Dupont', start: '2026-03-31', end: '2026-04-01', status: 'In Progress', priority: 'High', progress: 60 },
  { id: 2, name: 'Verification soudure TIG bride', assignee: 'A. Leroy', start: '2026-03-25', end: '2026-03-28', status: 'Overdue', priority: 'Critical', progress: 30 },
  { id: 3, name: 'Controle dimensionnel palier', assignee: 'J. Martin', start: '2026-04-01', end: '2026-04-03', status: 'Open', priority: 'Medium', progress: 0 },
  { id: 4, name: 'Audit fournisseur composants aero', assignee: 'R. Attal', start: '2026-03-20', end: '2026-03-22', status: 'Closed', priority: 'High', progress: 100 },
  { id: 5, name: 'Calibration poste soudage S3', assignee: 'A. Leroy', start: '2026-03-19', end: '2026-03-19', status: 'Closed', priority: 'Critical', progress: 100 },
  { id: 6, name: 'Mise a jour check-list pre-demarrage', assignee: 'J. Martin', start: '2026-03-25', end: '2026-03-30', status: 'In Progress', priority: 'Medium', progress: 45 },
  { id: 7, name: 'Revue CAPA NC-2026-0043', assignee: 'R. Attal', start: '2026-03-25', end: '2026-03-26', status: 'Open', priority: 'High', progress: 0 },
  { id: 8, name: 'Preparation echantillons test hydraulique', assignee: 'S. Dupont', start: '2026-04-02', end: '2026-04-05', status: 'Open', priority: 'Low', progress: 0 },
  { id: 9, name: 'Documentation rapport final lot 42', assignee: 'M. Chen', start: '2026-04-05', end: '2026-04-10', status: 'Open', priority: 'Medium', progress: 0 },
  { id: 10, name: 'Inspection reception materiaux Phase 2', assignee: 'T. Bernard', start: '2026-04-08', end: '2026-04-12', status: 'Open', priority: 'High', progress: 0 },
]

const ASSIGNEES = ['R. Attal', 'S. Dupont', 'J. Martin', 'A. Leroy', 'M. Chen', 'T. Bernard']
const STATUSES = ['Open', 'In Progress', 'Overdue', 'Closed']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

const statusStyle = (s) => {
  const map = { 'Open': { bg: '#ebf5ff', color: 'var(--blue)' }, 'In Progress': { bg: '#fffaf0', color: 'var(--status-warning)' }, 'Overdue': { bg: '#fff5f5', color: 'var(--status-overdue)' }, 'Closed': { bg: '#f0fff4', color: 'var(--status-success)' } }
  return map[s] || map['Open']
}
const priorityStyle = (p) => {
  const map = { 'Critical': { bg: '#fff5f5', color: 'var(--status-overdue)' }, 'High': { bg: '#fffaf0', color: 'var(--status-warning)' }, 'Medium': { bg: '#ebf5ff', color: 'var(--blue)' }, 'Low': { bg: '#f7fafc', color: 'var(--text-secondary)' } }
  return map[p] || map['Medium']
}

export default function TasksResources() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [tasks, setTasks] = useState(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', assignee: ASSIGNEES[0], start: '', end: '', status: 'Open', priority: 'Medium' })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out', delay: 0.2 })
    }, containerRef)
    return () => ctx.revert()
  }, [tasks.length])

  const openNew = () => { setEditing(null); setForm({ name: '', assignee: ASSIGNEES[0], start: '', end: '', status: 'Open', priority: 'Medium' }); setShowModal(true) }
  const openEdit = (task) => { setEditing(task); setForm({ name: task.name, assignee: task.assignee, start: task.start, end: task.end, status: task.status, priority: task.priority }); setShowModal(true) }
  const handleDelete = (id) => { if (confirm(t('tasks.deleteConfirm'))) { setTasks(prev => prev.filter(task => task.id !== id)); showToast(t('tasks.toastDeleted')) } }

  const handleSave = () => {
    if (!form.name || !form.start || !form.end) return
    if (editing) {
      setTasks(prev => prev.map(task => task.id === editing.id ? { ...task, ...form, progress: form.status === 'Closed' ? 100 : task.progress } : task))
      showToast(t('tasks.toastUpdated'))
    } else {
      setTasks(prev => [...prev, { id: Date.now(), ...form, progress: 0 }])
      showToast(t('tasks.toastCreated'))
    }
    setShowModal(false)
  }

  return (
    <div ref={containerRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-outline" onClick={() => setIsFilterOpen(true)}>{t('common.filters')}</button>
          <button className="btn-outline" onClick={() => { exportXLSX(tasks, `inspecto-tasks-${new Date().toISOString().slice(0, 10)}.xlsx`); showToast('Excel exported', 'success') }}>{t('tasks.exportExcel')}</button>
          <button className="btn-outline" onClick={() => { exportCSV(tasks, `inspecto-tasks-${new Date().toISOString().slice(0, 10)}.csv`); showToast('CSV exported', 'success') }}>{t('tasks.exportCSV')}</button>
          <button className="btn-outline" onClick={() => showToast('Import completed', 'info')}>{t('tasks.import')}</button>
        </div>
        <button className="btn-primary" onClick={openNew}>{t('tasks.newTask')}</button>
      </div>

      <div className="panel" style={{ opacity: 1, transform: 'none' }}>
        <div className="panel-header">
          <div className="panel-title">{t('sidebar.tasksResources')}</div>
          <span style={{ fontSize: '0.85rem', color: 'var(--status-success)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>{tasks.length} task(s)</span>
        </div>
        <div className="panel-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>{t('common.name')}</th><th>{t('tasks.assignee')}</th><th>{t('home.startDate')}</th><th>{t('home.endDate')}</th><th>{t('common.status')}</th><th>Priority</th><th>{t('tasks.progressLabel')}</th><th>{t('common.actions')}</th></tr></thead>
            <tbody>
              {tasks.map(task => {
                const ss = statusStyle(task.status); const ps = priorityStyle(task.priority)
                return (
                  <tr key={task.id} onClick={() => openEdit(task)} style={{ cursor: 'pointer' }}>
                    <td><strong>{task.name}</strong></td>
                    <td>{task.assignee}</td>
                    <td>{task.start}</td>
                    <td>{task.end}</td>
                    <td><span style={{ background: ss.bg, color: ss.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>{task.status}</span></td>
                    <td><span style={{ background: ps.bg, color: ps.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>{task.priority}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, minWidth: 50 }}>
                          <div style={{ width: `${task.progress}%`, height: '100%', background: task.progress === 100 ? 'var(--status-success)' : 'var(--blue)', borderRadius: 3 }}></div>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', minWidth: 28 }}>{task.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-icon" title={t('common.edit')} onClick={() => openEdit(task)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button className="btn-icon" title={t('common.delete')} onClick={() => handleDelete(task.id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{editing ? t('tasks.modalTitleEdit') : t('tasks.modalTitleNew')}</h3>
            <div className="modal-field"><label>{t('common.name')} *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="modal-field"><label>{t('tasks.assignee')}</label><select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>{ASSIGNEES.map(a => <option key={a}>{a}</option>)}</select></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="modal-field"><label>{t('home.startDate')} *</label><input type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} /></div>
              <div className="modal-field"><label>{t('home.endDate')} *</label><input type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="modal-field"><label>{t('common.status')}</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="modal-field"><label>Priority</label><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
              <button className="btn-primary" onClick={handleSave}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(f) => { setIsFilterOpen(false); showToast('Filtres appliqués', 'info') }}
        onReset={() => { setIsFilterOpen(false); showToast('Filtres réinitialisés', 'info') }}
        filterConfig={[
          { type: 'select', label: 'Statut', key: 'status', options: [
            { value: '', label: 'Tous' },
            { value: 'open', label: 'Ouvert' },
            { value: 'inProgress', label: 'En cours' },
            { value: 'overdue', label: 'En retard' },
            { value: 'closed', label: 'Clôturé' },
          ]},
          { type: 'dateRange', label: 'Période', fromKey: 'from', toKey: 'to' },
        ]}
      />
    </div>
  )
}
