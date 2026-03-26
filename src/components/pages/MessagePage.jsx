import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const DEMO_MESSAGES = [
  { id: 1, object: 'Rapport HPC', sentBy: 'C. Renaud', recipients: 2, preview: 'TEST', date: '13/01/2026 16:25', replies: 1 },
  { id: 2, object: 'NC-2026-0043 Porosité', sentBy: 'R. Attal', recipients: 3, preview: 'Rework prévu vendredi', date: '18/03/2026 09:14', replies: 2 },
  { id: 3, object: 'Revue hebdo QSE', sentBy: 'S. Dupont', recipients: 5, preview: 'Confirmée lundi 9h', date: '25/03/2026 17:43', replies: 0 },
]

const DEMO_REPLY = { from: 'R. Attal', text: 'Le rework est planifié pour vendredi matin, on devrait pouvoir clôturer dans la foulée.', date: '18/03/2026 10:02' }

const TEAM_MEMBERS = ['R. Attal', 'S. Dupont', 'A. Leroy', 'J. Martin', 'C. Renaud']

export default function MessagePage() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [messages, setMessages] = useState(DEMO_MESSAGES)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [viewMsg, setViewMsg] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState({ object: '', sendTo: '', externalEmails: '', message: '' })

  const filtered = messages.filter(m => {
    if (search) {
      const q = search.toLowerCase()
      if (!m.object.toLowerCase().includes(q) && !m.sentBy.toLowerCase().includes(q)) return false
    }
    if (dateFrom) {
      const [d, mo, y] = m.date.split(' ')[0].split('/')
      const msgDate = new Date(`${y}-${mo}-${d}`)
      if (msgDate < new Date(dateFrom)) return false
    }
    if (dateTo) {
      const [d, mo, y] = m.date.split(' ')[0].split('/')
      const msgDate = new Date(`${y}-${mo}-${d}`)
      if (msgDate > new Date(dateTo)) return false
    }
    return true
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.3,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [filtered.length])

  const resetFilters = () => { setSearch(''); setDateFrom(''); setDateTo(''); setIsFilterOpen(false) }
  const openCreate = () => { setForm({ object: '', sendTo: '', externalEmails: '', message: '' }); setShowCreate(true) }
  const handleSend = () => {
    if (!form.object || !form.message) return
    const newMsg = {
      id: Date.now(),
      object: form.object,
      sentBy: 'Vous',
      recipients: form.sendTo ? 1 : 0,
      preview: form.message.slice(0, 40),
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      replies: 0,
    }
    setMessages(prev => [newMsg, ...prev])
    setShowCreate(false)
    showToast(t('messages.modal.send'), 'success')
  }
  const confirmDelete = (id) => { setMessages(prev => prev.filter(m => m.id !== id)); setDeleteId(null); showToast(t('common.delete'), 'info') }

  return (
    <div ref={containerRef}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
            {t('messages.filters')}
          </button>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {t('messages.newMessage')}
        </button>
      </div>

      {/* Filter bar */}
      {isFilterOpen && (
        <div className="panel" style={{ marginBottom: '16px', opacity: 1, transform: 'none' }}>
          <div className="panel-body" style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap', padding: '12px 16px' }}>
            <div style={{ flex: '1 1 180px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('messages.search')}</label>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('messages.search')} style={{ width: '100%' }} />
            </div>
            <div style={{ flex: '0 1 150px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('messages.dateFrom')}</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div style={{ flex: '0 1 150px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('messages.dateTo')}</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
            <button className="btn-outline" onClick={resetFilters}>{t('messages.resetFilters')}</button>
          </div>
        </div>
      )}

      {/* Table panel */}
      <div className="panel" style={{ opacity: 1, transform: 'none' }}>
        <div className="panel-header">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {t('messages.title')}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--status-success)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>
            {filtered.length} / {messages.length} {t('messages.results')}
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('messages.columns.object')}</th>
                <th>{t('messages.columns.sentBy')}</th>
                <th>{t('messages.columns.recipients')}</th>
                <th>{t('messages.columns.message')}</th>
                <th>{t('messages.columns.date')}</th>
                <th>{t('messages.columns.replies')}</th>
                <th>{t('messages.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} onClick={() => setViewMsg(m)} style={{ cursor: 'pointer' }}>
                  <td><strong>{m.object}</strong></td>
                  <td>{m.sentBy}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '2px 10px', fontSize: '0.82rem' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      {m.recipients} {t('messages.users')}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-tertiary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.preview}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{m.date}</td>
                  <td>
                    {m.replies > 0 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(46,163,242,0.12)', color: 'var(--blue)', fontSize: '0.82rem', fontWeight: 700 }}>{m.replies}</span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" title={t('messages.modal.viewTitle')} onClick={(e) => { e.stopPropagation(); setViewMsg(m) }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="btn-icon" title={t('common.delete')} onClick={(e) => { e.stopPropagation(); setDeleteId(m.id) }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.88rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            {t('messages.endOfList')}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <h3 className="modal-title">{t('messages.delete.confirm')}</h3>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setDeleteId(null)}>{t('messages.delete.no')}</button>
              <button className="btn-primary" style={{ background: 'var(--status-error)' }} onClick={() => confirmDelete(deleteId)}>{t('messages.delete.yes')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <h3 className="modal-title">{t('messages.modal.createTitle')}</h3>
            <div className="modal-field">
              <label>{t('messages.modal.object')}</label>
              <div style={{ position: 'relative' }}>
                <input maxLength={64} value={form.object} onChange={e => setForm({ ...form, object: e.target.value })} placeholder={t('messages.modal.objectPlaceholder')} />
                <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{form.object.length}/64</span>
              </div>
            </div>
            <div className="modal-field">
              <label>{t('messages.modal.sendTo')}</label>
              <select value={form.sendTo} onChange={e => setForm({ ...form, sendTo: e.target.value })}>
                <option value="">—</option>
                {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>{t('messages.modal.externalEmails')}</label>
              <input value={form.externalEmails} onChange={e => setForm({ ...form, externalEmails: e.target.value })} placeholder="email@example.com" />
            </div>
            <div className="modal-field">
              <label>{t('messages.modal.attachments')}</label>
              <div style={{ border: '1px dashed var(--border-secondary)', borderRadius: '6px', padding: '16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => showToast(t('messages.modal.attachments'), 'info')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block', margin: '0 auto 6px' }}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                {t('messages.modal.maxSize')}
              </div>
            </div>
            <div className="modal-field">
              <label>{t('messages.modal.message')}</label>
              <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
              {t('messages.modal.recipientsInfo')}
            </p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowCreate(false)}>{t('messages.modal.cancel')}</button>
              <button className="btn-primary" disabled={!form.object || !form.message} onClick={handleSend}>{t('messages.modal.send')}</button>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewMsg && (
        <div className="modal-overlay" onClick={() => setViewMsg(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <h3 className="modal-title">{t('messages.modal.viewTitle')}</h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('messages.columns.object')}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{viewMsg.object}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('messages.columns.sentBy')}</div>
                <div style={{ color: 'var(--text-primary)' }}>{viewMsg.sentBy}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('messages.columns.date')}</div>
                <div style={{ color: 'var(--text-primary)' }}>{viewMsg.date}</div>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('messages.modal.message')}</div>
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '12px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{viewMsg.preview}</div>
            </div>
            {viewMsg.replies > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>{t('messages.modal.replies')} ({viewMsg.replies})</div>
                <div style={{ borderLeft: '3px solid var(--blue)', paddingLeft: '12px', marginLeft: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{DEMO_REPLY.from}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{DEMO_REPLY.date}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{DEMO_REPLY.text}</div>
                </div>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setViewMsg(null)}>{t('messages.modal.close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
