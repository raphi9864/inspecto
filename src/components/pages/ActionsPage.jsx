import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const INITIAL = [
  { id: 1, title: 'Isoler les 3 pieces non-conformes du lot 42', assignee: 'S. Dupont', deadline: '2026-03-18', priority: 'Critical', status: 'Closed', nc: 'NC-2026-0043' },
  { id: 2, title: 'Recalibrer le poste de soudage S3', assignee: 'A. Leroy', deadline: '2026-03-19', priority: 'Critical', status: 'Closed', nc: 'NC-2026-0043' },
  { id: 3, title: 'Mettre a jour check-list pre-demarrage', assignee: 'J. Martin', deadline: '2026-03-25', priority: 'High', status: 'In Progress', nc: 'NC-2026-0043' },
  { id: 4, title: 'Re-test dimensionnel turbine shaft', assignee: 'A. Leroy', deadline: '2026-03-20', priority: 'Critical', status: 'Overdue', nc: 'NC-2026-0041' },
  { id: 5, title: 'Commander nouveau lot plaques acier', assignee: 'T. Bernard', deadline: '2026-03-22', priority: 'High', status: 'In Progress', nc: 'NC-2026-0040' },
  { id: 6, title: 'Reprendre peinture panneau lateral', assignee: 'S. Dupont', deadline: '2026-03-28', priority: 'Medium', status: 'Open', nc: 'NC-2026-0039' },
  { id: 7, title: 'Remplacer cable isolation panneau 4', assignee: 'J. Martin', deadline: '2026-03-15', priority: 'Critical', status: 'Overdue', nc: 'NC-2026-0038' },
  { id: 8, title: 'Former equipe sur procedure soudage TIG', assignee: 'R. Attal', deadline: '2026-04-01', priority: 'Medium', status: 'Open', nc: 'NC-2026-0043' },
]

const ASSIGNEES = ['R. Attal', 'S. Dupont', 'J. Martin', 'A. Leroy', 'M. Chen', 'T. Bernard']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']
const STATUSES = ['Open', 'In Progress', 'Overdue', 'Closed']
const NCS = ['NC-2026-0043', 'NC-2026-0042', 'NC-2026-0041', 'NC-2026-0040', 'NC-2026-0039', 'NC-2026-0038']

const statusBadge = (s, t) => {
  const map = { 'Open': { bg: 'rgba(26,111,196,0.1)', color: 'var(--blue)' }, 'In Progress': { bg: 'rgba(245,158,11,0.1)', color: 'var(--status-warning)' }, 'Overdue': { bg: 'rgba(239,68,68,0.1)', color: 'var(--status-overdue)' }, 'Closed': { bg: 'rgba(34,197,94,0.1)', color: 'var(--status-success)' } }
  const labels = t ? { 'Open': t('actionsPage.counters.open'), 'In Progress': t('actionsPage.counters.ongoing'), 'Overdue': t('actionsPage.counters.overdue'), 'Closed': t('actionsPage.counters.closed') } : {}
  const st = map[s] || map.Open
  return <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{labels[s] || s}</span>
}
const priorityBadge = (p, t) => {
  const map = { Critical: 'var(--status-overdue)', High: 'var(--status-warning)', Medium: 'var(--blue)', Low: 'var(--text-tertiary)' }
  const labels = t ? { Critical: t('findings.criticality.critical'), Major: t('findings.criticality.major'), Minor: t('findings.criticality.minor') } : {}
  return <span style={{ color: map[p] || 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.88rem' }}>{labels[p] || p}</span>
}

const PlayIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="8 5 19 12 8 19"/></svg>
const GearIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
const WarningIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>

export default function ActionsPage() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [actions, setActions] = useState(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', assignee: ASSIGNEES[0], deadline: '', priority: 'Medium', status: 'Open', nc: NCS[0] })

  const counters = {
    open: actions.filter(a => a.status === 'Open').length,
    inProgress: actions.filter(a => a.status === 'In Progress').length,
    overdue: actions.filter(a => a.status === 'Overdue').length,
    closed: actions.filter(a => a.status === 'Closed').length,
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.counter-card', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out', delay: 0.4 })
    }, containerRef)
    return () => ctx.revert()
  }, [actions.length])

  const openNew = () => { setEditing(null); setForm({ title: '', assignee: ASSIGNEES[0], deadline: '', priority: 'Medium', status: 'Open', nc: NCS[0] }); setShowModal(true) }
  const openEdit = (a) => { setEditing(a); setForm({ title: a.title, assignee: a.assignee, deadline: a.deadline, priority: a.priority, status: a.status, nc: a.nc }); setShowModal(true) }

  const handleSave = () => {
    if (!form.title || !form.deadline) return
    if (editing) {
      setActions(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a))
      showToast(t('actionsPage.toastUpdated'))
    } else {
      setActions(prev => [...prev, { id: Date.now(), ...form }])
      showToast(t('actionsPage.toastCreated'))
    }
    setShowModal(false)
  }

  /* ─── FULL-PAGE FORM VIEW ─── */
  if (showModal) {
    return (
      <div ref={containerRef}>
        <button className="btn-outline ctx-back-btn" onClick={() => setShowModal(false)} style={{ marginBottom: 16 }}>&larr; {t('common.back')}</button>
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-body">
            {/* General Information */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              {t('actionsPage.generalInfo')}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 20 }}>
              <div className="modal-field"><label>{t('common.name')} *</label><input data-demo-target="action-title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="ACTION-1" /></div>
              <div className="modal-field"><label>{t('common.type')} *</label><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>Corrective</option><option>Preventive</option><option>Improvement</option></select></div>
            </div>

            <div className="modal-field" style={{ marginBottom: 20 }}>
              <label>{t('common.description')}</label>
              <div style={{ border: '1px solid var(--border-primary)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ padding: '6px 10px', background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: 8, fontSize: '0.85rem' }}>
                  <select style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}><option>Paragraph</option></select>
                  <button style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>B</button>
                  <button style={{ border: 'none', background: 'none', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  </button>
                </div>
                <textarea style={{ width: '100%', border: 'none', padding: '12px', minHeight: 100, fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} placeholder={t('common.description')} />
              </div>
            </div>

            {/* Dates and Status */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {t('actionsPage.datesStatus')}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: 20 }}>
              <div className="modal-field"><label>{t('actionsPage.assignee')}</label><select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>{ASSIGNEES.map(a => <option key={a}>{a}</option>)}</select></div>
              <div className="modal-field"><label>{t('actionsPage.externalEmails')}</label><input placeholder="email@company.com" /></div>
              <div className="modal-field"><label>{t('common.date')}</label><input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></div>
              <div className="modal-field"><label>{t('common.status')} *</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
            </div>

            {/* Add cost */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {t('actionsPage.addCost')}
              </span>
              <button className="btn-outline" style={{ fontSize: '0.9rem' }} onClick={() => showToast('Cost section opened', 'info')}>+ {t('actionsPage.addCost').toUpperCase()}</button>
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--status-warning)', marginBottom: 20 }}>{t('actionsPage.noCost')}</p>

            {/* Attachments */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                {t('actionsPage.attachments')}
              </span>
              <button className="btn-outline" style={{ fontSize: '0.9rem' }} onClick={() => showToast('Attachment manager opened', 'info')}>{t('actionsPage.attachments').toUpperCase()}</button>
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--status-warning)', marginBottom: 20 }}>{t('actionsPage.noAttachments')}</p>

            {/* Sign + Save */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginBottom: 24, paddingTop: 16, borderTop: '1px solid var(--border-primary)' }}>
              <button className="btn-outline" onClick={() => showToast('Signature requested', 'info')}>{t('common.signed')}</button>
              <button className="btn-primary" style={{ background: 'var(--status-success)' }} onClick={handleSave}>{t('common.save').toUpperCase()}</button>
            </div>

            {/* Effectiveness monitoring */}
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {t('actionsPage.effectiveness')}
            </h4>
            <div className="modal-field" style={{ marginBottom: 16 }}>
              <label>{t('actionsPage.effectiveness')}</label>
              <div style={{ border: '1px solid var(--border-primary)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ padding: '6px 10px', background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: 8, fontSize: '0.85rem' }}>
                  <select style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}><option>Paragraph</option></select>
                  <button style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>B</button>
                  <button style={{ border: 'none', background: 'none', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                </div>
                <textarea style={{ width: '100%', border: 'none', padding: '12px', minHeight: 80, fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="modal-field"><label>{t('actionsPage.assignee')}</label><select>{ASSIGNEES.map(a => <option key={a}>{a}</option>)}</select></div>
              <div className="modal-field"><label>{t('common.date')}</label><input type="date" /></div>
              <div className="modal-field"><label>{t('common.status')}</label><select><option>{t('actionsPage.notStarted')}</option><option>{t('actionsPage.inProgress')}</option><option>{t('actionsPage.completed')}</option></select></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} data-demo-target="actions-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="status-counters">
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('actionsPage.counters.open')}</div><div className="counter-card-count" style={{ color: 'var(--blue)' }}>{counters.open}</div></div><div className="counter-card-circle" style={{ background: 'var(--blue)' }}><PlayIcon /></div></div>
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('actionsPage.counters.ongoing')}</div><div className="counter-card-count" style={{ color: 'var(--status-warning)' }}>{counters.inProgress}</div></div><div className="counter-card-circle" style={{ background: 'var(--status-warning)' }}><GearIcon /></div></div>
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('actionsPage.counters.overdue')}</div><div className="counter-card-count" style={{ color: 'var(--status-error)' }}>{counters.overdue}</div></div><div className="counter-card-circle" style={{ background: 'var(--status-error)' }}><WarningIcon /></div></div>
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('actionsPage.counters.closed')}</div><div className="counter-card-count" style={{ color: 'var(--status-success)' }}>{counters.closed}</div></div><div className="counter-card-circle" style={{ background: 'var(--status-success)' }}><CheckIcon /></div></div>
      </div>

      <div className="table-toolbar">
        <button className="btn-outline">{t('common.filters')}</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button className="btn-outline" onClick={() => showToast('Exported', 'info')}>{t('common.export')}</button>
          <button className="btn-primary" data-demo-target="btn-new-action" onClick={openNew}>{t('actionsPage.newAction')}</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>{t('actionsPage.actionTitle')}</th><th>{t('actionsPage.assignee')}</th><th>{t('actionsPage.deadline')}</th><th>{t('actionsPage.actionType')}</th><th>{t('common.status')}</th><th>{t('actionsPage.linkedNC')}</th></tr></thead>
          <tbody>
            {actions.map(a => (
              <tr key={a.id} onClick={() => openEdit(a)} style={{ cursor: 'pointer' }}>
                <td><strong>{a.title}</strong></td>
                <td>{a.assignee}</td>
                <td>{a.deadline}</td>
                <td>{priorityBadge(a.priority, t)}</td>
                <td>{statusBadge(a.status, t)}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--blue)' }}>{a.nc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
