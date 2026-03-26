import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const INITIAL = [
  { id: 1, name: 'Design', start: '2024-09-08', end: '2024-09-30' },
  { id: 2, name: 'Procurement', start: '2024-09-30', end: '2024-12-13' },
  { id: 3, name: 'Production', start: '2024-09-08', end: '2025-03-31' },
  { id: 4, name: 'Pré Production (en France) / Before production (in France)', start: '2024-09-08', end: '2024-09-20' },
]

const fmt = (d) => { const dt = new Date(d); return dt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') + ' 00:00:00' }

export default function Activities() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [activities, setActivities] = useState(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', start: '', end: '' })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.3,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [activities.length])

  const openNew = () => { setEditing(null); setForm({ name: '', start: '', end: '' }); setShowModal(true) }
  const openEdit = (a) => { setEditing(a); setForm({ name: a.name, start: a.start, end: a.end }); setShowModal(true) }
  const handleDelete = (id) => { if (confirm(t('activities.confirmDelete'))) { setActivities(prev => prev.filter(a => a.id !== id)); showToast(t('activities.toastDeleted')) } }

  const handleSave = () => {
    if (!form.name || !form.start || !form.end) return
    if (editing) {
      setActivities(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a))
      showToast(t('activities.toastUpdated'))
    } else {
      setActivities(prev => [...prev, { id: Date.now(), ...form }])
      showToast(t('activities.toastCreated'))
    }
    setShowModal(false)
  }

  return (
    <div ref={containerRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => showToast('Filters opened', 'info')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
          {t('common.filters')}
        </button>
        <button className="btn-primary" data-demo-target="btn-new-activity" onClick={openNew}>{t('activities.newActivity')}</button>
      </div>

      <div className="panel" style={{ opacity: 1, transform: 'none' }}>
        <div className="panel-header">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {t('activities.title')}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--status-success)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>
            {activities.length} / {activities.length} {t('activities.results')}
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead><tr><th>{t('activities.tableHeaders.name')}</th><th>{t('activities.tableHeaders.startDate')}</th><th>{t('activities.tableHeaders.endDate')}</th><th>{t('activities.tableHeaders.action')}</th></tr></thead>
            <tbody>
              {activities.map(a => (
                <tr key={a.id} onClick={() => openEdit(a)} style={{ cursor: 'pointer' }}>
                  <td><strong>{a.name}</strong></td>
                  <td>{fmt(a.start)}</td>
                  <td>{fmt(a.end)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" title={t('common.edit')} onClick={() => openEdit(a)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button className="btn-icon" title={t('common.delete')} onClick={() => handleDelete(a.id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.88rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            {t('common.endOfList')}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{editing ? t('activities.modalTitleEdit') : t('activities.modalTitleNew')}</h3>
            <div className="modal-field">
              <label>{t('activities.formName')}</label>
              <input data-demo-target="activity-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t('activities.placeholder')} />
            </div>
            <div className="modal-field">
              <label>{t('activities.formStart')}</label>
              <input type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
            </div>
            <div className="modal-field">
              <label>{t('activities.formEnd')}</label>
              <input type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
              <button className="btn-primary" data-demo-target="activity-save" onClick={handleSave}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
